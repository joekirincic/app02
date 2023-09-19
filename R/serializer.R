
serialize_arrow <- function(data){
  sink <- arrow::BufferOutputStream$create()
  arrow::write_ipc_stream(data, sink)
  out <- sink$finish()$data() |> memCompress(from = _, type = "gzip")
  return(out)
}

serialize_json <- function(data){
  memCompress(
    jsonlite::toJSON(data),
    type = "gzip"
  )
}
