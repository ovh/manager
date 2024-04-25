import trim from 'lodash/trim';
import { COUNTRIES } from './constants';

export default class ovhManagerRegionService {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
  }

  static getMacroRegion(region) {
    const localZonePattern = /^lz/i;
    let macro;
    if (
      localZonePattern.test(
        region
          .split('-')
          ?.slice(2)
          ?.join('-'),
      )
    ) {
      // The pattern for local zone is <geo_location>-LZ-<datacenter>-<letter>
      // geo_location is EU-WEST, EU-SOUTH, maybe ASIA-WEST in the future
      // datacenter: MAD, BRU
      macro = /[\D]{2,3}/.exec(
        region
          .split('-')
          ?.slice(3)
          ?.join('-'),
      );
    } else {
      macro = /[\D]{2,3}/.exec(region);
    }
    return macro ? macro[0].replace('-', '').toUpperCase() : '';
  }

  getMacroRegionLowercase(region) {
    const macro = this.constructor.getMacroRegion(region);
    return macro ? macro.toLowerCase() : '';
  }

  static getRegionNumber(region) {
    const number = /[\d]+$/.exec(region);
    return number ? number[0] : '';
  }

  getAllTranslatedMacroRegion() {
    return {
      SBG: this.$translate.instant('manager_components_region_SBG'),
      BHS: this.$translate.instant('manager_components_region_BHS'),
      GRA: this.$translate.instant('manager_components_region_GRA'),
      GS: this.$translate.instant('manager_components_region_GS'),
      MAD: this.$translate.instant('manager_components_region_MAD'),
      BRU: this.$translate.instant('manager_components_region_BRU'),
      DAL: this.$translate.instant('manager_components_region_DAL'),
      WAW: this.$translate.instant('manager_components_region_WAW'),
      DE: this.$translate.instant('manager_components_region_DE'),
      UK: this.$translate.instant('manager_components_region_UK'),
      US: this.$translate.instant('manager_components_region_US'),
      SYD: this.$translate.instant('manager_components_region_SYD'),
      VIN: this.$translate.instant('manager_components_region_VIN'),
      HIL: this.$translate.instant('manager_components_region_HIL'),
      SGP: this.$translate.instant('manager_components_region_SGP'),
      YYZ: this.$translate.instant('manager_components_region_YYZ'),
    };
  }

  getTranslatedMacroRegion(region) {
    const translatedMacroRegion = this.$translate.instant(
      `manager_components_region_${this.constructor.getMacroRegion(region)}`,
    );
    return translatedMacroRegion || region;
  }

  getTranslatedMicroRegion(region) {
    const translatedMicroRegion = this.$translate.instant(
      `manager_components_region_${this.constructor.getMacroRegion(
        region,
      )}_micro`,
      {
        micro: region,
      },
    );
    return translatedMicroRegion || region;
  }

  getTranslatedMicroRegionLocation(region) {
    const translatedMicroRegionLocation = this.$translate.instant(
      `manager_components_region_location_${this.constructor.getMacroRegion(
        region,
      )}`,
    );
    return translatedMicroRegionLocation || region;
  }

  static getRegionIconFlag(region) {
    return `oui-flag oui-flag_${ovhManagerRegionService.getCountry(region)}`;
  }

  getTranslatedRegionContinent(region) {
    const translatedRegionContinent = this.$translate.instant(
      `manager_components_region_continent_${this.constructor.getMacroRegion(
        region,
      )}`,
    );
    return translatedRegionContinent || region;
  }

  getRegionCountry(region) {
    const translatedMicroRegionLocation = this.getTranslatedMicroRegionLocation(
      region,
    );
    return trim(translatedMicroRegionLocation.split('(')[1], ')');
  }

  static getCountry(region) {
    const macro = ovhManagerRegionService.getMacroRegion(region);
    return (COUNTRIES[macro] || macro).toLowerCase();
  }

  getRegion(regionParam) {
    const region = regionParam.toUpperCase();
    return {
      macroRegion: {
        code: this.constructor.getMacroRegion(region),
        text: this.getTranslatedMacroRegion(region),
      },
      microRegion: {
        code: region,
        text: this.getTranslatedMicroRegion(region),
      },
      location: this.getTranslatedMicroRegionLocation(region),
      continent: this.getTranslatedRegionContinent(region),
      icon: ovhManagerRegionService.getRegionIconFlag(region),
      country: this.getRegionCountry(region),
    };
  }
}
