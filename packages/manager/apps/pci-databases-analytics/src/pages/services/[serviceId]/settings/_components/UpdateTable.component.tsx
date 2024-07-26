import { MinusCircle, PlusCircle } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { humanizeEngine } from '@/lib/engineNameHelper';
import * as database from '@/types/cloud/project/database';
import { useServiceData } from '../../Service.context';
import { Button } from '@/components/ui/button';
import { formatStorage } from '@/lib/bytesHelper';
import { useModale } from '@/hooks/useModale';
import UpdateVersion from '../update/_components/modals/UpdateVersion.component';
import UpdatePlan from '../update/_components/modals/UpdatePlan.component';
import UpdateFlavor from '../update/_components/modals/UpdateFlavor.component';
import AddNode from '../update/_components/modals/AddNode.component';
import DeleteNode from '../update/_components/modals/RemoveNode.component';
import { updateTags } from '@/lib/tagsHelper';
import { useGetCatalog } from '@/hooks/api/catalog/useGetCatalog.hook';
import {
  FullCapabilities,
  useGetFullCapabilities,
} from '@/hooks/api/database/capabilities/useGetFullCapabilities.hook';
import { useGetAvailabilities } from '@/hooks/api/database/availability/useGetAvailabilities.hook';

const UpdateTable = () => {
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/settings/update',
  );
  const { service, projectId, serviceQuery } = useServiceData();
  const catalogQuery = useGetCatalog();
  const capabilitiesQuery = useGetFullCapabilities(projectId);
  const availabilitiesVersionQuery = useGetAvailabilities(
    projectId,
    service.id,
    database.availability.ActionEnum.update,
    database.availability.TargetEnum.version,
  );
  const availabilitiesPlanQuery = useGetAvailabilities(
    projectId,
    service.id,
    database.availability.ActionEnum.update,
    database.availability.TargetEnum.plan,
  );
  const availabilitiesFlavorQuery = useGetAvailabilities(
    projectId,
    service.id,
    database.availability.ActionEnum.update,
    database.availability.TargetEnum.flavor,
  );

  const updateVersionModal = useModale('update-version');
  const updatePlanModal = useModale('update-plan');
  const updateFlavorModal = useModale('update-flavor');
  const addNode = useModale('add-node');
  const deleteNode = useModale('delete-node');

  const capabilities: FullCapabilities = useMemo(() => {
    if (!capabilitiesQuery.data)
      return {
        flavors: [],
        disks: [],
        engines: [],
        options: [],
        plans: [],
        regions: [],
      };
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

  const suggestions: database.availability.Suggestion[] = [
    {
      default: true,
      engine: service.engine,
      flavor: service.flavor,
      plan: service.plan,
      region: service.region,
      version: service.version,
    },
  ];
  // refetch availabilities when service status changes
  useEffect(() => {
    availabilitiesVersionQuery.refetch();
    availabilitiesFlavorQuery.refetch();
    availabilitiesPlanQuery.refetch();
  }, [service.status]);

  const rows = [
    {
      title: t('tableVersion'),
      cell: `${humanizeEngine(service.engine)} ${service.version}`,
      onClick: () => updateVersionModal.open(),
      updateButtonDisplayed: availabilitiesVersionQuery.data?.length > 1,
    },
    {
      title: t('tablePlan'),
      cell: service.plan,
      onClick: () => updatePlanModal.open(),
      updateButtonDisplayed: availabilitiesPlanQuery.data?.length > 1,
    },
    {
      title: t('tableFlavor'),
      cell: service.flavor,
      onClick: () => updateFlavorModal.open(),
      updateButtonDisplayed: availabilitiesFlavorQuery.data?.length > 1,
    },
    service.storage?.size.value && {
      title: t('tableStorage'),
      cell: `${formatStorage(service.storage.size)} ${service.storage.type}`,
      onClick: () => updateFlavorModal.open(),
      updateButtonDisplayed: availabilitiesFlavorQuery.data?.length > 1,
    },
  ].filter((row) => Boolean(row));
  return (
    <>
      <Table>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.title}>
              <TableCell className="font-semibold">{row.title}</TableCell>
              <TableCell>{row.cell}</TableCell>
              {row.updateButtonDisplayed && (
                <TableCell className="text-right">
                  <Button
                    data-testid={`update-button-${row.title}`}
                    variant="default"
                    size="default"
                    className="py-0 h-auto"
                    onClick={row.onClick}
                    disabled={
                      service.capabilities.service.update ===
                      database.service.capability.StateEnum.disabled
                    }
                  >
                    {t('tableUpdateButton')}
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
          <TableRow>
            <TableCell className="font-semibold">{t('tableNodes')}</TableCell>
            <TableCell>{service.nodes.length}</TableCell>
            {availabilitiesFlavorQuery.data?.length > 1 && (
              <TableCell className="flex gap-2 justify-end">
                {service.capabilities.nodes?.delete && (
                  <Button
                    data-testid="delete-node-button"
                    variant={'ghost'}
                    size="table"
                    className="p-0 h-auto text-destructive"
                    onClick={() => deleteNode.open()}
                    disabled={
                      service.capabilities.nodes?.delete ===
                      database.service.capability.StateEnum.disabled
                    }
                  >
                    <MinusCircle />
                  </Button>
                )}
                {service.capabilities.nodes?.create && (
                  <Button
                    data-testid="create-node-button"
                    variant={'ghost'}
                    size="table"
                    className="p-0 h-auto text-primary"
                    onClick={() => addNode.open()}
                    disabled={
                      service.capabilities.nodes?.create ===
                      database.service.capability.StateEnum.disabled
                    }
                  >
                    <PlusCircle />
                  </Button>
                )}
              </TableCell>
            )}
          </TableRow>
        </TableBody>
      </Table>
      {/* Modals */}
      {catalogQuery.isSuccess && capabilitiesQuery.isSuccess && (
        <>
          {availabilitiesVersionQuery.isSuccess && (
            <UpdateVersion
              suggestions={suggestions}
              availabilities={availabilitiesVersionQuery.data}
              controller={updateVersionModal.controller}
              capabilities={capabilities}
              catalog={catalogQuery.data}
              onSuccess={() => {
                updateVersionModal.close();
                serviceQuery.refetch();
              }}
            />
          )}
          {availabilitiesPlanQuery.isSuccess && (
            <UpdatePlan
              suggestions={suggestions}
              availabilities={availabilitiesPlanQuery.data}
              controller={updatePlanModal.controller}
              capabilities={capabilities}
              catalog={catalogQuery.data}
              onSuccess={() => {
                updatePlanModal.close();
                serviceQuery.refetch();
              }}
            />
          )}
          {availabilitiesFlavorQuery.isSuccess && (
            <UpdateFlavor
              suggestions={suggestions}
              availabilities={availabilitiesFlavorQuery.data}
              controller={updateFlavorModal.controller}
              capabilities={capabilities}
              catalog={catalogQuery.data}
              onSuccess={() => {
                updateFlavorModal.close();
                serviceQuery.refetch();
              }}
            />
          )}
          <AddNode
            controller={addNode.controller}
            catalog={catalogQuery.data}
            onSuccess={() => {
              addNode.close();
              serviceQuery.refetch();
            }}
          />
          <DeleteNode
            controller={deleteNode.controller}
            catalog={catalogQuery.data}
            onSuccess={() => {
              deleteNode.close();
              serviceQuery.refetch();
            }}
          />
        </>
      )}
    </>
  );
};

export default UpdateTable;
