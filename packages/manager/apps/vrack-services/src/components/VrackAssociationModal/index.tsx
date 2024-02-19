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
  dataTrackingPath?: string;
  vrackServicesId?: string;
  closeModal: () => void;
};

export const VrackAssociationModal: React.FC<VrackAssociationModalProps> = ({
  dataTrackingPath,
  vrackServicesId,
  closeModal,
}) => {
  const { t } = useTranslation('vrack-services/listing');
  const { allowedVrackList, isError, isLoading, error } = useAllowedVrackList(
    vrackServicesId,
  );
  const close = () => {
    closeModal();
  };

  if (!vrackServicesId) {
    return <></>;
  }

  return (
    <OsdsModal
      dismissible
      headline={t('modalVrackAssociationTitle')}
      masked={!vrackServicesId || undefined}
      onOdsModalClose={close}
    >
      {isError && (
        <OsdsMessage type={ODS_MESSAGE_TYPE.error}>
          {t('genericApiError', { error: error?.response?.data.message })}
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
        <CreateVrack dataTrackingPath={dataTrackingPath} closeModal={close} />
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
