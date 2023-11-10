import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';
import { O as ODS_THEME_COLOR_INTENT } from './ods-theme-typography-size.js';
import { b as OdsLogger, c as OdsWarnComponentAttribute } from './ods-html-anchor-element-target.js';
import { d as defineCustomElement$2 } from './osds-icon2.js';

var ODS_ICON_NAME;
(function (ODS_ICON_NAME) {
  ODS_ICON_NAME["ADD"] = "add";
  ODS_ICON_NAME["ARROW_DOWN_RIGHT"] = "arrow-down-right";
  ODS_ICON_NAME["ARROW_DOWN"] = "arrow-down";
  ODS_ICON_NAME["ARROW_LEFT"] = "arrow-left";
  ODS_ICON_NAME["ARROW_RIGHT"] = "arrow-right";
  ODS_ICON_NAME["ARROW_TRANSFER"] = "arrow-transfer";
  ODS_ICON_NAME["ARROW_UP_RIGHT"] = "arrow-up-right";
  ODS_ICON_NAME["ARROW_UP"] = "arrow-up";
  ODS_ICON_NAME["BELL"] = "bell";
  ODS_ICON_NAME["BIN"] = "bin";
  ODS_ICON_NAME["BOOK"] = "book";
  ODS_ICON_NAME["CALENDAR"] = "calendar";
  ODS_ICON_NAME["CART"] = "cart";
  ODS_ICON_NAME["CHAT"] = "chat";
  ODS_ICON_NAME["CHECK"] = "check";
  ODS_ICON_NAME["CHEVRON_DOWN"] = "chevron-down";
  ODS_ICON_NAME["CHEVRON_LEFT"] = "chevron-left";
  ODS_ICON_NAME["CHEVRON_RIGHT"] = "chevron-right";
  ODS_ICON_NAME["CHEVRON_UP_DOWN"] = "chevron-up-down";
  ODS_ICON_NAME["CHEVRON_UP"] = "chevron-up";
  ODS_ICON_NAME["CLOCK_WAIT"] = "clock-wait";
  ODS_ICON_NAME["CLOSE"] = "close";
  ODS_ICON_NAME["COPY"] = "copy";
  ODS_ICON_NAME["DOWNLOAD"] = "download";
  ODS_ICON_NAME["ELLIPSIS_VERTICAL"] = "ellipsis-vertical";
  ODS_ICON_NAME["ELLIPSIS"] = "ellipsis";
  ODS_ICON_NAME["EMAIL"] = "email";
  ODS_ICON_NAME["EQUAL"] = "equal";
  ODS_ICON_NAME["ERROR_CIRCLE"] = "error-circle";
  ODS_ICON_NAME["ERROR"] = "error";
  ODS_ICON_NAME["EXTERNAL_LINK"] = "external-link";
  ODS_ICON_NAME["EYE_CLOSED"] = "eye-closed";
  ODS_ICON_NAME["EYE_OPEN"] = "eye-open";
  ODS_ICON_NAME["FILE"] = "file";
  ODS_ICON_NAME["FILTER"] = "filter";
  ODS_ICON_NAME["FOLDER"] = "folder";
  ODS_ICON_NAME["GEAR"] = "gear";
  ODS_ICON_NAME["GUIDES"] = "guides";
  ODS_ICON_NAME["HAMBURGER"] = "hamburger";
  ODS_ICON_NAME["HELP_CIRCLE"] = "help-circle";
  ODS_ICON_NAME["HELP"] = "help";
  ODS_ICON_NAME["HOME"] = "home";
  ODS_ICON_NAME["INDETERMINATE"] = "indeterminate";
  ODS_ICON_NAME["INFO_CIRCLE"] = "info-circle";
  ODS_ICON_NAME["INFO"] = "info";
  ODS_ICON_NAME["LIGHTBULB"] = "lightbulb";
  ODS_ICON_NAME["LIST"] = "list";
  ODS_ICON_NAME["LOCATION"] = "location";
  ODS_ICON_NAME["LOCK"] = "lock";
  ODS_ICON_NAME["MINUS"] = "minus";
  ODS_ICON_NAME["OK"] = "ok";
  ODS_ICON_NAME["OVH"] = "ovh";
  ODS_ICON_NAME["PEN"] = "pen";
  ODS_ICON_NAME["PHONE"] = "phone";
  ODS_ICON_NAME["PLUS"] = "plus";
  ODS_ICON_NAME["PRINTER"] = "printer";
  ODS_ICON_NAME["REFRESH"] = "refresh";
  ODS_ICON_NAME["REMOVE"] = "remove";
  ODS_ICON_NAME["SEARCH"] = "search";
  ODS_ICON_NAME["SETTINGS"] = "settings";
  ODS_ICON_NAME["SHAPE_CIRCLE"] = "shape-circle";
  ODS_ICON_NAME["SHAPE_DOT"] = "shape-dot";
  ODS_ICON_NAME["SORT_DOWN"] = "sort-down";
  ODS_ICON_NAME["SORT_UP"] = "sort-up";
  ODS_ICON_NAME["SORT"] = "sort";
  ODS_ICON_NAME["SUCCESS_CIRCLE"] = "success-circle";
  ODS_ICON_NAME["SUCCESS"] = "success";
  ODS_ICON_NAME["TIME"] = "time";
  ODS_ICON_NAME["TRANSFER"] = "transfer";
  ODS_ICON_NAME["TRASH"] = "trash";
  ODS_ICON_NAME["TRIANGLE_DOWN"] = "triangle-down";
  ODS_ICON_NAME["TRIANGLE_LEFT"] = "triangle-left";
  ODS_ICON_NAME["TRIANGLE_RIGHT"] = "triangle-right";
  ODS_ICON_NAME["TRIANGLE_UP"] = "triangle-up";
  ODS_ICON_NAME["TRUCK"] = "truck";
  ODS_ICON_NAME["USER"] = "user";
  ODS_ICON_NAME["WARNING_CIRCLE"] = "warning-circle";
  ODS_ICON_NAME["WARNING"] = "warning";
  ODS_ICON_NAME["ANTI_DDOS_PROTECTION_CONCEPT"] = "anti-ddos-protection-concept";
  ODS_ICON_NAME["APP_GEAR_CONCEPT"] = "app-gear-concept";
  ODS_ICON_NAME["APP_REPLICATION_CONCEPT"] = "app-replication-concept";
  ODS_ICON_NAME["APP_SCRIPT_CONCEPT"] = "app-script-concept";
  ODS_ICON_NAME["APP_WORLD_CONCEPT"] = "app-world-concept";
  ODS_ICON_NAME["APPLICATION_CONCEPT"] = "application-concept";
  ODS_ICON_NAME["ARROW_CROSSED_CONCEPT"] = "arrow-crossed-concept";
  ODS_ICON_NAME["ARROW_DOWN_CONCEPT"] = "arrow-down-concept";
  ODS_ICON_NAME["ARROW_LEFT_CONCEPT"] = "arrow-left-concept";
  ODS_ICON_NAME["ARROW_RIGHT_CONCEPT"] = "arrow-right-concept";
  ODS_ICON_NAME["ARROW_UNDO_CONCEPT"] = "arrow-undo-concept";
  ODS_ICON_NAME["BALANCE_CONCEPT"] = "balance-concept";
  ODS_ICON_NAME["BANDWIDTH_CONCEPT"] = "bandwidth-concept";
  ODS_ICON_NAME["BELL_CONCEPT"] = "bell-concept";
  ODS_ICON_NAME["BIRD_CONCEPT"] = "bird-concept";
  ODS_ICON_NAME["BOOK_CLOSE_CONCEPT"] = "book-close-concept";
  ODS_ICON_NAME["BOOK_CONTACT_CONCEPT"] = "book-contact-concept";
  ODS_ICON_NAME["BOOK_OPEN_CONCEPT"] = "book-open-concept";
  ODS_ICON_NAME["BROOM_CONCEPT"] = "broom-concept";
  ODS_ICON_NAME["BRUSH_CONCEPT"] = "brush-concept";
  ODS_ICON_NAME["CABLE_SPEED_CONCEPT"] = "cable-speed-concept";
  ODS_ICON_NAME["CALENDAR_PAY_AS_YOU_GO_CONCEPT"] = "calendar-pay-as-you-go-concept";
  ODS_ICON_NAME["CALENDAR_CONCEPT"] = "calendar-concept";
  ODS_ICON_NAME["CAMERA_CONCEPT"] = "camera-concept";
  ODS_ICON_NAME["CART_CONCEPT"] = "cart-concept";
  ODS_ICON_NAME["CDN_CONCEPT"] = "cdn-concept";
  ODS_ICON_NAME["CHATBOT_CONCEPT"] = "chatbot-concept";
  ODS_ICON_NAME["CHRONO_CONCEPT"] = "chrono-concept";
  ODS_ICON_NAME["CLOCK_AVAILABLE_CONCEPT"] = "clock-available-concept";
  ODS_ICON_NAME["CLOCK_CONCEPT"] = "clock-concept";
  ODS_ICON_NAME["CLOUD_DATA_SHARING_CONCEPT"] = "cloud-data-sharing-concept";
  ODS_ICON_NAME["CLOUD_EDGE_COMPUTING_CONCEPT"] = "cloud-edge-computing-concept";
  ODS_ICON_NAME["CLOUD_ESSENTIAL_CONCEPT"] = "cloud-essential-concept";
  ODS_ICON_NAME["CLOUD_EYE_CONCEPT"] = "cloud-eye-concept";
  ODS_ICON_NAME["CLOUD_HAND_CONCEPT"] = "cloud-hand-concept";
  ODS_ICON_NAME["CLOUD_HYBRID_CONCEPT"] = "cloud-hybrid-concept";
  ODS_ICON_NAME["CLOUD_INFINITY_CONCEPT"] = "cloud-infinity-concept";
  ODS_ICON_NAME["CLOUD_PADLOCK_CONCEPT"] = "cloud-padlock-concept";
  ODS_ICON_NAME["CLOUD_SERVER_CONCEPT"] = "cloud-server-concept";
  ODS_ICON_NAME["CLOUD_CONCEPT"] = "cloud-concept";
  ODS_ICON_NAME["COMMUNITY_CONCEPT"] = "community-concept";
  ODS_ICON_NAME["COMPONENT_SQUARE_CONCEPT"] = "component-square-concept";
  ODS_ICON_NAME["COMPONENT_CONCEPT"] = "component-concept";
  ODS_ICON_NAME["COMPUTE_CONCEPT"] = "compute-concept";
  ODS_ICON_NAME["COMPUTER_CURVE_CONCEPT"] = "computer-curve-concept";
  ODS_ICON_NAME["COMPUTER_FLOPPY_CONCEPT"] = "computer-floppy-concept";
  ODS_ICON_NAME["COMPUTER_FOLDER_CONCEPT"] = "computer-folder-concept";
  ODS_ICON_NAME["COMPUTER_LAPTOP_CLOUD_CONCEPT"] = "computer-laptop-cloud-concept";
  ODS_ICON_NAME["COMPUTER_LAPTOP_CONCEPT"] = "computer-laptop-concept";
  ODS_ICON_NAME["COMPUTER_V_R_OPS_CONCEPT"] = "computer-v-r-ops-concept";
  ODS_ICON_NAME["COMPUTER_CONCEPT"] = "computer-concept";
  ODS_ICON_NAME["CONTAINER_CONCEPT"] = "container-concept";
  ODS_ICON_NAME["COUNTER_CONCEPT"] = "counter-concept";
  ODS_ICON_NAME["CREDIT_CARD_CLOCK_CONCEPT"] = "credit-card-clock-concept";
  ODS_ICON_NAME["CREDIT_CARD_CONCEPT"] = "credit-card-concept";
  ODS_ICON_NAME["CURVE_CONCEPT"] = "curve-concept";
  ODS_ICON_NAME["DATABASE_COLD_ARCHIVE_CONCEPT"] = "database-cold-archive-concept";
  ODS_ICON_NAME["DATABASE_SQL_CONCEPT"] = "database-sql-concept";
  ODS_ICON_NAME["DATABASE_CONCEPT"] = "database-concept";
  ODS_ICON_NAME["DATACENTER_CONCEPT"] = "datacenter-concept";
  ODS_ICON_NAME["DEVICE_MOBILE_CONCEPT"] = "device-mobile-concept";
  ODS_ICON_NAME["DEVICE_TABLET_CONCEPT"] = "device-tablet-concept";
  ODS_ICON_NAME["DIAMOND_CONCEPT"] = "diamond-concept";
  ODS_ICON_NAME["DIFFERENT_CONCEPT"] = "different-concept";
  ODS_ICON_NAME["DNS_ANYCAST_CONCEPT"] = "dns-anycast-concept";
  ODS_ICON_NAME["DOMAINS_CONCEPT"] = "domains-concept";
  ODS_ICON_NAME["DOWNLOAD_CONCEPT"] = "download-concept";
  ODS_ICON_NAME["DSLAM_CONCEPT"] = "dslam-concept";
  ODS_ICON_NAME["ENVELOP_LETTER_CONCEPT"] = "envelop-letter-concept";
  ODS_ICON_NAME["ENVELOP_CONCEPT"] = "envelop-concept";
  ODS_ICON_NAME["ETHERNET_ADD_CONCEPT"] = "ethernet-add-concept";
  ODS_ICON_NAME["ETHERNET_CONCEPT"] = "ethernet-concept";
  ODS_ICON_NAME["EXPANSION_ARROWS_CONCEPT"] = "expansion-arrows-concept";
  ODS_ICON_NAME["EXPORT_CONCEPT"] = "export-concept";
  ODS_ICON_NAME["EYE_CONCEPT"] = "eye-concept";
  ODS_ICON_NAME["FLASK_CONCEPT"] = "flask-concept";
  ODS_ICON_NAME["FLOPPY_CLOCK_CONCEPT"] = "floppy-clock-concept";
  ODS_ICON_NAME["FLOPPY_RELOAD_CONCEPT"] = "floppy-reload-concept";
  ODS_ICON_NAME["FLOPPY_CONCEPT"] = "floppy-concept";
  ODS_ICON_NAME["FOLDER_FTP_CONCEPT"] = "folder-ftp-concept";
  ODS_ICON_NAME["FOLDER_CONCEPT"] = "folder-concept";
  ODS_ICON_NAME["GEAR_ARROW_CONCEPT"] = "gear-arrow-concept";
  ODS_ICON_NAME["GEAR_DOLLAR_CONCEPT"] = "gear-dollar-concept";
  ODS_ICON_NAME["GEAR_CONCEPT"] = "gear-concept";
  ODS_ICON_NAME["GEOLOCALISATION_OVHCLOUD_CONCEPT"] = "geolocalisation-ovhcloud-concept";
  ODS_ICON_NAME["GEOLOCALISATION_PLAN_CONCEPT"] = "geolocalisation-plan-concept";
  ODS_ICON_NAME["GIFT_CONCEPT"] = "gift-concept";
  ODS_ICON_NAME["GRAPH_CONCEPT"] = "graph-concept";
  ODS_ICON_NAME["HAND_LEAF_CONCEPT"] = "hand-leaf-concept";
  ODS_ICON_NAME["HAND_WORLD_CONCEPT"] = "hand-world-concept";
  ODS_ICON_NAME["HANDSHAKE_CONCEPT"] = "handshake-concept";
  ODS_ICON_NAME["HARDWARE_GPU_CONCEPT"] = "hardware-gpu-concept";
  ODS_ICON_NAME["HARDWARE_SATA_CONCEPT"] = "hardware-sata-concept";
  ODS_ICON_NAME["HARDWARE_SSD_CONCEPT"] = "hardware-ssd-concept";
  ODS_ICON_NAME["HASHTAG_CONCEPT"] = "hashtag-concept";
  ODS_ICON_NAME["HOURGLASS_CONCEPT"] = "hourglass-concept";
  ODS_ICON_NAME["HOUSE_CONCEPT"] = "house-concept";
  ODS_ICON_NAME["IMPORT_CONCEPT"] = "import-concept";
  ODS_ICON_NAME["INFINITE_CONCEPT"] = "infinite-concept";
  ODS_ICON_NAME["INFO_CONCEPT"] = "info-concept";
  ODS_ICON_NAME["INVADER_CONCEPT"] = "invader-concept";
  ODS_ICON_NAME["IO_T_CONCEPT"] = "io-t-concept";
  ODS_ICON_NAME["KEY_CONCEPT"] = "key-concept";
  ODS_ICON_NAME["KEYPAD_CONCEPT"] = "keypad-concept";
  ODS_ICON_NAME["LEAF_CONCEPT"] = "leaf-concept";
  ODS_ICON_NAME["LIFEBUOY_CONCEPT"] = "lifebuoy-concept";
  ODS_ICON_NAME["LIGHTBULB_CONCEPT"] = "lightbulb-concept";
  ODS_ICON_NAME["LINE_COMMUNICATING_CONCEPT"] = "line-communicating-concept";
  ODS_ICON_NAME["LINES_SYMMETRICAL_CONCEPT"] = "lines-symmetrical-concept";
  ODS_ICON_NAME["MAGNIFYING_GLASS_CHECK_CONCEPT"] = "magnifying-glass-check-concept";
  ODS_ICON_NAME["MAGNIFYING_GLASS_PERSON_CONCEPT"] = "magnifying-glass-person-concept";
  ODS_ICON_NAME["MAGNIFYING_GLASS_CONCEPT"] = "magnifying-glass-concept";
  ODS_ICON_NAME["MAP_FRANCE_CONCEPT"] = "map-france-concept";
  ODS_ICON_NAME["MEASURE_CONCEPT"] = "measure-concept";
  ODS_ICON_NAME["MEDAL_CONCEPT"] = "medal-concept";
  ODS_ICON_NAME["MICROPHONE_CONCEPT"] = "microphone-concept";
  ODS_ICON_NAME["MODEM_CONCEPT"] = "modem-concept";
  ODS_ICON_NAME["MULTI_DEVICE_CONCEPT"] = "multi-device-concept";
  ODS_ICON_NAME["NETWORK_CONCEPT"] = "network-concept";
  ODS_ICON_NAME["NEWTAB_CONCEPT"] = "newtab-concept";
  ODS_ICON_NAME["NRA_CONCEPT"] = "nra-concept";
  ODS_ICON_NAME["OPENSTACK_CONCEPT"] = "openstack-concept";
  ODS_ICON_NAME["OVER_THE_BOX_CONCEPT"] = "over-the-box-concept";
  ODS_ICON_NAME["PADLOCK_CLOSED_CONCEPT"] = "padlock-closed-concept";
  ODS_ICON_NAME["PADLOCK_OPENED_CONCEPT"] = "padlock-opened-concept";
  ODS_ICON_NAME["PADLOCK_TRANSIT_CONCEPT"] = "padlock-transit-concept";
  ODS_ICON_NAME["PAGE_CERTIFICATE_CONCEPT"] = "page-certificate-concept";
  ODS_ICON_NAME["PAGE_INFO_CONCEPT"] = "page-info-concept";
  ODS_ICON_NAME["PAGE_QUESTION_CONCEPT"] = "page-question-concept";
  ODS_ICON_NAME["PAGE_SCRIPT_CONCEPT"] = "page-script-concept";
  ODS_ICON_NAME["PAGE_CONCEPT"] = "page-concept";
  ODS_ICON_NAME["PAPERPLANE_CONCEPT"] = "paperplane-concept";
  ODS_ICON_NAME["PARTNER_PLATFORMSH_CONCEPT"] = "partner-platformsh-concept";
  ODS_ICON_NAME["PAUSE_CONCEPT"] = "pause-concept";
  ODS_ICON_NAME["PEN_CONCEPT"] = "pen-concept";
  ODS_ICON_NAME["PERSON_HAPPY_CONCEPT"] = "person-happy-concept";
  ODS_ICON_NAME["PERSON_CONCEPT"] = "person-concept";
  ODS_ICON_NAME["PHONE_DOTS_CONCEPT"] = "phone-dots-concept";
  ODS_ICON_NAME["PHONE_FILTER_CONCEPT"] = "phone-filter-concept";
  ODS_ICON_NAME["PHONE_FOBIDDEN_CONCEPT"] = "phone-fobidden-concept";
  ODS_ICON_NAME["PHONE_FORWARD_CONCEPT"] = "phone-forward-concept";
  ODS_ICON_NAME["PHONE_CONCEPT"] = "phone-concept";
  ODS_ICON_NAME["PROMOTION"] = "promotion";
  ODS_ICON_NAME["PIG_CONCEPT"] = "pig-concept";
  ODS_ICON_NAME["PLAY_CONCEPT"] = "play-concept";
  ODS_ICON_NAME["PLUG_N_PLAY_CONCEPT"] = "plug-n-play-concept";
  ODS_ICON_NAME["POWER_CONCEPT"] = "power-concept";
  ODS_ICON_NAME["PRINTER_CONCEPT"] = "printer-concept";
  ODS_ICON_NAME["PUZZLE_CONCEPT"] = "puzzle-concept";
  ODS_ICON_NAME["RAM_CONCEPT"] = "ram-concept";
  ODS_ICON_NAME["RECEIPT_CONCEPT"] = "receipt-concept";
  ODS_ICON_NAME["RELOAD_CONCEPT"] = "reload-concept";
  ODS_ICON_NAME["REPLICATION_CONCEPT"] = "replication-concept";
  ODS_ICON_NAME["RSS_CONCEPT"] = "rss-concept";
  ODS_ICON_NAME["SCALE_UP_CONCEPT"] = "scale-up-concept";
  ODS_ICON_NAME["SERVER_GEAR_CONCEPT"] = "server-gear-concept";
  ODS_ICON_NAME["SERVER_MANAGED_CONCEPT"] = "server-managed-concept";
  ODS_ICON_NAME["SERVER_CONCEPT"] = "server-concept";
  ODS_ICON_NAME["SHARE_CONCEPT"] = "share-concept";
  ODS_ICON_NAME["SHIELD_CONCEPT"] = "shield-concept";
  ODS_ICON_NAME["SMILEY_HAPPY_CONCEPT"] = "smiley-happy-concept";
  ODS_ICON_NAME["SMILEY_SAD_CONCEPT"] = "smiley-sad-concept";
  ODS_ICON_NAME["SMS_CONCEPT"] = "sms-concept";
  ODS_ICON_NAME["SOFTWARE_CONCEPT"] = "software-concept";
  ODS_ICON_NAME["SPANNER_CONCEPT"] = "spanner-concept";
  ODS_ICON_NAME["SPEAKER_OFF_CONCEPT"] = "speaker-off-concept";
  ODS_ICON_NAME["SPEAKER_ON_CONCEPT"] = "speaker-on-concept";
  ODS_ICON_NAME["SPEECH_BUBBLE_CONCEPT"] = "speech-bubble-concept";
  ODS_ICON_NAME["STAR_CONCEPT"] = "star-concept";
  ODS_ICON_NAME["STOP_CONCEPT"] = "stop-concept";
  ODS_ICON_NAME["SUB_REPARTITOR_CONCEPT"] = "sub-repartitor-concept";
  ODS_ICON_NAME["TAPE_CONCEPT"] = "tape-concept";
  ODS_ICON_NAME["THUMB_UP_CONCEPT"] = "thumb-up-concept";
  ODS_ICON_NAME["TODO_LIST_CONCEPT"] = "todo-list-concept";
  ODS_ICON_NAME["TRAFFIC_CONE_CONCEPT"] = "traffic-cone-concept";
  ODS_ICON_NAME["TRANSFER_CONCEPT"] = "transfer-concept";
  ODS_ICON_NAME["TRASH_CONCEPT"] = "trash-concept";
  ODS_ICON_NAME["TRUCK_CONCEPT"] = "truck-concept";
  ODS_ICON_NAME["TYPING_CONCEPT"] = "typing-concept";
  ODS_ICON_NAME["UPLOAD_CONCEPT"] = "upload-concept";
  ODS_ICON_NAME["USER_FORBID_CONCEPT"] = "user-forbid-concept";
  ODS_ICON_NAME["USER_SUPPORT_CONCEPT"] = "user-support-concept";
  ODS_ICON_NAME["USER_CONCEPT"] = "user-concept";
  ODS_ICON_NAME["VIRTUAL_MACHINE_CONCEPT"] = "virtual-machine-concept";
  ODS_ICON_NAME["WALLET_CONCEPT"] = "wallet-concept";
  ODS_ICON_NAME["WARNING_CONCEPT"] = "warning-concept";
  ODS_ICON_NAME["WIFI_CONCEPT"] = "wifi-concept";
  ODS_ICON_NAME["WORLD_ADD_CONCEPT"] = "world-add-concept";
  ODS_ICON_NAME["WORLD_CONCEPT"] = "world-concept";
})(ODS_ICON_NAME || (ODS_ICON_NAME = {}));
Object.freeze(Object.values(ODS_ICON_NAME));

