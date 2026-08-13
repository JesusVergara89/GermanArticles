import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => {
    setMenuOpen(false)
  }

  return (
    <>
      <header className="navbar">
        <button
          className="menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menú"
          aria-expanded={menuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <Link to="/" className="navbar-title" onClick={closeMenu}>
          German training
        </Link>
      </header>

      <div
        className={`menu-overlay ${menuOpen ? 'active' : ''}`}
        onClick={closeMenu}
      />

      <nav className={`side-menu ${menuOpen ? 'open' : ''}`}>
        <div className="menu-header">
          <h2>GermanArticles</h2>

          <button
            className="close-button"
            onClick={closeMenu}
            aria-label="Cerrar menú"
          >
            
          </button>
        </div>

        <div className="menu-content">
          <Link to="/" onClick={closeMenu}>
            Artikel training
          </Link>

            <Link
              to="/articulos-definidos"
              onClick={closeMenu}
            >
              Artículos definidos
            </Link>

            <Link
              to="/articulos-indefinidos"
              onClick={closeMenu}
            >
              Artículos indefinidos
            </Link>

            <Link
              to="/articulos-definidos"
              onClick={closeMenu}
            >
              Artículos definidos
            </Link>

            <Link
              to="/articulos-indefinidos"
              onClick={closeMenu}
            >
              Artículos indefinidos
            </Link>
        </div>
      </nav>
    </>
  )
}

export default Navbar