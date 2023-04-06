#' The application server-side
#'
#' @param input,output,session Internal parameters for {shiny}.
#'     DO NOT REMOVE.
#' @import shiny
#' @noRd
app_server <- function(input, output, session) {
  # Your application server logic
  dataset <- ggplot2::diamonds
  observeEvent(input[["send-arrow-btn"]] , {
    session$sendBinaryMessage(
      type = "send-arrow-data",
      serialize_arrow(dataset)
    )
  })

}
