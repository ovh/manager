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
import { useDeleteNashaPartitionCustomSnapshot } from '@/hooks/nasha/useSnapshots';
import { PREFIX_TRACKING_SNAPSHOT_POLICY } from '@/constants/nasha.constants';
import { urls } from '@/routes/Routes.constants';
import type { NashaPartition } from '@/types/nasha.type';

interface PartitionContext {
  partition: NashaPartition;
  serviceName: string;
  partitionName: string;
}

export default function SnapshotDeleteModal() {
  const { partition, serviceName, partitionName } = useOutletContext<PartitionContext>();
  const { customSnapshotName } = useParams<{ customSnapshotName: string }>();
  const { t } = useTranslation('components');
  const navigate = useNavigate();
  const { tracking } = React.useContext(ShellContext).shell;

  const [isOpen, setIsOpen] = useState(true);

  const deleteSnapshot = useDeleteNashaPartitionCustomSnapshot();

  const handleClose = () => {
    setIsOpen(false);
    navigate(urls.partitionSnapshots(serviceName, partitionName));
  };

  const handleSubmit = async () => {
    tracking?.trackClick({
      name: `${PREFIX_TRACKING_SNAPSHOT_POLICY}::confirm-delete-snapshot`,
      type: 'action',
    });

    try {
      await deleteSnapshot.mutateAsync({
        serviceName,
        partitionName,
        customSnapshotName: customSnapshotName!,
      });
      handleClose();
    } catch (error) {
      // Error handling is done via React Query
    }
  };

  const handleCancel = () => {
    tracking?.trackClick({
      name: `${PREFIX_TRACKING_SNAPSHOT_POLICY}::cancel-delete-snapshot`,
      type: 'action',
    });
    handleClose();
  };

  return (
    <Modal open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>
            {t('nasha_components_partition_snapshot_delete_title')}
          </ModalTitle>
          <ModalClose />
        </ModalHeader>
        <ModalDescription>
          <Text preset={TEXT_PRESET.paragraph}>
            {t('nasha_components_partition_snapshot_delete_content', {
              name: customSnapshotName,
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
            {t('nasha_components_partition_snapshot_delete_cancel')}
          </Button>
          <Button
            color={BUTTON_COLOR.critical}
            onClick={handleSubmit}
            disabled={deleteSnapshot.isPending}
            isLoading={deleteSnapshot.isPending}
          >
            {t('nasha_components_partition_snapshot_delete_submit')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

