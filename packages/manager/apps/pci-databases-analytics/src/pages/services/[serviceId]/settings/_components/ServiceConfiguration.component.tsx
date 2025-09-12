import { Pen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Badge,
  Button,
  Table,
  TableBody,
  TableCell,
  TableRow,
  useToast,
} from '@datatr-ux/uxlib';
import { useServiceData } from '../../Service.context';
import { useEditService } from '@/hooks/api/database/service/useEditService.hook';
import TimeUpdate from './serviceConfiguration/TimeUpdate.component';
import * as database from '@/types/cloud/project/database';
import { getCdbApiErrorMessage } from '@/lib/apiHelper';

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
        variant: 'destructive',
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
      <Table>
        <TableBody data-testid="service-configuration-table">
          <TableRow>
            <TableCell className="font-semibold">
              {t('serviceConfigurationServiceName')}
            </TableCell>
            <TableCell>{service.description}</TableCell>
            {service.capabilities.service?.update && (
              <TableCell className="text-right">
                <Button
                  data-testid="service-config-rename-button"
                  disabled={
                    service.capabilities.service?.update ===
                    database.service.capability.StateEnum.disabled
                  }
                  className="text-text p-0 bg-transparent hover:bg-primary-100 hover:text-primary-700 hover:font-semibold h-4 w-4 my-auto"
                  onClick={() => navigate('./rename')}
                >
                  <Pen />
                </Button>
              </TableCell>
            )}
          </TableRow>
          {service.capabilities.maintenanceTime?.read && (
            <TableRow>
              <TableCell
                data-testid="maintenance-time-cell"
                className="font-semibold"
              >
                {t('serviceConfigurationServiceMaintenanceTime')}
              </TableCell>
              <TimeUpdate
                readonly={!service.capabilities.maintenanceTime.update}
                disabled={
                  service.capabilities.maintenanceTime?.update ===
                  database.service.capability.StateEnum.disabled
                }
                initialValue={convertTimeToDateTime(service.maintenanceTime)}
                onSubmit={onMaintenanceTimeSubmit}
              />
            </TableRow>
          )}
          {service.capabilities.backupTime?.read && (
            <TableRow>
              <TableCell
                data-testid="backup-time-cell"
                className="font-semibold"
              >
                {t('serviceConfigurationServiceBackupTime')}
              </TableCell>
              <TimeUpdate
                readonly={!service.capabilities.backupTime.update}
                disabled={
                  service.capabilities.backupTime?.update ===
                  database.service.capability.StateEnum.disabled
                }
                initialValue={convertTimeToDateTime(service.backups.time)}
                onSubmit={onBackupTimeSubmit}
              />
            </TableRow>
          )}
          {service.capabilities.deletionProtection?.read && (
            <TableRow>
              <TableCell className="font-semibold">
                {t('serviceConfigurationServiceDeletionProtection')}
              </TableCell>
              <TableCell>
                <Badge
                  variant={service.deletionProtection ? 'success' : 'neutral'}
                >
                  {service.deletionProtection
                    ? t('serviceDeletionProtectionActivated')
                    : t('serviceDeletionProtectionActivatedDeactivated')}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  data-testid="service-config-deletion-protection-button"
                  disabled={
                    service.capabilities.deletionProtection?.update ===
                    database.service.capability.StateEnum.disabled
                  }
                  className="text-text p-0 bg-transparent hover:bg-primary-100 hover:text-primary-700 hover:font-semibold h-4 w-4 my-auto"
                  onClick={() => navigate('./deletion-protection')}
                >
                  <Pen />
                </Button>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {service.capabilities.service?.delete && (
        <Button
          data-testid="service-config-delete-button"
          disabled={
            service.capabilities.service?.delete ===
            database.service.capability.StateEnum.disabled
          }
          variant="destructive"
          className="w-full bg-background border-2 hover:bg-destructive/10 font-semibold border-destructive text-destructive"
          onClick={() => navigate('./delete')}
        >
          {t('serviceConfigurationDeleteService')}
        </Button>
      )}
    </>
  );
};

export default ServiceConfiguration;
