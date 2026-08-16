function ratingColor(rating) {
  if (rating >= 4) return 'bg-emerald-500';
  if (rating >= 3) return 'bg-amber-500';
  return 'bg-rose-500';
}

export default function RatingBadge({ rating }) {
  return (
    <div
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-lg font-semibold text-white ${ratingColor(
        rating
      )}`}
      aria-label={`Rating ${rating} out of 5`}
    >
      {rating}
    </div>
  );
}
