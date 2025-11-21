import React from 'react';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  Button,
  BUTTON_COLOR,
  Modal,
  MODAL_COLOR,
  ModalBody,
  ModalContent,
  Text,
  TEXT_PRESET,
} from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { DnssecStatusEnum } from '@/domain/enum/dnssecStatus.enum';

interface DnssecModalProps {
  readonly action: string;
  readonly open: boolean;
  readonly updateDnssec: () => void;
  readonly onClose: () => void;
}

export default function DnssecModal({
  action,
  open,
  updateDnssec,
  onClose,
}: DnssecModalProps) {
  const { t } = useTranslation(['domain', NAMESPACES.ACTIONS]);

  return (
    <Modal open={open}>
      <ModalContent
        color={
          action === DnssecStatusEnum.DISABLED
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
            {action === DnssecStatusEnum.DISABLED
              ? t('domain_tab_general_information_dnssec_activation_modal')
              : t('domain_tab_general_information_dnssec_deactivate_modal')}
          </Text>
          <Text preset={TEXT_PRESET.paragraph}>
            {action === DnssecStatusEnum.DISABLED
              ? t(
                  'domain_tab_general_information_dnssec_content_activation_modal',
                )
              : t(
                  'domain_tab_general_information_dnssec_content_deactivate_modal',
                )}
          </Text>
          <Text preset={TEXT_PRESET.paragraph}>
            {t('domain_tab_general_information_dnssec_content_action')}
          </Text>
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
                action === DnssecStatusEnum.DISABLED
                  ? BUTTON_COLOR.information
                  : BUTTON_COLOR.critical
              }
              onClick={() => updateDnssec()}
            >
              {t(`${NAMESPACES.ACTIONS}:confirm`)}
            </Button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
