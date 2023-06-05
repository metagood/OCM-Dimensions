function fflateCallback2() {
  const dimCode = fflate.strFromU8(fflate.gunzipSync(new Uint8Array(Array.from(atob(d3)).map((char) => char.charCodeAt(0)))));
  const threeJsCode = dimCode.split('\n')[5];

  const ocmCallbackScript = "ocmCallback();";

  const newScript = document.createElement('script');
  newScript.innerHTML = [threeJsCode, ocmCallbackScript].join(";\n");
  document.body.appendChild(newScript);
}