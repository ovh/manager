import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Badge, Button, useToast } from '@datatr-ux/uxlib';
import { useServiceData } from '../../Service.context';
import { useEditService } from '@/hooks/api/database/service/useEditService.hook';
import TimeUpdate from './serviceConfiguration/TimeUpdate.component';
import * as database from '@/types/cloud/project/database';
import { getCdbApiErrorMessage } from '@/lib/apiHelper';
import NavLink from '@/components/links/NavLink.component';

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
    //   <div data-testid="service-configuration-table">
    //     {service.capabilities.maintenanceTime?.read && (
    //       <>
    //         <Separator className="my-2" />
    //         <div
    //           className="grid grid-cols-4 gap-x-4 items-center"
    //           data-testid="maintenance-time"
    //         >
    //           <div className="font-semibold col-span-2">
    //             {t('serviceConfigurationServiceMaintenanceTime')}
    //           </div>
    //           <TimeUpdate
    //             readonly={!service.capabilities.maintenanceTime.update}
    //             disabled={
    //               service.capabilities.maintenanceTime?.update ===
    //               database.service.capability.StateEnum.disabled
    //             }
    //             initialValue={convertTimeToDateTime(service.maintenanceTime)}
    //             onSubmit={onMaintenanceTimeSubmit}
    //           />
    //         </div>
    //       </>
    //     )}

    //     {service.capabilities.backupTime?.read && (
    //       <>
    //         <Separator className="my-2" />
    //         <div
    //           className="grid grid-cols-4 gap-x-4 items-center"
    //           data-testid="backup-time"
    //         >
    //           <div className="font-semibold col-span-2">
    //             {t('serviceConfigurationServiceBackupTime')}
    //           </div>
    //           <TimeUpdate
    //             readonly={!service.capabilities.backupTime.update}
    //             disabled={
    //               service.capabilities.backupTime?.update ===
    //               database.service.capability.StateEnum.disabled
    //             }
    //             initialValue={convertTimeToDateTime(service.backups.time)}
    //             onSubmit={onBackupTimeSubmit}
    //           />
    //         </div>
    //       </>
    //     )}

    //     {service.capabilities.deletionProtection?.read && (
    //       <>
    //         <Separator className="my-2" />
    //         <div
    //           className="grid grid-cols-4 gap-x-4 items-center"
    //         >
    //           <div className="font-semibold col-span-3">
    //             {t('serviceConfigurationServiceDeletionProtection')}
    //           </div>
    //           <div className="p-0 flex justify-end items-center flex-wrap gap-2">
    //             <NavLink
    //               data-testid="service-config-deletion-protection-link"
    //               className="py-0"
    //               to={'./deletion-protection'}
    //               disabled={
    //                 service.capabilities.deletionProtection?.update ===
    //                 database.service.capability.StateEnum.disabled
    //               }
    //             >
    //               {!service.deletionProtection
    //                 ? t('serviceDeletionProtectionActivate')
    //                 : t('serviceDeletionProtectionActivatedDeactivate')}
    //             </NavLink>
    //           </div>
    //         </div>
    //       </>
    //     )}
    //   </div>

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
                    disabled={
                      service.capabilities.maintenanceTime?.update ===
                      database.service.capability.StateEnum.disabled
                    }
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
                    disabled={
                      service.capabilities.backupTime?.update ===
                      database.service.capability.StateEnum.disabled
                    }
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
                    disabled={
                      service.capabilities.deletionProtection?.update ===
                      database.service.capability.StateEnum.disabled
                    }
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
          disabled={
            service.capabilities.service?.delete ===
            database.service.capability.StateEnum.disabled
          }
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