var ODS_ICON_SIZE;
(function (ODS_ICON_SIZE) {
  ODS_ICON_SIZE["xxs"] = "xxs";
  ODS_ICON_SIZE["xs"] = "xs";
  ODS_ICON_SIZE["sm"] = "sm";
  ODS_ICON_SIZE["md"] = "md";
  ODS_ICON_SIZE["lg"] = "lg";
  ODS_ICON_SIZE["xl"] = "xl";
})(ODS_ICON_SIZE || (ODS_ICON_SIZE = {}));
Object.freeze(Object.values(ODS_ICON_SIZE));

Object.freeze({
  ariaName: '',
  color: ODS_THEME_COLOR_INTENT.default,
  contrasted: false,
  hoverable: false,
  name: undefined,
  size: ODS_ICON_SIZE.md,
});

var ODS_CHIP_SIZE;
(function (ODS_CHIP_SIZE) {
  ODS_CHIP_SIZE["sm"] = "sm";
  ODS_CHIP_SIZE["md"] = "md";
})(ODS_CHIP_SIZE || (ODS_CHIP_SIZE = {}));
Object.freeze(Object.values(ODS_CHIP_SIZE));

var ODS_CHIP_VARIANT;
(function (ODS_CHIP_VARIANT) {
  ODS_CHIP_VARIANT["flat"] = "flat";
  ODS_CHIP_VARIANT["stroked"] = "stroked";
})(ODS_CHIP_VARIANT || (ODS_CHIP_VARIANT = {}));
Object.freeze(Object.values(ODS_CHIP_VARIANT));

