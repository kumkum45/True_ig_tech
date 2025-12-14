export default function FeatureCard({ feature }) {
  return (
    <div className="card p-6 transform transition duration-300 hover:scale-105 hover:shadow-md hover:border-brand-200 cursor-pointer" role="article">
      {/* Animated icon block */}
      <div className="h-10 w-10 rounded bg-brand-50 border border-brand-600 mb-4 flex items-center justify-center text-brand-600">
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 8c1.657 0 3-1.343 3-3S13.657 2 12 2 9 3.343 9 5s1.343 3 3 3zM6 20v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
        </svg>
      </div>
      <h4 className="font-semibold">{feature.title}</h4>
      <p className="mt-2 text-gray-600 text-sm">{feature.description}</p>
    </div>
  );
}
