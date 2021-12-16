export interface IShellEvent {
  eventId: string;
  data: unknown;
}

export interface IShellPluginMethodCall {
  plugin: string;
  method: string;
  args?: unknown[];
}

export interface IShellPluginInvocation extends IShellPluginMethodCall {
  uid: string;
}

export interface IShellPluginResult {
  uid: string;
  error?: unknown;
  success?: unknown;
}

export interface IShellMessage<T> {
  type: string;
  message: T;
}

export enum ShellMessageType {
  PLUGIN_INVOCATION = 'plugin-invocation',
  PLUGIN_RESULT = 'plugin-result',
  EVENT = 'event',
  SIDEBAR_EVENT = 'ux:sidebar-show',
}
