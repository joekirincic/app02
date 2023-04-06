import * as duckdb from '@duckdb/duckdb-wasm';
import duckdb_wasm from '@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm';
import duckdb_wasm_next from '@duckdb/duckdb-wasm/dist/duckdb-eh.wasm';

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

async function create_table(con, data, name){
  let data_ = new Uint8Array(data);
  try {
    await con.insertArrowFromIPCStream(data_, {name: name});
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

export { init_db, create_table };


