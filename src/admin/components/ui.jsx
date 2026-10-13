// Small presentational pieces shared by the admin pages.
import { STATUSES } from "../format";

export const StatusBadge = ({ status }) => {
  const [, label, color] = STATUSES.find(([v]) => v === status) || [status, status, 'bg-gray-100 text-gray-600'];
  return <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${color}`}>{label}</span>;
};

export const PageTitle = ({ title, children }) => (
  <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
    <h1 className="text-2xl font-medium">{title}</h1>
    <div className="flex items-center gap-3">{children}</div>
  </div>
);

export const Card = ({ className = '', children }) => (
  <div className={`bg-white border border-gray-200 rounded-lg ${className}`}>{children}</div>
);

export const Pagination = ({ page, totalPages, onChange }) => {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between mt-4 text-sm">
      <span className="text-gray-500">Page {page + 1} of {totalPages}</span>
      <div className="flex gap-2">
        <button disabled={page === 0} onClick={() => onChange(page - 1)} className="border px-3 py-1.5 rounded bg-white disabled:opacity-40">Previous</button>
        <button disabled={page + 1 >= totalPages} onClick={() => onChange(page + 1)} className="border px-3 py-1.5 rounded bg-white disabled:opacity-40">Next</button>
      </div>
    </div>
  );
};

export const Loading = () => <p className="py-10 text-center text-gray-400">Loading...</p>;

export const ErrorText = ({ error }) => error ? <p className="py-6 text-center text-red-600">{error.message}</p> : null;
