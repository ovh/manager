import { useMemo } from 'react';
import { useGatewayCatalog } from '@/data/hooks/gateway/useGateway';
import { TGatewayCatalog } from '@/types/gateway.type';

type UseGetAvailableGatewayCatalog = {
  catalog: TGatewayCatalog;
  isLoading: boolean;
};

export default function useAvailableGatewayCatalog():
  | UseGetAvailableGatewayCatalog
  | undefined {
  const { data: gatewayCatalog, isLoading } = useGatewayCatalog();

  return useMemo(() => ({ catalog: gatewayCatalog, isLoading }), [
    gatewayCatalog,
  ]);
}
