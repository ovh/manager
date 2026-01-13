import React, { startTransition, useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import {
  ODS_BUTTON_COLOR,
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_TEXT_PRESET,
  OdsCheckboxChangeEventDetail,
} from '@ovhcloud/ods-components';
import {
  OdsButton,
  OdsCheckbox,
  OdsModal,
  OdsText,
} from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useOrderURL } from '@ovh-ux/manager-module-order';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

import { BYOIP_FAILOVER_V4, CONFIG_NAME } from '@/data/hooks/catalog';
import { urls } from '@/routes/routes.constant';

import { ByoipContext } from '../Byoip.context';
import {
  ByoipPayloadParams,
  ConfigItem,
  getByoipProductSettings,
} from '../Byoip.utils';

interface DeclarationItem {
  declaration: string;
  translationKey: string;
}

export const ByoipOrderModal: React.FC = () => {
  const { t } = useTranslation(['byoip', NAMESPACES?.ACTIONS]);
  const navigate = useNavigate();
  const { trackClick } = useOvhTracking();
  const {
    ipRir,
    selectedRegion,
    ipRange,
    asOwnRirType,
    asOwnNumberType,
  } = React.useContext(ByoipContext);

  const orderBaseUrl = useOrderURL('express_review_base');

  const declarationItems: DeclarationItem[] = [
    {
      declaration: 'point1',
      translationKey: 'ip_byoip_disclaimer_description_point_1',
    },
    {
      declaration: 'point2',
      translationKey: 'ip_byoip_disclaimer_description_point_2',
    },
    {
      declaration: 'point3',
      translationKey: 'ip_byoip_disclaimer_description_point_3',
    },
  ];

  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(
    declarationItems.reduce(
      (acc, item) => ({ ...acc, [item.declaration]: false }),
      {},
    ),
  );

  const declaratiosChecked = Object.values(checkedItems).every(Boolean);

  const handleCheckboxChange = (id: string) => (
    e: CustomEvent<OdsCheckboxChangeEventDetail>,
  ) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: e.detail.checked,
    }));
  };

  const handleClose = () => {
    trackClick({
      actionType: 'action',
      buttonType: ButtonType.button,
      location: PageLocation.funnel,
      actions: [
        'go-to_bring-your-own-ip',
        'cancel',
        `rir_${ipRir.toLowerCase()}`,
        `Ip-location_${selectedRegion.toLowerCase()}`,
      ],
    });
    startTransition(() => {
      navigate(urls.byoip);
    });
  };

  useEffect(() => {
    if (!ipRir || !selectedRegion || !ipRange) {
      startTransition(() => {
        navigate(urls.byoip);
      });
    }
  }, [ipRir, selectedRegion, ipRange]);

  return (
    <OdsModal isOpen isDismissible onOdsClose={handleClose}>
      <OdsText className="mb-2" preset={ODS_TEXT_PRESET.heading4}>
        {t('ip_byoip_disclaimer_title')}
      </OdsText>
      <div className="mb-3 flex flex-col gap-4">
        <OdsText preset={ODS_TEXT_PRESET.span}>
          {t('ip_byoip_disclaimer_description')}
        </OdsText>

        {declarationItems.map(({ declaration, translationKey }) => (
          <label
            key={declaration}
            className="flex cursor-pointer items-center hover:bg-gray-100"
            htmlFor={declaration}
            slot="label"
          >
            <div className="flex items-center">
              <OdsCheckbox
                className="mr-3"
                inputId={declaration}
                name={declaration}
                isChecked={checkedItems[declaration]}
                onOdsChange={handleCheckboxChange(declaration)}
              />
            </div>
            <OdsText preset={ODS_TEXT_PRESET.paragraph}>
              {t(translationKey)}
            </OdsText>
          </label>
        ))}

        <OdsText preset={ODS_TEXT_PRESET.span}>
          {t('ip_byoip_disclaimer_ordering_delay_message')}
        </OdsText>
      </div>
      <div className="flex justify-end gap-4">
        <OdsButton
          color={ODS_BUTTON_COLOR.primary}
          size={ODS_BUTTON_SIZE.md}
          variant={ODS_BUTTON_VARIANT.outline}
          label={t('cancel', { ns: NAMESPACES.ACTIONS })}
          onClick={() => {
            startTransition(() => {
              navigate(urls.listing);
            });
          }}
        />
        <OdsButton
          color={ODS_BUTTON_COLOR.primary}
          size={ODS_BUTTON_SIZE.md}
          label={t('confirm', { ns: NAMESPACES.ACTIONS })}
          isDisabled={!declaratiosChecked}
          onClick={() => {
            const payload = {
              ipRir,
              campus: {
                name: selectedRegion,
                planCode: BYOIP_FAILOVER_V4,
              },
              ip: ipRange,
              ...(asOwnRirType && { asRir: asOwnRirType }),
              ...(asOwnNumberType && { asNumber: asOwnNumberType }),
            } as ByoipPayloadParams;
            const keys = Object.keys(payload) as Array<
              keyof ByoipPayloadParams
            >;
            const config: ConfigItem[] = keys.map((key) => ({
              label: key,
              values: [payload[key]],
            }));
            const updateConfig = config;
            // Retrieve campus config
            const campusConfig = config.find(
              ({ label }) => label === CONFIG_NAME.CAMPUS,
            );
            const campus = campusConfig?.values[0] as {
              name: string;
              planCode: string;
            };

            // Rebuild config like catalog send us
            const campusId = config.findIndex(
              ({ label }) => label === CONFIG_NAME.CAMPUS,
            );
            if (campus && updateConfig[campusId]) {
              updateConfig[campusId].values = [campus.name];
            }
            const settings = getByoipProductSettings(updateConfig);
            window.open(
              `${orderBaseUrl}?products=~(${settings})`,
              '_blank',
              'noopener,noreferrer',
            );

            trackClick({
              actionType: 'action',
              buttonType: ButtonType.button,
              location: PageLocation.funnel,
              actions: [
                'go-to_bring-your-own-ip',
                'confirm',
                `rir_${ipRir.toLowerCase()}`,
                `Ip-location_${selectedRegion.toLowerCase()}`,
              ],
            });

            startTransition(() => {
              navigate(urls.listing);
            });
          }}
        />
      </div>
    </OdsModal>
  );
};

export default ByoipOrderModal;
