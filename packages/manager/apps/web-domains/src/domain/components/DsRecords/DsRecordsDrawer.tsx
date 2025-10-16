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
import { DrawerActionEnum } from '@/common/enum/common.enum';

interface DnssecDrawerProps {
  readonly drawer: DrawerBehavior;
  readonly targetSpec: TDomainResource['targetSpec'];
  readonly serviceName: string;
  readonly checksum: string;
  readonly supportedAlgorithms: TDnssecConfiguration['supportedAlgorithms'];
  readonly dsRecordsData: TDsDataInterface;
  readonly setDrawer: Dispatch<SetStateAction<DrawerBehavior>>;
}

export default function DsRecordsDrawer({
  drawer,
  targetSpec,
  serviceName,
  checksum,
  supportedAlgorithms,
  dsRecordsData,
  setDrawer,
}: DnssecDrawerProps) {
  const { t } = useTranslation('domain');
  const isAddAction = drawer.action === DrawerActionEnum.Add;
  const { addError, addSuccess, clearNotifications } = useNotifications();
  const { updateDomain, isUpdateDomainPending } = useUpdateDomainResource(
    serviceName,
  );
  const { dnssecConfiguration } = targetSpec;
  const { keyTag, algorithm, publicKey } = dsRecordsData;
  const formDataValues: TDsDataInterface = {
    keyTag: isAddAction ? null : keyTag,
    flags: 257,
    //We set the first value from the api return
    algorithm: isAddAction ? supportedAlgorithms[0]?.number : algorithm,
    publicKey: isAddAction ? '' : publicKey,
  };
  const formData = useForm<TDsDataInterface>({
    mode: 'onChange',
    values: formDataValues,
  });
  const { handleSubmit, formState, clearErrors, reset } = formData;
  const onDismiss = () => {
    // We added the if here to allow the input to be empty if you re-open the drawer on add mode.
    if (isAddAction) {
      reset(formDataValues);
    }
    setDrawer({
      isOpen: false,
      action: null,
    });
    clearErrors();
  };
  return (
    <Drawer
      data-testid="drawer"
      heading={
        isAddAction
          ? t('domain_tab_dsrecords_drawer_add_title')
          : t('domain_tab_dsrecords_drawer_modify_title')
      }
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
                isAddAction
                  ? t('domain_tab_dsrecords_drawer_add_success', {
                      keyTag: values.keyTag,
                    })
                  : t('domain_tab_dsrecords_drawer_modify_success', {
                      keyTag: values.keyTag,
                    }),
              );
            },
            onError: (e) => {
              addError(
                isAddAction
                  ? t('domain_tab_dsrecords_drawer_add_error', {
                      error: e.message,
                    })
                  : t('domain_tab_dsrecords_drawer_modify_error', {
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
