import { useTranslation } from 'react-i18next';
import { useServiceData } from '../../Service.context';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import FormattedDate from '@/components/formatted-date/FormattedDate.component';
import { Button } from '@/components/ui/button';
import { Badge, BadgeProps } from '@/components/ui/badge';
import * as database from '@/types/cloud/project/database';
import { useToast } from '@/components/ui/use-toast';
import { useGetMaintenances } from '@/hooks/api/database/maintenance/useGetMaintenances.hook';
import { useApplyMaintenance } from '@/hooks/api/database/maintenance/useApplyMaintenance.hook';
import { getCdbApiErrorMessage } from '@/lib/apiHelper';

const Maintenances = () => {
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/settings',
  );
  const { service, projectId, serviceQuery } = useServiceData();
  const toast = useToast();
  const maintenanceQuery = useGetMaintenances(
    projectId,
    service.engine,
    service.id,
  );
  const { applyMaintenance, isPending } = useApplyMaintenance({
    onError: (err) => {
      toast.toast({
        title: t('maintenanceApplyToastErrorTitle'),
        variant: 'destructive',
        description: getCdbApiErrorMessage(err),
      });
    },
    onSuccess: () => {
      toast.toast({
        title: t('maintenanceApplyToastSuccessTitle'),
        description: t('maintenanceApplyToastSuccessDescription'),
      });
      serviceQuery.refetch();
      maintenanceQuery.refetch();
    },
  });
  if (maintenanceQuery.isLoading) {
    return (
      <Skeleton
        data-testid="maintenance-settings-skeleton"
        className="w-full h20"
      />
    );
  }
  if (maintenanceQuery.data.length === 0) {
    return (
      <Alert variant="info">
        <AlertDescription>
          {t('maintenancesNoPlannedMaintenance')}
        </AlertDescription>
      </Alert>
    );
  }
  const canApply = (maintenance: database.service.Maintenance) => {
    return (
      service.capabilities.maintenanceApply.create &&
      [
        database.service.maintenance.StatusEnum.PENDING,
        database.service.maintenance.StatusEnum.SCHEDULED,
      ].includes(maintenance.status)
    );
  };
  const getMaintenanceVariant = (
    status: database.service.maintenance.StatusEnum,
  ): BadgeProps['variant'] => {
    switch (status) {
      case database.service.maintenance.StatusEnum.ERROR:
        return 'error';
      case database.service.maintenance.StatusEnum.APPLIED:
        return 'success';
      case database.service.maintenance.StatusEnum.APPLYING:
        return 'warning';
      case database.service.maintenance.StatusEnum.PENDING:
      case database.service.maintenance.StatusEnum.SCHEDULED:
      default:
        return 'default';
    }
  };
  return (
    <div className="grid gap-2">
      {maintenanceQuery.data.map((maintenance) => (
        <Alert variant="info" key={maintenance.id}>
          <AlertDescription>
            <div className="flex flex-col items-stretch md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-col items-start w-full">
                <div className="flex flex-wrap gap-2">
                  <b>{t('maintenancesStatus')}</b>
                  <Badge
                    className="text-xs"
                    variant={getMaintenanceVariant(maintenance.status)}
                  >
                    {maintenance.status}
                  </Badge>
                  {maintenance.scheduledAt && (
                    <>
                      <b>{t('maintenancesScheduledDate')}</b>
                      <FormattedDate
                        date={new Date(maintenance.scheduledAt)}
                        options={{
                          dateStyle: 'medium',
                          timeStyle: 'medium',
                        }}
                      />
                    </>
                  )}
                  {maintenance.appliedAt && (
                    <>
                      <b>{t('maintenancesAppliedAtDate')}</b>
                      <FormattedDate
                        date={new Date(maintenance.appliedAt)}
                        options={{
                          dateStyle: 'medium',
                          timeStyle: 'medium',
                        }}
                      />
                    </>
                  )}
                </div>
                <span>{maintenance.description}</span>
              </div>
              {canApply(maintenance) && (
                <Button
                  data-testid="apply-maintenance-button"
                  disabled={
                    isPending ||
                    service.capabilities.maintenanceApply.create ===
                      database.service.capability.StateEnum.disabled
                  }
                  size="sm"
                  onClick={() =>
                    applyMaintenance({
                      engine: service.engine,
                      projectId,
                      serviceId: service.id,
                      maintenanceId: maintenance.id,
                    })
                  }
                >
                  <b>{t('maintenancesApply')}</b>
                </Button>
              )}
            </div>
          </AlertDescription>
        </Alert>
      ))}
    </div>
  );
};

export default Maintenances;
