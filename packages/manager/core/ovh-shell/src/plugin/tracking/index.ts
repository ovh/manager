import {
  ATInternetTagOptions,
  LegacyTrackingData,
  TrackingDefaults,
} from '@ovh-ux/ovh-at-internet';
import ShellClient from '../../client/shell-client';
import { RegionsTrackingConfig } from './tracking';

export interface TrackingAPI {
  isTagAvailable(): PromiseLike<boolean>;
  clearTrackQueue(): PromiseLike<void>;
  processTrackQueue(): PromiseLike<void>;
  initTag(): PromiseLike<void>;
  getTag(): PromiseLike<ATInternetTagOptions>;
  trackClick(data: LegacyTrackingData): PromiseLike<void>;
  trackPage(data: LegacyTrackingData): PromiseLike<void>;
  trackEvent(data: LegacyTrackingData): PromiseLike<void>;
  trackImpression(data: LegacyTrackingData): PromiseLike<void>;
  trackClickImpression(data: LegacyTrackingData): PromiseLike<void>;
  trackMVTest(data: LegacyTrackingData): PromiseLike<void>;
  isEnabled(): PromiseLike<boolean>;
  setEnabled(state: boolean): PromiseLike<void>;
  setDebug(state: boolean): PromiseLike<void>;
  isDebugActive(): PromiseLike<boolean>;
  getRegion(): PromiseLike<string>;
  setRegion(region: string): PromiseLike<void>;
  setDefaultsPromise(promise: Promise<TrackingDefaults>): PromiseLike<void>;
  getDefaultsPromise(): PromiseLike<Promise<TrackingDefaults>>;
  getDefaults(): PromiseLike<TrackingDefaults>;
  setDefaults(def: TrackingDefaults): PromiseLike<TrackingDefaults>;
  isDefaultSet(): PromiseLike<boolean>;
  setReplacementRules(rules: unknown[]): PromiseLike<void>;
  setPrefix(prefix: string): PromiseLike<void>;
  getPrefix(): PromiseLike<string>;
  setConfig(config: RegionsTrackingConfig): PromiseLike<void>;
}

export function exposeTrackingAPI(shellClient: ShellClient): TrackingAPI {
  return {
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
    trackImpression: (data: LegacyTrackingData) =>
      shellClient.invokePluginMethod<void>({
        plugin: 'tracking',
        method: 'trackImpression',
        args: [data],
      }),
    trackClickImpression: (data: LegacyTrackingData) =>
      shellClient.invokePluginMethod<void>({
        plugin: 'tracking',
        method: 'trackClickImpression',
        args: [data],
      }),
    getDefaults: () =>
      shellClient.invokePluginMethod<TrackingDefaults>({
        plugin: 'tracking',
        method: 'getDefaults',
      }),
    setDefaults: (def: TrackingDefaults) =>
      shellClient.invokePluginMethod<TrackingDefaults>({
        plugin: 'tracking',
        method: 'setDefaults',
        args: [def],
      }),
    isDefaultSet: () =>
      shellClient.invokePluginMethod<boolean>({
        plugin: 'tracking',
        method: 'isDefaultSet',
      }),
    getDefaultsPromise: () =>
      shellClient.invokePluginMethod<Promise<TrackingDefaults>>({
        plugin: 'tracking',
        method: 'getDefaultsPromise',
      }),
    setDefaultsPromise: (promise: Promise<TrackingDefaults>) =>
      shellClient.invokePluginMethod<void>({
        plugin: 'tracking',
        method: 'setDefaultsPromise',
        args: [promise],
      }),
    getRegion: () =>
      shellClient.invokePluginMethod<string>({
        plugin: 'tracking',
        method: 'getRegion',
      }),
    isDebugActive: () =>
      shellClient.invokePluginMethod<boolean>({
        plugin: 'tracking',
        method: 'isDebugActive',
      }),
    isEnabled: () =>
      shellClient.invokePluginMethod<boolean>({
        plugin: 'tracking',
        method: 'isEnabled',
      }),
    setEnabled: (state: boolean) =>
      shellClient.invokePluginMethod<void>({
        plugin: 'tracking',
        method: 'setEnabled',
        args: [state],
      }),
    setDebug: (state: boolean) =>
      shellClient.invokePluginMethod<void>({
        plugin: 'tracking',
        method: 'setDebug',
        args: [state],
      }),
    setRegion: (region: string) =>
      shellClient.invokePluginMethod<void>({
        plugin: 'tracking',
        method: 'setRegion',
        args: [region],
      }),
    setReplacementRules: (rules: unknown[]) =>
      shellClient.invokePluginMethod<void>({
        plugin: 'tracking',
        method: 'setReplacementRules',
        args: [rules],
      }),
    setPrefix: (prefix: string) =>
      shellClient.invokePluginMethod<void>({
        plugin: 'tracking',
        method: 'setPrefix',
        args: [prefix],
      }),
    getPrefix: () =>
      shellClient.invokePluginMethod<string>({
        plugin: 'tracking',
        method: 'getPrefix',
      }),
    setConfig: (config: RegionsTrackingConfig) =>
      shellClient.invokePluginMethod<void>({
        plugin: 'tracking',
        method: 'setConfig',
        args: [config],
      }),
    trackMVTest: (data: LegacyTrackingData) =>
      shellClient.invokePluginMethod<void>({
        plugin: 'tracking',
        method: 'trackMVTest',
        args: [data],
      }),
  };
}
