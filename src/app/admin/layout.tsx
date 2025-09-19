export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // No sidebar, no gating here; keeps the sign-in page clean.
  return <>{children}</>;
}
