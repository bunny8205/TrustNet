// src/components/QRCodeModal.tsx
import QRCode from "react-qr-code";
import { Dialog } from "@mui/material";

export function showQRCodeModal(uri: string) {
  return (
    <Dialog open={true}>
      <QRCode value={uri} />
    </Dialog>
  );
}