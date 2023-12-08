const t={id:Date.now(),logging:{active:!1,color:!0},asset:{path:""}};function n(){if("undefined"!=typeof window){const t=window;return t.winId=t.winId?t.winId:Date.now(),t}}class i{constructor(t,n){this.id=Math.floor(1e7*Math.random()),this.prefixColor="color: white;background:#004fd6;font-weight: bold; font-size:10px; padding:2px 6px; border-radius: 5px 0px 0px 5px",this.contextColor="color: black;background:#d4e0e7;font-weight: bold; font-size:10px; padding:2px 6px; border-radius: 0px 5px 5px 0px",this.prefix="ODS",this.context="",this.prefix=n||this.prefix,this.context=t}get log(){return this.getConsole("log")}get warn(){return this.getConsole("warn")}get error(){return this.getConsole("error")}get info(){return this.getConsole("info")}get debug(){return this.getConsole("debug")}get trace(){return this.getConsole("trace")}getConsole(t){return this.logging?this.color?console[t].bind(null,`${this.prefix?"%c":"%s"}${this.prefix} %c${this.context}`,this.prefix?this.prefixColor:"",this.contextColor):console[t].bind(null,`[${this.prefix}${this.prefix?"|":""}${this.context}]`):()=>{}}get logging(){var i,e,o;const s=n(),r=null===(o=null===(e=null===(i=null==s?void 0:s.ods)||void 0===i?void 0:i.config)||void 0===e?void 0:e.logging)||void 0===o?void 0:o.active;return void 0===r?t.logging.active:r}get color(){var i,e,o;const s=n(),r=null===(o=null===(e=null===(i=null==s?void 0:s.ods)||void 0===i?void 0:i.config)||void 0===e?void 0:e.logging)||void 0===o?void 0:o.color;return void 0===r?t.logging.color:r}}class e extends i{constructor(t,n){super(t,n),this.prefixColor="color: white;background:#403f3e;font-weight: bold; font-size:10px; padding:2px 6px; border-radius: 5px 0px 0px 5px",this.contextColor="color: black;background:#d4e0e7;font-weight: bold; font-size:10px; padding:2px 6px; border-radius: 0px 5px 5px 0px",this.prefix="CUSTOM"}}class o{constructor(t){this.config=t,this.version="9.0.3",this.genericLogger=new i("ODS","OVHcloud Design System"),window.gg="winA",this.config=t,this.instanceId=o._instanceId++,this.genericLogger.info("Hi! You are using OVHcloud Design System components, feel free to check out https://go/odsdoc/",{id:this.instanceId,version:this.version});const n=new CustomEvent("odsInitialized",{detail:{version:"9.0.3",instance:this,config:t},bubbles:!0,cancelable:!0,composed:!1});document.dispatchEvent(n)}static configure(){return this.instance()}static instance(i=t){var e,s;if(!this._instance){const t=n();this._instance=(null===(e=null==t?void 0:t.ods)||void 0===e?void 0:e.versions)&&(null===(s=null==t?void 0:t.ods)||void 0===s?void 0:s.versions["9.0.3"])?t.ods.versions["9.0.3"]:new o(i)}return this._instance}i18n(t){return this.i18nHook=t,this}getI18n(){return this.i18nHook}assetPath(t){return this.config.asset.path=t,this}getConfig(){return this.config}logging(t){return this.config.logging.active=t,this}isLoggingActive(){return this.config.logging.active}get logger(){return e}}o._instanceId=0;const s=n();var r,c,l,u;s&&(s.odsSetup=function(){const i=n();if(i){const n=Object.assign(Object.assign({},t),{id:Date.now()}),e=function(t,n){return t.ods||(t.ods={setupId:Date.now(),config:n}),t.ods.versions||(t.ods.versions={}),t.ods.setupId=t.ods.setupId||Date.now(),t}(i,n);let s;const r=e.ods.config;r?(function(n){n.logging=n.logging||t.logging;const i=(n=>{var i,e;return{active:"boolean"!=typeof(null===(i=null==n?void 0:n.logging)||void 0===i?void 0:i.active)?t.logging.active:n.logging.active,color:"boolean"!=typeof(null===(e=null==n?void 0:n.logging)||void 0===e?void 0:e.color)?t.logging.color:n.logging.color}})(n);n.logging.active=i.active,n.logging.color=i.color}(r),function(n){n.asset=n.asset||t.asset,n.asset.path=n.asset.path?n.asset.path:t.asset.path}(r),s=r):s=n,e.ods.versions["9.0.3"]||(e.ods.versions["9.0.3"]=o.instance(s)),(!e.ods.latest||e.ods.latest&&"9.0.3">e.ods.latest.version)&&(e.ods.latest=e.ods.versions["9.0.3"])}}),function(t){t.AR="ar",t.AS="as",t.AT="at",t.AU="au",t.AW="aw",t.AX="ax",t.AZ="az",t.BA="ba",t.BB="bb",t.BD="bd",t.BE="be",t.BF="bf",t.BG="bg",t.BH="bh",t.BI="bi",t.BJ="bj",t.BL="bl",t.BM="bm",t.BN="bn",t.BO="bo",t.BQ="bq",t.BR="br",t.BS="bs",t.BT="bt",t.BW="bw",t.BY="by",t.BZ="bz",t.CA="ca",t.CC="cc",t.CD="cd",t.CF="cf",t.CG="cg",t.CH="ch",t.CI="ci",t.CK="ck",t.CL="cl",t.CM="cm",t.CN="cn",t.CO="co",t.CR="cr",t.CU="cu",t.CV="cv",t.CW="cw",t.CX="cx",t.CY="cy",t.CZ="cz",t.DE="de",t.DJ="dj",t.DK="dk",t.DM="dm",t.DO="do",t.DZ="dz",t.EC="ec",t.EE="ee",t.EG="eg",t.EH="eh",t.ER="er",t.ES="es",t.ET="et",t.EU="eu",t.FI="fi",t.FJ="fj",t.FK="fk",t.FM="fm",t.FO="fo",t.FR="fr",t.GA="ga",t.GB="gb",t.GD="gd",t.GE="ge",t.GF="gf",t.GG="gg",t.GH="gh",t.GI="gi",t.GL="gl",t.GM="gm",t.GN="gn",t.GP="gp",t.GQ="gq",t.GR="gr",t.GS="gs",t.GT="gt",t.GU="gu",t.GW="gw",t.GY="gy",t.HK="hk",t.HN="hn",t.HR="hr",t.HT="ht",t.HU="hu",t.ID="id",t.IE="ie",t.IL="il",t.IM="im",t.IN="in",t.IO="io",t.IQ="iq",t.IR="ir",t.IS="is",t.IT="it",t.JE="je",t.JM="jm",t.JO="jo",t.JP="jp",t.KE="ke",t.KN="kn",t.KP="kp",t.KR="kr",t.KW="kw",t.KY="ky",t.KZ="kz",t.LA="la",t.LB="lb",t.LC="lc",t.LI="li",t.LR="lr",t.LS="ls",t.LT="lt",t.LU="lu",t.LV="lv",t.LY="ly",t.MA="ma",t.MC="mc",t.MD="md",t.ME="me",t.MF="mf",t.MG="mg",t.MH="mh",t.MK="mk",t.ML="ml",t.MM="mm",t.MN="mn",t.MO="mo",t.MP="mp",t.MQ="mq",t.MR="mr",t.MS="ms",t.MT="mt",t.MU="mu",t.MV="mv",t.MW="mw",t.MX="mx",t.MY="my",t.MZ="mz",t.NA="na",t.NC="nc",t.NE="ne",t.NF="nf",t.NG="ng",t.NI="ni",t.NL="nl",t.NO="no",t.NP="np",t.NR="nr",t.NU="nu",t.NZ="nz",t.OM="om",t.PA="pa",t.PF="pf",t.PG="pg",t.PH="ph",t.PK="pk",t.PL="pl",t.PM="pm",t.PN="pn",t.PR="pr",t.PS="ps",t.PT="pt",t.PW="pw",t.PY="py",t.QA="qa",t.RE="re",t.RO="ro",t.RS="rs",t.RU="ru",t.RW="rw",t.SA="sa",t.SB="sb",t.SC="sc",t.SD="sd",t.SE="se",t.SG="sg",t.SH="sh",t.SI="si",t.SJ="sj",t.SK="sk",t.SL="sl",t.SM="sm",t.SN="sn",t.SO="so",t.SR="sr",t.SS="ss",t.ST="st",t.SV="sv",t.SX="sx",t.SY="sy",t.SZ="sz",t.TC="tc",t.TD="td",t.TF="tf",t.TG="tg",t.TH="th",t.TJ="tj",t.TK="tk",t.TL="tl",t.TM="tm",t.TN="tn",t.TO="to",t.TR="tr",t.TT="tt",t.TV="tv",t.TW="tw",t.TZ="tz",t.UA="ua",t.UG="ug",t.UM="um",t.UN="un",t.UNIA="unia",t.US="us",t.UY="uy",t.UZ="uz",t.VA="va",t.VC="vc",t.VE="ve",t.VG="vg",t.VI="vi",t.VN="vn",t.VU="vu",t.WF="wf",t.WS="ws",t.XK="xk",t.YE="ye",t.YT="yt",t.ZA="za",t.ZM="zm"}(r||(r={})),Object.keys(r).map((t=>r[t])),function(t){t.paragraphs="paragraphs",t.sentences="sentences",t.words="words"}(c||(c={})),Object.keys(c).map((t=>c[t])),function(t){t.alternate="alternate",t.author="author",t.bookmark="bookmark",t.external="external",t.help="help",t.license="license",t.me="me",t.next="next",t.nofollow="nofollow",t.noopener="noopener",t.noreferrer="noreferrer",t.opener="opener",t.prev="prev",t.search="search",t.tag="tag"}(l||(l={})),Object.keys(l).map((t=>l[t])),function(t){t._blank="_blank",t._self="_self",t._parent="_parent",t._top="_top"}(u||(u={})),Object.keys(u).map((t=>u[t]));export{i as O}