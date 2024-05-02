import { ArrowRight, Construction } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useGetMaintenances } from '@/hooks/api/maintenances.api.hooks';
import { useServiceData } from '../../layout';
import { POLLING } from '@/configuration/polling';
import { database } from '@/models/database';
import { Link } from '@/components/links';

const Maintenance = () => {
  const { projectId, service } = useServiceData();
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/dashboard',
  );
  const maintenanceQuery = useGetMaintenances(
    projectId,
    service.engine,
    service.id,
    {
      refetchInterval: POLLING.MAINTENANCE,
    },
  );
  const plannedMaintenance: number =
    maintenanceQuery.data?.filter(
      (maintenance) =>
        maintenance.status ===
          database.service.maintenance.StatusEnum.SCHEDULED ||
        maintenance.status === database.service.maintenance.StatusEnum.PENDING,
    ).length || 0;
  return (
    <>
      {maintenanceQuery.isSuccess && (
        <div data-testid="dashboard-maintenance-container">
          {plannedMaintenance === 0 && (
            <div>
              <p>{t('noMaintenanceDescription')}</p>
              <Link
                to="./settings#configuration"
                className="flex flex-row gap-1 mt-2"
              >
                {t('noMaintenanceLink')}
                <ArrowRight className="w-4 h-4 mt-1 text-primary" />
              </Link>
            </div>
          )}
          <div>
            {plannedMaintenance === 1 && (
              <>
                <Construction className="h-4 w-4 mr-1 text-red-600 inline" />
                <span
                  data-testid="one-maintenance-span"
                  className="font-semibold text-red-600 mr-1"
                >
                  {t('oneMaintenanceDescription1', {
                    number: plannedMaintenance,
                  })}
                </span>
                <span>{t('oneMaintenanceDescription2')}</span>
              </>
            )}
            {plannedMaintenance > 1 && (
              <>
                <Construction className="h-4 w-4 mr-1 text-red-600 inline" />
                <span
                  data-testid="many-maintenance-span"
                  className="font-semibold text-red-600 mr-1"
                >
                  {t('manyMaintenanceDescription1', {
                    number: plannedMaintenance,
                  })}
                </span>
                <span>{t('manyMaintenanceDescription2')}</span>
              </>
            )}
            <Link
              to="./settings#maintenances"
              className="flex flex-row gap-1 mt-2"
            >
              {t('maintenanceLink')}
              <ArrowRight className="w-4 h-4 mt-1 text-primary" />
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default Maintenance;
