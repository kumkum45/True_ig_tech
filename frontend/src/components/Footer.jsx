export default function Footer() {
  return (
    <footer className="border-t border-gray-200">
      <div className="section py-10 grid md:grid-cols-3 gap-8">
        <div>
          <h4 className="font-bold">FitForge</h4>
          <p className="mt-2 text-sm text-gray-600">Elevate your fitness with expert-designed plans.</p>
        </div>
        <div>
          <h4 className="font-bold">Quick Links</h4>
          <ul className="mt-2 space-y-2 text-sm text-gray-700">
            <li><a href="#plans" className="hover:underline">Famous Plans</a></li>
            <li><a href="#features" className="hover:underline">Features</a></li>
            <li><a href="#about" className="hover:underline">About Us</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold">Follow</h4>
          <div className="mt-2 flex gap-3">
            <span className="h-8 w-8 bg-gray-200 rounded" aria-label="Social placeholder" />
            <span className="h-8 w-8 bg-gray-200 rounded" aria-label="Social placeholder" />
            <span className="h-8 w-8 bg-gray-200 rounded" aria-label="Social placeholder" />
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200 py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} FitForge. All rights reserved.
      </div>
    </footer>
  );
}
