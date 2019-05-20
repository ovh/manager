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
import zipObject from 'lodash/zipObject';

import { MANAGER_URLS } from './constants';
import { SIDEBAR_CONFIG } from './sidebar.constants';
import { ORDER_URLS, SIDEBAR_ORDER_CONFIG } from './order.constants';
import { DEDICATED_SIDEBAR_CONFIG, DEDICATED_ORDER_SIDEBAR_CONFIG } from './dedicated.constants';

// we should avoid require, but JSURL don't provide an es6 export
const { stringify } = require('jsurl');

export default class OvhManagerServerSidebarController {
  /* @ngInject */
  constructor(
    $q,
    $translate,
    coreConfig,
    CucFeatureAvailabilityService,
    OvhApiService,
    OvhApiUniverses,
    SessionService,
    SidebarMenu,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.coreConfig = coreConfig;
    this.CucFeatureAvailabilityService = CucFeatureAvailabilityService;
    this.OvhApiService = OvhApiService;
    this.OvhApiUniverses = OvhApiUniverses;
    this.SessionService = SessionService;
    this.SidebarMenu = SidebarMenu;
  }

  $onInit() {
    this.SidebarMenu.setInitializationPromise(
      this.$translate.refresh()
        .then(() => this.OvhApiUniverses.Aapi().query().$promise)
        .then((universes) => {
          this.SIDEBAR_CONFIG = SIDEBAR_CONFIG;
          this.SIDEBAR_ORDER_CONFIG = SIDEBAR_ORDER_CONFIG;


          if (this.universe === 'DEDICATED' && find(universes, { universe: this.universe.toLowerCase() })) {
            this.SIDEBAR_CONFIG = DEDICATED_SIDEBAR_CONFIG;
            this.SIDEBAR_ORDER_CONFIG = DEDICATED_ORDER_SIDEBAR_CONFIG;
          }

          this.buildFirstLevelMenu();
          return this.buildOrderMenu();
        }),
    );
  }

  buildFirstLevelMenu() {
    this.addItems(this.filterRegions(this.SIDEBAR_CONFIG));
  }

  filterRegions(items) {
    return filter(items, (item) => {
      if (has(item, 'regions')) {
        return includes(item.regions, this.coreConfig.getRegion());
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

  buildOrderMenu() {
    return this.SessionService.getUser()
      .then(({ ovhSubsidiary }) => {
        const actionsMenuOptions = map(
          this.filterRegions(this.SIDEBAR_ORDER_CONFIG),
          (orderItemConfig) => {
            if (!has(orderItemConfig, 'featureTupe')
              || this.CucFeatureAvailabilityService.hasFeature(orderItemConfig.featureTupe, 'sidebarOrder', ovhSubsidiary)
            ) {
              const isExternal = !includes(orderItemConfig.app, this.universe);

              let link = null;
              if ((isExternal || !has(orderItemConfig, 'state'))
                && (has(orderItemConfig, 'linkId') || has(orderItemConfig, 'linkPart'))) {
                link = this.buildUrl(orderItemConfig, ovhSubsidiary);
              }

              if (!isExternal || link) {
                return {
                  id: orderItemConfig.id,
                  title: this.$translate.instant(`server_sidebar_order_item_${orderItemConfig.title}_title`),
                  icon: orderItemConfig.icon,
                  href: link,
                  state: isExternal ? null : orderItemConfig.state,
                  target: isExternal ? '_blank' : null,
                  external: get(orderItemConfig, 'external', false),
                };
              }
            }

            return null;
          },
        );

        return this.SidebarMenu.addActionsMenuOptions(compact(actionsMenuOptions));
      });
  }

  addItems(services, parent = null) {
    each(services, (service) => {
      if (!this.SidebarMenu.getItemById(service.id)) {
        const hasSubItems = has(service, 'types') || has(service, 'children');
        const isExternal = !includes(service.app, this.universe);
        let link = null;
        if (hasSubItems || has(service, 'link')) {
          link = get(service, 'link');
        } else if (has(service, 'stateUrl') && isExternal) {
          link = get(MANAGER_URLS, [this.coreConfig.getRegion(), service.app[0], 'FR']);
          link += service.stateUrl;
        }

        const menuItem = this.SidebarMenu.addMenuItem({
          id: service.id,
          name: service.id,
          icon: service.icon,
          title: this.$translate.instant(`server_sidebar_item_${service.id}_title`),
          allowSubItems: hasSubItems,
          allowSearch: hasSubItems,

          state: isExternal ? null : get(service, 'state'),
          loadOnState: get(service, 'loadOnState'),
          url: link,
          target: link ? '_self' : null,
        }, parent);

        if (has(service, 'types')) {
          menuItem.onLoad = () => this.loadServices(service.types, menuItem);
        }

        this.addItems(get(service, 'children'), menuItem);
      }
    });
  }

  loadServices(types, parent, params = {}) {
    const promises = [];
    each(types, (typeDefinition) => {
      const parentParams = get(parent, 'stateParams', {});
      promises.push(this.getTypeItems(typeDefinition, { ...params, ...parentParams }));
    });
    return this.$q.all(promises)
      .then((typesServices) => {
        each(typesServices, (typeServices) => {
          const hasSubItems = has(typeServices.type, 'types');
          each(orderBy(typeServices.items, 'displayName'), (service) => {
            const isExternal = !includes(typeServices.type.app, this.universe)
              && !isEmpty(service.url);
            let stateParams = null;

            stateParams = zipObject(get(typeServices.type, 'stateParams', []), get(service, 'stateParams', []));
            if (has(typeServices.type, 'stateParamsTransformer') && isFunction(typeServices.type.stateParamsTransformer)) {
              stateParams = typeServices.type.stateParamsTransformer(stateParams);
            }

            const menuItem = this.SidebarMenu.addMenuItem({
              title: service.displayName,
              allowSubItems: hasSubItems && !isExternal,
              allowSearch: false,
              state: isExternal ? null : get(typeServices.type, 'state'),
              stateParams,
              url: isExternal ? service.url : null,
              target: isExternal ? '_self' : null,
              icon: get(typeServices.type, 'icon'),
              loadOnState: get(typeServices.type, 'loadOnState'),
            }, parent);

            if (hasSubItems && !isExternal) {
              menuItem.onLoad = () => this.loadServices(
                typeServices.type.types,
                menuItem,
                stateParams,
              );
            }
          });
        });
      });
  }

  getTypeItems(typeDefinition, params = null) {
    const external = !includes(typeDefinition.app, this.universe);
    const type = reduce(params, (result, value, paramId) => result.replace(`:${paramId}`, value), typeDefinition.path);

    return new this.OvhApiService
      .Aapi()
      .query({
        type,
        external,
      })
      .$promise
      .then(items => ({
        type: typeDefinition,
        items,
      }));
  }
}
