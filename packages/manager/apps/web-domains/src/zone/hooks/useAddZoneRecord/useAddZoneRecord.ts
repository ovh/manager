import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { ApiError } from '@ovh-ux/manager-core-api';
import {
  createZoneRecord,
  refreshZone,
  validateZoneRecord,
  type CreateZoneRecordPayload,
} from '@/zone/datas/api';

export const useAddZoneRecord = (serviceName: string) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation(['zone']);
  const { addSuccess, addError, clearNotifications } = useNotifications();

  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: CreateZoneRecordPayload) => {
      // Step 1: Validate syntax via GET before creating
      await validateZoneRecord(serviceName, payload.subDomain ?? '');

      // Step 2: Create the record
      const record = await createZoneRecord(serviceName, payload);

      // Step 3: Refresh the zone to apply changes
      await refreshZone(serviceName);

      return record;
    },
    onSuccess: () => {
      // Invalidate the zone records query to refresh the datagrid
      queryClient.invalidateQueries({
        queryKey: ['get', 'domain', 'zone', 'records', serviceName],
      });
      clearNotifications();
      addSuccess(t('zone_page_form_add_record_success'), true);
    },
    onError: (error: ApiError | Error) => {
      clearNotifications();
      if (error.message === 'CNAME_ALREADY_EXISTS') {
        addError(t('zone_page_form_cname_already_exists'), true);
      } else {
        const apiMessage =
          (error as ApiError)?.response?.data?.message ?? error?.message ?? '';
        addError(
          t('zone_page_form_add_record_error', { error: apiMessage }),
          true,
        );
      }
    },
  });

  return {
    addRecord: mutate,
    isAddingRecord: isPending,
  };
};
