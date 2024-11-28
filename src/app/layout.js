export const metadata = {
  title: 'Notion Monthly Review',
  description: 'Monthly review dashboard for Notion data',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
