# Applications

All applications are located in the `packages/manager/apps/*` workspace.

It houses:

- Container <Badge text="New"/>.
- Dashboard.
- Large AngularJS applications.
- A Sign-up form.
- Several standalone applications.

The applications can be started for a specific region.

| Application                           | Region       |
| ------------------------------------- | ------------ |
| [Container](#container)               | EU / CA / US |
| [Dashboard](#dashboard)               | EU / CA / US |
| [Web Cloud](#web-cloud)               | EU / CA      |
| [Bare Metal Cloud](#bare-metal-cloud) | EU / CA / US |
| [Public Cloud](#public-cloud)         | EU / CA / US |
| [Telecom](#telecom)                   | EU           |

:::tip Information
Depending on the requested region, the URL to access the API will be different
- <https://api.ovh.com/console/>
- <https://ca.api.ovh.com/console/>
- <https://api.us.ovhcloud.com/console/>
:::

## Container

![Container app screenshot](/assets/img/container.png)

### How to start the application?

The container app contains all common elements to all applications.
Running this command at the root folder, will launch a CLI that will prompt you to choose between launching your app in your container or not.

```sh
$ yarn start
```

After it's finished, the app within the container will be available at `<http://localhost:9000>`

The application can also be run from its own folder with the following command:

```sh
$ yarn start:dev
```

### How to build the application?

```sh
$ yarn run build -p @ovh-ux/manager-container-app
```

## Dashboard

![Screenshot of the control panel](/assets/img/control-panel.jpg)

### How to start the application?

```sh
$ yarn workspace @ovh-ux/manager-hub-app run start:dev
```

Go to `<http://localhost:9000>`

### How to build the application?

```sh
$ yarn run build -p @ovh-ux/manager-hub-app
```

## Web Cloud

![Web cloud screenshot](/assets/img/control-panel-web.jpg)

### How to start the application?

```sh
$ yarn workspace @ovh-ux/manager-web run start:dev
```

Go to `<http://localhost:9000>`

### How to build the application?

```sh
$ yarn run build -p @ovh-ux/manager-web
```

## Bare Metal Cloud

![Bare metal cloud screenshot](/assets/img/control-panel-bare-metal-cloud.jpg)

::: tip Information
Both applications **Bare Metal Cloud** and **Hosted Private Cloud** are grouped under the following location: `packages/manager/apps/dedicated`.
tab.

They can be started in different region with a given environment variable.
:::

### How to start the application?

```sh
$ export REGION=EU
$ yarn workspace @ovh-ux/manager-dedicated run start:dev
```

Go to `<http://localhost:9000>`

### How to build the application?

```sh
$ yarn run build -p @ovh-ux/manager-dedicated
```

## Public Cloud

![Public cloud screenshot](/assets/img/control-panel-public-cloud.jpg)

::: tip Information
Application can be started in different region with a given environment variable.
:::

### How to start the application?

```sh
$ export REGION=EU
$ yarn workspace @ovh-ux/manager-public-cloud run start:dev
```

Go to `<http://localhost:9000>`

### How to build the application?

```sh
$ yarn run build -p @ovh-ux/manager-public-cloud
```

## Telecom

![Telecom screenshot](/assets/img/control-panel-telecom.jpg)

### How to start the application?

```sh
$ yarn workspace @ovh-ux/manager-telecom run start:dev
```

Go to `<http://localhost:9000>`

### How to build the application?

```sh
$ yarn run build -p @ovh-ux/manager-telecom
```

## Related

- [@ovh-ux/manager-generator](https://github.com/ovh/manager/blob/master/packages/manager/core/generator/README.md) - Generate standalone manager applications easily.

## All applications

<ListPackages type="apps"/>

<script setup>
import ListPackages from '../components/ListPackages.vue'
</script>
