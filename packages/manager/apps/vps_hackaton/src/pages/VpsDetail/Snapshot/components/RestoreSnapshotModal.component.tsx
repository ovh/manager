import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Modal,
  Text,
  Button,
  Checkbox,
  Message,
} from '@ovhcloud/ods-react';
import { useRestoreSnapshot } from '@/api/hooks/useSnapshot';

type TRestoreSnapshotModalProps = {
  serviceName: string;
  onClose: () => void;
};

export const RestoreSnapshotModal = ({
  serviceName,
  onClose,
}: TRestoreSnapshotModalProps) => {
  const { t } = useTranslation('vps');
  const [confirmed, setConfirmed] = useState(false);

  const restoreSnapshotMutation = useRestoreSnapshot();

  const handleSubmit = () => {
    restoreSnapshotMutation.mutate(serviceName, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <Modal isOpen onClose={onClose}>
      <Text slot="heading" preset="heading-4">
        {t('vps_snapshot_restore_title')}
      </Text>

      <div className="space-y-4 p-4">
        <Message color="critical">
          {t('vps_snapshot_restore_warning')}
        </Message>

        <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
          <Checkbox
            isChecked={confirmed}
            onChange={(e) => setConfirmed(e.detail.checked)}
          />
          <Text preset="paragraph" className="font-medium text-red-700">
            {t('vps_snapshot_restore_confirm_checkbox')}
          </Text>
        </label>
      </div>

      <div slot="actions" className="flex gap-2">
        <Button
          variant="ghost"
          label={t('common_cancel')}
          onClick={onClose}
        />
        <Button
          variant="default"
          color="critical"
          label={t('vps_snapshot_restore_confirm')}
          onClick={handleSubmit}
          isDisabled={!confirmed}
          isLoading={restoreSnapshotMutation.isPending}
        />
      </div>
    </Modal>
  );
};
