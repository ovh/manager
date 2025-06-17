import { Trans, Translation } from 'react-i18next';
import {
  useNotifications,
  useProjectUrl,
} from '@ovh-ux/manager-react-components';
import { useNavigate, useParams } from 'react-router-dom';
import { LOAD_BALANCER_CREATION_TRACKING } from '@/constants';
import queryClient from '@/queryClient';
import { getAllLoadBalancersQueryKey } from '@/api/hook/useLoadBalancer';
import { useTracking } from '@/pages/create/hooks/useTracking';
import GuideLink from '@/components/GuideLink/GuideLink.component';
import {
  LoadBalancerErrorClass,
  TCreateLoadBalancerError,
} from '@/api/data/load-balancer';

export const useCreateCallbacks = () => {
  const navigate = useNavigate();
  const hrefProject = useProjectUrl('public-cloud');
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
    onError: (error: TCreateLoadBalancerError) => {
      trackPage({
        name: LOAD_BALANCER_CREATION_TRACKING.ERROR,
        type: 'navigation',
      });

      if (
        error.response.data.class.includes(
          LoadBalancerErrorClass.MAX_QUOTA_REACHED,
        )
      ) {
        addError(
          <Trans
            ns="load-balancer"
            i18nKey="octavia_load_balancer_quota_creation_error"
            components={{
              Link: <GuideLink href={`${hrefProject}/quota`} />,
            }}
          />,
        );
      } else {
        addError(
          <Translation ns="load-balancer">
            {(_t) => (
              <span
                dangerouslySetInnerHTML={{
                  __html: _t('octavia_load_balancer_global_error', {
                    message: error.response.data.message,
                    requestId: error.response.headers['x-ovh-queryid'],
                  }),
                }}
              ></span>
            )}
          </Translation>,
          false,
        );
      }
    },
  };
};
