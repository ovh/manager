/* eslint-disable no-param-reassign */
import { order } from '@/types/catalog';
import * as database from '@/types/cloud/project/database';
import { Engine, Flavor, Plan, Region, Version } from '@/types/orderFunnel';
import { compareStorage } from './bytesHelper';
import { FullCapabilities } from '@/hooks/api/database/capabilities/useGetFullCapabilities.hook';
import { PRICING_PREFIX } from '@/configuration/pricing.constants';

function updatePlanStorage(
  availability: database.Availability,
  treePlan: Plan,
) {
  if (availability.specifications.storage) {
    // add storage to plan, if it does not exist yet
    if (!treePlan.storage) {
      treePlan.storage = {
        minimum: availability.specifications.storage.minimum,
        maximum: availability.specifications.storage.maximum,
      };
    }
    // update min storage, if needed
    const availabilityMin = availability.specifications.storage.minimum;
    const treeMin = treePlan.storage.minimum;
    if (compareStorage(availabilityMin, treeMin) < 0) {
      treePlan.storage.minimum = availabilityMin;
    }
    // update max storage, if needed
    const availabilityMax = availability.specifications.storage.maximum;
    const treeMax = treePlan.storage.maximum;
    if (compareStorage(availabilityMax, treeMax) < 0) {
      treePlan.storage.maximum = availabilityMax;
    }
  }
}

function updatePlanCpu(
  treePlan: Plan,
  flavorSpec: database.capabilities.Flavor,
) {
  if (flavorSpec.specifications.core) {
    if (!treePlan.cpu) {
      treePlan.cpu = {
        minimum: flavorSpec.specifications.core,
        maximum: flavorSpec.specifications.core,
      };
    }
    if (flavorSpec.specifications.core < treePlan.cpu.minimum)
      treePlan.cpu.minimum = flavorSpec.specifications.core;
    if (flavorSpec.specifications.core > treePlan.cpu.maximum)
      treePlan.cpu.maximum = flavorSpec.specifications.core;
  }
}

function updatePlanRam(
  treePlan: Plan,
  flavorSpec: database.capabilities.Flavor,
) {
  if (flavorSpec.specifications.memory) {
    if (!treePlan.ram) {
      treePlan.ram = {
        minimum: flavorSpec.specifications.memory,
        maximum: flavorSpec.specifications.memory,
      };
    }
    if (
      compareStorage(flavorSpec.specifications.memory, treePlan.ram.minimum) < 0
    )
      treePlan.ram.minimum = flavorSpec.specifications.memory;
    if (
      compareStorage(flavorSpec.specifications.memory, treePlan.ram.maximum) > 0
    )
      treePlan.ram.maximum = flavorSpec.specifications.memory;
  }
}

function updatePlanNodes(treePlan: Plan, availability: database.Availability) {
  if (availability.specifications.nodes.minimum < treePlan.nodes.minimum) {
    treePlan.nodes.minimum = availability.specifications.nodes.minimum;
  }
  if (availability.specifications.nodes.maximum > treePlan.nodes.maximum) {
    treePlan.nodes.maximum = availability.specifications.nodes.maximum;
  }
}

function updatePlanNetworks(
  treePlan: Plan,
  availability: database.Availability,
) {
  treePlan.networks = [
    ...new Set([...treePlan.networks, availability.specifications.network]),
  ];
}

const mapEngine = (
  tree: Engine[],
  availability: database.Availability,
  capabilities: FullCapabilities,
  engineSuggestion: database.availability.Suggestion,
) => {
  let treeEngine = tree.find((a) => a.name === availability.engine);
  if (!treeEngine) {
    const engineCapability = capabilities.engines.find(
      (ec) => ec.name === availability.engine,
    );
    treeEngine = {
      name: availability.engine,
      category: engineCapability.category,
      description: engineCapability.description,
      tags: engineCapability.tags,
      order: engineCapability.order,
      default: engineSuggestion.default,
      defaultVersion: engineSuggestion.version,
      storageMode: engineCapability.storage,
      versions: [],
      ...(engineCapability.lifecycle?.endOfSale && {
        eos: engineCapability.lifecycle.endOfSale,
      }),
    };
    tree.push(treeEngine);
  }
  return treeEngine;
};

