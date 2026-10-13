//PlaceOrder.jsx
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { assets } from "../assets/frontend_assets/assets";
import CartTotal from "../components/CartTotal";
import Title from "../components/Title";
import { ShopContext } from "../context/ShopContext";
import { api } from "../api/client";

const inputClass = "border border-gray-300 rounded py-1.5 px-3.5 w-full";

const PlaceOrder = () => {
  const { navigate, user, cart, loadCart } = useContext(ShopContext);
  const [method, setMethod] = useState("cod");
  const [busy, setBusy] = useState(false);
  const [first, ...rest] = (user?.name || '').split(' ');
  const [form, setForm] = useState({
    firstName: first || '', lastName: rest.join(' '), email: user?.email || '', street: '',
    city: '', state: '', zipcode: '', country: '', phone: user?.phone || '',
  });

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (event) => {
    event.preventDefault();
    if (cart.items.length === 0) return toast.error('Your cart is empty');
    setBusy(true);
    try {
      await api.placeOrder({ address: form, paymentMethod: method.toUpperCase() });
      await loadCart();
      toast.success('Order placed successfully');
      navigate('/order');
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy(false);
    }
  };

  const field = (name, placeholder, type = 'text') => (
    <input name={name} value={form[name]} onChange={onChange} className={inputClass} type={type} placeholder={placeholder} required />
  );

  return (
    <form onSubmit={onSubmit} className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t">
      {/* Left Side */}
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1={"Delivery"} text2={"INFORMATION"}/>
        </div>
        <div className="flex gap-3">
          {field('firstName', 'First name')}
          {field('lastName', 'Last name')}
        </div>
        {field('email', 'Email address', 'email')}
        {field('street', 'Street')}
        <div className="flex gap-3">
          {field('city', 'City')}
          {field('state', 'State')}
        </div>
        <div className="flex gap-3">
          {field('zipcode', 'Zipcode')}
          {field('country', 'Country')}
        </div>
        {field('phone', 'Phone number', 'tel')}
      </div>
      {/* Right Side */}
      <div className="mt-8">
        <div className="mt-8 min-w-80">
          <CartTotal />
        </div>
        <div className="mt-12">
          <Title text1={"payment"} text2={'method'}/>
          <div className="flex gap-3 flex-wrap">
            <div title="Coming soon" className="flex items-center gap-3 border p-2 px-3 opacity-40 cursor-not-allowed">
              <p className="min-w-3.5 h-3.5 border rounded-full"></p>
              <img className="h-5 mx-4" src={assets.stripe_logo} alt="" />
            </div>
            <div title="Coming soon" className="flex items-center gap-3 border p-2 px-3 opacity-40 cursor-not-allowed">
              <p className="min-w-3.5 h-3.5 border rounded-full"></p>
              <img className="h-5 mx-4" src={assets.razorpay_logo} alt="" />
            </div>
            <div onClick={()=>setMethod('cod')} className="flex items-center gap-3 border p-2 px-3 cursor-pointer">
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-500' : ''}`}></p>
              <p className="uppercase text-gray-600 text-sm font-medium mx-4">Cash on Delivery</p>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">Card payments are coming soon.</p>
          <div className="w-full text-end mt-8 ">
            <button type="submit" disabled={busy || cart.items.length === 0} className="uppercase text-sm bg-black text-white px-16 py-5 rounded disabled:bg-gray-400">
              {busy ? 'Placing...' : 'place order'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
