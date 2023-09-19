
import * as pako from 'pako';

function decompress_gzip_json(x){
  const gzipData = window.atob(x);
  const gzipArray = new Uint8Array(gzipData.length);
  for (let i = 0; i < gzipData.length; i++) {
    gzipArray[i] = gzipData.charCodeAt(i);
  }
  const jsonBuffer = pako.inflate(gzipArray);
  const jsonString = new TextDecoder().decode(jsonBuffer);
  return JSON.parse(jsonString);
};

function decompress_gzip_arrow(x){
  const gzipData = window.atob(x);
  const gzipArray = new Uint8Array(gzipData.length);
  for (let i = 0; i < gzipData.length; i++) {
    gzipArray[i] = gzipData.charCodeAt(i);
  }
  const arrowBuffer = pako.inflateRaw(gzipArray);
  return arrowBuffer;
};

export {
  decompress_gzip_json,
  decompress_gzip_arrow
};
