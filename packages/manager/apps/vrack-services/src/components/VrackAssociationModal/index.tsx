import React from 'react';
import { useTranslation } from 'react-i18next';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OsdsModal } from '@ovhcloud/ods-components/modal/react';
import {
  ODS_BUTTON_TYPE,
  ODS_BUTTON_VARIANT,
} from '@ovhcloud/ods-components/button';
import { OsdsButton } from '@ovhcloud/ods-components/button/react';
import { ODS_MESSAGE_TYPE } from '@ovhcloud/ods-components/message';
import { OsdsMessage } from '@ovhcloud/ods-components/message/react';
import { OsdsSpinner } from '@ovhcloud/ods-components/spinner/react';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components/spinner';
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
  const { allowedVrackList, isError, isLoading } = useAllowedVrackList(
    vrackServicesId,
  );

  if (!vrackServicesId) {
    return <></>;
  }

  return (
    <OsdsModal
      dismissible
      headline={t('modalVrackAssociationTitle')}
      masked={!vrackServicesId || undefined}
      onOdsModalClose={closeModal}
    >
      {isError && (
        <OsdsMessage type={ODS_MESSAGE_TYPE.error}>
          {t('genericApiError')}
        </OsdsMessage>
      )}
      {isLoading && <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />}
      {!isLoading && !isError && allowedVrackList.length > 0 && (
        <AssociateVrack
          vrackServicesId={vrackServicesId}
          closeModal={closeModal}
          vrackList={allowedVrackList}
        />
      )}
      {!isLoading && !isError && allowedVrackList.length === 0 && (
        <CreateVrack closeModal={closeModal} />
      )}
      {(isLoading || isError) && (
        <OsdsButton
          slot="actions"
          type={ODS_BUTTON_TYPE.button}
          variant={ODS_BUTTON_VARIANT.ghost}
          color={ODS_THEME_COLOR_INTENT.primary}
          {...handleClick(closeModal)}
        >
          {t('modalCancelVrackAssociationButtonLabel')}
        </OsdsButton>
      )}
    </OsdsModal>
  );
};
