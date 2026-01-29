import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Text, Input, Button } from '@ovhcloud/ods-react';
import { useCreateSnapshot } from '@/api/hooks/useSnapshot';

type TCreateSnapshotModalProps = {
  serviceName: string;
  onClose: () => void;
};

export const CreateSnapshotModal = ({
  serviceName,
  onClose,
}: TCreateSnapshotModalProps) => {
  const { t } = useTranslation('vps');
  const [description, setDescription] = useState('');

  const createSnapshotMutation = useCreateSnapshot();

  const handleSubmit = () => {
    createSnapshotMutation.mutate(
      {
        serviceName,
        description: description || undefined,
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  return (
    <Modal isOpen onClose={onClose}>
      <Text slot="heading" preset="heading-4">
        {t('vps_snapshot_create_title')}
      </Text>

      <div className="space-y-4 p-4">
        <div>
          <Text preset="label" className="mb-2">
            {t('vps_snapshot_create_description_label')}
          </Text>
          <Input
            type="text"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.detail.value as string)}
          />
        </div>
      </div>

      <div slot="actions" className="flex gap-2">
        <Button
          variant="ghost"
          label={t('common_cancel')}
          onClick={onClose}
        />
        <Button
          variant="default"
          label={t('vps_snapshot_create_confirm')}
          onClick={handleSubmit}
          isLoading={createSnapshotMutation.isPending}
        />
      </div>
    </Modal>
  );
};
