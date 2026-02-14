import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Badge, Button, useToast } from '@datatr-ux/uxlib';
import { useServiceData } from '../../Service.context';
import { useEditService } from '@/data/hooks/database/service/useEditService.hook';
import TimeUpdate from './serviceConfiguration/TimeUpdate.component';
import { getCdbApiErrorMessage } from '@/lib/apiHelper';
import NavLink from '@/components/links/NavLink.component';
import { isCapabilityDisabled } from '@/lib/capabilitiesHelper';

const ServiceConfiguration = () => {
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/settings',
  );
  const navigate = useNavigate();
  const { service, projectId, serviceQuery } = useServiceData();
  const toast = useToast();
  const { editService } = useEditService({
    onError: (err) => {
      toast.toast({
        title: t('serviceConfigurationUpdateToastErrorTitle'),
        variant: 'critical',
        description: getCdbApiErrorMessage(err),
      });
    },
    onEditSuccess: () => {
      toast.toast({
        title: t('serviceConfigurationUpdateToastSuccessTitle'),
        description: t('serviceConfigurationUpdateToastSuccessDescription'),
      });
      serviceQuery.refetch();
    },
  });

  function convertTimeToDateTime(timeString: string): Date {
    // Create a new date object for the current date
    const now = new Date();
    // Split the time string into its components
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    // Set the time for the date object
    now.setHours(hours);
    now.setMinutes(minutes);
    now.setSeconds(seconds);
    // Return the modified date object
    return now;
  }

  const onMaintenanceTimeSubmit = (maintenanceTime: Date) => {
    editService({
      engine: service.engine,
      projectId,
      serviceId: service.id,
      data: {
        maintenanceTime: maintenanceTime.toLocaleTimeString('en-US', {
          hour12: false,
        }),
      },
    });
  };
  const onBackupTimeSubmit = (backupTime: Date) => {
    editService({
      engine: service.engine,
      projectId,
      serviceId: service.id,
      data: {
        backups: {
          time: backupTime.toLocaleTimeString('en-US', { hour12: false }),
        },
      },
    });
  };

  return (
    <>
      <div data-testid="service-configuration-table">
        <table className="border-b border-gray-200 border-collapse w-full">
          <tbody>
            {service.capabilities.maintenanceTime?.read && (
              <tr
                className="border-b border-gray-200"
                data-testid="maintenance-time"
              >
                <td className="font-semibold px-4 py-2">
                  {t('serviceConfigurationServiceMaintenanceTime')}
                </td>
                <td className="col-span-2" colSpan={3}>
                  <TimeUpdate
                    readonly={!service.capabilities.maintenanceTime.update}
                    disabled={isCapabilityDisabled(
                      service,
                      'maintenanceTime',
                      'update',
                    )}
                    initialValue={convertTimeToDateTime(
                      service.maintenanceTime,
                    )}
                    onSubmit={onMaintenanceTimeSubmit}
                  />
                </td>
              </tr>
            )}
            {service.capabilities.backupTime?.read && (
              <tr
                className="border-b border-gray-200"
                data-testid="backup-time"
              >
                <td className="font-semibold px-4 py-2">
                  {t('serviceConfigurationServiceBackupTime')}
                </td>
                <td className="col-span-2" colSpan={3}>
                  <TimeUpdate
                    readonly={!service.capabilities.backupTime.update}
                    disabled={isCapabilityDisabled(
                      service,
                      'backupTime',
                      'update',
                    )}
                    initialValue={convertTimeToDateTime(service.backups.time)}
                    onSubmit={onBackupTimeSubmit}
                  />
                </td>
              </tr>
            )}
            {service.capabilities.deletionProtection?.read && (
              <tr className="border-b border-gray-200">
                <td className="font-semibold px-4 py-2">
                  {t('serviceConfigurationServiceDeletionProtection')}
                </td>
                <td className="font-semibold">
                  <Badge
                    variant={service.deletionProtection ? 'success' : 'neutral'}
                  >
                    {!service.deletionProtection
                      ? t('serviceDeletionProtectionDeactivated')
                      : t('serviceDeletionProtectionActivated')}
                  </Badge>
                </td>
                <td className="align-middle text-right">
                  <NavLink
                    data-testid="service-config-deletion-protection-link"
                    className="py-0"
                    to={'./deletion-protection'}
                    disabled={isCapabilityDisabled(
                      service,
                      'deletionProtection',
                      'update',
                    )}
                  >
                    {!service.deletionProtection
                      ? t('serviceDeletionProtectionActivate')
                      : t('serviceDeletionProtectionDeactivate')}
                  </NavLink>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {service.capabilities.service?.delete && (
        <Button
          data-testid="service-config-delete-button"
          disabled={isCapabilityDisabled(service, 'service', 'delete')}
          mode="outline"
          variant="critical"
          onClick={() => navigate('./delete')}
        >
          {t('serviceConfigurationDeleteService')}
        </Button>
      )}
    </>
  );
};

export default ServiceConfiguration;
