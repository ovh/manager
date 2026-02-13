import { Modal, useNotifications } from "@ovh-ux/muk";
import { ZoneRecord } from "@/zone/types/zoneRecords.types";
import { ICON_NAME, Message, MESSAGE_COLOR, MessageBody, MessageIcon, Text, TEXT_PRESET } from "@ovhcloud/ods-react";
import { useTranslation } from "react-i18next";
import { NAMESPACES } from "@ovh-ux/manager-common-translations";
import { useMutation } from "@tanstack/react-query";
import { deleteDomainZoneRecord } from "@/zone/datas/api";
import { ApiError } from "@ovh-ux/manager-core-api";
import { useParams } from "react-router-dom";

export interface DeleteEntryModalProps {
  record: ZoneRecord | null;
  onCloseCallback?: () => void;
  onRefetch?: () => void;
}

export const DeleteEntryModal = ({ record, onCloseCallback, onRefetch }: DeleteEntryModalProps) => {
    const { t } = useTranslation(['zone', NAMESPACES.ACTIONS]);
    const { serviceName } = useParams();
    const { addWarning, addSuccess} = useNotifications();

    const { mutate: onDelete } = useMutation<void, ApiError, { serviceName: string, recordId: string }>({
        mutationFn: async ({ serviceName, recordId }) => {
          try {
            await deleteDomainZoneRecord(serviceName, recordId);
          } catch (error) {
            throw error;
          }
        },
        onSuccess: () => {
          addSuccess(
            <Text preset={TEXT_PRESET.paragraph}>
                {t('zone_page_delete_entry_modal_success')}
            </Text>,
            true,
          );
          onCloseCallback();
        },
        onError: (error: ApiError) => {
          addWarning(
            <Text preset={TEXT_PRESET.paragraph}>
                {t('zone_page_delete_entry_modal_error', {domain: `${record?.subDomain}.${record?.zone}`, message: error.response?.data?.message })}
            </Text>,
            true,
          );
          onCloseCallback();
        },
        onSettled: () => {
          onRefetch?.();
          onCloseCallback();
        },
      });
  return (
    <Modal
      heading={t('zone_page_delete_entry_modal_heading')}
      onOpenChange={onCloseCallback}
      open={true}
      primaryButton={{
        label: t(`${NAMESPACES.ACTIONS}:confirm`),
        onClick: () => onDelete({ serviceName: serviceName, recordId: record?.id }),
      }}
      secondaryButton={{
        label: t(`${NAMESPACES.ACTIONS}:cancel`),
        onClick: onCloseCallback,
      }}
    >
      <Text preset={TEXT_PRESET.span}>Voulez-vous réellement supprimer l'entrée suivante de la zone DNS du domaine ?</Text>
      {record && (
        <div className="flex justify-center">
          <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-4 items-center">
            <span className="contents">
              <Text preset={TEXT_PRESET.heading6}>Type de champ</Text>
              <Text>{record.fieldType}</Text>
            </span>
            <span className="contents">
              <Text preset={TEXT_PRESET.heading6}>Sous-domaine</Text>
              <Text>{record.subDomainToDisplay ? `${record.subDomainToDisplay}` : record.zoneToDisplay}</Text>
            </span>
            <span className="contents">
              <Text preset={TEXT_PRESET.heading6}>Cible</Text>
              <Text>{record.targetToDisplay}</Text>
            </span>
          </div>
        </div>
      )}
      <Message className="mt-4" color={MESSAGE_COLOR.information} dismissible={false}>
        <MessageIcon name={ICON_NAME.triangleExclamation} />
        <MessageBody>
          {t('zone_page_delete_entry_modal_warning')}
        </MessageBody>
      </Message>
    </Modal>
  );
}
