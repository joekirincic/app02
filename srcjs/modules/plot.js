
import * as Plot from "@observablehq/plot";

function create_density_plot(element_id, data, x, y){
  let ctx = document.getElementById(element_id);
  let existing_plots = ctx.querySelectorAll("div");
  if(existing_plots.length > 0){
    // Clear any existing plots before drawing.
    existing_plots.forEach((x) => {
      x.remove()
    })
  };
  var plt = Plot.plot({
    color: {
      scheme: "ylgnbu"
    },
    marks: [
      Plot.hexagon(
        data,
        Plot.hexbin(
          { fill: "count" },
          { x: x, y: y }
        )
      )
    ]
  });
  var plot_el = document.createElement("div");
  plot_el.appendChild(plt);
  ctx.appendChild(plot_el);
};

const create_barchart = (el, data, x, y) => {
  let ctx = document.getElementById(el.id);
  let existing_plots = ctx.querySelectorAll("div");
  if(existing_plots.length > 0){
    // Clear any existing plots before drawing.
    existing_plots.forEach((x) => {
      x.remove()
    })
  };
};

// update_plot seems like a good candidate for a closure.
// We want to have a function that remembers `xvar` and `yvar`,
// and only updates one of them depending on whichever is
// changed.

async function updatePlot(id){
  let theElement = document.getElementById(id);
  let thePlot = theElement.querySelector('.plot-slot');
  let xvar = null;
  let yvar = null;
  async function update(el, con){
    // Figure out whether the element is an x-var or y-var selector.
    if(el.id.includes("x-var")){
      xvar = el.value;
    }
    if(el.id.includes("y-var")){
      yvar = el.value;
    }
    // Carry out the rest of the plot update logic.
    let data = await con.query(`SELECT ${xvar}, ${yvar} FROM payload`);
    create_density_plot(thePlot.id, data, xvar, yvar);
  }
  return update;
};

export { create_density_plot, updatePlot };
