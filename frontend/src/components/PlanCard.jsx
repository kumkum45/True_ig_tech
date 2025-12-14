import { useUI } from "../context/UIContext";

import Avatar from "./Avatar";
import StarRating from "./StarRating";
import StatusBadge from "./StatusBadge";

export default function PlanCard({ plan, isOwner = false, onUpdate, onDelete }) {
  const { openModal } = useUI();
  const enrolledCount = (plan.enrolled_count ?? plan.enrolledCount ?? plan.enrolled) || 0;

  const showDetails = () => {
    openModal(
      <div>
        <h3 className="text-xl font-semibold">{plan.name}</h3>
        <p className="mt-1 text-sm text-gray-600">By {plan.trainer}</p>
        <div className="mt-4 text-sm text-gray-700">
          <div>Duration: {plan.duration}</div>
          <div>Goal: {plan.goal}</div>
        </div>
        <div className="mt-6 flex items-center justify-between">
          <span className="text-2xl font-bold">₹{plan.price}</span>
          <button className="btn-primary">Enroll</button>
        </div>
      </div>
    );
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={showDetails}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") showDetails(); }}
      className="bg-white rounded-xl p-4 flex flex-col justify-between transform transition duration-300 hover:-translate-y-2 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-brand-600 cursor-pointer"
      aria-label={`View details for ${plan.title || plan.name}`}
    >
      <div>
        <div className="w-full h-40 bg-gray-100 rounded-md overflow-hidden mb-3">
          <img src={plan.image || `https://source.unsplash.com/collection/190727/800x600?sig=${plan.id || 1}`} alt={plan.title} className="w-full h-full object-cover" />
        </div>
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold">{plan.title || plan.name}</h3>
            <p className="mt-1 text-sm text-gray-500 line-clamp-2">{plan.description || plan.short_description}</p>
          </div>
          <StatusBadge text={plan.active === false ? 'Inactive' : 'Active'} />
        </div>

        <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-3">
            <Avatar name={plan.trainer || 'Trainer'} size={32} />
            <div>
              <div className="text-xs">Users: <span className="font-semibold">{enrolledCount}</span></div>
              <div className="text-xs">Duration: {plan.duration}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StarRating value={plan.rating ?? 0} />
            <div className="text-sm font-semibold">₹{plan.price}</div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        {isOwner && (
          <>
            <button onClick={(e) => { e.stopPropagation(); onUpdate && onUpdate(plan); }} className="btn-outline">Update</button>
            <button onClick={(e) => { e.stopPropagation(); onDelete && onDelete(plan.id); }} className="btn-danger">Delete</button>
          </>
        )}
        <button onClick={(e) => { e.stopPropagation(); showDetails(); }} className="btn-primary ml-auto">View</button>
      </div>
    </div>
  );
}
