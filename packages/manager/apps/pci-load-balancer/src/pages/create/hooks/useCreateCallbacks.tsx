import { Translation } from 'react-i18next';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { useNavigate, useParams } from 'react-router-dom';
import { LOAD_BALANCER_CREATION_TRACKING } from '@/constants';
import queryClient from '@/queryClient';
import { getAllLoadBalancersQueryKey } from '@/api/hook/useLoadBalancer';
import { useTracking } from '@/pages/create/hooks/useTracking';

export const useCreateCallbacks = () => {
  const navigate = useNavigate();
  const { trackPage } = useTracking();
  const { addError, addInfo } = useNotifications();
  const { projectId } = useParams();
  return {
    onSuccess: () => {
      trackPage({
        name: LOAD_BALANCER_CREATION_TRACKING.SUCCESS,
        type: 'navigation',
      });
      addInfo(
        <Translation ns="load-balancer/create">
          {(_t) => _t('octavia_load_balancer_create_banner')}
        </Translation>,
        false,
      );
      navigate('..');
      queryClient.invalidateQueries({
        queryKey: getAllLoadBalancersQueryKey(projectId),
      });
    },
    onError: (error: ApiError) => {
      trackPage({
        name: LOAD_BALANCER_CREATION_TRACKING.ERROR,
        type: 'navigation',
      });
      addError(
        <Translation ns="load-balancer">
          {(_t) => (
            <span
              dangerouslySetInnerHTML={{
                __html: _t('octavia_load_balancer_global_error', {
                  message: ((error.response as unknown) as {
                    data: { message: string };
                  }).data.message,
                  requestId: ((error.response as unknown) as {
                    headers: Record<string, unknown>;
                  }).headers['x-ovh-queryid'],
                }),
              }}
            ></span>
          )}
        </Translation>,
        false,
      );
    },
  };
};
