import { useContext } from 'react';
import Context from '@/context';
import { MINIMAL_RIGHTS } from './constants';

export default function useMinimalRights() {
  const { ovhSubsidiary } = useContext(Context);
  // ovhSubsidiary is got with /me so having the good right is mandatory to check that value
  // without any sub provided, the rights with condition are skipped
  return MINIMAL_RIGHTS.filter(
    ({ subsidiariesExcluded }: any) =>
      !subsidiariesExcluded ||
      (ovhSubsidiary && !subsidiariesExcluded.includes(ovhSubsidiary)),
  );
}
