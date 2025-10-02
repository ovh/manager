import React from 'react';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  Button,
  Clipboard,
  ClipboardControl,
  ClipboardTrigger,
  Message,
  MESSAGE_COLOR,
  MessageIcon,
  Modal,
  MODAL_COLOR,
  ModalBody,
  ModalContent,
  Text,
  TEXT_PRESET,
} from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';

interface TransferAuthInfoModalProps {
  readonly open: boolean;
  readonly isAuthInfoLoading: boolean;
  readonly authInfo: string | null;
  readonly onClose: () => void;
}

export default function TransferAuthInfoModal({
  open,
  authInfo,
  onClose,
  isAuthInfoLoading,
}: TransferAuthInfoModalProps) {
  const { t } = useTranslation(['domain', NAMESPACES.ACTIONS]);

  return (
    <Modal open={open}>
      <ModalContent color={MODAL_COLOR.information} dismissible={false}>
        <ModalBody
          style={{
            display: 'flex',
            flexDirection: 'column',
            rowGap: '16px',
          }}
        >
          <Text preset={TEXT_PRESET.heading2}>
            {t('domain_tab_general_information_transfer_authinfo_modal_title')}
          </Text>
          <Message color={MESSAGE_COLOR.information} dismissible={false}>
            <MessageIcon name="circle-info" />
            {t(
              'domain_tab_general_information_transfer_authinfo_modal_info_msg',
            )}
          </Message>
          <Message color={MESSAGE_COLOR.warning} dismissible={false}>
            <MessageIcon name="triangle-exclamation" />
            {t(
              'domain_tab_general_information_transfer_authinfo_modal_warning_msg',
            )}
          </Message>
          {!authInfo ? (
            <Text preset={TEXT_PRESET.paragraph}>
              {t(
                'domain_tab_general_information_transfer_authinfo_modal_info_not_supported',
              )}
            </Text>
          ) : (
            <Clipboard value={authInfo}>
              <ClipboardControl loading={isAuthInfoLoading} />
              <ClipboardTrigger />
            </Clipboard>
          )}
          <div
            style={{
              alignSelf: 'flex-end',
              columnGap: '8px',
              display: 'flex',
            }}
          >
            <Button onClick={() => onClose()}>
              {t(`${NAMESPACES.ACTIONS}:close`)}
            </Button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
