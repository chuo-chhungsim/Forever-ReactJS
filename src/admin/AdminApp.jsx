import { Routes, Route, Navigate } from "react-router-dom";
import RequireAdmin from "./RequireAdmin";
import AdminLayout from "./AdminLayout";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import ProductForm from "./pages/ProductForm";
import Orders from "./pages/Orders";

const AdminApp = () => (
  <Routes>
    <Route element={<RequireAdmin />}>
      <Route element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="products/new" element={<ProductForm />} />
        <Route path="products/:id/edit" element={<ProductForm />} />
        <Route path="orders" element={<Orders />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Route>
  </Routes>
);

export default AdminApp;
