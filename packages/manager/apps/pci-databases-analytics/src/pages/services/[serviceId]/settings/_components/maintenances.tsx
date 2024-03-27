import {
  useApplyMaintenance,
  useGetMaintenances,
} from '@/hooks/api/maintenances.api.hooks';
import { useServiceData } from '../../layout';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import FormattedDate from '@/components/table-date';
import { Button } from '@/components/ui/button';
import { Badge, BadgeProps } from '@/components/ui/badge';
import { database } from '@/models/database';
import { useToast } from '@/components/ui/use-toast';

const Maintenances = () => {
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
        title: 'Erreur',
        variant: 'destructive',
        description: err.message,
      });
    },
    onSuccess: () => {
      toast.toast({
        title: 'Succès',
        description: 'La maintenance a été appliquée avec succès',
      });
      serviceQuery.refetch();
      maintenanceQuery.refetch();
    },
  });
  if (maintenanceQuery.isLoading) {
    return <Skeleton className="w-full h20" />;
  }
  if (maintenanceQuery.data.length === 0) {
    return (
      <Alert variant="info">
        <AlertDescription>Aucune maintenance n'est prévue.</AlertDescription>
      </Alert>
    );
  }
  const canApply = (maintenance: database.service.Maintenance) => {
    return [
      database.service.maintenance.StatusEnum.PENDING,
      database.service.maintenance.StatusEnum.SCHEDULED,
    ].includes(maintenance.status);
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
            <div className="flex content-between gap-2">
              <div className="flex flex-col items-start w-full">
                <div className="flex gap-2">
                  <b>Statut:</b>
                  <Badge
                    className="text-xs"
                    variant={getMaintenanceVariant(maintenance.status)}
                  >
                    {maintenance.status}
                  </Badge>
                  {maintenance.scheduledAt && (
                    <>
                      <b>Date planifiée: </b>
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
                      <b>Date d'application: </b>
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
                  disabled={isPending}
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
                  Appliquer
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
