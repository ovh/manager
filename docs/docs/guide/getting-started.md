# Getting started

## Prerequisites

- [Git](https://git-scm.com)
- [Node.js](https://nodejs.org/en/) ^18
- [Yarn](https://yarnpkg.com/lang/en/) >= 1.21.1
- Supported OS: GNU/Linux, macOS and Windows

To install these prerequisites, you can follow the [How To section](/how-to/) of the documentation.

## Install

```sh
# Clone the repository
$ git clone https://github.com/ovh/manager.git

# Go to the project root
$ cd manager

# If you are using nvm
$ nvm use

# Install
$ yarn install
```

## Allow your account to be used to develop on our open-source customer interfaces

In order for you to allow your account to connect to the applications we will describe in the [Applications](/guide/applications.html), you will need to enable the "developer mode" on it.

To do so connect to the customer interface of the region in which your account has been created and go to the "Advanced settings" tab of your account configuration page.
- [EU](https://manager.eu.ovhcloud.com/dedicated/#/useraccount/advanced)
- [CA](https://manager.ca.ovhcloud.com/dedicated/#/useraccount/advanced)
- [US](https://manager.us.ovhcloud.com/dedicated/#/useraccount/advanced)

Once in there please check the box "I want to enable developer mode on this account"

![](/assets/img/enabling-developer-mode.jpg)

Once clicked, the checkbox will look like this.

![](/assets/img/developer-mode-enabled.jpg)

You can now follow the [Applications](/guide/applications.html) section of this documentation to try and boot your dev manager.
You will be able to connect with your customer account to this dev version of the manager.
