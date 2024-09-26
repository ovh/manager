import { Pen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { useServiceData } from '../../Service.context';
import { Button } from '@/components/ui/button';
import { useModale } from '@/hooks/useModale';
import RenameService from '../../_components/RenameService.component';
import { useEditService } from '@/hooks/api/database/service/useEditService.hook';
import { useGetServices } from '@/hooks/api/database/service/useGetServices.hook';
import { useToast } from '@/components/ui/use-toast';
import TimeUpdate from './serviceConfiguration/TimeUpdate.component';
import DeleteService from '../../_components/DeleteService.component';
import * as database from '@/types/cloud/project/database';
import { getCdbApiErrorMessage } from '@/lib/apiHelper';

const ServiceConfiguration = () => {
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/settings',
  );
  const navigate = useNavigate();
  const renameModale = useModale('rename');
  const deleteModale = useModale('delete');
  const { service, projectId, serviceQuery } = useServiceData();
  const getServicesQuery = useGetServices(projectId, {
    enabled: false,
  });
  const toast = useToast();
  const { editService } = useEditService({
    onError: (err) => {
      toast.toast({
        title: t('serviceConfigurationUpdateToastErrorTitle'),
        variant: 'destructive',
        description: getCdbApiErrorMessage(err),
      });
    },
    onSuccess: () => {
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
                  data-testid="service-confi-rename-button"
                  disabled={
                    service.capabilities.service?.update ===
                    database.service.capability.StateEnum.disabled
                  }
                  variant="ghost"
                  size="table"
                  className="py-0 h-auto"
                  onClick={() => renameModale.open()}
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
        </TableBody>
      </Table>
      {service.capabilities.service?.delete && (
        <Button
          data-testid="service-confi-delete-button"
          disabled={
            service.capabilities.service?.delete ===
            database.service.capability.StateEnum.disabled
          }
          variant="destructive"
          className="w-full bg-background border-2 hover:bg-destructive/10 font-semibold border-destructive text-destructive"
          onClick={() => deleteModale.open()}
        >
          {t('serviceConfigurationDeleteService')}
        </Button>
      )}
      <RenameService
        controller={renameModale.controller}
        service={service}
        onSuccess={() => {
          renameModale.close();
          serviceQuery.refetch();
        }}
      />
      <DeleteService
        controller={deleteModale.controller}
        service={service}
        onSuccess={() => {
          deleteModale.close();
          serviceQuery.refetch();
          getServicesQuery.refetch();
          navigate(`../../`);
        }}
      />
    </>
  );
};

export default ServiceConfiguration;
