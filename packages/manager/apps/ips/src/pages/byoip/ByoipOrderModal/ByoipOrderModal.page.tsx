import React, { useEffect, startTransition, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  ODS_BUTTON_COLOR,
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_TEXT_PRESET,
  OdsCheckboxChangeEventDetail,
} from '@ovhcloud/ods-components';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  OdsButton,
  OdsModal,
  OdsText,
  OdsCheckbox,
} from '@ovhcloud/ods-components/react';
import { useOrderURL } from '@ovh-ux/manager-module-order';
import { urls } from '@/routes/routes.constant';
import { ByoipContext } from '../Byoip.context';
import {
  ByoipPayloadParams,
  ConfigItem,
  getByoipProductSettings,
} from '../Byoip.utils';
import { BYOIP_FAILOVER_V4, CONFIG_NAME } from '@/data/hooks/catalog';

interface DeclarationItem {
  declaration: string;
  translationKey: string;
}

export const ByoipOrderModal: React.FC<{ isOpen: boolean }> = ({
  isOpen = true,
}) => {
  const { t } = useTranslation(['byoip', NAMESPACES?.ACTIONS]);
  const navigate = useNavigate();

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
    <OdsModal isOpen={isOpen} isDismissible onOdsClose={handleClose}>
      <OdsText className="mb-2" preset={ODS_TEXT_PRESET.heading4}>
        {t('ip_byoip_disclaimer_title')}
      </OdsText>
      <div className="mb-3 flex flex-col gap-3">
        <OdsText preset={ODS_TEXT_PRESET.span}>
          {t('ip_byoip_disclaimer_description')}
        </OdsText>

        {declarationItems.map(({ declaration, translationKey }) => (
          <div key={declaration} className="flex items-start gap-2">
            <OdsCheckbox
              name={declaration}
              isChecked={checkedItems[declaration]}
              onOdsChange={handleCheckboxChange(declaration)}
            />
            <label htmlFor={declaration} className="flex-1">
              <OdsText preset={ODS_TEXT_PRESET.paragraph}>
                {t(translationKey)}
              </OdsText>
            </label>
          </div>
        ))}

        <OdsText preset={ODS_TEXT_PRESET.span}>
          {t('ip_byoip_disclaimer_ordering_delay_message')}
        </OdsText>
      </div>
      <div className="flex gap-3 justify-end">
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
            const payload: ByoipPayloadParams = {
              ipRir,
              campus: {
                name: selectedRegion,
                planCode: BYOIP_FAILOVER_V4,
              },
              ip: ipRange,
              ...(asOwnRirType && { asRir: asOwnRirType }),
              ...(asOwnNumberType && { asNumber: asOwnNumberType }),
            };
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
            if (campus) {
              updateConfig[campusId].values = [campus.name];
            }
            const settings = getByoipProductSettings(updateConfig);
            window.open(
              `${orderBaseUrl}?products=~(${settings})`,
              '_blank',
              'noopener,noreferrer',
            );
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
