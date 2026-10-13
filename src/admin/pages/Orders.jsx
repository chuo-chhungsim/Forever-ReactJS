import { Fragment, useState } from "react";
import { toast } from "react-toastify";
import { api } from "../../api/client";
import useApi from "../../components/useApi";
import { Card, ErrorText, Loading, PageTitle, Pagination, StatusBadge } from "../components/ui";
import { STATUSES, formatDate, money } from "../format";

const PAGE_SIZE = 10;

const Orders = () => {
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(0);
  const [version, setVersion] = useState(0);
  const [openId, setOpenId] = useState(null);
  const [updating, setUpdating] = useState(null);

  const { data, loading, error } = useApi(
    () => api.adminOrders({ status: status || undefined, page, size: PAGE_SIZE }),
    [status, page, version],
  );

  const changeStatus = async (order, next) => {
    if (next === order.status) return;
    setUpdating(order.id);
    try {
      await api.adminUpdateOrderStatus(order.id, next);
      toast.success(`Order #${order.id} is now "${STATUSES.find(([v]) => v === next)[1]}"`);
      setVersion((v) => v + 1);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setUpdating(null);
    }
  };

  const orders = data?.content || [];

  return (
    <>
      <PageTitle title="Orders">
        {data && <span className="text-sm text-gray-500">{data.totalElements} orders</span>}
      </PageTitle>

      <div className="flex flex-wrap gap-2 mb-4">
        {[['', 'All'], ...STATUSES.map(([v, l]) => [v, l])].map(([value, label]) => (
          <button key={value} onClick={() => { setStatus(value); setPage(0); }}
            className={`px-3 py-1.5 rounded-full text-sm border ${status === value ? 'bg-black text-white border-black' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-100'}`}>
            {label}
          </button>
        ))}
      </div>

      <Card className="overflow-hidden">
        {loading && <Loading />}
        <ErrorText error={error} />
        {!loading && !error && orders.length === 0 && <p className="py-12 text-center text-gray-400">No orders found</p>}

        {orders.length > 0 && (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-left">
              <tr>
                <th className="px-4 py-3 font-normal">Order</th>
                <th className="px-4 py-3 font-normal hidden md:table-cell">Customer</th>
                <th className="px-4 py-3 font-normal hidden lg:table-cell">Payment</th>
                <th className="px-4 py-3 font-normal">Total</th>
                <th className="px-4 py-3 font-normal">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => {
                const closed = o.status === 'CANCELLED' || o.status === 'DELIVERED';
                return (
                  <Fragment key={o.id}>
                    <tr className="border-t hover:bg-gray-50 cursor-pointer" onClick={() => setOpenId(openId === o.id ? null : o.id)}>
                      <td className="px-4 py-3">
                        <p className="font-medium">#{o.id}</p>
                        <p className="text-xs text-gray-400">{formatDate(o.createdAt)}</p>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <p>{o.address.firstName} {o.address.lastName}</p>
                        <p className="text-xs text-gray-400">{o.address.city}, {o.address.country}</p>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        {o.paymentMethod} <span className={o.paid ? 'text-green-600' : 'text-gray-400'}>· {o.paid ? 'Paid' : 'Unpaid'}</span>
                      </td>
                      <td className="px-4 py-3 font-medium">{money(o.total)}</td>
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        {closed ? (
                          <StatusBadge status={o.status} />
                        ) : (
                          <select value={o.status} disabled={updating === o.id} onChange={(e) => changeStatus(o, e.target.value)}
                            aria-label={`Status of order ${o.id}`} className="border border-gray-300 rounded px-2 py-1.5 bg-white text-sm">
                            {STATUSES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                          </select>
                        )}
                      </td>
                    </tr>
                    {openId === o.id && (
                      <tr className="bg-gray-50">
                        <td colSpan={5} className="px-4 py-4">
                          <div className="grid md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-3">
                              {o.items.map((i, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                  <img src={i.image} alt="" className="w-12 h-14 object-cover rounded" />
                                  <div className="text-sm">
                                    <p className="font-medium">{i.name}</p>
                                    <p className="text-gray-500">{money(i.price)} × {i.quantity} · Size {i.size}</p>
                                  </div>
                                </div>
                              ))}
                              <p className="text-sm text-gray-500">Items {money(o.itemsAmount)} + shipping {money(o.deliveryFee)}</p>
                            </div>
                            <div className="text-sm text-gray-600 leading-6">
                              <p className="font-medium text-gray-800">{o.address.firstName} {o.address.lastName}</p>
                              <p>{o.address.street}</p>
                              <p>{o.address.city}, {o.address.state} {o.address.zipcode}</p>
                              <p>{o.address.country}</p>
                              <p className="mt-1">☎ {o.address.phone}</p>
                              <p>✉ {o.address.email}</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        )}
      </Card>

      <Pagination page={page} totalPages={data?.totalPages || 0} onChange={setPage} />
    </>
  );
};

export default Orders;
