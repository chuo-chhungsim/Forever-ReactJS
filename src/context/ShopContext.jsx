//ShopContext
import { createContext, useCallback, useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { api, session } from "../api/client";

export const ShopContext = createContext();

const EMPTY_CART = { items: [], itemCount: 0, subtotal: 0, deliveryFee: 0, total: 0 };

const ShopContextProvider = (props) => {
   const currency = '$';
   const navigate = useNavigate();
   const [search, setSearch] = useState('');
   const [showSearch, setShowSearch] = useState(false);
   const [user, setUser] = useState(null);
   const [authReady, setAuthReady] = useState(!session.hasSession());
   const [cart, setCart] = useState(EMPTY_CART);

   const loadCart = useCallback(async () => {
      try {
         setCart(await api.cart());
      } catch (e) {
         toast.error(e.message);
      }
   }, []);

   // Restore a saved session on page load.
   useEffect(() => {
      session.onExpired(() => {
         setUser(null);
         setCart(EMPTY_CART);
         toast.info('Your session expired, please log in again');
      });
      session.onAdminForbidden(async () => {
         // The server says this account is not an admin (anymore): refresh who we are and leave quietly.
         try { setUser(await api.me()); } catch { /* keep the current user */ }
         navigate('/', { replace: true });
      });
      if (!session.hasSession()) return;
      (async () => {
         try {
            setUser(await api.me());
            await loadCart();
         } catch {
            // network error or invalid session: stay logged out
         } finally {
            setAuthReady(true);
         }
      })();
   }, [loadCart, navigate]);

   // Called with the AuthResponse of login / verify-email.
   const startSession = async (res) => {
      session.set(res);
      setUser(res.user);
      await loadCart();
   };

   const logout = async () => {
      try {
         const stored = JSON.parse(localStorage.getItem('forever.tokens'));
         if (stored?.refreshToken) await api.logout(stored.refreshToken);
      } catch { /* the token is dropped locally either way */ }
      session.clear();
      setUser(null);
      setCart(EMPTY_CART);
      navigate('/');
   };

   const requireLogin = (message = 'Please log in to continue') => {
      if (user) return true;
      toast.info(message);
      navigate('/login', { state: { from: window.location.pathname } });
      return false;
   };

   const addToCart = async (productId, size) => {
      if (!size) {
         toast.error('Please Select Product Size');
         return;
      }
      if (!requireLogin('Please log in to add items to your cart')) return;
      try {
         setCart(await api.addToCart(productId, size));
         toast.success('Added to cart');
      } catch (e) {
         toast.error(e.message);
      }
   };

   const updateQuantity = async (productId, size, quantity) => {
      try {
         setCart(await api.setCartQuantity(productId, size, quantity));
      } catch (e) {
         toast.error(e.message);
      }
   };

   const getCartCount = () => cart.itemCount;
   const getCartAmount = () => cart.subtotal;

   const value = {
      currency,
      delivery_fee: cart.deliveryFee,
      search,
      setSearch,
      showSearch,
      setShowSearch,
      user,
      authReady,
      startSession,
      logout,
      requireLogin,
      cart,
      setCart,
      loadCart,
      addToCart,
      getCartCount,
      updateQuantity,
      getCartAmount,
      navigate
   }
   return (
      <ShopContext.Provider value={value}>
         {props.children}
      </ShopContext.Provider>
   )
}
export default ShopContextProvider;
