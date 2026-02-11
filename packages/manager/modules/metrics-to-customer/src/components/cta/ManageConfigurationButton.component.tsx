import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { BUTTON_VARIANT, Button } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@/MetricsToCustomer.translations';

import { ManageConfigurationButtonProps } from '@/components/cta/ManageConfigurationButton.props';

export function ManageConfigurationButton({
  configUrl,
  disabled = false,
}: ManageConfigurationButtonProps) {
  const { t } = useTranslation(NAMESPACES.MODULE);
  
  const navigate = useNavigate();

  const onClickManageConfigurationButton = () => {
    navigate(configUrl);
  }

  return (
    <Button variant={BUTTON_VARIANT.default} onClick={onClickManageConfigurationButton} disabled={disabled}>
      {t('manage_configuration_button')}
    </Button>
  );
}

export default ManageConfigurationButton;
