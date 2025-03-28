import { useTranslation } from 'react-i18next';
import { Alert, AlertDescription, Skeleton } from '@datatr-ux/uxlib';
import { useServiceData } from '../../Service.context';
import AdvancedConfigurationForm from './advancedConfiguration/AdvancedConfigurationForm.component';
import { useGetAdvancedConfiguration } from '@/hooks/api/database/advancedConfiguration/useGetAdvancedConfiguration.hook';
import { useGetAdvancedConfigurationCapabilities } from '@/hooks/api/database/advancedConfiguration/useGetAdvancedConfigurationCapabilities.hook';

const AdvancedConfigurationUpdate = () => {
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/settings',
  );
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
      <Alert variant="primary">
        <AlertDescription>
          {t('advancedConfigurationAlertMessage')}
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
        <Skeleton
          data-testid="advanced-configuration-skeleton"
          className="w-full h-64 mt-2"
        />
      )}
    </>
  );
};

export default AdvancedConfigurationUpdate;
