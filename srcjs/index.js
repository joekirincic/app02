import { message } from './modules/message.js';
import { init_db, create_table } from './modules/database.js';
import { create_density_plot } from './modules/plot.js';
import * as aq from 'arquero';
import * as arrow from 'apache-arrow';
import 'shiny';

// What does this app need? It needs 2-3 interactive charts and a table.

window.db = await init_db();
window.db_con = await window.db.connect();
window.plot_fn = create_density_plot;
window.aq = aq;
window.arrow = arrow;

async function update_plot(){
  let xvar = document.getElementById("x-var-select").value;
  let yvar = document.getElementById("y-var-select").value;
  let data = await window.db_con.query(`SELECT ${xvar}, ${yvar} FROM payload`);
  create_density_plot("plot_01", data, xvar, yvar);
}

$(function(){

  $('#x-var-select').on('change', (e)=>{ console.log(e.target.value); update_plot() });
  $('#y-var-select').on('change', (e)=>{ console.log(e.target.value); update_plot() });

});

// In shiny server use:
// session$sendCustomMessage('show-packer', 'hello packer!')
Shiny.addCustomMessageHandler('show-packer', (msg) => {
  message(msg);
})

Shiny.addCustomMessageHandler('send-arrow-data', (msg) => {
  create_table(window.db_con, msg, "payload");
})
