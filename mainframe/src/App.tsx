import { useState } from 'react'
import { IntroSequence } from './components/IntroSequence'
import { Home } from './components/Home'

function App() {
  const [introDone, setIntroDone] = useState(false)

  return (
    <>
      <div className="noise" aria-hidden="true"></div>
      {/* Home is always mounted underneath — the intro overlay just has a
          growing hole cut into it (see .intro-stage / useScrollMaskReveal),
          so there's a live page right there instead of a loading transition. */}
      <Home introDone={introDone} />
      {!introDone && <IntroSequence onComplete={() => setIntroDone(true)} />}
    </>
  )
}

export default App
