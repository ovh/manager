import { useEffect, useMemo } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Engine, Flavor, Plan, Region, Version } from '@/types/orderFunnel';
import * as databases from '@/types/cloud/project/database';
import { computeServicePrice } from '@/lib/pricingHelper';
import { useUpdateTree } from '../_components/useUpdateTree';

interface UseUpdateFlavorProps {
  availabilities: databases.Availability[];
  service: databases.Service;
}

export function useUpdateFlavor({
  availabilities,
  service,
}: UseUpdateFlavorProps) {
  // Validation schema
  const schema = z.object({
    flavor: z.string().min(1),
    storage: z.coerce.number().nonnegative(),
  });

  // Compute available flavors for this service
  const listEngines = useUpdateTree(availabilities);
  const listFlavors = useMemo(() => {
    const engine = listEngines?.find((e: Engine) => e.name === service.engine);
    const version = engine?.versions.find(
      (v: Version) => v.name === service.version,
    );
    const plan = version?.plans.find((p: Plan) => p.name === service.plan);
    const region = plan?.regions.find(
      (r: Region) => r.name === service.nodes[0].region,
    );
    return region?.flavors.sort((a, b) => a.order - b.order) || [];
  }, [listEngines, service]);

  // Initial values
  const hasStorage =
    service.storage?.size.value > 0 && service.storage.size.unit === 'GB';
  const initialFlavorObject = useMemo(
    () => listFlavors.find((f: Flavor) => f.name === service.flavor),
    [service.flavor, listFlavors],
  );

  const initialAddedStorage = useMemo(() => {
    if (hasStorage && initialFlavorObject) {
      return Math.max(
        0,
        service.storage.size.value -
          (initialFlavorObject.storage?.minimum.value || 0),
      );
    }
    return 0;
  }, [service.storage, initialFlavorObject]);

  // Form setup
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      flavor: service.flavor,
      storage: initialAddedStorage,
    },
  });

  const selectedFlavor = form.watch('flavor');
  const selectedStorage = form.watch('storage');

  const flavorObject = useMemo(
    () => listFlavors.find((f: Flavor) => f.name === selectedFlavor),
    [selectedFlavor, listFlavors],
  );

  const availability = useMemo(() => {
    return availabilities?.find(
      (a) =>
        a.engine === service.engine &&
        a.specifications.flavor === selectedFlavor &&
        a.plan === service.plan &&
        a.region === service.nodes[0].region,
    );
  }, [availabilities, service, selectedFlavor]);

  useEffect(() => {
    form.setValue(
      'storage',
      selectedFlavor === service.flavor ? initialAddedStorage : 0,
    );
  }, [selectedFlavor, service.flavor, initialAddedStorage, form]);

  // Pricing calculations
  const computePrice = (
    flavor: Flavor | undefined,
    additionalStorage: number,
  ) => {
    if (!flavor || !listEngines) return null;
    const { storageMode } =
      listEngines.find((e) => e.name === service.engine) || {};
    return computeServicePrice({
      offerPricing: flavor.pricing || {},
      nbNodes: service.nodes.length,
      storagePricing: flavor.storage?.pricing || {},
      additionalStorage,
      storageMode,
    });
  };

  const oldPrice = useMemo(() => {
    return computePrice(initialFlavorObject, initialAddedStorage);
  }, [initialFlavorObject, initialAddedStorage, service.nodes.length]);

  const newPrice = useMemo(() => {
    return computePrice(flavorObject, selectedStorage);
  }, [flavorObject, selectedStorage, service.nodes.length]);

  return {
    form,
    listEngines,
    listFlavors,
    availability,
    hasStorage,
    initialFlavorObject,
    initialAddedStorage,
    oldPrice,
    newPrice,
  };
}
