import React, { useState, useContext, useMemo } from 'react';
import { useNavigate, useParams, useOutletContext } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  Button,
  BUTTON_COLOR,
  BUTTON_VARIANT,
  FormField,
  FormFieldHelper,
  FormFieldLabel,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  MODAL_COLOR,
} from '@ovhcloud/ods-react';
import { usePartition, useUpdatePartition } from '@/hooks/nasha';
import { urls } from '@/routes/Routes.constants';
import {
  SIZE_MIN,
  PREFIX_TRACKING_DASHBOARD_PARTITION_UPDATE_SIZE,
} from '@/constants/nasha.constants';
import type { Nasha, NashaPartition } from '@/types/nasha.type';

interface PartitionsContext {
  nasha: Nasha;
  serviceName: string;
  partitions: NashaPartition[];
}

export default function PartitionEditSizeModal() {
  const { nasha, serviceName, partitions } =
    useOutletContext<PartitionsContext>();
  const { partitionName } = useParams<{ partitionName: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation('components');
  const { shell } = useContext(ShellContext);

  // Get current partition
  const partition = useMemo(
    () => partitions.find((p) => p.partitionName === partitionName),
    [partitions, partitionName],
  );

  const [size, setSize] = useState(partition?.size || SIZE_MIN);

  const updatePartition = useUpdatePartition(serviceName, partitionName || '');

  // Calculate max size
  const partitionAllocatedSize = useMemo(
    () => partitions.reduce((sum, p) => sum + p.size, 0),
    [partitions],
  );
  const sizeMax =
    nasha.zpoolSize - partitionAllocatedSize + (partition?.size || 0);

  const handleClose = () => {
    navigate(urls.partitions(serviceName));
  };

  const handleCancelClick = () => {
    shell?.tracking?.trackClick({
      name: `${PREFIX_TRACKING_DASHBOARD_PARTITION_UPDATE_SIZE}::cancel`,
      type: 'action',
    });
    handleClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!partitionName) return;

    shell?.tracking?.trackClick({
      name: `${PREFIX_TRACKING_DASHBOARD_PARTITION_UPDATE_SIZE}::confirm`,
      type: 'action',
    });

    try {
      await updatePartition.mutateAsync({ size });
      handleClose();
    } catch (err) {
      console.error('Failed to update partition size:', err);
    }
  };

  const isValid = size >= SIZE_MIN && size <= sizeMax && size !== partition?.size;

  return (
    <Modal open onOpenChange={(open) => !open && handleClose()}>
      <ModalContent color={MODAL_COLOR.primary}>
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <h2 className="text-xl font-semibold mb-4">
              {t('nasha_components_partition_edit_size_title', {
                name: partitionName,
              })}
            </h2>

            <FormField className="mb-6">
              <FormFieldLabel>
                {t('nasha_components_partition_edit_size_label', {
                  name: partitionName,
                })}
              </FormFieldLabel>
              <Input
                type="number"
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                min={SIZE_MIN}
                max={sizeMax}
                required
              />
              <FormFieldHelper>
                {t('nasha_components_partition_edit_size_rules', {
                  min: SIZE_MIN,
                  max: sizeMax,
                })}
              </FormFieldHelper>
            </FormField>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant={BUTTON_VARIANT.outline}
                color={BUTTON_COLOR.neutral}
                onClick={handleCancelClick}
                disabled={updatePartition.isPending}
              >
                {t('nasha_components_partition_edit_size_cancel')}
              </Button>
              <Button
                type="submit"
                color={BUTTON_COLOR.primary}
                disabled={!isValid || updatePartition.isPending}
                loading={updatePartition.isPending}
              >
                {t('nasha_components_partition_edit_size_submit')}
              </Button>
            </div>
          </ModalBody>
        </form>
      </ModalContent>
    </Modal>
  );
}

