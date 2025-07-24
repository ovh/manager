import { Switch, useToast } from '@datatr-ux/uxlib';
import { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useServiceData } from '../../Service.context';
import { useEditService } from '@/hooks/api/database/service/useEditService.hook';
import * as database from '@/types/cloud/project/database';
import A from '@/components/links/A.component';

const KafkaSettingsTile = () => {
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/settings',
  );
  const { service, projectId, serviceQuery } = useServiceData<
    database.kafka.Service
  >();

  const restApiEnabled = !!('restApi' in service && service.restApi);
  const schemaRegistryEnabled = !!(
    'schemaRegistry' in service && service.schemaRegistry
  );

  const [restApiState, setRestApiState] = useState(restApiEnabled);
  const [schemaRegistryState, setSchemaRegistryState] = useState(
    restApiEnabled,
  );

  const toast = useToast();
  const { editService, isPending } = useEditService<database.kafka.Service>({
    onError: (err, variables) => {
      toast.toast({
        title: t('toggleKafkaSettingsErrorTitle'),
        variant: 'destructive',
        description: err.response.data.message,
      });
      if (variables && 'restApi' in variables.data) {
        setRestApiState(restApiEnabled);
      } else if (variables && 'schemaRegistry' in variables.data) {
        setSchemaRegistryState(schemaRegistryEnabled);
      }
    },
    onEditSuccess: (updatedService) => {
      const restApiChanged = updatedService.restApi !== service.restApi;
      const schemaRegistryChanged =
        updatedService.schemaRegistry !== service.schemaRegistry;

      if (restApiChanged) {
        toast.toast({
          title: t('toggleRestApiSuccessTitle'),
          description: updatedService.restApi
            ? t('toggleRestApiEnabledDescription')
            : t('toggleRestApiDisabledDescription'),
        });
      } else if (schemaRegistryChanged) {
        toast.toast({
          title: t('toggleSchemaRegistrySuccessTitle'),
          description: updatedService.schemaRegistry
            ? t('toggleSchemaRegistryEnabledDescription')
            : t('toggleSchemaRegistryDisabledDescription'),
        });
      }

      serviceQuery.refetch();
    },
  });

  useEffect(() => {
    setRestApiState(service.restApi);
  }, [service.restApi]);

  useEffect(() => {
    setSchemaRegistryState(service.schemaRegistry);
  }, [service.schemaRegistry]);

  const handleSwitchChange = (newValue: boolean) => {
    setRestApiState(newValue);
    editService({
      serviceId: service.id,
      projectId,
      engine: service.engine,
      data: {
        restApi: newValue,
      },
    });
  };

  const handleSchemaRegistryChange = (newValue: boolean) => {
    setSchemaRegistryState(newValue);
    editService({
      serviceId: service.id,
      projectId,
      engine: service.engine,
      data: {
        schemaRegistry: newValue,
      },
    });
  };

  const karapaceLink = 'https://karapace.io/';

  return (
    <div>
      {service.capabilities.restApi && (
        <div className="mb-2 pb-2 border-b border-border">
          <b>{t('kafkaSettingsRestApiTitle')}</b>
          <div className="flex w-full justify-between gap-2">
            <div>
              <p className="text-sm">
                <Trans
                  t={t}
                  i18nKey={'kafkaSettingsRestApiDescription'}
                  components={{
                    anchor: <A href={karapaceLink} target="_blank"></A>,
                  }}
                />
              </p>
            </div>
            <Switch
              checked={restApiState}
              disabled={
                isPending ||
                service.capabilities.restApi?.update !==
                  database.service.capability.StateEnum.enabled
              }
              onCheckedChange={handleSwitchChange}
            />
          </div>
        </div>
      )}

      {service.capabilities.schemaRegistry && (
        <div>
          <b>{t('kafkaSettingsSchemaRegistryTitle')}</b>
          <div className="flex w-full justify-between gap-2">
            <div>
              <p className="text-sm">
                <Trans
                  t={t}
                  i18nKey={'kafkaSettingsSchemaRegistryDescription'}
                  components={{
                    anchor: <A href={karapaceLink} target="_blank"></A>,
                  }}
                />
              </p>
            </div>
            <Switch
              id="kafka-registry-rest"
              checked={schemaRegistryState}
              disabled={
                isPending ||
                service.capabilities.schemaRegistry?.update !==
                  database.service.capability.StateEnum.enabled
              }
              onCheckedChange={handleSchemaRegistryChange}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default KafkaSettingsTile;
