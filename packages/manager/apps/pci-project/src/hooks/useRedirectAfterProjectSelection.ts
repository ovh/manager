import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { useFeatureAvailability } from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  getProjectsWithServices,
  projectsWithServiceQueryKey,
} from '@/data/api/projects-with-services';
import { PCI_FEATURES_STATES } from '@/constants';
import { TProjectWithService } from '@/data/types/project.type';

const useRedirectAfterProjectSelection = () => {
  const {
    shell: { navigation },
  } = useContext(ShellContext);
  const [searchParams] = useSearchParams();
  const [redirectPath, setRedirectPath] = useState<string>('');
  const [redirectParams, setRedirectParams] = useState<Record<string, string>>(
    {},
  );
  const [isRedirectExternal, setIsRedirectExternal] = useState<boolean>(false);
  const [redirectExternalUrl, setRedirectExternalUrl] = useState<string>('');
  const [doCheckFF, setDoCheckFF] = useState<boolean>(false);
  const [ffToCheck, setFFToCheck] = useState<string>('');

  const redirectTarget = JSON.parse(searchParams.get('target') || '{}');
  const { category, state } = redirectTarget;

  const upperCategory = category?.toUpperCase() as keyof typeof PCI_FEATURES_STATES;
  const upperState = state?.toUpperCase() as keyof typeof PCI_FEATURES_STATES[typeof upperCategory];

  const isRedirectRequired = !!(
    upperCategory &&
    upperState &&
    PCI_FEATURES_STATES[upperCategory][upperState]
  );

  const { data, isError, isLoading } = useQuery({
    queryKey: [projectsWithServiceQueryKey()],
    queryFn: getProjectsWithServices,
  });

  const activeProjects = useMemo(
    () =>
      (data?.data || []).filter(
        (project: TProjectWithService) => project.status === 'ok',
      ),
    [data],
  );

  const { data: availability } = useFeatureAvailability([ffToCheck], {
    enabled: doCheckFF,
  });
  const isFFAvailable = availability?.[ffToCheck] || false;

  const redirect = useCallback(
    (projectId: string) => {
      if (isRedirectExternal) {
        (window.top || window).location = redirectExternalUrl.replace(
          /:projectId/g,
          projectId,
        );
      } else {
        navigation.navigateTo('public-cloud', redirectPath, {
          ...redirectParams,
          projectId,
        });
      }
    },
    [
      isRedirectExternal,
      redirectExternalUrl,
      redirectPath,
      redirectParams,
      navigation,
    ],
  );

  useEffect(() => {
    if (isRedirectRequired) {
      const stateDetail = PCI_FEATURES_STATES[upperCategory][upperState];

      if (!doCheckFF || isFFAvailable) {
        setIsRedirectExternal(stateDetail.isExternal || false);
        setRedirectPath(stateDetail.url);
        setRedirectParams(
          (stateDetail.targetParamKeys || ['params']).reduce(
            (params, targetKey) => ({
              ...params,
              ...redirectTarget[targetKey],
            }),
            {},
          ),
        );
        setRedirectExternalUrl(stateDetail.url);
      } else if (doCheckFF) {
        setFFToCheck(stateDetail.featureAvailability || '');
        setDoCheckFF(true);
      }
    }
  }, [
    upperCategory,
    upperState,
    isRedirectRequired,
    isFFAvailable,
    doCheckFF,
    searchParams, // instead of redirectTarget because redirectTarget is parsed and then changes everytime
  ]);

  const isReady = !isError && !isLoading;

  useEffect(() => {
    // We immediately redirect because there is only one project
    if (
      isReady &&
      isRedirectRequired &&
      activeProjects.length === 1 &&
      redirectPath !== ''
    ) {
      redirect(activeProjects[0].project_id);
    }
  }, [isReady, isRedirectRequired, activeProjects, redirectPath]);

  return {
    isRedirectRequired:
      isReady && isRedirectRequired && activeProjects.length > 1,
    redirect,
  };
};

export default useRedirectAfterProjectSelection;
