import React, { FunctionComponent } from 'react';
import {
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_SPINNER_SIZE,
  ODS_TEXT_COLOR_HUE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsIcon,
  OsdsModal,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';

type Props = {
  isPending: boolean;
  onClose: () => void;
  onValidate: () => void;
};

export const ConfirmModal: FunctionComponent<Props> = ({
  onClose,
  onValidate,
  isPending,
}) => {
  const { t } = useTranslation('account-disable-2fa');

  return (
    <OsdsModal
      dismissible={false}
      onOdsModalClose={onClose}
      headline={t(
        'account-disable-2fa-create-form-confirm-modal-send-document-title',
      )}
    >
      <div className="flex items-center gap-x-6">
        <div className="rounded-full p-4 bg-[#bef1ff]">
          <OsdsIcon
            size={ODS_ICON_SIZE.xl}
            className="block"
            color={ODS_THEME_COLOR_INTENT.text}
            name={ODS_ICON_NAME.INFO_CIRCLE}
          ></OsdsIcon>
        </div>
        <div>
          <OsdsText
            level={ODS_TEXT_LEVEL.caption}
            color={ODS_THEME_COLOR_INTENT.text}
            size={ODS_TEXT_SIZE._300}
            className="block"
            hue={ODS_TEXT_COLOR_HUE._500}
          >
            {t(
              'account-disable-2fa-create-form-confirm-modal-send-document-description-insure',
            )}
          </OsdsText>
          <OsdsText
            level={ODS_TEXT_LEVEL.caption}
            color={ODS_THEME_COLOR_INTENT.text}
            size={ODS_TEXT_SIZE._300}
            className="block mt-2"
            hue={ODS_TEXT_COLOR_HUE._500}
          >
            {t(
              'account-disable-2fa-create-form-confirm-modal-send-document-description-confirm',
            )}
          </OsdsText>
        </div>
      </div>

      {isPending ? (
        <OsdsSpinner slot="actions" inline size={ODS_SPINNER_SIZE.md} />
      ) : (
        <>
          <OsdsButton
            slot="actions"
            variant={ODS_BUTTON_VARIANT.ghost}
            color={ODS_THEME_COLOR_INTENT.primary}
            onClick={onClose}
          >
            {t('account-disable-2fa-confirm-modal-no')}
          </OsdsButton>
          <OsdsButton
            slot="actions"
            onClick={onValidate}
            disabled={isPending || undefined}
            variant={ODS_BUTTON_VARIANT.flat}
            color={ODS_THEME_COLOR_INTENT.primary}
          >
            {t('account-disable-2fa-confirm-modal-yes')}
          </OsdsButton>
        </>
      )}
    </OsdsModal>
  );
};
