import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Modal,
  Text,
  Input,
  Button,
} from '@ovhcloud/ods-react';
import { useRescueVps } from '@/api/hooks/useVpsActions';

type TRescueModalProps = {
  serviceName: string;
  onClose: () => void;
};

export const RescueModal = ({ serviceName, onClose }: TRescueModalProps) => {
  const { t } = useTranslation('vps');
  const [password, setPassword] = useState('');

  const rescueMutation = useRescueVps();

  const handleSubmit = () => {
    rescueMutation.mutate(
      {
        serviceName,
        password: password || undefined,
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
        {t('vps_action_rescue_title')}
      </Text>

      <div className="space-y-4 p-4">
        <Text preset="paragraph">
          {t('vps_action_rescue_description')}
        </Text>

        <div>
          <Text preset="label" className="mb-2">
            {t('vps_action_rescue_password_label')}
          </Text>
          <Input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.detail.value as string)}
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
          label={t('vps_action_rescue_confirm')}
          onClick={handleSubmit}
          isLoading={rescueMutation.isPending}
        />
      </div>
    </Modal>
  );
};
