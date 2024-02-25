export default function LoginLayout({
    children, // will be a page or nested layout
  }: {
    children: React.ReactNode
  }) {
    return (
      <section className="h-full bg-gray-50">
        {children}
      </section>
    )
  }