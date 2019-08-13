import _ from 'lodash';

import { MENU } from './navbar.constants';

export default class {
  /* @ngInject */
  constructor(
    $q,
    $rootScope,
    $translate,
    OvhApiFreeFax,
    OvhApiOverTheBox,
    TelecomMediator,
    TucPackMediator,
    TucSmsMediator,
    tucTelecomVoip,
    tucVoipService,
    REDIRECT_URLS,
  ) {
    this.$q = $q;
    this.$rootScope = $rootScope;
    this.$translate = $translate;
    this.ovhApiFreeFax = OvhApiFreeFax;
    this.ovhApiOverTheBox = OvhApiOverTheBox;
    this.packMediator = TucPackMediator;
    this.smsMediator = TucSmsMediator;
    this.telecomMediator = TelecomMediator;
    this.tucTelecomVoip = tucTelecomVoip;
    this.tucVoipService = tucVoipService;
    this.REDIRECT_URLS = REDIRECT_URLS;
  }

  getPackGroup(pack) {
    const packGroup = [];
    const addGroup = (group, name, title) => {
      packGroup.push({
        name,
        title,
        subLinks: _.map(group, xdsl => ({
          title: xdsl.description || xdsl.accessName,
          state: 'telecom.pack.xdsl',
          stateParams: {
            packName: pack.packName,
            serviceName: xdsl.accessName,
            number: xdsl.line.number,
          },
        })),
      });
    };

    // Dashboard
    packGroup.push({
      title: this.$translate.instant('telecom_sidebar_informations'),
      state: 'telecom.pack',
      stateParams: {
        packName: pack.packName,
      },
    });

    // xDSL Groups
    ['sdsl', 'adsl', 'vdsl'].forEach((accessType) => {
      const xdslGroup = _.filter(pack.xdsl, { accessType });
      if (xdslGroup.length) {
        addGroup(
          xdslGroup,
          `${pack.packName}.${accessType}`,
          _.capitalize(accessType),
        );
      }
    });

    return packGroup;
  }

  getPackProducts(count) {
    if (count < 0) {
      return this.$q.when(undefined);
    }

    return this.packMediator
      .fetchPacks()
      .then(result => _.map(result, (item) => {
        const itemLink = {
          name: item.packName,
          title: item.description || item.offerDescription || item.packName,
        };

        if (item.xdsl.length) {
          // Get subLinks for submenu
          itemLink.subLinks = this.getPackGroup(item);
        } else {
          // Or create a link
          itemLink.state = 'telecom.pack';
          itemLink.stateParams = {
            packName: item.packName,
          };
        }

        return itemLink;
      }))
      .catch(() => this.$q.when(undefined));
  }

  getTelephonyGroup(telephony) {
    const telephonyGroup = [];
    const addGroup = (group, name, title, state) => {
      telephonyGroup.push({
        name,
        title,
        subLinks: _.map(group, service => ({
          title: service.getDisplayedName(),
          state,
          stateParams: {
            billingAccount: service.billingAccount,
            serviceName: service.serviceName,
          },
        })),
      });
    };

    // Dashboard
    telephonyGroup.push({
      title: this.$translate.instant('telecom_sidebar_dashboard'),
      state: 'telecom.telephony',
      stateParams: {
        billingAccount: telephony.billingAccount,
      },
    });

    // Alias
    const alias = telephony.getAlias();
    const sortedAlias = this.tucVoipService.constructor.sortServicesByDisplayedName(alias);
    if (sortedAlias.length) {
      addGroup(
        sortedAlias,
        `${telephony.billingAccount}.alias`,
        this.$translate.instant('telecom_sidebar_section_telephony_number'),
        'telecom.telephony.alias',
      );
    }

    // Lines
    const lines = telephony.getLines();
    const sortedLines = this.tucVoipService.constructor.sortServicesByDisplayedName(lines);
    if (sortedLines.length) {
      // Lines
      const sortedSipLines = _.filter(sortedLines, line => ['plugAndFax', 'fax', 'voicefax'].indexOf(line.featureType) === -1);
      if (sortedSipLines.length) {
        addGroup(
          sortedSipLines,
          `${telephony.billingAccount}.line`,
          this.$translate.instant('telecom_sidebar_section_telephony_line'),
          'telecom.telephony.line',
        );
      }

      // PlugAndFax
      const sortedPlugAndFaxLines = this.tucVoipService
        .constructor.filterPlugAndFaxServices(sortedLines);
      if (sortedPlugAndFaxLines.length) {
        addGroup(
          sortedPlugAndFaxLines,
          `${telephony.billingAccount}.plugAndFax`,
          this.$translate.instant('telecom_sidebar_section_telephony_plug_fax'),
          'telecom.telephony.line',
        );
      }

      // Fax
      const sortedFaxLines = this.tucVoipService.constructor.filterFaxServices(sortedLines);
      if (sortedFaxLines.length) {
        addGroup(
          sortedFaxLines,
          `${telephony.billingAccount}.fax`,
          this.$translate.instant('telecom_sidebar_section_telephony_fax'),
          'telecom.telephony.fax',
        );
      }
    }

    return telephonyGroup;
  }

