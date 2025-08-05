import { useEffect, useState } from 'react';

import { useSearchParams } from 'react-router-dom';

import { TInstance, buildInstanceId } from '@/api/hooks/instance/selector/instances.selector';
import { useStep } from '@/pages/new/hooks/useStep';

export const enum WorkflowType {
  INSTANCE_BACKUP = 'instance_backup',
}

export type TWorkflowCreationForm = {
  type: WorkflowType | null;
  instanceId: TInstance['id'] | null;
  scheduling: TWorkflowScheduling | null;
  name: string;
  distantRegion: string | null;
};

export type TWorkflowScheduling = {
  name: string;
  minutes: string;
  hour: string;
  dom: string;
  month: string;
  dow: string;
  rotation: number;
  maxExecutionCount: number;
};

export const DEFAULT_FORM_STATE: TWorkflowCreationForm = {
  type: null,
  instanceId: null,
  scheduling: null,
  name: '',
  distantRegion: null,
};

// eslint-disable-next-line max-lines-per-function
export function useWorkflowStepper() {
  const [searchParams] = useSearchParams();

  const [form, setForm] = useState<TWorkflowCreationForm>(() => {
    const queryInstanceId = searchParams.get('instanceId');
    const queryRegion = searchParams.get('region');

    const instanceId =
      !!queryInstanceId && !!queryRegion ? buildInstanceId(queryInstanceId, queryRegion) : null;

    return {
      ...DEFAULT_FORM_STATE,
      instanceId,
      type: !!instanceId ? WorkflowType.INSTANCE_BACKUP : null,
    };
  });

  const typeStep = useStep({ isOpen: true });
  const resourceStep = useStep();
  const namingStep = useStep();
  const schedulingStep = useStep();

  useEffect(() => {
    if (form.instanceId) {
      [typeStep, resourceStep].forEach((s) => {
        s.check();
        s.lock();
        s.open();
      });
      namingStep.open();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    form,
    type: {
      step: typeStep,
      edit: () => {
        typeStep.unlock();
        [resourceStep, schedulingStep, namingStep].forEach((step) => {
          step.uncheck();
          step.unlock();
          step.close();
        });
        setForm({ ...DEFAULT_FORM_STATE });
      },
      submit: (type: TWorkflowCreationForm['type']) => {
        typeStep.check();
        typeStep.lock();
        resourceStep.open();
        setForm((f) => ({
          ...f,
          type,
        }));
      },
    },
    resource: {
      step: resourceStep,
      edit: () => {
        resourceStep.unlock();
        [schedulingStep, namingStep].forEach((step) => {
          step.uncheck();
          step.unlock();
          step.close();
        });
      },
      update: (instance: TInstance) => {
        setForm((f) => ({
          ...f,
          instanceId: instance.id,
        }));
      },
      submit: () => {
        resourceStep.check();
        resourceStep.lock();
        namingStep.open();
      },
    },
    naming: {
      step: namingStep,
      edit: () => {
        namingStep.unlock();
        [schedulingStep].forEach((step) => {
          step.uncheck();
          step.unlock();
          step.close();
        });
        setForm((f) => ({
          ...DEFAULT_FORM_STATE,
          type: f.type,
          instanceId: f.instanceId,
        }));
      },
      update: (name: string) => {
        setForm((f) => ({
          ...f,
          name,
        }));
      },
      submit: () => {
        namingStep.check();
        namingStep.lock();
        schedulingStep.open();
      },
    },
    scheduling: {
      step: schedulingStep,
      submit: (
        scheduling: TWorkflowScheduling,
        distantRegion: TWorkflowCreationForm['distantRegion'],
      ) => {
        schedulingStep.lock();
        setForm((f) => ({
          ...f,
          scheduling,
          distantRegion,
        }));
      },
      onSubmitError: () => {
        schedulingStep.unlock();
      },
    },
  };
}
