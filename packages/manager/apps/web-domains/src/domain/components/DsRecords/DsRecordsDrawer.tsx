import { Drawer, useNotifications } from '@ovh-ux/manager-react-components';
import { Dispatch, SetStateAction } from 'react';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useTranslation } from 'react-i18next';
import DnssecForm from '@/domain/components/DsRecords/DsRecordsForm';
import { DrawerBehavior } from '@/common/types/common.types';
import { FormProvider, useForm } from 'react-hook-form';
import {
  TDnssecConfiguration,
  TDsDataInterface,
} from '@/domain/types/dnssecConfiguration';
import { TDomainResource } from '@/domain/types/domainResource';
import { useUpdateDomainResource } from '@/domain/hooks/data/query';
import { Text } from '@ovhcloud/ods-react';

interface DnssecDrawerProps {
  readonly drawer: DrawerBehavior;
  readonly targetSpec: TDomainResource['targetSpec'];
  readonly serviceName: string;
  readonly checksum: string;
  readonly supportedAlgorithms: TDnssecConfiguration['supportedAlgorithms'];
  readonly setDrawer: Dispatch<SetStateAction<DrawerBehavior>>;
}

export default function DsRecordsDrawer({
  drawer,
  targetSpec,
  serviceName,
  checksum,
  supportedAlgorithms,
  setDrawer,
}: DnssecDrawerProps) {
  const { t } = useTranslation('domain');
  const { addError, addSuccess, clearNotifications } = useNotifications();
  const { updateDomain, isUpdateDomainPending } = useUpdateDomainResource(
    serviceName,
  );
  const { dnssecConfiguration } = targetSpec;
  const formDataValues: TDsDataInterface = {
    keyTag: null,
    flags: 257,
    //We set the first value from the api return
    algorithm: supportedAlgorithms[0]?.number,
    publicKey: '',
  };
  const formData = useForm<TDsDataInterface>({
    mode: 'onChange',
    values: formDataValues,
  });
  const { handleSubmit, formState, clearErrors, reset } = formData;
  const onDismiss = () => {
    reset(formDataValues);
    setDrawer({
      isOpen: false,
      action: null,
    });
    clearErrors();
  };
  return (
    <Drawer
      data-testid="drawer"
      heading={t('domain_tab_dsrecords_drawer_add_title')}
      isOpen={drawer.isOpen}
      onDismiss={() => onDismiss()}
      primaryButtonLabel={t(`${NAMESPACES.ACTIONS}:validate`)}
      isPrimaryButtonDisabled={!formState.isValid}
      secondaryButtonLabel={t(`${NAMESPACES.ACTIONS}:cancel`)}
      isPrimaryButtonLoading={isUpdateDomainPending}
      onPrimaryButtonClick={handleSubmit((values) => {
        updateDomain(
          {
            checksum,
            currentTargetSpec: targetSpec,
            updatedSpec: {
              dnssecConfiguration: {
                dsData: [
                  ...dnssecConfiguration.dsData,
                  {
                    keyTag: Number(values.keyTag),
                    flags: values.flags,
                    algorithm: Number(values.algorithm),
                    publicKey: values.publicKey,
                  },
                ],
              },
            },
          },
          {
            onSuccess: () => {
              addSuccess(
                t('domain_tab_dsrecords_drawer_add_success', {
                  keyTag: values.keyTag,
                }),
              );
            },
            onError: (e) => {
              addError(
                t('domain_tab_dsrecords_drawer_add_error', {
                  error: e.message,
                }),
              );
            },
            onSettled: () => {
              clearNotifications();
              onDismiss();
            },
          },
        );
      })}
      onSecondaryButtonClick={() => onDismiss()}
    >
      <Text className="mb-6">
        {t(`${NAMESPACES.FORM}:error_required_fields`)}
      </Text>
      <FormProvider {...formData}>
        <DnssecForm supportedAlgorithms={supportedAlgorithms} />
      </FormProvider>
    </Drawer>
  );
}
