import {
  LegacyTrackingData,
  TrackImpressionData,
  TrackClickImpressionData,
  TrackingDefaults,
  PciProjectModeParams,
} from '@ovh-ux/ovh-at-internet';
import ShellClient from '../../client/shell-client';
import { RegionsTrackingConfig } from './tracking';

export interface TrackingAPI {
  init(withConsent: boolean): PromiseLike<void>;
  onConsentModalDisplay(): PromiseLike<void>;
  onUserConsentFromModal(consent: boolean): PromiseLike<void>;
  trackClick(data: LegacyTrackingData): PromiseLike<void>;
  trackPage(data: LegacyTrackingData): PromiseLike<void>;
  trackEvent(data: LegacyTrackingData): PromiseLike<void>;
  trackImpression(data: TrackImpressionData): PromiseLike<void>;
  trackClickImpression(data: TrackClickImpressionData): PromiseLike<void>;
  trackMVTest(data: LegacyTrackingData): PromiseLike<void>;
  setDefaults(def: TrackingDefaults): PromiseLike<TrackingDefaults>;
  setRegion(region: string): PromiseLike<void>;
  setPciProjectMode(params: PciProjectModeParams): PromiseLike<void>;
  setConfig(region: string, config: RegionsTrackingConfig): PromiseLike<void>;
}

export function exposeTrackingAPI(shellClient: ShellClient): TrackingAPI {
  return {
    init: (withConsent: boolean) =>
      shellClient.invokePluginMethod<void>({
        plugin: 'tracking',
        method: 'init',
        args: [withConsent],
      }),
    onConsentModalDisplay: () =>
      shellClient.invokePluginMethod<void>({
        plugin: 'tracking',
        method: 'onConsentModal',
      }),
    onUserConsentFromModal: (consent: boolean) =>
      shellClient.invokePluginMethod<void>({
        plugin: 'tracking',
        method: 'onUserConsentFromModal',
        args: [consent],
      }),
    trackClick: (data: LegacyTrackingData) =>
      shellClient.invokePluginMethod<void>({
        plugin: 'tracking',
        method: 'trackClick',
        args: [data],
      }),
    trackPage: (data: LegacyTrackingData) =>
      shellClient.invokePluginMethod<void>({
        plugin: 'tracking',
        method: 'trackPage',
        args: [data],
      }),
    trackEvent: (data: LegacyTrackingData) =>
      shellClient.invokePluginMethod<void>({
        plugin: 'tracking',
        method: 'trackEvent',
        args: [data],
      }),
    trackImpression: (data: TrackImpressionData) =>
      shellClient.invokePluginMethod<void>({
        plugin: 'tracking',
        method: 'trackImpression',
        args: [data],
      }),
    trackClickImpression: (data: TrackClickImpressionData) =>
      shellClient.invokePluginMethod<void>({
        plugin: 'tracking',
        method: 'trackClickImpression',
        args: [data],
      }),
    trackMVTest: (data: LegacyTrackingData) =>
      shellClient.invokePluginMethod<void>({
        plugin: 'tracking',
        method: 'trackMVTest',
        args: [data],
      }),
    setDefaults: (def: TrackingDefaults) =>
      shellClient.invokePluginMethod<TrackingDefaults>({
        plugin: 'tracking',
        method: 'setDefaults',
        args: [def],
      }),
    setRegion: (region: string) =>
      shellClient.invokePluginMethod<void>({
        plugin: 'tracking',
        method: 'setRegion',
        args: [region],
      }),
    setPciProjectMode: (params: PciProjectModeParams) =>
      shellClient.invokePluginMethod<void>({
        plugin: 'tracking',
        method: 'setPciProjectMode',
        args: [params],
      }),
    setConfig: (region: string, config: RegionsTrackingConfig) =>
      shellClient.invokePluginMethod<void>({
        plugin: 'tracking',
        method: 'setConfig',
        args: [region, config],
      }),
  };
}
