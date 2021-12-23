import { isEmpty } from 'lodash-es';
import { CountryCode } from '@ovh-ux/manager-config/types/locale';

// eslint-disable-next-line prettier/prettier
type levelKey<Num extends number> = `level${Num}`;
type chapterKey<Num extends number> = `chapter${Num}`;

export interface PageData {
  name: string;
  [key: levelKey<number>]: string; // the project id (required)
  [key: chapterKey<number>]: string; // section id (optional)
  visitorId: number; // identified visitor id (optional)
  customObject: Record<string, unknown>; // custom javascript data (optional)
  customVars: Record<string, unknown>;
}

export interface ClickData extends PageData {
  type: 'action' | 'navigation' | 'download' | 'exit';
}

export interface OrderData extends PageData {
  page: string;
  price: number;
  priceTaxFree: number;
  orderId: number;
  quantity: number;
  status: number;
  countryCode: CountryCode;
  currencyCode: CountryCode;
}

export interface ImpressionData extends PageData {
  campaignId: string;
  creation: string;
  variant: string;
  format: string;
  generalPlacement: string;
  detailedPlacement: string;
  advertiserId: string;
  url: string;
}

export interface ImpressionDataClick extends ImpressionData {
  click: unknown;
}

export interface EventData extends PageData {
  page: string;
  event: Event;
}
export class OvhAtInternetConfig {
  /**
   * Default data to be sent with each hit.
   */
  protected defaults: PageData;

  /**
   * Promise that make sure that defaults are setted after a promise resoltion.
   */
  protected defaultsPromise: Promise<PageData>;

  /**
   * Enable or disable tracking.
   */
  protected enabled = false;

  /**
   * Enable or disable logging tracking in JS console.
   */
  protected debug = false;

  /**
   * Region used to get custom vars.
   */
  protected region = 'EU';

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
  setDefaults(def: PageData): PageData {
    this.defaults = def;
    return this.defaults;
  }

  /**
   * Retrieve default data to be sent with each tracking data.
   */
  getDefaults(): PageData {
    return {
      ...this.defaults,
    };
  }

  /**
   * Configure the defaults promise that needs to be resolved before sending hits (to be sure
   * that defaults are setted).
   * @param promise  A promise that needs to be resolved before sending hits.
   */
  setDefaultsPromise(promise: Promise<PageData>): void {
    this.defaultsPromise = promise.then((defaults: PageData) => {
      return this.setDefaults(defaults);
    });
  }

  /**
   * Retrieve the defaults promise setted by setDefaultsPromise method.
   */
  getDefaultsPromise(): Promise<PageData> {
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
