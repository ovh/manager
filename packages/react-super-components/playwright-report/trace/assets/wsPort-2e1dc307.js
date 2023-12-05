var cp = Object.defineProperty
var fp = (e, t, n) => (t in e ? cp(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : (e[t] = n))
var le = (e, t, n) => (fp(e, typeof t != 'symbol' ? t + '' : t, n), n)
;(function () {
  const t = document.createElement('link').relList
  if (t && t.supports && t.supports('modulepreload')) return
  for (const i of document.querySelectorAll('link[rel="modulepreload"]')) r(i)
  new MutationObserver((i) => {
    for (const s of i)
      if (s.type === 'childList')
        for (const o of s.addedNodes) o.tagName === 'LINK' && o.rel === 'modulepreload' && r(o)
  }).observe(document, { childList: !0, subtree: !0 })
  function n(i) {
    const s = {}
    return (
      i.integrity && (s.integrity = i.integrity),
      i.referrerPolicy && (s.referrerPolicy = i.referrerPolicy),
      i.crossOrigin === 'use-credentials'
        ? (s.credentials = 'include')
        : i.crossOrigin === 'anonymous'
        ? (s.credentials = 'omit')
        : (s.credentials = 'same-origin'),
      s
    )
  }
  function r(i) {
    if (i.ep) return
    i.ep = !0
    const s = n(i)
    fetch(i.href, s)
  }
})()
var tw =
  typeof globalThis < 'u'
    ? globalThis
    : typeof window < 'u'
    ? window
    : typeof global < 'u'
    ? global
    : typeof self < 'u'
    ? self
    : {}
function dp(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, 'default') ? e.default : e
}
var wc = { exports: {} },
  Ns = {},
  Sc = { exports: {} },
  D = {}
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var ti = Symbol.for('react.element'),
  hp = Symbol.for('react.portal'),
  pp = Symbol.for('react.fragment'),
  mp = Symbol.for('react.strict_mode'),
  gp = Symbol.for('react.profiler'),
  vp = Symbol.for('react.provider'),
  yp = Symbol.for('react.context'),
  wp = Symbol.for('react.forward_ref'),
  Sp = Symbol.for('react.suspense'),
  Ep = Symbol.for('react.memo'),
  xp = Symbol.for('react.lazy'),
  Ia = Symbol.iterator
function _p(e) {
  return e === null || typeof e != 'object'
    ? null
    : ((e = (Ia && e[Ia]) || e['@@iterator']), typeof e == 'function' ? e : null)
}
var Ec = {
    isMounted: function () {
      return !1
    },
    enqueueForceUpdate: function () {},
    enqueueReplaceState: function () {},
    enqueueSetState: function () {},
  },
  xc = Object.assign,
  _c = {}
function Jn(e, t, n) {
  ;(this.props = e), (this.context = t), (this.refs = _c), (this.updater = n || Ec)
}
Jn.prototype.isReactComponent = {}
Jn.prototype.setState = function (e, t) {
  if (typeof e != 'object' && typeof e != 'function' && e != null)
    throw Error(
      'setState(...): takes an object of state variables to update or a function which returns an object of state variables.',
    )
  this.updater.enqueueSetState(this, e, t, 'setState')
}
Jn.prototype.forceUpdate = function (e) {
  this.updater.enqueueForceUpdate(this, e, 'forceUpdate')
}
function kc() {}
kc.prototype = Jn.prototype
function Cl(e, t, n) {
  ;(this.props = e), (this.context = t), (this.refs = _c), (this.updater = n || Ec)
}
var Al = (Cl.prototype = new kc())
Al.constructor = Cl
xc(Al, Jn.prototype)
Al.isPureReactComponent = !0
var Ma = Array.isArray,
  Tc = Object.prototype.hasOwnProperty,
  Ll = { current: null },
  Nc = { key: !0, ref: !0, __self: !0, __source: !0 }
function Cc(e, t, n) {
  var r,
    i = {},
    s = null,
    o = null
  if (t != null)
    for (r in (t.ref !== void 0 && (o = t.ref), t.key !== void 0 && (s = '' + t.key), t))
      Tc.call(t, r) && !Nc.hasOwnProperty(r) && (i[r] = t[r])
  var l = arguments.length - 2
  if (l === 1) i.children = n
  else if (1 < l) {
    for (var a = Array(l), u = 0; u < l; u++) a[u] = arguments[u + 2]
    i.children = a
  }
  if (e && e.defaultProps) for (r in ((l = e.defaultProps), l)) i[r] === void 0 && (i[r] = l[r])
  return { $$typeof: ti, type: e, key: s, ref: o, props: i, _owner: Ll.current }
}
function kp(e, t) {
  return { $$typeof: ti, type: e.type, key: t, ref: e.ref, props: e.props, _owner: e._owner }
}
function bl(e) {
  return typeof e == 'object' && e !== null && e.$$typeof === ti
}
function Tp(e) {
  var t = { '=': '=0', ':': '=2' }
  return (
    '$' +
    e.replace(/[=:]/g, function (n) {
      return t[n]
    })
  )
}
var Ra = /\/+/g
function Qs(e, t) {
  return typeof e == 'object' && e !== null && e.key != null ? Tp('' + e.key) : t.toString(36)
}
function Ri(e, t, n, r, i) {
  var s = typeof e
  ;(s === 'undefined' || s === 'boolean') && (e = null)
  var o = !1
  if (e === null) o = !0
  else
    switch (s) {
      case 'string':
      case 'number':
        o = !0
        break
      case 'object':
        switch (e.$$typeof) {
          case ti:
          case hp:
            o = !0
        }
    }
  if (o)
    return (
      (o = e),
      (i = i(o)),
      (e = r === '' ? '.' + Qs(o, 0) : r),
      Ma(i)
        ? ((n = ''),
          e != null && (n = e.replace(Ra, '$&/') + '/'),
          Ri(i, t, n, '', function (u) {
            return u
          }))
        : i != null &&
          (bl(i) &&
            (i = kp(i, n + (!i.key || (o && o.key === i.key) ? '' : ('' + i.key).replace(Ra, '$&/') + '/') + e)),
          t.push(i)),
      1
    )
  if (((o = 0), (r = r === '' ? '.' : r + ':'), Ma(e)))
    for (var l = 0; l < e.length; l++) {
      s = e[l]
      var a = r + Qs(s, l)
      o += Ri(s, t, n, a, i)
    }
  else if (((a = _p(e)), typeof a == 'function'))
    for (e = a.call(e), l = 0; !(s = e.next()).done; ) (s = s.value), (a = r + Qs(s, l++)), (o += Ri(s, t, n, a, i))
  else if (s === 'object')
    throw (
      ((t = String(e)),
      Error(
        'Objects are not valid as a React child (found: ' +
          (t === '[object Object]' ? 'object with keys {' + Object.keys(e).join(', ') + '}' : t) +
          '). If you meant to render a collection of children, use an array instead.',
      ))
    )
  return o
}
function fi(e, t, n) {
  if (e == null) return e
  var r = [],
    i = 0
  return (
    Ri(e, r, '', '', function (s) {
      return t.call(n, s, i++)
    }),
    r
  )
}
function Np(e) {
  if (e._status === -1) {
    var t = e._result
    ;(t = t()),
      t.then(
        function (n) {
          ;(e._status === 0 || e._status === -1) && ((e._status = 1), (e._result = n))
        },
        function (n) {
          ;(e._status === 0 || e._status === -1) && ((e._status = 2), (e._result = n))
        },
      ),
      e._status === -1 && ((e._status = 0), (e._result = t))
  }
  if (e._status === 1) return e._result.default
  throw e._result
}
var xe = { current: null },
  Pi = { transition: null },
  Cp = { ReactCurrentDispatcher: xe, ReactCurrentBatchConfig: Pi, ReactCurrentOwner: Ll }
D.Children = {
  map: fi,
  forEach: function (e, t, n) {
    fi(
      e,
      function () {
        t.apply(this, arguments)
      },
      n,
    )
  },
  count: function (e) {
    var t = 0
    return (
      fi(e, function () {
        t++
      }),
      t
    )
  },
  toArray: function (e) {
    return (
      fi(e, function (t) {
        return t
      }) || []
    )
  },
  only: function (e) {
    if (!bl(e)) throw Error('React.Children.only expected to receive a single React element child.')
    return e
  },
}
D.Component = Jn
D.Fragment = pp
D.Profiler = gp
D.PureComponent = Cl
D.StrictMode = mp
D.Suspense = Sp
D.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Cp
D.cloneElement = function (e, t, n) {
  if (e == null) throw Error('React.cloneElement(...): The argument must be a React element, but you passed ' + e + '.')
  var r = xc({}, e.props),
    i = e.key,
    s = e.ref,
    o = e._owner
  if (t != null) {
    if (
      (t.ref !== void 0 && ((s = t.ref), (o = Ll.current)),
      t.key !== void 0 && (i = '' + t.key),
      e.type && e.type.defaultProps)
    )
      var l = e.type.defaultProps
    for (a in t) Tc.call(t, a) && !Nc.hasOwnProperty(a) && (r[a] = t[a] === void 0 && l !== void 0 ? l[a] : t[a])
  }
  var a = arguments.length - 2
  if (a === 1) r.children = n
  else if (1 < a) {
    l = Array(a)
    for (var u = 0; u < a; u++) l[u] = arguments[u + 2]
    r.children = l
  }
  return { $$typeof: ti, type: e.type, key: i, ref: s, props: r, _owner: o }
}
D.createContext = function (e) {
  return (
    (e = {
      $$typeof: yp,
      _currentValue: e,
      _currentValue2: e,
      _threadCount: 0,
      Provider: null,
      Consumer: null,
      _defaultValue: null,
      _globalName: null,
    }),
    (e.Provider = { $$typeof: vp, _context: e }),
    (e.Consumer = e)
  )
}
D.createElement = Cc
D.createFactory = function (e) {
  var t = Cc.bind(null, e)
  return (t.type = e), t
}
D.createRef = function () {
  return { current: null }
}
D.forwardRef = function (e) {
  return { $$typeof: wp, render: e }
}
D.isValidElement = bl
D.lazy = function (e) {
  return { $$typeof: xp, _payload: { _status: -1, _result: e }, _init: Np }
}
D.memo = function (e, t) {
  return { $$typeof: Ep, type: e, compare: t === void 0 ? null : t }
}
D.startTransition = function (e) {
  var t = Pi.transition
  Pi.transition = {}
  try {
    e()
  } finally {
    Pi.transition = t
  }
}
D.unstable_act = function () {
  throw Error('act(...) is not supported in production builds of React.')
}
D.useCallback = function (e, t) {
  return xe.current.useCallback(e, t)
}
D.useContext = function (e) {
  return xe.current.useContext(e)
}
D.useDebugValue = function () {}
D.useDeferredValue = function (e) {
  return xe.current.useDeferredValue(e)
}
D.useEffect = function (e, t) {
  return xe.current.useEffect(e, t)
}
D.useId = function () {
  return xe.current.useId()
}
D.useImperativeHandle = function (e, t, n) {
  return xe.current.useImperativeHandle(e, t, n)
}
D.useInsertionEffect = function (e, t) {
  return xe.current.useInsertionEffect(e, t)
}
D.useLayoutEffect = function (e, t) {
  return xe.current.useLayoutEffect(e, t)
}
D.useMemo = function (e, t) {
  return xe.current.useMemo(e, t)
}
D.useReducer = function (e, t, n) {
  return xe.current.useReducer(e, t, n)
}
D.useRef = function (e) {
  return xe.current.useRef(e)
}
D.useState = function (e) {
  return xe.current.useState(e)
}
D.useSyncExternalStore = function (e, t, n) {
  return xe.current.useSyncExternalStore(e, t, n)
}
D.useTransition = function () {
  return xe.current.useTransition()
}
D.version = '18.1.0'
Sc.exports = D
var L = Sc.exports
const rn = dp(L)
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var Ap = L,
  Lp = Symbol.for('react.element'),
  bp = Symbol.for('react.fragment'),
  Ip = Object.prototype.hasOwnProperty,
  Mp = Ap.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,
  Rp = { key: !0, ref: !0, __self: !0, __source: !0 }
function Ac(e, t, n) {
  var r,
    i = {},
    s = null,
    o = null
  n !== void 0 && (s = '' + n), t.key !== void 0 && (s = '' + t.key), t.ref !== void 0 && (o = t.ref)
  for (r in t) Ip.call(t, r) && !Rp.hasOwnProperty(r) && (i[r] = t[r])
  if (e && e.defaultProps) for (r in ((t = e.defaultProps), t)) i[r] === void 0 && (i[r] = t[r])
  return { $$typeof: Lp, type: e, key: s, ref: o, props: i, _owner: Mp.current }
}
Ns.Fragment = bp
Ns.jsx = Ac
Ns.jsxs = Ac
wc.exports = Ns
var Il = wc.exports
const mt = Il.Fragment,
  m = Il.jsx,
  b = Il.jsxs
function Pp(e, t, n, r) {
  const [i, s] = rn.useState(n)
  return (
    rn.useEffect(() => {
      let o = !1
      return (
        r !== void 0 && s(r),
        e().then((l) => {
          o || s(l)
        }),
        () => {
          o = !0
        }
      )
    }, t),
    i
  )
}
function ni() {
  const e = rn.useRef(null),
    [t, n] = rn.useState(new DOMRect(0, 0, 10, 10))
  return (
    rn.useLayoutEffect(() => {
      const r = e.current
      if (!r) return
      const i = new ResizeObserver((s) => {
        const o = s[s.length - 1]
        o && o.contentRect && n(o.contentRect)
      })
      return i.observe(r), () => i.disconnect()
    }, [e]),
    [t, e]
  )
}
function kt(e) {
  if (!isFinite(e)) return '-'
  if (e === 0) return '0'
  if (e < 1e3) return e.toFixed(0) + 'ms'
  const t = e / 1e3
  if (t < 60) return t.toFixed(1) + 's'
  const n = t / 60
  if (n < 60) return n.toFixed(1) + 'm'
  const r = n / 60
  return r < 24 ? r.toFixed(1) + 'h' : (r / 24).toFixed(1) + 'd'
}
function $p(e) {
  if (e < 0 || !isFinite(e)) return '-'
  if (e === 0) return '0'
  if (e < 1e3) return e.toFixed(0)
  const t = e / 1024
  if (t < 1e3) return t.toFixed(1) + 'K'
  const n = t / 1024
  return n < 1e3 ? n.toFixed(1) + 'M' : (n / 1024).toFixed(1) + 'G'
}
function Lc(e, t, n, r, i) {
  let s = r || 0,
    o = i !== void 0 ? i : e.length
  for (; s < o; ) {
    const l = (s + o) >> 1
    n(t, e[l]) >= 0 ? (s = l + 1) : (o = l)
  }
  return o
}
function Op(e) {
  const t = document.createElement('textarea')
  ;(t.style.position = 'absolute'),
    (t.style.zIndex = '-1000'),
    (t.value = e),
    document.body.appendChild(t),
    t.select(),
    document.execCommand('copy'),
    t.remove()
}
function Ki(e, t) {
  const n = e ? $r.getObject(e, t) : t,
    [r, i] = rn.useState(n)
  return [
    r,
    (o) => {
      e && $r.setObject(e, o), i(o)
    },
  ]
}
class zp {
  getString(t, n) {
    return localStorage[t] || n
  }
  setString(t, n) {
    ;(localStorage[t] = n), window.saveSettings && window.saveSettings()
  }
  getObject(t, n) {
    if (!localStorage[t]) return n
    try {
      return JSON.parse(localStorage[t])
    } catch {
      return n
    }
  }
  setObject(t, n) {
    ;(localStorage[t] = JSON.stringify(n)), window.saveSettings && window.saveSettings()
  }
}
const $r = new zp()
function nw() {
  if (document.playwrightThemeInitialized) return
  ;(document.playwrightThemeInitialized = !0),
    document.defaultView.addEventListener(
      'focus',
      (n) => {
        n.target.document.nodeType === Node.DOCUMENT_NODE && document.body.classList.remove('inactive')
      },
      !1,
    ),
    document.defaultView.addEventListener(
      'blur',
      (n) => {
        document.body.classList.add('inactive')
      },
      !1,
    )
  const e = $r.getString('theme', 'light-mode'),
    t = window.matchMedia('(prefers-color-scheme: dark)')
  ;(e === 'dark-mode' || t.matches) && document.body.classList.add('dark-mode')
}
const Ml = new Set()
function rw() {
  const e = $r.getString('theme', 'light-mode')
  let t
  e === 'dark-mode' ? (t = 'light-mode') : (t = 'dark-mode'),
    e && document.body.classList.remove(e),
    document.body.classList.add(t),
    $r.setString('theme', t)
  for (const n of Ml) n(t)
}
function iw(e) {
  Ml.add(e)
}
function sw(e) {
  Ml.delete(e)
}
function ow() {
  return document.body.classList.contains('dark-mode') ? 'dark-mode' : 'light-mode'
}
var bc = { exports: {} },
  je = {},
  Ic = { exports: {} },
  Mc = {}
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ ;(function (e) {
  function t(M, $) {
    var z = M.length
    M.push($)
    e: for (; 0 < z; ) {
      var V = (z - 1) >>> 1,
        ee = M[V]
      if (0 < i(ee, $)) (M[V] = $), (M[z] = ee), (z = V)
      else break e
    }
  }
  function n(M) {
    return M.length === 0 ? null : M[0]
  }
  function r(M) {
    if (M.length === 0) return null
    var $ = M[0],
      z = M.pop()
    if (z !== $) {
      M[0] = z
      e: for (var V = 0, ee = M.length, wn = ee >>> 1; V < wn; ) {
        var Je = 2 * (V + 1) - 1,
          ir = M[Je],
          gt = Je + 1,
          Sn = M[gt]
        if (0 > i(ir, z))
          gt < ee && 0 > i(Sn, ir) ? ((M[V] = Sn), (M[gt] = z), (V = gt)) : ((M[V] = ir), (M[Je] = z), (V = Je))
        else if (gt < ee && 0 > i(Sn, z)) (M[V] = Sn), (M[gt] = z), (V = gt)
        else break e
      }
    }
    return $
  }
  function i(M, $) {
    var z = M.sortIndex - $.sortIndex
    return z !== 0 ? z : M.id - $.id
  }
  if (typeof performance == 'object' && typeof performance.now == 'function') {
    var s = performance
    e.unstable_now = function () {
      return s.now()
    }
  } else {
    var o = Date,
      l = o.now()
    e.unstable_now = function () {
      return o.now() - l
    }
  }
  var a = [],
    u = [],
    c = 1,
    p = null,
    f = 3,
    y = !1,
    g = !1,
    w = !1,
    x = typeof setTimeout == 'function' ? setTimeout : null,
    h = typeof clearTimeout == 'function' ? clearTimeout : null,
    d = typeof setImmediate < 'u' ? setImmediate : null
  typeof navigator < 'u' &&
    navigator.scheduling !== void 0 &&
    navigator.scheduling.isInputPending !== void 0 &&
    navigator.scheduling.isInputPending.bind(navigator.scheduling)
  function v(M) {
    for (var $ = n(u); $ !== null; ) {
      if ($.callback === null) r(u)
      else if ($.startTime <= M) r(u), ($.sortIndex = $.expirationTime), t(a, $)
      else break
      $ = n(u)
    }
  }
  function S(M) {
    if (((w = !1), v(M), !g))
      if (n(a) !== null) (g = !0), ke(T)
      else {
        var $ = n(u)
        $ !== null && Te(S, $.startTime - M)
      }
  }
  function T(M, $) {
    ;(g = !1), w && ((w = !1), h(_), (_ = -1)), (y = !0)
    var z = f
    try {
      for (v($), p = n(a); p !== null && (!(p.expirationTime > $) || (M && !O())); ) {
        var V = p.callback
        if (typeof V == 'function') {
          ;(p.callback = null), (f = p.priorityLevel)
          var ee = V(p.expirationTime <= $)
          ;($ = e.unstable_now()), typeof ee == 'function' ? (p.callback = ee) : p === n(a) && r(a), v($)
        } else r(a)
        p = n(a)
      }
      if (p !== null) var wn = !0
      else {
        var Je = n(u)
        Je !== null && Te(S, Je.startTime - $), (wn = !1)
      }
      return wn
    } finally {
      ;(p = null), (f = z), (y = !1)
    }
  }
  var C = !1,
    E = null,
    _ = -1,
    N = 5,
    I = -1
  function O() {
    return !(e.unstable_now() - I < N)
  }
  function k() {
    if (E !== null) {
      var M = e.unstable_now()
      I = M
      var $ = !0
      try {
        $ = E(!0, M)
      } finally {
        $ ? P() : ((C = !1), (E = null))
      }
    } else C = !1
  }
  var P
  if (typeof d == 'function')
    P = function () {
      d(k)
    }
  else if (typeof MessageChannel < 'u') {
    var q = new MessageChannel(),
      Oe = q.port2
    ;(q.port1.onmessage = k),
      (P = function () {
        Oe.postMessage(null)
      })
  } else
    P = function () {
      x(k, 0)
    }
  function ke(M) {
    ;(E = M), C || ((C = !0), P())
  }
  function Te(M, $) {
    _ = x(function () {
      M(e.unstable_now())
    }, $)
  }
  ;(e.unstable_IdlePriority = 5),
    (e.unstable_ImmediatePriority = 1),
    (e.unstable_LowPriority = 4),
    (e.unstable_NormalPriority = 3),
    (e.unstable_Profiling = null),
    (e.unstable_UserBlockingPriority = 2),
    (e.unstable_cancelCallback = function (M) {
      M.callback = null
    }),
    (e.unstable_continueExecution = function () {
      g || y || ((g = !0), ke(T))
    }),
    (e.unstable_forceFrameRate = function (M) {
      0 > M || 125 < M
        ? console.error(
            'forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported',
          )
        : (N = 0 < M ? Math.floor(1e3 / M) : 5)
    }),
    (e.unstable_getCurrentPriorityLevel = function () {
      return f
    }),
    (e.unstable_getFirstCallbackNode = function () {
      return n(a)
    }),
    (e.unstable_next = function (M) {
      switch (f) {
        case 1:
        case 2:
        case 3:
          var $ = 3
          break
        default:
          $ = f
      }
      var z = f
      f = $
      try {
        return M()
      } finally {
        f = z
      }
    }),
    (e.unstable_pauseExecution = function () {}),
    (e.unstable_requestPaint = function () {}),
    (e.unstable_runWithPriority = function (M, $) {
      switch (M) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break
        default:
          M = 3
      }
      var z = f
      f = M
      try {
        return $()
      } finally {
        f = z
      }
    }),
    (e.unstable_scheduleCallback = function (M, $, z) {
      var V = e.unstable_now()
      switch (
        (typeof z == 'object' && z !== null
          ? ((z = z.delay), (z = typeof z == 'number' && 0 < z ? V + z : V))
          : (z = V),
        M)
      ) {
        case 1:
          var ee = -1
          break
        case 2:
          ee = 250
          break
        case 5:
          ee = 1073741823
          break
        case 4:
          ee = 1e4
          break
        default:
          ee = 5e3
      }
      return (
        (ee = z + ee),
        (M = { id: c++, callback: $, priorityLevel: M, startTime: z, expirationTime: ee, sortIndex: -1 }),
        z > V
          ? ((M.sortIndex = z), t(u, M), n(a) === null && M === n(u) && (w ? (h(_), (_ = -1)) : (w = !0), Te(S, z - V)))
          : ((M.sortIndex = ee), t(a, M), g || y || ((g = !0), ke(T))),
        M
      )
    }),
    (e.unstable_shouldYield = O),
    (e.unstable_wrapCallback = function (M) {
      var $ = f
      return function () {
        var z = f
        f = $
        try {
          return M.apply(this, arguments)
        } finally {
          f = z
        }
      }
    })
})(Mc)
Ic.exports = Mc
var Dp = Ic.exports
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var Rc = L,
  Ue = Dp
function A(e) {
  for (var t = 'https://reactjs.org/docs/error-decoder.html?invariant=' + e, n = 1; n < arguments.length; n++)
    t += '&args[]=' + encodeURIComponent(arguments[n])
  return (
    'Minified React error #' +
    e +
    '; visit ' +
    t +
    ' for the full message or use the non-minified dev environment for full errors and additional helpful warnings.'
  )
}
var Pc = new Set(),
  Or = {}
function vn(e, t) {
  qn(e, t), qn(e + 'Capture', t)
}
function qn(e, t) {
  for (Or[e] = t, e = 0; e < t.length; e++) Pc.add(t[e])
}
var Tt = !(typeof window > 'u' || typeof window.document > 'u' || typeof window.document.createElement > 'u'),
  ko = Object.prototype.hasOwnProperty,
  Fp =
    /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,
  Pa = {},
  $a = {}
function Up(e) {
  return ko.call($a, e) ? !0 : ko.call(Pa, e) ? !1 : Fp.test(e) ? ($a[e] = !0) : ((Pa[e] = !0), !1)
}
function jp(e, t, n, r) {
  if (n !== null && n.type === 0) return !1
  switch (typeof t) {
    case 'function':
    case 'symbol':
      return !0
    case 'boolean':
      return r
        ? !1
        : n !== null
        ? !n.acceptsBooleans
        : ((e = e.toLowerCase().slice(0, 5)), e !== 'data-' && e !== 'aria-')
    default:
      return !1
  }
}
function Hp(e, t, n, r) {
  if (t === null || typeof t > 'u' || jp(e, t, n, r)) return !0
  if (r) return !1
  if (n !== null)
    switch (n.type) {
      case 3:
        return !t
      case 4:
        return t === !1
      case 5:
        return isNaN(t)
      case 6:
        return isNaN(t) || 1 > t
    }
  return !1
}
function _e(e, t, n, r, i, s, o) {
  ;(this.acceptsBooleans = t === 2 || t === 3 || t === 4),
    (this.attributeName = r),
    (this.attributeNamespace = i),
    (this.mustUseProperty = n),
    (this.propertyName = e),
    (this.type = t),
    (this.sanitizeURL = s),
    (this.removeEmptyString = o)
}
var de = {}
'children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style'
  .split(' ')
  .forEach(function (e) {
    de[e] = new _e(e, 0, !1, e, null, !1, !1)
  })
;[
  ['acceptCharset', 'accept-charset'],
  ['className', 'class'],
  ['htmlFor', 'for'],
  ['httpEquiv', 'http-equiv'],
].forEach(function (e) {
  var t = e[0]
  de[t] = new _e(t, 1, !1, e[1], null, !1, !1)
})
;['contentEditable', 'draggable', 'spellCheck', 'value'].forEach(function (e) {
  de[e] = new _e(e, 2, !1, e.toLowerCase(), null, !1, !1)
})
;['autoReverse', 'externalResourcesRequired', 'focusable', 'preserveAlpha'].forEach(function (e) {
  de[e] = new _e(e, 2, !1, e, null, !1, !1)
})
'allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope'
  .split(' ')
  .forEach(function (e) {
    de[e] = new _e(e, 3, !1, e.toLowerCase(), null, !1, !1)
  })
;['checked', 'multiple', 'muted', 'selected'].forEach(function (e) {
  de[e] = new _e(e, 3, !0, e, null, !1, !1)
})
;['capture', 'download'].forEach(function (e) {
  de[e] = new _e(e, 4, !1, e, null, !1, !1)
})
;['cols', 'rows', 'size', 'span'].forEach(function (e) {
  de[e] = new _e(e, 6, !1, e, null, !1, !1)
})
;['rowSpan', 'start'].forEach(function (e) {
  de[e] = new _e(e, 5, !1, e.toLowerCase(), null, !1, !1)
})
var Rl = /[\-:]([a-z])/g
function Pl(e) {
  return e[1].toUpperCase()
}
'accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height'
  .split(' ')
  .forEach(function (e) {
    var t = e.replace(Rl, Pl)
    de[t] = new _e(t, 1, !1, e, null, !1, !1)
  })
'xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type'.split(' ').forEach(function (e) {
  var t = e.replace(Rl, Pl)
  de[t] = new _e(t, 1, !1, e, 'http://www.w3.org/1999/xlink', !1, !1)
})
;['xml:base', 'xml:lang', 'xml:space'].forEach(function (e) {
  var t = e.replace(Rl, Pl)
  de[t] = new _e(t, 1, !1, e, 'http://www.w3.org/XML/1998/namespace', !1, !1)
})
;['tabIndex', 'crossOrigin'].forEach(function (e) {
  de[e] = new _e(e, 1, !1, e.toLowerCase(), null, !1, !1)
})
de.xlinkHref = new _e('xlinkHref', 1, !1, 'xlink:href', 'http://www.w3.org/1999/xlink', !0, !1)
;['src', 'href', 'action', 'formAction'].forEach(function (e) {
  de[e] = new _e(e, 1, !1, e.toLowerCase(), null, !0, !0)
})
function $l(e, t, n, r) {
  var i = de.hasOwnProperty(t) ? de[t] : null
  ;(i !== null
    ? i.type !== 0
    : r || !(2 < t.length) || (t[0] !== 'o' && t[0] !== 'O') || (t[1] !== 'n' && t[1] !== 'N')) &&
    (Hp(t, n, i, r) && (n = null),
    r || i === null
      ? Up(t) && (n === null ? e.removeAttribute(t) : e.setAttribute(t, '' + n))
      : i.mustUseProperty
      ? (e[i.propertyName] = n === null ? (i.type === 3 ? !1 : '') : n)
      : ((t = i.attributeName),
        (r = i.attributeNamespace),
        n === null
          ? e.removeAttribute(t)
          : ((i = i.type),
            (n = i === 3 || (i === 4 && n === !0) ? '' : '' + n),
            r ? e.setAttributeNS(r, t, n) : e.setAttribute(t, n))))
}
var At = Rc.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
  di = Symbol.for('react.element'),
  Tn = Symbol.for('react.portal'),
  Nn = Symbol.for('react.fragment'),
  Ol = Symbol.for('react.strict_mode'),
  To = Symbol.for('react.profiler'),
  $c = Symbol.for('react.provider'),
  Oc = Symbol.for('react.context'),
  zl = Symbol.for('react.forward_ref'),
  No = Symbol.for('react.suspense'),
  Co = Symbol.for('react.suspense_list'),
  Dl = Symbol.for('react.memo'),
  It = Symbol.for('react.lazy'),
  zc = Symbol.for('react.offscreen'),
  Oa = Symbol.iterator
function sr(e) {
  return e === null || typeof e != 'object'
    ? null
    : ((e = (Oa && e[Oa]) || e['@@iterator']), typeof e == 'function' ? e : null)
}
var K = Object.assign,
  Xs
function Sr(e) {
  if (Xs === void 0)
    try {
      throw Error()
    } catch (n) {
      var t = n.stack.trim().match(/\n( *(at )?)/)
      Xs = (t && t[1]) || ''
    }
  return (
    `
` +
    Xs +
    e
  )
}
var Gs = !1
function Ks(e, t) {
  if (!e || Gs) return ''
  Gs = !0
  var n = Error.prepareStackTrace
  Error.prepareStackTrace = void 0
  try {
    if (t)
      if (
        ((t = function () {
          throw Error()
        }),
        Object.defineProperty(t.prototype, 'props', {
          set: function () {
            throw Error()
          },
        }),
        typeof Reflect == 'object' && Reflect.construct)
      ) {
        try {
          Reflect.construct(t, [])
        } catch (u) {
          var r = u
        }
        Reflect.construct(e, [], t)
      } else {
        try {
          t.call()
        } catch (u) {
          r = u
        }
        e.call(t.prototype)
      }
    else {
      try {
        throw Error()
      } catch (u) {
        r = u
      }
      e()
    }
  } catch (u) {
    if (u && r && typeof u.stack == 'string') {
      for (
        var i = u.stack.split(`
`),
          s = r.stack.split(`
`),
          o = i.length - 1,
          l = s.length - 1;
        1 <= o && 0 <= l && i[o] !== s[l];

      )
        l--
      for (; 1 <= o && 0 <= l; o--, l--)
        if (i[o] !== s[l]) {
          if (o !== 1 || l !== 1)
            do
              if ((o--, l--, 0 > l || i[o] !== s[l])) {
                var a =
                  `
` + i[o].replace(' at new ', ' at ')
                return e.displayName && a.includes('<anonymous>') && (a = a.replace('<anonymous>', e.displayName)), a
              }
            while (1 <= o && 0 <= l)
          break
        }
    }
  } finally {
    ;(Gs = !1), (Error.prepareStackTrace = n)
  }
  return (e = e ? e.displayName || e.name : '') ? Sr(e) : ''
}
function Bp(e) {
  switch (e.tag) {
    case 5:
      return Sr(e.type)
    case 16:
      return Sr('Lazy')
    case 13:
      return Sr('Suspense')
    case 19:
      return Sr('SuspenseList')
    case 0:
    case 2:
    case 15:
      return (e = Ks(e.type, !1)), e
    case 11:
      return (e = Ks(e.type.render, !1)), e
    case 1:
      return (e = Ks(e.type, !0)), e
    default:
      return ''
  }
}
function Ao(e) {
  if (e == null) return null
  if (typeof e == 'function') return e.displayName || e.name || null
  if (typeof e == 'string') return e
  switch (e) {
    case Nn:
      return 'Fragment'
    case Tn:
      return 'Portal'
    case To:
      return 'Profiler'
    case Ol:
      return 'StrictMode'
    case No:
      return 'Suspense'
    case Co:
      return 'SuspenseList'
  }
  if (typeof e == 'object')
    switch (e.$$typeof) {
      case Oc:
        return (e.displayName || 'Context') + '.Consumer'
      case $c:
        return (e._context.displayName || 'Context') + '.Provider'
      case zl:
        var t = e.render
        return (
          (e = e.displayName),
          e || ((e = t.displayName || t.name || ''), (e = e !== '' ? 'ForwardRef(' + e + ')' : 'ForwardRef')),
          e
        )
      case Dl:
        return (t = e.displayName || null), t !== null ? t : Ao(e.type) || 'Memo'
      case It:
        ;(t = e._payload), (e = e._init)
        try {
          return Ao(e(t))
        } catch {}
    }
  return null
}
function qp(e) {
  var t = e.type
  switch (e.tag) {
    case 24:
      return 'Cache'
    case 9:
      return (t.displayName || 'Context') + '.Consumer'
    case 10:
      return (t._context.displayName || 'Context') + '.Provider'
    case 18:
      return 'DehydratedFragment'
    case 11:
      return (
        (e = t.render),
        (e = e.displayName || e.name || ''),
        t.displayName || (e !== '' ? 'ForwardRef(' + e + ')' : 'ForwardRef')
      )
    case 7:
      return 'Fragment'
    case 5:
      return t
    case 4:
      return 'Portal'
    case 3:
      return 'Root'
    case 6:
      return 'Text'
    case 16:
      return Ao(t)
    case 8:
      return t === Ol ? 'StrictMode' : 'Mode'
    case 22:
      return 'Offscreen'
    case 12:
      return 'Profiler'
    case 21:
      return 'Scope'
    case 13:
      return 'Suspense'
    case 19:
      return 'SuspenseList'
    case 25:
      return 'TracingMarker'
    case 1:
    case 0:
    case 17:
    case 2:
    case 14:
    case 15:
      if (typeof t == 'function') return t.displayName || t.name || null
      if (typeof t == 'string') return t
  }
  return null
}
function qt(e) {
  switch (typeof e) {
    case 'boolean':
    case 'number':
    case 'string':
    case 'undefined':
      return e
    case 'object':
      return e
    default:
      return ''
  }
}
function Dc(e) {
  var t = e.type
  return (e = e.nodeName) && e.toLowerCase() === 'input' && (t === 'checkbox' || t === 'radio')
}
function Wp(e) {
  var t = Dc(e) ? 'checked' : 'value',
    n = Object.getOwnPropertyDescriptor(e.constructor.prototype, t),
    r = '' + e[t]
  if (!e.hasOwnProperty(t) && typeof n < 'u' && typeof n.get == 'function' && typeof n.set == 'function') {
    var i = n.get,
      s = n.set
    return (
      Object.defineProperty(e, t, {
        configurable: !0,
        get: function () {
          return i.call(this)
        },
        set: function (o) {
          ;(r = '' + o), s.call(this, o)
        },
      }),
      Object.defineProperty(e, t, { enumerable: n.enumerable }),
      {
        getValue: function () {
          return r
        },
        setValue: function (o) {
          r = '' + o
        },
        stopTracking: function () {
          ;(e._valueTracker = null), delete e[t]
        },
      }
    )
  }
}
function hi(e) {
  e._valueTracker || (e._valueTracker = Wp(e))
}
function Fc(e) {
  if (!e) return !1
  var t = e._valueTracker
  if (!t) return !0
  var n = t.getValue(),
    r = ''
  return e && (r = Dc(e) ? (e.checked ? 'true' : 'false') : e.value), (e = r), e !== n ? (t.setValue(e), !0) : !1
}
function Ji(e) {
  if (((e = e || (typeof document < 'u' ? document : void 0)), typeof e > 'u')) return null
  try {
    return e.activeElement || e.body
  } catch {
    return e.body
  }
}
function Lo(e, t) {
  var n = t.checked
  return K({}, t, {
    defaultChecked: void 0,
    defaultValue: void 0,
    value: void 0,
    checked: n ?? e._wrapperState.initialChecked,
  })
}
function za(e, t) {
  var n = t.defaultValue == null ? '' : t.defaultValue,
    r = t.checked != null ? t.checked : t.defaultChecked
  ;(n = qt(t.value != null ? t.value : n)),
    (e._wrapperState = {
      initialChecked: r,
      initialValue: n,
      controlled: t.type === 'checkbox' || t.type === 'radio' ? t.checked != null : t.value != null,
    })
}
function Uc(e, t) {
  ;(t = t.checked), t != null && $l(e, 'checked', t, !1)
}
function bo(e, t) {
  Uc(e, t)
  var n = qt(t.value),
    r = t.type
  if (n != null)
    r === 'number'
      ? ((n === 0 && e.value === '') || e.value != n) && (e.value = '' + n)
      : e.value !== '' + n && (e.value = '' + n)
  else if (r === 'submit' || r === 'reset') {
    e.removeAttribute('value')
    return
  }
  t.hasOwnProperty('value') ? Io(e, t.type, n) : t.hasOwnProperty('defaultValue') && Io(e, t.type, qt(t.defaultValue)),
    t.checked == null && t.defaultChecked != null && (e.defaultChecked = !!t.defaultChecked)
}
function Da(e, t, n) {
  if (t.hasOwnProperty('value') || t.hasOwnProperty('defaultValue')) {
    var r = t.type
    if (!((r !== 'submit' && r !== 'reset') || (t.value !== void 0 && t.value !== null))) return
    ;(t = '' + e._wrapperState.initialValue), n || t === e.value || (e.value = t), (e.defaultValue = t)
  }
  ;(n = e.name),
    n !== '' && (e.name = ''),
    (e.defaultChecked = !!e._wrapperState.initialChecked),
    n !== '' && (e.name = n)
}
function Io(e, t, n) {
  ;(t !== 'number' || Ji(e.ownerDocument) !== e) &&
    (n == null
      ? (e.defaultValue = '' + e._wrapperState.initialValue)
      : e.defaultValue !== '' + n && (e.defaultValue = '' + n))
}
var Er = Array.isArray
function Dn(e, t, n, r) {
  if (((e = e.options), t)) {
    t = {}
    for (var i = 0; i < n.length; i++) t['$' + n[i]] = !0
    for (n = 0; n < e.length; n++)
      (i = t.hasOwnProperty('$' + e[n].value)),
        e[n].selected !== i && (e[n].selected = i),
        i && r && (e[n].defaultSelected = !0)
  } else {
    for (n = '' + qt(n), t = null, i = 0; i < e.length; i++) {
      if (e[i].value === n) {
        ;(e[i].selected = !0), r && (e[i].defaultSelected = !0)
        return
      }
      t !== null || e[i].disabled || (t = e[i])
    }
    t !== null && (t.selected = !0)
  }
}
function Mo(e, t) {
  if (t.dangerouslySetInnerHTML != null) throw Error(A(91))
  return K({}, t, { value: void 0, defaultValue: void 0, children: '' + e._wrapperState.initialValue })
}
function Fa(e, t) {
  var n = t.value
  if (n == null) {
    if (((n = t.children), (t = t.defaultValue), n != null)) {
      if (t != null) throw Error(A(92))
      if (Er(n)) {
        if (1 < n.length) throw Error(A(93))
        n = n[0]
      }
      t = n
    }
    t == null && (t = ''), (n = t)
  }
  e._wrapperState = { initialValue: qt(n) }
}
function jc(e, t) {
  var n = qt(t.value),
    r = qt(t.defaultValue)
  n != null &&
    ((n = '' + n),
    n !== e.value && (e.value = n),
    t.defaultValue == null && e.defaultValue !== n && (e.defaultValue = n)),
    r != null && (e.defaultValue = '' + r)
}
function Ua(e) {
  var t = e.textContent
  t === e._wrapperState.initialValue && t !== '' && t !== null && (e.value = t)
}
function Hc(e) {
  switch (e) {
    case 'svg':
      return 'http://www.w3.org/2000/svg'
    case 'math':
      return 'http://www.w3.org/1998/Math/MathML'
    default:
      return 'http://www.w3.org/1999/xhtml'
  }
}
function Ro(e, t) {
  return e == null || e === 'http://www.w3.org/1999/xhtml'
    ? Hc(t)
    : e === 'http://www.w3.org/2000/svg' && t === 'foreignObject'
    ? 'http://www.w3.org/1999/xhtml'
    : e
}
var pi,
  Bc = (function (e) {
    return typeof MSApp < 'u' && MSApp.execUnsafeLocalFunction
      ? function (t, n, r, i) {
          MSApp.execUnsafeLocalFunction(function () {
            return e(t, n, r, i)
          })
        }
      : e
  })(function (e, t) {
    if (e.namespaceURI !== 'http://www.w3.org/2000/svg' || 'innerHTML' in e) e.innerHTML = t
    else {
      for (
        pi = pi || document.createElement('div'),
          pi.innerHTML = '<svg>' + t.valueOf().toString() + '</svg>',
          t = pi.firstChild;
        e.firstChild;

      )
        e.removeChild(e.firstChild)
      for (; t.firstChild; ) e.appendChild(t.firstChild)
    }
  })
function zr(e, t) {
  if (t) {
    var n = e.firstChild
    if (n && n === e.lastChild && n.nodeType === 3) {
      n.nodeValue = t
      return
    }
  }
  e.textContent = t
}
var Nr = {
    animationIterationCount: !0,
    aspectRatio: !0,
    borderImageOutset: !0,
    borderImageSlice: !0,
    borderImageWidth: !0,
    boxFlex: !0,
    boxFlexGroup: !0,
    boxOrdinalGroup: !0,
    columnCount: !0,
    columns: !0,
    flex: !0,
    flexGrow: !0,
    flexPositive: !0,
    flexShrink: !0,
    flexNegative: !0,
    flexOrder: !0,
    gridArea: !0,
    gridRow: !0,
    gridRowEnd: !0,
    gridRowSpan: !0,
    gridRowStart: !0,
    gridColumn: !0,
    gridColumnEnd: !0,
    gridColumnSpan: !0,
    gridColumnStart: !0,
    fontWeight: !0,
    lineClamp: !0,
    lineHeight: !0,
    opacity: !0,
    order: !0,
    orphans: !0,
    tabSize: !0,
    widows: !0,
    zIndex: !0,
    zoom: !0,
    fillOpacity: !0,
    floodOpacity: !0,
    stopOpacity: !0,
    strokeDasharray: !0,
    strokeDashoffset: !0,
    strokeMiterlimit: !0,
    strokeOpacity: !0,
    strokeWidth: !0,
  },
  Vp = ['Webkit', 'ms', 'Moz', 'O']
Object.keys(Nr).forEach(function (e) {
  Vp.forEach(function (t) {
    ;(t = t + e.charAt(0).toUpperCase() + e.substring(1)), (Nr[t] = Nr[e])
  })
})
function qc(e, t, n) {
  return t == null || typeof t == 'boolean' || t === ''
    ? ''
    : n || typeof t != 'number' || t === 0 || (Nr.hasOwnProperty(e) && Nr[e])
    ? ('' + t).trim()
    : t + 'px'
}
function Wc(e, t) {
  e = e.style
  for (var n in t)
    if (t.hasOwnProperty(n)) {
      var r = n.indexOf('--') === 0,
        i = qc(n, t[n], r)
      n === 'float' && (n = 'cssFloat'), r ? e.setProperty(n, i) : (e[n] = i)
    }
}
var Qp = K(
  { menuitem: !0 },
  {
    area: !0,
    base: !0,
    br: !0,
    col: !0,
    embed: !0,
    hr: !0,
    img: !0,
    input: !0,
    keygen: !0,
    link: !0,
    meta: !0,
    param: !0,
    source: !0,
    track: !0,
    wbr: !0,
  },
)
function Po(e, t) {
  if (t) {
    if (Qp[e] && (t.children != null || t.dangerouslySetInnerHTML != null)) throw Error(A(137, e))
    if (t.dangerouslySetInnerHTML != null) {
      if (t.children != null) throw Error(A(60))
      if (typeof t.dangerouslySetInnerHTML != 'object' || !('__html' in t.dangerouslySetInnerHTML)) throw Error(A(61))
    }
    if (t.style != null && typeof t.style != 'object') throw Error(A(62))
  }
}
function $o(e, t) {
  if (e.indexOf('-') === -1) return typeof t.is == 'string'
  switch (e) {
    case 'annotation-xml':
    case 'color-profile':
    case 'font-face':
    case 'font-face-src':
    case 'font-face-uri':
    case 'font-face-format':
    case 'font-face-name':
    case 'missing-glyph':
      return !1
    default:
      return !0
  }
}
var Oo = null
function Fl(e) {
  return (
    (e = e.target || e.srcElement || window),
    e.correspondingUseElement && (e = e.correspondingUseElement),
    e.nodeType === 3 ? e.parentNode : e
  )
}
var zo = null,
  Fn = null,
  Un = null
function ja(e) {
  if ((e = si(e))) {
    if (typeof zo != 'function') throw Error(A(280))
    var t = e.stateNode
    t && ((t = Is(t)), zo(e.stateNode, e.type, t))
  }
}
function Vc(e) {
  Fn ? (Un ? Un.push(e) : (Un = [e])) : (Fn = e)
}
function Qc() {
  if (Fn) {
    var e = Fn,
      t = Un
    if (((Un = Fn = null), ja(e), t)) for (e = 0; e < t.length; e++) ja(t[e])
  }
}
function Xc(e, t) {
  return e(t)
}
function Gc() {}
var Js = !1
function Kc(e, t, n) {
  if (Js) return e(t, n)
  Js = !0
  try {
    return Xc(e, t, n)
  } finally {
    ;(Js = !1), (Fn !== null || Un !== null) && (Gc(), Qc())
  }
}
function Dr(e, t) {
  var n = e.stateNode
  if (n === null) return null
  var r = Is(n)
  if (r === null) return null
  n = r[t]
  e: switch (t) {
    case 'onClick':
    case 'onClickCapture':
    case 'onDoubleClick':
    case 'onDoubleClickCapture':
    case 'onMouseDown':
    case 'onMouseDownCapture':
    case 'onMouseMove':
    case 'onMouseMoveCapture':
    case 'onMouseUp':
    case 'onMouseUpCapture':
    case 'onMouseEnter':
      ;(r = !r.disabled) ||
        ((e = e.type), (r = !(e === 'button' || e === 'input' || e === 'select' || e === 'textarea'))),
        (e = !r)
      break e
    default:
      e = !1
  }
  if (e) return null
  if (n && typeof n != 'function') throw Error(A(231, t, typeof n))
  return n
}
var Do = !1
if (Tt)
  try {
    var or = {}
    Object.defineProperty(or, 'passive', {
      get: function () {
        Do = !0
      },
    }),
      window.addEventListener('test', or, or),
      window.removeEventListener('test', or, or)
  } catch {
    Do = !1
  }
function Xp(e, t, n, r, i, s, o, l, a) {
  var u = Array.prototype.slice.call(arguments, 3)
  try {
    t.apply(n, u)
  } catch (c) {
    this.onError(c)
  }
}
var Cr = !1,
  Yi = null,
  Zi = !1,
  Fo = null,
  Gp = {
    onError: function (e) {
      ;(Cr = !0), (Yi = e)
    },
  }
function Kp(e, t, n, r, i, s, o, l, a) {
  ;(Cr = !1), (Yi = null), Xp.apply(Gp, arguments)
}
function Jp(e, t, n, r, i, s, o, l, a) {
  if ((Kp.apply(this, arguments), Cr)) {
    if (Cr) {
      var u = Yi
      ;(Cr = !1), (Yi = null)
    } else throw Error(A(198))
    Zi || ((Zi = !0), (Fo = u))
  }
}
function yn(e) {
  var t = e,
    n = e
  if (e.alternate) for (; t.return; ) t = t.return
  else {
    e = t
    do (t = e), t.flags & 4098 && (n = t.return), (e = t.return)
    while (e)
  }
  return t.tag === 3 ? n : null
}
function Jc(e) {
  if (e.tag === 13) {
    var t = e.memoizedState
    if ((t === null && ((e = e.alternate), e !== null && (t = e.memoizedState)), t !== null)) return t.dehydrated
  }
  return null
}
function Ha(e) {
  if (yn(e) !== e) throw Error(A(188))
}
function Yp(e) {
  var t = e.alternate
  if (!t) {
    if (((t = yn(e)), t === null)) throw Error(A(188))
    return t !== e ? null : e
  }
  for (var n = e, r = t; ; ) {
    var i = n.return
    if (i === null) break
    var s = i.alternate
    if (s === null) {
      if (((r = i.return), r !== null)) {
        n = r
        continue
      }
      break
    }
    if (i.child === s.child) {
      for (s = i.child; s; ) {
        if (s === n) return Ha(i), e
        if (s === r) return Ha(i), t
        s = s.sibling
      }
      throw Error(A(188))
    }
    if (n.return !== r.return) (n = i), (r = s)
    else {
      for (var o = !1, l = i.child; l; ) {
        if (l === n) {
          ;(o = !0), (n = i), (r = s)
          break
        }
        if (l === r) {
          ;(o = !0), (r = i), (n = s)
          break
        }
        l = l.sibling
      }
      if (!o) {
        for (l = s.child; l; ) {
          if (l === n) {
            ;(o = !0), (n = s), (r = i)
            break
          }
          if (l === r) {
            ;(o = !0), (r = s), (n = i)
            break
          }
          l = l.sibling
        }
        if (!o) throw Error(A(189))
      }
    }
    if (n.alternate !== r) throw Error(A(190))
  }
  if (n.tag !== 3) throw Error(A(188))
  return n.stateNode.current === n ? e : t
}
function Yc(e) {
  return (e = Yp(e)), e !== null ? Zc(e) : null
}
function Zc(e) {
  if (e.tag === 5 || e.tag === 6) return e
  for (e = e.child; e !== null; ) {
    var t = Zc(e)
    if (t !== null) return t
    e = e.sibling
  }
  return null
}
var ef = Ue.unstable_scheduleCallback,
  Ba = Ue.unstable_cancelCallback,
  Zp = Ue.unstable_shouldYield,
  em = Ue.unstable_requestPaint,
  Y = Ue.unstable_now,
  tm = Ue.unstable_getCurrentPriorityLevel,
  Ul = Ue.unstable_ImmediatePriority,
  tf = Ue.unstable_UserBlockingPriority,
  es = Ue.unstable_NormalPriority,
  nm = Ue.unstable_LowPriority,
  nf = Ue.unstable_IdlePriority,
  Cs = null,
  dt = null
function rm(e) {
  if (dt && typeof dt.onCommitFiberRoot == 'function')
    try {
      dt.onCommitFiberRoot(Cs, e, void 0, (e.current.flags & 128) === 128)
    } catch {}
}
var st = Math.clz32 ? Math.clz32 : om,
  im = Math.log,
  sm = Math.LN2
function om(e) {
  return (e >>>= 0), e === 0 ? 32 : (31 - ((im(e) / sm) | 0)) | 0
}
var mi = 64,
  gi = 4194304
function xr(e) {
  switch (e & -e) {
    case 1:
      return 1
    case 2:
      return 2
    case 4:
      return 4
    case 8:
      return 8
    case 16:
      return 16
    case 32:
      return 32
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return e & 4194240
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return e & 130023424
    case 134217728:
      return 134217728
    case 268435456:
      return 268435456
    case 536870912:
      return 536870912
    case 1073741824:
      return 1073741824
    default:
      return e
  }
}
function ts(e, t) {
  var n = e.pendingLanes
  if (n === 0) return 0
  var r = 0,
    i = e.suspendedLanes,
    s = e.pingedLanes,
    o = n & 268435455
  if (o !== 0) {
    var l = o & ~i
    l !== 0 ? (r = xr(l)) : ((s &= o), s !== 0 && (r = xr(s)))
  } else (o = n & ~i), o !== 0 ? (r = xr(o)) : s !== 0 && (r = xr(s))
  if (r === 0) return 0
  if (t !== 0 && t !== r && !(t & i) && ((i = r & -r), (s = t & -t), i >= s || (i === 16 && (s & 4194240) !== 0)))
    return t
  if ((r & 4 && (r |= n & 16), (t = e.entangledLanes), t !== 0))
    for (e = e.entanglements, t &= r; 0 < t; ) (n = 31 - st(t)), (i = 1 << n), (r |= e[n]), (t &= ~i)
  return r
}
function lm(e, t) {
  switch (e) {
    case 1:
    case 2:
    case 4:
      return t + 250
    case 8:
    case 16:
    case 32:
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return t + 5e3
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return -1
    case 134217728:
    case 268435456:
    case 536870912:
    case 1073741824:
      return -1
    default:
      return -1
  }
}
function am(e, t) {
  for (var n = e.suspendedLanes, r = e.pingedLanes, i = e.expirationTimes, s = e.pendingLanes; 0 < s; ) {
    var o = 31 - st(s),
      l = 1 << o,
      a = i[o]
    a === -1 ? (!(l & n) || l & r) && (i[o] = lm(l, t)) : a <= t && (e.expiredLanes |= l), (s &= ~l)
  }
}
function Uo(e) {
  return (e = e.pendingLanes & -1073741825), e !== 0 ? e : e & 1073741824 ? 1073741824 : 0
}
function rf() {
  var e = mi
  return (mi <<= 1), !(mi & 4194240) && (mi = 64), e
}
function Ys(e) {
  for (var t = [], n = 0; 31 > n; n++) t.push(e)
  return t
}
function ri(e, t, n) {
  ;(e.pendingLanes |= t),
    t !== 536870912 && ((e.suspendedLanes = 0), (e.pingedLanes = 0)),
    (e = e.eventTimes),
    (t = 31 - st(t)),
    (e[t] = n)
}
function um(e, t) {
  var n = e.pendingLanes & ~t
  ;(e.pendingLanes = t),
    (e.suspendedLanes = 0),
    (e.pingedLanes = 0),
    (e.expiredLanes &= t),
    (e.mutableReadLanes &= t),
    (e.entangledLanes &= t),
    (t = e.entanglements)
  var r = e.eventTimes
  for (e = e.expirationTimes; 0 < n; ) {
    var i = 31 - st(n),
      s = 1 << i
    ;(t[i] = 0), (r[i] = -1), (e[i] = -1), (n &= ~s)
  }
}
function jl(e, t) {
  var n = (e.entangledLanes |= t)
  for (e = e.entanglements; n; ) {
    var r = 31 - st(n),
      i = 1 << r
    ;(i & t) | (e[r] & t) && (e[r] |= t), (n &= ~i)
  }
}
var U = 0
function sf(e) {
  return (e &= -e), 1 < e ? (4 < e ? (e & 268435455 ? 16 : 536870912) : 4) : 1
}
var of,
  Hl,
  lf,
  af,
  uf,
  jo = !1,
  vi = [],
  Dt = null,
  Ft = null,
  Ut = null,
  Fr = new Map(),
  Ur = new Map(),
  Pt = [],
  cm =
    'mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit'.split(
      ' ',
    )
function qa(e, t) {
  switch (e) {
    case 'focusin':
    case 'focusout':
      Dt = null
      break
    case 'dragenter':
    case 'dragleave':
      Ft = null
      break
    case 'mouseover':
    case 'mouseout':
      Ut = null
      break
    case 'pointerover':
    case 'pointerout':
      Fr.delete(t.pointerId)
      break
    case 'gotpointercapture':
    case 'lostpointercapture':
      Ur.delete(t.pointerId)
  }
}
function lr(e, t, n, r, i, s) {
  return e === null || e.nativeEvent !== s
    ? ((e = { blockedOn: t, domEventName: n, eventSystemFlags: r, nativeEvent: s, targetContainers: [i] }),
      t !== null && ((t = si(t)), t !== null && Hl(t)),
      e)
    : ((e.eventSystemFlags |= r), (t = e.targetContainers), i !== null && t.indexOf(i) === -1 && t.push(i), e)
}
function fm(e, t, n, r, i) {
  switch (t) {
    case 'focusin':
      return (Dt = lr(Dt, e, t, n, r, i)), !0
    case 'dragenter':
      return (Ft = lr(Ft, e, t, n, r, i)), !0
    case 'mouseover':
      return (Ut = lr(Ut, e, t, n, r, i)), !0
    case 'pointerover':
      var s = i.pointerId
      return Fr.set(s, lr(Fr.get(s) || null, e, t, n, r, i)), !0
    case 'gotpointercapture':
      return (s = i.pointerId), Ur.set(s, lr(Ur.get(s) || null, e, t, n, r, i)), !0
  }
  return !1
}
function cf(e) {
  var t = tn(e.target)
  if (t !== null) {
    var n = yn(t)
    if (n !== null) {
      if (((t = n.tag), t === 13)) {
        if (((t = Jc(n)), t !== null)) {
          ;(e.blockedOn = t),
            uf(e.priority, function () {
              lf(n)
            })
          return
        }
      } else if (t === 3 && n.stateNode.current.memoizedState.isDehydrated) {
        e.blockedOn = n.tag === 3 ? n.stateNode.containerInfo : null
        return
      }
    }
  }
  e.blockedOn = null
}
function $i(e) {
  if (e.blockedOn !== null) return !1
  for (var t = e.targetContainers; 0 < t.length; ) {
    var n = Ho(e.domEventName, e.eventSystemFlags, t[0], e.nativeEvent)
    if (n === null) {
      n = e.nativeEvent
      var r = new n.constructor(n.type, n)
      ;(Oo = r), n.target.dispatchEvent(r), (Oo = null)
    } else return (t = si(n)), t !== null && Hl(t), (e.blockedOn = n), !1
    t.shift()
  }
  return !0
}
function Wa(e, t, n) {
  $i(e) && n.delete(t)
}
function dm() {
  ;(jo = !1),
    Dt !== null && $i(Dt) && (Dt = null),
    Ft !== null && $i(Ft) && (Ft = null),
    Ut !== null && $i(Ut) && (Ut = null),
    Fr.forEach(Wa),
    Ur.forEach(Wa)
}
function ar(e, t) {
  e.blockedOn === t &&
    ((e.blockedOn = null), jo || ((jo = !0), Ue.unstable_scheduleCallback(Ue.unstable_NormalPriority, dm)))
}
function jr(e) {
  function t(i) {
    return ar(i, e)
  }
  if (0 < vi.length) {
    ar(vi[0], e)
    for (var n = 1; n < vi.length; n++) {
      var r = vi[n]
      r.blockedOn === e && (r.blockedOn = null)
    }
  }
  for (
    Dt !== null && ar(Dt, e), Ft !== null && ar(Ft, e), Ut !== null && ar(Ut, e), Fr.forEach(t), Ur.forEach(t), n = 0;
    n < Pt.length;
    n++
  )
    (r = Pt[n]), r.blockedOn === e && (r.blockedOn = null)
  for (; 0 < Pt.length && ((n = Pt[0]), n.blockedOn === null); ) cf(n), n.blockedOn === null && Pt.shift()
}
var jn = At.ReactCurrentBatchConfig,
  ns = !0
function hm(e, t, n, r) {
  var i = U,
    s = jn.transition
  jn.transition = null
  try {
    ;(U = 1), Bl(e, t, n, r)
  } finally {
    ;(U = i), (jn.transition = s)
  }
}
function pm(e, t, n, r) {
  var i = U,
    s = jn.transition
  jn.transition = null
  try {
    ;(U = 4), Bl(e, t, n, r)
  } finally {
    ;(U = i), (jn.transition = s)
  }
}
function Bl(e, t, n, r) {
  if (ns) {
    var i = Ho(e, t, n, r)
    if (i === null) ao(e, t, r, rs, n), qa(e, r)
    else if (fm(i, e, t, n, r)) r.stopPropagation()
    else if ((qa(e, r), t & 4 && -1 < cm.indexOf(e))) {
      for (; i !== null; ) {
        var s = si(i)
        if ((s !== null && of(s), (s = Ho(e, t, n, r)), s === null && ao(e, t, r, rs, n), s === i)) break
        i = s
      }
      i !== null && r.stopPropagation()
    } else ao(e, t, r, null, n)
  }
}
var rs = null
function Ho(e, t, n, r) {
  if (((rs = null), (e = Fl(r)), (e = tn(e)), e !== null))
    if (((t = yn(e)), t === null)) e = null
    else if (((n = t.tag), n === 13)) {
      if (((e = Jc(t)), e !== null)) return e
      e = null
    } else if (n === 3) {
      if (t.stateNode.current.memoizedState.isDehydrated) return t.tag === 3 ? t.stateNode.containerInfo : null
      e = null
    } else t !== e && (e = null)
  return (rs = e), null
}
function ff(e) {
  switch (e) {
    case 'cancel':
    case 'click':
    case 'close':
    case 'contextmenu':
    case 'copy':
    case 'cut':
    case 'auxclick':
    case 'dblclick':
    case 'dragend':
    case 'dragstart':
    case 'drop':
    case 'focusin':
    case 'focusout':
    case 'input':
    case 'invalid':
    case 'keydown':
    case 'keypress':
    case 'keyup':
    case 'mousedown':
    case 'mouseup':
    case 'paste':
    case 'pause':
    case 'play':
    case 'pointercancel':
    case 'pointerdown':
    case 'pointerup':
    case 'ratechange':
    case 'reset':
    case 'resize':
    case 'seeked':
    case 'submit':
    case 'touchcancel':
    case 'touchend':
    case 'touchstart':
    case 'volumechange':
    case 'change':
    case 'selectionchange':
    case 'textInput':
    case 'compositionstart':
    case 'compositionend':
    case 'compositionupdate':
    case 'beforeblur':
    case 'afterblur':
    case 'beforeinput':
    case 'blur':
    case 'fullscreenchange':
    case 'focus':
    case 'hashchange':
    case 'popstate':
    case 'select':
    case 'selectstart':
      return 1
    case 'drag':
    case 'dragenter':
    case 'dragexit':
    case 'dragleave':
    case 'dragover':
    case 'mousemove':
    case 'mouseout':
    case 'mouseover':
    case 'pointermove':
    case 'pointerout':
    case 'pointerover':
    case 'scroll':
    case 'toggle':
    case 'touchmove':
    case 'wheel':
    case 'mouseenter':
    case 'mouseleave':
    case 'pointerenter':
    case 'pointerleave':
      return 4
    case 'message':
      switch (tm()) {
        case Ul:
          return 1
        case tf:
          return 4
        case es:
        case nm:
          return 16
        case nf:
          return 536870912
        default:
          return 16
      }
    default:
      return 16
  }
}
var Ot = null,
  ql = null,
  Oi = null
function df() {
  if (Oi) return Oi
  var e,
    t = ql,
    n = t.length,
    r,
    i = 'value' in Ot ? Ot.value : Ot.textContent,
    s = i.length
  for (e = 0; e < n && t[e] === i[e]; e++);
  var o = n - e
  for (r = 1; r <= o && t[n - r] === i[s - r]; r++);
  return (Oi = i.slice(e, 1 < r ? 1 - r : void 0))
}
function zi(e) {
  var t = e.keyCode
  return (
    'charCode' in e ? ((e = e.charCode), e === 0 && t === 13 && (e = 13)) : (e = t),
    e === 10 && (e = 13),
    32 <= e || e === 13 ? e : 0
  )
}
function yi() {
  return !0
}
function Va() {
  return !1
}
function He(e) {
  function t(n, r, i, s, o) {
    ;(this._reactName = n),
      (this._targetInst = i),
      (this.type = r),
      (this.nativeEvent = s),
      (this.target = o),
      (this.currentTarget = null)
    for (var l in e) e.hasOwnProperty(l) && ((n = e[l]), (this[l] = n ? n(s) : s[l]))
    return (
      (this.isDefaultPrevented = (s.defaultPrevented != null ? s.defaultPrevented : s.returnValue === !1) ? yi : Va),
      (this.isPropagationStopped = Va),
      this
    )
  }
  return (
    K(t.prototype, {
      preventDefault: function () {
        this.defaultPrevented = !0
        var n = this.nativeEvent
        n &&
          (n.preventDefault ? n.preventDefault() : typeof n.returnValue != 'unknown' && (n.returnValue = !1),
          (this.isDefaultPrevented = yi))
      },
      stopPropagation: function () {
        var n = this.nativeEvent
        n &&
          (n.stopPropagation ? n.stopPropagation() : typeof n.cancelBubble != 'unknown' && (n.cancelBubble = !0),
          (this.isPropagationStopped = yi))
      },
      persist: function () {},
      isPersistent: yi,
    }),
    t
  )
}
var Yn = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function (e) {
      return e.timeStamp || Date.now()
    },
    defaultPrevented: 0,
    isTrusted: 0,
  },
  Wl = He(Yn),
  ii = K({}, Yn, { view: 0, detail: 0 }),
  mm = He(ii),
  Zs,
  eo,
  ur,
  As = K({}, ii, {
    screenX: 0,
    screenY: 0,
    clientX: 0,
    clientY: 0,
    pageX: 0,
    pageY: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    getModifierState: Vl,
    button: 0,
    buttons: 0,
    relatedTarget: function (e) {
      return e.relatedTarget === void 0
        ? e.fromElement === e.srcElement
          ? e.toElement
          : e.fromElement
        : e.relatedTarget
    },
    movementX: function (e) {
      return 'movementX' in e
        ? e.movementX
        : (e !== ur &&
            (ur && e.type === 'mousemove'
              ? ((Zs = e.screenX - ur.screenX), (eo = e.screenY - ur.screenY))
              : (eo = Zs = 0),
            (ur = e)),
          Zs)
    },
    movementY: function (e) {
      return 'movementY' in e ? e.movementY : eo
    },
  }),
  Qa = He(As),
  gm = K({}, As, { dataTransfer: 0 }),
  vm = He(gm),
  ym = K({}, ii, { relatedTarget: 0 }),
  to = He(ym),
  wm = K({}, Yn, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }),
  Sm = He(wm),
  Em = K({}, Yn, {
    clipboardData: function (e) {
      return 'clipboardData' in e ? e.clipboardData : window.clipboardData
    },
  }),
  xm = He(Em),
  _m = K({}, Yn, { data: 0 }),
  Xa = He(_m),
  km = {
    Esc: 'Escape',
    Spacebar: ' ',
    Left: 'ArrowLeft',
    Up: 'ArrowUp',
    Right: 'ArrowRight',
    Down: 'ArrowDown',
    Del: 'Delete',
    Win: 'OS',
    Menu: 'ContextMenu',
    Apps: 'ContextMenu',
    Scroll: 'ScrollLock',
    MozPrintableKey: 'Unidentified',
  },
  Tm = {
    8: 'Backspace',
    9: 'Tab',
    12: 'Clear',
    13: 'Enter',
    16: 'Shift',
    17: 'Control',
    18: 'Alt',
    19: 'Pause',
    20: 'CapsLock',
    27: 'Escape',
    32: ' ',
    33: 'PageUp',
    34: 'PageDown',
    35: 'End',
    36: 'Home',
    37: 'ArrowLeft',
    38: 'ArrowUp',
    39: 'ArrowRight',
    40: 'ArrowDown',
    45: 'Insert',
    46: 'Delete',
    112: 'F1',
    113: 'F2',
    114: 'F3',
    115: 'F4',
    116: 'F5',
    117: 'F6',
    118: 'F7',
    119: 'F8',
    120: 'F9',
    121: 'F10',
    122: 'F11',
    123: 'F12',
    144: 'NumLock',
    145: 'ScrollLock',
    224: 'Meta',
  },
  Nm = { Alt: 'altKey', Control: 'ctrlKey', Meta: 'metaKey', Shift: 'shiftKey' }
function Cm(e) {
  var t = this.nativeEvent
  return t.getModifierState ? t.getModifierState(e) : (e = Nm[e]) ? !!t[e] : !1
}
function Vl() {
  return Cm
}
var Am = K({}, ii, {
    key: function (e) {
      if (e.key) {
        var t = km[e.key] || e.key
        if (t !== 'Unidentified') return t
      }
      return e.type === 'keypress'
        ? ((e = zi(e)), e === 13 ? 'Enter' : String.fromCharCode(e))
        : e.type === 'keydown' || e.type === 'keyup'
        ? Tm[e.keyCode] || 'Unidentified'
        : ''
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: Vl,
    charCode: function (e) {
      return e.type === 'keypress' ? zi(e) : 0
    },
    keyCode: function (e) {
      return e.type === 'keydown' || e.type === 'keyup' ? e.keyCode : 0
    },
    which: function (e) {
      return e.type === 'keypress' ? zi(e) : e.type === 'keydown' || e.type === 'keyup' ? e.keyCode : 0
    },
  }),
  Lm = He(Am),
  bm = K({}, As, {
    pointerId: 0,
    width: 0,
    height: 0,
    pressure: 0,
    tangentialPressure: 0,
    tiltX: 0,
    tiltY: 0,
    twist: 0,
    pointerType: 0,
    isPrimary: 0,
  }),
  Ga = He(bm),
  Im = K({}, ii, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: Vl,
  }),
  Mm = He(Im),
  Rm = K({}, Yn, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }),
  Pm = He(Rm),
  $m = K({}, As, {
    deltaX: function (e) {
      return 'deltaX' in e ? e.deltaX : 'wheelDeltaX' in e ? -e.wheelDeltaX : 0
    },
    deltaY: function (e) {
      return 'deltaY' in e ? e.deltaY : 'wheelDeltaY' in e ? -e.wheelDeltaY : 'wheelDelta' in e ? -e.wheelDelta : 0
    },
    deltaZ: 0,
    deltaMode: 0,
  }),
  Om = He($m),
  zm = [9, 13, 27, 32],
  Ql = Tt && 'CompositionEvent' in window,
  Ar = null
Tt && 'documentMode' in document && (Ar = document.documentMode)
var Dm = Tt && 'TextEvent' in window && !Ar,
  hf = Tt && (!Ql || (Ar && 8 < Ar && 11 >= Ar)),
  Ka = String.fromCharCode(32),
  Ja = !1
function pf(e, t) {
  switch (e) {
    case 'keyup':
      return zm.indexOf(t.keyCode) !== -1
    case 'keydown':
      return t.keyCode !== 229
    case 'keypress':
    case 'mousedown':
    case 'focusout':
      return !0
    default:
      return !1
  }
}
function mf(e) {
  return (e = e.detail), typeof e == 'object' && 'data' in e ? e.data : null
}
var Cn = !1
function Fm(e, t) {
  switch (e) {
    case 'compositionend':
      return mf(t)
    case 'keypress':
      return t.which !== 32 ? null : ((Ja = !0), Ka)
    case 'textInput':
      return (e = t.data), e === Ka && Ja ? null : e
    default:
      return null
  }
}
function Um(e, t) {
  if (Cn) return e === 'compositionend' || (!Ql && pf(e, t)) ? ((e = df()), (Oi = ql = Ot = null), (Cn = !1), e) : null
  switch (e) {
    case 'paste':
      return null
    case 'keypress':
      if (!(t.ctrlKey || t.altKey || t.metaKey) || (t.ctrlKey && t.altKey)) {
        if (t.char && 1 < t.char.length) return t.char
        if (t.which) return String.fromCharCode(t.which)
      }
      return null
    case 'compositionend':
      return hf && t.locale !== 'ko' ? null : t.data
    default:
      return null
  }
}
var jm = {
  color: !0,
  date: !0,
  datetime: !0,
  'datetime-local': !0,
  email: !0,
  month: !0,
  number: !0,
  password: !0,
  range: !0,
  search: !0,
  tel: !0,
  text: !0,
  time: !0,
  url: !0,
  week: !0,
}
function Ya(e) {
  var t = e && e.nodeName && e.nodeName.toLowerCase()
  return t === 'input' ? !!jm[e.type] : t === 'textarea'
}
function gf(e, t, n, r) {
  Vc(r),
    (t = is(t, 'onChange')),
    0 < t.length && ((n = new Wl('onChange', 'change', null, n, r)), e.push({ event: n, listeners: t }))
}
var Lr = null,
  Hr = null
function Hm(e) {
  Cf(e, 0)
}
function Ls(e) {
  var t = bn(e)
  if (Fc(t)) return e
}
function Bm(e, t) {
  if (e === 'change') return t
}
var vf = !1
if (Tt) {
  var no
  if (Tt) {
    var ro = 'oninput' in document
    if (!ro) {
      var Za = document.createElement('div')
      Za.setAttribute('oninput', 'return;'), (ro = typeof Za.oninput == 'function')
    }
    no = ro
  } else no = !1
  vf = no && (!document.documentMode || 9 < document.documentMode)
}
function eu() {
  Lr && (Lr.detachEvent('onpropertychange', yf), (Hr = Lr = null))
}
function yf(e) {
  if (e.propertyName === 'value' && Ls(Hr)) {
    var t = []
    gf(t, Hr, e, Fl(e)), Kc(Hm, t)
  }
}
function qm(e, t, n) {
  e === 'focusin' ? (eu(), (Lr = t), (Hr = n), Lr.attachEvent('onpropertychange', yf)) : e === 'focusout' && eu()
}
function Wm(e) {
  if (e === 'selectionchange' || e === 'keyup' || e === 'keydown') return Ls(Hr)
}
function Vm(e, t) {
  if (e === 'click') return Ls(t)
}
function Qm(e, t) {
  if (e === 'input' || e === 'change') return Ls(t)
}
function Xm(e, t) {
  return (e === t && (e !== 0 || 1 / e === 1 / t)) || (e !== e && t !== t)
}
var ot = typeof Object.is == 'function' ? Object.is : Xm
function Br(e, t) {
  if (ot(e, t)) return !0
  if (typeof e != 'object' || e === null || typeof t != 'object' || t === null) return !1
  var n = Object.keys(e),
    r = Object.keys(t)
  if (n.length !== r.length) return !1
  for (r = 0; r < n.length; r++) {
    var i = n[r]
    if (!ko.call(t, i) || !ot(e[i], t[i])) return !1
  }
  return !0
}
function tu(e) {
  for (; e && e.firstChild; ) e = e.firstChild
  return e
}
function nu(e, t) {
  var n = tu(e)
  e = 0
  for (var r; n; ) {
    if (n.nodeType === 3) {
      if (((r = e + n.textContent.length), e <= t && r >= t)) return { node: n, offset: t - e }
      e = r
    }
    e: {
      for (; n; ) {
        if (n.nextSibling) {
          n = n.nextSibling
          break e
        }
        n = n.parentNode
      }
      n = void 0
    }
    n = tu(n)
  }
}
function wf(e, t) {
  return e && t
    ? e === t
      ? !0
      : e && e.nodeType === 3
      ? !1
      : t && t.nodeType === 3
      ? wf(e, t.parentNode)
      : 'contains' in e
      ? e.contains(t)
      : e.compareDocumentPosition
      ? !!(e.compareDocumentPosition(t) & 16)
      : !1
    : !1
}
function Sf() {
  for (var e = window, t = Ji(); t instanceof e.HTMLIFrameElement; ) {
    try {
      var n = typeof t.contentWindow.location.href == 'string'
    } catch {
      n = !1
    }
    if (n) e = t.contentWindow
    else break
    t = Ji(e.document)
  }
  return t
}
function Xl(e) {
  var t = e && e.nodeName && e.nodeName.toLowerCase()
  return (
    t &&
    ((t === 'input' &&
      (e.type === 'text' || e.type === 'search' || e.type === 'tel' || e.type === 'url' || e.type === 'password')) ||
      t === 'textarea' ||
      e.contentEditable === 'true')
  )
}
function Gm(e) {
  var t = Sf(),
    n = e.focusedElem,
    r = e.selectionRange
  if (t !== n && n && n.ownerDocument && wf(n.ownerDocument.documentElement, n)) {
    if (r !== null && Xl(n)) {
      if (((t = r.start), (e = r.end), e === void 0 && (e = t), 'selectionStart' in n))
        (n.selectionStart = t), (n.selectionEnd = Math.min(e, n.value.length))
      else if (((e = ((t = n.ownerDocument || document) && t.defaultView) || window), e.getSelection)) {
        e = e.getSelection()
        var i = n.textContent.length,
          s = Math.min(r.start, i)
        ;(r = r.end === void 0 ? s : Math.min(r.end, i)),
          !e.extend && s > r && ((i = r), (r = s), (s = i)),
          (i = nu(n, s))
        var o = nu(n, r)
        i &&
          o &&
          (e.rangeCount !== 1 ||
            e.anchorNode !== i.node ||
            e.anchorOffset !== i.offset ||
            e.focusNode !== o.node ||
            e.focusOffset !== o.offset) &&
          ((t = t.createRange()),
          t.setStart(i.node, i.offset),
          e.removeAllRanges(),
          s > r ? (e.addRange(t), e.extend(o.node, o.offset)) : (t.setEnd(o.node, o.offset), e.addRange(t)))
      }
    }
    for (t = [], e = n; (e = e.parentNode); )
      e.nodeType === 1 && t.push({ element: e, left: e.scrollLeft, top: e.scrollTop })
    for (typeof n.focus == 'function' && n.focus(), n = 0; n < t.length; n++)
      (e = t[n]), (e.element.scrollLeft = e.left), (e.element.scrollTop = e.top)
  }
}
var Km = Tt && 'documentMode' in document && 11 >= document.documentMode,
  An = null,
  Bo = null,
  br = null,
  qo = !1
function ru(e, t, n) {
  var r = n.window === n ? n.document : n.nodeType === 9 ? n : n.ownerDocument
  qo ||
    An == null ||
    An !== Ji(r) ||
    ((r = An),
    'selectionStart' in r && Xl(r)
      ? (r = { start: r.selectionStart, end: r.selectionEnd })
      : ((r = ((r.ownerDocument && r.ownerDocument.defaultView) || window).getSelection()),
        (r = {
          anchorNode: r.anchorNode,
          anchorOffset: r.anchorOffset,
          focusNode: r.focusNode,
          focusOffset: r.focusOffset,
        })),
    (br && Br(br, r)) ||
      ((br = r),
      (r = is(Bo, 'onSelect')),
      0 < r.length &&
        ((t = new Wl('onSelect', 'select', null, t, n)), e.push({ event: t, listeners: r }), (t.target = An))))
}
function wi(e, t) {
  var n = {}
  return (n[e.toLowerCase()] = t.toLowerCase()), (n['Webkit' + e] = 'webkit' + t), (n['Moz' + e] = 'moz' + t), n
}
var Ln = {
    animationend: wi('Animation', 'AnimationEnd'),
    animationiteration: wi('Animation', 'AnimationIteration'),
    animationstart: wi('Animation', 'AnimationStart'),
    transitionend: wi('Transition', 'TransitionEnd'),
  },
  io = {},
  Ef = {}
Tt &&
  ((Ef = document.createElement('div').style),
  'AnimationEvent' in window ||
    (delete Ln.animationend.animation, delete Ln.animationiteration.animation, delete Ln.animationstart.animation),
  'TransitionEvent' in window || delete Ln.transitionend.transition)
function bs(e) {
  if (io[e]) return io[e]
  if (!Ln[e]) return e
  var t = Ln[e],
    n
  for (n in t) if (t.hasOwnProperty(n) && n in Ef) return (io[e] = t[n])
  return e
}
var xf = bs('animationend'),
  _f = bs('animationiteration'),
  kf = bs('animationstart'),
  Tf = bs('transitionend'),
  Nf = new Map(),
  iu =
    'abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel'.split(
      ' ',
    )
function Qt(e, t) {
  Nf.set(e, t), vn(t, [e])
}
for (var so = 0; so < iu.length; so++) {
  var oo = iu[so],
    Jm = oo.toLowerCase(),
    Ym = oo[0].toUpperCase() + oo.slice(1)
  Qt(Jm, 'on' + Ym)
}
Qt(xf, 'onAnimationEnd')
Qt(_f, 'onAnimationIteration')
Qt(kf, 'onAnimationStart')
Qt('dblclick', 'onDoubleClick')
Qt('focusin', 'onFocus')
Qt('focusout', 'onBlur')
Qt(Tf, 'onTransitionEnd')
qn('onMouseEnter', ['mouseout', 'mouseover'])
qn('onMouseLeave', ['mouseout', 'mouseover'])
qn('onPointerEnter', ['pointerout', 'pointerover'])
qn('onPointerLeave', ['pointerout', 'pointerover'])
vn('onChange', 'change click focusin focusout input keydown keyup selectionchange'.split(' '))
vn('onSelect', 'focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange'.split(' '))
vn('onBeforeInput', ['compositionend', 'keypress', 'textInput', 'paste'])
vn('onCompositionEnd', 'compositionend focusout keydown keypress keyup mousedown'.split(' '))
vn('onCompositionStart', 'compositionstart focusout keydown keypress keyup mousedown'.split(' '))
vn('onCompositionUpdate', 'compositionupdate focusout keydown keypress keyup mousedown'.split(' '))
var _r =
    'abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting'.split(
      ' ',
    ),
  Zm = new Set('cancel close invalid load scroll toggle'.split(' ').concat(_r))
function su(e, t, n) {
  var r = e.type || 'unknown-event'
  ;(e.currentTarget = n), Jp(r, t, void 0, e), (e.currentTarget = null)
}
function Cf(e, t) {
  t = (t & 4) !== 0
  for (var n = 0; n < e.length; n++) {
    var r = e[n],
      i = r.event
    r = r.listeners
    e: {
      var s = void 0
      if (t)
        for (var o = r.length - 1; 0 <= o; o--) {
          var l = r[o],
            a = l.instance,
            u = l.currentTarget
          if (((l = l.listener), a !== s && i.isPropagationStopped())) break e
          su(i, l, u), (s = a)
        }
      else
        for (o = 0; o < r.length; o++) {
          if (
            ((l = r[o]), (a = l.instance), (u = l.currentTarget), (l = l.listener), a !== s && i.isPropagationStopped())
          )
            break e
          su(i, l, u), (s = a)
        }
    }
  }
  if (Zi) throw ((e = Fo), (Zi = !1), (Fo = null), e)
}
function H(e, t) {
  var n = t[Go]
  n === void 0 && (n = t[Go] = new Set())
  var r = e + '__bubble'
  n.has(r) || (Af(t, e, 2, !1), n.add(r))
}
function lo(e, t, n) {
  var r = 0
  t && (r |= 4), Af(n, e, r, t)
}
var Si = '_reactListening' + Math.random().toString(36).slice(2)
function qr(e) {
  if (!e[Si]) {
    ;(e[Si] = !0),
      Pc.forEach(function (n) {
        n !== 'selectionchange' && (Zm.has(n) || lo(n, !1, e), lo(n, !0, e))
      })
    var t = e.nodeType === 9 ? e : e.ownerDocument
    t === null || t[Si] || ((t[Si] = !0), lo('selectionchange', !1, t))
  }
}
function Af(e, t, n, r) {
  switch (ff(t)) {
    case 1:
      var i = hm
      break
    case 4:
      i = pm
      break
    default:
      i = Bl
  }
  ;(n = i.bind(null, t, n, e)),
    (i = void 0),
    !Do || (t !== 'touchstart' && t !== 'touchmove' && t !== 'wheel') || (i = !0),
    r
      ? i !== void 0
        ? e.addEventListener(t, n, { capture: !0, passive: i })
        : e.addEventListener(t, n, !0)
      : i !== void 0
      ? e.addEventListener(t, n, { passive: i })
      : e.addEventListener(t, n, !1)
}
function ao(e, t, n, r, i) {
  var s = r
  if (!(t & 1) && !(t & 2) && r !== null)
    e: for (;;) {
      if (r === null) return
      var o = r.tag
      if (o === 3 || o === 4) {
        var l = r.stateNode.containerInfo
        if (l === i || (l.nodeType === 8 && l.parentNode === i)) break
        if (o === 4)
          for (o = r.return; o !== null; ) {
            var a = o.tag
            if (
              (a === 3 || a === 4) &&
              ((a = o.stateNode.containerInfo), a === i || (a.nodeType === 8 && a.parentNode === i))
            )
              return
            o = o.return
          }
        for (; l !== null; ) {
          if (((o = tn(l)), o === null)) return
          if (((a = o.tag), a === 5 || a === 6)) {
            r = s = o
            continue e
          }
          l = l.parentNode
        }
      }
      r = r.return
    }
  Kc(function () {
    var u = s,
      c = Fl(n),
      p = []
    e: {
      var f = Nf.get(e)
      if (f !== void 0) {
        var y = Wl,
          g = e
        switch (e) {
          case 'keypress':
            if (zi(n) === 0) break e
          case 'keydown':
          case 'keyup':
            y = Lm
            break
          case 'focusin':
            ;(g = 'focus'), (y = to)
            break
          case 'focusout':
            ;(g = 'blur'), (y = to)
            break
          case 'beforeblur':
          case 'afterblur':
            y = to
            break
          case 'click':
            if (n.button === 2) break e
          case 'auxclick':
          case 'dblclick':
          case 'mousedown':
          case 'mousemove':
          case 'mouseup':
          case 'mouseout':
          case 'mouseover':
          case 'contextmenu':
            y = Qa
            break
          case 'drag':
          case 'dragend':
          case 'dragenter':
          case 'dragexit':
          case 'dragleave':
          case 'dragover':
          case 'dragstart':
          case 'drop':
            y = vm
            break
          case 'touchcancel':
          case 'touchend':
          case 'touchmove':
          case 'touchstart':
            y = Mm
            break
          case xf:
          case _f:
          case kf:
            y = Sm
            break
          case Tf:
            y = Pm
            break
          case 'scroll':
            y = mm
            break
          case 'wheel':
            y = Om
            break
          case 'copy':
          case 'cut':
          case 'paste':
            y = xm
            break
          case 'gotpointercapture':
          case 'lostpointercapture':
          case 'pointercancel':
          case 'pointerdown':
          case 'pointermove':
          case 'pointerout':
          case 'pointerover':
          case 'pointerup':
            y = Ga
        }
        var w = (t & 4) !== 0,
          x = !w && e === 'scroll',
          h = w ? (f !== null ? f + 'Capture' : null) : f
        w = []
        for (var d = u, v; d !== null; ) {
          v = d
          var S = v.stateNode
          if (
            (v.tag === 5 && S !== null && ((v = S), h !== null && ((S = Dr(d, h)), S != null && w.push(Wr(d, S, v)))),
            x)
          )
            break
          d = d.return
        }
        0 < w.length && ((f = new y(f, g, null, n, c)), p.push({ event: f, listeners: w }))
      }
    }
    if (!(t & 7)) {
      e: {
        if (
          ((f = e === 'mouseover' || e === 'pointerover'),
          (y = e === 'mouseout' || e === 'pointerout'),
          f && n !== Oo && (g = n.relatedTarget || n.fromElement) && (tn(g) || g[Nt]))
        )
          break e
        if (
          (y || f) &&
          ((f = c.window === c ? c : (f = c.ownerDocument) ? f.defaultView || f.parentWindow : window),
          y
            ? ((g = n.relatedTarget || n.toElement),
              (y = u),
              (g = g ? tn(g) : null),
              g !== null && ((x = yn(g)), g !== x || (g.tag !== 5 && g.tag !== 6)) && (g = null))
            : ((y = null), (g = u)),
          y !== g)
        ) {
          if (
            ((w = Qa),
            (S = 'onMouseLeave'),
            (h = 'onMouseEnter'),
            (d = 'mouse'),
            (e === 'pointerout' || e === 'pointerover') &&
              ((w = Ga), (S = 'onPointerLeave'), (h = 'onPointerEnter'), (d = 'pointer')),
            (x = y == null ? f : bn(y)),
            (v = g == null ? f : bn(g)),
            (f = new w(S, d + 'leave', y, n, c)),
            (f.target = x),
            (f.relatedTarget = v),
            (S = null),
            tn(c) === u && ((w = new w(h, d + 'enter', g, n, c)), (w.target = v), (w.relatedTarget = x), (S = w)),
            (x = S),
            y && g)
          )
            t: {
              for (w = y, h = g, d = 0, v = w; v; v = En(v)) d++
              for (v = 0, S = h; S; S = En(S)) v++
              for (; 0 < d - v; ) (w = En(w)), d--
              for (; 0 < v - d; ) (h = En(h)), v--
              for (; d--; ) {
                if (w === h || (h !== null && w === h.alternate)) break t
                ;(w = En(w)), (h = En(h))
              }
              w = null
            }
          else w = null
          y !== null && ou(p, f, y, w, !1), g !== null && x !== null && ou(p, x, g, w, !0)
        }
      }
      e: {
        if (
          ((f = u ? bn(u) : window),
          (y = f.nodeName && f.nodeName.toLowerCase()),
          y === 'select' || (y === 'input' && f.type === 'file'))
        )
          var T = Bm
        else if (Ya(f))
          if (vf) T = Qm
          else {
            T = Wm
            var C = qm
          }
        else
          (y = f.nodeName) && y.toLowerCase() === 'input' && (f.type === 'checkbox' || f.type === 'radio') && (T = Vm)
        if (T && (T = T(e, u))) {
          gf(p, T, n, c)
          break e
        }
        C && C(e, f, u),
          e === 'focusout' && (C = f._wrapperState) && C.controlled && f.type === 'number' && Io(f, 'number', f.value)
      }
      switch (((C = u ? bn(u) : window), e)) {
        case 'focusin':
          ;(Ya(C) || C.contentEditable === 'true') && ((An = C), (Bo = u), (br = null))
          break
        case 'focusout':
          br = Bo = An = null
          break
        case 'mousedown':
          qo = !0
          break
        case 'contextmenu':
        case 'mouseup':
        case 'dragend':
          ;(qo = !1), ru(p, n, c)
          break
        case 'selectionchange':
          if (Km) break
        case 'keydown':
        case 'keyup':
          ru(p, n, c)
      }
      var E
      if (Ql)
        e: {
          switch (e) {
            case 'compositionstart':
              var _ = 'onCompositionStart'
              break e
            case 'compositionend':
              _ = 'onCompositionEnd'
              break e
            case 'compositionupdate':
              _ = 'onCompositionUpdate'
              break e
          }
          _ = void 0
        }
      else
        Cn ? pf(e, n) && (_ = 'onCompositionEnd') : e === 'keydown' && n.keyCode === 229 && (_ = 'onCompositionStart')
      _ &&
        (hf &&
          n.locale !== 'ko' &&
          (Cn || _ !== 'onCompositionStart'
            ? _ === 'onCompositionEnd' && Cn && (E = df())
            : ((Ot = c), (ql = 'value' in Ot ? Ot.value : Ot.textContent), (Cn = !0))),
        (C = is(u, _)),
        0 < C.length &&
          ((_ = new Xa(_, e, null, n, c)),
          p.push({ event: _, listeners: C }),
          E ? (_.data = E) : ((E = mf(n)), E !== null && (_.data = E)))),
        (E = Dm ? Fm(e, n) : Um(e, n)) &&
          ((u = is(u, 'onBeforeInput')),
          0 < u.length &&
            ((c = new Xa('onBeforeInput', 'beforeinput', null, n, c)),
            p.push({ event: c, listeners: u }),
            (c.data = E)))
    }
    Cf(p, t)
  })
}
function Wr(e, t, n) {
  return { instance: e, listener: t, currentTarget: n }
}
function is(e, t) {
  for (var n = t + 'Capture', r = []; e !== null; ) {
    var i = e,
      s = i.stateNode
    i.tag === 5 &&
      s !== null &&
      ((i = s), (s = Dr(e, n)), s != null && r.unshift(Wr(e, s, i)), (s = Dr(e, t)), s != null && r.push(Wr(e, s, i))),
      (e = e.return)
  }
  return r
}
function En(e) {
  if (e === null) return null
  do e = e.return
  while (e && e.tag !== 5)
  return e || null
}
function ou(e, t, n, r, i) {
  for (var s = t._reactName, o = []; n !== null && n !== r; ) {
    var l = n,
      a = l.alternate,
      u = l.stateNode
    if (a !== null && a === r) break
    l.tag === 5 &&
      u !== null &&
      ((l = u),
      i
        ? ((a = Dr(n, s)), a != null && o.unshift(Wr(n, a, l)))
        : i || ((a = Dr(n, s)), a != null && o.push(Wr(n, a, l)))),
      (n = n.return)
  }
  o.length !== 0 && e.push({ event: t, listeners: o })
}
var eg = /\r\n?/g,
  tg = /\u0000|\uFFFD/g
function lu(e) {
  return (typeof e == 'string' ? e : '' + e)
    .replace(
      eg,
      `
`,
    )
    .replace(tg, '')
}
function Ei(e, t, n) {
  if (((t = lu(t)), lu(e) !== t && n)) throw Error(A(425))
}
function ss() {}
var Wo = null,
  Vo = null
function Qo(e, t) {
  return (
    e === 'textarea' ||
    e === 'noscript' ||
    typeof t.children == 'string' ||
    typeof t.children == 'number' ||
    (typeof t.dangerouslySetInnerHTML == 'object' &&
      t.dangerouslySetInnerHTML !== null &&
      t.dangerouslySetInnerHTML.__html != null)
  )
}
var Xo = typeof setTimeout == 'function' ? setTimeout : void 0,
  ng = typeof clearTimeout == 'function' ? clearTimeout : void 0,
  au = typeof Promise == 'function' ? Promise : void 0,
  rg =
    typeof queueMicrotask == 'function'
      ? queueMicrotask
      : typeof au < 'u'
      ? function (e) {
          return au.resolve(null).then(e).catch(ig)
        }
      : Xo
function ig(e) {
  setTimeout(function () {
    throw e
  })
}
function uo(e, t) {
  var n = t,
    r = 0
  do {
    var i = n.nextSibling
    if ((e.removeChild(n), i && i.nodeType === 8))
      if (((n = i.data), n === '/$')) {
        if (r === 0) {
          e.removeChild(i), jr(t)
          return
        }
        r--
      } else (n !== '$' && n !== '$?' && n !== '$!') || r++
    n = i
  } while (n)
  jr(t)
}
function St(e) {
  for (; e != null; e = e.nextSibling) {
    var t = e.nodeType
    if (t === 1 || t === 3) break
    if (t === 8) {
      if (((t = e.data), t === '$' || t === '$!' || t === '$?')) break
      if (t === '/$') return null
    }
  }
  return e
}
function uu(e) {
  e = e.previousSibling
  for (var t = 0; e; ) {
    if (e.nodeType === 8) {
      var n = e.data
      if (n === '$' || n === '$!' || n === '$?') {
        if (t === 0) return e
        t--
      } else n === '/$' && t++
    }
    e = e.previousSibling
  }
  return null
}
var Zn = Math.random().toString(36).slice(2),
  ft = '__reactFiber$' + Zn,
  Vr = '__reactProps$' + Zn,
  Nt = '__reactContainer$' + Zn,
  Go = '__reactEvents$' + Zn,
  sg = '__reactListeners$' + Zn,
  og = '__reactHandles$' + Zn
function tn(e) {
  var t = e[ft]
  if (t) return t
  for (var n = e.parentNode; n; ) {
    if ((t = n[Nt] || n[ft])) {
      if (((n = t.alternate), t.child !== null || (n !== null && n.child !== null)))
        for (e = uu(e); e !== null; ) {
          if ((n = e[ft])) return n
          e = uu(e)
        }
      return t
    }
    ;(e = n), (n = e.parentNode)
  }
  return null
}
function si(e) {
  return (e = e[ft] || e[Nt]), !e || (e.tag !== 5 && e.tag !== 6 && e.tag !== 13 && e.tag !== 3) ? null : e
}
function bn(e) {
  if (e.tag === 5 || e.tag === 6) return e.stateNode
  throw Error(A(33))
}
function Is(e) {
  return e[Vr] || null
}
var Ko = [],
  In = -1
function Xt(e) {
  return { current: e }
}
function B(e) {
  0 > In || ((e.current = Ko[In]), (Ko[In] = null), In--)
}
function j(e, t) {
  In++, (Ko[In] = e.current), (e.current = t)
}
var Wt = {},
  ve = Xt(Wt),
  Me = Xt(!1),
  fn = Wt
function Wn(e, t) {
  var n = e.type.contextTypes
  if (!n) return Wt
  var r = e.stateNode
  if (r && r.__reactInternalMemoizedUnmaskedChildContext === t) return r.__reactInternalMemoizedMaskedChildContext
  var i = {},
    s
  for (s in n) i[s] = t[s]
  return (
    r &&
      ((e = e.stateNode),
      (e.__reactInternalMemoizedUnmaskedChildContext = t),
      (e.__reactInternalMemoizedMaskedChildContext = i)),
    i
  )
}
function Re(e) {
  return (e = e.childContextTypes), e != null
}
function os() {
  B(Me), B(ve)
}
function cu(e, t, n) {
  if (ve.current !== Wt) throw Error(A(168))
  j(ve, t), j(Me, n)
}
function Lf(e, t, n) {
  var r = e.stateNode
  if (((t = t.childContextTypes), typeof r.getChildContext != 'function')) return n
  r = r.getChildContext()
  for (var i in r) if (!(i in t)) throw Error(A(108, qp(e) || 'Unknown', i))
  return K({}, n, r)
}
function ls(e) {
  return (
    (e = ((e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext) || Wt),
    (fn = ve.current),
    j(ve, e),
    j(Me, Me.current),
    !0
  )
}
function fu(e, t, n) {
  var r = e.stateNode
  if (!r) throw Error(A(169))
  n ? ((e = Lf(e, t, fn)), (r.__reactInternalMemoizedMergedChildContext = e), B(Me), B(ve), j(ve, e)) : B(Me), j(Me, n)
}
var wt = null,
  Ms = !1,
  co = !1
function bf(e) {
  wt === null ? (wt = [e]) : wt.push(e)
}
function lg(e) {
  ;(Ms = !0), bf(e)
}
function Gt() {
  if (!co && wt !== null) {
    co = !0
    var e = 0,
      t = U
    try {
      var n = wt
      for (U = 1; e < n.length; e++) {
        var r = n[e]
        do r = r(!0)
        while (r !== null)
      }
      ;(wt = null), (Ms = !1)
    } catch (i) {
      throw (wt !== null && (wt = wt.slice(e + 1)), ef(Ul, Gt), i)
    } finally {
      ;(U = t), (co = !1)
    }
  }
  return null
}
var ag = At.ReactCurrentBatchConfig
function tt(e, t) {
  if (e && e.defaultProps) {
    ;(t = K({}, t)), (e = e.defaultProps)
    for (var n in e) t[n] === void 0 && (t[n] = e[n])
    return t
  }
  return t
}
var as = Xt(null),
  us = null,
  Mn = null,
  Gl = null
function Kl() {
  Gl = Mn = us = null
}
function Jl(e) {
  var t = as.current
  B(as), (e._currentValue = t)
}
function Jo(e, t, n) {
  for (; e !== null; ) {
    var r = e.alternate
    if (
      ((e.childLanes & t) !== t
        ? ((e.childLanes |= t), r !== null && (r.childLanes |= t))
        : r !== null && (r.childLanes & t) !== t && (r.childLanes |= t),
      e === n)
    )
      break
    e = e.return
  }
}
function Hn(e, t) {
  ;(us = e),
    (Gl = Mn = null),
    (e = e.dependencies),
    e !== null && e.firstContext !== null && (e.lanes & t && (Le = !0), (e.firstContext = null))
}
function Ge(e) {
  var t = e._currentValue
  if (Gl !== e)
    if (((e = { context: e, memoizedValue: t, next: null }), Mn === null)) {
      if (us === null) throw Error(A(308))
      ;(Mn = e), (us.dependencies = { lanes: 0, firstContext: e })
    } else Mn = Mn.next = e
  return t
}
var it = null,
  Mt = !1
function Yl(e) {
  e.updateQueue = {
    baseState: e.memoizedState,
    firstBaseUpdate: null,
    lastBaseUpdate: null,
    shared: { pending: null, interleaved: null, lanes: 0 },
    effects: null,
  }
}
function If(e, t) {
  ;(e = e.updateQueue),
    t.updateQueue === e &&
      (t.updateQueue = {
        baseState: e.baseState,
        firstBaseUpdate: e.firstBaseUpdate,
        lastBaseUpdate: e.lastBaseUpdate,
        shared: e.shared,
        effects: e.effects,
      })
}
function _t(e, t) {
  return { eventTime: e, lane: t, tag: 0, payload: null, callback: null, next: null }
}
function jt(e, t) {
  var n = e.updateQueue
  n !== null &&
    ((n = n.shared),
    Sd(e)
      ? ((e = n.interleaved),
        e === null ? ((t.next = t), it === null ? (it = [n]) : it.push(n)) : ((t.next = e.next), (e.next = t)),
        (n.interleaved = t))
      : ((e = n.pending), e === null ? (t.next = t) : ((t.next = e.next), (e.next = t)), (n.pending = t)))
}
function Di(e, t, n) {
  if (((t = t.updateQueue), t !== null && ((t = t.shared), (n & 4194240) !== 0))) {
    var r = t.lanes
    ;(r &= e.pendingLanes), (n |= r), (t.lanes = n), jl(e, n)
  }
}
function du(e, t) {
  var n = e.updateQueue,
    r = e.alternate
  if (r !== null && ((r = r.updateQueue), n === r)) {
    var i = null,
      s = null
    if (((n = n.firstBaseUpdate), n !== null)) {
      do {
        var o = {
          eventTime: n.eventTime,
          lane: n.lane,
          tag: n.tag,
          payload: n.payload,
          callback: n.callback,
          next: null,
        }
        s === null ? (i = s = o) : (s = s.next = o), (n = n.next)
      } while (n !== null)
      s === null ? (i = s = t) : (s = s.next = t)
    } else i = s = t
    ;(n = { baseState: r.baseState, firstBaseUpdate: i, lastBaseUpdate: s, shared: r.shared, effects: r.effects }),
      (e.updateQueue = n)
    return
  }
  ;(e = n.lastBaseUpdate), e === null ? (n.firstBaseUpdate = t) : (e.next = t), (n.lastBaseUpdate = t)
}
function cs(e, t, n, r) {
  var i = e.updateQueue
  Mt = !1
  var s = i.firstBaseUpdate,
    o = i.lastBaseUpdate,
    l = i.shared.pending
  if (l !== null) {
    i.shared.pending = null
    var a = l,
      u = a.next
    ;(a.next = null), o === null ? (s = u) : (o.next = u), (o = a)
    var c = e.alternate
    c !== null &&
      ((c = c.updateQueue),
      (l = c.lastBaseUpdate),
      l !== o && (l === null ? (c.firstBaseUpdate = u) : (l.next = u), (c.lastBaseUpdate = a)))
  }
  if (s !== null) {
    var p = i.baseState
    ;(o = 0), (c = u = a = null), (l = s)
    do {
      var f = l.lane,
        y = l.eventTime
      if ((r & f) === f) {
        c !== null &&
          (c = c.next = { eventTime: y, lane: 0, tag: l.tag, payload: l.payload, callback: l.callback, next: null })
        e: {
          var g = e,
            w = l
          switch (((f = t), (y = n), w.tag)) {
            case 1:
              if (((g = w.payload), typeof g == 'function')) {
                p = g.call(y, p, f)
                break e
              }
              p = g
              break e
            case 3:
              g.flags = (g.flags & -65537) | 128
            case 0:
              if (((g = w.payload), (f = typeof g == 'function' ? g.call(y, p, f) : g), f == null)) break e
              p = K({}, p, f)
              break e
            case 2:
              Mt = !0
          }
        }
        l.callback !== null &&
          l.lane !== 0 &&
          ((e.flags |= 64), (f = i.effects), f === null ? (i.effects = [l]) : f.push(l))
      } else
        (y = { eventTime: y, lane: f, tag: l.tag, payload: l.payload, callback: l.callback, next: null }),
          c === null ? ((u = c = y), (a = p)) : (c = c.next = y),
          (o |= f)
      if (((l = l.next), l === null)) {
        if (((l = i.shared.pending), l === null)) break
        ;(f = l), (l = f.next), (f.next = null), (i.lastBaseUpdate = f), (i.shared.pending = null)
      }
    } while (1)
    if (
      (c === null && (a = p),
      (i.baseState = a),
      (i.firstBaseUpdate = u),
      (i.lastBaseUpdate = c),
      (t = i.shared.interleaved),
      t !== null)
    ) {
      i = t
      do (o |= i.lane), (i = i.next)
      while (i !== t)
    } else s === null && (i.shared.lanes = 0)
    ;(pn |= o), (e.lanes = o), (e.memoizedState = p)
  }
}
function hu(e, t, n) {
  if (((e = t.effects), (t.effects = null), e !== null))
    for (t = 0; t < e.length; t++) {
      var r = e[t],
        i = r.callback
      if (i !== null) {
        if (((r.callback = null), (r = n), typeof i != 'function')) throw Error(A(191, i))
        i.call(r)
      }
    }
}
var Mf = new Rc.Component().refs
function Yo(e, t, n, r) {
  ;(t = e.memoizedState),
    (n = n(r, t)),
    (n = n == null ? t : K({}, t, n)),
    (e.memoizedState = n),
    e.lanes === 0 && (e.updateQueue.baseState = n)
}
var Rs = {
  isMounted: function (e) {
    return (e = e._reactInternals) ? yn(e) === e : !1
  },
  enqueueSetState: function (e, t, n) {
    e = e._reactInternals
    var r = Ee(),
      i = Bt(e),
      s = _t(r, i)
    ;(s.payload = t), n != null && (s.callback = n), jt(e, s), (t = Xe(e, i, r)), t !== null && Di(t, e, i)
  },
  enqueueReplaceState: function (e, t, n) {
    e = e._reactInternals
    var r = Ee(),
      i = Bt(e),
      s = _t(r, i)
    ;(s.tag = 1), (s.payload = t), n != null && (s.callback = n), jt(e, s), (t = Xe(e, i, r)), t !== null && Di(t, e, i)
  },
  enqueueForceUpdate: function (e, t) {
    e = e._reactInternals
    var n = Ee(),
      r = Bt(e),
      i = _t(n, r)
    ;(i.tag = 2), t != null && (i.callback = t), jt(e, i), (t = Xe(e, r, n)), t !== null && Di(t, e, r)
  },
}
function pu(e, t, n, r, i, s, o) {
  return (
    (e = e.stateNode),
    typeof e.shouldComponentUpdate == 'function'
      ? e.shouldComponentUpdate(r, s, o)
      : t.prototype && t.prototype.isPureReactComponent
      ? !Br(n, r) || !Br(i, s)
      : !0
  )
}
function Rf(e, t, n) {
  var r = !1,
    i = Wt,
    s = t.contextType
  return (
    typeof s == 'object' && s !== null
      ? (s = Ge(s))
      : ((i = Re(t) ? fn : ve.current), (r = t.contextTypes), (s = (r = r != null) ? Wn(e, i) : Wt)),
    (t = new t(n, s)),
    (e.memoizedState = t.state !== null && t.state !== void 0 ? t.state : null),
    (t.updater = Rs),
    (e.stateNode = t),
    (t._reactInternals = e),
    r &&
      ((e = e.stateNode),
      (e.__reactInternalMemoizedUnmaskedChildContext = i),
      (e.__reactInternalMemoizedMaskedChildContext = s)),
    t
  )
}
function mu(e, t, n, r) {
  ;(e = t.state),
    typeof t.componentWillReceiveProps == 'function' && t.componentWillReceiveProps(n, r),
    typeof t.UNSAFE_componentWillReceiveProps == 'function' && t.UNSAFE_componentWillReceiveProps(n, r),
    t.state !== e && Rs.enqueueReplaceState(t, t.state, null)
}
function Zo(e, t, n, r) {
  var i = e.stateNode
  ;(i.props = n), (i.state = e.memoizedState), (i.refs = Mf), Yl(e)
  var s = t.contextType
  typeof s == 'object' && s !== null ? (i.context = Ge(s)) : ((s = Re(t) ? fn : ve.current), (i.context = Wn(e, s))),
    (i.state = e.memoizedState),
    (s = t.getDerivedStateFromProps),
    typeof s == 'function' && (Yo(e, t, s, n), (i.state = e.memoizedState)),
    typeof t.getDerivedStateFromProps == 'function' ||
      typeof i.getSnapshotBeforeUpdate == 'function' ||
      (typeof i.UNSAFE_componentWillMount != 'function' && typeof i.componentWillMount != 'function') ||
      ((t = i.state),
      typeof i.componentWillMount == 'function' && i.componentWillMount(),
      typeof i.UNSAFE_componentWillMount == 'function' && i.UNSAFE_componentWillMount(),
      t !== i.state && Rs.enqueueReplaceState(i, i.state, null),
      cs(e, n, i, r),
      (i.state = e.memoizedState)),
    typeof i.componentDidMount == 'function' && (e.flags |= 4194308)
}
var Rn = [],
  Pn = 0,
  fs = null,
  ds = 0,
  Be = [],
  qe = 0,
  dn = null,
  Et = 1,
  xt = ''
function Jt(e, t) {
  ;(Rn[Pn++] = ds), (Rn[Pn++] = fs), (fs = e), (ds = t)
}
function Pf(e, t, n) {
  ;(Be[qe++] = Et), (Be[qe++] = xt), (Be[qe++] = dn), (dn = e)
  var r = Et
  e = xt
  var i = 32 - st(r) - 1
  ;(r &= ~(1 << i)), (n += 1)
  var s = 32 - st(t) + i
  if (30 < s) {
    var o = i - (i % 5)
    ;(s = (r & ((1 << o) - 1)).toString(32)),
      (r >>= o),
      (i -= o),
      (Et = (1 << (32 - st(t) + i)) | (n << i) | r),
      (xt = s + e)
  } else (Et = (1 << s) | (n << i) | r), (xt = e)
}
function Zl(e) {
  e.return !== null && (Jt(e, 1), Pf(e, 1, 0))
}
function ea(e) {
  for (; e === fs; ) (fs = Rn[--Pn]), (Rn[Pn] = null), (ds = Rn[--Pn]), (Rn[Pn] = null)
  for (; e === dn; )
    (dn = Be[--qe]), (Be[qe] = null), (xt = Be[--qe]), (Be[qe] = null), (Et = Be[--qe]), (Be[qe] = null)
}
var Fe = null,
  Ae = null,
  W = !1,
  rt = null
function $f(e, t) {
  var n = Ve(5, null, null, 0)
  ;(n.elementType = 'DELETED'),
    (n.stateNode = t),
    (n.return = e),
    (t = e.deletions),
    t === null ? ((e.deletions = [n]), (e.flags |= 16)) : t.push(n)
}
function gu(e, t) {
  switch (e.tag) {
    case 5:
      var n = e.type
      return (
        (t = t.nodeType !== 1 || n.toLowerCase() !== t.nodeName.toLowerCase() ? null : t),
        t !== null ? ((e.stateNode = t), (Fe = e), (Ae = St(t.firstChild)), !0) : !1
      )
    case 6:
      return (
        (t = e.pendingProps === '' || t.nodeType !== 3 ? null : t),
        t !== null ? ((e.stateNode = t), (Fe = e), (Ae = null), !0) : !1
      )
    case 13:
      return (
        (t = t.nodeType !== 8 ? null : t),
        t !== null
          ? ((n = dn !== null ? { id: Et, overflow: xt } : null),
            (e.memoizedState = { dehydrated: t, treeContext: n, retryLane: 1073741824 }),
            (n = Ve(18, null, null, 0)),
            (n.stateNode = t),
            (n.return = e),
            (e.child = n),
            (Fe = e),
            (Ae = null),
            !0)
          : !1
      )
    default:
      return !1
  }
}
function el(e) {
  return (e.mode & 1) !== 0 && (e.flags & 128) === 0
}
function tl(e) {
  if (W) {
    var t = Ae
    if (t) {
      var n = t
      if (!gu(e, t)) {
        if (el(e)) throw Error(A(418))
        t = St(n.nextSibling)
        var r = Fe
        t && gu(e, t) ? $f(r, n) : ((e.flags = (e.flags & -4097) | 2), (W = !1), (Fe = e))
      }
    } else {
      if (el(e)) throw Error(A(418))
      ;(e.flags = (e.flags & -4097) | 2), (W = !1), (Fe = e)
    }
  }
}
function vu(e) {
  for (e = e.return; e !== null && e.tag !== 5 && e.tag !== 3 && e.tag !== 13; ) e = e.return
  Fe = e
}
function cr(e) {
  if (e !== Fe) return !1
  if (!W) return vu(e), (W = !0), !1
  var t
  if (
    ((t = e.tag !== 3) &&
      !(t = e.tag !== 5) &&
      ((t = e.type), (t = t !== 'head' && t !== 'body' && !Qo(e.type, e.memoizedProps))),
    t && (t = Ae))
  ) {
    if (el(e)) {
      for (e = Ae; e; ) e = St(e.nextSibling)
      throw Error(A(418))
    }
    for (; t; ) $f(e, t), (t = St(t.nextSibling))
  }
  if ((vu(e), e.tag === 13)) {
    if (((e = e.memoizedState), (e = e !== null ? e.dehydrated : null), !e)) throw Error(A(317))
    e: {
      for (e = e.nextSibling, t = 0; e; ) {
        if (e.nodeType === 8) {
          var n = e.data
          if (n === '/$') {
            if (t === 0) {
              Ae = St(e.nextSibling)
              break e
            }
            t--
          } else (n !== '$' && n !== '$!' && n !== '$?') || t++
        }
        e = e.nextSibling
      }
      Ae = null
    }
  } else Ae = Fe ? St(e.stateNode.nextSibling) : null
  return !0
}
function Vn() {
  ;(Ae = Fe = null), (W = !1)
}
function ta(e) {
  rt === null ? (rt = [e]) : rt.push(e)
}
function fr(e, t, n) {
  if (((e = n.ref), e !== null && typeof e != 'function' && typeof e != 'object')) {
    if (n._owner) {
      if (((n = n._owner), n)) {
        if (n.tag !== 1) throw Error(A(309))
        var r = n.stateNode
      }
      if (!r) throw Error(A(147, e))
      var i = r,
        s = '' + e
      return t !== null && t.ref !== null && typeof t.ref == 'function' && t.ref._stringRef === s
        ? t.ref
        : ((t = function (o) {
            var l = i.refs
            l === Mf && (l = i.refs = {}), o === null ? delete l[s] : (l[s] = o)
          }),
          (t._stringRef = s),
          t)
    }
    if (typeof e != 'string') throw Error(A(284))
    if (!n._owner) throw Error(A(290, e))
  }
  return e
}
function xi(e, t) {
  throw (
    ((e = Object.prototype.toString.call(t)),
    Error(A(31, e === '[object Object]' ? 'object with keys {' + Object.keys(t).join(', ') + '}' : e)))
  )
}
function yu(e) {
  var t = e._init
  return t(e._payload)
}
function Of(e) {
  function t(h, d) {
    if (e) {
      var v = h.deletions
      v === null ? ((h.deletions = [d]), (h.flags |= 16)) : v.push(d)
    }
  }
  function n(h, d) {
    if (!e) return null
    for (; d !== null; ) t(h, d), (d = d.sibling)
    return null
  }
  function r(h, d) {
    for (h = new Map(); d !== null; ) d.key !== null ? h.set(d.key, d) : h.set(d.index, d), (d = d.sibling)
    return h
  }
  function i(h, d) {
    return (h = Vt(h, d)), (h.index = 0), (h.sibling = null), h
  }
  function s(h, d, v) {
    return (
      (h.index = v),
      e
        ? ((v = h.alternate), v !== null ? ((v = v.index), v < d ? ((h.flags |= 2), d) : v) : ((h.flags |= 2), d))
        : ((h.flags |= 1048576), d)
    )
  }
  function o(h) {
    return e && h.alternate === null && (h.flags |= 2), h
  }
  function l(h, d, v, S) {
    return d === null || d.tag !== 6 ? ((d = vo(v, h.mode, S)), (d.return = h), d) : ((d = i(d, v)), (d.return = h), d)
  }
  function a(h, d, v, S) {
    var T = v.type
    return T === Nn
      ? c(h, d, v.props.children, S, v.key)
      : d !== null &&
        (d.elementType === T || (typeof T == 'object' && T !== null && T.$$typeof === It && yu(T) === d.type))
      ? ((S = i(d, v.props)), (S.ref = fr(h, d, v)), (S.return = h), S)
      : ((S = Bi(v.type, v.key, v.props, null, h.mode, S)), (S.ref = fr(h, d, v)), (S.return = h), S)
  }
  function u(h, d, v, S) {
    return d === null ||
      d.tag !== 4 ||
      d.stateNode.containerInfo !== v.containerInfo ||
      d.stateNode.implementation !== v.implementation
      ? ((d = yo(v, h.mode, S)), (d.return = h), d)
      : ((d = i(d, v.children || [])), (d.return = h), d)
  }
  function c(h, d, v, S, T) {
    return d === null || d.tag !== 7
      ? ((d = on(v, h.mode, S, T)), (d.return = h), d)
      : ((d = i(d, v)), (d.return = h), d)
  }
  function p(h, d, v) {
    if ((typeof d == 'string' && d !== '') || typeof d == 'number')
      return (d = vo('' + d, h.mode, v)), (d.return = h), d
    if (typeof d == 'object' && d !== null) {
      switch (d.$$typeof) {
        case di:
          return (v = Bi(d.type, d.key, d.props, null, h.mode, v)), (v.ref = fr(h, null, d)), (v.return = h), v
        case Tn:
          return (d = yo(d, h.mode, v)), (d.return = h), d
        case It:
          var S = d._init
          return p(h, S(d._payload), v)
      }
      if (Er(d) || sr(d)) return (d = on(d, h.mode, v, null)), (d.return = h), d
      xi(h, d)
    }
    return null
  }
  function f(h, d, v, S) {
    var T = d !== null ? d.key : null
    if ((typeof v == 'string' && v !== '') || typeof v == 'number') return T !== null ? null : l(h, d, '' + v, S)
    if (typeof v == 'object' && v !== null) {
      switch (v.$$typeof) {
        case di:
          return v.key === T ? a(h, d, v, S) : null
        case Tn:
          return v.key === T ? u(h, d, v, S) : null
        case It:
          return (T = v._init), f(h, d, T(v._payload), S)
      }
      if (Er(v) || sr(v)) return T !== null ? null : c(h, d, v, S, null)
      xi(h, v)
    }
    return null
  }
  function y(h, d, v, S, T) {
    if ((typeof S == 'string' && S !== '') || typeof S == 'number') return (h = h.get(v) || null), l(d, h, '' + S, T)
    if (typeof S == 'object' && S !== null) {
      switch (S.$$typeof) {
        case di:
          return (h = h.get(S.key === null ? v : S.key) || null), a(d, h, S, T)
        case Tn:
          return (h = h.get(S.key === null ? v : S.key) || null), u(d, h, S, T)
        case It:
          var C = S._init
          return y(h, d, v, C(S._payload), T)
      }
      if (Er(S) || sr(S)) return (h = h.get(v) || null), c(d, h, S, T, null)
      xi(d, S)
    }
    return null
  }
  function g(h, d, v, S) {
    for (var T = null, C = null, E = d, _ = (d = 0), N = null; E !== null && _ < v.length; _++) {
      E.index > _ ? ((N = E), (E = null)) : (N = E.sibling)
      var I = f(h, E, v[_], S)
      if (I === null) {
        E === null && (E = N)
        break
      }
      e && E && I.alternate === null && t(h, E),
        (d = s(I, d, _)),
        C === null ? (T = I) : (C.sibling = I),
        (C = I),
        (E = N)
    }
    if (_ === v.length) return n(h, E), W && Jt(h, _), T
    if (E === null) {
      for (; _ < v.length; _++)
        (E = p(h, v[_], S)), E !== null && ((d = s(E, d, _)), C === null ? (T = E) : (C.sibling = E), (C = E))
      return W && Jt(h, _), T
    }
    for (E = r(h, E); _ < v.length; _++)
      (N = y(E, h, _, v[_], S)),
        N !== null &&
          (e && N.alternate !== null && E.delete(N.key === null ? _ : N.key),
          (d = s(N, d, _)),
          C === null ? (T = N) : (C.sibling = N),
          (C = N))
    return (
      e &&
        E.forEach(function (O) {
          return t(h, O)
        }),
      W && Jt(h, _),
      T
    )
  }
  function w(h, d, v, S) {
    var T = sr(v)
    if (typeof T != 'function') throw Error(A(150))
    if (((v = T.call(v)), v == null)) throw Error(A(151))
    for (var C = (T = null), E = d, _ = (d = 0), N = null, I = v.next(); E !== null && !I.done; _++, I = v.next()) {
      E.index > _ ? ((N = E), (E = null)) : (N = E.sibling)
      var O = f(h, E, I.value, S)
      if (O === null) {
        E === null && (E = N)
        break
      }
      e && E && O.alternate === null && t(h, E),
        (d = s(O, d, _)),
        C === null ? (T = O) : (C.sibling = O),
        (C = O),
        (E = N)
    }
    if (I.done) return n(h, E), W && Jt(h, _), T
    if (E === null) {
      for (; !I.done; _++, I = v.next())
        (I = p(h, I.value, S)), I !== null && ((d = s(I, d, _)), C === null ? (T = I) : (C.sibling = I), (C = I))
      return W && Jt(h, _), T
    }
    for (E = r(h, E); !I.done; _++, I = v.next())
      (I = y(E, h, _, I.value, S)),
        I !== null &&
          (e && I.alternate !== null && E.delete(I.key === null ? _ : I.key),
          (d = s(I, d, _)),
          C === null ? (T = I) : (C.sibling = I),
          (C = I))
    return (
      e &&
        E.forEach(function (k) {
          return t(h, k)
        }),
      W && Jt(h, _),
      T
    )
  }
  function x(h, d, v, S) {
    if (
      (typeof v == 'object' && v !== null && v.type === Nn && v.key === null && (v = v.props.children),
      typeof v == 'object' && v !== null)
    ) {
      switch (v.$$typeof) {
        case di:
          e: {
            for (var T = v.key, C = d; C !== null; ) {
              if (C.key === T) {
                if (((T = v.type), T === Nn)) {
                  if (C.tag === 7) {
                    n(h, C.sibling), (d = i(C, v.props.children)), (d.return = h), (h = d)
                    break e
                  }
                } else if (
                  C.elementType === T ||
                  (typeof T == 'object' && T !== null && T.$$typeof === It && yu(T) === C.type)
                ) {
                  n(h, C.sibling), (d = i(C, v.props)), (d.ref = fr(h, C, v)), (d.return = h), (h = d)
                  break e
                }
                n(h, C)
                break
              } else t(h, C)
              C = C.sibling
            }
            v.type === Nn
              ? ((d = on(v.props.children, h.mode, S, v.key)), (d.return = h), (h = d))
              : ((S = Bi(v.type, v.key, v.props, null, h.mode, S)), (S.ref = fr(h, d, v)), (S.return = h), (h = S))
          }
          return o(h)
        case Tn:
          e: {
            for (C = v.key; d !== null; ) {
              if (d.key === C)
                if (
                  d.tag === 4 &&
                  d.stateNode.containerInfo === v.containerInfo &&
                  d.stateNode.implementation === v.implementation
                ) {
                  n(h, d.sibling), (d = i(d, v.children || [])), (d.return = h), (h = d)
                  break e
                } else {
                  n(h, d)
                  break
                }
              else t(h, d)
              d = d.sibling
            }
            ;(d = yo(v, h.mode, S)), (d.return = h), (h = d)
          }
          return o(h)
        case It:
          return (C = v._init), x(h, d, C(v._payload), S)
      }
      if (Er(v)) return g(h, d, v, S)
      if (sr(v)) return w(h, d, v, S)
      xi(h, v)
    }
    return (typeof v == 'string' && v !== '') || typeof v == 'number'
      ? ((v = '' + v),
        d !== null && d.tag === 6
          ? (n(h, d.sibling), (d = i(d, v)), (d.return = h), (h = d))
          : (n(h, d), (d = vo(v, h.mode, S)), (d.return = h), (h = d)),
        o(h))
      : n(h, d)
  }
  return x
}
var Qn = Of(!0),
  zf = Of(!1),
  oi = {},
  ht = Xt(oi),
  Qr = Xt(oi),
  Xr = Xt(oi)
function nn(e) {
  if (e === oi) throw Error(A(174))
  return e
}
function na(e, t) {
  switch ((j(Xr, t), j(Qr, e), j(ht, oi), (e = t.nodeType), e)) {
    case 9:
    case 11:
      t = (t = t.documentElement) ? t.namespaceURI : Ro(null, '')
      break
    default:
      ;(e = e === 8 ? t.parentNode : t), (t = e.namespaceURI || null), (e = e.tagName), (t = Ro(t, e))
  }
  B(ht), j(ht, t)
}
function Xn() {
  B(ht), B(Qr), B(Xr)
}
function Df(e) {
  nn(Xr.current)
  var t = nn(ht.current),
    n = Ro(t, e.type)
  t !== n && (j(Qr, e), j(ht, n))
}
function ra(e) {
  Qr.current === e && (B(ht), B(Qr))
}
var X = Xt(0)
function hs(e) {
  for (var t = e; t !== null; ) {
    if (t.tag === 13) {
      var n = t.memoizedState
      if (n !== null && ((n = n.dehydrated), n === null || n.data === '$?' || n.data === '$!')) return t
    } else if (t.tag === 19 && t.memoizedProps.revealOrder !== void 0) {
      if (t.flags & 128) return t
    } else if (t.child !== null) {
      ;(t.child.return = t), (t = t.child)
      continue
    }
    if (t === e) break
    for (; t.sibling === null; ) {
      if (t.return === null || t.return === e) return null
      t = t.return
    }
    ;(t.sibling.return = t.return), (t = t.sibling)
  }
  return null
}
var fo = []
function ia() {
  for (var e = 0; e < fo.length; e++) fo[e]._workInProgressVersionPrimary = null
  fo.length = 0
}
var Fi = At.ReactCurrentDispatcher,
  ho = At.ReactCurrentBatchConfig,
  hn = 0,
  G = null,
  ie = null,
  ae = null,
  ps = !1,
  Ir = !1,
  Gr = 0,
  ug = 0
function he() {
  throw Error(A(321))
}
function sa(e, t) {
  if (t === null) return !1
  for (var n = 0; n < t.length && n < e.length; n++) if (!ot(e[n], t[n])) return !1
  return !0
}
function oa(e, t, n, r, i, s) {
  if (
    ((hn = s),
    (G = t),
    (t.memoizedState = null),
    (t.updateQueue = null),
    (t.lanes = 0),
    (Fi.current = e === null || e.memoizedState === null ? hg : pg),
    (e = n(r, i)),
    Ir)
  ) {
    s = 0
    do {
      if (((Ir = !1), (Gr = 0), 25 <= s)) throw Error(A(301))
      ;(s += 1), (ae = ie = null), (t.updateQueue = null), (Fi.current = mg), (e = n(r, i))
    } while (Ir)
  }
  if (((Fi.current = ms), (t = ie !== null && ie.next !== null), (hn = 0), (ae = ie = G = null), (ps = !1), t))
    throw Error(A(300))
  return e
}
function la() {
  var e = Gr !== 0
  return (Gr = 0), e
}
function ct() {
  var e = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null }
  return ae === null ? (G.memoizedState = ae = e) : (ae = ae.next = e), ae
}
function Ke() {
  if (ie === null) {
    var e = G.alternate
    e = e !== null ? e.memoizedState : null
  } else e = ie.next
  var t = ae === null ? G.memoizedState : ae.next
  if (t !== null) (ae = t), (ie = e)
  else {
    if (e === null) throw Error(A(310))
    ;(ie = e),
      (e = {
        memoizedState: ie.memoizedState,
        baseState: ie.baseState,
        baseQueue: ie.baseQueue,
        queue: ie.queue,
        next: null,
      }),
      ae === null ? (G.memoizedState = ae = e) : (ae = ae.next = e)
  }
  return ae
}
function Kr(e, t) {
  return typeof t == 'function' ? t(e) : t
}
function po(e) {
  var t = Ke(),
    n = t.queue
  if (n === null) throw Error(A(311))
  n.lastRenderedReducer = e
  var r = ie,
    i = r.baseQueue,
    s = n.pending
  if (s !== null) {
    if (i !== null) {
      var o = i.next
      ;(i.next = s.next), (s.next = o)
    }
    ;(r.baseQueue = i = s), (n.pending = null)
  }
  if (i !== null) {
    ;(s = i.next), (r = r.baseState)
    var l = (o = null),
      a = null,
      u = s
    do {
      var c = u.lane
      if ((hn & c) === c)
        a !== null &&
          (a = a.next =
            { lane: 0, action: u.action, hasEagerState: u.hasEagerState, eagerState: u.eagerState, next: null }),
          (r = u.hasEagerState ? u.eagerState : e(r, u.action))
      else {
        var p = { lane: c, action: u.action, hasEagerState: u.hasEagerState, eagerState: u.eagerState, next: null }
        a === null ? ((l = a = p), (o = r)) : (a = a.next = p), (G.lanes |= c), (pn |= c)
      }
      u = u.next
    } while (u !== null && u !== s)
    a === null ? (o = r) : (a.next = l),
      ot(r, t.memoizedState) || (Le = !0),
      (t.memoizedState = r),
      (t.baseState = o),
      (t.baseQueue = a),
      (n.lastRenderedState = r)
  }
  if (((e = n.interleaved), e !== null)) {
    i = e
    do (s = i.lane), (G.lanes |= s), (pn |= s), (i = i.next)
    while (i !== e)
  } else i === null && (n.lanes = 0)
  return [t.memoizedState, n.dispatch]
}
function mo(e) {
  var t = Ke(),
    n = t.queue
  if (n === null) throw Error(A(311))
  n.lastRenderedReducer = e
  var r = n.dispatch,
    i = n.pending,
    s = t.memoizedState
  if (i !== null) {
    n.pending = null
    var o = (i = i.next)
    do (s = e(s, o.action)), (o = o.next)
    while (o !== i)
    ot(s, t.memoizedState) || (Le = !0),
      (t.memoizedState = s),
      t.baseQueue === null && (t.baseState = s),
      (n.lastRenderedState = s)
  }
  return [s, r]
}
function Ff() {}
function Uf(e, t) {
  var n = G,
    r = Ke(),
    i = t(),
    s = !ot(r.memoizedState, i)
  if (
    (s && ((r.memoizedState = i), (Le = !0)),
    (r = r.queue),
    aa(Bf.bind(null, n, r, e), [e]),
    r.getSnapshot !== t || s || (ae !== null && ae.memoizedState.tag & 1))
  ) {
    if (((n.flags |= 2048), Jr(9, Hf.bind(null, n, r, i, t), void 0, null), oe === null)) throw Error(A(349))
    hn & 30 || jf(n, t, i)
  }
  return i
}
function jf(e, t, n) {
  ;(e.flags |= 16384),
    (e = { getSnapshot: t, value: n }),
    (t = G.updateQueue),
    t === null
      ? ((t = { lastEffect: null, stores: null }), (G.updateQueue = t), (t.stores = [e]))
      : ((n = t.stores), n === null ? (t.stores = [e]) : n.push(e))
}
function Hf(e, t, n, r) {
  ;(t.value = n), (t.getSnapshot = r), qf(t) && Xe(e, 1, -1)
}
function Bf(e, t, n) {
  return n(function () {
    qf(t) && Xe(e, 1, -1)
  })
}
function qf(e) {
  var t = e.getSnapshot
  e = e.value
  try {
    var n = t()
    return !ot(e, n)
  } catch {
    return !0
  }
}
function wu(e) {
  var t = ct()
  return (
    typeof e == 'function' && (e = e()),
    (t.memoizedState = t.baseState = e),
    (e = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: Kr, lastRenderedState: e }),
    (t.queue = e),
    (e = e.dispatch = dg.bind(null, G, e)),
    [t.memoizedState, e]
  )
}
function Jr(e, t, n, r) {
  return (
    (e = { tag: e, create: t, destroy: n, deps: r, next: null }),
    (t = G.updateQueue),
    t === null
      ? ((t = { lastEffect: null, stores: null }), (G.updateQueue = t), (t.lastEffect = e.next = e))
      : ((n = t.lastEffect),
        n === null ? (t.lastEffect = e.next = e) : ((r = n.next), (n.next = e), (e.next = r), (t.lastEffect = e))),
    e
  )
}
function Wf() {
  return Ke().memoizedState
}
function Ui(e, t, n, r) {
  var i = ct()
  ;(G.flags |= e), (i.memoizedState = Jr(1 | t, n, void 0, r === void 0 ? null : r))
}
function Ps(e, t, n, r) {
  var i = Ke()
  r = r === void 0 ? null : r
  var s = void 0
  if (ie !== null) {
    var o = ie.memoizedState
    if (((s = o.destroy), r !== null && sa(r, o.deps))) {
      i.memoizedState = Jr(t, n, s, r)
      return
    }
  }
  ;(G.flags |= e), (i.memoizedState = Jr(1 | t, n, s, r))
}
function Su(e, t) {
  return Ui(8390656, 8, e, t)
}
function aa(e, t) {
  return Ps(2048, 8, e, t)
}
function Vf(e, t) {
  return Ps(4, 2, e, t)
}
function Qf(e, t) {
  return Ps(4, 4, e, t)
}
function Xf(e, t) {
  if (typeof t == 'function')
    return (
      (e = e()),
      t(e),
      function () {
        t(null)
      }
    )
  if (t != null)
    return (
      (e = e()),
      (t.current = e),
      function () {
        t.current = null
      }
    )
}
function Gf(e, t, n) {
  return (n = n != null ? n.concat([e]) : null), Ps(4, 4, Xf.bind(null, t, e), n)
}
function ua() {}
function Kf(e, t) {
  var n = Ke()
  t = t === void 0 ? null : t
  var r = n.memoizedState
  return r !== null && t !== null && sa(t, r[1]) ? r[0] : ((n.memoizedState = [e, t]), e)
}
function Jf(e, t) {
  var n = Ke()
  t = t === void 0 ? null : t
  var r = n.memoizedState
  return r !== null && t !== null && sa(t, r[1]) ? r[0] : ((e = e()), (n.memoizedState = [e, t]), e)
}
function Yf(e, t, n) {
  return hn & 21
    ? (ot(n, t) || ((n = rf()), (G.lanes |= n), (pn |= n), (e.baseState = !0)), t)
    : (e.baseState && ((e.baseState = !1), (Le = !0)), (e.memoizedState = n))
}
function cg(e, t) {
  var n = U
  ;(U = n !== 0 && 4 > n ? n : 4), e(!0)
  var r = ho.transition
  ho.transition = {}
  try {
    e(!1), t()
  } finally {
    ;(U = n), (ho.transition = r)
  }
}
function Zf() {
  return Ke().memoizedState
}
function fg(e, t, n) {
  var r = Bt(e)
  ;(n = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null }),
    ed(e) ? td(t, n) : (nd(e, t, n), (n = Ee()), (e = Xe(e, r, n)), e !== null && rd(e, t, r))
}
function dg(e, t, n) {
  var r = Bt(e),
    i = { lane: r, action: n, hasEagerState: !1, eagerState: null, next: null }
  if (ed(e)) td(t, i)
  else {
    nd(e, t, i)
    var s = e.alternate
    if (e.lanes === 0 && (s === null || s.lanes === 0) && ((s = t.lastRenderedReducer), s !== null))
      try {
        var o = t.lastRenderedState,
          l = s(o, n)
        if (((i.hasEagerState = !0), (i.eagerState = l), ot(l, o))) return
      } catch {
      } finally {
      }
    ;(n = Ee()), (e = Xe(e, r, n)), e !== null && rd(e, t, r)
  }
}
function ed(e) {
  var t = e.alternate
  return e === G || (t !== null && t === G)
}
function td(e, t) {
  Ir = ps = !0
  var n = e.pending
  n === null ? (t.next = t) : ((t.next = n.next), (n.next = t)), (e.pending = t)
}
function nd(e, t, n) {
  Sd(e)
    ? ((e = t.interleaved),
      e === null ? ((n.next = n), it === null ? (it = [t]) : it.push(t)) : ((n.next = e.next), (e.next = n)),
      (t.interleaved = n))
    : ((e = t.pending), e === null ? (n.next = n) : ((n.next = e.next), (e.next = n)), (t.pending = n))
}
function rd(e, t, n) {
  if (n & 4194240) {
    var r = t.lanes
    ;(r &= e.pendingLanes), (n |= r), (t.lanes = n), jl(e, n)
  }
}
var ms = {
    readContext: Ge,
    useCallback: he,
    useContext: he,
    useEffect: he,
    useImperativeHandle: he,
    useInsertionEffect: he,
    useLayoutEffect: he,
    useMemo: he,
    useReducer: he,
    useRef: he,
    useState: he,
    useDebugValue: he,
    useDeferredValue: he,
    useTransition: he,
    useMutableSource: he,
    useSyncExternalStore: he,
    useId: he,
    unstable_isNewReconciler: !1,
  },
  hg = {
    readContext: Ge,
    useCallback: function (e, t) {
      return (ct().memoizedState = [e, t === void 0 ? null : t]), e
    },
    useContext: Ge,
    useEffect: Su,
    useImperativeHandle: function (e, t, n) {
      return (n = n != null ? n.concat([e]) : null), Ui(4194308, 4, Xf.bind(null, t, e), n)
    },
    useLayoutEffect: function (e, t) {
      return Ui(4194308, 4, e, t)
    },
    useInsertionEffect: function (e, t) {
      return Ui(4, 2, e, t)
    },
    useMemo: function (e, t) {
      var n = ct()
      return (t = t === void 0 ? null : t), (e = e()), (n.memoizedState = [e, t]), e
    },
    useReducer: function (e, t, n) {
      var r = ct()
      return (
        (t = n !== void 0 ? n(t) : t),
        (r.memoizedState = r.baseState = t),
        (e = {
          pending: null,
          interleaved: null,
          lanes: 0,
          dispatch: null,
          lastRenderedReducer: e,
          lastRenderedState: t,
        }),
        (r.queue = e),
        (e = e.dispatch = fg.bind(null, G, e)),
        [r.memoizedState, e]
      )
    },
    useRef: function (e) {
      var t = ct()
      return (e = { current: e }), (t.memoizedState = e)
    },
    useState: wu,
    useDebugValue: ua,
    useDeferredValue: function (e) {
      return (ct().memoizedState = e)
    },
    useTransition: function () {
      var e = wu(!1),
        t = e[0]
      return (e = cg.bind(null, e[1])), (ct().memoizedState = e), [t, e]
    },
    useMutableSource: function () {},
    useSyncExternalStore: function (e, t, n) {
      var r = G,
        i = ct()
      if (W) {
        if (n === void 0) throw Error(A(407))
        n = n()
      } else {
        if (((n = t()), oe === null)) throw Error(A(349))
        hn & 30 || jf(r, t, n)
      }
      i.memoizedState = n
      var s = { value: n, getSnapshot: t }
      return (
        (i.queue = s),
        Su(Bf.bind(null, r, s, e), [e]),
        (r.flags |= 2048),
        Jr(9, Hf.bind(null, r, s, n, t), void 0, null),
        n
      )
    },
    useId: function () {
      var e = ct(),
        t = oe.identifierPrefix
      if (W) {
        var n = xt,
          r = Et
        ;(n = (r & ~(1 << (32 - st(r) - 1))).toString(32) + n),
          (t = ':' + t + 'R' + n),
          (n = Gr++),
          0 < n && (t += 'H' + n.toString(32)),
          (t += ':')
      } else (n = ug++), (t = ':' + t + 'r' + n.toString(32) + ':')
      return (e.memoizedState = t)
    },
    unstable_isNewReconciler: !1,
  },
  pg = {
    readContext: Ge,
    useCallback: Kf,
    useContext: Ge,
    useEffect: aa,
    useImperativeHandle: Gf,
    useInsertionEffect: Vf,
    useLayoutEffect: Qf,
    useMemo: Jf,
    useReducer: po,
    useRef: Wf,
    useState: function () {
      return po(Kr)
    },
    useDebugValue: ua,
    useDeferredValue: function (e) {
      var t = Ke()
      return Yf(t, ie.memoizedState, e)
    },
    useTransition: function () {
      var e = po(Kr)[0],
        t = Ke().memoizedState
      return [e, t]
    },
    useMutableSource: Ff,
    useSyncExternalStore: Uf,
    useId: Zf,
    unstable_isNewReconciler: !1,
  },
  mg = {
    readContext: Ge,
    useCallback: Kf,
    useContext: Ge,
    useEffect: aa,
    useImperativeHandle: Gf,
    useInsertionEffect: Vf,
    useLayoutEffect: Qf,
    useMemo: Jf,
    useReducer: mo,
    useRef: Wf,
    useState: function () {
      return mo(Kr)
    },
    useDebugValue: ua,
    useDeferredValue: function (e) {
      var t = Ke()
      return ie === null ? (t.memoizedState = e) : Yf(t, ie.memoizedState, e)
    },
    useTransition: function () {
      var e = mo(Kr)[0],
        t = Ke().memoizedState
      return [e, t]
    },
    useMutableSource: Ff,
    useSyncExternalStore: Uf,
    useId: Zf,
    unstable_isNewReconciler: !1,
  }
function ca(e, t) {
  try {
    var n = '',
      r = t
    do (n += Bp(r)), (r = r.return)
    while (r)
    var i = n
  } catch (s) {
    i =
      `
Error generating stack: ` +
      s.message +
      `
` +
      s.stack
  }
  return { value: e, source: t, stack: i }
}
function nl(e, t) {
  try {
    console.error(t.value)
  } catch (n) {
    setTimeout(function () {
      throw n
    })
  }
}
var gg = typeof WeakMap == 'function' ? WeakMap : Map
function id(e, t, n) {
  ;(n = _t(-1, n)), (n.tag = 3), (n.payload = { element: null })
  var r = t.value
  return (
    (n.callback = function () {
      vs || ((vs = !0), (fl = r)), nl(e, t)
    }),
    n
  )
}
function sd(e, t, n) {
  ;(n = _t(-1, n)), (n.tag = 3)
  var r = e.type.getDerivedStateFromError
  if (typeof r == 'function') {
    var i = t.value
    ;(n.payload = function () {
      return r(i)
    }),
      (n.callback = function () {
        nl(e, t)
      })
  }
  var s = e.stateNode
  return (
    s !== null &&
      typeof s.componentDidCatch == 'function' &&
      (n.callback = function () {
        nl(e, t), typeof r != 'function' && (Ht === null ? (Ht = new Set([this])) : Ht.add(this))
        var o = t.stack
        this.componentDidCatch(t.value, { componentStack: o !== null ? o : '' })
      }),
    n
  )
}
function Eu(e, t, n) {
  var r = e.pingCache
  if (r === null) {
    r = e.pingCache = new gg()
    var i = new Set()
    r.set(t, i)
  } else (i = r.get(t)), i === void 0 && ((i = new Set()), r.set(t, i))
  i.has(n) || (i.add(n), (e = Lg.bind(null, e, t, n)), t.then(e, e))
}
function xu(e) {
  do {
    var t
    if (((t = e.tag === 13) && ((t = e.memoizedState), (t = t !== null ? t.dehydrated !== null : !0)), t)) return e
    e = e.return
  } while (e !== null)
  return null
}
function _u(e, t, n, r, i) {
  return e.mode & 1
    ? ((e.flags |= 65536), (e.lanes = i), e)
    : (e === t
        ? (e.flags |= 65536)
        : ((e.flags |= 128),
          (n.flags |= 131072),
          (n.flags &= -52805),
          n.tag === 1 && (n.alternate === null ? (n.tag = 17) : ((t = _t(-1, 1)), (t.tag = 2), jt(n, t))),
          (n.lanes |= 1)),
      e)
}
var od, rl, ld, ad
od = function (e, t) {
  for (var n = t.child; n !== null; ) {
    if (n.tag === 5 || n.tag === 6) e.appendChild(n.stateNode)
    else if (n.tag !== 4 && n.child !== null) {
      ;(n.child.return = n), (n = n.child)
      continue
    }
    if (n === t) break
    for (; n.sibling === null; ) {
      if (n.return === null || n.return === t) return
      n = n.return
    }
    ;(n.sibling.return = n.return), (n = n.sibling)
  }
}
rl = function () {}
ld = function (e, t, n, r) {
  var i = e.memoizedProps
  if (i !== r) {
    ;(e = t.stateNode), nn(ht.current)
    var s = null
    switch (n) {
      case 'input':
        ;(i = Lo(e, i)), (r = Lo(e, r)), (s = [])
        break
      case 'select':
        ;(i = K({}, i, { value: void 0 })), (r = K({}, r, { value: void 0 })), (s = [])
        break
      case 'textarea':
        ;(i = Mo(e, i)), (r = Mo(e, r)), (s = [])
        break
      default:
        typeof i.onClick != 'function' && typeof r.onClick == 'function' && (e.onclick = ss)
    }
    Po(n, r)
    var o
    n = null
    for (u in i)
      if (!r.hasOwnProperty(u) && i.hasOwnProperty(u) && i[u] != null)
        if (u === 'style') {
          var l = i[u]
          for (o in l) l.hasOwnProperty(o) && (n || (n = {}), (n[o] = ''))
        } else
          u !== 'dangerouslySetInnerHTML' &&
            u !== 'children' &&
            u !== 'suppressContentEditableWarning' &&
            u !== 'suppressHydrationWarning' &&
            u !== 'autoFocus' &&
            (Or.hasOwnProperty(u) ? s || (s = []) : (s = s || []).push(u, null))
    for (u in r) {
      var a = r[u]
      if (((l = i != null ? i[u] : void 0), r.hasOwnProperty(u) && a !== l && (a != null || l != null)))
        if (u === 'style')
          if (l) {
            for (o in l) !l.hasOwnProperty(o) || (a && a.hasOwnProperty(o)) || (n || (n = {}), (n[o] = ''))
            for (o in a) a.hasOwnProperty(o) && l[o] !== a[o] && (n || (n = {}), (n[o] = a[o]))
          } else n || (s || (s = []), s.push(u, n)), (n = a)
        else
          u === 'dangerouslySetInnerHTML'
            ? ((a = a ? a.__html : void 0),
              (l = l ? l.__html : void 0),
              a != null && l !== a && (s = s || []).push(u, a))
            : u === 'children'
            ? (typeof a != 'string' && typeof a != 'number') || (s = s || []).push(u, '' + a)
            : u !== 'suppressContentEditableWarning' &&
              u !== 'suppressHydrationWarning' &&
              (Or.hasOwnProperty(u)
                ? (a != null && u === 'onScroll' && H('scroll', e), s || l === a || (s = []))
                : (s = s || []).push(u, a))
    }
    n && (s = s || []).push('style', n)
    var u = s
    ;(t.updateQueue = u) && (t.flags |= 4)
  }
}
ad = function (e, t, n, r) {
  n !== r && (t.flags |= 4)
}
function dr(e, t) {
  if (!W)
    switch (e.tailMode) {
      case 'hidden':
        t = e.tail
        for (var n = null; t !== null; ) t.alternate !== null && (n = t), (t = t.sibling)
        n === null ? (e.tail = null) : (n.sibling = null)
        break
      case 'collapsed':
        n = e.tail
        for (var r = null; n !== null; ) n.alternate !== null && (r = n), (n = n.sibling)
        r === null ? (t || e.tail === null ? (e.tail = null) : (e.tail.sibling = null)) : (r.sibling = null)
    }
}
function pe(e) {
  var t = e.alternate !== null && e.alternate.child === e.child,
    n = 0,
    r = 0
  if (t)
    for (var i = e.child; i !== null; )
      (n |= i.lanes | i.childLanes),
        (r |= i.subtreeFlags & 14680064),
        (r |= i.flags & 14680064),
        (i.return = e),
        (i = i.sibling)
  else
    for (i = e.child; i !== null; )
      (n |= i.lanes | i.childLanes), (r |= i.subtreeFlags), (r |= i.flags), (i.return = e), (i = i.sibling)
  return (e.subtreeFlags |= r), (e.childLanes = n), t
}
function vg(e, t, n) {
  var r = t.pendingProps
  switch ((ea(t), t.tag)) {
    case 2:
    case 16:
    case 15:
    case 0:
    case 11:
    case 7:
    case 8:
    case 12:
    case 9:
    case 14:
      return pe(t), null
    case 1:
      return Re(t.type) && os(), pe(t), null
    case 3:
      return (
        (r = t.stateNode),
        Xn(),
        B(Me),
        B(ve),
        ia(),
        r.pendingContext && ((r.context = r.pendingContext), (r.pendingContext = null)),
        (e === null || e.child === null) &&
          (cr(t)
            ? (t.flags |= 4)
            : e === null ||
              (e.memoizedState.isDehydrated && !(t.flags & 256)) ||
              ((t.flags |= 1024), rt !== null && (pl(rt), (rt = null)))),
        rl(e, t),
        pe(t),
        null
      )
    case 5:
      ra(t)
      var i = nn(Xr.current)
      if (((n = t.type), e !== null && t.stateNode != null))
        ld(e, t, n, r, i), e.ref !== t.ref && ((t.flags |= 512), (t.flags |= 2097152))
      else {
        if (!r) {
          if (t.stateNode === null) throw Error(A(166))
          return pe(t), null
        }
        if (((e = nn(ht.current)), cr(t))) {
          ;(r = t.stateNode), (n = t.type)
          var s = t.memoizedProps
          switch (((r[ft] = t), (r[Vr] = s), (e = (t.mode & 1) !== 0), n)) {
            case 'dialog':
              H('cancel', r), H('close', r)
              break
            case 'iframe':
            case 'object':
            case 'embed':
              H('load', r)
              break
            case 'video':
            case 'audio':
              for (i = 0; i < _r.length; i++) H(_r[i], r)
              break
            case 'source':
              H('error', r)
              break
            case 'img':
            case 'image':
            case 'link':
              H('error', r), H('load', r)
              break
            case 'details':
              H('toggle', r)
              break
            case 'input':
              za(r, s), H('invalid', r)
              break
            case 'select':
              ;(r._wrapperState = { wasMultiple: !!s.multiple }), H('invalid', r)
              break
            case 'textarea':
              Fa(r, s), H('invalid', r)
          }
          Po(n, s), (i = null)
          for (var o in s)
            if (s.hasOwnProperty(o)) {
              var l = s[o]
              o === 'children'
                ? typeof l == 'string'
                  ? r.textContent !== l &&
                    (s.suppressHydrationWarning !== !0 && Ei(r.textContent, l, e), (i = ['children', l]))
                  : typeof l == 'number' &&
                    r.textContent !== '' + l &&
                    (s.suppressHydrationWarning !== !0 && Ei(r.textContent, l, e), (i = ['children', '' + l]))
                : Or.hasOwnProperty(o) && l != null && o === 'onScroll' && H('scroll', r)
            }
          switch (n) {
            case 'input':
              hi(r), Da(r, s, !0)
              break
            case 'textarea':
              hi(r), Ua(r)
              break
            case 'select':
            case 'option':
              break
            default:
              typeof s.onClick == 'function' && (r.onclick = ss)
          }
          ;(r = i), (t.updateQueue = r), r !== null && (t.flags |= 4)
        } else {
          ;(o = i.nodeType === 9 ? i : i.ownerDocument),
            e === 'http://www.w3.org/1999/xhtml' && (e = Hc(n)),
            e === 'http://www.w3.org/1999/xhtml'
              ? n === 'script'
                ? ((e = o.createElement('div')), (e.innerHTML = '<script></script>'), (e = e.removeChild(e.firstChild)))
                : typeof r.is == 'string'
                ? (e = o.createElement(n, { is: r.is }))
                : ((e = o.createElement(n)),
                  n === 'select' && ((o = e), r.multiple ? (o.multiple = !0) : r.size && (o.size = r.size)))
              : (e = o.createElementNS(e, n)),
            (e[ft] = t),
            (e[Vr] = r),
            od(e, t, !1, !1),
            (t.stateNode = e)
          e: {
            switch (((o = $o(n, r)), n)) {
              case 'dialog':
                H('cancel', e), H('close', e), (i = r)
                break
              case 'iframe':
              case 'object':
              case 'embed':
                H('load', e), (i = r)
                break
              case 'video':
              case 'audio':
                for (i = 0; i < _r.length; i++) H(_r[i], e)
                i = r
                break
              case 'source':
                H('error', e), (i = r)
                break
              case 'img':
              case 'image':
              case 'link':
                H('error', e), H('load', e), (i = r)
                break
              case 'details':
                H('toggle', e), (i = r)
                break
              case 'input':
                za(e, r), (i = Lo(e, r)), H('invalid', e)
                break
              case 'option':
                i = r
                break
              case 'select':
                ;(e._wrapperState = { wasMultiple: !!r.multiple }), (i = K({}, r, { value: void 0 })), H('invalid', e)
                break
              case 'textarea':
                Fa(e, r), (i = Mo(e, r)), H('invalid', e)
                break
              default:
                i = r
            }
            Po(n, i), (l = i)
            for (s in l)
              if (l.hasOwnProperty(s)) {
                var a = l[s]
                s === 'style'
                  ? Wc(e, a)
                  : s === 'dangerouslySetInnerHTML'
                  ? ((a = a ? a.__html : void 0), a != null && Bc(e, a))
                  : s === 'children'
                  ? typeof a == 'string'
                    ? (n !== 'textarea' || a !== '') && zr(e, a)
                    : typeof a == 'number' && zr(e, '' + a)
                  : s !== 'suppressContentEditableWarning' &&
                    s !== 'suppressHydrationWarning' &&
                    s !== 'autoFocus' &&
                    (Or.hasOwnProperty(s)
                      ? a != null && s === 'onScroll' && H('scroll', e)
                      : a != null && $l(e, s, a, o))
              }
            switch (n) {
              case 'input':
                hi(e), Da(e, r, !1)
                break
              case 'textarea':
                hi(e), Ua(e)
                break
              case 'option':
                r.value != null && e.setAttribute('value', '' + qt(r.value))
                break
              case 'select':
                ;(e.multiple = !!r.multiple),
                  (s = r.value),
                  s != null
                    ? Dn(e, !!r.multiple, s, !1)
                    : r.defaultValue != null && Dn(e, !!r.multiple, r.defaultValue, !0)
                break
              default:
                typeof i.onClick == 'function' && (e.onclick = ss)
            }
            switch (n) {
              case 'button':
              case 'input':
              case 'select':
              case 'textarea':
                r = !!r.autoFocus
                break e
              case 'img':
                r = !0
                break e
              default:
                r = !1
            }
          }
          r && (t.flags |= 4)
        }
        t.ref !== null && ((t.flags |= 512), (t.flags |= 2097152))
      }
      return pe(t), null
    case 6:
      if (e && t.stateNode != null) ad(e, t, e.memoizedProps, r)
      else {
        if (typeof r != 'string' && t.stateNode === null) throw Error(A(166))
        if (((n = nn(Xr.current)), nn(ht.current), cr(t))) {
          if (
            ((r = t.stateNode), (n = t.memoizedProps), (r[ft] = t), (s = r.nodeValue !== n) && ((e = Fe), e !== null))
          )
            switch (e.tag) {
              case 3:
                Ei(r.nodeValue, n, (e.mode & 1) !== 0)
                break
              case 5:
                e.memoizedProps.suppressHydrationWarning !== !0 && Ei(r.nodeValue, n, (e.mode & 1) !== 0)
            }
          s && (t.flags |= 4)
        } else (r = (n.nodeType === 9 ? n : n.ownerDocument).createTextNode(r)), (r[ft] = t), (t.stateNode = r)
      }
      return pe(t), null
    case 13:
      if ((B(X), (r = t.memoizedState), W && Ae !== null && t.mode & 1 && !(t.flags & 128))) {
        for (r = Ae; r; ) r = St(r.nextSibling)
        return Vn(), (t.flags |= 98560), t
      }
      if (r !== null && r.dehydrated !== null) {
        if (((r = cr(t)), e === null)) {
          if (!r) throw Error(A(318))
          if (((r = t.memoizedState), (r = r !== null ? r.dehydrated : null), !r)) throw Error(A(317))
          r[ft] = t
        } else Vn(), !(t.flags & 128) && (t.memoizedState = null), (t.flags |= 4)
        return pe(t), null
      }
      return (
        rt !== null && (pl(rt), (rt = null)),
        t.flags & 128
          ? ((t.lanes = n), t)
          : ((r = r !== null),
            (n = !1),
            e === null ? cr(t) : (n = e.memoizedState !== null),
            r !== n &&
              r &&
              ((t.child.flags |= 8192), t.mode & 1 && (e === null || X.current & 1 ? se === 0 && (se = 3) : ga())),
            t.updateQueue !== null && (t.flags |= 4),
            pe(t),
            null)
      )
    case 4:
      return Xn(), rl(e, t), e === null && qr(t.stateNode.containerInfo), pe(t), null
    case 10:
      return Jl(t.type._context), pe(t), null
    case 17:
      return Re(t.type) && os(), pe(t), null
    case 19:
      if ((B(X), (s = t.memoizedState), s === null)) return pe(t), null
      if (((r = (t.flags & 128) !== 0), (o = s.rendering), o === null))
        if (r) dr(s, !1)
        else {
          if (se !== 0 || (e !== null && e.flags & 128))
            for (e = t.child; e !== null; ) {
              if (((o = hs(e)), o !== null)) {
                for (
                  t.flags |= 128,
                    dr(s, !1),
                    r = o.updateQueue,
                    r !== null && ((t.updateQueue = r), (t.flags |= 4)),
                    t.subtreeFlags = 0,
                    r = n,
                    n = t.child;
                  n !== null;

                )
                  (s = n),
                    (e = r),
                    (s.flags &= 14680066),
                    (o = s.alternate),
                    o === null
                      ? ((s.childLanes = 0),
                        (s.lanes = e),
                        (s.child = null),
                        (s.subtreeFlags = 0),
                        (s.memoizedProps = null),
                        (s.memoizedState = null),
                        (s.updateQueue = null),
                        (s.dependencies = null),
                        (s.stateNode = null))
                      : ((s.childLanes = o.childLanes),
                        (s.lanes = o.lanes),
                        (s.child = o.child),
                        (s.subtreeFlags = 0),
                        (s.deletions = null),
                        (s.memoizedProps = o.memoizedProps),
                        (s.memoizedState = o.memoizedState),
                        (s.updateQueue = o.updateQueue),
                        (s.type = o.type),
                        (e = o.dependencies),
                        (s.dependencies = e === null ? null : { lanes: e.lanes, firstContext: e.firstContext })),
                    (n = n.sibling)
                return j(X, (X.current & 1) | 2), t.child
              }
              e = e.sibling
            }
          s.tail !== null && Y() > Gn && ((t.flags |= 128), (r = !0), dr(s, !1), (t.lanes = 4194304))
        }
      else {
        if (!r)
          if (((e = hs(o)), e !== null)) {
            if (
              ((t.flags |= 128),
              (r = !0),
              (n = e.updateQueue),
              n !== null && ((t.updateQueue = n), (t.flags |= 4)),
              dr(s, !0),
              s.tail === null && s.tailMode === 'hidden' && !o.alternate && !W)
            )
              return pe(t), null
          } else
            2 * Y() - s.renderingStartTime > Gn &&
              n !== 1073741824 &&
              ((t.flags |= 128), (r = !0), dr(s, !1), (t.lanes = 4194304))
        s.isBackwards
          ? ((o.sibling = t.child), (t.child = o))
          : ((n = s.last), n !== null ? (n.sibling = o) : (t.child = o), (s.last = o))
      }
      return s.tail !== null
        ? ((t = s.tail),
          (s.rendering = t),
          (s.tail = t.sibling),
          (s.renderingStartTime = Y()),
          (t.sibling = null),
          (n = X.current),
          j(X, r ? (n & 1) | 2 : n & 1),
          t)
        : (pe(t), null)
    case 22:
    case 23:
      return (
        ma(),
        (r = t.memoizedState !== null),
        e !== null && (e.memoizedState !== null) !== r && (t.flags |= 8192),
        r && t.mode & 1 ? ze & 1073741824 && (pe(t), t.subtreeFlags & 6 && (t.flags |= 8192)) : pe(t),
        null
      )
    case 24:
      return null
    case 25:
      return null
  }
  throw Error(A(156, t.tag))
}
var yg = At.ReactCurrentOwner,
  Le = !1
function ye(e, t, n, r) {
  t.child = e === null ? zf(t, null, n, r) : Qn(t, e.child, n, r)
}
function ku(e, t, n, r, i) {
  n = n.render
  var s = t.ref
  return (
    Hn(t, i),
    (r = oa(e, t, n, r, s, i)),
    (n = la()),
    e !== null && !Le
      ? ((t.updateQueue = e.updateQueue), (t.flags &= -2053), (e.lanes &= ~i), Ct(e, t, i))
      : (W && n && Zl(t), (t.flags |= 1), ye(e, t, r, i), t.child)
  )
}
function Tu(e, t, n, r, i) {
  if (e === null) {
    var s = n.type
    return typeof s == 'function' &&
      !va(s) &&
      s.defaultProps === void 0 &&
      n.compare === null &&
      n.defaultProps === void 0
      ? ((t.tag = 15), (t.type = s), ud(e, t, s, r, i))
      : ((e = Bi(n.type, null, r, t, t.mode, i)), (e.ref = t.ref), (e.return = t), (t.child = e))
  }
  if (((s = e.child), !(e.lanes & i))) {
    var o = s.memoizedProps
    if (((n = n.compare), (n = n !== null ? n : Br), n(o, r) && e.ref === t.ref)) return Ct(e, t, i)
  }
  return (t.flags |= 1), (e = Vt(s, r)), (e.ref = t.ref), (e.return = t), (t.child = e)
}
function ud(e, t, n, r, i) {
  if (e !== null) {
    var s = e.memoizedProps
    if (Br(s, r) && e.ref === t.ref)
      if (((Le = !1), (t.pendingProps = r = s), (e.lanes & i) !== 0)) e.flags & 131072 && (Le = !0)
      else return (t.lanes = e.lanes), Ct(e, t, i)
  }
  return il(e, t, n, r, i)
}
function cd(e, t, n) {
  var r = t.pendingProps,
    i = r.children,
    s = e !== null ? e.memoizedState : null
  if (r.mode === 'hidden')
    if (!(t.mode & 1)) (t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }), j(On, ze), (ze |= n)
    else if (n & 1073741824)
      (t.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }),
        (r = s !== null ? s.baseLanes : n),
        j(On, ze),
        (ze |= r)
    else
      return (
        (e = s !== null ? s.baseLanes | n : n),
        (t.lanes = t.childLanes = 1073741824),
        (t.memoizedState = { baseLanes: e, cachePool: null, transitions: null }),
        (t.updateQueue = null),
        j(On, ze),
        (ze |= e),
        null
      )
  else s !== null ? ((r = s.baseLanes | n), (t.memoizedState = null)) : (r = n), j(On, ze), (ze |= r)
  return ye(e, t, i, n), t.child
}
function fd(e, t) {
  var n = t.ref
  ;((e === null && n !== null) || (e !== null && e.ref !== n)) && ((t.flags |= 512), (t.flags |= 2097152))
}
function il(e, t, n, r, i) {
  var s = Re(n) ? fn : ve.current
  return (
    (s = Wn(t, s)),
    Hn(t, i),
    (n = oa(e, t, n, r, s, i)),
    (r = la()),
    e !== null && !Le
      ? ((t.updateQueue = e.updateQueue), (t.flags &= -2053), (e.lanes &= ~i), Ct(e, t, i))
      : (W && r && Zl(t), (t.flags |= 1), ye(e, t, n, i), t.child)
  )
}
function Nu(e, t, n, r, i) {
  if (Re(n)) {
    var s = !0
    ls(t)
  } else s = !1
  if ((Hn(t, i), t.stateNode === null))
    e !== null && ((e.alternate = null), (t.alternate = null), (t.flags |= 2)), Rf(t, n, r), Zo(t, n, r, i), (r = !0)
  else if (e === null) {
    var o = t.stateNode,
      l = t.memoizedProps
    o.props = l
    var a = o.context,
      u = n.contextType
    typeof u == 'object' && u !== null ? (u = Ge(u)) : ((u = Re(n) ? fn : ve.current), (u = Wn(t, u)))
    var c = n.getDerivedStateFromProps,
      p = typeof c == 'function' || typeof o.getSnapshotBeforeUpdate == 'function'
    p ||
      (typeof o.UNSAFE_componentWillReceiveProps != 'function' && typeof o.componentWillReceiveProps != 'function') ||
      ((l !== r || a !== u) && mu(t, o, r, u)),
      (Mt = !1)
    var f = t.memoizedState
    ;(o.state = f),
      cs(t, r, o, i),
      (a = t.memoizedState),
      l !== r || f !== a || Me.current || Mt
        ? (typeof c == 'function' && (Yo(t, n, c, r), (a = t.memoizedState)),
          (l = Mt || pu(t, n, l, r, f, a, u))
            ? (p ||
                (typeof o.UNSAFE_componentWillMount != 'function' && typeof o.componentWillMount != 'function') ||
                (typeof o.componentWillMount == 'function' && o.componentWillMount(),
                typeof o.UNSAFE_componentWillMount == 'function' && o.UNSAFE_componentWillMount()),
              typeof o.componentDidMount == 'function' && (t.flags |= 4194308))
            : (typeof o.componentDidMount == 'function' && (t.flags |= 4194308),
              (t.memoizedProps = r),
              (t.memoizedState = a)),
          (o.props = r),
          (o.state = a),
          (o.context = u),
          (r = l))
        : (typeof o.componentDidMount == 'function' && (t.flags |= 4194308), (r = !1))
  } else {
    ;(o = t.stateNode),
      If(e, t),
      (l = t.memoizedProps),
      (u = t.type === t.elementType ? l : tt(t.type, l)),
      (o.props = u),
      (p = t.pendingProps),
      (f = o.context),
      (a = n.contextType),
      typeof a == 'object' && a !== null ? (a = Ge(a)) : ((a = Re(n) ? fn : ve.current), (a = Wn(t, a)))
    var y = n.getDerivedStateFromProps
    ;(c = typeof y == 'function' || typeof o.getSnapshotBeforeUpdate == 'function') ||
      (typeof o.UNSAFE_componentWillReceiveProps != 'function' && typeof o.componentWillReceiveProps != 'function') ||
      ((l !== p || f !== a) && mu(t, o, r, a)),
      (Mt = !1),
      (f = t.memoizedState),
      (o.state = f),
      cs(t, r, o, i)
    var g = t.memoizedState
    l !== p || f !== g || Me.current || Mt
      ? (typeof y == 'function' && (Yo(t, n, y, r), (g = t.memoizedState)),
        (u = Mt || pu(t, n, u, r, f, g, a) || !1)
          ? (c ||
              (typeof o.UNSAFE_componentWillUpdate != 'function' && typeof o.componentWillUpdate != 'function') ||
              (typeof o.componentWillUpdate == 'function' && o.componentWillUpdate(r, g, a),
              typeof o.UNSAFE_componentWillUpdate == 'function' && o.UNSAFE_componentWillUpdate(r, g, a)),
            typeof o.componentDidUpdate == 'function' && (t.flags |= 4),
            typeof o.getSnapshotBeforeUpdate == 'function' && (t.flags |= 1024))
          : (typeof o.componentDidUpdate != 'function' ||
              (l === e.memoizedProps && f === e.memoizedState) ||
              (t.flags |= 4),
            typeof o.getSnapshotBeforeUpdate != 'function' ||
              (l === e.memoizedProps && f === e.memoizedState) ||
              (t.flags |= 1024),
            (t.memoizedProps = r),
            (t.memoizedState = g)),
        (o.props = r),
        (o.state = g),
        (o.context = a),
        (r = u))
      : (typeof o.componentDidUpdate != 'function' ||
          (l === e.memoizedProps && f === e.memoizedState) ||
          (t.flags |= 4),
        typeof o.getSnapshotBeforeUpdate != 'function' ||
          (l === e.memoizedProps && f === e.memoizedState) ||
          (t.flags |= 1024),
        (r = !1))
  }
  return sl(e, t, n, r, s, i)
}
function sl(e, t, n, r, i, s) {
  fd(e, t)
  var o = (t.flags & 128) !== 0
  if (!r && !o) return i && fu(t, n, !1), Ct(e, t, s)
  ;(r = t.stateNode), (yg.current = t)
  var l = o && typeof n.getDerivedStateFromError != 'function' ? null : r.render()
  return (
    (t.flags |= 1),
    e !== null && o ? ((t.child = Qn(t, e.child, null, s)), (t.child = Qn(t, null, l, s))) : ye(e, t, l, s),
    (t.memoizedState = r.state),
    i && fu(t, n, !0),
    t.child
  )
}
function dd(e) {
  var t = e.stateNode
  t.pendingContext ? cu(e, t.pendingContext, t.pendingContext !== t.context) : t.context && cu(e, t.context, !1),
    na(e, t.containerInfo)
}
function Cu(e, t, n, r, i) {
  return Vn(), ta(i), (t.flags |= 256), ye(e, t, n, r), t.child
}
var _i = { dehydrated: null, treeContext: null, retryLane: 0 }
function ki(e) {
  return { baseLanes: e, cachePool: null, transitions: null }
}
function Au(e, t) {
  return { baseLanes: e.baseLanes | t, cachePool: null, transitions: e.transitions }
}
function hd(e, t, n) {
  var r = t.pendingProps,
    i = X.current,
    s = !1,
    o = (t.flags & 128) !== 0,
    l
  if (
    ((l = o) || (l = e !== null && e.memoizedState === null ? !1 : (i & 2) !== 0),
    l ? ((s = !0), (t.flags &= -129)) : (e === null || e.memoizedState !== null) && (i |= 1),
    j(X, i & 1),
    e === null)
  )
    return (
      tl(t),
      (e = t.memoizedState),
      e !== null && ((e = e.dehydrated), e !== null)
        ? (t.mode & 1 ? (e.data === '$!' ? (t.lanes = 8) : (t.lanes = 1073741824)) : (t.lanes = 1), null)
        : ((i = r.children),
          (e = r.fallback),
          s
            ? ((r = t.mode),
              (s = t.child),
              (i = { mode: 'hidden', children: i }),
              !(r & 1) && s !== null ? ((s.childLanes = 0), (s.pendingProps = i)) : (s = Ss(i, r, 0, null)),
              (e = on(e, r, n, null)),
              (s.return = t),
              (e.return = t),
              (s.sibling = e),
              (t.child = s),
              (t.child.memoizedState = ki(n)),
              (t.memoizedState = _i),
              e)
            : ol(t, i))
    )
  if (((i = e.memoizedState), i !== null)) {
    if (((l = i.dehydrated), l !== null)) {
      if (o)
        return t.flags & 256
          ? ((t.flags &= -257), Ti(e, t, n, Error(A(422))))
          : t.memoizedState !== null
          ? ((t.child = e.child), (t.flags |= 128), null)
          : ((s = r.fallback),
            (i = t.mode),
            (r = Ss({ mode: 'visible', children: r.children }, i, 0, null)),
            (s = on(s, i, n, null)),
            (s.flags |= 2),
            (r.return = t),
            (s.return = t),
            (r.sibling = s),
            (t.child = r),
            t.mode & 1 && Qn(t, e.child, null, n),
            (t.child.memoizedState = ki(n)),
            (t.memoizedState = _i),
            s)
      if (!(t.mode & 1)) t = Ti(e, t, n, null)
      else if (l.data === '$!') t = Ti(e, t, n, Error(A(419)))
      else if (((r = (n & e.childLanes) !== 0), Le || r)) {
        if (((r = oe), r !== null)) {
          switch (n & -n) {
            case 4:
              s = 2
              break
            case 16:
              s = 8
              break
            case 64:
            case 128:
            case 256:
            case 512:
            case 1024:
            case 2048:
            case 4096:
            case 8192:
            case 16384:
            case 32768:
            case 65536:
            case 131072:
            case 262144:
            case 524288:
            case 1048576:
            case 2097152:
            case 4194304:
            case 8388608:
            case 16777216:
            case 33554432:
            case 67108864:
              s = 32
              break
            case 536870912:
              s = 268435456
              break
            default:
              s = 0
          }
          ;(r = s & (r.suspendedLanes | n) ? 0 : s), r !== 0 && r !== i.retryLane && ((i.retryLane = r), Xe(e, r, -1))
        }
        ga(), (t = Ti(e, t, n, Error(A(421))))
      } else
        l.data === '$?'
          ? ((t.flags |= 128), (t.child = e.child), (t = bg.bind(null, e)), (l._reactRetry = t), (t = null))
          : ((n = i.treeContext),
            (Ae = St(l.nextSibling)),
            (Fe = t),
            (W = !0),
            (rt = null),
            n !== null && ((Be[qe++] = Et), (Be[qe++] = xt), (Be[qe++] = dn), (Et = n.id), (xt = n.overflow), (dn = t)),
            (t = ol(t, t.pendingProps.children)),
            (t.flags |= 4096))
      return t
    }
    return s
      ? ((r = bu(e, t, r.children, r.fallback, n)),
        (s = t.child),
        (i = e.child.memoizedState),
        (s.memoizedState = i === null ? ki(n) : Au(i, n)),
        (s.childLanes = e.childLanes & ~n),
        (t.memoizedState = _i),
        r)
      : ((n = Lu(e, t, r.children, n)), (t.memoizedState = null), n)
  }
  return s
    ? ((r = bu(e, t, r.children, r.fallback, n)),
      (s = t.child),
      (i = e.child.memoizedState),
      (s.memoizedState = i === null ? ki(n) : Au(i, n)),
      (s.childLanes = e.childLanes & ~n),
      (t.memoizedState = _i),
      r)
    : ((n = Lu(e, t, r.children, n)), (t.memoizedState = null), n)
}
function ol(e, t) {
  return (t = Ss({ mode: 'visible', children: t }, e.mode, 0, null)), (t.return = e), (e.child = t)
}
function Lu(e, t, n, r) {
  var i = e.child
  return (
    (e = i.sibling),
    (n = Vt(i, { mode: 'visible', children: n })),
    !(t.mode & 1) && (n.lanes = r),
    (n.return = t),
    (n.sibling = null),
    e !== null && ((r = t.deletions), r === null ? ((t.deletions = [e]), (t.flags |= 16)) : r.push(e)),
    (t.child = n)
  )
}
function bu(e, t, n, r, i) {
  var s = t.mode
  e = e.child
  var o = e.sibling,
    l = { mode: 'hidden', children: n }
  return (
    !(s & 1) && t.child !== e
      ? ((n = t.child), (n.childLanes = 0), (n.pendingProps = l), (t.deletions = null))
      : ((n = Vt(e, l)), (n.subtreeFlags = e.subtreeFlags & 14680064)),
    o !== null ? (r = Vt(o, r)) : ((r = on(r, s, i, null)), (r.flags |= 2)),
    (r.return = t),
    (n.return = t),
    (n.sibling = r),
    (t.child = n),
    r
  )
}
function Ti(e, t, n, r) {
  return (
    r !== null && ta(r),
    Qn(t, e.child, null, n),
    (e = ol(t, t.pendingProps.children)),
    (e.flags |= 2),
    (t.memoizedState = null),
    e
  )
}
function Iu(e, t, n) {
  e.lanes |= t
  var r = e.alternate
  r !== null && (r.lanes |= t), Jo(e.return, t, n)
}
function go(e, t, n, r, i) {
  var s = e.memoizedState
  s === null
    ? (e.memoizedState = { isBackwards: t, rendering: null, renderingStartTime: 0, last: r, tail: n, tailMode: i })
    : ((s.isBackwards = t),
      (s.rendering = null),
      (s.renderingStartTime = 0),
      (s.last = r),
      (s.tail = n),
      (s.tailMode = i))
}
function pd(e, t, n) {
  var r = t.pendingProps,
    i = r.revealOrder,
    s = r.tail
  if ((ye(e, t, r.children, n), (r = X.current), r & 2)) (r = (r & 1) | 2), (t.flags |= 128)
  else {
    if (e !== null && e.flags & 128)
      e: for (e = t.child; e !== null; ) {
        if (e.tag === 13) e.memoizedState !== null && Iu(e, n, t)
        else if (e.tag === 19) Iu(e, n, t)
        else if (e.child !== null) {
          ;(e.child.return = e), (e = e.child)
          continue
        }
        if (e === t) break e
        for (; e.sibling === null; ) {
          if (e.return === null || e.return === t) break e
          e = e.return
        }
        ;(e.sibling.return = e.return), (e = e.sibling)
      }
    r &= 1
  }
  if ((j(X, r), !(t.mode & 1))) t.memoizedState = null
  else
    switch (i) {
      case 'forwards':
        for (n = t.child, i = null; n !== null; )
          (e = n.alternate), e !== null && hs(e) === null && (i = n), (n = n.sibling)
        ;(n = i),
          n === null ? ((i = t.child), (t.child = null)) : ((i = n.sibling), (n.sibling = null)),
          go(t, !1, i, n, s)
        break
      case 'backwards':
        for (n = null, i = t.child, t.child = null; i !== null; ) {
          if (((e = i.alternate), e !== null && hs(e) === null)) {
            t.child = i
            break
          }
          ;(e = i.sibling), (i.sibling = n), (n = i), (i = e)
        }
        go(t, !0, n, null, s)
        break
      case 'together':
        go(t, !1, null, null, void 0)
        break
      default:
        t.memoizedState = null
    }
  return t.child
}
function Ct(e, t, n) {
  if ((e !== null && (t.dependencies = e.dependencies), (pn |= t.lanes), !(n & t.childLanes))) return null
  if (e !== null && t.child !== e.child) throw Error(A(153))
  if (t.child !== null) {
    for (e = t.child, n = Vt(e, e.pendingProps), t.child = n, n.return = t; e.sibling !== null; )
      (e = e.sibling), (n = n.sibling = Vt(e, e.pendingProps)), (n.return = t)
    n.sibling = null
  }
  return t.child
}
function wg(e, t, n) {
  switch (t.tag) {
    case 3:
      dd(t), Vn()
      break
    case 5:
      Df(t)
      break
    case 1:
      Re(t.type) && ls(t)
      break
    case 4:
      na(t, t.stateNode.containerInfo)
      break
    case 10:
      var r = t.type._context,
        i = t.memoizedProps.value
      j(as, r._currentValue), (r._currentValue = i)
      break
    case 13:
      if (((r = t.memoizedState), r !== null))
        return r.dehydrated !== null
          ? (j(X, X.current & 1), (t.flags |= 128), null)
          : n & t.child.childLanes
          ? hd(e, t, n)
          : (j(X, X.current & 1), (e = Ct(e, t, n)), e !== null ? e.sibling : null)
      j(X, X.current & 1)
      break
    case 19:
      if (((r = (n & t.childLanes) !== 0), e.flags & 128)) {
        if (r) return pd(e, t, n)
        t.flags |= 128
      }
      if (
        ((i = t.memoizedState),
        i !== null && ((i.rendering = null), (i.tail = null), (i.lastEffect = null)),
        j(X, X.current),
        r)
      )
        break
      return null
    case 22:
    case 23:
      return (t.lanes = 0), cd(e, t, n)
  }
  return Ct(e, t, n)
}
function Sg(e, t) {
  switch ((ea(t), t.tag)) {
    case 1:
      return Re(t.type) && os(), (e = t.flags), e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
    case 3:
      return (
        Xn(), B(Me), B(ve), ia(), (e = t.flags), e & 65536 && !(e & 128) ? ((t.flags = (e & -65537) | 128), t) : null
      )
    case 5:
      return ra(t), null
    case 13:
      if ((B(X), (e = t.memoizedState), e !== null && e.dehydrated !== null)) {
        if (t.alternate === null) throw Error(A(340))
        Vn()
      }
      return (e = t.flags), e & 65536 ? ((t.flags = (e & -65537) | 128), t) : null
    case 19:
      return B(X), null
    case 4:
      return Xn(), null
    case 10:
      return Jl(t.type._context), null
    case 22:
    case 23:
      return ma(), null
    case 24:
      return null
    default:
      return null
  }
}
var Ni = !1,
  ge = !1,
  Eg = typeof WeakSet == 'function' ? WeakSet : Set,
  R = null
function $n(e, t) {
  var n = e.ref
  if (n !== null)
    if (typeof n == 'function')
      try {
        n(null)
      } catch (r) {
        J(e, t, r)
      }
    else n.current = null
}
function ll(e, t, n) {
  try {
    n()
  } catch (r) {
    J(e, t, r)
  }
}
var Mu = !1
function xg(e, t) {
  if (((Wo = ns), (e = Sf()), Xl(e))) {
    if ('selectionStart' in e) var n = { start: e.selectionStart, end: e.selectionEnd }
    else
      e: {
        n = ((n = e.ownerDocument) && n.defaultView) || window
        var r = n.getSelection && n.getSelection()
        if (r && r.rangeCount !== 0) {
          n = r.anchorNode
          var i = r.anchorOffset,
            s = r.focusNode
          r = r.focusOffset
          try {
            n.nodeType, s.nodeType
          } catch {
            n = null
            break e
          }
          var o = 0,
            l = -1,
            a = -1,
            u = 0,
            c = 0,
            p = e,
            f = null
          t: for (;;) {
            for (
              var y;
              p !== n || (i !== 0 && p.nodeType !== 3) || (l = o + i),
                p !== s || (r !== 0 && p.nodeType !== 3) || (a = o + r),
                p.nodeType === 3 && (o += p.nodeValue.length),
                (y = p.firstChild) !== null;

            )
              (f = p), (p = y)
            for (;;) {
              if (p === e) break t
              if ((f === n && ++u === i && (l = o), f === s && ++c === r && (a = o), (y = p.nextSibling) !== null))
                break
              ;(p = f), (f = p.parentNode)
            }
            p = y
          }
          n = l === -1 || a === -1 ? null : { start: l, end: a }
        } else n = null
      }
    n = n || { start: 0, end: 0 }
  } else n = null
  for (Vo = { focusedElem: e, selectionRange: n }, ns = !1, R = t; R !== null; )
    if (((t = R), (e = t.child), (t.subtreeFlags & 1028) !== 0 && e !== null)) (e.return = t), (R = e)
    else
      for (; R !== null; ) {
        t = R
        try {
          var g = t.alternate
          if (t.flags & 1024)
            switch (t.tag) {
              case 0:
              case 11:
              case 15:
                break
              case 1:
                if (g !== null) {
                  var w = g.memoizedProps,
                    x = g.memoizedState,
                    h = t.stateNode,
                    d = h.getSnapshotBeforeUpdate(t.elementType === t.type ? w : tt(t.type, w), x)
                  h.__reactInternalSnapshotBeforeUpdate = d
                }
                break
              case 3:
                var v = t.stateNode.containerInfo
                if (v.nodeType === 1) v.textContent = ''
                else if (v.nodeType === 9) {
                  var S = v.body
                  S != null && (S.textContent = '')
                }
                break
              case 5:
              case 6:
              case 4:
              case 17:
                break
              default:
                throw Error(A(163))
            }
        } catch (T) {
          J(t, t.return, T)
        }
        if (((e = t.sibling), e !== null)) {
          ;(e.return = t.return), (R = e)
          break
        }
        R = t.return
      }
  return (g = Mu), (Mu = !1), g
}
function Mr(e, t, n) {
  var r = t.updateQueue
  if (((r = r !== null ? r.lastEffect : null), r !== null)) {
    var i = (r = r.next)
    do {
      if ((i.tag & e) === e) {
        var s = i.destroy
        ;(i.destroy = void 0), s !== void 0 && ll(t, n, s)
      }
      i = i.next
    } while (i !== r)
  }
}
function $s(e, t) {
  if (((t = t.updateQueue), (t = t !== null ? t.lastEffect : null), t !== null)) {
    var n = (t = t.next)
    do {
      if ((n.tag & e) === e) {
        var r = n.create
        n.destroy = r()
      }
      n = n.next
    } while (n !== t)
  }
}
function al(e) {
  var t = e.ref
  if (t !== null) {
    var n = e.stateNode
    switch (e.tag) {
      case 5:
        e = n
        break
      default:
        e = n
    }
    typeof t == 'function' ? t(e) : (t.current = e)
  }
}
function md(e) {
  var t = e.alternate
  t !== null && ((e.alternate = null), md(t)),
    (e.child = null),
    (e.deletions = null),
    (e.sibling = null),
    e.tag === 5 &&
      ((t = e.stateNode), t !== null && (delete t[ft], delete t[Vr], delete t[Go], delete t[sg], delete t[og])),
    (e.stateNode = null),
    (e.return = null),
    (e.dependencies = null),
    (e.memoizedProps = null),
    (e.memoizedState = null),
    (e.pendingProps = null),
    (e.stateNode = null),
    (e.updateQueue = null)
}
function gd(e) {
  return e.tag === 5 || e.tag === 3 || e.tag === 4
}
function Ru(e) {
  e: for (;;) {
    for (; e.sibling === null; ) {
      if (e.return === null || gd(e.return)) return null
      e = e.return
    }
    for (e.sibling.return = e.return, e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18; ) {
      if (e.flags & 2 || e.child === null || e.tag === 4) continue e
      ;(e.child.return = e), (e = e.child)
    }
    if (!(e.flags & 2)) return e.stateNode
  }
}
function ul(e, t, n) {
  var r = e.tag
  if (r === 5 || r === 6)
    (e = e.stateNode),
      t
        ? n.nodeType === 8
          ? n.parentNode.insertBefore(e, t)
          : n.insertBefore(e, t)
        : (n.nodeType === 8 ? ((t = n.parentNode), t.insertBefore(e, n)) : ((t = n), t.appendChild(e)),
          (n = n._reactRootContainer),
          n != null || t.onclick !== null || (t.onclick = ss))
  else if (r !== 4 && ((e = e.child), e !== null))
    for (ul(e, t, n), e = e.sibling; e !== null; ) ul(e, t, n), (e = e.sibling)
}
function cl(e, t, n) {
  var r = e.tag
  if (r === 5 || r === 6) (e = e.stateNode), t ? n.insertBefore(e, t) : n.appendChild(e)
  else if (r !== 4 && ((e = e.child), e !== null))
    for (cl(e, t, n), e = e.sibling; e !== null; ) cl(e, t, n), (e = e.sibling)
}
var ue = null,
  nt = !1
function Lt(e, t, n) {
  for (n = n.child; n !== null; ) vd(e, t, n), (n = n.sibling)
}
function vd(e, t, n) {
  if (dt && typeof dt.onCommitFiberUnmount == 'function')
    try {
      dt.onCommitFiberUnmount(Cs, n)
    } catch {}
  switch (n.tag) {
    case 5:
      ge || $n(n, t)
    case 6:
      var r = ue,
        i = nt
      ;(ue = null),
        Lt(e, t, n),
        (ue = r),
        (nt = i),
        ue !== null &&
          (nt
            ? ((e = ue), (n = n.stateNode), e.nodeType === 8 ? e.parentNode.removeChild(n) : e.removeChild(n))
            : ue.removeChild(n.stateNode))
      break
    case 18:
      ue !== null &&
        (nt
          ? ((e = ue), (n = n.stateNode), e.nodeType === 8 ? uo(e.parentNode, n) : e.nodeType === 1 && uo(e, n), jr(e))
          : uo(ue, n.stateNode))
      break
    case 4:
      ;(r = ue), (i = nt), (ue = n.stateNode.containerInfo), (nt = !0), Lt(e, t, n), (ue = r), (nt = i)
      break
    case 0:
    case 11:
    case 14:
    case 15:
      if (!ge && ((r = n.updateQueue), r !== null && ((r = r.lastEffect), r !== null))) {
        i = r = r.next
        do {
          var s = i,
            o = s.destroy
          ;(s = s.tag), o !== void 0 && (s & 2 || s & 4) && ll(n, t, o), (i = i.next)
        } while (i !== r)
      }
      Lt(e, t, n)
      break
    case 1:
      if (!ge && ($n(n, t), (r = n.stateNode), typeof r.componentWillUnmount == 'function'))
        try {
          ;(r.props = n.memoizedProps), (r.state = n.memoizedState), r.componentWillUnmount()
        } catch (l) {
          J(n, t, l)
        }
      Lt(e, t, n)
      break
    case 21:
      Lt(e, t, n)
      break
    case 22:
      n.mode & 1 ? ((ge = (r = ge) || n.memoizedState !== null), Lt(e, t, n), (ge = r)) : Lt(e, t, n)
      break
    default:
      Lt(e, t, n)
  }
}
function Pu(e) {
  var t = e.updateQueue
  if (t !== null) {
    e.updateQueue = null
    var n = e.stateNode
    n === null && (n = e.stateNode = new Eg()),
      t.forEach(function (r) {
        var i = Ig.bind(null, e, r)
        n.has(r) || (n.add(r), r.then(i, i))
      })
  }
}
function Ye(e, t) {
  var n = t.deletions
  if (n !== null)
    for (var r = 0; r < n.length; r++) {
      var i = n[r]
      try {
        var s = e,
          o = t,
          l = o
        e: for (; l !== null; ) {
          switch (l.tag) {
            case 5:
              ;(ue = l.stateNode), (nt = !1)
              break e
            case 3:
              ;(ue = l.stateNode.containerInfo), (nt = !0)
              break e
            case 4:
              ;(ue = l.stateNode.containerInfo), (nt = !0)
              break e
          }
          l = l.return
        }
        if (ue === null) throw Error(A(160))
        vd(s, o, i), (ue = null), (nt = !1)
        var a = i.alternate
        a !== null && (a.return = null), (i.return = null)
      } catch (u) {
        J(i, t, u)
      }
    }
  if (t.subtreeFlags & 12854) for (t = t.child; t !== null; ) yd(t, e), (t = t.sibling)
}
function yd(e, t) {
  var n = e.alternate,
    r = e.flags
  switch (e.tag) {
    case 0:
    case 11:
    case 14:
    case 15:
      if ((Ye(t, e), lt(e), r & 4)) {
        try {
          Mr(3, e, e.return), $s(3, e)
        } catch (g) {
          J(e, e.return, g)
        }
        try {
          Mr(5, e, e.return)
        } catch (g) {
          J(e, e.return, g)
        }
      }
      break
    case 1:
      Ye(t, e), lt(e), r & 512 && n !== null && $n(n, n.return)
      break
    case 5:
      if ((Ye(t, e), lt(e), r & 512 && n !== null && $n(n, n.return), e.flags & 32)) {
        var i = e.stateNode
        try {
          zr(i, '')
        } catch (g) {
          J(e, e.return, g)
        }
      }
      if (r & 4 && ((i = e.stateNode), i != null)) {
        var s = e.memoizedProps,
          o = n !== null ? n.memoizedProps : s,
          l = e.type,
          a = e.updateQueue
        if (((e.updateQueue = null), a !== null))
          try {
            l === 'input' && s.type === 'radio' && s.name != null && Uc(i, s), $o(l, o)
            var u = $o(l, s)
            for (o = 0; o < a.length; o += 2) {
              var c = a[o],
                p = a[o + 1]
              c === 'style'
                ? Wc(i, p)
                : c === 'dangerouslySetInnerHTML'
                ? Bc(i, p)
                : c === 'children'
                ? zr(i, p)
                : $l(i, c, p, u)
            }
            switch (l) {
              case 'input':
                bo(i, s)
                break
              case 'textarea':
                jc(i, s)
                break
              case 'select':
                var f = i._wrapperState.wasMultiple
                i._wrapperState.wasMultiple = !!s.multiple
                var y = s.value
                y != null
                  ? Dn(i, !!s.multiple, y, !1)
                  : f !== !!s.multiple &&
                    (s.defaultValue != null
                      ? Dn(i, !!s.multiple, s.defaultValue, !0)
                      : Dn(i, !!s.multiple, s.multiple ? [] : '', !1))
            }
            i[Vr] = s
          } catch (g) {
            J(e, e.return, g)
          }
      }
      break
    case 6:
      if ((Ye(t, e), lt(e), r & 4)) {
        if (e.stateNode === null) throw Error(A(162))
        ;(u = e.stateNode), (c = e.memoizedProps)
        try {
          u.nodeValue = c
        } catch (g) {
          J(e, e.return, g)
        }
      }
      break
    case 3:
      if ((Ye(t, e), lt(e), r & 4 && n !== null && n.memoizedState.isDehydrated))
        try {
          jr(t.containerInfo)
        } catch (g) {
          J(e, e.return, g)
        }
      break
    case 4:
      Ye(t, e), lt(e)
      break
    case 13:
      Ye(t, e),
        lt(e),
        (u = e.child),
        u.flags & 8192 &&
          u.memoizedState !== null &&
          (u.alternate === null || u.alternate.memoizedState === null) &&
          (ha = Y()),
        r & 4 && Pu(e)
      break
    case 22:
      if (
        ((u = n !== null && n.memoizedState !== null),
        e.mode & 1 ? ((ge = (c = ge) || u), Ye(t, e), (ge = c)) : Ye(t, e),
        lt(e),
        r & 8192)
      ) {
        c = e.memoizedState !== null
        e: for (p = null, f = e; ; ) {
          if (f.tag === 5) {
            if (p === null) {
              p = f
              try {
                ;(i = f.stateNode),
                  c
                    ? ((s = i.style),
                      typeof s.setProperty == 'function'
                        ? s.setProperty('display', 'none', 'important')
                        : (s.display = 'none'))
                    : ((l = f.stateNode),
                      (a = f.memoizedProps.style),
                      (o = a != null && a.hasOwnProperty('display') ? a.display : null),
                      (l.style.display = qc('display', o)))
              } catch (g) {
                J(e, e.return, g)
              }
            }
          } else if (f.tag === 6) {
            if (p === null)
              try {
                f.stateNode.nodeValue = c ? '' : f.memoizedProps
              } catch (g) {
                J(e, e.return, g)
              }
          } else if (((f.tag !== 22 && f.tag !== 23) || f.memoizedState === null || f === e) && f.child !== null) {
            ;(f.child.return = f), (f = f.child)
            continue
          }
          if (f === e) break e
          for (; f.sibling === null; ) {
            if (f.return === null || f.return === e) break e
            p === f && (p = null), (f = f.return)
          }
          p === f && (p = null), (f.sibling.return = f.return), (f = f.sibling)
        }
        if (c && !u && e.mode & 1)
          for (R = e, e = e.child; e !== null; ) {
            for (u = R = e; R !== null; ) {
              switch (((c = R), (p = c.child), c.tag)) {
                case 0:
                case 11:
                case 14:
                case 15:
                  Mr(4, c, c.return)
                  break
                case 1:
                  if (($n(c, c.return), (s = c.stateNode), typeof s.componentWillUnmount == 'function')) {
                    ;(f = c), (y = c.return)
                    try {
                      ;(i = f), (s.props = i.memoizedProps), (s.state = i.memoizedState), s.componentWillUnmount()
                    } catch (g) {
                      J(f, y, g)
                    }
                  }
                  break
                case 5:
                  $n(c, c.return)
                  break
                case 22:
                  if (c.memoizedState !== null) {
                    Ou(u)
                    continue
                  }
              }
              p !== null ? ((p.return = c), (R = p)) : Ou(u)
            }
            e = e.sibling
          }
      }
      break
    case 19:
      Ye(t, e), lt(e), r & 4 && Pu(e)
      break
    case 21:
      break
    default:
      Ye(t, e), lt(e)
  }
}
function lt(e) {
  var t = e.flags
  if (t & 2) {
    try {
      e: {
        for (var n = e.return; n !== null; ) {
          if (gd(n)) {
            var r = n
            break e
          }
          n = n.return
        }
        throw Error(A(160))
      }
      switch (r.tag) {
        case 5:
          var i = r.stateNode
          r.flags & 32 && (zr(i, ''), (r.flags &= -33))
          var s = Ru(e)
          cl(e, s, i)
          break
        case 3:
        case 4:
          var o = r.stateNode.containerInfo,
            l = Ru(e)
          ul(e, l, o)
          break
        default:
          throw Error(A(161))
      }
    } catch (a) {
      J(e, e.return, a)
    }
    e.flags &= -3
  }
  t & 4096 && (e.flags &= -4097)
}
function _g(e, t, n) {
  ;(R = e), wd(e)
}
function wd(e, t, n) {
  for (var r = (e.mode & 1) !== 0; R !== null; ) {
    var i = R,
      s = i.child
    if (i.tag === 22 && r) {
      var o = i.memoizedState !== null || Ni
      if (!o) {
        var l = i.alternate,
          a = (l !== null && l.memoizedState !== null) || ge
        l = Ni
        var u = ge
        if (((Ni = o), (ge = a) && !u))
          for (R = i; R !== null; )
            (o = R),
              (a = o.child),
              o.tag === 22 && o.memoizedState !== null ? zu(i) : a !== null ? ((a.return = o), (R = a)) : zu(i)
        for (; s !== null; ) (R = s), wd(s), (s = s.sibling)
        ;(R = i), (Ni = l), (ge = u)
      }
      $u(e)
    } else i.subtreeFlags & 8772 && s !== null ? ((s.return = i), (R = s)) : $u(e)
  }
}
function $u(e) {
  for (; R !== null; ) {
    var t = R
    if (t.flags & 8772) {
      var n = t.alternate
      try {
        if (t.flags & 8772)
          switch (t.tag) {
            case 0:
            case 11:
            case 15:
              ge || $s(5, t)
              break
            case 1:
              var r = t.stateNode
              if (t.flags & 4 && !ge)
                if (n === null) r.componentDidMount()
                else {
                  var i = t.elementType === t.type ? n.memoizedProps : tt(t.type, n.memoizedProps)
                  r.componentDidUpdate(i, n.memoizedState, r.__reactInternalSnapshotBeforeUpdate)
                }
              var s = t.updateQueue
              s !== null && hu(t, s, r)
              break
            case 3:
              var o = t.updateQueue
              if (o !== null) {
                if (((n = null), t.child !== null))
                  switch (t.child.tag) {
                    case 5:
                      n = t.child.stateNode
                      break
                    case 1:
                      n = t.child.stateNode
                  }
                hu(t, o, n)
              }
              break
            case 5:
              var l = t.stateNode
              if (n === null && t.flags & 4) {
                n = l
                var a = t.memoizedProps
                switch (t.type) {
                  case 'button':
                  case 'input':
                  case 'select':
                  case 'textarea':
                    a.autoFocus && n.focus()
                    break
                  case 'img':
                    a.src && (n.src = a.src)
                }
              }
              break
            case 6:
              break
            case 4:
              break
            case 12:
              break
            case 13:
              if (t.memoizedState === null) {
                var u = t.alternate
                if (u !== null) {
                  var c = u.memoizedState
                  if (c !== null) {
                    var p = c.dehydrated
                    p !== null && jr(p)
                  }
                }
              }
              break
            case 19:
            case 17:
            case 21:
            case 22:
            case 23:
              break
            default:
              throw Error(A(163))
          }
        ge || (t.flags & 512 && al(t))
      } catch (f) {
        J(t, t.return, f)
      }
    }
    if (t === e) {
      R = null
      break
    }
    if (((n = t.sibling), n !== null)) {
      ;(n.return = t.return), (R = n)
      break
    }
    R = t.return
  }
}
function Ou(e) {
  for (; R !== null; ) {
    var t = R
    if (t === e) {
      R = null
      break
    }
    var n = t.sibling
    if (n !== null) {
      ;(n.return = t.return), (R = n)
      break
    }
    R = t.return
  }
}
function zu(e) {
  for (; R !== null; ) {
    var t = R
    try {
      switch (t.tag) {
        case 0:
        case 11:
        case 15:
          var n = t.return
          try {
            $s(4, t)
          } catch (a) {
            J(t, n, a)
          }
          break
        case 1:
          var r = t.stateNode
          if (typeof r.componentDidMount == 'function') {
            var i = t.return
            try {
              r.componentDidMount()
            } catch (a) {
              J(t, i, a)
            }
          }
          var s = t.return
          try {
            al(t)
          } catch (a) {
            J(t, s, a)
          }
          break
        case 5:
          var o = t.return
          try {
            al(t)
          } catch (a) {
            J(t, o, a)
          }
      }
    } catch (a) {
      J(t, t.return, a)
    }
    if (t === e) {
      R = null
      break
    }
    var l = t.sibling
    if (l !== null) {
      ;(l.return = t.return), (R = l)
      break
    }
    R = t.return
  }
}
var kg = Math.ceil,
  gs = At.ReactCurrentDispatcher,
  fa = At.ReactCurrentOwner,
  Qe = At.ReactCurrentBatchConfig,
  F = 0,
  oe = null,
  ne = null,
  fe = 0,
  ze = 0,
  On = Xt(0),
  se = 0,
  Yr = null,
  pn = 0,
  Os = 0,
  da = 0,
  Rr = null,
  Ce = null,
  ha = 0,
  Gn = 1 / 0,
  yt = null,
  vs = !1,
  fl = null,
  Ht = null,
  Ci = !1,
  zt = null,
  ys = 0,
  Pr = 0,
  dl = null,
  ji = -1,
  Hi = 0
function Ee() {
  return F & 6 ? Y() : ji !== -1 ? ji : (ji = Y())
}
function Bt(e) {
  return e.mode & 1
    ? F & 2 && fe !== 0
      ? fe & -fe
      : ag.transition !== null
      ? (Hi === 0 && (Hi = rf()), Hi)
      : ((e = U), e !== 0 || ((e = window.event), (e = e === void 0 ? 16 : ff(e.type))), e)
    : 1
}
function Xe(e, t, n) {
  if (50 < Pr) throw ((Pr = 0), (dl = null), Error(A(185)))
  var r = zs(e, t)
  return r === null
    ? null
    : (ri(r, t, n),
      (!(F & 2) || r !== oe) &&
        (r === oe && (!(F & 2) && (Os |= t), se === 4 && $t(r, fe)),
        Pe(r, n),
        t === 1 && F === 0 && !(e.mode & 1) && ((Gn = Y() + 500), Ms && Gt())),
      r)
}
function zs(e, t) {
  e.lanes |= t
  var n = e.alternate
  for (n !== null && (n.lanes |= t), n = e, e = e.return; e !== null; )
    (e.childLanes |= t), (n = e.alternate), n !== null && (n.childLanes |= t), (n = e), (e = e.return)
  return n.tag === 3 ? n.stateNode : null
}
function Sd(e) {
  return (oe !== null || it !== null) && (e.mode & 1) !== 0 && (F & 2) === 0
}
function Pe(e, t) {
  var n = e.callbackNode
  am(e, t)
  var r = ts(e, e === oe ? fe : 0)
  if (r === 0) n !== null && Ba(n), (e.callbackNode = null), (e.callbackPriority = 0)
  else if (((t = r & -r), e.callbackPriority !== t)) {
    if ((n != null && Ba(n), t === 1))
      e.tag === 0 ? lg(Du.bind(null, e)) : bf(Du.bind(null, e)),
        rg(function () {
          F === 0 && Gt()
        }),
        (n = null)
    else {
      switch (sf(r)) {
        case 1:
          n = Ul
          break
        case 4:
          n = tf
          break
        case 16:
          n = es
          break
        case 536870912:
          n = nf
          break
        default:
          n = es
      }
      n = Ad(n, Ed.bind(null, e))
    }
    ;(e.callbackPriority = t), (e.callbackNode = n)
  }
}
function Ed(e, t) {
  if (((ji = -1), (Hi = 0), F & 6)) throw Error(A(327))
  var n = e.callbackNode
  if (Bn() && e.callbackNode !== n) return null
  var r = ts(e, e === oe ? fe : 0)
  if (r === 0) return null
  if (r & 30 || r & e.expiredLanes || t) t = ws(e, r)
  else {
    t = r
    var i = F
    F |= 2
    var s = _d()
    ;(oe !== e || fe !== t) && ((yt = null), (Gn = Y() + 500), sn(e, t))
    do
      try {
        Cg()
        break
      } catch (l) {
        xd(e, l)
      }
    while (1)
    Kl(), (gs.current = s), (F = i), ne !== null ? (t = 0) : ((oe = null), (fe = 0), (t = se))
  }
  if (t !== 0) {
    if ((t === 2 && ((i = Uo(e)), i !== 0 && ((r = i), (t = hl(e, i)))), t === 1))
      throw ((n = Yr), sn(e, 0), $t(e, r), Pe(e, Y()), n)
    if (t === 6) $t(e, r)
    else {
      if (
        ((i = e.current.alternate),
        !(r & 30) &&
          !Tg(i) &&
          ((t = ws(e, r)), t === 2 && ((s = Uo(e)), s !== 0 && ((r = s), (t = hl(e, s)))), t === 1))
      )
        throw ((n = Yr), sn(e, 0), $t(e, r), Pe(e, Y()), n)
      switch (((e.finishedWork = i), (e.finishedLanes = r), t)) {
        case 0:
        case 1:
          throw Error(A(345))
        case 2:
          Yt(e, Ce, yt)
          break
        case 3:
          if (($t(e, r), (r & 130023424) === r && ((t = ha + 500 - Y()), 10 < t))) {
            if (ts(e, 0) !== 0) break
            if (((i = e.suspendedLanes), (i & r) !== r)) {
              Ee(), (e.pingedLanes |= e.suspendedLanes & i)
              break
            }
            e.timeoutHandle = Xo(Yt.bind(null, e, Ce, yt), t)
            break
          }
          Yt(e, Ce, yt)
          break
        case 4:
          if (($t(e, r), (r & 4194240) === r)) break
          for (t = e.eventTimes, i = -1; 0 < r; ) {
            var o = 31 - st(r)
            ;(s = 1 << o), (o = t[o]), o > i && (i = o), (r &= ~s)
          }
          if (
            ((r = i),
            (r = Y() - r),
            (r =
              (120 > r
                ? 120
                : 480 > r
                ? 480
                : 1080 > r
                ? 1080
                : 1920 > r
                ? 1920
                : 3e3 > r
                ? 3e3
                : 4320 > r
                ? 4320
                : 1960 * kg(r / 1960)) - r),
            10 < r)
          ) {
            e.timeoutHandle = Xo(Yt.bind(null, e, Ce, yt), r)
            break
          }
          Yt(e, Ce, yt)
          break
        case 5:
          Yt(e, Ce, yt)
          break
        default:
          throw Error(A(329))
      }
    }
  }
  return Pe(e, Y()), e.callbackNode === n ? Ed.bind(null, e) : null
}
function hl(e, t) {
  var n = Rr
  return (
    e.current.memoizedState.isDehydrated && (sn(e, t).flags |= 256),
    (e = ws(e, t)),
    e !== 2 && ((t = Ce), (Ce = n), t !== null && pl(t)),
    e
  )
}
function pl(e) {
  Ce === null ? (Ce = e) : Ce.push.apply(Ce, e)
}
function Tg(e) {
  for (var t = e; ; ) {
    if (t.flags & 16384) {
      var n = t.updateQueue
      if (n !== null && ((n = n.stores), n !== null))
        for (var r = 0; r < n.length; r++) {
          var i = n[r],
            s = i.getSnapshot
          i = i.value
          try {
            if (!ot(s(), i)) return !1
          } catch {
            return !1
          }
        }
    }
    if (((n = t.child), t.subtreeFlags & 16384 && n !== null)) (n.return = t), (t = n)
    else {
      if (t === e) break
      for (; t.sibling === null; ) {
        if (t.return === null || t.return === e) return !0
        t = t.return
      }
      ;(t.sibling.return = t.return), (t = t.sibling)
    }
  }
  return !0
}
function $t(e, t) {
  for (t &= ~da, t &= ~Os, e.suspendedLanes |= t, e.pingedLanes &= ~t, e = e.expirationTimes; 0 < t; ) {
    var n = 31 - st(t),
      r = 1 << n
    ;(e[n] = -1), (t &= ~r)
  }
}
function Du(e) {
  if (F & 6) throw Error(A(327))
  Bn()
  var t = ts(e, 0)
  if (!(t & 1)) return Pe(e, Y()), null
  var n = ws(e, t)
  if (e.tag !== 0 && n === 2) {
    var r = Uo(e)
    r !== 0 && ((t = r), (n = hl(e, r)))
  }
  if (n === 1) throw ((n = Yr), sn(e, 0), $t(e, t), Pe(e, Y()), n)
  if (n === 6) throw Error(A(345))
  return (e.finishedWork = e.current.alternate), (e.finishedLanes = t), Yt(e, Ce, yt), Pe(e, Y()), null
}
function pa(e, t) {
  var n = F
  F |= 1
  try {
    return e(t)
  } finally {
    ;(F = n), F === 0 && ((Gn = Y() + 500), Ms && Gt())
  }
}
function mn(e) {
  zt !== null && zt.tag === 0 && !(F & 6) && Bn()
  var t = F
  F |= 1
  var n = Qe.transition,
    r = U
  try {
    if (((Qe.transition = null), (U = 1), e)) return e()
  } finally {
    ;(U = r), (Qe.transition = n), (F = t), !(F & 6) && Gt()
  }
}
function ma() {
  ;(ze = On.current), B(On)
}
function sn(e, t) {
  ;(e.finishedWork = null), (e.finishedLanes = 0)
  var n = e.timeoutHandle
  if ((n !== -1 && ((e.timeoutHandle = -1), ng(n)), ne !== null))
    for (n = ne.return; n !== null; ) {
      var r = n
      switch ((ea(r), r.tag)) {
        case 1:
          ;(r = r.type.childContextTypes), r != null && os()
          break
        case 3:
          Xn(), B(Me), B(ve), ia()
          break
        case 5:
          ra(r)
          break
        case 4:
          Xn()
          break
        case 13:
          B(X)
          break
        case 19:
          B(X)
          break
        case 10:
          Jl(r.type._context)
          break
        case 22:
        case 23:
          ma()
      }
      n = n.return
    }
  if (
    ((oe = e),
    (ne = e = Vt(e.current, null)),
    (fe = ze = t),
    (se = 0),
    (Yr = null),
    (da = Os = pn = 0),
    (Ce = Rr = null),
    it !== null)
  ) {
    for (t = 0; t < it.length; t++)
      if (((n = it[t]), (r = n.interleaved), r !== null)) {
        n.interleaved = null
        var i = r.next,
          s = n.pending
        if (s !== null) {
          var o = s.next
          ;(s.next = i), (r.next = o)
        }
        n.pending = r
      }
    it = null
  }
  return e
}
function xd(e, t) {
  do {
    var n = ne
    try {
      if ((Kl(), (Fi.current = ms), ps)) {
        for (var r = G.memoizedState; r !== null; ) {
          var i = r.queue
          i !== null && (i.pending = null), (r = r.next)
        }
        ps = !1
      }
      if (((hn = 0), (ae = ie = G = null), (Ir = !1), (Gr = 0), (fa.current = null), n === null || n.return === null)) {
        ;(se = 1), (Yr = t), (ne = null)
        break
      }
      e: {
        var s = e,
          o = n.return,
          l = n,
          a = t
        if (((t = fe), (l.flags |= 32768), a !== null && typeof a == 'object' && typeof a.then == 'function')) {
          var u = a,
            c = l,
            p = c.tag
          if (!(c.mode & 1) && (p === 0 || p === 11 || p === 15)) {
            var f = c.alternate
            f
              ? ((c.updateQueue = f.updateQueue), (c.memoizedState = f.memoizedState), (c.lanes = f.lanes))
              : ((c.updateQueue = null), (c.memoizedState = null))
          }
          var y = xu(o)
          if (y !== null) {
            ;(y.flags &= -257), _u(y, o, l, s, t), y.mode & 1 && Eu(s, u, t), (t = y), (a = u)
            var g = t.updateQueue
            if (g === null) {
              var w = new Set()
              w.add(a), (t.updateQueue = w)
            } else g.add(a)
            break e
          } else {
            if (!(t & 1)) {
              Eu(s, u, t), ga()
              break e
            }
            a = Error(A(426))
          }
        } else if (W && l.mode & 1) {
          var x = xu(o)
          if (x !== null) {
            !(x.flags & 65536) && (x.flags |= 256), _u(x, o, l, s, t), ta(a)
            break e
          }
        }
        ;(s = a), se !== 4 && (se = 2), Rr === null ? (Rr = [s]) : Rr.push(s), (a = ca(a, l)), (l = o)
        do {
          switch (l.tag) {
            case 3:
              ;(l.flags |= 65536), (t &= -t), (l.lanes |= t)
              var h = id(l, a, t)
              du(l, h)
              break e
            case 1:
              s = a
              var d = l.type,
                v = l.stateNode
              if (
                !(l.flags & 128) &&
                (typeof d.getDerivedStateFromError == 'function' ||
                  (v !== null && typeof v.componentDidCatch == 'function' && (Ht === null || !Ht.has(v))))
              ) {
                ;(l.flags |= 65536), (t &= -t), (l.lanes |= t)
                var S = sd(l, s, t)
                du(l, S)
                break e
              }
          }
          l = l.return
        } while (l !== null)
      }
      Td(n)
    } catch (T) {
      ;(t = T), ne === n && n !== null && (ne = n = n.return)
      continue
    }
    break
  } while (1)
}
function _d() {
  var e = gs.current
  return (gs.current = ms), e === null ? ms : e
}
function ga() {
  ;(se === 0 || se === 3 || se === 2) && (se = 4), oe === null || (!(pn & 268435455) && !(Os & 268435455)) || $t(oe, fe)
}
function ws(e, t) {
  var n = F
  F |= 2
  var r = _d()
  ;(oe !== e || fe !== t) && ((yt = null), sn(e, t))
  do
    try {
      Ng()
      break
    } catch (i) {
      xd(e, i)
    }
  while (1)
  if ((Kl(), (F = n), (gs.current = r), ne !== null)) throw Error(A(261))
  return (oe = null), (fe = 0), se
}
function Ng() {
  for (; ne !== null; ) kd(ne)
}
function Cg() {
  for (; ne !== null && !Zp(); ) kd(ne)
}
function kd(e) {
  var t = Cd(e.alternate, e, ze)
  ;(e.memoizedProps = e.pendingProps), t === null ? Td(e) : (ne = t), (fa.current = null)
}
function Td(e) {
  var t = e
  do {
    var n = t.alternate
    if (((e = t.return), t.flags & 32768)) {
      if (((n = Sg(n, t)), n !== null)) {
        ;(n.flags &= 32767), (ne = n)
        return
      }
      if (e !== null) (e.flags |= 32768), (e.subtreeFlags = 0), (e.deletions = null)
      else {
        ;(se = 6), (ne = null)
        return
      }
    } else if (((n = vg(n, t, ze)), n !== null)) {
      ne = n
      return
    }
    if (((t = t.sibling), t !== null)) {
      ne = t
      return
    }
    ne = t = e
  } while (t !== null)
  se === 0 && (se = 5)
}
function Yt(e, t, n) {
  var r = U,
    i = Qe.transition
  try {
    ;(Qe.transition = null), (U = 1), Ag(e, t, n, r)
  } finally {
    ;(Qe.transition = i), (U = r)
  }
  return null
}
function Ag(e, t, n, r) {
  do Bn()
  while (zt !== null)
  if (F & 6) throw Error(A(327))
  n = e.finishedWork
  var i = e.finishedLanes
  if (n === null) return null
  if (((e.finishedWork = null), (e.finishedLanes = 0), n === e.current)) throw Error(A(177))
  ;(e.callbackNode = null), (e.callbackPriority = 0)
  var s = n.lanes | n.childLanes
  if (
    (um(e, s),
    e === oe && ((ne = oe = null), (fe = 0)),
    (!(n.subtreeFlags & 2064) && !(n.flags & 2064)) ||
      Ci ||
      ((Ci = !0),
      Ad(es, function () {
        return Bn(), null
      })),
    (s = (n.flags & 15990) !== 0),
    n.subtreeFlags & 15990 || s)
  ) {
    ;(s = Qe.transition), (Qe.transition = null)
    var o = U
    U = 1
    var l = F
    ;(F |= 4),
      (fa.current = null),
      xg(e, n),
      yd(n, e),
      Gm(Vo),
      (ns = !!Wo),
      (Vo = Wo = null),
      (e.current = n),
      _g(n),
      em(),
      (F = l),
      (U = o),
      (Qe.transition = s)
  } else e.current = n
  if (
    (Ci && ((Ci = !1), (zt = e), (ys = i)),
    (s = e.pendingLanes),
    s === 0 && (Ht = null),
    rm(n.stateNode),
    Pe(e, Y()),
    t !== null)
  )
    for (r = e.onRecoverableError, n = 0; n < t.length; n++) r(t[n])
  if (vs) throw ((vs = !1), (e = fl), (fl = null), e)
  return (
    ys & 1 && e.tag !== 0 && Bn(),
    (s = e.pendingLanes),
    s & 1 ? (e === dl ? Pr++ : ((Pr = 0), (dl = e))) : (Pr = 0),
    Gt(),
    null
  )
}
function Bn() {
  if (zt !== null) {
    var e = sf(ys),
      t = Qe.transition,
      n = U
    try {
      if (((Qe.transition = null), (U = 16 > e ? 16 : e), zt === null)) var r = !1
      else {
        if (((e = zt), (zt = null), (ys = 0), F & 6)) throw Error(A(331))
        var i = F
        for (F |= 4, R = e.current; R !== null; ) {
          var s = R,
            o = s.child
          if (R.flags & 16) {
            var l = s.deletions
            if (l !== null) {
              for (var a = 0; a < l.length; a++) {
                var u = l[a]
                for (R = u; R !== null; ) {
                  var c = R
                  switch (c.tag) {
                    case 0:
                    case 11:
                    case 15:
                      Mr(8, c, s)
                  }
                  var p = c.child
                  if (p !== null) (p.return = c), (R = p)
                  else
                    for (; R !== null; ) {
                      c = R
                      var f = c.sibling,
                        y = c.return
                      if ((md(c), c === u)) {
                        R = null
                        break
                      }
                      if (f !== null) {
                        ;(f.return = y), (R = f)
                        break
                      }
                      R = y
                    }
                }
              }
              var g = s.alternate
              if (g !== null) {
                var w = g.child
                if (w !== null) {
                  g.child = null
                  do {
                    var x = w.sibling
                    ;(w.sibling = null), (w = x)
                  } while (w !== null)
                }
              }
              R = s
            }
          }
          if (s.subtreeFlags & 2064 && o !== null) (o.return = s), (R = o)
          else
            e: for (; R !== null; ) {
              if (((s = R), s.flags & 2048))
                switch (s.tag) {
                  case 0:
                  case 11:
                  case 15:
                    Mr(9, s, s.return)
                }
              var h = s.sibling
              if (h !== null) {
                ;(h.return = s.return), (R = h)
                break e
              }
              R = s.return
            }
        }
        var d = e.current
        for (R = d; R !== null; ) {
          o = R
          var v = o.child
          if (o.subtreeFlags & 2064 && v !== null) (v.return = o), (R = v)
          else
            e: for (o = d; R !== null; ) {
              if (((l = R), l.flags & 2048))
                try {
                  switch (l.tag) {
                    case 0:
                    case 11:
                    case 15:
                      $s(9, l)
                  }
                } catch (T) {
                  J(l, l.return, T)
                }
              if (l === o) {
                R = null
                break e
              }
              var S = l.sibling
              if (S !== null) {
                ;(S.return = l.return), (R = S)
                break e
              }
              R = l.return
            }
        }
        if (((F = i), Gt(), dt && typeof dt.onPostCommitFiberRoot == 'function'))
          try {
            dt.onPostCommitFiberRoot(Cs, e)
          } catch {}
        r = !0
      }
      return r
    } finally {
      ;(U = n), (Qe.transition = t)
    }
  }
  return !1
}
function Fu(e, t, n) {
  ;(t = ca(n, t)), (t = id(e, t, 1)), jt(e, t), (t = Ee()), (e = zs(e, 1)), e !== null && (ri(e, 1, t), Pe(e, t))
}
function J(e, t, n) {
  if (e.tag === 3) Fu(e, e, n)
  else
    for (; t !== null; ) {
      if (t.tag === 3) {
        Fu(t, e, n)
        break
      } else if (t.tag === 1) {
        var r = t.stateNode
        if (
          typeof t.type.getDerivedStateFromError == 'function' ||
          (typeof r.componentDidCatch == 'function' && (Ht === null || !Ht.has(r)))
        ) {
          ;(e = ca(n, e)),
            (e = sd(t, e, 1)),
            jt(t, e),
            (e = Ee()),
            (t = zs(t, 1)),
            t !== null && (ri(t, 1, e), Pe(t, e))
          break
        }
      }
      t = t.return
    }
}
function Lg(e, t, n) {
  var r = e.pingCache
  r !== null && r.delete(t),
    (t = Ee()),
    (e.pingedLanes |= e.suspendedLanes & n),
    oe === e &&
      (fe & n) === n &&
      (se === 4 || (se === 3 && (fe & 130023424) === fe && 500 > Y() - ha) ? sn(e, 0) : (da |= n)),
    Pe(e, t)
}
function Nd(e, t) {
  t === 0 && (e.mode & 1 ? ((t = gi), (gi <<= 1), !(gi & 130023424) && (gi = 4194304)) : (t = 1))
  var n = Ee()
  ;(e = zs(e, t)), e !== null && (ri(e, t, n), Pe(e, n))
}
function bg(e) {
  var t = e.memoizedState,
    n = 0
  t !== null && (n = t.retryLane), Nd(e, n)
}
function Ig(e, t) {
  var n = 0
  switch (e.tag) {
    case 13:
      var r = e.stateNode,
        i = e.memoizedState
      i !== null && (n = i.retryLane)
      break
    case 19:
      r = e.stateNode
      break
    default:
      throw Error(A(314))
  }
  r !== null && r.delete(t), Nd(e, n)
}
var Cd
Cd = function (e, t, n) {
  if (e !== null)
    if (e.memoizedProps !== t.pendingProps || Me.current) Le = !0
    else {
      if (!(e.lanes & n) && !(t.flags & 128)) return (Le = !1), wg(e, t, n)
      Le = !!(e.flags & 131072)
    }
  else (Le = !1), W && t.flags & 1048576 && Pf(t, ds, t.index)
  switch (((t.lanes = 0), t.tag)) {
    case 2:
      var r = t.type
      e !== null && ((e.alternate = null), (t.alternate = null), (t.flags |= 2)), (e = t.pendingProps)
      var i = Wn(t, ve.current)
      Hn(t, n), (i = oa(null, t, r, e, i, n))
      var s = la()
      return (
        (t.flags |= 1),
        typeof i == 'object' && i !== null && typeof i.render == 'function' && i.$$typeof === void 0
          ? ((t.tag = 1),
            (t.memoizedState = null),
            (t.updateQueue = null),
            Re(r) ? ((s = !0), ls(t)) : (s = !1),
            (t.memoizedState = i.state !== null && i.state !== void 0 ? i.state : null),
            Yl(t),
            (i.updater = Rs),
            (t.stateNode = i),
            (i._reactInternals = t),
            Zo(t, r, e, n),
            (t = sl(null, t, r, !0, s, n)))
          : ((t.tag = 0), W && s && Zl(t), ye(null, t, i, n), (t = t.child)),
        t
      )
    case 16:
      r = t.elementType
      e: {
        switch (
          (e !== null && ((e.alternate = null), (t.alternate = null), (t.flags |= 2)),
          (e = t.pendingProps),
          (i = r._init),
          (r = i(r._payload)),
          (t.type = r),
          (i = t.tag = Rg(r)),
          (e = tt(r, e)),
          i)
        ) {
          case 0:
            t = il(null, t, r, e, n)
            break e
          case 1:
            t = Nu(null, t, r, e, n)
            break e
          case 11:
            t = ku(null, t, r, e, n)
            break e
          case 14:
            t = Tu(null, t, r, tt(r.type, e), n)
            break e
        }
        throw Error(A(306, r, ''))
      }
      return t
    case 0:
      return (r = t.type), (i = t.pendingProps), (i = t.elementType === r ? i : tt(r, i)), il(e, t, r, i, n)
    case 1:
      return (r = t.type), (i = t.pendingProps), (i = t.elementType === r ? i : tt(r, i)), Nu(e, t, r, i, n)
    case 3:
      e: {
        if ((dd(t), e === null)) throw Error(A(387))
        ;(r = t.pendingProps), (s = t.memoizedState), (i = s.element), If(e, t), cs(t, r, null, n)
        var o = t.memoizedState
        if (((r = o.element), s.isDehydrated))
          if (
            ((s = {
              element: r,
              isDehydrated: !1,
              cache: o.cache,
              pendingSuspenseBoundaries: o.pendingSuspenseBoundaries,
              transitions: o.transitions,
            }),
            (t.updateQueue.baseState = s),
            (t.memoizedState = s),
            t.flags & 256)
          ) {
            ;(i = Error(A(423))), (t = Cu(e, t, r, n, i))
            break e
          } else if (r !== i) {
            ;(i = Error(A(424))), (t = Cu(e, t, r, n, i))
            break e
          } else
            for (
              Ae = St(t.stateNode.containerInfo.firstChild),
                Fe = t,
                W = !0,
                rt = null,
                n = zf(t, null, r, n),
                t.child = n;
              n;

            )
              (n.flags = (n.flags & -3) | 4096), (n = n.sibling)
        else {
          if ((Vn(), r === i)) {
            t = Ct(e, t, n)
            break e
          }
          ye(e, t, r, n)
        }
        t = t.child
      }
      return t
    case 5:
      return (
        Df(t),
        e === null && tl(t),
        (r = t.type),
        (i = t.pendingProps),
        (s = e !== null ? e.memoizedProps : null),
        (o = i.children),
        Qo(r, i) ? (o = null) : s !== null && Qo(r, s) && (t.flags |= 32),
        fd(e, t),
        ye(e, t, o, n),
        t.child
      )
    case 6:
      return e === null && tl(t), null
    case 13:
      return hd(e, t, n)
    case 4:
      return (
        na(t, t.stateNode.containerInfo),
        (r = t.pendingProps),
        e === null ? (t.child = Qn(t, null, r, n)) : ye(e, t, r, n),
        t.child
      )
    case 11:
      return (r = t.type), (i = t.pendingProps), (i = t.elementType === r ? i : tt(r, i)), ku(e, t, r, i, n)
    case 7:
      return ye(e, t, t.pendingProps, n), t.child
    case 8:
      return ye(e, t, t.pendingProps.children, n), t.child
    case 12:
      return ye(e, t, t.pendingProps.children, n), t.child
    case 10:
      e: {
        if (
          ((r = t.type._context),
          (i = t.pendingProps),
          (s = t.memoizedProps),
          (o = i.value),
          j(as, r._currentValue),
          (r._currentValue = o),
          s !== null)
        )
          if (ot(s.value, o)) {
            if (s.children === i.children && !Me.current) {
              t = Ct(e, t, n)
              break e
            }
          } else
            for (s = t.child, s !== null && (s.return = t); s !== null; ) {
              var l = s.dependencies
              if (l !== null) {
                o = s.child
                for (var a = l.firstContext; a !== null; ) {
                  if (a.context === r) {
                    if (s.tag === 1) {
                      ;(a = _t(-1, n & -n)), (a.tag = 2)
                      var u = s.updateQueue
                      if (u !== null) {
                        u = u.shared
                        var c = u.pending
                        c === null ? (a.next = a) : ((a.next = c.next), (c.next = a)), (u.pending = a)
                      }
                    }
                    ;(s.lanes |= n), (a = s.alternate), a !== null && (a.lanes |= n), Jo(s.return, n, t), (l.lanes |= n)
                    break
                  }
                  a = a.next
                }
              } else if (s.tag === 10) o = s.type === t.type ? null : s.child
              else if (s.tag === 18) {
                if (((o = s.return), o === null)) throw Error(A(341))
                ;(o.lanes |= n), (l = o.alternate), l !== null && (l.lanes |= n), Jo(o, n, t), (o = s.sibling)
              } else o = s.child
              if (o !== null) o.return = s
              else
                for (o = s; o !== null; ) {
                  if (o === t) {
                    o = null
                    break
                  }
                  if (((s = o.sibling), s !== null)) {
                    ;(s.return = o.return), (o = s)
                    break
                  }
                  o = o.return
                }
              s = o
            }
        ye(e, t, i.children, n), (t = t.child)
      }
      return t
    case 9:
      return (
        (i = t.type),
        (r = t.pendingProps.children),
        Hn(t, n),
        (i = Ge(i)),
        (r = r(i)),
        (t.flags |= 1),
        ye(e, t, r, n),
        t.child
      )
    case 14:
      return (r = t.type), (i = tt(r, t.pendingProps)), (i = tt(r.type, i)), Tu(e, t, r, i, n)
    case 15:
      return ud(e, t, t.type, t.pendingProps, n)
    case 17:
      return (
        (r = t.type),
        (i = t.pendingProps),
        (i = t.elementType === r ? i : tt(r, i)),
        e !== null && ((e.alternate = null), (t.alternate = null), (t.flags |= 2)),
        (t.tag = 1),
        Re(r) ? ((e = !0), ls(t)) : (e = !1),
        Hn(t, n),
        Rf(t, r, i),
        Zo(t, r, i, n),
        sl(null, t, r, !0, e, n)
      )
    case 19:
      return pd(e, t, n)
    case 22:
      return cd(e, t, n)
  }
  throw Error(A(156, t.tag))
}
function Ad(e, t) {
  return ef(e, t)
}
function Mg(e, t, n, r) {
  ;(this.tag = e),
    (this.key = n),
    (this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null),
    (this.index = 0),
    (this.ref = null),
    (this.pendingProps = t),
    (this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null),
    (this.mode = r),
    (this.subtreeFlags = this.flags = 0),
    (this.deletions = null),
    (this.childLanes = this.lanes = 0),
    (this.alternate = null)
}
function Ve(e, t, n, r) {
  return new Mg(e, t, n, r)
}
function va(e) {
  return (e = e.prototype), !(!e || !e.isReactComponent)
}
function Rg(e) {
  if (typeof e == 'function') return va(e) ? 1 : 0
  if (e != null) {
    if (((e = e.$$typeof), e === zl)) return 11
    if (e === Dl) return 14
  }
  return 2
}
function Vt(e, t) {
  var n = e.alternate
  return (
    n === null
      ? ((n = Ve(e.tag, t, e.key, e.mode)),
        (n.elementType = e.elementType),
        (n.type = e.type),
        (n.stateNode = e.stateNode),
        (n.alternate = e),
        (e.alternate = n))
      : ((n.pendingProps = t), (n.type = e.type), (n.flags = 0), (n.subtreeFlags = 0), (n.deletions = null)),
    (n.flags = e.flags & 14680064),
    (n.childLanes = e.childLanes),
    (n.lanes = e.lanes),
    (n.child = e.child),
    (n.memoizedProps = e.memoizedProps),
    (n.memoizedState = e.memoizedState),
    (n.updateQueue = e.updateQueue),
    (t = e.dependencies),
    (n.dependencies = t === null ? null : { lanes: t.lanes, firstContext: t.firstContext }),
    (n.sibling = e.sibling),
    (n.index = e.index),
    (n.ref = e.ref),
    n
  )
}
function Bi(e, t, n, r, i, s) {
  var o = 2
  if (((r = e), typeof e == 'function')) va(e) && (o = 1)
  else if (typeof e == 'string') o = 5
  else
    e: switch (e) {
      case Nn:
        return on(n.children, i, s, t)
      case Ol:
        ;(o = 8), (i |= 8)
        break
      case To:
        return (e = Ve(12, n, t, i | 2)), (e.elementType = To), (e.lanes = s), e
      case No:
        return (e = Ve(13, n, t, i)), (e.elementType = No), (e.lanes = s), e
      case Co:
        return (e = Ve(19, n, t, i)), (e.elementType = Co), (e.lanes = s), e
      case zc:
        return Ss(n, i, s, t)
      default:
        if (typeof e == 'object' && e !== null)
          switch (e.$$typeof) {
            case $c:
              o = 10
              break e
            case Oc:
              o = 9
              break e
            case zl:
              o = 11
              break e
            case Dl:
              o = 14
              break e
            case It:
              ;(o = 16), (r = null)
              break e
          }
        throw Error(A(130, e == null ? e : typeof e, ''))
    }
  return (t = Ve(o, n, t, i)), (t.elementType = e), (t.type = r), (t.lanes = s), t
}
function on(e, t, n, r) {
  return (e = Ve(7, e, r, t)), (e.lanes = n), e
}
function Ss(e, t, n, r) {
  return (e = Ve(22, e, r, t)), (e.elementType = zc), (e.lanes = n), (e.stateNode = {}), e
}
function vo(e, t, n) {
  return (e = Ve(6, e, null, t)), (e.lanes = n), e
}
function yo(e, t, n) {
  return (
    (t = Ve(4, e.children !== null ? e.children : [], e.key, t)),
    (t.lanes = n),
    (t.stateNode = { containerInfo: e.containerInfo, pendingChildren: null, implementation: e.implementation }),
    t
  )
}
function Pg(e, t, n, r, i) {
  ;(this.tag = t),
    (this.containerInfo = e),
    (this.finishedWork = this.pingCache = this.current = this.pendingChildren = null),
    (this.timeoutHandle = -1),
    (this.callbackNode = this.pendingContext = this.context = null),
    (this.callbackPriority = 0),
    (this.eventTimes = Ys(0)),
    (this.expirationTimes = Ys(-1)),
    (this.entangledLanes =
      this.finishedLanes =
      this.mutableReadLanes =
      this.expiredLanes =
      this.pingedLanes =
      this.suspendedLanes =
      this.pendingLanes =
        0),
    (this.entanglements = Ys(0)),
    (this.identifierPrefix = r),
    (this.onRecoverableError = i),
    (this.mutableSourceEagerHydrationData = null)
}
function ya(e, t, n, r, i, s, o, l, a) {
  return (
    (e = new Pg(e, t, n, l, a)),
    t === 1 ? ((t = 1), s === !0 && (t |= 8)) : (t = 0),
    (s = Ve(3, null, null, t)),
    (e.current = s),
    (s.stateNode = e),
    (s.memoizedState = {
      element: r,
      isDehydrated: n,
      cache: null,
      transitions: null,
      pendingSuspenseBoundaries: null,
    }),
    Yl(s),
    e
  )
}
function $g(e, t, n) {
  var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null
  return { $$typeof: Tn, key: r == null ? null : '' + r, children: e, containerInfo: t, implementation: n }
}
function Ld(e) {
  if (!e) return Wt
  e = e._reactInternals
  e: {
    if (yn(e) !== e || e.tag !== 1) throw Error(A(170))
    var t = e
    do {
      switch (t.tag) {
        case 3:
          t = t.stateNode.context
          break e
        case 1:
          if (Re(t.type)) {
            t = t.stateNode.__reactInternalMemoizedMergedChildContext
            break e
          }
      }
      t = t.return
    } while (t !== null)
    throw Error(A(171))
  }
  if (e.tag === 1) {
    var n = e.type
    if (Re(n)) return Lf(e, n, t)
  }
  return t
}
function bd(e, t, n, r, i, s, o, l, a) {
  return (
    (e = ya(n, r, !0, e, i, s, o, l, a)),
    (e.context = Ld(null)),
    (n = e.current),
    (r = Ee()),
    (i = Bt(n)),
    (s = _t(r, i)),
    (s.callback = t ?? null),
    jt(n, s),
    (e.current.lanes = i),
    ri(e, i, r),
    Pe(e, r),
    e
  )
}
function Ds(e, t, n, r) {
  var i = t.current,
    s = Ee(),
    o = Bt(i)
  return (
    (n = Ld(n)),
    t.context === null ? (t.context = n) : (t.pendingContext = n),
    (t = _t(s, o)),
    (t.payload = { element: e }),
    (r = r === void 0 ? null : r),
    r !== null && (t.callback = r),
    jt(i, t),
    (e = Xe(i, o, s)),
    e !== null && Di(e, i, o),
    o
  )
}
function Es(e) {
  if (((e = e.current), !e.child)) return null
  switch (e.child.tag) {
    case 5:
      return e.child.stateNode
    default:
      return e.child.stateNode
  }
}
function Uu(e, t) {
  if (((e = e.memoizedState), e !== null && e.dehydrated !== null)) {
    var n = e.retryLane
    e.retryLane = n !== 0 && n < t ? n : t
  }
}
function wa(e, t) {
  Uu(e, t), (e = e.alternate) && Uu(e, t)
}
function Og() {
  return null
}
var Id =
  typeof reportError == 'function'
    ? reportError
    : function (e) {
        console.error(e)
      }
function Sa(e) {
  this._internalRoot = e
}
Fs.prototype.render = Sa.prototype.render = function (e) {
  var t = this._internalRoot
  if (t === null) throw Error(A(409))
  Ds(e, t, null, null)
}
Fs.prototype.unmount = Sa.prototype.unmount = function () {
  var e = this._internalRoot
  if (e !== null) {
    this._internalRoot = null
    var t = e.containerInfo
    mn(function () {
      Ds(null, e, null, null)
    }),
      (t[Nt] = null)
  }
}
function Fs(e) {
  this._internalRoot = e
}
Fs.prototype.unstable_scheduleHydration = function (e) {
  if (e) {
    var t = af()
    e = { blockedOn: null, target: e, priority: t }
    for (var n = 0; n < Pt.length && t !== 0 && t < Pt[n].priority; n++);
    Pt.splice(n, 0, e), n === 0 && cf(e)
  }
}
function Ea(e) {
  return !(!e || (e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11))
}
function Us(e) {
  return !(
    !e ||
    (e.nodeType !== 1 &&
      e.nodeType !== 9 &&
      e.nodeType !== 11 &&
      (e.nodeType !== 8 || e.nodeValue !== ' react-mount-point-unstable '))
  )
}
function ju() {}
function zg(e, t, n, r, i) {
  if (i) {
    if (typeof r == 'function') {
      var s = r
      r = function () {
        var u = Es(o)
        s.call(u)
      }
    }
    var o = bd(t, r, e, 0, null, !1, !1, '', ju)
    return (e._reactRootContainer = o), (e[Nt] = o.current), qr(e.nodeType === 8 ? e.parentNode : e), mn(), o
  }
  for (; (i = e.lastChild); ) e.removeChild(i)
  if (typeof r == 'function') {
    var l = r
    r = function () {
      var u = Es(a)
      l.call(u)
    }
  }
  var a = ya(e, 0, !1, null, null, !1, !1, '', ju)
  return (
    (e._reactRootContainer = a),
    (e[Nt] = a.current),
    qr(e.nodeType === 8 ? e.parentNode : e),
    mn(function () {
      Ds(t, a, n, r)
    }),
    a
  )
}
function js(e, t, n, r, i) {
  var s = n._reactRootContainer
  if (s) {
    var o = s
    if (typeof i == 'function') {
      var l = i
      i = function () {
        var a = Es(o)
        l.call(a)
      }
    }
    Ds(t, o, e, i)
  } else o = zg(n, t, e, i, r)
  return Es(o)
}
of = function (e) {
  switch (e.tag) {
    case 3:
      var t = e.stateNode
      if (t.current.memoizedState.isDehydrated) {
        var n = xr(t.pendingLanes)
        n !== 0 && (jl(t, n | 1), Pe(t, Y()), !(F & 6) && ((Gn = Y() + 500), Gt()))
      }
      break
    case 13:
      var r = Ee()
      mn(function () {
        return Xe(e, 1, r)
      }),
        wa(e, 1)
  }
}
Hl = function (e) {
  if (e.tag === 13) {
    var t = Ee()
    Xe(e, 134217728, t), wa(e, 134217728)
  }
}
lf = function (e) {
  if (e.tag === 13) {
    var t = Ee(),
      n = Bt(e)
    Xe(e, n, t), wa(e, n)
  }
}
af = function () {
  return U
}
uf = function (e, t) {
  var n = U
  try {
    return (U = e), t()
  } finally {
    U = n
  }
}
zo = function (e, t, n) {
  switch (t) {
    case 'input':
      if ((bo(e, n), (t = n.name), n.type === 'radio' && t != null)) {
        for (n = e; n.parentNode; ) n = n.parentNode
        for (
          n = n.querySelectorAll('input[name=' + JSON.stringify('' + t) + '][type="radio"]'), t = 0;
          t < n.length;
          t++
        ) {
          var r = n[t]
          if (r !== e && r.form === e.form) {
            var i = Is(r)
            if (!i) throw Error(A(90))
            Fc(r), bo(r, i)
          }
        }
      }
      break
    case 'textarea':
      jc(e, n)
      break
    case 'select':
      ;(t = n.value), t != null && Dn(e, !!n.multiple, t, !1)
  }
}
Xc = pa
Gc = mn
var Dg = { usingClientEntryPoint: !1, Events: [si, bn, Is, Vc, Qc, pa] },
  hr = { findFiberByHostInstance: tn, bundleType: 0, version: '18.1.0', rendererPackageName: 'react-dom' },
  Fg = {
    bundleType: hr.bundleType,
    version: hr.version,
    rendererPackageName: hr.rendererPackageName,
    rendererConfig: hr.rendererConfig,
    overrideHookState: null,
    overrideHookStateDeletePath: null,
    overrideHookStateRenamePath: null,
    overrideProps: null,
    overridePropsDeletePath: null,
    overridePropsRenamePath: null,
    setErrorHandler: null,
    setSuspenseHandler: null,
    scheduleUpdate: null,
    currentDispatcherRef: At.ReactCurrentDispatcher,
    findHostInstanceByFiber: function (e) {
      return (e = Yc(e)), e === null ? null : e.stateNode
    },
    findFiberByHostInstance: hr.findFiberByHostInstance || Og,
    findHostInstancesForRefresh: null,
    scheduleRefresh: null,
    scheduleRoot: null,
    setRefreshHandler: null,
    getCurrentFiber: null,
    reconcilerVersion: '18.1.0-next-22edb9f77-20220426',
  }
if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < 'u') {
  var Ai = __REACT_DEVTOOLS_GLOBAL_HOOK__
  if (!Ai.isDisabled && Ai.supportsFiber)
    try {
      ;(Cs = Ai.inject(Fg)), (dt = Ai)
    } catch {}
}
je.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Dg
je.createPortal = function (e, t) {
  var n = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null
  if (!Ea(t)) throw Error(A(200))
  return $g(e, t, null, n)
}
je.createRoot = function (e, t) {
  if (!Ea(e)) throw Error(A(299))
  var n = !1,
    r = '',
    i = Id
  return (
    t != null &&
      (t.unstable_strictMode === !0 && (n = !0),
      t.identifierPrefix !== void 0 && (r = t.identifierPrefix),
      t.onRecoverableError !== void 0 && (i = t.onRecoverableError)),
    (t = ya(e, 1, !1, null, null, n, !1, r, i)),
    (e[Nt] = t.current),
    qr(e.nodeType === 8 ? e.parentNode : e),
    new Sa(t)
  )
}
je.findDOMNode = function (e) {
  if (e == null) return null
  if (e.nodeType === 1) return e
  var t = e._reactInternals
  if (t === void 0)
    throw typeof e.render == 'function' ? Error(A(188)) : ((e = Object.keys(e).join(',')), Error(A(268, e)))
  return (e = Yc(t)), (e = e === null ? null : e.stateNode), e
}
je.flushSync = function (e) {
  return mn(e)
}
je.hydrate = function (e, t, n) {
  if (!Us(t)) throw Error(A(200))
  return js(null, e, t, !0, n)
}
je.hydrateRoot = function (e, t, n) {
  if (!Ea(e)) throw Error(A(405))
  var r = (n != null && n.hydratedSources) || null,
    i = !1,
    s = '',
    o = Id
  if (
    (n != null &&
      (n.unstable_strictMode === !0 && (i = !0),
      n.identifierPrefix !== void 0 && (s = n.identifierPrefix),
      n.onRecoverableError !== void 0 && (o = n.onRecoverableError)),
    (t = bd(t, null, e, 1, n ?? null, i, !1, s, o)),
    (e[Nt] = t.current),
    qr(e),
    r)
  )
    for (e = 0; e < r.length; e++)
      (n = r[e]),
        (i = n._getVersion),
        (i = i(n._source)),
        t.mutableSourceEagerHydrationData == null
          ? (t.mutableSourceEagerHydrationData = [n, i])
          : t.mutableSourceEagerHydrationData.push(n, i)
  return new Fs(t)
}
je.render = function (e, t, n) {
  if (!Us(t)) throw Error(A(200))
  return js(null, e, t, !1, n)
}
je.unmountComponentAtNode = function (e) {
  if (!Us(e)) throw Error(A(40))
  return e._reactRootContainer
    ? (mn(function () {
        js(null, null, e, !1, function () {
          ;(e._reactRootContainer = null), (e[Nt] = null)
        })
      }),
      !0)
    : !1
}
je.unstable_batchedUpdates = pa
je.unstable_renderSubtreeIntoContainer = function (e, t, n, r) {
  if (!Us(n)) throw Error(A(200))
  if (e == null || e._reactInternals === void 0) throw Error(A(38))
  return js(e, t, n, !1, r)
}
je.version = '18.1.0-next-22edb9f77-20220426'
function Md() {
  if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > 'u' || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != 'function'))
    try {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(Md)
    } catch (e) {
      console.error(e)
    }
}
Md(), (bc.exports = je)
var lw = bc.exports
const ln = ({
    children: e,
    title: t = '',
    icon: n,
    disabled: r = !1,
    toggled: i = !1,
    onClick: s = () => {},
    style: o,
  }) => {
    let l = `toolbar-button ${n}`
    return (
      i && (l += ' toggled'),
      b('button', {
        className: l,
        onMouseDown: Hu,
        onClick: s,
        onDoubleClick: Hu,
        title: t,
        disabled: !!r,
        style: o,
        children: [n && m('span', { className: `codicon codicon-${n}`, style: e ? { marginRight: 5 } : {} }), e],
      })
    )
  },
  Hu = (e) => {
    e.stopPropagation(), e.preventDefault()
  },
  qi = Symbol('context'),
  Rd = Symbol('next'),
  Pd = Symbol('prev'),
  Bu = Symbol('events')
class aw {
  constructor(t) {
    le(this, 'startTime')
    le(this, 'endTime')
    le(this, 'browserName')
    le(this, 'channel')
    le(this, 'platform')
    le(this, 'wallTime')
    le(this, 'title')
    le(this, 'options')
    le(this, 'pages')
    le(this, 'actions')
    le(this, 'events')
    le(this, 'stdio')
    le(this, 'hasSource')
    le(this, 'sdkLanguage')
    le(this, 'testIdAttributeName')
    le(this, 'sources')
    le(this, 'resources')
    t.forEach((r) => Ug(r))
    const n = t.find((r) => r.isPrimary)
    ;(this.browserName = (n == null ? void 0 : n.browserName) || ''),
      (this.sdkLanguage = n == null ? void 0 : n.sdkLanguage),
      (this.channel = n == null ? void 0 : n.channel),
      (this.testIdAttributeName = n == null ? void 0 : n.testIdAttributeName),
      (this.platform = (n == null ? void 0 : n.platform) || ''),
      (this.title = (n == null ? void 0 : n.title) || ''),
      (this.options = (n == null ? void 0 : n.options) || {}),
      (this.wallTime = t.map((r) => r.wallTime).reduce((r, i) => Math.min(r || Number.MAX_VALUE, i), Number.MAX_VALUE)),
      (this.startTime = t.map((r) => r.startTime).reduce((r, i) => Math.min(r, i), Number.MAX_VALUE)),
      (this.endTime = t.map((r) => r.endTime).reduce((r, i) => Math.max(r, i), Number.MIN_VALUE)),
      (this.pages = [].concat(...t.map((r) => r.pages))),
      (this.actions = jg(t)),
      (this.events = [].concat(...t.map((r) => r.events))),
      (this.stdio = [].concat(...t.map((r) => r.stdio))),
      (this.hasSource = t.some((r) => r.hasSource)),
      (this.resources = [...t.map((r) => r.resources)].flat()),
      this.events.sort((r, i) => r.time - i.time),
      this.resources.sort((r, i) => r._monotonicTime - i._monotonicTime),
      (this.sources = Qg(this.actions))
  }
  failedAction() {
    return this.actions.findLast((t) => t.error)
  }
}
function Ug(e) {
  for (const n of e.pages) n[qi] = e
  for (let n = 0; n < e.actions.length; ++n) {
    const r = e.actions[n]
    r[qi] = e
  }
  let t
  for (let n = e.actions.length - 1; n >= 0; n--) {
    const r = e.actions[n]
    ;(r[Rd] = t), r.apiName.includes('route.') || (t = r)
  }
  for (const n of e.events) n[qi] = e
}
function jg(e) {
  const t = new Map()
  let n = 0
  const r = e.filter((l) => l.isPrimary),
    i = e.filter((l) => !l.isPrimary)
  for (const l of r) {
    for (const a of l.actions) t.set(`${a.apiName}@${a.wallTime}`, { ...a, context: l })
    !n && l.actions.length && (n = l.actions[0].startTime - l.actions[0].wallTime)
  }
  const s = new Map()
  for (const l of i)
    for (const a of l.actions) {
      if (n) {
        const p = a.endTime - a.startTime
        a.startTime && (a.startTime = a.wallTime + n), a.endTime && (a.endTime = a.startTime + p)
      }
      const u = `${a.apiName}@${a.wallTime}`,
        c = t.get(u)
      if (c && c.apiName === a.apiName) {
        s.set(a.callId, c.callId),
          a.error && (c.error = a.error),
          a.attachments && (c.attachments = a.attachments),
          a.parentId && (c.parentId = s.get(a.parentId) ?? a.parentId)
        continue
      }
      a.parentId && (a.parentId = s.get(a.parentId) ?? a.parentId), t.set(u, { ...a, context: l })
    }
  const o = [...t.values()]
  o.sort((l, a) =>
    a.parentId === l.callId ? -1 : l.parentId === a.callId ? 1 : l.wallTime - a.wallTime || l.startTime - a.startTime,
  )
  for (let l = 1; l < o.length; ++l) o[l][Pd] = o[l - 1]
  return o
}
function Hg(e) {
  const t = new Map()
  for (const r of e) t.set(r.callId, { id: r.callId, parent: void 0, children: [], action: r })
  const n = { id: '', parent: void 0, children: [] }
  for (const r of t.values()) {
    const i = (r.action.parentId && t.get(r.action.parentId)) || n
    i.children.push(r), (r.parent = i)
  }
  return { rootItem: n, itemMap: t }
}
function uw(e) {
  return `${e.pageId || 'none'}:${e.callId}`
}
function an(e) {
  return e[qi]
}
function Bg(e) {
  return e[Rd]
}
function qg(e) {
  return e[Pd]
}
function Wg(e) {
  var i
  let t = 0,
    n = 0
  const r = an(e)
  for (const s of Vg(e)) {
    if (s.method === 'console') {
      const { guid: o } = s.params.message,
        l = (i = r.initializers[o]) == null ? void 0 : i.type
      l === 'warning' ? ++n : l === 'error' && ++t
    }
    s.method === 'pageError' && ++t
  }
  return { errors: t, warnings: n }
}
function Vg(e) {
  let t = e[Bu]
  if (t) return t
  const n = Bg(e)
  return (t = an(e).events.filter((r) => r.time >= e.startTime && (!n || r.time < n.startTime))), (e[Bu] = t), t
}
function Qg(e) {
  var n, r
  const t = new Map()
  for (const i of e) {
    for (const s of i.stack || []) {
      let o = t.get(s.file)
      o || ((o = { errors: [], content: void 0 }), t.set(s.file, o))
    }
    i.error &&
      (n = i.stack) != null &&
      n[0] &&
      t
        .get(i.stack[0].file)
        .errors.push({ line: ((r = i.stack) == null ? void 0 : r[0].line) || 0, message: i.error.message })
  }
  return t
}
const Xg = 50,
  ml = ({
    sidebarSize: e,
    sidebarHidden: t = !1,
    sidebarIsFirst: n = !1,
    orientation: r = 'vertical',
    minSidebarSize: i = Xg,
    settingName: s,
    children: o,
  }) => {
    const [l, a] = Ki(s ? s + '.' + r + ':size' : void 0, Math.max(i, e) * window.devicePixelRatio),
      [u, c] = Ki(s ? s + '.' + r + ':size' : void 0, Math.max(i, e) * window.devicePixelRatio),
      [p, f] = L.useState(null),
      [y, g] = ni()
    let w
    r === 'vertical'
      ? ((w = u / window.devicePixelRatio), y && y.height < w && (w = y.height - 10))
      : ((w = l / window.devicePixelRatio), y && y.width < w && (w = y.width - 10))
    const x = L.Children.toArray(o)
    document.body.style.userSelect = p ? 'none' : 'inherit'
    let h = {}
    return (
      r === 'vertical'
        ? n
          ? (h = { top: p ? 0 : w - 4, bottom: p ? 0 : void 0, height: p ? 'initial' : 8 })
          : (h = { bottom: p ? 0 : w - 4, top: p ? 0 : void 0, height: p ? 'initial' : 8 })
        : n
        ? (h = { left: p ? 0 : w - 4, right: p ? 0 : void 0, width: p ? 'initial' : 8 })
        : (h = { right: p ? 0 : w - 4, left: p ? 0 : void 0, width: p ? 'initial' : 8 }),
      b('div', {
        className: 'split-view ' + r + (n ? ' sidebar-first' : ''),
        ref: g,
        children: [
          m('div', { className: 'split-view-main', children: x[0] }),
          !t && m('div', { style: { flexBasis: w }, className: 'split-view-sidebar', children: x[1] }),
          !t &&
            m('div', {
              style: h,
              className: 'split-view-resizer',
              onMouseDown: (d) => f({ offset: r === 'vertical' ? d.clientY : d.clientX, size: w }),
              onMouseUp: () => f(null),
              onMouseMove: (d) => {
                if (!d.buttons) f(null)
                else if (p) {
                  const S = (r === 'vertical' ? d.clientY : d.clientX) - p.offset,
                    T = n ? p.size + S : p.size - S,
                    E = d.target.parentElement.getBoundingClientRect(),
                    _ = Math.min(Math.max(i, T), (r === 'vertical' ? E.height : E.width) - i)
                  r === 'vertical' ? c(_ * window.devicePixelRatio) : a(_ * window.devicePixelRatio)
                }
              },
            }),
        ],
      })
    )
  }
function Hs(e, t = "'") {
  const n = JSON.stringify(e),
    r = n.substring(1, n.length - 1).replace(/\\"/g, '"')
  if (t === "'") return t + r.replace(/[']/g, "\\'") + t
  if (t === '"') return t + r.replace(/["]/g, '\\"') + t
  if (t === '`') return t + r.replace(/[`]/g, '`') + t
  throw new Error('Invalid escape char')
}
function xs(e) {
  return e.charAt(0).toUpperCase() + e.substring(1)
}
function $d(e) {
  return e
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1_$2')
    .toLowerCase()
}
function We(e) {
  let t = ''
  for (let n = 0; n < e.length; n++) t += Gg(e, n)
  return t
}
function Gg(e, t) {
  const n = e.charCodeAt(t)
  return n === 0
    ? '�'
    : (n >= 1 && n <= 31) || (n >= 48 && n <= 57 && (t === 0 || (t === 1 && e.charCodeAt(0) === 45)))
    ? '\\' + n.toString(16) + ' '
    : t === 0 && n === 45 && e.length === 1
    ? '\\' + e.charAt(t)
    : n >= 128 || n === 45 || n === 95 || (n >= 48 && n <= 57) || (n >= 65 && n <= 90) || (n >= 97 && n <= 122)
    ? e.charAt(t)
    : '\\' + e.charAt(t)
}
function be(e) {
  return e
    .replace(/\u200b/g, '')
    .trim()
    .replace(/\s+/g, ' ')
}
function Bs(e) {
  return e.replace(/(^|[^\\])(\\\\)*\\(['"`])/g, '$1$2$3')
}
function Od(e) {
  return String(e)
    .replace(/(^|[^\\])(\\\\)*(["'`])/g, '$1$2\\$3')
    .replace(/>>/g, '\\>\\>')
}
function pt(e, t) {
  return typeof e != 'string' ? Od(e) : `${JSON.stringify(e)}${t ? 's' : 'i'}`
}
function we(e, t) {
  return typeof e != 'string' ? Od(e) : `"${e.replace(/\\/g, '\\\\').replace(/["]/g, '\\"')}"${t ? 's' : 'i'}`
}
const te = function (e, t, n) {
  return e >= t && e <= n
}
function Ne(e) {
  return te(e, 48, 57)
}
function qu(e) {
  return Ne(e) || te(e, 65, 70) || te(e, 97, 102)
}
function Kg(e) {
  return te(e, 65, 90)
}
function Jg(e) {
  return te(e, 97, 122)
}
function Yg(e) {
  return Kg(e) || Jg(e)
}
function Zg(e) {
  return e >= 128
}
function Wi(e) {
  return Yg(e) || Zg(e) || e === 95
}
function Wu(e) {
  return Wi(e) || Ne(e) || e === 45
}
function ev(e) {
  return te(e, 0, 8) || e === 11 || te(e, 14, 31) || e === 127
}
function Vi(e) {
  return e === 10
}
function vt(e) {
  return Vi(e) || e === 9 || e === 32
}
const tv = 1114111
class xa extends Error {
  constructor(t) {
    super(t), (this.name = 'InvalidCharacterError')
  }
}
function nv(e) {
  const t = []
  for (let n = 0; n < e.length; n++) {
    let r = e.charCodeAt(n)
    if (
      (r === 13 && e.charCodeAt(n + 1) === 10 && ((r = 10), n++),
      (r === 13 || r === 12) && (r = 10),
      r === 0 && (r = 65533),
      te(r, 55296, 56319) && te(e.charCodeAt(n + 1), 56320, 57343))
    ) {
      const i = r - 55296,
        s = e.charCodeAt(n + 1) - 56320
      ;(r = Math.pow(2, 16) + i * Math.pow(2, 10) + s), n++
    }
    t.push(r)
  }
  return t
}
function re(e) {
  if (e <= 65535) return String.fromCharCode(e)
  e -= Math.pow(2, 16)
  const t = Math.floor(e / Math.pow(2, 10)) + 55296,
    n = (e % Math.pow(2, 10)) + 56320
  return String.fromCharCode(t) + String.fromCharCode(n)
}
function rv(e) {
  const t = nv(e)
  let n = -1
  const r = []
  let i
  const s = function (k) {
      return k >= t.length ? -1 : t[k]
    },
    o = function (k) {
      if ((k === void 0 && (k = 1), k > 3)) throw 'Spec Error: no more than three codepoints of lookahead.'
      return s(n + k)
    },
    l = function (k) {
      return k === void 0 && (k = 1), (n += k), (i = s(n)), !0
    },
    a = function () {
      return (n -= 1), !0
    },
    u = function (k) {
      return k === void 0 && (k = i), k === -1
    },
    c = function () {
      if ((p(), l(), vt(i))) {
        for (; vt(o()); ) l()
        return new gl()
      } else {
        if (i === 34) return g()
        if (i === 35)
          if (Wu(o()) || h(o(1), o(2))) {
            const k = new Kd('')
            return v(o(1), o(2), o(3)) && (k.type = 'id'), (k.value = E()), k
          } else return new me(i)
        else
          return i === 36
            ? o() === 61
              ? (l(), new av())
              : new me(i)
            : i === 39
            ? g()
            : i === 40
            ? new iv()
            : i === 41
            ? new Vd()
            : i === 42
            ? o() === 61
              ? (l(), new uv())
              : new me(i)
            : i === 43
            ? C()
              ? (a(), f())
              : new me(i)
            : i === 44
            ? new Hd()
            : i === 45
            ? C()
              ? (a(), f())
              : o(1) === 45 && o(2) === 62
              ? (l(2), new Fd())
              : S()
              ? (a(), y())
              : new me(i)
            : i === 46
            ? C()
              ? (a(), f())
              : new me(i)
            : i === 58
            ? new Ud()
            : i === 59
            ? new jd()
            : i === 60
            ? o(1) === 33 && o(2) === 45 && o(3) === 45
              ? (l(3), new Dd())
              : new me(i)
            : i === 64
            ? v(o(1), o(2), o(3))
              ? new Gd(E())
              : new me(i)
            : i === 91
            ? new Wd()
            : i === 92
            ? d()
              ? (a(), y())
              : new me(i)
            : i === 93
            ? new vl()
            : i === 94
            ? o() === 61
              ? (l(), new lv())
              : new me(i)
            : i === 123
            ? new Bd()
            : i === 124
            ? o() === 61
              ? (l(), new ov())
              : o() === 124
              ? (l(), new Qd())
              : new me(i)
            : i === 125
            ? new qd()
            : i === 126
            ? o() === 61
              ? (l(), new sv())
              : new me(i)
            : Ne(i)
            ? (a(), f())
            : Wi(i)
            ? (a(), y())
            : u()
            ? new Xi()
            : new me(i)
      }
    },
    p = function () {
      for (; o(1) === 47 && o(2) === 42; )
        for (l(2); ; )
          if ((l(), i === 42 && o() === 47)) {
            l()
            break
          } else if (u()) return
    },
    f = function () {
      const k = _()
      if (v(o(1), o(2), o(3))) {
        const P = new cv()
        return (P.value = k.value), (P.repr = k.repr), (P.type = k.type), (P.unit = E()), P
      } else if (o() === 37) {
        l()
        const P = new eh()
        return (P.value = k.value), (P.repr = k.repr), P
      } else {
        const P = new Zd()
        return (P.value = k.value), (P.repr = k.repr), (P.type = k.type), P
      }
    },
    y = function () {
      const k = E()
      if (k.toLowerCase() === 'url' && o() === 40) {
        for (l(); vt(o(1)) && vt(o(2)); ) l()
        return o() === 34 || o() === 39 ? new Gi(k) : vt(o()) && (o(2) === 34 || o(2) === 39) ? new Gi(k) : w()
      } else return o() === 40 ? (l(), new Gi(k)) : new Xd(k)
    },
    g = function (k) {
      k === void 0 && (k = i)
      let P = ''
      for (; l(); ) {
        if (i === k || u()) return new Jd(P)
        if (Vi(i)) return a(), new zd()
        i === 92 ? u(o()) || (Vi(o()) ? l() : (P += re(x()))) : (P += re(i))
      }
      throw new Error('Internal error')
    },
    w = function () {
      const k = new Yd('')
      for (; vt(o()); ) l()
      if (u(o())) return k
      for (; l(); ) {
        if (i === 41 || u()) return k
        if (vt(i)) {
          for (; vt(o()); ) l()
          return o() === 41 || u(o()) ? (l(), k) : (I(), new Qi())
        } else {
          if (i === 34 || i === 39 || i === 40 || ev(i)) return I(), new Qi()
          if (i === 92)
            if (d()) k.value += re(x())
            else return I(), new Qi()
          else k.value += re(i)
        }
      }
      throw new Error('Internal error')
    },
    x = function () {
      if ((l(), qu(i))) {
        const k = [i]
        for (let q = 0; q < 5 && qu(o()); q++) l(), k.push(i)
        vt(o()) && l()
        let P = parseInt(
          k
            .map(function (q) {
              return String.fromCharCode(q)
            })
            .join(''),
          16,
        )
        return P > tv && (P = 65533), P
      } else return u() ? 65533 : i
    },
    h = function (k, P) {
      return !(k !== 92 || Vi(P))
    },
    d = function () {
      return h(i, o())
    },
    v = function (k, P, q) {
      return k === 45 ? Wi(P) || P === 45 || h(P, q) : Wi(k) ? !0 : k === 92 ? h(k, P) : !1
    },
    S = function () {
      return v(i, o(1), o(2))
    },
    T = function (k, P, q) {
      return k === 43 || k === 45 ? !!(Ne(P) || (P === 46 && Ne(q))) : k === 46 ? !!Ne(P) : !!Ne(k)
    },
    C = function () {
      return T(i, o(1), o(2))
    },
    E = function () {
      let k = ''
      for (; l(); )
        if (Wu(i)) k += re(i)
        else if (d()) k += re(x())
        else return a(), k
      throw new Error('Internal parse error')
    },
    _ = function () {
      let k = '',
        P = 'integer'
      for ((o() === 43 || o() === 45) && (l(), (k += re(i))); Ne(o()); ) l(), (k += re(i))
      if (o(1) === 46 && Ne(o(2))) for (l(), k += re(i), l(), k += re(i), P = 'number'; Ne(o()); ) l(), (k += re(i))
      const q = o(1),
        Oe = o(2),
        ke = o(3)
      if ((q === 69 || q === 101) && Ne(Oe))
        for (l(), k += re(i), l(), k += re(i), P = 'number'; Ne(o()); ) l(), (k += re(i))
      else if ((q === 69 || q === 101) && (Oe === 43 || Oe === 45) && Ne(ke))
        for (l(), k += re(i), l(), k += re(i), l(), k += re(i), P = 'number'; Ne(o()); ) l(), (k += re(i))
      const Te = N(k)
      return { type: P, value: Te, repr: k }
    },
    N = function (k) {
      return +k
    },
    I = function () {
      for (; l(); ) {
        if (i === 41 || u()) return
        d() && x()
      }
    }
  let O = 0
  for (; !u(o()); ) if ((r.push(c()), O++, O > t.length * 2)) throw new Error("I'm infinite-looping!")
  return r
}
class Z {
  constructor() {
    this.tokenType = ''
  }
  toJSON() {
    return { token: this.tokenType }
  }
  toString() {
    return this.tokenType
  }
  toSource() {
    return '' + this
  }
}
class zd extends Z {
  constructor() {
    super(...arguments), (this.tokenType = 'BADSTRING')
  }
}
class Qi extends Z {
  constructor() {
    super(...arguments), (this.tokenType = 'BADURL')
  }
}
class gl extends Z {
  constructor() {
    super(...arguments), (this.tokenType = 'WHITESPACE')
  }
  toString() {
    return 'WS'
  }
  toSource() {
    return ' '
  }
}
class Dd extends Z {
  constructor() {
    super(...arguments), (this.tokenType = 'CDO')
  }
  toSource() {
    return '<!--'
  }
}
class Fd extends Z {
  constructor() {
    super(...arguments), (this.tokenType = 'CDC')
  }
  toSource() {
    return '-->'
  }
}
class Ud extends Z {
  constructor() {
    super(...arguments), (this.tokenType = ':')
  }
}
class jd extends Z {
  constructor() {
    super(...arguments), (this.tokenType = ';')
  }
}
class Hd extends Z {
  constructor() {
    super(...arguments), (this.tokenType = ',')
  }
}
class er extends Z {
  constructor() {
    super(...arguments), (this.value = ''), (this.mirror = '')
  }
}
class Bd extends er {
  constructor() {
    super(), (this.tokenType = '{'), (this.value = '{'), (this.mirror = '}')
  }
}
class qd extends er {
  constructor() {
    super(), (this.tokenType = '}'), (this.value = '}'), (this.mirror = '{')
  }
}
class Wd extends er {
  constructor() {
    super(), (this.tokenType = '['), (this.value = '['), (this.mirror = ']')
  }
}
class vl extends er {
  constructor() {
    super(), (this.tokenType = ']'), (this.value = ']'), (this.mirror = '[')
  }
}
class iv extends er {
  constructor() {
    super(), (this.tokenType = '('), (this.value = '('), (this.mirror = ')')
  }
}
class Vd extends er {
  constructor() {
    super(), (this.tokenType = ')'), (this.value = ')'), (this.mirror = '(')
  }
}
class sv extends Z {
  constructor() {
    super(...arguments), (this.tokenType = '~=')
  }
}
class ov extends Z {
  constructor() {
    super(...arguments), (this.tokenType = '|=')
  }
}
class lv extends Z {
  constructor() {
    super(...arguments), (this.tokenType = '^=')
  }
}
class av extends Z {
  constructor() {
    super(...arguments), (this.tokenType = '$=')
  }
}
class uv extends Z {
  constructor() {
    super(...arguments), (this.tokenType = '*=')
  }
}
class Qd extends Z {
  constructor() {
    super(...arguments), (this.tokenType = '||')
  }
}
class Xi extends Z {
  constructor() {
    super(...arguments), (this.tokenType = 'EOF')
  }
  toSource() {
    return ''
  }
}
class me extends Z {
  constructor(t) {
    super(), (this.tokenType = 'DELIM'), (this.value = ''), (this.value = re(t))
  }
  toString() {
    return 'DELIM(' + this.value + ')'
  }
  toJSON() {
    const t = this.constructor.prototype.constructor.prototype.toJSON.call(this)
    return (t.value = this.value), t
  }
  toSource() {
    return this.value === '\\'
      ? `\\
`
      : this.value
  }
}
class tr extends Z {
  constructor() {
    super(...arguments), (this.value = '')
  }
  ASCIIMatch(t) {
    return this.value.toLowerCase() === t.toLowerCase()
  }
  toJSON() {
    const t = this.constructor.prototype.constructor.prototype.toJSON.call(this)
    return (t.value = this.value), t
  }
}
class Xd extends tr {
  constructor(t) {
    super(), (this.tokenType = 'IDENT'), (this.value = t)
  }
  toString() {
    return 'IDENT(' + this.value + ')'
  }
  toSource() {
    return li(this.value)
  }
}
class Gi extends tr {
  constructor(t) {
    super(), (this.tokenType = 'FUNCTION'), (this.value = t), (this.mirror = ')')
  }
  toString() {
    return 'FUNCTION(' + this.value + ')'
  }
  toSource() {
    return li(this.value) + '('
  }
}
class Gd extends tr {
  constructor(t) {
    super(), (this.tokenType = 'AT-KEYWORD'), (this.value = t)
  }
  toString() {
    return 'AT(' + this.value + ')'
  }
  toSource() {
    return '@' + li(this.value)
  }
}
class Kd extends tr {
  constructor(t) {
    super(), (this.tokenType = 'HASH'), (this.value = t), (this.type = 'unrestricted')
  }
  toString() {
    return 'HASH(' + this.value + ')'
  }
  toJSON() {
    const t = this.constructor.prototype.constructor.prototype.toJSON.call(this)
    return (t.value = this.value), (t.type = this.type), t
  }
  toSource() {
    return this.type === 'id' ? '#' + li(this.value) : '#' + fv(this.value)
  }
}
class Jd extends tr {
  constructor(t) {
    super(), (this.tokenType = 'STRING'), (this.value = t)
  }
  toString() {
    return '"' + th(this.value) + '"'
  }
}
class Yd extends tr {
  constructor(t) {
    super(), (this.tokenType = 'URL'), (this.value = t)
  }
  toString() {
    return 'URL(' + this.value + ')'
  }
  toSource() {
    return 'url("' + th(this.value) + '")'
  }
}
class Zd extends Z {
  constructor() {
    super(), (this.tokenType = 'NUMBER'), (this.type = 'integer'), (this.repr = '')
  }
  toString() {
    return this.type === 'integer' ? 'INT(' + this.value + ')' : 'NUMBER(' + this.value + ')'
  }
  toJSON() {
    const t = super.toJSON()
    return (t.value = this.value), (t.type = this.type), (t.repr = this.repr), t
  }
  toSource() {
    return this.repr
  }
}
class eh extends Z {
  constructor() {
    super(), (this.tokenType = 'PERCENTAGE'), (this.repr = '')
  }
  toString() {
    return 'PERCENTAGE(' + this.value + ')'
  }
  toJSON() {
    const t = this.constructor.prototype.constructor.prototype.toJSON.call(this)
    return (t.value = this.value), (t.repr = this.repr), t
  }
  toSource() {
    return this.repr + '%'
  }
}
class cv extends Z {
  constructor() {
    super(), (this.tokenType = 'DIMENSION'), (this.type = 'integer'), (this.repr = ''), (this.unit = '')
  }
  toString() {
    return 'DIM(' + this.value + ',' + this.unit + ')'
  }
  toJSON() {
    const t = this.constructor.prototype.constructor.prototype.toJSON.call(this)
    return (t.value = this.value), (t.type = this.type), (t.repr = this.repr), (t.unit = this.unit), t
  }
  toSource() {
    const t = this.repr
    let n = li(this.unit)
    return (
      n[0].toLowerCase() === 'e' &&
        (n[1] === '-' || te(n.charCodeAt(1), 48, 57)) &&
        (n = '\\65 ' + n.slice(1, n.length)),
      t + n
    )
  }
}
function li(e) {
  e = '' + e
  let t = ''
  const n = e.charCodeAt(0)
  for (let r = 0; r < e.length; r++) {
    const i = e.charCodeAt(r)
    if (i === 0) throw new xa('Invalid character: the input contains U+0000.')
    te(i, 1, 31) || i === 127 || (r === 0 && te(i, 48, 57)) || (r === 1 && te(i, 48, 57) && n === 45)
      ? (t += '\\' + i.toString(16) + ' ')
      : i >= 128 || i === 45 || i === 95 || te(i, 48, 57) || te(i, 65, 90) || te(i, 97, 122)
      ? (t += e[r])
      : (t += '\\' + e[r])
  }
  return t
}
function fv(e) {
  e = '' + e
  let t = ''
  for (let n = 0; n < e.length; n++) {
    const r = e.charCodeAt(n)
    if (r === 0) throw new xa('Invalid character: the input contains U+0000.')
    r >= 128 || r === 45 || r === 95 || te(r, 48, 57) || te(r, 65, 90) || te(r, 97, 122)
      ? (t += e[n])
      : (t += '\\' + r.toString(16) + ' ')
  }
  return t
}
function th(e) {
  e = '' + e
  let t = ''
  for (let n = 0; n < e.length; n++) {
    const r = e.charCodeAt(n)
    if (r === 0) throw new xa('Invalid character: the input contains U+0000.')
    te(r, 1, 31) || r === 127
      ? (t += '\\' + r.toString(16) + ' ')
      : r === 34 || r === 92
      ? (t += '\\' + e[n])
      : (t += e[n])
  }
  return t
}
class Se extends Error {}
function dv(e, t) {
  let n
  try {
    ;(n = rv(e)), n[n.length - 1] instanceof Xi || n.push(new Xi())
  } catch (E) {
    const _ = E.message + ` while parsing selector "${e}"`,
      N = (E.stack || '').indexOf(E.message)
    throw (
      (N !== -1 && (E.stack = E.stack.substring(0, N) + _ + E.stack.substring(N + E.message.length)),
      (E.message = _),
      E)
    )
  }
  const r = n.find(
    (E) =>
      E instanceof Gd ||
      E instanceof zd ||
      E instanceof Qi ||
      E instanceof Qd ||
      E instanceof Dd ||
      E instanceof Fd ||
      E instanceof jd ||
      E instanceof Bd ||
      E instanceof qd ||
      E instanceof Yd ||
      E instanceof eh,
  )
  if (r) throw new Se(`Unsupported token "${r.toSource()}" while parsing selector "${e}"`)
  let i = 0
  const s = new Set()
  function o() {
    return new Se(`Unexpected token "${n[i].toSource()}" while parsing selector "${e}"`)
  }
  function l() {
    for (; n[i] instanceof gl; ) i++
  }
  function a(E = i) {
    return n[E] instanceof Xd
  }
  function u(E = i) {
    return n[E] instanceof Jd
  }
  function c(E = i) {
    return n[E] instanceof Zd
  }
  function p(E = i) {
    return n[E] instanceof Hd
  }
  function f(E = i) {
    return n[E] instanceof Vd
  }
  function y(E = i) {
    return n[E] instanceof me && n[E].value === '*'
  }
  function g(E = i) {
    return n[E] instanceof Xi
  }
  function w(E = i) {
    return n[E] instanceof me && ['>', '+', '~'].includes(n[E].value)
  }
  function x(E = i) {
    return p(E) || f(E) || g(E) || w(E) || n[E] instanceof gl
  }
  function h() {
    const E = [d()]
    for (; l(), !!p(); ) i++, E.push(d())
    return E
  }
  function d() {
    return l(), c() || u() ? n[i++].value : v()
  }
  function v() {
    const E = { simples: [] }
    for (
      l(),
        w()
          ? E.simples.push({ selector: { functions: [{ name: 'scope', args: [] }] }, combinator: '' })
          : E.simples.push({ selector: S(), combinator: '' });
      ;

    ) {
      if ((l(), w())) (E.simples[E.simples.length - 1].combinator = n[i++].value), l()
      else if (x()) break
      E.simples.push({ combinator: '', selector: S() })
    }
    return E
  }
  function S() {
    let E = ''
    const _ = []
    for (; !x(); )
      if (a() || y()) E += n[i++].toSource()
      else if (n[i] instanceof Kd) E += n[i++].toSource()
      else if (n[i] instanceof me && n[i].value === '.')
        if ((i++, a())) E += '.' + n[i++].toSource()
        else throw o()
      else if (n[i] instanceof Ud)
        if ((i++, a()))
          if (!t.has(n[i].value.toLowerCase())) E += ':' + n[i++].toSource()
          else {
            const N = n[i++].value.toLowerCase()
            _.push({ name: N, args: [] }), s.add(N)
          }
        else if (n[i] instanceof Gi) {
          const N = n[i++].value.toLowerCase()
          if ((t.has(N) ? (_.push({ name: N, args: h() }), s.add(N)) : (E += `:${N}(${T()})`), l(), !f())) throw o()
          i++
        } else throw o()
      else if (n[i] instanceof Wd) {
        for (E += '[', i++; !(n[i] instanceof vl) && !g(); ) E += n[i++].toSource()
        if (!(n[i] instanceof vl)) throw o()
        ;(E += ']'), i++
      } else throw o()
    if (!E && !_.length) throw o()
    return { css: E || void 0, functions: _ }
  }
  function T() {
    let E = ''
    for (; !f() && !g(); ) E += n[i++].toSource()
    return E
  }
  const C = h()
  if (!g()) throw new Se(`Error while parsing selector "${e}"`)
  if (C.some((E) => typeof E != 'object' || !('simples' in E))) throw new Se(`Error while parsing selector "${e}"`)
  return { selector: C, names: Array.from(s) }
}
const yl = new Set([
    'internal:has',
    'internal:has-not',
    'internal:and',
    'internal:or',
    'internal:chain',
    'left-of',
    'right-of',
    'above',
    'below',
    'near',
  ]),
  hv = new Set(['left-of', 'right-of', 'above', 'below', 'near']),
  nh = new Set([
    'not',
    'is',
    'where',
    'has',
    'scope',
    'light',
    'visible',
    'text',
    'text-matches',
    'text-is',
    'has-text',
    'above',
    'below',
    'right-of',
    'left-of',
    'near',
    'nth-match',
  ])
function Zr(e) {
  const t = gv(e),
    n = []
  for (const r of t.parts) {
    if (r.name === 'css' || r.name === 'css:light') {
      r.name === 'css:light' && (r.body = ':light(' + r.body + ')')
      const i = dv(r.body, nh)
      n.push({ name: 'css', body: i.selector, source: r.body })
      continue
    }
    if (yl.has(r.name)) {
      let i, s
      try {
        const u = JSON.parse('[' + r.body + ']')
        if (!Array.isArray(u) || u.length < 1 || u.length > 2 || typeof u[0] != 'string')
          throw new Se(`Malformed selector: ${r.name}=` + r.body)
        if (((i = u[0]), u.length === 2)) {
          if (typeof u[1] != 'number' || !hv.has(r.name)) throw new Se(`Malformed selector: ${r.name}=` + r.body)
          s = u[1]
        }
      } catch {
        throw new Se(`Malformed selector: ${r.name}=` + r.body)
      }
      const o = { name: r.name, source: r.body, body: { parsed: Zr(i), distance: s } },
        l = [...o.body.parsed.parts].reverse().find((u) => u.name === 'internal:control' && u.body === 'enter-frame'),
        a = l ? o.body.parsed.parts.indexOf(l) : -1
      a !== -1 && pv(o.body.parsed.parts.slice(0, a + 1), n.slice(0, a + 1)) && o.body.parsed.parts.splice(0, a + 1),
        n.push(o)
      continue
    }
    n.push({ ...r, source: r.body })
  }
  if (yl.has(n[0].name)) throw new Se(`"${n[0].name}" selector cannot be first`)
  return { capture: t.capture, parts: n }
}
function pv(e, t) {
  return Kn({ parts: e }) === Kn({ parts: t })
}
function Kn(e) {
  return typeof e == 'string'
    ? e
    : e.parts
        .map((t, n) => {
          const r = t.name === 'css' ? '' : t.name + '='
          return `${n === e.capture ? '*' : ''}${r}${t.source}`
        })
        .join(' >> ')
}
function mv(e, t) {
  const n = (r, i) => {
    for (const s of r.parts) t(s, i), yl.has(s.name) && n(s.body.parsed, !0)
  }
  n(e, !1)
}
function gv(e) {
  let t = 0,
    n,
    r = 0
  const i = { parts: [] },
    s = () => {
      const l = e.substring(r, t).trim(),
        a = l.indexOf('=')
      let u, c
      a !== -1 &&
      l
        .substring(0, a)
        .trim()
        .match(/^[a-zA-Z_0-9-+:*]+$/)
        ? ((u = l.substring(0, a).trim()), (c = l.substring(a + 1)))
        : (l.length > 1 && l[0] === '"' && l[l.length - 1] === '"') ||
          (l.length > 1 && l[0] === "'" && l[l.length - 1] === "'")
        ? ((u = 'text'), (c = l))
        : /^\(*\/\//.test(l) || l.startsWith('..')
        ? ((u = 'xpath'), (c = l))
        : ((u = 'css'), (c = l))
      let p = !1
      if ((u[0] === '*' && ((p = !0), (u = u.substring(1))), i.parts.push({ name: u, body: c }), p)) {
        if (i.capture !== void 0) throw new Se('Only one of the selectors can capture using * modifier')
        i.capture = i.parts.length - 1
      }
    }
  if (!e.includes('>>')) return (t = e.length), s(), i
  const o = () => {
    const a = e.substring(r, t).match(/^\s*text\s*=(.*)$/)
    return !!a && !!a[1]
  }
  for (; t < e.length; ) {
    const l = e[t]
    l === '\\' && t + 1 < e.length
      ? (t += 2)
      : l === n
      ? ((n = void 0), t++)
      : !n && (l === '"' || l === "'" || l === '`') && !o()
      ? ((n = l), t++)
      : !n && l === '>' && e[t + 1] === '>'
      ? (s(), (t += 2), (r = t))
      : t++
  }
  return s(), i
}
function un(e, t) {
  let n = 0,
    r = e.length === 0
  const i = () => e[n] || '',
    s = () => {
      const x = i()
      return ++n, (r = n >= e.length), x
    },
    o = (x) => {
      throw r
        ? new Se(`Unexpected end of selector while parsing selector \`${e}\``)
        : new Se(
            `Error while parsing selector \`${e}\` - unexpected symbol "${i()}" at position ${n}` +
              (x ? ' during ' + x : ''),
          )
    }
  function l() {
    for (; !r && /\s/.test(i()); ) s()
  }
  function a(x) {
    return (
      x >= '' ||
      (x >= '0' && x <= '9') ||
      (x >= 'A' && x <= 'Z') ||
      (x >= 'a' && x <= 'z') ||
      (x >= '0' && x <= '9') ||
      x === '_' ||
      x === '-'
    )
  }
  function u() {
    let x = ''
    for (l(); !r && a(i()); ) x += s()
    return x
  }
  function c(x) {
    let h = s()
    for (h !== x && o('parsing quoted string'); !r && i() !== x; ) i() === '\\' && s(), (h += s())
    return i() !== x && o('parsing quoted string'), (h += s()), h
  }
  function p() {
    s() !== '/' && o('parsing regular expression')
    let x = '',
      h = !1
    for (; !r; ) {
      if (i() === '\\') (x += s()), r && o('parsing regular expressiion')
      else if (h && i() === ']') h = !1
      else if (!h && i() === '[') h = !0
      else if (!h && i() === '/') break
      x += s()
    }
    s() !== '/' && o('parsing regular expression')
    let d = ''
    for (; !r && i().match(/[dgimsuy]/); ) d += s()
    try {
      return new RegExp(x, d)
    } catch (v) {
      throw new Se(`Error while parsing selector \`${e}\`: ${v.message}`)
    }
  }
  function f() {
    let x = ''
    return l(), i() === "'" || i() === '"' ? (x = c(i()).slice(1, -1)) : (x = u()), x || o('parsing property path'), x
  }
  function y() {
    l()
    let x = ''
    return (
      r || (x += s()),
      !r && x !== '=' && (x += s()),
      ['=', '*=', '^=', '$=', '|=', '~='].includes(x) || o('parsing operator'),
      x
    )
  }
  function g() {
    s()
    const x = []
    for (x.push(f()), l(); i() === '.'; ) s(), x.push(f()), l()
    if (i() === ']') return s(), { name: x.join('.'), jsonPath: x, op: '<truthy>', value: null, caseSensitive: !1 }
    const h = y()
    let d,
      v = !0
    if ((l(), i() === '/')) {
      if (h !== '=')
        throw new Se(`Error while parsing selector \`${e}\` - cannot use ${h} in attribute with regular expression`)
      d = p()
    } else if (i() === "'" || i() === '"')
      (d = c(i()).slice(1, -1)),
        l(),
        i() === 'i' || i() === 'I' ? ((v = !1), s()) : (i() === 's' || i() === 'S') && ((v = !0), s())
    else {
      for (d = ''; !r && (a(i()) || i() === '+' || i() === '.'); ) d += s()
      d === 'true'
        ? (d = !0)
        : d === 'false'
        ? (d = !1)
        : t || ((d = +d), Number.isNaN(d) && o('parsing attribute value'))
    }
    if ((l(), i() !== ']' && o('parsing attribute value'), s(), h !== '=' && typeof d != 'string'))
      throw new Se(
        `Error while parsing selector \`${e}\` - cannot use ${h} in attribute with non-string matching value - ${d}`,
      )
    return { name: x.join('.'), jsonPath: x, op: h, value: d, caseSensitive: v }
  }
  const w = { name: '', attributes: [] }
  for (w.name = u(), l(); i() === '['; ) w.attributes.push(g()), l()
  if ((r || o(void 0), !w.name && !w.attributes.length))
    throw new Se(`Error while parsing selector \`${e}\` - selector cannot be empty`)
  return w
}
function gn(e, t, n = !1, r = !1) {
  return rh(e, t, n, r)[0]
}
function rh(e, t, n = !1, r = !1, i = 20) {
  if (r)
    try {
      return en(Vu[e], Zr(t), n, i)
    } catch {
      return [t]
    }
  else return en(Vu[e], Zr(t), n, i)
}
function en(e, t, n = !1, r = 20) {
  const i = [...t.parts]
  for (let l = 0; l < i.length - 1; l++)
    if (i[l].name === 'nth' && i[l + 1].name === 'internal:control' && i[l + 1].body === 'enter-frame') {
      const [a] = i.splice(l, 1)
      i.splice(l + 1, 0, a)
    }
  const s = []
  let o = n ? 'frame-locator' : 'page'
  for (let l = 0; l < i.length; l++) {
    const a = i[l],
      u = o
    if (((o = 'locator'), a.name === 'nth')) {
      a.body === '0'
        ? s.push([e.generateLocator(u, 'first', ''), e.generateLocator(u, 'nth', '0')])
        : a.body === '-1'
        ? s.push([e.generateLocator(u, 'last', ''), e.generateLocator(u, 'nth', '-1')])
        : s.push([e.generateLocator(u, 'nth', a.body)])
      continue
    }
    if (a.name === 'internal:text') {
      const { exact: g, text: w } = pr(a.body)
      s.push([e.generateLocator(u, 'text', w, { exact: g })])
      continue
    }
    if (a.name === 'internal:has-text') {
      const { exact: g, text: w } = pr(a.body)
      if (!g) {
        s.push([e.generateLocator(u, 'has-text', w, { exact: g })])
        continue
      }
    }
    if (a.name === 'internal:has-not-text') {
      const { exact: g, text: w } = pr(a.body)
      if (!g) {
        s.push([e.generateLocator(u, 'has-not-text', w, { exact: g })])
        continue
      }
    }
    if (a.name === 'internal:has') {
      const g = en(e, a.body.parsed, !1, r)
      s.push(g.map((w) => e.generateLocator(u, 'has', w)))
      continue
    }
    if (a.name === 'internal:has-not') {
      const g = en(e, a.body.parsed, !1, r)
      s.push(g.map((w) => e.generateLocator(u, 'hasNot', w)))
      continue
    }
    if (a.name === 'internal:and') {
      const g = en(e, a.body.parsed, !1, r)
      s.push(g.map((w) => e.generateLocator(u, 'and', w)))
      continue
    }
    if (a.name === 'internal:or') {
      const g = en(e, a.body.parsed, !1, r)
      s.push(g.map((w) => e.generateLocator(u, 'or', w)))
      continue
    }
    if (a.name === 'internal:chain') {
      const g = en(e, a.body.parsed, !1, r)
      s.push(g.map((w) => e.generateLocator(u, 'chain', w)))
      continue
    }
    if (a.name === 'internal:label') {
      const { exact: g, text: w } = pr(a.body)
      s.push([e.generateLocator(u, 'label', w, { exact: g })])
      continue
    }
    if (a.name === 'internal:role') {
      const g = un(a.body, !0),
        w = { attrs: [] }
      for (const x of g.attributes)
        x.name === 'name'
          ? ((w.exact = x.caseSensitive), (w.name = x.value))
          : (x.name === 'level' && typeof x.value == 'string' && (x.value = +x.value),
            w.attrs.push({ name: x.name === 'include-hidden' ? 'includeHidden' : x.name, value: x.value }))
      s.push([e.generateLocator(u, 'role', g.name, w)])
      continue
    }
    if (a.name === 'internal:testid') {
      const g = un(a.body, !0),
        { value: w } = g.attributes[0]
      s.push([e.generateLocator(u, 'test-id', w)])
      continue
    }
    if (a.name === 'internal:attr') {
      const g = un(a.body, !0),
        { name: w, value: x, caseSensitive: h } = g.attributes[0],
        d = x,
        v = !!h
      if (w === 'placeholder') {
        s.push([e.generateLocator(u, 'placeholder', d, { exact: v })])
        continue
      }
      if (w === 'alt') {
        s.push([e.generateLocator(u, 'alt', d, { exact: v })])
        continue
      }
      if (w === 'title') {
        s.push([e.generateLocator(u, 'title', d, { exact: v })])
        continue
      }
    }
    let c = 'default'
    const p = i[l + 1]
    p && p.name === 'internal:control' && p.body === 'enter-frame' && ((c = 'frame'), (o = 'frame-locator'), l++)
    const f = Kn({ parts: [a] }),
      y = e.generateLocator(u, c, f)
    if (c === 'default' && p && ['internal:has-text', 'internal:has-not-text'].includes(p.name)) {
      const { exact: g, text: w } = pr(p.body)
      if (!g) {
        const x = e.generateLocator('locator', p.name === 'internal:has-text' ? 'has-text' : 'has-not-text', w, {
            exact: g,
          }),
          h = {}
        p.name === 'internal:has-text' ? (h.hasText = w) : (h.hasNotText = w)
        const d = e.generateLocator(u, 'default', f, h)
        s.push([e.chainLocators([y, x]), d]), l++
        continue
      }
    }
    s.push([y])
  }
  return vv(e, s, r)
}
function vv(e, t, n) {
  const r = t.map(() => ''),
    i = [],
    s = (o) => {
      if (o === t.length) return i.push(e.chainLocators(r)), r.length < n
      for (const l of t[o]) if (((r[o] = l), !s(o + 1))) return !1
      return !0
    }
  return s(0), i
}
function pr(e) {
  let t = !1
  const n = e.match(/^\/(.*)\/([igm]*)$/)
  return n
    ? { text: new RegExp(n[1], n[2]) }
    : (e.endsWith('"')
        ? ((e = JSON.parse(e)), (t = !0))
        : e.endsWith('"s')
        ? ((e = JSON.parse(e.substring(0, e.length - 1))), (t = !0))
        : e.endsWith('"i') && ((e = JSON.parse(e.substring(0, e.length - 1))), (t = !1)),
      { exact: t, text: e })
}
class yv {
  generateLocator(t, n, r, i = {}) {
    switch (n) {
      case 'default':
        return i.hasText !== void 0
          ? `locator(${this.quote(r)}, { hasText: ${this.toHasText(i.hasText)} })`
          : i.hasNotText !== void 0
          ? `locator(${this.quote(r)}, { hasNotText: ${this.toHasText(i.hasNotText)} })`
          : `locator(${this.quote(r)})`
      case 'frame':
        return `frameLocator(${this.quote(r)})`
      case 'nth':
        return `nth(${r})`
      case 'first':
        return 'first()'
      case 'last':
        return 'last()'
      case 'role':
        const s = []
        ce(i.name)
          ? s.push(`name: ${this.regexToSourceString(i.name)}`)
          : typeof i.name == 'string' && (s.push(`name: ${this.quote(i.name)}`), i.exact && s.push('exact: true'))
        for (const { name: l, value: a } of i.attrs) s.push(`${l}: ${typeof a == 'string' ? this.quote(a) : a}`)
        const o = s.length ? `, { ${s.join(', ')} }` : ''
        return `getByRole(${this.quote(r)}${o})`
      case 'has-text':
        return `filter({ hasText: ${this.toHasText(r)} })`
      case 'has-not-text':
        return `filter({ hasNotText: ${this.toHasText(r)} })`
      case 'has':
        return `filter({ has: ${r} })`
      case 'hasNot':
        return `filter({ hasNot: ${r} })`
      case 'and':
        return `and(${r})`
      case 'or':
        return `or(${r})`
      case 'chain':
        return `locator(${r})`
      case 'test-id':
        return `getByTestId(${this.toTestIdValue(r)})`
      case 'text':
        return this.toCallWithExact('getByText', r, !!i.exact)
      case 'alt':
        return this.toCallWithExact('getByAltText', r, !!i.exact)
      case 'placeholder':
        return this.toCallWithExact('getByPlaceholder', r, !!i.exact)
      case 'label':
        return this.toCallWithExact('getByLabel', r, !!i.exact)
      case 'title':
        return this.toCallWithExact('getByTitle', r, !!i.exact)
      default:
        throw new Error('Unknown selector kind ' + n)
    }
  }
  chainLocators(t) {
    return t.join('.')
  }
  regexToSourceString(t) {
    return Bs(String(t))
  }
  toCallWithExact(t, n, r) {
    return ce(n)
      ? `${t}(${this.regexToSourceString(n)})`
      : r
      ? `${t}(${this.quote(n)}, { exact: true })`
      : `${t}(${this.quote(n)})`
  }
  toHasText(t) {
    return ce(t) ? this.regexToSourceString(t) : this.quote(t)
  }
  toTestIdValue(t) {
    return ce(t) ? this.regexToSourceString(t) : this.quote(t)
  }
  quote(t) {
    return Hs(t, "'")
  }
}
class wv {
  generateLocator(t, n, r, i = {}) {
    switch (n) {
      case 'default':
        return i.hasText !== void 0
          ? `locator(${this.quote(r)}, has_text=${this.toHasText(i.hasText)})`
          : i.hasNotText !== void 0
          ? `locator(${this.quote(r)}, has_not_text=${this.toHasText(i.hasNotText)})`
          : `locator(${this.quote(r)})`
      case 'frame':
        return `frame_locator(${this.quote(r)})`
      case 'nth':
        return `nth(${r})`
      case 'first':
        return 'first'
      case 'last':
        return 'last'
      case 'role':
        const s = []
        ce(i.name)
          ? s.push(`name=${this.regexToString(i.name)}`)
          : typeof i.name == 'string' && (s.push(`name=${this.quote(i.name)}`), i.exact && s.push('exact=True'))
        for (const { name: l, value: a } of i.attrs) {
          let u = typeof a == 'string' ? this.quote(a) : a
          typeof a == 'boolean' && (u = a ? 'True' : 'False'), s.push(`${$d(l)}=${u}`)
        }
        const o = s.length ? `, ${s.join(', ')}` : ''
        return `get_by_role(${this.quote(r)}${o})`
      case 'has-text':
        return `filter(has_text=${this.toHasText(r)})`
      case 'has-not-text':
        return `filter(has_not_text=${this.toHasText(r)})`
      case 'has':
        return `filter(has=${r})`
      case 'hasNot':
        return `filter(has_not=${r})`
      case 'and':
        return `and_(${r})`
      case 'or':
        return `or_(${r})`
      case 'chain':
        return `locator(${r})`
      case 'test-id':
        return `get_by_test_id(${this.toTestIdValue(r)})`
      case 'text':
        return this.toCallWithExact('get_by_text', r, !!i.exact)
      case 'alt':
        return this.toCallWithExact('get_by_alt_text', r, !!i.exact)
      case 'placeholder':
        return this.toCallWithExact('get_by_placeholder', r, !!i.exact)
      case 'label':
        return this.toCallWithExact('get_by_label', r, !!i.exact)
      case 'title':
        return this.toCallWithExact('get_by_title', r, !!i.exact)
      default:
        throw new Error('Unknown selector kind ' + n)
    }
  }
  chainLocators(t) {
    return t.join('.')
  }
  regexToString(t) {
    const n = t.flags.includes('i') ? ', re.IGNORECASE' : ''
    return `re.compile(r"${Bs(t.source).replace(/\\\//, '/').replace(/"/g, '\\"')}"${n})`
  }
  toCallWithExact(t, n, r) {
    return ce(n)
      ? `${t}(${this.regexToString(n)})`
      : r
      ? `${t}(${this.quote(n)}, exact=True)`
      : `${t}(${this.quote(n)})`
  }
  toHasText(t) {
    return ce(t) ? this.regexToString(t) : `${this.quote(t)}`
  }
  toTestIdValue(t) {
    return ce(t) ? this.regexToString(t) : this.quote(t)
  }
  quote(t) {
    return Hs(t, '"')
  }
}
class Sv {
  generateLocator(t, n, r, i = {}) {
    let s
    switch (t) {
      case 'page':
        s = 'Page'
        break
      case 'frame-locator':
        s = 'FrameLocator'
        break
      case 'locator':
        s = 'Locator'
        break
    }
    switch (n) {
      case 'default':
        return i.hasText !== void 0
          ? `locator(${this.quote(r)}, new ${s}.LocatorOptions().setHasText(${this.toHasText(i.hasText)}))`
          : i.hasNotText !== void 0
          ? `locator(${this.quote(r)}, new ${s}.LocatorOptions().setHasNotText(${this.toHasText(i.hasNotText)}))`
          : `locator(${this.quote(r)})`
      case 'frame':
        return `frameLocator(${this.quote(r)})`
      case 'nth':
        return `nth(${r})`
      case 'first':
        return 'first()'
      case 'last':
        return 'last()'
      case 'role':
        const o = []
        ce(i.name)
          ? o.push(`.setName(${this.regexToString(i.name)})`)
          : typeof i.name == 'string' &&
            (o.push(`.setName(${this.quote(i.name)})`), i.exact && o.push('.setExact(true)'))
        for (const { name: a, value: u } of i.attrs) o.push(`.set${xs(a)}(${typeof u == 'string' ? this.quote(u) : u})`)
        const l = o.length ? `, new ${s}.GetByRoleOptions()${o.join('')}` : ''
        return `getByRole(AriaRole.${$d(r).toUpperCase()}${l})`
      case 'has-text':
        return `filter(new ${s}.FilterOptions().setHasText(${this.toHasText(r)}))`
      case 'has-not-text':
        return `filter(new ${s}.FilterOptions().setHasNotText(${this.toHasText(r)}))`
      case 'has':
        return `filter(new ${s}.FilterOptions().setHas(${r}))`
      case 'hasNot':
        return `filter(new ${s}.FilterOptions().setHasNot(${r}))`
      case 'and':
        return `and(${r})`
      case 'or':
        return `or(${r})`
      case 'chain':
        return `locator(${r})`
      case 'test-id':
        return `getByTestId(${this.toTestIdValue(r)})`
      case 'text':
        return this.toCallWithExact(s, 'getByText', r, !!i.exact)
      case 'alt':
        return this.toCallWithExact(s, 'getByAltText', r, !!i.exact)
      case 'placeholder':
        return this.toCallWithExact(s, 'getByPlaceholder', r, !!i.exact)
      case 'label':
        return this.toCallWithExact(s, 'getByLabel', r, !!i.exact)
      case 'title':
        return this.toCallWithExact(s, 'getByTitle', r, !!i.exact)
      default:
        throw new Error('Unknown selector kind ' + n)
    }
  }
  chainLocators(t) {
    return t.join('.')
  }
  regexToString(t) {
    const n = t.flags.includes('i') ? ', Pattern.CASE_INSENSITIVE' : ''
    return `Pattern.compile(${this.quote(Bs(t.source))}${n})`
  }
  toCallWithExact(t, n, r, i) {
    return ce(r)
      ? `${n}(${this.regexToString(r)})`
      : i
      ? `${n}(${this.quote(r)}, new ${t}.${xs(n)}Options().setExact(true))`
      : `${n}(${this.quote(r)})`
  }
  toHasText(t) {
    return ce(t) ? this.regexToString(t) : this.quote(t)
  }
  toTestIdValue(t) {
    return ce(t) ? this.regexToString(t) : this.quote(t)
  }
  quote(t) {
    return Hs(t, '"')
  }
}
class Ev {
  generateLocator(t, n, r, i = {}) {
    switch (n) {
      case 'default':
        return i.hasText !== void 0
          ? `Locator(${this.quote(r)}, new() { ${this.toHasText(i.hasText)} })`
          : i.hasNotText !== void 0
          ? `Locator(${this.quote(r)}, new() { ${this.toHasNotText(i.hasNotText)} })`
          : `Locator(${this.quote(r)})`
      case 'frame':
        return `FrameLocator(${this.quote(r)})`
      case 'nth':
        return `Nth(${r})`
      case 'first':
        return 'First'
      case 'last':
        return 'Last'
      case 'role':
        const s = []
        ce(i.name)
          ? s.push(`NameRegex = ${this.regexToString(i.name)}`)
          : typeof i.name == 'string' && (s.push(`Name = ${this.quote(i.name)}`), i.exact && s.push('Exact = true'))
        for (const { name: l, value: a } of i.attrs) s.push(`${xs(l)} = ${typeof a == 'string' ? this.quote(a) : a}`)
        const o = s.length ? `, new() { ${s.join(', ')} }` : ''
        return `GetByRole(AriaRole.${xs(r)}${o})`
      case 'has-text':
        return `Filter(new() { ${this.toHasText(r)} })`
      case 'has-not-text':
        return `Filter(new() { ${this.toHasNotText(r)} })`
      case 'has':
        return `Filter(new() { Has = ${r} })`
      case 'hasNot':
        return `Filter(new() { HasNot = ${r} })`
      case 'and':
        return `And(${r})`
      case 'or':
        return `Or(${r})`
      case 'chain':
        return `Locator(${r})`
      case 'test-id':
        return `GetByTestId(${this.toTestIdValue(r)})`
      case 'text':
        return this.toCallWithExact('GetByText', r, !!i.exact)
      case 'alt':
        return this.toCallWithExact('GetByAltText', r, !!i.exact)
      case 'placeholder':
        return this.toCallWithExact('GetByPlaceholder', r, !!i.exact)
      case 'label':
        return this.toCallWithExact('GetByLabel', r, !!i.exact)
      case 'title':
        return this.toCallWithExact('GetByTitle', r, !!i.exact)
      default:
        throw new Error('Unknown selector kind ' + n)
    }
  }
  chainLocators(t) {
    return t.join('.')
  }
  regexToString(t) {
    const n = t.flags.includes('i') ? ', RegexOptions.IgnoreCase' : ''
    return `new Regex(${this.quote(Bs(t.source))}${n})`
  }
  toCallWithExact(t, n, r) {
    return ce(n)
      ? `${t}(${this.regexToString(n)})`
      : r
      ? `${t}(${this.quote(n)}, new() { Exact = true })`
      : `${t}(${this.quote(n)})`
  }
  toHasText(t) {
    return ce(t) ? `HasTextRegex = ${this.regexToString(t)}` : `HasText = ${this.quote(t)}`
  }
  toTestIdValue(t) {
    return ce(t) ? this.regexToString(t) : this.quote(t)
  }
  toHasNotText(t) {
    return ce(t) ? `HasNotTextRegex = ${this.regexToString(t)}` : `HasNotText = ${this.quote(t)}`
  }
  quote(t) {
    return Hs(t, '"')
  }
}
class xv {
  generateLocator(t, n, r, i = {}) {
    return JSON.stringify({ kind: n, body: r, options: i })
  }
  chainLocators(t) {
    const n = t.map((r) => JSON.parse(r))
    for (let r = 0; r < n.length - 1; ++r) n[r].next = n[r + 1]
    return JSON.stringify(n[0])
  }
}
const Vu = { javascript: new yv(), python: new wv(), java: new Sv(), csharp: new Ev(), jsonl: new xv() }
function ce(e) {
  return e instanceof RegExp
}
const Qu = new Map()
function ai({
  name: e,
  items: t = [],
  id: n,
  render: r,
  icon: i,
  isError: s,
  isWarning: o,
  indent: l,
  selectedItem: a,
  onAccepted: u,
  onSelected: c,
  onLeftArrow: p,
  onRightArrow: f,
  onHighlighted: y,
  onIconClicked: g,
  noItemsMessage: w,
  dataTestId: x,
}) {
  const h = L.useRef(null),
    [d, v] = L.useState()
  return (
    L.useEffect(() => {
      y == null || y(d)
    }, [y, d]),
    L.useEffect(() => {
      const S = h.current
      if (!S) return
      const T = () => {
        Qu.set(e, S.scrollTop)
      }
      return S.addEventListener('scroll', T, { passive: !0 }), () => S.removeEventListener('scroll', T)
    }, [e]),
    L.useEffect(() => {
      h.current && (h.current.scrollTop = Qu.get(e) || 0)
    }, [e]),
    m('div', {
      className: 'list-view vbox',
      role: 'list',
      'data-testid': x || e + '-list',
      children: b('div', {
        className: 'list-view-content',
        tabIndex: 0,
        onDoubleClick: () => a && (u == null ? void 0 : u(a, t.indexOf(a))),
        onKeyDown: (S) => {
          var _
          if (a && S.key === 'Enter') {
            u == null || u(a, t.indexOf(a))
            return
          }
          if (S.key !== 'ArrowDown' && S.key !== 'ArrowUp' && S.key !== 'ArrowLeft' && S.key !== 'ArrowRight') return
          if ((S.stopPropagation(), S.preventDefault(), a && S.key === 'ArrowLeft')) {
            p == null || p(a, t.indexOf(a))
            return
          }
          if (a && S.key === 'ArrowRight') {
            f == null || f(a, t.indexOf(a))
            return
          }
          const T = a ? t.indexOf(a) : -1
          let C = T
          S.key === 'ArrowDown' && (T === -1 ? (C = 0) : (C = Math.min(T + 1, t.length - 1))),
            S.key === 'ArrowUp' && (T === -1 ? (C = t.length - 1) : (C = Math.max(T - 1, 0)))
          const E = (_ = h.current) == null ? void 0 : _.children.item(C)
          _v(E || void 0), y == null || y(void 0), c == null || c(t[C], C)
        },
        ref: h,
        children: [
          w && t.length === 0 && m('div', { className: 'list-view-empty', children: w }),
          t.map((S, T) => {
            const C = a === S ? ' selected' : '',
              E = d === S ? ' highlighted' : '',
              _ = s != null && s(S, T) ? ' error' : '',
              N = o != null && o(S, T) ? ' warning' : '',
              I = (l == null ? void 0 : l(S, T)) || 0,
              O = r(S, T)
            return b(
              'div',
              {
                role: 'listitem',
                className: 'list-view-entry' + C + E + _ + N,
                onClick: () => (c == null ? void 0 : c(S, T)),
                onMouseEnter: () => v(S),
                onMouseLeave: () => v(void 0),
                children: [
                  I ? new Array(I).fill(0).map(() => m('div', { className: 'list-view-indent' })) : void 0,
                  i &&
                    m('div', {
                      className: 'codicon ' + (i(S, T) || 'codicon-blank'),
                      style: { minWidth: 16, marginRight: 4 },
                      onDoubleClick: (k) => {
                        k.preventDefault(), k.stopPropagation()
                      },
                      onClick: (k) => {
                        k.stopPropagation(), k.preventDefault(), g == null || g(S, T)
                      },
                    }),
                  typeof O == 'string'
                    ? m('div', { style: { textOverflow: 'ellipsis', overflow: 'hidden' }, children: O })
                    : O,
                ],
              },
              (n == null ? void 0 : n(S, T)) || T,
            )
          }),
        ],
      }),
    })
  )
}
function _v(e) {
  e && (e != null && e.scrollIntoViewIfNeeded ? e.scrollIntoViewIfNeeded(!1) : e == null || e.scrollIntoView())
}
const kv = ai
function Tv({
  name: e,
  rootItem: t,
  render: n,
  icon: r,
  isError: i,
  isVisible: s,
  selectedItem: o,
  onAccepted: l,
  onSelected: a,
  onHighlighted: u,
  treeState: c,
  setTreeState: p,
  noItemsMessage: f,
  dataTestId: y,
  autoExpandDepth: g,
}) {
  const w = L.useMemo(() => Nv(t, o, c.expandedItems, g || 0), [t, o, c, g]),
    x = L.useMemo(() => {
      if (!s) return [...w.keys()]
      const h = new Map(),
        d = (S) => {
          const T = h.get(S)
          if (T !== void 0) return T
          let C = S.children.some((_) => d(_))
          for (const _ of S.children) {
            const N = d(_)
            C = C || N
          }
          const E = s(S) || C
          return h.set(S, E), E
        }
      for (const S of w.keys()) d(S)
      const v = []
      for (const S of w.keys()) s(S) && v.push(S)
      return v
    }, [w, s])
  return m(kv, {
    name: e,
    items: x,
    id: (h) => h.id,
    dataTestId: y || e + '-tree',
    render: (h) => {
      const d = n(h)
      return b(mt, {
        children: [
          r && m('div', { className: 'codicon ' + (r(h) || 'blank'), style: { minWidth: 16, marginRight: 4 } }),
          typeof d == 'string' ? m('div', { style: { textOverflow: 'ellipsis', overflow: 'hidden' }, children: d }) : d,
        ],
      })
    },
    icon: (h) => {
      const d = w.get(h).expanded
      if (typeof d == 'boolean') return d ? 'codicon-chevron-down' : 'codicon-chevron-right'
    },
    isError: (h) => (i == null ? void 0 : i(h)) || !1,
    indent: (h) => w.get(h).depth,
    selectedItem: o,
    onAccepted: (h) => (l == null ? void 0 : l(h)),
    onSelected: (h) => (a == null ? void 0 : a(h)),
    onHighlighted: (h) => (u == null ? void 0 : u(h)),
    onLeftArrow: (h) => {
      const { expanded: d, parent: v } = w.get(h)
      d ? (c.expandedItems.set(h.id, !1), p({ ...c })) : v && (a == null || a(v))
    },
    onRightArrow: (h) => {
      h.children.length && (c.expandedItems.set(h.id, !0), p({ ...c }))
    },
    onIconClicked: (h) => {
      const { expanded: d } = w.get(h)
      if (d) {
        for (let v = o; v; v = v.parent)
          if (v === h) {
            a == null || a(h)
            break
          }
        c.expandedItems.set(h.id, !1)
      } else c.expandedItems.set(h.id, !0)
      p({ ...c })
    },
    noItemsMessage: f,
  })
}
function Nv(e, t, n, r) {
  const i = new Map(),
    s = new Set()
  for (let l = t == null ? void 0 : t.parent; l; l = l.parent) s.add(l.id)
  const o = (l, a) => {
    for (const u of l.children) {
      const c = s.has(u.id) || n.get(u.id),
        p = r > a && i.size < 25 && c !== !1,
        f = u.children.length ? c ?? p : void 0
      i.set(u, { depth: a, expanded: f, parent: e === l ? null : l }), f && o(u, a + 1)
    }
  }
  return o(e, 0), i
}
const Cv = Tv,
  Av = ({
    actions: e,
    selectedAction: t,
    selectedTime: n,
    setSelectedTime: r,
    sdkLanguage: i,
    onSelected: s,
    onHighlighted: o,
    revealConsole: l,
    isLive: a,
  }) => {
    const [u, c] = L.useState({ expandedItems: new Map() }),
      { rootItem: p, itemMap: f } = L.useMemo(() => Hg(e), [e]),
      { selectedItem: y } = L.useMemo(() => ({ selectedItem: t ? f.get(t.callId) : void 0 }), [f, t])
    return b('div', {
      className: 'vbox',
      children: [
        n &&
          b('div', {
            className: 'action-list-show-all',
            onClick: () => r(void 0),
            children: [m('span', { className: 'codicon codicon-triangle-left' }), 'Show all'],
          }),
        m(Cv, {
          name: 'actions',
          rootItem: p,
          treeState: u,
          setTreeState: c,
          selectedItem: y,
          onSelected: (g) => s(g.action),
          onHighlighted: (g) => o(g == null ? void 0 : g.action),
          onAccepted: (g) => r({ minimum: g.action.startTime, maximum: g.action.endTime }),
          isError: (g) => {
            var w, x
            return !!((x = (w = g.action) == null ? void 0 : w.error) != null && x.message)
          },
          isVisible: (g) => !n || (g.action.startTime <= n.maximum && g.action.endTime >= n.minimum),
          render: (g) => _a(g.action, i, l, a || !1),
        }),
      ],
    })
  },
  _a = (e, t, n, r) => {
    const { errors: i, warnings: s } = Wg(e),
      o = e.params.selector ? gn(t || 'javascript', e.params.selector, !1, !0) : void 0
    let l = ''
    return (
      e.endTime ? (l = kt(e.endTime - e.startTime)) : e.error ? (l = 'Timed out') : r || (l = '-'),
      b(mt, {
        children: [
          b('div', {
            className: 'action-title',
            children: [
              m('span', { children: e.apiName }),
              o && m('div', { className: 'action-selector', title: o, children: o }),
              e.method === 'goto' &&
                e.params.url &&
                m('div', { className: 'action-url', title: e.params.url, children: e.params.url }),
            ],
          }),
          m('div', {
            className: 'action-duration',
            style: { flex: 'none' },
            children: l || m('span', { className: 'codicon codicon-loading' }),
          }),
          b('div', {
            className: 'action-icons',
            onClick: () => (n == null ? void 0 : n()),
            children: [
              !!i &&
                b('div', {
                  className: 'action-icon',
                  children: [
                    m('span', { className: 'codicon codicon-error' }),
                    m('span', { className: 'action-icon-value', children: i }),
                  ],
                }),
              !!s &&
                b('div', {
                  className: 'action-icon',
                  children: [
                    m('span', { className: 'codicon codicon-warning' }),
                    m('span', { className: 'action-icon-value', children: s }),
                  ],
                }),
            ],
          }),
        ],
      })
    )
  }
const Lv = ({ value: e }) => {
    const [t, n] = L.useState('codicon-clippy'),
      r = L.useCallback(() => {
        navigator.clipboard.writeText(e).then(
          () => {
            n('codicon-check'),
              setTimeout(() => {
                n('codicon-clippy')
              }, 3e3)
          },
          () => {
            n('codicon-close')
          },
        )
      }, [e])
    return m('span', { className: `copy-icon codicon ${t}`, onClick: r })
  },
  nr = ({ text: e }) =>
    m('div', {
      className: 'fill',
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 24,
        fontWeight: 'bold',
        opacity: 0.5,
      },
      children: e,
    }),
  bv = ({ action: e, sdkLanguage: t }) => {
    if (!e) return m(nr, { text: 'No action selected' })
    const n = { ...e.params }
    delete n.info
    const r = Object.keys(n),
      i = e.wallTime ? new Date(e.wallTime).toLocaleString() : null,
      s = e.endTime ? kt(e.endTime - e.startTime) : 'Timed Out'
    return b('div', {
      className: 'call-tab',
      children: [
        m('div', { className: 'call-line', children: e.apiName }),
        b(mt, {
          children: [
            m('div', { className: 'call-section', children: 'Time' }),
            i &&
              b('div', {
                className: 'call-line',
                children: ['wall time:', m('span', { className: 'call-value datetime', title: i, children: i })],
              }),
            b('div', {
              className: 'call-line',
              children: ['duration:', m('span', { className: 'call-value datetime', title: s, children: s })],
            }),
          ],
        }),
        !!r.length && m('div', { className: 'call-section', children: 'Parameters' }),
        !!r.length && r.map((o, l) => Xu(Gu(e, o, n[o], t), 'param-' + l)),
        !!e.result && m('div', { className: 'call-section', children: 'Return value' }),
        !!e.result && Object.keys(e.result).map((o, l) => Xu(Gu(e, o, e.result[o], t), 'result-' + l)),
      ],
    })
  }
function Xu(e, t) {
  let n = e.text.replace(/\n/g, '↵')
  return (
    e.type === 'string' && (n = `"${n}"`),
    b(
      'div',
      {
        className: 'call-line',
        children: [
          e.name,
          ':',
          m('span', { className: `call-value ${e.type}`, title: e.text, children: n }),
          ['string', 'number', 'object', 'locator'].includes(e.type) && m(Lv, { value: e.text }),
        ],
      },
      t,
    )
  )
}
function Gu(e, t, n, r) {
  const i = e.method.includes('eval') || e.method === 'waitForFunction'
  if (t === 'files') return { text: '<files>', type: 'string', name: t }
  if (
    ((t === 'eventInit' || t === 'expectedValue' || (t === 'arg' && i)) &&
      (n = _s(n.value, new Array(10).fill({ handle: '<handle>' }))),
    ((t === 'value' && i) || (t === 'received' && e.method === 'expect')) &&
      (n = _s(n, new Array(10).fill({ handle: '<handle>' }))),
    t === 'selector')
  )
    return { text: gn(r || 'javascript', e.params.selector, !1, !0), type: 'locator', name: 'locator' }
  const s = typeof n
  return s !== 'object' || n === null
    ? { text: String(n), type: s, name: t }
    : n.guid
    ? { text: '<handle>', type: 'handle', name: t }
    : { text: JSON.stringify(n).slice(0, 1e3), type: 'object', name: t }
}
function _s(e, t) {
  if (e.n !== void 0) return e.n
  if (e.s !== void 0) return e.s
  if (e.b !== void 0) return e.b
  if (e.v !== void 0) {
    if (e.v === 'undefined') return
    if (e.v === 'null') return null
    if (e.v === 'NaN') return NaN
    if (e.v === 'Infinity') return 1 / 0
    if (e.v === '-Infinity') return -1 / 0
    if (e.v === '-0') return -0
  }
  if (e.d !== void 0) return new Date(e.d)
  if (e.r !== void 0) return new RegExp(e.r.p, e.r.f)
  if (e.a !== void 0) return e.a.map((n) => _s(n, t))
  if (e.o !== void 0) {
    const n = {}
    for (const { k: r, v: i } of e.o) n[r] = _s(i, t)
    return n
  }
  return e.h !== void 0 ? (t === void 0 ? '<object>' : t[e.h]) : '<object>'
}
const Iv = ai,
  Mv = ({ action: e }) =>
    e != null && e.log.length
      ? m(Iv, { name: 'log', items: (e == null ? void 0 : e.log) || [], render: (t) => t })
      : m(nr, { text: 'No log entries' })
function ei(e) {
  const t = /(\x1b\[(\d+(;\d+)*)m)|([^\x1b]+)/g,
    n = []
  let r,
    i = {}
  for (; (r = t.exec(e)) !== null; ) {
    const [, , s, , o] = r
    if (s) {
      const l = +s
      switch (l) {
        case 0:
          i = {}
          break
        case 1:
          i['font-weight'] = 'bold'
          break
        case 3:
          i['font-style'] = 'italic'
          break
        case 4:
          i['text-decoration'] = 'underline'
          break
        case 8:
          i.display = 'none'
          break
        case 9:
          i['text-decoration'] = 'line-through'
          break
        case 22:
          i = { ...i, 'font-weight': void 0, 'font-style': void 0, 'text-decoration': void 0 }
          break
        case 23:
          i = { ...i, 'font-weight': void 0, 'font-style': void 0 }
          break
        case 24:
          i = { ...i, 'text-decoration': void 0 }
          break
        case 30:
        case 31:
        case 32:
        case 33:
        case 34:
        case 35:
        case 36:
        case 37:
          i.color = Ku[l - 30]
          break
        case 39:
          i = { ...i, color: void 0 }
          break
        case 40:
        case 41:
        case 42:
        case 43:
        case 44:
        case 45:
        case 46:
        case 47:
          i['background-color'] = Ku[l - 40]
          break
        case 49:
          i = { ...i, 'background-color': void 0 }
          break
        case 53:
          i['text-decoration'] = 'overline'
          break
        case 90:
        case 91:
        case 92:
        case 93:
        case 94:
        case 95:
        case 96:
        case 97:
          i.color = Ju[l - 90]
          break
        case 100:
        case 101:
        case 102:
        case 103:
        case 104:
        case 105:
        case 106:
        case 107:
          i['background-color'] = Ju[l - 100]
          break
      }
    } else o && n.push(`<span style="${Pv(i)}">${Rv(o)}</span>`)
  }
  return n.join('')
}
const Ku = {
    0: 'var(--vscode-terminal-ansiBlack)',
    1: 'var(--vscode-terminal-ansiRed)',
    2: 'var(--vscode-terminal-ansiGreen)',
    3: 'var(--vscode-terminal-ansiYellow)',
    4: 'var(--vscode-terminal-ansiBlue)',
    5: 'var(--vscode-terminal-ansiMagenta)',
    6: 'var(--vscode-terminal-ansiCyan)',
    7: 'var(--vscode-terminal-ansiWhite)',
  },
  Ju = {
    0: 'var(--vscode-terminal-ansiBrightBlack)',
    1: 'var(--vscode-terminal-ansiBrightRed)',
    2: 'var(--vscode-terminal-ansiBrightGreen)',
    3: 'var(--vscode-terminal-ansiBrightYellow)',
    4: 'var(--vscode-terminal-ansiBrightBlue)',
    5: 'var(--vscode-terminal-ansiBrightMagenta)',
    6: 'var(--vscode-terminal-ansiBrightCyan)',
    7: 'var(--vscode-terminal-ansiBrightWhite)',
  }
function Rv(e) {
  return e.replace(/[&"<>]/g, (t) => ({ '&': '&amp;', '"': '&quot;', '<': '&lt;', '>': '&gt;' })[t])
}
function Pv(e) {
  return Object.entries(e)
    .map(([t, n]) => `${t}: ${n}`)
    .join('; ')
}
const $v = ({ error: e }) => {
  const t = L.useMemo(() => ei(e), [e])
  return m('div', { className: 'error-message', dangerouslySetInnerHTML: { __html: t || '' } })
}
function Ov(e) {
  return L.useMemo(() => {
    var n
    const t = new Map()
    for (const r of (e == null ? void 0 : e.actions) || [])
      (n = r.error) != null && n.message && t.set(r.error.message, r)
    return { errors: t }
  }, [e])
}
const zv = ({ errorsModel: e, sdkLanguage: t, boundaries: n }) =>
  e.errors.size
    ? m('div', {
        className: 'fill',
        style: { overflow: 'auto ' },
        children: [...e.errors.entries()].map(([r, i]) =>
          b(
            'div',
            {
              children: [
                b('div', {
                  className: 'hbox',
                  style: { alignItems: 'center', padding: 5 },
                  children: [
                    m('div', {
                      style: { color: 'var(--vscode-editorCodeLens-foreground)', marginRight: 5 },
                      children: kt(i.startTime - n.minimum),
                    }),
                    _a(i, t),
                  ],
                }),
                m($v, { error: r }),
              ],
            },
            r,
          ),
        ),
      })
    : m(nr, { text: 'No errors' })
const Dv = ai
function Fv(e, t) {
  const { entries: n } = L.useMemo(() => {
    var s, o
    if (!e) return { entries: [] }
    const i = []
    for (const l of e.events)
      if (!(l.method !== 'console' && l.method !== 'pageError')) {
        if (l.method === 'console') {
          const { guid: a } = l.params.message,
            u = an(l).initializers[a]
          if (u) {
            const c = u.args && u.args.length ? jv(u.args) : ih(u.text),
              p = u.location.url,
              y = `${p ? p.substring(p.lastIndexOf('/') + 1) : '<anonymous>'}:${u.location.lineNumber}`
            i.push({
              browserMessage: { body: c, location: y },
              isError: ((s = an(l).initializers[a]) == null ? void 0 : s.type) === 'error',
              isWarning: ((o = an(l).initializers[a]) == null ? void 0 : o.type) === 'warning',
              timestamp: l.time,
            })
          }
        }
        l.method === 'pageError' &&
          i.push({ browserError: l.params.error, isError: !0, isWarning: !1, timestamp: l.time })
      }
    for (const l of e.stdio) {
      let a = ''
      l.text && (a = ei(l.text.trim()) || ''),
        l.base64 && (a = ei(atob(l.base64).trim()) || ''),
        i.push({ nodeMessage: { html: a }, isError: l.type === 'stderr', isWarning: !1, timestamp: l.timestamp })
    }
    return i.sort((l, a) => l.timestamp - a.timestamp), { entries: i }
  }, [e])
  return {
    entries: L.useMemo(() => (t ? n.filter((i) => i.timestamp >= t.minimum && i.timestamp <= t.maximum) : n), [n, t]),
  }
}
const Uv = ({ consoleModel: e, boundaries: t }) =>
  e.entries.length
    ? m('div', {
        className: 'console-tab',
        children: m(Dv, {
          name: 'console',
          items: e.entries,
          isError: (n) => n.isError,
          isWarning: (n) => n.isWarning,
          render: (n) => {
            const r = kt(n.timestamp - t.minimum),
              i = m('span', { className: 'console-time', children: r }),
              s = n.isError ? ' status-error' : n.isWarning ? ' status-warning' : ' status-none',
              o =
                n.browserMessage || n.browserError
                  ? m('span', { className: 'codicon codicon-browser' + s })
                  : m('span', { className: 'codicon codicon-file' + s })
            let l, a, u, c
            const { browserMessage: p, browserError: f, nodeMessage: y } = n
            if ((p && ((l = p.location), (a = p.body)), f)) {
              const { error: g, value: w } = f
              g ? ((a = g.message), (c = g.stack)) : (a = String(w))
            }
            return (
              y && (u = y.html),
              b('div', {
                className: 'console-line',
                children: [
                  i,
                  o,
                  l && m('span', { className: 'console-location', children: l }),
                  a && m('span', { className: 'console-line-message', children: a }),
                  u && m('span', { className: 'console-line-message', dangerouslySetInnerHTML: { __html: u } }),
                  c && m('div', { className: 'console-stack', children: c }),
                ],
              })
            )
          },
        }),
      })
    : m(nr, { text: 'No console entries' })
function jv(e) {
  if (e.length === 1) return ih(e[0].preview)
  const t = typeof e[0].value == 'string' && e[0].value.includes('%'),
    n = t ? e[0].value : '',
    r = t ? e.slice(1) : e
  let i = 0
  const s = /%([%sdifoOc])/g
  let o
  const l = []
  let a = []
  l.push(m('span', { children: a }))
  let u = 0
  for (; (o = s.exec(n)) !== null; ) {
    const c = n.substring(u, o.index)
    a.push(m('span', { children: c })), (u = o.index + 2)
    const p = o[0][1]
    if (p === '%') a.push(m('span', { children: '%' }))
    else if (p === 's' || p === 'o' || p === 'O' || p === 'd' || p === 'i' || p === 'f') {
      const f = r[i++],
        y = {}
      typeof (f == null ? void 0 : f.value) != 'string' && (y.color = 'var(--vscode-debugTokenExpression-number)'),
        a.push(m('span', { style: y, children: (f == null ? void 0 : f.preview) || '' }))
    } else if (p === 'c') {
      a = []
      const f = r[i++],
        y = f ? Hv(f.preview) : {}
      l.push(m('span', { style: y, children: a }))
    }
  }
  for (u < n.length && a.push(m('span', { children: n.substring(u) })); i < r.length; i++) {
    const c = r[i],
      p = {}
    a.length && a.push(m('span', { children: ' ' })),
      typeof (c == null ? void 0 : c.value) != 'string' && (p.color = 'var(--vscode-debugTokenExpression-number)'),
      a.push(m('span', { style: p, children: (c == null ? void 0 : c.preview) || '' }))
  }
  return l
}
function ih(e) {
  return [m('span', { dangerouslySetInnerHTML: { __html: ei(e.trim()) } })]
}
function Hv(e) {
  try {
    const t = {},
      n = e.split(';')
    for (const r of n) {
      const i = r.trim()
      if (!i) continue
      let [s, o] = i.split(':')
      if (((s = s.trim()), (o = o.trim()), !Bv(s))) continue
      const l = s.replace(/-([a-z])/g, (a) => a[1].toUpperCase())
      t[l] = o
    }
    return t
  } catch {
    return {}
  }
}
function Bv(e) {
  return ['background', 'border', 'color', 'font', 'line', 'margin', 'padding', 'text'].some((n) => e.startsWith(n))
}
const sh = ({ noShadow: e, children: t, noMinHeight: n }) =>
    m('div', { className: 'toolbar' + (e ? ' no-shadow' : '') + (n ? ' no-min-height' : ''), children: t }),
  wl = ({ tabs: e, selectedTab: t, setSelectedTab: n, leftToolbar: r, rightToolbar: i, dataTestId: s }) =>
    m('div', {
      className: 'tabbed-pane',
      'data-testid': s,
      children: b('div', {
        className: 'vbox',
        children: [
          b(sh, {
            children: [
              r &&
                b('div', {
                  style: { flex: 'none', display: 'flex', margin: '0 4px', alignItems: 'center' },
                  children: [...r],
                }),
              m('div', {
                style: { flex: 'auto', display: 'flex', height: '100%', overflow: 'hidden' },
                children: [
                  ...e.map((o) =>
                    m(oh, {
                      id: o.id,
                      title: o.title,
                      count: o.count,
                      errorCount: o.errorCount,
                      selected: t === o.id,
                      onSelect: n,
                    }),
                  ),
                ],
              }),
              i && b('div', { style: { flex: 'none', display: 'flex', alignItems: 'center' }, children: [...i] }),
            ],
          }),
          e.map((o) => {
            if (o.component)
              return m(
                'div',
                {
                  className: 'tab-content',
                  style: { display: t === o.id ? 'inherit' : 'none' },
                  children: o.component,
                },
                o.id,
              )
            if (t === o.id) return m('div', { className: 'tab-content', children: o.render() }, o.id)
          }),
        ],
      }),
    }),
  oh = ({ id: e, title: t, count: n, errorCount: r, selected: i, onSelect: s }) =>
    b(
      'div',
      {
        className: 'tabbed-pane-tab ' + (i ? 'selected' : ''),
        onClick: () => s(e),
        title: t,
        children: [
          m('div', { className: 'tabbed-pane-tab-label', children: t }),
          !!n && m('div', { className: 'tabbed-pane-tab-counter', children: n }),
          !!r && m('div', { className: 'tabbed-pane-tab-counter error', children: r }),
        ],
      },
      e,
    ),
  qv = 'modulepreload',
  Wv = function (e, t) {
    return new URL(e, t).href
  },
  Yu = {},
  Vv = function (t, n, r) {
    if (!n || n.length === 0) return t()
    const i = document.getElementsByTagName('link')
    return Promise.all(
      n.map((s) => {
        if (((s = Wv(s, r)), s in Yu)) return
        Yu[s] = !0
        const o = s.endsWith('.css'),
          l = o ? '[rel="stylesheet"]' : ''
        if (!!r)
          for (let c = i.length - 1; c >= 0; c--) {
            const p = i[c]
            if (p.href === s && (!o || p.rel === 'stylesheet')) return
          }
        else if (document.querySelector(`link[href="${s}"]${l}`)) return
        const u = document.createElement('link')
        if (
          ((u.rel = o ? 'stylesheet' : qv),
          o || ((u.as = 'script'), (u.crossOrigin = '')),
          (u.href = s),
          document.head.appendChild(u),
          o)
        )
          return new Promise((c, p) => {
            u.addEventListener('load', c),
              u.addEventListener('error', () => p(new Error(`Unable to preload CSS for ${s}`)))
          })
      }),
    ).then(() => t())
  }
const qs = ({
    text: e,
    language: t,
    readOnly: n,
    highlight: r,
    revealLine: i,
    lineNumbers: s,
    isFocused: o,
    focusOnChange: l,
    wrapLines: a,
    onChange: u,
  }) => {
    const [c, p] = ni(),
      [f] = L.useState(
        Vv(
          () => import('./codeMirrorModule-344d0291.js'),
          ['./codeMirrorModule-344d0291.js', '../codeMirrorModule.5d0f417c.css'],
          import.meta.url,
        ).then((x) => x.default),
      ),
      y = L.useRef(null),
      [g, w] = L.useState()
    return (
      L.useEffect(() => {
        ;(async () => {
          var S, T
          const x = await f,
            h = p.current
          if (!h) return
          let d = ''
          if (
            (t === 'javascript' && (d = 'javascript'),
            t === 'python' && (d = 'python'),
            t === 'java' && (d = 'text/x-java'),
            t === 'csharp' && (d = 'text/x-csharp'),
            t === 'html' && (d = 'htmlmixed'),
            t === 'css' && (d = 'css'),
            y.current &&
              d === y.current.cm.getOption('mode') &&
              !!n === y.current.cm.getOption('readOnly') &&
              s === y.current.cm.getOption('lineNumbers') &&
              a === y.current.cm.getOption('lineWrapping'))
          )
            return
          ;(T = (S = y.current) == null ? void 0 : S.cm) == null || T.getWrapperElement().remove()
          const v = x(h, { value: '', mode: d, readOnly: !!n, lineNumbers: s, lineWrapping: a })
          return (y.current = { cm: v }), o && v.focus(), w(v), v
        })()
      }, [f, g, p, t, s, a, n, o]),
      L.useEffect(() => {
        y.current && y.current.cm.setSize(c.width, c.height)
      }, [c]),
      L.useLayoutEffect(() => {
        var d
        if (!g) return
        let x = !1
        if (
          (g.getValue() !== e && (g.setValue(e), (x = !0), l && (g.execCommand('selectAll'), g.focus())),
          x || JSON.stringify(r) !== JSON.stringify(y.current.highlight))
        ) {
          for (const S of y.current.highlight || []) g.removeLineClass(S.line - 1, 'wrap')
          for (const S of r || []) g.addLineClass(S.line - 1, 'wrap', `source-line-${S.type}`)
          for (const S of y.current.widgets || []) g.removeLineWidget(S)
          const v = []
          for (const S of r || []) {
            if (S.type !== 'error') continue
            const T = (d = y.current) == null ? void 0 : d.cm.getLine(S.line - 1)
            if (T) {
              const E = document.createElement('div')
              ;(E.className = 'source-line-error-underline'),
                (E.innerHTML = '&nbsp;'.repeat(T.length || 1)),
                v.push(g.addLineWidget(S.line, E, { above: !0, coverGutter: !1 }))
            }
            const C = document.createElement('div')
            ;(C.innerHTML = ei(S.message || '')),
              (C.className = 'source-line-error-widget'),
              v.push(g.addLineWidget(S.line, C, { above: !0, coverGutter: !1 }))
          }
          ;(y.current.highlight = r), (y.current.widgets = v)
        }
        typeof i == 'number' &&
          y.current.cm.lineCount() >= i &&
          g.scrollIntoView({ line: Math.max(0, i - 1), ch: 0 }, 50)
        let h
        return (
          u && ((h = () => u(g.getValue())), g.on('change', h)),
          () => {
            h && g.off('change', h)
          }
        )
      }, [g, e, r, i, l, u]),
      m('div', { className: 'cm-wrapper', ref: p })
    )
  },
  Qv = ({ resource: e, onClose: t }) => {
    const [n, r] = L.useState('request')
    return m(wl, {
      dataTestId: 'network-request-details',
      leftToolbar: [m(ln, { icon: 'arrow-left', title: 'Back', onClick: t })],
      rightToolbar: [m(ln, { icon: 'close', title: 'Close', onClick: t })],
      tabs: [
        { id: 'request', title: 'Request', render: () => m(Xv, { resource: e }) },
        { id: 'response', title: 'Response', render: () => m(Gv, { resource: e }) },
        { id: 'body', title: 'Body', render: () => m(Kv, { resource: e }) },
      ],
      selectedTab: n,
      setSelectedTab: r,
    })
  },
  Xv = ({ resource: e }) => {
    const [t, n] = L.useState(null)
    return (
      L.useEffect(() => {
        ;(async () => {
          if (e.request.postData) {
            const i = e.request.headers.find((l) => l.name === 'Content-Type'),
              s = i ? i.value : '',
              o = lh(s)
            if (e.request.postData._sha1) {
              const l = await fetch(`sha1/${e.request.postData._sha1}`)
              n({ text: Sl(await l.text(), s), language: o })
            } else n({ text: Sl(e.request.postData.text, s), language: o })
          }
        })()
      }, [e]),
      b('div', {
        className: 'network-request-details',
        children: [
          m('div', { className: 'network-request-details-header', children: 'URL' }),
          m('div', { className: 'network-request-details-url', children: e.request.url }),
          m('div', { className: 'network-request-details-header', children: 'Request Headers' }),
          m('div', {
            className: 'network-request-details-headers',
            children: e.request.headers.map((r) => `${r.name}: ${r.value}`).join(`
`),
          }),
          t && m('div', { className: 'network-request-details-header', children: 'Request Body' }),
          t && m(qs, { text: t.text, language: t.language, readOnly: !0, lineNumbers: !0 }),
        ],
      })
    )
  },
  Gv = ({ resource: e }) =>
    b('div', {
      className: 'network-request-details',
      children: [
        m('div', { className: 'network-request-details-header', children: 'Response Headers' }),
        m('div', {
          className: 'network-request-details-headers',
          children: e.response.headers.map((t) => `${t.name}: ${t.value}`).join(`
`),
        }),
      ],
    }),
  Kv = ({ resource: e }) => {
    const [t, n] = L.useState(null)
    return (
      L.useEffect(() => {
        ;(async () => {
          if (e.response.content._sha1) {
            const i = e.response.content.mimeType.includes('image'),
              s = await fetch(`sha1/${e.response.content._sha1}`)
            if (i) {
              const o = await s.blob(),
                l = new FileReader(),
                a = new Promise((u) => (l.onload = u))
              l.readAsDataURL(o), n({ dataUrl: (await a).target.result })
            } else {
              const o = Sl(await s.text(), e.response.content.mimeType),
                l = lh(e.response.content.mimeType)
              n({ text: o, language: l })
            }
          }
        })()
      }, [e]),
      b('div', {
        className: 'network-request-details',
        children: [
          !e.response.content._sha1 && m('div', { children: 'Response body is not available for this request.' }),
          t && t.dataUrl && m('img', { draggable: 'false', src: t.dataUrl }),
          t && t.text && m(qs, { text: t.text, language: t.language, readOnly: !0, lineNumbers: !0 }),
        ],
      })
    )
  }
function Sl(e, t) {
  if (e === null) return 'Loading...'
  const n = e
  if (n === '') return '<Empty>'
  if (t.includes('application/json'))
    try {
      return JSON.stringify(JSON.parse(n), null, 2)
    } catch {
      return n
    }
  return t.includes('application/x-www-form-urlencoded') ? decodeURIComponent(n) : n
}
function lh(e) {
  if (e.includes('javascript') || e.includes('json')) return 'javascript'
  if (e.includes('html')) return 'html'
  if (e.includes('css')) return 'css'
}
const Jv = ai
function Yv(e, t) {
  return {
    resources: L.useMemo(
      () =>
        ((e == null ? void 0 : e.resources) || []).filter((s) =>
          t ? !!s._monotonicTime && s._monotonicTime >= t.minimum && s._monotonicTime <= t.maximum : !0,
        ),
      [e, t],
    ),
  }
}
const Zv = ({ boundaries: e, networkModel: t, onEntryHovered: n }) => {
    const [r, i] = L.useState(),
      [s, o] = L.useState(void 0)
    L.useMemo(() => {
      s && iy(t.resources, s)
    }, [t.resources, s])
    const l = L.useCallback(
      (a) => {
        o({ by: a, negate: (s == null ? void 0 : s.by) === a ? !s.negate : !1 })
      },
      [s],
    )
    return t.resources.length
      ? b(mt, {
          children: [
            !r &&
              b('div', {
                className: 'vbox',
                children: [
                  m(ey, { sorting: s, toggleSorting: l }),
                  m(Jv, {
                    name: 'network',
                    items: t.resources,
                    render: (a) => m(ty, { boundaries: e, resource: a }),
                    onSelected: i,
                    onHighlighted: n,
                  }),
                ],
              }),
            r && m(Qv, { resource: r, onClose: () => i(void 0) }),
          ],
        })
      : m(nr, { text: 'No network calls' })
  },
  ey = ({ toggleSorting: e, sorting: t }) =>
    b('div', {
      className: 'hbox network-request-header' + (t ? ' filter-' + t.by + (t.negate ? ' negative' : ' positive') : ''),
      children: [
        b('div', {
          className: 'network-request-start',
          onClick: () => e('start'),
          children: [
            m('span', { className: 'codicon codicon-triangle-up' }),
            m('span', { className: 'codicon codicon-triangle-down' }),
          ],
        }),
        b('div', {
          className: 'network-request-status',
          onClick: () => e('status'),
          children: [
            ' Status',
            m('span', { className: 'codicon codicon-triangle-up' }),
            m('span', { className: 'codicon codicon-triangle-down' }),
          ],
        }),
        b('div', {
          className: 'network-request-method',
          onClick: () => e('method'),
          children: [
            'Method',
            m('span', { className: 'codicon codicon-triangle-up' }),
            m('span', { className: 'codicon codicon-triangle-down' }),
          ],
        }),
        b('div', {
          className: 'network-request-file',
          onClick: () => e('file'),
          children: [
            'Request',
            m('span', { className: 'codicon codicon-triangle-up' }),
            m('span', { className: 'codicon codicon-triangle-down' }),
          ],
        }),
        b('div', {
          className: 'network-request-content-type',
          onClick: () => e('content-type'),
          children: [
            'Content Type',
            m('span', { className: 'codicon codicon-triangle-up' }),
            m('span', { className: 'codicon codicon-triangle-down' }),
          ],
        }),
        b('div', {
          className: 'network-request-duration',
          onClick: () => e('duration'),
          children: [
            'Duration',
            m('span', { className: 'codicon codicon-triangle-up' }),
            m('span', { className: 'codicon codicon-triangle-down' }),
          ],
        }),
        b('div', {
          className: 'network-request-size',
          onClick: () => e('size'),
          children: [
            'Size',
            m('span', { className: 'codicon codicon-triangle-up' }),
            m('span', { className: 'codicon codicon-triangle-down' }),
          ],
        }),
        m('div', { className: 'network-request-route', children: 'Route' }),
      ],
    }),
  ty = ({ resource: e, boundaries: t }) => {
    const {
      routeStatus: n,
      resourceName: r,
      contentType: i,
    } = L.useMemo(() => {
      const s = ry(e),
        o = e.request.url.substring(e.request.url.lastIndexOf('/'))
      let l = e.response.content.mimeType
      const a = l.match(/^(.*);\s*charset=.*$/)
      return a && (l = a[1]), { routeStatus: s, resourceName: o, contentType: l }
    }, [e])
    return b('div', {
      className: 'hbox',
      children: [
        m('div', {
          className: 'hbox network-request-start',
          children: m('div', { children: kt(e._monotonicTime - t.minimum) }),
        }),
        m('div', {
          className: 'hbox network-request-status',
          children: m('div', {
            className: ny(e.response.status),
            title: e.response.statusText,
            children: e.response.status,
          }),
        }),
        m('div', { className: 'hbox network-request-method', children: m('div', { children: e.request.method }) }),
        m('div', {
          className: 'network-request-file',
          children: m('div', { className: 'network-request-file-url', title: e.request.url, children: r }),
        }),
        m('div', { className: 'network-request-content-type', title: i, children: i }),
        m('div', { className: 'network-request-duration', children: kt(e.time) }),
        m('div', {
          className: 'network-request-size',
          children: $p(e.response._transferSize > 0 ? e.response._transferSize : e.response.bodySize),
        }),
        m('div', {
          className: 'network-request-route',
          children: n && m('div', { className: `status-route ${n}`, children: n }),
        }),
      ],
    })
  }
function ny(e) {
  return e >= 200 && e < 400 ? 'status-success' : e >= 400 ? 'status-failure' : ''
}
function ry(e) {
  return e._wasAborted
    ? 'aborted'
    : e._wasContinued
    ? 'continued'
    : e._wasFulfilled
    ? 'fulfilled'
    : e._apiRequest
    ? 'api'
    : ''
}
function iy(e, t) {
  const n = sy(t == null ? void 0 : t.by)
  n && e.sort(n), t.negate && e.reverse()
}
function sy(e) {
  if (e === 'start') return (t, n) => t._monotonicTime - n._monotonicTime
  if (e === 'duration') return (t, n) => t.time - n.time
  if (e === 'status') return (t, n) => t.response.status - n.response.status
  if (e === 'method')
    return (t, n) => {
      const r = t.request.method,
        i = n.request.method
      return r.localeCompare(i)
    }
  if (e === 'size')
    return (t, n) => {
      const r = t.response._transferSize > 0 ? t.response._transferSize : t.response.bodySize,
        i = n.response._transferSize > 0 ? n.response._transferSize : n.response.bodySize
      return r - i
    }
  if (e === 'content-type')
    return (t, n) => {
      const r = t.response.content.mimeType,
        i = n.response.content.mimeType
      return r.localeCompare(i)
    }
  if (e === 'file')
    return (t, n) => {
      const r = t.request.url.substring(t.request.url.lastIndexOf('/')),
        i = n.request.url.substring(n.request.url.lastIndexOf('/'))
      return r.localeCompare(i)
    }
}
const Zu = {
  queryAll(e, t) {
    t.startsWith('/') && e.nodeType !== Node.DOCUMENT_NODE && (t = '.' + t)
    const n = [],
      r = e.ownerDocument || e
    if (!r) return n
    const i = r.evaluate(t, e, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE)
    for (let s = i.iterateNext(); s; s = i.iterateNext()) s.nodeType === Node.ELEMENT_NODE && n.push(s)
    return n
  },
}
function ka(e, t) {
  for (; t; ) {
    if (e.contains(t)) return !0
    t = uh(t)
  }
  return !1
}
function Ie(e) {
  if (e.parentElement) return e.parentElement
  if (e.parentNode && e.parentNode.nodeType === 11 && e.parentNode.host) return e.parentNode.host
}
function ah(e) {
  let t = e
  for (; t.parentNode; ) t = t.parentNode
  if (t.nodeType === 11 || t.nodeType === 9) return t
}
function uh(e) {
  for (; e.parentElement; ) e = e.parentElement
  return Ie(e)
}
function kr(e, t, n) {
  for (; e; ) {
    const r = e.closest(t)
    if (n && r !== n && r != null && r.contains(n)) return
    if (r) return r
    e = uh(e)
  }
}
function cn(e, t) {
  return e.ownerDocument && e.ownerDocument.defaultView ? e.ownerDocument.defaultView.getComputedStyle(e, t) : void 0
}
function ch(e, t) {
  if (((t = t ?? cn(e)), !t)) return !0
  if (Element.prototype.checkVisibility) {
    if (!e.checkVisibility({ checkOpacity: !1, checkVisibilityCSS: !1 })) return !1
  } else {
    const n = e.closest('details,summary')
    if (n !== e && (n == null ? void 0 : n.nodeName) === 'DETAILS' && !n.open) return !1
  }
  return t.visibility === 'visible'
}
function ks(e) {
  const t = cn(e)
  if (!t) return !0
  if (t.display === 'contents') {
    for (let r = e.firstChild; r; r = r.nextSibling)
      if ((r.nodeType === 1 && ks(r)) || (r.nodeType === 3 && fh(r))) return !0
    return !1
  }
  if (!ch(e, t)) return !1
  const n = e.getBoundingClientRect()
  return n.width > 0 && n.height > 0
}
function fh(e) {
  const t = e.ownerDocument.createRange()
  t.selectNode(e)
  const n = t.getBoundingClientRect()
  return n.width > 0 && n.height > 0
}
function ec(e) {
  return e.hasAttribute('aria-label') || e.hasAttribute('aria-labelledby')
}
const tc =
    'article:not([role]), aside:not([role]), main:not([role]), nav:not([role]), section:not([role]), [role=article], [role=complementary], [role=main], [role=navigation], [role=region]',
  oy = [
    'aria-atomic',
    'aria-busy',
    'aria-controls',
    'aria-current',
    'aria-describedby',
    'aria-details',
    'aria-disabled',
    'aria-dropeffect',
    'aria-errormessage',
    'aria-flowto',
    'aria-grabbed',
    'aria-haspopup',
    'aria-hidden',
    'aria-invalid',
    'aria-keyshortcuts',
    'aria-label',
    'aria-labelledby',
    'aria-live',
    'aria-owns',
    'aria-relevant',
    'aria-roledescription',
  ]
function dh(e) {
  return oy.some((t) => e.hasAttribute(t))
}
const wo = {
    A: (e) => (e.hasAttribute('href') ? 'link' : null),
    AREA: (e) => (e.hasAttribute('href') ? 'link' : null),
    ARTICLE: () => 'article',
    ASIDE: () => 'complementary',
    BLOCKQUOTE: () => 'blockquote',
    BUTTON: () => 'button',
    CAPTION: () => 'caption',
    CODE: () => 'code',
    DATALIST: () => 'listbox',
    DD: () => 'definition',
    DEL: () => 'deletion',
    DETAILS: () => 'group',
    DFN: () => 'term',
    DIALOG: () => 'dialog',
    DT: () => 'term',
    EM: () => 'emphasis',
    FIELDSET: () => 'group',
    FIGURE: () => 'figure',
    FOOTER: (e) => (kr(e, tc) ? null : 'contentinfo'),
    FORM: (e) => (ec(e) ? 'form' : null),
    H1: () => 'heading',
    H2: () => 'heading',
    H3: () => 'heading',
    H4: () => 'heading',
    H5: () => 'heading',
    H6: () => 'heading',
    HEADER: (e) => (kr(e, tc) ? null : 'banner'),
    HR: () => 'separator',
    HTML: () => 'document',
    IMG: (e) =>
      e.getAttribute('alt') === '' && !dh(e) && Number.isNaN(Number(String(e.getAttribute('tabindex'))))
        ? 'presentation'
        : 'img',
    INPUT: (e) => {
      const t = e.type.toLowerCase()
      if (t === 'search') return e.hasAttribute('list') ? 'combobox' : 'searchbox'
      if (['email', 'tel', 'text', 'url', ''].includes(t)) {
        const n = Ws(e, e.getAttribute('list'))[0]
        return n && n.tagName === 'DATALIST' ? 'combobox' : 'textbox'
      }
      return t === 'hidden'
        ? ''
        : {
            button: 'button',
            checkbox: 'checkbox',
            image: 'button',
            number: 'spinbutton',
            radio: 'radio',
            range: 'slider',
            reset: 'button',
            submit: 'button',
          }[t] || 'textbox'
    },
    INS: () => 'insertion',
    LI: () => 'listitem',
    MAIN: () => 'main',
    MARK: () => 'mark',
    MATH: () => 'math',
    MENU: () => 'list',
    METER: () => 'meter',
    NAV: () => 'navigation',
    OL: () => 'list',
    OPTGROUP: () => 'group',
    OPTION: () => 'option',
    OUTPUT: () => 'status',
    P: () => 'paragraph',
    PROGRESS: () => 'progressbar',
    SECTION: (e) => (ec(e) ? 'region' : null),
    SELECT: (e) => (e.hasAttribute('multiple') || e.size > 1 ? 'listbox' : 'combobox'),
    STRONG: () => 'strong',
    SUB: () => 'subscript',
    SUP: () => 'superscript',
    SVG: () => 'img',
    TABLE: () => 'table',
    TBODY: () => 'rowgroup',
    TD: (e) => {
      const t = kr(e, 'table'),
        n = t ? Ts(t) : ''
      return n === 'grid' || n === 'treegrid' ? 'gridcell' : 'cell'
    },
    TEXTAREA: () => 'textbox',
    TFOOT: () => 'rowgroup',
    TH: (e) => {
      if (e.getAttribute('scope') === 'col') return 'columnheader'
      if (e.getAttribute('scope') === 'row') return 'rowheader'
      const t = kr(e, 'table'),
        n = t ? Ts(t) : ''
      return n === 'grid' || n === 'treegrid' ? 'gridcell' : 'cell'
    },
    THEAD: () => 'rowgroup',
    TIME: () => 'time',
    TR: () => 'row',
    UL: () => 'list',
  },
  ly = {
    DD: ['DL', 'DIV'],
    DIV: ['DL'],
    DT: ['DL', 'DIV'],
    LI: ['OL', 'UL'],
    TBODY: ['TABLE'],
    TD: ['TR'],
    TFOOT: ['TABLE'],
    TH: ['TR'],
    THEAD: ['TABLE'],
    TR: ['THEAD', 'TBODY', 'TFOOT', 'TABLE'],
  }
function nc(e) {
  var r
  const t = ((r = wo[e.tagName.toUpperCase()]) == null ? void 0 : r.call(wo, e)) || ''
  if (!t) return null
  let n = e
  for (; n; ) {
    const i = Ie(n),
      s = ly[n.tagName]
    if (!s || !i || !s.includes(i.tagName)) break
    const o = Ts(i)
    if ((o === 'none' || o === 'presentation') && !hh(i)) return o
    n = i
  }
  return t
}
const ay = [
    'alert',
    'alertdialog',
    'application',
    'article',
    'banner',
    'blockquote',
    'button',
    'caption',
    'cell',
    'checkbox',
    'code',
    'columnheader',
    'combobox',
    'command',
    'complementary',
    'composite',
    'contentinfo',
    'definition',
    'deletion',
    'dialog',
    'directory',
    'document',
    'emphasis',
    'feed',
    'figure',
    'form',
    'generic',
    'grid',
    'gridcell',
    'group',
    'heading',
    'img',
    'input',
    'insertion',
    'landmark',
    'link',
    'list',
    'listbox',
    'listitem',
    'log',
    'main',
    'marquee',
    'math',
    'meter',
    'menu',
    'menubar',
    'menuitem',
    'menuitemcheckbox',
    'menuitemradio',
    'navigation',
    'none',
    'note',
    'option',
    'paragraph',
    'presentation',
    'progressbar',
    'radio',
    'radiogroup',
    'range',
    'region',
    'roletype',
    'row',
    'rowgroup',
    'rowheader',
    'scrollbar',
    'search',
    'searchbox',
    'section',
    'sectionhead',
    'select',
    'separator',
    'slider',
    'spinbutton',
    'status',
    'strong',
    'structure',
    'subscript',
    'superscript',
    'switch',
    'tab',
    'table',
    'tablist',
    'tabpanel',
    'term',
    'textbox',
    'time',
    'timer',
    'toolbar',
    'tooltip',
    'tree',
    'treegrid',
    'treeitem',
    'widget',
    'window',
  ],
  uy = [
    'command',
    'composite',
    'input',
    'landmark',
    'range',
    'roletype',
    'section',
    'sectionhead',
    'select',
    'structure',
    'widget',
    'window',
  ],
  cy = ay.filter((e) => !uy.includes(e))
function Ts(e) {
  return (
    (e.getAttribute('role') || '')
      .split(' ')
      .map((n) => n.trim())
      .find((n) => cy.includes(n)) || null
  )
}
function hh(e) {
  return !dh(e)
}
function $e(e) {
  const t = Ts(e)
  return !t || ((t === 'none' || t === 'presentation') && hh(e)) ? nc(e) : t
}
function ph(e) {
  return e === null ? void 0 : e.toLowerCase() === 'true'
}
function Ta(e) {
  if (['STYLE', 'SCRIPT', 'NOSCRIPT', 'TEMPLATE'].includes(e.tagName)) return !0
  const t = cn(e),
    n = e.nodeName === 'SLOT'
  if ((t == null ? void 0 : t.display) === 'contents' && !n) {
    for (let i = e.firstChild; i; i = i.nextSibling)
      if ((i.nodeType === 1 && !Ta(i)) || (i.nodeType === 3 && fh(i))) return !1
    return !0
  }
  return !(e.nodeName === 'OPTION' && !!e.closest('select')) && !n && !ch(e, t) ? !0 : mh(e)
}
function mh(e) {
  let t = Rt == null ? void 0 : Rt.get(e)
  if (t === void 0) {
    if (((t = !1), e.parentElement && e.parentElement.shadowRoot && !e.assignedSlot && (t = !0), !t)) {
      const n = cn(e)
      t = !n || n.display === 'none' || ph(e.getAttribute('aria-hidden')) === !0
    }
    if (!t) {
      const n = Ie(e)
      n && (t = mh(n))
    }
    Rt == null || Rt.set(e, t)
  }
  return t
}
function Ws(e, t) {
  if (!t) return []
  const n = ah(e)
  if (!n) return []
  try {
    const r = t.split(' ').filter((s) => !!s),
      i = new Set()
    for (const s of r) {
      const o = n.querySelector('#' + CSS.escape(s))
      o && i.add(o)
    }
    return [...i]
  } catch {
    return []
  }
}
function fy(e) {
  return e
    .replace(
      /\r\n/g,
      `
`,
    )
    .replace(/\u00A0/g, ' ')
    .replace(/\s\s+/g, ' ')
    .trim()
}
function rc(e, t) {
  const n = [...e.querySelectorAll(t)]
  for (const r of Ws(e, e.getAttribute('aria-owns'))) r.matches(t) && n.push(r), n.push(...r.querySelectorAll(t))
  return n
}
function ic(e) {
  if (!e) return ''
  const t = e.content
  if ((t[0] === "'" && t[t.length - 1] === "'") || (t[0] === '"' && t[t.length - 1] === '"')) {
    const n = t.substring(1, t.length - 1)
    return (e.display || 'inline') !== 'inline' ? ' ' + n + ' ' : n
  }
  return ''
}
function gh(e) {
  const t = e.getAttribute('aria-labelledby')
  return t === null ? null : Ws(e, t)
}
function dy(e, t) {
  const n = [
      'button',
      'cell',
      'checkbox',
      'columnheader',
      'gridcell',
      'heading',
      'link',
      'menuitem',
      'menuitemcheckbox',
      'menuitemradio',
      'option',
      'radio',
      'row',
      'rowheader',
      'switch',
      'tab',
      'tooltip',
      'treeitem',
    ].includes(e),
    r =
      t &&
      [
        '',
        'caption',
        'code',
        'contentinfo',
        'definition',
        'deletion',
        'emphasis',
        'insertion',
        'list',
        'listitem',
        'mark',
        'none',
        'paragraph',
        'presentation',
        'region',
        'row',
        'rowgroup',
        'section',
        'strong',
        'subscript',
        'superscript',
        'table',
        'term',
        'time',
      ].includes(e)
  return n || r
}
function Na(e, t) {
  const n = t ? Aa : Ca
  let r = n == null ? void 0 : n.get(e)
  return (
    r === void 0 &&
      ((r = ''),
      [
        'caption',
        'code',
        'definition',
        'deletion',
        'emphasis',
        'generic',
        'insertion',
        'mark',
        'paragraph',
        'presentation',
        'strong',
        'subscript',
        'suggestion',
        'superscript',
        'term',
        'time',
      ].includes($e(e) || '') ||
        (r = fy(
          et(e, {
            includeHidden: t,
            visitedElements: new Set(),
            embeddedInLabelledBy: 'none',
            embeddedInLabel: 'none',
            embeddedInTextAlternativeElement: !1,
            embeddedInTargetElement: 'self',
          }),
        )),
      n == null || n.set(e, r)),
    r
  )
}
function et(e, t) {
  if (t.visitedElements.has(e)) return ''
  const n = {
    ...t,
    embeddedInLabel: t.embeddedInLabel === 'self' ? 'descendant' : t.embeddedInLabel,
    embeddedInLabelledBy: t.embeddedInLabelledBy === 'self' ? 'descendant' : t.embeddedInLabelledBy,
    embeddedInTargetElement: t.embeddedInTargetElement === 'self' ? 'descendant' : t.embeddedInTargetElement,
  }
  if (!t.includeHidden && t.embeddedInLabelledBy !== 'self' && Ta(e)) return t.visitedElements.add(e), ''
  const r = gh(e)
  if (t.embeddedInLabelledBy === 'none') {
    const o = (r || [])
      .map((l) =>
        et(l, {
          ...t,
          embeddedInLabelledBy: 'self',
          embeddedInTargetElement: 'none',
          embeddedInLabel: 'none',
          embeddedInTextAlternativeElement: !1,
        }),
      )
      .join(' ')
    if (o) return o
  }
  const i = $e(e) || ''
  if (t.embeddedInLabel !== 'none' || t.embeddedInLabelledBy !== 'none') {
    const o = [...(e.labels || [])].includes(e),
      l = (r || []).includes(e)
    if (!o && !l) {
      if (i === 'textbox')
        return (
          t.visitedElements.add(e), e.tagName === 'INPUT' || e.tagName === 'TEXTAREA' ? e.value : e.textContent || ''
        )
      if (['combobox', 'listbox'].includes(i)) {
        t.visitedElements.add(e)
        let a
        if (e.tagName === 'SELECT') (a = [...e.selectedOptions]), !a.length && e.options.length && a.push(e.options[0])
        else {
          const u = i === 'combobox' ? rc(e, '*').find((c) => $e(c) === 'listbox') : e
          a = u ? rc(u, '[aria-selected="true"]').filter((c) => $e(c) === 'option') : []
        }
        return a.map((u) => et(u, n)).join(' ')
      }
      if (['progressbar', 'scrollbar', 'slider', 'spinbutton', 'meter'].includes(i))
        return (
          t.visitedElements.add(e),
          e.hasAttribute('aria-valuetext')
            ? e.getAttribute('aria-valuetext') || ''
            : e.hasAttribute('aria-valuenow')
            ? e.getAttribute('aria-valuenow') || ''
            : e.getAttribute('value') || ''
        )
      if (['menu'].includes(i)) return t.visitedElements.add(e), ''
    }
  }
  const s = e.getAttribute('aria-label') || ''
  if (s.trim()) return t.visitedElements.add(e), s
  if (!['presentation', 'none'].includes(i)) {
    if (e.tagName === 'INPUT' && ['button', 'submit', 'reset'].includes(e.type)) {
      t.visitedElements.add(e)
      const o = e.value || ''
      return o.trim()
        ? o
        : e.type === 'submit'
        ? 'Submit'
        : e.type === 'reset'
        ? 'Reset'
        : e.getAttribute('title') || ''
    }
    if (e.tagName === 'INPUT' && e.type === 'image') {
      t.visitedElements.add(e)
      const o = e.labels || []
      if (o.length && t.embeddedInLabelledBy === 'none')
        return [...o]
          .map((u) =>
            et(u, {
              ...t,
              embeddedInLabel: 'self',
              embeddedInTextAlternativeElement: !1,
              embeddedInLabelledBy: 'none',
              embeddedInTargetElement: 'none',
            }),
          )
          .filter((u) => !!u)
          .join(' ')
      const l = e.getAttribute('alt') || ''
      if (l.trim()) return l
      const a = e.getAttribute('title') || ''
      return a.trim() ? a : 'Submit'
    }
    if (!r && e.tagName === 'BUTTON') {
      t.visitedElements.add(e)
      const o = e.labels || []
      if (o.length)
        return [...o]
          .map((l) =>
            et(l, {
              ...t,
              embeddedInLabel: 'self',
              embeddedInTextAlternativeElement: !1,
              embeddedInLabelledBy: 'none',
              embeddedInTargetElement: 'none',
            }),
          )
          .filter((l) => !!l)
          .join(' ')
    }
    if (!r && (e.tagName === 'TEXTAREA' || e.tagName === 'SELECT' || e.tagName === 'INPUT')) {
      t.visitedElements.add(e)
      const o = e.labels || []
      if (o.length)
        return [...o]
          .map((c) =>
            et(c, {
              ...t,
              embeddedInLabel: 'self',
              embeddedInTextAlternativeElement: !1,
              embeddedInLabelledBy: 'none',
              embeddedInTargetElement: 'none',
            }),
          )
          .filter((c) => !!c)
          .join(' ')
      const l =
          (e.tagName === 'INPUT' && ['text', 'password', 'search', 'tel', 'email', 'url'].includes(e.type)) ||
          e.tagName === 'TEXTAREA',
        a = e.getAttribute('placeholder') || '',
        u = e.getAttribute('title') || ''
      return !l || u ? u : a
    }
    if (!r && e.tagName === 'FIELDSET') {
      t.visitedElements.add(e)
      for (let l = e.firstElementChild; l; l = l.nextElementSibling)
        if (l.tagName === 'LEGEND') return et(l, { ...n, embeddedInTextAlternativeElement: !0 })
      return e.getAttribute('title') || ''
    }
    if (!r && e.tagName === 'FIGURE') {
      t.visitedElements.add(e)
      for (let l = e.firstElementChild; l; l = l.nextElementSibling)
        if (l.tagName === 'FIGCAPTION') return et(l, { ...n, embeddedInTextAlternativeElement: !0 })
      return e.getAttribute('title') || ''
    }
    if (e.tagName === 'IMG') {
      t.visitedElements.add(e)
      const o = e.getAttribute('alt') || ''
      return o.trim() ? o : e.getAttribute('title') || ''
    }
    if (e.tagName === 'TABLE') {
      t.visitedElements.add(e)
      for (let l = e.firstElementChild; l; l = l.nextElementSibling)
        if (l.tagName === 'CAPTION') return et(l, { ...n, embeddedInTextAlternativeElement: !0 })
      const o = e.getAttribute('summary') || ''
      if (o) return o
    }
    if (e.tagName === 'AREA') {
      t.visitedElements.add(e)
      const o = e.getAttribute('alt') || ''
      return o.trim() ? o : e.getAttribute('title') || ''
    }
    if (e.tagName.toUpperCase() === 'SVG' || e.ownerSVGElement) {
      t.visitedElements.add(e)
      for (let o = e.firstElementChild; o; o = o.nextElementSibling)
        if (o.tagName.toUpperCase() === 'TITLE' && o.ownerSVGElement)
          return et(o, { ...n, embeddedInLabelledBy: 'self' })
    }
    if (e.ownerSVGElement && e.tagName.toUpperCase() === 'A') {
      const o = e.getAttribute('xlink:title') || ''
      if (o.trim()) return t.visitedElements.add(e), o
    }
  }
  if (
    dy(i, t.embeddedInTargetElement === 'descendant') ||
    t.embeddedInLabelledBy !== 'none' ||
    t.embeddedInLabel !== 'none' ||
    t.embeddedInTextAlternativeElement
  ) {
    t.visitedElements.add(e)
    const o = [],
      l = (c, p) => {
        var f
        if (!(p && c.assignedSlot))
          if (c.nodeType === 1) {
            const y = ((f = cn(c)) == null ? void 0 : f.display) || 'inline'
            let g = et(c, n)
            ;(y !== 'inline' || c.nodeName === 'BR') && (g = ' ' + g + ' '), o.push(g)
          } else c.nodeType === 3 && o.push(c.textContent || '')
      }
    o.push(ic(cn(e, '::before')))
    const a = e.nodeName === 'SLOT' ? e.assignedNodes() : []
    if (a.length) for (const c of a) l(c, !1)
    else {
      for (let c = e.firstChild; c; c = c.nextSibling) l(c, !0)
      if (e.shadowRoot) for (let c = e.shadowRoot.firstChild; c; c = c.nextSibling) l(c, !0)
      for (const c of Ws(e, e.getAttribute('aria-owns'))) l(c, !0)
    }
    o.push(ic(cn(e, '::after')))
    const u = o.join('')
    if (u.trim()) return u
  }
  if (!['presentation', 'none'].includes(i) || e.tagName === 'IFRAME') {
    t.visitedElements.add(e)
    const o = e.getAttribute('title') || ''
    if (o.trim()) return o
  }
  return t.visitedElements.add(e), ''
}
const vh = ['gridcell', 'option', 'row', 'tab', 'rowheader', 'columnheader', 'treeitem']
function hy(e) {
  return e.tagName === 'OPTION'
    ? e.selected
    : vh.includes($e(e) || '')
    ? ph(e.getAttribute('aria-selected')) === !0
    : !1
}
const yh = ['checkbox', 'menuitemcheckbox', 'option', 'radio', 'switch', 'menuitemradio', 'treeitem']
function py(e) {
  const t = wh(e, !0)
  return t === 'error' ? !1 : t
}
function wh(e, t) {
  if (t && e.tagName === 'INPUT' && e.indeterminate) return 'mixed'
  if (e.tagName === 'INPUT' && ['checkbox', 'radio'].includes(e.type)) return e.checked
  if (yh.includes($e(e) || '')) {
    const n = e.getAttribute('aria-checked')
    return n === 'true' ? !0 : t && n === 'mixed' ? 'mixed' : !1
  }
  return 'error'
}
const Sh = ['button']
function my(e) {
  if (Sh.includes($e(e) || '')) {
    const t = e.getAttribute('aria-pressed')
    if (t === 'true') return !0
    if (t === 'mixed') return 'mixed'
  }
  return !1
}
const Eh = [
  'application',
  'button',
  'checkbox',
  'combobox',
  'gridcell',
  'link',
  'listbox',
  'menuitem',
  'row',
  'rowheader',
  'tab',
  'treeitem',
  'columnheader',
  'menuitemcheckbox',
  'menuitemradio',
  'rowheader',
  'switch',
]
function gy(e) {
  if (e.tagName === 'DETAILS') return e.open
  if (Eh.includes($e(e) || '')) {
    const t = e.getAttribute('aria-expanded')
    return t === null ? 'none' : t === 'true'
  }
  return 'none'
}
const xh = ['heading', 'listitem', 'row', 'treeitem']
function vy(e) {
  const t = { H1: 1, H2: 2, H3: 3, H4: 4, H5: 5, H6: 6 }[e.tagName]
  if (t) return t
  if (xh.includes($e(e) || '')) {
    const n = e.getAttribute('aria-level'),
      r = n === null ? Number.NaN : Number(n)
    if (Number.isInteger(r) && r >= 1) return r
  }
  return 0
}
const yy = [
  'application',
  'button',
  'composite',
  'gridcell',
  'group',
  'input',
  'link',
  'menuitem',
  'scrollbar',
  'separator',
  'tab',
  'checkbox',
  'columnheader',
  'combobox',
  'grid',
  'listbox',
  'menu',
  'menubar',
  'menuitemcheckbox',
  'menuitemradio',
  'option',
  'radio',
  'radiogroup',
  'row',
  'rowheader',
  'searchbox',
  'select',
  'slider',
  'spinbutton',
  'switch',
  'tablist',
  'textbox',
  'toolbar',
  'tree',
  'treegrid',
  'treeitem',
]
function _h(e) {
  return ['BUTTON', 'INPUT', 'SELECT', 'TEXTAREA', 'OPTION', 'OPTGROUP'].includes(e.tagName) &&
    (e.hasAttribute('disabled') || kh(e))
    ? !0
    : Th(e)
}
function kh(e) {
  return e ? (e.tagName === 'FIELDSET' && e.hasAttribute('disabled') ? !0 : kh(e.parentElement)) : !1
}
function Th(e) {
  if (!e) return !1
  if (yy.includes($e(e) || '')) {
    const t = (e.getAttribute('aria-disabled') || '').toLowerCase()
    if (t === 'true') return !0
    if (t === 'false') return !1
  }
  return Th(Ie(e))
}
let Ca,
  Aa,
  Rt,
  Nh = 0
function Ch() {
  ++Nh, Ca ?? (Ca = new Map()), Aa ?? (Aa = new Map()), Rt ?? (Rt = new Map())
}
function Ah() {
  --Nh || ((Ca = void 0), (Aa = void 0), (Rt = void 0))
}
function Lh(e, t) {
  for (const n of t.jsonPath) e != null && (e = e[n])
  return bh(e, t)
}
function bh(e, t) {
  const n = typeof e == 'string' && !t.caseSensitive ? e.toUpperCase() : e,
    r = typeof t.value == 'string' && !t.caseSensitive ? t.value.toUpperCase() : t.value
  return t.op === '<truthy>'
    ? !!n
    : t.op === '='
    ? r instanceof RegExp
      ? typeof n == 'string' && !!n.match(r)
      : n === r
    : typeof n != 'string' || typeof r != 'string'
    ? !1
    : t.op === '*='
    ? n.includes(r)
    : t.op === '^='
    ? n.startsWith(r)
    : t.op === '$='
    ? n.endsWith(r)
    : t.op === '|='
    ? n === r || n.startsWith(r + '-')
    : t.op === '~='
    ? n.split(' ').includes(r)
    : !1
}
function La(e) {
  const t = e.ownerDocument
  return (
    e.nodeName === 'SCRIPT' || e.nodeName === 'NOSCRIPT' || e.nodeName === 'STYLE' || (t.head && t.head.contains(e))
  )
}
function De(e, t) {
  let n = e.get(t)
  if (n === void 0) {
    if (((n = { full: '', immediate: [] }), !La(t))) {
      let r = ''
      if (t instanceof HTMLInputElement && (t.type === 'submit' || t.type === 'button'))
        n = { full: t.value, immediate: [t.value] }
      else {
        for (let i = t.firstChild; i; i = i.nextSibling)
          i.nodeType === Node.TEXT_NODE
            ? ((n.full += i.nodeValue || ''), (r += i.nodeValue || ''))
            : (r && n.immediate.push(r), (r = ''), i.nodeType === Node.ELEMENT_NODE && (n.full += De(e, i).full))
        r && n.immediate.push(r), t.shadowRoot && (n.full += De(e, t.shadowRoot).full)
      }
    }
    e.set(t, n)
  }
  return n
}
function Vs(e, t, n) {
  if (La(t) || !n(De(e, t))) return 'none'
  for (let r = t.firstChild; r; r = r.nextSibling)
    if (r.nodeType === Node.ELEMENT_NODE && n(De(e, r))) return 'selfAndChildren'
  return t.shadowRoot && n(De(e, t.shadowRoot)) ? 'selfAndChildren' : 'self'
}
function Ih(e, t) {
  const n = gh(t)
  if (n) return n.map((s) => De(e, s))
  const r = t.getAttribute('aria-label')
  if (r !== null && r.trim()) return [{ full: r, immediate: [r] }]
  const i = t.nodeName === 'INPUT' && t.type !== 'hidden'
  if (['BUTTON', 'METER', 'OUTPUT', 'PROGRESS', 'SELECT', 'TEXTAREA'].includes(t.nodeName) || i) {
    const s = t.labels
    if (s) return [...s].map((o) => De(e, o))
  }
  return []
}
function sc(e) {
  return e.displayName || e.name || 'Anonymous'
}
function wy(e) {
  if (e.type)
    switch (typeof e.type) {
      case 'function':
        return sc(e.type)
      case 'string':
        return e.type
      case 'object':
        return e.type.displayName || (e.type.render ? sc(e.type.render) : '')
    }
  if (e._currentElement) {
    const t = e._currentElement.type
    if (typeof t == 'string') return t
    if (typeof t == 'function') return t.displayName || t.name || 'Anonymous'
  }
  return ''
}
function Sy(e) {
  var t
  return e.key ?? ((t = e._currentElement) == null ? void 0 : t.key)
}
function Ey(e) {
  if (e.child) {
    const n = []
    for (let r = e.child; r; r = r.sibling) n.push(r)
    return n
  }
  if (!e._currentElement) return []
  const t = (n) => {
    var i
    const r = (i = n._currentElement) == null ? void 0 : i.type
    return typeof r == 'function' || typeof r == 'string'
  }
  if (e._renderedComponent) {
    const n = e._renderedComponent
    return t(n) ? [n] : []
  }
  return e._renderedChildren ? [...Object.values(e._renderedChildren)].filter(t) : []
}
function xy(e) {
  var r
  const t = e.memoizedProps || ((r = e._currentElement) == null ? void 0 : r.props)
  if (!t || typeof t == 'string') return t
  const n = { ...t }
  return delete n.children, n
}
function Mh(e) {
  var r
  const t = { key: Sy(e), name: wy(e), children: Ey(e).map(Mh), rootElements: [], props: xy(e) },
    n = e.stateNode || e._hostNode || ((r = e._renderedComponent) == null ? void 0 : r._hostNode)
  if (n instanceof Element) t.rootElements.push(n)
  else for (const i of t.children) t.rootElements.push(...i.rootElements)
  return t
}
function Rh(e, t, n = []) {
  t(e) && n.push(e)
  for (const r of e.children) Rh(r, t, n)
  return n
}
function Ph(e, t = []) {
  const r = (e.ownerDocument || e).createTreeWalker(e, NodeFilter.SHOW_ELEMENT)
  do {
    const i = r.currentNode,
      s = i,
      o = Object.keys(s).find((a) => a.startsWith('__reactContainer') && s[a] !== null)
    if (o) t.push(s[o].stateNode.current)
    else {
      const a = '_reactRootContainer'
      s.hasOwnProperty(a) && s[a] !== null && t.push(s[a]._internalRoot.current)
    }
    if (i instanceof Element && i.hasAttribute('data-reactroot'))
      for (const a of Object.keys(i))
        (a.startsWith('__reactInternalInstance') || a.startsWith('__reactFiber')) && t.push(i[a])
    const l = i instanceof Element ? i.shadowRoot : null
    l && Ph(l, t)
  } while (r.nextNode())
  return t
}
const _y = {
  queryAll(e, t) {
    const { name: n, attributes: r } = un(t, !1),
      o = Ph(e.ownerDocument || e)
        .map((a) => Mh(a))
        .map((a) =>
          Rh(a, (u) => {
            const c = u.props ?? {}
            if ((u.key !== void 0 && (c.key = u.key), (n && u.name !== n) || u.rootElements.some((p) => !ka(e, p))))
              return !1
            for (const p of r) if (!Lh(c, p)) return !1
            return !0
          }),
        )
        .flat(),
      l = new Set()
    for (const a of o) for (const u of a.rootElements) l.add(u)
    return [...l]
  },
}
function $h(e, t) {
  const n = e.replace(/^[a-zA-Z]:/, '').replace(/\\/g, '/')
  let r = n.substring(n.lastIndexOf('/') + 1)
  return t && r.endsWith(t) && (r = r.substring(0, r.length - t.length)), r
}
function ky(e, t) {
  return t ? t.toUpperCase() : ''
}
const Ty = /(?:^|[-_/])(\w)/g,
  Oh = (e) => e && e.replace(Ty, ky)
function Ny(e) {
  function t(c) {
    const p = c.name || c._componentTag || c.__playwright_guessedName
    if (p) return p
    const f = c.__file
    if (f) return Oh($h(f, '.vue'))
  }
  function n(c, p) {
    return (c.type.__playwright_guessedName = p), p
  }
  function r(c) {
    var f, y, g, w
    const p = t(c.type || {})
    if (p) return p
    if (c.root === c) return 'Root'
    for (const x in (y = (f = c.parent) == null ? void 0 : f.type) == null ? void 0 : y.components)
      if (((g = c.parent) == null ? void 0 : g.type.components[x]) === c.type) return n(c, x)
    for (const x in (w = c.appContext) == null ? void 0 : w.components)
      if (c.appContext.components[x] === c.type) return n(c, x)
    return 'Anonymous Component'
  }
  function i(c) {
    return c._isBeingDestroyed || c.isUnmounted
  }
  function s(c) {
    return c.subTree.type.toString() === 'Symbol(Fragment)'
  }
  function o(c) {
    const p = []
    return (
      c.component && p.push(c.component),
      c.suspense && p.push(...o(c.suspense.activeBranch)),
      Array.isArray(c.children) &&
        c.children.forEach((f) => {
          f.component ? p.push(f.component) : p.push(...o(f))
        }),
      p.filter((f) => {
        var y
        return !i(f) && !((y = f.type.devtools) != null && y.hide)
      })
    )
  }
  function l(c) {
    return s(c) ? a(c.subTree) : [c.subTree.el]
  }
  function a(c) {
    if (!c.children) return []
    const p = []
    for (let f = 0, y = c.children.length; f < y; f++) {
      const g = c.children[f]
      g.component ? p.push(...l(g.component)) : g.el && p.push(g.el)
    }
    return p
  }
  function u(c) {
    return { name: r(c), children: o(c.subTree).map(u), rootElements: l(c), props: c.props }
  }
  return u(e)
}
function Cy(e) {
  function t(s) {
    const o = s.displayName || s.name || s._componentTag
    if (o) return o
    const l = s.__file
    if (l) return Oh($h(l, '.vue'))
  }
  function n(s) {
    const o = t(s.$options || s.fnOptions || {})
    return o || (s.$root === s ? 'Root' : 'Anonymous Component')
  }
  function r(s) {
    return s.$children
      ? s.$children
      : Array.isArray(s.subTree.children)
      ? s.subTree.children.filter((o) => !!o.component).map((o) => o.component)
      : []
  }
  function i(s) {
    return { name: n(s), children: r(s).map(i), rootElements: [s.$el], props: s._props }
  }
  return i(e)
}
function zh(e, t, n = []) {
  t(e) && n.push(e)
  for (const r of e.children) zh(r, t, n)
  return n
}
function Dh(e, t = []) {
  const r = (e.ownerDocument || e).createTreeWalker(e, NodeFilter.SHOW_ELEMENT),
    i = new Set()
  do {
    const s = r.currentNode
    s.__vue__ && i.add(s.__vue__.$root),
      s.__vue_app__ && s._vnode && s._vnode.component && t.push({ root: s._vnode.component, version: 3 })
    const o = s instanceof Element ? s.shadowRoot : null
    o && Dh(o, t)
  } while (r.nextNode())
  for (const s of i) t.push({ version: 2, root: s })
  return t
}
const Ay = {
    queryAll(e, t) {
      const n = e.ownerDocument || e,
        { name: r, attributes: i } = un(t, !1),
        l = Dh(n)
          .map((u) => (u.version === 3 ? Ny(u.root) : Cy(u.root)))
          .map((u) =>
            zh(u, (c) => {
              if ((r && c.name !== r) || c.rootElements.some((p) => !ka(e, p))) return !1
              for (const p of i) if (!Lh(c.props, p)) return !1
              return !0
            }),
          )
          .flat(),
        a = new Set()
      for (const u of l) for (const c of u.rootElements) a.add(c)
      return [...a]
    },
  },
  Fh = ['selected', 'checked', 'pressed', 'expanded', 'level', 'disabled', 'name', 'include-hidden']
Fh.sort()
function mr(e, t, n) {
  if (!t.includes(n))
    throw new Error(
      `"${e}" attribute is only supported for roles: ${t
        .slice()
        .sort()
        .map((r) => `"${r}"`)
        .join(', ')}`,
    )
}
function xn(e, t) {
  if (e.op !== '<truthy>' && !t.includes(e.value))
    throw new Error(`"${e.name}" must be one of ${t.map((n) => JSON.stringify(n)).join(', ')}`)
}
function _n(e, t) {
  if (!t.includes(e.op)) throw new Error(`"${e.name}" does not support "${e.op}" matcher`)
}
function Ly(e, t) {
  const n = { role: t }
  for (const r of e)
    switch (r.name) {
      case 'checked': {
        mr(r.name, yh, t),
          xn(r, [!0, !1, 'mixed']),
          _n(r, ['<truthy>', '=']),
          (n.checked = r.op === '<truthy>' ? !0 : r.value)
        break
      }
      case 'pressed': {
        mr(r.name, Sh, t),
          xn(r, [!0, !1, 'mixed']),
          _n(r, ['<truthy>', '=']),
          (n.pressed = r.op === '<truthy>' ? !0 : r.value)
        break
      }
      case 'selected': {
        mr(r.name, vh, t), xn(r, [!0, !1]), _n(r, ['<truthy>', '=']), (n.selected = r.op === '<truthy>' ? !0 : r.value)
        break
      }
      case 'expanded': {
        mr(r.name, Eh, t), xn(r, [!0, !1]), _n(r, ['<truthy>', '=']), (n.expanded = r.op === '<truthy>' ? !0 : r.value)
        break
      }
      case 'level': {
        if (
          (mr(r.name, xh, t),
          typeof r.value == 'string' && (r.value = +r.value),
          r.op !== '=' || typeof r.value != 'number' || Number.isNaN(r.value))
        )
          throw new Error('"level" attribute must be compared to a number')
        n.level = r.value
        break
      }
      case 'disabled': {
        xn(r, [!0, !1]), _n(r, ['<truthy>', '=']), (n.disabled = r.op === '<truthy>' ? !0 : r.value)
        break
      }
      case 'name': {
        if (r.op === '<truthy>') throw new Error('"name" attribute must have a value')
        if (typeof r.value != 'string' && !(r.value instanceof RegExp))
          throw new Error('"name" attribute must be a string or a regular expression')
        ;(n.name = r.value), (n.nameOp = r.op), (n.exact = r.caseSensitive)
        break
      }
      case 'include-hidden': {
        xn(r, [!0, !1]), _n(r, ['<truthy>', '=']), (n.includeHidden = r.op === '<truthy>' ? !0 : r.value)
        break
      }
      default:
        throw new Error(`Unknown attribute "${r.name}", must be one of ${Fh.map((i) => `"${i}"`).join(', ')}.`)
    }
  return n
}
function by(e, t, n) {
  const r = [],
    i = (o) => {
      if (
        $e(o) === t.role &&
        !(t.selected !== void 0 && hy(o) !== t.selected) &&
        !(t.checked !== void 0 && py(o) !== t.checked) &&
        !(t.pressed !== void 0 && my(o) !== t.pressed) &&
        !(t.expanded !== void 0 && gy(o) !== t.expanded) &&
        !(t.level !== void 0 && vy(o) !== t.level) &&
        !(t.disabled !== void 0 && _h(o) !== t.disabled) &&
        !(!t.includeHidden && Ta(o))
      ) {
        if (t.name !== void 0) {
          const l = be(Na(o, !!t.includeHidden))
          if (
            (typeof t.name == 'string' && (t.name = be(t.name)),
            n && !t.exact && t.nameOp === '=' && (t.nameOp = '*='),
            !bh(l, { name: '', jsonPath: [], op: t.nameOp || '=', value: t.name, caseSensitive: !!t.exact }))
          )
            return
        }
        r.push(o)
      }
    },
    s = (o) => {
      const l = []
      o.shadowRoot && l.push(o.shadowRoot)
      for (const a of o.querySelectorAll('*')) i(a), a.shadowRoot && l.push(a.shadowRoot)
      l.forEach(s)
    }
  return s(e), r
}
function oc(e) {
  return {
    queryAll: (t, n) => {
      const r = un(n, !0),
        i = r.name.toLowerCase()
      if (!i) throw new Error('Role must not be empty')
      const s = Ly(r.attributes, i)
      Ch()
      try {
        return by(t, s, e)
      } finally {
        Ah()
      }
    },
  }
}
function Iy(e, t, n) {
  const r = e.left - t.right
  if (!(r < 0 || (n !== void 0 && r > n))) return r + Math.max(t.bottom - e.bottom, 0) + Math.max(e.top - t.top, 0)
}
function My(e, t, n) {
  const r = t.left - e.right
  if (!(r < 0 || (n !== void 0 && r > n))) return r + Math.max(t.bottom - e.bottom, 0) + Math.max(e.top - t.top, 0)
}
function Ry(e, t, n) {
  const r = t.top - e.bottom
  if (!(r < 0 || (n !== void 0 && r > n))) return r + Math.max(e.left - t.left, 0) + Math.max(t.right - e.right, 0)
}
function Py(e, t, n) {
  const r = e.top - t.bottom
  if (!(r < 0 || (n !== void 0 && r > n))) return r + Math.max(e.left - t.left, 0) + Math.max(t.right - e.right, 0)
}
function $y(e, t, n) {
  const r = n === void 0 ? 50 : n
  let i = 0
  return (
    e.left - t.right >= 0 && (i += e.left - t.right),
    t.left - e.right >= 0 && (i += t.left - e.right),
    t.top - e.bottom >= 0 && (i += t.top - e.bottom),
    e.top - t.bottom >= 0 && (i += e.top - t.bottom),
    i > r ? void 0 : i
  )
}
const Oy = ['left-of', 'right-of', 'above', 'below', 'near']
function Uh(e, t, n, r) {
  const i = t.getBoundingClientRect(),
    s = { 'left-of': My, 'right-of': Iy, above: Ry, below: Py, near: $y }[e]
  let o
  for (const l of n) {
    if (l === t) continue
    const a = s(i, l.getBoundingClientRect(), r)
    a !== void 0 && (o === void 0 || a < o) && (o = a)
  }
  return o
}
class zy {
  constructor(t) {
    ;(this._engines = new Map()),
      (this._cacheQueryCSS = new Map()),
      (this._cacheMatches = new Map()),
      (this._cacheQuery = new Map()),
      (this._cacheMatchesSimple = new Map()),
      (this._cacheMatchesParents = new Map()),
      (this._cacheCallMatches = new Map()),
      (this._cacheCallQuery = new Map()),
      (this._cacheQuerySimple = new Map()),
      (this._cacheText = new Map()),
      (this._retainCacheCounter = 0)
    for (const [i, s] of t) this._engines.set(i, s)
    this._engines.set('not', Uy),
      this._engines.set('is', Tr),
      this._engines.set('where', Tr),
      this._engines.set('has', Dy),
      this._engines.set('scope', Fy),
      this._engines.set('light', jy),
      this._engines.set('visible', Hy),
      this._engines.set('text', By),
      this._engines.set('text-is', qy),
      this._engines.set('text-matches', Wy),
      this._engines.set('has-text', Vy),
      this._engines.set('right-of', gr('right-of')),
      this._engines.set('left-of', gr('left-of')),
      this._engines.set('above', gr('above')),
      this._engines.set('below', gr('below')),
      this._engines.set('near', gr('near')),
      this._engines.set('nth-match', Qy)
    const n = [...this._engines.keys()]
    n.sort()
    const r = [...nh]
    if ((r.sort(), n.join('|') !== r.join('|')))
      throw new Error(`Please keep customCSSNames in sync with evaluator engines: ${n.join('|')} vs ${r.join('|')}`)
  }
  begin() {
    ++this._retainCacheCounter
  }
  end() {
    --this._retainCacheCounter,
      this._retainCacheCounter ||
        (this._cacheQueryCSS.clear(),
        this._cacheMatches.clear(),
        this._cacheQuery.clear(),
        this._cacheMatchesSimple.clear(),
        this._cacheMatchesParents.clear(),
        this._cacheCallMatches.clear(),
        this._cacheCallQuery.clear(),
        this._cacheQuerySimple.clear(),
        this._cacheText.clear())
  }
  _cached(t, n, r, i) {
    t.has(n) || t.set(n, [])
    const s = t.get(n),
      o = s.find((a) => r.every((u, c) => a.rest[c] === u))
    if (o) return o.result
    const l = i()
    return s.push({ rest: r, result: l }), l
  }
  _checkSelector(t) {
    if (!(typeof t == 'object' && t && (Array.isArray(t) || ('simples' in t && t.simples.length))))
      throw new Error(`Malformed selector "${t}"`)
    return t
  }
  matches(t, n, r) {
    const i = this._checkSelector(n)
    this.begin()
    try {
      return this._cached(this._cacheMatches, t, [i, r.scope, r.pierceShadow, r.originalScope], () =>
        Array.isArray(i)
          ? this._matchesEngine(Tr, t, i, r)
          : (this._hasScopeClause(i) && (r = this._expandContextForScopeMatching(r)),
            this._matchesSimple(t, i.simples[i.simples.length - 1].selector, r)
              ? this._matchesParents(t, i, i.simples.length - 2, r)
              : !1),
      )
    } finally {
      this.end()
    }
  }
  query(t, n) {
    const r = this._checkSelector(n)
    this.begin()
    try {
      return this._cached(this._cacheQuery, r, [t.scope, t.pierceShadow, t.originalScope], () => {
        if (Array.isArray(r)) return this._queryEngine(Tr, t, r)
        this._hasScopeClause(r) && (t = this._expandContextForScopeMatching(t))
        const i = this._scoreMap
        this._scoreMap = new Map()
        let s = this._querySimple(t, r.simples[r.simples.length - 1].selector)
        return (
          (s = s.filter((o) => this._matchesParents(o, r, r.simples.length - 2, t))),
          this._scoreMap.size &&
            s.sort((o, l) => {
              const a = this._scoreMap.get(o),
                u = this._scoreMap.get(l)
              return a === u ? 0 : a === void 0 ? 1 : u === void 0 ? -1 : a - u
            }),
          (this._scoreMap = i),
          s
        )
      })
    } finally {
      this.end()
    }
  }
  _markScore(t, n) {
    this._scoreMap && this._scoreMap.set(t, n)
  }
  _hasScopeClause(t) {
    return t.simples.some((n) => n.selector.functions.some((r) => r.name === 'scope'))
  }
  _expandContextForScopeMatching(t) {
    if (t.scope.nodeType !== 1) return t
    const n = Ie(t.scope)
    return n ? { ...t, scope: n, originalScope: t.originalScope || t.scope } : t
  }
  _matchesSimple(t, n, r) {
    return this._cached(this._cacheMatchesSimple, t, [n, r.scope, r.pierceShadow, r.originalScope], () => {
      if (t === r.scope || (n.css && !this._matchesCSS(t, n.css))) return !1
      for (const i of n.functions) if (!this._matchesEngine(this._getEngine(i.name), t, i.args, r)) return !1
      return !0
    })
  }
  _querySimple(t, n) {
    return n.functions.length
      ? this._cached(this._cacheQuerySimple, n, [t.scope, t.pierceShadow, t.originalScope], () => {
          let r = n.css
          const i = n.functions
          r === '*' && i.length && (r = void 0)
          let s,
            o = -1
          r !== void 0
            ? (s = this._queryCSS(t, r))
            : ((o = i.findIndex((l) => this._getEngine(l.name).query !== void 0)),
              o === -1 && (o = 0),
              (s = this._queryEngine(this._getEngine(i[o].name), t, i[o].args)))
          for (let l = 0; l < i.length; l++) {
            if (l === o) continue
            const a = this._getEngine(i[l].name)
            a.matches !== void 0 && (s = s.filter((u) => this._matchesEngine(a, u, i[l].args, t)))
          }
          for (let l = 0; l < i.length; l++) {
            if (l === o) continue
            const a = this._getEngine(i[l].name)
            a.matches === void 0 && (s = s.filter((u) => this._matchesEngine(a, u, i[l].args, t)))
          }
          return s
        })
      : this._queryCSS(t, n.css || '*')
  }
  _matchesParents(t, n, r, i) {
    return r < 0
      ? !0
      : this._cached(this._cacheMatchesParents, t, [n, r, i.scope, i.pierceShadow, i.originalScope], () => {
          const { selector: s, combinator: o } = n.simples[r]
          if (o === '>') {
            const l = Li(t, i)
            return !l || !this._matchesSimple(l, s, i) ? !1 : this._matchesParents(l, n, r - 1, i)
          }
          if (o === '+') {
            const l = So(t, i)
            return !l || !this._matchesSimple(l, s, i) ? !1 : this._matchesParents(l, n, r - 1, i)
          }
          if (o === '') {
            let l = Li(t, i)
            for (; l; ) {
              if (this._matchesSimple(l, s, i)) {
                if (this._matchesParents(l, n, r - 1, i)) return !0
                if (n.simples[r - 1].combinator === '') break
              }
              l = Li(l, i)
            }
            return !1
          }
          if (o === '~') {
            let l = So(t, i)
            for (; l; ) {
              if (this._matchesSimple(l, s, i)) {
                if (this._matchesParents(l, n, r - 1, i)) return !0
                if (n.simples[r - 1].combinator === '~') break
              }
              l = So(l, i)
            }
            return !1
          }
          if (o === '>=') {
            let l = t
            for (; l; ) {
              if (this._matchesSimple(l, s, i)) {
                if (this._matchesParents(l, n, r - 1, i)) return !0
                if (n.simples[r - 1].combinator === '') break
              }
              l = Li(l, i)
            }
            return !1
          }
          throw new Error(`Unsupported combinator "${o}"`)
        })
  }
  _matchesEngine(t, n, r, i) {
    if (t.matches) return this._callMatches(t, n, r, i)
    if (t.query) return this._callQuery(t, r, i).includes(n)
    throw new Error('Selector engine should implement "matches" or "query"')
  }
  _queryEngine(t, n, r) {
    if (t.query) return this._callQuery(t, r, n)
    if (t.matches) return this._queryCSS(n, '*').filter((i) => this._callMatches(t, i, r, n))
    throw new Error('Selector engine should implement "matches" or "query"')
  }
  _callMatches(t, n, r, i) {
    return this._cached(this._cacheCallMatches, n, [t, i.scope, i.pierceShadow, i.originalScope, ...r], () =>
      t.matches(n, r, i, this),
    )
  }
  _callQuery(t, n, r) {
    return this._cached(this._cacheCallQuery, t, [r.scope, r.pierceShadow, r.originalScope, ...n], () =>
      t.query(r, n, this),
    )
  }
  _matchesCSS(t, n) {
    return t.matches(n)
  }
  _queryCSS(t, n) {
    return this._cached(this._cacheQueryCSS, n, [t.scope, t.pierceShadow, t.originalScope], () => {
      let r = []
      function i(s) {
        if (((r = r.concat([...s.querySelectorAll(n)])), !!t.pierceShadow)) {
          s.shadowRoot && i(s.shadowRoot)
          for (const o of s.querySelectorAll('*')) o.shadowRoot && i(o.shadowRoot)
        }
      }
      return i(t.scope), r
    })
  }
  _getEngine(t) {
    const n = this._engines.get(t)
    if (!n) throw new Error(`Unknown selector engine "${t}"`)
    return n
  }
}
const Tr = {
    matches(e, t, n, r) {
      if (t.length === 0) throw new Error('"is" engine expects non-empty selector list')
      return t.some((i) => r.matches(e, i, n))
    },
    query(e, t, n) {
      if (t.length === 0) throw new Error('"is" engine expects non-empty selector list')
      let r = []
      for (const i of t) r = r.concat(n.query(e, i))
      return t.length === 1 ? r : jh(r)
    },
  },
  Dy = {
    matches(e, t, n, r) {
      if (t.length === 0) throw new Error('"has" engine expects non-empty selector list')
      return r.query({ ...n, scope: e }, t).length > 0
    },
  },
  Fy = {
    matches(e, t, n, r) {
      if (t.length !== 0) throw new Error('"scope" engine expects no arguments')
      const i = n.originalScope || n.scope
      return i.nodeType === 9 ? e === i.documentElement : e === i
    },
    query(e, t, n) {
      if (t.length !== 0) throw new Error('"scope" engine expects no arguments')
      const r = e.originalScope || e.scope
      if (r.nodeType === 9) {
        const i = r.documentElement
        return i ? [i] : []
      }
      return r.nodeType === 1 ? [r] : []
    },
  },
  Uy = {
    matches(e, t, n, r) {
      if (t.length === 0) throw new Error('"not" engine expects non-empty selector list')
      return !r.matches(e, t, n)
    },
  },
  jy = {
    query(e, t, n) {
      return n.query({ ...e, pierceShadow: !1 }, t)
    },
    matches(e, t, n, r) {
      return r.matches(e, t, { ...n, pierceShadow: !1 })
    },
  },
  Hy = {
    matches(e, t, n, r) {
      if (t.length) throw new Error('"visible" engine expects no arguments')
      return ks(e)
    },
  },
  By = {
    matches(e, t, n, r) {
      if (t.length !== 1 || typeof t[0] != 'string') throw new Error('"text" engine expects a single string')
      const i = be(t[0]).toLowerCase(),
        s = (o) => be(o.full).toLowerCase().includes(i)
      return Vs(r._cacheText, e, s) === 'self'
    },
  },
  qy = {
    matches(e, t, n, r) {
      if (t.length !== 1 || typeof t[0] != 'string') throw new Error('"text-is" engine expects a single string')
      const i = be(t[0]),
        s = (o) => (!i && !o.immediate.length ? !0 : o.immediate.some((l) => be(l) === i))
      return Vs(r._cacheText, e, s) !== 'none'
    },
  },
  Wy = {
    matches(e, t, n, r) {
      if (t.length === 0 || typeof t[0] != 'string' || t.length > 2 || (t.length === 2 && typeof t[1] != 'string'))
        throw new Error('"text-matches" engine expects a regexp body and optional regexp flags')
      const i = new RegExp(t[0], t.length === 2 ? t[1] : void 0),
        s = (o) => i.test(o.full)
      return Vs(r._cacheText, e, s) === 'self'
    },
  },
  Vy = {
    matches(e, t, n, r) {
      if (t.length !== 1 || typeof t[0] != 'string') throw new Error('"has-text" engine expects a single string')
      if (La(e)) return !1
      const i = be(t[0]).toLowerCase()
      return ((o) => be(o.full).toLowerCase().includes(i))(De(r._cacheText, e))
    },
  }
function gr(e) {
  return {
    matches(t, n, r, i) {
      const s = n.length && typeof n[n.length - 1] == 'number' ? n[n.length - 1] : void 0,
        o = s === void 0 ? n : n.slice(0, n.length - 1)
      if (n.length < 1 + (s === void 0 ? 0 : 1))
        throw new Error(`"${e}" engine expects a selector list and optional maximum distance in pixels`)
      const l = i.query(r, o),
        a = Uh(e, t, l, s)
      return a === void 0 ? !1 : (i._markScore(t, a), !0)
    },
  }
}
const Qy = {
  query(e, t, n) {
    let r = t[t.length - 1]
    if (t.length < 2) throw new Error('"nth-match" engine expects non-empty selector list and an index argument')
    if (typeof r != 'number' || r < 1)
      throw new Error('"nth-match" engine expects a one-based index as the last argument')
    const i = Tr.query(e, t.slice(0, t.length - 1), n)
    return r--, r < i.length ? [i[r]] : []
  },
}
function Li(e, t) {
  if (e !== t.scope) return t.pierceShadow ? Ie(e) : e.parentElement || void 0
}
function So(e, t) {
  if (e !== t.scope) return e.previousElementSibling || void 0
}
function jh(e) {
  const t = new Map(),
    n = [],
    r = []
  function i(o) {
    let l = t.get(o)
    if (l) return l
    const a = Ie(o)
    return a ? i(a).children.push(o) : n.push(o), (l = { children: [], taken: !1 }), t.set(o, l), l
  }
  for (const o of e) i(o).taken = !0
  function s(o) {
    const l = t.get(o)
    if ((l.taken && r.push(o), l.children.length > 1)) {
      const a = new Set(l.children)
      l.children = []
      let u = o.firstElementChild
      for (; u && l.children.length < a.size; ) a.has(u) && l.children.push(u), (u = u.nextElementSibling)
      for (u = o.shadowRoot ? o.shadowRoot.firstElementChild : null; u && l.children.length < a.size; )
        a.has(u) && l.children.push(u), (u = u.nextElementSibling)
    }
    l.children.forEach(s)
  }
  return n.forEach(s), r
}
const Hh = new Map(),
  Bh = new Map(),
  qh = 10,
  rr = qh / 2,
  lc = 1,
  Xy = 2,
  Gy = 10,
  Ky = 50,
  Wh = 100,
  Vh = 120,
  Qh = 140,
  Xh = 160,
  El = 180,
  Gh = 200,
  Jy = 250,
  Yy = Wh + rr,
  Zy = Vh + rr,
  e0 = Qh + rr,
  t0 = Xh + rr,
  n0 = El + rr,
  r0 = Gh + rr,
  i0 = 300,
  s0 = 500,
  o0 = 510,
  Eo = 520,
  Kh = 530,
  Jh = 1e4,
  l0 = 1e7
function xl(e, t, n) {
  e._evaluator.begin(), Ch()
  try {
    t = kr(t, 'button,select,input,[role=button],[role=checkbox],[role=radio],a,[role=link]', n.root) || t
    const r = a0(e, t, n),
      i = Zh(r),
      s = e.parseSelector(i)
    return { selector: i, elements: e.querySelectorAll(s, n.root ?? t.ownerDocument) }
  } finally {
    Hh.clear(), Bh.clear(), Ah(), e._evaluator.end()
  }
}
function ac(e) {
  return e.filter((t) => t[0].selector[0] !== '/')
}
function a0(e, t, n) {
  if (n.root && !ka(n.root, t)) throw new Error("Target element must belong to the root's subtree")
  if (t === n.root) return [{ engine: 'css', selector: ':scope', score: 1 }]
  if (t.ownerDocument.documentElement === t) return [{ engine: 'css', selector: 'html', score: 1 }]
  const r = (s, o) => {
      const l = s === t
      let a = o ? c0(e, s, s === t) : []
      s !== t && (a = ac(a))
      const u = u0(e, s, n)
        .filter((f) => !n.omitInternalEngines || !f.engine.startsWith('internal:'))
        .map((f) => [f])
      let c = uc(e, n.root ?? t.ownerDocument, s, [...a, ...u], l)
      a = ac(a)
      const p = (f) => {
        const y = o && !f.length,
          g = [...f, ...u].filter((x) => (c ? Zt(x) < Zt(c) : !0))
        let w = g[0]
        if (w)
          for (let x = Ie(s); x && x !== n.root; x = Ie(x)) {
            const h = i(x, y)
            if (!h || (c && Zt([...h, ...w]) >= Zt(c))) continue
            if (((w = uc(e, x, s, g, l)), !w)) return
            const d = [...h, ...w]
            ;(!c || Zt(d) < Zt(c)) && (c = d)
          }
      }
      return p(a), s === t && a.length && p([]), c
    },
    i = (s, o) => {
      const l = o ? Hh : Bh
      let a = l.get(s)
      return a === void 0 && ((a = r(s, o)), l.set(s, a)), a
    }
  return i(t, !0) || f0(e, t, n)
}
function u0(e, t, n) {
  const r = []
  {
    for (const l of ['data-testid', 'data-test-id', 'data-test'])
      l !== n.testIdAttributeName &&
        t.getAttribute(l) &&
        r.push({ engine: 'css', selector: `[${l}=${vr(t.getAttribute(l))}]`, score: Xy })
    const o = t.getAttribute('id')
    o && !d0(o) && r.push({ engine: 'css', selector: Yh(o), score: s0 }),
      r.push({ engine: 'css', selector: We(t.nodeName.toLowerCase()), score: Kh })
  }
  if (t.nodeName === 'IFRAME') {
    for (const o of ['name', 'title'])
      t.getAttribute(o) &&
        r.push({ engine: 'css', selector: `${We(t.nodeName.toLowerCase())}[${o}=${vr(t.getAttribute(o))}]`, score: Gy })
    return (
      t.getAttribute(n.testIdAttributeName) &&
        r.push({
          engine: 'css',
          selector: `[${n.testIdAttributeName}=${vr(t.getAttribute(n.testIdAttributeName))}]`,
          score: lc,
        }),
      _l([r]),
      r
    )
  }
  if (
    (t.getAttribute(n.testIdAttributeName) &&
      r.push({
        engine: 'internal:testid',
        selector: `[${n.testIdAttributeName}=${we(t.getAttribute(n.testIdAttributeName), !0)}]`,
        score: lc,
      }),
    t.nodeName === 'INPUT' || t.nodeName === 'TEXTAREA')
  ) {
    const o = t
    o.placeholder &&
      (r.push({ engine: 'internal:attr', selector: `[placeholder=${we(o.placeholder, !1)}]`, score: Wh }),
      r.push({ engine: 'internal:attr', selector: `[placeholder=${we(o.placeholder, !0)}]`, score: Yy }))
  }
  const i = Ih(e._evaluator._cacheText, t)
  for (const o of i) {
    const l = o.full.trim()
    r.push({ engine: 'internal:label', selector: pt(l, !1), score: Vh }),
      r.push({ engine: 'internal:label', selector: pt(l, !0), score: Zy })
  }
  const s = $e(t)
  return (
    s && !['none', 'presentation'].includes(s) && r.push({ engine: 'internal:role', selector: s, score: o0 }),
    t.getAttribute('alt') &&
      ['APPLET', 'AREA', 'IMG', 'INPUT'].includes(t.nodeName) &&
      (r.push({ engine: 'internal:attr', selector: `[alt=${we(t.getAttribute('alt'), !1)}]`, score: Xh }),
      r.push({ engine: 'internal:attr', selector: `[alt=${we(t.getAttribute('alt'), !0)}]`, score: t0 })),
    t.getAttribute('name') &&
      [
        'BUTTON',
        'FORM',
        'FIELDSET',
        'FRAME',
        'IFRAME',
        'INPUT',
        'KEYGEN',
        'OBJECT',
        'OUTPUT',
        'SELECT',
        'TEXTAREA',
        'MAP',
        'META',
        'PARAM',
      ].includes(t.nodeName) &&
      r.push({
        engine: 'css',
        selector: `${We(t.nodeName.toLowerCase())}[name=${vr(t.getAttribute('name'))}]`,
        score: Eo,
      }),
    t.getAttribute('title') &&
      (r.push({ engine: 'internal:attr', selector: `[title=${we(t.getAttribute('title'), !1)}]`, score: Gh }),
      r.push({ engine: 'internal:attr', selector: `[title=${we(t.getAttribute('title'), !0)}]`, score: r0 })),
    ['INPUT', 'TEXTAREA'].includes(t.nodeName) &&
      t.getAttribute('type') !== 'hidden' &&
      t.getAttribute('type') &&
      r.push({
        engine: 'css',
        selector: `${We(t.nodeName.toLowerCase())}[type=${vr(t.getAttribute('type'))}]`,
        score: Eo,
      }),
    ['INPUT', 'TEXTAREA', 'SELECT'].includes(t.nodeName) &&
      t.getAttribute('type') !== 'hidden' &&
      r.push({ engine: 'css', selector: We(t.nodeName.toLowerCase()), score: Eo + 1 }),
    _l([r]),
    r
  )
}
function c0(e, t, n) {
  if (t.nodeName === 'SELECT') return []
  const r = [],
    i = be(De(e._evaluator._cacheText, t).full),
    s = i.substring(0, 80)
  if (s) {
    const l = pt(s, !1)
    n &&
      (r.push([{ engine: 'internal:text', selector: l, score: El }]),
      r.push([{ engine: 'internal:text', selector: pt(s, !0), score: n0 }]))
    const a = { engine: 'css', selector: We(t.nodeName.toLowerCase()), score: Kh }
    r.push([a, { engine: 'internal:has-text', selector: l, score: El }]),
      i.length <= 80 && r.push([a, { engine: 'internal:has-text', selector: '/^' + h0(i) + '$/', score: Jy }])
  }
  const o = $e(t)
  if (o && !['none', 'presentation'].includes(o)) {
    const l = Na(t, !1)
    l &&
      (r.push([{ engine: 'internal:role', selector: `${o}[name=${we(l, !1)}]`, score: Qh }]),
      r.push([{ engine: 'internal:role', selector: `${o}[name=${we(l, !0)}]`, score: e0 }]))
  }
  return _l(r), r
}
function Yh(e) {
  return /^[a-zA-Z][a-zA-Z0-9\-\_]+$/.test(e) ? '#' + e : `[id="${We(e)}"]`
}
function f0(e, t, n) {
  const r = n.root ?? t.ownerDocument,
    i = []
  function s(l) {
    const a = i.slice()
    l && a.unshift(l)
    const u = a.join(' > '),
      c = e.parseSelector(u)
    return e.querySelector(c, r, !1) === t ? u : void 0
  }
  function o(l) {
    const a = { engine: 'css', selector: l, score: l0 },
      u = e.parseSelector(l),
      c = e.querySelectorAll(u, r)
    if (c.length === 1) return [a]
    const p = { engine: 'nth', selector: String(c.indexOf(t)), score: Jh }
    return [a, p]
  }
  for (let l = t; l && l !== r; l = Ie(l)) {
    const a = l.nodeName.toLowerCase()
    let u = ''
    if (l.id) {
      const f = Yh(l.id),
        y = s(f)
      if (y) return o(y)
      u = f
    }
    const c = l.parentNode,
      p = [...l.classList]
    for (let f = 0; f < p.length; ++f) {
      const y = '.' + We(p.slice(0, f + 1).join('.')),
        g = s(y)
      if (g) return o(g)
      !u && c && c.querySelectorAll(y).length === 1 && (u = y)
    }
    if (c) {
      const f = [...c.children],
        g =
          f.filter((x) => x.nodeName.toLowerCase() === a).indexOf(l) === 0
            ? We(a)
            : `${We(a)}:nth-child(${1 + f.indexOf(l)})`,
        w = s(g)
      if (w) return o(w)
      u || (u = g)
    } else u || (u = We(a))
    i.unshift(u)
  }
  return o(s())
}
function vr(e) {
  return `"${We(e).replace(/\\ /g, ' ')}"`
}
function _l(e) {
  for (const t of e)
    for (const n of t) n.score > Ky && n.score < i0 && (n.score += Math.min(qh, (n.selector.length / 10) | 0))
}
function Zh(e) {
  const t = []
  let n = ''
  for (const { engine: r, selector: i } of e)
    t.length && (n !== 'css' || r !== 'css' || i.startsWith(':nth-match(')) && t.push('>>'),
      (n = r),
      r === 'css' ? t.push(i) : t.push(`${r}=${i}`)
  return t.join(' ')
}
function Zt(e) {
  let t = 0
  for (let n = 0; n < e.length; n++) t += e[n].score * (e.length - n)
  return t
}
function uc(e, t, n, r, i) {
  const s = r.map((l) => ({ tokens: l, score: Zt(l) }))
  s.sort((l, a) => l.score - a.score)
  let o = null
  for (const { tokens: l } of s) {
    const a = e.parseSelector(Zh(l)),
      u = e.querySelectorAll(a, t)
    if (u[0] === n && u.length === 1) return l
    const c = u.indexOf(n)
    if (!i || o || c === -1 || u.length > 5) continue
    const p = { engine: 'nth', selector: String(c), score: Jh }
    o = [...l, p]
  }
  return o
}
function d0(e) {
  let t,
    n = 0
  for (let r = 0; r < e.length; ++r) {
    const i = e[r]
    let s
    if (!(i === '-' || i === '_')) {
      if (
        (i >= 'a' && i <= 'z'
          ? (s = 'lower')
          : i >= 'A' && i <= 'Z'
          ? (s = 'upper')
          : i >= '0' && i <= '9'
          ? (s = 'digit')
          : (s = 'other'),
        s === 'lower' && t === 'upper')
      ) {
        t = s
        continue
      }
      t && t !== s && ++n, (t = s)
    }
  }
  return n >= e.length / 4
}
function h0(e) {
  return e.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
class kl {
  constructor(t) {
    ;(this._highlightEntries = []), (this._language = 'javascript'), (this._injectedScript = t)
    const n = t.document
    ;(this._isUnderTest = t.isUnderTest),
      (this._glassPaneElement = n.createElement('x-pw-glass')),
      (this._glassPaneElement.style.position = 'fixed'),
      (this._glassPaneElement.style.top = '0'),
      (this._glassPaneElement.style.right = '0'),
      (this._glassPaneElement.style.bottom = '0'),
      (this._glassPaneElement.style.left = '0'),
      (this._glassPaneElement.style.zIndex = '2147483647'),
      (this._glassPaneElement.style.pointerEvents = 'none'),
      (this._glassPaneElement.style.display = 'flex'),
      (this._glassPaneElement.style.backgroundColor = 'transparent'),
      (this._actionPointElement = n.createElement('x-pw-action-point')),
      this._actionPointElement.setAttribute('hidden', 'true'),
      (this._glassPaneShadow = this._glassPaneElement.attachShadow({ mode: this._isUnderTest ? 'open' : 'closed' })),
      this._glassPaneShadow.appendChild(this._actionPointElement)
    const r = n.createElement('style')
    ;(r.textContent = `
        x-pw-tooltip {
          align-items: center;
          backdrop-filter: blur(5px);
          background-color: rgba(0, 0, 0, 0.7);
          border-radius: 2px;
          box-shadow: rgba(0, 0, 0, 0.1) 0px 3.6px 3.7px,
                      rgba(0, 0, 0, 0.15) 0px 12.1px 12.3px,
                      rgba(0, 0, 0, 0.1) 0px -2px 4px,
                      rgba(0, 0, 0, 0.15) 0px -12.1px 24px,
                      rgba(0, 0, 0, 0.25) 0px 54px 55px;
          color: rgb(204, 204, 204);
          display: none;
          font-family: 'Dank Mono', 'Operator Mono', Inconsolata, 'Fira Mono',
                      'SF Mono', Monaco, 'Droid Sans Mono', 'Source Code Pro', monospace;
          font-size: 12.8px;
          font-weight: normal;
          left: 0;
          line-height: 1.5;
          max-width: 600px;
          padding: 3.2px 5.12px 3.2px;
          position: absolute;
          top: 0;
        }
        x-pw-action-point {
          position: absolute;
          width: 20px;
          height: 20px;
          background: red;
          border-radius: 10px;
          pointer-events: none;
          margin: -10px 0 0 -10px;
          z-index: 2;
        }
        *[hidden] {
          display: none !important;
        }
    `),
      this._glassPaneShadow.appendChild(r)
  }
  install() {
    this._injectedScript.document.documentElement.appendChild(this._glassPaneElement)
  }
  setLanguage(t) {
    this._language = t
  }
  runHighlightOnRaf(t) {
    this._rafRequest && cancelAnimationFrame(this._rafRequest),
      this.updateHighlight(
        this._injectedScript.querySelectorAll(t, this._injectedScript.document.documentElement),
        Kn(t),
        !1,
      ),
      (this._rafRequest = requestAnimationFrame(() => this.runHighlightOnRaf(t)))
  }
  uninstall() {
    this._rafRequest && cancelAnimationFrame(this._rafRequest), this._glassPaneElement.remove()
  }
  isInstalled() {
    return (
      this._glassPaneElement.parentElement === this._injectedScript.document.documentElement &&
      !this._glassPaneElement.nextElementSibling
    )
  }
  showActionPoint(t, n) {
    ;(this._actionPointElement.style.top = n + 'px'),
      (this._actionPointElement.style.left = t + 'px'),
      (this._actionPointElement.hidden = !1),
      this._isUnderTest && console.error('Action point for test: ' + JSON.stringify({ x: t, y: n }))
  }
  hideActionPoint() {
    this._actionPointElement.hidden = !0
  }
  clearHighlight() {
    var t, n
    for (const r of this._highlightEntries)
      (t = r.highlightElement) == null || t.remove(), (n = r.tooltipElement) == null || n.remove()
    this._highlightEntries = []
  }
  updateHighlight(t, n, r) {
    let i
    r ? (i = '#dc6f6f7f') : (i = t.length > 1 ? '#f6b26b7f' : '#6fa8dc7f'),
      this._innerUpdateHighlight(t, { color: i, tooltipText: n ? gn(this._language, n) : '' })
  }
  maskElements(t, n) {
    this._innerUpdateHighlight(t, { color: n || '#F0F' })
  }
  _innerUpdateHighlight(t, n) {
    if (!this._highlightIsUpToDate(t, n.tooltipText)) {
      this.clearHighlight()
      for (let r = 0; r < t.length; ++r) {
        const i = this._createHighlightElement()
        this._glassPaneShadow.appendChild(i)
        let s
        if (n.tooltipText) {
          ;(s = this._injectedScript.document.createElement('x-pw-tooltip')), this._glassPaneShadow.appendChild(s)
          const o = t.length > 1 ? ` [${r + 1} of ${t.length}]` : ''
          ;(s.textContent = n.tooltipText + o), (s.style.top = '0'), (s.style.left = '0'), (s.style.display = 'flex')
        }
        this._highlightEntries.push({
          targetElement: t[r],
          tooltipElement: s,
          highlightElement: i,
          tooltipText: n.tooltipText,
        })
      }
      for (const r of this._highlightEntries) {
        if (((r.box = r.targetElement.getBoundingClientRect()), !r.tooltipElement)) continue
        const i = r.tooltipElement.offsetWidth,
          s = r.tooltipElement.offsetHeight,
          o = this._glassPaneElement.offsetWidth,
          l = this._glassPaneElement.offsetHeight
        let a = r.box.left
        a + i > o - 5 && (a = o - i - 5)
        let u = r.box.bottom + 5
        u + s > l - 5 && (r.box.top > s + 5 ? (u = r.box.top - s - 5) : (u = l - 5 - s)),
          (r.tooltipTop = u),
          (r.tooltipLeft = a)
      }
      for (const r of this._highlightEntries) {
        r.tooltipElement &&
          ((r.tooltipElement.style.top = r.tooltipTop + 'px'), (r.tooltipElement.style.left = r.tooltipLeft + 'px'))
        const i = r.box
        ;(r.highlightElement.style.backgroundColor = n.color),
          (r.highlightElement.style.left = i.x + 'px'),
          (r.highlightElement.style.top = i.y + 'px'),
          (r.highlightElement.style.width = i.width + 'px'),
          (r.highlightElement.style.height = i.height + 'px'),
          (r.highlightElement.style.display = 'block'),
          this._isUnderTest &&
            console.error(
              'Highlight box for test: ' + JSON.stringify({ x: i.x, y: i.y, width: i.width, height: i.height }),
            )
      }
    }
  }
  _highlightIsUpToDate(t, n) {
    if (t.length !== this._highlightEntries.length) return !1
    for (let r = 0; r < this._highlightEntries.length; ++r) {
      if (n !== this._highlightEntries[r].tooltipText || t[r] !== this._highlightEntries[r].targetElement) return !1
      const i = this._highlightEntries[r].box
      if (!i) return !1
      const s = t[r].getBoundingClientRect()
      if (s.top !== i.top || s.right !== i.right || s.bottom !== i.bottom || s.left !== i.left) return !1
    }
    return !0
  }
  _createHighlightElement() {
    const t = this._injectedScript.document.createElement('x-pw-highlight')
    return (
      (t.style.position = 'absolute'),
      (t.style.top = '0'),
      (t.style.left = '0'),
      (t.style.width = '0'),
      (t.style.height = '0'),
      (t.style.boxSizing = 'border-box'),
      t
    )
  }
}
class ep {
  constructor(t, n, r, i, s, o, l) {
    ;(this.onGlobalListenersRemoved = new Set()),
      (this._testIdAttributeNameForStrictErrorAndConsoleCodegen = 'data-testid'),
      (this.window = t),
      (this.document = t.document),
      (this.isUnderTest = n),
      (this._sdkLanguage = r),
      (this._testIdAttributeNameForStrictErrorAndConsoleCodegen = i),
      (this._evaluator = new zy(new Map())),
      (this._engines = new Map()),
      this._engines.set('xpath', Zu),
      this._engines.set('xpath:light', Zu),
      this._engines.set('_react', _y),
      this._engines.set('_vue', Ay),
      this._engines.set('role', oc(!1)),
      this._engines.set('text', this._createTextEngine(!0, !1)),
      this._engines.set('text:light', this._createTextEngine(!1, !1)),
      this._engines.set('id', this._createAttributeEngine('id', !0)),
      this._engines.set('id:light', this._createAttributeEngine('id', !1)),
      this._engines.set('data-testid', this._createAttributeEngine('data-testid', !0)),
      this._engines.set('data-testid:light', this._createAttributeEngine('data-testid', !1)),
      this._engines.set('data-test-id', this._createAttributeEngine('data-test-id', !0)),
      this._engines.set('data-test-id:light', this._createAttributeEngine('data-test-id', !1)),
      this._engines.set('data-test', this._createAttributeEngine('data-test', !0)),
      this._engines.set('data-test:light', this._createAttributeEngine('data-test', !1)),
      this._engines.set('css', this._createCSSEngine()),
      this._engines.set('nth', { queryAll: () => [] }),
      this._engines.set('visible', this._createVisibleEngine()),
      this._engines.set('internal:control', this._createControlEngine()),
      this._engines.set('internal:has', this._createHasEngine()),
      this._engines.set('internal:has-not', this._createHasNotEngine()),
      this._engines.set('internal:and', { queryAll: () => [] }),
      this._engines.set('internal:or', { queryAll: () => [] }),
      this._engines.set('internal:chain', this._createInternalChainEngine()),
      this._engines.set('internal:label', this._createInternalLabelEngine()),
      this._engines.set('internal:text', this._createTextEngine(!0, !0)),
      this._engines.set('internal:has-text', this._createInternalHasTextEngine()),
      this._engines.set('internal:has-not-text', this._createInternalHasNotTextEngine()),
      this._engines.set('internal:attr', this._createNamedAttributeEngine()),
      this._engines.set('internal:testid', this._createNamedAttributeEngine()),
      this._engines.set('internal:role', oc(!0))
    for (const { name: a, engine: u } of l) this._engines.set(a, u)
    ;(this._stableRafCount = s),
      (this._browserName = o),
      this._setupGlobalListenersRemovalDetection(),
      this._setupHitTargetInterceptors(),
      n && (this.window.__injectedScript = this)
  }
  eval(t) {
    return this.window.eval(t)
  }
  testIdAttributeNameForStrictErrorAndConsoleCodegen() {
    return this._testIdAttributeNameForStrictErrorAndConsoleCodegen
  }
  parseSelector(t) {
    const n = Zr(t)
    return (
      mv(n, (r) => {
        if (!this._engines.has(r.name))
          throw this.createStacklessError(`Unknown engine "${r.name}" while parsing selector ${t}`)
      }),
      n
    )
  }
  generateSelector(t, n) {
    return xl(this, t, { ...n, testIdAttributeName: this._testIdAttributeNameForStrictErrorAndConsoleCodegen }).selector
  }
  querySelector(t, n, r) {
    const i = this.querySelectorAll(t, n)
    if (r && i.length > 1) throw this.strictModeViolationError(t, i)
    return i[0]
  }
  _queryNth(t, n) {
    const r = [...t]
    let i = +n.body
    return i === -1 && (i = r.length - 1), new Set(r.slice(i, i + 1))
  }
  _queryLayoutSelector(t, n, r) {
    const i = n.name,
      s = n.body,
      o = [],
      l = this.querySelectorAll(s.parsed, r)
    for (const a of t) {
      const u = Uh(i, a, l, s.distance)
      u !== void 0 && o.push({ element: a, score: u })
    }
    return o.sort((a, u) => a.score - u.score), new Set(o.map((a) => a.element))
  }
  querySelectorAll(t, n) {
    if (t.capture !== void 0) {
      if (t.parts.some((i) => i.name === 'nth'))
        throw this.createStacklessError("Can't query n-th element in a request with the capture.")
      const r = { parts: t.parts.slice(0, t.capture + 1) }
      if (t.capture < t.parts.length - 1) {
        const i = { parts: t.parts.slice(t.capture + 1) },
          s = { name: 'internal:has', body: { parsed: i }, source: Kn(i) }
        r.parts.push(s)
      }
      return this.querySelectorAll(r, n)
    }
    if (!n.querySelectorAll) throw this.createStacklessError('Node is not queryable.')
    if (t.capture !== void 0)
      throw this.createStacklessError('Internal error: there should not be a capture in the selector.')
    if (n.nodeType === 11 && t.parts.length === 1 && t.parts[0].name === 'css' && t.parts[0].source === ':scope')
      return [n]
    this._evaluator.begin()
    try {
      let r = new Set([n])
      for (const i of t.parts)
        if (i.name === 'nth') r = this._queryNth(r, i)
        else if (i.name === 'internal:and') {
          const s = this.querySelectorAll(i.body.parsed, n)
          r = new Set(s.filter((o) => r.has(o)))
        } else if (i.name === 'internal:or') {
          const s = this.querySelectorAll(i.body.parsed, n)
          r = new Set(jh(new Set([...r, ...s])))
        } else if (Oy.includes(i.name)) r = this._queryLayoutSelector(r, i, n)
        else {
          const s = new Set()
          for (const o of r) {
            const l = this._queryEngineAll(i, o)
            for (const a of l) s.add(a)
          }
          r = s
        }
      return [...r]
    } finally {
      this._evaluator.end()
    }
  }
  _queryEngineAll(t, n) {
    const r = this._engines.get(t.name).queryAll(n, t.body)
    for (const i of r)
      if (!('nodeName' in i))
        throw this.createStacklessError(`Expected a Node but got ${Object.prototype.toString.call(i)}`)
    return r
  }
  _createAttributeEngine(t, n) {
    const r = (i) => [
      { simples: [{ selector: { css: `[${t}=${JSON.stringify(i)}]`, functions: [] }, combinator: '' }] },
    ]
    return { queryAll: (i, s) => this._evaluator.query({ scope: i, pierceShadow: n }, r(s)) }
  }
  _createCSSEngine() {
    return { queryAll: (t, n) => this._evaluator.query({ scope: t, pierceShadow: !0 }, n) }
  }
  _createTextEngine(t, n) {
    return {
      queryAll: (i, s) => {
        const { matcher: o, kind: l } = Ii(s, n),
          a = []
        let u = null
        const c = (f) => {
          if (l === 'lax' && u && u.contains(f)) return !1
          const y = Vs(this._evaluator._cacheText, f, o)
          y === 'none' && (u = f), (y === 'self' || (y === 'selfAndChildren' && l === 'strict' && !n)) && a.push(f)
        }
        i.nodeType === Node.ELEMENT_NODE && c(i)
        const p = this._evaluator._queryCSS({ scope: i, pierceShadow: t }, '*')
        for (const f of p) c(f)
        return a
      },
    }
  }
  _createInternalHasTextEngine() {
    return {
      queryAll: (t, n) => {
        if (t.nodeType !== 1) return []
        const r = t,
          i = De(this._evaluator._cacheText, r),
          { matcher: s } = Ii(n, !0)
        return s(i) ? [r] : []
      },
    }
  }
  _createInternalHasNotTextEngine() {
    return {
      queryAll: (t, n) => {
        if (t.nodeType !== 1) return []
        const r = t,
          i = De(this._evaluator._cacheText, r),
          { matcher: s } = Ii(n, !0)
        return s(i) ? [] : [r]
      },
    }
  }
  _createInternalLabelEngine() {
    return {
      queryAll: (t, n) => {
        const { matcher: r } = Ii(n, !0)
        return this._evaluator
          ._queryCSS({ scope: t, pierceShadow: !0 }, '*')
          .filter((s) => Ih(this._evaluator._cacheText, s).some((o) => r(o)))
      },
    }
  }
  _createNamedAttributeEngine() {
    return {
      queryAll: (n, r) => {
        const i = un(r, !0)
        if (i.name || i.attributes.length !== 1) throw new Error('Malformed attribute selector: ' + r)
        const { name: s, value: o, caseSensitive: l } = i.attributes[0],
          a = l ? null : o.toLowerCase()
        let u
        return (
          o instanceof RegExp
            ? (u = (p) => !!p.match(o))
            : l
            ? (u = (p) => p === o)
            : (u = (p) => p.toLowerCase().includes(a)),
          this._evaluator._queryCSS({ scope: n, pierceShadow: !0 }, `[${s}]`).filter((p) => u(p.getAttribute(s)))
        )
      },
    }
  }
  _createControlEngine() {
    return {
      queryAll(t, n) {
        if (n === 'enter-frame') return []
        if (n === 'return-empty') return []
        if (n === 'component') return t.nodeType !== 1 ? [] : [t.childElementCount === 1 ? t.firstElementChild : t]
        throw new Error(`Internal error, unknown internal:control selector ${n}`)
      },
    }
  }
  _createHasEngine() {
    return { queryAll: (n, r) => (n.nodeType !== 1 ? [] : !!this.querySelector(r.parsed, n, !1) ? [n] : []) }
  }
  _createHasNotEngine() {
    return { queryAll: (n, r) => (n.nodeType !== 1 ? [] : !!this.querySelector(r.parsed, n, !1) ? [] : [n]) }
  }
  _createVisibleEngine() {
    return { queryAll: (n, r) => (n.nodeType !== 1 ? [] : ks(n) === !!r ? [n] : []) }
  }
  _createInternalChainEngine() {
    return { queryAll: (n, r) => this.querySelectorAll(r.parsed, n) }
  }
  extend(t, n) {
    const r = this.window.eval(`
    (() => {
      const module = {};
      ${t}
      return module.exports.default();
    })()`)
    return new r(this, n)
  }
  isVisible(t) {
    return ks(t)
  }
  async viewportRatio(t) {
    return await new Promise((n) => {
      const r = new IntersectionObserver((i) => {
        n(i[0].intersectionRatio), r.disconnect()
      })
      r.observe(t), requestAnimationFrame(() => {})
    })
  }
  pollRaf(t) {
    return this.poll(t, (n) => requestAnimationFrame(n))
  }
  poll(t, n) {
    return this._runAbortableTask((r) => {
      let i, s
      const o = new Promise((a, u) => {
          ;(i = a), (s = u)
        }),
        l = () => {
          if (!r.aborted)
            try {
              const a = t(r)
              a !== r.continuePolling ? i(a) : n(l)
            } catch (a) {
              r.log('  ' + a.message), s(a)
            }
        }
      return l(), o
    })
  }
  _runAbortableTask(t) {
    let n = [],
      r,
      i = !1
    const s = () => {
        r && (r(n), (n = []), (r = void 0))
      },
      o = () =>
        new Promise((c) => {
          ;(r = c), (n.length || i) && s()
        })
    let l = ''
    const a = {
      injectedScript: this,
      aborted: !1,
      continuePolling: Symbol('continuePolling'),
      log: (c) => {
        ;(l = c), n.push({ message: c }), s()
      },
      logRepeating: (c) => {
        c !== l && a.log(c)
      },
    }
    return {
      takeNextLogs: o,
      run: () => {
        const c = t(a)
        return (
          c.finally(() => {
            ;(i = !0), s()
          }),
          c
        )
      },
      cancel: () => {
        a.aborted = !0
      },
      takeLastLogs: () => n,
    }
  }
  getElementBorderWidth(t) {
    if (t.nodeType !== Node.ELEMENT_NODE || !t.ownerDocument || !t.ownerDocument.defaultView) return { left: 0, top: 0 }
    const n = t.ownerDocument.defaultView.getComputedStyle(t)
    return { left: parseInt(n.borderLeftWidth || '', 10), top: parseInt(n.borderTopWidth || '', 10) }
  }
  describeIFrameStyle(t) {
    if (!t.ownerDocument || !t.ownerDocument.defaultView) return 'error:notconnected'
    const n = t.ownerDocument.defaultView
    for (let i = t; i; i = Ie(i)) if (n.getComputedStyle(i).transform !== 'none') return 'transformed'
    const r = n.getComputedStyle(t)
    return {
      left: parseInt(r.borderLeftWidth || '', 10) + parseInt(r.paddingLeft || '', 10),
      top: parseInt(r.borderTopWidth || '', 10) + parseInt(r.paddingTop || '', 10),
    }
  }
  retarget(t, n) {
    let r = t.nodeType === Node.ELEMENT_NODE ? t : t.parentElement
    return r
      ? (n === 'none' ||
          (r.matches('input, textarea, select') ||
            (n === 'button-link'
              ? (r = r.closest('button, [role=button], a, [role=link]') || r)
              : (r = r.closest('button, [role=button], [role=checkbox], [role=radio]') || r)),
          n === 'follow-label' &&
            (!r.matches('input, textarea, button, select, [role=button], [role=checkbox], [role=radio]') &&
              !r.isContentEditable &&
              (r = r.closest('label') || r),
            r.nodeName === 'LABEL' && (r = r.control || r))),
        r)
      : null
  }
  waitForElementStatesAndPerformAction(t, n, r, i) {
    let s,
      o = 0,
      l = 0,
      a = 0
    return this.pollRaf((u) => {
      if (r) return u.log('    forcing action'), i(t, u)
      for (const c of n) {
        if (c !== 'stable') {
          const d = this.elementState(t, c)
          if (typeof d != 'boolean') return d
          if (!d) return u.logRepeating(`    element is not ${c} - waiting...`), u.continuePolling
          continue
        }
        const p = this.retarget(t, 'no-follow-label')
        if (!p) return 'error:notconnected'
        if (++o === 1) return u.continuePolling
        const f = performance.now()
        if (this._stableRafCount > 1 && f - a < 15) return u.continuePolling
        a = f
        const y = p.getBoundingClientRect(),
          g = { x: y.top, y: y.left, width: y.width, height: y.height }
        s && g.x === s.x && g.y === s.y && g.width === s.width && g.height === s.height ? ++l : (l = 0)
        const x = l >= this._stableRafCount,
          h = x || !s
        if (((s = g), h || u.logRepeating('    element is not stable - waiting...'), !x)) return u.continuePolling
      }
      return i(t, u)
    })
  }
  elementState(t, n) {
    const r = this.retarget(t, ['stable', 'visible', 'hidden'].includes(n) ? 'none' : 'follow-label')
    if (!r || !r.isConnected) return n === 'hidden' ? !0 : 'error:notconnected'
    if (n === 'visible') return this.isVisible(r)
    if (n === 'hidden') return !this.isVisible(r)
    const i = _h(r)
    if (n === 'disabled') return i
    if (n === 'enabled') return !i
    const s = !(['INPUT', 'TEXTAREA', 'SELECT'].includes(r.nodeName) && r.hasAttribute('readonly'))
    if (n === 'editable') return !i && s
    if (n === 'checked' || n === 'unchecked') {
      const o = n === 'checked',
        l = wh(r, !1)
      if (l === 'error') throw this.createStacklessError('Not a checkbox or radio button')
      return o === l
    }
    throw this.createStacklessError(`Unexpected element state "${n}"`)
  }
  selectOptions(t, n, r) {
    const i = this.retarget(n, 'follow-label')
    if (!i) return 'error:notconnected'
    if (i.nodeName.toLowerCase() !== 'select') throw this.createStacklessError('Element is not a <select> element')
    const s = i,
      o = [...s.options],
      l = []
    let a = t.slice()
    for (let u = 0; u < o.length; u++) {
      const c = o[u],
        p = (f) => {
          if (f instanceof Node) return c === f
          let y = !0
          return (
            f.valueOrLabel !== void 0 && (y = y && (f.valueOrLabel === c.value || f.valueOrLabel === c.label)),
            f.value !== void 0 && (y = y && f.value === c.value),
            f.label !== void 0 && (y = y && f.label === c.label),
            f.index !== void 0 && (y = y && f.index === u),
            y
          )
        }
      if (a.some(p))
        if ((l.push(c), s.multiple)) a = a.filter((f) => !p(f))
        else {
          a = []
          break
        }
    }
    return a.length
      ? (r.logRepeating('    did not find some options - waiting... '), r.continuePolling)
      : ((s.value = void 0),
        l.forEach((u) => (u.selected = !0)),
        r.log('    selected specified option(s)'),
        s.dispatchEvent(new Event('input', { bubbles: !0 })),
        s.dispatchEvent(new Event('change', { bubbles: !0 })),
        l.map((u) => u.value))
  }
  fill(t, n, r) {
    const i = this.retarget(n, 'follow-label')
    if (!i) return 'error:notconnected'
    if (i.nodeName.toLowerCase() === 'input') {
      const s = i,
        o = s.type.toLowerCase(),
        l = new Set(['color', 'date', 'time', 'datetime', 'datetime-local', 'month', 'range', 'week'])
      if (!new Set(['', 'email', 'number', 'password', 'search', 'tel', 'text', 'url']).has(o) && !l.has(o))
        throw (
          (r.log(`    input of type "${o}" cannot be filled`),
          this.createStacklessError(`Input of type "${o}" cannot be filled`))
        )
      if (o === 'number' && ((t = t.trim()), isNaN(Number(t))))
        throw this.createStacklessError('Cannot type text into input[type=number]')
      if (l.has(o)) {
        if (((t = t.trim()), s.focus(), (s.value = t), s.value !== t))
          throw this.createStacklessError('Malformed value')
        return (
          i.dispatchEvent(new Event('input', { bubbles: !0 })),
          i.dispatchEvent(new Event('change', { bubbles: !0 })),
          'done'
        )
      }
    } else if (i.nodeName.toLowerCase() !== 'textarea') {
      if (!i.isContentEditable)
        throw this.createStacklessError('Element is not an <input>, <textarea> or [contenteditable] element')
    }
    return this.selectText(i), 'needsinput'
  }
  selectText(t) {
    const n = this.retarget(t, 'follow-label')
    if (!n) return 'error:notconnected'
    if (n.nodeName.toLowerCase() === 'input') {
      const s = n
      return s.select(), s.focus(), 'done'
    }
    if (n.nodeName.toLowerCase() === 'textarea') {
      const s = n
      return (s.selectionStart = 0), (s.selectionEnd = s.value.length), s.focus(), 'done'
    }
    const r = n.ownerDocument.createRange()
    r.selectNodeContents(n)
    const i = n.ownerDocument.defaultView.getSelection()
    return i && (i.removeAllRanges(), i.addRange(r)), n.focus(), 'done'
  }
  _activelyFocused(t) {
    const n = t.getRootNode().activeElement,
      r = n === t && !!t.ownerDocument && t.ownerDocument.hasFocus()
    return { activeElement: n, isFocused: r }
  }
  focusNode(t, n) {
    if (!t.isConnected) return 'error:notconnected'
    if (t.nodeType !== Node.ELEMENT_NODE) throw this.createStacklessError('Node is not an element')
    const { activeElement: r, isFocused: i } = this._activelyFocused(t)
    if (
      (t.isContentEditable && !i && r && r.blur && r.blur(),
      t.focus(),
      t.focus(),
      n && !i && t.nodeName.toLowerCase() === 'input')
    )
      try {
        t.setSelectionRange(0, 0)
      } catch {}
    return 'done'
  }
  blurNode(t) {
    if (!t.isConnected) return 'error:notconnected'
    if (t.nodeType !== Node.ELEMENT_NODE) throw this.createStacklessError('Node is not an element')
    return t.blur(), 'done'
  }
  setInputFiles(t, n) {
    if (t.nodeType !== Node.ELEMENT_NODE) return 'Node is not of type HTMLElement'
    const r = t
    if (r.nodeName !== 'INPUT') return 'Not an <input> element'
    const i = r
    if ((i.getAttribute('type') || '').toLowerCase() !== 'file') return 'Not an input[type=file] element'
    const o = n.map((a) => {
        const u = Uint8Array.from(atob(a.buffer), (c) => c.charCodeAt(0))
        return new File([u], a.name, { type: a.mimeType })
      }),
      l = new DataTransfer()
    for (const a of o) l.items.add(a)
    ;(i.files = l.files),
      i.dispatchEvent(new Event('input', { bubbles: !0 })),
      i.dispatchEvent(new Event('change', { bubbles: !0 }))
  }
  expectHitTarget(t, n) {
    const r = []
    let i = n
    for (; i; ) {
      const c = ah(i)
      if (!c || (r.push(c), c.nodeType === 9)) break
      i = c.host
    }
    let s
    for (let c = r.length - 1; c >= 0; c--) {
      const p = r[c],
        f = p.elementsFromPoint(t.x, t.y),
        y = p.elementFromPoint(t.x, t.y)
      if (y && f[0] && Ie(y) === f[0]) {
        const w = this.window.getComputedStyle(y)
        ;(w == null ? void 0 : w.display) === 'contents' && f.unshift(y)
      }
      f[0] && f[0].shadowRoot === p && f[1] === y && f.shift()
      const g = f[0]
      if (!g || ((s = g), c && g !== r[c - 1].host)) break
    }
    const o = []
    for (; s && s !== n; ) o.push(s), (s = Ie(s))
    if (s === n) return 'done'
    const l = this.previewNode(o[0] || this.document.documentElement)
    let a,
      u = n
    for (; u; ) {
      const c = o.indexOf(u)
      if (c !== -1) {
        c > 1 && (a = this.previewNode(o[c - 1]))
        break
      }
      u = Ie(u)
    }
    return a ? { hitTargetDescription: `${l} from ${a} subtree` } : { hitTargetDescription: l }
  }
  setupHitTargetInterceptor(t, n, r, i) {
    const s = this.retarget(t, 'button-link')
    if (!s || !s.isConnected) return 'error:notconnected'
    if (r) {
      const c = this.expectHitTarget(r, s)
      if (c !== 'done') return c.hitTargetDescription
    }
    if (n === 'drag') return { stop: () => 'done' }
    const o = { hover: tp, tap: np, mouse: rp }[n]
    let l
    const a = (c) => {
        if (!o.has(c.type) || !c.isTrusted) return
        const p = this.window.TouchEvent && c instanceof this.window.TouchEvent ? c.touches[0] : c
        l === void 0 && p && (l = this.expectHitTarget({ x: p.clientX, y: p.clientY }, s)),
          (i || (l !== 'done' && l !== void 0)) &&
            (c.preventDefault(), c.stopPropagation(), c.stopImmediatePropagation())
      },
      u = () => (this._hitTargetInterceptor === a && (this._hitTargetInterceptor = void 0), l || 'done')
    return (this._hitTargetInterceptor = a), { stop: u }
  }
  dispatchEvent(t, n, r) {
    let i
    switch (((r = { bubbles: !0, cancelable: !0, composed: !0, ...r }), g0.get(n))) {
      case 'mouse':
        i = new MouseEvent(n, r)
        break
      case 'keyboard':
        i = new KeyboardEvent(n, r)
        break
      case 'touch':
        i = new TouchEvent(n, r)
        break
      case 'pointer':
        i = new PointerEvent(n, r)
        break
      case 'focus':
        i = new FocusEvent(n, r)
        break
      case 'drag':
        i = new DragEvent(n, r)
        break
      case 'wheel':
        i = new WheelEvent(n, r)
        break
      default:
        i = new Event(n, r)
        break
    }
    t.dispatchEvent(i)
  }
  previewNode(t) {
    if (t.nodeType === Node.TEXT_NODE) return bi(`#text=${t.nodeValue || ''}`)
    if (t.nodeType !== Node.ELEMENT_NODE) return bi(`<${t.nodeName.toLowerCase()} />`)
    const n = t,
      r = []
    for (let a = 0; a < n.attributes.length; a++) {
      const { name: u, value: c } = n.attributes[a]
      u !== 'style' && (!c && m0.has(u) ? r.push(` ${u}`) : r.push(` ${u}="${c}"`))
    }
    r.sort((a, u) => a.length - u.length)
    let i = r.join('')
    if ((i.length > 50 && (i = i.substring(0, 49) + '…'), p0.has(n.nodeName)))
      return bi(`<${n.nodeName.toLowerCase()}${i}/>`)
    const s = n.childNodes
    let o = !1
    if (s.length <= 5) {
      o = !0
      for (let a = 0; a < s.length; a++) o = o && s[a].nodeType === Node.TEXT_NODE
    }
    let l = o ? n.textContent || '' : s.length ? '…' : ''
    return (
      l.length > 50 && (l = l.substring(0, 49) + '…'),
      bi(`<${n.nodeName.toLowerCase()}${i}>${l}</${n.nodeName.toLowerCase()}>`)
    )
  }
  strictModeViolationError(t, n) {
    const r = n.slice(0, 10).map((s) => ({ preview: this.previewNode(s), selector: this.generateSelector(s) })),
      i = r.map(
        (s, o) => `
    ${o + 1}) ${s.preview} aka ${gn(this._sdkLanguage, s.selector)}`,
      )
    return (
      r.length < n.length &&
        i.push(`
    ...`),
      this.createStacklessError(`strict mode violation: ${gn(this._sdkLanguage, Kn(t))} resolved to ${
        n.length
      } elements:${i.join('')}
`)
    )
  }
  createStacklessError(t) {
    if (this._browserName === 'firefox') {
      const r = new Error('Error: ' + t)
      return (r.stack = ''), r
    }
    const n = new Error(t)
    return delete n.stack, n
  }
  maskSelectors(t, n) {
    this._highlight && this.hideHighlight(), (this._highlight = new kl(this)), this._highlight.install()
    const r = []
    for (const i of t) r.push(this.querySelectorAll(i, this.document.documentElement))
    this._highlight.maskElements(r.flat(), n)
  }
  highlight(t) {
    this._highlight || ((this._highlight = new kl(this)), this._highlight.install()),
      this._highlight.runHighlightOnRaf(t)
  }
  hideHighlight() {
    this._highlight && (this._highlight.uninstall(), delete this._highlight)
  }
  markTargetElements(t, n) {
    const r = new CustomEvent('__playwright_target__', { bubbles: !0, cancelable: !0, detail: n, composed: !0 })
    for (const i of t) i.dispatchEvent(r)
  }
  _setupGlobalListenersRemovalDetection() {
    const t = '__playwright_global_listeners_check__'
    let n = !1
    const r = () => (n = !0)
    this.window.addEventListener(t, r),
      new MutationObserver((i) => {
        if (
          i.some((o) => Array.from(o.addedNodes).includes(this.document.documentElement)) &&
          ((n = !1), this.window.dispatchEvent(new CustomEvent(t)), !n)
        ) {
          this.window.addEventListener(t, r)
          for (const o of this.onGlobalListenersRemoved) o()
        }
      }).observe(this.document, { childList: !0 })
  }
  _setupHitTargetInterceptors() {
    const t = (r) => {
        var i
        return (i = this._hitTargetInterceptor) == null ? void 0 : i.call(this, r)
      },
      n = () => {
        for (const r of v0) this.window.addEventListener(r, t, { capture: !0, passive: !1 })
      }
    n(), this.onGlobalListenersRemoved.add(n)
  }
  async expect(t, n, r) {
    return n.expression === 'to.have.count' || n.expression.endsWith('.array')
      ? this.expectArray(r, n)
      : t
      ? await this.expectSingleElement(t, n)
      : !n.isNot && n.expression === 'to.be.hidden'
      ? { matches: !0 }
      : n.isNot && n.expression === 'to.be.visible'
      ? { matches: !1 }
      : !n.isNot && n.expression === 'to.be.detached'
      ? { matches: !0 }
      : n.isNot && n.expression === 'to.be.attached'
      ? { matches: !1 }
      : n.isNot && n.expression === 'to.be.in.viewport'
      ? { matches: !1 }
      : { matches: n.isNot, missingRecevied: !0 }
  }
  async expectSingleElement(t, n) {
    var i
    const r = n.expression
    {
      let s
      if (
        (r === 'to.be.checked'
          ? (s = this.elementState(t, 'checked'))
          : r === 'to.be.unchecked'
          ? (s = this.elementState(t, 'unchecked'))
          : r === 'to.be.disabled'
          ? (s = this.elementState(t, 'disabled'))
          : r === 'to.be.editable'
          ? (s = this.elementState(t, 'editable'))
          : r === 'to.be.readonly'
          ? (s = !this.elementState(t, 'editable'))
          : r === 'to.be.empty'
          ? t.nodeName === 'INPUT' || t.nodeName === 'TEXTAREA'
            ? (s = !t.value)
            : (s = !((i = t.textContent) != null && i.trim()))
          : r === 'to.be.enabled'
          ? (s = this.elementState(t, 'enabled'))
          : r === 'to.be.focused'
          ? (s = this._activelyFocused(t).isFocused)
          : r === 'to.be.hidden'
          ? (s = this.elementState(t, 'hidden'))
          : r === 'to.be.visible'
          ? (s = this.elementState(t, 'visible'))
          : r === 'to.be.attached'
          ? (s = !0)
          : r === 'to.be.detached' && (s = !1),
        s !== void 0)
      ) {
        if (s === 'error:notcheckbox') throw this.createStacklessError('Element is not a checkbox')
        if (s === 'error:notconnected') throw this.createStacklessError('Element is not connected')
        return { received: s, matches: s }
      }
    }
    if (r === 'to.have.property') {
      const s = t[n.expressionArg],
        o = Tl(s, n.expectedValue)
      return { received: s, matches: o }
    }
    if (r === 'to.be.in.viewport') {
      const s = await this.viewportRatio(t)
      return { received: `viewport ratio ${s}`, matches: s > 0 && s > (n.expectedNumber ?? 0) - 1e-9 }
    }
    if (r === 'to.have.values') {
      if (((t = this.retarget(t, 'follow-label')), t.nodeName !== 'SELECT' || !t.multiple))
        throw this.createStacklessError('Not a select element with a multiple attribute')
      const s = [...t.selectedOptions].map((o) => o.value)
      return s.length !== n.expectedText.length
        ? { received: s, matches: !1 }
        : { received: s, matches: s.map((o, l) => new xo(n.expectedText[l]).matches(o)).every(Boolean) }
    }
    {
      let s
      if (r === 'to.have.attribute') {
        const o = t.getAttribute(n.expressionArg)
        if (o === null) return { received: null, matches: !1 }
        s = o
      } else if (r === 'to.have.class') s = t.classList.toString()
      else if (r === 'to.have.css') s = this.window.getComputedStyle(t).getPropertyValue(n.expressionArg)
      else if (r === 'to.have.id') s = t.id
      else if (r === 'to.have.text') s = n.useInnerText ? t.innerText : De(new Map(), t).full
      else if (r === 'to.have.title') s = this.document.title
      else if (r === 'to.have.url') s = this.document.location.href
      else if (r === 'to.have.value') {
        if (
          ((t = this.retarget(t, 'follow-label')),
          t.nodeName !== 'INPUT' && t.nodeName !== 'TEXTAREA' && t.nodeName !== 'SELECT')
        )
          throw this.createStacklessError('Not an input element')
        s = t.value
      }
      if (s !== void 0 && n.expectedText) {
        const o = new xo(n.expectedText[0])
        return { received: s, matches: o.matches(s) }
      }
    }
    throw this.createStacklessError('Unknown expect matcher: ' + r)
  }
  expectArray(t, n) {
    const r = n.expression
    if (r === 'to.have.count') {
      const s = t.length,
        o = s === n.expectedNumber
      return { received: s, matches: o }
    }
    let i
    if (
      (r === 'to.have.text.array' || r === 'to.contain.text.array'
        ? (i = t.map((s) => (n.useInnerText ? s.innerText : De(new Map(), s).full)))
        : r === 'to.have.class.array' && (i = t.map((s) => s.classList.toString())),
      i && n.expectedText)
    ) {
      const s = r !== 'to.contain.text.array'
      if (!(i.length === n.expectedText.length || !s)) return { received: i, matches: !1 }
      const l = n.expectedText.map((c) => new xo(c))
      let a = 0,
        u = 0
      for (; a < l.length && u < i.length; ) l[a].matches(i[u]) && ++a, ++u
      return { received: i, matches: a === l.length }
    }
    throw this.createStacklessError('Unknown expect matcher: ' + r)
  }
  getElementAccessibleName(t, n) {
    return Na(t, !!n)
  }
  getAriaRole(t) {
    return $e(t)
  }
}
const p0 = new Set([
    'AREA',
    'BASE',
    'BR',
    'COL',
    'COMMAND',
    'EMBED',
    'HR',
    'IMG',
    'INPUT',
    'KEYGEN',
    'LINK',
    'MENUITEM',
    'META',
    'PARAM',
    'SOURCE',
    'TRACK',
    'WBR',
  ]),
  m0 = new Set(['checked', 'selected', 'disabled', 'readonly', 'multiple'])
function bi(e) {
  return e.replace(/\n/g, '↵').replace(/\t/g, '⇆')
}
const g0 = new Map([
    ['auxclick', 'mouse'],
    ['click', 'mouse'],
    ['dblclick', 'mouse'],
    ['mousedown', 'mouse'],
    ['mouseeenter', 'mouse'],
    ['mouseleave', 'mouse'],
    ['mousemove', 'mouse'],
    ['mouseout', 'mouse'],
    ['mouseover', 'mouse'],
    ['mouseup', 'mouse'],
    ['mouseleave', 'mouse'],
    ['mousewheel', 'mouse'],
    ['keydown', 'keyboard'],
    ['keyup', 'keyboard'],
    ['keypress', 'keyboard'],
    ['textInput', 'keyboard'],
    ['touchstart', 'touch'],
    ['touchmove', 'touch'],
    ['touchend', 'touch'],
    ['touchcancel', 'touch'],
    ['pointerover', 'pointer'],
    ['pointerout', 'pointer'],
    ['pointerenter', 'pointer'],
    ['pointerleave', 'pointer'],
    ['pointerdown', 'pointer'],
    ['pointerup', 'pointer'],
    ['pointermove', 'pointer'],
    ['pointercancel', 'pointer'],
    ['gotpointercapture', 'pointer'],
    ['lostpointercapture', 'pointer'],
    ['focus', 'focus'],
    ['blur', 'focus'],
    ['drag', 'drag'],
    ['dragstart', 'drag'],
    ['dragend', 'drag'],
    ['dragover', 'drag'],
    ['dragenter', 'drag'],
    ['dragleave', 'drag'],
    ['dragexit', 'drag'],
    ['drop', 'drag'],
    ['wheel', 'wheel'],
  ]),
  tp = new Set(['mousemove']),
  np = new Set(['pointerdown', 'pointerup', 'touchstart', 'touchend', 'touchcancel']),
  rp = new Set(['mousedown', 'mouseup', 'pointerdown', 'pointerup', 'click', 'auxclick', 'dblclick', 'contextmenu']),
  v0 = new Set([...tp, ...np, ...rp])
function y0(e) {
  if (((e = e.substring(1, e.length - 1)), !e.includes('\\'))) return e
  const t = []
  let n = 0
  for (; n < e.length; ) e[n] === '\\' && n + 1 < e.length && n++, t.push(e[n++])
  return t.join('')
}
function Ii(e, t) {
  if (e[0] === '/' && e.lastIndexOf('/') > 0) {
    const i = e.lastIndexOf('/'),
      s = new RegExp(e.substring(1, i), e.substring(i + 1))
    return { matcher: (o) => s.test(o.full), kind: 'regex' }
  }
  const n = t ? JSON.parse.bind(JSON) : y0
  let r = !1
  return (
    e.length > 1 && e[0] === '"' && e[e.length - 1] === '"'
      ? ((e = n(e)), (r = !0))
      : t && e.length > 1 && e[0] === '"' && e[e.length - 2] === '"' && e[e.length - 1] === 'i'
      ? ((e = n(e.substring(0, e.length - 1))), (r = !1))
      : t && e.length > 1 && e[0] === '"' && e[e.length - 2] === '"' && e[e.length - 1] === 's'
      ? ((e = n(e.substring(0, e.length - 1))), (r = !0))
      : e.length > 1 && e[0] === "'" && e[e.length - 1] === "'" && ((e = n(e)), (r = !0)),
    (e = be(e)),
    r
      ? t
        ? { kind: 'strict', matcher: (s) => be(s.full) === e }
        : { matcher: (s) => (!e && !s.immediate.length ? !0 : s.immediate.some((o) => be(o) === e)), kind: 'strict' }
      : ((e = e.toLowerCase()), { kind: 'lax', matcher: (i) => be(i.full).toLowerCase().includes(e) })
  )
}
class xo {
  constructor(t) {
    if (
      ((this._normalizeWhiteSpace = t.normalizeWhiteSpace),
      (this._ignoreCase = t.ignoreCase),
      (this._string = t.matchSubstring ? void 0 : this.normalize(t.string)),
      (this._substring = t.matchSubstring ? this.normalize(t.string) : void 0),
      t.regexSource)
    ) {
      const n = new Set((t.regexFlags || '').split(''))
      t.ignoreCase === !1 && n.delete('i'),
        t.ignoreCase === !0 && n.add('i'),
        (this._regex = new RegExp(t.regexSource, [...n].join('')))
    }
  }
  matches(t) {
    return (
      this._regex || (t = this.normalize(t)),
      this._string !== void 0
        ? t === this._string
        : this._substring !== void 0
        ? t.includes(this._substring)
        : this._regex
        ? !!this._regex.test(t)
        : !1
    )
  }
  normalize(t) {
    return t && (this._normalizeWhiteSpace && (t = be(t)), this._ignoreCase && (t = t.toLocaleLowerCase()), t)
  }
}
function Tl(e, t) {
  if (e === t) return !0
  if (e && t && typeof e == 'object' && typeof t == 'object') {
    if (e.constructor !== t.constructor) return !1
    if (Array.isArray(e)) {
      if (e.length !== t.length) return !1
      for (let r = 0; r < e.length; ++r) if (!Tl(e[r], t[r])) return !1
      return !0
    }
    if (e instanceof RegExp) return e.source === t.source && e.flags === t.flags
    if (e.valueOf !== Object.prototype.valueOf) return e.valueOf() === t.valueOf()
    if (e.toString !== Object.prototype.toString) return e.toString() === t.toString()
    const n = Object.keys(e)
    if (n.length !== Object.keys(t).length) return !1
    for (let r = 0; r < n.length; ++r) if (!t.hasOwnProperty(n[r])) return !1
    for (const r of n) if (!Tl(e[r], t[r])) return !1
    return !0
  }
  return typeof e == 'number' && typeof t == 'number' ? isNaN(e) && isNaN(t) : !1
}
class w0 {
  constructor(t) {
    ;(this._performingAction = !1),
      (this._listeners = []),
      (this._hoveredModel = null),
      (this._hoveredElement = null),
      (this._activeModel = null),
      (this._expectProgrammaticKeyUp = !1),
      (this._mode = 'none'),
      (this._testIdAttributeName = 'data-testid'),
      (this._delegate = {}),
      (this.document = t.document),
      (this._injectedScript = t),
      (this._highlight = new kl(t)),
      t.isUnderTest && console.error('Recorder script ready for test')
  }
  installListeners() {
    this._highlight.isInstalled() ||
      (fc(this._listeners),
      (this._listeners = [
        Ze(this.document, 'click', (t) => this._onClick(t), !0),
        Ze(this.document, 'auxclick', (t) => this._onClick(t), !0),
        Ze(this.document, 'input', (t) => this._onInput(t), !0),
        Ze(this.document, 'keydown', (t) => this._onKeyDown(t), !0),
        Ze(this.document, 'keyup', (t) => this._onKeyUp(t), !0),
        Ze(this.document, 'mousedown', (t) => this._onMouseDown(t), !0),
        Ze(this.document, 'mouseup', (t) => this._onMouseUp(t), !0),
        Ze(this.document, 'mousemove', (t) => this._onMouseMove(t), !0),
        Ze(this.document, 'mouseleave', (t) => this._onMouseLeave(t), !0),
        Ze(this.document, 'focus', (t) => t.isTrusted && this._onFocus(!0), !0),
        Ze(
          this.document,
          'scroll',
          (t) => {
            t.isTrusted && ((this._hoveredModel = null), this._highlight.hideActionPoint(), this._updateHighlight(!1))
          },
          !0,
        ),
      ]),
      this._highlight.install())
  }
  uninstallListeners() {
    fc(this._listeners), this._highlight.uninstall()
  }
  setUIState(t, n) {
    var a
    ;(this._delegate = n), t.mode !== 'none' || t.actionSelector ? this.installListeners() : this.uninstallListeners()
    const { mode: r, actionPoint: i, actionSelector: s, language: o, testIdAttributeName: l } = t
    ;(this._testIdAttributeName = l),
      this._highlight.setLanguage(o),
      r !== this._mode && ((this._mode = r), this.clearHighlight()),
      (i && this._actionPoint && i.x === this._actionPoint.x && i.y === this._actionPoint.y) ||
        (!i && !this._actionPoint) ||
        (i ? this._highlight.showActionPoint(i.x, i.y) : this._highlight.hideActionPoint(), (this._actionPoint = i)),
      this._actionSelector &&
        !((a = this._hoveredModel) != null && a.elements.length) &&
        (this._actionSelector = void 0),
      s !== this._actionSelector &&
        ((this._hoveredModel = s ? x0(this._injectedScript, s, this.document) : null),
        this._updateHighlight(!1),
        (this._actionSelector = s))
  }
  clearHighlight() {
    ;(this._hoveredModel = null), (this._activeModel = null), this._updateHighlight(!1)
  }
  _actionInProgress(t) {
    return this._performingAction ? !0 : (bt(t), !1)
  }
  _consumedDueToNoModel(t, n) {
    return n ? !1 : (bt(t), !0)
  }
  _consumedDueWrongTarget(t) {
    return this._activeModel && this._activeModel.elements[0] === this._deepEventTarget(t) ? !1 : (bt(t), !0)
  }
  _onClick(t) {
    var r, i
    if (
      !t.isTrusted ||
      (this._mode === 'inspecting' &&
        ((i = (r = this._delegate).setSelector) == null ||
          i.call(r, this._hoveredModel ? this._hoveredModel.selector : '')),
      this._shouldIgnoreMouseEvent(t)) ||
      this._actionInProgress(t) ||
      this._consumedDueToNoModel(t, this._hoveredModel)
    )
      return
    const n = _o(this._deepEventTarget(t))
    if (n) {
      this._performAction({ name: n.checked ? 'check' : 'uncheck', selector: this._hoveredModel.selector, signals: [] })
      return
    }
    this._performAction({
      name: 'click',
      selector: this._hoveredModel.selector,
      position: E0(t),
      signals: [],
      button: S0(t),
      modifiers: cc(t),
      clickCount: t.detail,
    })
  }
  _shouldIgnoreMouseEvent(t) {
    const n = this._deepEventTarget(t)
    if (this._mode === 'none') return !0
    if (this._mode === 'inspecting') return bt(t), !0
    const r = n.nodeName
    return !!(r === 'SELECT' || r === 'OPTION' || (r === 'INPUT' && ['date'].includes(n.type)))
  }
  _onMouseDown(t) {
    t.isTrusted &&
      (this._shouldIgnoreMouseEvent(t) || (this._performingAction || bt(t), (this._activeModel = this._hoveredModel)))
  }
  _onMouseUp(t) {
    t.isTrusted && (this._shouldIgnoreMouseEvent(t) || this._performingAction || bt(t))
  }
  _onMouseMove(t) {
    if (!t.isTrusted || this._mode === 'none') return
    const n = this._deepEventTarget(t)
    this._hoveredElement !== n && ((this._hoveredElement = n), this._updateModelForHoveredElement())
  }
  _onMouseLeave(t) {
    t.isTrusted &&
      this._injectedScript.window.top !== this._injectedScript.window &&
      this._deepEventTarget(t).nodeType === Node.DOCUMENT_NODE &&
      ((this._hoveredElement = null), this._updateModelForHoveredElement())
  }
  _onFocus(t) {
    if (this._mode === 'none') return
    const n = this._deepActiveElement(this.document)
    if (t && n === this.document.body) return
    const r = n ? xl(this._injectedScript, n, { testIdAttributeName: this._testIdAttributeName }) : null
    ;(this._activeModel = r && r.selector ? r : null),
      t && (this._hoveredElement = n),
      this._updateModelForHoveredElement()
  }
  _updateModelForHoveredElement() {
    if (!this._hoveredElement || !this._hoveredElement.isConnected) {
      ;(this._hoveredModel = null), (this._hoveredElement = null), this._updateHighlight(!0)
      return
    }
    const t = this._hoveredElement,
      { selector: n, elements: r } = xl(this._injectedScript, t, { testIdAttributeName: this._testIdAttributeName })
    ;(this._hoveredModel && this._hoveredModel.selector === n) ||
      ((this._hoveredModel = n ? { selector: n, elements: r } : null), this._updateHighlight(!0))
  }
  _updateHighlight(t) {
    var i, s
    const n = this._hoveredModel ? this._hoveredModel.elements : [],
      r = this._hoveredModel ? this._hoveredModel.selector : ''
    this._highlight.updateHighlight(n, r, this._mode === 'recording'),
      t && ((s = (i = this._delegate).highlightUpdated) == null || s.call(i))
  }
  _onInput(t) {
    var r, i, s, o
    if (this._mode !== 'recording') return !0
    const n = this._deepEventTarget(t)
    if (n.nodeName === 'INPUT' && n.type.toLowerCase() === 'file') {
      ;(i = (r = this._delegate).recordAction) == null ||
        i.call(r, {
          name: 'setInputFiles',
          selector: this._activeModel.selector,
          signals: [],
          files: [...(n.files || [])].map((l) => l.name),
        })
      return
    }
    if (['INPUT', 'TEXTAREA'].includes(n.nodeName) || n.isContentEditable) {
      if (
        (n.nodeName === 'INPUT' && ['checkbox', 'radio'].includes(n.type.toLowerCase())) ||
        this._consumedDueWrongTarget(t)
      )
        return
      ;(o = (s = this._delegate).recordAction) == null ||
        o.call(s, {
          name: 'fill',
          selector: this._activeModel.selector,
          signals: [],
          text: n.isContentEditable ? n.innerText : n.value,
        })
    }
    if (n.nodeName === 'SELECT') {
      const l = n
      if (this._actionInProgress(t)) return
      this._performAction({
        name: 'select',
        selector: this._hoveredModel.selector,
        options: [...l.selectedOptions].map((a) => a.value),
        signals: [],
      })
    }
  }
  _shouldGenerateKeyPressFor(t) {
    if (
      (t.key === 'Enter' &&
        (this._deepEventTarget(t).nodeName === 'TEXTAREA' || this._deepEventTarget(t).isContentEditable)) ||
      ['Backspace', 'Delete', 'AltGraph'].includes(t.key) ||
      (t.key === '@' && t.code === 'KeyL')
    )
      return !1
    if (navigator.platform.includes('Mac')) {
      if (t.key === 'v' && t.metaKey) return !1
    } else if ((t.key === 'v' && t.ctrlKey) || (t.key === 'Insert' && t.shiftKey)) return !1
    if (['Shift', 'Control', 'Meta', 'Alt', 'Process'].includes(t.key)) return !1
    const n = t.ctrlKey || t.altKey || t.metaKey
    return t.key.length === 1 && !n ? !!_o(this._deepEventTarget(t)) : !0
  }
  _onKeyDown(t) {
    if (t.isTrusted) {
      if (this._mode === 'inspecting') {
        bt(t)
        return
      }
      if (this._mode === 'recording' && this._shouldGenerateKeyPressFor(t)) {
        if (this._actionInProgress(t)) {
          this._expectProgrammaticKeyUp = !0
          return
        }
        if (!this._consumedDueWrongTarget(t)) {
          if (t.key === ' ') {
            const n = _o(this._deepEventTarget(t))
            if (n) {
              this._performAction({
                name: n.checked ? 'uncheck' : 'check',
                selector: this._activeModel.selector,
                signals: [],
              })
              return
            }
          }
          this._performAction({
            name: 'press',
            selector: this._activeModel.selector,
            signals: [],
            key: t.key,
            modifiers: cc(t),
          })
        }
      }
    }
  }
  _onKeyUp(t) {
    if (t.isTrusted && this._mode !== 'none' && this._shouldGenerateKeyPressFor(t)) {
      if (!this._expectProgrammaticKeyUp) {
        bt(t)
        return
      }
      this._expectProgrammaticKeyUp = !1
    }
  }
  async _performAction(t) {
    var n, r
    this.clearHighlight(),
      (this._performingAction = !0),
      await ((r = (n = this._delegate).performAction) == null ? void 0 : r.call(n, t).catch(() => {})),
      (this._performingAction = !1),
      this._onFocus(!1),
      this._injectedScript.isUnderTest &&
        console.error(
          'Action performed for test: ' +
            JSON.stringify({
              hovered: this._hoveredModel ? this._hoveredModel.selector : null,
              active: this._activeModel ? this._activeModel.selector : null,
            }),
        )
  }
  _deepEventTarget(t) {
    return t.composedPath()[0]
  }
  _deepActiveElement(t) {
    let n = t.activeElement
    for (; n && n.shadowRoot && n.shadowRoot.activeElement; ) n = n.shadowRoot.activeElement
    return n
  }
}
function cc(e) {
  return (e.altKey ? 1 : 0) | (e.ctrlKey ? 2 : 0) | (e.metaKey ? 4 : 0) | (e.shiftKey ? 8 : 0)
}
function S0(e) {
  switch (e.which) {
    case 1:
      return 'left'
    case 2:
      return 'middle'
    case 3:
      return 'right'
  }
  return 'left'
}
function E0(e) {
  if (e.target.nodeName === 'CANVAS') return { x: e.offsetX, y: e.offsetY }
}
function bt(e) {
  e.preventDefault(), e.stopPropagation(), e.stopImmediatePropagation()
}
function _o(e) {
  if (!e || e.nodeName !== 'INPUT') return null
  const t = e
  return ['checkbox', 'radio'].includes(t.type) ? t : null
}
function Ze(e, t, n, r) {
  return (
    e.addEventListener(t, n, r),
    () => {
      e.removeEventListener(t, n, r)
    }
  )
}
function fc(e) {
  for (const t of e) t()
  e.splice(0, e.length)
}
function x0(e, t, n) {
  try {
    const r = e.parseSelector(t)
    return { selector: t, elements: e.querySelectorAll(r, n) }
  } catch {
    return { selector: t, elements: [] }
  }
}
function ba(e, t, n) {
  return `internal:attr=[${e}=${we(t, (n == null ? void 0 : n.exact) || !1)}]`
}
function _0(e, t) {
  return `internal:testid=[${e}=${we(t, !0)}]`
}
function k0(e, t) {
  return 'internal:label=' + pt(e, !!(t != null && t.exact))
}
function T0(e, t) {
  return ba('alt', e, t)
}
function N0(e, t) {
  return ba('title', e, t)
}
function C0(e, t) {
  return ba('placeholder', e, t)
}
function A0(e, t) {
  return 'internal:text=' + pt(e, !!(t != null && t.exact))
}
function L0(e, t = {}) {
  const n = []
  return (
    t.checked !== void 0 && n.push(['checked', String(t.checked)]),
    t.disabled !== void 0 && n.push(['disabled', String(t.disabled)]),
    t.selected !== void 0 && n.push(['selected', String(t.selected)]),
    t.expanded !== void 0 && n.push(['expanded', String(t.expanded)]),
    t.includeHidden !== void 0 && n.push(['include-hidden', String(t.includeHidden)]),
    t.level !== void 0 && n.push(['level', String(t.level)]),
    t.name !== void 0 && n.push(['name', we(t.name, !!t.exact)]),
    t.pressed !== void 0 && n.push(['pressed', String(t.pressed)]),
    `internal:role=${e}${n.map(([r, i]) => `[${r}=${i}]`).join('')}`
  )
}
const yr = Symbol('selector'),
  b0 = Symbol('injectedScript')
class zn {
  constructor(t, n, r) {
    if (
      ((this[yr] = n),
      (this[b0] = t),
      r != null && r.hasText && (n += ` >> internal:has-text=${pt(r.hasText, !1)}`),
      r != null && r.hasNotText && (n += ` >> internal:has-not-text=${pt(r.hasNotText, !1)}`),
      r != null && r.has && (n += ' >> internal:has=' + JSON.stringify(r.has[yr])),
      r != null && r.hasNot && (n += ' >> internal:has-not=' + JSON.stringify(r.hasNot[yr])),
      n)
    ) {
      const o = t.parseSelector(n)
      ;(this.element = t.querySelector(o, t.document, !1)), (this.elements = t.querySelectorAll(o, t.document))
    }
    const i = n,
      s = this
    ;(s.locator = (o, l) => new zn(t, i ? i + ' >> ' + o : o, l)),
      (s.getByTestId = (o) => s.locator(_0(t.testIdAttributeNameForStrictErrorAndConsoleCodegen(), o))),
      (s.getByAltText = (o, l) => s.locator(T0(o, l))),
      (s.getByLabel = (o, l) => s.locator(k0(o, l))),
      (s.getByPlaceholder = (o, l) => s.locator(C0(o, l))),
      (s.getByText = (o, l) => s.locator(A0(o, l))),
      (s.getByTitle = (o, l) => s.locator(N0(o, l))),
      (s.getByRole = (o, l = {}) => s.locator(L0(o, l))),
      (s.filter = (o) => new zn(t, n, o)),
      (s.first = () => s.locator('nth=0')),
      (s.last = () => s.locator('nth=-1')),
      (s.nth = (o) => s.locator(`nth=${o}`)),
      (s.and = (o) => new zn(t, i + ' >> internal:and=' + JSON.stringify(o[yr]))),
      (s.or = (o) => new zn(t, i + ' >> internal:or=' + JSON.stringify(o[yr])))
  }
}
class I0 {
  constructor(t) {
    ;(this._injectedScript = t),
      !this._injectedScript.window.playwright &&
        ((this._injectedScript.window.playwright = {
          $: (n, r) => this._querySelector(n, !!r),
          $$: (n) => this._querySelectorAll(n),
          inspect: (n) => this._inspect(n),
          selector: (n) => this._selector(n),
          generateLocator: (n, r) => this._generateLocator(n, r),
          resume: () => this._resume(),
          ...new zn(t, ''),
        }),
        delete this._injectedScript.window.playwright.filter,
        delete this._injectedScript.window.playwright.first,
        delete this._injectedScript.window.playwright.last,
        delete this._injectedScript.window.playwright.nth,
        delete this._injectedScript.window.playwright.and,
        delete this._injectedScript.window.playwright.or)
  }
  _querySelector(t, n) {
    if (typeof t != 'string') throw new Error("Usage: playwright.query('Playwright >> selector').")
    const r = this._injectedScript.parseSelector(t)
    return this._injectedScript.querySelector(r, this._injectedScript.document, n)
  }
  _querySelectorAll(t) {
    if (typeof t != 'string') throw new Error("Usage: playwright.$$('Playwright >> selector').")
    const n = this._injectedScript.parseSelector(t)
    return this._injectedScript.querySelectorAll(n, this._injectedScript.document)
  }
  _inspect(t) {
    if (typeof t != 'string') throw new Error("Usage: playwright.inspect('Playwright >> selector').")
    this._injectedScript.window.inspect(this._querySelector(t, !1))
  }
  _selector(t) {
    if (!(t instanceof Element)) throw new Error('Usage: playwright.selector(element).')
    return this._injectedScript.generateSelector(t)
  }
  _generateLocator(t, n) {
    if (!(t instanceof Element)) throw new Error('Usage: playwright.locator(element).')
    const r = this._injectedScript.generateSelector(t)
    return gn(n || 'javascript', r)
  }
  _resume() {
    this._injectedScript.window.__pw_resume().catch(() => {})
  }
}
function M0(e, t) {
  e = e
    .replace(/AriaRole\s*\.\s*([\w]+)/g, (i, s) => s.toLowerCase())
    .replace(/(get_by_role|getByRole)\s*\(\s*(?:["'`])([^'"`]+)['"`]/g, (i, s, o) => `${s}(${o.toLowerCase()}`)
  const n = []
  let r = ''
  for (let i = 0; i < e.length; ++i) {
    const s = e[i]
    if (s !== '"' && s !== "'" && s !== '`' && s !== '/') {
      r += s
      continue
    }
    const o = e[i - 1] === 'r' || e[i] === '/'
    ++i
    let l = ''
    for (; i < e.length; ) {
      if (e[i] === '\\') {
        o
          ? (e[i + 1] !== s && (l += e[i]), ++i, (l += e[i]))
          : (++i,
            e[i] === 'n'
              ? (l += `
`)
              : e[i] === 'r'
              ? (l += '\r')
              : e[i] === 't'
              ? (l += '	')
              : (l += e[i])),
          ++i
        continue
      }
      if (e[i] !== s) {
        l += e[i++]
        continue
      }
      break
    }
    n.push({ quote: s, text: l }), (r += (s === '/' ? 'r' : '') + '$' + n.length)
  }
  return (
    (r = r
      .toLowerCase()
      .replace(/get_by_alt_text/g, 'getbyalttext')
      .replace(/get_by_test_id/g, 'getbytestid')
      .replace(/get_by_([\w]+)/g, 'getby$1')
      .replace(/has_not_text/g, 'hasnottext')
      .replace(/has_text/g, 'hastext')
      .replace(/has_not/g, 'hasnot')
      .replace(/frame_locator/g, 'framelocator')
      .replace(/[{}\s]/g, '')
      .replace(/new\(\)/g, '')
      .replace(/new[\w]+\.[\w]+options\(\)/g, '')
      .replace(/\.set/g, ',set')
      .replace(/\.or_\(/g, 'or(')
      .replace(/\.and_\(/g, 'and(')
      .replace(/:/g, '=')
      .replace(/,re\.ignorecase/g, 'i')
      .replace(/,pattern.case_insensitive/g, 'i')
      .replace(/,regexoptions.ignorecase/g, 'i')
      .replace(/re.compile\(([^)]+)\)/g, '$1')
      .replace(/pattern.compile\(([^)]+)\)/g, 'r$1')
      .replace(/newregex\(([^)]+)\)/g, 'r$1')
      .replace(/string=/g, '=')
      .replace(/regex=/g, '=')
      .replace(/,,/g, ',')),
    ip(r, n, t)
  )
}
function dc(e) {
  return [...e.matchAll(/\$\d+/g)].length
}
function hc(e, t) {
  return e.replace(/\$(\d+)/g, (n, r) => `$${r - t}`)
}
function ip(e, t, n) {
  for (;;) {
    const i = e.match(/filter\(,?(has=|hasnot=|sethas\(|sethasnot\()/)
    if (!i) break
    const s = i.index + i[0].length
    let o = 0,
      l = s
    for (; l < e.length && (e[l] === '(' ? o++ : e[l] === ')' && o--, !(o < 0)); l++);
    let a = e.substring(0, s),
      u = 0
    ;['sethas(', 'sethasnot('].includes(i[1]) &&
      ((u = 1), (a = a.replace(/sethas\($/, 'has=').replace(/sethasnot\($/, 'hasnot=')))
    const c = dc(e.substring(0, s)),
      p = hc(e.substring(s, l), c),
      f = dc(p),
      y = t.slice(c, c + f),
      g = JSON.stringify(ip(p, y, n))
    e = a.replace(/=$/, '2=') + `$${c + 1}` + hc(e.substring(l + u), f - 1)
    const w = t.slice(0, c),
      x = t.slice(c + f)
    t = w.concat([{ quote: '"', text: g }]).concat(x)
  }
  e = e
    .replace(/\,set([\w]+)\(([^)]+)\)/g, (i, s, o) => ',' + s.toLowerCase() + '=' + o.toLowerCase())
    .replace(/framelocator\(([^)]+)\)/g, '$1.internal:control=enter-frame')
    .replace(/locator\(([^)]+),hastext=([^),]+)\)/g, 'locator($1).internal:has-text=$2')
    .replace(/locator\(([^)]+),hasnottext=([^),]+)\)/g, 'locator($1).internal:has-not-text=$2')
    .replace(/locator\(([^)]+),hastext=([^),]+)\)/g, 'locator($1).internal:has-text=$2')
    .replace(/locator\(([^)]+)\)/g, '$1')
    .replace(/getbyrole\(([^)]+)\)/g, 'internal:role=$1')
    .replace(/getbytext\(([^)]+)\)/g, 'internal:text=$1')
    .replace(/getbylabel\(([^)]+)\)/g, 'internal:label=$1')
    .replace(/getbytestid\(([^)]+)\)/g, `internal:testid=[${n}=$1]`)
    .replace(/getby(placeholder|alt|title)(?:text)?\(([^)]+)\)/g, 'internal:attr=[$1=$2]')
    .replace(/first(\(\))?/g, 'nth=0')
    .replace(/last(\(\))?/g, 'nth=-1')
    .replace(/nth\(([^)]+)\)/g, 'nth=$1')
    .replace(/filter\(,?hastext=([^)]+)\)/g, 'internal:has-text=$1')
    .replace(/filter\(,?hasnottext=([^)]+)\)/g, 'internal:has-not-text=$1')
    .replace(/filter\(,?has2=([^)]+)\)/g, 'internal:has=$1')
    .replace(/filter\(,?hasnot2=([^)]+)\)/g, 'internal:has-not=$1')
    .replace(/,exact=false/g, '')
    .replace(/,exact=true/g, 's')
    .replace(/\,/g, '][')
  const r = e.split('.')
  for (let i = 0; i < r.length - 1; i++)
    if (r[i] === 'internal:control=enter-frame' && r[i + 1].startsWith('nth=')) {
      const [s] = r.splice(i, 1)
      r.splice(i + 1, 0, s)
    }
  return r
    .map((i) =>
      !i.startsWith('internal:') || i === 'internal:control'
        ? i.replace(/\$(\d+)/g, (s, o) => t[+o - 1].text)
        : ((i = i.includes('[') ? i.replace(/\]/, '') + ']' : i),
          (i = i
            .replace(/(?:r)\$(\d+)(i)?/g, (s, o, l) => {
              const a = t[+o - 1]
              return i.startsWith('internal:attr') || i.startsWith('internal:testid') || i.startsWith('internal:role')
                ? we(new RegExp(a.text), !1) + (l || '')
                : pt(new RegExp(a.text, l), !1)
            })
            .replace(/\$(\d+)(i|s)?/g, (s, o, l) => {
              const a = t[+o - 1]
              return i.startsWith('internal:has=') || i.startsWith('internal:has-not=')
                ? a.text
                : i.startsWith('internal:testid')
                ? we(a.text, !0)
                : i.startsWith('internal:attr') || i.startsWith('internal:role')
                ? we(a.text, l === 's')
                : pt(a.text, l === 's')
            })),
          i),
    )
    .join(' >> ')
}
function R0(e, t, n) {
  try {
    return Zr(t), t
  } catch {}
  try {
    const r = M0(t, n),
      i = rh(e, r),
      s = pc(t)
    if (i.some((o) => pc(o) === s)) return r
  } catch {}
  return ''
}
function pc(e) {
  return e.replace(/\s/g, '').replace(/["`]/g, "'")
}
const P0 = ({ url: e }) =>
    b('div', {
      className: 'browser-frame-header',
      children: [
        b('div', {
          style: { whiteSpace: 'nowrap' },
          children: [
            m('span', { className: 'browser-frame-dot', style: { backgroundColor: 'rgb(242, 95, 88)' } }),
            m('span', { className: 'browser-frame-dot', style: { backgroundColor: 'rgb(251, 190, 60)' } }),
            m('span', { className: 'browser-frame-dot', style: { backgroundColor: 'rgb(88, 203, 66)' } }),
          ],
        }),
        m('div', { className: 'browser-frame-address-bar', title: e || 'about:blank', children: e || 'about:blank' }),
        m('div', {
          style: { marginLeft: 'auto' },
          children: b('div', {
            children: [
              m('span', { className: 'browser-frame-menu-bar' }),
              m('span', { className: 'browser-frame-menu-bar' }),
              m('span', { className: 'browser-frame-menu-bar' }),
            ],
          }),
        }),
      ],
    }),
  $0 = ({
    action: e,
    sdkLanguage: t,
    testIdAttributeName: n,
    isInspecting: r,
    setIsInspecting: i,
    highlightedLocator: s,
    setHighlightedLocator: o,
  }) => {
    const [l, a] = ni(),
      [u, c] = L.useState('action'),
      { snapshots: p } = L.useMemo(() => {
        if (!e) return { snapshots: {} }
        let _ = e.beforeSnapshot ? { action: e, snapshotName: e.beforeSnapshot } : void 0,
          N = e
        for (; !_ && N; )
          (N = qg(N)),
            (_ =
              N != null && N.afterSnapshot ? { action: N, snapshotName: N == null ? void 0 : N.afterSnapshot } : void 0)
        const I = e.afterSnapshot ? { action: e, snapshotName: e.afterSnapshot } : _
        return {
          snapshots: {
            action: e.inputSnapshot ? { action: e, snapshotName: e.inputSnapshot, showPoint: !!e.point } : I,
            before: _,
            after: I,
          },
        }
      }, [e]),
      {
        snapshotInfoUrl: f,
        snapshotUrl: y,
        popoutUrl: g,
      } = L.useMemo(() => {
        const _ = p[u]
        if (!_) return { snapshotUrl: z0 }
        const N = new URLSearchParams()
        N.set('trace', an(_.action).traceUrl), N.set('name', _.snapshotName), _.showPoint && N.set('showPoint', '1')
        const I = new URL(`snapshot/${_.action.pageId}?${N.toString()}`, window.location.href).toString(),
          O = new URL(`snapshotInfo/${_.action.pageId}?${N.toString()}`, window.location.href).toString(),
          k = new URLSearchParams()
        k.set('r', I), k.set('trace', an(_.action).traceUrl), _.showPoint && k.set('showPoint', '1')
        const P = new URL(`snapshot.html?${k.toString()}`, window.location.href).toString()
        return { snapshots: p, snapshotInfoUrl: O, snapshotUrl: I, popoutUrl: P }
      }, [p, u]),
      w = L.useRef(null),
      x = L.useRef(null),
      [h, d] = L.useState({ viewport: gc, url: '' }),
      v = L.useRef({ iteration: 0, visibleIframe: 0 })
    L.useEffect(() => {
      ;(async () => {
        const _ = v.current.iteration + 1,
          N = 1 - v.current.visibleIframe
        v.current.iteration = _
        const I = { url: '', viewport: gc }
        if (f) {
          const P = await (await fetch(f)).json()
          P.error || ((I.url = P.url), (I.viewport = P.viewport))
        }
        if (v.current.iteration !== _) return
        const O = [w, x][N].current
        if (O) {
          let k = () => {}
          const P = new Promise((q) => (k = q))
          try {
            O.addEventListener('load', k),
              O.addEventListener('error', k),
              O.contentWindow ? O.contentWindow.location.replace(y) : (O.src = y),
              await P
          } catch {
          } finally {
            O.removeEventListener('load', k), O.removeEventListener('error', k)
          }
        }
        v.current.iteration === _ && ((v.current.visibleIframe = N), d(I))
      })()
    }, [y, f])
    const S = 40,
      T = { width: h.viewport.width, height: h.viewport.height + S },
      C = Math.min(l.width / T.width, l.height / T.height, 1),
      E = { x: (l.width - T.width) / 2, y: (l.height - T.height) / 2 }
    return b('div', {
      className: 'snapshot-tab',
      tabIndex: 0,
      onKeyDown: (_) => {
        _.key === 'Escape' && r && i(!1)
      },
      children: [
        m(mc, {
          isInspecting: r,
          sdkLanguage: t,
          testIdAttributeName: n,
          highlightedLocator: s,
          setHighlightedLocator: o,
          iframe: w.current,
          iteration: v.current.iteration,
        }),
        m(mc, {
          isInspecting: r,
          sdkLanguage: t,
          testIdAttributeName: n,
          highlightedLocator: s,
          setHighlightedLocator: o,
          iframe: x.current,
          iteration: v.current.iteration,
        }),
        b(sh, {
          children: [
            ['action', 'before', 'after'].map((_) =>
              m(oh, { id: _, title: O0(_), selected: u === _, onSelect: () => c(_) }),
            ),
            m('div', { style: { flex: 'auto' } }),
            m(ln, {
              icon: 'link-external',
              title: 'Open snapshot in a new tab',
              disabled: !g,
              onClick: () => {
                const _ = window.open(g || '', '_blank')
                _ == null ||
                  _.addEventListener('DOMContentLoaded', () => {
                    const N = new ep(_, !1, t, n, 1, 'chromium', [])
                    new I0(N)
                  })
              },
            }),
          ],
        }),
        m('div', {
          ref: a,
          className: 'snapshot-wrapper',
          children: b('div', {
            className: 'snapshot-container',
            style: {
              width: T.width + 'px',
              height: T.height + 'px',
              transform: `translate(${E.x}px, ${E.y}px) scale(${C})`,
            },
            children: [
              m(P0, { url: h.url }),
              b('div', {
                className: 'snapshot-switcher',
                children: [
                  m('iframe', {
                    ref: w,
                    name: 'snapshot',
                    className: v.current.visibleIframe === 0 ? 'snapshot-visible' : '',
                  }),
                  m('iframe', {
                    ref: x,
                    name: 'snapshot',
                    className: v.current.visibleIframe === 1 ? 'snapshot-visible' : '',
                  }),
                ],
              }),
            ],
          }),
        }),
      ],
    })
  }
function O0(e) {
  return e === 'before' ? 'Before' : e === 'after' ? 'After' : e === 'action' ? 'Action' : e
}
const mc = ({
  iframe: e,
  isInspecting: t,
  sdkLanguage: n,
  testIdAttributeName: r,
  highlightedLocator: i,
  setHighlightedLocator: s,
  iteration: o,
}) => (
  L.useEffect(() => {
    const l = [],
      a = new URLSearchParams(window.location.search).get('isUnderTest') === 'true'
    try {
      sp(l, n, r, a, '', e == null ? void 0 : e.contentWindow)
    } catch {}
    for (const { recorder: u, frameSelector: c } of l) {
      const p = R0(n, i, r)
      u.setUIState(
        {
          mode: t ? 'inspecting' : 'none',
          actionSelector: p.startsWith(c) ? p.substring(c.length).trim() : void 0,
          language: n,
          testIdAttributeName: r,
        },
        {
          async setSelector(f) {
            s(gn(n, c + f, !1, !0))
          },
          highlightUpdated() {
            for (const f of l) f.recorder !== u && f.recorder.clearHighlight()
          },
        },
      )
    }
  }, [e, t, i, s, n, r, o]),
  m(mt, {})
)
function sp(e, t, n, r, i, s) {
  if (!s) return
  const o = s
  if (!o._recorder) {
    const l = new ep(s, r, t, n, 1, 'chromium', []),
      a = new w0(l)
    ;(o._injectedScript = l), (o._recorder = { recorder: a, frameSelector: i })
  }
  e.push(o._recorder)
  for (let l = 0; l < s.frames.length; ++l) {
    const a = s.frames[l],
      u = a.frameElement
        ? o._injectedScript.generateSelector(a.frameElement, { omitInternalEngines: !0, testIdAttributeName: n }) +
          ' >> internal:control=enter-frame >> '
        : ''
    sp(e, t, n, r, i + u, a)
  }
}
const gc = { width: 1280, height: 720 },
  z0 = 'data:text/html,<body style="background: #ddd"></body>'
const D0 = ai,
  F0 = ({ action: e, setSelectedFrame: t, selectedFrame: n }) => {
    const r = (e == null ? void 0 : e.stack) || []
    return m(D0, {
      name: 'stack-trace',
      items: r,
      selectedItem: r[n],
      render: (i) => {
        const s = i.file[1] === ':' ? '\\' : '/'
        return b(mt, {
          children: [
            m('span', { className: 'stack-trace-frame-function', children: i.function || '(anonymous)' }),
            m('span', { className: 'stack-trace-frame-location', children: i.file.split(s).pop() }),
            m('span', { className: 'stack-trace-frame-line', children: ':' + i.line }),
          ],
        })
      },
      onSelected: (i) => t(r.indexOf(i)),
    })
  },
  U0 = ({ action: e, sources: t, hideStackFrames: n, rootDir: r, fallbackLocation: i }) => {
    const [s, o] = L.useState(),
      [l, a] = L.useState(0)
    L.useEffect(() => {
      s !== e && (o(e), a(0))
    }, [e, s, o, a])
    const {
      source: u,
      highlight: c,
      targetLine: p,
      fileName: f,
    } = Pp(
      async () => {
        var S, T, C
        const y = (S = e == null ? void 0 : e.stack) == null ? void 0 : S[l],
          g = !(y != null && y.file)
        if (g && !i) return { source: { file: '', errors: [], content: void 0 }, targetLine: 0, highlight: [] }
        const w = g ? i.file : y.file
        let x = t.get(w)
        x ||
          ((x = { errors: ((T = i == null ? void 0 : i.source) == null ? void 0 : T.errors) || [], content: void 0 }),
          t.set(w, x))
        const h = g ? (i == null ? void 0 : i.line) || ((C = x.errors[0]) == null ? void 0 : C.line) || 0 : y.line,
          d = r && w.startsWith(r) ? w.substring(r.length + 1) : w,
          v = x.errors.map((E) => ({ type: 'error', line: E.line, message: E.message }))
        if ((v.push({ line: h, type: 'running' }), x.content === void 0 || g)) {
          const E = await j0(w)
          try {
            let _ = await fetch(`sha1/src@${E}.txt`)
            _.status === 404 && (_ = await fetch(`file?path=${encodeURIComponent(w)}`)), (x.content = await _.text())
          } catch {
            x.content = `<Unable to read "${w}">`
          }
        }
        return { source: x, highlight: v, targetLine: h, fileName: d }
      },
      [e, l, r, i],
      { source: { errors: [], content: 'Loading…' }, highlight: [] },
    )
    return b(ml, {
      sidebarSize: 200,
      orientation: 'horizontal',
      sidebarHidden: n,
      children: [
        b('div', {
          className: 'vbox',
          'data-testid': 'source-code',
          children: [
            f && m('div', { className: 'source-tab-file-name', children: f }),
            m(qs, {
              text: u.content || '',
              language: 'javascript',
              highlight: c,
              revealLine: p,
              readOnly: !0,
              lineNumbers: !0,
            }),
          ],
        }),
        m(F0, { action: e, selectedFrame: l, setSelectedFrame: a }),
      ],
    })
  }
async function j0(e) {
  const t = new TextEncoder().encode(e),
    n = await crypto.subtle.digest('SHA-1', t),
    r = [],
    i = new DataView(n)
  for (let s = 0; s < i.byteLength; s += 1) {
    const o = i.getUint8(s).toString(16).padStart(2, '0')
    r.push(o)
  }
  return r.join('')
}
const H0 = ({ enabled: e, cursor: t, onPaneMouseMove: n, onPaneMouseUp: r, onPaneDoubleClick: i }) => (
  rn.useEffect(() => {
    if (!e) return
    const s = document.createElement('div')
    return (
      (s.style.position = 'absolute'),
      (s.style.top = '0'),
      (s.style.right = '0'),
      (s.style.bottom = '0'),
      (s.style.left = '0'),
      (s.style.zIndex = '9999'),
      (s.style.cursor = t),
      document.body.appendChild(s),
      n && s.addEventListener('mousemove', n),
      r && s.addEventListener('mouseup', r),
      i && document.body.addEventListener('dblclick', i),
      () => {
        n && s.removeEventListener('mousemove', n),
          r && s.removeEventListener('mouseup', r),
          i && document.body.removeEventListener('dblclick', i),
          document.body.removeChild(s)
      }
    )
  }, [e, t, n, r, i]),
  m(mt, {})
)
const op = { width: 200, height: 45 },
  kn = 2.5,
  B0 = op.height + kn * 2,
  q0 = ({ model: e, boundaries: t, previewPoint: n }) => {
    var c, p
    const [r, i] = ni(),
      s = L.useRef(null)
    let o = 0
    if (s.current && n) {
      const f = s.current.getBoundingClientRect()
      o = ((n.clientY - f.top + s.current.scrollTop) / B0) | 0
    }
    const l = (p = (c = e == null ? void 0 : e.pages) == null ? void 0 : c[o]) == null ? void 0 : p.screencastFrames
    let a, u
    if (n !== void 0 && l) {
      const f = t.minimum + ((t.maximum - t.minimum) * n.x) / r.width
      a = l[Lc(l, f, lp) - 1]
      const y = {
        width: Math.min(500, (window.innerWidth / 2) | 0),
        height: Math.min(500, (window.innerHeight / 2) | 0),
      }
      u = a ? ap({ width: a.width, height: a.height }, y) : void 0
    }
    return b('div', {
      className: 'film-strip',
      ref: i,
      children: [
        m('div', {
          className: 'film-strip-lanes',
          ref: s,
          children: e == null ? void 0 : e.pages.map((f, y) => m(W0, { boundaries: t, page: f, width: r.width }, y)),
        }),
        (n == null ? void 0 : n.x) !== void 0 &&
          b('div', {
            className: 'film-strip-hover',
            style: { top: r.bottom + 5, left: Math.min(n.x, r.width - (u ? u.width : 0) - 10) },
            children: [
              n.action && m('div', { className: 'film-strip-hover-title', children: _a(n.action, n.sdkLanguage) }),
              a &&
                u &&
                m('div', {
                  style: { width: u.width, height: u.height },
                  children: m('img', { src: `sha1/${a.sha1}`, width: u.width, height: u.height }),
                }),
            ],
          }),
      ],
    })
  },
  W0 = ({ boundaries: e, page: t, width: n }) => {
    const r = { width: 0, height: 0 },
      i = t.screencastFrames
    for (const w of i) (r.width = Math.max(r.width, w.width)), (r.height = Math.max(r.height, w.height))
    const s = ap(r, op),
      o = i[0].timestamp,
      l = i[i.length - 1].timestamp,
      a = e.maximum - e.minimum,
      u = ((o - e.minimum) / a) * n,
      c = ((e.maximum - l) / a) * n,
      f = ((((l - o) / a) * n) / (s.width + 2 * kn)) | 0,
      y = (l - o) / f,
      g = []
    for (let w = 0; o && y && w < f; ++w) {
      const x = o + y * w,
        h = Lc(i, x, lp) - 1
      g.push(
        m(
          'div',
          {
            className: 'film-strip-frame',
            style: {
              width: s.width,
              height: s.height,
              backgroundImage: `url(sha1/${i[h].sha1})`,
              backgroundSize: `${s.width}px ${s.height}px`,
              margin: kn,
              marginRight: kn,
            },
          },
          w,
        ),
      )
    }
    return (
      g.push(
        m(
          'div',
          {
            className: 'film-strip-frame',
            style: {
              width: s.width,
              height: s.height,
              backgroundImage: `url(sha1/${i[i.length - 1].sha1})`,
              backgroundSize: `${s.width}px ${s.height}px`,
              margin: kn,
              marginRight: kn,
            },
          },
          g.length,
        ),
      ),
      m('div', { className: 'film-strip-lane', style: { marginLeft: u + 'px', marginRight: c + 'px' }, children: g })
    )
  }
function lp(e, t) {
  return e - t.timestamp
}
function ap(e, t) {
  const n = Math.max(e.width / t.width, e.height / t.height)
  return { width: (e.width / n) | 0, height: (e.height / n) | 0 }
}
const V0 = ({
  model: e,
  boundaries: t,
  onSelected: n,
  highlightedAction: r,
  highlightedEntry: i,
  selectedTime: s,
  setSelectedTime: o,
  sdkLanguage: l,
}) => {
  const [a, u] = ni(),
    [c, p] = L.useState(),
    [f, y] = L.useState(),
    {
      offsets: g,
      curtainLeft: w,
      curtainRight: x,
    } = L.useMemo(() => {
      let _ = s || t
      if (c && c.startX !== c.endX) {
        const k = at(a.width, t, c.startX),
          P = at(a.width, t, c.endX)
        _ = { minimum: Math.min(k, P), maximum: Math.max(k, P) }
      }
      const N = ut(a.width, t, _.minimum),
        O = ut(a.width, t, t.maximum) - ut(a.width, t, _.maximum)
      return { offsets: Q0(a.width, t), curtainLeft: N, curtainRight: O }
    }, [s, t, c, a]),
    h = L.useMemo(() => {
      const _ = []
      for (const N of (e == null ? void 0 : e.actions) || [])
        N.class !== 'Test' &&
          _.push({
            action: N,
            leftTime: N.startTime,
            rightTime: N.endTime || t.maximum,
            leftPosition: ut(a.width, t, N.startTime),
            rightPosition: ut(a.width, t, N.endTime || t.maximum),
            active: !1,
            error: !!N.error,
          })
      for (const N of (e == null ? void 0 : e.resources) || []) {
        const I = N._monotonicTime,
          O = N._monotonicTime + N.time
        _.push({
          resource: N,
          leftTime: I,
          rightTime: O,
          leftPosition: ut(a.width, t, I),
          rightPosition: ut(a.width, t, O),
          active: !1,
          error: !1,
        })
      }
      return _
    }, [e, t, a])
  L.useMemo(() => {
    for (const _ of h) _.active = (!!r && _.action === r) || (!!i && _.resource === i)
  }, [h, r, i])
  const d = L.useCallback(
      (_) => {
        if ((y(void 0), !u.current)) return
        const N = _.clientX - u.current.getBoundingClientRect().left,
          I = at(a.width, t, N),
          O = s ? ut(a.width, t, s.minimum) : 0,
          k = s ? ut(a.width, t, s.maximum) : 0
        s && Math.abs(N - O) < 10
          ? p({ startX: k, endX: N, type: 'resize' })
          : s && Math.abs(N - k) < 10
          ? p({ startX: O, endX: N, type: 'resize' })
          : s && I > s.minimum && I < s.maximum && _.clientY - u.current.getBoundingClientRect().top < 20
          ? p({ startX: O, endX: k, pivot: N, type: 'move' })
          : p({ startX: N, endX: N, type: 'resize' })
      },
      [t, a, u, s],
    ),
    v = L.useCallback(
      (_) => {
        if (!u.current) return
        const N = _.clientX - u.current.getBoundingClientRect().left,
          I = at(a.width, t, N),
          O = e == null ? void 0 : e.actions.findLast((Oe) => Oe.startTime <= I)
        if (!_.buttons) {
          p(void 0)
          return
        }
        if ((O && n(O), !c)) return
        let k = c
        if (c.type === 'resize') k = { ...c, endX: N }
        else {
          const Oe = N - c.pivot
          let ke = c.startX + Oe,
            Te = c.endX + Oe
          ke < 0 && ((ke = 0), (Te = ke + (c.endX - c.startX))),
            Te > a.width && ((Te = a.width), (ke = Te - (c.endX - c.startX))),
            (k = { ...c, startX: ke, endX: Te, pivot: N })
        }
        p(k)
        const P = at(a.width, t, k.startX),
          q = at(a.width, t, k.endX)
        P !== q && o({ minimum: Math.min(P, q), maximum: Math.max(P, q) })
      },
      [t, c, a, e, n, u, o],
    ),
    S = L.useCallback(() => {
      if ((y(void 0), !!c)) {
        if (c.startX !== c.endX) {
          const _ = at(a.width, t, c.startX),
            N = at(a.width, t, c.endX)
          o({ minimum: Math.min(_, N), maximum: Math.max(_, N) })
        } else {
          const _ = at(a.width, t, c.startX),
            N = e == null ? void 0 : e.actions.findLast((I) => I.startTime <= _)
          N && n(N), o(void 0)
        }
        p(void 0)
      }
    }, [t, c, a, e, o, n]),
    T = L.useCallback(
      (_) => {
        if (!u.current) return
        const N = _.clientX - u.current.getBoundingClientRect().left,
          I = at(a.width, t, N),
          O = e == null ? void 0 : e.actions.findLast((k) => k.startTime <= I)
        y({ x: N, clientY: _.clientY, action: O, sdkLanguage: l })
      },
      [t, a, e, u, l],
    ),
    C = L.useCallback(() => {
      y(void 0)
    }, []),
    E = L.useCallback(() => {
      o(void 0)
    }, [o])
  return b('div', {
    style: { flex: 'none', borderBottom: '1px solid var(--vscode-panel-border)' },
    children: [
      m(H0, {
        enabled: !!c,
        cursor: (c == null ? void 0 : c.type) === 'resize' ? 'ew-resize' : 'grab',
        onPaneMouseUp: S,
        onPaneMouseMove: v,
        onPaneDoubleClick: E,
      }),
      b('div', {
        ref: u,
        className: 'timeline-view',
        onMouseDown: d,
        onMouseMove: T,
        onMouseLeave: C,
        children: [
          m('div', {
            className: 'timeline-grid',
            children: g.map((_, N) =>
              m(
                'div',
                {
                  className: 'timeline-divider',
                  style: { left: _.position + 'px' },
                  children: m('div', { className: 'timeline-time', children: kt(_.time - t.minimum) }),
                },
                N,
              ),
            ),
          }),
          m('div', { style: { height: 8 } }),
          m(q0, { model: e, boundaries: t, previewPoint: f }),
          m('div', {
            className: 'timeline-bars',
            children: h.map((_, N) =>
              m(
                'div',
                {
                  className:
                    'timeline-bar' +
                    (_.action ? ' action' : '') +
                    (_.resource ? ' network' : '') +
                    (_.active ? ' active' : '') +
                    (_.error ? ' error' : ''),
                  style: {
                    left: _.leftPosition,
                    width: Math.max(1, _.rightPosition - _.leftPosition),
                    top: X0(_),
                    bottom: 0,
                  },
                },
                N,
              ),
            ),
          }),
          m('div', {
            className: 'timeline-marker',
            style: { display: f !== void 0 ? 'block' : 'none', left: ((f == null ? void 0 : f.x) || 0) + 'px' },
          }),
          s &&
            b('div', {
              className: 'timeline-window',
              children: [
                m('div', { className: 'timeline-window-curtain left', style: { width: w } }),
                m('div', { className: 'timeline-window-resizer', style: { left: -5 } }),
                m('div', {
                  className: 'timeline-window-center',
                  children: m('div', { className: 'timeline-window-drag' }),
                }),
                m('div', { className: 'timeline-window-resizer', style: { left: 5 } }),
                m('div', { className: 'timeline-window-curtain right', style: { width: x } }),
              ],
            }),
        ],
      }),
    ],
  })
}
function Q0(e, t) {
  let r = e / 64
  const i = t.maximum - t.minimum,
    s = e / i
  let o = i / r
  const l = Math.ceil(Math.log(o) / Math.LN10)
  ;(o = Math.pow(10, l)), o * s >= 5 * 64 && (o = o / 5), o * s >= 2 * 64 && (o = o / 2)
  const a = t.minimum
  let u = t.maximum
  ;(u += 64 / s), (r = Math.ceil((u - a) / o)), o || (r = 0)
  const c = []
  for (let p = 0; p < r; ++p) {
    const f = a + o * p
    c.push({ position: ut(e, t, f), time: f })
  }
  return c
}
function ut(e, t, n) {
  return ((n - t.minimum) / (t.maximum - t.minimum)) * e
}
function at(e, t, n) {
  return (n / e) * (t.maximum - t.minimum) + t.minimum
}
function X0(e) {
  return e.resource ? 25 : 20
}
const G0 = ({ model: e }) => {
  var t, n
  return e
    ? b('div', {
        className: 'metadata-view vbox',
        children: [
          m('div', { className: 'call-section', style: { paddingTop: 2 }, children: 'Time' }),
          !!e.wallTime &&
            b('div', {
              className: 'call-line',
              children: [
                'start time:',
                m('span', {
                  className: 'call-value datetime',
                  title: new Date(e.wallTime).toLocaleString(),
                  children: new Date(e.wallTime).toLocaleString(),
                }),
              ],
            }),
          b('div', {
            className: 'call-line',
            children: [
              'duration:',
              m('span', {
                className: 'call-value number',
                title: kt(e.endTime - e.startTime),
                children: kt(e.endTime - e.startTime),
              }),
            ],
          }),
          m('div', { className: 'call-section', children: 'Browser' }),
          b('div', {
            className: 'call-line',
            children: [
              'engine:',
              m('span', { className: 'call-value string', title: e.browserName, children: e.browserName }),
            ],
          }),
          e.channel &&
            b('div', {
              className: 'call-line',
              children: [
                'channel:',
                m('span', { className: 'call-value string', title: e.channel, children: e.channel }),
              ],
            }),
          e.platform &&
            b('div', {
              className: 'call-line',
              children: [
                'platform:',
                m('span', { className: 'call-value string', title: e.platform, children: e.platform }),
              ],
            }),
          e.options.userAgent &&
            b('div', {
              className: 'call-line',
              children: [
                'user agent:',
                m('span', {
                  className: 'call-value datetime',
                  title: e.options.userAgent,
                  children: e.options.userAgent,
                }),
              ],
            }),
          m('div', { className: 'call-section', children: 'Viewport' }),
          e.options.viewport &&
            b('div', {
              className: 'call-line',
              children: [
                'width:',
                m('span', {
                  className: 'call-value number',
                  title: String(!!((t = e.options.viewport) != null && t.width)),
                  children: e.options.viewport.width,
                }),
              ],
            }),
          e.options.viewport &&
            b('div', {
              className: 'call-line',
              children: [
                'height:',
                m('span', {
                  className: 'call-value number',
                  title: String(!!((n = e.options.viewport) != null && n.height)),
                  children: e.options.viewport.height,
                }),
              ],
            }),
          b('div', {
            className: 'call-line',
            children: [
              'is mobile:',
              m('span', {
                className: 'call-value boolean',
                title: String(!!e.options.isMobile),
                children: String(!!e.options.isMobile),
              }),
            ],
          }),
          e.options.deviceScaleFactor &&
            b('div', {
              className: 'call-line',
              children: [
                'device scale:',
                m('span', {
                  className: 'call-value number',
                  title: String(e.options.deviceScaleFactor),
                  children: String(e.options.deviceScaleFactor),
                }),
              ],
            }),
          m('div', { className: 'call-section', children: 'Counts' }),
          b('div', {
            className: 'call-line',
            children: ['pages:', m('span', { className: 'call-value number', children: e.pages.length })],
          }),
          b('div', {
            className: 'call-line',
            children: ['actions:', m('span', { className: 'call-value number', children: e.actions.length })],
          }),
          b('div', {
            className: 'call-line',
            children: ['events:', m('span', { className: 'call-value number', children: e.events.length })],
          }),
        ],
      })
    : m(mt, {})
}
const K0 = ({ imageDiff: e }) => {
    const [t, n] = L.useState(e.diff ? 'diff' : 'actual'),
      r = L.useRef(null),
      i = L.useRef(null),
      [s, o] = L.useState(0),
      l = (a) => {
        if ((r.current && (r.current.style.minHeight = r.current.offsetHeight + 'px'), a && r.current && i.current)) {
          const u = Math.max(0, (r.current.offsetWidth - i.current.offsetWidth) / 2 - 20)
          a === 'left' ? o(u) : a === 'right' && o(r.current.offsetWidth - u)
        }
      }
    return b('div', {
      className: 'vbox image-diff-view',
      children: [
        b('div', {
          className: 'hbox modes',
          children: [
            e.diff && m('div', { onClick: () => n('diff'), children: 'Diff' }),
            m('div', { onClick: () => n('actual'), children: 'Actual' }),
            m('div', { onClick: () => n('expected'), children: 'Expected' }),
          ],
        }),
        b('div', {
          style: { position: 'relative' },
          ref: r,
          children: [
            e.diff && t === 'diff' && m(Kt, { src: e.diff.attachment.path, onLoad: () => l() }),
            e.diff &&
              t === 'actual' &&
              b(vc, {
                sliderPosition: s,
                setSliderPosition: o,
                children: [
                  m(Kt, {
                    src: e.expected.attachment.path,
                    onLoad: () => l('right'),
                    imageRef: i,
                    style: { boxShadow: 'none' },
                  }),
                  m(Kt, { src: e.actual.attachment.path }),
                ],
              }),
            e.diff &&
              t === 'expected' &&
              b(vc, {
                sliderPosition: s,
                setSliderPosition: o,
                children: [
                  m(Kt, { src: e.expected.attachment.path, onLoad: () => l('left'), imageRef: i }),
                  m(Kt, { src: e.actual.attachment.path, style: { boxShadow: 'none' } }),
                ],
              }),
            !e.diff && t === 'actual' && m(Kt, { src: e.actual.attachment.path, onLoad: () => l() }),
            !e.diff && t === 'expected' && m(Kt, { src: e.expected.attachment.path, onLoad: () => l() }),
          ],
        }),
      ],
    })
  },
  vc = ({ children: e, sliderPosition: t, setSliderPosition: n }) => {
    const [r, i] = L.useState(null),
      s = t,
      o = L.Children.toArray(e)
    document.body.style.userSelect = r ? 'none' : 'inherit'
    const l = {
      ...Mi,
      zIndex: 100,
      cursor: 'ew-resize',
      left: r ? 0 : s - 4,
      right: r ? 0 : void 0,
      width: r ? 'initial' : 8,
    }
    return b(mt, {
      children: [
        o[0],
        b('div', {
          style: { ...Mi },
          children: [
            m('div', {
              style: {
                ...Mi,
                display: 'flex',
                zIndex: 50,
                clip: `rect(0, ${s}px, auto, 0)`,
                backgroundColor: 'var(--vscode-panel-background)',
              },
              children: o[1],
            }),
            m('div', {
              style: l,
              onMouseDown: (a) => i({ offset: a.clientX, size: s }),
              onMouseUp: () => i(null),
              onMouseMove: (a) => {
                if (!a.buttons) i(null)
                else if (r) {
                  const c = a.clientX - r.offset,
                    p = r.size + c,
                    y = a.target.parentElement.getBoundingClientRect(),
                    g = Math.min(Math.max(0, p), y.width)
                  n(g)
                }
              },
            }),
            b('div', {
              'data-testid': 'test-result-image-mismatch-grip',
              style: {
                ...Mi,
                left: s - 1,
                width: 20,
                zIndex: 80,
                margin: '10px -10px',
                pointerEvents: 'none',
                display: 'flex',
              },
              children: [
                m('div', {
                  style: {
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: 9,
                    width: 2,
                    backgroundColor: 'var(--vscode-panel-border)',
                  },
                }),
                b('svg', {
                  style: { fill: 'var(--vscode-panel-border)' },
                  viewBox: '0 0 27 20',
                  children: [m('path', { d: 'M9.6 0L0 9.6l9.6 9.6z' }), m('path', { d: 'M17 19.2l9.5-9.6L16.9 0z' })],
                }),
              ],
            }),
          ],
        }),
      ],
    })
  },
  Kt = ({ src: e, onLoad: t, imageRef: n, style: r }) => {
    const i = L.useRef(null),
      s = n ?? i,
      [o, l] = L.useState(null)
    return b('div', {
      className: 'image-wrapper',
      children: [
        b('div', {
          children: [
            m('span', { style: { flex: '1 1 0', textAlign: 'end' }, children: o ? o.width : '' }),
            m('span', { style: { flex: 'none', margin: '0 5px' }, children: 'x' }),
            m('span', { style: { flex: '1 1 0', textAlign: 'start' }, children: o ? o.height : '' }),
          ],
        }),
        m('img', {
          draggable: 'false',
          src: e,
          onLoad: () => {
            t == null || t(), s.current && l({ width: s.current.naturalWidth, height: s.current.naturalHeight })
          },
          ref: s,
          style: r,
        }),
      ],
    })
  },
  Mi = { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 },
  J0 = ({ model: e }) => {
    const {
      diffMap: t,
      screenshots: n,
      attachments: r,
    } = L.useMemo(() => {
      const i = new Set(),
        s = new Set()
      for (const l of (e == null ? void 0 : e.actions) || []) {
        const a = l.context.traceUrl
        for (const u of l.attachments || []) i.add({ ...u, traceUrl: a })
      }
      const o = new Map()
      for (const l of i) {
        if (!l.path && !l.sha1) continue
        const a = l.name.match(/^(.*)-(expected|actual|diff)\.png$/)
        if (a) {
          const u = a[1],
            c = a[2],
            p = o.get(u) || { expected: void 0, actual: void 0, diff: void 0 }
          ;(p[c] = l), o.set(u, p)
        }
        l.contentType.startsWith('image/') && (s.add(l), i.delete(l))
      }
      return { diffMap: o, attachments: i, screenshots: s }
    }, [e])
    return !t.size && !n.size && !r.size
      ? m(nr, { text: 'No attachments' })
      : b('div', {
          className: 'attachments-tab',
          children: [
            [...t.values()].map(({ expected: i, actual: s, diff: o }) =>
              b(mt, {
                children: [
                  i && s && m('div', { className: 'attachments-section', children: 'Image diff' }),
                  i &&
                    s &&
                    m(K0, {
                      imageDiff: {
                        name: 'Image diff',
                        expected: { attachment: { ...i, path: wr(i) }, title: 'Expected' },
                        actual: { attachment: { ...s, path: wr(s) } },
                        diff: o ? { attachment: { ...o, path: wr(o) } } : void 0,
                      },
                    }),
                ],
              }),
            ),
            n.size ? m('div', { className: 'attachments-section', children: 'Screenshots' }) : void 0,
            [...n.values()].map((i, s) => {
              const o = wr(i)
              return b(
                'div',
                {
                  className: 'attachment-item',
                  children: [
                    m('div', { children: m('img', { draggable: 'false', src: o }) }),
                    m('div', { children: m('a', { target: '_blank', href: o, children: i.name }) }),
                  ],
                },
                `screenshot-${s}`,
              )
            }),
            r.size ? m('div', { className: 'attachments-section', children: 'Attachments' }) : void 0,
            [...r.values()].map((i, s) =>
              m(
                'div',
                { className: 'attachment-item', children: m('a', { href: wr(i) + '&download', children: i.name }) },
                `attachment-${s}`,
              ),
            ),
          ],
        })
  }
function wr(e) {
  return e.sha1
    ? 'sha1/' + e.sha1 + '?trace=' + encodeURIComponent(e.traceUrl)
    : 'file?path=' + encodeURIComponent(e.path)
}
const Y0 = ({ sdkLanguage: e, setIsInspecting: t, highlightedLocator: n, setHighlightedLocator: r }) =>
    b('div', {
      className: 'vbox',
      style: { backgroundColor: 'var(--vscode-sideBar-background)' },
      children: [
        m('div', {
          style: { margin: '10px 0px 10px 10px', color: 'var(--vscode-editorCodeLens-foreground)', flex: 'none' },
          children: 'Locator',
        }),
        m('div', {
          style: { margin: '0 10px 10px', flex: 'auto' },
          children: m(qs, {
            text: n,
            language: e,
            focusOnChange: !0,
            isFocused: !0,
            wrapLines: !0,
            onChange: (i) => {
              r(i), t(!1)
            },
          }),
        }),
        m('div', {
          style: { position: 'absolute', right: 5, top: 5 },
          children: m(ln, {
            icon: 'files',
            title: 'Copy locator',
            onClick: () => {
              Op(n)
            },
          }),
        }),
      ],
    }),
  cw = ({
    model: e,
    hideStackFrames: t,
    showSourcesFirst: n,
    rootDir: r,
    fallbackLocation: i,
    initialSelection: s,
    onSelectionChanged: o,
    isLive: l,
  }) => {
    const [a, u] = L.useState(void 0),
      [c, p] = L.useState(),
      [f, y] = L.useState(),
      [g, w] = L.useState('actions'),
      [x, h] = Ki('propertiesTab', n ? 'source' : 'call'),
      [d, v] = L.useState(!1),
      [S, T] = L.useState(''),
      C = e ? c || a : void 0,
      [E, _] = L.useState(),
      [N, I] = Ki('propertiesSidebarLocation', 'bottom'),
      O = L.useMemo(() => (e == null ? void 0 : e.sources) || new Map(), [e])
    L.useEffect(() => {
      _(void 0)
    }, [e]),
      L.useEffect(() => {
        if (a && e != null && e.actions.includes(a)) return
        const Q = e == null ? void 0 : e.failedAction()
        s && e != null && e.actions.includes(s)
          ? u(s)
          : Q
          ? u(Q)
          : e != null && e.actions.length && u(e.actions[e.actions.length - 1])
      }, [e, a, u, s])
    const k = L.useCallback(
        (Q) => {
          u(Q), o == null || o(Q)
        },
        [u, o],
      ),
      P = L.useCallback(
        (Q) => {
          h(Q), Q !== 'inspector' && v(!1)
        },
        [h],
      ),
      q = L.useCallback(
        (Q) => {
          T(Q), P('inspector')
        },
        [P],
      ),
      Oe = Fv(e, E),
      ke = Yv(e, E),
      Te = Ov(e),
      M = L.useMemo(() => (e == null ? void 0 : e.actions.map((Q) => Q.attachments || []).flat()) || [], [e]),
      $ = (e == null ? void 0 : e.sdkLanguage) || 'javascript',
      z = {
        id: 'inspector',
        title: 'Locator',
        render: () => m(Y0, { sdkLanguage: $, setIsInspecting: v, highlightedLocator: S, setHighlightedLocator: T }),
      },
      V = { id: 'call', title: 'Call', render: () => m(bv, { action: C, sdkLanguage: $ }) },
      ee = { id: 'log', title: 'Log', render: () => m(Mv, { action: C }) },
      wn = {
        id: 'errors',
        title: 'Errors',
        errorCount: Te.errors.size,
        render: () => m(zv, { errorsModel: Te, sdkLanguage: $, boundaries: ci }),
      },
      Je = {
        id: 'source',
        title: 'Source',
        render: () => m(U0, { action: C, sources: O, hideStackFrames: t, rootDir: r, fallbackLocation: i }),
      },
      ir = {
        id: 'console',
        title: 'Console',
        count: Oe.entries.length,
        render: () => m(Uv, { consoleModel: Oe, boundaries: ci, selectedTime: E }),
      },
      gt = {
        id: 'network',
        title: 'Network',
        count: ke.resources.length,
        render: () => m(Zv, { boundaries: ci, networkModel: ke, onEntryHovered: y }),
      },
      Sn = { id: 'attachments', title: 'Attachments', count: M.length, render: () => m(J0, { model: e }) },
      ui = [z, V, ee, wn, ir, gt, Je, Sn]
    if (n) {
      const Q = ui.indexOf(Je)
      ui.splice(Q, 1), ui.splice(1, 0, Je)
    }
    const { boundaries: ci } = L.useMemo(() => {
      const Q = { minimum: (e == null ? void 0 : e.startTime) || 0, maximum: (e == null ? void 0 : e.endTime) || 3e4 }
      return (
        Q.minimum > Q.maximum && ((Q.minimum = 0), (Q.maximum = 3e4)),
        (Q.maximum += (Q.maximum - Q.minimum) / 20),
        { boundaries: Q }
      )
    }, [e])
    return b('div', {
      className: 'vbox workbench',
      children: [
        m(V0, {
          model: e,
          boundaries: ci,
          highlightedAction: c,
          highlightedEntry: f,
          onSelected: k,
          sdkLanguage: $,
          selectedTime: E,
          setSelectedTime: _,
        }),
        b(ml, {
          sidebarSize: 250,
          orientation: 'horizontal',
          sidebarIsFirst: !0,
          settingName: 'actionListSidebar',
          children: [
            b(ml, {
              sidebarSize: 250,
              orientation: N === 'bottom' ? 'vertical' : 'horizontal',
              settingName: 'propertiesSidebar',
              children: [
                m($0, {
                  action: C,
                  sdkLanguage: $,
                  testIdAttributeName: (e == null ? void 0 : e.testIdAttributeName) || 'data-testid',
                  isInspecting: d,
                  setIsInspecting: v,
                  highlightedLocator: S,
                  setHighlightedLocator: q,
                }),
                m(wl, {
                  tabs: ui,
                  selectedTab: x,
                  setSelectedTab: P,
                  leftToolbar: [
                    m(ln, {
                      title: 'Pick locator',
                      icon: 'target',
                      toggled: d,
                      onClick: () => {
                        d || P('inspector'), v(!d)
                      },
                    }),
                  ],
                  rightToolbar: [
                    N === 'bottom'
                      ? m(ln, {
                          title: 'Dock to right',
                          icon: 'layout-sidebar-right-off',
                          onClick: () => {
                            I('right')
                          },
                        })
                      : m(ln, {
                          title: 'Dock to bottom',
                          icon: 'layout-panel-off',
                          onClick: () => {
                            I('bottom')
                          },
                        }),
                  ],
                }),
              ],
            }),
            m(wl, {
              tabs: [
                {
                  id: 'actions',
                  title: 'Actions',
                  component: m(Av, {
                    sdkLanguage: $,
                    actions: (e == null ? void 0 : e.actions) || [],
                    selectedAction: e ? a : void 0,
                    selectedTime: E,
                    setSelectedTime: _,
                    onSelected: k,
                    onHighlighted: p,
                    revealConsole: () => P('console'),
                    isLive: l,
                  }),
                },
                { id: 'metadata', title: 'Metadata', component: m(G0, { model: e }) },
              ],
              selectedTab: g,
              setSelectedTab: w,
            }),
          ],
        }),
      ],
    })
  }
let Z0 = 0,
  up
const Nl = new Map()
async function fw(e) {
  const t = new URLSearchParams(window.location.search).get('ws'),
    n = new WebSocket(
      `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.hostname}:${
        window.location.port
      }/${t}`,
    )
  return (
    await new Promise((r) => n.addEventListener('open', r)),
    n.addEventListener('close', e.onClose),
    n.addEventListener('message', (r) => {
      const i = JSON.parse(r.data),
        { id: s, result: o, error: l, method: a, params: u } = i
      if (s) {
        const c = Nl.get(s)
        if (!c) return
        Nl.delete(s), l ? c.reject(new Error(l)) : c.resolve(o)
      } else e.onEvent(a, u)
    }),
    (up = n),
    setInterval(() => yc('ping').catch(() => {}), 3e4),
    yc
  )
}
const yc = async (e, t) => {
  const n = ++Z0,
    r = { id: n, method: e, params: t }
  return (
    up.send(JSON.stringify(r)),
    new Promise((i, s) => {
      Nl.set(n, { resolve: i, reject: s })
    })
  )
}
export {
  aw as M,
  rn as R,
  ml as S,
  ln as T,
  cw as W,
  Vv as _,
  m as a,
  nw as b,
  fw as c,
  lw as d,
  ow as e,
  iw as f,
  sw as g,
  Ki as h,
  sh as i,
  b as j,
  uw as k,
  Tv as l,
  kt as m,
  dp as n,
  tw as o,
  L as r,
  $r as s,
  rw as t,
  ni as u,
}
