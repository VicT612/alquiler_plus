export default function InicioUsuarioLayout({
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