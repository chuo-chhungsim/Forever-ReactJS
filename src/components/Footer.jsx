import { assets } from "../assets/frontend_assets/assets"

const Footer = () => {
  return (
   <>
   <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
      <div>
         <img src={assets.logo} className="mb-5 w-32" alt="" />
         <p className="text-gray-400 w-full md:w-2/3 "> Proudly crafted with excellence and dedication to quality, delivering exceptional products and services you can trust.</p>
      </div>
      <div>
         <p className="text-xl font-medium mb-5 uppercase">Company</p>
         <ul className="flex flex-col gap-1 text-gray-600">
            <li>Home</li>
            <li>About US</li>
            <li>Delivery</li>
            <li>Privacy</li>
         </ul>
      </div>
      <div>
         <p className="text-xl font-medium mb-5 uppercase">Get In Touch</p>
         <ul className="flex flex-col gap-1 text-gray-600">
            <li>015 552 284</li>
            <li>chhungsim.chuo@gmail.com</li>
         </ul>
      </div>
    </div>
    <div>
      <hr />
      <p className="text-gray-400 text-center mt-5">
      &copy; {new Date().getFullYear()} Forever. All rights reserved.
      </p>
    </div>
   </>
    
  )
}

export default Footer