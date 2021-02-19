export interface OutputTargetAngularJS {
  componentCorePackage: string;
  proxiesFile: string;
  excludeComponents?: string[];
  loaderDir?: string;
  applyPolyfills?: boolean;
  defineCustomElements?: boolean;
  wrappedComponentsPrefix?: string;
}
