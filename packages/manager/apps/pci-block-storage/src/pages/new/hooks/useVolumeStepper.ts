import { useState } from 'react';
import { TAddon } from '@ovh-ux/manager-pci-common';
import { useStep } from '@/pages/new/hooks/useStep';
import { TFormState } from '@/pages/new/form.type';
import { TLocalisation } from '@/api/hooks/useRegions';

export const DEFAULT_FORM_STATE: TFormState = {
  region: undefined,
  volumeType: undefined,
  volumeName: '',
  volumeCapacity: 10,
};

export function useVolumeStepper() {
  const [form, setForm] = useState<TFormState>({
    ...DEFAULT_FORM_STATE,
  });
  const locationStep = useStep({ isOpen: true });
  const volumeTypeStep = useStep();
  const capacityStep = useStep();
  const volumeNameStep = useStep();
  const validationStep = useStep();

  return {
    form,
    location: {
      step: locationStep,
      edit: () => {
        locationStep.unlock();
        [volumeTypeStep, capacityStep, volumeNameStep, validationStep].forEach(
          (step) => {
            step.uncheck();
            step.unlock();
            step.close();
          },
        );
        setForm({ ...DEFAULT_FORM_STATE });
      },
      submit: (region: TLocalisation) => {
        locationStep.check();
        locationStep.lock();
        volumeTypeStep.open();
        setForm((f) => ({
          ...f,
          region,
        }));
      },
    },
    volumeType: {
      step: volumeTypeStep,
      edit: () => {
        volumeTypeStep.unlock();
        [capacityStep, volumeNameStep, validationStep].forEach((step) => {
          step.uncheck();
          step.unlock();
          step.close();
        });
        setForm((f) => ({ ...DEFAULT_FORM_STATE, region: f.region }));
      },
      submit: (volumeType: TAddon) => {
        volumeTypeStep.check();
        volumeTypeStep.lock();
        capacityStep.open();
        setForm((f) => ({
          ...f,
          volumeType,
        }));
      },
    },
    capacity: {
      step: capacityStep,
      edit: () => {
        capacityStep.unlock();
        [volumeNameStep, validationStep].forEach((step) => {
          step.uncheck();
          step.unlock();
          step.close();
        });
        setForm((f) => ({
          ...DEFAULT_FORM_STATE,
          region: f.region,
          volumeType: f.volumeType,
        }));
      },
      submit: (volumeCapacity: number) => {
        capacityStep.check();
        capacityStep.lock();
        volumeNameStep.open();
        setForm((f) => ({
          ...f,
          volumeCapacity,
        }));
      },
    },
    volumeName: {
      step: volumeNameStep,
      edit: () => {
        volumeNameStep.unlock();
        validationStep.uncheck();
        validationStep.unlock();
        validationStep.close();
        setForm((f) => ({
          ...f,
          volumeName: DEFAULT_FORM_STATE.volumeName,
        }));
      },
      submit: (volumeName: string) => {
        volumeNameStep.check();
        volumeNameStep.lock();
        validationStep.open();
        setForm((f) => ({
          ...f,
          volumeName,
        }));
      },
    },
    validation: {
      step: validationStep,
      submit: () => {
        validationStep.lock();
      },
    },
  };
}
