import { Modal } from '@ovh-ux/muk';
import { useNotifications } from '@ovh-ux/manager-react-components';
import {
  ICON_NAME,
  Message,
  MESSAGE_COLOR,
  MessageBody,
  MessageIcon,
  Text,
  TEXT_PRESET,
} from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useMutation } from '@tanstack/react-query';
import { deleteDomainZoneRecord, refreshZone } from '@/zone/datas/api';
import { useParams } from 'react-router-dom';

export interface DeleteEntriesModalProps {
  recordIds: string[];
  onCloseCallback?: () => void;
  onRefetch?: () => void;
}

export const DeleteEntriesModal = ({
  recordIds,
  onCloseCallback,
  onRefetch,
}: DeleteEntriesModalProps) => {
  const { t } = useTranslation(['zone', NAMESPACES.ACTIONS]);
  const { serviceName } = useParams();
  const { addSuccess, addWarning, clearNotifications } = useNotifications();

  const count = recordIds.length;

  const { mutate: onDeleteAll, isPending } = useMutation<void, Error, void>({
    mutationFn: async () => {
      await Promise.all(
        recordIds.map((id) => deleteDomainZoneRecord(serviceName ?? '', id)),
      );
      await refreshZone(serviceName ?? '');
    },
    onSuccess: () => {
      clearNotifications();
      addSuccess(t('zone_page_delete_entries_modal_success', { count }), true);
      onCloseCallback?.();
    },
    onError: (error: Error) => {
      clearNotifications();
      addWarning(
        t('zone_page_delete_entries_modal_error', {
          message: error?.message ?? '',
        }),
        true,
      );
      onCloseCallback?.();
    },
    onSettled: () => {
      onRefetch?.();
    },
  });

  return (
    <Modal
      heading={t('zone_page_delete_entries_modal_heading')}
      onOpenChange={onCloseCallback}
      open={true}
      primaryButton={{
        label: t(`${NAMESPACES.ACTIONS}:confirm`),
        onClick: () => onDeleteAll(),
        loading: isPending,
      }}
      secondaryButton={{
        label: t(`${NAMESPACES.ACTIONS}:cancel`),
        onClick: onCloseCallback,
        disabled: isPending,
      }}
    >
      <Text preset={TEXT_PRESET.span}>
        {t('zone_page_delete_entries_modal_description', { count })}
      </Text>

      <Message
        className="mt-4"
        color={MESSAGE_COLOR.information}
        dismissible={false}
      >
        <MessageIcon name={ICON_NAME.triangleExclamation} />
        <MessageBody>{t('zone_page_delete_entries_modal_warning')}</MessageBody>
      </Message>
    </Modal>
  );
};
