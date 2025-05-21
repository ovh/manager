# codename-generator

> Generate a random codename

[![Downloads](https://badgen.net/npm/dt/@ovh-ux/codename-generator)](https://npmjs.com/package/@ovh-ux/codename-generator) [![Dependencies](https://badgen.net/david/dep/ovh-ux/manager/packages/manager/tools/codename-generator)](https://npmjs.com/package/@ovh-ux/codename-generator?activeTab=dependencies) [![Dev Dependencies](https://badgen.net/david/dev/ovh-ux/manager/packages/manager/tools/codename-generator)](https://npmjs.com/package/@ovh-ux/codename-generator?activeTab=dependencies)

## Installation

```sh
yarn global add @ovh-ux/codename-generator
```

or

```sh
pnpm install @ovh-ux/codename-generator
```

## Usage

### API

```js
const { Codename, Sample } = require('@ovh-ux/codename-generator');

const codename = new Codename(Sample, 'B4cKT0T43FUtUR3');
codename.encode('1985-10-26');
// => Lutetium Leopard
```

or

```js
const { Codename } = require('@ovh-ux/codename-generator');

const mySample = [
  ['A', 'B', 'C'],
  ['X', 'Y', 'Z'],
];
const codename = new Codename(mySample, 'B4cKT0T43FUtUR3');
codename.encode('1985-10-26');
// => B Z
```

#### new Codename(source, seed)

Create a Codename object

* `source`: an array of array containing string
* `seed`: seed used to shuffle source combinations (see [davidbau/seedrandom](https://github.com/davidbau/seedrandom))

#### codename.encode(date)

Return a codename from date

* `date` : string representing a date (exemple : `1985-10-26`)

### CLI

#### Help

```sh
codename-generator--help
Usage: codename-generator [options]

Options:
  -V, --version            output the version number
  -s, --seed <seed>        random seed (default: `RockPaperScissor`)
  -d, --date <date>        date to encode (default: `2018-11-14`)
  -v, --verbose            verbose
  -h, --help               output usage information

```

#### Options

* `-V, --version` : Display version number
* `-s, --seed <seed>` : Random Seed (default to `RockPaperScissor`)
* `-d, --date <date>`: Date (format Y-M-D)
* `-v, --verbose` : Display current message and seed used
* `-h, --help`: Display help

#### Examples

```sh
$ codename-generator
Argon Pug

$ codename-generator -v
📅  date:  2018-11-14
🎲  seed:  RockPaperScissor
Argon Pug

$ codename-generator -v -s RockPaperScissor -d 2018-11-14
📅  date:  2018-11-14
🎲  seed:  RockPaperScissor
Argon Pug

$ codename-generator -v -s myAwes0m3S3eD
📅  date:  2018-11-14
🎲  seed:  myAwes0m3S3eD
Terbium Yellowjacket

$ codename-generator -v -s myAwes0m3S3eD -d 2018-11-13
📅  date:  2018-11-13
🎲  seed:  myAwes0m3S3eD
Calcium Gorilla
```

## Contributing

Always feel free to help out! Whether it's [filing bugs and feature requests](https://github.com/ovh/manager/issues/new) or working on some of the [open issues](https://github.com/ovh/manager/issues), our [contributing guide](https://github.com/ovh/manager/blob/master/CONTRIBUTING.md) will help get you started.

## License

[BSD-3-Clause](LICENSE) © OVH SAS
