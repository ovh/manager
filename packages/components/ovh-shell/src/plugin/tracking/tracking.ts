import OvhAtInternet from '@ovh-ux/ovh-at-internet';

export type TrackingPluginType<T extends TrackingPlugin> = {
  [key in keyof T]?: T[key];
};

export class TrackingPlugin extends OvhAtInternet {
  constructor() {
    super();
    this.init();
  }
}
