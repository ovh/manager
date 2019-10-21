import isEmpty from 'lodash/isEmpty';
import keys from 'lodash/keys';
import map from 'lodash/map';
import some from 'lodash/some';
import values from 'lodash/values';

import OptionsDescriptionsService from '../../descriptions/options-description.service';
import { ServicePackOptionService } from '../../../../../service-pack/option/option.service';

import { ACTIVATION_STATUS } from '../../components/activation-status/activation-status.constants';
import { OPTION_TYPES } from '../../../../../service-pack/option/option.constants';
import { ORDER_STATUS } from '../../options.constants';

export default class {
  constructor() {
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
    };
  }

  update(model) {
    this.model = model;
    this.currentUser = model.currentUser;

    this.updateOptionsBasic();
    this.updateOptionsCertification();
  }

  updateOptionsBasic() {
    this.updateOptionsBasicDescriptionItems();
    this.updateOptionsBasicActionMenu();
  }

  updateOptionsBasicDescriptionItems() {
    this.options.basic.description.items = this
      .computeOptionsBasicDescriptionItems();
  }

  updateOptionsBasicActionMenu() {
    this.updateOptionsBasicActionMenuItems();
    this.options.basic.actionMenu.exists = this
      .computeOptionsBasicActionMenuExists();
  }

  updateOptionsBasicActionMenuItems() {
    this.options.basic.actionMenu.items.activate = this
      .computeOptionsBasicActionMenuItemsActivate();
    this.options.basic.actionMenu.items.switch = this
      .computeOptionsBasicActionMenuItemsSwitch();
    this.options.basic.actionMenu.items.payCheckout = this
      .computeOptionsBasicActionMenuItemsPayCheckout();
  }

  updateOptionsCertification() {
    this.options.certification.exists = this
      .computeOptionsCertificationExists();
    this.updateOptionsCertificationDescription();
    this.updateOptionsCertificationActionMenu();
  }

  updateOptionsCertificationDescription() {
    this.options.certification.description = this
      .computeOptionsCertificationDescription();
  }

  updateOptionsCertificationActionMenu() {
    this.updateOptionsCertificationActionMenuItems();
    this.options.certification.actionMenu.exists = this
      .computeOptionsCertificationActionMenuExists();
  }

  updateOptionsCertificationActionMenuItems() {
    this.options.certification.actionMenu.items.activate = this
      .computeOptionsCertificationActionMenuItemsActivate();
    this.options.certification.actionMenu.items.configure = this
      .computeOptionsCertificationActionMenuItemsConfigure();
    this.options.certification.actionMenu.items.payCheckout = this
      .computeOptionsCertificationActionMenuItemsPayCheckout();
  }

  computeOptionsBasicDescriptionItems() {
    return map(
      this.model.options.basic,
      (option) => {
        const status = OptionsDescriptionsService
          .computeStatus(
            !!this.model.servicePacks.current.basicOptions[option.name],
            this.model.servicePacks.ordered.exists
            && this.model.servicePacks.ordered.basicOptions[option.name],
            { ...this.model.pendingOrder, needsConfiguration: false },
          );

        return {
          ...option,
          presentationUrl: status === ACTIVATION_STATUS.disabled
            && ServicePackOptionService.getPresentationUrl(option.name, this.model.currentUser),
          status,
        };
      },
    );
  }

  computeOptionsBasicActionMenuItemsActivation() {
    return {
      exists: this.computeOptionsBasicActionMenuItemsPayCheckout().exists
        || (
          !this.model.pendingOrder.exists
          && !isEmpty(this.model.servicePacks.orderable.withOnlyBasicOptions)
        ),
      stateParams: {
        activationType: OPTION_TYPES.basic,
        orderableServicePacks: this.model.servicePacks.orderable.withOnlyBasicOptions,
        servicePacks: this.model.servicePacks.all,
      },
    };
  }

  computeOptionsBasicActionMenuItemsActivate() {
    const base = this.computeOptionsBasicActionMenuItemsActivation();

    return {
      ...base,
      exists: base.exists
        && isEmpty(
          keys(this.model.servicePacks.current.basicOptions),
        ),
    };
  }

  computeOptionsBasicActionMenuItemsPayCheckout() {
    return {
      exists: this.model.pendingOrder.exists
        && this.model.pendingOrder.status === ORDER_STATUS.notPaid
        && !this.model.pendingOrder.hasBeenPaid,
      url: this.model.pendingOrder.url,
    };
  }

  computeOptionsBasicActionMenuItemsSwitch() {
    const base = this.computeOptionsBasicActionMenuItemsActivation();

    return {
      ...base,
      exists: base.exists
        && !isEmpty(
          keys(this.model.servicePacks.current.basicOptions),
        ),
    };
  }

  computeOptionsBasicActionMenuExists() {
    return some(
      map(
        values(this.options.basic.actionMenu.items),
        'exists',
      ),
    );
  }

  computeOptionsCertificationExists() {
    return !isEmpty(this.model.servicePacks.orderable.withACertification)
    || this.model.servicePacks.current.certification.exists
    || (
      this.model.servicePacks.ordered.exists && this.model.servicePacks.ordered.certification.exists
    );
  }

  computeOptionsCertificationDescription() {
    const currentlyHasCertification = this.model.servicePacks.current.certification.exists;
    const orderedACertification = this.model.servicePacks.ordered.exists
      && this.model.servicePacks.ordered.certification.exists;

    const exists = currentlyHasCertification || orderedACertification;
    const status = OptionsDescriptionsService.computeStatus(
      currentlyHasCertification,
      orderedACertification,
      this.model.pendingOrder,
    );

    return {
      exists,
      managementInterfaceUrl: currentlyHasCertification
        && this.model.currentService.certifiedInterfaceUrl,
      name: (
        orderedACertification && this.model.servicePacks.ordered.certification.name
      )
        || this.model.servicePacks.current.certification.name,
      presentation: {
        exists: !currentlyHasCertification,
        url: ServicePackOptionService.getPresentationUrl('home', this.model.currentUser),
      },
      status: exists && status,
    };
  }

  computeOptionsCertificationActionMenuExists() {
    return some(
      map(
        values(this.options.certification.actionMenu.items),
        'exists',
      ),
    );
  }

  computeOptionsCertificationActionMenuItemsActivate() {
    const everytime = !this.model.servicePacks.current.certification.exists
      && !isEmpty(this.model.servicePacks.orderable.withACertification);
    const whenThereIsNoPendingOrder = everytime
      && !this.model.pendingOrder.exists;
    const whenThereIsAPendingOrder = everytime
      && this.model.pendingOrder.exists
      && this.model.pendingOrder.status === ORDER_STATUS.notPaid
      && !this.model.pendingOrder.isInError;

    const exists = this.computeOptionsCertificationActionMenuItemsPayCheckout().exists
      || whenThereIsNoPendingOrder
      || whenThereIsAPendingOrder;

    return {
      exists,
      stateParams: {
        activationType: OPTION_TYPES.certification,
        orderableServicePacks: this.model.servicePacks.orderable.withACertification,
        servicePacks: this.model.servicePacks.all,
      },
    };
  }

  computeOptionsCertificationActionMenuItemsConfigure() {
    return {
      exists: this.model.servicePacks.ordered.exists
        && this.model.servicePacks.ordered.mustBeConfigured,
      stateParams: {
        activationType: 'configurationOnly',
      },
    };
  }

  computeOptionsCertificationActionMenuItemsPayCheckout() {
    return {
      exists: this.model.pendingOrder.exists
        && this.model.pendingOrder.status === ORDER_STATUS.notPaid
        && !this.model.pendingOrder.hasBeenPaid
        && this.model.servicePacks.ordered.certification.exists,
      url: this.model.pendingOrder.url,
    };
  }
}
