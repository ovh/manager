import { useTranslation } from 'react-i18next';

import {
  Badge,
  BadgeProps,
  Skeleton,
  Alert,
  AlertDescription,
  Button,
  useToast,
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
  Separator,
} from '@datatr-ux/uxlib';
import { ChevronDown } from 'lucide-react';

import { useServiceData } from '../../Service.context';
import FormattedDate from '@/components/formatted-date/FormattedDate.component';
import * as database from '@/types/cloud/project/database';
import { useGetMaintenances } from '@/data/hooks/database/maintenance/useGetMaintenances.hook';
import { useApplyMaintenance } from '@/data/hooks/database/maintenance/useApplyMaintenance.hook';
import { getCdbApiErrorMessage } from '@/lib/apiHelper';
import { isCapabilityDisabled } from '@/lib/capabilitiesHelper';

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
        variant: 'critical',
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
      <Alert variant="information" className="rounded-md">
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
        return 'critical';
      case database.service.maintenance.StatusEnum.APPLIED:
        return 'success';
      case database.service.maintenance.StatusEnum.APPLYING:
        return 'warning';
      case database.service.maintenance.StatusEnum.PENDING:
      case database.service.maintenance.StatusEnum.SCHEDULED:
      default:
        return 'information';
    }
  };

  return (
    <div className="grid gap-2">
      <Separator className="my-2" />
      {maintenanceQuery.data.map((maintenance, key) => (
        <div key={key}>
          <Collapsible
            key={maintenance.id}
            defaultOpen={
              maintenance.status !==
                database.service.maintenance.StatusEnum.APPLIED &&
              maintenance.status !==
                database.service.maintenance.StatusEnum.ERROR
            }
          >
            <CollapsibleTrigger className="flex items-center justify-between gap-4 w-full px-4 py-2 rounded cursor-pointer [&[data-state=open]>svg]:rotate-180">
              <div className="flex flex-wrap gap-2">
                <b>{t('maintenancesStatus')}</b>
                <Badge
                  className="capitalize"
                  variant={getMaintenanceVariant(maintenance.status)}
                >
                  {maintenance.status.toLocaleLowerCase()}
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
              <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 py-2">
              <p className="text-justify">{maintenance.description}</p>
              {canApply(maintenance) && (
                <Button
                  data-testid="apply-maintenance-button"
                  disabled={
                    isPending ||
                    isCapabilityDisabled(service, 'maintenanceApply', 'create')
                  }
                  size="sm"
                  className="mt-2"
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
            </CollapsibleContent>
          </Collapsible>
          <Separator className="my-2" />
        </div>
      ))}
    </div>
  );
};

export default Maintenances;
