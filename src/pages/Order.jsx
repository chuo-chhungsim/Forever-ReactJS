//Order.jsx
import { useContext } from "react"
import { ShopContext } from "../context/ShopContext"
import Title from './../components/Title';

const Order = () => {
  const {products, currency,} = useContext(ShopContext);
  return (
    <>
      <div className="border-t pt-16">
        <div className="text-2xl">
          <Title text1={'my'} text2={'Orders'} />
        </div>
        <div className="">
          {
            products.slice(1,4).map((item,index)=>(
              <div key={index} className="py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-start gap-4 text-sm">
                  <img className="w-16 sm:w-20" src={item.image[0]} alt="" />
                  <div className="">
                    <p className="text-base font-medium">{item.name}</p>
                    <div className="flex items-center gap-3 mt-2 text-base text-gray-700">
                      <p>{currency}{item.price}</p>
                      <p>Quantity: {}</p>
                      <p>Size: M</p>
                    </div>
                    <p className="mt-2">Order Date: <span className="text-base text-gray-700">21,Jul,2024</span></p>
                  </div>
                </div>
                <div className="md:w-1/2 flex justify-between">
                  <div className="flex items-center gap-3">
                    <p className="min-w-2 h-2 rounded-full bg-green-500"></p>
                    <p className="text-sm sm:text-base">ready to ship</p>
                  </div>
                  <button className="border px-4 py-2 bg-white text-black rounded">Track Order</button>
                </div>
              </div>
            ))
          }
        </div>      
      </div>
    </>
  )
}

export default Order