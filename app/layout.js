// app/layout.js
export const metadata = {
  title: "Adma",
  description: "New website rebuild",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="init">{children}</body>
    </html>
  )
}
