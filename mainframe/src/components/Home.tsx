import { Nav } from './Nav'
import { Hero } from './Hero'
import { BackgroundVideo } from './BackgroundVideo'
import { About } from './About'
import { Work } from './Work'
import { Notes } from './Notes'
import { Writing } from './Writing'
import { LifeSpread } from './LifeSpread'
import { Contact } from './Contact'
import { Footer } from './Footer'

export function Home({ introDone = true }: { introDone?: boolean }) {
  return (
    <>
      <BackgroundVideo enabled={introDone} />
      <Nav />
      <Hero active={introDone} />
      <main className="relative z-[1] bg-[var(--bg)]">
        <About />
        <Work />
        <Notes />
        <Writing />
        <LifeSpread />
        <Contact />
      </main>
      <div className="relative z-[1] bg-[var(--bg)]">
        <Footer />
      </div>
    </>
  )
}
