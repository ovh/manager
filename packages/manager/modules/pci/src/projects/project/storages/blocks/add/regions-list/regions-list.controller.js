import filter from 'lodash/filter';
import find from 'lodash/find';
import groupBy from 'lodash/groupBy';
import has from 'lodash/has';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import uniq from 'lodash/uniq';
import values from 'lodash/values';

export default class RegionsListController {
  /* @ngInject */
  constructor(
    $translate,
    CucRegionService,
  ) {
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
    const formattedRegions = map(
      filter(
        this.regions,
        region => region.hasEnoughQuota(),
      ),
      region => ({
        ...this.CucRegionService.getRegion(region.name),
        name: region.name,
        continentCode: region.continentCode,
      }),
    );

    const allContinents = this.$translate.instant('pci_project_regions_list_continent_all');
    this.continents = [
      allContinents,
      ...uniq(map(formattedRegions, 'continent')),
    ];

    this.regionsByContinents = reduce(this.continents, (result, continent) => {
      let continentRegions;
      if (continent === allContinents) {
        continentRegions = formattedRegions;
      } else {
        continentRegions = filter(formattedRegions, { continent });
      }

      return {
        ...result,
        [continent]: values(groupBy(continentRegions, 'macroRegion.text')),
      };
    }, {});

    if (this.selectedRegion) {
      this.region = find(
        formattedRegions,
        region => region.microRegion.code === this.selectedRegion.name,
      );
    }
  }

  onRegionChange(region) {
    this.selectedRegion = find(this.regions, { name: region.microRegion.code });
    if (this.onChange) {
      this.onChange({ region: this.selectedRegion });
    }
  }
}
