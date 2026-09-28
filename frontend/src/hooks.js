import { useEffect, useState } from 'react';
import { api } from './api';

// Fetch helper with loading + error state; re-runs when `path` changes.
export function useFetch(path) {
  const [state, set] = useState({ data: null, loading: true, error: '' });
  useEffect(() => {
    let live = true; set((s) => ({ ...s, loading: true }));
    api(path).then((data) => live && set({ data, loading: false, error: '' }))
      .catch((e) => live && set({ data: null, loading: false, error: e.message }));
    return () => { live = false; };
  }, [path]);
  return state;
}
