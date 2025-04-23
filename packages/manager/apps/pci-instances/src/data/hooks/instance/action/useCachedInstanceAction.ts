import { useCallback, useEffect, useMemo } from 'react';
import { DefaultError, useQueryClient } from '@tanstack/react-query';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getInstanceById } from '../useInstances';
import { useProjectId } from '@/hooks/project/useProjectId';
import { useInstance } from '../useInstance';
import { TInstanceActionDto } from '@/types/instance/api.type';
import { isApiErrorResponse } from '@/utils';

export type TSectionType =
  | 'delete'
  | 'start'
  | 'stop'
  | 'shelve'
  | 'unshelve'
  | 'soft-reboot'
  | 'hard-reboot'
  | 'reinstall'
  | 'rescue/start'
  | 'rescue/end'
  | 'backup'
  | 'billing/monthly/activate';

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

  return section.replace('-', '_');
};

export const useCachedInstanceAction = (
  instanceId: string | undefined,
  section: TSectionType | null,
) => {
  const queryClient = useQueryClient();
  const projectId = useProjectId();
  const { addError } = useNotifications();
  const navigate = useNavigate();
  const { t } = useTranslation('actions');

  const cachedInstance = useMemo(
    () => getInstanceById(projectId, instanceId, queryClient),
    [instanceId, projectId, queryClient],
  );

  const { data, isLoading, error } = useInstance(instanceId ?? '', {
    enabled: !!instanceId && !cachedInstance,
    retry: 1,
    gcTime: 0,
  });

  const instance = useMemo(() => cachedInstance ?? data, [
    data,
    cachedInstance,
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
        : (error as DefaultError).message;
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
    instance,
    isLoading,
  };
};
