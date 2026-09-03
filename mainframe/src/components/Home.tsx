import { Hero } from './Hero'
import { About } from './About'
import { Work } from './Work'
import { Writing } from './Writing'
import { LifeSpread } from './LifeSpread'
import { Contact } from './Contact'
import { Footer } from './Footer'

export function Home() {
  return (
    <>
      <Hero />
      <main>
        <About />
        <Work />
        <Writing />
        <LifeSpread />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
