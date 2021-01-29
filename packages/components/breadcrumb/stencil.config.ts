import { Config } from '@stencil/core';
import { angularJSOutputTarget } from "@ovh/stencil-angularjs-output-target";

export const config: Config = {
  namespace: 'breadcrumb',
  taskQueue: 'async',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader'
    },
    {
      type: 'dist-custom-elements-bundle',
    },
    {
      type: 'docs-readme'
    },
    {
      type: 'www',
      serviceWorker: null // disable service workers
    },
    angularJSOutputTarget({
      componentCorePackage: "@ovh-ux/manager-breadcrumb",
      proxiesFile: "../ng-breadcrumb/src/breadcrumb.js",
      excludeComponents: [],
      applyPolyfills: true,
      defineCustomElements: true,
      wrappedComponentsPrefix: "ovh",
    }),
  ]
};
