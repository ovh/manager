import { proxyCustomElement, HTMLElement, h, Host } from '@stencil/core/internal/client';
import { d as defineCustomElement$6, O as ODS_ICON_SIZE } from './osds-icon2.js';
import { O as ODS_THEME_TYPOGRAPHY_LEVEL$1, a as ODS_THEME_TYPOGRAPHY_SIZE$1 } from './ods-theme-typography-size.js';
import { d as defineCustomElement$3 } from './osds-text2.js';
import { d as defineCustomElement$5 } from './osds-link2.js';
import { d as defineCustomElement$4 } from './osds-skeleton2.js';
import { d as defineCustomElement$2 } from './osds-tile2.js';

var ODS_THEME_COLOR_HUE;
(function (ODS_THEME_COLOR_HUE) {
    ODS_THEME_COLOR_HUE["_000"] = "000";
    ODS_THEME_COLOR_HUE["_050"] = "050";
    ODS_THEME_COLOR_HUE["_075"] = "075";
    ODS_THEME_COLOR_HUE["_100"] = "100";
    ODS_THEME_COLOR_HUE["_200"] = "200";
    ODS_THEME_COLOR_HUE["_300"] = "300";
    ODS_THEME_COLOR_HUE["_400"] = "400";
    ODS_THEME_COLOR_HUE["_500"] = "500";
    ODS_THEME_COLOR_HUE["_600"] = "600";
    ODS_THEME_COLOR_HUE["_700"] = "700";
    ODS_THEME_COLOR_HUE["_800"] = "800";
    ODS_THEME_COLOR_HUE["_900"] = "900";
    ODS_THEME_COLOR_HUE["_1000"] = "1000";
})(ODS_THEME_COLOR_HUE || (ODS_THEME_COLOR_HUE = {}));
Object.freeze(Object.values(ODS_THEME_COLOR_HUE));

var ODS_THEME_COLOR_INTENT;
(function (ODS_THEME_COLOR_INTENT) {
    ODS_THEME_COLOR_INTENT["accent"] = "accent";
    ODS_THEME_COLOR_INTENT["default"] = "default";
    ODS_THEME_COLOR_INTENT["error"] = "error";
    ODS_THEME_COLOR_INTENT["info"] = "info";
    ODS_THEME_COLOR_INTENT["primary"] = "primary";
    ODS_THEME_COLOR_INTENT["promotion"] = "promotion";
    ODS_THEME_COLOR_INTENT["success"] = "success";
    ODS_THEME_COLOR_INTENT["text"] = "text";
    ODS_THEME_COLOR_INTENT["warning"] = "warning";
})(ODS_THEME_COLOR_INTENT || (ODS_THEME_COLOR_INTENT = {}));
Object.freeze(Object.values(ODS_THEME_COLOR_INTENT));

// TODO not used, remove?
var ODS_THEME_SIZE;
(function (ODS_THEME_SIZE) {
    ODS_THEME_SIZE["_100"] = "100";
    ODS_THEME_SIZE["_200"] = "200";
    ODS_THEME_SIZE["_300"] = "300";
    ODS_THEME_SIZE["_400"] = "400";
    ODS_THEME_SIZE["_500"] = "500";
    ODS_THEME_SIZE["_600"] = "600";
    ODS_THEME_SIZE["_700"] = "700";
    ODS_THEME_SIZE["_800"] = "800";
    ODS_THEME_SIZE["_900"] = "900";
})(ODS_THEME_SIZE || (ODS_THEME_SIZE = {}));
Object.freeze(Object.values(ODS_THEME_SIZE));

var ODS_THEME_TYPOGRAPHY_LEVEL;
(function (ODS_THEME_TYPOGRAPHY_LEVEL) {
    ODS_THEME_TYPOGRAPHY_LEVEL["body"] = "body";
    ODS_THEME_TYPOGRAPHY_LEVEL["button"] = "button";
    ODS_THEME_TYPOGRAPHY_LEVEL["caption"] = "caption";
    ODS_THEME_TYPOGRAPHY_LEVEL["heading"] = "heading";
    ODS_THEME_TYPOGRAPHY_LEVEL["subheading"] = "subheading";
})(ODS_THEME_TYPOGRAPHY_LEVEL || (ODS_THEME_TYPOGRAPHY_LEVEL = {}));
Object.freeze(Object.values(ODS_THEME_TYPOGRAPHY_LEVEL));

var ODS_THEME_TYPOGRAPHY_SIZE;
(function (ODS_THEME_TYPOGRAPHY_SIZE) {
    ODS_THEME_TYPOGRAPHY_SIZE["_100"] = "100";
    ODS_THEME_TYPOGRAPHY_SIZE["_200"] = "200";
    ODS_THEME_TYPOGRAPHY_SIZE["_300"] = "300";
    ODS_THEME_TYPOGRAPHY_SIZE["_400"] = "400";
    ODS_THEME_TYPOGRAPHY_SIZE["_500"] = "500";
    ODS_THEME_TYPOGRAPHY_SIZE["_600"] = "600";
    ODS_THEME_TYPOGRAPHY_SIZE["_700"] = "700";
    ODS_THEME_TYPOGRAPHY_SIZE["_800"] = "800";
})(ODS_THEME_TYPOGRAPHY_SIZE || (ODS_THEME_TYPOGRAPHY_SIZE = {}));
Object.freeze(Object.values(ODS_THEME_TYPOGRAPHY_SIZE));

/**
 * default `ODS` configuration applied if there no custom configuration made on client side
 */
const odsDefaultConfig = {
    id: Date.now(),
    logging: {
        active: false,
        color: true
    },
    asset: {
        path: ''
    }
};

/**
 * get the window element typed as ODS window
 */