const mapVersion = (
  treeEngine: Engine,
  availability: database.Availability,
  capabilities: FullCapabilities,
  engineSuggestion: database.availability.Suggestion,
) => {
  let treeVersion = treeEngine.versions.find(
    (v) => v.name === availability.version,
  );
  if (!treeVersion) {
    const engineCapability = capabilities.engines.find(
      (ec) => ec.name === availability.engine,
    );
    const versionCapability = engineCapability.versions.find(
      (v) => v.name === availability.version,
    );
    treeVersion = {
      name: availability.version,
      tags: versionCapability.tags,
      order: engineCapability.versions.indexOf(versionCapability),
      default: engineSuggestion.version === availability.version,
      regions: [],
    };
    treeEngine.versions.push(treeVersion);
  }
  return treeVersion;
};

const mapPlan = (
  treeRegion: Region,
  availability: database.Availability,
  capabilities: FullCapabilities,
  engineSuggestion: database.availability.Suggestion,
) => {
  let treePlan = treeRegion.plans.find((p) => p.name === availability.plan);
  if (!treePlan) {
    const planCapability = capabilities.plans.find(
      (p) => p.name === availability.plan,
    );
    treePlan = {
      name: availability.plan,
      networks: [availability.specifications.network],
      order: planCapability.order,
      tags: planCapability.tags as database.capabilities.TagEnum[],
      default: engineSuggestion.plan === availability.plan,
      backups: availability.backups.available,
      nodes: {
        minimum: availability.specifications.nodes.minimum,
        maximum: availability.specifications.nodes.maximum,
      },
      flavors: [],
    };
    treeRegion.plans.push(treePlan);
  }
  // once the plan is in the tree, we can compute range values
  const flavorSpec = capabilities.flavors.find(
    (f) => f.name === availability.specifications.flavor,
  );
  updatePlanStorage(availability, treePlan);
  updatePlanCpu(treePlan, flavorSpec);
  updatePlanRam(treePlan, flavorSpec);
  updatePlanNodes(treePlan, availability);
  updatePlanNetworks(treePlan, availability);
  return treePlan;
};

const mapRegion = (
  treeVersion: Version,
  availability: database.Availability,
  capabilities: FullCapabilities,
  engineSuggestion: database.availability.Suggestion,
) => {
  let treeRegion = treeVersion.regions.find(
    (r) => r.name === availability.region,
  );
  if (!treeRegion) {
    const regionCapability = capabilities.regions.find(
      (r) => r.name === availability.region,
    );
    treeRegion = {
      name: availability.region,
      default: engineSuggestion.region === availability.region,
      order: regionCapability.order,
      tags: regionCapability.tags,
      type: regionCapability.type,
      plans: [],
    };
    treeVersion.regions.push(treeRegion);
  }
  return treeRegion;
};

const mapFlavor = (
  treePlan: Plan,
  availability: database.Availability,
  capabilities: FullCapabilities,
  engineSuggestion: database.availability.Suggestion,
) => {
  const flavorSpec = capabilities.flavors.find(
    (f) => f.name === availability.specifications.flavor,
  );
  let treeFlavor = treePlan.flavors.find(
    (f) => f.name === availability.specifications.flavor,
  );
  if (!treeFlavor) {
    treeFlavor = {
      name: availability.specifications.flavor,
      storage: availability.specifications.storage,
      ram: flavorSpec?.specifications.memory,
      vcores: flavorSpec?.specifications.core,
      order: flavorSpec.order,
      tags: flavorSpec.tags as database.capabilities.TagEnum[],
      default: engineSuggestion.flavor === availability.specifications.flavor,
      pricing: {},
    };
    treePlan.flavors.push(treeFlavor);
  }
  return treeFlavor;
};

