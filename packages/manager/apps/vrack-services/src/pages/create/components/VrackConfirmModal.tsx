import React from 'react';
import { useTranslation } from 'react-i18next';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_TYPE,
  ODS_BUTTON_VARIANT,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsModal,
  OsdsButton,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { handleClick } from '@/utils/ods-utils';

export type Props = {
  isModalVisible?: boolean;
  cancelDataTracking?: string;
  confirmDataTracking?: string;
  denyDataTracking?: string;
  onCancel: () => void;
  onDeny: () => void;
  onConfirm: () => void;
};

export const VrackConfirmModal: React.FC<Props> = ({
  isModalVisible,
  cancelDataTracking,
  confirmDataTracking,
  denyDataTracking,
  onCancel,
  onConfirm,
  onDeny,
}) => {
  const { t } = useTranslation('vrack-services/create');

  return (
    <OsdsModal
      dismissible
      headline={t('modalHeadline')}
      masked={!isModalVisible || undefined}
      onOdsModalClose={onCancel}
    >
      <OsdsText
        className="block mb-4"
        level={ODS_TEXT_LEVEL.body}
        size={ODS_TEXT_SIZE._400}
        color={ODS_THEME_COLOR_INTENT.text}
      >
        {t('modalDescriptionLine1')}
      </OsdsText>
      <OsdsText
        className="block mb-4"
        level={ODS_TEXT_LEVEL.body}
        size={ODS_TEXT_SIZE._400}
        color={ODS_THEME_COLOR_INTENT.text}
      >
        {t('modalDescriptionLine2')}
      </OsdsText>
      <OsdsText
        className="block"
        level={ODS_TEXT_LEVEL.body}
        size={ODS_TEXT_SIZE._400}
        color={ODS_THEME_COLOR_INTENT.text}
      >
        {t('modalDescriptionLine3')}
      </OsdsText>
      <OsdsButton
        slot="actions"
        type={ODS_BUTTON_TYPE.button}
        variant={ODS_BUTTON_VARIANT.ghost}
        color={ODS_THEME_COLOR_INTENT.primary}
        data-tracking={cancelDataTracking}
        {...handleClick(onCancel)}
      >
        {t('modalCancelButtonLabel')}
      </OsdsButton>
      <OsdsButton
        slot="actions"
        type={ODS_BUTTON_TYPE.button}
        variant={ODS_BUTTON_VARIANT.stroked}
        color={ODS_THEME_COLOR_INTENT.primary}
        data-tracking={denyDataTracking}
        {...handleClick(onDeny)}
      >
        {t('modalNoVrackButtonLabel')}
      </OsdsButton>
      <OsdsButton
        slot="actions"
        type={ODS_BUTTON_TYPE.button}
        variant={ODS_BUTTON_VARIANT.flat}
        color={ODS_THEME_COLOR_INTENT.primary}
        data-tracking={confirmDataTracking}
        {...handleClick(onConfirm)}
      >
        {t('modalConfirmVrackButtonLabel')}
      </OsdsButton>
    </OsdsModal>
  );
};
