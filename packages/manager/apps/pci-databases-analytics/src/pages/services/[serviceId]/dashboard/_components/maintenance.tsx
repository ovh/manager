import { ArrowRight, Construction } from 'lucide-react';
import { useGetMaintenances } from '@/hooks/api/maintenance.api.hooks';
import { useServiceData } from '../../layout';
import { POLLING } from '@/configuration/polling';
import { database } from '@/models/database';
import { Link } from '@/components/links';

const Maintenance = () => {
  const { projectId, service } = useServiceData();
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
      {plannedMaintenance > 0 ? (
        <div>
          <div className="flex flex-row gap-2">
            <Construction className="h-4 w-4 mt-1 text-red-600" />
            <p className="font-semibold text-red-600">
              {plannedMaintenance} maintenance(s)
            </p>
            <p>est/sont prévue(es) sur votre service</p>
          </div>
          <Link to="./settings" className="flex flex-row gap-1 mt-2">
            Gérer et plannifier mes futures maintenances
            <ArrowRight className="w-4 h-4 mt-1 text-primary" />
          </Link>
        </div>
      ) : (
        <div>
          <p>Aucune maintenance n'est prévue sur votre service</p>
          <Link to="./settings" className="flex flex-row gap-1 mt-2">
            Plannifier mes futures maintenances
            <ArrowRight className="w-4 h-4 mt-1 text-primary" />
          </Link>
        </div>
      )}
    </>
  );
};

export default Maintenance;
