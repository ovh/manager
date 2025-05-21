# @ovh-ux/manager-at-internet-configuration

> Common AT Internet configuration library specific to OVHcloud control panels

## Install

```sh
$ pnpm install @ovh-ux/manager-at-internet-configuration
```

## Usage

Before using this component please make sure that ATInternet JS library: smarttag.js is linked in your project.

This component also uses the `async/await` syntax, please make sure your code has the necessary tooling to understand it.

```js
import angular from 'angular';
import ovhManagerAtInternetConfiguration from '@ovh-ux/ng-at-internet';

angular.module('managerApp', [ovhManagerAtInternetConfiguration]);
```

### Provider configuration


#### Specific At Internet configuration

Will set given configuration for the current region

```js
// at-internet.constants.js
export default {
  EU: {
    config: {
      level2: '1',
    },
  },
  CA: {
    config: {
      level2: '1',
    },
  },
  US: {
    config: {
      level2: '1',
    },
  },
};
```

```js
// index.js
import TRACKING from './at-internet.constants';

angular.module('managerApp').config(
  /* @ngInject */ (atInternetConfigurationProvider) => {
    atInternetConfigurationProvider.setConfig(TRACKING);
  },
);
```

#### App prefix 

Will prefix all page tracking with the given prefix 

```js
angular.module('managerApp').config(
  /* @ngInject */ (atInternetConfigurationProvider) => {
    atInternetConfigurationProvider.setPrefix('currentApp');
  },
);
```

#### UI-Router state patterns rewrite

Will replace specific pattern in tracked state

```js
angular.module('managerApp').config(
  /* @ngInject */ (atInternetConfigurationProvider) => {
    atInternetConfigurationProvider.setReplacementRules([
      {
        pattern: /^app/, // pattern to match in tracked states
        replacement: 'nameOfMyApp', // replacement to use
      },
    ]);
  },
);
```