const DEFAULT_ATTRIBUTE = Object.freeze({
  color: ODS_THEME_COLOR_INTENT.default,
  contrasted: false,
  disabled: false,
  inline: false,
  removable: false,
  selectable: false,
  size: ODS_CHIP_SIZE.md,
  variant: ODS_CHIP_VARIANT.flat,
});

class OdsChipController {
  constructor(component) {
    this.logger = new OdsLogger('OdsChipController');
    this.component = component;
  }
  /**
   * validating that the color, the size and the variant have correct values
   * and warn the user if not
   */
  validateAttributes() {
    const logger = this.logger;
    OdsWarnComponentAttribute({
      logger,
      attributeValues: ODS_THEME_COLOR_INTENT,
      attributeName: 'color',
      attribute: this.component.color
    });
    OdsWarnComponentAttribute({
      logger,
      attributeValues: ODS_CHIP_SIZE,
      attributeName: 'size',
      attribute: this.component.size
    });
    OdsWarnComponentAttribute({
      logger,
      attributeValues: ODS_CHIP_VARIANT,
      attributeName: 'variant',
      attribute: this.component.variant
    });
  }
}

const osdsChipCss = ":host{align-items:center;border-color:transparent;border-style:solid;box-shadow:none;box-sizing:border-box;display:flex;line-height:1;margin:0;opacity:1;overflow:hidden}:host .chip__wrapper{display:flex;align-items:center}:host([selectable]),:host([removable]) osds-icon[name=close]{cursor:pointer;-webkit-user-select:none;-moz-user-select:none;user-select:none}:host([selectable]:active),:host([removable]) osds-icon[name=close]:active{transition:background-color ease-in-out 0s}:host([disabled]){cursor:not-allowed}:host([disabled]) .chip__wrapper{pointer-events:none}:host([inline]){display:inline-flex;width:var(--width)}:host(:host:not([disabled]):focus-visible){outline-style:dotted;outline-width:var(--ods-size-inset-02);outline-offset:var(--ods-size-inset-02)}slot{display:inline-flex;flex:1}:host{border-color:transparent}:host([disabled]){opacity:0.5}:host(:not([variant]):not([color])){color:var(--ods-color-default-800);background-color:var(--ods-color-default-100)}:host(:not([variant])[color^=default]){color:var(--ods-color-default-800);background-color:var(--ods-color-default-100)}:host(:not([variant])[color^=primary]){color:var(--ods-color-primary-800);background-color:var(--ods-color-primary-100)}:host(:not([variant])[color^=text]){color:var(--ods-color-text-800);background-color:var(--ods-color-text-100)}:host(:not([variant])[color^=accent]){color:var(--ods-color-accent-800);background-color:var(--ods-color-accent-100)}:host(:not([variant])[color^=error]){color:var(--ods-color-error-800);background-color:var(--ods-color-error-100)}:host(:not([variant])[color^=warning]){color:var(--ods-color-warning-800);background-color:var(--ods-color-warning-100)}:host(:not([variant])[color^=success]){color:var(--ods-color-success-800);background-color:var(--ods-color-success-100)}:host(:not([variant])[color^=info]){color:var(--ods-color-info-800);background-color:var(--ods-color-info-100)}:host(:not([variant])[color^=promotion]){color:var(--ods-color-promotion-800);background-color:var(--ods-color-promotion-100)}:host(:not([variant])[contrasted]:not([color])){color:var(--ods-color-default-500);background-color:var(--ods-color-default-500-contrasted)}:host(:not([variant])[contrasted][color^=default]){color:var(--ods-color-default-500);background-color:var(--ods-color-default-500-contrasted)}:host(:not([variant])[contrasted][color^=primary]){color:var(--ods-color-primary-500);background-color:var(--ods-color-primary-500-contrasted)}:host(:not([variant])[contrasted][color^=text]){color:var(--ods-color-text-500);background-color:var(--ods-color-text-500-contrasted)}:host(:not([variant])[contrasted][color^=accent]){color:var(--ods-color-accent-500);background-color:var(--ods-color-accent-500-contrasted)}:host(:not([variant])[contrasted][color^=error]){color:var(--ods-color-error-500);background-color:var(--ods-color-error-500-contrasted)}:host(:not([variant])[contrasted][color^=warning]){color:var(--ods-color-warning-500);background-color:var(--ods-color-warning-500-contrasted)}:host(:not([variant])[contrasted][color^=success]){color:var(--ods-color-success-500);background-color:var(--ods-color-success-500-contrasted)}:host(:not([variant])[contrasted][color^=info]){color:var(--ods-color-info-500);background-color:var(--ods-color-info-500-contrasted)}:host(:not([variant])[contrasted][color^=promotion]){color:var(--ods-color-promotion-500);background-color:var(--ods-color-promotion-500-contrasted)}:host(:not([variant]):not([disabled])[selectable]:not([color]):hover),:host(:not([variant]):not([disabled])[selectable]:not([color]):focus),:host(:not([variant]):not([disabled])[selectable]:not([color]):active){background-color:var(--ods-color-default-200)}:host(:not([variant]):not([disabled])[selectable][color^=default]:hover),:host(:not([variant]):not([disabled])[selectable][color^=default]:focus),:host(:not([variant]):not([disabled])[selectable][color^=default]:active){background-color:var(--ods-color-default-200)}:host(:not([variant]):not([disabled])[selectable][color^=primary]:hover),:host(:not([variant]):not([disabled])[selectable][color^=primary]:focus),:host(:not([variant]):not([disabled])[selectable][color^=primary]:active){background-color:var(--ods-color-primary-200)}:host(:not([variant]):not([disabled])[selectable][color^=text]:hover),:host(:not([variant]):not([disabled])[selectable][color^=text]:focus),:host(:not([variant]):not([disabled])[selectable][color^=text]:active){background-color:var(--ods-color-text-200)}:host(:not([variant]):not([disabled])[selectable][color^=accent]:hover),:host(:not([variant]):not([disabled])[selectable][color^=accent]:focus),:host(:not([variant]):not([disabled])[selectable][color^=accent]:active){background-color:var(--ods-color-accent-200)}:host(:not([variant]):not([disabled])[selectable][color^=error]:hover),:host(:not([variant]):not([disabled])[selectable][color^=error]:focus),:host(:not([variant]):not([disabled])[selectable][color^=error]:active){background-color:var(--ods-color-error-200)}:host(:not([variant]):not([disabled])[selectable][color^=warning]:hover),:host(:not([variant]):not([disabled])[selectable][color^=warning]:focus),:host(:not([variant]):not([disabled])[selectable][color^=warning]:active){background-color:var(--ods-color-warning-200)}:host(:not([variant]):not([disabled])[selectable][color^=success]:hover),:host(:not([variant]):not([disabled])[selectable][color^=success]:focus),:host(:not([variant]):not([disabled])[selectable][color^=success]:active){background-color:var(--ods-color-success-200)}:host(:not([variant]):not([disabled])[selectable][color^=info]:hover),:host(:not([variant]):not([disabled])[selectable][color^=info]:focus),:host(:not([variant]):not([disabled])[selectable][color^=info]:active){background-color:var(--ods-color-info-200)}:host(:not([variant]):not([disabled])[selectable][color^=promotion]:hover),:host(:not([variant]):not([disabled])[selectable][color^=promotion]:focus),:host(:not([variant]):not([disabled])[selectable][color^=promotion]:active){background-color:var(--ods-color-promotion-200)}:host(:not([variant]):not([disabled])[selectable]:not([color]):active){border-color:var(--ods-color-default-500)}:host(:not([variant]):not([disabled])[selectable][color^=default]:active){border-color:var(--ods-color-default-500)}:host(:not([variant]):not([disabled])[selectable][color^=primary]:active){border-color:var(--ods-color-primary-500)}:host(:not([variant]):not([disabled])[selectable][color^=text]:active){border-color:var(--ods-color-text-500)}:host(:not([variant]):not([disabled])[selectable][color^=accent]:active){border-color:var(--ods-color-accent-500)}:host(:not([variant]):not([disabled])[selectable][color^=error]:active){border-color:var(--ods-color-error-500)}:host(:not([variant]):not([disabled])[selectable][color^=warning]:active){border-color:var(--ods-color-warning-500)}:host(:not([variant]):not([disabled])[selectable][color^=success]:active){border-color:var(--ods-color-success-500)}:host(:not([variant]):not([disabled])[selectable][color^=info]:active){border-color:var(--ods-color-info-500)}:host(:not([variant]):not([disabled])[selectable][color^=promotion]:active){border-color:var(--ods-color-promotion-500)}:host(:not([variant]):not([disabled])[selectable][contrasted]:not([color]):hover),:host(:not([variant]):not([disabled])[selectable][contrasted]:not([color]):focus){background-color:var(--ods-color-default-100)}:host(:not([variant]):not([disabled])[selectable][contrasted][color^=default]:hover),:host(:not([variant]):not([disabled])[selectable][contrasted][color^=default]:focus){background-color:var(--ods-color-default-100)}:host(:not([variant]):not([disabled])[selectable][contrasted][color^=primary]:hover),:host(:not([variant]):not([disabled])[selectable][contrasted][color^=primary]:focus){background-color:var(--ods-color-primary-100)}:host(:not([variant]):not([disabled])[selectable][contrasted][color^=text]:hover),:host(:not([variant]):not([disabled])[selectable][contrasted][color^=text]:focus){background-color:var(--ods-color-text-100)}:host(:not([variant]):not([disabled])[selectable][contrasted][color^=accent]:hover),:host(:not([variant]):not([disabled])[selectable][contrasted][color^=accent]:focus){background-color:var(--ods-color-accent-100)}:host(:not([variant]):not([disabled])[selectable][contrasted][color^=error]:hover),:host(:not([variant]):not([disabled])[selectable][contrasted][color^=error]:focus){background-color:var(--ods-color-error-100)}:host(:not([variant]):not([disabled])[selectable][contrasted][color^=warning]:hover),:host(:not([variant]):not([disabled])[selectable][contrasted][color^=warning]:focus){background-color:var(--ods-color-warning-100)}:host(:not([variant]):not([disabled])[selectable][contrasted][color^=success]:hover),:host(:not([variant]):not([disabled])[selectable][contrasted][color^=success]:focus){background-color:var(--ods-color-success-100)}:host(:not([variant]):not([disabled])[selectable][contrasted][color^=info]:hover),:host(:not([variant]):not([disabled])[selectable][contrasted][color^=info]:focus){background-color:var(--ods-color-info-100)}:host(:not([variant]):not([disabled])[selectable][contrasted][color^=promotion]:hover),:host(:not([variant]):not([disabled])[selectable][contrasted][color^=promotion]:focus){background-color:var(--ods-color-promotion-100)}:host(:not([variant]):not([disabled])[selectable][contrasted]:not([color]):active){background-color:var(--ods-color-default-200)}:host(:not([variant]):not([disabled])[selectable][contrasted][color^=default]:active){background-color:var(--ods-color-default-200)}:host(:not([variant]):not([disabled])[selectable][contrasted][color^=primary]:active){background-color:var(--ods-color-primary-200)}:host(:not([variant]):not([disabled])[selectable][contrasted][color^=text]:active){background-color:var(--ods-color-text-200)}:host(:not([variant]):not([disabled])[selectable][contrasted][color^=accent]:active){background-color:var(--ods-color-accent-200)}:host(:not([variant]):not([disabled])[selectable][contrasted][color^=error]:active){background-color:var(--ods-color-error-200)}:host(:not([variant]):not([disabled])[selectable][contrasted][color^=warning]:active){background-color:var(--ods-color-warning-200)}:host(:not([variant]):not([disabled])[selectable][contrasted][color^=success]:active){background-color:var(--ods-color-success-200)}:host(:not([variant]):not([disabled])[selectable][contrasted][color^=info]:active){background-color:var(--ods-color-info-200)}:host(:not([variant]):not([disabled])[selectable][contrasted][color^=promotion]:active){background-color:var(--ods-color-promotion-200)}:host([variant=flat]:not([color])){color:var(--ods-color-default-800);background-color:var(--ods-color-default-100)}:host([variant=flat][color^=default]){color:var(--ods-color-default-800);background-color:var(--ods-color-default-100)}:host([variant=flat][color^=primary]){color:var(--ods-color-primary-800);background-color:var(--ods-color-primary-100)}:host([variant=flat][color^=text]){color:var(--ods-color-text-800);background-color:var(--ods-color-text-100)}:host([variant=flat][color^=accent]){color:var(--ods-color-accent-800);background-color:var(--ods-color-accent-100)}:host([variant=flat][color^=error]){color:var(--ods-color-error-800);background-color:var(--ods-color-error-100)}:host([variant=flat][color^=warning]){color:var(--ods-color-warning-800);background-color:var(--ods-color-warning-100)}:host([variant=flat][color^=success]){color:var(--ods-color-success-800);background-color:var(--ods-color-success-100)}:host([variant=flat][color^=info]){color:var(--ods-color-info-800);background-color:var(--ods-color-info-100)}:host([variant=flat][color^=promotion]){color:var(--ods-color-promotion-800);background-color:var(--ods-color-promotion-100)}:host([variant=flat][contrasted]:not([color])){color:var(--ods-color-default-500);background-color:var(--ods-color-default-500-contrasted)}:host([variant=flat][contrasted][color^=default]){color:var(--ods-color-default-500);background-color:var(--ods-color-default-500-contrasted)}:host([variant=flat][contrasted][color^=primary]){color:var(--ods-color-primary-500);background-color:var(--ods-color-primary-500-contrasted)}:host([variant=flat][contrasted][color^=text]){color:var(--ods-color-text-500);background-color:var(--ods-color-text-500-contrasted)}:host([variant=flat][contrasted][color^=accent]){color:var(--ods-color-accent-500);background-color:var(--ods-color-accent-500-contrasted)}:host([variant=flat][contrasted][color^=error]){color:var(--ods-color-error-500);background-color:var(--ods-color-error-500-contrasted)}:host([variant=flat][contrasted][color^=warning]){color:var(--ods-color-warning-500);background-color:var(--ods-color-warning-500-contrasted)}:host([variant=flat][contrasted][color^=success]){color:var(--ods-color-success-500);background-color:var(--ods-color-success-500-contrasted)}:host([variant=flat][contrasted][color^=info]){color:var(--ods-color-info-500);background-color:var(--ods-color-info-500-contrasted)}:host([variant=flat][contrasted][color^=promotion]){color:var(--ods-color-promotion-500);background-color:var(--ods-color-promotion-500-contrasted)}:host([variant=flat]:not([disabled])[selectable]:not([color]):hover),:host([variant=flat]:not([disabled])[selectable]:not([color]):focus),:host([variant=flat]:not([disabled])[selectable]:not([color]):active){background-color:var(--ods-color-default-200)}:host([variant=flat]:not([disabled])[selectable][color^=default]:hover),:host([variant=flat]:not([disabled])[selectable][color^=default]:focus),:host([variant=flat]:not([disabled])[selectable][color^=default]:active){background-color:var(--ods-color-default-200)}:host([variant=flat]:not([disabled])[selectable][color^=primary]:hover),:host([variant=flat]:not([disabled])[selectable][color^=primary]:focus),:host([variant=flat]:not([disabled])[selectable][color^=primary]:active){background-color:var(--ods-color-primary-200)}:host([variant=flat]:not([disabled])[selectable][color^=text]:hover),:host([variant=flat]:not([disabled])[selectable][color^=text]:focus),:host([variant=flat]:not([disabled])[selectable][color^=text]:active){background-color:var(--ods-color-text-200)}:host([variant=flat]:not([disabled])[selectable][color^=accent]:hover),:host([variant=flat]:not([disabled])[selectable][color^=accent]:focus),:host([variant=flat]:not([disabled])[selectable][color^=accent]:active){background-color:var(--ods-color-accent-200)}:host([variant=flat]:not([disabled])[selectable][color^=error]:hover),:host([variant=flat]:not([disabled])[selectable][color^=error]:focus),:host([variant=flat]:not([disabled])[selectable][color^=error]:active){background-color:var(--ods-color-error-200)}:host([variant=flat]:not([disabled])[selectable][color^=warning]:hover),:host([variant=flat]:not([disabled])[selectable][color^=warning]:focus),:host([variant=flat]:not([disabled])[selectable][color^=warning]:active){background-color:var(--ods-color-warning-200)}:host([variant=flat]:not([disabled])[selectable][color^=success]:hover),:host([variant=flat]:not([disabled])[selectable][color^=success]:focus),:host([variant=flat]:not([disabled])[selectable][color^=success]:active){background-color:var(--ods-color-success-200)}:host([variant=flat]:not([disabled])[selectable][color^=info]:hover),:host([variant=flat]:not([disabled])[selectable][color^=info]:focus),:host([variant=flat]:not([disabled])[selectable][color^=info]:active){background-color:var(--ods-color-info-200)}:host([variant=flat]:not([disabled])[selectable][color^=promotion]:hover),:host([variant=flat]:not([disabled])[selectable][color^=promotion]:focus),:host([variant=flat]:not([disabled])[selectable][color^=promotion]:active){background-color:var(--ods-color-promotion-200)}:host([variant=flat]:not([disabled])[selectable]:not([color]):active){border-color:var(--ods-color-default-500)}:host([variant=flat]:not([disabled])[selectable][color^=default]:active){border-color:var(--ods-color-default-500)}:host([variant=flat]:not([disabled])[selectable][color^=primary]:active){border-color:var(--ods-color-primary-500)}:host([variant=flat]:not([disabled])[selectable][color^=text]:active){border-color:var(--ods-color-text-500)}:host([variant=flat]:not([disabled])[selectable][color^=accent]:active){border-color:var(--ods-color-accent-500)}:host([variant=flat]:not([disabled])[selectable][color^=error]:active){border-color:var(--ods-color-error-500)}:host([variant=flat]:not([disabled])[selectable][color^=warning]:active){border-color:var(--ods-color-warning-500)}:host([variant=flat]:not([disabled])[selectable][color^=success]:active){border-color:var(--ods-color-success-500)}:host([variant=flat]:not([disabled])[selectable][color^=info]:active){border-color:var(--ods-color-info-500)}:host([variant=flat]:not([disabled])[selectable][color^=promotion]:active){border-color:var(--ods-color-promotion-500)}:host([variant=flat]:not([disabled])[selectable][contrasted]:not([color]):hover),:host([variant=flat]:not([disabled])[selectable][contrasted]:not([color]):focus){background-color:var(--ods-color-default-100)}:host([variant=flat]:not([disabled])[selectable][contrasted][color^=default]:hover),:host([variant=flat]:not([disabled])[selectable][contrasted][color^=default]:focus){background-color:var(--ods-color-default-100)}:host([variant=flat]:not([disabled])[selectable][contrasted][color^=primary]:hover),:host([variant=flat]:not([disabled])[selectable][contrasted][color^=primary]:focus){background-color:var(--ods-color-primary-100)}:host([variant=flat]:not([disabled])[selectable][contrasted][color^=text]:hover),:host([variant=flat]:not([disabled])[selectable][contrasted][color^=text]:focus){background-color:var(--ods-color-text-100)}:host([variant=flat]:not([disabled])[selectable][contrasted][color^=accent]:hover),:host([variant=flat]:not([disabled])[selectable][contrasted][color^=accent]:focus){background-color:var(--ods-color-accent-100)}:host([variant=flat]:not([disabled])[selectable][contrasted][color^=error]:hover),:host([variant=flat]:not([disabled])[selectable][contrasted][color^=error]:focus){background-color:var(--ods-color-error-100)}:host([variant=flat]:not([disabled])[selectable][contrasted][color^=warning]:hover),:host([variant=flat]:not([disabled])[selectable][contrasted][color^=warning]:focus){background-color:var(--ods-color-warning-100)}:host([variant=flat]:not([disabled])[selectable][contrasted][color^=success]:hover),:host([variant=flat]:not([disabled])[selectable][contrasted][color^=success]:focus){background-color:var(--ods-color-success-100)}:host([variant=flat]:not([disabled])[selectable][contrasted][color^=info]:hover),:host([variant=flat]:not([disabled])[selectable][contrasted][color^=info]:focus){background-color:var(--ods-color-info-100)}:host([variant=flat]:not([disabled])[selectable][contrasted][color^=promotion]:hover),:host([variant=flat]:not([disabled])[selectable][contrasted][color^=promotion]:focus){background-color:var(--ods-color-promotion-100)}:host([variant=flat]:not([disabled])[selectable][contrasted]:not([color]):active){background-color:var(--ods-color-default-200)}:host([variant=flat]:not([disabled])[selectable][contrasted][color^=default]:active){background-color:var(--ods-color-default-200)}:host([variant=flat]:not([disabled])[selectable][contrasted][color^=primary]:active){background-color:var(--ods-color-primary-200)}:host([variant=flat]:not([disabled])[selectable][contrasted][color^=text]:active){background-color:var(--ods-color-text-200)}:host([variant=flat]:not([disabled])[selectable][contrasted][color^=accent]:active){background-color:var(--ods-color-accent-200)}:host([variant=flat]:not([disabled])[selectable][contrasted][color^=error]:active){background-color:var(--ods-color-error-200)}:host([variant=flat]:not([disabled])[selectable][contrasted][color^=warning]:active){background-color:var(--ods-color-warning-200)}:host([variant=flat]:not([disabled])[selectable][contrasted][color^=success]:active){background-color:var(--ods-color-success-200)}:host([variant=flat]:not([disabled])[selectable][contrasted][color^=info]:active){background-color:var(--ods-color-info-200)}:host([variant=flat]:not([disabled])[selectable][contrasted][color^=promotion]:active){background-color:var(--ods-color-promotion-200)}:host([variant=stroked]){background-color:initial}:host([variant=stroked]:not([color])){color:var(--ods-color-default-500);border-color:var(--ods-color-default-500)}:host([variant=stroked][color^=default]){color:var(--ods-color-default-500);border-color:var(--ods-color-default-500)}:host([variant=stroked][color^=primary]){color:var(--ods-color-primary-500);border-color:var(--ods-color-primary-500)}:host([variant=stroked][color^=text]){color:var(--ods-color-text-500);border-color:var(--ods-color-text-500)}:host([variant=stroked][color^=accent]){color:var(--ods-color-accent-500);border-color:var(--ods-color-accent-500)}:host([variant=stroked][color^=error]){color:var(--ods-color-error-500);border-color:var(--ods-color-error-500)}:host([variant=stroked][color^=warning]){color:var(--ods-color-warning-500);border-color:var(--ods-color-warning-500)}:host([variant=stroked][color^=success]){color:var(--ods-color-success-500);border-color:var(--ods-color-success-500)}:host([variant=stroked][color^=info]){color:var(--ods-color-info-500);border-color:var(--ods-color-info-500)}:host([variant=stroked][color^=promotion]){color:var(--ods-color-promotion-500);border-color:var(--ods-color-promotion-500)}:host([variant=stroked][contrasted]:not([color])){color:var(--ods-color-default-500-contrasted);border-color:var(--ods-color-default-500-contrasted)}:host([variant=stroked][contrasted][color^=default]){color:var(--ods-color-default-500-contrasted);border-color:var(--ods-color-default-500-contrasted)}:host([variant=stroked][contrasted][color^=primary]){color:var(--ods-color-primary-500-contrasted);border-color:var(--ods-color-primary-500-contrasted)}:host([variant=stroked][contrasted][color^=text]){color:var(--ods-color-text-500-contrasted);border-color:var(--ods-color-text-500-contrasted)}:host([variant=stroked][contrasted][color^=accent]){color:var(--ods-color-accent-500-contrasted);border-color:var(--ods-color-accent-500-contrasted)}:host([variant=stroked][contrasted][color^=error]){color:var(--ods-color-error-500-contrasted);border-color:var(--ods-color-error-500-contrasted)}:host([variant=stroked][contrasted][color^=warning]){color:var(--ods-color-warning-500-contrasted);border-color:var(--ods-color-warning-500-contrasted)}:host([variant=stroked][contrasted][color^=success]){color:var(--ods-color-success-500-contrasted);border-color:var(--ods-color-success-500-contrasted)}:host([variant=stroked][contrasted][color^=info]){color:var(--ods-color-info-500-contrasted);border-color:var(--ods-color-info-500-contrasted)}:host([variant=stroked][contrasted][color^=promotion]){color:var(--ods-color-promotion-500-contrasted);border-color:var(--ods-color-promotion-500-contrasted)}:host([variant=stroked]:not([disabled])[selectable]:not([color]):hover),:host([variant=stroked]:not([disabled])[selectable]:not([color]):focus){background-color:var(--ods-color-default-100)}:host([variant=stroked]:not([disabled])[selectable][color^=default]:hover),:host([variant=stroked]:not([disabled])[selectable][color^=default]:focus){background-color:var(--ods-color-default-100)}:host([variant=stroked]:not([disabled])[selectable][color^=primary]:hover),:host([variant=stroked]:not([disabled])[selectable][color^=primary]:focus){background-color:var(--ods-color-primary-100)}:host([variant=stroked]:not([disabled])[selectable][color^=text]:hover),:host([variant=stroked]:not([disabled])[selectable][color^=text]:focus){background-color:var(--ods-color-text-100)}:host([variant=stroked]:not([disabled])[selectable][color^=accent]:hover),:host([variant=stroked]:not([disabled])[selectable][color^=accent]:focus){background-color:var(--ods-color-accent-100)}:host([variant=stroked]:not([disabled])[selectable][color^=error]:hover),:host([variant=stroked]:not([disabled])[selectable][color^=error]:focus){background-color:var(--ods-color-error-100)}:host([variant=stroked]:not([disabled])[selectable][color^=warning]:hover),:host([variant=stroked]:not([disabled])[selectable][color^=warning]:focus){background-color:var(--ods-color-warning-100)}:host([variant=stroked]:not([disabled])[selectable][color^=success]:hover),:host([variant=stroked]:not([disabled])[selectable][color^=success]:focus){background-color:var(--ods-color-success-100)}:host([variant=stroked]:not([disabled])[selectable][color^=info]:hover),:host([variant=stroked]:not([disabled])[selectable][color^=info]:focus){background-color:var(--ods-color-info-100)}:host([variant=stroked]:not([disabled])[selectable][color^=promotion]:hover),:host([variant=stroked]:not([disabled])[selectable][color^=promotion]:focus){background-color:var(--ods-color-promotion-100)}:host([variant=stroked]:not([disabled])[selectable][contrasted]:not([color]):hover),:host([variant=stroked]:not([disabled])[selectable][contrasted]:not([color]):focus){background-color:var(--ods-color-default-100);border-color:var(--ods-color-default-100);color:var(--ods-color-default-100-contrasted)}:host([variant=stroked]:not([disabled])[selectable][contrasted][color^=default]:hover),:host([variant=stroked]:not([disabled])[selectable][contrasted][color^=default]:focus){background-color:var(--ods-color-default-100);border-color:var(--ods-color-default-100);color:var(--ods-color-default-100-contrasted)}:host([variant=stroked]:not([disabled])[selectable][contrasted][color^=primary]:hover),:host([variant=stroked]:not([disabled])[selectable][contrasted][color^=primary]:focus){background-color:var(--ods-color-primary-100);border-color:var(--ods-color-primary-100);color:var(--ods-color-primary-100-contrasted)}:host([variant=stroked]:not([disabled])[selectable][contrasted][color^=text]:hover),:host([variant=stroked]:not([disabled])[selectable][contrasted][color^=text]:focus){background-color:var(--ods-color-text-100);border-color:var(--ods-color-text-100);color:var(--ods-color-text-100-contrasted)}:host([variant=stroked]:not([disabled])[selectable][contrasted][color^=accent]:hover),:host([variant=stroked]:not([disabled])[selectable][contrasted][color^=accent]:focus){background-color:var(--ods-color-accent-100);border-color:var(--ods-color-accent-100);color:var(--ods-color-accent-100-contrasted)}:host([variant=stroked]:not([disabled])[selectable][contrasted][color^=error]:hover),:host([variant=stroked]:not([disabled])[selectable][contrasted][color^=error]:focus){background-color:var(--ods-color-error-100);border-color:var(--ods-color-error-100);color:var(--ods-color-error-100-contrasted)}:host([variant=stroked]:not([disabled])[selectable][contrasted][color^=warning]:hover),:host([variant=stroked]:not([disabled])[selectable][contrasted][color^=warning]:focus){background-color:var(--ods-color-warning-100);border-color:var(--ods-color-warning-100);color:var(--ods-color-warning-100-contrasted)}:host([variant=stroked]:not([disabled])[selectable][contrasted][color^=success]:hover),:host([variant=stroked]:not([disabled])[selectable][contrasted][color^=success]:focus){background-color:var(--ods-color-success-100);border-color:var(--ods-color-success-100);color:var(--ods-color-success-100-contrasted)}:host([variant=stroked]:not([disabled])[selectable][contrasted][color^=info]:hover),:host([variant=stroked]:not([disabled])[selectable][contrasted][color^=info]:focus){background-color:var(--ods-color-info-100);border-color:var(--ods-color-info-100);color:var(--ods-color-info-100-contrasted)}:host([variant=stroked]:not([disabled])[selectable][contrasted][color^=promotion]:hover),:host([variant=stroked]:not([disabled])[selectable][contrasted][color^=promotion]:focus){background-color:var(--ods-color-promotion-100);border-color:var(--ods-color-promotion-100);color:var(--ods-color-promotion-100-contrasted)}:host([variant=stroked]:not([disabled])[selectable]:not([color]):active){background-color:var(--ods-color-default-200)}:host([variant=stroked]:not([disabled])[selectable][color^=default]:active){background-color:var(--ods-color-default-200)}:host([variant=stroked]:not([disabled])[selectable][color^=primary]:active){background-color:var(--ods-color-primary-200)}:host([variant=stroked]:not([disabled])[selectable][color^=text]:active){background-color:var(--ods-color-text-200)}:host([variant=stroked]:not([disabled])[selectable][color^=accent]:active){background-color:var(--ods-color-accent-200)}:host([variant=stroked]:not([disabled])[selectable][color^=error]:active){background-color:var(--ods-color-error-200)}:host([variant=stroked]:not([disabled])[selectable][color^=warning]:active){background-color:var(--ods-color-warning-200)}:host([variant=stroked]:not([disabled])[selectable][color^=success]:active){background-color:var(--ods-color-success-200)}:host([variant=stroked]:not([disabled])[selectable][color^=info]:active){background-color:var(--ods-color-info-200)}:host([variant=stroked]:not([disabled])[selectable][color^=promotion]:active){background-color:var(--ods-color-promotion-200)}:host([variant=stroked]:not([disabled])[selectable][contrasted]:not([color]):active){background-color:var(--ods-color-default-200);border-color:var(--ods-color-default-200);color:var(--ods-color-default-200-contrasted)}:host([variant=stroked]:not([disabled])[selectable][contrasted][color^=default]:active){background-color:var(--ods-color-default-200);border-color:var(--ods-color-default-200);color:var(--ods-color-default-200-contrasted)}:host([variant=stroked]:not([disabled])[selectable][contrasted][color^=primary]:active){background-color:var(--ods-color-primary-200);border-color:var(--ods-color-primary-200);color:var(--ods-color-primary-200-contrasted)}:host([variant=stroked]:not([disabled])[selectable][contrasted][color^=text]:active){background-color:var(--ods-color-text-200);border-color:var(--ods-color-text-200);color:var(--ods-color-text-200-contrasted)}:host([variant=stroked]:not([disabled])[selectable][contrasted][color^=accent]:active){background-color:var(--ods-color-accent-200);border-color:var(--ods-color-accent-200);color:var(--ods-color-accent-200-contrasted)}:host([variant=stroked]:not([disabled])[selectable][contrasted][color^=error]:active){background-color:var(--ods-color-error-200);border-color:var(--ods-color-error-200);color:var(--ods-color-error-200-contrasted)}:host([variant=stroked]:not([disabled])[selectable][contrasted][color^=warning]:active){background-color:var(--ods-color-warning-200);border-color:var(--ods-color-warning-200);color:var(--ods-color-warning-200-contrasted)}:host([variant=stroked]:not([disabled])[selectable][contrasted][color^=success]:active){background-color:var(--ods-color-success-200);border-color:var(--ods-color-success-200);color:var(--ods-color-success-200-contrasted)}:host([variant=stroked]:not([disabled])[selectable][contrasted][color^=info]:active){background-color:var(--ods-color-info-200);border-color:var(--ods-color-info-200);color:var(--ods-color-info-200-contrasted)}:host([variant=stroked]:not([disabled])[selectable][contrasted][color^=promotion]:active){background-color:var(--ods-color-promotion-200);border-color:var(--ods-color-promotion-200);color:var(--ods-color-promotion-200-contrasted)}:host([size=sm]){border-radius:var(--ods-size-chip-sm-border-radius);border-width:var(--ods-size-chip-sm-border-width);height:var(--ods-size-chip-sm-height);padding:var(--ods-size-chip-sm-padding)}:host([size=sm]) .chip__wrapper{gap:var(--ods-size-chip-sm-inline-margin)}:host([size=md]){border-radius:var(--ods-size-chip-md-border-radius);border-width:var(--ods-size-chip-md-border-width);height:var(--ods-size-chip-md-height);padding:var(--ods-size-chip-md-padding)}:host([size=md]) .chip__wrapper{gap:var(--ods-size-chip-md-inline-margin)}:host([size=sm]) .chip__wrapper{font-family:var(--ods-typography-body-100-font-family);font-size:var(--ods-typography-body-100-font-size);font-style:var(--ods-typography-body-100-font-style);font-weight:var(--ods-typography-body-100-font-weight);letter-spacing:var(--ods-typography-body-100-letter-spacing);line-height:var(--ods-typography-body-100-line-height)}:host([size=md]) .chip__wrapper{font-family:var(--ods-typography-body-400-font-family);font-size:var(--ods-typography-body-400-font-size);font-style:var(--ods-typography-body-400-font-style);font-weight:var(--ods-typography-body-400-font-weight);letter-spacing:var(--ods-typography-body-400-letter-spacing);line-height:var(--ods-typography-body-400-line-height)}";

