import filter from 'lodash/filter';
import find from 'lodash/find';
import groupBy from 'lodash/groupBy';
import has from 'lodash/has';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import uniq from 'lodash/uniq';

import { STORAGE_STANDARD_REGION_PLANCODE } from '../../../projects/project/storages/containers/containers.constants';

export default class RegionsListController {
  /* @ngInject */
  constructor(
    $state,
    $translate,
    PciProject,
    ovhManagerRegionService,
    PciProjectStorageContainersService,
    coreConfig,
  ) {
    this.$state = $state;
    this.$translate = $translate;
    this.PciProject = PciProject;
    this.ovhManagerRegionService = ovhManagerRegionService;
    this.PciProjectStorageContainersService = PciProjectStorageContainersService;
    this.coreConfig = coreConfig;
  }

  $onInit() {
    this.loading = true;
    this.globalRegionsUrl = this.PciProject.getDocumentUrl('GLOBAL_REGIONS');
    this.localZoneUrl = this.PciProject.getDocumentUrl('LOCAL_ZONE');
    this.$translate.refresh().finally(() => {
      this.loading = false;
    });

    this.regionsByContinents = null;
    this.regionsByDeploimentMmode = null;

    this.updateRegions();
  }

  $onChanges(changes) {
    if (has(changes, 'regions')) {
      this.updateRegions();
    }

    if (
      changes.reload?.currentValue === true &&
      changes.reload?.previousValue !== true
    ) {
      this.regionsByContinents = null;
      this.regionsByDeploimentMmode = null;
      this.selectedRegion = null;
      this.macroRegion = null;
      this.updateRegions();
    }
  }

  static sortRegionsOnMicroCode(regions) {
    // macroRegion is 'GRA' and microRegion is 'GRA9', 'GRA11'
    // sort treating microRegion as number
    return regions.sort(
      (
        {
          macroRegion: { code: macroA = '' },
          microRegion: { code: microA = '' },
        },
        {
          macroRegion: { code: macroB = '' },
          microRegion: { code: microB = '' },
        },
      ) => +microA.replace(macroA, '') - +microB.replace(macroB, ''),
    );
  }

  async updateRegions() {
    if (this.deploymentMode) {
      await this.PciProjectStorageContainersService.getProductAvailability(
        this.projectId,
        this.coreConfig.getUser().ovhSubsidiary,
      ).then((productCapabilities) => {
        const productCapability = productCapabilities.plans
          ?.filter((plan) =>
            plan.code?.startsWith(STORAGE_STANDARD_REGION_PLANCODE),
          )
          .filter(
            (plan, index, self) =>
              index === self.findIndex((p) => p.name === plan.name),
          );

        const productRegionsAllowed = productCapability?.flatMap(
          ({ regions }) => regions,
        );

        const regionsAllowedByDeploimentMmode = productRegionsAllowed.filter(
          (item) => item.type === this.deploymentMode,
        );

        this.regionsByDeploimentMmode = regionsAllowedByDeploimentMmode;
      });
    } else {
      this.regionsByDeploimentMmode = this.regions;
    }

    const formattedRegions = map(this.regionsByDeploimentMmode, (region) => {
      return {
        ...this.ovhManagerRegionService.getRegion(region.name),
        name: region.name,
        continentCode: region.continentCode,
        hasEnoughQuota:
          typeof region.hasEnoughQuota === 'function'
            ? region.hasEnoughQuota()
            : true,
        isLocalZone: region.isLocalZone,
      };
    });

    const allContinents = this.$translate.instant(
      'pci_project_regions_list_continent_all',
    );
    this.continents = [
      allContinents,
      ...uniq(map(formattedRegions, 'continent')),
    ];

    this.regionsByContinents = reduce(
      this.continents,
      (result, continent) => {
        let continentRegions;
        if (continent === allContinents) {
          continentRegions = formattedRegions;
        } else {
          continentRegions = filter(formattedRegions, { continent });
        }

        const groupedRegions = groupBy(continentRegions, 'macroRegion.text');
        Object.keys(groupedRegions).forEach((key) => {
          groupedRegions[key] = RegionsListController.sortRegionsOnMicroCode(
            groupedRegions[key],
          );
        });

        return {
          ...result,
          [continent]: groupedRegions,
        };
      },
      {},
    );

    if (this.selectedRegion) {
      this.region = find(
        formattedRegions,
        (region) => region.microRegion.code === this.selectedRegion.name,
      );
      this.macroRegion = this.region?.macroRegion.text;
    }
    this.loadEnd();
  }

  static isRegionDisabled(region) {
    return region.length === 1 && !region[0].hasEnoughQuota;
  }

  onMacroChange(macro, regions) {
    [this.region] = regions;
    this.onRegionChange(this.region);
  }

  onRegionChange(region) {
    this.selectedRegion = find(this.regionsByDeploimentMmode, {
      name: region.microRegion.code,
    });

    if (this.onChange) {
      this.onChange({ region: this.selectedRegion });
    }
  }
}
