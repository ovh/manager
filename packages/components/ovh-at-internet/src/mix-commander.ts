import { GenericTrackingData } from './track';

declare global {
  interface Window {
    tC: {
      trackPage(
        user_id: string,
        cty: string,
        page_name: string,
        additional_params: Record<string, unknown>,
      ): void;
    };
  }
}

const getMixCommanderScript = (clientId: string, region: string) => `
window.tC = window.tC || {};

/*
 * Save Rewrite referrer on the Manager.
 * To execute in the MixCommander script, before the Click and Site tracking script is trigerred.
 */
if(sessionStorage["prev_ref"] !== undefined){
  var temp = sessionStorage["prev_ref"];
  Object.defineProperty(document, "referrer", {get : function(){
    return temp;
  }});
  sessionStorage["prev_ref"] = undefined;
}

tC.getParamURL = tC.getParamURL || function(t, e) {
        if (void 0 === t)
            return "";
        t = t.toLowerCase();
        var n = new Array;
        if (!e) {
            var i = "";
            try {
                "undefined" != typeof top && void 0 !== top.document && (i = top.document)
            } catch (t) {}
            "" === i && (i = document),
            e = void 0 !== i.location ? i.location.href : ""
        }
        var r = 0
          , a = (e = e.replace(/%23/g, "#")).indexOf("?")
          , o = e.indexOf("#");
        -1 !== a ? r = a : -1 !== o && (r = o);
        var c = "";
        0 !== r && (c = e.substring(r + 1, e.length).split("#").join("&"));
        for (var s = (c = c.replace(/%3d/g, "=")).split("&"), d = 0; d < s.length; d++) {
            var C = s[d].split("=")
              , l = C.shift().toLowerCase()
              , p = C.join("=");
            n[l] = p
        }
        return void 0 !== n[t] ? n[t] : ""
    }
tC.domReady = tC.domReady || !1;
tC._domain = tC._domain || null;
tC.cookieCheck = function(t) {
    var e, n = (t = t || {}).domain ? ";domain=" + t.domain : "",
        i = t.samesite ? ";samesite=" + t.samesite : "",
        r = Math.random().toString(36).substr(2, 9),
        a = "tc_test_cookie=" + r + ";expires=0;path=/;" + i + n;
    document.cookie = a;
    var o = new RegExp("(?:^|; )tc_test_cookie=([^;]*)").exec(document.cookie);
    return o && (o = o[1]),
        (e = o === r) && (a = "tc_test_cookie=;expires=" + new Date(0).toUTCString() + ";path=/;" + i + n,
            document.cookie = a),
        e
}
tC.domain = tC.domain || function() {
    if (null != tC._domain)
        return tC._domain;
    var t = (tC.tc_hdoc.domain || "").toLowerCase().split("."),
        e = t.length;
    if (0 === e)
        return "";
    for (var n, i = !1, r = 2; !i && r <= e; ++r)
        n = "." + t.slice(e - r, e).join("."),
        i = tC.cookieCheck({
            domain: n
        });
    return tC._domain = n || "",
        tC._domain
}
tC.isSubdomain = tC.isSubdomain || function(t) {
    return t && "." === t[0] && (t = t.substr(1, t.length - 1)),
        new RegExp(t + "$").test(tC.tc_hdoc.domain)
}
tC.isCrossDomainContext = tC.isCrossDomainContext || function() {
    try {
        return window.top.document,
            !1
    } catch (t) {
        return !0
    }
}
tC.tc_hdoc = tC.tc_hdoc || !1,
    tC.tc_hdoc || (tC.tc_hdoc = tC.isCrossDomainContext() ? window.document : window.top.document),
    tC.getClientDnsList = tC.getClientDnsList || function() {
        return [] || []
    }
tC.getClientCollectDns = function() {
    if (tC.clientCollectDns)
        return tC.clientCollectDns;
    var t = tC.domain();
    if (null != t) {
        "." !== t[0] && (t = "." + t);
        var e = tC.getClientDnsList(),
            n = new RegExp("^[\\w,\\d,\\-]*" + t.replace(".", "\\.") + "$");
        return e.find((function(t) {
            return n.test(t)
        }))
    }
}
tC.clientCollectDns = tC.clientCollectDns || tC.getClientCollectDns(),
    tC.clientCampaignDns = tC.clientCampaignDns || "ovh.commander1.com",
    tC.getClientCampaignDns = function() {
        return tC.clientCampaignDns
    }
tC.isTcDns = function(t) {
    return "" !== (t = t || "") && (-1 !== t.indexOf(".commander1.com") || -1 !== t.indexOf(".tagcommander.com"))
}
tC.isCustomDns = function(t) {
    return "" !== (t = t || "") && !tC.isTcDns(t)
}
tC.campaignForceCookieFirst = 0;
tC.getClientCollectDns = function() {
    if (tC.clientCollectDns)
        return tC.clientCollectDns;
    var t = tC.domain();
    if (null != t) {
        "." !== t[0] && (t = "." + t);
        var e = tC.getClientDnsList(),
            n = new RegExp("^[\\w,\\d,\\-]*" + t.replace(".", "\\.") + "$");
        return e.find((function(t) {
            return n.test(t)
        }))
    }
};
tC.clientCollectDns = tC.clientCollectDns || tC.getClientCollectDns(),
    tC.clientCampaignDns = tC.clientCampaignDns || "ovh.commander1.com",
    tC.getClientCampaignDns = function() {
        return tC.clientCampaignDns
    },
    tC.isTcDns = function(t) {
        return "" !== (t = t || "") && (-1 !== t.indexOf(".commander1.com") || -1 !== t.indexOf(".tagcommander.com"))
    },
    tC.isCustomDns = function(t) {
        return "" !== (t = t || "") && !tC.isTcDns(t)
    },
    tC.campaignForceCookieFirst = 0,
    tC.isDOMReady = tC.isDOMReady || function() {
        if ("complete" === document.readyState || "loaded" === document.readyState)
            return !0;
        if ("interactive" !== document.readyState)
            return !1;
        if (!document.documentElement.doScroll)
            return !0;
        try {
            return document.documentElement.doScroll("left"),
                !0
        } catch (t) {
            return !1
        }
    };
tC.onDomReady = tC.onDomReady || function(t) {
    if (this.domReady)
        t();
    else {
        tC.waitingOnDomReadyCallBacks.push(t);
        var e = !1;
        document.addEventListener ? (e = !0,
                document.addEventListener("DOMContentLoaded", (function() {
                    document.removeEventListener("DOMContentLoaded", arguments.callee, !1),
                        tC.excuteOnDomReadyCallBacks()
                }), !1)) : document.attachEvent && (e = !0,
                document.attachEvent("onreadystatechange", (function() {
                    "complete" === document.readyState && (document.detachEvent("onreadystatechange", arguments.callee),
                        tC.excuteOnDomReadyCallBacks())
                })),
                document.documentElement.doScroll && window === window.top && function() {
                    if (!tC.domReady) {
                        try {
                            document.documentElement.doScroll("left")
                        } catch (t) {
                            return void setTimeout(arguments.callee, 0)
                        }
                        tC.excuteOnDomReadyCallBacks()
                    }
                }()),
            e || (window.onload = tC.excuteOnDomReadyCallBacks)
    }
}
tC.waitingOnDomReadyCallBacks = tC.waitingOnDomReadyCallBacks || [],
    tC.excuteOnDomReadyCallBacks = tC.excuteOnDomReadyCallBacks || function() {
        for (var t = 0; t < tC.waitingOnDomReadyCallBacks.length; t++)
            tC.waitingOnDomReadyCallBacks[t]();
        tC.waitingOnDomReadyCallBacks = []
    }
tC.pixelTrack = tC.pixelTrack || {
        add: function(t, e) {
            t = t || 0,
                e = e || "img",
                tC.onDomReady((function() {
                    var n;
                    "iframe" === e ? ((n = document.createElement(e)).src = t,
                        n.width = 1,
                        n.height = 1,
                        n.style.display = "none",
                        document.body.appendChild(n)) : (n = new Image).src = t
                }))
        }
    },
    tC.setCookie = tC.setCookie || function(t, e, n, i, r, a, o) {
        r || (r = tC.domain()),
            tC.cookieForceSameSite = tC.cookieForceSameSite || "",
            o = o || tC.cookieForceSameSite,
            tC.isSameSiteContext() || (o = "None"),
            o || (o = tC.isSubdomain(r) ? "Lax" : "None"),
            tC.cookieForceSecure = null != tC.cookieForceSecure ? tC.cookieForceSecure : "",
            a = null == a ? Boolean(Number(tC.cookieForceSecure)) : a,
            "none" === o.toLowerCase() && (a = !0);
        var c = new Date;
        c.setTime(c.getTime()),
            n && (n = 1e3 * n * 60 * 60 * 24);
        var s = new Date(c.getTime() + n),
            d = t + "=" + tC.cookieEncode(e) + (n ? ";expires=" + s.toGMTString() : "") + (i ? ";path=" + i : ";path=/") + (r ? ";domain=" + r : "") + (a ? ";secure" : "") + ";SameSite=" + o;
        document.cookie = d
    }
tC.cookieEncode = tC.cookieEncode || function(t) {
    var e = {
        "!": "%21",
        "'": "%27",
        "(": "%28",
        ")": "%29",
        "~": "%7E"
    };
    return encodeURIComponent(t).replace(/[!~'()]/g, (function(t) {
        return e[t]
    }))
}
tC.getCookie = tC.getCookie || function(t) {
    if (null == t)
        return "";
    var e = "@$".split("").some((function(e) {
        return -1 !== t.indexOf(e)
    }));
    t = e ? t.replace("$", "\\$") : encodeURIComponent(t);
    var n = new RegExp("(?:^|; )" + t + "=([^;]*)").exec(document.cookie);
    if (n) {
        var i = "";
        try {
            i = decodeURIComponent(n[1])
        } catch (t) {
            i = unescape(n[1])
        }
        return i
    }
    return ""
}

tC._samesite = tC._samesite || null,
    tC.isSameSiteContext = tC.isSameSiteContext || function() {
        return null != tC._samesite || (tC.isCrossDomainContext() ? tC._samesite = !1 : tC._samesite = tC.cookieCheck({
                samesite: "lax"
            })),
            tC._samesite
    }
tC.isCookieEnabled = function() {
    return !(!navigator.cookieEnabled || -1 !== window.navigator.userAgent.indexOf("MSIE")) || tC.cookieCheck()
}
tC.removeCookie = tC.removeCookie || function(t, e) {
    this.setCookie(t, "", -1, "/", e)
}

tC.detectDevice = tC.detectDevice || function() {
    var ua = (navigator ? navigator.userAgent : 'No User-Agent Provided');
    return ua.match(/GoogleTV|SmartTV|Internet.TV|NetCast|NETTV|AppleTV|boxee|Kylo|Roku|DLNADOC|CE-HTML/i) ? 'TV'
    : ua.match(/Xbox|PLAYSTATION.3|Wii/i) ? 'TV'
    : ua.match(/iPad/i) || ua.match(/tablet/i) && !ua.match(/RX-34/i) || ua.match(/FOLIO/i) ? 'Tablet'
    : ua.match(/Linux/i) && ua.match(/Android/i) && !ua.match(/Fennec|mobi|HTC.Magic|HTCX06HT|Nexus.One|SC-02B|fone.945/i) ? 'Tablet'
    : ua.match(/Kindle/i) || ua.match(/Mac.OS/i) && ua.match(/Silk/i) ? 'Tablet'
    : ua.match(/GT-P10|SC-01C|SHW-M180S|SGH-T849|SCH-I800|SHW-M180L|SPH-P100|SGH-I987|zt180|HTC(.Flyer|_Flyer)|Sprint.ATP51|ViewPad7|pandigital(sprnova|nova)|Ideos.S7|Dell.Streak.7|Advent.Vega|A101IT|A70BHT|MID7015|Next2|nook/i) || ua.match(/MB511/i) && ua.match(/RUTEM/i) ? 'Tablet'
    : ua.match(/BOLT|Fennec|Iris|Maemo|Minimo|Mobi|mowser|NetFront|Novarra|Prism|RX-34|Skyfire|Tear|XV6875|XV6975|Google.Wireless.Transcoder/i) ? 'Mobile'
    : ua.match(/Opera/i) && ua.match(/Windows.NT.5/i) && ua.match(/HTC|Xda|Mini|Vario|SAMSUNG-GT-i8000|SAMSUNG-SGH-i9/i) ? 'Mobile'
    : ua.match(/Windows.(NT|XP|ME|9)/) && !ua.match(/Phone/i) || ua.match(/Win(9|.9|NT)/i) ? 'Desktop'
    : ua.match(/Macintosh|PowerPC/i) && !ua.match(/Silk/i) ? 'Desktop'
    : ua.match(/Linux/i) && ua.match(/X11/i) ? 'Desktop'
    : ua.match(/Solaris|SunOS|BSD/i) ? 'Desktop'
    : ua.match(/Bot|Crawler|Spider|Yahoo|ia_archiver|Covario-IDS|findlinks|DataparkSearch|larbin|Mediapartners-Google|NG-Search|Snappy|Teoma|Jeeves|TinEye/i) && !ua.match(/Mobile/i) ? 'Desktop'
    : 'Mobile';
}

tC.scriptCount = (tC.scriptCount || 0) + 1;
tC.trackPage = function(user_id, cty, page_name, additional_params) {
  if (typeof tC.msr !== "object") {
      tC.msr = [];
  }
  tC.msr.dns = tC.getClientCollectDns() || tC.getClientCampaignDns();
  tC.msr.id_site = "3810";
  tC.msr.page_name = page_name;
  tC.msr.page_type = "Manager";
  tC.msr.sbrand = [];
  tC.msr.sbrand[0] = "";
  tC.msr.sbrand[1] = "";
  tC.msr.sbrand[2] = "";
  tC.msr.sbrand[3] = "";
  tC.msr.user_id = user_id;
  tC.msr.provided_excluded_referrer = "ovh.com,eu.ovh.com,ca.ovh.com,us.ovh.com,www.ovh.com,ovhcloud.com,www.ovhcloud.com,ovh.co.uk,www.ovh.co.uk,www.ovh.com.au,www.ovh.cz,ovh.de,www.ovh.de,ovh.es,www.ovh.es,ovh.ie,www.ovh.ie,ovh.it,www.ovh.it,ovh.nl,www.ovh.nl,www.ovh.lt,ovh.pl,www.ovh.pl,www.ovh.pt,ovh.sn,www.ovh.sn,www.ovh-hosting.fi,help.ovhcloud.com,partner.ovhcloud.com,opentrustedcloud.ovhcloud.com,ovh.slgnt.eu,news.ovhcloud.com,ovhh.pl,open-solidarity.com".split(','); // has to be a string of referrers (domains or subdomains) with a "," as a separator
  var tc_search_engine = "ecosia|q,com.google.android.gm|q,com.google.android.googlequicksearchbox|q,qwant|q"; // has to be a string: search_engine|key in query string, search_engine|key (google|q,qwant|q)
  if (tc_search_engine !== '') {
      var tc_search_engine_fs = tc_search_engine.split(",")
      tC.msr.provided_search_engines = (function() {
          var pl = [];
          for (var i = 0; i < tc_search_engine_fs.length; ++i) {
              pl.push(tc_search_engine_fs[i].split('|'));
          }
          return pl;
      })()
  }
  tC.msr.provided_social_networks = "".split(',');
  tC.msr.provided_brand_urls = "".split(',');
  tC.msr.internal_subdmomains = "ovhtelecom.fr,www.ovhtelecom.fr,www.kimsufi.com,hubic.com,api.hubic.com,us.ovhcloud.com,docs.ovh.com,ca.soyoustart.com,eu.soyoustart.com,www.soyoustart.com,community.ovh.com,blog.ovh.com,labs.ovh.com,omm.ovh.net,forum.ovh.com,weathermap.ovh.net,www.nic.ovh".split(',') // has to be a string separated by , - can be domains only or domains and subdomains or everything between protocal and ? or "
  tC.msr.additional_params = "&user_id=" + user_id;
  tC.msr.additional_params += "&dev=" + tC.detectDevice();
  tC.msr.additional_params += "&cty=" + cty;
  tC.msr.additional_params += "&site_domain=www.ovh.com/manager/";
  Object.entries(additional_params ?? {}).forEach(([param, value]) => {
    tC.msr.additional_params += "&" + param + "=" + encodeURIComponent(value);
  })
  tC.msr['scriptElt' + tC.scriptCount] = document.createElement("script");
  tC.msr['scriptElt' + tC.scriptCount].id = "tc_script_msr_" + tC.scriptCount;
  tC.msr['scriptElt' + tC.scriptCount].src = "//analytics.ovh.com/measure/measure.js";
  tC.msr['scriptElt' + tC.scriptCount].async = true;
  tC.msr['scriptElt' + tC.scriptCount].defer = 'defer';
  tC.msr.tmp = tC.getParamURL("tmp");
  (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0] || document.getElementsByTagName('script')[0].parentNode).insertBefore(tC.msr['scriptElt' + tC.scriptCount], null);
  tC.scriptCount += 1;
};

if(tC.getParamURL("mix_redirect") === "true"){
  tC.setCookie("mix_redirect","true",(1/24/2))
  if (typeof tC.msr !== "object") {
      tC.msr = [];
  }
  tC.msr.dns = tC.getClientCollectDns() || tC.getClientCampaignDns();
  tC.msr.id_site = "3810";
  tC.msr.page_name = "";
  tC.msr.page_type = "Manager";
  tC.msr.rand = Math.random();
  tC.msr.additional_params = "&user_id=" + "${clientId}";
  tC.msr.additional_params += "&dev=" + tC.detectDevice();
  tC.msr.additional_params += "&cty=" + "${region}";
  tC.msr.additional_params += "&site_domain=www.ovh.com/manager/";
  tC.msr.px = new Image();
  tC.msr.px.id = "tc_img__1";
  tC.msr.src = '';
  tC.msr.alt = 'MixCo Site Tracking Only V4.0';
  if (typeof tC.msr.page_name !== 'undefined' && tC.msr.page_name != null && tC.msr.page_name != '') {
      tC.msr.src += '&p=' + tC.msr.page_name;
  }
  if (typeof tC.msr.page_type !== 'undefined' && tC.msr.page_type != null && tC.msr.page_type != '') {
      tC.msr.src += '&pt=' + tC.msr.page_type;
  }
  if (typeof tC.msr.additional_params !== 'undefined' && tC.msr.additional_params != null && tC.msr.additional_params != '') {
      tC.msr.src += tC.msr.additional_params;
  }
  tC.msr.hdoc = '';
  try {
      if (typeof top != 'undefined' && typeof top.document != 'undefined') {
          tC.msr.hdoc = top.document;
      }
  } catch (e) {}
  if (tC.msr.hdoc === '') {
      tC.msr.hdoc = document;
  };
  if (typeof tC.msr.hdoc.referrer !== 'undefined' && tC.msr.hdoc.referrer != null && tC.msr.hdoc.referrer != '') {
      if (tC.msr.hdoc.referrer.indexOf("?") != -1) {
          tC.msr.src += '&ref=' + tC.msr.hdoc.referrer.substr(0, tC.msr.hdoc.referrer.indexOf("?"));
      } else {
          tC.msr.src += '&ref=' + tC.msr.hdoc.referrer;
      }
  }
  tC.msr.px.src = 'https://' + tC.msr.dns + '/mix/s3/?tcs=' + tC.msr.id_site + '&rand=' + tC.msr.rand + tC.msr.src;
  (document.getElementsByTagName('body')[0] || document.getElementsByTagName('head')[0]).appendChild(tC.msr.px);
} else {
  tC.trackPage("${clientId}", "${region}");
}`;

const initMixCommander = ({
  user_id: userId,
  country,
}: GenericTrackingData) => {
  const script = document.createElement('script');
  script.setAttribute('id', 'mix-commander-script');
  script.appendChild(
    document.createTextNode(getMixCommanderScript(userId, country)),
  );
  document.body.appendChild(script);
};

export default initMixCommander;
