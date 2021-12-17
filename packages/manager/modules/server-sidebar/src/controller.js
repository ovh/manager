import kebabCase from 'lodash/kebabCase';
import compact from 'lodash/compact';
import each from 'lodash/each';
import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import has from 'lodash/has';
import includes from 'lodash/includes';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import isFunction from 'lodash/isFunction';
import isString from 'lodash/isString';
import map from 'lodash/map';
import orderBy from 'lodash/orderBy';
import reduce from 'lodash/reduce';
import sumBy from 'lodash/sumBy';
import zipObject from 'lodash/zipObject';

import { SIDEBAR_CONFIG } from './sidebar.constants';
import { ORDER_URLS, SIDEBAR_ORDER_CONFIG } from './order.constants';
import { WEB_SIDEBAR_CONFIG, WEB_ORDER_SIDEBAR_CONFIG } from './web.constants';
import {
  TELECOM_SIDEBAR_CONFIG,
  TELECOM_ORDER_SIDEBAR_CONFIG,
} from './telecom.constants';

// we should avoid require, but JSURL don't provide an es6 export
const { stringify } = require('jsurl');

export default class OvhManagerServerSidebarController {
  /* @ngInject */
  constructor(
    $q,
    $rootScope,
    $translate,
    atInternet,
    coreConfig,
    coreURLBuilder,
    CucFeatureAvailabilityService,
    OvhApiService,
    SessionService,
    SidebarMenu,
    ovhFeatureFlipping,
  ) {
    this.$q = $q;
    this.$rootScope = $rootScope;
    this.$translate = $translate;
    this.atInternet = atInternet;
    this.coreConfig = coreConfig;
    this.coreURLBuilder = coreURLBuilder;
    this.CucFeatureAvailabilityService = CucFeatureAvailabilityService;
    this.OvhApiService = OvhApiService;
    this.SessionService = SessionService;
    this.SidebarMenu = SidebarMenu;
    this.ovhFeatureFlipping = ovhFeatureFlipping;
  }

  $onInit() {
    this.featuresAvailabilities = null;
    this.init();
  }

  getFeaturesList() {
    const getFeatures = (items) => {
      return items.reduce((featuresList, item) => {
        let itemFeatures = [];
        if (item.feature) {
          itemFeatures.push(item.feature);
        }
        if (item.types) {
          itemFeatures = [...itemFeatures, ...getFeatures(item.types)];
        }
        if (item.children) {
          itemFeatures = [...itemFeatures, ...getFeatures(item.children)];
        }
        return [...featuresList, ...itemFeatures];
      }, []);
    };

    return [
      ...new Set([
        ...getFeatures(this.SIDEBAR_CONFIG),
        ...getFeatures(this.SIDEBAR_ORDER_CONFIG),
      ]),
    ];
  }

  init() {
    this.SIDEBAR_CONFIG = SIDEBAR_CONFIG;
    this.SIDEBAR_ORDER_CONFIG = SIDEBAR_ORDER_CONFIG;

    if (this.universe === 'WEB') {
      this.SIDEBAR_CONFIG = WEB_SIDEBAR_CONFIG;
      this.SIDEBAR_ORDER_CONFIG = WEB_ORDER_SIDEBAR_CONFIG;
    } else if (this.universe === 'TELECOM') {
      this.SIDEBAR_CONFIG = TELECOM_SIDEBAR_CONFIG;
      this.SIDEBAR_ORDER_CONFIG = TELECOM_ORDER_SIDEBAR_CONFIG;
    }

    // set initialization promise
    return this.SidebarMenu.setInitializationPromise(
      this.ovhFeatureFlipping
        .checkFeatureAvailability(this.getFeaturesList())
        .then((features) =>
          this.$translate
            .refresh()
            .then(() => {
              return features;
            })
            .finally(() => this.$rootScope.$broadcast('sidebar:loaded')),
        )
        .then((features) => {
          this.featuresAvailabilities = features;
          this.buildFirstLevelMenu();
          return this.buildOrderMenu();
        }),
    );
  }

  buildFirstLevelMenu() {
    this.addItems(this.SIDEBAR_CONFIG);
  }

  isFeatureAvailable(service) {
    if (
      has(service, 'feature') &&
      has(this.featuresAvailabilities.features, service.feature)
    ) {
      return this.featuresAvailabilities.isFeatureAvailable(service.feature);
    }
    if (has(service, 'regions')) {
      return this.coreConfig.isRegion(service.regions);
    }
    return true;
  }

  filterRegions(items) {
    return filter(items, (item) => {
      if (has(item, 'regions')) {
        return this.coreConfig.isRegion(item.regions);
      }
      return true;
    });
  }

  filterFeatures(items) {
    return filter(items, (item) => {
      if (has(item, 'feature')) {
        return this.featuresAvailabilities.isFeatureAvailable(item.feature);
      }
      return true;
    });
  }

