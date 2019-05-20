import compact from 'lodash/compact';
import each from 'lodash/each';
import filter from 'lodash/filter';
import get from 'lodash/get';
import has from 'lodash/has';
import includes from 'lodash/includes';
import isArray from 'lodash/isArray';
import isString from 'lodash/isString';
import map from 'lodash/map';
import orderBy from 'lodash/orderBy';
import reduce from 'lodash/reduce';
import zipObject from 'lodash/zipObject';

import { SIDEBAR_CONFIG } from './sidebar.constants';
import { ORDER_URLS, SIDEBAR_ORDER_CONFIG } from './order.constants';

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
    SessionService,
    SidebarMenu,
  ) {
    this.$q = $q;
    this.$translate = $translate;
    this.coreConfig = coreConfig;
    this.CucFeatureAvailabilityService = CucFeatureAvailabilityService;
    this.OvhApiService = OvhApiService;
    this.SessionService = SessionService;
    this.SidebarMenu = SidebarMenu;
  }

  $onInit() {
    this.SidebarMenu.setInitializationPromise(
      this.$translate.refresh()
        .then(() => {
          this.buildFirstLevelMenu();
          return this.buildOrderMenu();
        }),
    );
  }

  buildFirstLevelMenu() {
    this.addItems(this.filterRegions(SIDEBAR_CONFIG));
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
          this.filterRegions(SIDEBAR_ORDER_CONFIG),
          (orderItemConfig) => {
            if (!has(orderItemConfig, 'featureTupe')
              || this.CucFeatureAvailabilityService.hasFeature(orderItemConfig.featureTupe, 'sidebarOrder', ovhSubsidiary)
            ) {
              const isExternal = has(orderItemConfig, 'linkId') || has(orderItemConfig, 'linkPart');

              let link = null;
              if (isExternal) {
                link = this.buildUrl(orderItemConfig, ovhSubsidiary);
              }

              if (!isExternal || link) {
                return {
                  id: orderItemConfig.id,
                  title: this.$translate.instant(`server_sidebar_order_item_${orderItemConfig.title}_title`),
                  icon: orderItemConfig.icon,
                  href: link,
                  state: isExternal ? null : orderItemConfig.state,
                  target: isExternal ? '_blank' : 'null,',
                  external: get(orderItemConfig, 'external'),
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

        let link = null;
        if (hasSubItems || has(service, 'link')) {
          link = get(service, 'link');
        }

        const menuItem = this.SidebarMenu.addMenuItem({
          id: service.id,
          name: service.id,
          icon: service.icon,
          title: this.$translate.instant(`server_sidebar_item_${service.id}_title`),
          allowSubItems: hasSubItems,
          allowSearch: hasSubItems,

          state: get(service, 'state'),
          loadOnState: get(service, 'loadOnState'),
          url: link ? null : link,
          target: link ? null : '_self',
        }, parent);

        if (has(service, 'types')) {
          menuItem.onLoad = () => this.loadServices(service.types, menuItem);
        }

        this.addItems(get(service, 'children'), menuItem);
      }
    });
  }

  loadServices(types, parent) {
    const promises = [];
    each(types, (typeDefinition) => {
      promises.push(this.getTypeItems(typeDefinition, get(parent, 'stateParams')));
    });
    return this.$q.all(promises)
      .then((typesServices) => {
        each(typesServices, (typeServices) => {
          const hasSubItems = has(typeServices.type, 'types');
          each(orderBy(typeServices.items, 'displayName'), (service) => {
            const isExternal = !includes(typeServices.type.app, this.universe);

            const menuItem = this.SidebarMenu.addMenuItem({
              title: service.displayName,
              allowSubItems: hasSubItems,
              allowSearch: false,
              state: isExternal ? null : get(typeServices.type, 'state'),
              stateParams: isExternal ? null : zipObject(get(typeServices.type, 'stateParams'), service.stateParams),
              url: isExternal ? service.url : null,
              target: isExternal ? '_self' : null,
              icon: get(typeServices.type, 'icon'),
              loadOnState: get(typeServices.type, 'loadOnState'),
            }, parent);

            if (hasSubItems) {
              menuItem.onLoad = () => this.loadServices(typeServices.type.types, menuItem);
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
