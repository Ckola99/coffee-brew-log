export default function FilterBar({ methods, value, onChange }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-full border border-roast-200 bg-white px-5 py-3 pr-10 text-roast-800 outline-none focus:border-roast-400"
        aria-label="Filter by method"
      >
        <option value="">Filter by method</option>
        {methods.map((method) => (
          <option key={method} value={method}>
            {method}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-roast-600">
        ▾
      </span>
    </div>
  );
}
