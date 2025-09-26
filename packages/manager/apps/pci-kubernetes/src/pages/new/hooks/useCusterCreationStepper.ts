import { useState } from 'react';
import { TLocalisation } from '@ovh-ux/manager-pci-common';
import { useStep } from './useStep';
import { TNetworkFormState } from '../steps/NetworkClusterStep.component';
import { TClusterPlan, UpdatePolicy } from '@/types';

import { NodePoolPrice } from '@/api/data/kubernetes';

export type TClusterCreationForm = {
  region: TLocalisation | null;
  version: string;
  updatePolicy: UpdatePolicy | null;
  network: TNetworkFormState | null;
  nodePools?: NodePoolPrice[] | null;
  plan: TClusterPlan | null;
  clusterName: string;
};

type TFormMandatoryKeys = Exclude<keyof TClusterCreationForm, 'nodePools'>;

export type TNonNullableForm = {
  [K in TFormMandatoryKeys]-?: NonNullable<TClusterCreationForm[K]>;
} & {
  nodePools?: TClusterCreationForm['nodePools'];
};

const stepReset = (step: ReturnType<typeof useStep>) => {
  step.unlock();
  step.uncheck();
  step.close();
};

export function useClusterCreationStepper(has3AZRegions = false) {
  const [form, setForm] = useState<TClusterCreationForm>({
    region: null,
    version: '',
    updatePolicy: null,
    network: null,
    plan: null,
    clusterName: '',
  });

  const clusterNameStep = useStep({ isOpen: true });
  const locationStep = useStep();
  const planStep = useStep();
  const versionStep = useStep();
  const networkStep = useStep();
  const nodeStep = useStep();
  const confirmStep = useStep();

  return {
    form,
    setForm,
    clusterName: {
      step: clusterNameStep,
      edit: () => {
        clusterNameStep.unlock();
        [
          locationStep,
          planStep,
          versionStep,
          networkStep,
          nodeStep,
          confirmStep,
        ].forEach(stepReset);
      },
      update: (clusterName: string) => {
        setForm((f) => ({
          ...f,
          clusterName,
        }));
      },
      submit: (clusterName: string) => {
        setForm((f) => ({
          ...f,
          clusterName,
        }));
        clusterNameStep.check();
        clusterNameStep.lock();
        locationStep.open();
      },
    },
    location: {
      step: locationStep,
      edit: () => {
        locationStep.unlock();
        [planStep, versionStep, networkStep, nodeStep, confirmStep].forEach(
          stepReset,
        );
      },
      submit: (region: TLocalisation) => {
        setForm((f) => ({
          ...f,
          region,
        }));
        locationStep.check();
        locationStep.lock();
        (has3AZRegions ? planStep : versionStep).open();
      },
    },
    ...(has3AZRegions && {
      plan: {
        step: planStep,
        edit: () => {
          planStep.unlock();
          [versionStep, networkStep, nodeStep, confirmStep].forEach(stepReset);
        },
        submit: (plan: TClusterPlan) => {
          setForm((f) => ({
            ...f,
            plan,
          }));
          planStep.check();
          planStep.lock();
          versionStep.open();
        },
      },
    }),
    version: {
      step: versionStep,
      edit: () => {
        versionStep.unlock();
        [networkStep, nodeStep, confirmStep].forEach(stepReset);
      },
      submit: (version: string, updatePolicy: UpdatePolicy) => {
        setForm((f) => ({
          ...f,
          version,
          updatePolicy,
        }));
        versionStep.check();
        versionStep.lock();
        networkStep.open();
      },
    },
    network: {
      step: networkStep,
      edit: () => {
        networkStep.unlock();
        [nodeStep, confirmStep].forEach(stepReset);
      },
      submit: (network: TClusterCreationForm['network']) => {
        setForm((f) => ({
          ...f,
          network,
        }));
        networkStep.check();
        networkStep.lock();
        nodeStep.open();
      },
    },

    node: {
      step: nodeStep,
      edit: () => {
        nodeStep.unlock();
        [confirmStep].forEach(stepReset);
      },
      submit: (nodePools: NodePoolPrice[] | null) => {
        setForm((f) => ({
          ...f,
          nodePools,
        }));
        nodeStep.check();
        nodeStep.lock();
        confirmStep.open();
      },
    },
    confirm: {
      step: confirmStep,
      edit: () => {
        confirmStep.unlock();
      },
      submit: () => {
        confirmStep.check();
        confirmStep.lock();
      },
    },
  };
}
