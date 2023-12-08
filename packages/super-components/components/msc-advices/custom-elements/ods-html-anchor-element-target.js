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

/**
 * @param term - an enum value or a string
 * @param set - the enum reference that contains values
 */
function odsIsTermInEnum(term, set) {
    return Object.values(set).includes(term);
}

function OdsWarnComponentEnumAttribute(params) {
    if (!odsIsTermInEnum(params.attribute, params.attributeValues)) {
        params.logger.warn(`The ${params.attributeName} attribute must have a value from [${Object.values(params.attributeValues).join(', ')}]`);
    }
}
function OdsWarnComponentRangeAttribute(params) {
    if (params.attribute && (params.attribute > params.max || params.attribute < params.min)) {
        params.logger.warn(`The value attribute must be in bounds of [${[params.min, params.max].join(', ')}]`);
    }
}
function OdsWarnComponentAttribute(params, required = false) {
    if (required && !params.attribute) {
        return params.logger.warn(`Attribute ${params.attributeName} is required.`);
    }
    if (typeof params.attribute === 'number') {
        return OdsWarnComponentRangeAttribute(params);
    }
    return OdsWarnComponentEnumAttribute(params);
}

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

export { OdsLogger as O, OdsWarnComponentAttribute as a };
