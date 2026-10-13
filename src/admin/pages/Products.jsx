import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { api } from "../../api/client";
import useApi from "../../components/useApi";
import { Card, ErrorText, Loading, PageTitle, Pagination } from "../components/ui";
import { money } from "../format";

const PAGE_SIZE = 10;

const Products = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [debounced, setDebounced] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(0);
  const [version, setVersion] = useState(0);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.filters().then((f) => setCategories(f.categories)).catch(() => {});
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebounced(search);
      setPage(0);
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  const { data, loading, error } = useApi(
    () => api.adminProducts({ q: debounced, category: category || undefined, sort: 'newest', page, size: PAGE_SIZE }),
    [debounced, category, page, version],
  );

  const toggle = async (p) => {
    try {
      await api.adminSetProductActive(p.id, !p.active);
      toast.success(p.active ? `"${p.name}" is now hidden from the shop` : `"${p.name}" is visible in the shop`);
      setVersion((v) => v + 1);
    } catch (e) {
      toast.error(e.message);
    }
  };

  const items = data?.content || [];

  return (
    <>
      <PageTitle title="Products">
        <Link to="/admin/products/new" className="bg-black text-white text-sm px-4 py-2 rounded">+ Add product</Link>
      </PageTitle>

      <div className="flex flex-wrap gap-3 mb-4">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name" className="border border-gray-300 rounded px-3 py-2 text-sm bg-white w-full sm:w-72" />
        <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(0); }} className="border border-gray-300 rounded px-3 py-2 text-sm bg-white">
          <option value="">All categories</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        {data && <span className="text-sm text-gray-500 self-center">{data.totalElements} products</span>}
      </div>

      <Card className="overflow-hidden">
        {loading && <Loading />}
        <ErrorText error={error} />
        {!loading && !error && items.length === 0 && <p className="py-12 text-center text-gray-400">No products found</p>}

        {items.length > 0 && (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-left">
              <tr>
                <th className="px-4 py-3 font-normal">Product</th>
                <th className="px-4 py-3 font-normal hidden md:table-cell">Category</th>
                <th className="px-4 py-3 font-normal">Price</th>
                <th className="px-4 py-3 font-normal">Visible</th>
                <th className="px-4 py-3 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {items.map((p) => (
                <tr key={p.id} className={p.active ? '' : 'bg-gray-50 text-gray-400'}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.images[0]} alt="" className={`w-12 h-14 object-cover rounded ${p.active ? '' : 'opacity-50'}`} />
                      <div className="min-w-0">
                        <p className="font-medium truncate max-w-[14rem]">{p.name}</p>
                        <p className="text-xs text-gray-400">
                          #{p.id} · {p.sizes.join(', ')}{p.bestseller ? ' · ★ Bestseller' : ''}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">{p.category} · {p.subCategory}</td>
                  <td className="px-4 py-3">{money(p.price)}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggle(p)}
                      role="switch"
                      aria-checked={p.active}
                      aria-label={`${p.active ? 'Hide' : 'Show'} ${p.name}`}
                      className={`relative w-10 h-6 rounded-full transition-colors ${p.active ? 'bg-black' : 'bg-gray-300'}`}
                    >
                      <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${p.active ? 'translate-x-4' : ''}`} />
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => navigate(`/admin/products/${p.id}/edit`)} className="border border-gray-300 rounded px-3 py-1 text-gray-700 hover:bg-gray-100 bg-white">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      <Pagination page={page} totalPages={data?.totalPages || 0} onChange={setPage} />
    </>
  );
};

export default Products;
