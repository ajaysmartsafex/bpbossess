import React from 'react'
import { Container, Logo, LogoutBtn } from '../index'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function Header() {
  const authStatus = useSelector((state) => state.auth.status)
  const navigate = useNavigate()

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
        <nav className='flex'>
          <div className='mr-4'>
            <Link to='/'>
              <Logo width='70px' />
            </Link>
          </div>
          <ul className='flex ml-auto'>
            {navItems.map((item) =>
              item.active ? (
                <li key={item.name}>
                  <button
                    onClick={() => navigate(item.slug)}
                    className='inline-bock px-6 py-2 duration-200 hover:bg-blue-100 rounded-full'
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