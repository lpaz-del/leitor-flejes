(function(root){
 async function decodeFrame({native, fallback}){
  for(const reader of [native,fallback]){
   if(!reader)continue;
   for(const angle of [0,90]){
    try{const value=await reader(angle);if(typeof value==='string'&&value.trim())return value.trim()}catch(e){}
   }
  }
  return '';
 }
 const api={decodeFrame};if(typeof module!=='undefined')module.exports=api;else root.ScanEngine=api;
})(globalThis);
