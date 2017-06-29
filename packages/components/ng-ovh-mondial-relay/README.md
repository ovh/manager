
# Display a map to select mondial relay

![githubbanner](https://user-images.githubusercontent.com/3379410/27423240-3f944bc4-5731-11e7-87bb-3ff603aff8a7.png)

[![Maintenance](https://img.shields.io/maintenance/yes/2017.svg)]() [![Chat on gitter](https://img.shields.io/gitter/room/ovh/ux.svg)](https://gitter.im/ovh/ux) [![Build Status](https://travis-ci.org/ovh-ux/ovh-angular-mondial-relay.svg)](https://travis-ci.org/ovh-ux/ovh-angular-mondial-relay)

[![NPM](https://nodei.co/npm/ovh-angular-mondial-relay.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/ovh-angular-mondial-relay/)
 
```html
<mondial-relay data-ng-model="myRelay"></mondial-relay>
```
 
# Installation

## Bower

    bower install ovh-angular-mondial-relay --save

## NPM

    npm install ovh-angular-mondial-relay --save
 
 
# Howto's
 
# Configuration

In your `app.js`, inject the module

```javascript
angular.module("myModule", ["ovh-angular-mondial-relay"]);
```

In your `index.html`, inject scripts and styles

```html
    <script src="bower_components/mondial-relay/dist/mondial-relay.min.js"></script>
    <link rel="stylesheet" href="bower_components/mondial-relay/dist/mondial-relay.min.css" />
```

## Translations

Translations are available in xml files in folder https://github.com/ovh-ux/ovh-angular-mondial-relay/blob/master/src/mondial-relay/translations

The more convinent is to convert these files in json and provide partial translation files via `mondialRelayProvider`

## Requests to API
You need 2 services to request API:
* `SupplyMondialRelay` ([https://api.ovh.com/1.0/supply/mondialRelay](https://api.ovh.com/console/#/supply/mondialRelay#POST))
* `User` ([https://api.ovh.com/1.0/me](https://api.ovh.com/console/#/me#GET))

### SupplyMondialRelay

```javascript
angular.module("myApp").service("SupplyMondialRelay", function ($q) {
    return {
        Lexi: function () {
            return {
                search: function (filter) {
                    // perform the request here
                    return $q.when(response);
                }
            }
        }
    }
});
```

where `filter` is a json object containing:
* **address** *{String}* (optional): i.e. : "route de gorrekear"
* **city** *{String}*  (optional if zipcode is specified): i.e. : "le folgoet"
* **country** *{String}* (mendatory): i.e. : "fr"
* **zipcode** *{String}* (optional if city is specified): i.e. : "29260"

where `response` is a json like:
```json
{
  "status": "ok",
  "error": null,
  "result": {
    "referenceAddress": "Route de Gorrekear, 29260 Le Folgoët, France",
    "relayPoints": [
      {
        "country": "fr",
        "distance": 1477,
        "lat": 48.5720143,
        "lng": -4.3266499,
        "name": "VERT ANIS",
        "opening": {
          "sunday": null,
          "wednesday": [
            {
              "start": "0900",
              "end": "1200"
            },
            {
              "start": "1400",
              "end": "1900"
            }
          ]
        },
        "zipcode": "29260",
        "mapUrl": "https://ww2.mondialrelay.com/public/permanent/plan_relais.aspx?ens=BDOVHSAS11&num=043966&pays=FR&crc=79C55FC21A44C73C1D90749C2B510F34",
        "city": "LESNEVEN",
        "pictureUrl": "https://www.mondialrelay.fr/media/51887/encart-suivi-de-colis_899x160.jpg",
        "id": "043966",
        "address": "PLACE DE L EUROPE",
        "closing": null
      },
    ]
  }
}
```

### User

```javascript
angular.module("myApp").service("User", function ($q) {
    return {
        Lexi: function () {
            return {
                get: function (filter) {
                    // perform the request here
                    return $q.when({
                        country: "fr",      // country is mendatory
                        zip: "29260",       // zip or city can be provided
                        city: "Le Folgoët"
                    });
                }
            }
        }
    }
});
```
 
## Get the sources
 
```bash
    git clone https://github.com/ovh-ux/ovh-angular-mondial-relay.git
    cd ovh-angular-mondial-relay
    npm install
    bower install
```
 
You've developed a new cool feature ? Fixed an annoying bug ? We'd be happy
to hear from you !

Have a look in [CONTRIBUTING.md](https://github.com/ovh-ux/ovh-angular-mondial-relay/blob/master/CONTRIBUTING.md)

If you use literal text, you must declare it as a translation, only in the french translation file https://github.com/ovh-ux/ovh-angular-mondial-relay/blob/master/src/mondial-relay/translations/Messages_fr_FR.xml
 
## Run the tests
 
```
npm test
```
 
## Build the documentation
 
```
grunt ngdocs
```
 
# Related links
 
 * Contribute: https://github.com/ovh-ux/ovh-angular-mondial-relay/blob/master/CONTRIBUTING.md
 * Report bugs: https://github.com/ovh-ux/ovh-angular-mondial-relay/issues
 * Get latest version: https://github.com/ovh-ux/ovh-angular-mondial-relay
 
# License
 
See https://github.com/ovh/ovh-angular-mondial-relay/blob/master/LICENSE
