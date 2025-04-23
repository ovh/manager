import React from 'react';
import { useTranslation } from 'react-i18next';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  OsdsText,
  OsdsMessage,
  OsdsSpinner,
  OsdsModal,
  OsdsButton,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_TYPE,
  ODS_BUTTON_VARIANT,
  ODS_MESSAGE_TYPE,
  ODS_SPINNER_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { handleClick } from '../../../utils/click-utils';
import './translations/translations';

export type DeleteModalProps = {
  /**
   * @deprecated use serviceTypeName instead. Headline of modal will have a fixed text
   */
  headline?: string;
  // serviceType: enum;
  serviceTypeName?: string;
  /**
   * Description of modal will have a fixed text
   * @deprecated use children instead
   */
  description?: string;
  /**
   * @deprecated input field has been removed
   */
  deleteInputLabel?: string;
  closeModal: () => void;
  isLoading?: boolean;
  onConfirmDelete: () => void;
  error?: string;
  /**
   * @deprecated the button label is now fixed text
   */
  cancelButtonLabel?: string;
  /**
   * @deprecated the button label is now fixed text
   */
  confirmButtonLabel?: string;
  children?: React.ReactNode;
  /**
   * @deprecated input field has been removed
   */
  terminateValue?: string;
};

export const DeleteModal: React.FC<DeleteModalProps> = ({
  headline,
  description,
  deleteInputLabel,
  terminateValue,
  serviceTypeName,
  closeModal,
  isLoading,
  onConfirmDelete,
  error,
  children,
  cancelButtonLabel,
  confirmButtonLabel,
}) => {
  const { t } = useTranslation('delete-modal');
  const close = React.useCallback(() => {
    closeModal();
  }, []);

  return (
    <OsdsModal
      dismissible
      color={ODS_THEME_COLOR_INTENT.warning}
      headline={t('deleteModalHeadline', {
        serviceType: serviceTypeName || t('deleteModalHeadlineService'),
      })}
      onOdsModalClose={close}
    >
      {!!error && (
        <OsdsMessage type={ODS_MESSAGE_TYPE.error}>
          <OsdsText
            level={ODS_TEXT_LEVEL.body}
            size={ODS_TEXT_SIZE._400}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {t('deleteModalError', { error })}
          </OsdsText>
        </OsdsMessage>
      )}
      <OsdsText
        data-testid="manager-delete-modal-description"
        color={ODS_THEME_COLOR_INTENT.text}
        level={ODS_TEXT_LEVEL.body}
        className="block my-4"
      >
        {t('deleteModalDescription')}
      </OsdsText>
      {isLoading && (
        <div className="flex justify-center">
          <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />
        </div>
      )}
      {children}
      <OsdsButton
        disabled={isLoading || undefined}
        slot="actions"
        data-testid="manager-delete-modal-cancel"
        type={ODS_BUTTON_TYPE.button}
        variant={ODS_BUTTON_VARIANT.ghost}
        color={ODS_THEME_COLOR_INTENT.primary}
        {...handleClick(close)}
      >
        {t('deleteModalCancelButton')}
      </OsdsButton>
      <OsdsButton
        disabled={isLoading || undefined}
        slot="actions"
        data-testid="manager-delete-modal-confirm"
        type={ODS_BUTTON_TYPE.button}
        variant={ODS_BUTTON_VARIANT.flat}
        color={ODS_THEME_COLOR_INTENT.primary}
        {...handleClick(() => {
          onConfirmDelete();
        })}
      >
        {t('deleteModalDeleteButton')}
      </OsdsButton>
    </OsdsModal>
  );
};
