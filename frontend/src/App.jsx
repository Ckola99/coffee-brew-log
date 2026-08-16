import { useEffect, useMemo, useState } from 'react';
import BrewList from './components/BrewList.jsx';
import FilterBar from './components/FilterBar.jsx';
import BrewFormModal from './components/BrewFormModal.jsx';
import { fetchBrews, createBrew, updateBrew, deleteBrew } from './api/brews.js';

export default function App() {
  const [brews, setBrews] = useState([]);
  const [methodFilter, setMethodFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [modal, setModal] = useState(null); // { mode: 'add' | 'edit', brew? }

  useEffect(() => {
    document.title = `Brews: ${brews.length}`;
  }, [brews.length]);

  async function loadBrews(method = methodFilter) {
    setLoading(true);
    setLoadError('');
    try {
      const data = await fetchBrews(method || undefined);
      setBrews(data);
    } catch (err) {
      setLoadError(err.message || 'Could not load brews.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBrews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadBrews(methodFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [methodFilter]);

  const knownMethods = useMemo(
    () => Array.from(new Set(brews.map((b) => b.method))).sort(),
    [brews]
  );

  async function handleSave(formData) {
    if (modal.mode === 'edit') {
      await updateBrew(modal.brew.id, formData);
    } else {
      await createBrew(formData);
    }
    setModal(null);
    await loadBrews();
  }

  async function handleDelete(id) {
    await deleteBrew(id);
    setModal(null);
    await loadBrews();
  }

  return (
    <div className="min-h-screen bg-roast-50 px-4 py-8 sm:py-12">
      <div className="mx-auto w-full max-w-lg rounded-[2.5rem] border border-roast-100 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h1 className="text-4xl font-extrabold text-roast-800">Brew log</h1>
          <button
            type="button"
            onClick={() => setModal({ mode: 'add' })}
            className="shrink-0 rounded-full bg-roast-800 px-6 py-3 font-semibold text-white transition hover:bg-roast-600"
          >
            Add
          </button>
        </div>

        <FilterBar methods={knownMethods} value={methodFilter} onChange={setMethodFilter} />

        <div className="mt-4">
          {loading && <p className="py-10 text-center text-roast-600">Loading brews…</p>}
          {!loading && loadError && (
            <p className="py-10 text-center text-rose-600">{loadError}</p>
          )}
          {!loading && !loadError && (
            <BrewList brews={brews} onEdit={(brew) => setModal({ mode: 'edit', brew })} />
          )}
        </div>
      </div>

      {modal && (
        <BrewFormModal
          mode={modal.mode}
          initialBrew={modal.brew}
          onClose={() => setModal(null)}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
