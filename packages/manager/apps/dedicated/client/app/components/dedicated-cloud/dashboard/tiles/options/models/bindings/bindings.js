import find from 'lodash/find';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import keys from 'lodash/keys';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import some from 'lodash/some';
import values from 'lodash/values';

import OptionsDescriptionsService from '../../descriptions/options-description.service';
import ServicePackOptionService from '../../../../../service-pack/option/option.service';

import { OPTION_TYPES } from '../../../../../service-pack/option/option.constants';
import { ORDER_STATUS } from '../../options.constants';

import {
  DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS,
  DEDICATEDCLOUD_DATACENTER_DRP_STATUS,
  DEDICATEDCLOUD_DATACENTER_DRP_VPN_CONFIGURATION_STATUS,
} from '../../../../../datacenter/zerto/dedicatedCloud-datacenter-zerto.constants';

const moduleName = 'ovhManagerPccDashboardOptionsModelBindings';

class ModelBindings {
  /* @ngInject */
  constructor(
    ovhManagerPccDashboardOptionsDescriptionService,
    ovhManagerPccServicePackOptionService,
  ) {
    this.currentUser = undefined;

    this.options = {
      basic: {
        actionMenu: {
          exists: undefined,
          items: {
            activate: {
              exists: undefined,
              stateParams: {
                activationType: undefined,
                orderableServicePacks: undefined,
                servicePacks: undefined,
              },
            },
            payCheckout: {
              exists: undefined,
              url: undefined,
            },
            switch: {
              exists: undefined,
              stateParams: {
                activationType: undefined,
                orderableServicePacks: undefined,
                servicePacks: undefined,
              },
            },
          },
        },
        description: {
          items: undefined,
        },
      },
      certification: {
        description: {
          exists: undefined,
          name: undefined,
          managementInterfaceUrl: undefined,
          presentationUrl: undefined,
          status: undefined,
        },
        actionMenu: {
          exists: undefined,
          items: {
            activate: {
              exists: undefined,
              stateParams: {
                activationType: undefined,
                orderableServicePacks: undefined,
                servicePacks: undefined,
              },
            },
            configure: {
              exists: undefined,
              stateParams: {
                activationType: undefined,
                orderableServicePacks: undefined,
                servicePacks: undefined,
              },
            },
            payCheckout: {
              exists: undefined,
              url: undefined,
            },
          },
        },
      },
      security: {
        zertoGlobalStatus: {
          value: undefined,
          detail: undefined,
        },
        actionMenu: {
          exists: undefined,
          items: {
            selectDatacenter: {
              exists: undefined,
              action: undefined,
            },
            goToVpnConfiguration: {
              exists: undefined,
              action: undefined,
            },
            deleteZerto: {
              exists: undefined,
              sref: undefined,
            },
          },
        },
      },
    };

    this.ovhManagerPccDashboardOptionsDescriptionService = ovhManagerPccDashboardOptionsDescriptionService;
    this.ovhManagerPccServicePackOptionService = ovhManagerPccServicePackOptionService;
  }

  update(model) {
    this.model = model;
    this.currentUser = model.currentUser;

    this.updateOptionsBasic();
    this.updateOptionsCertification();
    this.updateOptionsSecurity();
  }

  updateOptionsBasic() {
    this.updateOptionsBasicDescriptionItems();
    this.updateOptionsBasicActionMenu();
  }

  updateOptionsBasicDescriptionItems() {
    this.options.basic.description.items = this.computeOptionsBasicDescriptionItems();
    this.options.basic.description.available = reduce(
      this.options.basic.description.items,
      (available, item) => {
        return item.available || available;
      },
      false,
    );
  }

  updateOptionsBasicActionMenu() {
    this.updateOptionsBasicActionMenuItems();
    this.options.basic.actionMenu.exists = this.computeOptionsBasicActionMenuExists();
  }

  updateOptionsBasicActionMenuItems() {
    this.options.basic.actionMenu.items.activate = this.computeOptionsBasicActionMenuItemsActivate();
    this.options.basic.actionMenu.items.switch = this.computeOptionsBasicActionMenuItemsSwitch();
    this.options.basic.actionMenu.items.payCheckout = this.computeOptionsBasicActionMenuItemsPayCheckout();
  }

  updateOptionsCertification() {
    this.options.certification.exists = this.computeOptionsCertificationExists();
    this.updateOptionsCertificationDescription();
    this.updateOptionsCertificationActionMenu();
  }

  updateOptionsCertificationDescription() {
    this.options.certification.description = this.computeOptionsCertificationDescription();
  }

