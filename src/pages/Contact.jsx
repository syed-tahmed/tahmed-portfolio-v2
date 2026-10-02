import { Link } from 'react-router-dom'
import { contactPage } from '../data/site.js'
import BannerAura from '../components/ui/BannerAura.jsx'
import ContactForm from '../components/contact/ContactForm.jsx'
import ContactCard from '../components/contact/ContactCard.jsx'
import './Contact.css'

function Contact() {
  return (
    <>
      <section className="page-banner">
        <div className="container page-banner__inner">
          <BannerAura />
          <div className="page-banner__content">
          <Link className="page-banner__back" to="/">
            <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
              <path d="M12 8H4m0 0 3.5-3.5M4 8l3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {contactPage.backLabel}
          </Link>
          <h1>{contactPage.pageTitle}</h1>
          </div>
        </div>
      </section>

      <section className="contact section">
        <div className="container">
          <header className="contact__head">
            <h2>{contactPage.heading}</h2>
            <p>{contactPage.subheading}</p>
          </header>

          <div className="contact__panel">
            <ContactForm />
            <ContactCard />
          </div>
        </div>
      </section>

    </>
  )
}

export default Contact
