#' The application User-Interface
#'
#' @param request Internal parameter for `{shiny}`.
#'     DO NOT REMOVE.
#' @import shiny
#' @noRd
app_ui <- function(request) {
  tagList(
    # Leave this function for adding external resources
    golem_add_external_resources(),
    # Your application UI logic
    bslib::page_fluid(
      h1("Operations Dashboard"),
      hr(),
      fluidRow(
        inputPanel(
          selectInput(inputId = "company_filter", label = "Company", choices = letters),
          selectInput(inputId = "segment_filter", label = "Segment", choices = LETTERS),
          dateRangeInput(input = "date-range-filter", label = "Date Range")
        ),
        column(4),
        column(
          4,
          actionButton(inputId = "send-arrow-btn", label = "SEND"),
          actionButton(inputId = "main-filter-btn", label = "Go")
        ),
        column(4)
      ),
      hr(),
      fluidRow(
        column(
          6,
          tags$div(
            id = "plot_01_container",
            class = "plot-container",
            tags$div(
              id = "plot_01",
              class = "plot-slot"
            ),
            inputPanel(
              selectInput(inputId = "x-var-select-01", label = "X-Axis", choices = get_choices()),
              selectInput(inputId = "y-var-select-01", label = "Y-Axis", choices = get_choices()),
            )
          )
        ),
        column(
          6,
          tags$div(
            id = "plot_02_container",
            class = "plot-container",
            tags$div(
              id = "plot_02",
              class = "plot-slot"
            ),
            inputPanel(
              selectInput(inputId = "x-var-select-02", label = "X-Axis", choices = get_choices()),
              selectInput(inputId = "y-var-select-02", label = "Y-Axis", choices = get_choices()),
            )
          )
        )
      )
    )
  )
}

#' Add external Resources to the Application
#'
#' This function is internally used to add external
#' resources inside the Shiny application.
#'
#' @import shiny
#' @importFrom golem add_resource_path activate_js favicon bundle_resources
#' @noRd
golem_add_external_resources <- function() {
  add_resource_path(
    "www",
    app_sys("app/www")
  )

  tags$head(
    favicon(),
    bundle_resources(
      path = app_sys("app/www"),
      app_title = "app02"
    )
    # Add here other external resources
    # for example, you can add shinyalert::useShinyalert()
  )
}