const OsdsChip$1 = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.__attachShadow();
    this.controller = new OdsChipController(this);
    /** @see OdsChipAttributes.color */
    this.color = DEFAULT_ATTRIBUTE.color;
    /** @see OdsChipAttributes.contrasted */
    this.contrasted = DEFAULT_ATTRIBUTE.contrasted;
    /** @see OdsChipAttributes.disabled */
    this.disabled = DEFAULT_ATTRIBUTE.disabled;
    /** @see OdsChipAttributes.inline */
    this.inline = DEFAULT_ATTRIBUTE.inline;
    /** @see OdsChipAttributes.removable */
    this.removable = DEFAULT_ATTRIBUTE.removable;
    /** @see OdsChipAttributes.selectable */
    this.selectable = DEFAULT_ATTRIBUTE.selectable;
    /** @see OdsChipAttributes.size */
    this.size = DEFAULT_ATTRIBUTE.size;
    /** @see OdsChipAttributes.variant */
    this.variant = DEFAULT_ATTRIBUTE.variant;
  }
  /**
   * @see OdsChipBehavior.beforeRender
   */
  beforeRender() {
    this.controller.validateAttributes();
  }
  componentWillRender() {
    this.beforeRender();
  }
  render() {
    const { color, contrasted, removable, selectable } = this;
    const isSelectable = selectable || removable;
    return (h(Host, { tabindex: isSelectable ? '0' : '-1' }, h("span", { class: 'chip__wrapper' }, h("slot", null), removable ?
      h("osds-icon", { color: color, contrasted: contrasted, name: ODS_ICON_NAME.CLOSE, size: ODS_ICON_SIZE.xxs }) : '')));
  }
  get el() { return this; }
  static get style() { return osdsChipCss; }
}, [1, "osds-chip", {
    "color": [513],
    "contrasted": [516],
    "disabled": [516],
    "inline": [516],
    "removable": [516],
    "selectable": [516],
    "size": [513],
    "variant": [513]
  }]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["osds-chip", "osds-icon"];
  components.forEach(tagName => { switch (tagName) {
    case "osds-chip":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, OsdsChip$1);
      }
      break;
    case "osds-icon":
      if (!customElements.get(tagName)) {
        defineCustomElement$2();
      }
      break;
  } });
}

const OsdsChip = OsdsChip$1;
const defineCustomElement = defineCustomElement$1;

export { OsdsChip, defineCustomElement };
