import { ManagerButton } from '@ovh-ux/manager-react-components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ODS_BUTTON_VARIANT, ODS_ICON_NAME } from '@ovhcloud/ods-components';

export type AssignTagButtonProps = {
  onClick: () => void;
};

export default function AssignTagButton({ onClick }: AssignTagButtonProps) {
  const { t } = useTranslation('tag-manager');

  return (
    <ManagerButton
      id="assign-tag"
      label={t('assignTags')}
      onClick={onClick}
      variant={ODS_BUTTON_VARIANT.outline}
      icon={ODS_ICON_NAME.plus}
    ></ManagerButton>
  );
}
