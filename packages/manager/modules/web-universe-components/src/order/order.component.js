import controller from './order.controller';
import template from './order.html';

/*
  The component is based on ovh-ui-kit 'oui-stepper'
  It is aimed to handle the following order steps :
  - Pricing choice
  - Payment

  This can be used in combination with a configuration step, if more details
  is required to setup plan code and/or configuration item list.

  The configuration step must be set as following:

  <wuc-order
      catalog="$ctrl.myProductCatalog"
      catalog-item-type-name="'PLANS'"
      product-name="'webHosting'"
      send-current-state="$ctrl.getOrderState(state)"
      type="'renew'"
      user="$ctrl.user"

      on-before-pricing-get-plancode="$ctrl.getPlancode()"
      on-checkout-success="$ctrl.displaySuccessMessage()"
      on-get-configuration="$ctrl.getConfigurationItems()"
  >

    // Configuration step
    <oui-step-form>
      <oui-field>
        Some input
      </oui-field>
    </oui-step-form>

    // End of configuration step

  </wuc-order>
*/
export default {
  bindings: {
    /*
      'catalog':
      Catalog to get from GET '/order/catalog/public/{productNameToGetCatalog}'.
    */
    catalog: '<',

    /* 'catalogItemTypeName':
      Item type of which we want catalog informations, as the catalog contains
      'addons' and 'plans' where product informations can be found.

      Check CATALOG_ITEM_TYPE_NAMES constant.
    */
    catalogItemTypeName: '<',

    /* 'productName':
      The product name to use, to add items for item order.
    */
    productName: '<',

    /* 'sendCurrentState':
      Method to send component current state, so the upper scope is aware of
      the loading state of the component.

      Example :
      In controller :

      getOrderState(state) { this.orderState = state; }

      ...later:
      if (this.orderState.isLoading) { // Some code }
    */
    sendCurrentState: '&',

    /* 'serviceNameToAddProduct' :
      Service name of which we will add product/addon.
      If set, the order will consist to add option to an existing service.
      If null, the order concerns an new product.
    */
    serviceNameToAddProduct: '<?',

    /* 'type':
      Type of order, see ORDER_TYPES constant.
    */
    type: '<',

    /* 'user':
      User informations, for cart creation, price format style.
    */
    user: '<',

    /* 'onBeforePricingGetPlancode':
      Method called to get the product/addon plan code, which will be called
      after configuration phase, and before pricing step.
      Plan code example : webHosting, cloudDB.
    */
    onBeforePricingGetPlancode: '&',

    /* 'onCheckoutSuccess':
      Method called once the order is checked out.
    */
    onCheckoutSuccess: '&',

    /* 'onError':
      Error handler method.
    */
    onError: '&',

    /* 'onGetConfiguration':
      Method to get configuration items that will be added to the order
      cart, called when fetching checkout informations.

      The configuration key list must follow catalog product
      required configuration.
      This can be found through, GET /order/catalog/public/{productName},
      in plans > planItem > configurations.

      Example for cloudDB (GET /order/catalog/public/cloudDB,
      with FR subsidiary):
      configurations = [
        {
          isCustom: false,
          values: [ "gra1" ],
          name: "dc",
          isMandatory: true
        },
        {
          name: "engine"
          values: [
            "redis_3.2"
            "redis_4.0"
            ...
          ],
          isCustom: false,
          isMandatory: true
        }
      ]
      Here, the configuration label will be the 'name' property value,
      and the configuration value, one of the 'values' list.

      Returned value must be of the following format:
      [
        {
          label: configurationLabel (ex: 'legacy_domain'),
          value: configurationValue (ex: 'www.ovhcloud.com'),
        }
      ];
    */
    onGetConfiguration: '&',
  },
  controller,
  name: 'wucOrder',
  template,
  transclude: true,
};
