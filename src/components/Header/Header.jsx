import React, { useState } from 'react'
import { Container, Logo, LogoutBtn } from '../index'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'

function Header() {
  const authStatus = useSelector((state) => state.auth.status)
  const navigate = useNavigate()
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeItem, setActiveItem] = useState(location.pathname);

  const navItems = [
    {
      name: 'Home',
      slug: "/",
      active: true
    },
    {
      name: "Login",
      slug: "/login",
      active: !authStatus,
    },
    {
      name: "Signup",
      slug: "/signup",
      active: !authStatus,
    },
    {
      name: "All Games",
      slug: "/all-games",
      active: authStatus,
    },
    {
      name: "Add Game",
      slug: "/add-game",
      active: authStatus,
    },
    {
      name: "Edit Result",
      slug: "/edit-result",
      active: authStatus,
    },
    {
      name: "Add Result",
      slug: "/add-result",
      active: authStatus,
    },
  ]


  return (
    <header className='py-3 shadow bg-red-600 px-3'>
      <Container>
        <nav className='flex items-center justify-between'>
          <div className='mr-4'>
            <Link to='/'>
              <Logo width='70px' />
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className='block md:hidden'>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className='text-white focus:outline-none'>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>

          {/* Navigation Links */}
          <ul className={`flex ml-auto space-x-6 md:space-x-8 ${isMobileMenuOpen ? 'flex-col absolute bg-red-600 p-4 top-20 right-0 w-full md:w-auto md:flex-row md:top-auto md:right-auto' : 'hidden md:flex'}`}>
            {navItems.map((item) =>
              item.active ? (
                <li key={item.name}>
                  <button
                    onClick={() => {
                      setActiveItem(item.slug);
                      navigate(item.slug)
                    }}
                    className={`inline-block px-6 py-2 duration-200 hover:bg-blue-100 rounded-full ${activeItem === item.slug ? 'bg-white' : ''}`}
                  >{item.name}</button>
                </li>
              ) : null
            )}
            {authStatus && (
              <li>
                <LogoutBtn />
              </li>
            )}
          </ul>
        </nav>
      </Container>
    </header>
  )
}

export default Header