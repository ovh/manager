import { useEffect, useMemo, useState } from 'react';
import { useProjectRegions } from '@ovh-ux/manager-pci-common';
import { Step, useStep } from '@/pages/new/hooks/useStep';
import { TFormState } from '@/pages/new/form.type';
import { TLocalisation } from '@/api/hooks/useRegions';
import {
  isProductWithAvailabilityZone,
  isRegionWith3AZ,
} from '@/api/data/availableVolumes';
import { TVolumeAddon } from '@/api/data/catalog';

export function useVolumeStepper(projectId: string) {
  const { data } = useProjectRegions(projectId);
  const is3AZAvailable = useMemo(() => !!data && data.some(isRegionWith3AZ), [
    data,
  ]);

  const [form, setForm] = useState<Partial<TFormState>>({});
  const locationStep = useStep({ isOpen: true });
  const volumeTypeStep = useStep();
  const availabilityZoneStep = useStep();
  const capacityStep = useStep();
  const volumeNameStep = useStep();
  const validationStep = useStep();

  useEffect(() => {
    if (is3AZAvailable) {
      availabilityZoneStep.show();
    } else {
      availabilityZoneStep.hide();
    }
  }, [is3AZAvailable]);

  const order = [
    locationStep,
    volumeTypeStep,
    availabilityZoneStep,
    capacityStep,
    volumeNameStep,
    validationStep,
  ];

  return {
    form,
    location: {
      step: locationStep,
      edit: () => {
        locationStep.unlock();
        [
          volumeTypeStep,
          availabilityZoneStep,
          capacityStep,
          volumeNameStep,
          validationStep,
        ].forEach((step) => {
          step.uncheck();
          step.unlock();
          step.close();
        });
        setForm({});
      },
      submit: (region: TLocalisation) => {
        locationStep.check();
        locationStep.lock();
        volumeTypeStep.open();
        if (is3AZAvailable) {
          if (isRegionWith3AZ(region)) {
            availabilityZoneStep.show();
          } else {
            availabilityZoneStep.hide();
          }
        }
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
        [
          availabilityZoneStep,
          capacityStep,
          volumeNameStep,
          validationStep,
        ].forEach((step) => {
          step.uncheck();
          step.unlock();
          step.close();
        });
        setForm((f) => ({ region: f.region }));
      },
      submit: (volumeType: TVolumeAddon) => {
        volumeTypeStep.check();
        volumeTypeStep.lock();
        if (
          is3AZAvailable &&
          isRegionWith3AZ(form.region) &&
          isProductWithAvailabilityZone(volumeType.planCode)
        ) {
          availabilityZoneStep.show();
          availabilityZoneStep.open();
        } else {
          availabilityZoneStep.hide();
          capacityStep.open();
        }
        setForm((f) => ({
          ...f,
          volumeType,
        }));
      },
    },
    availabilityZone: {
      step: availabilityZoneStep,
      edit: () => {
        volumeTypeStep.unlock();
        [
          availabilityZoneStep,
          capacityStep,
          volumeNameStep,
          validationStep,
        ].forEach((step) => {
          step.uncheck();
          step.unlock();
          step.close();
        });
        setForm((f) => ({ region: f.region, volumeType: f.volumeType }));
      },
      submit: (availabilityZone: string) => {
        availabilityZoneStep.check();
        availabilityZoneStep.lock();
        capacityStep.open();
        setForm((f) => ({
          ...f,
          availabilityZone,
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
          region: f.region,
          volumeType: f.volumeType,
          availabilityZone: f.availabilityZone,
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
          region: f.region,
          volumeType: f.volumeType,
          availabilityZone: f.availabilityZone,
          volumeCapacity: f.volumeCapacity,
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
    getOrder(step: Step) {
      return order.filter((o) => o.isShown).findIndex((o) => o === step) + 1;
    },
  };
}
