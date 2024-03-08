import { useMemo } from 'react';
import {
  useGetAvailabilities,
  useGetCapabilities,
  useGetEnginesCapabilities,
  useGetRegionsCapabilities,
} from '@/hooks/api/availabilities.api.hooks';
import { useServiceData } from '../../layout';
import { database } from '@/models/database';
import { H3, P } from '@/components/typography';
import { useGetCatalog } from '@/hooks/api/catalog.api.hooks';
import { Skeleton } from '@/components/ui/skeleton';
import OrderFunnel from './_components/order-funnel';
import { useGetBackups } from '@/hooks/api/backups.api.hooks';

export function breadcrumb() {
  return 'Fork';
}

const Fork = () => {
  const { projectId, service } = useServiceData();
  const availabilitiesQuery = useGetAvailabilities(
    projectId,
    service.id,
    database.availability.ActionEnum.fork,
  );
  const capabilitiesQuery = useGetCapabilities(projectId);
  const enginesCapabilitiesQuery = useGetEnginesCapabilities(projectId);
  const regionsCapabilitiesQuery = useGetRegionsCapabilities(projectId);
  const backupsQuery = useGetBackups(projectId, service.engine, service.id);
  const catalogQuery = useGetCatalog();

  const suggestion: database.Suggestion[] = [
    {
      default: true,
      engine: service.engine,
      flavor: service.flavor,
      plan: service.plan,
      region: service.nodes[0].region,
      version: service.version,
    },
  ];

  const loading =
    availabilitiesQuery.isLoading ||
    capabilitiesQuery.isLoading ||
    enginesCapabilitiesQuery.isLoading ||
    regionsCapabilitiesQuery.isLoading ||
    backupsQuery.isLoading ||
    catalogQuery.isLoading;

  // Add the current tag to selected capabilities.
  const capabilities: database.Capabilities = useMemo(() => {
    if (!capabilitiesQuery.data)
      return {
        flavors: [],
        disks: [],
        engines: [],
        options: [],
        plans: [],
        regions: [],
      };
    const c = { ...capabilitiesQuery.data };
    c.flavors = c.flavors.map((flavor) =>
      flavor.name === service.flavor &&
      !flavor.tags.includes(database.capabilities.Tags.current)
        ? {
            ...flavor,
            tags: [...flavor.tags, database.capabilities.Tags.current],
          }
        : flavor,
    );
    c.plans = c.plans.map((plan) =>
      plan.name === service.plan &&
      !plan.tags.includes(database.capabilities.Tags.current)
        ? { ...plan, tags: [...plan.tags, database.capabilities.Tags.current] }
        : plan,
    );
    return c;
  }, [capabilitiesQuery.data, service]);

  const regionsCapabilities: database.RegionCapabilities[] = useMemo(() => {
    if (!regionsCapabilitiesQuery.data) return [];
    return regionsCapabilitiesQuery.data.map((r) =>
      r.name === service.nodes[0].region &&
      !r.tags.includes(database.capabilities.Tags.current)
        ? { ...r, tags: [...r.tags, database.capabilities.Tags.current] }
        : r,
    );
  }, [regionsCapabilitiesQuery.data, service]);

  const backups =
    backupsQuery.data?.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    ) || [];

  return (
    <>
      <H3 className="font-bold text-3xl mb-5">
        Dupliquer votre service de base de données (fork)
      </H3>
      <P className="mb-2">
        Le fork de votre sauvegarde s'effectuera sur un nouveau cluster.
      </P>

      {loading ? (
        <Skeleton className="h-4 w-32" />
      ) : (
        <OrderFunnel
          availabilities={availabilitiesQuery.data}
          capabilities={capabilities}
          engineCapabilities={enginesCapabilitiesQuery.data}
          regionCapabilities={regionsCapabilities}
          suggestions={suggestion}
          catalog={catalogQuery.data}
          backups={backups}
        />
      )}
    </>
  );
};

export default Fork;
