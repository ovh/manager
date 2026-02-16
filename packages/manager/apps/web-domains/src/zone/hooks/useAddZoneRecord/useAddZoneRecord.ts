import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { ApiError } from '@ovh-ux/manager-core-api';
import {
  createZoneRecord,
  refreshZone,
  type CreateZoneRecordPayload,
} from '@/zone/datas/api';

export const useAddZoneRecord = (serviceName: string) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation(['zone']);
  const { addSuccess, addError } = useNotifications();

  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: CreateZoneRecordPayload) => {
      // Step 1: Create the record (the API validates on creation)
      const record = await createZoneRecord(serviceName, payload);

      // Step 2: Refresh the zone to apply changes
      await refreshZone(serviceName);

      return record;
    },
    onSuccess: () => {
      // Invalidate the zone records query to refresh the datagrid
      queryClient.invalidateQueries({
        queryKey: ['get', 'domain', 'zone', 'records', serviceName],
      });
      addSuccess(t('zone_page_form_add_record_success'), true);
    },
    onError: (error: ApiError) => {
      const apiMessage =
        error?.response?.data?.message ?? error?.message ?? '';
      addError(
        t('zone_page_form_add_record_error', { error: apiMessage }),
        true,
      );
    },
  });

  return {
    addRecord: mutate,
    isAddingRecord: isPending,
  };
};
