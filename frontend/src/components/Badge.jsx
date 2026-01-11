const styles = {
  open: 'bg-emerald-100 text-emerald-800',
  assigned: 'bg-indigo-100 text-indigo-800',
  pending: 'bg-yellow-100 text-yellow-800',
  hired: 'bg-emerald-100 text-emerald-800',
  rejected: 'bg-red-100 text-red-800'
};

export default function Badge({ value }) {
  return <span className={`text-xs px-2 py-1 rounded ${styles[value] ?? 'bg-gray-100 text-gray-800'}`}>{value}</span>;
}
