
serialize_arrow <- function(data){
  sink <- arrow::BufferOutputStream$create()
  arrow::write_ipc_stream(data, sink)
  out <- sink$finish()$data()
  return(out)
}
