import { message } from './modules/message.js';
import { init_db, initDBFromCDN, create_table, create_table2 } from './modules/database.js';
import { create_density_plot, updatePlot } from './modules/plot.js';
import { tableFromJSON } from 'apache-arrow';
import { decompress_gzip_json } from './modules/io.js';
import 'shiny';

window.db = await initDBFromCDN();
window.db_con = await window.db.connect();

var plot01_updater = await updatePlot("plot_01_container");
var plot02_updater = await updatePlot("plot_02_container");

// Add event listeners to all the widgets in each
// interactive plot.
$(function(){
  // Gather all select inputs for x and y
  // ...
  // Add event listener to each element in array using forEach.
  document.getElementById("plot_01_container").getElementsByTagName("select").forEach((x) => {
    $("#"+x.id).on('change', (e) => { plot01_updater(e.target, window.db_con); });
  })
  document.getElementById("plot_02_container").getElementsByTagName("select").forEach((x) => {
    $("#"+x.id).on('change', (e) => { plot02_updater(e.target, window.db_con); });
  })

});

Shiny.addCustomMessageHandler('send-arrow-data', (msg) => {
  window.payload = msg;
  let data = tableFromJSON(decompress_gzip_json(msg));
  create_table2(window.db_con, data, "payload");
})
