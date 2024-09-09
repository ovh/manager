import { useOutletContext } from 'react-router-dom';
import { OkmsCredential } from '@/types/okmsCredential.type';

export function useOutletCredential() {
  return useOutletContext<OkmsCredential>();
}