function getOdsWindow() {
    // node protection or other env : window may not exist
    if (typeof window !== "undefined") {
        const win = window;
        win.winId = win.winId ? win.winId : Date.now();
        //console.log('want window id=', (win as any).winId, { setupId: win.ods?.setupId, config: win.ods?.config });
        return win;
    }
    return undefined;
}

class OdsLogger {
    constructor(context, prefix) {
        this.id = Math.floor(Math.random() * 10e6);
        this.prefixColor = "color: white;background:#004fd6;font-weight: bold; font-size:10px; padding:2px 6px; border-radius: 5px 0px 0px 5px";
        this.contextColor = "color: black;background:#d4e0e7;font-weight: bold; font-size:10px; padding:2px 6px; border-radius: 0px 5px 5px 0px";
        this.prefix = "ODS";
        this.context = "";
        this.prefix = prefix ? prefix : this.prefix;
        this.context = context;
    }
    get log() {
        return this.getConsole('log');
    }
    get warn() {
        return this.getConsole('warn');
    }
    get error() {
        return this.getConsole('error');
    }
    get info() {
        return this.getConsole('info');
    }
    get debug() {
        return this.getConsole('debug');
    }
    get trace() {
        return this.getConsole('trace');
    }
    getConsole(method) {
        if (this.logging) {
            if (this.color) {
                // eslint-disable-next-line no-console
                return console[method].bind(null, `${this.prefix ? '%c' : '%s'}${this.prefix} %c${this.context}`, this.prefix ? this.prefixColor : '', this.contextColor);
            }
            // eslint-disable-next-line no-console
            return console[method].bind(null, `[${this.prefix}${this.prefix ? '|' : ''}${this.context}]`);
        }
        else {
            // dummy function if nlog not enabled
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            return (() => {
            });
        }
    }
    get logging() {
        var _a, _b, _c;
        const win = getOdsWindow();
        const active = (_c = (_b = (_a = win === null || win === void 0 ? void 0 : win.ods) === null || _a === void 0 ? void 0 : _a.config) === null || _b === void 0 ? void 0 : _b.logging) === null || _c === void 0 ? void 0 : _c.active;
        return active === undefined ? odsDefaultConfig.logging.active : active;
    }
    get color() {
        var _a, _b, _c;
        const win = getOdsWindow();
        const color = (_c = (_b = (_a = win === null || win === void 0 ? void 0 : win.ods) === null || _a === void 0 ? void 0 : _a.config) === null || _b === void 0 ? void 0 : _b.logging) === null || _c === void 0 ? void 0 : _c.color;
        return color === undefined ? odsDefaultConfig.logging.color : color;
    }
}

// replaced on built file
const VERSION = '9.0.3';

class OdsExternalLogger extends OdsLogger {
    constructor(context, prefix) {
        super(context, prefix);
        this.prefixColor = "color: white;background:#403f3e;font-weight: bold; font-size:10px; padding:2px 6px; border-radius: 5px 0px 0px 5px";
        this.contextColor = "color: black;background:#d4e0e7;font-weight: bold; font-size:10px; padding:2px 6px; border-radius: 0px 5px 5px 0px";
        // specific prefix for an external logging that using this logger
        this.prefix = 'CUSTOM';
    }
}

/**
 * Main class that controls ODS :
 * - manage / create this singleton
 * - fire an event once created
 * - managing logging: enable or not
 * - managing i18n: in order to connect a translation system
 *
 * @example enable log on `ODS` initialization via javascript. make sure to execute this before any `ODS` script.
 * ```html
 * <script type="module">
 *   document.addEventListener('odsInitialized', ({detail}) => {
 *     const instance = detail.instance;
 *     instance.logging(true);
 *     const logger = new instance.logger('MY CONTEXT');
 *     logger.log('odsInitialized received');
 *   })
 * </script>
 * ```
 *
 * @example enable log on `ODS` initialization via typescript. make sure to execute this before any `ODS` script.
 * ```typescript
 * import {
 *   OdsInitializedEvent,
 *   OdsInitializedEventName
 * } from '@ovhcloud/ods-core';
 *
 * document.addEventListener(OdsInitializedEventName, (event) => {
 *   const evt = event as OdsInitializedEvent;
 *   const instance = evt.detail.instance;
 *   instance.logging(true);
 *   const logger = new instance.logger('MY CONTEXT');
 *   logger.log('odsInitialized received');
 * })
 * ```
 *
 * @example enable log on demand via typescript
 * ```typescript
 * import { Ods } from '@ovhcloud/ods-core';
 * Ods.instance().logging(true);
 * ```
 *
 * @example configure different element of `ODS`
 * ```typescript
 * import { Ods } from '@ovhcloud/ods-core';
 * const my translationCbk: OdsI18nHook = (key, values) => `${key} to be translated`;
 * Ods.instance()
 *   .logging(true)
 *   .i18n(translationCbk);
 * ```
 *
 * @example use the embedded logger of `ODS` via typescript
 * ```typescript
 * import { Ods } from '@ovhcloud/ods-core';
 *
 * Ods.instance().logging(true);
 * const myLogger = new (Ods.instance().logger)('MY CONTEXT');
 *
 * myLogger.log('my log with the same logger as ODS');
 * myLogger.error('my error log with the same logger as ODS');
 *
 * Ods.instance().logging(false);
 * myLogger.log('my log is disabled as ods log is disabled');
 * ```
 *
 */
