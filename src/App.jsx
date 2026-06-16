import Nav from './components/Nav'
import Hero from './components/Hero'
import WhatWeSee from './components/WhatWeSee'
import ThreeLenses from './components/ThreeLenses'
import InteractiveMap from './components/InteractiveMap'
import SampleSignal from './components/SampleSignal'
import WhyJapan from './components/WhyJapan'
import Access from './components/Access'
import Footer from './components/Footer'

export default function App() {
  return (
    <div id="top" className="relative min-h-screen">
      <Nav />
      <main>
        <Hero />
        <WhatWeSee />
        <ThreeLenses />
        <InteractiveMap />
        <SampleSignal />
        <WhyJapan />
        <Access />
      </main>
      <Footer />
    </div>
  )
}
