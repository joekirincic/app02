#' The application server-side
#'
#' @param input,output,session Internal parameters for {shiny}.
#'     DO NOT REMOVE.
#' @import shiny
#' @noRd
app_server <- function(input, output, session) {
  # Your application server logic
  dataset <- arrow::read_csv_arrow(file = here::here("data", "superstore_2023.csv"))
  session$sendBinaryMessage(
    type = "send-arrow-data",
    serialize_arrow(dataset)
  )
}
