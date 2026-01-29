import { useTranslation } from 'react-i18next';
import { Modal, Text, Button, Message } from '@ovhcloud/ods-react';
import { useResetPasswordVps } from '@/api/hooks/useVpsActions';

type TResetPasswordModalProps = {
  serviceName: string;
  onClose: () => void;
};

export const ResetPasswordModal = ({
  serviceName,
  onClose,
}: TResetPasswordModalProps) => {
  const { t } = useTranslation('vps');

  const resetPasswordMutation = useResetPasswordVps();

  const handleSubmit = () => {
    resetPasswordMutation.mutate(
      { serviceName },
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
        {t('vps_action_reset_password_title')}
      </Text>

      <div className="space-y-4 p-4">
        <Message color="warning">
          {t('vps_action_reset_password_warning')}
        </Message>
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
          label={t('vps_action_reset_password_confirm')}
          onClick={handleSubmit}
          isLoading={resetPasswordMutation.isPending}
        />
      </div>
    </Modal>
  );
};