class Ods {
    constructor(config) {
        this.config = config;
        this.version = VERSION;
        this.genericLogger = new OdsLogger('ODS', 'OVHcloud Design System');
        const winA = window;
        // console.log('ici winA', (winA as any));
        // console.log('ici winA', (winA as any).gg);
        winA.gg = 'winA';
        // console.log('ici winA', (winA as any).gg);
        this.config = config;
        this.instanceId = Ods._instanceId++;
        // console.log(`[Ods #${this.instanceId}]`, 'ods constructor');
        this.genericLogger.info('Hi! You are using OVHcloud Design System components, feel free to check out https://go/odsdoc/', {
            id: this.instanceId,
            version: this.version
        });
        const odsEvent = new CustomEvent("odsInitialized", {
            detail: {
                version: VERSION,
                instance: this,
                config
            },
            bubbles: true,
            cancelable: true,
            composed: false,
        });
        document.dispatchEvent(odsEvent);
    }
    /**
     * @deprecated use `Ods.instance()`
     */
    static configure() {
        return this.instance();
    }
    /**
     * get or create the ODS instance.
     * The singleton is retrieved if exist
     */
    static instance(config = odsDefaultConfig) {
        var _a, _b;
        // console.log('[Ods] static ods.instance');
        // console.log('[Ods] static ods.instance', 'already set instance number: this._instance.instanceId', this._instance?.instanceId);
        if (!this._instance) {
            const win = getOdsWindow();
            // check if an instance is already set through the window for the concerned version
            // example: if we inserted ods twice in an application or if we inserted an independent package plus le bundled package, we are in this case
            // console.log('[Ods] static ods.instance win.ods', win?.ods);
            // console.log('[Ods] static ods.instance win.ods.config', win?.ods?.config);
            if (((_a = win === null || win === void 0 ? void 0 : win.ods) === null || _a === void 0 ? void 0 : _a.versions) && ((_b = win === null || win === void 0 ? void 0 : win.ods) === null || _b === void 0 ? void 0 : _b.versions[VERSION])) {
                // console.log('[Ods] static ods.instance already set in win', win.ods.versions[ VERSION ].instanceId);
                this._instance = win.ods.versions[VERSION];
            }
            else {
                // console.log('[Ods] static ods.instance create new instance');
                // console.log('[Ods] static ods.instance', 'wanted config=', JSON.stringify(config));
                this._instance = new Ods(config);
                // console.log('[Ods] static ods.instance created with id=', this._instance.instanceId);
            }
        }
        return this._instance;
    }
    /**
     * set your custom i18n callback function that is processing translations.
     * the callback has to return the translated string processed by your translation system.
     * @param hook - function that will receive the values to translate
     */
    i18n(hook) {
        this.i18nHook = hook;
        return this;
    }
    getI18n() {
        return this.i18nHook;
    }
    /**
     * set the default asset path where to find the different assets of `ODS`.
     * @param path - path like `my-ods-svg/`
     */
    assetPath(path) {
        // console.log(`[Ods #${this.instanceId}].assetPath`, 'ods wanted path', path);
        this.config.asset.path = path;
        // console.log(`[Ods #${this.instanceId}].assetPath`, 'path set. this.config=', this.config);
        return this;
    }
    /**
     * get all the configuration of `ODS`
     */
    getConfig() {
        // console.log(`[Ods #${this.instanceId}].getCOnfig`, 'this.config=', JSON.stringify(this.config));
        return this.config;
    }
    /**
     * enable or not the logging for the `ODS` instance
     * @param enable - your boolean
     */
    logging(enable) {
        this.config.logging.active = enable;
        return this;
    }
    isLoggingActive() {
        return this.config.logging.active;
    }
    get logger() {
        return OdsExternalLogger;
    }
}
Ods._instanceId = 0;

/**
 * initialize all properties of window that are specific to `ods`.
 * initialize empty object `versions` and the setup id.
 * it gives w window object with filled `ods` properties
 * @param win - window object
 * @param baseConfig - base config to set by default
 */
function initializeProperties(win, baseConfig) {
    // initialize ods if needed
    if (!win.ods) {
        win.ods = {
            setupId: Date.now(),
            // with our own object reference
            config: baseConfig
        };
    }
    // initialize ods versions if needed
    if (!win.ods.versions) {
        win.ods.versions = {};
    }
    // initialize a setup id if needed (user made an ods setup config himself)
    win.ods.setupId = win.ods.setupId || Date.now();
    return win;
}
/**
 * initialize logging config.
 * it takes default config if not filled correctly
 * @param odsConf - config of `ods`
 */
function applyLoggingConf(odsConf) {
    odsConf.logging = odsConf.logging || odsDefaultConfig.logging;
    // make sure all props are defined and typed correctly (can be not correctly initialized on client side)
    // warn: the object reference does not have to be modified, so we have to modify only
    const formatLogging = (odsConf) => {
        var _a, _b;
        return ({
            active: typeof ((_a = odsConf === null || odsConf === void 0 ? void 0 : odsConf.logging) === null || _a === void 0 ? void 0 : _a.active) !== 'boolean' ? odsDefaultConfig.logging.active : odsConf.logging.active,
            color: typeof ((_b = odsConf === null || odsConf === void 0 ? void 0 : odsConf.logging) === null || _b === void 0 ? void 0 : _b.color) !== 'boolean' ? odsDefaultConfig.logging.color : odsConf.logging.color
        });
    };
    const formatted = formatLogging(odsConf);
    odsConf.logging.active = formatted.active;
    odsConf.logging.color = formatted.color;
}
function applyAssetConf(odsConf) {
    odsConf.asset = odsConf.asset || odsDefaultConfig.asset;
    odsConf.asset.path = odsConf.asset.path ? odsConf.asset.path : odsDefaultConfig.asset.path;
}
/**
 * create all the globals properties set up into window (when available).
 */
