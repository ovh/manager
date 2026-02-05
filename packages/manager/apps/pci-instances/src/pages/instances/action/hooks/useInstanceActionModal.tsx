import { useCallback, useEffect, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useProjectId } from '@/hooks/project/useProjectId';
import { TInstanceActionDto } from '@/types/instance/api.type';
import { isApiErrorResponse } from '@/utils';
import { TSectionType } from '@/types/instance/action/action.type';
import {
  selectInstanceForActionModal,
  TInstanceActionModalViewModel,
} from '../view-models/selectInstanceForActionModal';
import { useInstance } from '@/data/hooks/instance/useInstance';
import {
  selectAggregatedInstanceById,
  selectInstanceById,
} from '@/adapters/tanstack/instances/selectors';

const formatSection = (section: TSectionType | null): string | null => {
  if (!section) return null;
  if (section === 'rescue/start') {
    return 'rescue';
  }
  if (section === 'rescue/end') {
    return 'unrescue';
  }

  if (section === 'billing/monthly/activate') {
    return 'activate_monthly_billing';
  }

  if (section === 'backup') {
    return 'create_backup';
  }

  return section.replace('-', '_');
};

export type TUseInstanceActionModal = {
  instance: TInstanceActionModalViewModel;
  isLoading: boolean;
};

export const useInstanceActionModal = (
  region: string | undefined,
  instanceId: string | undefined,
  section: TSectionType | null,
): TUseInstanceActionModal => {
  const queryClient = useQueryClient();
  const projectId = useProjectId();
  const { addError } = useNotifications();
  const navigate = useNavigate();
  const { t } = useTranslation('actions');

  const aggregatedInstance = useMemo(
    () =>
      selectAggregatedInstanceById(projectId, instanceId, queryClient) ??
      selectInstanceById(projectId, instanceId || '', queryClient),
    [instanceId, projectId, queryClient],
  );

  const { data, isLoading, error } = useInstance({
    region: region ?? null,
    instanceId: instanceId ?? '',
    queryOptions: {
      enabled: !!instanceId && !aggregatedInstance,
      retry: 1,
      gcTime: 0,
    },
  });

  const instance = useMemo(() => aggregatedInstance ?? data, [
    data,
    aggregatedInstance,
  ]);

  const isSectionInAction = useCallback(
    (action: TInstanceActionDto): boolean => {
      const formattedSection = formatSection(section);
      return formattedSection === action.name;
    },
    [section],
  );

  const isActionAllowed = useMemo(
    () => instance?.actions.find(isSectionInAction),
    [instance?.actions, isSectionInAction],
  );

  useEffect(() => {
    if (instance && !isActionAllowed) {
      addError(
        t('pci_instances_actions_instance_unavailable_action_error_message', {
          name: instance.name,
        }),
        true,
      );
      navigate('..');
    }
  }, [addError, error, instance, isActionAllowed, navigate, t]);

  useEffect(() => {
    if (!instance && error) {
      const errorMessage = isApiErrorResponse(error)
        ? error.response?.data.message
        : error.message;
      addError(
        t('pci_instances_actions_instance_unknown_error_message', {
          error: errorMessage,
        }),
        true,
      );
      navigate('..');
    }
  }, [addError, error, instance, navigate, t]);

  return {
    instance: useMemo(() => selectInstanceForActionModal(instance), [instance]),
    isLoading,
  };
};

/**
 * This allows to retrieve the correct parameters depending on the route we are
 */
export const useInstanceParams = () => {
  const { instanceId: paramInstanceId, region: paramRegion } = useParams();
  const [searchParams] = useSearchParams();

  const instanceId = paramInstanceId ?? searchParams.get('instanceId');
  const region = paramRegion ?? searchParams.get('region') ?? 'null';

  if (!instanceId) throw new Error('instanceId is required');

  return {
    instanceId,
    region,
  };
};
