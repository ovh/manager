import { useMemo } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Engine, Flavor, Plan, Version } from '@/types/orderFunnel';
import * as databases from '@/types/cloud/project/database';
import { computeServicePrice } from '@/lib/pricingHelper';
import { useUpdateTree } from '../_components/useUpdateTree';

interface UseUpdatePlanProps {
  availabilities: databases.Availability[];
  service: databases.Service;
}
export function useUpdatePlan({ availabilities, service }: UseUpdatePlanProps) {
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/settings/update',
  );

  // Validation schema
  const schema = z.object({
    plan: z
      .string()
      .min(1)
      .refine((newPlan) => newPlan !== service.plan, {
        message: t('updatePlanErrorSimilar'),
      }),
  });

  // Form setup
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      plan: service.plan,
    },
  });
  const selectedPlan = form.watch('plan');

  // Compute available plans for this service
  const listEngines = useUpdateTree(availabilities);
  const listPlans =
    listEngines
      ?.find((e: Engine) => e.name === service.engine)
      ?.versions.find((v: Version) => v.name === service.version)
      ?.plans.sort((a, b) => a.order - b.order) || [];

  // Initial values
  const initialPlan = listPlans?.find((p) => p.name === service.plan);
  const initialFlavorObject = useMemo(() => {
    return initialPlan?.regions
      .find((r) => r.name === service.nodes[0].region)
      ?.flavors?.find((f) => f.name === service.flavor);
  }, [initialPlan, service.nodes, service.flavor]);

  const initialAddedStorage = useMemo(() => {
    if (
      service.storage?.size.value > 0 &&
      service.storage.size.unit === 'GB' &&
      initialFlavorObject
    ) {
      return (
        service.storage.size.value - initialFlavorObject.storage?.minimum.value
      );
    }
    return 0;
  }, [service.storage, initialFlavorObject]);

  // Pricing calculations
  const computePrice = (
    flavor: Flavor | undefined,
    plan: Plan | undefined,
    isNewPrice = false,
  ) => {
    if (!flavor) return null;
    const { storageMode } =
      listEngines?.find((e) => e.name === service.engine) || {};
    return computeServicePrice({
      offerPricing: flavor.pricing,
      nbNodes: isNewPrice
        ? Math.max(service.nodes.length, plan?.nodes.minimum || 0)
        : service.nodes.length,
      storagePricing: flavor.storage?.pricing,
      additionalStorage: initialAddedStorage,
      storageMode,
    });
  };

  const oldPrice = useMemo(
    () => computePrice(initialFlavorObject, initialPlan),
    [initialFlavorObject, initialAddedStorage],
  );

  const newPrice = useMemo(() => {
    const selectedPlanObj = listPlans.find((p) => p.name === selectedPlan);
    const region = selectedPlanObj?.regions.find(
      (r) => r.name === service.nodes[0].region,
    );
    const flavor =
      region?.flavors.find((f) => f.name === service.flavor) ||
      region?.flavors[0];
    return computePrice(flavor, selectedPlanObj, true);
  }, [selectedPlan, listPlans, initialAddedStorage]);

  return {
    form,
    listEngines,
    listPlans,
    initialPlan,
    initialFlavorObject,
    initialAddedStorage,
    oldPrice,
    newPrice,
  };
}
