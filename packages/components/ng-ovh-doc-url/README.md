# ovh-angular-doc-url

![githubbanner](https://user-images.githubusercontent.com/3379410/27423240-3f944bc4-5731-11e7-87bb-3ff603aff8a7.png)

[![Maintenance](https://img.shields.io/maintenance/yes/2017.svg)]() ![Chat on gitter](https://img.shields.io/gitter/room/ovh/ux.svg)

[![NPM](https://nodei.co/npm/ovh-angular-doc-url.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/ovh-angular-doc-url/)


> Easily create links or get urls to 2api endpoint which redirects to documentation systems (Content manager and docs.ovh.com)


## Examples

### Content Manager
```html
<ovh-doc-url doc-id="g1769.creating_ssh_keys">My link</ovh-doc-url>
```
```javascript
ovhDocUrl.getDocUrl("g1769.creating_ssh_keys")
```

### docs.ovh.com
```html
<ovh-doc-url doc-id="cloud/dedicated/ovh-ssh-key">My link</ovh-doc-url>
```
```javascript
ovhDocUrl.getDocUrl("cloud/dedicated/ovh-ssh-key")
```

## Bower

    bower install ovh-angular-doc-url --save

## NPM

    npm install ovh-angular-doc-url --save

## Get the sources

```bash
    git clone https://github.com/ovh-ux/ovh-angular-doc-url.git
    cd ovh-angular-doc-url
    npm install
    bower install
```

You've developed a new cool feature? Fixed an annoying bug? We'd be happy
to hear from you!

Have a look in [CONTRIBUTING.md](https://github.com/ovh-ux/ovh-angular-doc-url/blob/master/CONTRIBUTING.md)

 Then inject actionsMenu module in your module declaration:
 ```javascript
 angular.module("myModule", [
     ...
     "ovh-angular-doc-url",
     ...
 ]);
 ```

## Getting Started

In your web page:

```html
<script src="angular.js"></script>
<script src="dist/ovh-angular-doc-urls"></script>
```


## User locale configuration
```javascript
.config((TranslateServiceProvider, ovhDocUrlProvider) => {
    ovhDocUrlProvider.setUserLocale(TranslateServiceProvider.getUserLocale());
});
```


## Url prefix for 2api
```javascript
.config((TranslateServiceProvider, ovhDocUrlProvider) => {
    ovhDocUrlProvider.setUrlPrefix("/engine/2api");
});
```

# Related links

 * Contribute: https://github.com/ovh-ux/ovh-angular-doc-url/blob/master/CONTRIBUTING.md
 * Report bugs: https://github.com/ovh-ux/ovh-angular-doc-url/issues
 * Get latest version: https://github.com/ovh-ux/ovh-angular-doc-url

# License

See https://github.com/ovh-ux/ovh-angular-doc-url/blob/master/LICENSE
