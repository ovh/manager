import React from 'react';
import { useTranslation } from 'react-i18next';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
// import { OsdsModal } from '@ovhcloud/ods-components/modal/react';
import {
  ODS_BUTTON_TYPE,
  ODS_BUTTON_VARIANT,
} from '@ovhcloud/ods-components/button';
import { OsdsButton } from '@ovhcloud/ods-components/button/react';
import { ODS_MESSAGE_TYPE } from '@ovhcloud/ods-components/message';
import { OsdsMessage } from '@ovhcloud/ods-components/message/react';
import { OsdsSpinner } from '@ovhcloud/ods-components/spinner/react';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components/spinner';
import { useVrackServicesAllowedVrack } from '@/api';
import { AssociateVrack } from './AssociateVrack';
import { CreateVrack } from './CreateVrack';

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
  const { allowedVrackList, isError, isLoading } = useVrackServicesAllowedVrack(
    vrackServicesId,
  );

  if (!vrackServicesId) {
    return <></>;
  }

  return (
    // TODO: Put back ODS modal when the buttons work
    // <OsdsModal
    //   dismissible
    //   headline={t('modalVrackAssociationTitle')}
    //   masked={!vrackServicesId || undefined}
    //   onOdsModalClose={closeModal}
    // >
    <div
      style={{
        display: vrackServicesId ? 'flex' : 'none',
        flexDirection: 'column',
        padding: '20px',
        margin: '20px',
        border: '3px solid black',
      }}
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
          onClick={closeModal}
          onKeyDown={(event: React.KeyboardEvent) => {
            if ([' ', 'Enter'].includes(event.key)) {
              closeModal();
            }
          }}
        >
          {t('modalCancelVrackAssociationButtonLabel')}
        </OsdsButton>
      )}
    </div>
    // </OsdsModal>
  );
};
