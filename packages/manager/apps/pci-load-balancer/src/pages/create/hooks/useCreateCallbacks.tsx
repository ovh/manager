import { useNavigate, useParams } from 'react-router-dom';

import { Trans, Translation } from 'react-i18next';

import { isApiCustomError, isMaxQuotaReachedError } from '@ovh-ux/manager-core-api';
import { useNotifications, useProjectUrl } from '@ovh-ux/manager-react-components';
import { PageType, useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { getAllLoadBalancersQueryKey } from '@/api/hook/useLoadBalancer';
import GuideLink from '@/components/GuideLink/GuideLink.component';
import queryClient from '@/queryClient';

export const useCreateCallbacks = () => {
  const navigate = useNavigate();
  const hrefProject = useProjectUrl('public-cloud');
  const { trackPage } = useOvhTracking();
  const { addError, addInfo } = useNotifications();
  const { projectId } = useParams();
  return {
    onSuccess: () => {
      trackPage({
        pageType: PageType.bannerInfo,
        pageName: 'add_loadbalancer_pending',
      });
      addInfo(
        <Translation ns="load-balancer/create">
          {(_t) => _t('octavia_load_balancer_create_banner')}
        </Translation>,
        false,
      );
      navigate('..');
      void queryClient.invalidateQueries({
        queryKey: getAllLoadBalancersQueryKey(projectId),
      });
    },
    onError: (error: unknown) => {
      trackPage({
        pageType: PageType.bannerError,
        pageName: 'add_loadbalancer_error',
      });

      if (isApiCustomError(error)) {
        const apiError = error as {
          response: { data: { message: string }; headers: Record<string, string> };
        };
        if (isMaxQuotaReachedError(error)) {
          addError(
            <Trans
              ns="load-balancer"
              i18nKey="octavia_load_balancer_quota_creation_error"
              components={{
                Link: <GuideLink href={`${hrefProject}/quota`} isTargetBlank={false} />,
              }}
            />,
          );
        } else {
          addError(
            <Trans
              ns="load-balancer"
              i18nKey="octavia_load_balancer_global_error"
              values={{
                message: apiError.response.data.message,
                requestId: apiError.response.headers['x-ovh-queryid'],
              }}
            />,
            false,
          );
        }
      }
    },
  };
};