  updateOptionsCertificationActionMenu() {
    this.updateOptionsCertificationActionMenuItems();
    this.options.certification.actionMenu.exists = this.computeOptionsCertificationActionMenuExists();
  }

  updateOptionsCertificationActionMenuItems() {
    this.options.certification.actionMenu.items.activate = this.computeOptionsCertificationActionMenuItemsActivate();
    this.options.certification.actionMenu.items.configure = this.computeOptionsCertificationActionMenuItemsConfigure();
    this.options.certification.actionMenu.items.payCheckout = this.computeOptionsCertificationActionMenuItemsPayCheckout();
  }

  updateOptionsSecurity() {
    this.options.security.zertoGlobalStatus = this.computeOptionsSecurityZertoGlobalStatus();

    this.options.security.actionMenu.exists = this.model.zerto.isZertoActionPossible;
    this.options.security.actionMenu.items.selectDatacenter = this.computeOptionsSecurityActionMenuItemsSelectDatacenter();
    this.options.security.actionMenu.items.goToVpnConfiguration = this.computeOptionsSecurityActionMenuItemsVpnConfiguration();
    this.options.security.actionMenu.items.deleteZerto = this.computeOptionsSecurityActionMenuItemsDeleteZerto();
  }

  computeOptionsBasicDescriptionItems() {
    return map(this.model.options.basic, (option) => {
      const status = this.ovhManagerPccDashboardOptionsDescriptionService.constructor.computeStatus(
        !!this.model.servicePacks.current.basicOptions[option.name],
        this.model.servicePacks.ordered.exists &&
          this.model.servicePacks.ordered.basicOptions[option.name],
        { ...this.model.pendingOrder, needsConfiguration: false },
      );

      return {
        ...option,
        status,
        available: some(this.model.servicePacks.all, (servicePack) => {
          return find(servicePack.options, { name: option.name });
        }),
      };
    });
  }

  computeOptionsBasicActionMenuItemsActivation() {
    return {
      exists:
        this.computeOptionsBasicActionMenuItemsPayCheckout().exists ||
        (!this.model.pendingOrder.exists &&
          !isEmpty(this.model.servicePacks.orderable.withOnlyBasicOptions)),
      stateParams: {
        activationType: OPTION_TYPES.basic,
        orderableServicePacks: this.model.servicePacks.orderable
          .withOnlyBasicOptions,
        servicePacks: this.model.servicePacks.all,
      },
    };
  }

  computeOptionsBasicActionMenuItemsActivate() {
    const base = this.computeOptionsBasicActionMenuItemsActivation();

    return {
      ...base,
      exists:
        base.exists &&
        isEmpty(keys(this.model.servicePacks.current.basicOptions)),
    };
  }

  computeOptionsBasicActionMenuItemsPayCheckout() {
    return {
      exists:
        this.model.pendingOrder.exists &&
        this.model.pendingOrder.status === ORDER_STATUS.notPaid &&
        !this.model.pendingOrder.hasBeenPaid,
      url: this.model.pendingOrder.url,
    };
  }

  computeOptionsBasicActionMenuItemsSwitch() {
    const base = this.computeOptionsBasicActionMenuItemsActivation();

    return {
      ...base,
      exists:
        base.exists &&
        !isEmpty(keys(this.model.servicePacks.current.basicOptions)),
    };
  }

  computeOptionsBasicActionMenuExists() {
    return some(map(values(this.options.basic.actionMenu.items), 'exists'));
  }

  computeOptionsCertificationExists() {
    return (
      !isEmpty(this.model.servicePacks.orderable.withACertification) ||
      this.model.servicePacks.current.certification.exists ||
      (this.model.servicePacks.ordered.exists &&
        this.model.servicePacks.ordered.certification.exists)
    );
  }

  computeOptionsCertificationDescription() {
    const currentlyHasCertification = this.model.servicePacks.current
      .certification.exists;
    const orderedACertification =
      this.model.servicePacks.ordered.exists &&
      this.model.servicePacks.ordered.certification.exists;

    const exists = currentlyHasCertification || orderedACertification;
    const status = this.ovhManagerPccDashboardOptionsDescriptionService.constructor.computeStatus(
      currentlyHasCertification,
      orderedACertification,
      this.model.pendingOrder,
    );

    return {
      exists,
      managementInterfaceUrl:
        currentlyHasCertification &&
        this.model.currentService.certifiedInterfaceUrl,
      name:
        (orderedACertification &&
          this.model.servicePacks.ordered.certification.name) ||
        this.model.servicePacks.current.certification.name,
      presentation: {
        exists: !currentlyHasCertification,
        url: this.ovhManagerPccServicePackOptionService.getPresentationUrl(
          'home',
          this.model.currentUser.ovhSubsidiary,
        ),
      },
      status: exists && status,
    };
  }

