# Manager sidebar configurations

> Configurations for different universes sidebar 

## Installation

```sh
yarn add @ovh-ux/manager-sidebar-config
```

## Usage

```js
import { getConfig } from '@ovh-ux/manager-sidebar-config';

getConfig('universe').then((config) => {
  // Do what's needed with config
});
```

If the configuration is not declared it will return an empty array

## Format 

```js
const config = [
  // An item is defined such as :
  {
    title, // id of the title to fetch translations, translation key will be $universe_$title, it will fallback to title if key is not found
    path, // api path of the given product if this item is a product entry
    url, // relative url for this entry
    paramName, // name of the parameter used to display service dashboard
    application, // name of the application this item belongs to (can differ from the universe)
    subitems, // Array of items that are subentries for this item
  },
];
```
