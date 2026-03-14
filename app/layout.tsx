import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Issouf Coiffure - Salon de Coiffure à Chicoutimi",
  description: "Réservez votre rendez-vous chez Issouf Coiffure, votre salon de coiffure professionnel à Chicoutimi. Services de coupe, coiffure et soins capillaires.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
