import React from 'react'
import stockManage from '../public/stock-manage.jpeg'
import Image from 'next/image'
const Navbar = () => {
  return (
    <header className="text-gray-600 body-font">
  <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
    <a className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
      <Image src={stockManage} height={80} className=' rounded-full' alt='A-stock-bg'/>
        
     
      <span className="text-white ml-3 text-xl">Stock Mangement System</span>
    </a>
    
    
  </div>
</header>
  )
}

export default Navbar