export default function StarRating({ value = 0, size = 14 }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    const filled = i <= Math.round(value || 0);
    stars.push(
      <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" className={filled ? "text-yellow-400" : "text-gray-300"}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M12 17.27L18.18 21 16.54 13.97 22 9.24 14.81 8.63 12 2 9.19 8.63 2 9.24 7.46 13.97 5.82 21z" />
      </svg>
    );
  }
  return <div className="flex items-center gap-1">{stars}</div>;
}
