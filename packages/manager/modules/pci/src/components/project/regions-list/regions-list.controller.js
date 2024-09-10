import filter from 'lodash/filter';
import find from 'lodash/find';
import groupBy from 'lodash/groupBy';
import has from 'lodash/has';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import uniq from 'lodash/uniq';

export default class RegionsListController {
  /* @ngInject */
  constructor($state, $translate, PciProject, ovhManagerRegionService) {
    this.$state = $state;
    this.$translate = $translate;
    this.PciProject = PciProject;
    this.ovhManagerRegionService = ovhManagerRegionService;
  }

  $onInit() {
    this.loading = true;
    this.globalRegionsUrl = this.PciProject.getDocumentUrl('GLOBAL_REGIONS');
    this.localZoneUrl = this.PciProject.getDocumentUrl('LOCAL_ZONE');
    this.$translate.refresh().finally(() => {
      this.loading = false;
    });

    this.updateRegions();
  }

  $onChanges(changes) {
    if (has(changes, 'regions')) {
      this.updateRegions();
    }

    if (has(changes, 'deploimentMode')) {
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

  updateRegions() {
    let regionsByDeploimentMmode = this.regions;

    if (this.deploimentMode) {
      regionsByDeploimentMmode = this.regions.filter(
        (item) => item.type === this.deploimentMode,
      );
    }

    const formattedRegions = map(regionsByDeploimentMmode, (region) => ({
      ...this.ovhManagerRegionService.getRegion(region.name),
      name: region.name,
      continentCode: region.continentCode,
      hasEnoughQuota: region.hasEnoughQuota(),
      isLocalZone: region.isLocalZone,
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
  }

  static isRegionDisabled(region) {
    return region.length === 1 && !region[0].hasEnoughQuota;
  }

  onMacroChange(macro, regions) {
    [this.region] = regions;
    this.onRegionChange(this.region);
  }

  onRegionChange(region) {
    this.selectedRegion = find(this.regions, { name: region.microRegion.code });
    if (this.onChange) {
      this.onChange({ region: this.selectedRegion });
    }
  }
}