function odsSetup( /*userConfig?: OdsConfig*/) {
    //console.log('odsSetup');
    const win = getOdsWindow();
    if (win) {
        // make our object reference, based on default
        const configObjectRef = Object.assign(Object.assign({}, odsDefaultConfig), { id: Date.now() });
        const winFilled = initializeProperties(win, configObjectRef);
        let config;
        // take here the client object reference or our own made before
        const odsConf = winFilled.ods.config;
        if (odsConf) {
            applyLoggingConf(odsConf);
            applyAssetConf(odsConf);
            config = odsConf;
        }
        else {
            // our own
            config = configObjectRef;
        }
        // set the current ODS version into the right property and create the instance if needed
        //console.log('[odsSetup] VERSION', VERSION);
        if (!winFilled.ods.versions[VERSION]) {
            //console.log('[odsSetup] call instance');
            winFilled.ods.versions[VERSION] = Ods.instance(config);
        }
        // always set as latest the superior detected versions
        if (!winFilled.ods.latest || (winFilled.ods.latest && VERSION > winFilled.ods.latest.version)) {
            winFilled.ods.latest = winFilled.ods.versions[VERSION];
        }
    }
    //console.log('odsSetup end');
}
const win = getOdsWindow();
if (win)
    win.odsSetup = odsSetup;

