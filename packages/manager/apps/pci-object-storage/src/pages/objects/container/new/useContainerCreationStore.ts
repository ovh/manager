import { create } from 'zustand';
import { TRegionAvailability } from '@ovh-ux/manager-pci-common';
import {
  NO_ENCRYPTION_VALUE,
  OBJECT_CONTAINER_MODE_LOCAL_ZONE,
  OBJECT_CONTAINER_OFFER_STORAGE_STANDARD,
  OBJECT_CONTAINER_OFFER_SWIFT,
  OBJECT_CONTAINER_MODE_MULTI_ZONES,
} from '@/constants';

export interface ContainerCreationForn {
  offer: string;
  deploymentMode: string;
  region: TRegionAvailability;
  ownerId: number;
  offsiteReplication: boolean;
  offsiteReplicationRegion?: string;
  versioning: boolean;
  encryption: string;
  containerName: string;
  containerType: string;
}

export interface StepState {
  isOpen?: boolean;
  isChecked?: boolean;
  isLocked?: boolean;
}

export interface ContainerStore {
  form: ContainerCreationForn;
  stepper: {
    offer: StepState;
    deployment: StepState;
    region: StepState;
    offsiteReplication: StepState;
    versioning: StepState;
    ownerId: StepState;
    encryption: StepState;
    containerName: StepState;
    containerType: StepState;
  };

  reset: () => void;

  setOffer: (offer: string) => void;
  editOffer: () => void;
  submitOffer: () => void;

  setDeploymentMode: (mode: string) => void;
  editDeploymentMode: () => void;
  submitDeploymentMode: () => void;

  setRegion: (region: TRegionAvailability) => void;
  editRegion: () => void;
  submitRegion: () => void;

  setOffsiteReplication: (versioning: boolean) => void;
  setOffsiteReplicationRegion: (region: string) => void;
  editOffsiteReplication: () => void;
  submitOffsiteReplication: () => void;

  setVersioning: (versioning: boolean) => void;
  editVersioning: () => void;
  submitVersioning: () => void;

  setOwnerId: (ownerId: number) => void;
  editOwnerId: () => void;
  submitOwnerId: () => void;

  setEncryption: (encryption: string) => void;
  editEncryption: () => void;
  submitEncryption: () => void;

  setContainerName: (name: string) => void;

  setContainerType: (type: string) => void;
  editContainerType: () => void;
  submitContainerType: () => void;
}

const initialForm = {
  offer: OBJECT_CONTAINER_OFFER_STORAGE_STANDARD,
  deploymentMode: undefined,
  region: undefined,
  offsiteReplication: false,
  offsiteReplicationRegion: undefined,
  versioning: false,
  ownerId: undefined,
  encryption: NO_ENCRYPTION_VALUE,
  containerName: '',
  containerType: undefined,
};

const initialStepper = {
  offer: { isOpen: true },
  deployment: {},
  region: {},
  offsiteReplication: {},
  versioning: {},
  ownerId: {},
  encryption: {},
  containerName: {},
  containerType: {},
};

