import { useContext, useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import {
  Radio,
  RadioControl,
  RadioGroup,
  RadioLabel,
  TEXT_PRESET,
  Text,
} from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { MODAL_COLOR, Modal } from '@ovh-ux/muk';

import { ACTIONS, DOMAIN_ORDER_URL, REGION } from '@/constants';
import { subRoutes, urls } from '@/routes/routes.constants';

export default function OrderDomainModal() {
  const { serviceName } = useParams();
  const navigate = useNavigate();
  const closeModal = () => navigate(-1);
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
      <div className="mb-10 flex flex-col space-y-8">
        <Text className="mb-4" preset={TEXT_PRESET.heading4}>
          {t('hosting_dashboard_add_or_order_title')}
        </Text>
        <Text>{t('hosting_dashboard_add_or_order_step1_title')}</Text>
        <div className="flex items-center gap-4">
          <RadioGroup>
            <Radio
              value={ACTIONS.ORDER}
              aria-checked={ACTIONS.ORDER === selectedOption}
              onChange={() => setSelectedOption(ACTIONS.ORDER)}
            />
            <RadioControl />

            <RadioLabel>{t('hosting_dashboard_add_or_order_step1_order')}</RadioLabel>

            <Radio
              value={ACTIONS.ATTACH}
              aria-checked={ACTIONS.ATTACH === selectedOption}
              onChange={() => setSelectedOption(ACTIONS.ATTACH)}
            />
            <RadioControl />
            <RadioLabel>
              <Text preset="span">{t('hosting_dashboard_add_or_order_step1_attach')}</Text>
            </RadioLabel>
          </RadioGroup>
        </div>
      </div>
    </Modal>
  );
}
