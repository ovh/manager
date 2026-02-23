import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { ApiError } from '@ovh-ux/manager-core-api';
import {
  updateZoneRecord,
  refreshZone,
  validateZoneRecord,
  type UpdateZoneRecordPayload,
} from '@/zone/datas/api';

export const useUpdateZoneRecord = (serviceName: string) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation(['zone']);
  const { addSuccess, addError, clearNotifications } = useNotifications();

  const { mutate, isPending } = useMutation({
    mutationFn: async (
      params: UpdateZoneRecordPayload & {
        recordId: string;
        fieldType: string;
      },
    ) => {
      const { recordId, fieldType, ...payload } = params;

      // Step 1: Validate syntax via GET before updating
      await validateZoneRecord(serviceName, {
        fieldType,
        subDomain: payload.subDomain,
      });

      // Step 2: Update the record
      await updateZoneRecord(serviceName, recordId, payload);

      // Step 3: Refresh the zone to apply changes
      await refreshZone(serviceName);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['get', 'domain', 'zone', 'records', serviceName],
      });
      clearNotifications();
      addSuccess(t('zone_page_form_modify_record_success'), true);
    },
    onError: (error: ApiError) => {
      const apiMessage =
        error?.response?.data?.message ?? error?.message ?? '';
      clearNotifications();
      addError(
        t('zone_page_form_modify_record_error', { error: apiMessage }),
        true,
      );
    },
  });

  return {
    updateRecord: mutate,
    isUpdatingRecord: isPending,
  };
};
