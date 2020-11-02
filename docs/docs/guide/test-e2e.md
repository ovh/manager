# TestCafé

You can run End-To-End scenarii, using [TestCafé](https://devexpress.github.io/testcafe/).

## Prerequisites

You must have at least one browser (Chrome/Chromium or Firefox) installed.

You can install a standalone version of Chromium: check [`How-to install locally Chromium`](#how-to-install-locally-chromium) below.

## Usage

:::tip Note
Don't forget to export some required variables before launching tests. See `Variables / Secrets` section below.
:::

You can launch TestCafé with:

- `yarn run test:e2e:chromium`: will launch TestCafé with Chrome/Chromium.
- `yarn run test:e2e:chromium:headless`: will launch TestCafé with Headless Chrome/Chromium.
- `yarn run test:e2e:firefox`: will launch TestCafé with Firefox.
- `yarn run test:e2e:firefox:headless`: will launch TestCafé with Headless Firefox.

This will launch all the tests.

You can run specific tests, using the `--fixture-meta` parameter:

```bash
$ yarn run test:e2e:chromium:headless -- --fixture-meta="service=ovh.com-fr-manager,severity=critical,priority=high,type=regression"
```

This command will launch only tests with requested meta parameters.

## Documentation

### Page Model Pattern

This project use the ["Page Model"](https://devexpress.github.io/testcafe/documentation/recipes/extract-reusable-test-code/use-page-model.html) pattern.

You can find them inside the directory: `packages/manager/tools/testcafe`.

### Meta configuration

All fixtures must have at least 5 meta parameters:

- `service`: the service names allowed for these tests. Currently, there are:
  - ca.ovh.com-manager-cloud-repsac
  - ca.ovh.com-manager-dedicated
  - ca.ovh.com-manager-public-cloud
  - ca.ovh.com-manager-sunrise
  - ca.ovh.com-manager
  - ovh.com-manager-cloud-repsac
  - ovh.com-manager-dedicated
  - ovh.com-manager-public-cloud
  - ovh.com-manager-sunrise
  - ovh.com-manager-web
  - ovh.com-manager
  - ovhtelecom.fr-manager
  - us.ovhcloud.com-manager-cloud-repsac
  - us.ovhcloud.com-manager-dedicated
  - us.ovhcloud.com-manager-public-cloud
  - us.ovhcloud.com-manager
- `type`: the test type (regression)
- `priority` is categorized into three types (please read this [guide](https://www.utest.com/articles/severity-priority-in-testing-introduction-differences)):
  - Low
  - Medium
  - High
- `severity` is categorized into five types (please read this [guide](https://www.utest.com/articles/severity-priority-in-testing-introduction-differences)):
  - Critical
  - Major
  - Moderate
  - Minor
  - Cosmetic
- `scope` means the scope of the fixtures (e.g.: "useraccount", ...)

### Variables / Secrets

Store your environment variables in a file called `.env`, like this:

```bash
USER_NIC='oles-ovh'
USER_PASS='supersecret'
```

They will be automatically loaded.

### Dataset file

You can put a JSON file to give in input of the tests. Just create a `input.json` file in the `packages/manager/tools/testcafe/config/` folder.

It'll be automatically loaded and available in config variable `config.dataset`, and usable inside the tests.

## How-tos

### How-to install locally Chromium

You can download the last standalone copy of Chromium for Windows / macOS or GNU/Linux:

```bash
$ cd ~/some/directory

# For Linux:
$ wget "https://download-chromium.appspot.com/dl/Linux_x64?type=snapshots" --no-check-certificate -q -O chrome.zip && unzip chrome.zip
# For macOS:
$ wget "https://download-chromium.appspot.com/dl/Mac?type=snapshots" --no-check-certificate -q -O chrome.zip && unzip chrome.zip
# For Windows:
$ wget "https://download-chromium.appspot.com/dl/Win?type=snapshots" --no-check-certificate -q -O chrome.zip && unzip chrome.zip

# Then, export the path in your .bashrc, for example for macOS:
$ echo 'export CHROME_PATH="~/some/directory/chrome-mac/Chromium.app/Contents/MacOS/Chromium"' >> ~/.bashrc
$ echo $CHROME_PATH
~/some/directory/chrome-mac/Chromium.app/Contents/MacOS/Chromium
```
