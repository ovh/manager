# ovh-angular-q-allSettled [Copy of kriskowal/q => allSettled](https://github.com/kriskowal/q/wiki/API-Reference "Documentation") [![Chat on gitter](https://img.shields.io/gitter/room/ovh/ux.svg)](https://gitter.im/ovh/ux)

![OVH components](githubBanner.png)

Returns a promise that is fulfilled with an array of promise state snapshots, but only after all the original promises have settled, i.e. become either fulfilled or rejected.

[![Maintenance](https://img.shields.io/maintenance/yes/2017.svg)]()


This method is often used in its static form on arrays of promises, in order to execute a number of operations concurrently and be notified when they all finish, regardless of success or failure. For example:

## Example

```javascript
angular.module("app", [
  'ovh-angular-q-allSettled',
```

```javascript
    var tinkyWinky = $q.defer(),
        dipsy = $q.defer(),
        laaLaa = $q.defer(),
        po = $q.defer();

    $timeout(function(){
        console.log("ok tinkyWinky");
        tinkyWinky.resolve("tinkyWinky success");
    }, 1000);
    $timeout(function(){
        console.log("error dipsy");
        dipsy.reject("dipsy error");
    }, 2000);
    $timeout(function(){
        console.log("ok laaLaa");
        laaLaa.resolve("laaLaa success");
    }, 3000);
    $timeout(function(){
        console.log("error po");
        po.reject("tutu error");
    }, 4000);

    $q.all([tinkyWinky.promise, dipsy.promise, laaLaa.promise, po.promise]).then(function(){
        console.log("Q ALL DONE");
        console.log(arguments);
    }, function(){
        console.log("Q ONE ERROR BUT ALL NOT DONE");
        console.log(arguments);
    });

    $q.allSettled([tinkyWinky.promise, dipsy.promise, laaLaa.promise, po.promise]).then(function(){
        console.log("ALL DONE");
        console.log(arguments);
    }, function(){
        console.log("ONE OR MORE ERROR");
        console.log(arguments);
    });
```


# Installation

## Bower
    bower install ovh-angular-q-allsettled --save

## NPM

    npm install ovh-angular-q-allsettled --save

## Get the sources

```bash
    git clone https://github.com/ovh-ux/ovh-angular-q-allSettled.git
    cd ovh-angular-q-allSettled
    npm install
    bower install
```

You've developed a new cool feature ? Fixed an annoying bug ? We'd be happy
to hear from you !

Have a look in [CONTRIBUTING.md](https://github.com/ovh-ux/ovh-angular-q-allSettled/blob/master/CONTRIBUTING.md)

## Run the tests

```bash
npm test
```

# Related links

 * Contribute: https://github.com/ovh-ux/ovh-angular-q-allSettled
 * Report bugs: https://github.com/ovh-ux/ovh-angular-q-allSettled/issues
 * Get latest version: https://github.com/ovh-ux/ovh-angular-q-allSettled

# License

See https://github.com/ovh-ux/ovh-angular-q-allSettled/blob/master/LICENSE