var ODS_COUNTRY_ISO_CODE;
(function (ODS_COUNTRY_ISO_CODE) {
    ODS_COUNTRY_ISO_CODE["AR"] = "ar";
    ODS_COUNTRY_ISO_CODE["AS"] = "as";
    ODS_COUNTRY_ISO_CODE["AT"] = "at";
    ODS_COUNTRY_ISO_CODE["AU"] = "au";
    ODS_COUNTRY_ISO_CODE["AW"] = "aw";
    ODS_COUNTRY_ISO_CODE["AX"] = "ax";
    ODS_COUNTRY_ISO_CODE["AZ"] = "az";
    ODS_COUNTRY_ISO_CODE["BA"] = "ba";
    ODS_COUNTRY_ISO_CODE["BB"] = "bb";
    ODS_COUNTRY_ISO_CODE["BD"] = "bd";
    ODS_COUNTRY_ISO_CODE["BE"] = "be";
    ODS_COUNTRY_ISO_CODE["BF"] = "bf";
    ODS_COUNTRY_ISO_CODE["BG"] = "bg";
    ODS_COUNTRY_ISO_CODE["BH"] = "bh";
    ODS_COUNTRY_ISO_CODE["BI"] = "bi";
    ODS_COUNTRY_ISO_CODE["BJ"] = "bj";
    ODS_COUNTRY_ISO_CODE["BL"] = "bl";
    ODS_COUNTRY_ISO_CODE["BM"] = "bm";
    ODS_COUNTRY_ISO_CODE["BN"] = "bn";
    ODS_COUNTRY_ISO_CODE["BO"] = "bo";
    ODS_COUNTRY_ISO_CODE["BQ"] = "bq";
    ODS_COUNTRY_ISO_CODE["BR"] = "br";
    ODS_COUNTRY_ISO_CODE["BS"] = "bs";
    ODS_COUNTRY_ISO_CODE["BT"] = "bt";
    ODS_COUNTRY_ISO_CODE["BW"] = "bw";
    ODS_COUNTRY_ISO_CODE["BY"] = "by";
    ODS_COUNTRY_ISO_CODE["BZ"] = "bz";
    ODS_COUNTRY_ISO_CODE["CA"] = "ca";
    ODS_COUNTRY_ISO_CODE["CC"] = "cc";
    ODS_COUNTRY_ISO_CODE["CD"] = "cd";
    ODS_COUNTRY_ISO_CODE["CF"] = "cf";
    ODS_COUNTRY_ISO_CODE["CG"] = "cg";
    ODS_COUNTRY_ISO_CODE["CH"] = "ch";
    ODS_COUNTRY_ISO_CODE["CI"] = "ci";
    ODS_COUNTRY_ISO_CODE["CK"] = "ck";
    ODS_COUNTRY_ISO_CODE["CL"] = "cl";
    ODS_COUNTRY_ISO_CODE["CM"] = "cm";
    ODS_COUNTRY_ISO_CODE["CN"] = "cn";
    ODS_COUNTRY_ISO_CODE["CO"] = "co";
    ODS_COUNTRY_ISO_CODE["CR"] = "cr";
    ODS_COUNTRY_ISO_CODE["CU"] = "cu";
    ODS_COUNTRY_ISO_CODE["CV"] = "cv";
    ODS_COUNTRY_ISO_CODE["CW"] = "cw";
    ODS_COUNTRY_ISO_CODE["CX"] = "cx";
    ODS_COUNTRY_ISO_CODE["CY"] = "cy";
    ODS_COUNTRY_ISO_CODE["CZ"] = "cz";
    ODS_COUNTRY_ISO_CODE["DE"] = "de";
    ODS_COUNTRY_ISO_CODE["DJ"] = "dj";
    ODS_COUNTRY_ISO_CODE["DK"] = "dk";
    ODS_COUNTRY_ISO_CODE["DM"] = "dm";
    ODS_COUNTRY_ISO_CODE["DO"] = "do";
    ODS_COUNTRY_ISO_CODE["DZ"] = "dz";
    ODS_COUNTRY_ISO_CODE["EC"] = "ec";
    ODS_COUNTRY_ISO_CODE["EE"] = "ee";
    ODS_COUNTRY_ISO_CODE["EG"] = "eg";
    ODS_COUNTRY_ISO_CODE["EH"] = "eh";
    ODS_COUNTRY_ISO_CODE["ER"] = "er";
    ODS_COUNTRY_ISO_CODE["ES"] = "es";
    ODS_COUNTRY_ISO_CODE["ET"] = "et";
    ODS_COUNTRY_ISO_CODE["EU"] = "eu";
    ODS_COUNTRY_ISO_CODE["FI"] = "fi";
    ODS_COUNTRY_ISO_CODE["FJ"] = "fj";
    ODS_COUNTRY_ISO_CODE["FK"] = "fk";
    ODS_COUNTRY_ISO_CODE["FM"] = "fm";
    ODS_COUNTRY_ISO_CODE["FO"] = "fo";
    ODS_COUNTRY_ISO_CODE["FR"] = "fr";
    ODS_COUNTRY_ISO_CODE["GA"] = "ga";
    ODS_COUNTRY_ISO_CODE["GB"] = "gb";
    ODS_COUNTRY_ISO_CODE["GD"] = "gd";
    ODS_COUNTRY_ISO_CODE["GE"] = "ge";
    ODS_COUNTRY_ISO_CODE["GF"] = "gf";
    ODS_COUNTRY_ISO_CODE["GG"] = "gg";
    ODS_COUNTRY_ISO_CODE["GH"] = "gh";
    ODS_COUNTRY_ISO_CODE["GI"] = "gi";
    ODS_COUNTRY_ISO_CODE["GL"] = "gl";
    ODS_COUNTRY_ISO_CODE["GM"] = "gm";
    ODS_COUNTRY_ISO_CODE["GN"] = "gn";
    ODS_COUNTRY_ISO_CODE["GP"] = "gp";
    ODS_COUNTRY_ISO_CODE["GQ"] = "gq";
    ODS_COUNTRY_ISO_CODE["GR"] = "gr";
    ODS_COUNTRY_ISO_CODE["GS"] = "gs";
    ODS_COUNTRY_ISO_CODE["GT"] = "gt";
    ODS_COUNTRY_ISO_CODE["GU"] = "gu";
    ODS_COUNTRY_ISO_CODE["GW"] = "gw";
    ODS_COUNTRY_ISO_CODE["GY"] = "gy";
    ODS_COUNTRY_ISO_CODE["HK"] = "hk";
    ODS_COUNTRY_ISO_CODE["HN"] = "hn";
    ODS_COUNTRY_ISO_CODE["HR"] = "hr";
    ODS_COUNTRY_ISO_CODE["HT"] = "ht";
    ODS_COUNTRY_ISO_CODE["HU"] = "hu";
    ODS_COUNTRY_ISO_CODE["ID"] = "id";
    ODS_COUNTRY_ISO_CODE["IE"] = "ie";
    ODS_COUNTRY_ISO_CODE["IL"] = "il";
    ODS_COUNTRY_ISO_CODE["IM"] = "im";
    ODS_COUNTRY_ISO_CODE["IN"] = "in";
    ODS_COUNTRY_ISO_CODE["IO"] = "io";
    ODS_COUNTRY_ISO_CODE["IQ"] = "iq";
    ODS_COUNTRY_ISO_CODE["IR"] = "ir";
    ODS_COUNTRY_ISO_CODE["IS"] = "is";
    ODS_COUNTRY_ISO_CODE["IT"] = "it";
    ODS_COUNTRY_ISO_CODE["JE"] = "je";
    ODS_COUNTRY_ISO_CODE["JM"] = "jm";
    ODS_COUNTRY_ISO_CODE["JO"] = "jo";
    ODS_COUNTRY_ISO_CODE["JP"] = "jp";
    ODS_COUNTRY_ISO_CODE["KE"] = "ke";
    ODS_COUNTRY_ISO_CODE["KN"] = "kn";
    ODS_COUNTRY_ISO_CODE["KP"] = "kp";
    ODS_COUNTRY_ISO_CODE["KR"] = "kr";
    ODS_COUNTRY_ISO_CODE["KW"] = "kw";
    ODS_COUNTRY_ISO_CODE["KY"] = "ky";
    ODS_COUNTRY_ISO_CODE["KZ"] = "kz";
    ODS_COUNTRY_ISO_CODE["LA"] = "la";
    ODS_COUNTRY_ISO_CODE["LB"] = "lb";
    ODS_COUNTRY_ISO_CODE["LC"] = "lc";
    ODS_COUNTRY_ISO_CODE["LI"] = "li";
    ODS_COUNTRY_ISO_CODE["LR"] = "lr";
    ODS_COUNTRY_ISO_CODE["LS"] = "ls";
    ODS_COUNTRY_ISO_CODE["LT"] = "lt";
    ODS_COUNTRY_ISO_CODE["LU"] = "lu";
    ODS_COUNTRY_ISO_CODE["LV"] = "lv";
    ODS_COUNTRY_ISO_CODE["LY"] = "ly";
    ODS_COUNTRY_ISO_CODE["MA"] = "ma";
    ODS_COUNTRY_ISO_CODE["MC"] = "mc";
    ODS_COUNTRY_ISO_CODE["MD"] = "md";
    ODS_COUNTRY_ISO_CODE["ME"] = "me";
    ODS_COUNTRY_ISO_CODE["MF"] = "mf";
    ODS_COUNTRY_ISO_CODE["MG"] = "mg";
    ODS_COUNTRY_ISO_CODE["MH"] = "mh";
    ODS_COUNTRY_ISO_CODE["MK"] = "mk";
    ODS_COUNTRY_ISO_CODE["ML"] = "ml";
    ODS_COUNTRY_ISO_CODE["MM"] = "mm";
    ODS_COUNTRY_ISO_CODE["MN"] = "mn";
    ODS_COUNTRY_ISO_CODE["MO"] = "mo";
    ODS_COUNTRY_ISO_CODE["MP"] = "mp";
    ODS_COUNTRY_ISO_CODE["MQ"] = "mq";
    ODS_COUNTRY_ISO_CODE["MR"] = "mr";
    ODS_COUNTRY_ISO_CODE["MS"] = "ms";
    ODS_COUNTRY_ISO_CODE["MT"] = "mt";
    ODS_COUNTRY_ISO_CODE["MU"] = "mu";
    ODS_COUNTRY_ISO_CODE["MV"] = "mv";
    ODS_COUNTRY_ISO_CODE["MW"] = "mw";
    ODS_COUNTRY_ISO_CODE["MX"] = "mx";
    ODS_COUNTRY_ISO_CODE["MY"] = "my";
    ODS_COUNTRY_ISO_CODE["MZ"] = "mz";
    ODS_COUNTRY_ISO_CODE["NA"] = "na";
    ODS_COUNTRY_ISO_CODE["NC"] = "nc";
    ODS_COUNTRY_ISO_CODE["NE"] = "ne";
    ODS_COUNTRY_ISO_CODE["NF"] = "nf";
    ODS_COUNTRY_ISO_CODE["NG"] = "ng";
    ODS_COUNTRY_ISO_CODE["NI"] = "ni";
    ODS_COUNTRY_ISO_CODE["NL"] = "nl";
    ODS_COUNTRY_ISO_CODE["NO"] = "no";
    ODS_COUNTRY_ISO_CODE["NP"] = "np";
    ODS_COUNTRY_ISO_CODE["NR"] = "nr";
    ODS_COUNTRY_ISO_CODE["NU"] = "nu";
    ODS_COUNTRY_ISO_CODE["NZ"] = "nz";
    ODS_COUNTRY_ISO_CODE["OM"] = "om";
    ODS_COUNTRY_ISO_CODE["PA"] = "pa";
    ODS_COUNTRY_ISO_CODE["PF"] = "pf";
    ODS_COUNTRY_ISO_CODE["PG"] = "pg";
    ODS_COUNTRY_ISO_CODE["PH"] = "ph";
    ODS_COUNTRY_ISO_CODE["PK"] = "pk";
    ODS_COUNTRY_ISO_CODE["PL"] = "pl";
    ODS_COUNTRY_ISO_CODE["PM"] = "pm";
    ODS_COUNTRY_ISO_CODE["PN"] = "pn";
    ODS_COUNTRY_ISO_CODE["PR"] = "pr";
    ODS_COUNTRY_ISO_CODE["PS"] = "ps";
    ODS_COUNTRY_ISO_CODE["PT"] = "pt";
    ODS_COUNTRY_ISO_CODE["PW"] = "pw";
    ODS_COUNTRY_ISO_CODE["PY"] = "py";
    ODS_COUNTRY_ISO_CODE["QA"] = "qa";
    ODS_COUNTRY_ISO_CODE["RE"] = "re";
    ODS_COUNTRY_ISO_CODE["RO"] = "ro";
    ODS_COUNTRY_ISO_CODE["RS"] = "rs";
    ODS_COUNTRY_ISO_CODE["RU"] = "ru";
    ODS_COUNTRY_ISO_CODE["RW"] = "rw";
    ODS_COUNTRY_ISO_CODE["SA"] = "sa";
    ODS_COUNTRY_ISO_CODE["SB"] = "sb";
    ODS_COUNTRY_ISO_CODE["SC"] = "sc";
    ODS_COUNTRY_ISO_CODE["SD"] = "sd";
    ODS_COUNTRY_ISO_CODE["SE"] = "se";
    ODS_COUNTRY_ISO_CODE["SG"] = "sg";
    ODS_COUNTRY_ISO_CODE["SH"] = "sh";
    ODS_COUNTRY_ISO_CODE["SI"] = "si";
    ODS_COUNTRY_ISO_CODE["SJ"] = "sj";
    ODS_COUNTRY_ISO_CODE["SK"] = "sk";
    ODS_COUNTRY_ISO_CODE["SL"] = "sl";
    ODS_COUNTRY_ISO_CODE["SM"] = "sm";
    ODS_COUNTRY_ISO_CODE["SN"] = "sn";
    ODS_COUNTRY_ISO_CODE["SO"] = "so";
    ODS_COUNTRY_ISO_CODE["SR"] = "sr";
    ODS_COUNTRY_ISO_CODE["SS"] = "ss";
    ODS_COUNTRY_ISO_CODE["ST"] = "st";
    ODS_COUNTRY_ISO_CODE["SV"] = "sv";
    ODS_COUNTRY_ISO_CODE["SX"] = "sx";
    ODS_COUNTRY_ISO_CODE["SY"] = "sy";
    ODS_COUNTRY_ISO_CODE["SZ"] = "sz";
    ODS_COUNTRY_ISO_CODE["TC"] = "tc";
    ODS_COUNTRY_ISO_CODE["TD"] = "td";
    ODS_COUNTRY_ISO_CODE["TF"] = "tf";
    ODS_COUNTRY_ISO_CODE["TG"] = "tg";
    ODS_COUNTRY_ISO_CODE["TH"] = "th";
    ODS_COUNTRY_ISO_CODE["TJ"] = "tj";
    ODS_COUNTRY_ISO_CODE["TK"] = "tk";
    ODS_COUNTRY_ISO_CODE["TL"] = "tl";
    ODS_COUNTRY_ISO_CODE["TM"] = "tm";
    ODS_COUNTRY_ISO_CODE["TN"] = "tn";
    ODS_COUNTRY_ISO_CODE["TO"] = "to";
    ODS_COUNTRY_ISO_CODE["TR"] = "tr";
    ODS_COUNTRY_ISO_CODE["TT"] = "tt";
    ODS_COUNTRY_ISO_CODE["TV"] = "tv";
    ODS_COUNTRY_ISO_CODE["TW"] = "tw";
    ODS_COUNTRY_ISO_CODE["TZ"] = "tz";
    ODS_COUNTRY_ISO_CODE["UA"] = "ua";
    ODS_COUNTRY_ISO_CODE["UG"] = "ug";
    ODS_COUNTRY_ISO_CODE["UM"] = "um";
    ODS_COUNTRY_ISO_CODE["UN"] = "un";
    ODS_COUNTRY_ISO_CODE["UNIA"] = "unia";
    ODS_COUNTRY_ISO_CODE["US"] = "us";
    ODS_COUNTRY_ISO_CODE["UY"] = "uy";
    ODS_COUNTRY_ISO_CODE["UZ"] = "uz";
    ODS_COUNTRY_ISO_CODE["VA"] = "va";
    ODS_COUNTRY_ISO_CODE["VC"] = "vc";
    ODS_COUNTRY_ISO_CODE["VE"] = "ve";
    ODS_COUNTRY_ISO_CODE["VG"] = "vg";
    ODS_COUNTRY_ISO_CODE["VI"] = "vi";
    ODS_COUNTRY_ISO_CODE["VN"] = "vn";
    ODS_COUNTRY_ISO_CODE["VU"] = "vu";
    ODS_COUNTRY_ISO_CODE["WF"] = "wf";
    ODS_COUNTRY_ISO_CODE["WS"] = "ws";
    ODS_COUNTRY_ISO_CODE["XK"] = "xk";
    ODS_COUNTRY_ISO_CODE["YE"] = "ye";
    ODS_COUNTRY_ISO_CODE["YT"] = "yt";
    ODS_COUNTRY_ISO_CODE["ZA"] = "za";
    ODS_COUNTRY_ISO_CODE["ZM"] = "zm";
})(ODS_COUNTRY_ISO_CODE || (ODS_COUNTRY_ISO_CODE = {}));
Object.keys(ODS_COUNTRY_ISO_CODE)
    .map((key) => ODS_COUNTRY_ISO_CODE[key]);

