import React from 'react';

import { useTranslation } from 'react-i18next';

import { Button, Modal, ModalBody, ModalContent, ModalHeader, Text } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { TAclData } from '@/pages/dashboard/Acl/acl.view-model';

type TAclDeleteModalProps = {
  open: boolean;
  aclData: TAclData | null;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export const AclDeleteModal: React.FC<TAclDeleteModalProps> = ({
  open,
  aclData,
  isDeleting,
  onConfirm,
  onCancel,
}) => {
  const { t } = useTranslation(['acl', NAMESPACES.ACTIONS]);

  return (
    <Modal open={open} onOpenChange={onCancel}>
      <ModalContent dismissible={false} aria-labelledby="delete-acl-title">
        <ModalHeader className="bg-[--ods-color-primary-100] pb-5" />
        <ModalBody className="flex flex-col gap-6">
          <Text id="delete-acl-title" preset="heading-4">
            {t('acl:deleteModal.title')}
          </Text>
          <Text preset="paragraph">
            {t('acl:deleteModal.description', {
              accessTo: aclData?.accessTo ?? '',
            })}
          </Text>

          <footer className="flex justify-end gap-4">
            <Button
              variant="ghost"
              color="primary"
              onClick={onCancel}
              type="button"
              disabled={isDeleting}
            >
              {t('acl:deleteModal.close')}
            </Button>
            <Button
              variant="default"
              color="primary"
              disabled={isDeleting}
              onClick={onConfirm}
              type="button"
            >
              {t('acl:deleteModal.confirmButton')}
            </Button>
          </footer>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
