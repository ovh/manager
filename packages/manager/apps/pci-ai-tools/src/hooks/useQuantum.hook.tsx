import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

export function useQuantum(namespace?: string) {
  const { quantum } = useParams();
  const { t: tOrig } = useTranslation(namespace);
  const isQuantum = quantum === 'quantum';
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  const t = (key: string) => {
    if (isQuantum) {
      const quantumKey = `quantum${capitalize(key)}`;
      return tOrig([quantumKey, key]);
    }
    return tOrig(key);
  };
  return {
    isQuantum,
    t,
  };
}