  getUrl(urlId, ovhSubsidiary = 'FR') {
    return get(
      ORDER_URLS,
      [this.coreConfig.getRegion(), urlId, ovhSubsidiary],
      ovhSubsidiary !== 'FR' ? this.getUrl(urlId) : '',
    );
  }

  buildUrl(orderItem, ovhSubsidiary) {
    let link = null;
    if (has(orderItem, 'linkId')) {
      link = this.getUrl(orderItem.linkId, ovhSubsidiary);

      if (has(orderItem, 'linkPart')) {
        if (isArray(orderItem.linkPart)) {
          link = `${link}?products=${stringify(orderItem.linkPart)}`;
        }
        if (isString(orderItem.linkPart)) {
          link = `${link}${orderItem.linkPart}`;
        }
      }
    }
    return link;
  }

  buildOrderMenuItems(items, ovhSubsidiary) {
    return map(items, (orderItemConfig) => {
      if (
        !has(orderItemConfig, 'featureType') ||
        this.CucFeatureAvailabilityService.hasFeature(
          orderItemConfig.featureType,
          'sidebarOrder',
          ovhSubsidiary,
        )
      ) {
        const isExternal = !includes(orderItemConfig.app, this.universe);

        let link = null;
        if (
          (isExternal || !has(orderItemConfig, 'state')) &&
          (has(orderItemConfig, 'linkId') || has(orderItemConfig, 'linkPart'))
        ) {
          link = this.buildUrl(orderItemConfig, ovhSubsidiary);
        }

        let subActions = [];
        if (has(orderItemConfig, 'children')) {
          subActions = this.buildOrderMenuItems(
            orderItemConfig.children,
            ovhSubsidiary,
          );
        }

        if (!isExternal || link || subActions.length > 0) {
          return {
            id: orderItemConfig.id,
            title: this.$translate.instant(
              `server_sidebar_order_item_${orderItemConfig.title}_title`,
            ),
            icon: orderItemConfig.icon,
            href: link,
            state: isExternal ? null : orderItemConfig.state,
            target: get(
              orderItemConfig,
              'target',
              isExternal ? '_blank' : null,
            ),
            external: get(orderItemConfig, 'external', false),
            onClick: () => {
              this.atInternet.trackClick({
                type: 'action',
                name: get(orderItemConfig, 'tracker'),
              });
            },
            subActions,
          };
        }
      }

      return null;
    });
  }

  buildOrderMenu() {
    this.SidebarMenu.actionsMenuOptions = [];
    return this.SessionService.getUser().then(
      ({ ovhSubsidiary, isTrusted }) => {
        const actionsMenuOptions = isTrusted
          ? []
          : this.buildOrderMenuItems(
              this.filterFeatures(
                this.filterRegions(this.SIDEBAR_ORDER_CONFIG),
              ),
              ovhSubsidiary,
            );

        return this.SidebarMenu.addActionsMenuOptions(
          compact(actionsMenuOptions),
        );
      },
    );
  }

  addItems(services, parent = null) {
    each(services, (service) => {
      if (!this.isFeatureAvailable(service)) {
        return;
      }
      if (!this.SidebarMenu.getItemById(service.id)) {
        const hasSubItems = has(service, 'types') || has(service, 'children');
        const isExternal = !includes(service.app, this.universe);
        let link = null;
        if (hasSubItems || has(service, 'link')) {
          link = get(service, 'link');
        } else if (has(service, 'stateUrl') && isExternal) {
          link = this.coreURLBuilder.buildURL(
            kebabCase(service.app[0]),
            service.stateUrl,
          );
        }

        const menuItem = this.SidebarMenu.addMenuItem(
          {
            id: service.id,
            name: service.id,
            icon: service.icon,
            title: this.$translate.instant(
              `server_sidebar_item_${service.id}_title`,
            ),
            allowSubItems: hasSubItems,
            allowSearch: hasSubItems,
            forceDisplaySearch:
              hasSubItems && get(service, 'forceDisplaySearch'),
            infiniteScroll: hasSubItems,
            state: isExternal ? null : get(service, 'state'),
            loadOnState: get(service, 'loadOnState'),
            url: link,
            target: link ? '_self' : null,
            click: () => {
              this.atInternet.trackClick({
                type: 'action',
                name: get(service, 'tracker'),
              });
              return this.onClick();
            },
            namespace: service.namespace,
          },
          parent,
        );

        if (has(service, 'types')) {
          menuItem.onLoad = () => this.loadServices(service, menuItem);
        } else {
          this.addItems(get(service, 'children'), menuItem);
        }
      }
    });
  }

