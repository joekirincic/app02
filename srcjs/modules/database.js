import * as duckdb from '@duckdb/duckdb-wasm';

// This is the function used when we're not loading from a CDN.
// Remember that this generates two giant WASM files that Shiny is
// responsible for serving each time someone connects.
async function init_db(){
  const MANUAL_BUNDLES = {
      mvp: {
          mainModule: duckdb_wasm,
          mainWorker: new URL('@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js', import.meta.url).toString(),
      },
      eh: {
          mainModule: duckdb_wasm_next,
          mainWorker: new URL('@duckdb/duckdb-wasm/dist/duckdb-browser-eh.worker.js', import.meta.url).toString(),
      },
  };
  // Select a bundle based on browser checks
  const bundle = await duckdb.selectBundle(MANUAL_BUNDLES);
  // Instantiate the asynchronus version of DuckDB-wasm
  const worker = new Worker(bundle.mainWorker);
  const logger = new duckdb.ConsoleLogger();
  const db = new duckdb.AsyncDuckDB(logger, worker);
  await db.instantiate(bundle.mainModule, bundle.pthreadWorker);
  return await db;
};

async function initDBFromCDN(){
  const JSDELIVR_BUNDLES = duckdb.getJsDelivrBundles();
  const bundle = await duckdb.selectBundle(JSDELIVR_BUNDLES);
  const worker_url = URL.createObjectURL(
    new Blob([`importScripts("${bundle.mainWorker}");`], {type: 'text/javascript'})
  );
  // Instantiate the asynchronus version of DuckDB-WASM
  const worker = new Worker(worker_url);
  const logger = new duckdb.ConsoleLogger();
  const db = new duckdb.AsyncDuckDB(logger, worker);
  await db.instantiate(bundle.mainModule, bundle.pthreadWorker);
  URL.revokeObjectURL(worker_url);
  return await db;
};

async function create_table(con, data, name){
  let data_ = new Uint8Array(data);
  try {
    await con.insertArrowFromIPCStream(data_, {name: name});
  } catch (e) {
    console.log(e);
  }
};

async function create_table2(con, data, name){
  try {
    await con.insertArrowTable(data, {name: name});
  } catch (e) {
    console.log(e);
  }
};

async function delete_table(con, name){
  let qry = `DROP TABLE IF EXISTS ${name};`
  try {
    await con.query(qry);
  } catch (e) {
    console.log(e);
  }
};

export { init_db, initDBFromCDN, create_table, create_table2 };


