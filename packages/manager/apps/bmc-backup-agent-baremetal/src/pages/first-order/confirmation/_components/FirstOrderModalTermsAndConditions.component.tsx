import { useState } from 'react';

import { useTranslation } from 'react-i18next';

import { OdsButton, OdsCheckbox, OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { LinkType, Links } from '@ovh-ux/manager-react-components';

import {
  FIRST_ORDER_TC_CONFIRM_BUTTON_TEST_ID,
  FIRST_ORDER_TC_CONFIRM_CHECKBOX_TEST_ID,
} from '../FirstOrderConfirmationModal.constants';
import { FirstOrderModalCancelButton } from './FirstOrderModalCancelButton.component';

type FirstOrderModalTermsAndConditionsProps = {
  onSuccess: () => void;
  onCancel: () => void;
};

export const FirstOrderModalTermsAndConditions = ({
  onSuccess,
  onCancel,
}: FirstOrderModalTermsAndConditionsProps) => {
  const { t } = useTranslation([
    'onboarding',
    NAMESPACES.ACTIONS,
    NAMESPACES.ONBOARDING,
    NAMESPACES.FORM,
  ]);
  const [isContractAccepted, setIsContractAccepted] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-4 pb-6">
        <OdsText preset="heading-4">{t('first_order_terms_and_conditions_title')}</OdsText>
        <OdsText preset="paragraph">{t('first_order_terms_and_conditions_description')}</OdsText>
        <div className="flex flex-col gap-2">
          <Links
            key={'name'}
            href={'url'}
            target="_blank"
            type={LinkType.external}
            label={t('first_order_terms_and_conditions_annexe_label')}
          />
        </div>
        <div className="flex items-center gap-3">
          <OdsCheckbox
            data-testid={FIRST_ORDER_TC_CONFIRM_CHECKBOX_TEST_ID}
            name="confirm-contract"
            inputId="confirm-contract"
            isChecked={isContractAccepted}
            onOdsChange={(event) => setIsContractAccepted(event.detail.checked)}
          />
          <label className="cursor-pointer" htmlFor="confirm-contract">
            <OdsText preset="span">{t('first_order_terms_and_conditions_confirm_label')}</OdsText>
          </label>
        </div>
      </div>

      <FirstOrderModalCancelButton onClick={onCancel} />
      <OdsButton
        data-testid={FIRST_ORDER_TC_CONFIRM_BUTTON_TEST_ID}
        slot="actions"
        label={t('confirm', { ns: NAMESPACES.ACTIONS })}
        isDisabled={!isContractAccepted}
        onClick={() => onSuccess}
      />
    </>
  );
};
