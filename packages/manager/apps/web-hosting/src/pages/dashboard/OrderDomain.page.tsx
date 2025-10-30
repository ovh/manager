import { useContext, useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { MODAL_COLOR, Radio, TEXT_PRESET, Text } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import '@ovh-ux/muk';
import { Modal } from '@ovh-ux/muk';

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
      type={MODAL_COLOR.neutral}
      onOpenChange={closeModal}
      open
      primaryButton={{
        label: t(`${NAMESPACES.ACTIONS}:validate`),
        onClick: onConfirm,
        disabled: !selectedOption,
      }}
      secondaryButton={{
        label: t(`${NAMESPACES.ACTIONS}:cancel`),
        onClick: closeModal,
      }}
    >
      <div className="flex flex-col space-y-8 mb-10">
        <Text className="mb-4" preset={TEXT_PRESET.heading4}>
          {t('hosting_dashboard_add_or_order_title')}
        </Text>
        <Text>{t('hosting_dashboard_add_or_order_step1_title')}</Text>
        <div className="flex gap-4 items-center">
          <Radio
            value={ACTIONS.ORDER}
            aria-checked={ACTIONS.ORDER === selectedOption}
            onChange={() => setSelectedOption(ACTIONS.ORDER)}
          />
          <label>
            <Text preset="span">{t('hosting_dashboard_add_or_order_step1_order')}</Text>
          </label>
        </div>
        <div className="flex gap-4 items-center">
          <Radio
            value={ACTIONS.ATTACH}
            aria-checked={ACTIONS.ATTACH === selectedOption}
            onChange={() => setSelectedOption(ACTIONS.ATTACH)}
          />
          <label>
            <Text preset="span">{t('hosting_dashboard_add_or_order_step1_attach')}</Text>
          </label>
        </div>
      </div>
    </Modal>
  );
}
