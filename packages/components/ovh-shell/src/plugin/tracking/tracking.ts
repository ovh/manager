import { Region, User } from '@ovh-ux/manager-config';
import OvhAtInternet from '@ovh-ux/ovh-at-internet';
import { CUSTOM_VARIABLES } from './config.constants';

export type TrackingPluginType<T extends TrackingPlugin> = {
  [key in keyof T]?: T[key];
};

export type RegionsTrackingConfig = {
  [region in Region]: TrackingConfig;
};

export interface TrackingConfig {
  config: {
    level1: string;
    level2: string;
    level3?: string;
    level4?: string;
    level5?: string;
  };
}

const getCookie = (cookieId: string) => {
  const latestCookies = document?.cookie;
  const idCookie = latestCookies
    ?.split(';')
    .find((item) => item.includes(cookieId));

  if (idCookie) {
    return idCookie.split('=')[1];
  }

  return '';
};

export class TrackingPlugin extends OvhAtInternet {
  private config: RegionsTrackingConfig;

  private currentUser: User;

  setConfig(region: string, config: RegionsTrackingConfig): void {
    this.config = config;
    this.configureTracking(region as Region, this.currentUser);
  }

  waitForConfig(retryInterval = 500): Promise<RegionsTrackingConfig> {
    return new Promise((resolve) => {
      const checkConfig = () => {
        if (this.config) {
          resolve(this.config);
        } else {
          setTimeout(checkConfig, retryInterval);
        }
      };
      checkConfig();
    });
  }

  getConfigByRegion(region: Region): TrackingConfig['config'] {
    return {
      ...(this.config[region] && this.config[region].config),
    };
  }

  configureTracking(region: Region, user: User): void {
    this.currentUser = user;
    const referrerSite = getCookie('OrderCloud');
    const data = {
      ...(CUSTOM_VARIABLES as Record<string, unknown>),
      ...(this.config ? this.getConfigByRegion(region) : {}),
      ...(referrerSite ? { referrerSite } : {}),
    };

    const defaultConfig = {
      ...data,
      countryCode: user?.country,
      currencyCode: user?.currency && user?.currency.code,
      visitorId: user?.customerCode,
      legalform: user?.legalform,
      subsidiary: user?.ovhSubsidiary,
      userIsPartener: user?.isPartener,
    };

    this.setDefaults(defaultConfig);
    this.setRegion(region);
  }
}
