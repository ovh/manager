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
import {
  ICON_NAME,
  Message,
  MESSAGE_COLOR,
  MessageBody,
  MessageIcon,
  Text,
} from '@ovhcloud/ods-react';
import { drawerTexts, formDataValues } from '@/domain/constants/dsRecords';
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
  const { addSuccess, clearNotifications } = useNotifications();
  const {
    updateDomain,
    isUpdateDomainPending,
    errorMessage,
    resetError,
  } = useUpdateDomainResource(serviceName);
  const { dnssecConfiguration } = targetSpec;
  const { keyTag, algorithm, publicKey } = dsRecordsData;
  const isAddAction = drawer.action === DrawerActionEnum.Add;
  const formData = useForm<TDsDataInterface>({
    mode: 'onChange',
    values: formDataValues(isAddAction, keyTag, algorithm, publicKey),
  });
  const { handleSubmit, formState, clearErrors, reset } = formData;
  const onDismiss = () => {
    reset(formDataValues(isAddAction, keyTag, algorithm, publicKey));
    setDrawer({
      isOpen: false,
      action: null,
    });
    resetError();
    clearErrors();
  };

  return (
    <Drawer
      data-testid="drawer"
      heading={drawerTexts(isAddAction, t).heading}
      isOpen={drawer.isOpen}
      onDismiss={() => onDismiss()}
      primaryButtonLabel={t(`${NAMESPACES.ACTIONS}:validate`)}
      isPrimaryButtonDisabled={!formState.isValid}
      secondaryButtonLabel={t(`${NAMESPACES.ACTIONS}:cancel`)}
      isPrimaryButtonLoading={isUpdateDomainPending}
      onPrimaryButtonClick={handleSubmit((values) => {
        const data = {
          keyTag: Number(values.keyTag),
          flags: values.flags,
          algorithm: Number(values.algorithm),
          publicKey: values.publicKey,
        };
        updateDomain(
          {
            currentTargetSpec: targetSpec,
            updatedSpec: {
              dnssecConfiguration: {
                dsData: isAddAction
                  ? [...dnssecConfiguration.dsData, data]
                  : [
                      ...dnssecConfiguration.dsData.filter(
                        (ds) =>
                          !(
                            ds.keyTag === dsRecordsData.keyTag &&
                            ds.algorithm === dsRecordsData.algorithm
                          ),
                      ),
                      data,
                    ],
              },
            },
          },
          {
            onSuccess: () => {
              addSuccess(
                drawerTexts(isAddAction, t).successMessage(values.keyTag),
              );
              onDismiss();
            },
            onSettled: () => {
              clearNotifications();
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
      {/* Display error message inline instead of notification to prevent duplication with parent serviceDetail notifications */}
      {errorMessage && (
        <Message color={MESSAGE_COLOR.critical} dismissible={false}>
          <MessageIcon name={ICON_NAME.triangleExclamation} />
          <MessageBody>
            {drawerTexts(isAddAction, t).errorMessage(
              errorMessage.response.data.message,
            )}
          </MessageBody>
        </Message>
      )}
    </Drawer>
  );
}
