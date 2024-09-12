import { useState } from 'react';
import { KubeFlavor, TLocalisation } from '@ovh-ux/manager-pci-common';
import { useStep } from './useStep';
import { AutoscalingState } from '@/components/Autoscaling.component';
import { TNetworkFormState } from './steps/NetworkClusterStep.component';
import { UPGRADEPOLICIES } from '@/types';

export type TClusterCreationForm = {
  region: TLocalisation;
  version: string;
  updatePolicy: UPGRADEPOLICIES;
  network: TNetworkFormState;
  flavor: KubeFlavor;
  scaling: AutoscalingState;
  clusterName: string;
  isMonthlyBilled: boolean;
  antiAffinity: boolean;
};

const stepReset = (step: ReturnType<typeof useStep>) => {
  step.unlock();
  step.uncheck();
  step.close();
};

export function useClusterCreationStepper() {
  const [form, setForm] = useState<TClusterCreationForm>({
    region: null,
    version: '',
    updatePolicy: null,
    network: null,
    flavor: null,
    scaling: null,
    clusterName: '',
    isMonthlyBilled: false,
    antiAffinity: false,
  });

  const locationStep = useStep({ isOpen: true });
  const versionStep = useStep();
  const networkStep = useStep();
  const nodeTypeStep = useStep();
  const nodeSizeStep = useStep();
  const billingStep = useStep();
  const clusterNameStep = useStep();

  return {
    form,
    location: {
      step: locationStep,
      edit: () => {
        locationStep.unlock();
        [
          versionStep,
          networkStep,
          nodeTypeStep,
          nodeSizeStep,
          billingStep,
          clusterNameStep,
        ].forEach(stepReset);
      },
      submit: (region: TLocalisation) => {
        setForm((f) => ({
          ...f,
          region,
        }));
        locationStep.check();
        locationStep.lock();
        versionStep.open();
      },
    },
    version: {
      step: versionStep,
      edit: () => {
        versionStep.unlock();
        [
          networkStep,
          nodeTypeStep,
          nodeSizeStep,
          billingStep,
          clusterNameStep,
        ].forEach(stepReset);
      },
      submit: (version: string, updatePolicy: UPGRADEPOLICIES) => {
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
        [nodeTypeStep, nodeSizeStep, billingStep, clusterNameStep].forEach(
          stepReset,
        );
      },
      submit: (network: TClusterCreationForm['network']) => {
        setForm((f) => ({
          ...f,
          network,
        }));
        networkStep.check();
        networkStep.lock();
        nodeTypeStep.open();
      },
    },
    nodeType: {
      step: nodeTypeStep,
      edit: () => {
        nodeTypeStep.unlock();
        [nodeSizeStep, billingStep, clusterNameStep].forEach(stepReset);
      },
      submit: (flavor: KubeFlavor) => {
        setForm((f) => ({
          ...f,
          flavor,
        }));
        nodeTypeStep.check();
        nodeTypeStep.lock();
        nodeSizeStep.open();
      },
    },
    nodeSize: {
      step: nodeSizeStep,
      edit: () => {
        nodeSizeStep.unlock();
        [billingStep, clusterNameStep].forEach(stepReset);
      },
      submit: (scaling: AutoscalingState) => {
        setForm((f) => ({
          ...f,
          scaling,
        }));
        nodeSizeStep.check();
        nodeSizeStep.lock();
        billingStep.open();
      },
    },
    billing: {
      step: billingStep,
      edit: () => {
        billingStep.unlock();
        [clusterNameStep].forEach(stepReset);
      },
      submit: (antiAffinity: boolean, isMonthlyBilled: boolean) => {
        setForm((f) => ({
          ...f,
          antiAffinity,
          isMonthlyBilled,
        }));
        billingStep.check();
        billingStep.lock();
        clusterNameStep.open();
      },
    },
    clusterName: {
      step: clusterNameStep,
      edit: () => {
        clusterNameStep.unlock();
        [].forEach((step) => {
          step.unlock();
          step.uncheck();
          step.close();
        });
      },
      update: (clusterName: string) => {
        setForm((f) => ({
          ...f,
          clusterName,
        }));
      },
    },
  };
}
