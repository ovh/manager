import { isEmpty } from 'lodash-es';
import { LegacyTrackingData, PciProjectModeParams } from './track';
import { debug } from './utils';
import { PCI_PROJECT_MODE_VALUES } from './constants';

export type TrackingDefaults = Partial<LegacyTrackingData>;

export class OvhAtInternetConfig {
  /**
   * Default data to be sent with each hit.
   */
  protected defaults: TrackingDefaults;

  /**
   * Enable or disable tracking.
   */
  protected enabled = true;

  protected region = '';

  /**
   * Check if default data has been set.
   */
  isDefaultSet(): boolean {
    return !isEmpty(this.defaults);
  }

  /**
   * Configure default data to be sent with each tracking data.
   * @param def  Default values to be sent.
   */
  setDefaults(def: TrackingDefaults): TrackingDefaults {
    this.defaults = def;
    debug('tracking set defaults', def);
    return this.defaults;
  }

  /**
   * Retrieve default data to be sent with each tracking data.
   */
  getDefaults(): TrackingDefaults {
    return {
      ...this.defaults,
    };
  }

  setRegion(region: string) {
    this.region = region;
  }

  /**
   * Get the enabled state.
   */
  protected isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Enable or disable tracking.
   * @param state  true to enable tracking, false otherwise.
   */
  protected setEnabled(state: boolean): void {
    this.enabled = state;
    debug(`tracking ${state ? 'enabled' : 'disable'}`);
  }

  protected setPciProjectMode(params: PciProjectModeParams) {
    if (params?.isDiscoveryProject) {
      this.defaults.pciProjectMode = PCI_PROJECT_MODE_VALUES.DISCOVERY;
    } else if (params?.projectId) {
      this.defaults.pciProjectMode = PCI_PROJECT_MODE_VALUES.FULL;
    } else {
      this.defaults.pciProjectMode = PCI_PROJECT_MODE_VALUES.NONE;
    }
  }
}

export default { OvhAtInternetConfig };
