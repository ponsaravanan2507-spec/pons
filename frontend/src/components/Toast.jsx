import { useStore } from '../context/Store';
export default function Toast() {
  const { toast } = useStore();
  return <div className={`toast ${toast ? 'show' : ''}`} role="status" aria-live="polite">{toast}</div>;
}