const setPrices = (
  availability: database.Availability,
  catalog: order.publicOrder.Catalog,
  flavor: Flavor,
) => {
  // Default pricing if not found in the catalog
  const defaultPricing = {
    price: undefined,
    tax: 0,
  } as order.publicOrder.Pricing;

  const hasStorage = flavor.storage?.step;

  let hourlyPricing = defaultPricing;
  let monthlyPricing = defaultPricing;
  let hourlyStoragePricing = defaultPricing;
  let monthlyStoragePricing = defaultPricing;

  const findPricing = (pricingPlanCode: string) =>
    catalog.addons.find((addon) => addon.planCode === pricingPlanCode)
      ?.pricings?.[0] || defaultPricing;

  hourlyPricing = findPricing(`${PRICING_PREFIX}.${availability.planCode}`);
  monthlyPricing = findPricing(
    `${PRICING_PREFIX}.${availability.planCode.replace(
      '.hour.consumption',
      '.month.consumption',
    )}`,
  );
  if (hasStorage) {
    hourlyStoragePricing = findPricing(
      `${PRICING_PREFIX}.${availability.planCodeStorage}`,
    );
    monthlyStoragePricing = findPricing(
      `${PRICING_PREFIX}.${availability.planCodeStorage.replace(
        '.hour.consumption',
        '.month.consumption',
      )}`,
    );
  }

  // Assign extracted pricing to the flavor
  flavor.pricing.hourly = hourlyPricing;
  flavor.pricing.monthly = monthlyPricing;

  // Handle storage pricing if flavor has storage with step
  if (hasStorage) {
    flavor.storage.pricing = {
      hourly: hourlyStoragePricing,
      monthly: monthlyStoragePricing,
    };
  }
};

export function createTree(
  availabilities: database.Availability[],
  capabilities: FullCapabilities,
  suggestions: database.availability.Suggestion[],
  catalog: order.publicOrder.Catalog,
) {
  const tree = availabilities.reduce<Engine[]>((acc, curr) => {
    const engineSuggestion = suggestions.find((s) => s.engine === curr.engine);
    // Map engine
    const treeEngine = mapEngine(acc, curr, capabilities, engineSuggestion);
    acc.sort((a, b) => a.order - b.order);
    // Map version
    const treeVersion = mapVersion(
      treeEngine,
      curr,
      capabilities,
      engineSuggestion,
    );
    treeEngine.versions.sort((a, b) => a.order - b.order);
    // Map region
    const treeRegion = mapRegion(
      treeVersion,
      curr,
      capabilities,
      engineSuggestion,
    );
    // Map plan
    treeRegion.plans.sort((a, b) => a.order - b.order);
    const treePlan = mapPlan(treeRegion, curr, capabilities, engineSuggestion);
    // // Map plan
    // const treePlan = mapPlan(treeVersion, curr, capabilities, engineSuggestion);
    // treeVersion.plans.sort((a, b) => a.order - b.order);
    // // Map region
    // const treeRegion = mapRegion(
    //   treePlan,
    //   curr,
    //   capabilities,
    //   engineSuggestion,
    // );
    treePlan.flavors.sort((a, b) => a.order - b.order);
    // Map flavor
    const treeFlavor = mapFlavor(
      treePlan,
      curr,
      capabilities,
      engineSuggestion,
    );
    // Set prices
    setPrices(curr, catalog, treeFlavor);
    return acc;
  }, []);
  // sanitize: if default version returned from suggestions by api does not exist,
  // set the last one as default
  tree.forEach((engine) => {
    if (!engine.versions.find((v) => v.name === engine.defaultVersion)) {
      engine.defaultVersion = engine.versions[engine.versions.length - 1].name;
    }
  });
  return tree;
}
