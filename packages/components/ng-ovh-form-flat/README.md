
# OVH form flat

![OVH component deprecated](https://user-images.githubusercontent.com/3379410/27423263-520b94d8-5731-11e7-996a-f8579e70c33b.png)

![deprecated](https://img.shields.io/badge/status-deprecated-red.svg) [![Build Status](https://travis-ci.org/ovh-ux/ovh-angular-a-disabled.svg)](https://travis-ci.org/ovh-ux/ovh-angular-a-disabled)

[![NPM](https://nodei.co/npm/ovh-angular-form-flat.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/ovh-angular-form-flat/)
 
OVH form flat is a overload template for angular-bootstrap.

OVH form flat can design thoses elements :

* Text input
* Textarea
* Select
* Checkbox
* Radio input
* Switch button
 
# Installation

## Bower

    bower install ovh-angular-form-flat --save

## NPM

    npm install ovh-angular-form-flat --save
 
# Howto's
 
---

**/!\ Note /!\\**

* In OVH form flat, labels aren't display until the placeholder is visible.
* `div` tags are optionals. If you use it, you will have a first structure with a label at top, and input below. If you already have a style which position your label where you want, you can keep it and evade adding `div row / col-xx-xx`.

---

Before using specials tags, you have to add a `ovh-form-flat` class on your form :

```
<form name="myFormName" ng-submit="..." class="form-horizontal ovh-form-flat">
...
</form>
```

Also inject `ovh-angular-form-flat` in your angular application.

```
angular.module("myApp", ["ovh-angular-form-flat"]);
```


## Text inputs

To create a text input, you have to frame your `input` tag with a `<div flat-input-container>`.

```
<div flat-input-container>
    <div class="row">
        <div class="col-xs-12">
            <label class="control-label" for="myInputId">
                My Input Label Example
            </label>
        </div>
    </div>
    <div class="row">
        <div class="col-xs-12">
            <input
                id="myInputId"
                name="myInputName"
                class="form-control"
                placeholder="My Input Label Example"
                >
        </div>
    </div>
</div>
```

## Checkboxes

To display a checkbox, wrap your checkbox input with a tag `<flat-checkbox>`.

```
<div class="row">
    <div class="col-xs-12">
        <flat-checkbox>
            <input
                type="checkbox"
                name="myInputName"
                ng-model="myCheckbox"
                id="myInputId"
            >
        </flat-checkbox>
    </div>
</div>
```

## Select

To display a custom select, wrap your select with a tag `<flat-select>`.

```
<select flat-select name="mySelect" class="form-control" ng-model="myModel">
    <option value="opt1">Option 1</option>
    <option value="opt2">Option 2</option>
</select>
```


## Radios

To display a radio, wrap your radio input with a tag `<flat-radio>`.

```
<div class="row">
    <div class="col-xs-12">
        <flat-radio>
            <input
                type="radio"
                name="myInputName"
                ng-model="myCheckbox"
                id="myInputId"
            >
        </flat-radio>
    </div>
</div>
```

If you want, you can wrap your `flat-radio` in a label tag, like below :

```
<label>
    <flat-radio>
        <input
            type="radio"
            name="myInputName"
            ng-model="myCheckbox"
            id="myInputId"
        >
    </flat-radio>
    My label
</label>
```

## Textarea

To create a textarea, you have to frame your `textarea` tag with a `<div flat-input-container>`.

```
<div flat-input-container>
    <div class="row">
        <div class="col-xs-12">
            <label class="control-label" for="myInputId">
                My Input Label Example
            </label>
        </div>
    </div>
    <div class="row">
        <div class="col-xs-12">
            <textarea
                id="myInputId"
                name="myInputName"
                class="form-control"
                placeholder="My Input Label Example"
                >
            </textarea>
        </div>
    </div>
</div>
```

## Combine input & select (example : email)

To combine an input and a select, you have to frame your `input` and `select` tags with a `<div flat-input-container>`.

```
<div class="col-xs-12 input-select">
    <div flat-input-container>
        <div class="row">
            <div class="col-xs-12">
                <label class="control-label">
                Email
                </label>
            </div>
        </div>
        <div class="row">
            <div class="col-xs-12">
                <div class="input-select-container">
                    <div class="input-group col-xs-8">
                        <input 
                            name="accountName"
                            class="form-control"
                            required
                            placeholder="{{ 'account_name' | translate }}"
                            >
                         <span class="input-group-addon">@</span>    
                    </div>
                    <div class="col-xs-4 no-margin">
                        <select flat-select name="accountDomain" class="form-control" required>
                            <option value="@ovh.fr" selected>ovh.fr</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
```

# Configuration
 
## Get the sources
 
```bash
    git clone https://github.com/ovh-ux/ovh-angular-form-flat.git
    cd ovh-angular-form-flat
    npm install
    bower install
```
 
You've developed a new cool feature ? Fixed an annoying bug ? We'd be happy
to hear from you !

Have a look in [CONTRIBUTING.md](https://github.com/ovh-ux/ovh-angular-form-flat/blob/master/CONTRIBUTING.md)
 
## Run the tests
 
```
npm test
```
 
## Build the documentation
 
```
grunt ngdocs
```
 
# Related links
 
 * Contribute: https://github.com/ovh-ux/ovh-angular-form-flat
 * Report bugs: https://github.com/ovh-ux/ovh-angular-form-flat/issues
 * Get latest version: https://github.com/ovh-ux/ovh-angular-form-flat
 
# License
 
See https://github.com/ovh/ovh-angular-form-flat/blob/master/LICENSE