var OlesIpsumGeneration;
(function (OlesIpsumGeneration) {
    OlesIpsumGeneration["paragraphs"] = "paragraphs";
    OlesIpsumGeneration["sentences"] = "sentences";
    OlesIpsumGeneration["words"] = "words";
})(OlesIpsumGeneration || (OlesIpsumGeneration = {}));
Object.keys(OlesIpsumGeneration)
    .map((key) => OlesIpsumGeneration[key]);

/**
 * See rel attribute valid for <a> and <area> on
 * https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel
 */
var OdsHTMLAnchorElementRel;
(function (OdsHTMLAnchorElementRel) {
    OdsHTMLAnchorElementRel["alternate"] = "alternate";
    OdsHTMLAnchorElementRel["author"] = "author";
    OdsHTMLAnchorElementRel["bookmark"] = "bookmark";
    OdsHTMLAnchorElementRel["external"] = "external";
    OdsHTMLAnchorElementRel["help"] = "help";
    OdsHTMLAnchorElementRel["license"] = "license";
    OdsHTMLAnchorElementRel["me"] = "me";
    OdsHTMLAnchorElementRel["next"] = "next";
    OdsHTMLAnchorElementRel["nofollow"] = "nofollow";
    OdsHTMLAnchorElementRel["noopener"] = "noopener";
    OdsHTMLAnchorElementRel["noreferrer"] = "noreferrer";
    OdsHTMLAnchorElementRel["opener"] = "opener";
    OdsHTMLAnchorElementRel["prev"] = "prev";
    OdsHTMLAnchorElementRel["search"] = "search";
    OdsHTMLAnchorElementRel["tag"] = "tag";
})(OdsHTMLAnchorElementRel || (OdsHTMLAnchorElementRel = {}));
Object.keys(OdsHTMLAnchorElementRel).map(key => OdsHTMLAnchorElementRel[key]);

