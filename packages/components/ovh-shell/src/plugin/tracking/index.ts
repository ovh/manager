import { ATInternetTagOptions } from '@ovh-ux/ovh-at-internet/types';
import {
  ClickData,
  EventData,
  ImpressionData,
  ImpressionDataClick,
  OrderData,
  PageData,
} from '@ovh-ux/ovh-at-internet/types/config';
import ShellClient from '../../client/shell-client';

export interface TrackingAPI {
  init(): PromiseLike<void>;
  isTagAvailable(): PromiseLike<boolean>;
  clearTrackQueue(): PromiseLike<void>;
  processTrackQueue(): PromiseLike<void>;
  initTag(): PromiseLike<void>;
  getTag(): PromiseLike<ATInternetTagOptions>;
  trackClick(data: ClickData): PromiseLike<void>;
  trackPage(data: PageData): PromiseLike<void>;
  trackOrder(data: OrderData): PromiseLike<void>;
  trackEvent(data: EventData): PromiseLike<void>;
  trackImpression(data: ImpressionData): PromiseLike<void>;
  trackClickImpression(data: ImpressionDataClick): PromiseLike<void>;
}

export function exposeTrackingAPI(shellClient: ShellClient): TrackingAPI {
  return {
    init: () =>
      shellClient.invokePluginMethod<void>({
        plugin: 'tracking',
        method: 'init',
      }),
    isTagAvailable: () =>
      shellClient.invokePluginMethod<boolean>({
        plugin: 'tracking',
        method: 'isTagAvailable',
      }),
    clearTrackQueue: () =>
      shellClient.invokePluginMethod<void>({
        plugin: 'tracking',
        method: 'clearTrackQueue',
      }),
    processTrackQueue: () =>
      shellClient.invokePluginMethod<void>({
        plugin: 'tracking',
        method: 'processTrackQueue',
      }),
    initTag: () =>
      shellClient.invokePluginMethod<void>({
        plugin: 'tracking',
        method: 'initTag',
      }),
    getTag: () =>
      shellClient.invokePluginMethod<ATInternetTagOptions>({
        plugin: 'tracking',
        method: 'getTag',
      }),
    trackClick: (data: ClickData) =>
      shellClient.invokePluginMethod<void>({
        plugin: 'tracking',
        method: 'trackClick',
        args: [data],
      }),
    trackPage: (data: PageData) =>
      shellClient.invokePluginMethod<void>({
        plugin: 'tracking',
        method: 'trackPage',
        args: [data],
      }),
    trackOrder: (data: OrderData) =>
      shellClient.invokePluginMethod<void>({
        plugin: 'tracking',
        method: 'trackOrder',
        args: [data],
      }),
    trackEvent: (data: EventData) =>
      shellClient.invokePluginMethod<void>({
        plugin: 'tracking',
        method: 'trackEvent',
        args: [data],
      }),
    trackImpression: (data: ImpressionData) =>
      shellClient.invokePluginMethod<void>({
        plugin: 'tracking',
        method: 'trackImpression',
        args: [data],
      }),
    trackClickImpression: (data: ImpressionDataClick) =>
      shellClient.invokePluginMethod<void>({
        plugin: 'tracking',
        method: 'trackClickImpression',
        args: [data],
      }),
  };
}
