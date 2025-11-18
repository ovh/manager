import { useEffect, useState } from 'react';

import { useSearchParams } from 'react-router-dom';

import {
  TInstance,
  buildInstanceSelectedResource,
} from '@/api/hooks/instance/selector/instances.selector';
import { TWorkflowSelectedResource, WorkflowType } from '@/api/hooks/workflows';
import { useStep } from '@/pages/new/hooks/useStep';

export type TWorkflowCreationForm = {
  type: WorkflowType | null;
  resource: TWorkflowSelectedResource | null;
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
  type: WorkflowType.INSTANCE_BACKUP,
  resource: null,
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

    const resource =
      !!queryInstanceId && !!queryRegion
        ? buildInstanceSelectedResource(queryInstanceId, queryRegion)
        : null;

    return {
      ...DEFAULT_FORM_STATE,
      resource,
      type: !!resource ? WorkflowType.INSTANCE_BACKUP : DEFAULT_FORM_STATE.type,
    };
  });

  const typeStep = useStep({ isOpen: true });
  const resourceStep = useStep();
  const namingStep = useStep();
  const schedulingStep = useStep();

  useEffect(() => {
    if (form.resource) {
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
        setForm((f) => ({ ...DEFAULT_FORM_STATE, type: f.type }));
      },
      update: (type: TWorkflowCreationForm['type']) => {
        setForm((f) => ({
          ...f,
          type,
        }));
      },
      submit: () => {
        typeStep.check();
        typeStep.lock();
        resourceStep.open();
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
          resource: { ...instance.id, label: instance.id.id },
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
          resource: f.resource,
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
