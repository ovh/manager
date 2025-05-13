import { useMemo } from 'react';
import * as database from '@/types/cloud/project/database';
import { useGetCatalog } from '@/hooks/api/catalog/useGetCatalog.hook';
import { useCapabilitiesWithCurrentTags } from './useCapabilitiesWithCurrentTags.hook';
import { useServiceData } from '../../../Service.context';
import { createTree } from '@/lib/availabilitiesHelper';

export function useUpdateTree(availabilities: database.Availability[]) {
  const { service } = useServiceData();
  const capabilities = useCapabilitiesWithCurrentTags(service);
  const catalogQuery = useGetCatalog();
  const tree = useMemo(() => {
    if (!availabilities || !catalogQuery.data || !capabilities) return null;
    const suggestions: database.availability.Suggestion[] = [
      {
        default: true,
        engine: service.engine,
        flavor: service.flavor,
        plan: service.plan,
        region: service.nodes[0].region,
        version: service.version,
      },
    ];
    return createTree(
      availabilities,
      capabilities,
      suggestions,
      catalogQuery.data,
    ).map((e) => {
      // order the versions in the engines
      e.versions.sort((a, b) => a.order - b.order);
      return e;
    });
  }, [availabilities, catalogQuery, capabilities, service]);
  return tree;
}
