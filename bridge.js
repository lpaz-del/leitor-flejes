(function (root) {
  function validOrigin(origin) {
    try { const u = new URL(origin); return u.origin === origin && u.protocol === 'https:' && (u.hostname === 'script.google.com' || u.hostname.endsWith('.googleusercontent.com')); } catch (_) { return false; }
  }
  function validCode(code) { return typeof code === 'string' && !!code.trim() && code.length <= 200; }
  const api = {validOrigin, validCode};
  if (typeof module !== 'undefined') module.exports = api;
  else root.ScannerBridge = api;
})(globalThis);
