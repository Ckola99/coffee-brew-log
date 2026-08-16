import BrewCard from './BrewCard.jsx';

export default function BrewList({ brews, onEdit }) {
  if (brews.length === 0) {
    return (
      <p className="py-10 text-center text-roast-600">
        No brews logged yet. Tap "Add" to record your first one.
      </p>
    );
  }

  return (
    <div>
      {brews.map((brew) => (
        <BrewCard key={brew.id} brew={brew} onEdit={onEdit} />
      ))}
    </div>
  );
}
