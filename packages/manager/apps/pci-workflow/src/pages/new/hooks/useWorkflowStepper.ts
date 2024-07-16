import { useState } from 'react';
import { useStep } from '@/pages/new/hooks/useStep';
import { TInstance } from '@/type';

export type TWorkflowCreationForm = {
  type: string;
  instance: TInstance;
  scheduling: TWorkflowScheduling;
  name: string;
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
  type: '',
  instance: null,
  scheduling: null,
  name: '',
};

export function useWorkflowStepper() {
  const [form, setForm] = useState<TWorkflowCreationForm>({
    ...DEFAULT_FORM_STATE,
  });

  const typeStep = useStep({ isOpen: true });
  const resourceStep = useStep();
  const schedulingStep = useStep();
  const namingStep = useStep();

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
      submit: (type: string) => {
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
        setForm((f) => ({
          ...DEFAULT_FORM_STATE,
          type: f.type,
        }));
      },
      submit: (instance: TInstance) => {
        resourceStep.check();
        resourceStep.lock();
        schedulingStep.open();
        setForm((f) => ({
          ...f,
          instance,
        }));
      },
    },
    scheduling: {
      step: schedulingStep,
      edit: () => {
        schedulingStep.unlock();
        [namingStep].forEach((step) => {
          step.uncheck();
          step.unlock();
          step.close();
        });
        setForm((f) => ({
          ...DEFAULT_FORM_STATE,
          type: f.type,
          instance: f.instance,
        }));
      },
      submit: (scheduling: TWorkflowScheduling) => {
        schedulingStep.check();
        schedulingStep.lock();
        namingStep.open();
        setForm((f) => ({
          ...f,
          scheduling,
        }));
      },
    },
    naming: {
      step: namingStep,
      update: (name: string) => {
        setForm((f) => ({
          ...f,
          name,
        }));
      },
      submit: () => {
        namingStep.lock();
      },
    },
  };
}
