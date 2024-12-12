import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
  FullCapabilities,
  useGetFullCapabilities,
} from '@/hooks/api/database/capabilities/useGetFullCapabilities.hook';
import * as database from '@/types/cloud/project/database';
import { updateTags } from '@/lib/tagsHelper';

export function useCapabilitiesWithCurrentTags(service: database.Service) {
  const { projectId } = useParams();
  const capabilitiesQuery = useGetFullCapabilities(projectId);
  const capabilities: FullCapabilities = useMemo(() => {
    if (!capabilitiesQuery.data) return null;
    const {
      flavors,
      plans,
      regions,
      engines,
      ...rest
    } = capabilitiesQuery.data;
    return {
      ...rest,
      engines: engines.map((e) => ({
        ...e,
        versions: updateTags(e.versions, service.version),
      })),
      flavors: updateTags(flavors, service.flavor),
      plans: updateTags(plans, service.plan),
      regions: updateTags(regions, service.nodes[0].region),
    } as FullCapabilities;
  }, [capabilitiesQuery.data, service]);
  return capabilities;
}
