# Applications

All applications are located in the `packages/manager/apps/*` workspace.

It houses:

- Dashboard <Badge text="New"/>.
- Four large AngularJS monolithic applications (listed below).
- A Sign-up form.
- Several standalone applications.

The monolithic applications can be started for a specific region

| Application                           | Region       |
| ------------------------------------- | ------------ |
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

## Dashboard

![](/manager/assets/img/control-panel.jpg)

### How to start the application?

```sh
$ yarn workspace @ovh-ux/manager-hub-app run start:dev
```

Go to <http://localhost:9000>

### How to build the application?

```sh
$ yarn run build -p @ovh-ux/manager-hub-app
```

## Web Cloud

![](/manager/assets/img/control-panel-web.jpg)

### How to start the application?

```sh
$ yarn workspace @ovh-ux/manager-web run start:dev
```

Go to <http://localhost:9000>

### How to build the application?

```sh
$ yarn run build -p @ovh-ux/manager-web
```

## Bare Metal Cloud

![](/manager/assets/img/control-panel-bare-metal-cloud.jpg)

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

Go to <http://localhost:9000>

### How to build the application?

```sh
$ yarn run build -p @ovh-ux/manager-dedicated
```

## Public Cloud

![](/manager/assets/img/control-panel-public-cloud.jpg)

::: tip Information
Application can be started in different region with a given environment variable.
:::

### How to start the application?

```sh
$ export REGION=EU
$ yarn workspace @ovh-ux/manager-public-cloud run start:dev
```

Go to <http://localhost:9000>

### How to build the application?

```sh
$ yarn run build -p @ovh-ux/manager-public-cloud
```

## Telecom

![](/manager/assets/img/control-panel-telecom.jpg)

### How to start the application?

```sh
$ yarn workspace @ovh-ux/manager-telecom run start:dev
```

Go to <http://localhost:9000>

### How to build the application?

```sh
$ yarn run build -p @ovh-ux/manager-telecom
```

## Related

- [@ovh-ux/sao-ovh-manager-app](https://github.com/ovh/manager/blob/develop/packages/manager/tools/sao-ovh-manager-app/README.md) - Scaffolding tool for standalone applications.

## All applications

<ListPackages type="apps"/>
