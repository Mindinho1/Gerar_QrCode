import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Gerador de QR Code Estático | Rápido, Gratuito e Sem Expiração',
  description:
    'Gere QR Codes estáticos para URL, Cartão de Contacto (vCard), WhatsApp, Wi-Fi, Telefone, E-mail e Texto. Processado 100% no seu navegador sem servidor e sem limites.',
  keywords: [
    'QR Code',
    'Gerador de QR Code',
    'QR Code Estático',
    'vCard QR Code',
    'WhatsApp QR Code',
    'Wi-Fi QR Code',
    'QR Code Grátis',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
