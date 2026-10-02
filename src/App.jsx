import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import Navbar from './components/layout/Navbar.jsx'
import Footer from './components/layout/Footer.jsx'
import ScrollToTop from './components/layout/ScrollToTop.jsx'
import Cursor from './components/layout/Cursor.jsx'
import PageTransition from './components/layout/PageTransition.jsx'
import { useSmoothScroll } from './hooks/useSmoothScroll.js'
import { useSectionReveal } from './hooks/useSectionReveal.js'

const Home = lazy(() => import('./pages/Home.jsx'))
const About = lazy(() => import('./pages/About.jsx'))
const Contact = lazy(() => import('./pages/Contact.jsx'))
const NotFound = lazy(() => import('./pages/NotFound.jsx'))

function App() {
  useSmoothScroll()
  useSectionReveal()

  return (
    <>
      <ScrollToTop />
      <Cursor />
      <Navbar />

      <main>
        <PageTransition>
          <Suspense fallback={null}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </PageTransition>
      </main>

      <Footer />
    </>
  )
}

export default App
