export default function AdondeLayout({
    children, 
  }: {
    children: React.ReactNode
  }) {
    return (
      <section>

        <nav></nav>
   
        {children}
      </section>
    )
  }