export class ConfigItem {
  label: string;

  apiPath?: string;

  subitems?: ConfigItem[];

  url?: string;

  paramName?: string;

  application?: string;

  constructor({
    label,
    apiPath,
    subitems,
    url,
    paramName,
    application,
  }: {
    label: string;
    apiPath?: string;
    subitems?: ConfigItem[];
    url?: string;
    paramName?: string;
    application: string;
  }) {
    this.label = label;
    this.apiPath = apiPath;
    this.subitems = subitems;
    this.url = url;
    this.paramName = paramName;
    this.application = application;
  }
}

export default {
  ConfigItem,
};
