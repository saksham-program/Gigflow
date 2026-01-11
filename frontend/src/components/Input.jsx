export default function Input({ label, ...props }) {
  return (
    <label className="block">
      <span className="text-sm text-gray-700">{label}</span>
      <input {...props} className="mt-1 w-full rounded border px-3 py-2" />
    </label>
  );
}
