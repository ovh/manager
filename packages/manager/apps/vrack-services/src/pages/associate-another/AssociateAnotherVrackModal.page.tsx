import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  OsdsButton,
  OsdsModal,
  OsdsMessage,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_TYPE,
  ODS_BUTTON_VARIANT,
  ODS_MESSAGE_TYPE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { handleClick } from '@ovhcloud/manager-components';
import { useVrackList } from '@/data';
import { AssociateAnotherVrack } from './AssociateAnotherVrack.component';
import { CreateVrack } from '@/components/CreateVrack.component';
import { LoadingText } from '@/components/LoadingText.component';

export default function AssociateAnotherVrackModal() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { trackClick } = useOvhTracking();
  const { t } = useTranslation('vrack-services/associate');
  const { vrackList, isError, isLoading, error } = useVrackList();
  const closeModal = () => {
    trackClick({
      location: PageLocation.popup,
      buttonType: ButtonType.button,
      actionType: 'exit',
      actions: ['associate-another-vrack', 'cancel'],
    });
    navigate('..');
  };

  if (!id) {
    return closeModal();
  }

  return (
    <OsdsModal
      dismissible
      headline={t('modalAssociateAnotherVrackTitle')}
      onOdsModalClose={closeModal}
    >
      {isError && (
        <OsdsMessage className="mb-4" type={ODS_MESSAGE_TYPE.error}>
          <OsdsText
            level={ODS_TEXT_LEVEL.body}
            size={ODS_TEXT_SIZE._400}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {t('modalVrackAssociationError', {
              error: error?.response?.data?.message,
            })}
          </OsdsText>
        </OsdsMessage>
      )}
      {isLoading && <LoadingText title={t('modalLoadingVrackList')} />}
      {!isLoading && !isError && vrackList.length > 0 && (
        <AssociateAnotherVrack closeModal={closeModal} vrackList={vrackList} />
      )}
      {!isLoading && !isError && vrackList.length === 0 && (
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
          {t('modalAssociateCancelButton')}
        </OsdsButton>
      )}
    </OsdsModal>
  );
}
