import React from 'react';
import { useTranslation } from 'react-i18next';
import { OsdsText } from '@ovhcloud/ods-components/text/react';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components/text';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
// import { OsdsModal } from '@ovhcloud/ods-components/modal/react';
import {
  ODS_BUTTON_TYPE,
  ODS_BUTTON_VARIANT,
} from '@ovhcloud/ods-components/button';
import { OsdsButton } from '@ovhcloud/ods-components/button/react';

export type Props = {
  isModalVisible?: boolean;
  onCancel: () => void;
  onDeny: () => void;
  onConfirm: () => void;
};

export const VrackConfirmModal: React.FC<Props> = ({
  isModalVisible,
  onCancel,
  onConfirm,
  onDeny,
}) => {
  const { t } = useTranslation('vrack-services/create');

  return (
    // TODO: Put back ODS modal when the buttons work
    // <OsdsModal
    //   dismissible={undefined}
    //   headline={t('modalHeadline')}
    //   masked={!isModalVisible || undefined}
    // >
    <div style={{ display: isModalVisible ? 'flex' : 'none' }}>
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
        onClick={onCancel}
        onKeyDown={(event: React.KeyboardEvent) => {
          if ([' ', 'Enter'].includes(event.key)) {
            onCancel();
          }
        }}
      >
        {t('modalCancelButtonLabel')}
      </OsdsButton>
      <OsdsButton
        slot="actions"
        type={ODS_BUTTON_TYPE.button}
        variant={ODS_BUTTON_VARIANT.stroked}
        color={ODS_THEME_COLOR_INTENT.primary}
        onClick={onDeny}
        onKeyDown={(event: React.KeyboardEvent) => {
          if ([' ', 'Enter'].includes(event.key)) {
            onDeny();
          }
        }}
      >
        {t('modalNoVrackButtonLabel')}
      </OsdsButton>
      <OsdsButton
        slot="actions"
        type={ODS_BUTTON_TYPE.button}
        variant={ODS_BUTTON_VARIANT.flat}
        color={ODS_THEME_COLOR_INTENT.primary}
        onClick={onConfirm}
        onKeyDown={(event: React.KeyboardEvent) => {
          if ([' ', 'Enter'].includes(event.key)) {
            onConfirm();
          }
        }}
      >
        {t('modalConfirmVrackButtonLabel')}
      </OsdsButton>
    </div>
    // </OsdsModal>
  );
};
