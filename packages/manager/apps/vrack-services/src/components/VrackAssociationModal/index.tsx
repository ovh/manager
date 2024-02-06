import React from 'react';
import { useTranslation } from 'react-i18next';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  OsdsButton,
  OsdsMessage,
  OsdsSpinner,
  OsdsModal,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_TYPE,
  ODS_BUTTON_VARIANT,
  ODS_MESSAGE_TYPE,
  ODS_SPINNER_SIZE,
} from '@ovhcloud/ods-components';
import { useAllowedVrackList } from '@/api';
import { AssociateVrack } from './AssociateVrack';
import { CreateVrack } from './CreateVrack';
import { handleClick } from '@/utils/ods-utils';

export type VrackAssociationModalProps = {
  vrackServicesId?: string;
  disabled?: boolean;
  closeModal: () => void;
};

export const VrackAssociationModal: React.FC<VrackAssociationModalProps> = ({
  vrackServicesId,
  closeModal,
}) => {
  const { t } = useTranslation('vrack-services/listing');
  const modal = React.useRef<HTMLOsdsModalElement>(null);
  const { allowedVrackList, isError, isLoading, error } = useAllowedVrackList(
    vrackServicesId,
  );
  const close = () => {
    closeModal();
    modal.current.close();
  };

  if (!vrackServicesId) {
    return <></>;
  }

  return (
    <OsdsModal
      ref={modal}
      dismissible
      headline={t('modalVrackAssociationTitle')}
      masked={!vrackServicesId || undefined}
      onOdsModalClose={close}
    >
      {isError && (
        <OsdsMessage type={ODS_MESSAGE_TYPE.error}>
          {t('genericApiError', {
            error: error?.response?.data.message,
            interpolation: { escapeValue: false },
          })}
        </OsdsMessage>
      )}
      {isLoading && <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />}
      {!isLoading && !isError && allowedVrackList.length > 0 && (
        <AssociateVrack
          vrackServicesId={vrackServicesId}
          closeModal={close}
          vrackList={allowedVrackList}
        />
      )}
      {!isLoading && !isError && allowedVrackList.length === 0 && (
        <CreateVrack closeModal={close} />
      )}
      {(isLoading || isError) && (
        <OsdsButton
          slot="actions"
          type={ODS_BUTTON_TYPE.button}
          variant={ODS_BUTTON_VARIANT.ghost}
          color={ODS_THEME_COLOR_INTENT.primary}
          {...handleClick(close)}
        >
          {t('modalCancelVrackAssociationButtonLabel')}
        </OsdsButton>
      )}
    </OsdsModal>
  );
};
