'use client'

import React from 'react'
import MenuItems from './menu-items'
import LoginButton from './login-button'

const MainMenu: React.FC = () => {
  return (
    <main className="relative w-full h-screen bg-white">
      <MenuItems />
      <LoginButton />
    </main>
  )
}

export default MainMenu
