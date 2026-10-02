import { contactPage, site, socials } from '../../data/site.js'
import BrandIcon from '../ui/BrandIcon.jsx'
import WireTerrain from '../ui/WireTerrain.jsx'
import './ContactCard.css'

const rows = [
  {
    label: 'Email',
    value: site.email,
    path: 'M3 7.5 12 13l9-5.5M4.5 5.5h15A1.5 1.5 0 0 1 21 7v10a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17V7a1.5 1.5 0 0 1 1.5-1.5Z',
  },
  {
    label: 'Location',
    value: site.location + ' / Remote',
    path: 'M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11Zm0-8.2a2.8 2.8 0 1 1 0-5.6 2.8 2.8 0 0 1 0 5.6Z',
  },
  {
    label: 'Response time',
    value: contactPage.card.responseTime,
    path: 'M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18Zm0-14v5.2l3.4 2',
  },
]

// Only the links that have a brand icon are shown here
const brandLinks = [
  { name: 'github', label: 'GitHub' },
  { name: 'linkedin', label: 'LinkedIn' },
]

function ContactCard() {
  const findUrl = (label) => socials.find((s) => s.label === label)?.url || '#'

  return (
    <aside className="ccard">
      <WireTerrain />

      <div className="ccard__content">
        <div className="ccard__socials">
          {brandLinks.map((brand) => (
            <a key={brand.name} href={findUrl(brand.label)} target="_blank" rel="noreferrer" aria-label={brand.label}>
              <BrandIcon name={brand.name} />
            </a>
          ))}
        </div>

        <h2 className="ccard__status">{contactPage.card.status}</h2>
        <p className="ccard__note">{contactPage.card.note}</p>

        <dl className="ccard__rows">
          {rows.map((row) => (
            <div className="ccard__row" key={row.label}>
              <span className="ccard__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="18" height="18">
                  <path d={row.path} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <div>
                <dt>{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            </div>
          ))}
        </dl>
      </div>
    </aside>
  )
}

export default ContactCard
