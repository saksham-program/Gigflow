export default function Textarea({ label, ...props }) {
  return (
    <label className="block">
      <span className="text-sm text-gray-700">{label}</span>
      <textarea {...props} className="mt-1 w-full rounded border px-3 py-2 min-h-[120px]" />
    </label>
  );
}
