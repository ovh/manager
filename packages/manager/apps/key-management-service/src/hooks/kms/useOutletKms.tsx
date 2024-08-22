import { useOutletContext } from 'react-router-dom';
import { OKMS } from '@/types/okms.type';

export function useOutletKms() {
  return useOutletContext<OKMS>();
}
