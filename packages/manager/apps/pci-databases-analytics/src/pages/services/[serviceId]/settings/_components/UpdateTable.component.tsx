import { MinusCircle, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@datatr-ux/uxlib';
import { humanizeEngine } from '@/lib/engineNameHelper';
import * as database from '@/types/cloud/project/database';
import { useServiceData } from '../../Service.context';
import { compareStorage, formatStorage } from '@/lib/bytesHelper';
import { useGetAvailabilities } from '@/data/hooks/database/availability/useGetAvailabilities.hook';
import NavLink from '@/components/links/NavLink.component';
import { isCapabilityDisabled } from '@/lib/capabilitiesHelper';

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
      path: './update-version',
      updateButtonDisplayed: availabilitiesVersionQuery.data?.length > 1,
      disabled: isCapabilityDisabled(service, 'service', 'update'),
    },
    {
      title: t('tablePlan'),
      cell: service.plan,
      path: './update-plan',
      updateButtonDisplayed: availabilitiesPlanQuery.data?.length > 1,
      disabled: isCapabilityDisabled(service, 'service', 'update'),
    },
    {
      title: t('tableFlavor'),
      cell: service.flavor,
      path: './update-flavor',
      updateButtonDisplayed: availabilitiesFlavorQuery.data?.length > 1,
      disabled: isCapabilityDisabled(service, 'serviceFlavor', 'update'),
    },
    service.storage?.size.value && {
      title: t('tableStorage'),
      cell: `${formatStorage(service.storage.size)} ${service.storage.type}`,
      path: './update-flavor',
      disabled: isCapabilityDisabled(service, 'serviceDisk', 'update'),
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
    <table className="border-b border-gray-200 border-collapse w-full">
      <tbody>
        {rows.map((row) => (
          <tr key={row.title} className="border-b border-gray-200">
            <td className="font-semibold px-4 py-2">{row.title}</td>
            <td className="px-4 py-2">{row.cell}</td>
            <td className="px-4 py-2 text-right">
              {row.updateButtonDisplayed && (
                <NavLink
                  data-testid={`update-button-${row.title}`}
                  className="py-0"
                  to={row.path}
                  disabled={row.disabled}
                >
                  {t('tableUpdateButton')}
                </NavLink>
              )}
            </td>
          </tr>
        ))}
        <tr className="border-b border-gray-200">
          <td className="font-semibold px-4 py-2">{t('tableNodes')}</td>
          <td className="px-4 py-2">{service.nodes.length}</td>
          <td className="px-4 py-2 text-right">
            {availabilitiesFlavorQuery.data?.length > 1 && (
              <div className="flex gap-2 justify-end">
                {service.capabilities.nodes?.delete && (
                  <Button
                    data-testid="delete-node-button"
                    mode="ghost"
                    variant="critical"
                    className="p-0 h-auto"
                    onClick={() => navigate('./delete-node')}
                    disabled={isCapabilityDisabled(service, 'nodes', 'delete')}
                  >
                    <MinusCircle className="size-4" />
                  </Button>
                )}
                {service.capabilities.nodes?.create && (
                  <Button
                    data-testid="create-node-button"
                    mode="ghost"
                    className="p-0 h-auto"
                    onClick={() => navigate('./add-node')}
                    disabled={isCapabilityDisabled(service, 'nodes', 'create')}
                  >
                    <PlusCircle className="size-4" />
                  </Button>
                )}
              </div>
            )}
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default UpdateTable;