/**
 * See target attribute on
 * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#attr-target
 */
var OdsHTMLAnchorElementTarget;
(function (OdsHTMLAnchorElementTarget) {
    OdsHTMLAnchorElementTarget["_blank"] = "_blank";
    OdsHTMLAnchorElementTarget["_self"] = "_self";
    OdsHTMLAnchorElementTarget["_parent"] = "_parent";
    OdsHTMLAnchorElementTarget["_top"] = "_top";
})(OdsHTMLAnchorElementTarget || (OdsHTMLAnchorElementTarget = {}));
Object.keys(OdsHTMLAnchorElementTarget).map(key => OdsHTMLAnchorElementTarget[key]);

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

const defaultLocale = 'fr-FR';

/**
 * Import dynamically the right translation file
 */
async function getTranslations(locale) {
  try {
    switch (locale) {
      case 'de-DE':
        return await import('./Messages_de_DE.js');
      case 'en-GB':
        return await import('./Messages_en_GB.js');
      case 'es-ES':
        return await import('./Messages_es_ES.js');
      case 'fr-CA':
        return await import('./Messages_fr_CA.js');
      case 'fr-FR':
        return await import('./Messages_fr_FR.js');
      case 'it-IT':
        return await import('./Messages_it_IT.js');
      case 'pl-PL':
        return await import('./Messages_pl_PL.js');
      case 'pt-PT':
        return await import('./Messages_pt_PT.js');
      default:
        return await import('./Messages_fr_FR.js');
    }
  }
  catch (_a) {
    throw new Error(`No translations found for locale ${locale}`);
  }
}

const mscTileCss = ".msc-tile-wrapper{display:block;text-decoration:none;height:100%}.msc-tile-wrapper .msc-ods-tile{width:100%;height:100%}.msc-tile-wrapper .tile-content{display:flex;flex-direction:column}.msc-tile-wrapper .tile-content .tile-img{height:auto;max-width:100%;margin:var(--ods-size-03) auto}.msc-tile-wrapper .tile-content .tile-type{display:block;margin-bottom:var(--ods-size-05)}.msc-tile-wrapper .tile-content .tile-badge-list{display:inline-flex;margin-left:var(--ods-size-03)}.msc-tile-wrapper .tile-content .tile-title{display:block;margin-bottom:var(--ods-size-05)}.msc-tile-wrapper .tile-content .tile-description{display:block;margin-bottom:var(--ods-size-04)}.msc-tile-wrapper .tile-content .link-icon{margin-left:var(--ods-size-04)}";

