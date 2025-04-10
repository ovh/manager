export const NEW_OFFERS_NAME = {
  PERSO: 'perso',
  PRO: 'pro',
  PERFORMANCE_1: 'performance_1',
  PERFORMANCE_2: 'performance_2',
  PERFORMANCE_3: 'performance_3',
  PERFORMANCE_4: 'performance_4',
};

export const OFFERS_UNELIGIBLE_FOR_MODULE = [
  'START_10_M',
  'HOSTING_FREE_100_M',
];

export const HOSTING_BASE_TRACKING = 'web::hosting';
export const HOSTING_TRACKING = {
  GO_TO_ORDER_DATABASE: `${HOSTING_BASE_TRACKING}::go_to_order_a_databases`,
  STEP_1: {
    SELECT_OFFER: `${HOSTING_BASE_TRACKING}::change_offer::click_on_`,
    SELECT_OFFER_LIST: `${HOSTING_BASE_TRACKING}::change_offer::click_on_down_list_`,
    GO_TO_NEXT_STEP: `${HOSTING_BASE_TRACKING}::change_offer::go_to_Next`,
    GO_TO_PREVIOUS_PAGE: `${HOSTING_BASE_TRACKING}::change_offer::back_to_previous_page`,
    GO_TO_CHANGE_OFFER: `${HOSTING_BASE_TRACKING}::upgrade_offer::go_to_Hosting_change_offer`,
  },
};

export const DOMAIN_BASE_TRACKING = 'web::domain::order_webhosting_Plans';
export const DOMAIN_TRACKING = {
  WEBHOSTING_ORDER: `${DOMAIN_BASE_TRACKING}::cross-sell::go_to_webhosting_plans_orders`,
  STEP_1: {
    SELECT_OFFER: `${DOMAIN_BASE_TRACKING}::Step_1-click_on_`,
    SELECT_OFFER_LIST: `${DOMAIN_BASE_TRACKING}::Step_1-click_on_down_list_`,
    SET_STEP: `${DOMAIN_BASE_TRACKING}::Step_1-click_on_Modify_this_step`,
    GO_TO_NEXT_STEP: `${DOMAIN_BASE_TRACKING}::Step_1-go_to_Next_step_2`,
    GO_TO_CHANGE_OFFER: `${DOMAIN_BASE_TRACKING}::upgrade_offer::go_to_Hosting_change_offer`,
  },
  STEP_2: {
    SELECT_CMS: `${DOMAIN_BASE_TRACKING}::Step_2-click_on_`,
    SELECT_NO_CMS: `${DOMAIN_BASE_TRACKING}::Step_2-click_on_No_Module`,
    SET_STEP: `${DOMAIN_BASE_TRACKING}::Step_2-click_on_Modify_this_step`,
    GO_TO_NEXT_STEP: `${DOMAIN_BASE_TRACKING}::Step_1-go_to_Next_step_3`,
  },
  STEP_3: {
    ACTIVATE_DNS: `${DOMAIN_BASE_TRACKING}::Step_3-click_on_Activate_Hosting_in_DNS_config`,
    ACTIVATE_EMAIL: `${DOMAIN_BASE_TRACKING}::Step_3-click_on_Activate_e-mails_in_DNS_config`,
    GO_TO_NEXT_STEP: `${DOMAIN_BASE_TRACKING}::Step_1-go_to_Next_step_4`,
  },
  STEP_5: {
    SELECT_PAYMENT: `${DOMAIN_BASE_TRACKING}::Step_5-click_on_Another_Payment_method`,
    GO_TO_AVOID: `${DOMAIN_BASE_TRACKING}::Step_5-go_to_Avoid`,
    GO_TO_SEND: `${DOMAIN_BASE_TRACKING}::Step_5-go_to_Send`,
  },
};

export const DATABASES_BASE_TRACKING = 'web::hosting::order_databases';
export const DATABASES_TRACKING = {
  GO_TO_CREATE_DATABASE: `${DATABASES_BASE_TRACKING}::click_on_Create_database`,
  GO_TO_CHANGE_DATABASE: `${DATABASES_BASE_TRACKING}::click_on_Change_offer`,
  GO_TO_ORDER_DATABASE: `${HOSTING_BASE_TRACKING}::go_to_order_a_databases`,
  SELECT_LIST_ACTION: `${DATABASES_BASE_TRACKING}::click_on_downlist-Action`,
  SELECT_LIST_ACTION_CREATE_DB: `${DATABASES_BASE_TRACKING}::click_on_downlist-Create_database`,
  SELECT_LIST_ACTION_ORDER_DB: `${DATABASES_BASE_TRACKING}::click_on_downlist-order_database`,
  SELECT_LIST_ACTION_ORDER_WEB_CLOUD_DB: `${DATABASES_BASE_TRACKING}::click_on_downlist-order_Web_Cloud_database`,

  STEP_1: {
    SELECT_DB_CATEGORY: `${DOMAIN_BASE_TRACKING}::Step_1-click_on`,
  },
  STEP_2: {
    SELECT_DB_ENGINE: `${DOMAIN_BASE_TRACKING}::Step_2-click_on`,
    GO_TO_NEXT_STEP: `${DOMAIN_BASE_TRACKING}::Step_2-go_to_next`,
  },
  STEP_3: {
    ACTIVATE_DNS: `${DOMAIN_BASE_TRACKING}::order_webhosting_Plans::Step_3-click_on_Activate_Hosting_in_DNS_config`,
    ACTIVATE_EMAIL: `${DOMAIN_BASE_TRACKING}::order_webhosting_Plans::Step_3-click_on_Activate_e-mails_in_DNS_config`,
    GO_TO_NEXT_STEP: `${DOMAIN_BASE_TRACKING}::order_webhosting_Plans::Step_1-go_to_Next_step_4`,
  },
  STEP_5: {
    SELECT_PAYMENT: `${DOMAIN_BASE_TRACKING}::order_webhosting_Plans::Step_5-click_on_Another_Payment_method`,
    GO_TO_AVOID: `${DOMAIN_BASE_TRACKING}::order_webhosting_Plans::Step_5-go_to_Avoid`,
    GO_TO_SEND: `${DOMAIN_BASE_TRACKING}::order_webhosting_Plans::Step_5-go_to_Send`,
  },
};

