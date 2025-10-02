import React from 'react';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  Button,
  BUTTON_COLOR,
  Message,
  MESSAGE_COLOR,
  Modal,
  MODAL_COLOR,
  ModalBody,
  ModalContent,
  Text,
  TEXT_PRESET,
} from '@ovhcloud/ods-react';
import { Trans, useTranslation } from 'react-i18next';
import { ProtectionStateEnum } from '@/domain/enum/protectionState.enum';

interface TransferModalProps {
  readonly serviceName: string;
  readonly action: string;
  readonly open: boolean;
  readonly updateDomain: () => void;
  readonly onClose: () => void;
}

export default function TransferModal({
  serviceName,
  action,
  open,
  updateDomain,
  onClose,
}: TransferModalProps) {
  const { t } = useTranslation(['domain', NAMESPACES.ACTIONS]);

  return (
    <Modal open={open}>
      <ModalContent
        color={
          action === ProtectionStateEnum.UNPROTECTED
            ? MODAL_COLOR.critical
            : MODAL_COLOR.information
        }
        dismissible={false}
      >
        <ModalBody
          style={{
            display: 'flex',
            flexDirection: 'column',
            rowGap: '16px',
          }}
        >
          <Text preset={TEXT_PRESET.heading2}>
            {action === ProtectionStateEnum.UNPROTECTED
              ? t('domain_tab_general_information_transfer_deactivate_modal')
              : t('domain_tab_general_information_transfer_activation_modal')}
          </Text>
          <Text preset={TEXT_PRESET.paragraph}>
            {action === ProtectionStateEnum.UNPROTECTED ? (
              <Trans
                i18nKey="domain_tab_general_information_transfer_content_activation_modal"
                t={t}
                components={{
                  Domain: <span className="font-bold">{serviceName}</span>,
                }}
              />
            ) : (
              <Trans
                i18nKey="domain_tab_general_information_transfer_content_deactivate_modal"
                t={t}
                components={{
                  Domain: <span className="font-bold">{serviceName}</span>,
                }}
              />
            )}
          </Text>
          {action === ProtectionStateEnum.UNPROTECTED && (
            <Message color={MESSAGE_COLOR.information} dismissible={false}>
              {t(
                'domain_tab_general_information_transfer_content_deactivate_modal_info',
              )}
            </Message>
          )}
          <div
            style={{
              alignSelf: 'flex-end',
              columnGap: '8px',
              display: 'flex',
            }}
          >
            <Button variant="ghost" onClick={() => onClose()}>
              {t(`${NAMESPACES.ACTIONS}:cancel`)}
            </Button>
            <Button
              color={
                action === ProtectionStateEnum.UNPROTECTED
                  ? BUTTON_COLOR.critical
                  : BUTTON_COLOR.information
              }
              onClick={() => updateDomain()}
            >
              {t(`${NAMESPACES.ACTIONS}:confirm`)}
            </Button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
