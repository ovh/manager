# ng-ovh-form-flat

> Form Design for v6 manager.

[![npm version](https://badgen.net/npm/v/@ovh-ux/ng-ovh-form-flat)](https://www.npmjs.com/package/@ovh-ux/ng-ovh-form-flat) [![Downloads](https://badgen.net/npm/dt/@ovh-ux/ng-ovh-form-flat)](https://npmjs.com/package/@ovh-ux/ng-ovh-form-flat) [![Dependencies](https://badgen.net/david/dep/ovh/manager/packages/components/ng-ovh-form-flat)](https://npmjs.com/package/@ovh-ux/ng-ovh-form-flat?activeTab=dependencies) [![Dev Dependencies](https://badgen.net/david/dev/ovh/manager/packages/components/ng-ovh-form-flat)](https://npmjs.com/package/@ovh-ux/ng-ovh-form-flat?activeTab=dependencies)

## Install

```sh
$ yarn add @ovh-ux/ng-ovh-form-flat
```

## Usage

```js
import angular from 'angular';
import ngOvhFormFlat from '@ovh-ux/ng-ovh-form-flat';

angular.module('myModule', [ngOvhFormFlat]);
```

## Example

OVH form flat is a overload template for angular-bootstrap.

OVH form flat can design thoses elements:

* Text input
* Textarea
* Select
* Checkbox
* Radio input
* Switch button

---

:warning: **Note** :warning:

* In OVH form flat, labels aren't display until the placeholder is visible.
* `div` tags are optionals. If you use it, you will have a first structure with a label at top, and input below. If you already have a style which position your label where you want, you can keep it and evade adding `div row / col-xx-xx`.

---

Before using specials tags, you have to add a `ovh-form-flat` class on your form:

```html
<form
    name="myFormName"
    data-ng-submit="..."
    class="form-horizontal ovh-form-flat">
    ...
</form>
```

### Text inputs

To create a text input, you have to frame your `input` tag with a `<div data-flat-input-container>`.

```html
<div data-flat-input-container>
    <label
        class="control-label"
        for="myInputId">
        My Input Label Example
    </label>
    <input
        id="myInputId"
        name="myInputName"
        class="form-control"
        placeholder="My Input Label Example">
</div>
```

### Checkboxes

To display a checkbox, wrap your checkbox input with a tag `<flat-checkbox>`.

```html
<flat-checkbox>
    <input
        type="checkbox"
        name="myInputName"
        id="myInputId"
        data-ng-model="myCheckbox">
</flat-checkbox>
```

### Select

To display a custom select, wrap your select with a tag `<flat-select>`.

```html
<select
    name="mySelect"
    class="form-control"
    data-flat-select
    data-ng-model="myModel">
    <option value="opt1">Option 1</option>
    <option value="opt2">Option 2</option>
</select>
```


### Radios

To display a radio, wrap your radio input with a tag `<flat-radio>`.

```html
<flat-radio>
    <input
        type="radio"
        name="myInputName"
        id="myInputId"
        data-ng-model="myCheckbox">
</flat-radio>
```

If you want, you can wrap your `flat-radio` in a label tag, like below:

```html
<label>
    <flat-radio>
        <input
            type="radio"
            name="myInputName"
            id="myInputId"
            data-ng-model="myCheckbox">
    </flat-radio>
    My label
</label>
```

### Textarea

To create a textarea, you have to frame your `textarea` tag with a `<div data-flat-input-container>`.

```html
<div data-flat-input-container>
    <label
        class="control-label"
        for="myInputId">
        My Input Label Example
    </label>
    <textarea
        id="myInputId"
        name="myInputName"
        class="form-control"
        placeholder="My Input Label Example">
    </textarea>
</div>
```

### Combine input & select (example: email)

To combine an input and a select, you have to frame your `input` and `select` tags with a `<div data-flat-input-container>`.

```html
<div class="col-xs-12 input-select">
    <div data-flat-input-container>
        <label class="control-label">Email</label>
        <div class="input-select-container">
            <div class="input-group col-xs-8">
                <input
                    name="accountName"
                    class="form-control"
                    required
                    placeholder="{{ 'account_name' | translate }}">
                 <span class="input-group-addon">@</span>
            </div>
            <div class="col-xs-4 no-margin">
                <select
                    name="accountDomain"
                    class="form-control"
                    required
                    data-flat-select>
                    <option value="@ovh.fr" selected>ovh.fr</option>
                </select>
            </div>
        </div>
    </div>
</div>
```

## Test

```sh
$ yarn test
```

## Contributing

Always feel free to help out! Whether it's [filing bugs and feature requests](https://github.com/ovh/manager/issues/new) or working on some of the [open issues](https://github.com/ovh/manager/issues), our [contributing guide](https://github.com/ovh/manager/blob/master/CONTRIBUTING.md) will help get you started.

## License

[BSD-3-Clause](LICENSE) © OVH SAS
