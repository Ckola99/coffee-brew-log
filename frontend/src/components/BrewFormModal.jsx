import { useState } from 'react';

const METHOD_OPTIONS = ['Aeropress', 'Drip coffee', 'V60', 'French press', 'Espresso', 'Moka pot'];

const emptyForm = {
  beans: '',
  method: '',
  coffeeGrams: '',
  waterGrams: '',
  rating: '',
  tastingNotes: '',
};

export default function BrewFormModal({ mode, initialBrew, onClose, onSave, onDelete }) {
  const isEdit = mode === 'edit';
  const [form, setForm] = useState(
    isEdit && initialBrew
      ? {
          beans: initialBrew.beans,
          method: initialBrew.method,
          coffeeGrams: initialBrew.coffeeGrams,
          waterGrams: initialBrew.waterGrams,
          rating: initialBrew.rating,
          tastingNotes: initialBrew.tastingNotes,
        }
      : emptyForm
  );
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function validate() {
    if (
      !form.beans.trim() ||
      !form.method ||
      form.coffeeGrams === '' ||
      form.waterGrams === '' ||
      form.rating === '' ||
      !form.tastingNotes.trim()
    ) {
      return 'Please fill in every field before saving.';
    }
    return '';
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await onSave({
        beans: form.beans.trim(),
        method: form.method,
        coffeeGrams: Number(form.coffeeGrams),
        waterGrams: Number(form.waterGrams),
        rating: Number(form.rating),
        tastingNotes: form.tastingNotes.trim(),
      });
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    setSubmitting(true);
    try {
      await onDelete(initialBrew.id);
    } catch (err) {
      setError(err.message || 'Could not delete this brew.');
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-roast-800">
            {isEdit ? 'Edit a brew' : 'Add a brew'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-2xl leading-none text-roast-800"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1 block text-sm font-medium text-roast-800">Beans</label>
            <input
              type="text"
              value={form.beans}
              onChange={(e) => update('beans', e.target.value)}
              className="w-full rounded-xl border border-roast-200 px-4 py-2.5 outline-none focus:border-roast-400"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-roast-800">Method</label>
            <select
              value={form.method}
              onChange={(e) => update('method', e.target.value)}
              className="w-full rounded-xl border border-roast-200 bg-white px-4 py-2.5 outline-none focus:border-roast-400"
            >
              <option value="">Select a method</option>
              {METHOD_OPTIONS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-roast-800">
                Coffee grams
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={form.coffeeGrams}
                onChange={(e) => update('coffeeGrams', e.target.value)}
                className="w-full rounded-xl border border-roast-200 px-4 py-2.5 outline-none focus:border-roast-400"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-roast-800">
                Water grams
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={form.waterGrams}
                onChange={(e) => update('waterGrams', e.target.value)}
                className="w-full rounded-xl border border-roast-200 px-4 py-2.5 outline-none focus:border-roast-400"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-roast-800">
              Rating (out of 5)
            </label>
            <input
              type="number"
              min="0"
              max="5"
              value={form.rating}
              onChange={(e) => update('rating', e.target.value)}
              className="w-full rounded-xl border border-roast-200 px-4 py-2.5 outline-none focus:border-roast-400"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-roast-800">
              Tasting notes
            </label>
            <input
              type="text"
              value={form.tastingNotes}
              onChange={(e) => update('tastingNotes', e.target.value)}
              className="w-full rounded-xl border border-roast-200 px-4 py-2.5 outline-none focus:border-roast-400"
            />
          </div>

          {error && <p className="text-sm text-rose-600">{error}</p>}

          <div className="flex gap-3 pt-2">
            {isEdit && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={submitting}
                className="flex-1 rounded-full bg-rose-600 py-3 font-semibold text-white transition hover:bg-rose-700 disabled:opacity-60"
              >
                Delete
              </button>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 rounded-full bg-roast-800 py-3 font-semibold text-white transition hover:bg-roast-600 disabled:opacity-60"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
