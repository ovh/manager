import React, { useContext } from 'react';
import { useNavigate, useParams, useOutletContext } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  Button,
  BUTTON_COLOR,
  BUTTON_VARIANT,
  Modal,
  ModalBody,
  ModalContent,
  MODAL_COLOR,
  Text,
  TEXT_PRESET,
} from '@ovhcloud/ods-react';
import { useDeletePartition } from '@/hooks/nasha';
import { urls } from '@/routes/Routes.constants';
import { PREFIX_TRACKING_DASHBOARD_PARTITION_DELETE } from '@/constants/nasha.constants';

interface PartitionsContext {
  serviceName: string;
}

export default function PartitionDeleteModal() {
  const { serviceName } = useOutletContext<PartitionsContext>();
  const { partitionName } = useParams<{ partitionName: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation('components');
  const { shell } = useContext(ShellContext);

  const deletePartition = useDeletePartition(serviceName);

  const handleClose = () => {
    navigate(urls.partitions(serviceName));
  };

  const handleCancelClick = () => {
    shell?.tracking?.trackClick({
      name: `${PREFIX_TRACKING_DASHBOARD_PARTITION_DELETE}::cancel`,
      type: 'action',
    });
    handleClose();
  };

  const handleSubmit = async () => {
    if (!partitionName) return;

    shell?.tracking?.trackClick({
      name: `${PREFIX_TRACKING_DASHBOARD_PARTITION_DELETE}::confirm`,
      type: 'action',
    });

    try {
      await deletePartition.mutateAsync(partitionName);
      handleClose();
    } catch (err) {
      // Error handling - could show toast
      console.error('Failed to delete partition:', err);
    }
  };

  return (
    <Modal open onOpenChange={(open) => !open && handleClose()}>
      <ModalContent color={MODAL_COLOR.warning}>
        <ModalBody>
          <h2 className="text-xl font-semibold mb-4">
            {t('nasha_components_partition_delete_title')}
          </h2>

          <Text preset={TEXT_PRESET.paragraph} className="mb-6">
            {t('nasha_components_partition_delete_content', { partitionName })}
          </Text>

          <div className="flex justify-end gap-3">
            <Button
              variant={BUTTON_VARIANT.outline}
              color={BUTTON_COLOR.neutral}
              onClick={handleCancelClick}
              disabled={deletePartition.isPending}
            >
              {t('nasha_components_partition_delete_cancel')}
            </Button>
            <Button
              color={BUTTON_COLOR.critical}
              onClick={handleSubmit}
              disabled={deletePartition.isPending}
              loading={deletePartition.isPending}
            >
              {t('nasha_components_partition_delete_submit')}
            </Button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

