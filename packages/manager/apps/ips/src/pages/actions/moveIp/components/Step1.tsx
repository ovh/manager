import React from 'react';
import { ODS_MESSAGE_COLOR, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import {
  OdsFormField,
  OdsCombobox,
  OdsComboboxGroup,
  OdsComboboxItem,
  OdsInput,
  OdsText,
  OdsMessage,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { TRANSLATION_NAMESPACES } from '@/utils';
import { ipParkingOptionValue } from '@/types';
import { MoveIpAvailableDestinationsResponse } from '@/data/api';
import { ComboboxServiceItem } from '@/components/ComboboxServiceItem/ComboboxServiceItem.component';

type Step1Props = {
  ip: string;
  currentService: string;
  availableDestinations: MoveIpAvailableDestinationsResponse;
  destinationService?: string;
  setDestinationService: React.Dispatch<React.SetStateAction<string>>;
  nextHopList: string[];
  nextHop?: string;
  setNextHop: React.Dispatch<React.SetStateAction<string>>;
};

export default function Step1({
  ip,
  currentService,
  availableDestinations,
  destinationService,
  setDestinationService,
  nextHopList,
  nextHop,
  setNextHop,
}: Step1Props) {
  const { t } = useTranslation(TRANSLATION_NAMESPACES.moveIp);

  return (
    <div className="flex flex-col">
      <OdsText className="block mb-4" preset={ODS_TEXT_PRESET.paragraph}>
        <span
          dangerouslySetInnerHTML={{ __html: t('step1Description', { ip }) }}
        />
      </OdsText>

      <OdsFormField className="w-full mb-7">
        <label htmlFor="service" slot="label">
          {t('step1CurrentServiceLabel')}
        </label>
        <OdsInput
          name="from"
          isReadonly
          value={currentService || t('step1EmptyCurrentServiceValue')}
        />
      </OdsFormField>

      <OdsFormField className="w-full">
        <label htmlFor="service" slot="label">
          {t('step1DestinationServiceLabel')}
        </label>
        <OdsCombobox
          id="service"
          name="service"
          className="w-full"
          onOdsChange={(event) => {
            setDestinationService(event.detail.value as string);
            setNextHop(undefined);
          }}
          isClearable
          allowNewElement={false}
          placeholder={t('select', { ns: NAMESPACES.ACTIONS })}
          value={destinationService}
        >
          {Object.entries(availableDestinations || [])
            .filter(([, serviceList]) => serviceList.length > 0)
            .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
            .map(([key, services]) => (
              <OdsComboboxGroup key={key}>
                <span slot="title">
                  {t(`service_destination_${key}_option_group_label`)}
                </span>
                {services.map(({ service }, index) => (
                  <ComboboxServiceItem
                    key={`${key}-${index}-${service}`}
                    name={service}
                    isDisabled={service === currentService}
                  />
                ))}
              </OdsComboboxGroup>
            ))}
          {currentService !== null && (
            <OdsComboboxGroup>
              <span slot="title">
                {t('service_selection_select_ip_parking_option_group_label')}
              </span>
              <OdsComboboxItem value={ipParkingOptionValue}>
                {t('service_selection_select_ip_parking_option_label')}
              </OdsComboboxItem>
            </OdsComboboxGroup>
          )}
        </OdsCombobox>
      </OdsFormField>

      {nextHopList.length > 0 && (
        <OdsFormField className="w-full mt-7">
          <label htmlFor="next-hop" slot="label">
            {t('step1NextHopLabel')}
          </label>
          <OdsCombobox
            id="next-hop"
            name="next-hop"
            className="w-full"
            onOdsChange={(event) => setNextHop(event.detail.value as string)}
            isClearable
            allowNewElement={false}
            placeholder={t('select', { ns: NAMESPACES.ACTIONS })}
            value={nextHop}
          >
            {nextHopList.map((hop) => (
              <OdsComboboxItem key={hop} value={hop}>
                {hop}
              </OdsComboboxItem>
            ))}
          </OdsCombobox>
        </OdsFormField>
      )}
    </div>
  );
}
