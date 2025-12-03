import { useTranslation } from 'react-i18next';

import { OdsButton } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { ORDER_OKMS_CREATE_CANCEL_BUTTON_TEST_ID } from './OrderOkmsModal.page.constants';

type OkmsOrderModalCancelButtonProps = {
  onClick: () => void;
};

export const OkmsOrderModalCancelButton = ({ onClick }: OkmsOrderModalCancelButtonProps) => {
  const { t } = useTranslation(NAMESPACES.ACTIONS);

  return (
    <OdsButton
      data-testid={ORDER_OKMS_CREATE_CANCEL_BUTTON_TEST_ID}
      slot="actions"
      type="button"
      variant="ghost"
      label={t('cancel')}
      onClick={onClick}
    />
  );
};
