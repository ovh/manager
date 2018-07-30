![OVH component](https://user-images.githubusercontent.com/3379410/27423240-3f944bc4-5731-11e7-87bb-3ff603aff8a7.png)

[![NPM](https://nodei.co/npm/ovh-angular-line-diagnostics.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/ovh-angular-line-diagnostics/)

[![Maintenance](https://img.shields.io/maintenance/yes/2018.svg)]() [![Chat on gitter](https://img.shields.io/gitter/room/ovh/ux.svg)](https://gitter.im/ovh/ux) [![Build Status](https://travis-ci.org/ovh-ux/ovh-angular-line-diagnostics.svg)](https://travis-ci.org/ovh-ux/ovh-angular-line-diagnostics) [![Build Status](https://travis-ci.org/ovh/ovh-angular-line-diagnostics.svg)](https://travis-ci.org/ovh-ux/ovh-angular-line-diagnostics)

# ovh-angular-line-diagnostic

> Module to diagnose telecoms lines.

## Dependencies

- [ui.bootstrap](https://angular-ui.github.io/bootstrap)
- [uri.js](https://github.com/nathggns/uri.js)

## Note about URI.js bower dependency

In your main app bower.json file, you will need to override the uri.js main file. Simply add the following lines :

```
...
"overrides": {
    "uri.js": {
        "main": [
            "src/URI.min.js",
            "src/URITemplate.js"
        ]
    }
}
...
```
Because ovh-angular-line-diagnostic uses the expand method of URI.js that is not included into URI.js by default. If it doesn't work, try by adding the overrides section into your grunt-wiredep task.



# Installation

## Bower

    bower install ovh-angular-line-diagnostics --save

## NPM

    npm install ovh-angular-line-diagnostics --save

# Configuration

1. Include `ovh-angular-line-diagnostics.min.js` in your app:

  `<script src="bower_components/ovh-angular-line-diagnostics/dist/ovh-angular-line-diagnostics.min.js"></script>`

2. Add `ovh-angular-line-diagnostics` as a new module dependency in your angular app.

  `var myapp = angular.module("myapp", ["ovh-angular-line-diagnostics"]);`

3. Add in you're HTML.

```html
  <div data-line-diagnostics="{{ lineNumber }}"
         data-line-diagnostics-type="{{ diagnosticType }}"
         data-line-diagnostics-service-name="{{ serviceName }}">
  </div>
```


## Get the sources

```bash
    git clone https://github.com/ovh-ux/ovh-angular-line-diagnostics.git
    cd ovh-angular-line-diagnostics
    npm install
    bower install
```

You've developed a new cool feature ? Fixed an annoying bug ? We'd be happy
to hear from you !

see [CONTRIBUTING](https://github.com/ovh-ux/ovh-angular-line-diagnostic/blob/master/CONTRIBUTING.md)

# Related links

 * Contribute: [https://github.com/ovh-ux/ovh-angular-line-diagnostic/blob/master/CONTRIBUTING.md](https://github.com/ovh-ux/ovh-angular-line-diagnostic/blob/master/CONTRIBUTING.md)
 * Report bugs: [https://github.com/ovh-ux/ovh-angular-line-diagnostic/issues](https://github.com/ovh-ux/ovh-angular-line-diagnostic/issues)
 * Get latest version: [https://github.com/ovh-ux/ovh-angular-line-diagnostic](https://github.com/ovh-ux/ovh-angular-line-diagnostic)

# License

See [https://github.com/ovh-ux/ovh-angular-line-diagnostic/blob/master/LICENSE](https://github.com/ovh-ux/ovh-angular-line-diagnostic/blob/master/LICENSE)
