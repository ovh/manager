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
  useGetProductService,
} from '@/data/hooks';
import { ApiErrorMessage } from '@/components/ApiError/ApiErrorMessage';
import { PRODUCT_PATHS_AND_CATEGORIES } from '@/data/constants';

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
    services: serverList,
    isLoading: isServerListLoading,
    error: serverListError,
  } = useGetProductService(PRODUCT_PATHS_AND_CATEGORIES.dedicated);

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
        <OdsFormField className="block mb-12">
          <label htmlFor="destination-server" slot="label">
            {t('step2ServerLabel')}
          </label>
          {isServerListLoading && <OdsSpinner />}
          {serverList?.length && (
            <OdsSelect
              className="mt-1 z-[3] min-w-[300px] md:min-w-[400px]"
              name="destination-server"
              id="destination-server"
              value={destinationServer}
              onOdsChange={(e) => setDestinationServer(e.detail.value)}
              placeholder={t('step2ServerPlaceholder')}
              strategy="fixed"
            >
              {serverList?.map((server) => (
                <option key={server.serviceName} value={server.serviceName}>
                  {server.displayName || server.serviceName}
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
