import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
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
  FormField,
  Input,
  Text,
  TEXT_PRESET,
} from '@ovhcloud/ods-react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useUpdateNashaPartition } from '@/hooks/nasha/usePartitions';
import { useNashaPartitionAllocatedSize } from '@/hooks/nasha/useNasha';
import { SIZE_MIN, PREFIX_TRACKING_DASHBOARD_PARTITION_UPDATE_SIZE } from '@/constants/nasha.constants';
import { urls } from '@/routes/Routes.constants';
import type { Nasha, NashaPartition } from '@/types/nasha.type';

interface PartitionContext {
  nasha: Nasha;
  partition: NashaPartition;
  serviceName: string;
  partitionName: string;
}

export default function PartitionEditSizeModal() {
  const { nasha, partition, serviceName, partitionName } = useOutletContext<PartitionContext>();
  const { t } = useTranslation('components');
  const navigate = useNavigate();
  const { tracking } = React.useContext(ShellContext).shell;

  const [size, setSize] = useState(partition?.size || SIZE_MIN);
  const [isOpen, setIsOpen] = useState(true);

  const updatePartition = useUpdateNashaPartition();
  const { data: allocatedSize = 0 } = useNashaPartitionAllocatedSize(serviceName);

  useEffect(() => {
    if (partition) {
      setSize(partition.size);
    }
  }, [partition]);

  const handleClose = () => {
    setIsOpen(false);
    navigate(urls.partition(serviceName, partitionName));
  };

  const handleSubmit = async () => {
    tracking?.trackClick({
      name: `${PREFIX_TRACKING_DASHBOARD_PARTITION_UPDATE_SIZE}::confirm`,
      type: 'action',
    });

    try {
      await updatePartition.mutateAsync({
        serviceName,
        partitionName,
        data: { size },
      });
      handleClose();
    } catch (error) {
      // Error handling is done via React Query
    }
  };

  const handleCancel = () => {
    tracking?.trackClick({
      name: `${PREFIX_TRACKING_DASHBOARD_PARTITION_UPDATE_SIZE}::cancel`,
      type: 'action',
    });
    handleClose();
  };

  // Calculate available space
  const currentPartitionSize = partition?.size || 0;
  const usedByOtherPartitions = allocatedSize - currentPartitionSize;
  const nashaCapacity = nasha?.zpoolCapacity || 0;
  const maxSize = nashaCapacity - usedByOtherPartitions;

  const isSizeValid = size >= SIZE_MIN && size <= maxSize;
  const hasChanged = size !== currentPartitionSize;

  return (
    <Modal open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>
            {t('nasha_partition_edit_size_title')}
          </ModalTitle>
          <ModalClose />
        </ModalHeader>
        <ModalDescription>
          <Text preset={TEXT_PRESET.paragraph}>
            {t('nasha_partition_edit_size_subtitle', {
              partition: partitionName,
            })}
          </Text>
        </ModalDescription>
        <ModalBody>
          <FormField className="mb-4">
            <Text preset={TEXT_PRESET.caption} className="mb-2 block">
              {t('nasha_partition_edit_size_label')} (GB)
            </Text>
            <Input
              type="number"
              name="size"
              value={size.toString()}
              onOdsChange={(e) => setSize(Number(e.detail.value) || SIZE_MIN)}
              min={SIZE_MIN}
              max={maxSize}
            />
            <Text preset={TEXT_PRESET.caption} className="text-gray-500 mt-1">
              {t('nasha_partition_edit_size_available', {
                available: maxSize,
              })}
            </Text>
            {!isSizeValid && (
              <Text preset={TEXT_PRESET.caption} className="text-red-500 mt-1">
                {size < SIZE_MIN
                  ? t('nasha_partition_edit_size_error_min', { min: SIZE_MIN })
                  : t('nasha_partition_edit_size_error_max', { max: maxSize })}
              </Text>
            )}
          </FormField>
        </ModalBody>
        <ModalFooter>
          <Button
            variant={BUTTON_VARIANT.outline}
            color={BUTTON_COLOR.neutral}
            onClick={handleCancel}
          >
            {t('nasha_partition_edit_size_cancel')}
          </Button>
          <Button
            color={BUTTON_COLOR.primary}
            onClick={handleSubmit}
            disabled={!isSizeValid || !hasChanged || updatePartition.isPending}
            isLoading={updatePartition.isPending}
          >
            {t('nasha_partition_edit_size_confirm')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

