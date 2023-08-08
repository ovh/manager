# sao-ovh-manager-module

> Scaffolding tool for standalone modules.

## Why?

The monorepo houses four (Web, Dedicated, Cloud and Telecom) large [AngularJS](https://angularjs.org/) applications that has been developed as a [Monolithic application](https://en.wikipedia.org/wiki/Monolithic_application).

We introduce this tiny module to easily scaffold a bare minimum structure to be able to modularize parts of the large application.

The goal is to facilitate the reusability of the codebase.


[View a demo](https://ovh.github.io/manager/guide/scripts.html#generate-a-module-or-an-application).

## Related

- [sao-ovh-manager-app](https://github.com/ovh/manager/tree/master/packages/manager/tools/sao-ovh-manager-app) - Scaffolding tool for standalone applications.

## Usage

### 1 - Module creation
Firstly, go to the root directory of the manager `/manager`.
Then to create a module run this command :
```
yarn run generate:module ./packages/manager/modules/{moduleName}
```

*Be careful, the module name should be write in kebab-case*

#### Prompt choices

The above command will prompt some questions

**Common questions :**

| Question | Default | Description |
| --- | --- | --- |
| `what is the name of the new module` | {moduleName} | Enter the angular name for your module (kebab-case / dash-case) |
| `How would you describe the new module` | OVHcloud {PascalCaseModuleName} product | Enter a description for your module |
| `Is APIV2 is used` | No | enter y if your module list an apiv2 resource |

**ApiV2 questions :**
| Question | Default | Description |
|--- | --- | --- |
| `What API base route is used` | /{camelCaseModuleName} | Enter the ApiV2 route which list all the resources needed. *eg : `/iam/resource`* |
| `What property is used as unique identifier` | id |  Enter the name of the property used to retrieve the resource detail. *eg for iam it is the `id` property : `/iam/resource/{id}`* |
| `What property is used as a link to dashboard page` | id | Enter the name of the property you want to be a link to the detail page. *eg for iam it can be `name` |

**ApiV1 questions :**
| Question | Default | Description |
|--- | --- | --- |
| `What API base route is used` | /{camelCaseModuleName} | Enter the API(v1) route which list all the resources needed. *eg : [/domain](https://api.ovh.com/console-preview/?section=%2Fdomain&branch=v1#get-/domain)* |
| `What API model describes an instance of a product` | {camelCaseModuleName}.{camelCaseModuleName} |  Enter the name of the schema used by the resource detail. *eg for domain it is the `domain.Domain` schema : `/domain/{serviceName}`*. If there is no schema for the detail page, the module will give an error |
| `What property is used as unique identifier` | serviceName | Enter the name of the property used to retrieve the resource detail this will also be a link to the detail page. *eg for domain it can be `domain`* |

### 2 - Link module to a uapp

Create an uapp that will use your module :
```
yarn run generate:app ./packages/manager/apps/{appName}
```

*Be careful, it is better for the {appName} to be the same as the {moduleName}. The app name should be write in kebab-case*

#### Prompt choices

| Question | Default | Description |
| --- | --- | --- |
| `What is the name of the new app` | {appName} | Enter the name of your app, it should be the same as your {moduleName} in order to load your module |
| `How would you describe the new app` | OVHcloud {PascalCaseAppName} app | Enter a description for your app |
| `In which region this product will be available` | EU | Choose all the region the app should work in |

### 3 - Test your module

To test your module run 
```
yarn start
```

and choose `manager-{appName}-app` on the application list

## License

[BSD-3-Clause](https://github.com/ovh/manager/tree/master/LICENSE) © OVH SAS
