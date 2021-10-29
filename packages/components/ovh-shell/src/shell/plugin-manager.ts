import { IShellPluginMethodCall } from '../common';

export interface IPluginEntry {
  id: string;
  instance: Record<string, CallableFunction>;
  isAvailable: boolean;
}

export default class PluginManager {
  plugins: Record<string, IPluginEntry>;

  constructor() {
    this.plugins = {};
  }

  registerPlugin(
    pluginId: string,
    pluginInstance: Record<string, CallableFunction>,
  ): void {
    if (Object.keys(this.plugins).includes(pluginId)) {
      throw new Error(`Plugin '${pluginId}' is already registered`);
    }
    this.plugins[pluginId] = {
      id: pluginId,
      instance: pluginInstance,
      isAvailable: true,
    };
  }

  invokePluginMethod({
    plugin,
    method,
    args = [],
  }: IShellPluginMethodCall): Promise<unknown> {
    if (!Object.keys(this.plugins).includes(plugin)) {
      throw new Error(`Plugin '${plugin}' is not available`);
    }
    const { instance, isAvailable } = this.plugins[plugin];
    if (!isAvailable) {
      throw new Error(`Plugin '${plugin}' is disabled`);
    }
    const pluginMethod = instance[method];
    if (!pluginMethod) {
      throw new Error(`Method '${method}' not exposed by plugin '${plugin}'`);
    }
    return Promise.resolve(pluginMethod(...args));
  }

  setPluginAvailability(plugin: string, available: boolean): void {
    const pluginEntry = this.plugins[plugin];
    if (!pluginEntry) {
      throw new Error(`Plugin '${plugin}' is not registered`);
    }
    pluginEntry.isAvailable = available;
  }
}
