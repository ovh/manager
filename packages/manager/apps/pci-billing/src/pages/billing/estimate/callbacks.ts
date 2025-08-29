import { useTranslation } from 'react-i18next';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { useParam } from '@ovh-ux/manager-pci-common';
import { ApiError } from '@ovh-ux/manager-core-api';
import queryClient from '@/queryClient';

export const useCallbacks = () => {
  const { t: tEstimate } = useTranslation('estimate');
  const { addSuccess, addError, clearNotifications } = useNotifications();
  const { projectId } = useParam('projectId');

  const invalidateCache = async () => {
    await queryClient.invalidateQueries({
      queryKey: ['project', projectId, 'alerting'],
    });
  };

  return {
    create: {
      success: async () => {
        clearNotifications();
        addSuccess(tEstimate('cpbea_estimate_alert_success'), true);
        await invalidateCache();
      },
      failure: () => {
        addError(tEstimate('cpbea_estimate_alert_error'), true);
      },
    },
    update: {
      success: async () => {
        clearNotifications();
        addSuccess(tEstimate('cpbea_estimate_alert_success'), true);
        await invalidateCache();
      },
      failure: () => {
        addError(tEstimate('cpbea_estimate_alert_error'), true);
      },
    },
    remove: {
      success: async () => {
        clearNotifications();
        addSuccess(tEstimate('cpbe_estimate_alert_delete_success'), true);
        await invalidateCache();
      },
      failure: (err: ApiError) => {
        clearNotifications();
        addError(
          `${tEstimate('cpbe_estimate_alert_delete_error')} ${err.response?.data
            ?.message || ''}`,
          true,
        );
      },
    },
  };
};
