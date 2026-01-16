import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { BUTTON_VARIANT, Button } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@/MetricsToCustomer.translations';

import { ManageConfigurationButtonProps } from '@/components/cta/ManageConfigurationButton.props';

export default function ManageConfigurationButton({
  configUrl,
}: ManageConfigurationButtonProps) {
  const { t } = useTranslation(NAMESPACES.MODULE);
  
  const navigate = useNavigate();

  const onClickManageConfigurationButton = () => {
    // TODO: Once the "subscriptionsConfig" route is added
    console.log(`navigate to ${configUrl}`)
  }

  return (
    <Button variant={BUTTON_VARIANT.default} onClick={onClickManageConfigurationButton}>
      {t('manage_configuration_button')}
    </Button>
  );
}
