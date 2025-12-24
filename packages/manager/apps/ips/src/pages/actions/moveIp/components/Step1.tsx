import React from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import {
  OdsCombobox,
  OdsComboboxGroup,
  OdsComboboxItem,
  OdsFormField,
  OdsInput,
  OdsText,
} from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { ComboboxServiceItem } from '@/components/ComboboxServiceItem/ComboboxServiceItem.component';
import { MoveIpAvailableDestinationsResponse } from '@/data/api';
import { PRODUCT_PATHS_AND_CATEGORIES } from '@/data/constants';
import { useGetProductServices } from '@/data/hooks';
import { ipParkingOptionValue } from '@/types';
import { TRANSLATION_NAMESPACES } from '@/utils';

type Step1Props = {
  ip: string;
  currentService: string;
  availableDestinations?: MoveIpAvailableDestinationsResponse;
  destinationService?: string;
  setDestinationService: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
  nextHopList: string[];
  nextHop?: string;
  setNextHop: React.Dispatch<React.SetStateAction<string | undefined>>;
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
  const { serviceList: productList } = useGetProductServices(
    Object.values(PRODUCT_PATHS_AND_CATEGORIES),
  );

  return (
    <div className="flex flex-col">
      <OdsText className="mb-4 block" preset={ODS_TEXT_PRESET.paragraph}>
        <span
          dangerouslySetInnerHTML={{ __html: t('step1Description', { ip }) }}
        />
      </OdsText>

      <OdsFormField className="mb-7 w-full">
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
            setDestinationService(event.detail.value);
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
                    displayName={
                      productList?.find((s) => s.serviceName === service)
                        ?.displayName
                    }
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

      <OdsFormField
        className={`mt-7 w-full ${nextHopList.length === 0 ? 'hidden' : ''}`}
      >
        <label htmlFor="next-hop" slot="label">
          {t('step1NextHopLabel')}
        </label>
        <OdsCombobox
          id="next-hop"
          name="next-hop"
          className="w-full"
          onOdsChange={(event) => setNextHop(event.detail.value)}
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
    </div>
  );
}
