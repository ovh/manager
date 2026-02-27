import React from 'react';

import { useTranslation } from 'react-i18next';

import {
  ComboboxContent,
  ComboboxControl,
  FormFieldLabel,
  TEXT_PRESET,
  Combobox,
  FormField,
  Input,
  Text,
} from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { MoveIpAvailableDestinationsResponse } from '@/data/api';
import { PRODUCT_PATHS_AND_CATEGORIES } from '@/data/constants';
import { useGetProductServices } from '@/data/hooks';
import { ipParkingOptionValue } from '@/types';
import { TRANSLATION_NAMESPACES } from '@/utils';
import { ComboboxServiceItem } from '@/components/ComboboxServiceItem/ComboboxServiceItem.component';

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
      <Text className="mb-4 block" preset={TEXT_PRESET.paragraph}>
        <span
          dangerouslySetInnerHTML={{ __html: t('step1Description', { ip }) }}
        />
      </Text>

      <FormField className="mb-7 w-full">
        <FormFieldLabel>{t('step1CurrentServiceLabel')}</FormFieldLabel>
        <Input
          name="from"
          readOnly
          value={currentService || t('step1EmptyCurrentServiceValue')}
        />
      </FormField>

      <FormField className="w-full">
        <FormFieldLabel>{t('step1DestinationServiceLabel')}</FormFieldLabel>
        <Combobox
          id="service"
          name="service"
          className="w-full"
          highlightResults
          onValueChange={(event) => {
            const newValue = event.value?.[0];
            if (newValue !== currentService) {
              setDestinationService(newValue);
              setNextHop(undefined);
            } else {
              setDestinationService(undefined);
              setNextHop(undefined);
            }
          }}
          allowCustomValue={false}
          value={[destinationService]}
          customOptionRenderer={ComboboxServiceItem}
          items={[
            ...Object.entries(availableDestinations || [])
              .filter(([, serviceList]) => serviceList.length > 0)
              .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
              .map(([key, services]) => ({
                label: t(`service_destination_${key}_option_group_label`),
                options: services.map(({ service }) => {
                  const label = productList?.find(
                    (s) => s.serviceName === service,
                  )?.displayName;
                  return {
                    label:
                      label && label !== service
                        ? `${label} (${service})`
                        : service,
                    value: service,
                    disabled: service === currentService,
                  };
                }),
              })),
            currentService !== null && {
              label: t(
                'service_selection_select_ip_parking_option_group_label',
              ),
              options: [
                {
                  label: t('service_selection_select_ip_parking_option_label'),
                  value: ipParkingOptionValue,
                },
              ],
            },
          ].filter(Boolean)}
        >
          <ComboboxContent />
          <ComboboxControl
            clearable
            placeholder={t('select', { ns: NAMESPACES.ACTIONS })}
          />
        </Combobox>
      </FormField>

      <FormField
        className={`mt-7 w-full ${nextHopList.length === 0 ? 'hidden' : ''}`}
      >
        <FormFieldLabel>{t('step1NextHopLabel')}</FormFieldLabel>
        <Combobox
          id="next-hop"
          name="next-hop"
          className="w-full"
          onValueChange={(event) => setNextHop(event.value?.[0])}
          value={[nextHop]}
          items={nextHopList.map((hop) => ({ label: hop, value: hop }))}
          allowCustomValue={false}
        >
          <ComboboxContent />
          <ComboboxControl
            placeholder={t('select', { ns: NAMESPACES.ACTIONS })}
            clearable
          />
        </Combobox>
      </FormField>
    </div>
  );
}