  computeOptionsCertificationActionMenuExists() {
    return some(
      map(values(this.options.certification.actionMenu.items), 'exists'),
    );
  }

  computeOptionsCertificationActionMenuItemsActivate() {
    const everytime =
      !this.model.servicePacks.current.certification.exists &&
      !isEmpty(this.model.servicePacks.orderable.withACertification);
    const whenThereIsNoPendingOrder =
      everytime && !this.model.pendingOrder.exists;
    const whenThereIsAPendingOrder =
      everytime &&
      this.model.pendingOrder.exists &&
      this.model.pendingOrder.status === ORDER_STATUS.notPaid &&
      !this.model.pendingOrder.isInError;

    const exists =
      this.computeOptionsCertificationActionMenuItemsPayCheckout().exists ||
      whenThereIsNoPendingOrder ||
      whenThereIsAPendingOrder;

    return {
      exists,
      stateParams: {
        activationType: OPTION_TYPES.certification,
        orderableServicePacks: this.model.servicePacks.orderable
          .withACertification,
        servicePacks: this.model.servicePacks.all,
      },
    };
  }

  computeOptionsCertificationActionMenuItemsConfigure() {
    return {
      exists:
        this.model.servicePacks.ordered.exists &&
        this.model.servicePacks.ordered.mustBeConfigured,
      stateParams: {
        activationType: 'configurationOnly',
      },
    };
  }

  computeOptionsCertificationActionMenuItemsPayCheckout() {
    return {
      exists:
        this.model.pendingOrder.exists &&
        this.model.pendingOrder.status === ORDER_STATUS.notPaid &&
        !this.model.pendingOrder.hasBeenPaid &&
        this.model.servicePacks.ordered.certification.exists,
      url: this.model.pendingOrder.url,
    };
  }

  computeOptionsSecurityZertoGlobalStatus() {
    return {
      value: this.model.zerto.zertoGlobalStatus,
      detail: this.model.zerto.currentZerto.isWaitingVpnConfiguration
        ? `ovhManagerPccDashboardOptions_security_drp_status_vpn_${this.model.zerto.currentZerto.vpnStatus}`
        : `ovhManagerPccDashboardOptions_security_drp_status_${this.model.zerto.currentZerto.state}`,
    };
  }

  computeOptionsSecurityActionMenuItemsSelectDatacenter() {
    return {
      exists:
        this.model.zerto.currentZerto.state ===
        DEDICATEDCLOUD_DATACENTER_DRP_STATUS.disabled,
      action: this.computeOptionsSecurityActionMenuItemsSelectDatacenterAction(),
    };
  }

  computeOptionsSecurityActionMenuItemsSelectDatacenterAction() {
    return () => {
      if (this.model.zerto.datacenterList.length === 1) {
        const [{ id: datacenterId }] = this.model.zerto.datacenterList;
        return this.model.zerto.goToZerto(datacenterId);
      }

      return this.model.zerto.goToZertoDatacenterSelection();
    };
  }

  computeOptionsSecurityActionMenuItemsVpnConfiguration() {
    return {
      exists:
        this.model.zerto.currentZerto.vpnStatus ===
        DEDICATEDCLOUD_DATACENTER_DRP_VPN_CONFIGURATION_STATUS.notConfigured,
      action: this.model.zerto.goToVpnConfiguration,
    };
  }

  computeOptionsSecurityActionMenuItemsDeleteZerto() {
    const zertoStatus = this.model.zerto.currentZerto.state;
    const zertoRemotePccStatus =
      this.model.zerto.currentZerto.drpType ===
      DEDICATEDCLOUD_DATACENTER_DRP_OPTIONS.ovh
        ? this.model.zerto.service.constructor.formatStatus(
            get(this.model.zerto.currentZerto, 'remoteSiteInformation.state'),
          )
        : DEDICATEDCLOUD_DATACENTER_DRP_STATUS.delivered;

    return {
      exists:
        zertoStatus === DEDICATEDCLOUD_DATACENTER_DRP_STATUS.delivered &&
        zertoRemotePccStatus ===
          DEDICATEDCLOUD_DATACENTER_DRP_STATUS.delivered &&
        this.model.zerto.currentZerto.vpnStatus !==
          DEDICATEDCLOUD_DATACENTER_DRP_VPN_CONFIGURATION_STATUS.configuring,
    };
  }
}

angular
  .module(moduleName, [OptionsDescriptionsService, ServicePackOptionService])
  .service('ovhManagerPccDashboardOptionsModelBindings', ModelBindings);

export default moduleName;
