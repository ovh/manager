import { database } from '@/models/database';
import { Engine } from '@/models/dto/OrderFunnel';

export function createTree(
  availabilities: database.Availability[],
  capabilities: database.Capabilities,
) {
  return availabilities.reduce((acc, curr) => {
    let treeEngine = acc.find((a) => a.name === curr.engine);
    if (!treeEngine) {
      treeEngine = { name: curr.engine, versions: [] };
      acc.push(treeEngine);
    }
    let treeVersion = treeEngine.versions.find((v) => v.name === curr.version);
    if (!treeVersion) {
      treeVersion = {
        name: curr.version,
        plans: [],
        tags: [],
        startDate: new Date(curr.lifecycle.startDate),
        endOfLife: curr.lifecycle.endOfLife
          ? new Date(curr.lifecycle.endOfLife)
          : undefined,
        endOfSale: curr.lifecycle.endOfSale
          ? new Date(curr.lifecycle.endOfSale)
          : undefined,
      };
      const avStartDate = new Date(curr.lifecycle.startDate);
      const avEOL = curr.lifecycle.endOfLife
        ? new Date(curr.lifecycle.endOfLife)
        : undefined;
      const avEOS = curr.lifecycle.endOfSale
        ? new Date(curr.lifecycle.endOfSale)
        : undefined;
      if (avStartDate < treeVersion.startDate) {
        treeVersion.startDate = avStartDate;
      }
      if (avEOL && (!treeVersion.endOfLife || avEOL < treeVersion.endOfLife)) {
        treeVersion.endOfLife = avEOL;
      }
      if (avEOS && (!treeVersion.endOfSale || avEOS < treeVersion.endOfSale)) {
        treeVersion.endOfSale = avEOS;
      }
      const today = new Date();
      const addMonthes = (date: Date, offset: number) =>
        new Date(date.getFullYear(), date.getMonth() + offset, date.getDay());
      const todayMinus3Monthes = addMonthes(today, -3);
      const todayPost3Monthes = addMonthes(today, 3);
      if (todayMinus3Monthes < treeVersion.startDate) {
        treeVersion.tags.push('NEW');
      }
      if (treeVersion.endOfLife && todayPost3Monthes > treeVersion.endOfLife) {
        treeVersion.tags.push('SOON_EOL');
      }
      if (treeVersion.endOfSale && todayPost3Monthes > treeVersion.endOfSale) {
        treeVersion.tags.push('SOON_EOS');
      }
      treeEngine.versions.push(treeVersion);
    }
    let treePlan = treeVersion.plans.find((p) => p.name === curr.plan);
    if (!treePlan) {
      treePlan = {
        name: curr.plan,
        regions: [],
        networks: [curr.specifications.network],
        nodes: {
          minimum: curr.specifications.nodes.minimum,
          maximum: curr.specifications.nodes.maximum,
        },
      };
      treeVersion.plans.push(treePlan);
    }
    const compareStorage = (
      storage1: { unit: string; value: number },
      storage2: { unit: string; value: number },
    ) => {
      if (storage1.unit === storage2.unit)
        return storage1.value - storage2.value;
      if (storage1.unit === 'MB') return -1;
      return 1;
    };

    if (curr.specifications.storage) {
      if (!treePlan.storage) {
        treePlan.storage = {
          minimum: curr.specifications.storage.minimum,
          maximum: curr.specifications.storage.maximum,
        };
      }
      // update values
      if (
        compareStorage(
          curr.specifications.storage.minimum,
          treePlan.storage.minimum,
        ) < 0
      )
        treePlan.storage.minimum = curr.specifications.storage.minimum;
      if (
        compareStorage(
          curr.specifications.storage.minimum,
          treePlan.storage.maximum,
        ) < 0
      )
        treePlan.storage.maximum = curr.specifications.storage.maximum;
    }
    const flavorSpec = capabilities.flavors.find(
      (f) => f.name === curr.specifications.flavor,
    );
    // no CPU in availabilities...
    if (flavorSpec) {
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
      if (flavorSpec.specifications.memory) {
        if (!treePlan.ram) {
          treePlan.ram = {
            minimum: flavorSpec.specifications.memory,
            maximum: flavorSpec.specifications.memory,
          };
        }
        if (
          compareStorage(
            flavorSpec.specifications.memory,
            treePlan.ram.minimum,
          ) < 0
        )
          treePlan.ram.minimum = flavorSpec.specifications.memory;
        if (
          compareStorage(
            flavorSpec.specifications.memory,
            treePlan.ram.maximum,
          ) > 0
        )
          treePlan.ram.maximum = flavorSpec.specifications.memory;
      }
    }
    let treeRegion = treePlan.regions.find((r) => r.name === curr.region);
    if (!treeRegion) {
      treeRegion = { name: curr.region, flavors: [] };
      treePlan.regions.push(treeRegion);
    }
    let treeFlavor = treeRegion.flavors.find((f) => f.name === curr.flavor);
    if (!treeFlavor) {
      treeFlavor = {
        name: curr.flavor,
        storage: curr.specifications.storage,
      };
      treeRegion.flavors.push(treeFlavor);
    }
    return acc;
  }, [] as Engine[]);
}
