'use strict';
(() => {
  const byId = id => document.getElementById(id);
  const params = new URLSearchParams(location.search);
  const origin = params.get('origin') || '';
  const nonce = params.get('nonce') || '';
  let reader = null;
  let active = false;
  const message = (text, error = false) => { byId('msg').textContent = text; byId('msg').className = error ? 'error' : ''; };
  function stop() {
    active = false;
    if (reader) { reader.reset(); reader = null; }
    const stream = byId('video').srcObject;
    if (stream) stream.getTracks().forEach(track => track.stop());
    byId('video').srcObject = null;
  }
  async function start() {
    stop(); byId('start').disabled = true; byId('retry').hidden = true; byId('result').textContent = '';
    try {
      if (!window.ZXing) throw new Error('Não foi possível carregar o leitor. Verifique a internet e tente novamente.');
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) throw new Error('A câmera não está disponível neste navegador.');
      const hints = new Map(); hints.set(ZXing.DecodeHintType.POSSIBLE_FORMATS, [ZXing.BarcodeFormat.CODE_128]);
      hints.set(ZXing.DecodeHintType.TRY_HARDER, true);
      reader = new ZXing.BrowserMultiFormatReader(hints, 250); active = true;
      byId('video').hidden = false; message('Aponte para o código de barras da etiqueta.');
      await reader.decodeFromVideoDevice(null, byId('video'), result => {
        if (!active || !result) return;
        const code = String(result.getText() || '').trim();
        if (!ScannerBridge.validCode(code)) return;
        stop(); byId('video').hidden = true; byId('result').textContent = 'Código lido: ' + code;
        if (window.opener && ScannerBridge.validOrigin(origin) && /^[a-f0-9]{32}$/i.test(nonce)) {
          window.opener.postMessage({type:'granado-fleje-code', nonce, code}, origin);
          message('Código enviado. Volte ao inventário para conferir.');
        } else message('Código lido. Abra o leitor pelo aplicativo de inventário para enviá-lo automaticamente.');
        byId('retry').hidden = false;
      });
    } catch (err) {
      stop(); byId('video').hidden = true;
      message(err && err.name === 'NotAllowedError' ? 'Permita o uso da câmera nas configurações do navegador e tente novamente.' : (err.message || 'Não foi possível iniciar a câmera.'), true);
      byId('retry').hidden = false;
    } finally { byId('start').disabled = false; }
  }
  byId('start').onclick = start; byId('retry').onclick = start;
  window.addEventListener('pagehide', stop);
})();
