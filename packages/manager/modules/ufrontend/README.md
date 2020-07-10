# UFrontend

> Micro frontend framework for OVHcloud applications.

## Installation

```sh
yarn add @ovh-ux/ufrontend
```

## Usage

### Application

```js
import registerApplication from '@ovh-ux/ufrontend/application';

registerApplication().then((config) => {
  // initialization application here
});
```

### Fragment

```js
import registerFragment from '@ovh-ux/ufrontend/application';

registerFragment('myFragmentId').then(({ parent, config }) => {
  // render the fragment on 'parent' element
});
```
