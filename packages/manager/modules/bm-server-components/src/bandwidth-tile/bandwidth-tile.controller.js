export default class BandwidthTileCtrl {
  /* @ngInject */
  constructor(olaConstants, $translate) {
    this.olaConstants = olaConstants;
    this.$translate = $translate;
  }

  $onInit() {
    const { OLA_MODES } = this.olaConstants;
    const currentOlaMode = this.ola.getCurrentMode();
    const nbNICs = this.ola.nbNICs();
    this.olaModeTanslateCode = `dedicated_server_interfaces_bandwidth_server_ola_mode_${currentOlaMode}`;

    const olaBadgeClass = {
      [OLA_MODES.DOUBLE_LAG]: 'oui-badge_success',
      [OLA_MODES.FULL_LAG]: 'oui-badge_success',
      [OLA_MODES.AVAILABLE]: 'oui-badge_info',
      [OLA_MODES.UNAVAILABLE]: 'oui-badge_sold-out',
    }[currentOlaMode];
    const additionalOlaModeBadge =
      olaBadgeClass !== undefined
        ? olaBadgeClass
        : 'oui-badge oui-badge_sold-out';

    this.olaModeBadgeClasses = `d-inline-flex p-1 oui-badge ${additionalOlaModeBadge}`;

    const olaTooltipTranslateCode = {
      [OLA_MODES.DOUBLE_LAG]:
        'dedicated_server_interfaces_bandwidth_server_ola_mode_double_lag_tooltip',
      [OLA_MODES.FULL_LAG]: `dedicated_server_interfaces_bandwidth_server_ola_mode_full_lag_${nbNICs}_tooltip`,
    }[currentOlaMode];

    this.tooltipText =
      olaTooltipTranslateCode !== undefined
        ? this.$translate.instant(olaTooltipTranslateCode)
        : undefined;
  }
}
