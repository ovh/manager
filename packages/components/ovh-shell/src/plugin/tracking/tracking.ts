import OvhAtInternet from '@ovh-ux/ovh-at-internet';
import {
  ClickData,
  OrderData,
  PageData,
  EventData,
  ImpressionData,
  ImpressionDataClick,
} from '@ovh-ux/ovh-at-internet/types/config';

export type TrackingPluginType<T extends TrackingPlugin> = {
  [key in keyof T]?: T[key];
};

export class TrackingPlugin {
  private AtInternetInstance: OvhAtInternet;

  constructor() {
    this.AtInternetInstance = new OvhAtInternet();
    this.AtInternetInstance.init();
  }

  isTagAvailable(): boolean {
    return this.AtInternetInstance.isTagAvailable();
  }

  trackClick(data: ClickData): void {
    this.AtInternetInstance.trackClick(data);
  }

  trackPage(data: PageData): void {
    this.AtInternetInstance.trackPage(data);
  }

  trackOrder(orderData: OrderData): void {
    this.AtInternetInstance.trackOrder(orderData);
  }

  trackEvent(eventData: EventData): void {
    this.AtInternetInstance.trackEvent(eventData);
  }

  trackImpression(impressionData: ImpressionData): void {
    this.AtInternetInstance.trackImpression(impressionData);
  }

  trackClickImpression(impressionData: ImpressionDataClick): void {
    this.AtInternetInstance.trackClickImpression(impressionData);
  }
}
