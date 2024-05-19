export default function InicioPropietarioLayout({
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