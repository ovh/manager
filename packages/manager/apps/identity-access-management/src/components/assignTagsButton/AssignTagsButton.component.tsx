import { ManagerButton } from '@ovh-ux/manager-react-components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ODS_BUTTON_VARIANT, ODS_ICON_NAME } from '@ovhcloud/ods-components';

export type AssignTagButtonProps = {
  onClick: () => void;
  isDisabled?: boolean;
};

export default function AssignTagButton({
  onClick,
  isDisabled,
}: AssignTagButtonProps) {
  const { t } = useTranslation('tag-manager');

  return (
    <ManagerButton
      id="assign-tag"
      label={t('assignTags')}
      onClick={onClick}
      variant={ODS_BUTTON_VARIANT.default}
      icon={ODS_ICON_NAME.plus}
      isDisabled={isDisabled}
    ></ManagerButton>
  );
}
