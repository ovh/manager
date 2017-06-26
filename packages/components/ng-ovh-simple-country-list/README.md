# OVH simple country list

![githubbanner](https://user-images.githubusercontent.com/3379410/27423240-3f944bc4-5731-11e7-87bb-3ff603aff8a7.png)

[![Maintenance](https://img.shields.io/maintenance/yes/2017.svg)]() [![Chat on gitter](https://img.shields.io/gitter/room/ovh/ux.svg)](https://gitter.im/ovh/ux) [![Build Status](https://travis-ci.org/ovh-ux/ovh-angular-simple-country-list.svg)](https://travis-ci.org/ovh-ux/ovh-angular-simple-country-list)

[![NPM](https://nodei.co/npm/ovh-angular-simple-country-list.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/ovh-angular-simple-country-list/)

OVH simple country list provide a "full" (ISO-3166-1) list of countries with translation possibility.
(translations are not available yet)

## Example

* The list is sorted by the iso contry name and not by the country code.


```javascript
angular.module("app", ["ovh-angular-simple-country-list"]).controller("YourController", function (OvhSimpleCountryList) {
    // set the disired language. Default is iso/en
    OvhSimpleCountryList.setLanguage('en_GB');

    var countryListAsValueLabel = OvhSimpleCountryList.asDataForSelect; //lazy builded property
    // [{'value':'AD', 'label': 'ANDORRA'}, {'value':'AE', 'label': 'UNITED ARAB EMIRATES'}, ... ]

    var countryListAsSimpleArray = OvhSimpleCountryList.asArray; //lazy builded property
    // ['ANDORRA', 'UNITED ARAB EMIRATES', 'AFGHANISTAN', ...]

    var countryListAsSimpleArray = OvhSimpleCountryList.asObject; //lazy builded property
    // {'AD': 'ANDORRA', 'AE': 'UNITED ARAB EMIRATES', ... }
});

```


## Installation

### Bower

    bower install ovh-angular-simple-country-list --save

### NPM

    npm install ovh-angular-simple-country-list --save

### Get the sources

```bash
    git clone https://github.com/ovh-ux/ovh-angular-simple-country-list.git
    cd ovh-angular-simple-country-list
    npm install
    bower install
```

You've developed a new cool feature? Fixed an annoying bug? We'd be happy
to hear from you!


Have a look in [CONTRIBUTING.md](https://github.com/ovh-ux/ovh-angular-simple-country-list/blob/master/CONTRIBUTING.md)

# Related links

 * Contribute: https://github.com/ovh-ux/ovh-angular-simple-country-list
 * Report bugs: https://github.com/ovh-ux/ovh-angular-simple-country-list/issues
 * Get latest version: https://github.com/ovh-ux/ovh-angular-simple-country-list

# License

See https://github.com/ovh-ux/ovh-angular-simple-country-list/blob/master/LICENSE
