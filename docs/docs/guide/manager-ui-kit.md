# Manager UI Kit

We use a library of super components in our react applications.

## The package is accessible on the monorepo

- [@ovh-ux/muk](https://github.com/ovh/manager/blob/develop/packages/manager-ui-kit/README.md)

## The storybook :

The storybook is accessible on
<a target="_blank" href="/manager/storybook-static/index.html">here.</a>

## How to start the application?

```sh
$ yarn workspace @ovh-ux/muk run start
```

Go to `<http://localhost:6006>`

## Example for Header on the storybook :

![Screenshot of the manager-ui-kit storybook](/assets/img/storybook-manager-components.png)

## Importation of a component on your react code application :

The component is not builded so you can import directly the component named `Card` from the workspace like this :
`import Card from '@ovh-ux/muk'`
