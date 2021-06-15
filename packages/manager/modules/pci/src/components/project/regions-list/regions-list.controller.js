import filter from 'lodash/filter';
import find from 'lodash/find';
import groupBy from 'lodash/groupBy';
import has from 'lodash/has';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import uniq from 'lodash/uniq';

export default class RegionsListController {
  /* @ngInject */
  constructor($state, $translate, CucRegionService) {
    this.$state = $state;
    this.$translate = $translate;
    this.CucRegionService = CucRegionService;
  }

  $onInit() {
    this.loading = true;
    this.$translate.refresh().finally(() => {
      this.loading = false;
    });

    this.updateRegions();
  }

  $onChanges(changes) {
    if (has(changes, 'regions')) {
      this.updateRegions();
    }
  }

  updateRegions() {
    const formattedRegions = map(this.regions, (region) => ({
      ...this.CucRegionService.getRegion(region.name),
      name: region.name,
      continentCode: region.continentCode,
      hasEnoughQuota: region.hasEnoughQuota(),
    }));

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

        return {
          ...result,
          [continent]: groupBy(continentRegions, 'macroRegion.text'),
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
  }

  static isRegionDisabled(region) {
    return region.length === 1 && !region[0].hasEnoughQuota;
  }

  onMacroChange(macro, regions) {
    if (regions.length === 1) {
      [this.region] = regions;
      this.onRegionChange(this.region);
    }
  }

  onRegionChange(region) {
    this.selectedRegion = find(this.regions, { name: region.microRegion.code });
    if (this.onChange) {
      this.onChange({ region: this.selectedRegion });
    }
  }
}
