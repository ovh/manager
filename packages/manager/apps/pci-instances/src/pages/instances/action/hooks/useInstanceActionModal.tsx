import { useCallback, useEffect, useMemo } from 'react';
import { DefaultError, useQueryClient } from '@tanstack/react-query';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useProjectId } from '@/hooks/project/useProjectId';
import { TInstanceActionDto } from '@/types/instance/api.type';
import { isApiErrorResponse } from '@/utils';
import { TSectionType } from '@/types/instance/action/action.type';
import {
  selectInstanceForActionModal,
  TInstanceActionModalViewModel,
} from '../view-models/selectInstanceForActionModal';
import { getInstanceById } from '@/data/hooks/instance/useInstances';
import { useInstance } from '@/data/hooks/instance/useInstance';

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
  instanceId: string | undefined,
  section: TSectionType | null,
): TUseInstanceActionModal => {
  const queryClient = useQueryClient();
  const projectId = useProjectId();
  const { addError } = useNotifications();
  const navigate = useNavigate();
  const { t } = useTranslation('actions');

  const aggregatedInstance = useMemo(
    () => getInstanceById(projectId, instanceId, queryClient),
    [instanceId, projectId, queryClient],
  );

  const { data, isLoading, error } = useInstance(instanceId ?? '', {
    enabled: !!instanceId && !aggregatedInstance,
    retry: 1,
    gcTime: 0,
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
    instance: selectInstanceForActionModal(instance),
    isLoading,
  };
};
