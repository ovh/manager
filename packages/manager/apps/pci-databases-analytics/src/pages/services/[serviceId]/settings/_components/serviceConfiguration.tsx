import { Pen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { useServiceData } from '../../layout';
import { Button } from '@/components/ui/button';
import { useModale } from '@/hooks/useModale';
import RenameService from '../../_components/renameService';
import {
  useGetServices,
  useUpdateService,
} from '@/hooks/api/services.api.hooks';
import { useToast } from '@/components/ui/use-toast';
import TimeUpdate from './serviceConfiguration/timeUpdate';
import DeleteService from '../../_components/deleteService';

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
  const { updateService } = useUpdateService({
    onError: (err) => {
      toast.toast({
        title: t('serviceConfigurationUpdateToastErrorTitle'),
        variant: 'destructive',
        description: err.response.data.message,
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
    updateService({
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
    updateService({
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
        <TableBody>
          <TableRow>
            <TableCell className="font-semibold">
              {t('serviceConfigurationServiceName')}
            </TableCell>
            <TableCell>{service.description}</TableCell>
            <TableCell className="text-right">
              <Button
                variant="ghost"
                size="table"
                className="py-0 h-auto"
                onClick={() => renameModale.open()}
              >
                <Pen />
              </Button>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-semibold">
              {t('serviceConfigurationServiceMaintenanceTime')}
            </TableCell>
            <TimeUpdate
              initialValue={convertTimeToDateTime(service.maintenanceTime)}
              onSubmit={onMaintenanceTimeSubmit}
            />
          </TableRow>
          {service.backups?.time && (
            <TableRow>
              <TableCell className="font-semibold">
                {t('serviceConfigurationServiceBackupTime')}
              </TableCell>
              <TimeUpdate
                initialValue={convertTimeToDateTime(service.backups.time)}
                onSubmit={onBackupTimeSubmit}
              />
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Button
        variant="destructive"
        className="w-full bg-background border-2 hover:bg-destructive/10 font-semibold border-destructive text-destructive"
        onClick={() => deleteModale.open()}
      >
        {t('serviceConfigurationDeleteService')}
      </Button>
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
