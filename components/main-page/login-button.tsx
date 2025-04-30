'use client'

import React from 'react'

const LoginButton: React.FC = () => {
  return (
    <div className="flex absolute top-10 right-10 items-center max-md:right-5 max-md:scale-90 max-sm:top-5 max-sm:right-2/4 max-sm:translate-x-2/4 max-sm:scale-[0.8]">
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/35d1cbbfcd61406590af0c098d4353a7c7ac1172"
        alt=""
        className="relative mr-0 h-[53px] w-[53px] z-[2]"
      />
      <button className="pl-8 text-3xl text-black shadow-sm opacity-50 bg-zinc-300 h-[71px] rounded-[35px] w-[303px]">
        Log In/Sign Up
      </button>
    </div>
  )
}
export default LoginButton
