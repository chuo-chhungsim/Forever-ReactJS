import { Link } from "react-router-dom";
import { api } from "../../api/client";
import useApi from "../../components/useApi";
import { Card, ErrorText, Loading, PageTitle, StatusBadge } from "../components/ui";
import { STATUSES, formatDate, money } from "../format";

const Stat = ({ label, value, hint }) => (
  <Card className="p-5">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-3xl font-medium mt-2">{value}</p>
    {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
  </Card>
);

const Dashboard = () => {
  const stats = useApi(() => api.adminStats(), []);
  const recent = useApi(() => api.adminOrders({ page: 0, size: 5 }), []);

  if (stats.loading) return <Loading />;
  if (stats.error) return <ErrorText error={stats.error} />;
  const s = stats.data;
  const pending = s.ordersByStatus.ORDER_PLACED + s.ordersByStatus.PACKING;
  const maxCount = Math.max(1, ...Object.values(s.ordersByStatus));

  return (
    <>
      <PageTitle title="Dashboard" />

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Stat label="Revenue" value={money(s.revenue)} hint="excluding cancelled" />
        <Stat label="Orders" value={s.totalOrders} />
        <Stat label="To fulfil" value={pending} hint="placed + packing" />
        <Stat label="Products" value={s.activeProducts} hint={`${s.hiddenProducts} hidden`} />
        <Stat label="Customers" value={s.customers} />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mt-6">
        <Card className="p-5 lg:col-span-1">
          <h2 className="font-medium mb-4">Orders by status</h2>
          <div className="flex flex-col gap-3">
            {STATUSES.map(([value, label]) => (
              <div key={value}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{label}</span>
                  <span className="text-gray-500">{s.ordersByStatus[value]}</span>
                </div>
                <div className="h-2 rounded bg-gray-100">
                  <div className="h-2 rounded bg-black" style={{ width: `${(s.ordersByStatus[value] / maxCount) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-medium">Recent orders</h2>
            <Link to="/admin/orders" className="text-sm text-gray-500 hover:text-black">View all</Link>
          </div>
          {recent.loading && <Loading />}
          <ErrorText error={recent.error} />
          {recent.data && recent.data.content.length === 0 && <p className="py-6 text-center text-gray-400">No orders yet</p>}
          <div className="divide-y">
            {recent.data?.content.map((o) => (
              <div key={o.id} className="py-3 flex items-center justify-between gap-3 text-sm">
                <div className="min-w-0">
                  <p className="font-medium">#{o.id} · {o.address.firstName} {o.address.lastName}</p>
                  <p className="text-gray-400 text-xs">{formatDate(o.createdAt)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-medium">{money(o.total)}</span>
                  <StatusBadge status={o.status} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
};

export default Dashboard;
