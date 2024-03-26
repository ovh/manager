import {
  useGetAdvancedConfiguration,
  useGetAdvancedConfigurationCapabilities,
} from '@/hooks/api/advancedConfiguration.api.hook';
import { useServiceData } from '../../layout';
import { Alert, AlertDescription } from '@/components/ui/alert';
import AdvancedConfigurationForm from './advancedConfiguration/advancedConfigurationForm';
import { Skeleton } from '@/components/ui/skeleton';

const AdvancedConfigurationUpdate = () => {
  const { projectId, service } = useServiceData();
  const advancedConfigurationQuery = useGetAdvancedConfiguration(
    projectId,
    service.engine,
    service.id,
  );
  const advancedConfigurationCapabilitiesQuery = useGetAdvancedConfigurationCapabilities(
    projectId,
    service.engine,
    service.id,
  );

  return (
    <>
      <Alert variant="info">
        <AlertDescription>
          La modification de la configuration avancée peut entraîner un
          redémarrage du service.
        </AlertDescription>
      </Alert>
      {advancedConfigurationQuery.isSuccess &&
      advancedConfigurationCapabilitiesQuery.isSuccess ? (
        <AdvancedConfigurationForm
          advancedConfiguration={advancedConfigurationQuery.data}
          capabilities={advancedConfigurationCapabilitiesQuery.data}
          onSucces={() => {
            advancedConfigurationQuery.refetch();
            advancedConfigurationCapabilitiesQuery.refetch();
          }}
          key={JSON.stringify(advancedConfigurationQuery.data)}
        />
      ) : (
        <Skeleton className="w-full h-64 mt-2" />
      )}
    </>
  );
};

export default AdvancedConfigurationUpdate;
