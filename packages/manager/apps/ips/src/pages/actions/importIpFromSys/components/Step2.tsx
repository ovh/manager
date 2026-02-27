import React from 'react';

import { useTranslation } from 'react-i18next';

import {
  SelectControl,
  FormField,
  Message,
  Select,
  Spinner,
  Text,
  MESSAGE_COLOR,
  SelectContent,
  SPINNER_SIZE,
  MessageBody,
  FormFieldLabel,
} from '@ovhcloud/ods-react';

import { ApiErrorMessage } from '@/components/ApiError/ApiErrorMessage';
import { PRODUCT_PATHS_AND_CATEGORIES } from '@/data/constants';
import {
  useDedicatedServerIpMigrationAvailableDurations,
  useGetProductService,
} from '@/data/hooks';
import { TRANSLATION_NAMESPACES } from '@/utils';

import ModalButtonGroup from './ModalButtonGroup.component';
import {} from '@ovh-ux/muk';

export type Step2Props = {
  onCancel: () => void;
  onPrevious: () => void;
  onNext: () => void;
  ip: string;
  token: string;
  destinationServer?: string;
  setDestinationServer: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
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
    loading,
    error,
  } = useDedicatedServerIpMigrationAvailableDurations({
    ip,
    token,
    serviceName: destinationServer,
  });

  return (
    <>
      <div className="flex flex-col">
        <Message
          className="mb-4 block"
          color={MESSAGE_COLOR.information}
          dismissible={false}
        >
          <MessageBody>{t('step2Description')}</MessageBody>
        </Message>
        <FormField className="mb-12 block">
          <FormFieldLabel>{t('step2ServerLabel')}</FormFieldLabel>
          {isServerListLoading && <Spinner />}
          {serverList?.length && (
            <Select
              className="z-[3] mt-1 min-w-[300px] md:min-w-[400px]"
              name="destination-server"
              id="destination-server"
              value={[destinationServer]}
              onValueChange={(e) => setDestinationServer(e.value?.[0])}
              items={serverList?.map((server) => ({
                label: server.displayName || server.serviceName,
                value: server.serviceName,
              }))}
            >
              <SelectControl placeholder={t('step2ServerPlaceholder')} />
              <SelectContent />
            </Select>
          )}
        </FormField>
        {loading && (
          <div className="flex">
            <Text className="mr-2">{t('step2LoadingServerCheck')}</Text>
            <Spinner size={SPINNER_SIZE.sm} />
          </div>
        )}
        <ApiErrorMessage error={serverListError || error} />
        {isIpMigrationAvailable && (
          <Message color={MESSAGE_COLOR.success}>
            <MessageBody>
              {t('step2CompatibilitySuccessMessage', {
                serverName: destinationServer,
                ip,
              })}
            </MessageBody>
          </Message>
        )}
        {!isIpMigrationAvailable && !loading && !error && destinationServer && (
          <Message color={MESSAGE_COLOR.warning}>
            <MessageBody>
              {t('step2UnavailableMigrationMessage', {
                serverName: destinationServer,
                ip,
              })}
            </MessageBody>
          </Message>
        )}
      </div>
      <ModalButtonGroup
        currentStep={2}
        onCancel={onCancel}
        onPrevious={onPrevious}
        onNext={onNext}
        isNextButtonDisabled={
          !isIpMigrationAvailable || loading || !destinationServer
        }
      />
    </>
  );
}
