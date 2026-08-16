import RatingBadge from './RatingBadge.jsx';

export default function BrewCard({ brew, onEdit }) {
  return (
    <div className="flex items-center gap-4 border-b border-roast-100 py-4 last:border-none">
      <RatingBadge rating={brew.rating} />

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-lg font-bold text-roast-800">{brew.beans}</h3>
        <div className="mt-1 flex flex-wrap gap-2">
          <span className="rounded-full border border-roast-200 px-3 py-1 text-sm text-roast-600">
            {brew.method}
          </span>
          <span className="rounded-full border border-roast-200 px-3 py-1 text-sm text-roast-600">
            ☕ {brew.coffeeGrams}g
          </span>
          <span className="rounded-full border border-roast-200 px-3 py-1 text-sm text-roast-600">
            💧 {brew.waterGrams}g
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onEdit(brew)}
        aria-label={`Edit ${brew.beans}`}
        className="shrink-0 rounded-lg p-2 text-roast-800 transition hover:bg-roast-100"
      >
        ✎
      </button>
    </div>
  );
}
