#' The application server-side
#'
#' @param input,output,session Internal parameters for {shiny}.
#'     DO NOT REMOVE.
#' @import shiny
#' @noRd
app_server <- function(input, output, session) {
  # Your application server logic
  # dataset <- reactive({
  #   req(input$company_filter, input$segment_filter)
  #   arrow::read_parquet(file = here::here("data", "superstore_2022.parquet")) |>
  #   serialize_json()
  # }) |>
  #   bindCache(input$company_filter, input$segment_filter, cache = "app")
  dataset <- reactive({
    arrow::read_parquet(file = here::here("data", "superstore_2022.parquet")) |>
    serialize_json()
  }) |>
    bindCache(input$company_filter)

  observeEvent(input[["send-arrow-btn"]], {
    # session$sendBinaryMessage(
    #   type = "send-arrow-data",
    #   serialize_arrow(dataset)
    # )
    session$sendCustomMessage(
      type = "send-arrow-data", {
        # begin <- Sys.time()
        dataset()
        # end <- Sys.time()
        # print(end - begin)
      }
      # serialize_json(arrow::read_parquet(file = here::here("data", "superstore_2022.parquet")))
    )
  })

}
