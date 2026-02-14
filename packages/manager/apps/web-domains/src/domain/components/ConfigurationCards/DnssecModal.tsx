import React from 'react';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  Button,
  BUTTON_COLOR,
  Modal,
  MODAL_COLOR,
  ModalHeader,
  ModalBody,
  ModalContent,
  Text,
  TEXT_PRESET,
} from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';

interface DnssecModalProps {
  readonly isEnableDnssecAction: boolean;
  readonly open: boolean;
  readonly updateDnssec: () => void;
  readonly onClose: () => void;
}

export default function DnssecModal({
  isEnableDnssecAction,
  open,
  updateDnssec,
  onClose,
}: DnssecModalProps) {
  const { t } = useTranslation(['domain', NAMESPACES.ACTIONS]);

  const { modalColor, buttonColor, titleKey, contentKey } = isEnableDnssecAction
    ? {
        modalColor: MODAL_COLOR.information,
        buttonColor: BUTTON_COLOR.information,
        titleKey: 'domain_tab_general_information_dnssec_activation_modal',
        contentKey:
          'domain_tab_general_information_dnssec_content_activation_modal',
      }
    : {
        modalColor: MODAL_COLOR.critical,
        buttonColor: BUTTON_COLOR.critical,
        titleKey: 'domain_tab_general_information_dnssec_deactivate_modal',
        contentKey:
          'domain_tab_general_information_dnssec_content_deactivate_modal',
      };

  return (
    <Modal open={open}>
      <ModalContent color={modalColor} dismissible={false}>
        <ModalHeader>
          <Text preset={TEXT_PRESET.heading4}>{t(titleKey)}</Text>
        </ModalHeader>
        <ModalBody
          style={{
            display: 'flex',
            flexDirection: 'column',
            rowGap: '16px',
          }}
        >
          <Text preset={TEXT_PRESET.heading2}>{t(titleKey)}</Text>
          <Text preset={TEXT_PRESET.paragraph}>{t(contentKey)}</Text>
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
            <Button variant="ghost" onClick={onClose}>
              {t(`${NAMESPACES.ACTIONS}:cancel`)}
            </Button>
            <Button color={buttonColor} onClick={updateDnssec}>
              {t(`${NAMESPACES.ACTIONS}:confirm`)}
            </Button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
