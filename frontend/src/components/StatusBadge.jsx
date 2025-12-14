export default function StatusBadge({ text = 'Active' }) {
  return (
    <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
      {text}
    </span>
  );
}
