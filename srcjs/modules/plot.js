
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

export { create_density_plot };
