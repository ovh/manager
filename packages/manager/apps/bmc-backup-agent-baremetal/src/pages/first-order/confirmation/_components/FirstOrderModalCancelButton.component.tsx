import { useTranslation } from 'react-i18next';

import { OdsButton } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { FIRST_ORDER_CREATE_CANCEL_BUTTON_TEST_ID } from '../FirstOrderConfirmationModal.constants';

type FirstOrderModalCancelButtonProps = {
  onClick: () => void;
};

export const FirstOrderModalCancelButton = ({ onClick }: FirstOrderModalCancelButtonProps) => {
  const { t } = useTranslation(NAMESPACES.ACTIONS);

  return (
    <OdsButton
      data-testid={FIRST_ORDER_CREATE_CANCEL_BUTTON_TEST_ID}
      slot="actions"
      type="button"
      variant="ghost"
      label={t('cancel')}
      onClick={onClick}
    />
  );
};
