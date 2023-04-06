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
    fluidPage(
      h1("app02"),
      hr(),
      actionButton(inputId = "send-arrow-btn", label = "SEND"),
      hr(),
      tags$div(
        actionButton(inputId = "main-filter-btn", label = "FILTER")
      ),
      hr(),
      tags$div(
        tags$div(
          id = "plot_01"
        ),
        tags$div(
          selectInput(inputId = "x-var-select", label = "X-Axis", choices = get_choices()),
          selectInput(inputId = "y-var-select", label = "Y-Axis", choices = get_choices()),
        )
      ),
      tags$div(
        id = "plot_02"
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