const MscTile$1 = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.__attachShadow();
    /** URL of the link that will be opened when clicking on the Tile or on the "see more" link */
    this.href = '';
    /** Tile title */
    this.tileTitle = '';
    /** Tile description */
    this.tileDescription = '';
    /** Optional header image URL */
    this.imgSrc = '';
    /** Optional image alt text */
    this.imgAlt = '';
    /** Label sent to the tracking service */
    this.dataTracking = '';
    this.hoverable = false;
    this.locale = defaultLocale;
    this.tabIndex = 0;
    this.hasFooterContent = false;
    this.handleFooterSlotChange = (event) => {
      var _a;
      this.hasFooterContent =
        ((_a = event.currentTarget) === null || _a === void 0 ? void 0 : _a.assignedElements().length) > 0;
    };
  }
  async updateTranslations() {
    this.localeStrings = await getTranslations(this.locale);
  }
  async componentWillLoad() {
    this.updateTranslations();
  }
  onFocus(event) {
    var _a, _b, _c, _d;
    event.preventDefault();
    if (this.hasFooterContent) {
      (_b = (_a = this.host.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector('osds-link')) === null || _b === void 0 ? void 0 : _b.focus();
      this.tabIndex = -1;
    }
    else {
      (_d = (_c = this.host.shadowRoot) === null || _c === void 0 ? void 0 : _c.querySelector('a')) === null || _d === void 0 ? void 0 : _d.focus();
    }
  }
  onBlur() {
    this.tabIndex = 0;
  }
  render() {
    var _a;
    if (!this.localeStrings) {
      return (h("osds-tile", { rounded: true }, h("osds-skeleton", null)));
    }
    const content = (h("osds-tile", { class: "msc-ods-tile", color: ODS_THEME_COLOR_INTENT.primary, hoverable: true, rounded: true, inline: true }, h("div", { class: "tile-content" }, this.imgSrc && (h("img", { class: "tile-img", src: this.imgSrc, alt: this.imgAlt })), h("osds-text", { class: "tile-type", level: ODS_THEME_TYPOGRAPHY_LEVEL$1.heading, size: ODS_THEME_TYPOGRAPHY_SIZE$1._200, color: ODS_THEME_COLOR_INTENT.primary }, this.category, h("span", { class: "tile-badge-list" }, h("slot", { name: "badges" }))), h("osds-text", { class: "tile-title", level: ODS_THEME_TYPOGRAPHY_LEVEL$1.heading, size: ODS_THEME_TYPOGRAPHY_SIZE$1._400, color: ODS_THEME_COLOR_INTENT.text }, this.tileTitle), h("osds-text", { class: "tile-description", level: ODS_THEME_TYPOGRAPHY_LEVEL$1.body, size: ODS_THEME_TYPOGRAPHY_SIZE$1._400, color: ODS_THEME_COLOR_INTENT.default }, this.tileDescription), h("osds-link", { tabIndex: this.hasFooterContent ? 0 : -1, "data-tracking": this.dataTracking, color: ODS_THEME_COLOR_INTENT.primary, href: this.href, target: OdsHTMLAnchorElementTarget._blank }, (_a = this.localeStrings) === null || _a === void 0 ? void 0 :
      _a.see_more_label, h("osds-icon", { slot: "end", class: "link-icon", "aria-hidden": "true", size: ODS_ICON_SIZE.xxs, name: this.isExternalHref
        ? ODS_ICON_NAME.EXTERNAL_LINK
        : ODS_ICON_NAME.ARROW_RIGHT, color: ODS_THEME_COLOR_INTENT.primary })), h("slot", { name: "footer", onSlotchange: this.handleFooterSlotChange }))));
    return (h(Host, { tabIndex: this.tabIndex }, this.hasFooterContent ? (h("div", { class: "msc-tile-wrapper" }, content)) : (h("a", { class: "msc-tile-wrapper", target: OdsHTMLAnchorElementTarget._blank, rel: OdsHTMLAnchorElementRel.noopener, href: this.href, onFocus: () => {
        this.tabIndex = -1;
      }, onBlur: () => {
        this.tabIndex = 0;
      } }, content))));
  }
  get host() { return this; }
  static get watchers() { return {
    "locale": ["updateTranslations"]
  }; }
  static get style() { return mscTileCss; }
}, [1, "msc-tile", {
    "href": [1],
    "isExternalHref": [4, "is-external-href"],
    "category": [1],
    "tileTitle": [1, "tile-title"],
    "tileDescription": [1, "tile-description"],
    "imgSrc": [1, "img-src"],
    "imgAlt": [1, "img-alt"],
    "dataTracking": [1, "data-tracking"],
    "hoverable": [4],
    "locale": [1],
    "localeStrings": [32],
    "tabIndex": [32],
    "hasFooterContent": [32]
  }, [[0, "focus", "onFocus"], [0, "blur", "onBlur"]]]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["msc-tile", "osds-icon", "osds-link", "osds-skeleton", "osds-text", "osds-tile"];
  components.forEach(tagName => { switch (tagName) {
    case "msc-tile":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, MscTile$1);
      }
      break;
    case "osds-icon":
      if (!customElements.get(tagName)) {
        defineCustomElement$6();
      }
      break;
    case "osds-link":
      if (!customElements.get(tagName)) {
        defineCustomElement$5();
      }
      break;
    case "osds-skeleton":
      if (!customElements.get(tagName)) {
        defineCustomElement$4();
      }
      break;
    case "osds-text":
      if (!customElements.get(tagName)) {
        defineCustomElement$3();
      }
      break;
    case "osds-tile":
      if (!customElements.get(tagName)) {
        defineCustomElement$2();
      }
      break;
  } });
}

const MscTile = MscTile$1;
const defineCustomElement = defineCustomElement$1;

export { MscTile, defineCustomElement$1 as d, defineCustomElement };
