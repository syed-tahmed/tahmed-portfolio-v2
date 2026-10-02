import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <section className="section container">
      <h1>Page not found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link to="/" className="btn">
        Back to home
      </Link>
    </section>
  )
}

export default NotFound
