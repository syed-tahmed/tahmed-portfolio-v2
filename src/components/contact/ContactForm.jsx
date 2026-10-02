import { useState } from 'react'
import { contactPage, site } from '../../data/site.js'
import './ContactForm.css'

const emptyForm = { name: '', email: '', projectType: '', budget: '', message: '' }

// Checks the fields and returns a message for each problem found
function validate(values) {
  const errors = {}
  if (!values.name.trim()) errors.name = 'Please enter your name.'
  if (!values.email.trim()) {
    errors.email = 'Please enter your email address.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Use the format name@example.com.'
  }
  if (values.message.trim().length < 10) {
    errors.message = 'Tell me a little more, at least 10 characters.'
  }
  return errors
}

function ContactForm() {
  const [values, setValues] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setValues((previous) => ({ ...previous, [name]: value }))
    if (errors[name]) setErrors((previous) => ({ ...previous, [name]: undefined }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length > 0) return

    // There is no backend, so the visitor's mail app opens with the details filled in
    const subject = encodeURIComponent('Project enquiry from ' + values.name)
    const body = encodeURIComponent(
      values.message +
        '\n\nProject type: ' + (values.projectType || 'Not specified') +
        '\nBudget: ' + (values.budget || 'Not specified') +
        '\n\n' + values.name + ' (' + values.email + ')',
    )
    window.location.href = 'mailto:' + site.email + '?subject=' + subject + '&body=' + body

    setSent(true)
    setValues(emptyForm)
  }

  return (
    <form className="cform" onSubmit={handleSubmit} noValidate>
      {sent && (
        <p className="cform__success" role="status">
          Your message is ready. Your email app should open so you can send it.
        </p>
      )}

      <div className="cform__field">
        <label htmlFor="name">Name</label>
        <input id="name" name="name" type="text" placeholder="Jane Smith" autoComplete="name" value={values.name} onChange={handleChange} aria-invalid={Boolean(errors.name)} />
        {errors.name && <span className="cform__error">{errors.name}</span>}
      </div>

      <div className="cform__field">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" placeholder="jane@example.com" autoComplete="email" value={values.email} onChange={handleChange} aria-invalid={Boolean(errors.email)} />
        {errors.email && <span className="cform__error">{errors.email}</span>}
      </div>

      <div className="cform__field">
        <label htmlFor="projectType">Project type</label>
        <select id="projectType" name="projectType" value={values.projectType} onChange={handleChange}>
          <option value="">Choose one</option>
          {contactPage.projectTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div className="cform__field">
        <label htmlFor="budget">Budget range</label>
        <select id="budget" name="budget" value={values.budget} onChange={handleChange}>
          <option value="">Choose one</option>
          {contactPage.budgets.map((budget) => (
            <option key={budget} value={budget}>{budget}</option>
          ))}
        </select>
      </div>

      <div className="cform__field">
        <label htmlFor="message">Message</label>
        <textarea id="message" name="message" rows="5" placeholder="Tell me about your project..." value={values.message} onChange={handleChange} aria-invalid={Boolean(errors.message)} />
        {errors.message && <span className="cform__error">{errors.message}</span>}
      </div>

      <button type="submit" className="cform__submit">Send message</button>
    </form>
  )
}

export default ContactForm
