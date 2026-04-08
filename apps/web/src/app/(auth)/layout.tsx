export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        {/* Logo / brand */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-primary">Resitly</h1>
          <p className="text-xs text-muted-foreground mt-1">
            AI Invoice &amp; Receipt Processor
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          {children}
        </div>
      </div>
    </div>
  );
}
