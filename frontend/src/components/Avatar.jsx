export default function Avatar({ name, size = 40 }) {
  const initials = (name || "?")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div
      className={`inline-flex items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-white font-semibold shadow-md`}
      style={{ width: size, height: size }}
      aria-hidden
    >
      {initials}
    </div>
  );
}
