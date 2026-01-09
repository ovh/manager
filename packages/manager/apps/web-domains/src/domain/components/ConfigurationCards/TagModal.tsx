import React from 'react';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  Button,
  FormField,
  FormFieldError,
  Input,
  Modal,
  MODAL_COLOR,
  ModalBody,
  ModalContent,
  Text,
  TEXT_PRESET,
} from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';

interface TransferTagModalProps {
  readonly open: boolean;
  readonly serviceName: string;
  readonly tag?: string;
  readonly isTransferTagPending: boolean;
  readonly transferTagError?: Error;
  readonly setTag: React.Dispatch<React.SetStateAction<string>>;
  readonly handleTag: () => void;
  readonly onClose: () => void;
}

export default function TransferTagModal({
  open,
  serviceName,
  tag,
  isTransferTagPending,
  transferTagError,
  setTag,
  handleTag,
  onClose,
}: TransferTagModalProps) {
  const { t } = useTranslation(['domain', NAMESPACES.ACTIONS]);
  return (
    <Modal open={open}>
      <ModalContent color={MODAL_COLOR.information} dismissible={false}>
        <ModalBody className="flex flex-col gap-y-6">
          <Text preset={TEXT_PRESET.heading2}>
            {t('domain_tab_general_information_transfer_tag')}
          </Text>
          <Text preset={TEXT_PRESET.paragraph}>
            {t('domain_tab_general_information_transfer_tag_modal_info', {
              serviceName,
            })}
          </Text>
          <FormField invalid={!!transferTagError}>
            <Input
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              loading={isTransferTagPending}
            />
            {transferTagError && (
              <FormFieldError>
                {t('domain_tab_general_information_transfer_tag_error')}
              </FormFieldError>
            )}
          </FormField>
          <div className="self-end gap-x-4 flex">
            <Button onClick={() => onClose()}>
              {t(`${NAMESPACES.ACTIONS}:close`)}
            </Button>
            <Button
              onClick={() => handleTag()}
              disabled={!tag || tag.length === 0}
            >
              {t(`${NAMESPACES.ACTIONS}:confirm`)}
            </Button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