  getTelephonyProducts(count) {
    if (count < 0) {
      return this.$q.when(undefined);
    }

    return this.tucTelecomVoip
      .fetchAll()
      .then(result => _.map(result, (item) => {
        const itemLink = {
          name: item.billingAccount,
          title: item.getDisplayedName(),
        };

        if (item.services.length) {
          // Get subLinks for submenu
          itemLink.subLinks = this.getTelephonyGroup(item);
        } else {
          // Or create a link
          itemLink.state = 'telecom.telephony';
          itemLink.stateParams = {
            billingAccount: item.billingAccount,
          };
        }

        return itemLink;
      }))
      .catch(() => this.$q.when(undefined));
  }

  getSmsProducts(count) {
    if (count < 0) {
      return this.$q.when(undefined);
    }

    return this.smsMediator
      .initAll()
      .then(result => _.map(result, item => ({
        name: item.name,
        title: item.description || item.name,
        state: 'sms.service.dashboard',
        stateParams: {
          serviceName: item.name,
        },
      })))
      .catch(() => this.$q.when(undefined));
  }

  getFaxProducts(count) {
    if (count < 0) {
      return this.$q.when(undefined);
    }

    return this.ovhApiFreeFax.v6()
      .query().$promise
      .then(faxList => _.sortBy(faxList, 'number'))
      .then(result => _.map(result, item => ({
        name: item,
        title: item,
        state: 'freefax',
        stateParams: {
          serviceName: item,
        },
      })))
      .catch(() => this.$q.when(undefined));
  }

  getOtbProducts(count) {
    if (count < 0) {
      return this.$q.when(undefined);
    }

    return this.ovhApiOverTheBox.v6()
      .query().$promise
      .then((serviceNames) => {
        const requests = _.map(serviceNames, serviceName => this.ovhApiOverTheBox.v6().get({
          serviceName,
        }).$promise);

        return this.$q.all(requests);
      })
      .then(result => _.map(result, item => ({
        name: item.serviceName,
        title: item.customerDescription || item.serviceName,
        state: 'overTheBox.details',
        stateParams: {
          serviceName: item.serviceName,
        },
      })))
      .catch(() => this.$q.when(undefined));
  }

  getProducts() {
    return this.telecomMediator
      .initServiceCount()
      .then((count) => {
        const sum = _.sum(count);

        // TODO: Remove this ASAP, it's a quickfix to allow user to use the manager >.>
        // We have to lazy-load this part

        if (sum >= 500) {
          this.$rootScope.shouldDisplayMenuButtonFallback = true;
          return this.$q.when({});
        }

        return this.$q.all({
          pack: this.getPackProducts(count.pack),
          telephony: this.getTelephonyProducts(count.telephony),
          sms: this.getSmsProducts(count.sms),
          freefax: this.getFaxProducts(count.freefax),
          overTheBox: this.getOtbProducts(count.overTheBox),
        });
      })
      .catch(() => this.$q.when(undefined));
  }

  getLinks(products) {
    return MENU.map((item) => {
      const element = ({
        ...item,
        title: this.$translate.instant(item.name),
      });

      if (item.urlKey) {
        element.url = _.get(this.REDIRECT_URLS, item.urlKey);
      }

      if (!item.urlKey && !item.state) {
        element.subLinks = products[item.name];
      }

      return element;
    });
  }

  // Get products and build responsive menu
  getResponsiveLinks() {
    return this.getProducts()
      .then(products => this.getLinks(products));
  }
}
