import { useTranslation } from 'react-i18next';
import {
  useFormatDate,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import { useQueryClient } from '@tanstack/react-query';
import {
  Button,
  BUTTON_VARIANT,
  Message,
  MessageBody,
  Modal,
  ModalBody,
  ModalContent,
  TEXT_PRESET,
  Text,
  ModalHeader,
  MESSAGE_COLOR,
  ICON_NAME,
  MessageIcon,
} from '@ovhcloud/ods-react';
import { useRestoreZone } from '@/zone/hooks/data/history.hooks';
import { TZoneHistoryWithDate } from '@/zone/types/history.types';

interface RestoreZoneModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly item: TZoneHistoryWithDate | null;
  readonly zoneName: string;
}

export default function RestoreZoneModal({
  isOpen,
  onClose,
  item,
  zoneName,
}: RestoreZoneModalProps) {
  const { t } = useTranslation('zone');
  const formatDate = useFormatDate();
  const { addSuccess, addError } = useNotifications();
  const queryClient = useQueryClient();

  const { mutate: restore, isPending } = useRestoreZone();

  const handleRestore = () => {
    if (!item) return;

    restore(
      { zoneName, creationDate: item.creationDate },
      {
        onSuccess: () => {
          addSuccess(t('zone_history_restore_success'), true);
          queryClient.invalidateQueries({
            queryKey: ['zone', 'history', zoneName],
          });
          onClose();
        },
        onError: (error) => {
          addError(
            t('zone_history_restore_error', {
              message: error.message,
            }),
            true,
          );
        },
      },
    );
  };

  if (!item || !isOpen) return null;

  return (
    <Modal open={isOpen} onOpenChange={(detail) => !detail.open && onClose()}>
      <ModalContent dismissible>
        <ModalHeader>
          <Text preset={TEXT_PRESET.heading3}>
            {t('zone_history_restore_modal_title')}
          </Text>
        </ModalHeader>
        <ModalBody>
          <Message color={MESSAGE_COLOR.warning} className="mb-4" dismissible={false}>
            <MessageIcon name={ICON_NAME.triangleExclamation} />
            <MessageBody>
              {t('zone_history_restore_modal_description', {
                date: formatDate({ date: item.creationDate }),
              })}
            </MessageBody>
          </Message>
          <Message color={MESSAGE_COLOR.information} className="mb-4" dismissible={false}>
            <MessageIcon name={ICON_NAME.circleInfo} />
            <MessageBody>
              {t('zone_history_restore_modal_propagation_info')}
            </MessageBody>
          </Message>
          <div className="flex gap-4 justify-end mt-6">
            <Button
              variant={BUTTON_VARIANT.ghost}
              onClick={onClose}
              disabled={isPending}
            >
              {t('zone_history_restore_modal_cancel')}
            </Button>
            <Button onClick={handleRestore} disabled={isPending}>
              {t('zone_history_restore_modal_confirm')}
            </Button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
