import { useEffect, useState } from 'react';
import { ButtonType, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { Step, useStep } from '@/pages/new/hooks/useStep';
import { TFormState } from '@/pages/new/form.type';
import { TVolumeAddon } from '@/api/data/catalog';
import { useHas3AZRegion } from '@/api/hooks/useHas3AZRegion';
import { TRegion } from '@/api/data/regions';
import { useVolumeCatalog } from '@/api/hooks/useCatalog';

export function useVolumeStepper(projectId: string) {
  const { data: volumeCatalog } = useVolumeCatalog(projectId);
  const { has3AZ } = useHas3AZRegion(projectId);
  const { trackClick } = useOvhTracking();

  const [form, setForm] = useState<Partial<TFormState>>({});
  const locationStep = useStep({ isOpen: true });
  const volumeTypeStep = useStep();
  const availabilityZoneStep = useStep();
  const capacityStep = useStep();
  const volumeNameStep = useStep();
  const validationStep = useStep();

  useEffect(() => {
    if (has3AZ) {
      availabilityZoneStep.show();
    } else {
      availabilityZoneStep.hide();
    }
  }, [has3AZ]);

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
        trackClick({
          buttonType: ButtonType.link,
          actions: [`edit_step_location_${form.region.name}`],
        });

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
      submit: (region: TRegion) => {
        locationStep.check();
        locationStep.lock();
        volumeTypeStep.open();
        if (has3AZ) {
          if (
            volumeCatalog.models.some((m) =>
              m.pricings.some(
                (p) =>
                  p.regions.includes(region.name) && p.showAvailabilityZones,
              ),
            )
          ) {
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
        trackClick({
          buttonType: ButtonType.link,
          actions: [`edit_step_volume_${form.volumeType.name}`],
        });

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
        const pricing = volumeType.pricings.find((p) =>
          p.regions.includes(form.region.name),
        );
        if (has3AZ && pricing.showAvailabilityZones) {
          availabilityZoneStep.show();
          availabilityZoneStep.open();
        } else {
          availabilityZoneStep.hide();
          capacityStep.open();
        }
        setForm((f) => ({
          ...f,
          volumeType,
          pricing,
        }));
      },
    },
    availabilityZone: {
      step: availabilityZoneStep,
      edit: () => {
        trackClick({
          buttonType: ButtonType.link,
          actions: [
            `edit_step_location_detailed_${form.volumeType.name}-manually`,
          ],
        });

        availabilityZoneStep.unlock();
        [capacityStep, volumeNameStep, validationStep].forEach((step) => {
          step.uncheck();
          step.unlock();
          step.close();
        });
        setForm((f) => ({
          region: f.region,
          volumeType: f.volumeType,
          pricing: f.pricing,
        }));
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
        trackClick({
          buttonType: ButtonType.link,
          actions: ['edit_step_configure_volume_capacity'],
        });

        capacityStep.unlock();
        [volumeNameStep, validationStep].forEach((step) => {
          step.uncheck();
          step.unlock();
          step.close();
        });
        setForm((f) => ({
          region: f.region,
          volumeType: f.volumeType,
          pricing: f.pricing,
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
        trackClick({
          buttonType: ButtonType.link,
          actions: ['edit_step_name'],
        });

        volumeNameStep.unlock();
        validationStep.uncheck();
        validationStep.unlock();
        validationStep.close();
        setForm((f) => ({
          region: f.region,
          volumeType: f.volumeType,
          pricing: f.pricing,
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
