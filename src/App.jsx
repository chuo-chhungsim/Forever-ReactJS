import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Collection from "./pages/Collection"
import About from './pages/About';
import Contact from './pages/Contact';
import Product from './pages/Product';
import Cart from "./pages/Cart";
import Login from './pages/Login';
import PlaceOrder from './pages/PlaceOrder';
import Order from './pages/Order';
import Navbar from './components/navbar';
import Footer from "./components/Footer";
import SearchBar from './components/SearchBar';
import RequireAuth from './components/RequireAuth';
import AdminApp from './admin/AdminApp';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Storefront = () => (
  <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
    <Navbar/>
    <SearchBar/>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/collection" element={<Collection/>} />
      <Route path="/about" element={<About/>} />
      <Route path="/contact" element={<Contact/>} />
      <Route path="/product/:productId" element={<Product/>} />
      <Route path="/cart" element={<RequireAuth><Cart/></RequireAuth>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/place-order" element={<RequireAuth><PlaceOrder/></RequireAuth>}/>
      <Route path="/order" element={<RequireAuth><Order/></RequireAuth>}/>
    </Routes>
    <Footer/>
  </div>
)

// The admin panel has its own layout (sidebar), so it is routed beside the storefront, not inside it.
const App = () => (
  <>
    <ToastContainer />
    <Routes>
      <Route path="/admin/*" element={<AdminApp/>} />
      <Route path="/*" element={<Storefront/>} />
    </Routes>
  </>
)

export default App
