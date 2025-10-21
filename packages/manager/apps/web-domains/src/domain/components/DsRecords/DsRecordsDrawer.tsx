import { Drawer } from '@ovh-ux/manager-react-components';
import { Dispatch, SetStateAction } from 'react';
import {
  ICON_NAME,
  Message,
  MessageBody,
  MessageIcon,
} from '@ovhcloud/ods-react';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useTranslation } from 'react-i18next';
import DnssecForm from '@/domain/components/DsRecords/DsRecordsForm';
import { DrawerInformation } from '@/common/types/common.types';
import { FormProvider, useForm } from 'react-hook-form';
import { TDsDataInterface } from '@/domain/types/dnssecConfiguration';
import { TDomainResource } from '@/domain/types/domainResource';
import { useUpdateDomainResource } from '@/domain/hooks/data/query';

interface DnssecDrawerProps {
  readonly drawer: DrawerInformation;
  readonly targetSpec: TDomainResource['targetSpec'];
  readonly serviceName: string;
  readonly checksum: string;
  readonly setDrawer: Dispatch<SetStateAction<DrawerInformation>>;
}

export default function DsRecordsDrawer({
  drawer,
  targetSpec,
  serviceName,
  checksum,
  setDrawer,
}: DnssecDrawerProps) {
  const { t } = useTranslation('domain');
  const { updateDomain, isUpdateDomainPending } = useUpdateDomainResource(
    serviceName,
  );
  const {
    hostsConfiguration,
    dnsConfiguration,
    protectionState,
    dnssecConfiguration,
  } = targetSpec;
  const formData = useForm<TDsDataInterface>({
    mode: 'onChange',
    values: {
      keyTag: null,
      keyType: null,
      algorithm: null,
      publicKey: '',
    },
  });
  const { handleSubmit, formState, clearErrors, reset } = formData;
  const onDismiss = () => {
    reset({
      keyTag: null,
      keyType: null,
      algorithm: null,
      publicKey: '',
    });
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
      isOpen
      onDismiss={() => onDismiss()}
      primaryButtonLabel={t(`${NAMESPACES.ACTIONS}:validate`)}
      isPrimaryButtonDisabled={!formState.isValid}
      secondaryButtonLabel={t(`${NAMESPACES.ACTIONS}:cancel`)}
      onPrimaryButtonClick={handleSubmit((values) => {
        updateDomain({
          checksum,
          nameServers: dnsConfiguration.nameServers,
          hosts: hostsConfiguration.hosts,
          protectionState,
          dsData: [
            ...dnssecConfiguration.dsData,
            {
              keyTag: values.keyTag,
              keyType: values.keyType,
              algorithm: values.algorithm,
              publicKey: values.publicKey,
            },
          ],
        });
      })}
      onSecondaryButtonClick={() => onDismiss()}
    >
      <FormProvider {...formData}>
        <DnssecForm />
      </FormProvider>
      <Message dismissible={false}>
        <MessageIcon name={ICON_NAME.circleInfo} />
        <MessageBody>
          {t('domain_tab_dsrecords_drawer_information_1')}
          <br />
          <br />
          {t('domain_tab_dsrecords_drawer_information_2')}
        </MessageBody>
      </Message>
    </Drawer>
  );
}