export const MULTISITES_BASE_TRACKING = 'web::hosting::multisites';
export const MULTISITES_TRACKING = {
  GO_TO_ORDER_DATABASE: `${MULTISITES_BASE_TRACKING}::click_on_Change_offer`,
};

const PREFIX_GUIDES_URL = 'https://help.ovhcloud.com/csm/';
const SUFFIX_URL_GENERAL_INFORMATION =
  '?id=kb_browse_cat&kb_id=e17b4f25551974502d4c6e78b7421955&kb_category=98441955f49801102d4ca4d466a7fdb2';
export const HOSTING_GUIDES = [
  {
    translateKey: 'hosting_guides_general_information',
    url: {
      DEFAULT: `${PREFIX_GUIDES_URL}world-documentation-web-cloud-hosting${SUFFIX_URL_GENERAL_INFORMATION}`,
      ASIA: `${PREFIX_GUIDES_URL}asia-documentation-web-cloud-hosting${SUFFIX_URL_GENERAL_INFORMATION}`,
      DE: `${PREFIX_GUIDES_URL}de-documentation-web-cloud-hosting${SUFFIX_URL_GENERAL_INFORMATION}`,
      ES: `${PREFIX_GUIDES_URL}es-es-documentation-web-cloud-hosting${SUFFIX_URL_GENERAL_INFORMATION}`,
      IE: `${PREFIX_GUIDES_URL}en-ie-documentation-web-cloud-hosting${SUFFIX_URL_GENERAL_INFORMATION}`,
      IT: `${PREFIX_GUIDES_URL}it-documentation-web-cloud-hosting${SUFFIX_URL_GENERAL_INFORMATION}`,
      PL: `${PREFIX_GUIDES_URL}pl-documentation-web-cloud-hosting${SUFFIX_URL_GENERAL_INFORMATION}`,
      PT: `${PREFIX_GUIDES_URL}pt-documentation-web-cloud-hosting${SUFFIX_URL_GENERAL_INFORMATION}`,
      GB: `${PREFIX_GUIDES_URL}en-gb-documentation-web-cloud-hosting${SUFFIX_URL_GENERAL_INFORMATION}`,
      CA: `${PREFIX_GUIDES_URL}en-ca-documentation-web-cloud-hosting${SUFFIX_URL_GENERAL_INFORMATION}`,
      QC: `${PREFIX_GUIDES_URL}fr-ca-documentation-web-cloud-hosting${SUFFIX_URL_GENERAL_INFORMATION}`,
      MA: `${PREFIX_GUIDES_URL}fr-ma-documentation-web-cloud-hosting${SUFFIX_URL_GENERAL_INFORMATION}`,
      SN: `${PREFIX_GUIDES_URL}fr-sn-documentation-web-cloud-hosting${SUFFIX_URL_GENERAL_INFORMATION}`,
      TN: `${PREFIX_GUIDES_URL}fr-tn-documentation-web-cloud-hosting${SUFFIX_URL_GENERAL_INFORMATION}`,
      AU: `${PREFIX_GUIDES_URL}en-au-documentation-web-cloud-hosting${SUFFIX_URL_GENERAL_INFORMATION}`,
      SG: `${PREFIX_GUIDES_URL}en-sg-documentation-web-cloud-hosting${SUFFIX_URL_GENERAL_INFORMATION}`,
      FR: `${PREFIX_GUIDES_URL}fr-documentation-web-cloud-hosting${SUFFIX_URL_GENERAL_INFORMATION}`,
      WE: `${PREFIX_GUIDES_URL}world-documentation-web-cloud-hosting${SUFFIX_URL_GENERAL_INFORMATION}`,
      WS: `${PREFIX_GUIDES_URL}es-documentation-web-cloud-hosting${SUFFIX_URL_GENERAL_INFORMATION}`,
    },
  },
];

export default {
  NEW_OFFERS_NAME,
  OFFERS_UNELIGIBLE_FOR_MODULE,
  HOSTING_GUIDES,
};
