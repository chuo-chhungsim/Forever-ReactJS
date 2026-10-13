//Order.jsx
import { useContext, useState } from "react"
import { toast } from "react-toastify"
import { ShopContext } from "../context/ShopContext"
import { api } from "../api/client"
import Title from './../components/Title';
import useApi from "../components/useApi";

const STATUS = {
  ORDER_PLACED: ['Order placed', 'bg-orange-400'],
  PACKING: ['Packing', 'bg-orange-400'],
  SHIPPED: ['Shipped', 'bg-blue-500'],
  OUT_FOR_DELIVERY: ['Out for delivery', 'bg-blue-500'],
  DELIVERED: ['Delivered', 'bg-green-500'],
  CANCELLED: ['Cancelled', 'bg-red-500'],
};

const Order = () => {
  const { currency } = useContext(ShopContext);
  const [version, setVersion] = useState(0);
  const { data, loading, error } = useApi(() => api.orders({ size: 50 }), [version]);
  const reload = () => setVersion((v) => v + 1);

  const cancel = async (id) => {
    if (!window.confirm(`Cancel order #${id}?`)) return;
    try {
      await api.cancelOrder(id);
      toast.success('Order cancelled');
      reload();
    } catch (e) {
      toast.error(e.message);
    }
  };

  const orders = data?.content || [];

  return (
    <div className="border-t pt-16">
      <div className="text-2xl">
        <Title text1={'my'} text2={'Orders'} />
      </div>
      {loading && <p className="py-10 text-gray-400">Loading...</p>}
      {error && <p className="py-10 text-red-500">{error.message}</p>}
      {!loading && !error && orders.length === 0 && <p className="py-10 text-gray-500">You have no orders yet.</p>}
      {orders.map((order) => {
        const [label, dot] = STATUS[order.status] || [order.status, 'bg-gray-400'];
        const cancellable = order.status === 'ORDER_PLACED' || order.status === 'PACKING';
        return (
          <div key={order.id} className="mt-6 border text-gray-700">
            <div className="flex justify-between px-4 py-3 bg-gray-50 text-sm">
              <p className="font-medium">Order #{order.id}</p>
              <p>{new Date(order.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</p>
            </div>
            {order.items.map((item, i) => (
              <div key={i} className="py-4 px-4 border-t flex items-start gap-4 text-sm">
                <img className="w-16 sm:w-20" src={item.image} alt="" />
                <div>
                  <p className="text-base font-medium">{item.name}</p>
                  <div className="flex items-center gap-3 mt-2 text-base text-gray-700">
                    <p>{currency}{item.price}</p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Size: {item.size}</p>
                  </div>
                </div>
              </div>
            ))}
            <div className="border-t px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="flex items-center gap-3">
                <p className={`min-w-2 h-2 rounded-full ${dot}`}></p>
                <p className="text-sm sm:text-base">{label}</p>
                <p className="text-sm text-gray-500">· {order.paymentMethod}{order.paid ? ' (paid)' : ''} · Total {currency}{Number(order.total).toFixed(2)}</p>
              </div>
              <div className="flex gap-3">
                {cancellable && <button onClick={() => cancel(order.id)} className="border px-4 py-2 text-red-600 rounded">Cancel</button>}
                <button onClick={reload} className="border px-4 py-2 bg-white text-black rounded">Track Order</button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  )
}

export default Order
