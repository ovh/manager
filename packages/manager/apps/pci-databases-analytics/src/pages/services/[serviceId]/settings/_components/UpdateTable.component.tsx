import { MinusCircle, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@datatr-ux/uxlib';
import { humanizeEngine } from '@/lib/engineNameHelper';
import * as database from '@/types/cloud/project/database';
import { useServiceData } from '../../Service.context';
import { compareStorage, formatStorage } from '@/lib/bytesHelper';
import { useGetAvailabilities } from '@/hooks/api/database/availability/useGetAvailabilities.hook';

const UpdateTable = () => {
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/settings/update',
  );
  const { service, projectId } = useServiceData();
  const navigate = useNavigate();
  // fetch available updates
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
      onClick: () => navigate('./update-version'),
      updateButtonDisplayed: availabilitiesVersionQuery.data?.length > 1,
    },
    {
      title: t('tablePlan'),
      cell: service.plan,
      onClick: () => navigate('./update-plan'),
      updateButtonDisplayed: availabilitiesPlanQuery.data?.length > 1,
    },
    {
      title: t('tableFlavor'),
      cell: service.flavor,
      onClick: () => navigate('./update-flavor'),
      updateButtonDisplayed: availabilitiesFlavorQuery.data?.length > 1,
    },
    service.storage?.size.value && {
      title: t('tableStorage'),
      cell: `${formatStorage(service.storage.size)} ${service.storage.type}`,
      onClick: () => navigate('./update-flavor'),
      updateButtonDisplayed:
        availabilitiesFlavorQuery.data?.length > 0 &&
        availabilitiesFlavorQuery.data[0].specifications.storage &&
        compareStorage(
          availabilitiesFlavorQuery.data[0].specifications.storage.minimum,
          availabilitiesFlavorQuery.data[0].specifications.storage.maximum,
        ) !== 0,
    },
  ].filter((row) => Boolean(row));
  return (
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
                  mode={'ghost'}
                  className="p-0 h-auto text-destructive"
                  onClick={() => navigate('./delete-node')}
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
                  mode={'ghost'}
                  className="p-0 h-auto text-primary"
                  onClick={() => navigate('./add-node')}
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
  );
};

export default UpdateTable;
