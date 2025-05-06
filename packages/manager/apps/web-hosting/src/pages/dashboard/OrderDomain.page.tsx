import React, { useContext, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import {
  OdsButton,
  OdsModal,
  OdsRadio,
  OdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_COLOR,
  ODS_BUTTON_VARIANT,
  ODS_MODAL_COLOR,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { ACTIONS, DOMAIN_ORDER_URL, REGION } from '@/constants';
import { subRoutes, urls } from '@/routes/routes.constants';

export default function SectigoModal() {
  const { serviceName } = useParams();
  const navigate = useNavigate();
  const closeModal = () => navigate('..');
  const context = useContext(ShellContext);
  const region = context.environment.getRegion();
  const { ovhSubsidiary } = context.environment.getUser();
  const rawOrderFormURL =
    DOMAIN_ORDER_URL?.[region]?.[
      ovhSubsidiary as keyof typeof DOMAIN_ORDER_URL[REGION]
    ];

  const { t } = useTranslation('dashboard');
  const [selectedOption, setSelectedOption] = useState('');

  const onConfirm = () => {
    if (selectedOption === ACTIONS.ORDER) {
      window.open(rawOrderFormURL, '_blank');
      closeModal();
    } else {
      navigate(urls.addDomain.replace(subRoutes.serviceName, serviceName));
    }
  };

  return (
    <OdsModal
      data-testid="modal"
      color={ODS_MODAL_COLOR.neutral}
      isDismissible
      onOdsClose={closeModal}
      isOpen
    >
      <div className="flex flex-col space-y-8 mb-10">
        <OdsText className="mb-4" preset={ODS_TEXT_PRESET.heading4}>
          {t('hosting_dashboard_add_or_order_title')}
        </OdsText>
        <OdsText>{t('hosting_dashboard_add_or_order_step1_title')}</OdsText>
        <div className="flex gap-4 items-center">
          <OdsRadio
            name="radio-order-compute"
            value={ACTIONS.ORDER}
            isChecked={ACTIONS.ORDER === selectedOption}
            onOdsChange={() => setSelectedOption(ACTIONS.ORDER)}
          />
          <label>
            <OdsText preset="span">
              {t('hosting_dashboard_add_or_order_step1_order')}
            </OdsText>
          </label>
        </div>
        <div className="flex gap-4 items-center">
          <OdsRadio
            name="radio-order-compute"
            value={ACTIONS.ATTACH}
            isChecked={ACTIONS.ATTACH === selectedOption}
            onOdsChange={() => setSelectedOption(ACTIONS.ATTACH)}
          />
          <label>
            <OdsText preset="span">
              {t('hosting_dashboard_add_or_order_step1_attach')}
            </OdsText>
          </label>
        </div>
      </div>
      <div className="flex space-x-4 justify-end">
        <OdsButton
          color={ODS_BUTTON_COLOR.primary}
          onClick={closeModal}
          variant={ODS_BUTTON_VARIANT.outline}
          label={t('buttons_cancel')}
          className="mt-4"
          type="button"
        />
        <OdsButton
          color={ODS_BUTTON_COLOR.primary}
          onClick={onConfirm}
          isDisabled={Boolean(!selectedOption)}
          variant={ODS_BUTTON_VARIANT.default}
          label={t('buttons_validate')}
          className="mt-4"
          type="button"
        />
      </div>
    </OdsModal>
  );
}
