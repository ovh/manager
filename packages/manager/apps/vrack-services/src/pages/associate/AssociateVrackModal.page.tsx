import React from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import {
  BUTTON_VARIANT,
  Button,
  MESSAGE_COLOR,
  Message,
  MessageBody,
  MessageIcon,
  Modal,
  ModalBody,
  ModalContent,
  TEXT_PRESET,
  Text,
} from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useAllowedVrackList } from '@ovh-ux/manager-network-common';
import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { CreateVrack } from '@/components/CreateVrack.component';
import { LoadingText } from '@/components/LoadingText.component';
import { TRANSLATION_NAMESPACES } from '@/utils/constants';

import { AssociateVrack } from './AssociateVrack.component';

export default function AssociateVrackModal() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { trackClick } = useOvhTracking();
  const { t } = useTranslation([TRANSLATION_NAMESPACES.associate, NAMESPACES.ACTIONS]);
  const { allowedVrackList, isError, isLoading, error, vrackListInError } = useAllowedVrackList(id);
  const closeModal = () => {
    trackClick({
      location: PageLocation.popup,
      buttonType: ButtonType.button,
      actionType: 'exit',
      actions: ['associate-vrack', 'cancel'],
    });
    navigate('..');
  };

  if (!id) {
    closeModal();
    return <></>;
  }

  return (
    <Modal open closeOnEscape={false} closeOnInteractOutside={false} onOpenChange={closeModal}>
      <ModalContent dismissible={false}>
        <ModalBody>
          <Text className="mb-4 block" preset={TEXT_PRESET.heading4}>
            {t('modalVrackAssociationTitle')}
          </Text>
          {isError && (
            <Message dismissible={false} className="mb-4" color={MESSAGE_COLOR.critical}>
              <MessageIcon name="hexagon-exclamation" />
              <MessageBody>
                {t('modalVrackAssociationError', {
                  error: error?.response?.data?.message,
                })}
              </MessageBody>
            </Message>
          )}
          {vrackListInError.length > 0 && (
            <Message dismissible={false} className="mb-4" color={MESSAGE_COLOR.warning}>
              <MessageIcon name="triangle-exclamation" />
              <MessageBody>
                {t('modalVrackListInError', {
                  list: vrackListInError.join(', '),
                })}
              </MessageBody>
            </Message>
          )}
          {isLoading && <LoadingText title={t('modalLoadingVrackList')} />}
          {!isLoading && !isError && allowedVrackList.length > 0 && (
            <AssociateVrack closeModal={closeModal} vrackList={allowedVrackList} />
          )}
          {!isLoading && !isError && allowedVrackList.length === 0 && (
            <CreateVrack closeModal={closeModal} />
          )}
          {(isLoading || isError) && (
            <div className="flex justify-end">
              <Button
                slot="actions"
                type="button"
                variant={BUTTON_VARIANT.ghost}
                onClick={closeModal}
              >
                {t('cancel', { ns: NAMESPACES.ACTIONS })}
              </Button>
            </div>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
