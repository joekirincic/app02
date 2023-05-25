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

// update_plot seems like a good candidate for a closure.
// We want to have a function that remembers `xvar` and `yvar`,
// and only updates one of them depending on whichever is
// changed.

async function updatePlot(id){
  let theElement = document.getElementById(id);
  let thePlot = theElement.querySelector('.plot-slot');
  let xvar = null;
  let yvar = null;
  async function update(el){
    // Figure out whether the element is an x-var or y-var selector.
    if(el.id.includes("x-var")){
      xvar = el.value;
    }
    if(el.id.includes("y-var")){
      yvar = el.value;
    }
    // Carry out the rest of the plot update logic.
    let data = await window.db_con.query(`SELECT ${xvar}, ${yvar} FROM payload`);
    create_density_plot(thePlot.id, data, xvar, yvar);
  }
  return update;
};

// In index.js, we'd use updatePlot like so.
// 1. Create closure for each plot.
var plot01_updater = await updatePlot("plot_01_container");
var plot02_updater = await updatePlot("plot_02_container");
var plot03_updater = await updatePlot("plot_03_container");
var plot04_updater = await updatePlot("plot_04_container");

window.thing = plot01_updater;

// 2. Add event listeners to all the widgets in each
// interactive plot.
$(function(){
  // Gather all select inputs for x and y
  // ...
  // Add event listener to each element in array using forEach.
  document.getElementById("plot_01_container").getElementsByTagName("select").forEach((x) => {
    $("#"+x.id).on('change', (e) => { plot01_updater(e.target); });
  })
  document.getElementById("plot_02_container").getElementsByTagName("select").forEach((x) => {
    $("#"+x.id).on('change', (e) => { plot02_updater(e.target); });
  })
  document.getElementById("plot_03_container").getElementsByTagName("select").forEach((x) => {
    $("#"+x.id).on('change', (e) => { plot03_updater(e.target); });
  })
  document.getElementById("plot_04_container").getElementsByTagName("select").forEach((x) => {
    $("#"+x.id).on('change', (e) => { plot04_updater(e.target); });
  })
});

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
