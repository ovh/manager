/* eslint-disable no-param-reassign */
import { order } from '@/types/catalog';
import * as database from '@/types/cloud/project/database';
import { Engine, Flavor, Plan, Region, Version } from '@/types/orderFunnel';
import { compareStorage } from './bytesHelper';
import { FullCapabilities } from '@/hooks/api/database/capabilities/useGetFullCapabilities.hook';

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
      plans: [],
    };
    treeEngine.versions.push(treeVersion);
  }
  return treeVersion;
};

const mapPlan = (
  treeVersion: Version,
  availability: database.Availability,
  capabilities: FullCapabilities,
  engineSuggestion: database.availability.Suggestion,
) => {
  let treePlan = treeVersion.plans.find((p) => p.name === availability.plan);
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
      regions: [],
    };
    treeVersion.plans.push(treePlan);
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
  treePlan: Plan,
  availability: database.Availability,
  capabilities: FullCapabilities,
  engineSuggestion: database.availability.Suggestion,
) => {
  let treeRegion = treePlan.regions.find((r) => r.name === availability.region);
  if (!treeRegion) {
    const regionCapability = capabilities.regions.find(
      (r) => r.name === availability.region,
    );
    treeRegion = {
      name: availability.region,
      default: engineSuggestion.region === availability.region,
      order: regionCapability.order,
      tags: regionCapability.tags,
      flavors: [],
    };
    treePlan.regions.push(treeRegion);
  }
  return treeRegion;
};

const mapFlavor = (
  treeRegion: Region,
  availability: database.Availability,
  capabilities: FullCapabilities,
  engineSuggestion: database.availability.Suggestion,
) => {
  const flavorSpec = capabilities.flavors.find(
    (f) => f.name === availability.specifications.flavor,
  );
  let treeFlavor = treeRegion.flavors.find(
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
    treeRegion.flavors.push(treeFlavor);
  }
  return treeFlavor;
};

const setPrices = (
  availability: database.Availability,
  catalog: order.publicOrder.Catalog,
  plan: Plan,
  flavor: Flavor,
) => {
  const prefix = `databases.${availability.engine.toLowerCase()}-${
    availability.plan
  }-${availability.specifications.flavor}`;
  [flavor.pricing.hourly] = catalog.addons.find(
    (a) => a.planCode === `${prefix}.hour.consumption`,
  ).pricings;

  [flavor.pricing.monthly] = catalog.addons.find(
    (a) => a.planCode === `${prefix}.month.consumption`,
  ).pricings;

  if (
    !plan.minPricing ||
    plan.minPricing.hourly.price > flavor.pricing.hourly.price
  ) {
    plan.minPricing = {
      hourly: flavor.pricing.hourly,
      monthly: flavor.pricing.monthly,
    };
  }

  if (flavor.storage?.step) {
    const storagePrefix = `databases.${availability.engine.toLowerCase()}-${
      availability.plan
    }`;
    flavor.storage.pricing = {
      hourly: catalog.addons.find(
        (a) =>
          a.planCode ===
          `${storagePrefix}-additionnal-storage-gb.hour.consumption`,
      ).pricings[0],
      monthly: catalog.addons.find(
        (a) =>
          a.planCode ===
          `${storagePrefix}-additionnal-storage-gb.month.consumption`,
      ).pricings[0],
    };
  }
};

export function createTree(
  availabilities: database.Availability[],
  capabilities: FullCapabilities,
  suggestions: database.availability.Suggestion[],
  catalog: order.publicOrder.Catalog,
) {
  return availabilities.reduce((acc, curr) => {
    const engineSuggestion = suggestions.find((s) => s.engine === curr.engine);
    // Map engine
    const treeEngine = mapEngine(acc, curr, capabilities, engineSuggestion);
    // Map version
    const treeVersion = mapVersion(
      treeEngine,
      curr,
      capabilities,
      engineSuggestion,
    );
    // Map plan
    const treePlan = mapPlan(treeVersion, curr, capabilities, engineSuggestion);
    // Map region
    const treeRegion = mapRegion(
      treePlan,
      curr,
      capabilities,
      engineSuggestion,
    );
    // Map flavor
    const treeFlavor = mapFlavor(
      treeRegion,
      curr,
      capabilities,
      engineSuggestion,
    );
    // Set prices
    setPrices(curr, catalog, treePlan, treeFlavor);
    return acc;
  }, [] as Engine[]);
}