  loadServices(parentService, parent, params = {}) {
    const promises = [];

    each(
      this.filterFeatures(this.filterRegions(parentService.types)),
      (typeDefinition) => {
        const parentParams = get(parent, 'stateParams', {});
        promises.push(
          this.getTypeItems(typeDefinition, { ...params, ...parentParams }),
        );
      },
    );

    return this.$q
      .all(promises)
      .then((typesServices) => {
        this.addItems(get(parentService, 'children'), parent);
        if (
          sumBy(typesServices, (typeServices) => typeServices.items.length) ===
            0 &&
          !has(parentService, 'children')
        ) {
          this.SidebarMenu.addMenuItem(
            {
              title: this.$translate.instant('server_sidebar_item_empty_title'),
              allowSubItems: false,
              infiniteScroll: false,
              allowSearch: false,
            },
            parent,
          );
        } else {
          each(typesServices, (typeServices) => {
            let items = get(typeServices, 'items');
            const hasSubItems = has(typeServices.type, 'types');

            if (!isEmpty(typeServices.type.filter)) {
              items = typeServices.type.filter.fn(
                items,
                find(
                  typesServices,
                  (service) =>
                    get(service, 'type.category') ===
                    get(typeServices, 'type.filter.category'),
                ),
              );
            }

            each(orderBy(items, 'displayName'), (service) => {
              const isExternal =
                !includes(typeServices.type.app, this.universe) &&
                !isEmpty(service.url);

              let stateParams = zipObject(
                get(typeServices.type, 'stateParams', []),
                get(service, 'stateParams', []),
              );
              if (
                has(typeServices.type, 'stateParamsTransformer') &&
                isFunction(typeServices.type.stateParamsTransformer)
              ) {
                stateParams = typeServices.type.stateParamsTransformer(
                  stateParams,
                );
              }

              let loadOnStateParams = stateParams;
              if (
                has(typeServices.type, 'loadOnStateParams') &&
                has(typeServices.type, 'loadOnState')
              ) {
                loadOnStateParams = zipObject(
                  get(typeServices.type, 'loadOnStateParams', []),
                  get(service, 'stateParams', []),
                );
              }

              let link = null;
              let state = null;
              if (isExternal) {
                link = service.url;
              } else {
                state = get(typeServices.type, 'state', '');
                if (
                  has(typeServices.type, 'getState') &&
                  isFunction(typeServices.type.getState)
                ) {
                  state = typeServices.type.getState(service.extraParams);
                }
              }

              const prefixTranslationPart = get(typeServices.type, 'prefix');
              let prefix;
              if (prefixTranslationPart) {
                prefix = this.$translate.instant(
                  `server_sidebar_item_${prefixTranslationPart}_prefix`,
                );
              }

              if (
                has(typeServices.type, 'getPrefix') &&
                isFunction(typeServices.type.getPrefix)
              ) {
                prefix = this.$translate.instant(
                  typeServices.type.getPrefix(service.extraParams),
                );
              }

              let icon = get(typeServices.type, 'icon');
              if (
                has(typeServices.type, 'getIcon') &&
                isFunction(typeServices.type.getIcon)
              ) {
                icon = typeServices.type.getIcon(service.extraParams);
              }

              const menuItem = this.SidebarMenu.addMenuItem(
                {
                  id: service.serviceName,
                  title: service.displayName,
                  allowSubItems: hasSubItems && !isExternal,
                  infiniteScroll: hasSubItems && !isExternal,
                  allowSearch: false,
                  state,
                  stateParams,
                  url: link,
                  target: isExternal ? '_self' : null,
                  icon,
                  loadOnState: get(typeServices.type, 'loadOnState'),
                  loadOnStateParams,
                  namespace: typeServices.type.namespace,
                  prefix,
                },
                parent,
              );

              // add serviceName in item searchKeys
              if (has(service, 'serviceName')) {
                menuItem.addSearchKey(service.serviceName);
              }

              // add searchKeys from type definition in item searchKeys
              if (
                has(typeServices.type, 'searchKeys') &&
                isArray(typeServices.type.searchKeys)
              ) {
                each(typeServices.type.searchKeys, (key) =>
                  menuItem.addSearchKey(key),
                );
              }

              if (hasSubItems && !isExternal) {
                menuItem.onLoad = () =>
                  this.loadServices(typeServices.type, menuItem, stateParams);
              }
            });
          });
        }
      })
      .catch(() => {
        this.SidebarMenu.addMenuItem(
          {
            title: this.$translate.instant('server_sidebar_item_empty_title'),
            allowSubItems: false,
            infiniteScroll: false,
            allowSearch: false,
          },
          parent,
        );
      });
  }

  getTypeItems(typeDefinition, params = null) {
    const external = !includes(typeDefinition.app, this.universe);
    const type = reduce(
      params,
      (result, value, paramId) => result.replace(`:${paramId}`, value),
      typeDefinition.path,
    );
    const exclude = get(typeDefinition, 'exclude', null);
    const subType = get(typeDefinition, 'subType', null);

    return new this.OvhApiService.Aapi()
      .query({
        type,
        external,
        exclude,
        subType,
      })
      .$promise.then((items) => ({
        type: typeDefinition,
        items,
      }))
      .catch(() => ({
        type: typeDefinition,
        items: [],
      }));
  }
}
