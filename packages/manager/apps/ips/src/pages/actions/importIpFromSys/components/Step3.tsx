import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  OdsFormField,
  OdsMessage,
  OdsRadio,
  OdsSpinner,
} from '@ovhcloud/ods-components/react';
import { ODS_MESSAGE_COLOR, ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  IntervalUnitType,
  OvhSubsidiary,
  Price,
  useFormatDate,
} from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { TRANSLATION_NAMESPACES } from '@/utils';
import ModalButtonGroup from './ModalButtonGroup.component';
import {
  useDedicatedServerIpMigrationAvailableDurations,
  useDedicatedServerIpMigrationDetails,
} from '@/data/hooks';
import { ApiErrorMessage } from '@/components/ApiError/ApiErrorMessage';
import { PRICE_MULTIPLIER } from '../importIpFromSys.constant';

export type Step3Props = {
  onCancel: () => void;
  onPrevious: () => void;
  onNext: () => void;
  ip: string;
  token: string;
  destinationServer?: string;
  selectedDuration?: string;
  setSelectedDuration: React.Dispatch<React.SetStateAction<string>>;
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

  const { data, isLoading, error } = useDedicatedServerIpMigrationDetails({
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
        <OdsMessage
          className="block mb-4"
          color={ODS_MESSAGE_COLOR.information}
          isDismissible={false}
        >
          {t('step3Description')}
        </OdsMessage>
        <OdsFormField className="block mb-3">
          {availableDurations?.map((durationString) => (
            <div className="flex items-center" key={durationString}>
              <OdsRadio
                className="mr-3"
                inputId={durationString}
                name="duration"
                value={durationString}
                isDisabled={availableDurations?.length === 1}
                isChecked={selectedDuration === durationString}
                onOdsChange={(e) => setSelectedDuration(e.target.value)}
              />
              <label htmlFor={durationString} slot="label">
                {`${t(`duration-${durationString.split('-')[0]}`)} ${format({
                  date: durationString
                    .split('-')
                    .slice(1)
                    .join('-'),
                })} : `}
                {isLoading ? (
                  <OdsSpinner size={ODS_SPINNER_SIZE.xs} />
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
                    intervalUnit={IntervalUnitType.none}
                  />
                )}
              </label>
            </div>
          ))}
        </OdsFormField>
      </div>
      <ApiErrorMessage error={error} />
      <ModalButtonGroup
        onCancel={onCancel}
        onPrevious={onPrevious}
        onNext={onNext}
        isNextButtonDisabled={!selectedDuration}
      />
    </>
  );
}
