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
  readonly currentProtectionState: string;
  readonly open: boolean;
  readonly updateDomain: () => void;
  readonly onClose: () => void;
}

export default function TransferModal({
  serviceName,
  currentProtectionState,
  open,
  updateDomain,
  onClose,
}: TransferModalProps) {
  const { t } = useTranslation(['domain', NAMESPACES.ACTIONS]);

  return (
    <Modal open={open}>
      <ModalContent
        color={
          currentProtectionState === ProtectionStateEnum.UNPROTECTED
            ? MODAL_COLOR.information
            : MODAL_COLOR.critical
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
            {currentProtectionState === ProtectionStateEnum.UNPROTECTED
              ? t('domain_tab_general_information_transfer_activation_modal')
              : t('domain_tab_general_information_transfer_deactivate_modal')}
          </Text>
          <Text preset={TEXT_PRESET.paragraph}>
            {currentProtectionState === ProtectionStateEnum.UNPROTECTED ? (
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
          {currentProtectionState === ProtectionStateEnum.PROTECTED && (
            <Message color={MESSAGE_COLOR.information} dismissible={false}>
              {t(
                'domain_tab_general_information_transfer_content_deactivate_modal_info',
              )}
            </Message>
          )}
          <div className="self-end flex gap-4">
            <Button variant="ghost" onClick={() => onClose()}>
              {t(`${NAMESPACES.ACTIONS}:cancel`)}
            </Button>
            <Button
              color={
                currentProtectionState === ProtectionStateEnum.UNPROTECTED
                  ? BUTTON_COLOR.information
                  : BUTTON_COLOR.critical
              }
              onClick={updateDomain}
            >
              {t(`${NAMESPACES.ACTIONS}:confirm`)}
            </Button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
