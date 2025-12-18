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
import { DESCRIPTION_MAX, PREFIX_TRACKING_DASHBOARD_PARTITION_UPDATE_DESCRIPTION } from '@/constants/nasha.constants';
import { urls } from '@/routes/Routes.constants';
import type { Nasha, NashaPartition } from '@/types/nasha.type';

interface PartitionContext {
  nasha: Nasha;
  partition: NashaPartition;
  serviceName: string;
  partitionName: string;
}

export default function PartitionEditDescriptionModal() {
  const { partition, serviceName, partitionName } = useOutletContext<PartitionContext>();
  const { t } = useTranslation('components');
  const navigate = useNavigate();
  const { tracking } = React.useContext(ShellContext).shell;

  const [description, setDescription] = useState(partition?.partitionDescription || '');
  const [isOpen, setIsOpen] = useState(true);

  const updatePartition = useUpdateNashaPartition();

  useEffect(() => {
    if (partition) {
      setDescription(partition.partitionDescription || '');
    }
  }, [partition]);

  const handleClose = () => {
    setIsOpen(false);
    navigate(urls.partition(serviceName, partitionName));
  };

  const handleSubmit = async () => {
    tracking?.trackClick({
      name: `${PREFIX_TRACKING_DASHBOARD_PARTITION_UPDATE_DESCRIPTION}::confirm`,
      type: 'action',
    });

    try {
      await updatePartition.mutateAsync({
        serviceName,
        partitionName,
        data: { partitionDescription: description },
      });
      handleClose();
    } catch (error) {
      // Error handling is done via React Query
    }
  };

  const handleCancel = () => {
    tracking?.trackClick({
      name: `${PREFIX_TRACKING_DASHBOARD_PARTITION_UPDATE_DESCRIPTION}::cancel`,
      type: 'action',
    });
    handleClose();
  };

  const isDescriptionValid = description.length <= DESCRIPTION_MAX;
  const hasChanged = description !== (partition?.partitionDescription || '');

  return (
    <Modal open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>
            {t('nasha_partition_edit_description_title')}
          </ModalTitle>
          <ModalClose />
        </ModalHeader>
        <ModalDescription>
          <Text preset={TEXT_PRESET.paragraph}>
            {t('nasha_partition_edit_description_subtitle', {
              partition: partitionName,
            })}
          </Text>
        </ModalDescription>
        <ModalBody>
          <FormField className="mb-4">
            <Input
              type="text"
              name="description"
              value={description}
              onOdsChange={(e) => setDescription(e.detail.value || '')}
              placeholder={t('nasha_partition_edit_description_placeholder')}
              maxlength={DESCRIPTION_MAX}
            />
            {!isDescriptionValid && (
              <Text preset={TEXT_PRESET.caption} className="text-red-500 mt-1">
                {t('nasha_partition_edit_description_error_max', {
                  max: DESCRIPTION_MAX,
                })}
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
            {t('nasha_partition_edit_description_cancel')}
          </Button>
          <Button
            color={BUTTON_COLOR.primary}
            onClick={handleSubmit}
            disabled={!isDescriptionValid || !hasChanged || updatePartition.isPending}
            isLoading={updatePartition.isPending}
          >
            {t('nasha_partition_edit_description_confirm')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

