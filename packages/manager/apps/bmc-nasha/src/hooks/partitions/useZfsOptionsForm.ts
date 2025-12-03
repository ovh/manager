import { Dispatch, FormEvent, SetStateAction, useMemo, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { APP_FEATURES } from '@/App.constants';
import { APP_NAME } from '@/Tracking.constants';
import { PREFIX_TRACKING_DASHBOARD_PARTITIONS } from '@/constants/Nasha.constants';
import { useUpdateZfsOptions } from '@/hooks/partitions/useZfsOptions';
import { ZFS_OPTIONS_TEMPLATES, type ZfsOptions } from '@/utils/Zfs.utils';

type UseZfsOptionsFormProps = {
  serviceName?: string;
  partitionName?: string;
  initialOptions: ZfsOptions | null;
};

type SubmitHandlerParams = {
  serviceName: string | undefined;
  partitionName: string | undefined;
  model: ZfsOptions | null;
  updateZfsOptionsMutation: ReturnType<typeof useUpdateZfsOptions>;
  navigate: ReturnType<typeof useNavigate>;
  trackClick: ReturnType<typeof useOvhTracking>['trackClick'];
};

function createModelUpdater(
  setModel: Dispatch<SetStateAction<ZfsOptions | null>>,
  model: ZfsOptions | null,
) {
  return {
    updateTemplate: (
      templateName: string,
      templates: Array<{ name: string; description: string }>,
    ) => {
      if (!model) return;
      const template = templates.find((t) => t.name === templateName);
      setModel({
        ...model,
        template: template ? { name: template.name, description: template.description } : undefined,
      });
    },
    updateAtime: (checked: boolean) => {
      if (!model) return;
      setModel({ ...model, atime: checked });
    },
    updateRecordsize: (value: string) => {
      if (!model) return;
      setModel({ ...model, recordsize: value });
    },
    updateSync: (value: string) => {
      if (!model) return;
      setModel({ ...model, sync: value });
    },
  };
}

function createSubmitHandler({
  serviceName,
  partitionName,
  model,
  updateZfsOptionsMutation,
  navigate,
  trackClick,
}: SubmitHandlerParams) {
  return async (e: FormEvent) => {
    e.preventDefault();
    if (!serviceName || !partitionName || !model) return;

    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [APP_NAME, PREFIX_TRACKING_DASHBOARD_PARTITIONS, 'zfs-options', 'confirm'],
    });

    try {
      const result = await updateZfsOptionsMutation.mutateAsync({
        serviceName,
        partitionName,
        options: model,
      });

      void navigate('../task-tracker', {
        replace: true,
        state: {
          taskId: result.taskId,
          operation: 'clusterLeclercZfsOptions',
          params: { partitionName },
          taskApiUrl: `${APP_FEATURES.listingEndpoint}/${serviceName}/task`,
          trackingData: {
            prefix: `${PREFIX_TRACKING_DASHBOARD_PARTITIONS}::zfs-options`,
            hit: 'close',
          },
        },
      });
    } catch (error) {
      console.error('Failed to update ZFS options:', error);
    }
  };
}

function createCancelHandler(
  navigate: ReturnType<typeof useNavigate>,
  trackClick: ReturnType<typeof useOvhTracking>['trackClick'],
) {
  return () => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: [APP_NAME, PREFIX_TRACKING_DASHBOARD_PARTITIONS, 'zfs-options', 'cancel'],
    });
    void navigate('../..', { replace: true });
  };
}

function useFormState(initialOptions: ZfsOptions | null) {
  const [model, setModel] = useState<ZfsOptions | null>(initialOptions);
  const [baseModel] = useState<ZfsOptions | null>(initialOptions);
  const isCustomSelection = useMemo(
    () => model?.template?.name === ZFS_OPTIONS_TEMPLATES.CUSTOM,
    [model],
  );
  const canSubmit = useMemo(() => {
    if (!model || !baseModel) return false;
    return (
      model.atime !== baseModel.atime ||
      model.recordsize !== baseModel.recordsize ||
      model.sync !== baseModel.sync ||
      model.template?.name !== baseModel.template?.name
    );
  }, [model, baseModel]);
  return { model, setModel, isCustomSelection, canSubmit };
}

export function useZfsOptionsForm({
  serviceName,
  partitionName,
  initialOptions,
}: UseZfsOptionsFormProps) {
  const navigate = useNavigate();
  const { trackClick } = useOvhTracking();
  const updateZfsOptionsMutation = useUpdateZfsOptions();
  const { model, setModel, isCustomSelection, canSubmit } = useFormState(initialOptions);
  const updaters = useMemo(() => createModelUpdater(setModel, model), [setModel, model]);
  const handleSubmit = useMemo(
    () =>
      createSubmitHandler({
        serviceName,
        partitionName,
        model,
        updateZfsOptionsMutation,
        navigate,
        trackClick,
      }),
    [serviceName, partitionName, model, updateZfsOptionsMutation, navigate, trackClick],
  );
  const handleCancel = useMemo(
    () => createCancelHandler(navigate, trackClick),
    [navigate, trackClick],
  );
  return {
    model,
    isCustomSelection,
    canSubmit,
    isPending: updateZfsOptionsMutation.isPending,
    handleTemplateChange: updaters.updateTemplate,
    handleAtimeChange: updaters.updateAtime,
    handleRecordsizeChange: updaters.updateRecordsize,
    handleSyncChange: updaters.updateSync,
    handleCancel,
    handleSubmit,
  };
}
