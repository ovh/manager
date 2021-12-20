import { isEmpty } from 'lodash-es';

export class OvhAtInternetConfig {
  /**
   * Default data to be sent with each hit.
   */
  private defaults: object = {};

  /**
   * Promise that make sure that defaults are setted after a promise resoltion.
   */
  private defaultsPromise: Promise<object>;

  /**
   * Enable or disable tracking.
   */
  private enabled = false;

  /**
   * Enable or disable logging tracking in JS console.
   */
  private debug = false;

  /**
   * Region used to get custom vars.
   */
  private region = 'EU';

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
  setDefaults(def: object): object {
    this.defaults = def;
    return this.defaults;
  }

  /**
   * Retrieve default data to be sent with each tracking data.
   */
  getDefaults(): object {
    return {
      ...this.defaults,
    };
  }

  /**
   * Configure the defaults promise that needs to be resolved before sending hits (to be sure
   * that defaults are setted).
   * @param promise  A promise that needs to be resolved before sending hits.
   */
  setDefaultsPromise(promise: Promise<object>): void {
    this.defaultsPromise = promise.then((defaults: object) => {
      return this.setDefaults(defaults);
    });
  }

  /**
   * Retrieve the defaults promise setted by setDefaultsPromise method.
   */
  getDefaultsPromise(): Promise<object> {
    return this.defaultsPromise;
  }

  /**
   * Get the enabled state.
   */
  isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Enable or disable tracking.
   * @param state  true to enable tracking, false otherwise.
   */
  setEnabled(state: boolean): void {
    this.enabled = state;
  }

  /**
   * Enable or disable logging of tracking data in the Javascript console.
   * @param state  true to enable console logs, false otherwise.
   */
  setDebug(state: boolean): void {
    this.debug = state;
  }

  /**
   * Get the debug state
   */
  isDebugActive(): boolean {
    return this.debug;
  }

  /**
   * Get the setted region in order to get right default custom vars.
   */
  getRegion(): string {
    return this.region;
  }

  /**
   * Set the region in order to get right default custom vars.
   * @param region  Region where to get custom vars.
   */
  setRegion(region: string): void {
    this.region = region;
  }
}
