import React, { useState } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Modal,
  ModalBody,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  Button,
  BUTTON_COLOR,
  BUTTON_VARIANT,
  Text,
  TEXT_PRESET,
} from '@ovhcloud/ods-react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useDeleteNashaPartitionAccess } from '@/hooks/nasha/useAccesses';
import { PREFIX_TRACKING_PARTITION_ACL } from '@/constants/nasha.constants';
import { urls } from '@/routes/Routes.constants';
import type { NashaPartition } from '@/types/nasha.type';

interface PartitionContext {
  partition: NashaPartition;
  serviceName: string;
  partitionName: string;
}

export default function AccessDeleteModal() {
  const { partition, serviceName, partitionName } = useOutletContext<PartitionContext>();
  const { ip } = useParams<{ ip: string }>();
  const { t } = useTranslation('components');
  const navigate = useNavigate();
  const { tracking } = React.useContext(ShellContext).shell;

  const [isOpen, setIsOpen] = useState(true);

  const deleteAccess = useDeleteNashaPartitionAccess();

  const handleClose = () => {
    setIsOpen(false);
    navigate(urls.partitionAccesses(serviceName, partitionName));
  };

  const handleSubmit = async () => {
    tracking?.trackClick({
      name: `${PREFIX_TRACKING_PARTITION_ACL}::confirm-delete-access`,
      type: 'action',
    });

    try {
      await deleteAccess.mutateAsync({
        serviceName,
        partitionName,
        ip: ip!,
      });
      handleClose();
    } catch (error) {
      // Error handling is done via React Query
    }
  };

  const handleCancel = () => {
    tracking?.trackClick({
      name: `${PREFIX_TRACKING_PARTITION_ACL}::cancel-delete-access`,
      type: 'action',
    });
    handleClose();
  };

  return (
    <Modal open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>
            {t('nasha_components_partition_access_delete_title')}
          </ModalTitle>
          <ModalClose />
        </ModalHeader>
        <ModalDescription>
          <Text preset={TEXT_PRESET.paragraph}>
            {t('nasha_components_partition_access_delete_content', {
              ip,
              partitionName: partition?.partitionName,
            })}
          </Text>
        </ModalDescription>
        <ModalBody />
        <ModalFooter>
          <Button
            variant={BUTTON_VARIANT.outline}
            color={BUTTON_COLOR.neutral}
            onClick={handleCancel}
          >
            {t('nasha_components_partition_access_delete_cancel')}
          </Button>
          <Button
            color={BUTTON_COLOR.critical}
            onClick={handleSubmit}
            disabled={deleteAccess.isPending}
            isLoading={deleteAccess.isPending}
          >
            {t('nasha_components_partition_access_delete_submit')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

