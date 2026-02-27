import React from 'react';

import { useTranslation } from 'react-i18next';

import {
  MESSAGE_COLOR,
  MessageBody,
  RadioControl,
  RadioGroup,
  RadioLabel,
  SPINNER_SIZE,
  Message,
  Radio,
  Spinner,
} from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { IntervalUnit, OvhSubsidiary, useFormatDate } from '@ovh-ux/muk';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import { ApiErrorMessage } from '@/components/ApiError/ApiErrorMessage';
import { Price } from '@/components/price';
import {
  useDedicatedServerIpMigrationAvailableDurations,
  useDedicatedServerIpMigrationDetails,
} from '@/data/hooks';
import { TRANSLATION_NAMESPACES } from '@/utils';

import { PRICE_MULTIPLIER } from '../importIpFromSys.constant';
import ModalButtonGroup from './ModalButtonGroup.component';

export type Step3Props = {
  onCancel: () => void;
  onPrevious: () => void;
  onNext: () => void;
  ip: string;
  token: string;
  destinationServer?: string;
  selectedDuration?: string;
  setSelectedDuration: React.Dispatch<React.SetStateAction<string | undefined>>;
};

export default function Step3({
  onCancel,
  onPrevious,
  onNext,
  ip,
  token,
  destinationServer,
  selectedDuration,
  setSelectedDuration,
}: Step3Props) {
  const { environment } = React.useContext(ShellContext);
  const format = useFormatDate();
  const { t, i18n } = useTranslation([
    TRANSLATION_NAMESPACES.importIpFromSys,
    NAMESPACES.ACTIONS,
  ]);

  const {
    availableDurations,
  } = useDedicatedServerIpMigrationAvailableDurations({
    ip,
    token,
    serviceName: destinationServer,
  });

  const {
    data,
    isLoading: loading,
    error,
  } = useDedicatedServerIpMigrationDetails({
    ip,
    token,
    serviceName: destinationServer,
    duration: selectedDuration,
  });

  React.useEffect(() => {
    if (availableDurations?.length === 1) {
      setSelectedDuration(availableDurations?.[0]);
    }
  }, [availableDurations?.join(',')]);

  return (
    <>
      <div className="flex flex-col">
        <Message
          className="mb-4 block"
          color={MESSAGE_COLOR.information}
          dismissible={false}
        >
          <MessageBody>{t('step3Description')}</MessageBody>
        </Message>
        <RadioGroup
          value={selectedDuration}
          name="duration"
          className="mb-3 block"
          onValueChange={(e) => setSelectedDuration(e.value)}
        >
          {availableDurations?.map((durationString) => (
            <Radio
              key={durationString}
              value={durationString}
              disabled={availableDurations?.length === 1}
            >
              <RadioControl />
              <RadioLabel>
                {`${t(`duration-${durationString.split('-')[0]}`)} ${format({
                  date: durationString
                    .split('-')
                    .slice(1)
                    .join('-'),
                })} : `}
                {loading ? (
                  <Spinner size={SPINNER_SIZE.xs} />
                ) : (
                  <Price
                    value={
                      data?.data?.prices?.withoutTax?.value * PRICE_MULTIPLIER
                    }
                    tax={data?.data?.prices?.tax?.value * PRICE_MULTIPLIER}
                    ovhSubsidiary={
                      environment.user.ovhSubsidiary as OvhSubsidiary
                    }
                    locale={i18n.language}
                    intervalUnit={IntervalUnit.none}
                  />
                )}
              </RadioLabel>
            </Radio>
          ))}
        </RadioGroup>
      </div>
      <ApiErrorMessage error={error} />
      <ModalButtonGroup
        currentStep={3}
        onCancel={onCancel}
        onPrevious={onPrevious}
        onNext={onNext}
        isNextButtonDisabled={!selectedDuration}
      />
    </>
  );
}
