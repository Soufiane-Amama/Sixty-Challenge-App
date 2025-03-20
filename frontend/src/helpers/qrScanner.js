import { Html5QrcodeScanner } from "html5-qrcode";

export function startQrScanner(elementId, onScanSuccess, onScanError) {
  const scanner = new Html5QrcodeScanner(elementId, {
    fps: 10,
    qrbox: { width: 250, height: 250 },
  });

  scanner.render(onScanSuccess, onScanError);
  return scanner;
}