export const useContainerCreationStore = create<ContainerStore>()(
  (set, get) => {
    /** Unlock and open the 'toEdit' step, closes the other 'toClose' steps and reset their form values */
    const editStep = (toEdit: string, toClose: string[]) => {
      set((state) => ({
        stepper: {
          ...state.stepper,
          [toEdit]: {
            isOpen: true,
            isLocked: false,
            isChecked: false,
          },
          ...toClose.reduce(
            (acc, key) => ({
              ...acc,
              [key]: {
                isOpen: false,
                isLocked: false,
                isChecked: false,
              },
            }),
            {},
          ),
        },
        form: {
          ...state.form,
          ...toClose.reduce(
            (acc, key) => ({
              ...acc,
              [key]: undefined,
            }),
            {},
          ),
        },
      }));
    };

    /** Submit and close the 'toSubmit' step, open and unlock to next step */
    const submitStep = (toSubmit: string, nextState: string) => {
      set((state) => ({
        stepper: {
          ...state.stepper,
          [toSubmit]: {
            isOpen: false,
            isChecked: true,
            isLocked: true,
          },
          [nextState]: {
            isOpen: true,
            isChecked: false,
            isLocked: false,
          },
        },
      }));
    };

    return {
      // initial form state
      form: initialForm,

      // initial stepper state
      stepper: initialStepper,

      reset: () =>
        set((state) => ({
          ...state,
          form: initialForm,
          stepper: initialStepper,
        })),

      setOffer: (offer: string) =>
        set((state) => ({
          form: {
            ...state.form,
            offer,
            deploymentMode: undefined,
            region: undefined,
            ownerId: undefined,
            versioning: false,
            encryption: NO_ENCRYPTION_VALUE,
            containerName: '',
            containerType: undefined,
          },
        })),
      submitOffer: () =>
        submitStep(
          'offer',
          get().form.offer === OBJECT_CONTAINER_OFFER_SWIFT
            ? 'region'
            : 'deployment',
        ),
      editOffer: () =>
        editStep('offer', [
          'deployment',
          'region',
          'ownerId',
          'versioning',
          'encryption',
          'containerName',
          'containerType',
        ]),

      setDeploymentMode: (deploymentMode: string) =>
        set((state) => ({
          form: {
            ...state.form,
            deploymentMode,
            region: undefined,
            offsiteReplication: false,
            ownerId: undefined,
            versioning: false,
            encryption: NO_ENCRYPTION_VALUE,
            containerName: '',
            containerType: undefined,
          },
        })),
      submitDeploymentMode: () => submitStep('deployment', 'region'),
      editDeploymentMode: () =>
        editStep('deployment', [
          'region',
          'offsiteReplication',
          'ownerId',
          'versioning',
          'encryption',
          'containerName',
        ]),

      setRegion: (region: TRegionAvailability) =>
        set((state) => ({
          form: {
            ...state.form,
            region,
            versioning: false,
            offsiteReplication: false,
            ownerId: undefined,
            encryption: NO_ENCRYPTION_VALUE,
            containerName: '',
            containerType: undefined,
          },
        })),
      submitRegion: () => {
        const { form } = get();
        if (form.offer === OBJECT_CONTAINER_OFFER_SWIFT) {
          submitStep('region', 'containerType');
        } else if (form.deploymentMode === OBJECT_CONTAINER_MODE_LOCAL_ZONE) {
          submitStep('region', 'containerName');
        } else if (form.deploymentMode === OBJECT_CONTAINER_MODE_MULTI_ZONES) {
          submitStep('region', 'offsiteReplication');
        } else {
          submitStep('region', 'versioning');
        }
      },
      editRegion: () =>
        editStep('region', [
          'offsiteReplication',
          'versioning',
          'ownerId',
          'encryption',
          'containerName',
          'containerType',
        ]),

      setOffsiteReplication: (offsiteReplication: boolean) =>
        set((state) => ({
          form: {
            ...state.form,
            offsiteReplication,
            offsiteReplicationRegion: offsiteReplication
              ? state.form.offsiteReplicationRegion
              : undefined,
            versioning: offsiteReplication,
            ownerId: undefined,
            encryption: NO_ENCRYPTION_VALUE,
            containerName: '',
            containerType: undefined,
          },
        })),
      setOffsiteReplicationRegion: (offsiteReplicationRegion: string) =>
        set((state) => ({
          form: {
            ...state.form,
            offsiteReplicationRegion,
          },
        })),
      editOffsiteReplication: () =>
        editStep('offsiteReplication', [
          'versioning',
          'ownerId',
          'encryption',
          'containerName',
        ]),
      submitOffsiteReplication: () =>
        submitStep('offsiteReplication', 'versioning'),

      setVersioning: (versioning: boolean) =>
        set((state) => ({
          form: {
            ...state.form,
            versioning,
            ownerId: undefined,
            encryption: NO_ENCRYPTION_VALUE,
            containerName: '',
            containerType: undefined,
          },
        })),
      editVersioning: () =>
        editStep('versioning', ['ownerId', 'encryption', 'containerName']),
      submitVersioning: () => submitStep('versioning', 'ownerId'),

      setOwnerId: (ownerId: number) =>
        set((state) => ({
          form: {
            ...state.form,
            ownerId,
            encryption: NO_ENCRYPTION_VALUE,
            containerName: '',
            containerType: undefined,
          },
        })),
      editOwnerId: () => editStep('ownerId', ['encryption', 'containerName']),
      submitOwnerId: () => submitStep('ownerId', 'encryption'),

      setEncryption: (encryption: string) =>
        set((state) => ({
          form: {
            ...state.form,
            encryption,
            containerName: '',
            containerType: undefined,
          },
        })),
      editEncryption: () => editStep('encryption', ['containerName']),
      submitEncryption: () => submitStep('encryption', 'containerName'),

      setContainerName: (containerName: string) =>
        set((state) => ({
          form: {
            ...state.form,
            containerName,
          },
        })),

      setContainerType: (containerType: string) =>
        set((state) => ({
          form: {
            ...state.form,
            containerName: '',
            containerType,
          },
        })),
      editContainerType: () => editStep('containerType', ['containerName']),
      submitContainerType: () => submitStep('containerType', 'containerName'),
    };
  },
);
