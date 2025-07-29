import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  OdsFormField,
  OdsMessage,
  OdsSelect,
  OdsSpinner,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { ODS_MESSAGE_COLOR, ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { TRANSLATION_NAMESPACES } from '@/utils';
import ModalButtonGroup from './ModalButtonGroup.component';
import {
  useDedicatedServerIpMigrationAvailableDurations,
  useOrderDedicatedServerList,
} from '@/data/hooks';
import { ApiErrorMessage } from '@/components/ApiError/ApiErrorMessage';

export type Step2Props = {
  onCancel: () => void;
  onPrevious: () => void;
  onNext: () => void;
  ip: string;
  token: string;
  destinationServer?: string;
  setDestinationServer: React.Dispatch<React.SetStateAction<string>>;
};

export default function Step2({
  onCancel,
  onPrevious,
  onNext,
  ip,
  token,
  destinationServer,
  setDestinationServer,
}: Step2Props) {
  const { t } = useTranslation(TRANSLATION_NAMESPACES.importIpFromSys);
  const {
    serverList,
    isServerListLoading,
    serverListError,
  } = useOrderDedicatedServerList();

  const {
    isIpMigrationAvailable,
    isLoading,
    error,
  } = useDedicatedServerIpMigrationAvailableDurations({
    ip,
    token,
    serviceName: destinationServer,
  });

  return (
    <>
      <div className="flex flex-col">
        <OdsMessage
          className="block mb-4"
          color={ODS_MESSAGE_COLOR.information}
          isDismissible={false}
        >
          {t('step2Description')}
        </OdsMessage>
        <OdsFormField className="block mb-7">
          <label htmlFor="destination-server" slot="label">
            {t('step2ServerLabel')}
          </label>
          {isServerListLoading && <OdsSpinner />}
          {serverList?.length && (
            <OdsSelect
              className="w-full"
              name="destination-server"
              id="destination-server"
              value={destinationServer}
              onOdsChange={(e) => setDestinationServer(e.detail.value)}
              placeholder={t('step2ServerPlaceholder')}
            >
              {serverList?.map((server) => (
                <option key={server} value={server}>
                  {server}
                </option>
              ))}
            </OdsSelect>
          )}
        </OdsFormField>
        {isLoading && (
          <div className="flex">
            <OdsText className="mr-2">{t('step2LoadingServerCheck')}</OdsText>
            <OdsSpinner size={ODS_SPINNER_SIZE.sm} />
          </div>
        )}
        <ApiErrorMessage error={serverListError || error} />
        {isIpMigrationAvailable && (
          <OdsMessage color={ODS_MESSAGE_COLOR.success}>
            {t('step2CompatibilitySuccessMessage', {
              serverName: destinationServer,
              ip,
            })}
          </OdsMessage>
        )}
        {!isIpMigrationAvailable && !isLoading && !error && destinationServer && (
          <OdsMessage color={ODS_MESSAGE_COLOR.warning}>
            {t('step2UnavailableMigrationMessage', {
              serverName: destinationServer,
              ip,
            })}
          </OdsMessage>
        )}
      </div>
      <ModalButtonGroup
        onCancel={onCancel}
        onPrevious={onPrevious}
        onNext={onNext}
        isNextButtonDisabled={
          !isIpMigrationAvailable || isLoading || !destinationServer
        }
      />
    </>
  );
}
