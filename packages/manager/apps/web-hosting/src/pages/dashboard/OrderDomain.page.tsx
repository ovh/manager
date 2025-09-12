import { useContext, useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ODS_MODAL_COLOR, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsRadio, OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Modal } from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import { ACTIONS, DOMAIN_ORDER_URL, REGION } from '@/constants';
import { subRoutes, urls } from '@/routes/routes.constants';

export default function OrderDomainModal() {
  const { serviceName } = useParams();
  const navigate = useNavigate();
  const closeModal = () => navigate(urls.ssl.replace(subRoutes.serviceName, serviceName));
  const context = useContext(ShellContext);
  const region = context.environment.getRegion();
  const { ovhSubsidiary } = context.environment.getUser();
  const rawOrderFormURL =
    DOMAIN_ORDER_URL?.[region as keyof typeof DOMAIN_ORDER_URL]?.[
      ovhSubsidiary as keyof (typeof DOMAIN_ORDER_URL)[REGION]
    ];
  const { t } = useTranslation(['dashboard', NAMESPACES.ACTIONS]);
  const [selectedOption, setSelectedOption] = useState<ACTIONS | ''>('');

  const onConfirm = () => {
    if (selectedOption === ACTIONS.ORDER) {
      window.open(rawOrderFormURL, '_blank');
      closeModal();
    } else if (selectedOption === ACTIONS.ATTACH) {
      navigate(urls.addDomain.replace(subRoutes.serviceName, serviceName));
    }
  };

  return (
    <Modal
      type={ODS_MODAL_COLOR.neutral}
      onDismiss={closeModal}
      isOpen
      primaryLabel={t(`${NAMESPACES.ACTIONS}:validate`)}
      secondaryLabel={t(`${NAMESPACES.ACTIONS}:cancel`)}
      onPrimaryButtonClick={onConfirm}
      onSecondaryButtonClick={closeModal}
      isPrimaryButtonDisabled={!selectedOption}
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
            <OdsText preset="span">{t('hosting_dashboard_add_or_order_step1_order')}</OdsText>
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
            <OdsText preset="span">{t('hosting_dashboard_add_or_order_step1_attach')}</OdsText>
          </label>
        </div>
      </div>
    </Modal>
  );
}
