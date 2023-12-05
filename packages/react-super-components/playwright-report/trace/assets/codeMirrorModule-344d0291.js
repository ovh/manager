import { n as vu, o as gu } from './wsPort-2e1dc307.js'
var pa = { exports: {} }
;(function (mr, Or) {
  ;(function (I, Pe) {
    mr.exports = Pe()
  })(gu, function () {
    var I = navigator.userAgent,
      Pe = navigator.platform,
      we = /gecko\/\d/i.test(I),
      He = /MSIE \d/.test(I),
      $e = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(I),
      Ce = /Edge\/(\d+)/.exec(I),
      M = He || $e || Ce,
      j = M && (He ? document.documentMode || 6 : +(Ce || $e)[1]),
      W = !Ce && /WebKit\//.test(I),
      ee = W && /Qt\/\d+\.\d+/.test(I),
      G = !Ce && /Chrome\/(\d+)/.exec(I),
      ue = G && +G[1],
      ce = /Opera\//.test(I),
      Ee = /Apple Computer/.test(navigator.vendor),
      Se = /Mac OS X 1\d\D([8-9]|\d\d)\D/.test(I),
      Ae = /PhantomJS/.test(I),
      re = Ee && (/Mobile\/\w+/.test(I) || navigator.maxTouchPoints > 2),
      J = /Android/.test(I),
      te = re || J || /webOS|BlackBerry|Opera Mini|Opera Mobi|IEMobile/i.test(I),
      xe = re || /Mac/.test(Pe),
      Be = /\bCrOS\b/.test(I),
      ye = /win/i.test(Pe),
      Le = ce && I.match(/Version\/(\d*\.\d*)/)
    Le && (Le = Number(Le[1])), Le && Le >= 15 && ((ce = !1), (W = !0))
    var Re = xe && (ee || (ce && (Le == null || Le < 12.11))),
      $ = we || (M && j >= 9)
    function X(e) {
      return new RegExp('(^|\\s)' + e + '(?:$|\\s)\\s*')
    }
    var me = function (e, t) {
      var n = e.className,
        r = X(t).exec(n)
      if (r) {
        var i = n.slice(r.index + r[0].length)
        e.className = n.slice(0, r.index) + (i ? r[1] + i : '')
      }
    }
    function L(e) {
      for (var t = e.childNodes.length; t > 0; --t) e.removeChild(e.firstChild)
      return e
    }
    function _(e, t) {
      return L(e).appendChild(t)
    }
    function c(e, t, n, r) {
      var i = document.createElement(e)
      if ((n && (i.className = n), r && (i.style.cssText = r), typeof t == 'string'))
        i.appendChild(document.createTextNode(t))
      else if (t) for (var o = 0; o < t.length; ++o) i.appendChild(t[o])
      return i
    }
    function w(e, t, n, r) {
      var i = c(e, t, n, r)
      return i.setAttribute('role', 'presentation'), i
    }
    var x
    document.createRange
      ? (x = function (e, t, n, r) {
          var i = document.createRange()
          return i.setEnd(r || e, n), i.setStart(e, t), i
        })
      : (x = function (e, t, n) {
          var r = document.body.createTextRange()
          try {
            r.moveToElementText(e.parentNode)
          } catch {
            return r
          }
          return r.collapse(!0), r.moveEnd('character', n), r.moveStart('character', t), r
        })
    function v(e, t) {
      if ((t.nodeType == 3 && (t = t.parentNode), e.contains)) return e.contains(t)
      do if ((t.nodeType == 11 && (t = t.host), t == e)) return !0
      while ((t = t.parentNode))
    }
    function y(e) {
      var t
      try {
        t = e.activeElement
      } catch {
        t = e.body || null
      }
      for (; t && t.shadowRoot && t.shadowRoot.activeElement; ) t = t.shadowRoot.activeElement
      return t
    }
    function D(e, t) {
      var n = e.className
      X(t).test(n) || (e.className += (n ? ' ' : '') + t)
    }
    function B(e, t) {
      for (var n = e.split(' '), r = 0; r < n.length; r++) n[r] && !X(n[r]).test(t) && (t += ' ' + n[r])
      return t
    }
    var Q = function (e) {
      e.select()
    }
    re
      ? (Q = function (e) {
          ;(e.selectionStart = 0), (e.selectionEnd = e.value.length)
        })
      : M &&
        (Q = function (e) {
          try {
            e.select()
          } catch {}
        })
    function ae(e) {
      return e.display.wrapper.ownerDocument
    }
    function Ze(e) {
      return ae(e).defaultView
    }
    function We(e) {
      var t = Array.prototype.slice.call(arguments, 1)
      return function () {
        return e.apply(null, t)
      }
    }
    function V(e, t, n) {
      t || (t = {})
      for (var r in e) e.hasOwnProperty(r) && (n !== !1 || !t.hasOwnProperty(r)) && (t[r] = e[r])
      return t
    }
    function U(e, t, n, r, i) {
      t == null && ((t = e.search(/[^\s\u00a0]/)), t == -1 && (t = e.length))
      for (var o = r || 0, l = i || 0; ; ) {
        var a = e.indexOf('	', o)
        if (a < 0 || a >= t) return l + (t - o)
        ;(l += a - o), (l += n - (l % n)), (o = a + 1)
      }
    }
    var fe = function () {
      ;(this.id = null), (this.f = null), (this.time = 0), (this.handler = We(this.onTimeout, this))
    }
    ;(fe.prototype.onTimeout = function (e) {
      ;(e.id = 0), e.time <= +new Date() ? e.f() : setTimeout(e.handler, e.time - +new Date())
    }),
      (fe.prototype.set = function (e, t) {
        this.f = t
        var n = +new Date() + e
        ;(!this.id || n < this.time) &&
          (clearTimeout(this.id), (this.id = setTimeout(this.handler, e)), (this.time = n))
      })
    function se(e, t) {
      for (var n = 0; n < e.length; ++n) if (e[n] == t) return n
      return -1
    }
    var ge = 50,
      ie = {
        toString: function () {
          return 'CodeMirror.Pass'
        },
      },
      Ie = { scroll: !1 },
      Mt = { origin: '*mouse' },
      Ot = { origin: '+move' }
    function yt(e, t, n) {
      for (var r = 0, i = 0; ; ) {
        var o = e.indexOf('	', r)
        o == -1 && (o = e.length)
        var l = o - r
        if (o == e.length || i + l >= t) return r + Math.min(l, t - i)
        if (((i += o - r), (i += n - (i % n)), (r = o + 1), i >= t)) return r
      }
    }
    var Te = ['']
    function Ue(e) {
      for (; Te.length <= e; ) Te.push(de(Te) + ' ')
      return Te[e]
    }
    function de(e) {
      return e[e.length - 1]
    }
    function st(e, t) {
      for (var n = [], r = 0; r < e.length; r++) n[r] = t(e[r], r)
      return n
    }
    function qe(e, t, n) {
      for (var r = 0, i = n(t); r < e.length && n(e[r]) <= i; ) r++
      e.splice(r, 0, t)
    }
    function Oe() {}
    function k(e, t) {
      var n
      return Object.create ? (n = Object.create(e)) : ((Oe.prototype = e), (n = new Oe())), t && V(t, n), n
    }
    var A = /[\u00df\u0587\u0590-\u05f4\u0600-\u06ff\u3040-\u309f\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcc\uac00-\ud7af]/
    function T(e) {
      return /\w/.test(e) || (e > '' && (e.toUpperCase() != e.toLowerCase() || A.test(e)))
    }
    function pe(e, t) {
      return t ? (t.source.indexOf('\\w') > -1 && T(e) ? !0 : t.test(e)) : T(e)
    }
    function R(e) {
      for (var t in e) if (e.hasOwnProperty(t) && e[t]) return !1
      return !0
    }
    var ne =
      /[\u0300-\u036f\u0483-\u0489\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u0610-\u061a\u064b-\u065e\u0670\u06d6-\u06dc\u06de-\u06e4\u06e7\u06e8\u06ea-\u06ed\u0711\u0730-\u074a\u07a6-\u07b0\u07eb-\u07f3\u0816-\u0819\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0900-\u0902\u093c\u0941-\u0948\u094d\u0951-\u0955\u0962\u0963\u0981\u09bc\u09be\u09c1-\u09c4\u09cd\u09d7\u09e2\u09e3\u0a01\u0a02\u0a3c\u0a41\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a70\u0a71\u0a75\u0a81\u0a82\u0abc\u0ac1-\u0ac5\u0ac7\u0ac8\u0acd\u0ae2\u0ae3\u0b01\u0b3c\u0b3e\u0b3f\u0b41-\u0b44\u0b4d\u0b56\u0b57\u0b62\u0b63\u0b82\u0bbe\u0bc0\u0bcd\u0bd7\u0c3e-\u0c40\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c62\u0c63\u0cbc\u0cbf\u0cc2\u0cc6\u0ccc\u0ccd\u0cd5\u0cd6\u0ce2\u0ce3\u0d3e\u0d41-\u0d44\u0d4d\u0d57\u0d62\u0d63\u0dca\u0dcf\u0dd2-\u0dd4\u0dd6\u0ddf\u0e31\u0e34-\u0e3a\u0e47-\u0e4e\u0eb1\u0eb4-\u0eb9\u0ebb\u0ebc\u0ec8-\u0ecd\u0f18\u0f19\u0f35\u0f37\u0f39\u0f71-\u0f7e\u0f80-\u0f84\u0f86\u0f87\u0f90-\u0f97\u0f99-\u0fbc\u0fc6\u102d-\u1030\u1032-\u1037\u1039\u103a\u103d\u103e\u1058\u1059\u105e-\u1060\u1071-\u1074\u1082\u1085\u1086\u108d\u109d\u135f\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17b7-\u17bd\u17c6\u17c9-\u17d3\u17dd\u180b-\u180d\u18a9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193b\u1a17\u1a18\u1a56\u1a58-\u1a5e\u1a60\u1a62\u1a65-\u1a6c\u1a73-\u1a7c\u1a7f\u1b00-\u1b03\u1b34\u1b36-\u1b3a\u1b3c\u1b42\u1b6b-\u1b73\u1b80\u1b81\u1ba2-\u1ba5\u1ba8\u1ba9\u1c2c-\u1c33\u1c36\u1c37\u1cd0-\u1cd2\u1cd4-\u1ce0\u1ce2-\u1ce8\u1ced\u1dc0-\u1de6\u1dfd-\u1dff\u200c\u200d\u20d0-\u20f0\u2cef-\u2cf1\u2de0-\u2dff\u302a-\u302f\u3099\u309a\ua66f-\ua672\ua67c\ua67d\ua6f0\ua6f1\ua802\ua806\ua80b\ua825\ua826\ua8c4\ua8e0-\ua8f1\ua926-\ua92d\ua947-\ua951\ua980-\ua982\ua9b3\ua9b6-\ua9b9\ua9bc\uaa29-\uaa2e\uaa31\uaa32\uaa35\uaa36\uaa43\uaa4c\uaab0\uaab2-\uaab4\uaab7\uaab8\uaabe\uaabf\uaac1\uabe5\uabe8\uabed\udc00-\udfff\ufb1e\ufe00-\ufe0f\ufe20-\ufe26\uff9e\uff9f]/
    function q(e) {
      return e.charCodeAt(0) >= 768 && ne.test(e)
    }
    function be(e, t, n) {
      for (; (n < 0 ? t > 0 : t < e.length) && q(e.charAt(t)); ) t += n
      return t
    }
    function he(e, t, n) {
      for (var r = t > n ? -1 : 1; ; ) {
        if (t == n) return t
        var i = (t + n) / 2,
          o = r < 0 ? Math.ceil(i) : Math.floor(i)
        if (o == t) return e(o) ? t : n
        e(o) ? (n = o) : (t = o + r)
      }
    }
    function Nt(e, t, n, r) {
      if (!e) return r(t, n, 'ltr', 0)
      for (var i = !1, o = 0; o < e.length; ++o) {
        var l = e[o]
        ;((l.from < n && l.to > t) || (t == n && l.to == t)) &&
          (r(Math.max(l.from, t), Math.min(l.to, n), l.level == 1 ? 'rtl' : 'ltr', o), (i = !0))
      }
      i || r(t, n, 'ltr')
    }
    var zt = null
    function Pt(e, t, n) {
      var r
      zt = null
      for (var i = 0; i < e.length; ++i) {
        var o = e[i]
        if (o.from < t && o.to > t) return i
        o.to == t && (o.from != o.to && n == 'before' ? (r = i) : (zt = i)),
          o.from == t && (o.from != o.to && n != 'before' ? (r = i) : (zt = i))
      }
      return r ?? zt
    }
    var vi = (function () {
      var e =
          'bbbbbbbbbtstwsbbbbbbbbbbbbbbssstwNN%%%NNNNNN,N,N1111111111NNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNbbbbbbsbbbbbbbbbbbbbbbbbbbbbbbbbb,N%%%%NNNNLNNNNN%%11NLNNN1LNNNNNLLLLLLLLLLLLLLLLLLLLLLLNLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLN',
        t =
          'nnnnnnNNr%%r,rNNmmmmmmmmmmmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmmmmmmmmmmmmmmmnnnnnnnnnn%nnrrrmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmnNmmmmmmrrmmNmmmmrr1111111111'
      function n(u) {
        return u <= 247
          ? e.charAt(u)
          : 1424 <= u && u <= 1524
          ? 'R'
          : 1536 <= u && u <= 1785
          ? t.charAt(u - 1536)
          : 1774 <= u && u <= 2220
          ? 'r'
          : 8192 <= u && u <= 8203
          ? 'w'
          : u == 8204
          ? 'b'
          : 'L'
      }
      var r = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/,
        i = /[stwN]/,
        o = /[LRr]/,
        l = /[Lb1n]/,
        a = /[1n]/
      function s(u, d, h) {
        ;(this.level = u), (this.from = d), (this.to = h)
      }
      return function (u, d) {
        var h = d == 'ltr' ? 'L' : 'R'
        if (u.length == 0 || (d == 'ltr' && !r.test(u))) return !1
        for (var b = u.length, m = [], C = 0; C < b; ++C) m.push(n(u.charCodeAt(C)))
        for (var N = 0, O = h; N < b; ++N) {
          var z = m[N]
          z == 'm' ? (m[N] = O) : (O = z)
        }
        for (var F = 0, P = h; F < b; ++F) {
          var H = m[F]
          H == '1' && P == 'r' ? (m[F] = 'n') : o.test(H) && ((P = H), H == 'r' && (m[F] = 'R'))
        }
        for (var Z = 1, Y = m[0]; Z < b - 1; ++Z) {
          var ve = m[Z]
          ve == '+' && Y == '1' && m[Z + 1] == '1'
            ? (m[Z] = '1')
            : ve == ',' && Y == m[Z + 1] && (Y == '1' || Y == 'n') && (m[Z] = Y),
            (Y = ve)
        }
        for (var Fe = 0; Fe < b; ++Fe) {
          var ot = m[Fe]
          if (ot == ',') m[Fe] = 'N'
          else if (ot == '%') {
            var Ge = void 0
            for (Ge = Fe + 1; Ge < b && m[Ge] == '%'; ++Ge);
            for (var Lt = (Fe && m[Fe - 1] == '!') || (Ge < b && m[Ge] == '1') ? '1' : 'N', wt = Fe; wt < Ge; ++wt)
              m[wt] = Lt
            Fe = Ge - 1
          }
        }
        for (var Qe = 0, kt = h; Qe < b; ++Qe) {
          var at = m[Qe]
          kt == 'L' && at == '1' ? (m[Qe] = 'L') : o.test(at) && (kt = at)
        }
        for (var tt = 0; tt < b; ++tt)
          if (i.test(m[tt])) {
            var Ve = void 0
            for (Ve = tt + 1; Ve < b && i.test(m[Ve]); ++Ve);
            for (
              var Ye = (tt ? m[tt - 1] : h) == 'L',
                St = (Ve < b ? m[Ve] : h) == 'L',
                Vr = Ye == St ? (Ye ? 'L' : 'R') : h,
                yr = tt;
              yr < Ve;
              ++yr
            )
              m[yr] = Vr
            tt = Ve - 1
          }
        for (var dt = [], Yt, lt = 0; lt < b; )
          if (l.test(m[lt])) {
            var so = lt
            for (++lt; lt < b && l.test(m[lt]); ++lt);
            dt.push(new s(0, so, lt))
          } else {
            var ir = lt,
              Nr = dt.length,
              Dr = d == 'rtl' ? 1 : 0
            for (++lt; lt < b && m[lt] != 'L'; ++lt);
            for (var gt = ir; gt < lt; )
              if (a.test(m[gt])) {
                ir < gt && (dt.splice(Nr, 0, new s(1, ir, gt)), (Nr += Dr))
                var $r = gt
                for (++gt; gt < lt && a.test(m[gt]); ++gt);
                dt.splice(Nr, 0, new s(2, $r, gt)), (Nr += Dr), (ir = gt)
              } else ++gt
            ir < lt && dt.splice(Nr, 0, new s(1, ir, lt))
          }
        return (
          d == 'ltr' &&
            (dt[0].level == 1 &&
              (Yt = u.match(/^\s+/)) &&
              ((dt[0].from = Yt[0].length), dt.unshift(new s(0, 0, Yt[0].length))),
            de(dt).level == 1 &&
              (Yt = u.match(/\s+$/)) &&
              ((de(dt).to -= Yt[0].length), dt.push(new s(0, b - Yt[0].length, b)))),
          d == 'rtl' ? dt.reverse() : dt
        )
      }
    })()
    function Et(e, t) {
      var n = e.order
      return n == null && (n = e.order = vi(e.text, t)), n
    }
    var Pn = [],
      E = function (e, t, n) {
        if (e.addEventListener) e.addEventListener(t, n, !1)
        else if (e.attachEvent) e.attachEvent('on' + t, n)
        else {
          var r = e._handlers || (e._handlers = {})
          r[t] = (r[t] || Pn).concat(n)
        }
      }
    function en(e, t) {
      return (e._handlers && e._handlers[t]) || Pn
    }
    function ut(e, t, n) {
      if (e.removeEventListener) e.removeEventListener(t, n, !1)
      else if (e.detachEvent) e.detachEvent('on' + t, n)
      else {
        var r = e._handlers,
          i = r && r[t]
        if (i) {
          var o = se(i, n)
          o > -1 && (r[t] = i.slice(0, o).concat(i.slice(o + 1)))
        }
      }
    }
    function _e(e, t) {
      var n = en(e, t)
      if (n.length) for (var r = Array.prototype.slice.call(arguments, 2), i = 0; i < n.length; ++i) n[i].apply(null, r)
    }
    function je(e, t, n) {
      return (
        typeof t == 'string' &&
          (t = {
            type: t,
            preventDefault: function () {
              this.defaultPrevented = !0
            },
          }),
        _e(e, n || t.type, e, t),
        tn(t) || t.codemirrorIgnore
      )
    }
    function En(e) {
      var t = e._handlers && e._handlers.cursorActivity
      if (t)
        for (var n = e.curOp.cursorActivityHandlers || (e.curOp.cursorActivityHandlers = []), r = 0; r < t.length; ++r)
          se(n, t[r]) == -1 && n.push(t[r])
    }
    function ht(e, t) {
      return en(e, t).length > 0
    }
    function pt(e) {
      ;(e.prototype.on = function (t, n) {
        E(this, t, n)
      }),
        (e.prototype.off = function (t, n) {
          ut(this, t, n)
        })
    }
    function ft(e) {
      e.preventDefault ? e.preventDefault() : (e.returnValue = !1)
    }
    function br(e) {
      e.stopPropagation ? e.stopPropagation() : (e.cancelBubble = !0)
    }
    function tn(e) {
      return e.defaultPrevented != null ? e.defaultPrevented : e.returnValue == !1
    }
    function Zt(e) {
      ft(e), br(e)
    }
    function mt(e) {
      return e.target || e.srcElement
    }
    function rn(e) {
      var t = e.which
      return (
        t == null && (e.button & 1 ? (t = 1) : e.button & 2 ? (t = 3) : e.button & 4 && (t = 2)),
        xe && e.ctrlKey && t == 1 && (t = 3),
        t
      )
    }
    var gi = (function () {
        if (M && j < 9) return !1
        var e = c('div')
        return 'draggable' in e || 'dragDrop' in e
      })(),
      It
    function yi(e) {
      if (It == null) {
        var t = c('span', '​')
        _(e, c('span', [t, document.createTextNode('x')])),
          e.firstChild.offsetHeight != 0 && (It = t.offsetWidth <= 1 && t.offsetHeight > 2 && !(M && j < 8))
      }
      var n = It ? c('span', '​') : c('span', ' ', null, 'display: inline-block; width: 1px; margin-right: -1px')
      return n.setAttribute('cm-text', ''), n
    }
    var zr
    function In(e) {
      if (zr != null) return zr
      var t = _(e, document.createTextNode('AخA')),
        n = x(t, 0, 1).getBoundingClientRect(),
        r = x(t, 1, 2).getBoundingClientRect()
      return L(e), !n || n.left == n.right ? !1 : (zr = r.right - n.right < 3)
    }
    var nn =
        `

b`.split(/\n/).length != 3
          ? function (e) {
              for (var t = 0, n = [], r = e.length; t <= r; ) {
                var i = e.indexOf(
                  `
`,
                  t,
                )
                i == -1 && (i = e.length)
                var o = e.slice(t, e.charAt(i - 1) == '\r' ? i - 1 : i),
                  l = o.indexOf('\r')
                l != -1 ? (n.push(o.slice(0, l)), (t += l + 1)) : (n.push(o), (t = i + 1))
              }
              return n
            }
          : function (e) {
              return e.split(/\r\n?|\n/)
            },
      or = window.getSelection
        ? function (e) {
            try {
              return e.selectionStart != e.selectionEnd
            } catch {
              return !1
            }
          }
        : function (e) {
            var t
            try {
              t = e.ownerDocument.selection.createRange()
            } catch {}
            return !t || t.parentElement() != e ? !1 : t.compareEndPoints('StartToEnd', t) != 0
          },
      Kt = (function () {
        var e = c('div')
        return 'oncopy' in e ? !0 : (e.setAttribute('oncopy', 'return;'), typeof e.oncopy == 'function')
      })(),
      Ut = null
    function Fn(e) {
      if (Ut != null) return Ut
      var t = _(e, c('span', 'x')),
        n = t.getBoundingClientRect(),
        r = x(t, 0, 1).getBoundingClientRect()
      return (Ut = Math.abs(n.left - r.left) > 1)
    }
    var Wt = {},
      lr = {}
    function Wn(e, t) {
      arguments.length > 2 && (t.dependencies = Array.prototype.slice.call(arguments, 2)), (Wt[e] = t)
    }
    function Pr(e, t) {
      lr[e] = t
    }
    function Ct(e) {
      if (typeof e == 'string' && lr.hasOwnProperty(e)) e = lr[e]
      else if (e && typeof e.name == 'string' && lr.hasOwnProperty(e.name)) {
        var t = lr[e.name]
        typeof t == 'string' && (t = { name: t }), (e = k(t, e)), (e.name = t.name)
      } else {
        if (typeof e == 'string' && /^[\w\-]+\/[\w\-]+\+xml$/.test(e)) return Ct('application/xml')
        if (typeof e == 'string' && /^[\w\-]+\/[\w\-]+\+json$/.test(e)) return Ct('application/json')
      }
      return typeof e == 'string' ? { name: e } : e || { name: 'null' }
    }
    function Jt(e, t) {
      t = Ct(t)
      var n = Wt[t.name]
      if (!n) return Jt(e, 'text/plain')
      var r = n(e, t)
      if (ar.hasOwnProperty(t.name)) {
        var i = ar[t.name]
        for (var o in i) i.hasOwnProperty(o) && (r.hasOwnProperty(o) && (r['_' + o] = r[o]), (r[o] = i[o]))
      }
      if (((r.name = t.name), t.helperType && (r.helperType = t.helperType), t.modeProps))
        for (var l in t.modeProps) r[l] = t.modeProps[l]
      return r
    }
    var ar = {}
    function _n(e, t) {
      var n = ar.hasOwnProperty(e) ? ar[e] : (ar[e] = {})
      V(t, n)
    }
    function Qt(e, t) {
      if (t === !0) return t
      if (e.copyState) return e.copyState(t)
      var n = {}
      for (var r in t) {
        var i = t[r]
        i instanceof Array && (i = i.concat([])), (n[r] = i)
      }
      return n
    }
    function sr(e, t) {
      for (var n; e.innerMode && ((n = e.innerMode(t)), !(!n || n.mode == e)); ) (t = n.state), (e = n.mode)
      return n || { mode: e, state: t }
    }
    function on(e, t, n) {
      return e.startState ? e.startState(t, n) : !0
    }
    var Xe = function (e, t, n) {
      ;(this.pos = this.start = 0),
        (this.string = e),
        (this.tabSize = t || 8),
        (this.lastColumnPos = this.lastColumnValue = 0),
        (this.lineStart = 0),
        (this.lineOracle = n)
    }
    ;(Xe.prototype.eol = function () {
      return this.pos >= this.string.length
    }),
      (Xe.prototype.sol = function () {
        return this.pos == this.lineStart
      }),
      (Xe.prototype.peek = function () {
        return this.string.charAt(this.pos) || void 0
      }),
      (Xe.prototype.next = function () {
        if (this.pos < this.string.length) return this.string.charAt(this.pos++)
      }),
      (Xe.prototype.eat = function (e) {
        var t = this.string.charAt(this.pos),
          n
        if ((typeof e == 'string' ? (n = t == e) : (n = t && (e.test ? e.test(t) : e(t))), n)) return ++this.pos, t
      }),
      (Xe.prototype.eatWhile = function (e) {
        for (var t = this.pos; this.eat(e); );
        return this.pos > t
      }),
      (Xe.prototype.eatSpace = function () {
        for (var e = this.pos; /[\s\u00a0]/.test(this.string.charAt(this.pos)); ) ++this.pos
        return this.pos > e
      }),
      (Xe.prototype.skipToEnd = function () {
        this.pos = this.string.length
      }),
      (Xe.prototype.skipTo = function (e) {
        var t = this.string.indexOf(e, this.pos)
        if (t > -1) return (this.pos = t), !0
      }),
      (Xe.prototype.backUp = function (e) {
        this.pos -= e
      }),
      (Xe.prototype.column = function () {
        return (
          this.lastColumnPos < this.start &&
            ((this.lastColumnValue = U(
              this.string,
              this.start,
              this.tabSize,
              this.lastColumnPos,
              this.lastColumnValue,
            )),
            (this.lastColumnPos = this.start)),
          this.lastColumnValue - (this.lineStart ? U(this.string, this.lineStart, this.tabSize) : 0)
        )
      }),
      (Xe.prototype.indentation = function () {
        return U(this.string, null, this.tabSize) - (this.lineStart ? U(this.string, this.lineStart, this.tabSize) : 0)
      }),
      (Xe.prototype.match = function (e, t, n) {
        if (typeof e == 'string') {
          var r = function (l) {
              return n ? l.toLowerCase() : l
            },
            i = this.string.substr(this.pos, e.length)
          if (r(i) == r(e)) return t !== !1 && (this.pos += e.length), !0
        } else {
          var o = this.string.slice(this.pos).match(e)
          return o && o.index > 0 ? null : (o && t !== !1 && (this.pos += o[0].length), o)
        }
      }),
      (Xe.prototype.current = function () {
        return this.string.slice(this.start, this.pos)
      }),
      (Xe.prototype.hideFirstChars = function (e, t) {
        this.lineStart += e
        try {
          return t()
        } finally {
          this.lineStart -= e
        }
      }),
      (Xe.prototype.lookAhead = function (e) {
        var t = this.lineOracle
        return t && t.lookAhead(e)
      }),
      (Xe.prototype.baseToken = function () {
        var e = this.lineOracle
        return e && e.baseToken(this.pos)
      })
    function K(e, t) {
      if (((t -= e.first), t < 0 || t >= e.size))
        throw new Error('There is no line ' + (t + e.first) + ' in the document.')
      for (var n = e; !n.lines; )
        for (var r = 0; ; ++r) {
          var i = n.children[r],
            o = i.chunkSize()
          if (t < o) {
            n = i
            break
          }
          t -= o
        }
      return n.lines[t]
    }
    function Vt(e, t, n) {
      var r = [],
        i = t.line
      return (
        e.iter(t.line, n.line + 1, function (o) {
          var l = o.text
          i == n.line && (l = l.slice(0, n.ch)), i == t.line && (l = l.slice(t.ch)), r.push(l), ++i
        }),
        r
      )
    }
    function Er(e, t, n) {
      var r = []
      return (
        e.iter(t, n, function (i) {
          r.push(i.text)
        }),
        r
      )
    }
    function Ft(e, t) {
      var n = t - e.height
      if (n) for (var r = e; r; r = r.parent) r.height += n
    }
    function Ne(e) {
      if (e.parent == null) return null
      for (var t = e.parent, n = se(t.lines, e), r = t.parent; r; t = r, r = r.parent)
        for (var i = 0; r.children[i] != t; ++i) n += r.children[i].chunkSize()
      return n + t.first
    }
    function Gt(e, t) {
      var n = e.first
      e: do {
        for (var r = 0; r < e.children.length; ++r) {
          var i = e.children[r],
            o = i.height
          if (t < o) {
            e = i
            continue e
          }
          ;(t -= o), (n += i.chunkSize())
        }
        return n
      } while (!e.lines)
      for (var l = 0; l < e.lines.length; ++l) {
        var a = e.lines[l],
          s = a.height
        if (t < s) break
        t -= s
      }
      return n + l
    }
    function f(e, t) {
      return t >= e.first && t < e.first + e.size
    }
    function p(e, t) {
      return String(e.lineNumberFormatter(t + e.firstLineNumber))
    }
    function g(e, t, n) {
      if ((n === void 0 && (n = null), !(this instanceof g))) return new g(e, t, n)
      ;(this.line = e), (this.ch = t), (this.sticky = n)
    }
    function S(e, t) {
      return e.line - t.line || e.ch - t.ch
    }
    function oe(e, t) {
      return e.sticky == t.sticky && S(e, t) == 0
    }
    function ke(e) {
      return g(e.line, e.ch)
    }
    function Me(e, t) {
      return S(e, t) < 0 ? t : e
    }
    function et(e, t) {
      return S(e, t) < 0 ? e : t
    }
    function Dt(e, t) {
      return Math.max(e.first, Math.min(t, e.first + e.size - 1))
    }
    function le(e, t) {
      if (t.line < e.first) return g(e.first, 0)
      var n = e.first + e.size - 1
      return t.line > n ? g(n, K(e, n).text.length) : ga(t, K(e, t.line).text.length)
    }
    function ga(e, t) {
      var n = e.ch
      return n == null || n > t ? g(e.line, t) : n < 0 ? g(e.line, 0) : e
    }
    function fo(e, t) {
      for (var n = [], r = 0; r < t.length; r++) n[r] = le(e, t[r])
      return n
    }
    var Hn = function (e, t) {
        ;(this.state = e), (this.lookAhead = t)
      },
      qt = function (e, t, n, r) {
        ;(this.state = t),
          (this.doc = e),
          (this.line = n),
          (this.maxLookAhead = r || 0),
          (this.baseTokens = null),
          (this.baseTokenPos = 1)
      }
    ;(qt.prototype.lookAhead = function (e) {
      var t = this.doc.getLine(this.line + e)
      return t != null && e > this.maxLookAhead && (this.maxLookAhead = e), t
    }),
      (qt.prototype.baseToken = function (e) {
        if (!this.baseTokens) return null
        for (; this.baseTokens[this.baseTokenPos] <= e; ) this.baseTokenPos += 2
        var t = this.baseTokens[this.baseTokenPos + 1]
        return { type: t && t.replace(/( |^)overlay .*/, ''), size: this.baseTokens[this.baseTokenPos] - e }
      }),
      (qt.prototype.nextLine = function () {
        this.line++, this.maxLookAhead > 0 && this.maxLookAhead--
      }),
      (qt.fromSaved = function (e, t, n) {
        return t instanceof Hn ? new qt(e, Qt(e.mode, t.state), n, t.lookAhead) : new qt(e, Qt(e.mode, t), n)
      }),
      (qt.prototype.save = function (e) {
        var t = e !== !1 ? Qt(this.doc.mode, this.state) : this.state
        return this.maxLookAhead > 0 ? new Hn(t, this.maxLookAhead) : t
      })
    function co(e, t, n, r) {
      var i = [e.state.modeGen],
        o = {}
      mo(
        e,
        t.text,
        e.doc.mode,
        n,
        function (u, d) {
          return i.push(u, d)
        },
        o,
        r,
      )
      for (
        var l = n.state,
          a = function (u) {
            n.baseTokens = i
            var d = e.state.overlays[u],
              h = 1,
              b = 0
            ;(n.state = !0),
              mo(
                e,
                t.text,
                d.mode,
                n,
                function (m, C) {
                  for (var N = h; b < m; ) {
                    var O = i[h]
                    O > m && i.splice(h, 1, m, i[h + 1], O), (h += 2), (b = Math.min(m, O))
                  }
                  if (C)
                    if (d.opaque) i.splice(N, h - N, m, 'overlay ' + C), (h = N + 2)
                    else
                      for (; N < h; N += 2) {
                        var z = i[N + 1]
                        i[N + 1] = (z ? z + ' ' : '') + 'overlay ' + C
                      }
                },
                o,
              ),
              (n.state = l),
              (n.baseTokens = null),
              (n.baseTokenPos = 1)
          },
          s = 0;
        s < e.state.overlays.length;
        ++s
      )
        a(s)
      return { styles: i, classes: o.bgClass || o.textClass ? o : null }
    }
    function ho(e, t, n) {
      if (!t.styles || t.styles[0] != e.state.modeGen) {
        var r = ln(e, Ne(t)),
          i = t.text.length > e.options.maxHighlightLength && Qt(e.doc.mode, r.state),
          o = co(e, t, r)
        i && (r.state = i),
          (t.stateAfter = r.save(!i)),
          (t.styles = o.styles),
          o.classes ? (t.styleClasses = o.classes) : t.styleClasses && (t.styleClasses = null),
          n === e.doc.highlightFrontier &&
            (e.doc.modeFrontier = Math.max(e.doc.modeFrontier, ++e.doc.highlightFrontier))
      }
      return t.styles
    }
    function ln(e, t, n) {
      var r = e.doc,
        i = e.display
      if (!r.mode.startState) return new qt(r, !0, t)
      var o = ya(e, t, n),
        l = o > r.first && K(r, o - 1).stateAfter,
        a = l ? qt.fromSaved(r, l, o) : new qt(r, on(r.mode), o)
      return (
        r.iter(o, t, function (s) {
          mi(e, s.text, a)
          var u = a.line
          ;(s.stateAfter = u == t - 1 || u % 5 == 0 || (u >= i.viewFrom && u < i.viewTo) ? a.save() : null),
            a.nextLine()
        }),
        n && (r.modeFrontier = a.line),
        a
      )
    }
    function mi(e, t, n, r) {
      var i = e.doc.mode,
        o = new Xe(t, e.options.tabSize, n)
      for (o.start = o.pos = r || 0, t == '' && po(i, n.state); !o.eol(); ) bi(i, o, n.state), (o.start = o.pos)
    }
    function po(e, t) {
      if (e.blankLine) return e.blankLine(t)
      if (e.innerMode) {
        var n = sr(e, t)
        if (n.mode.blankLine) return n.mode.blankLine(n.state)
      }
    }
    function bi(e, t, n, r) {
      for (var i = 0; i < 10; i++) {
        r && (r[0] = sr(e, n).mode)
        var o = e.token(t, n)
        if (t.pos > t.start) return o
      }
      throw new Error('Mode ' + e.name + ' failed to advance stream.')
    }
    var vo = function (e, t, n) {
      ;(this.start = e.start),
        (this.end = e.pos),
        (this.string = e.current()),
        (this.type = t || null),
        (this.state = n)
    }
    function go(e, t, n, r) {
      var i = e.doc,
        o = i.mode,
        l
      t = le(i, t)
      var a = K(i, t.line),
        s = ln(e, t.line, n),
        u = new Xe(a.text, e.options.tabSize, s),
        d
      for (r && (d = []); (r || u.pos < t.ch) && !u.eol(); )
        (u.start = u.pos), (l = bi(o, u, s.state)), r && d.push(new vo(u, l, Qt(i.mode, s.state)))
      return r ? d : new vo(u, l, s.state)
    }
    function yo(e, t) {
      if (e)
        for (;;) {
          var n = e.match(/(?:^|\s+)line-(background-)?(\S+)/)
          if (!n) break
          e = e.slice(0, n.index) + e.slice(n.index + n[0].length)
          var r = n[1] ? 'bgClass' : 'textClass'
          t[r] == null ? (t[r] = n[2]) : new RegExp('(?:^|\\s)' + n[2] + '(?:$|\\s)').test(t[r]) || (t[r] += ' ' + n[2])
        }
      return e
    }
    function mo(e, t, n, r, i, o, l) {
      var a = n.flattenSpans
      a == null && (a = e.options.flattenSpans)
      var s = 0,
        u = null,
        d = new Xe(t, e.options.tabSize, r),
        h,
        b = e.options.addModeClass && [null]
      for (t == '' && yo(po(n, r.state), o); !d.eol(); ) {
        if (
          (d.pos > e.options.maxHighlightLength
            ? ((a = !1), l && mi(e, t, r, d.pos), (d.pos = t.length), (h = null))
            : (h = yo(bi(n, d, r.state, b), o)),
          b)
        ) {
          var m = b[0].name
          m && (h = 'm-' + (h ? m + ' ' + h : m))
        }
        if (!a || u != h) {
          for (; s < d.start; ) (s = Math.min(d.start, s + 5e3)), i(s, u)
          u = h
        }
        d.start = d.pos
      }
      for (; s < d.pos; ) {
        var C = Math.min(d.pos, s + 5e3)
        i(C, u), (s = C)
      }
    }
    function ya(e, t, n) {
      for (var r, i, o = e.doc, l = n ? -1 : t - (e.doc.mode.innerMode ? 1e3 : 100), a = t; a > l; --a) {
        if (a <= o.first) return o.first
        var s = K(o, a - 1),
          u = s.stateAfter
        if (u && (!n || a + (u instanceof Hn ? u.lookAhead : 0) <= o.modeFrontier)) return a
        var d = U(s.text, null, e.options.tabSize)
        ;(i == null || r > d) && ((i = a - 1), (r = d))
      }
      return i
    }
    function ma(e, t) {
      if (((e.modeFrontier = Math.min(e.modeFrontier, t)), !(e.highlightFrontier < t - 10))) {
        for (var n = e.first, r = t - 1; r > n; r--) {
          var i = K(e, r).stateAfter
          if (i && (!(i instanceof Hn) || r + i.lookAhead < t)) {
            n = r + 1
            break
          }
        }
        e.highlightFrontier = Math.min(e.highlightFrontier, n)
      }
    }
    var bo = !1,
      $t = !1
    function ba() {
      bo = !0
    }
    function xa() {
      $t = !0
    }
    function Bn(e, t, n) {
      ;(this.marker = e), (this.from = t), (this.to = n)
    }
    function an(e, t) {
      if (e)
        for (var n = 0; n < e.length; ++n) {
          var r = e[n]
          if (r.marker == t) return r
        }
    }
    function wa(e, t) {
      for (var n, r = 0; r < e.length; ++r) e[r] != t && (n || (n = [])).push(e[r])
      return n
    }
    function ka(e, t, n) {
      var r = n && window.WeakSet && (n.markedSpans || (n.markedSpans = new WeakSet()))
      r && e.markedSpans && r.has(e.markedSpans)
        ? e.markedSpans.push(t)
        : ((e.markedSpans = e.markedSpans ? e.markedSpans.concat([t]) : [t]), r && r.add(e.markedSpans)),
        t.marker.attachLine(e)
    }
    function Sa(e, t, n) {
      var r
      if (e)
        for (var i = 0; i < e.length; ++i) {
          var o = e[i],
            l = o.marker,
            a = o.from == null || (l.inclusiveLeft ? o.from <= t : o.from < t)
          if (a || (o.from == t && l.type == 'bookmark' && (!n || !o.marker.insertLeft))) {
            var s = o.to == null || (l.inclusiveRight ? o.to >= t : o.to > t)
            ;(r || (r = [])).push(new Bn(l, o.from, s ? null : o.to))
          }
        }
      return r
    }
    function Ca(e, t, n) {
      var r
      if (e)
        for (var i = 0; i < e.length; ++i) {
          var o = e[i],
            l = o.marker,
            a = o.to == null || (l.inclusiveRight ? o.to >= t : o.to > t)
          if (a || (o.from == t && l.type == 'bookmark' && (!n || o.marker.insertLeft))) {
            var s = o.from == null || (l.inclusiveLeft ? o.from <= t : o.from < t)
            ;(r || (r = [])).push(new Bn(l, s ? null : o.from - t, o.to == null ? null : o.to - t))
          }
        }
      return r
    }
    function xi(e, t) {
      if (t.full) return null
      var n = f(e, t.from.line) && K(e, t.from.line).markedSpans,
        r = f(e, t.to.line) && K(e, t.to.line).markedSpans
      if (!n && !r) return null
      var i = t.from.ch,
        o = t.to.ch,
        l = S(t.from, t.to) == 0,
        a = Sa(n, i, l),
        s = Ca(r, o, l),
        u = t.text.length == 1,
        d = de(t.text).length + (u ? i : 0)
      if (a)
        for (var h = 0; h < a.length; ++h) {
          var b = a[h]
          if (b.to == null) {
            var m = an(s, b.marker)
            m ? u && (b.to = m.to == null ? null : m.to + d) : (b.to = i)
          }
        }
      if (s)
        for (var C = 0; C < s.length; ++C) {
          var N = s[C]
          if ((N.to != null && (N.to += d), N.from == null)) {
            var O = an(a, N.marker)
            O || ((N.from = d), u && (a || (a = [])).push(N))
          } else (N.from += d), u && (a || (a = [])).push(N)
        }
      a && (a = xo(a)), s && s != a && (s = xo(s))
      var z = [a]
      if (!u) {
        var F = t.text.length - 2,
          P
        if (F > 0 && a)
          for (var H = 0; H < a.length; ++H) a[H].to == null && (P || (P = [])).push(new Bn(a[H].marker, null, null))
        for (var Z = 0; Z < F; ++Z) z.push(P)
        z.push(s)
      }
      return z
    }
    function xo(e) {
      for (var t = 0; t < e.length; ++t) {
        var n = e[t]
        n.from != null && n.from == n.to && n.marker.clearWhenEmpty !== !1 && e.splice(t--, 1)
      }
      return e.length ? e : null
    }
    function Ta(e, t, n) {
      var r = null
      if (
        (e.iter(t.line, n.line + 1, function (m) {
          if (m.markedSpans)
            for (var C = 0; C < m.markedSpans.length; ++C) {
              var N = m.markedSpans[C].marker
              N.readOnly && (!r || se(r, N) == -1) && (r || (r = [])).push(N)
            }
        }),
        !r)
      )
        return null
      for (var i = [{ from: t, to: n }], o = 0; o < r.length; ++o)
        for (var l = r[o], a = l.find(0), s = 0; s < i.length; ++s) {
          var u = i[s]
          if (!(S(u.to, a.from) < 0 || S(u.from, a.to) > 0)) {
            var d = [s, 1],
              h = S(u.from, a.from),
              b = S(u.to, a.to)
            ;(h < 0 || (!l.inclusiveLeft && !h)) && d.push({ from: u.from, to: a.from }),
              (b > 0 || (!l.inclusiveRight && !b)) && d.push({ from: a.to, to: u.to }),
              i.splice.apply(i, d),
              (s += d.length - 3)
          }
        }
      return i
    }
    function wo(e) {
      var t = e.markedSpans
      if (t) {
        for (var n = 0; n < t.length; ++n) t[n].marker.detachLine(e)
        e.markedSpans = null
      }
    }
    function ko(e, t) {
      if (t) {
        for (var n = 0; n < t.length; ++n) t[n].marker.attachLine(e)
        e.markedSpans = t
      }
    }
    function Rn(e) {
      return e.inclusiveLeft ? -1 : 0
    }
    function Kn(e) {
      return e.inclusiveRight ? 1 : 0
    }
    function wi(e, t) {
      var n = e.lines.length - t.lines.length
      if (n != 0) return n
      var r = e.find(),
        i = t.find(),
        o = S(r.from, i.from) || Rn(e) - Rn(t)
      if (o) return -o
      var l = S(r.to, i.to) || Kn(e) - Kn(t)
      return l || t.id - e.id
    }
    function So(e, t) {
      var n = $t && e.markedSpans,
        r
      if (n)
        for (var i = void 0, o = 0; o < n.length; ++o)
          (i = n[o]), i.marker.collapsed && (t ? i.from : i.to) == null && (!r || wi(r, i.marker) < 0) && (r = i.marker)
      return r
    }
    function Co(e) {
      return So(e, !0)
    }
    function Un(e) {
      return So(e, !1)
    }
    function La(e, t) {
      var n = $t && e.markedSpans,
        r
      if (n)
        for (var i = 0; i < n.length; ++i) {
          var o = n[i]
          o.marker.collapsed &&
            (o.from == null || o.from < t) &&
            (o.to == null || o.to > t) &&
            (!r || wi(r, o.marker) < 0) &&
            (r = o.marker)
        }
      return r
    }
    function To(e, t, n, r, i) {
      var o = K(e, t),
        l = $t && o.markedSpans
      if (l)
        for (var a = 0; a < l.length; ++a) {
          var s = l[a]
          if (s.marker.collapsed) {
            var u = s.marker.find(0),
              d = S(u.from, n) || Rn(s.marker) - Rn(i),
              h = S(u.to, r) || Kn(s.marker) - Kn(i)
            if (
              !((d >= 0 && h <= 0) || (d <= 0 && h >= 0)) &&
              ((d <= 0 && (s.marker.inclusiveRight && i.inclusiveLeft ? S(u.to, n) >= 0 : S(u.to, n) > 0)) ||
                (d >= 0 && (s.marker.inclusiveRight && i.inclusiveLeft ? S(u.from, r) <= 0 : S(u.from, r) < 0)))
            )
              return !0
          }
        }
    }
    function _t(e) {
      for (var t; (t = Co(e)); ) e = t.find(-1, !0).line
      return e
    }
    function Ma(e) {
      for (var t; (t = Un(e)); ) e = t.find(1, !0).line
      return e
    }
    function Na(e) {
      for (var t, n; (t = Un(e)); ) (e = t.find(1, !0).line), (n || (n = [])).push(e)
      return n
    }
    function ki(e, t) {
      var n = K(e, t),
        r = _t(n)
      return n == r ? t : Ne(r)
    }
    function Lo(e, t) {
      if (t > e.lastLine()) return t
      var n = K(e, t),
        r
      if (!ur(e, n)) return t
      for (; (r = Un(n)); ) n = r.find(1, !0).line
      return Ne(n) + 1
    }
    function ur(e, t) {
      var n = $t && t.markedSpans
      if (n) {
        for (var r = void 0, i = 0; i < n.length; ++i)
          if (((r = n[i]), !!r.marker.collapsed)) {
            if (r.from == null) return !0
            if (!r.marker.widgetNode && r.from == 0 && r.marker.inclusiveLeft && Si(e, t, r)) return !0
          }
      }
    }
    function Si(e, t, n) {
      if (n.to == null) {
        var r = n.marker.find(1, !0)
        return Si(e, r.line, an(r.line.markedSpans, n.marker))
      }
      if (n.marker.inclusiveRight && n.to == t.text.length) return !0
      for (var i = void 0, o = 0; o < t.markedSpans.length; ++o)
        if (
          ((i = t.markedSpans[o]),
          i.marker.collapsed &&
            !i.marker.widgetNode &&
            i.from == n.to &&
            (i.to == null || i.to != n.from) &&
            (i.marker.inclusiveLeft || n.marker.inclusiveRight) &&
            Si(e, t, i))
        )
          return !0
    }
    function er(e) {
      e = _t(e)
      for (var t = 0, n = e.parent, r = 0; r < n.lines.length; ++r) {
        var i = n.lines[r]
        if (i == e) break
        t += i.height
      }
      for (var o = n.parent; o; n = o, o = n.parent)
        for (var l = 0; l < o.children.length; ++l) {
          var a = o.children[l]
          if (a == n) break
          t += a.height
        }
      return t
    }
    function Gn(e) {
      if (e.height == 0) return 0
      for (var t = e.text.length, n, r = e; (n = Co(r)); ) {
        var i = n.find(0, !0)
        ;(r = i.from.line), (t += i.from.ch - i.to.ch)
      }
      for (r = e; (n = Un(r)); ) {
        var o = n.find(0, !0)
        ;(t -= r.text.length - o.from.ch), (r = o.to.line), (t += r.text.length - o.to.ch)
      }
      return t
    }
    function Ci(e) {
      var t = e.display,
        n = e.doc
      ;(t.maxLine = K(n, n.first)),
        (t.maxLineLength = Gn(t.maxLine)),
        (t.maxLineChanged = !0),
        n.iter(function (r) {
          var i = Gn(r)
          i > t.maxLineLength && ((t.maxLineLength = i), (t.maxLine = r))
        })
    }
    var Ir = function (e, t, n) {
      ;(this.text = e), ko(this, t), (this.height = n ? n(this) : 1)
    }
    ;(Ir.prototype.lineNo = function () {
      return Ne(this)
    }),
      pt(Ir)
    function Da(e, t, n, r) {
      ;(e.text = t),
        e.stateAfter && (e.stateAfter = null),
        e.styles && (e.styles = null),
        e.order != null && (e.order = null),
        wo(e),
        ko(e, n)
      var i = r ? r(e) : 1
      i != e.height && Ft(e, i)
    }
    function Aa(e) {
      ;(e.parent = null), wo(e)
    }
    var Oa = {},
      za = {}
    function Mo(e, t) {
      if (!e || /^\s*$/.test(e)) return null
      var n = t.addModeClass ? za : Oa
      return n[e] || (n[e] = e.replace(/\S+/g, 'cm-$&'))
    }
    function No(e, t) {
      var n = w('span', null, null, W ? 'padding-right: .1px' : null),
        r = {
          pre: w('pre', [n], 'CodeMirror-line'),
          content: n,
          col: 0,
          pos: 0,
          cm: e,
          trailingSpace: !1,
          splitSpaces: e.getOption('lineWrapping'),
        }
      t.measure = {}
      for (var i = 0; i <= (t.rest ? t.rest.length : 0); i++) {
        var o = i ? t.rest[i - 1] : t.line,
          l = void 0
        ;(r.pos = 0),
          (r.addToken = Ea),
          In(e.display.measure) && (l = Et(o, e.doc.direction)) && (r.addToken = Fa(r.addToken, l)),
          (r.map = [])
        var a = t != e.display.externalMeasured && Ne(o)
        Wa(o, r, ho(e, o, a)),
          o.styleClasses &&
            (o.styleClasses.bgClass && (r.bgClass = B(o.styleClasses.bgClass, r.bgClass || '')),
            o.styleClasses.textClass && (r.textClass = B(o.styleClasses.textClass, r.textClass || ''))),
          r.map.length == 0 && r.map.push(0, 0, r.content.appendChild(yi(e.display.measure))),
          i == 0
            ? ((t.measure.map = r.map), (t.measure.cache = {}))
            : ((t.measure.maps || (t.measure.maps = [])).push(r.map),
              (t.measure.caches || (t.measure.caches = [])).push({}))
      }
      if (W) {
        var s = r.content.lastChild
        ;(/\bcm-tab\b/.test(s.className) || (s.querySelector && s.querySelector('.cm-tab'))) &&
          (r.content.className = 'cm-tab-wrap-hack')
      }
      return (
        _e(e, 'renderLine', e, t.line, r.pre),
        r.pre.className && (r.textClass = B(r.pre.className, r.textClass || '')),
        r
      )
    }
    function Pa(e) {
      var t = c('span', '•', 'cm-invalidchar')
      return (t.title = '\\u' + e.charCodeAt(0).toString(16)), t.setAttribute('aria-label', t.title), t
    }
    function Ea(e, t, n, r, i, o, l) {
      if (t) {
        var a = e.splitSpaces ? Ia(t, e.trailingSpace) : t,
          s = e.cm.state.specialChars,
          u = !1,
          d
        if (!s.test(t))
          (e.col += t.length),
            (d = document.createTextNode(a)),
            e.map.push(e.pos, e.pos + t.length, d),
            M && j < 9 && (u = !0),
            (e.pos += t.length)
        else {
          d = document.createDocumentFragment()
          for (var h = 0; ; ) {
            s.lastIndex = h
            var b = s.exec(t),
              m = b ? b.index - h : t.length - h
            if (m) {
              var C = document.createTextNode(a.slice(h, h + m))
              M && j < 9 ? d.appendChild(c('span', [C])) : d.appendChild(C),
                e.map.push(e.pos, e.pos + m, C),
                (e.col += m),
                (e.pos += m)
            }
            if (!b) break
            h += m + 1
            var N = void 0
            if (b[0] == '	') {
              var O = e.cm.options.tabSize,
                z = O - (e.col % O)
              ;(N = d.appendChild(c('span', Ue(z), 'cm-tab'))),
                N.setAttribute('role', 'presentation'),
                N.setAttribute('cm-text', '	'),
                (e.col += z)
            } else
              b[0] == '\r' ||
              b[0] ==
                `
`
                ? ((N = d.appendChild(c('span', b[0] == '\r' ? '␍' : '␤', 'cm-invalidchar'))),
                  N.setAttribute('cm-text', b[0]),
                  (e.col += 1))
                : ((N = e.cm.options.specialCharPlaceholder(b[0])),
                  N.setAttribute('cm-text', b[0]),
                  M && j < 9 ? d.appendChild(c('span', [N])) : d.appendChild(N),
                  (e.col += 1))
            e.map.push(e.pos, e.pos + 1, N), e.pos++
          }
        }
        if (((e.trailingSpace = a.charCodeAt(t.length - 1) == 32), n || r || i || u || o || l)) {
          var F = n || ''
          r && (F += r), i && (F += i)
          var P = c('span', [d], F, o)
          if (l) for (var H in l) l.hasOwnProperty(H) && H != 'style' && H != 'class' && P.setAttribute(H, l[H])
          return e.content.appendChild(P)
        }
        e.content.appendChild(d)
      }
    }
    function Ia(e, t) {
      if (e.length > 1 && !/  /.test(e)) return e
      for (var n = t, r = '', i = 0; i < e.length; i++) {
        var o = e.charAt(i)
        o == ' ' && n && (i == e.length - 1 || e.charCodeAt(i + 1) == 32) && (o = ' '), (r += o), (n = o == ' ')
      }
      return r
    }
    function Fa(e, t) {
      return function (n, r, i, o, l, a, s) {
        i = i ? i + ' cm-force-border' : 'cm-force-border'
        for (var u = n.pos, d = u + r.length; ; ) {
          for (var h = void 0, b = 0; b < t.length && ((h = t[b]), !(h.to > u && h.from <= u)); b++);
          if (h.to >= d) return e(n, r, i, o, l, a, s)
          e(n, r.slice(0, h.to - u), i, o, null, a, s), (o = null), (r = r.slice(h.to - u)), (u = h.to)
        }
      }
    }
    function Do(e, t, n, r) {
      var i = !r && n.widgetNode
      i && e.map.push(e.pos, e.pos + t, i),
        !r &&
          e.cm.display.input.needsContentAttribute &&
          (i || (i = e.content.appendChild(document.createElement('span'))), i.setAttribute('cm-marker', n.id)),
        i && (e.cm.display.input.setUneditable(i), e.content.appendChild(i)),
        (e.pos += t),
        (e.trailingSpace = !1)
    }
    function Wa(e, t, n) {
      var r = e.markedSpans,
        i = e.text,
        o = 0
      if (!r) {
        for (var l = 1; l < n.length; l += 2) t.addToken(t, i.slice(o, (o = n[l])), Mo(n[l + 1], t.cm.options))
        return
      }
      for (var a = i.length, s = 0, u = 1, d = '', h, b, m = 0, C, N, O, z, F; ; ) {
        if (m == s) {
          ;(C = N = O = b = ''), (F = null), (z = null), (m = 1 / 0)
          for (var P = [], H = void 0, Z = 0; Z < r.length; ++Z) {
            var Y = r[Z],
              ve = Y.marker
            if (ve.type == 'bookmark' && Y.from == s && ve.widgetNode) P.push(ve)
            else if (Y.from <= s && (Y.to == null || Y.to > s || (ve.collapsed && Y.to == s && Y.from == s))) {
              if (
                (Y.to != null && Y.to != s && m > Y.to && ((m = Y.to), (N = '')),
                ve.className && (C += ' ' + ve.className),
                ve.css && (b = (b ? b + ';' : '') + ve.css),
                ve.startStyle && Y.from == s && (O += ' ' + ve.startStyle),
                ve.endStyle && Y.to == m && (H || (H = [])).push(ve.endStyle, Y.to),
                ve.title && ((F || (F = {})).title = ve.title),
                ve.attributes)
              )
                for (var Fe in ve.attributes) (F || (F = {}))[Fe] = ve.attributes[Fe]
              ve.collapsed && (!z || wi(z.marker, ve) < 0) && (z = Y)
            } else Y.from > s && m > Y.from && (m = Y.from)
          }
          if (H) for (var ot = 0; ot < H.length; ot += 2) H[ot + 1] == m && (N += ' ' + H[ot])
          if (!z || z.from == s) for (var Ge = 0; Ge < P.length; ++Ge) Do(t, 0, P[Ge])
          if (z && (z.from || 0) == s) {
            if ((Do(t, (z.to == null ? a + 1 : z.to) - s, z.marker, z.from == null), z.to == null)) return
            z.to == s && (z = !1)
          }
        }
        if (s >= a) break
        for (var Lt = Math.min(a, m); ; ) {
          if (d) {
            var wt = s + d.length
            if (!z) {
              var Qe = wt > Lt ? d.slice(0, Lt - s) : d
              t.addToken(t, Qe, h ? h + C : C, O, s + Qe.length == m ? N : '', b, F)
            }
            if (wt >= Lt) {
              ;(d = d.slice(Lt - s)), (s = Lt)
              break
            }
            ;(s = wt), (O = '')
          }
          ;(d = i.slice(o, (o = n[u++]))), (h = Mo(n[u++], t.cm.options))
        }
      }
    }
    function Ao(e, t, n) {
      ;(this.line = t),
        (this.rest = Na(t)),
        (this.size = this.rest ? Ne(de(this.rest)) - n + 1 : 1),
        (this.node = this.text = null),
        (this.hidden = ur(e, t))
    }
    function qn(e, t, n) {
      for (var r = [], i, o = t; o < n; o = i) {
        var l = new Ao(e.doc, K(e.doc, o), o)
        ;(i = o + l.size), r.push(l)
      }
      return r
    }
    var Fr = null
    function _a(e) {
      Fr ? Fr.ops.push(e) : (e.ownsGroup = Fr = { ops: [e], delayedCallbacks: [] })
    }
    function Ha(e) {
      var t = e.delayedCallbacks,
        n = 0
      do {
        for (; n < t.length; n++) t[n].call(null)
        for (var r = 0; r < e.ops.length; r++) {
          var i = e.ops[r]
          if (i.cursorActivityHandlers)
            for (; i.cursorActivityCalled < i.cursorActivityHandlers.length; )
              i.cursorActivityHandlers[i.cursorActivityCalled++].call(null, i.cm)
        }
      } while (n < t.length)
    }
    function Ba(e, t) {
      var n = e.ownsGroup
      if (n)
        try {
          Ha(n)
        } finally {
          ;(Fr = null), t(n)
        }
    }
    var sn = null
    function rt(e, t) {
      var n = en(e, t)
      if (n.length) {
        var r = Array.prototype.slice.call(arguments, 2),
          i
        Fr ? (i = Fr.delayedCallbacks) : sn ? (i = sn) : ((i = sn = []), setTimeout(Ra, 0))
        for (
          var o = function (a) {
              i.push(function () {
                return n[a].apply(null, r)
              })
            },
            l = 0;
          l < n.length;
          ++l
        )
          o(l)
      }
    }
    function Ra() {
      var e = sn
      sn = null
      for (var t = 0; t < e.length; ++t) e[t]()
    }
    function Oo(e, t, n, r) {
      for (var i = 0; i < t.changes.length; i++) {
        var o = t.changes[i]
        o == 'text' ? Ua(e, t) : o == 'gutter' ? Po(e, t, n, r) : o == 'class' ? Ti(e, t) : o == 'widget' && Ga(e, t, r)
      }
      t.changes = null
    }
    function un(e) {
      return (
        e.node == e.text &&
          ((e.node = c('div', null, null, 'position: relative')),
          e.text.parentNode && e.text.parentNode.replaceChild(e.node, e.text),
          e.node.appendChild(e.text),
          M && j < 8 && (e.node.style.zIndex = 2)),
        e.node
      )
    }
    function Ka(e, t) {
      var n = t.bgClass ? t.bgClass + ' ' + (t.line.bgClass || '') : t.line.bgClass
      if ((n && (n += ' CodeMirror-linebackground'), t.background))
        n ? (t.background.className = n) : (t.background.parentNode.removeChild(t.background), (t.background = null))
      else if (n) {
        var r = un(t)
        ;(t.background = r.insertBefore(c('div', null, n), r.firstChild)), e.display.input.setUneditable(t.background)
      }
    }
    function zo(e, t) {
      var n = e.display.externalMeasured
      return n && n.line == t.line ? ((e.display.externalMeasured = null), (t.measure = n.measure), n.built) : No(e, t)
    }
    function Ua(e, t) {
      var n = t.text.className,
        r = zo(e, t)
      t.text == t.node && (t.node = r.pre),
        t.text.parentNode.replaceChild(r.pre, t.text),
        (t.text = r.pre),
        r.bgClass != t.bgClass || r.textClass != t.textClass
          ? ((t.bgClass = r.bgClass), (t.textClass = r.textClass), Ti(e, t))
          : n && (t.text.className = n)
    }
    function Ti(e, t) {
      Ka(e, t), t.line.wrapClass ? (un(t).className = t.line.wrapClass) : t.node != t.text && (t.node.className = '')
      var n = t.textClass ? t.textClass + ' ' + (t.line.textClass || '') : t.line.textClass
      t.text.className = n || ''
    }
    function Po(e, t, n, r) {
      if (
        (t.gutter && (t.node.removeChild(t.gutter), (t.gutter = null)),
        t.gutterBackground && (t.node.removeChild(t.gutterBackground), (t.gutterBackground = null)),
        t.line.gutterClass)
      ) {
        var i = un(t)
        ;(t.gutterBackground = c(
          'div',
          null,
          'CodeMirror-gutter-background ' + t.line.gutterClass,
          'left: ' +
            (e.options.fixedGutter ? r.fixedPos : -r.gutterTotalWidth) +
            'px; width: ' +
            r.gutterTotalWidth +
            'px',
        )),
          e.display.input.setUneditable(t.gutterBackground),
          i.insertBefore(t.gutterBackground, t.text)
      }
      var o = t.line.gutterMarkers
      if (e.options.lineNumbers || o) {
        var l = un(t),
          a = (t.gutter = c(
            'div',
            null,
            'CodeMirror-gutter-wrapper',
            'left: ' + (e.options.fixedGutter ? r.fixedPos : -r.gutterTotalWidth) + 'px',
          ))
        if (
          (a.setAttribute('aria-hidden', 'true'),
          e.display.input.setUneditable(a),
          l.insertBefore(a, t.text),
          t.line.gutterClass && (a.className += ' ' + t.line.gutterClass),
          e.options.lineNumbers &&
            (!o || !o['CodeMirror-linenumbers']) &&
            (t.lineNumber = a.appendChild(
              c(
                'div',
                p(e.options, n),
                'CodeMirror-linenumber CodeMirror-gutter-elt',
                'left: ' + r.gutterLeft['CodeMirror-linenumbers'] + 'px; width: ' + e.display.lineNumInnerWidth + 'px',
              ),
            )),
          o)
        )
          for (var s = 0; s < e.display.gutterSpecs.length; ++s) {
            var u = e.display.gutterSpecs[s].className,
              d = o.hasOwnProperty(u) && o[u]
            d &&
              a.appendChild(
                c(
                  'div',
                  [d],
                  'CodeMirror-gutter-elt',
                  'left: ' + r.gutterLeft[u] + 'px; width: ' + r.gutterWidth[u] + 'px',
                ),
              )
          }
      }
    }
    function Ga(e, t, n) {
      t.alignable && (t.alignable = null)
      for (var r = X('CodeMirror-linewidget'), i = t.node.firstChild, o = void 0; i; i = o)
        (o = i.nextSibling), r.test(i.className) && t.node.removeChild(i)
      Eo(e, t, n)
    }
    function qa(e, t, n, r) {
      var i = zo(e, t)
      return (
        (t.text = t.node = i.pre),
        i.bgClass && (t.bgClass = i.bgClass),
        i.textClass && (t.textClass = i.textClass),
        Ti(e, t),
        Po(e, t, n, r),
        Eo(e, t, r),
        t.node
      )
    }
    function Eo(e, t, n) {
      if ((Io(e, t.line, t, n, !0), t.rest)) for (var r = 0; r < t.rest.length; r++) Io(e, t.rest[r], t, n, !1)
    }
    function Io(e, t, n, r, i) {
      if (t.widgets)
        for (var o = un(n), l = 0, a = t.widgets; l < a.length; ++l) {
          var s = a[l],
            u = c('div', [s.node], 'CodeMirror-linewidget' + (s.className ? ' ' + s.className : ''))
          s.handleMouseEvents || u.setAttribute('cm-ignore-events', 'true'),
            ja(s, u, n, r),
            e.display.input.setUneditable(u),
            i && s.above ? o.insertBefore(u, n.gutter || n.text) : o.appendChild(u),
            rt(s, 'redraw')
        }
    }
    function ja(e, t, n, r) {
      if (e.noHScroll) {
        ;(n.alignable || (n.alignable = [])).push(t)
        var i = r.wrapperWidth
        ;(t.style.left = r.fixedPos + 'px'),
          e.coverGutter || ((i -= r.gutterTotalWidth), (t.style.paddingLeft = r.gutterTotalWidth + 'px')),
          (t.style.width = i + 'px')
      }
      e.coverGutter &&
        ((t.style.zIndex = 5),
        (t.style.position = 'relative'),
        e.noHScroll || (t.style.marginLeft = -r.gutterTotalWidth + 'px'))
    }
    function fn(e) {
      if (e.height != null) return e.height
      var t = e.doc.cm
      if (!t) return 0
      if (!v(document.body, e.node)) {
        var n = 'position: relative;'
        e.coverGutter && (n += 'margin-left: -' + t.display.gutters.offsetWidth + 'px;'),
          e.noHScroll && (n += 'width: ' + t.display.wrapper.clientWidth + 'px;'),
          _(t.display.measure, c('div', [e.node], null, n))
      }
      return (e.height = e.node.parentNode.offsetHeight)
    }
    function tr(e, t) {
      for (var n = mt(t); n != e.wrapper; n = n.parentNode)
        if (
          !n ||
          (n.nodeType == 1 && n.getAttribute('cm-ignore-events') == 'true') ||
          (n.parentNode == e.sizer && n != e.mover)
        )
          return !0
    }
    function jn(e) {
      return e.lineSpace.offsetTop
    }
    function Li(e) {
      return e.mover.offsetHeight - e.lineSpace.offsetHeight
    }
    function Fo(e) {
      if (e.cachedPaddingH) return e.cachedPaddingH
      var t = _(e.measure, c('pre', 'x', 'CodeMirror-line-like')),
        n = window.getComputedStyle ? window.getComputedStyle(t) : t.currentStyle,
        r = { left: parseInt(n.paddingLeft), right: parseInt(n.paddingRight) }
      return !isNaN(r.left) && !isNaN(r.right) && (e.cachedPaddingH = r), r
    }
    function jt(e) {
      return ge - e.display.nativeBarWidth
    }
    function xr(e) {
      return e.display.scroller.clientWidth - jt(e) - e.display.barWidth
    }
    function Mi(e) {
      return e.display.scroller.clientHeight - jt(e) - e.display.barHeight
    }
    function Xa(e, t, n) {
      var r = e.options.lineWrapping,
        i = r && xr(e)
      if (!t.measure.heights || (r && t.measure.width != i)) {
        var o = (t.measure.heights = [])
        if (r) {
          t.measure.width = i
          for (var l = t.text.firstChild.getClientRects(), a = 0; a < l.length - 1; a++) {
            var s = l[a],
              u = l[a + 1]
            Math.abs(s.bottom - u.bottom) > 2 && o.push((s.bottom + u.top) / 2 - n.top)
          }
        }
        o.push(n.bottom - n.top)
      }
    }
    function Wo(e, t, n) {
      if (e.line == t) return { map: e.measure.map, cache: e.measure.cache }
      if (e.rest) {
        for (var r = 0; r < e.rest.length; r++)
          if (e.rest[r] == t) return { map: e.measure.maps[r], cache: e.measure.caches[r] }
        for (var i = 0; i < e.rest.length; i++)
          if (Ne(e.rest[i]) > n) return { map: e.measure.maps[i], cache: e.measure.caches[i], before: !0 }
      }
    }
    function Ya(e, t) {
      t = _t(t)
      var n = Ne(t),
        r = (e.display.externalMeasured = new Ao(e.doc, t, n))
      r.lineN = n
      var i = (r.built = No(e, r))
      return (r.text = i.pre), _(e.display.lineMeasure, i.pre), r
    }
    function _o(e, t, n, r) {
      return Xt(e, Wr(e, t), n, r)
    }
    function Ni(e, t) {
      if (t >= e.display.viewFrom && t < e.display.viewTo) return e.display.view[Sr(e, t)]
      var n = e.display.externalMeasured
      if (n && t >= n.lineN && t < n.lineN + n.size) return n
    }
    function Wr(e, t) {
      var n = Ne(t),
        r = Ni(e, n)
      r && !r.text ? (r = null) : r && r.changes && (Oo(e, r, n, Pi(e)), (e.curOp.forceUpdate = !0)),
        r || (r = Ya(e, t))
      var i = Wo(r, t, n)
      return { line: t, view: r, rect: null, map: i.map, cache: i.cache, before: i.before, hasHeights: !1 }
    }
    function Xt(e, t, n, r, i) {
      t.before && (n = -1)
      var o = n + (r || ''),
        l
      return (
        t.cache.hasOwnProperty(o)
          ? (l = t.cache[o])
          : (t.rect || (t.rect = t.view.text.getBoundingClientRect()),
            t.hasHeights || (Xa(e, t.view, t.rect), (t.hasHeights = !0)),
            (l = Ja(e, t, n, r)),
            l.bogus || (t.cache[o] = l)),
        { left: l.left, right: l.right, top: i ? l.rtop : l.top, bottom: i ? l.rbottom : l.bottom }
      )
    }
    var Ho = { left: 0, right: 0, top: 0, bottom: 0 }
    function Bo(e, t, n) {
      for (var r, i, o, l, a, s, u = 0; u < e.length; u += 3)
        if (
          ((a = e[u]),
          (s = e[u + 1]),
          t < a
            ? ((i = 0), (o = 1), (l = 'left'))
            : t < s
            ? ((i = t - a), (o = i + 1))
            : (u == e.length - 3 || (t == s && e[u + 3] > t)) && ((o = s - a), (i = o - 1), t >= s && (l = 'right')),
          i != null)
        ) {
          if (((r = e[u + 2]), a == s && n == (r.insertLeft ? 'left' : 'right') && (l = n), n == 'left' && i == 0))
            for (; u && e[u - 2] == e[u - 3] && e[u - 1].insertLeft; ) (r = e[(u -= 3) + 2]), (l = 'left')
          if (n == 'right' && i == s - a)
            for (; u < e.length - 3 && e[u + 3] == e[u + 4] && !e[u + 5].insertLeft; )
              (r = e[(u += 3) + 2]), (l = 'right')
          break
        }
      return { node: r, start: i, end: o, collapse: l, coverStart: a, coverEnd: s }
    }
    function Za(e, t) {
      var n = Ho
      if (t == 'left') for (var r = 0; r < e.length && (n = e[r]).left == n.right; r++);
      else for (var i = e.length - 1; i >= 0 && (n = e[i]).left == n.right; i--);
      return n
    }
    function Ja(e, t, n, r) {
      var i = Bo(t.map, n, r),
        o = i.node,
        l = i.start,
        a = i.end,
        s = i.collapse,
        u
      if (o.nodeType == 3) {
        for (var d = 0; d < 4; d++) {
          for (; l && q(t.line.text.charAt(i.coverStart + l)); ) --l
          for (; i.coverStart + a < i.coverEnd && q(t.line.text.charAt(i.coverStart + a)); ) ++a
          if (
            (M && j < 9 && l == 0 && a == i.coverEnd - i.coverStart
              ? (u = o.parentNode.getBoundingClientRect())
              : (u = Za(x(o, l, a).getClientRects(), r)),
            u.left || u.right || l == 0)
          )
            break
          ;(a = l), (l = l - 1), (s = 'right')
        }
        M && j < 11 && (u = Qa(e.display.measure, u))
      } else {
        l > 0 && (s = r = 'right')
        var h
        e.options.lineWrapping && (h = o.getClientRects()).length > 1
          ? (u = h[r == 'right' ? h.length - 1 : 0])
          : (u = o.getBoundingClientRect())
      }
      if (M && j < 9 && !l && (!u || (!u.left && !u.right))) {
        var b = o.parentNode.getClientRects()[0]
        b ? (u = { left: b.left, right: b.left + Hr(e.display), top: b.top, bottom: b.bottom }) : (u = Ho)
      }
      for (
        var m = u.top - t.rect.top, C = u.bottom - t.rect.top, N = (m + C) / 2, O = t.view.measure.heights, z = 0;
        z < O.length - 1 && !(N < O[z]);
        z++
      );
      var F = z ? O[z - 1] : 0,
        P = O[z],
        H = {
          left: (s == 'right' ? u.right : u.left) - t.rect.left,
          right: (s == 'left' ? u.left : u.right) - t.rect.left,
          top: F,
          bottom: P,
        }
      return (
        !u.left && !u.right && (H.bogus = !0), e.options.singleCursorHeightPerLine || ((H.rtop = m), (H.rbottom = C)), H
      )
    }
    function Qa(e, t) {
      if (!window.screen || screen.logicalXDPI == null || screen.logicalXDPI == screen.deviceXDPI || !Fn(e)) return t
      var n = screen.logicalXDPI / screen.deviceXDPI,
        r = screen.logicalYDPI / screen.deviceYDPI
      return { left: t.left * n, right: t.right * n, top: t.top * r, bottom: t.bottom * r }
    }
    function Ro(e) {
      if (e.measure && ((e.measure.cache = {}), (e.measure.heights = null), e.rest))
        for (var t = 0; t < e.rest.length; t++) e.measure.caches[t] = {}
    }
    function Ko(e) {
      ;(e.display.externalMeasure = null), L(e.display.lineMeasure)
      for (var t = 0; t < e.display.view.length; t++) Ro(e.display.view[t])
    }
    function cn(e) {
      Ko(e),
        (e.display.cachedCharWidth = e.display.cachedTextHeight = e.display.cachedPaddingH = null),
        e.options.lineWrapping || (e.display.maxLineChanged = !0),
        (e.display.lineNumChars = null)
    }
    function Uo(e) {
      return G && J
        ? -(e.body.getBoundingClientRect().left - parseInt(getComputedStyle(e.body).marginLeft))
        : e.defaultView.pageXOffset || (e.documentElement || e.body).scrollLeft
    }
    function Go(e) {
      return G && J
        ? -(e.body.getBoundingClientRect().top - parseInt(getComputedStyle(e.body).marginTop))
        : e.defaultView.pageYOffset || (e.documentElement || e.body).scrollTop
    }
    function Di(e) {
      var t = _t(e),
        n = t.widgets,
        r = 0
      if (n) for (var i = 0; i < n.length; ++i) n[i].above && (r += fn(n[i]))
      return r
    }
    function Xn(e, t, n, r, i) {
      if (!i) {
        var o = Di(t)
        ;(n.top += o), (n.bottom += o)
      }
      if (r == 'line') return n
      r || (r = 'local')
      var l = er(t)
      if ((r == 'local' ? (l += jn(e.display)) : (l -= e.display.viewOffset), r == 'page' || r == 'window')) {
        var a = e.display.lineSpace.getBoundingClientRect()
        l += a.top + (r == 'window' ? 0 : Go(ae(e)))
        var s = a.left + (r == 'window' ? 0 : Uo(ae(e)))
        ;(n.left += s), (n.right += s)
      }
      return (n.top += l), (n.bottom += l), n
    }
    function qo(e, t, n) {
      if (n == 'div') return t
      var r = t.left,
        i = t.top
      if (n == 'page') (r -= Uo(ae(e))), (i -= Go(ae(e)))
      else if (n == 'local' || !n) {
        var o = e.display.sizer.getBoundingClientRect()
        ;(r += o.left), (i += o.top)
      }
      var l = e.display.lineSpace.getBoundingClientRect()
      return { left: r - l.left, top: i - l.top }
    }
    function Yn(e, t, n, r, i) {
      return r || (r = K(e.doc, t.line)), Xn(e, r, _o(e, r, t.ch, i), n)
    }
    function Ht(e, t, n, r, i, o) {
      ;(r = r || K(e.doc, t.line)), i || (i = Wr(e, r))
      function l(C, N) {
        var O = Xt(e, i, C, N ? 'right' : 'left', o)
        return N ? (O.left = O.right) : (O.right = O.left), Xn(e, r, O, n)
      }
      var a = Et(r, e.doc.direction),
        s = t.ch,
        u = t.sticky
      if ((s >= r.text.length ? ((s = r.text.length), (u = 'before')) : s <= 0 && ((s = 0), (u = 'after')), !a))
        return l(u == 'before' ? s - 1 : s, u == 'before')
      function d(C, N, O) {
        var z = a[N],
          F = z.level == 1
        return l(O ? C - 1 : C, F != O)
      }
      var h = Pt(a, s, u),
        b = zt,
        m = d(s, h, u == 'before')
      return b != null && (m.other = d(s, b, u != 'before')), m
    }
    function jo(e, t) {
      var n = 0
      ;(t = le(e.doc, t)), e.options.lineWrapping || (n = Hr(e.display) * t.ch)
      var r = K(e.doc, t.line),
        i = er(r) + jn(e.display)
      return { left: n, right: n, top: i, bottom: i + r.height }
    }
    function Ai(e, t, n, r, i) {
      var o = g(e, t, n)
      return (o.xRel = i), r && (o.outside = r), o
    }
    function Oi(e, t, n) {
      var r = e.doc
      if (((n += e.display.viewOffset), n < 0)) return Ai(r.first, 0, null, -1, -1)
      var i = Gt(r, n),
        o = r.first + r.size - 1
      if (i > o) return Ai(r.first + r.size - 1, K(r, o).text.length, null, 1, 1)
      t < 0 && (t = 0)
      for (var l = K(r, i); ; ) {
        var a = Va(e, l, i, t, n),
          s = La(l, a.ch + (a.xRel > 0 || a.outside > 0 ? 1 : 0))
        if (!s) return a
        var u = s.find(1)
        if (u.line == i) return u
        l = K(r, (i = u.line))
      }
    }
    function Xo(e, t, n, r) {
      r -= Di(t)
      var i = t.text.length,
        o = he(
          function (l) {
            return Xt(e, n, l - 1).bottom <= r
          },
          i,
          0,
        )
      return (
        (i = he(
          function (l) {
            return Xt(e, n, l).top > r
          },
          o,
          i,
        )),
        { begin: o, end: i }
      )
    }
    function Yo(e, t, n, r) {
      n || (n = Wr(e, t))
      var i = Xn(e, t, Xt(e, n, r), 'line').top
      return Xo(e, t, n, i)
    }
    function zi(e, t, n, r) {
      return e.bottom <= n ? !1 : e.top > n ? !0 : (r ? e.left : e.right) > t
    }
    function Va(e, t, n, r, i) {
      i -= er(t)
      var o = Wr(e, t),
        l = Di(t),
        a = 0,
        s = t.text.length,
        u = !0,
        d = Et(t, e.doc.direction)
      if (d) {
        var h = (e.options.lineWrapping ? es : $a)(e, t, n, o, d, r, i)
        ;(u = h.level != 1), (a = u ? h.from : h.to - 1), (s = u ? h.to : h.from - 1)
      }
      var b = null,
        m = null,
        C = he(
          function (Z) {
            var Y = Xt(e, o, Z)
            return (
              (Y.top += l),
              (Y.bottom += l),
              zi(Y, r, i, !1) ? (Y.top <= i && Y.left <= r && ((b = Z), (m = Y)), !0) : !1
            )
          },
          a,
          s,
        ),
        N,
        O,
        z = !1
      if (m) {
        var F = r - m.left < m.right - r,
          P = F == u
        ;(C = b + (P ? 0 : 1)), (O = P ? 'after' : 'before'), (N = F ? m.left : m.right)
      } else {
        !u && (C == s || C == a) && C++,
          (O =
            C == 0
              ? 'after'
              : C == t.text.length
              ? 'before'
              : Xt(e, o, C - (u ? 1 : 0)).bottom + l <= i == u
              ? 'after'
              : 'before')
        var H = Ht(e, g(n, C, O), 'line', t, o)
        ;(N = H.left), (z = i < H.top ? -1 : i >= H.bottom ? 1 : 0)
      }
      return (C = be(t.text, C, 1)), Ai(n, C, O, z, r - N)
    }
    function $a(e, t, n, r, i, o, l) {
      var a = he(
          function (h) {
            var b = i[h],
              m = b.level != 1
            return zi(Ht(e, g(n, m ? b.to : b.from, m ? 'before' : 'after'), 'line', t, r), o, l, !0)
          },
          0,
          i.length - 1,
        ),
        s = i[a]
      if (a > 0) {
        var u = s.level != 1,
          d = Ht(e, g(n, u ? s.from : s.to, u ? 'after' : 'before'), 'line', t, r)
        zi(d, o, l, !0) && d.top > l && (s = i[a - 1])
      }
      return s
    }
    function es(e, t, n, r, i, o, l) {
      var a = Xo(e, t, r, l),
        s = a.begin,
        u = a.end
      ;/\s/.test(t.text.charAt(u - 1)) && u--
      for (var d = null, h = null, b = 0; b < i.length; b++) {
        var m = i[b]
        if (!(m.from >= u || m.to <= s)) {
          var C = m.level != 1,
            N = Xt(e, r, C ? Math.min(u, m.to) - 1 : Math.max(s, m.from)).right,
            O = N < o ? o - N + 1e9 : N - o
          ;(!d || h > O) && ((d = m), (h = O))
        }
      }
      return (
        d || (d = i[i.length - 1]),
        d.from < s && (d = { from: s, to: d.to, level: d.level }),
        d.to > u && (d = { from: d.from, to: u, level: d.level }),
        d
      )
    }
    var wr
    function _r(e) {
      if (e.cachedTextHeight != null) return e.cachedTextHeight
      if (wr == null) {
        wr = c('pre', null, 'CodeMirror-line-like')
        for (var t = 0; t < 49; ++t) wr.appendChild(document.createTextNode('x')), wr.appendChild(c('br'))
        wr.appendChild(document.createTextNode('x'))
      }
      _(e.measure, wr)
      var n = wr.offsetHeight / 50
      return n > 3 && (e.cachedTextHeight = n), L(e.measure), n || 1
    }
    function Hr(e) {
      if (e.cachedCharWidth != null) return e.cachedCharWidth
      var t = c('span', 'xxxxxxxxxx'),
        n = c('pre', [t], 'CodeMirror-line-like')
      _(e.measure, n)
      var r = t.getBoundingClientRect(),
        i = (r.right - r.left) / 10
      return i > 2 && (e.cachedCharWidth = i), i || 10
    }
    function Pi(e) {
      for (
        var t = e.display, n = {}, r = {}, i = t.gutters.clientLeft, o = t.gutters.firstChild, l = 0;
        o;
        o = o.nextSibling, ++l
      ) {
        var a = e.display.gutterSpecs[l].className
        ;(n[a] = o.offsetLeft + o.clientLeft + i), (r[a] = o.clientWidth)
      }
      return {
        fixedPos: Ei(t),
        gutterTotalWidth: t.gutters.offsetWidth,
        gutterLeft: n,
        gutterWidth: r,
        wrapperWidth: t.wrapper.clientWidth,
      }
    }
    function Ei(e) {
      return e.scroller.getBoundingClientRect().left - e.sizer.getBoundingClientRect().left
    }
    function Zo(e) {
      var t = _r(e.display),
        n = e.options.lineWrapping,
        r = n && Math.max(5, e.display.scroller.clientWidth / Hr(e.display) - 3)
      return function (i) {
        if (ur(e.doc, i)) return 0
        var o = 0
        if (i.widgets) for (var l = 0; l < i.widgets.length; l++) i.widgets[l].height && (o += i.widgets[l].height)
        return n ? o + (Math.ceil(i.text.length / r) || 1) * t : o + t
      }
    }
    function Ii(e) {
      var t = e.doc,
        n = Zo(e)
      t.iter(function (r) {
        var i = n(r)
        i != r.height && Ft(r, i)
      })
    }
    function kr(e, t, n, r) {
      var i = e.display
      if (!n && mt(t).getAttribute('cm-not-content') == 'true') return null
      var o,
        l,
        a = i.lineSpace.getBoundingClientRect()
      try {
        ;(o = t.clientX - a.left), (l = t.clientY - a.top)
      } catch {
        return null
      }
      var s = Oi(e, o, l),
        u
      if (r && s.xRel > 0 && (u = K(e.doc, s.line).text).length == s.ch) {
        var d = U(u, u.length, e.options.tabSize) - u.length
        s = g(s.line, Math.max(0, Math.round((o - Fo(e.display).left) / Hr(e.display)) - d))
      }
      return s
    }
    function Sr(e, t) {
      if (t >= e.display.viewTo || ((t -= e.display.viewFrom), t < 0)) return null
      for (var n = e.display.view, r = 0; r < n.length; r++) if (((t -= n[r].size), t < 0)) return r
    }
    function bt(e, t, n, r) {
      t == null && (t = e.doc.first), n == null && (n = e.doc.first + e.doc.size), r || (r = 0)
      var i = e.display
      if (
        (r && n < i.viewTo && (i.updateLineNumbers == null || i.updateLineNumbers > t) && (i.updateLineNumbers = t),
        (e.curOp.viewChanged = !0),
        t >= i.viewTo)
      )
        $t && ki(e.doc, t) < i.viewTo && cr(e)
      else if (n <= i.viewFrom) $t && Lo(e.doc, n + r) > i.viewFrom ? cr(e) : ((i.viewFrom += r), (i.viewTo += r))
      else if (t <= i.viewFrom && n >= i.viewTo) cr(e)
      else if (t <= i.viewFrom) {
        var o = Zn(e, n, n + r, 1)
        o ? ((i.view = i.view.slice(o.index)), (i.viewFrom = o.lineN), (i.viewTo += r)) : cr(e)
      } else if (n >= i.viewTo) {
        var l = Zn(e, t, t, -1)
        l ? ((i.view = i.view.slice(0, l.index)), (i.viewTo = l.lineN)) : cr(e)
      } else {
        var a = Zn(e, t, t, -1),
          s = Zn(e, n, n + r, 1)
        a && s
          ? ((i.view = i.view
              .slice(0, a.index)
              .concat(qn(e, a.lineN, s.lineN))
              .concat(i.view.slice(s.index))),
            (i.viewTo += r))
          : cr(e)
      }
      var u = i.externalMeasured
      u && (n < u.lineN ? (u.lineN += r) : t < u.lineN + u.size && (i.externalMeasured = null))
    }
    function fr(e, t, n) {
      e.curOp.viewChanged = !0
      var r = e.display,
        i = e.display.externalMeasured
      if (
        (i && t >= i.lineN && t < i.lineN + i.size && (r.externalMeasured = null), !(t < r.viewFrom || t >= r.viewTo))
      ) {
        var o = r.view[Sr(e, t)]
        if (o.node != null) {
          var l = o.changes || (o.changes = [])
          se(l, n) == -1 && l.push(n)
        }
      }
    }
    function cr(e) {
      ;(e.display.viewFrom = e.display.viewTo = e.doc.first), (e.display.view = []), (e.display.viewOffset = 0)
    }
    function Zn(e, t, n, r) {
      var i = Sr(e, t),
        o,
        l = e.display.view
      if (!$t || n == e.doc.first + e.doc.size) return { index: i, lineN: n }
      for (var a = e.display.viewFrom, s = 0; s < i; s++) a += l[s].size
      if (a != t) {
        if (r > 0) {
          if (i == l.length - 1) return null
          ;(o = a + l[i].size - t), i++
        } else o = a - t
        ;(t += o), (n += o)
      }
      for (; ki(e.doc, n) != n; ) {
        if (i == (r < 0 ? 0 : l.length - 1)) return null
        ;(n += r * l[i - (r < 0 ? 1 : 0)].size), (i += r)
      }
      return { index: i, lineN: n }
    }
    function ts(e, t, n) {
      var r = e.display,
        i = r.view
      i.length == 0 || t >= r.viewTo || n <= r.viewFrom
        ? ((r.view = qn(e, t, n)), (r.viewFrom = t))
        : (r.viewFrom > t
            ? (r.view = qn(e, t, r.viewFrom).concat(r.view))
            : r.viewFrom < t && (r.view = r.view.slice(Sr(e, t))),
          (r.viewFrom = t),
          r.viewTo < n
            ? (r.view = r.view.concat(qn(e, r.viewTo, n)))
            : r.viewTo > n && (r.view = r.view.slice(0, Sr(e, n)))),
        (r.viewTo = n)
    }
    function Jo(e) {
      for (var t = e.display.view, n = 0, r = 0; r < t.length; r++) {
        var i = t[r]
        !i.hidden && (!i.node || i.changes) && ++n
      }
      return n
    }
    function dn(e) {
      e.display.input.showSelection(e.display.input.prepareSelection())
    }
    function Qo(e, t) {
      t === void 0 && (t = !0)
      var n = e.doc,
        r = {},
        i = (r.cursors = document.createDocumentFragment()),
        o = (r.selection = document.createDocumentFragment()),
        l = e.options.$customCursor
      l && (t = !0)
      for (var a = 0; a < n.sel.ranges.length; a++)
        if (!(!t && a == n.sel.primIndex)) {
          var s = n.sel.ranges[a]
          if (!(s.from().line >= e.display.viewTo || s.to().line < e.display.viewFrom)) {
            var u = s.empty()
            if (l) {
              var d = l(e, s)
              d && Fi(e, d, i)
            } else (u || e.options.showCursorWhenSelecting) && Fi(e, s.head, i)
            u || rs(e, s, o)
          }
        }
      return r
    }
    function Fi(e, t, n) {
      var r = Ht(e, t, 'div', null, null, !e.options.singleCursorHeightPerLine),
        i = n.appendChild(c('div', ' ', 'CodeMirror-cursor'))
      if (
        ((i.style.left = r.left + 'px'),
        (i.style.top = r.top + 'px'),
        (i.style.height = Math.max(0, r.bottom - r.top) * e.options.cursorHeight + 'px'),
        /\bcm-fat-cursor\b/.test(e.getWrapperElement().className))
      ) {
        var o = Yn(e, t, 'div', null, null),
          l = o.right - o.left
        i.style.width = (l > 0 ? l : e.defaultCharWidth()) + 'px'
      }
      if (r.other) {
        var a = n.appendChild(c('div', ' ', 'CodeMirror-cursor CodeMirror-secondarycursor'))
        ;(a.style.display = ''),
          (a.style.left = r.other.left + 'px'),
          (a.style.top = r.other.top + 'px'),
          (a.style.height = (r.other.bottom - r.other.top) * 0.85 + 'px')
      }
    }
    function Jn(e, t) {
      return e.top - t.top || e.left - t.left
    }
    function rs(e, t, n) {
      var r = e.display,
        i = e.doc,
        o = document.createDocumentFragment(),
        l = Fo(e.display),
        a = l.left,
        s = Math.max(r.sizerWidth, xr(e) - r.sizer.offsetLeft) - l.right,
        u = i.direction == 'ltr'
      function d(P, H, Z, Y) {
        H < 0 && (H = 0),
          (H = Math.round(H)),
          (Y = Math.round(Y)),
          o.appendChild(
            c(
              'div',
              null,
              'CodeMirror-selected',
              'position: absolute; left: ' +
                P +
                `px;
                             top: ` +
                H +
                'px; width: ' +
                (Z ?? s - P) +
                `px;
                             height: ` +
                (Y - H) +
                'px',
            ),
          )
      }
      function h(P, H, Z) {
        var Y = K(i, P),
          ve = Y.text.length,
          Fe,
          ot
        function Ge(Qe, kt) {
          return Yn(e, g(P, Qe), 'div', Y, kt)
        }
        function Lt(Qe, kt, at) {
          var tt = Yo(e, Y, null, Qe),
            Ve = (kt == 'ltr') == (at == 'after') ? 'left' : 'right',
            Ye = at == 'after' ? tt.begin : tt.end - (/\s/.test(Y.text.charAt(tt.end - 1)) ? 2 : 1)
          return Ge(Ye, Ve)[Ve]
        }
        var wt = Et(Y, i.direction)
        return (
          Nt(wt, H || 0, Z ?? ve, function (Qe, kt, at, tt) {
            var Ve = at == 'ltr',
              Ye = Ge(Qe, Ve ? 'left' : 'right'),
              St = Ge(kt - 1, Ve ? 'right' : 'left'),
              Vr = H == null && Qe == 0,
              yr = Z == null && kt == ve,
              dt = tt == 0,
              Yt = !wt || tt == wt.length - 1
            if (St.top - Ye.top <= 3) {
              var lt = (u ? Vr : yr) && dt,
                so = (u ? yr : Vr) && Yt,
                ir = lt ? a : (Ve ? Ye : St).left,
                Nr = so ? s : (Ve ? St : Ye).right
              d(ir, Ye.top, Nr - ir, Ye.bottom)
            } else {
              var Dr, gt, $r, uo
              Ve
                ? ((Dr = u && Vr && dt ? a : Ye.left),
                  (gt = u ? s : Lt(Qe, at, 'before')),
                  ($r = u ? a : Lt(kt, at, 'after')),
                  (uo = u && yr && Yt ? s : St.right))
                : ((Dr = u ? Lt(Qe, at, 'before') : a),
                  (gt = !u && Vr && dt ? s : Ye.right),
                  ($r = !u && yr && Yt ? a : St.left),
                  (uo = u ? Lt(kt, at, 'after') : s)),
                d(Dr, Ye.top, gt - Dr, Ye.bottom),
                Ye.bottom < St.top && d(a, Ye.bottom, null, St.top),
                d($r, St.top, uo - $r, St.bottom)
            }
            ;(!Fe || Jn(Ye, Fe) < 0) && (Fe = Ye),
              Jn(St, Fe) < 0 && (Fe = St),
              (!ot || Jn(Ye, ot) < 0) && (ot = Ye),
              Jn(St, ot) < 0 && (ot = St)
          }),
          { start: Fe, end: ot }
        )
      }
      var b = t.from(),
        m = t.to()
      if (b.line == m.line) h(b.line, b.ch, m.ch)
      else {
        var C = K(i, b.line),
          N = K(i, m.line),
          O = _t(C) == _t(N),
          z = h(b.line, b.ch, O ? C.text.length + 1 : null).end,
          F = h(m.line, O ? 0 : null, m.ch).start
        O &&
          (z.top < F.top - 2
            ? (d(z.right, z.top, null, z.bottom), d(a, F.top, F.left, F.bottom))
            : d(z.right, z.top, F.left - z.right, z.bottom)),
          z.bottom < F.top && d(a, z.bottom, null, F.top)
      }
      n.appendChild(o)
    }
    function Wi(e) {
      if (e.state.focused) {
        var t = e.display
        clearInterval(t.blinker)
        var n = !0
        ;(t.cursorDiv.style.visibility = ''),
          e.options.cursorBlinkRate > 0
            ? (t.blinker = setInterval(function () {
                e.hasFocus() || Br(e), (t.cursorDiv.style.visibility = (n = !n) ? '' : 'hidden')
              }, e.options.cursorBlinkRate))
            : e.options.cursorBlinkRate < 0 && (t.cursorDiv.style.visibility = 'hidden')
      }
    }
    function Vo(e) {
      e.hasFocus() || (e.display.input.focus(), e.state.focused || Hi(e))
    }
    function _i(e) {
      ;(e.state.delayingBlurEvent = !0),
        setTimeout(function () {
          e.state.delayingBlurEvent && ((e.state.delayingBlurEvent = !1), e.state.focused && Br(e))
        }, 100)
    }
    function Hi(e, t) {
      e.state.delayingBlurEvent && !e.state.draggingText && (e.state.delayingBlurEvent = !1),
        e.options.readOnly != 'nocursor' &&
          (e.state.focused ||
            (_e(e, 'focus', e, t),
            (e.state.focused = !0),
            D(e.display.wrapper, 'CodeMirror-focused'),
            !e.curOp &&
              e.display.selForContextMenu != e.doc.sel &&
              (e.display.input.reset(),
              W &&
                setTimeout(function () {
                  return e.display.input.reset(!0)
                }, 20)),
            e.display.input.receivedFocus()),
          Wi(e))
    }
    function Br(e, t) {
      e.state.delayingBlurEvent ||
        (e.state.focused && (_e(e, 'blur', e, t), (e.state.focused = !1), me(e.display.wrapper, 'CodeMirror-focused')),
        clearInterval(e.display.blinker),
        setTimeout(function () {
          e.state.focused || (e.display.shift = !1)
        }, 150))
    }
    function Qn(e) {
      for (
        var t = e.display,
          n = t.lineDiv.offsetTop,
          r = Math.max(0, t.scroller.getBoundingClientRect().top),
          i = t.lineDiv.getBoundingClientRect().top,
          o = 0,
          l = 0;
        l < t.view.length;
        l++
      ) {
        var a = t.view[l],
          s = e.options.lineWrapping,
          u = void 0,
          d = 0
        if (!a.hidden) {
          if (((i += a.line.height), M && j < 8)) {
            var h = a.node.offsetTop + a.node.offsetHeight
            ;(u = h - n), (n = h)
          } else {
            var b = a.node.getBoundingClientRect()
            ;(u = b.bottom - b.top),
              !s && a.text.firstChild && (d = a.text.firstChild.getBoundingClientRect().right - b.left - 1)
          }
          var m = a.line.height - u
          if ((m > 0.005 || m < -0.005) && (i < r && (o -= m), Ft(a.line, u), $o(a.line), a.rest))
            for (var C = 0; C < a.rest.length; C++) $o(a.rest[C])
          if (d > e.display.sizerWidth) {
            var N = Math.ceil(d / Hr(e.display))
            N > e.display.maxLineLength &&
              ((e.display.maxLineLength = N), (e.display.maxLine = a.line), (e.display.maxLineChanged = !0))
          }
        }
      }
      Math.abs(o) > 2 && (t.scroller.scrollTop += o)
    }
    function $o(e) {
      if (e.widgets)
        for (var t = 0; t < e.widgets.length; ++t) {
          var n = e.widgets[t],
            r = n.node.parentNode
          r && (n.height = r.offsetHeight)
        }
    }
    function Vn(e, t, n) {
      var r = n && n.top != null ? Math.max(0, n.top) : e.scroller.scrollTop
      r = Math.floor(r - jn(e))
      var i = n && n.bottom != null ? n.bottom : r + e.wrapper.clientHeight,
        o = Gt(t, r),
        l = Gt(t, i)
      if (n && n.ensure) {
        var a = n.ensure.from.line,
          s = n.ensure.to.line
        a < o
          ? ((o = a), (l = Gt(t, er(K(t, a)) + e.wrapper.clientHeight)))
          : Math.min(s, t.lastLine()) >= l && ((o = Gt(t, er(K(t, s)) - e.wrapper.clientHeight)), (l = s))
      }
      return { from: o, to: Math.max(l, o + 1) }
    }
    function ns(e, t) {
      if (!je(e, 'scrollCursorIntoView')) {
        var n = e.display,
          r = n.sizer.getBoundingClientRect(),
          i = null,
          o = n.wrapper.ownerDocument
        if (
          (t.top + r.top < 0
            ? (i = !0)
            : t.bottom + r.top > (o.defaultView.innerHeight || o.documentElement.clientHeight) && (i = !1),
          i != null && !Ae)
        ) {
          var l = c(
            'div',
            '​',
            null,
            `position: absolute;
                         top: ` +
              (t.top - n.viewOffset - jn(e.display)) +
              `px;
                         height: ` +
              (t.bottom - t.top + jt(e) + n.barHeight) +
              `px;
                         left: ` +
              t.left +
              'px; width: ' +
              Math.max(2, t.right - t.left) +
              'px;',
          )
          e.display.lineSpace.appendChild(l), l.scrollIntoView(i), e.display.lineSpace.removeChild(l)
        }
      }
    }
    function is(e, t, n, r) {
      r == null && (r = 0)
      var i
      !e.options.lineWrapping &&
        t == n &&
        ((n = t.sticky == 'before' ? g(t.line, t.ch + 1, 'before') : t),
        (t = t.ch ? g(t.line, t.sticky == 'before' ? t.ch - 1 : t.ch, 'after') : t))
      for (var o = 0; o < 5; o++) {
        var l = !1,
          a = Ht(e, t),
          s = !n || n == t ? a : Ht(e, n)
        i = {
          left: Math.min(a.left, s.left),
          top: Math.min(a.top, s.top) - r,
          right: Math.max(a.left, s.left),
          bottom: Math.max(a.bottom, s.bottom) + r,
        }
        var u = Bi(e, i),
          d = e.doc.scrollTop,
          h = e.doc.scrollLeft
        if (
          (u.scrollTop != null && (pn(e, u.scrollTop), Math.abs(e.doc.scrollTop - d) > 1 && (l = !0)),
          u.scrollLeft != null && (Cr(e, u.scrollLeft), Math.abs(e.doc.scrollLeft - h) > 1 && (l = !0)),
          !l)
        )
          break
      }
      return i
    }
    function os(e, t) {
      var n = Bi(e, t)
      n.scrollTop != null && pn(e, n.scrollTop), n.scrollLeft != null && Cr(e, n.scrollLeft)
    }
    function Bi(e, t) {
      var n = e.display,
        r = _r(e.display)
      t.top < 0 && (t.top = 0)
      var i = e.curOp && e.curOp.scrollTop != null ? e.curOp.scrollTop : n.scroller.scrollTop,
        o = Mi(e),
        l = {}
      t.bottom - t.top > o && (t.bottom = t.top + o)
      var a = e.doc.height + Li(n),
        s = t.top < r,
        u = t.bottom > a - r
      if (t.top < i) l.scrollTop = s ? 0 : t.top
      else if (t.bottom > i + o) {
        var d = Math.min(t.top, (u ? a : t.bottom) - o)
        d != i && (l.scrollTop = d)
      }
      var h = e.options.fixedGutter ? 0 : n.gutters.offsetWidth,
        b = e.curOp && e.curOp.scrollLeft != null ? e.curOp.scrollLeft : n.scroller.scrollLeft - h,
        m = xr(e) - n.gutters.offsetWidth,
        C = t.right - t.left > m
      return (
        C && (t.right = t.left + m),
        t.left < 10
          ? (l.scrollLeft = 0)
          : t.left < b
          ? (l.scrollLeft = Math.max(0, t.left + h - (C ? 0 : 10)))
          : t.right > m + b - 3 && (l.scrollLeft = t.right + (C ? 0 : 10) - m),
        l
      )
    }
    function Ri(e, t) {
      t != null && ($n(e), (e.curOp.scrollTop = (e.curOp.scrollTop == null ? e.doc.scrollTop : e.curOp.scrollTop) + t))
    }
    function Rr(e) {
      $n(e)
      var t = e.getCursor()
      e.curOp.scrollToPos = { from: t, to: t, margin: e.options.cursorScrollMargin }
    }
    function hn(e, t, n) {
      ;(t != null || n != null) && $n(e), t != null && (e.curOp.scrollLeft = t), n != null && (e.curOp.scrollTop = n)
    }
    function ls(e, t) {
      $n(e), (e.curOp.scrollToPos = t)
    }
    function $n(e) {
      var t = e.curOp.scrollToPos
      if (t) {
        e.curOp.scrollToPos = null
        var n = jo(e, t.from),
          r = jo(e, t.to)
        el(e, n, r, t.margin)
      }
    }
    function el(e, t, n, r) {
      var i = Bi(e, {
        left: Math.min(t.left, n.left),
        top: Math.min(t.top, n.top) - r,
        right: Math.max(t.right, n.right),
        bottom: Math.max(t.bottom, n.bottom) + r,
      })
      hn(e, i.scrollLeft, i.scrollTop)
    }
    function pn(e, t) {
      Math.abs(e.doc.scrollTop - t) < 2 || (we || Ui(e, { top: t }), tl(e, t, !0), we && Ui(e), yn(e, 100))
    }
    function tl(e, t, n) {
      ;(t = Math.max(0, Math.min(e.display.scroller.scrollHeight - e.display.scroller.clientHeight, t))),
        !(e.display.scroller.scrollTop == t && !n) &&
          ((e.doc.scrollTop = t),
          e.display.scrollbars.setScrollTop(t),
          e.display.scroller.scrollTop != t && (e.display.scroller.scrollTop = t))
    }
    function Cr(e, t, n, r) {
      ;(t = Math.max(0, Math.min(t, e.display.scroller.scrollWidth - e.display.scroller.clientWidth))),
        !((n ? t == e.doc.scrollLeft : Math.abs(e.doc.scrollLeft - t) < 2) && !r) &&
          ((e.doc.scrollLeft = t),
          ll(e),
          e.display.scroller.scrollLeft != t && (e.display.scroller.scrollLeft = t),
          e.display.scrollbars.setScrollLeft(t))
    }
    function vn(e) {
      var t = e.display,
        n = t.gutters.offsetWidth,
        r = Math.round(e.doc.height + Li(e.display))
      return {
        clientHeight: t.scroller.clientHeight,
        viewHeight: t.wrapper.clientHeight,
        scrollWidth: t.scroller.scrollWidth,
        clientWidth: t.scroller.clientWidth,
        viewWidth: t.wrapper.clientWidth,
        barLeft: e.options.fixedGutter ? n : 0,
        docHeight: r,
        scrollHeight: r + jt(e) + t.barHeight,
        nativeBarWidth: t.nativeBarWidth,
        gutterWidth: n,
      }
    }
    var Tr = function (e, t, n) {
      this.cm = n
      var r = (this.vert = c('div', [c('div', null, null, 'min-width: 1px')], 'CodeMirror-vscrollbar')),
        i = (this.horiz = c('div', [c('div', null, null, 'height: 100%; min-height: 1px')], 'CodeMirror-hscrollbar'))
      ;(r.tabIndex = i.tabIndex = -1),
        e(r),
        e(i),
        E(r, 'scroll', function () {
          r.clientHeight && t(r.scrollTop, 'vertical')
        }),
        E(i, 'scroll', function () {
          i.clientWidth && t(i.scrollLeft, 'horizontal')
        }),
        (this.checkedZeroWidth = !1),
        M && j < 8 && (this.horiz.style.minHeight = this.vert.style.minWidth = '18px')
    }
    ;(Tr.prototype.update = function (e) {
      var t = e.scrollWidth > e.clientWidth + 1,
        n = e.scrollHeight > e.clientHeight + 1,
        r = e.nativeBarWidth
      if (n) {
        ;(this.vert.style.display = 'block'), (this.vert.style.bottom = t ? r + 'px' : '0')
        var i = e.viewHeight - (t ? r : 0)
        this.vert.firstChild.style.height = Math.max(0, e.scrollHeight - e.clientHeight + i) + 'px'
      } else (this.vert.scrollTop = 0), (this.vert.style.display = ''), (this.vert.firstChild.style.height = '0')
      if (t) {
        ;(this.horiz.style.display = 'block'),
          (this.horiz.style.right = n ? r + 'px' : '0'),
          (this.horiz.style.left = e.barLeft + 'px')
        var o = e.viewWidth - e.barLeft - (n ? r : 0)
        this.horiz.firstChild.style.width = Math.max(0, e.scrollWidth - e.clientWidth + o) + 'px'
      } else (this.horiz.style.display = ''), (this.horiz.firstChild.style.width = '0')
      return (
        !this.checkedZeroWidth && e.clientHeight > 0 && (r == 0 && this.zeroWidthHack(), (this.checkedZeroWidth = !0)),
        { right: n ? r : 0, bottom: t ? r : 0 }
      )
    }),
      (Tr.prototype.setScrollLeft = function (e) {
        this.horiz.scrollLeft != e && (this.horiz.scrollLeft = e),
          this.disableHoriz && this.enableZeroWidthBar(this.horiz, this.disableHoriz, 'horiz')
      }),
      (Tr.prototype.setScrollTop = function (e) {
        this.vert.scrollTop != e && (this.vert.scrollTop = e),
          this.disableVert && this.enableZeroWidthBar(this.vert, this.disableVert, 'vert')
      }),
      (Tr.prototype.zeroWidthHack = function () {
        var e = xe && !Se ? '12px' : '18px'
        ;(this.horiz.style.height = this.vert.style.width = e),
          (this.horiz.style.visibility = this.vert.style.visibility = 'hidden'),
          (this.disableHoriz = new fe()),
          (this.disableVert = new fe())
      }),
      (Tr.prototype.enableZeroWidthBar = function (e, t, n) {
        e.style.visibility = ''
        function r() {
          var i = e.getBoundingClientRect(),
            o =
              n == 'vert'
                ? document.elementFromPoint(i.right - 1, (i.top + i.bottom) / 2)
                : document.elementFromPoint((i.right + i.left) / 2, i.bottom - 1)
          o != e ? (e.style.visibility = 'hidden') : t.set(1e3, r)
        }
        t.set(1e3, r)
      }),
      (Tr.prototype.clear = function () {
        var e = this.horiz.parentNode
        e.removeChild(this.horiz), e.removeChild(this.vert)
      })
    var gn = function () {}
    ;(gn.prototype.update = function () {
      return { bottom: 0, right: 0 }
    }),
      (gn.prototype.setScrollLeft = function () {}),
      (gn.prototype.setScrollTop = function () {}),
      (gn.prototype.clear = function () {})
    function Kr(e, t) {
      t || (t = vn(e))
      var n = e.display.barWidth,
        r = e.display.barHeight
      rl(e, t)
      for (var i = 0; (i < 4 && n != e.display.barWidth) || r != e.display.barHeight; i++)
        n != e.display.barWidth && e.options.lineWrapping && Qn(e),
          rl(e, vn(e)),
          (n = e.display.barWidth),
          (r = e.display.barHeight)
    }
    function rl(e, t) {
      var n = e.display,
        r = n.scrollbars.update(t)
      ;(n.sizer.style.paddingRight = (n.barWidth = r.right) + 'px'),
        (n.sizer.style.paddingBottom = (n.barHeight = r.bottom) + 'px'),
        (n.heightForcer.style.borderBottom = r.bottom + 'px solid transparent'),
        r.right && r.bottom
          ? ((n.scrollbarFiller.style.display = 'block'),
            (n.scrollbarFiller.style.height = r.bottom + 'px'),
            (n.scrollbarFiller.style.width = r.right + 'px'))
          : (n.scrollbarFiller.style.display = ''),
        r.bottom && e.options.coverGutterNextToScrollbar && e.options.fixedGutter
          ? ((n.gutterFiller.style.display = 'block'),
            (n.gutterFiller.style.height = r.bottom + 'px'),
            (n.gutterFiller.style.width = t.gutterWidth + 'px'))
          : (n.gutterFiller.style.display = '')
    }
    var nl = { native: Tr, null: gn }
    function il(e) {
      e.display.scrollbars &&
        (e.display.scrollbars.clear(),
        e.display.scrollbars.addClass && me(e.display.wrapper, e.display.scrollbars.addClass)),
        (e.display.scrollbars = new nl[e.options.scrollbarStyle](
          function (t) {
            e.display.wrapper.insertBefore(t, e.display.scrollbarFiller),
              E(t, 'mousedown', function () {
                e.state.focused &&
                  setTimeout(function () {
                    return e.display.input.focus()
                  }, 0)
              }),
              t.setAttribute('cm-not-content', 'true')
          },
          function (t, n) {
            n == 'horizontal' ? Cr(e, t) : pn(e, t)
          },
          e,
        )),
        e.display.scrollbars.addClass && D(e.display.wrapper, e.display.scrollbars.addClass)
    }
    var as = 0
    function Lr(e) {
      ;(e.curOp = {
        cm: e,
        viewChanged: !1,
        startHeight: e.doc.height,
        forceUpdate: !1,
        updateInput: 0,
        typing: !1,
        changeObjs: null,
        cursorActivityHandlers: null,
        cursorActivityCalled: 0,
        selectionChanged: !1,
        updateMaxLine: !1,
        scrollLeft: null,
        scrollTop: null,
        scrollToPos: null,
        focus: !1,
        id: ++as,
        markArrays: null,
      }),
        _a(e.curOp)
    }
    function Mr(e) {
      var t = e.curOp
      t &&
        Ba(t, function (n) {
          for (var r = 0; r < n.ops.length; r++) n.ops[r].cm.curOp = null
          ss(n)
        })
    }
    function ss(e) {
      for (var t = e.ops, n = 0; n < t.length; n++) us(t[n])
      for (var r = 0; r < t.length; r++) fs(t[r])
      for (var i = 0; i < t.length; i++) cs(t[i])
      for (var o = 0; o < t.length; o++) ds(t[o])
      for (var l = 0; l < t.length; l++) hs(t[l])
    }
    function us(e) {
      var t = e.cm,
        n = t.display
      vs(t),
        e.updateMaxLine && Ci(t),
        (e.mustUpdate =
          e.viewChanged ||
          e.forceUpdate ||
          e.scrollTop != null ||
          (e.scrollToPos && (e.scrollToPos.from.line < n.viewFrom || e.scrollToPos.to.line >= n.viewTo)) ||
          (n.maxLineChanged && t.options.lineWrapping)),
        (e.update =
          e.mustUpdate && new ei(t, e.mustUpdate && { top: e.scrollTop, ensure: e.scrollToPos }, e.forceUpdate))
    }
    function fs(e) {
      e.updatedDisplay = e.mustUpdate && Ki(e.cm, e.update)
    }
    function cs(e) {
      var t = e.cm,
        n = t.display
      e.updatedDisplay && Qn(t),
        (e.barMeasure = vn(t)),
        n.maxLineChanged &&
          !t.options.lineWrapping &&
          ((e.adjustWidthTo = _o(t, n.maxLine, n.maxLine.text.length).left + 3),
          (t.display.sizerWidth = e.adjustWidthTo),
          (e.barMeasure.scrollWidth = Math.max(
            n.scroller.clientWidth,
            n.sizer.offsetLeft + e.adjustWidthTo + jt(t) + t.display.barWidth,
          )),
          (e.maxScrollLeft = Math.max(0, n.sizer.offsetLeft + e.adjustWidthTo - xr(t)))),
        (e.updatedDisplay || e.selectionChanged) && (e.preparedSelection = n.input.prepareSelection())
    }
    function ds(e) {
      var t = e.cm
      e.adjustWidthTo != null &&
        ((t.display.sizer.style.minWidth = e.adjustWidthTo + 'px'),
        e.maxScrollLeft < t.doc.scrollLeft && Cr(t, Math.min(t.display.scroller.scrollLeft, e.maxScrollLeft), !0),
        (t.display.maxLineChanged = !1))
      var n = e.focus && e.focus == y(ae(t))
      e.preparedSelection && t.display.input.showSelection(e.preparedSelection, n),
        (e.updatedDisplay || e.startHeight != t.doc.height) && Kr(t, e.barMeasure),
        e.updatedDisplay && qi(t, e.barMeasure),
        e.selectionChanged && Wi(t),
        t.state.focused && e.updateInput && t.display.input.reset(e.typing),
        n && Vo(e.cm)
    }
    function hs(e) {
      var t = e.cm,
        n = t.display,
        r = t.doc
      if (
        (e.updatedDisplay && ol(t, e.update),
        n.wheelStartX != null &&
          (e.scrollTop != null || e.scrollLeft != null || e.scrollToPos) &&
          (n.wheelStartX = n.wheelStartY = null),
        e.scrollTop != null && tl(t, e.scrollTop, e.forceScroll),
        e.scrollLeft != null && Cr(t, e.scrollLeft, !0, !0),
        e.scrollToPos)
      ) {
        var i = is(t, le(r, e.scrollToPos.from), le(r, e.scrollToPos.to), e.scrollToPos.margin)
        ns(t, i)
      }
      var o = e.maybeHiddenMarkers,
        l = e.maybeUnhiddenMarkers
      if (o) for (var a = 0; a < o.length; ++a) o[a].lines.length || _e(o[a], 'hide')
      if (l) for (var s = 0; s < l.length; ++s) l[s].lines.length && _e(l[s], 'unhide')
      n.wrapper.offsetHeight && (r.scrollTop = t.display.scroller.scrollTop),
        e.changeObjs && _e(t, 'changes', t, e.changeObjs),
        e.update && e.update.finish()
    }
    function Tt(e, t) {
      if (e.curOp) return t()
      Lr(e)
      try {
        return t()
      } finally {
        Mr(e)
      }
    }
    function nt(e, t) {
      return function () {
        if (e.curOp) return t.apply(e, arguments)
        Lr(e)
        try {
          return t.apply(e, arguments)
        } finally {
          Mr(e)
        }
      }
    }
    function vt(e) {
      return function () {
        if (this.curOp) return e.apply(this, arguments)
        Lr(this)
        try {
          return e.apply(this, arguments)
        } finally {
          Mr(this)
        }
      }
    }
    function it(e) {
      return function () {
        var t = this.cm
        if (!t || t.curOp) return e.apply(this, arguments)
        Lr(t)
        try {
          return e.apply(this, arguments)
        } finally {
          Mr(t)
        }
      }
    }
    function yn(e, t) {
      e.doc.highlightFrontier < e.display.viewTo && e.state.highlight.set(t, We(ps, e))
    }
    function ps(e) {
      var t = e.doc
      if (!(t.highlightFrontier >= e.display.viewTo)) {
        var n = +new Date() + e.options.workTime,
          r = ln(e, t.highlightFrontier),
          i = []
        t.iter(r.line, Math.min(t.first + t.size, e.display.viewTo + 500), function (o) {
          if (r.line >= e.display.viewFrom) {
            var l = o.styles,
              a = o.text.length > e.options.maxHighlightLength ? Qt(t.mode, r.state) : null,
              s = co(e, o, r, !0)
            a && (r.state = a), (o.styles = s.styles)
            var u = o.styleClasses,
              d = s.classes
            d ? (o.styleClasses = d) : u && (o.styleClasses = null)
            for (
              var h =
                  !l ||
                  l.length != o.styles.length ||
                  (u != d && (!u || !d || u.bgClass != d.bgClass || u.textClass != d.textClass)),
                b = 0;
              !h && b < l.length;
              ++b
            )
              h = l[b] != o.styles[b]
            h && i.push(r.line), (o.stateAfter = r.save()), r.nextLine()
          } else
            o.text.length <= e.options.maxHighlightLength && mi(e, o.text, r),
              (o.stateAfter = r.line % 5 == 0 ? r.save() : null),
              r.nextLine()
          if (+new Date() > n) return yn(e, e.options.workDelay), !0
        }),
          (t.highlightFrontier = r.line),
          (t.modeFrontier = Math.max(t.modeFrontier, r.line)),
          i.length &&
            Tt(e, function () {
              for (var o = 0; o < i.length; o++) fr(e, i[o], 'text')
            })
      }
    }
    var ei = function (e, t, n) {
      var r = e.display
      ;(this.viewport = t),
        (this.visible = Vn(r, e.doc, t)),
        (this.editorIsHidden = !r.wrapper.offsetWidth),
        (this.wrapperHeight = r.wrapper.clientHeight),
        (this.wrapperWidth = r.wrapper.clientWidth),
        (this.oldDisplayWidth = xr(e)),
        (this.force = n),
        (this.dims = Pi(e)),
        (this.events = [])
    }
    ;(ei.prototype.signal = function (e, t) {
      ht(e, t) && this.events.push(arguments)
    }),
      (ei.prototype.finish = function () {
        for (var e = 0; e < this.events.length; e++) _e.apply(null, this.events[e])
      })
    function vs(e) {
      var t = e.display
      !t.scrollbarsClipped &&
        t.scroller.offsetWidth &&
        ((t.nativeBarWidth = t.scroller.offsetWidth - t.scroller.clientWidth),
        (t.heightForcer.style.height = jt(e) + 'px'),
        (t.sizer.style.marginBottom = -t.nativeBarWidth + 'px'),
        (t.sizer.style.borderRightWidth = jt(e) + 'px'),
        (t.scrollbarsClipped = !0))
    }
    function gs(e) {
      if (e.hasFocus()) return null
      var t = y(ae(e))
      if (!t || !v(e.display.lineDiv, t)) return null
      var n = { activeElt: t }
      if (window.getSelection) {
        var r = Ze(e).getSelection()
        r.anchorNode &&
          r.extend &&
          v(e.display.lineDiv, r.anchorNode) &&
          ((n.anchorNode = r.anchorNode),
          (n.anchorOffset = r.anchorOffset),
          (n.focusNode = r.focusNode),
          (n.focusOffset = r.focusOffset))
      }
      return n
    }
    function ys(e) {
      if (
        !(!e || !e.activeElt || e.activeElt == y(e.activeElt.ownerDocument)) &&
        (e.activeElt.focus(),
        !/^(INPUT|TEXTAREA)$/.test(e.activeElt.nodeName) &&
          e.anchorNode &&
          v(document.body, e.anchorNode) &&
          v(document.body, e.focusNode))
      ) {
        var t = e.activeElt.ownerDocument,
          n = t.defaultView.getSelection(),
          r = t.createRange()
        r.setEnd(e.anchorNode, e.anchorOffset),
          r.collapse(!1),
          n.removeAllRanges(),
          n.addRange(r),
          n.extend(e.focusNode, e.focusOffset)
      }
    }
    function Ki(e, t) {
      var n = e.display,
        r = e.doc
      if (t.editorIsHidden) return cr(e), !1
      if (
        !t.force &&
        t.visible.from >= n.viewFrom &&
        t.visible.to <= n.viewTo &&
        (n.updateLineNumbers == null || n.updateLineNumbers >= n.viewTo) &&
        n.renderedView == n.view &&
        Jo(e) == 0
      )
        return !1
      al(e) && (cr(e), (t.dims = Pi(e)))
      var i = r.first + r.size,
        o = Math.max(t.visible.from - e.options.viewportMargin, r.first),
        l = Math.min(i, t.visible.to + e.options.viewportMargin)
      n.viewFrom < o && o - n.viewFrom < 20 && (o = Math.max(r.first, n.viewFrom)),
        n.viewTo > l && n.viewTo - l < 20 && (l = Math.min(i, n.viewTo)),
        $t && ((o = ki(e.doc, o)), (l = Lo(e.doc, l)))
      var a =
        o != n.viewFrom || l != n.viewTo || n.lastWrapHeight != t.wrapperHeight || n.lastWrapWidth != t.wrapperWidth
      ts(e, o, l), (n.viewOffset = er(K(e.doc, n.viewFrom))), (e.display.mover.style.top = n.viewOffset + 'px')
      var s = Jo(e)
      if (
        !a &&
        s == 0 &&
        !t.force &&
        n.renderedView == n.view &&
        (n.updateLineNumbers == null || n.updateLineNumbers >= n.viewTo)
      )
        return !1
      var u = gs(e)
      return (
        s > 4 && (n.lineDiv.style.display = 'none'),
        ms(e, n.updateLineNumbers, t.dims),
        s > 4 && (n.lineDiv.style.display = ''),
        (n.renderedView = n.view),
        ys(u),
        L(n.cursorDiv),
        L(n.selectionDiv),
        (n.gutters.style.height = n.sizer.style.minHeight = 0),
        a && ((n.lastWrapHeight = t.wrapperHeight), (n.lastWrapWidth = t.wrapperWidth), yn(e, 400)),
        (n.updateLineNumbers = null),
        !0
      )
    }
    function ol(e, t) {
      for (var n = t.viewport, r = !0; ; r = !1) {
        if (!r || !e.options.lineWrapping || t.oldDisplayWidth == xr(e)) {
          if (
            (n && n.top != null && (n = { top: Math.min(e.doc.height + Li(e.display) - Mi(e), n.top) }),
            (t.visible = Vn(e.display, e.doc, n)),
            t.visible.from >= e.display.viewFrom && t.visible.to <= e.display.viewTo)
          )
            break
        } else r && (t.visible = Vn(e.display, e.doc, n))
        if (!Ki(e, t)) break
        Qn(e)
        var i = vn(e)
        dn(e), Kr(e, i), qi(e, i), (t.force = !1)
      }
      t.signal(e, 'update', e),
        (e.display.viewFrom != e.display.reportedViewFrom || e.display.viewTo != e.display.reportedViewTo) &&
          (t.signal(e, 'viewportChange', e, e.display.viewFrom, e.display.viewTo),
          (e.display.reportedViewFrom = e.display.viewFrom),
          (e.display.reportedViewTo = e.display.viewTo))
    }
    function Ui(e, t) {
      var n = new ei(e, t)
      if (Ki(e, n)) {
        Qn(e), ol(e, n)
        var r = vn(e)
        dn(e), Kr(e, r), qi(e, r), n.finish()
      }
    }
    function ms(e, t, n) {
      var r = e.display,
        i = e.options.lineNumbers,
        o = r.lineDiv,
        l = o.firstChild
      function a(C) {
        var N = C.nextSibling
        return (
          W && xe && e.display.currentWheelTarget == C ? (C.style.display = 'none') : C.parentNode.removeChild(C), N
        )
      }
      for (var s = r.view, u = r.viewFrom, d = 0; d < s.length; d++) {
        var h = s[d]
        if (!h.hidden)
          if (!h.node || h.node.parentNode != o) {
            var b = qa(e, h, u, n)
            o.insertBefore(b, l)
          } else {
            for (; l != h.node; ) l = a(l)
            var m = i && t != null && t <= u && h.lineNumber
            h.changes && (se(h.changes, 'gutter') > -1 && (m = !1), Oo(e, h, u, n)),
              m && (L(h.lineNumber), h.lineNumber.appendChild(document.createTextNode(p(e.options, u)))),
              (l = h.node.nextSibling)
          }
        u += h.size
      }
      for (; l; ) l = a(l)
    }
    function Gi(e) {
      var t = e.gutters.offsetWidth
      ;(e.sizer.style.marginLeft = t + 'px'), rt(e, 'gutterChanged', e)
    }
    function qi(e, t) {
      ;(e.display.sizer.style.minHeight = t.docHeight + 'px'),
        (e.display.heightForcer.style.top = t.docHeight + 'px'),
        (e.display.gutters.style.height = t.docHeight + e.display.barHeight + jt(e) + 'px')
    }
    function ll(e) {
      var t = e.display,
        n = t.view
      if (!(!t.alignWidgets && (!t.gutters.firstChild || !e.options.fixedGutter))) {
        for (
          var r = Ei(t) - t.scroller.scrollLeft + e.doc.scrollLeft, i = t.gutters.offsetWidth, o = r + 'px', l = 0;
          l < n.length;
          l++
        )
          if (!n[l].hidden) {
            e.options.fixedGutter &&
              (n[l].gutter && (n[l].gutter.style.left = o),
              n[l].gutterBackground && (n[l].gutterBackground.style.left = o))
            var a = n[l].alignable
            if (a) for (var s = 0; s < a.length; s++) a[s].style.left = o
          }
        e.options.fixedGutter && (t.gutters.style.left = r + i + 'px')
      }
    }
    function al(e) {
      if (!e.options.lineNumbers) return !1
      var t = e.doc,
        n = p(e.options, t.first + t.size - 1),
        r = e.display
      if (n.length != r.lineNumChars) {
        var i = r.measure.appendChild(c('div', [c('div', n)], 'CodeMirror-linenumber CodeMirror-gutter-elt')),
          o = i.firstChild.offsetWidth,
          l = i.offsetWidth - o
        return (
          (r.lineGutter.style.width = ''),
          (r.lineNumInnerWidth = Math.max(o, r.lineGutter.offsetWidth - l) + 1),
          (r.lineNumWidth = r.lineNumInnerWidth + l),
          (r.lineNumChars = r.lineNumInnerWidth ? n.length : -1),
          (r.lineGutter.style.width = r.lineNumWidth + 'px'),
          Gi(e.display),
          !0
        )
      }
      return !1
    }
    function ji(e, t) {
      for (var n = [], r = !1, i = 0; i < e.length; i++) {
        var o = e[i],
          l = null
        if ((typeof o != 'string' && ((l = o.style), (o = o.className)), o == 'CodeMirror-linenumbers'))
          if (t) r = !0
          else continue
        n.push({ className: o, style: l })
      }
      return t && !r && n.push({ className: 'CodeMirror-linenumbers', style: null }), n
    }
    function sl(e) {
      var t = e.gutters,
        n = e.gutterSpecs
      L(t), (e.lineGutter = null)
      for (var r = 0; r < n.length; ++r) {
        var i = n[r],
          o = i.className,
          l = i.style,
          a = t.appendChild(c('div', null, 'CodeMirror-gutter ' + o))
        l && (a.style.cssText = l),
          o == 'CodeMirror-linenumbers' && ((e.lineGutter = a), (a.style.width = (e.lineNumWidth || 1) + 'px'))
      }
      ;(t.style.display = n.length ? '' : 'none'), Gi(e)
    }
    function mn(e) {
      sl(e.display), bt(e), ll(e)
    }
    function bs(e, t, n, r) {
      var i = this
      ;(this.input = n),
        (i.scrollbarFiller = c('div', null, 'CodeMirror-scrollbar-filler')),
        i.scrollbarFiller.setAttribute('cm-not-content', 'true'),
        (i.gutterFiller = c('div', null, 'CodeMirror-gutter-filler')),
        i.gutterFiller.setAttribute('cm-not-content', 'true'),
        (i.lineDiv = w('div', null, 'CodeMirror-code')),
        (i.selectionDiv = c('div', null, null, 'position: relative; z-index: 1')),
        (i.cursorDiv = c('div', null, 'CodeMirror-cursors')),
        (i.measure = c('div', null, 'CodeMirror-measure')),
        (i.lineMeasure = c('div', null, 'CodeMirror-measure')),
        (i.lineSpace = w(
          'div',
          [i.measure, i.lineMeasure, i.selectionDiv, i.cursorDiv, i.lineDiv],
          null,
          'position: relative; outline: none',
        ))
      var o = w('div', [i.lineSpace], 'CodeMirror-lines')
      ;(i.mover = c('div', [o], null, 'position: relative')),
        (i.sizer = c('div', [i.mover], 'CodeMirror-sizer')),
        (i.sizerWidth = null),
        (i.heightForcer = c('div', null, null, 'position: absolute; height: ' + ge + 'px; width: 1px;')),
        (i.gutters = c('div', null, 'CodeMirror-gutters')),
        (i.lineGutter = null),
        (i.scroller = c('div', [i.sizer, i.heightForcer, i.gutters], 'CodeMirror-scroll')),
        i.scroller.setAttribute('tabIndex', '-1'),
        (i.wrapper = c('div', [i.scrollbarFiller, i.gutterFiller, i.scroller], 'CodeMirror')),
        G && ue >= 105 && (i.wrapper.style.clipPath = 'inset(0px)'),
        i.wrapper.setAttribute('translate', 'no'),
        M && j < 8 && ((i.gutters.style.zIndex = -1), (i.scroller.style.paddingRight = 0)),
        !W && !(we && te) && (i.scroller.draggable = !0),
        e && (e.appendChild ? e.appendChild(i.wrapper) : e(i.wrapper)),
        (i.viewFrom = i.viewTo = t.first),
        (i.reportedViewFrom = i.reportedViewTo = t.first),
        (i.view = []),
        (i.renderedView = null),
        (i.externalMeasured = null),
        (i.viewOffset = 0),
        (i.lastWrapHeight = i.lastWrapWidth = 0),
        (i.updateLineNumbers = null),
        (i.nativeBarWidth = i.barHeight = i.barWidth = 0),
        (i.scrollbarsClipped = !1),
        (i.lineNumWidth = i.lineNumInnerWidth = i.lineNumChars = null),
        (i.alignWidgets = !1),
        (i.cachedCharWidth = i.cachedTextHeight = i.cachedPaddingH = null),
        (i.maxLine = null),
        (i.maxLineLength = 0),
        (i.maxLineChanged = !1),
        (i.wheelDX = i.wheelDY = i.wheelStartX = i.wheelStartY = null),
        (i.shift = !1),
        (i.selForContextMenu = null),
        (i.activeTouch = null),
        (i.gutterSpecs = ji(r.gutters, r.lineNumbers)),
        sl(i),
        n.init(i)
    }
    var ti = 0,
      rr = null
    M ? (rr = -0.53) : we ? (rr = 15) : G ? (rr = -0.7) : Ee && (rr = -1 / 3)
    function ul(e) {
      var t = e.wheelDeltaX,
        n = e.wheelDeltaY
      return (
        t == null && e.detail && e.axis == e.HORIZONTAL_AXIS && (t = e.detail),
        n == null && e.detail && e.axis == e.VERTICAL_AXIS ? (n = e.detail) : n == null && (n = e.wheelDelta),
        { x: t, y: n }
      )
    }
    function xs(e) {
      var t = ul(e)
      return (t.x *= rr), (t.y *= rr), t
    }
    function fl(e, t) {
      G &&
        ue == 102 &&
        (e.display.chromeScrollHack == null
          ? (e.display.sizer.style.pointerEvents = 'none')
          : clearTimeout(e.display.chromeScrollHack),
        (e.display.chromeScrollHack = setTimeout(function () {
          ;(e.display.chromeScrollHack = null), (e.display.sizer.style.pointerEvents = '')
        }, 100)))
      var n = ul(t),
        r = n.x,
        i = n.y,
        o = rr
      t.deltaMode === 0 && ((r = t.deltaX), (i = t.deltaY), (o = 1))
      var l = e.display,
        a = l.scroller,
        s = a.scrollWidth > a.clientWidth,
        u = a.scrollHeight > a.clientHeight
      if ((r && s) || (i && u)) {
        if (i && xe && W) {
          e: for (var d = t.target, h = l.view; d != a; d = d.parentNode)
            for (var b = 0; b < h.length; b++)
              if (h[b].node == d) {
                e.display.currentWheelTarget = d
                break e
              }
        }
        if (r && !we && !ce && o != null) {
          i && u && pn(e, Math.max(0, a.scrollTop + i * o)),
            Cr(e, Math.max(0, a.scrollLeft + r * o)),
            (!i || (i && u)) && ft(t),
            (l.wheelStartX = null)
          return
        }
        if (i && o != null) {
          var m = i * o,
            C = e.doc.scrollTop,
            N = C + l.wrapper.clientHeight
          m < 0 ? (C = Math.max(0, C + m - 50)) : (N = Math.min(e.doc.height, N + m + 50)), Ui(e, { top: C, bottom: N })
        }
        ti < 20 &&
          t.deltaMode !== 0 &&
          (l.wheelStartX == null
            ? ((l.wheelStartX = a.scrollLeft),
              (l.wheelStartY = a.scrollTop),
              (l.wheelDX = r),
              (l.wheelDY = i),
              setTimeout(function () {
                if (l.wheelStartX != null) {
                  var O = a.scrollLeft - l.wheelStartX,
                    z = a.scrollTop - l.wheelStartY,
                    F = (z && l.wheelDY && z / l.wheelDY) || (O && l.wheelDX && O / l.wheelDX)
                  ;(l.wheelStartX = l.wheelStartY = null), F && ((rr = (rr * ti + F) / (ti + 1)), ++ti)
                }
              }, 200))
            : ((l.wheelDX += r), (l.wheelDY += i)))
      }
    }
    var At = function (e, t) {
      ;(this.ranges = e), (this.primIndex = t)
    }
    ;(At.prototype.primary = function () {
      return this.ranges[this.primIndex]
    }),
      (At.prototype.equals = function (e) {
        if (e == this) return !0
        if (e.primIndex != this.primIndex || e.ranges.length != this.ranges.length) return !1
        for (var t = 0; t < this.ranges.length; t++) {
          var n = this.ranges[t],
            r = e.ranges[t]
          if (!oe(n.anchor, r.anchor) || !oe(n.head, r.head)) return !1
        }
        return !0
      }),
      (At.prototype.deepCopy = function () {
        for (var e = [], t = 0; t < this.ranges.length; t++)
          e[t] = new De(ke(this.ranges[t].anchor), ke(this.ranges[t].head))
        return new At(e, this.primIndex)
      }),
      (At.prototype.somethingSelected = function () {
        for (var e = 0; e < this.ranges.length; e++) if (!this.ranges[e].empty()) return !0
        return !1
      }),
      (At.prototype.contains = function (e, t) {
        t || (t = e)
        for (var n = 0; n < this.ranges.length; n++) {
          var r = this.ranges[n]
          if (S(t, r.from()) >= 0 && S(e, r.to()) <= 0) return n
        }
        return -1
      })
    var De = function (e, t) {
      ;(this.anchor = e), (this.head = t)
    }
    ;(De.prototype.from = function () {
      return et(this.anchor, this.head)
    }),
      (De.prototype.to = function () {
        return Me(this.anchor, this.head)
      }),
      (De.prototype.empty = function () {
        return this.head.line == this.anchor.line && this.head.ch == this.anchor.ch
      })
    function Bt(e, t, n) {
      var r = e && e.options.selectionsMayTouch,
        i = t[n]
      t.sort(function (b, m) {
        return S(b.from(), m.from())
      }),
        (n = se(t, i))
      for (var o = 1; o < t.length; o++) {
        var l = t[o],
          a = t[o - 1],
          s = S(a.to(), l.from())
        if (r && !l.empty() ? s > 0 : s >= 0) {
          var u = et(a.from(), l.from()),
            d = Me(a.to(), l.to()),
            h = a.empty() ? l.from() == l.head : a.from() == a.head
          o <= n && --n, t.splice(--o, 2, new De(h ? d : u, h ? u : d))
        }
      }
      return new At(t, n)
    }
    function dr(e, t) {
      return new At([new De(e, t || e)], 0)
    }
    function hr(e) {
      return e.text
        ? g(e.from.line + e.text.length - 1, de(e.text).length + (e.text.length == 1 ? e.from.ch : 0))
        : e.to
    }
    function cl(e, t) {
      if (S(e, t.from) < 0) return e
      if (S(e, t.to) <= 0) return hr(t)
      var n = e.line + t.text.length - (t.to.line - t.from.line) - 1,
        r = e.ch
      return e.line == t.to.line && (r += hr(t).ch - t.to.ch), g(n, r)
    }
    function Xi(e, t) {
      for (var n = [], r = 0; r < e.sel.ranges.length; r++) {
        var i = e.sel.ranges[r]
        n.push(new De(cl(i.anchor, t), cl(i.head, t)))
      }
      return Bt(e.cm, n, e.sel.primIndex)
    }
    function dl(e, t, n) {
      return e.line == t.line ? g(n.line, e.ch - t.ch + n.ch) : g(n.line + (e.line - t.line), e.ch)
    }
    function ws(e, t, n) {
      for (var r = [], i = g(e.first, 0), o = i, l = 0; l < t.length; l++) {
        var a = t[l],
          s = dl(a.from, i, o),
          u = dl(hr(a), i, o)
        if (((i = a.to), (o = u), n == 'around')) {
          var d = e.sel.ranges[l],
            h = S(d.head, d.anchor) < 0
          r[l] = new De(h ? u : s, h ? s : u)
        } else r[l] = new De(s, s)
      }
      return new At(r, e.sel.primIndex)
    }
    function Yi(e) {
      ;(e.doc.mode = Jt(e.options, e.doc.modeOption)), bn(e)
    }
    function bn(e) {
      e.doc.iter(function (t) {
        t.stateAfter && (t.stateAfter = null), t.styles && (t.styles = null)
      }),
        (e.doc.modeFrontier = e.doc.highlightFrontier = e.doc.first),
        yn(e, 100),
        e.state.modeGen++,
        e.curOp && bt(e)
    }
    function hl(e, t) {
      return t.from.ch == 0 && t.to.ch == 0 && de(t.text) == '' && (!e.cm || e.cm.options.wholeLineUpdateBefore)
    }
    function Zi(e, t, n, r) {
      function i(F) {
        return n ? n[F] : null
      }
      function o(F, P, H) {
        Da(F, P, H, r), rt(F, 'change', F, t)
      }
      function l(F, P) {
        for (var H = [], Z = F; Z < P; ++Z) H.push(new Ir(u[Z], i(Z), r))
        return H
      }
      var a = t.from,
        s = t.to,
        u = t.text,
        d = K(e, a.line),
        h = K(e, s.line),
        b = de(u),
        m = i(u.length - 1),
        C = s.line - a.line
      if (t.full) e.insert(0, l(0, u.length)), e.remove(u.length, e.size - u.length)
      else if (hl(e, t)) {
        var N = l(0, u.length - 1)
        o(h, h.text, m), C && e.remove(a.line, C), N.length && e.insert(a.line, N)
      } else if (d == h)
        if (u.length == 1) o(d, d.text.slice(0, a.ch) + b + d.text.slice(s.ch), m)
        else {
          var O = l(1, u.length - 1)
          O.push(new Ir(b + d.text.slice(s.ch), m, r)),
            o(d, d.text.slice(0, a.ch) + u[0], i(0)),
            e.insert(a.line + 1, O)
        }
      else if (u.length == 1) o(d, d.text.slice(0, a.ch) + u[0] + h.text.slice(s.ch), i(0)), e.remove(a.line + 1, C)
      else {
        o(d, d.text.slice(0, a.ch) + u[0], i(0)), o(h, b + h.text.slice(s.ch), m)
        var z = l(1, u.length - 1)
        C > 1 && e.remove(a.line + 1, C - 1), e.insert(a.line + 1, z)
      }
      rt(e, 'change', e, t)
    }
    function pr(e, t, n) {
      function r(i, o, l) {
        if (i.linked)
          for (var a = 0; a < i.linked.length; ++a) {
            var s = i.linked[a]
            if (s.doc != o) {
              var u = l && s.sharedHist
              ;(n && !u) || (t(s.doc, u), r(s.doc, i, u))
            }
          }
      }
      r(e, null, !0)
    }
    function pl(e, t) {
      if (t.cm) throw new Error('This document is already in use.')
      ;(e.doc = t),
        (t.cm = e),
        Ii(e),
        Yi(e),
        vl(e),
        (e.options.direction = t.direction),
        e.options.lineWrapping || Ci(e),
        (e.options.mode = t.modeOption),
        bt(e)
    }
    function vl(e) {
      ;(e.doc.direction == 'rtl' ? D : me)(e.display.lineDiv, 'CodeMirror-rtl')
    }
    function ks(e) {
      Tt(e, function () {
        vl(e), bt(e)
      })
    }
    function ri(e) {
      ;(this.done = []),
        (this.undone = []),
        (this.undoDepth = e ? e.undoDepth : 1 / 0),
        (this.lastModTime = this.lastSelTime = 0),
        (this.lastOp = this.lastSelOp = null),
        (this.lastOrigin = this.lastSelOrigin = null),
        (this.generation = this.maxGeneration = e ? e.maxGeneration : 1)
    }
    function Ji(e, t) {
      var n = { from: ke(t.from), to: hr(t), text: Vt(e, t.from, t.to) }
      return (
        ml(e, n, t.from.line, t.to.line + 1),
        pr(
          e,
          function (r) {
            return ml(r, n, t.from.line, t.to.line + 1)
          },
          !0,
        ),
        n
      )
    }
    function gl(e) {
      for (; e.length; ) {
        var t = de(e)
        if (t.ranges) e.pop()
        else break
      }
    }
    function Ss(e, t) {
      if (t) return gl(e.done), de(e.done)
      if (e.done.length && !de(e.done).ranges) return de(e.done)
      if (e.done.length > 1 && !e.done[e.done.length - 2].ranges) return e.done.pop(), de(e.done)
    }
    function yl(e, t, n, r) {
      var i = e.history
      i.undone.length = 0
      var o = +new Date(),
        l,
        a
      if (
        (i.lastOp == r ||
          (i.lastOrigin == t.origin &&
            t.origin &&
            ((t.origin.charAt(0) == '+' && i.lastModTime > o - (e.cm ? e.cm.options.historyEventDelay : 500)) ||
              t.origin.charAt(0) == '*'))) &&
        (l = Ss(i, i.lastOp == r))
      )
        (a = de(l.changes)), S(t.from, t.to) == 0 && S(t.from, a.to) == 0 ? (a.to = hr(t)) : l.changes.push(Ji(e, t))
      else {
        var s = de(i.done)
        for (
          (!s || !s.ranges) && ni(e.sel, i.done), l = { changes: [Ji(e, t)], generation: i.generation }, i.done.push(l);
          i.done.length > i.undoDepth;

        )
          i.done.shift(), i.done[0].ranges || i.done.shift()
      }
      i.done.push(n),
        (i.generation = ++i.maxGeneration),
        (i.lastModTime = i.lastSelTime = o),
        (i.lastOp = i.lastSelOp = r),
        (i.lastOrigin = i.lastSelOrigin = t.origin),
        a || _e(e, 'historyAdded')
    }
    function Cs(e, t, n, r) {
      var i = t.charAt(0)
      return (
        i == '*' ||
        (i == '+' &&
          n.ranges.length == r.ranges.length &&
          n.somethingSelected() == r.somethingSelected() &&
          new Date() - e.history.lastSelTime <= (e.cm ? e.cm.options.historyEventDelay : 500))
      )
    }
    function Ts(e, t, n, r) {
      var i = e.history,
        o = r && r.origin
      n == i.lastSelOp ||
      (o && i.lastSelOrigin == o && ((i.lastModTime == i.lastSelTime && i.lastOrigin == o) || Cs(e, o, de(i.done), t)))
        ? (i.done[i.done.length - 1] = t)
        : ni(t, i.done),
        (i.lastSelTime = +new Date()),
        (i.lastSelOrigin = o),
        (i.lastSelOp = n),
        r && r.clearRedo !== !1 && gl(i.undone)
    }
    function ni(e, t) {
      var n = de(t)
      ;(n && n.ranges && n.equals(e)) || t.push(e)
    }
    function ml(e, t, n, r) {
      var i = t['spans_' + e.id],
        o = 0
      e.iter(Math.max(e.first, n), Math.min(e.first + e.size, r), function (l) {
        l.markedSpans && ((i || (i = t['spans_' + e.id] = {}))[o] = l.markedSpans), ++o
      })
    }
    function Ls(e) {
      if (!e) return null
      for (var t, n = 0; n < e.length; ++n) e[n].marker.explicitlyCleared ? t || (t = e.slice(0, n)) : t && t.push(e[n])
      return t ? (t.length ? t : null) : e
    }
    function Ms(e, t) {
      var n = t['spans_' + e.id]
      if (!n) return null
      for (var r = [], i = 0; i < t.text.length; ++i) r.push(Ls(n[i]))
      return r
    }
    function bl(e, t) {
      var n = Ms(e, t),
        r = xi(e, t)
      if (!n) return r
      if (!r) return n
      for (var i = 0; i < n.length; ++i) {
        var o = n[i],
          l = r[i]
        if (o && l)
          e: for (var a = 0; a < l.length; ++a) {
            for (var s = l[a], u = 0; u < o.length; ++u) if (o[u].marker == s.marker) continue e
            o.push(s)
          }
        else l && (n[i] = l)
      }
      return n
    }
    function Ur(e, t, n) {
      for (var r = [], i = 0; i < e.length; ++i) {
        var o = e[i]
        if (o.ranges) {
          r.push(n ? At.prototype.deepCopy.call(o) : o)
          continue
        }
        var l = o.changes,
          a = []
        r.push({ changes: a })
        for (var s = 0; s < l.length; ++s) {
          var u = l[s],
            d = void 0
          if ((a.push({ from: u.from, to: u.to, text: u.text }), t))
            for (var h in u)
              (d = h.match(/^spans_(\d+)$/)) && se(t, Number(d[1])) > -1 && ((de(a)[h] = u[h]), delete u[h])
        }
      }
      return r
    }
    function Qi(e, t, n, r) {
      if (r) {
        var i = e.anchor
        if (n) {
          var o = S(t, i) < 0
          o != S(n, i) < 0 ? ((i = t), (t = n)) : o != S(t, n) < 0 && (t = n)
        }
        return new De(i, t)
      } else return new De(n || t, t)
    }
    function ii(e, t, n, r, i) {
      i == null && (i = e.cm && (e.cm.display.shift || e.extend)), ct(e, new At([Qi(e.sel.primary(), t, n, i)], 0), r)
    }
    function xl(e, t, n) {
      for (var r = [], i = e.cm && (e.cm.display.shift || e.extend), o = 0; o < e.sel.ranges.length; o++)
        r[o] = Qi(e.sel.ranges[o], t[o], null, i)
      var l = Bt(e.cm, r, e.sel.primIndex)
      ct(e, l, n)
    }
    function Vi(e, t, n, r) {
      var i = e.sel.ranges.slice(0)
      ;(i[t] = n), ct(e, Bt(e.cm, i, e.sel.primIndex), r)
    }
    function wl(e, t, n, r) {
      ct(e, dr(t, n), r)
    }
    function Ns(e, t, n) {
      var r = {
        ranges: t.ranges,
        update: function (i) {
          this.ranges = []
          for (var o = 0; o < i.length; o++) this.ranges[o] = new De(le(e, i[o].anchor), le(e, i[o].head))
        },
        origin: n && n.origin,
      }
      return (
        _e(e, 'beforeSelectionChange', e, r),
        e.cm && _e(e.cm, 'beforeSelectionChange', e.cm, r),
        r.ranges != t.ranges ? Bt(e.cm, r.ranges, r.ranges.length - 1) : t
      )
    }
    function kl(e, t, n) {
      var r = e.history.done,
        i = de(r)
      i && i.ranges ? ((r[r.length - 1] = t), oi(e, t, n)) : ct(e, t, n)
    }
    function ct(e, t, n) {
      oi(e, t, n), Ts(e, e.sel, e.cm ? e.cm.curOp.id : NaN, n)
    }
    function oi(e, t, n) {
      ;(ht(e, 'beforeSelectionChange') || (e.cm && ht(e.cm, 'beforeSelectionChange'))) && (t = Ns(e, t, n))
      var r = (n && n.bias) || (S(t.primary().head, e.sel.primary().head) < 0 ? -1 : 1)
      Sl(e, Tl(e, t, r, !0)), !(n && n.scroll === !1) && e.cm && e.cm.getOption('readOnly') != 'nocursor' && Rr(e.cm)
    }
    function Sl(e, t) {
      t.equals(e.sel) ||
        ((e.sel = t),
        e.cm && ((e.cm.curOp.updateInput = 1), (e.cm.curOp.selectionChanged = !0), En(e.cm)),
        rt(e, 'cursorActivity', e))
    }
    function Cl(e) {
      Sl(e, Tl(e, e.sel, null, !1))
    }
    function Tl(e, t, n, r) {
      for (var i, o = 0; o < t.ranges.length; o++) {
        var l = t.ranges[o],
          a = t.ranges.length == e.sel.ranges.length && e.sel.ranges[o],
          s = li(e, l.anchor, a && a.anchor, n, r),
          u = l.head == l.anchor ? s : li(e, l.head, a && a.head, n, r)
        ;(i || s != l.anchor || u != l.head) && (i || (i = t.ranges.slice(0, o)), (i[o] = new De(s, u)))
      }
      return i ? Bt(e.cm, i, t.primIndex) : t
    }
    function Gr(e, t, n, r, i) {
      var o = K(e, t.line)
      if (o.markedSpans)
        for (var l = 0; l < o.markedSpans.length; ++l) {
          var a = o.markedSpans[l],
            s = a.marker,
            u = 'selectLeft' in s ? !s.selectLeft : s.inclusiveLeft,
            d = 'selectRight' in s ? !s.selectRight : s.inclusiveRight
          if (
            (a.from == null || (u ? a.from <= t.ch : a.from < t.ch)) &&
            (a.to == null || (d ? a.to >= t.ch : a.to > t.ch))
          ) {
            if (i && (_e(s, 'beforeCursorEnter'), s.explicitlyCleared))
              if (o.markedSpans) {
                --l
                continue
              } else break
            if (!s.atomic) continue
            if (n) {
              var h = s.find(r < 0 ? 1 : -1),
                b = void 0
              if (
                ((r < 0 ? d : u) && (h = Ll(e, h, -r, h && h.line == t.line ? o : null)),
                h && h.line == t.line && (b = S(h, n)) && (r < 0 ? b < 0 : b > 0))
              )
                return Gr(e, h, t, r, i)
            }
            var m = s.find(r < 0 ? -1 : 1)
            return (r < 0 ? u : d) && (m = Ll(e, m, r, m.line == t.line ? o : null)), m ? Gr(e, m, t, r, i) : null
          }
        }
      return t
    }
    function li(e, t, n, r, i) {
      var o = r || 1,
        l = Gr(e, t, n, o, i) || (!i && Gr(e, t, n, o, !0)) || Gr(e, t, n, -o, i) || (!i && Gr(e, t, n, -o, !0))
      return l || ((e.cantEdit = !0), g(e.first, 0))
    }
    function Ll(e, t, n, r) {
      return n < 0 && t.ch == 0
        ? t.line > e.first
          ? le(e, g(t.line - 1))
          : null
        : n > 0 && t.ch == (r || K(e, t.line)).text.length
        ? t.line < e.first + e.size - 1
          ? g(t.line + 1, 0)
          : null
        : new g(t.line, t.ch + n)
    }
    function Ml(e) {
      e.setSelection(g(e.firstLine(), 0), g(e.lastLine()), Ie)
    }
    function Nl(e, t, n) {
      var r = {
        canceled: !1,
        from: t.from,
        to: t.to,
        text: t.text,
        origin: t.origin,
        cancel: function () {
          return (r.canceled = !0)
        },
      }
      return (
        n &&
          (r.update = function (i, o, l, a) {
            i && (r.from = le(e, i)), o && (r.to = le(e, o)), l && (r.text = l), a !== void 0 && (r.origin = a)
          }),
        _e(e, 'beforeChange', e, r),
        e.cm && _e(e.cm, 'beforeChange', e.cm, r),
        r.canceled
          ? (e.cm && (e.cm.curOp.updateInput = 2), null)
          : { from: r.from, to: r.to, text: r.text, origin: r.origin }
      )
    }
    function qr(e, t, n) {
      if (e.cm) {
        if (!e.cm.curOp) return nt(e.cm, qr)(e, t, n)
        if (e.cm.state.suppressEdits) return
      }
      if (!((ht(e, 'beforeChange') || (e.cm && ht(e.cm, 'beforeChange'))) && ((t = Nl(e, t, !0)), !t))) {
        var r = bo && !n && Ta(e, t.from, t.to)
        if (r)
          for (var i = r.length - 1; i >= 0; --i)
            Dl(e, { from: r[i].from, to: r[i].to, text: i ? [''] : t.text, origin: t.origin })
        else Dl(e, t)
      }
    }
    function Dl(e, t) {
      if (!(t.text.length == 1 && t.text[0] == '' && S(t.from, t.to) == 0)) {
        var n = Xi(e, t)
        yl(e, t, n, e.cm ? e.cm.curOp.id : NaN), xn(e, t, n, xi(e, t))
        var r = []
        pr(e, function (i, o) {
          !o && se(r, i.history) == -1 && (Pl(i.history, t), r.push(i.history)), xn(i, t, null, xi(i, t))
        })
      }
    }
    function ai(e, t, n) {
      var r = e.cm && e.cm.state.suppressEdits
      if (!(r && !n)) {
        for (
          var i = e.history,
            o,
            l = e.sel,
            a = t == 'undo' ? i.done : i.undone,
            s = t == 'undo' ? i.undone : i.done,
            u = 0;
          u < a.length && ((o = a[u]), !(n ? o.ranges && !o.equals(e.sel) : !o.ranges));
          u++
        );
        if (u != a.length) {
          for (i.lastOrigin = i.lastSelOrigin = null; ; )
            if (((o = a.pop()), o.ranges)) {
              if ((ni(o, s), n && !o.equals(e.sel))) {
                ct(e, o, { clearRedo: !1 })
                return
              }
              l = o
            } else if (r) {
              a.push(o)
              return
            } else break
          var d = []
          ni(l, s), s.push({ changes: d, generation: i.generation }), (i.generation = o.generation || ++i.maxGeneration)
          for (
            var h = ht(e, 'beforeChange') || (e.cm && ht(e.cm, 'beforeChange')),
              b = function (N) {
                var O = o.changes[N]
                if (((O.origin = t), h && !Nl(e, O, !1))) return (a.length = 0), {}
                d.push(Ji(e, O))
                var z = N ? Xi(e, O) : de(a)
                xn(e, O, z, bl(e, O)), !N && e.cm && e.cm.scrollIntoView({ from: O.from, to: hr(O) })
                var F = []
                pr(e, function (P, H) {
                  !H && se(F, P.history) == -1 && (Pl(P.history, O), F.push(P.history)), xn(P, O, null, bl(P, O))
                })
              },
              m = o.changes.length - 1;
            m >= 0;
            --m
          ) {
            var C = b(m)
            if (C) return C.v
          }
        }
      }
    }
    function Al(e, t) {
      if (
        t != 0 &&
        ((e.first += t),
        (e.sel = new At(
          st(e.sel.ranges, function (i) {
            return new De(g(i.anchor.line + t, i.anchor.ch), g(i.head.line + t, i.head.ch))
          }),
          e.sel.primIndex,
        )),
        e.cm)
      ) {
        bt(e.cm, e.first, e.first - t, t)
        for (var n = e.cm.display, r = n.viewFrom; r < n.viewTo; r++) fr(e.cm, r, 'gutter')
      }
    }
    function xn(e, t, n, r) {
      if (e.cm && !e.cm.curOp) return nt(e.cm, xn)(e, t, n, r)
      if (t.to.line < e.first) {
        Al(e, t.text.length - 1 - (t.to.line - t.from.line))
        return
      }
      if (!(t.from.line > e.lastLine())) {
        if (t.from.line < e.first) {
          var i = t.text.length - 1 - (e.first - t.from.line)
          Al(e, i), (t = { from: g(e.first, 0), to: g(t.to.line + i, t.to.ch), text: [de(t.text)], origin: t.origin })
        }
        var o = e.lastLine()
        t.to.line > o && (t = { from: t.from, to: g(o, K(e, o).text.length), text: [t.text[0]], origin: t.origin }),
          (t.removed = Vt(e, t.from, t.to)),
          n || (n = Xi(e, t)),
          e.cm ? Ds(e.cm, t, r) : Zi(e, t, r),
          oi(e, n, Ie),
          e.cantEdit && li(e, g(e.firstLine(), 0)) && (e.cantEdit = !1)
      }
    }
    function Ds(e, t, n) {
      var r = e.doc,
        i = e.display,
        o = t.from,
        l = t.to,
        a = !1,
        s = o.line
      e.options.lineWrapping ||
        ((s = Ne(_t(K(r, o.line)))),
        r.iter(s, l.line + 1, function (m) {
          if (m == i.maxLine) return (a = !0), !0
        })),
        r.sel.contains(t.from, t.to) > -1 && En(e),
        Zi(r, t, n, Zo(e)),
        e.options.lineWrapping ||
          (r.iter(s, o.line + t.text.length, function (m) {
            var C = Gn(m)
            C > i.maxLineLength && ((i.maxLine = m), (i.maxLineLength = C), (i.maxLineChanged = !0), (a = !1))
          }),
          a && (e.curOp.updateMaxLine = !0)),
        ma(r, o.line),
        yn(e, 400)
      var u = t.text.length - (l.line - o.line) - 1
      t.full
        ? bt(e)
        : o.line == l.line && t.text.length == 1 && !hl(e.doc, t)
        ? fr(e, o.line, 'text')
        : bt(e, o.line, l.line + 1, u)
      var d = ht(e, 'changes'),
        h = ht(e, 'change')
      if (h || d) {
        var b = { from: o, to: l, text: t.text, removed: t.removed, origin: t.origin }
        h && rt(e, 'change', e, b), d && (e.curOp.changeObjs || (e.curOp.changeObjs = [])).push(b)
      }
      e.display.selForContextMenu = null
    }
    function jr(e, t, n, r, i) {
      var o
      r || (r = n),
        S(r, n) < 0 && ((o = [r, n]), (n = o[0]), (r = o[1])),
        typeof t == 'string' && (t = e.splitLines(t)),
        qr(e, { from: n, to: r, text: t, origin: i })
    }
    function Ol(e, t, n, r) {
      n < e.line ? (e.line += r) : t < e.line && ((e.line = t), (e.ch = 0))
    }
    function zl(e, t, n, r) {
      for (var i = 0; i < e.length; ++i) {
        var o = e[i],
          l = !0
        if (o.ranges) {
          o.copied || ((o = e[i] = o.deepCopy()), (o.copied = !0))
          for (var a = 0; a < o.ranges.length; a++) Ol(o.ranges[a].anchor, t, n, r), Ol(o.ranges[a].head, t, n, r)
          continue
        }
        for (var s = 0; s < o.changes.length; ++s) {
          var u = o.changes[s]
          if (n < u.from.line) (u.from = g(u.from.line + r, u.from.ch)), (u.to = g(u.to.line + r, u.to.ch))
          else if (t <= u.to.line) {
            l = !1
            break
          }
        }
        l || (e.splice(0, i + 1), (i = 0))
      }
    }
    function Pl(e, t) {
      var n = t.from.line,
        r = t.to.line,
        i = t.text.length - (r - n) - 1
      zl(e.done, n, r, i), zl(e.undone, n, r, i)
    }
    function wn(e, t, n, r) {
      var i = t,
        o = t
      return (
        typeof t == 'number' ? (o = K(e, Dt(e, t))) : (i = Ne(t)),
        i == null ? null : (r(o, i) && e.cm && fr(e.cm, i, n), o)
      )
    }
    function kn(e) {
      ;(this.lines = e), (this.parent = null)
      for (var t = 0, n = 0; n < e.length; ++n) (e[n].parent = this), (t += e[n].height)
      this.height = t
    }
    kn.prototype = {
      chunkSize: function () {
        return this.lines.length
      },
      removeInner: function (e, t) {
        for (var n = e, r = e + t; n < r; ++n) {
          var i = this.lines[n]
          ;(this.height -= i.height), Aa(i), rt(i, 'delete')
        }
        this.lines.splice(e, t)
      },
      collapse: function (e) {
        e.push.apply(e, this.lines)
      },
      insertInner: function (e, t, n) {
        ;(this.height += n), (this.lines = this.lines.slice(0, e).concat(t).concat(this.lines.slice(e)))
        for (var r = 0; r < t.length; ++r) t[r].parent = this
      },
      iterN: function (e, t, n) {
        for (var r = e + t; e < r; ++e) if (n(this.lines[e])) return !0
      },
    }
    function Sn(e) {
      this.children = e
      for (var t = 0, n = 0, r = 0; r < e.length; ++r) {
        var i = e[r]
        ;(t += i.chunkSize()), (n += i.height), (i.parent = this)
      }
      ;(this.size = t), (this.height = n), (this.parent = null)
    }
    Sn.prototype = {
      chunkSize: function () {
        return this.size
      },
      removeInner: function (e, t) {
        this.size -= t
        for (var n = 0; n < this.children.length; ++n) {
          var r = this.children[n],
            i = r.chunkSize()
          if (e < i) {
            var o = Math.min(t, i - e),
              l = r.height
            if (
              (r.removeInner(e, o),
              (this.height -= l - r.height),
              i == o && (this.children.splice(n--, 1), (r.parent = null)),
              (t -= o) == 0)
            )
              break
            e = 0
          } else e -= i
        }
        if (this.size - t < 25 && (this.children.length > 1 || !(this.children[0] instanceof kn))) {
          var a = []
          this.collapse(a), (this.children = [new kn(a)]), (this.children[0].parent = this)
        }
      },
      collapse: function (e) {
        for (var t = 0; t < this.children.length; ++t) this.children[t].collapse(e)
      },
      insertInner: function (e, t, n) {
        ;(this.size += t.length), (this.height += n)
        for (var r = 0; r < this.children.length; ++r) {
          var i = this.children[r],
            o = i.chunkSize()
          if (e <= o) {
            if ((i.insertInner(e, t, n), i.lines && i.lines.length > 50)) {
              for (var l = (i.lines.length % 25) + 25, a = l; a < i.lines.length; ) {
                var s = new kn(i.lines.slice(a, (a += 25)))
                ;(i.height -= s.height), this.children.splice(++r, 0, s), (s.parent = this)
              }
              ;(i.lines = i.lines.slice(0, l)), this.maybeSpill()
            }
            break
          }
          e -= o
        }
      },
      maybeSpill: function () {
        if (!(this.children.length <= 10)) {
          var e = this
          do {
            var t = e.children.splice(e.children.length - 5, 5),
              n = new Sn(t)
            if (e.parent) {
              ;(e.size -= n.size), (e.height -= n.height)
              var i = se(e.parent.children, e)
              e.parent.children.splice(i + 1, 0, n)
            } else {
              var r = new Sn(e.children)
              ;(r.parent = e), (e.children = [r, n]), (e = r)
            }
            n.parent = e.parent
          } while (e.children.length > 10)
          e.parent.maybeSpill()
        }
      },
      iterN: function (e, t, n) {
        for (var r = 0; r < this.children.length; ++r) {
          var i = this.children[r],
            o = i.chunkSize()
          if (e < o) {
            var l = Math.min(t, o - e)
            if (i.iterN(e, l, n)) return !0
            if ((t -= l) == 0) break
            e = 0
          } else e -= o
        }
      },
    }
    var Cn = function (e, t, n) {
      if (n) for (var r in n) n.hasOwnProperty(r) && (this[r] = n[r])
      ;(this.doc = e), (this.node = t)
    }
    ;(Cn.prototype.clear = function () {
      var e = this.doc.cm,
        t = this.line.widgets,
        n = this.line,
        r = Ne(n)
      if (!(r == null || !t)) {
        for (var i = 0; i < t.length; ++i) t[i] == this && t.splice(i--, 1)
        t.length || (n.widgets = null)
        var o = fn(this)
        Ft(n, Math.max(0, n.height - o)),
          e &&
            (Tt(e, function () {
              El(e, n, -o), fr(e, r, 'widget')
            }),
            rt(e, 'lineWidgetCleared', e, this, r))
      }
    }),
      (Cn.prototype.changed = function () {
        var e = this,
          t = this.height,
          n = this.doc.cm,
          r = this.line
        this.height = null
        var i = fn(this) - t
        i &&
          (ur(this.doc, r) || Ft(r, r.height + i),
          n &&
            Tt(n, function () {
              ;(n.curOp.forceUpdate = !0), El(n, r, i), rt(n, 'lineWidgetChanged', n, e, Ne(r))
            }))
      }),
      pt(Cn)
    function El(e, t, n) {
      er(t) < ((e.curOp && e.curOp.scrollTop) || e.doc.scrollTop) && Ri(e, n)
    }
    function As(e, t, n, r) {
      var i = new Cn(e, n, r),
        o = e.cm
      return (
        o && i.noHScroll && (o.display.alignWidgets = !0),
        wn(e, t, 'widget', function (l) {
          var a = l.widgets || (l.widgets = [])
          if (
            (i.insertAt == null ? a.push(i) : a.splice(Math.min(a.length, Math.max(0, i.insertAt)), 0, i),
            (i.line = l),
            o && !ur(e, l))
          ) {
            var s = er(l) < e.scrollTop
            Ft(l, l.height + fn(i)), s && Ri(o, i.height), (o.curOp.forceUpdate = !0)
          }
          return !0
        }),
        o && rt(o, 'lineWidgetAdded', o, i, typeof t == 'number' ? t : Ne(t)),
        i
      )
    }
    var Il = 0,
      vr = function (e, t) {
        ;(this.lines = []), (this.type = t), (this.doc = e), (this.id = ++Il)
      }
    ;(vr.prototype.clear = function () {
      if (!this.explicitlyCleared) {
        var e = this.doc.cm,
          t = e && !e.curOp
        if ((t && Lr(e), ht(this, 'clear'))) {
          var n = this.find()
          n && rt(this, 'clear', n.from, n.to)
        }
        for (var r = null, i = null, o = 0; o < this.lines.length; ++o) {
          var l = this.lines[o],
            a = an(l.markedSpans, this)
          e && !this.collapsed
            ? fr(e, Ne(l), 'text')
            : e && (a.to != null && (i = Ne(l)), a.from != null && (r = Ne(l))),
            (l.markedSpans = wa(l.markedSpans, a)),
            a.from == null && this.collapsed && !ur(this.doc, l) && e && Ft(l, _r(e.display))
        }
        if (e && this.collapsed && !e.options.lineWrapping)
          for (var s = 0; s < this.lines.length; ++s) {
            var u = _t(this.lines[s]),
              d = Gn(u)
            d > e.display.maxLineLength &&
              ((e.display.maxLine = u), (e.display.maxLineLength = d), (e.display.maxLineChanged = !0))
          }
        r != null && e && this.collapsed && bt(e, r, i + 1),
          (this.lines.length = 0),
          (this.explicitlyCleared = !0),
          this.atomic && this.doc.cantEdit && ((this.doc.cantEdit = !1), e && Cl(e.doc)),
          e && rt(e, 'markerCleared', e, this, r, i),
          t && Mr(e),
          this.parent && this.parent.clear()
      }
    }),
      (vr.prototype.find = function (e, t) {
        e == null && this.type == 'bookmark' && (e = 1)
        for (var n, r, i = 0; i < this.lines.length; ++i) {
          var o = this.lines[i],
            l = an(o.markedSpans, this)
          if (l.from != null && ((n = g(t ? o : Ne(o), l.from)), e == -1)) return n
          if (l.to != null && ((r = g(t ? o : Ne(o), l.to)), e == 1)) return r
        }
        return n && { from: n, to: r }
      }),
      (vr.prototype.changed = function () {
        var e = this,
          t = this.find(-1, !0),
          n = this,
          r = this.doc.cm
        !t ||
          !r ||
          Tt(r, function () {
            var i = t.line,
              o = Ne(t.line),
              l = Ni(r, o)
            if (
              (l && (Ro(l), (r.curOp.selectionChanged = r.curOp.forceUpdate = !0)),
              (r.curOp.updateMaxLine = !0),
              !ur(n.doc, i) && n.height != null)
            ) {
              var a = n.height
              n.height = null
              var s = fn(n) - a
              s && Ft(i, i.height + s)
            }
            rt(r, 'markerChanged', r, e)
          })
      }),
      (vr.prototype.attachLine = function (e) {
        if (!this.lines.length && this.doc.cm) {
          var t = this.doc.cm.curOp
          ;(!t.maybeHiddenMarkers || se(t.maybeHiddenMarkers, this) == -1) &&
            (t.maybeUnhiddenMarkers || (t.maybeUnhiddenMarkers = [])).push(this)
        }
        this.lines.push(e)
      }),
      (vr.prototype.detachLine = function (e) {
        if ((this.lines.splice(se(this.lines, e), 1), !this.lines.length && this.doc.cm)) {
          var t = this.doc.cm.curOp
          ;(t.maybeHiddenMarkers || (t.maybeHiddenMarkers = [])).push(this)
        }
      }),
      pt(vr)
    function Xr(e, t, n, r, i) {
      if (r && r.shared) return Os(e, t, n, r, i)
      if (e.cm && !e.cm.curOp) return nt(e.cm, Xr)(e, t, n, r, i)
      var o = new vr(e, i),
        l = S(t, n)
      if ((r && V(r, o, !1), l > 0 || (l == 0 && o.clearWhenEmpty !== !1))) return o
      if (
        (o.replacedWith &&
          ((o.collapsed = !0),
          (o.widgetNode = w('span', [o.replacedWith], 'CodeMirror-widget')),
          r.handleMouseEvents || o.widgetNode.setAttribute('cm-ignore-events', 'true'),
          r.insertLeft && (o.widgetNode.insertLeft = !0)),
        o.collapsed)
      ) {
        if (To(e, t.line, t, n, o) || (t.line != n.line && To(e, n.line, t, n, o)))
          throw new Error('Inserting collapsed marker partially overlapping an existing one')
        xa()
      }
      o.addToHistory && yl(e, { from: t, to: n, origin: 'markText' }, e.sel, NaN)
      var a = t.line,
        s = e.cm,
        u
      if (
        (e.iter(a, n.line + 1, function (h) {
          s && o.collapsed && !s.options.lineWrapping && _t(h) == s.display.maxLine && (u = !0),
            o.collapsed && a != t.line && Ft(h, 0),
            ka(h, new Bn(o, a == t.line ? t.ch : null, a == n.line ? n.ch : null), e.cm && e.cm.curOp),
            ++a
        }),
        o.collapsed &&
          e.iter(t.line, n.line + 1, function (h) {
            ur(e, h) && Ft(h, 0)
          }),
        o.clearOnEnter &&
          E(o, 'beforeCursorEnter', function () {
            return o.clear()
          }),
        o.readOnly && (ba(), (e.history.done.length || e.history.undone.length) && e.clearHistory()),
        o.collapsed && ((o.id = ++Il), (o.atomic = !0)),
        s)
      ) {
        if ((u && (s.curOp.updateMaxLine = !0), o.collapsed)) bt(s, t.line, n.line + 1)
        else if (o.className || o.startStyle || o.endStyle || o.css || o.attributes || o.title)
          for (var d = t.line; d <= n.line; d++) fr(s, d, 'text')
        o.atomic && Cl(s.doc), rt(s, 'markerAdded', s, o)
      }
      return o
    }
    var Tn = function (e, t) {
      ;(this.markers = e), (this.primary = t)
      for (var n = 0; n < e.length; ++n) e[n].parent = this
    }
    ;(Tn.prototype.clear = function () {
      if (!this.explicitlyCleared) {
        this.explicitlyCleared = !0
        for (var e = 0; e < this.markers.length; ++e) this.markers[e].clear()
        rt(this, 'clear')
      }
    }),
      (Tn.prototype.find = function (e, t) {
        return this.primary.find(e, t)
      }),
      pt(Tn)
    function Os(e, t, n, r, i) {
      ;(r = V(r)), (r.shared = !1)
      var o = [Xr(e, t, n, r, i)],
        l = o[0],
        a = r.widgetNode
      return (
        pr(e, function (s) {
          a && (r.widgetNode = a.cloneNode(!0)), o.push(Xr(s, le(s, t), le(s, n), r, i))
          for (var u = 0; u < s.linked.length; ++u) if (s.linked[u].isParent) return
          l = de(o)
        }),
        new Tn(o, l)
      )
    }
    function Fl(e) {
      return e.findMarks(g(e.first, 0), e.clipPos(g(e.lastLine())), function (t) {
        return t.parent
      })
    }
    function zs(e, t) {
      for (var n = 0; n < t.length; n++) {
        var r = t[n],
          i = r.find(),
          o = e.clipPos(i.from),
          l = e.clipPos(i.to)
        if (S(o, l)) {
          var a = Xr(e, o, l, r.primary, r.primary.type)
          r.markers.push(a), (a.parent = r)
        }
      }
    }
    function Ps(e) {
      for (
        var t = function (r) {
            var i = e[r],
              o = [i.primary.doc]
            pr(i.primary.doc, function (s) {
              return o.push(s)
            })
            for (var l = 0; l < i.markers.length; l++) {
              var a = i.markers[l]
              se(o, a.doc) == -1 && ((a.parent = null), i.markers.splice(l--, 1))
            }
          },
          n = 0;
        n < e.length;
        n++
      )
        t(n)
    }
    var Es = 0,
      xt = function (e, t, n, r, i) {
        if (!(this instanceof xt)) return new xt(e, t, n, r, i)
        n == null && (n = 0),
          Sn.call(this, [new kn([new Ir('', null)])]),
          (this.first = n),
          (this.scrollTop = this.scrollLeft = 0),
          (this.cantEdit = !1),
          (this.cleanGeneration = 1),
          (this.modeFrontier = this.highlightFrontier = n)
        var o = g(n, 0)
        ;(this.sel = dr(o)),
          (this.history = new ri(null)),
          (this.id = ++Es),
          (this.modeOption = t),
          (this.lineSep = r),
          (this.direction = i == 'rtl' ? 'rtl' : 'ltr'),
          (this.extend = !1),
          typeof e == 'string' && (e = this.splitLines(e)),
          Zi(this, { from: o, to: o, text: e }),
          ct(this, dr(o), Ie)
      }
    ;(xt.prototype = k(Sn.prototype, {
      constructor: xt,
      iter: function (e, t, n) {
        n ? this.iterN(e - this.first, t - e, n) : this.iterN(this.first, this.first + this.size, e)
      },
      insert: function (e, t) {
        for (var n = 0, r = 0; r < t.length; ++r) n += t[r].height
        this.insertInner(e - this.first, t, n)
      },
      remove: function (e, t) {
        this.removeInner(e - this.first, t)
      },
      getValue: function (e) {
        var t = Er(this, this.first, this.first + this.size)
        return e === !1 ? t : t.join(e || this.lineSeparator())
      },
      setValue: it(function (e) {
        var t = g(this.first, 0),
          n = this.first + this.size - 1
        qr(
          this,
          { from: t, to: g(n, K(this, n).text.length), text: this.splitLines(e), origin: 'setValue', full: !0 },
          !0,
        ),
          this.cm && hn(this.cm, 0, 0),
          ct(this, dr(t), Ie)
      }),
      replaceRange: function (e, t, n, r) {
        ;(t = le(this, t)), (n = n ? le(this, n) : t), jr(this, e, t, n, r)
      },
      getRange: function (e, t, n) {
        var r = Vt(this, le(this, e), le(this, t))
        return n === !1 ? r : n === '' ? r.join('') : r.join(n || this.lineSeparator())
      },
      getLine: function (e) {
        var t = this.getLineHandle(e)
        return t && t.text
      },
      getLineHandle: function (e) {
        if (f(this, e)) return K(this, e)
      },
      getLineNumber: function (e) {
        return Ne(e)
      },
      getLineHandleVisualStart: function (e) {
        return typeof e == 'number' && (e = K(this, e)), _t(e)
      },
      lineCount: function () {
        return this.size
      },
      firstLine: function () {
        return this.first
      },
      lastLine: function () {
        return this.first + this.size - 1
      },
      clipPos: function (e) {
        return le(this, e)
      },
      getCursor: function (e) {
        var t = this.sel.primary(),
          n
        return (
          e == null || e == 'head'
            ? (n = t.head)
            : e == 'anchor'
            ? (n = t.anchor)
            : e == 'end' || e == 'to' || e === !1
            ? (n = t.to())
            : (n = t.from()),
          n
        )
      },
      listSelections: function () {
        return this.sel.ranges
      },
      somethingSelected: function () {
        return this.sel.somethingSelected()
      },
      setCursor: it(function (e, t, n) {
        wl(this, le(this, typeof e == 'number' ? g(e, t || 0) : e), null, n)
      }),
      setSelection: it(function (e, t, n) {
        wl(this, le(this, e), le(this, t || e), n)
      }),
      extendSelection: it(function (e, t, n) {
        ii(this, le(this, e), t && le(this, t), n)
      }),
      extendSelections: it(function (e, t) {
        xl(this, fo(this, e), t)
      }),
      extendSelectionsBy: it(function (e, t) {
        var n = st(this.sel.ranges, e)
        xl(this, fo(this, n), t)
      }),
      setSelections: it(function (e, t, n) {
        if (e.length) {
          for (var r = [], i = 0; i < e.length; i++)
            r[i] = new De(le(this, e[i].anchor), le(this, e[i].head || e[i].anchor))
          t == null && (t = Math.min(e.length - 1, this.sel.primIndex)), ct(this, Bt(this.cm, r, t), n)
        }
      }),
      addSelection: it(function (e, t, n) {
        var r = this.sel.ranges.slice(0)
        r.push(new De(le(this, e), le(this, t || e))), ct(this, Bt(this.cm, r, r.length - 1), n)
      }),
      getSelection: function (e) {
        for (var t = this.sel.ranges, n, r = 0; r < t.length; r++) {
          var i = Vt(this, t[r].from(), t[r].to())
          n = n ? n.concat(i) : i
        }
        return e === !1 ? n : n.join(e || this.lineSeparator())
      },
      getSelections: function (e) {
        for (var t = [], n = this.sel.ranges, r = 0; r < n.length; r++) {
          var i = Vt(this, n[r].from(), n[r].to())
          e !== !1 && (i = i.join(e || this.lineSeparator())), (t[r] = i)
        }
        return t
      },
      replaceSelection: function (e, t, n) {
        for (var r = [], i = 0; i < this.sel.ranges.length; i++) r[i] = e
        this.replaceSelections(r, t, n || '+input')
      },
      replaceSelections: it(function (e, t, n) {
        for (var r = [], i = this.sel, o = 0; o < i.ranges.length; o++) {
          var l = i.ranges[o]
          r[o] = { from: l.from(), to: l.to(), text: this.splitLines(e[o]), origin: n }
        }
        for (var a = t && t != 'end' && ws(this, r, t), s = r.length - 1; s >= 0; s--) qr(this, r[s])
        a ? kl(this, a) : this.cm && Rr(this.cm)
      }),
      undo: it(function () {
        ai(this, 'undo')
      }),
      redo: it(function () {
        ai(this, 'redo')
      }),
      undoSelection: it(function () {
        ai(this, 'undo', !0)
      }),
      redoSelection: it(function () {
        ai(this, 'redo', !0)
      }),
      setExtending: function (e) {
        this.extend = e
      },
      getExtending: function () {
        return this.extend
      },
      historySize: function () {
        for (var e = this.history, t = 0, n = 0, r = 0; r < e.done.length; r++) e.done[r].ranges || ++t
        for (var i = 0; i < e.undone.length; i++) e.undone[i].ranges || ++n
        return { undo: t, redo: n }
      },
      clearHistory: function () {
        var e = this
        ;(this.history = new ri(this.history)),
          pr(
            this,
            function (t) {
              return (t.history = e.history)
            },
            !0,
          )
      },
      markClean: function () {
        this.cleanGeneration = this.changeGeneration(!0)
      },
      changeGeneration: function (e) {
        return (
          e && (this.history.lastOp = this.history.lastSelOp = this.history.lastOrigin = null), this.history.generation
        )
      },
      isClean: function (e) {
        return this.history.generation == (e || this.cleanGeneration)
      },
      getHistory: function () {
        return { done: Ur(this.history.done), undone: Ur(this.history.undone) }
      },
      setHistory: function (e) {
        var t = (this.history = new ri(this.history))
        ;(t.done = Ur(e.done.slice(0), null, !0)), (t.undone = Ur(e.undone.slice(0), null, !0))
      },
      setGutterMarker: it(function (e, t, n) {
        return wn(this, e, 'gutter', function (r) {
          var i = r.gutterMarkers || (r.gutterMarkers = {})
          return (i[t] = n), !n && R(i) && (r.gutterMarkers = null), !0
        })
      }),
      clearGutter: it(function (e) {
        var t = this
        this.iter(function (n) {
          n.gutterMarkers &&
            n.gutterMarkers[e] &&
            wn(t, n, 'gutter', function () {
              return (n.gutterMarkers[e] = null), R(n.gutterMarkers) && (n.gutterMarkers = null), !0
            })
        })
      }),
      lineInfo: function (e) {
        var t
        if (typeof e == 'number') {
          if (!f(this, e) || ((t = e), (e = K(this, e)), !e)) return null
        } else if (((t = Ne(e)), t == null)) return null
        return {
          line: t,
          handle: e,
          text: e.text,
          gutterMarkers: e.gutterMarkers,
          textClass: e.textClass,
          bgClass: e.bgClass,
          wrapClass: e.wrapClass,
          widgets: e.widgets,
        }
      },
      addLineClass: it(function (e, t, n) {
        return wn(this, e, t == 'gutter' ? 'gutter' : 'class', function (r) {
          var i =
            t == 'text' ? 'textClass' : t == 'background' ? 'bgClass' : t == 'gutter' ? 'gutterClass' : 'wrapClass'
          if (!r[i]) r[i] = n
          else {
            if (X(n).test(r[i])) return !1
            r[i] += ' ' + n
          }
          return !0
        })
      }),
      removeLineClass: it(function (e, t, n) {
        return wn(this, e, t == 'gutter' ? 'gutter' : 'class', function (r) {
          var i =
              t == 'text' ? 'textClass' : t == 'background' ? 'bgClass' : t == 'gutter' ? 'gutterClass' : 'wrapClass',
            o = r[i]
          if (o)
            if (n == null) r[i] = null
            else {
              var l = o.match(X(n))
              if (!l) return !1
              var a = l.index + l[0].length
              r[i] = o.slice(0, l.index) + (!l.index || a == o.length ? '' : ' ') + o.slice(a) || null
            }
          else return !1
          return !0
        })
      }),
      addLineWidget: it(function (e, t, n) {
        return As(this, e, t, n)
      }),
      removeLineWidget: function (e) {
        e.clear()
      },
      markText: function (e, t, n) {
        return Xr(this, le(this, e), le(this, t), n, (n && n.type) || 'range')
      },
      setBookmark: function (e, t) {
        var n = {
          replacedWith: t && (t.nodeType == null ? t.widget : t),
          insertLeft: t && t.insertLeft,
          clearWhenEmpty: !1,
          shared: t && t.shared,
          handleMouseEvents: t && t.handleMouseEvents,
        }
        return (e = le(this, e)), Xr(this, e, e, n, 'bookmark')
      },
      findMarksAt: function (e) {
        e = le(this, e)
        var t = [],
          n = K(this, e.line).markedSpans
        if (n)
          for (var r = 0; r < n.length; ++r) {
            var i = n[r]
            ;(i.from == null || i.from <= e.ch) && (i.to == null || i.to >= e.ch) && t.push(i.marker.parent || i.marker)
          }
        return t
      },
      findMarks: function (e, t, n) {
        ;(e = le(this, e)), (t = le(this, t))
        var r = [],
          i = e.line
        return (
          this.iter(e.line, t.line + 1, function (o) {
            var l = o.markedSpans
            if (l)
              for (var a = 0; a < l.length; a++) {
                var s = l[a]
                !(
                  (s.to != null && i == e.line && e.ch >= s.to) ||
                  (s.from == null && i != e.line) ||
                  (s.from != null && i == t.line && s.from >= t.ch)
                ) &&
                  (!n || n(s.marker)) &&
                  r.push(s.marker.parent || s.marker)
              }
            ++i
          }),
          r
        )
      },
      getAllMarks: function () {
        var e = []
        return (
          this.iter(function (t) {
            var n = t.markedSpans
            if (n) for (var r = 0; r < n.length; ++r) n[r].from != null && e.push(n[r].marker)
          }),
          e
        )
      },
      posFromIndex: function (e) {
        var t,
          n = this.first,
          r = this.lineSeparator().length
        return (
          this.iter(function (i) {
            var o = i.text.length + r
            if (o > e) return (t = e), !0
            ;(e -= o), ++n
          }),
          le(this, g(n, t))
        )
      },
      indexFromPos: function (e) {
        e = le(this, e)
        var t = e.ch
        if (e.line < this.first || e.ch < 0) return 0
        var n = this.lineSeparator().length
        return (
          this.iter(this.first, e.line, function (r) {
            t += r.text.length + n
          }),
          t
        )
      },
      copy: function (e) {
        var t = new xt(
          Er(this, this.first, this.first + this.size),
          this.modeOption,
          this.first,
          this.lineSep,
          this.direction,
        )
        return (
          (t.scrollTop = this.scrollTop),
          (t.scrollLeft = this.scrollLeft),
          (t.sel = this.sel),
          (t.extend = !1),
          e && ((t.history.undoDepth = this.history.undoDepth), t.setHistory(this.getHistory())),
          t
        )
      },
      linkedDoc: function (e) {
        e || (e = {})
        var t = this.first,
          n = this.first + this.size
        e.from != null && e.from > t && (t = e.from), e.to != null && e.to < n && (n = e.to)
        var r = new xt(Er(this, t, n), e.mode || this.modeOption, t, this.lineSep, this.direction)
        return (
          e.sharedHist && (r.history = this.history),
          (this.linked || (this.linked = [])).push({ doc: r, sharedHist: e.sharedHist }),
          (r.linked = [{ doc: this, isParent: !0, sharedHist: e.sharedHist }]),
          zs(r, Fl(this)),
          r
        )
      },
      unlinkDoc: function (e) {
        if ((e instanceof Ke && (e = e.doc), this.linked))
          for (var t = 0; t < this.linked.length; ++t) {
            var n = this.linked[t]
            if (n.doc == e) {
              this.linked.splice(t, 1), e.unlinkDoc(this), Ps(Fl(this))
              break
            }
          }
        if (e.history == this.history) {
          var r = [e.id]
          pr(
            e,
            function (i) {
              return r.push(i.id)
            },
            !0,
          ),
            (e.history = new ri(null)),
            (e.history.done = Ur(this.history.done, r)),
            (e.history.undone = Ur(this.history.undone, r))
        }
      },
      iterLinkedDocs: function (e) {
        pr(this, e)
      },
      getMode: function () {
        return this.mode
      },
      getEditor: function () {
        return this.cm
      },
      splitLines: function (e) {
        return this.lineSep ? e.split(this.lineSep) : nn(e)
      },
      lineSeparator: function () {
        return (
          this.lineSep ||
          `
`
        )
      },
      setDirection: it(function (e) {
        e != 'rtl' && (e = 'ltr'),
          e != this.direction &&
            ((this.direction = e),
            this.iter(function (t) {
              return (t.order = null)
            }),
            this.cm && ks(this.cm))
      }),
    })),
      (xt.prototype.eachLine = xt.prototype.iter)
    var Wl = 0
    function Is(e) {
      var t = this
      if ((_l(t), !(je(t, e) || tr(t.display, e)))) {
        ft(e), M && (Wl = +new Date())
        var n = kr(t, e, !0),
          r = e.dataTransfer.files
        if (!(!n || t.isReadOnly()))
          if (r && r.length && window.FileReader && window.File)
            for (
              var i = r.length,
                o = Array(i),
                l = 0,
                a = function () {
                  ++l == i &&
                    nt(t, function () {
                      n = le(t.doc, n)
                      var m = {
                        from: n,
                        to: n,
                        text: t.doc.splitLines(
                          o
                            .filter(function (C) {
                              return C != null
                            })
                            .join(t.doc.lineSeparator()),
                        ),
                        origin: 'paste',
                      }
                      qr(t.doc, m), kl(t.doc, dr(le(t.doc, n), le(t.doc, hr(m))))
                    })()
                },
                s = function (m, C) {
                  if (t.options.allowDropFileTypes && se(t.options.allowDropFileTypes, m.type) == -1) {
                    a()
                    return
                  }
                  var N = new FileReader()
                  ;(N.onerror = function () {
                    return a()
                  }),
                    (N.onload = function () {
                      var O = N.result
                      if (/[\x00-\x08\x0e-\x1f]{2}/.test(O)) {
                        a()
                        return
                      }
                      ;(o[C] = O), a()
                    }),
                    N.readAsText(m)
                },
                u = 0;
              u < r.length;
              u++
            )
              s(r[u], u)
          else {
            if (t.state.draggingText && t.doc.sel.contains(n) > -1) {
              t.state.draggingText(e),
                setTimeout(function () {
                  return t.display.input.focus()
                }, 20)
              return
            }
            try {
              var d = e.dataTransfer.getData('Text')
              if (d) {
                var h
                if (
                  (t.state.draggingText && !t.state.draggingText.copy && (h = t.listSelections()),
                  oi(t.doc, dr(n, n)),
                  h)
                )
                  for (var b = 0; b < h.length; ++b) jr(t.doc, '', h[b].anchor, h[b].head, 'drag')
                t.replaceSelection(d, 'around', 'paste'), t.display.input.focus()
              }
            } catch {}
          }
      }
    }
    function Fs(e, t) {
      if (M && (!e.state.draggingText || +new Date() - Wl < 100)) {
        Zt(t)
        return
      }
      if (
        !(je(e, t) || tr(e.display, t)) &&
        (t.dataTransfer.setData('Text', e.getSelection()),
        (t.dataTransfer.effectAllowed = 'copyMove'),
        t.dataTransfer.setDragImage && !Ee)
      ) {
        var n = c('img', null, null, 'position: fixed; left: 0; top: 0;')
        ;(n.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='),
          ce && ((n.width = n.height = 1), e.display.wrapper.appendChild(n), (n._top = n.offsetTop)),
          t.dataTransfer.setDragImage(n, 0, 0),
          ce && n.parentNode.removeChild(n)
      }
    }
    function Ws(e, t) {
      var n = kr(e, t)
      if (n) {
        var r = document.createDocumentFragment()
        Fi(e, n, r),
          e.display.dragCursor ||
            ((e.display.dragCursor = c('div', null, 'CodeMirror-cursors CodeMirror-dragcursors')),
            e.display.lineSpace.insertBefore(e.display.dragCursor, e.display.cursorDiv)),
          _(e.display.dragCursor, r)
      }
    }
    function _l(e) {
      e.display.dragCursor && (e.display.lineSpace.removeChild(e.display.dragCursor), (e.display.dragCursor = null))
    }
    function Hl(e) {
      if (document.getElementsByClassName) {
        for (var t = document.getElementsByClassName('CodeMirror'), n = [], r = 0; r < t.length; r++) {
          var i = t[r].CodeMirror
          i && n.push(i)
        }
        n.length &&
          n[0].operation(function () {
            for (var o = 0; o < n.length; o++) e(n[o])
          })
      }
    }
    var Bl = !1
    function _s() {
      Bl || (Hs(), (Bl = !0))
    }
    function Hs() {
      var e
      E(window, 'resize', function () {
        e == null &&
          (e = setTimeout(function () {
            ;(e = null), Hl(Bs)
          }, 100))
      }),
        E(window, 'blur', function () {
          return Hl(Br)
        })
    }
    function Bs(e) {
      var t = e.display
      ;(t.cachedCharWidth = t.cachedTextHeight = t.cachedPaddingH = null), (t.scrollbarsClipped = !1), e.setSize()
    }
    for (
      var gr = {
          3: 'Pause',
          8: 'Backspace',
          9: 'Tab',
          13: 'Enter',
          16: 'Shift',
          17: 'Ctrl',
          18: 'Alt',
          19: 'Pause',
          20: 'CapsLock',
          27: 'Esc',
          32: 'Space',
          33: 'PageUp',
          34: 'PageDown',
          35: 'End',
          36: 'Home',
          37: 'Left',
          38: 'Up',
          39: 'Right',
          40: 'Down',
          44: 'PrintScrn',
          45: 'Insert',
          46: 'Delete',
          59: ';',
          61: '=',
          91: 'Mod',
          92: 'Mod',
          93: 'Mod',
          106: '*',
          107: '=',
          109: '-',
          110: '.',
          111: '/',
          145: 'ScrollLock',
          173: '-',
          186: ';',
          187: '=',
          188: ',',
          189: '-',
          190: '.',
          191: '/',
          192: '`',
          219: '[',
          220: '\\',
          221: ']',
          222: "'",
          224: 'Mod',
          63232: 'Up',
          63233: 'Down',
          63234: 'Left',
          63235: 'Right',
          63272: 'Delete',
          63273: 'Home',
          63275: 'End',
          63276: 'PageUp',
          63277: 'PageDown',
          63302: 'Insert',
        },
        Ln = 0;
      Ln < 10;
      Ln++
    )
      gr[Ln + 48] = gr[Ln + 96] = String(Ln)
    for (var si = 65; si <= 90; si++) gr[si] = String.fromCharCode(si)
    for (var Mn = 1; Mn <= 12; Mn++) gr[Mn + 111] = gr[Mn + 63235] = 'F' + Mn
    var nr = {}
    ;(nr.basic = {
      Left: 'goCharLeft',
      Right: 'goCharRight',
      Up: 'goLineUp',
      Down: 'goLineDown',
      End: 'goLineEnd',
      Home: 'goLineStartSmart',
      PageUp: 'goPageUp',
      PageDown: 'goPageDown',
      Delete: 'delCharAfter',
      Backspace: 'delCharBefore',
      'Shift-Backspace': 'delCharBefore',
      Tab: 'defaultTab',
      'Shift-Tab': 'indentAuto',
      Enter: 'newlineAndIndent',
      Insert: 'toggleOverwrite',
      Esc: 'singleSelection',
    }),
      (nr.pcDefault = {
        'Ctrl-A': 'selectAll',
        'Ctrl-D': 'deleteLine',
        'Ctrl-Z': 'undo',
        'Shift-Ctrl-Z': 'redo',
        'Ctrl-Y': 'redo',
        'Ctrl-Home': 'goDocStart',
        'Ctrl-End': 'goDocEnd',
        'Ctrl-Up': 'goLineUp',
        'Ctrl-Down': 'goLineDown',
        'Ctrl-Left': 'goGroupLeft',
        'Ctrl-Right': 'goGroupRight',
        'Alt-Left': 'goLineStart',
        'Alt-Right': 'goLineEnd',
        'Ctrl-Backspace': 'delGroupBefore',
        'Ctrl-Delete': 'delGroupAfter',
        'Ctrl-S': 'save',
        'Ctrl-F': 'find',
        'Ctrl-G': 'findNext',
        'Shift-Ctrl-G': 'findPrev',
        'Shift-Ctrl-F': 'replace',
        'Shift-Ctrl-R': 'replaceAll',
        'Ctrl-[': 'indentLess',
        'Ctrl-]': 'indentMore',
        'Ctrl-U': 'undoSelection',
        'Shift-Ctrl-U': 'redoSelection',
        'Alt-U': 'redoSelection',
        fallthrough: 'basic',
      }),
      (nr.emacsy = {
        'Ctrl-F': 'goCharRight',
        'Ctrl-B': 'goCharLeft',
        'Ctrl-P': 'goLineUp',
        'Ctrl-N': 'goLineDown',
        'Ctrl-A': 'goLineStart',
        'Ctrl-E': 'goLineEnd',
        'Ctrl-V': 'goPageDown',
        'Shift-Ctrl-V': 'goPageUp',
        'Ctrl-D': 'delCharAfter',
        'Ctrl-H': 'delCharBefore',
        'Alt-Backspace': 'delWordBefore',
        'Ctrl-K': 'killLine',
        'Ctrl-T': 'transposeChars',
        'Ctrl-O': 'openLine',
      }),
      (nr.macDefault = {
        'Cmd-A': 'selectAll',
        'Cmd-D': 'deleteLine',
        'Cmd-Z': 'undo',
        'Shift-Cmd-Z': 'redo',
        'Cmd-Y': 'redo',
        'Cmd-Home': 'goDocStart',
        'Cmd-Up': 'goDocStart',
        'Cmd-End': 'goDocEnd',
        'Cmd-Down': 'goDocEnd',
        'Alt-Left': 'goGroupLeft',
        'Alt-Right': 'goGroupRight',
        'Cmd-Left': 'goLineLeft',
        'Cmd-Right': 'goLineRight',
        'Alt-Backspace': 'delGroupBefore',
        'Ctrl-Alt-Backspace': 'delGroupAfter',
        'Alt-Delete': 'delGroupAfter',
        'Cmd-S': 'save',
        'Cmd-F': 'find',
        'Cmd-G': 'findNext',
        'Shift-Cmd-G': 'findPrev',
        'Cmd-Alt-F': 'replace',
        'Shift-Cmd-Alt-F': 'replaceAll',
        'Cmd-[': 'indentLess',
        'Cmd-]': 'indentMore',
        'Cmd-Backspace': 'delWrappedLineLeft',
        'Cmd-Delete': 'delWrappedLineRight',
        'Cmd-U': 'undoSelection',
        'Shift-Cmd-U': 'redoSelection',
        'Ctrl-Up': 'goDocStart',
        'Ctrl-Down': 'goDocEnd',
        fallthrough: ['basic', 'emacsy'],
      }),
      (nr.default = xe ? nr.macDefault : nr.pcDefault)
    function Rs(e) {
      var t = e.split(/-(?!$)/)
      e = t[t.length - 1]
      for (var n, r, i, o, l = 0; l < t.length - 1; l++) {
        var a = t[l]
        if (/^(cmd|meta|m)$/i.test(a)) o = !0
        else if (/^a(lt)?$/i.test(a)) n = !0
        else if (/^(c|ctrl|control)$/i.test(a)) r = !0
        else if (/^s(hift)?$/i.test(a)) i = !0
        else throw new Error('Unrecognized modifier name: ' + a)
      }
      return n && (e = 'Alt-' + e), r && (e = 'Ctrl-' + e), o && (e = 'Cmd-' + e), i && (e = 'Shift-' + e), e
    }
    function Ks(e) {
      var t = {}
      for (var n in e)
        if (e.hasOwnProperty(n)) {
          var r = e[n]
          if (/^(name|fallthrough|(de|at)tach)$/.test(n)) continue
          if (r == '...') {
            delete e[n]
            continue
          }
          for (var i = st(n.split(' '), Rs), o = 0; o < i.length; o++) {
            var l = void 0,
              a = void 0
            o == i.length - 1 ? ((a = i.join(' ')), (l = r)) : ((a = i.slice(0, o + 1).join(' ')), (l = '...'))
            var s = t[a]
            if (!s) t[a] = l
            else if (s != l) throw new Error('Inconsistent bindings for ' + a)
          }
          delete e[n]
        }
      for (var u in t) e[u] = t[u]
      return e
    }
    function Yr(e, t, n, r) {
      t = ui(t)
      var i = t.call ? t.call(e, r) : t[e]
      if (i === !1) return 'nothing'
      if (i === '...') return 'multi'
      if (i != null && n(i)) return 'handled'
      if (t.fallthrough) {
        if (Object.prototype.toString.call(t.fallthrough) != '[object Array]') return Yr(e, t.fallthrough, n, r)
        for (var o = 0; o < t.fallthrough.length; o++) {
          var l = Yr(e, t.fallthrough[o], n, r)
          if (l) return l
        }
      }
    }
    function Rl(e) {
      var t = typeof e == 'string' ? e : gr[e.keyCode]
      return t == 'Ctrl' || t == 'Alt' || t == 'Shift' || t == 'Mod'
    }
    function Kl(e, t, n) {
      var r = e
      return (
        t.altKey && r != 'Alt' && (e = 'Alt-' + e),
        (Re ? t.metaKey : t.ctrlKey) && r != 'Ctrl' && (e = 'Ctrl-' + e),
        (Re ? t.ctrlKey : t.metaKey) && r != 'Mod' && (e = 'Cmd-' + e),
        !n && t.shiftKey && r != 'Shift' && (e = 'Shift-' + e),
        e
      )
    }
    function Ul(e, t) {
      if (ce && e.keyCode == 34 && e.char) return !1
      var n = gr[e.keyCode]
      return n == null || e.altGraphKey ? !1 : (e.keyCode == 3 && e.code && (n = e.code), Kl(n, e, t))
    }
    function ui(e) {
      return typeof e == 'string' ? nr[e] : e
    }
    function Zr(e, t) {
      for (var n = e.doc.sel.ranges, r = [], i = 0; i < n.length; i++) {
        for (var o = t(n[i]); r.length && S(o.from, de(r).to) <= 0; ) {
          var l = r.pop()
          if (S(l.from, o.from) < 0) {
            o.from = l.from
            break
          }
        }
        r.push(o)
      }
      Tt(e, function () {
        for (var a = r.length - 1; a >= 0; a--) jr(e.doc, '', r[a].from, r[a].to, '+delete')
        Rr(e)
      })
    }
    function $i(e, t, n) {
      var r = be(e.text, t + n, n)
      return r < 0 || r > e.text.length ? null : r
    }
    function eo(e, t, n) {
      var r = $i(e, t.ch, n)
      return r == null ? null : new g(t.line, r, n < 0 ? 'after' : 'before')
    }
    function to(e, t, n, r, i) {
      if (e) {
        t.doc.direction == 'rtl' && (i = -i)
        var o = Et(n, t.doc.direction)
        if (o) {
          var l = i < 0 ? de(o) : o[0],
            a = i < 0 == (l.level == 1),
            s = a ? 'after' : 'before',
            u
          if (l.level > 0 || t.doc.direction == 'rtl') {
            var d = Wr(t, n)
            u = i < 0 ? n.text.length - 1 : 0
            var h = Xt(t, d, u).top
            ;(u = he(
              function (b) {
                return Xt(t, d, b).top == h
              },
              i < 0 == (l.level == 1) ? l.from : l.to - 1,
              u,
            )),
              s == 'before' && (u = $i(n, u, 1))
          } else u = i < 0 ? l.to : l.from
          return new g(r, u, s)
        }
      }
      return new g(r, i < 0 ? n.text.length : 0, i < 0 ? 'before' : 'after')
    }
    function Us(e, t, n, r) {
      var i = Et(t, e.doc.direction)
      if (!i) return eo(t, n, r)
      n.ch >= t.text.length
        ? ((n.ch = t.text.length), (n.sticky = 'before'))
        : n.ch <= 0 && ((n.ch = 0), (n.sticky = 'after'))
      var o = Pt(i, n.ch, n.sticky),
        l = i[o]
      if (e.doc.direction == 'ltr' && l.level % 2 == 0 && (r > 0 ? l.to > n.ch : l.from < n.ch)) return eo(t, n, r)
      var a = function (z, F) {
          return $i(t, z instanceof g ? z.ch : z, F)
        },
        s,
        u = function (z) {
          return e.options.lineWrapping ? ((s = s || Wr(e, t)), Yo(e, t, s, z)) : { begin: 0, end: t.text.length }
        },
        d = u(n.sticky == 'before' ? a(n, -1) : n.ch)
      if (e.doc.direction == 'rtl' || l.level == 1) {
        var h = (l.level == 1) == r < 0,
          b = a(n, h ? 1 : -1)
        if (b != null && (h ? b <= l.to && b <= d.end : b >= l.from && b >= d.begin)) {
          var m = h ? 'before' : 'after'
          return new g(n.line, b, m)
        }
      }
      var C = function (z, F, P) {
          for (
            var H = function (Fe, ot) {
              return ot ? new g(n.line, a(Fe, 1), 'before') : new g(n.line, Fe, 'after')
            };
            z >= 0 && z < i.length;
            z += F
          ) {
            var Z = i[z],
              Y = F > 0 == (Z.level != 1),
              ve = Y ? P.begin : a(P.end, -1)
            if ((Z.from <= ve && ve < Z.to) || ((ve = Y ? Z.from : a(Z.to, -1)), P.begin <= ve && ve < P.end))
              return H(ve, Y)
          }
        },
        N = C(o + r, r, d)
      if (N) return N
      var O = r > 0 ? d.end : a(d.begin, -1)
      return O != null && !(r > 0 && O == t.text.length) && ((N = C(r > 0 ? 0 : i.length - 1, r, u(O))), N) ? N : null
    }
    var Nn = {
      selectAll: Ml,
      singleSelection: function (e) {
        return e.setSelection(e.getCursor('anchor'), e.getCursor('head'), Ie)
      },
      killLine: function (e) {
        return Zr(e, function (t) {
          if (t.empty()) {
            var n = K(e.doc, t.head.line).text.length
            return t.head.ch == n && t.head.line < e.lastLine()
              ? { from: t.head, to: g(t.head.line + 1, 0) }
              : { from: t.head, to: g(t.head.line, n) }
          } else return { from: t.from(), to: t.to() }
        })
      },
      deleteLine: function (e) {
        return Zr(e, function (t) {
          return { from: g(t.from().line, 0), to: le(e.doc, g(t.to().line + 1, 0)) }
        })
      },
      delLineLeft: function (e) {
        return Zr(e, function (t) {
          return { from: g(t.from().line, 0), to: t.from() }
        })
      },
      delWrappedLineLeft: function (e) {
        return Zr(e, function (t) {
          var n = e.charCoords(t.head, 'div').top + 5,
            r = e.coordsChar({ left: 0, top: n }, 'div')
          return { from: r, to: t.from() }
        })
      },
      delWrappedLineRight: function (e) {
        return Zr(e, function (t) {
          var n = e.charCoords(t.head, 'div').top + 5,
            r = e.coordsChar({ left: e.display.lineDiv.offsetWidth + 100, top: n }, 'div')
          return { from: t.from(), to: r }
        })
      },
      undo: function (e) {
        return e.undo()
      },
      redo: function (e) {
        return e.redo()
      },
      undoSelection: function (e) {
        return e.undoSelection()
      },
      redoSelection: function (e) {
        return e.redoSelection()
      },
      goDocStart: function (e) {
        return e.extendSelection(g(e.firstLine(), 0))
      },
      goDocEnd: function (e) {
        return e.extendSelection(g(e.lastLine()))
      },
      goLineStart: function (e) {
        return e.extendSelectionsBy(
          function (t) {
            return Gl(e, t.head.line)
          },
          { origin: '+move', bias: 1 },
        )
      },
      goLineStartSmart: function (e) {
        return e.extendSelectionsBy(
          function (t) {
            return ql(e, t.head)
          },
          { origin: '+move', bias: 1 },
        )
      },
      goLineEnd: function (e) {
        return e.extendSelectionsBy(
          function (t) {
            return Gs(e, t.head.line)
          },
          { origin: '+move', bias: -1 },
        )
      },
      goLineRight: function (e) {
        return e.extendSelectionsBy(function (t) {
          var n = e.cursorCoords(t.head, 'div').top + 5
          return e.coordsChar({ left: e.display.lineDiv.offsetWidth + 100, top: n }, 'div')
        }, Ot)
      },
      goLineLeft: function (e) {
        return e.extendSelectionsBy(function (t) {
          var n = e.cursorCoords(t.head, 'div').top + 5
          return e.coordsChar({ left: 0, top: n }, 'div')
        }, Ot)
      },
      goLineLeftSmart: function (e) {
        return e.extendSelectionsBy(function (t) {
          var n = e.cursorCoords(t.head, 'div').top + 5,
            r = e.coordsChar({ left: 0, top: n }, 'div')
          return r.ch < e.getLine(r.line).search(/\S/) ? ql(e, t.head) : r
        }, Ot)
      },
      goLineUp: function (e) {
        return e.moveV(-1, 'line')
      },
      goLineDown: function (e) {
        return e.moveV(1, 'line')
      },
      goPageUp: function (e) {
        return e.moveV(-1, 'page')
      },
      goPageDown: function (e) {
        return e.moveV(1, 'page')
      },
      goCharLeft: function (e) {
        return e.moveH(-1, 'char')
      },
      goCharRight: function (e) {
        return e.moveH(1, 'char')
      },
      goColumnLeft: function (e) {
        return e.moveH(-1, 'column')
      },
      goColumnRight: function (e) {
        return e.moveH(1, 'column')
      },
      goWordLeft: function (e) {
        return e.moveH(-1, 'word')
      },
      goGroupRight: function (e) {
        return e.moveH(1, 'group')
      },
      goGroupLeft: function (e) {
        return e.moveH(-1, 'group')
      },
      goWordRight: function (e) {
        return e.moveH(1, 'word')
      },
      delCharBefore: function (e) {
        return e.deleteH(-1, 'codepoint')
      },
      delCharAfter: function (e) {
        return e.deleteH(1, 'char')
      },
      delWordBefore: function (e) {
        return e.deleteH(-1, 'word')
      },
      delWordAfter: function (e) {
        return e.deleteH(1, 'word')
      },
      delGroupBefore: function (e) {
        return e.deleteH(-1, 'group')
      },
      delGroupAfter: function (e) {
        return e.deleteH(1, 'group')
      },
      indentAuto: function (e) {
        return e.indentSelection('smart')
      },
      indentMore: function (e) {
        return e.indentSelection('add')
      },
      indentLess: function (e) {
        return e.indentSelection('subtract')
      },
      insertTab: function (e) {
        return e.replaceSelection('	')
      },
      insertSoftTab: function (e) {
        for (var t = [], n = e.listSelections(), r = e.options.tabSize, i = 0; i < n.length; i++) {
          var o = n[i].from(),
            l = U(e.getLine(o.line), o.ch, r)
          t.push(Ue(r - (l % r)))
        }
        e.replaceSelections(t)
      },
      defaultTab: function (e) {
        e.somethingSelected() ? e.indentSelection('add') : e.execCommand('insertTab')
      },
      transposeChars: function (e) {
        return Tt(e, function () {
          for (var t = e.listSelections(), n = [], r = 0; r < t.length; r++)
            if (t[r].empty()) {
              var i = t[r].head,
                o = K(e.doc, i.line).text
              if (o) {
                if ((i.ch == o.length && (i = new g(i.line, i.ch - 1)), i.ch > 0))
                  (i = new g(i.line, i.ch + 1)),
                    e.replaceRange(o.charAt(i.ch - 1) + o.charAt(i.ch - 2), g(i.line, i.ch - 2), i, '+transpose')
                else if (i.line > e.doc.first) {
                  var l = K(e.doc, i.line - 1).text
                  l &&
                    ((i = new g(i.line, 1)),
                    e.replaceRange(
                      o.charAt(0) + e.doc.lineSeparator() + l.charAt(l.length - 1),
                      g(i.line - 1, l.length - 1),
                      i,
                      '+transpose',
                    ))
                }
              }
              n.push(new De(i, i))
            }
          e.setSelections(n)
        })
      },
      newlineAndIndent: function (e) {
        return Tt(e, function () {
          for (var t = e.listSelections(), n = t.length - 1; n >= 0; n--)
            e.replaceRange(e.doc.lineSeparator(), t[n].anchor, t[n].head, '+input')
          t = e.listSelections()
          for (var r = 0; r < t.length; r++) e.indentLine(t[r].from().line, null, !0)
          Rr(e)
        })
      },
      openLine: function (e) {
        return e.replaceSelection(
          `
`,
          'start',
        )
      },
      toggleOverwrite: function (e) {
        return e.toggleOverwrite()
      },
    }
    function Gl(e, t) {
      var n = K(e.doc, t),
        r = _t(n)
      return r != n && (t = Ne(r)), to(!0, e, r, t, 1)
    }
    function Gs(e, t) {
      var n = K(e.doc, t),
        r = Ma(n)
      return r != n && (t = Ne(r)), to(!0, e, n, t, -1)
    }
    function ql(e, t) {
      var n = Gl(e, t.line),
        r = K(e.doc, n.line),
        i = Et(r, e.doc.direction)
      if (!i || i[0].level == 0) {
        var o = Math.max(n.ch, r.text.search(/\S/)),
          l = t.line == n.line && t.ch <= o && t.ch
        return g(n.line, l ? 0 : o, n.sticky)
      }
      return n
    }
    function fi(e, t, n) {
      if (typeof t == 'string' && ((t = Nn[t]), !t)) return !1
      e.display.input.ensurePolled()
      var r = e.display.shift,
        i = !1
      try {
        e.isReadOnly() && (e.state.suppressEdits = !0), n && (e.display.shift = !1), (i = t(e) != ie)
      } finally {
        ;(e.display.shift = r), (e.state.suppressEdits = !1)
      }
      return i
    }
    function qs(e, t, n) {
      for (var r = 0; r < e.state.keyMaps.length; r++) {
        var i = Yr(t, e.state.keyMaps[r], n, e)
        if (i) return i
      }
      return (e.options.extraKeys && Yr(t, e.options.extraKeys, n, e)) || Yr(t, e.options.keyMap, n, e)
    }
    var js = new fe()
    function Dn(e, t, n, r) {
      var i = e.state.keySeq
      if (i) {
        if (Rl(t)) return 'handled'
        if (
          (/\'$/.test(t)
            ? (e.state.keySeq = null)
            : js.set(50, function () {
                e.state.keySeq == i && ((e.state.keySeq = null), e.display.input.reset())
              }),
          jl(e, i + ' ' + t, n, r))
        )
          return !0
      }
      return jl(e, t, n, r)
    }
    function jl(e, t, n, r) {
      var i = qs(e, t, r)
      return (
        i == 'multi' && (e.state.keySeq = t),
        i == 'handled' && rt(e, 'keyHandled', e, t, n),
        (i == 'handled' || i == 'multi') && (ft(n), Wi(e)),
        !!i
      )
    }
    function Xl(e, t) {
      var n = Ul(t, !0)
      return n
        ? t.shiftKey && !e.state.keySeq
          ? Dn(e, 'Shift-' + n, t, function (r) {
              return fi(e, r, !0)
            }) ||
            Dn(e, n, t, function (r) {
              if (typeof r == 'string' ? /^go[A-Z]/.test(r) : r.motion) return fi(e, r)
            })
          : Dn(e, n, t, function (r) {
              return fi(e, r)
            })
        : !1
    }
    function Xs(e, t, n) {
      return Dn(e, "'" + n + "'", t, function (r) {
        return fi(e, r, !0)
      })
    }
    var ro = null
    function Yl(e) {
      var t = this
      if (!(e.target && e.target != t.display.input.getField()) && ((t.curOp.focus = y(ae(t))), !je(t, e))) {
        M && j < 11 && e.keyCode == 27 && (e.returnValue = !1)
        var n = e.keyCode
        t.display.shift = n == 16 || e.shiftKey
        var r = Xl(t, e)
        ce &&
          ((ro = r ? n : null),
          !r && n == 88 && !Kt && (xe ? e.metaKey : e.ctrlKey) && t.replaceSelection('', null, 'cut')),
          we && !xe && !r && n == 46 && e.shiftKey && !e.ctrlKey && document.execCommand && document.execCommand('cut'),
          n == 18 && !/\bCodeMirror-crosshair\b/.test(t.display.lineDiv.className) && Ys(t)
      }
    }
    function Ys(e) {
      var t = e.display.lineDiv
      D(t, 'CodeMirror-crosshair')
      function n(r) {
        ;(r.keyCode == 18 || !r.altKey) &&
          (me(t, 'CodeMirror-crosshair'), ut(document, 'keyup', n), ut(document, 'mouseover', n))
      }
      E(document, 'keyup', n), E(document, 'mouseover', n)
    }
    function Zl(e) {
      e.keyCode == 16 && (this.doc.sel.shift = !1), je(this, e)
    }
    function Jl(e) {
      var t = this
      if (
        !(e.target && e.target != t.display.input.getField()) &&
        !(tr(t.display, e) || je(t, e) || (e.ctrlKey && !e.altKey) || (xe && e.metaKey))
      ) {
        var n = e.keyCode,
          r = e.charCode
        if (ce && n == ro) {
          ;(ro = null), ft(e)
          return
        }
        if (!(ce && (!e.which || e.which < 10) && Xl(t, e))) {
          var i = String.fromCharCode(r ?? n)
          i != '\b' && (Xs(t, e, i) || t.display.input.onKeyPress(e))
        }
      }
    }
    var Zs = 400,
      no = function (e, t, n) {
        ;(this.time = e), (this.pos = t), (this.button = n)
      }
    no.prototype.compare = function (e, t, n) {
      return this.time + Zs > e && S(t, this.pos) == 0 && n == this.button
    }
    var An, On
    function Js(e, t) {
      var n = +new Date()
      return On && On.compare(n, e, t)
        ? ((An = On = null), 'triple')
        : An && An.compare(n, e, t)
        ? ((On = new no(n, e, t)), (An = null), 'double')
        : ((An = new no(n, e, t)), (On = null), 'single')
    }
    function Ql(e) {
      var t = this,
        n = t.display
      if (!(je(t, e) || (n.activeTouch && n.input.supportsTouch()))) {
        if ((n.input.ensurePolled(), (n.shift = e.shiftKey), tr(n, e))) {
          W ||
            ((n.scroller.draggable = !1),
            setTimeout(function () {
              return (n.scroller.draggable = !0)
            }, 100))
          return
        }
        if (!io(t, e)) {
          var r = kr(t, e),
            i = rn(e),
            o = r ? Js(r, i) : 'single'
          Ze(t).focus(),
            i == 1 && t.state.selectingText && t.state.selectingText(e),
            !(r && Qs(t, i, r, o, e)) &&
              (i == 1
                ? r
                  ? $s(t, r, o, e)
                  : mt(e) == n.scroller && ft(e)
                : i == 2
                ? (r && ii(t.doc, r),
                  setTimeout(function () {
                    return n.input.focus()
                  }, 20))
                : i == 3 && ($ ? t.display.input.onContextMenu(e) : _i(t)))
        }
      }
    }
    function Qs(e, t, n, r, i) {
      var o = 'Click'
      return (
        r == 'double' ? (o = 'Double' + o) : r == 'triple' && (o = 'Triple' + o),
        (o = (t == 1 ? 'Left' : t == 2 ? 'Middle' : 'Right') + o),
        Dn(e, Kl(o, i), i, function (l) {
          if ((typeof l == 'string' && (l = Nn[l]), !l)) return !1
          var a = !1
          try {
            e.isReadOnly() && (e.state.suppressEdits = !0), (a = l(e, n) != ie)
          } finally {
            e.state.suppressEdits = !1
          }
          return a
        })
      )
    }
    function Vs(e, t, n) {
      var r = e.getOption('configureMouse'),
        i = r ? r(e, t, n) : {}
      if (i.unit == null) {
        var o = Be ? n.shiftKey && n.metaKey : n.altKey
        i.unit = o ? 'rectangle' : t == 'single' ? 'char' : t == 'double' ? 'word' : 'line'
      }
      return (
        (i.extend == null || e.doc.extend) && (i.extend = e.doc.extend || n.shiftKey),
        i.addNew == null && (i.addNew = xe ? n.metaKey : n.ctrlKey),
        i.moveOnDrag == null && (i.moveOnDrag = !(xe ? n.altKey : n.ctrlKey)),
        i
      )
    }
    function $s(e, t, n, r) {
      M ? setTimeout(We(Vo, e), 0) : (e.curOp.focus = y(ae(e)))
      var i = Vs(e, n, r),
        o = e.doc.sel,
        l
      e.options.dragDrop &&
      gi &&
      !e.isReadOnly() &&
      n == 'single' &&
      (l = o.contains(t)) > -1 &&
      (S((l = o.ranges[l]).from(), t) < 0 || t.xRel > 0) &&
      (S(l.to(), t) > 0 || t.xRel < 0)
        ? eu(e, r, t, i)
        : tu(e, r, t, i)
    }
    function eu(e, t, n, r) {
      var i = e.display,
        o = !1,
        l = nt(e, function (u) {
          W && (i.scroller.draggable = !1),
            (e.state.draggingText = !1),
            e.state.delayingBlurEvent && (e.hasFocus() ? (e.state.delayingBlurEvent = !1) : _i(e)),
            ut(i.wrapper.ownerDocument, 'mouseup', l),
            ut(i.wrapper.ownerDocument, 'mousemove', a),
            ut(i.scroller, 'dragstart', s),
            ut(i.scroller, 'drop', l),
            o ||
              (ft(u),
              r.addNew || ii(e.doc, n, null, null, r.extend),
              (W && !Ee) || (M && j == 9)
                ? setTimeout(function () {
                    i.wrapper.ownerDocument.body.focus({ preventScroll: !0 }), i.input.focus()
                  }, 20)
                : i.input.focus())
        }),
        a = function (u) {
          o = o || Math.abs(t.clientX - u.clientX) + Math.abs(t.clientY - u.clientY) >= 10
        },
        s = function () {
          return (o = !0)
        }
      W && (i.scroller.draggable = !0),
        (e.state.draggingText = l),
        (l.copy = !r.moveOnDrag),
        E(i.wrapper.ownerDocument, 'mouseup', l),
        E(i.wrapper.ownerDocument, 'mousemove', a),
        E(i.scroller, 'dragstart', s),
        E(i.scroller, 'drop', l),
        (e.state.delayingBlurEvent = !0),
        setTimeout(function () {
          return i.input.focus()
        }, 20),
        i.scroller.dragDrop && i.scroller.dragDrop()
    }
    function Vl(e, t, n) {
      if (n == 'char') return new De(t, t)
      if (n == 'word') return e.findWordAt(t)
      if (n == 'line') return new De(g(t.line, 0), le(e.doc, g(t.line + 1, 0)))
      var r = n(e, t)
      return new De(r.from, r.to)
    }
    function tu(e, t, n, r) {
      M && _i(e)
      var i = e.display,
        o = e.doc
      ft(t)
      var l,
        a,
        s = o.sel,
        u = s.ranges
      if (
        (r.addNew && !r.extend
          ? ((a = o.sel.contains(n)), a > -1 ? (l = u[a]) : (l = new De(n, n)))
          : ((l = o.sel.primary()), (a = o.sel.primIndex)),
        r.unit == 'rectangle')
      )
        r.addNew || (l = new De(n, n)), (n = kr(e, t, !0, !0)), (a = -1)
      else {
        var d = Vl(e, n, r.unit)
        r.extend ? (l = Qi(l, d.anchor, d.head, r.extend)) : (l = d)
      }
      r.addNew
        ? a == -1
          ? ((a = u.length), ct(o, Bt(e, u.concat([l]), a), { scroll: !1, origin: '*mouse' }))
          : u.length > 1 && u[a].empty() && r.unit == 'char' && !r.extend
          ? (ct(o, Bt(e, u.slice(0, a).concat(u.slice(a + 1)), 0), { scroll: !1, origin: '*mouse' }), (s = o.sel))
          : Vi(o, a, l, Mt)
        : ((a = 0), ct(o, new At([l], 0), Mt), (s = o.sel))
      var h = n
      function b(P) {
        if (S(h, P) != 0)
          if (((h = P), r.unit == 'rectangle')) {
            for (
              var H = [],
                Z = e.options.tabSize,
                Y = U(K(o, n.line).text, n.ch, Z),
                ve = U(K(o, P.line).text, P.ch, Z),
                Fe = Math.min(Y, ve),
                ot = Math.max(Y, ve),
                Ge = Math.min(n.line, P.line),
                Lt = Math.min(e.lastLine(), Math.max(n.line, P.line));
              Ge <= Lt;
              Ge++
            ) {
              var wt = K(o, Ge).text,
                Qe = yt(wt, Fe, Z)
              Fe == ot
                ? H.push(new De(g(Ge, Qe), g(Ge, Qe)))
                : wt.length > Qe && H.push(new De(g(Ge, Qe), g(Ge, yt(wt, ot, Z))))
            }
            H.length || H.push(new De(n, n)),
              ct(o, Bt(e, s.ranges.slice(0, a).concat(H), a), { origin: '*mouse', scroll: !1 }),
              e.scrollIntoView(P)
          } else {
            var kt = l,
              at = Vl(e, P, r.unit),
              tt = kt.anchor,
              Ve
            S(at.anchor, tt) > 0
              ? ((Ve = at.head), (tt = et(kt.from(), at.anchor)))
              : ((Ve = at.anchor), (tt = Me(kt.to(), at.head)))
            var Ye = s.ranges.slice(0)
            ;(Ye[a] = ru(e, new De(le(o, tt), Ve))), ct(o, Bt(e, Ye, a), Mt)
          }
      }
      var m = i.wrapper.getBoundingClientRect(),
        C = 0
      function N(P) {
        var H = ++C,
          Z = kr(e, P, !0, r.unit == 'rectangle')
        if (Z)
          if (S(Z, h) != 0) {
            ;(e.curOp.focus = y(ae(e))), b(Z)
            var Y = Vn(i, o)
            ;(Z.line >= Y.to || Z.line < Y.from) &&
              setTimeout(
                nt(e, function () {
                  C == H && N(P)
                }),
                150,
              )
          } else {
            var ve = P.clientY < m.top ? -20 : P.clientY > m.bottom ? 20 : 0
            ve &&
              setTimeout(
                nt(e, function () {
                  C == H && ((i.scroller.scrollTop += ve), N(P))
                }),
                50,
              )
          }
      }
      function O(P) {
        ;(e.state.selectingText = !1),
          (C = 1 / 0),
          P && (ft(P), i.input.focus()),
          ut(i.wrapper.ownerDocument, 'mousemove', z),
          ut(i.wrapper.ownerDocument, 'mouseup', F),
          (o.history.lastSelOrigin = null)
      }
      var z = nt(e, function (P) {
          P.buttons === 0 || !rn(P) ? O(P) : N(P)
        }),
        F = nt(e, O)
      ;(e.state.selectingText = F), E(i.wrapper.ownerDocument, 'mousemove', z), E(i.wrapper.ownerDocument, 'mouseup', F)
    }
    function ru(e, t) {
      var n = t.anchor,
        r = t.head,
        i = K(e.doc, n.line)
      if (S(n, r) == 0 && n.sticky == r.sticky) return t
      var o = Et(i)
      if (!o) return t
      var l = Pt(o, n.ch, n.sticky),
        a = o[l]
      if (a.from != n.ch && a.to != n.ch) return t
      var s = l + ((a.from == n.ch) == (a.level != 1) ? 0 : 1)
      if (s == 0 || s == o.length) return t
      var u
      if (r.line != n.line) u = (r.line - n.line) * (e.doc.direction == 'ltr' ? 1 : -1) > 0
      else {
        var d = Pt(o, r.ch, r.sticky),
          h = d - l || (r.ch - n.ch) * (a.level == 1 ? -1 : 1)
        d == s - 1 || d == s ? (u = h < 0) : (u = h > 0)
      }
      var b = o[s + (u ? -1 : 0)],
        m = u == (b.level == 1),
        C = m ? b.from : b.to,
        N = m ? 'after' : 'before'
      return n.ch == C && n.sticky == N ? t : new De(new g(n.line, C, N), r)
    }
    function $l(e, t, n, r) {
      var i, o
      if (t.touches) (i = t.touches[0].clientX), (o = t.touches[0].clientY)
      else
        try {
          ;(i = t.clientX), (o = t.clientY)
        } catch {
          return !1
        }
      if (i >= Math.floor(e.display.gutters.getBoundingClientRect().right)) return !1
      r && ft(t)
      var l = e.display,
        a = l.lineDiv.getBoundingClientRect()
      if (o > a.bottom || !ht(e, n)) return tn(t)
      o -= a.top - l.viewOffset
      for (var s = 0; s < e.display.gutterSpecs.length; ++s) {
        var u = l.gutters.childNodes[s]
        if (u && u.getBoundingClientRect().right >= i) {
          var d = Gt(e.doc, o),
            h = e.display.gutterSpecs[s]
          return _e(e, n, e, d, h.className, t), tn(t)
        }
      }
    }
    function io(e, t) {
      return $l(e, t, 'gutterClick', !0)
    }
    function ea(e, t) {
      tr(e.display, t) || nu(e, t) || je(e, t, 'contextmenu') || $ || e.display.input.onContextMenu(t)
    }
    function nu(e, t) {
      return ht(e, 'gutterContextMenu') ? $l(e, t, 'gutterContextMenu', !1) : !1
    }
    function ta(e) {
      ;(e.display.wrapper.className =
        e.display.wrapper.className.replace(/\s*cm-s-\S+/g, '') + e.options.theme.replace(/(^|\s)\s*/g, ' cm-s-')),
        cn(e)
    }
    var Jr = {
        toString: function () {
          return 'CodeMirror.Init'
        },
      },
      ra = {},
      ci = {}
    function iu(e) {
      var t = e.optionHandlers
      function n(r, i, o, l) {
        ;(e.defaults[r] = i),
          o &&
            (t[r] = l
              ? function (a, s, u) {
                  u != Jr && o(a, s, u)
                }
              : o)
      }
      ;(e.defineOption = n),
        (e.Init = Jr),
        n(
          'value',
          '',
          function (r, i) {
            return r.setValue(i)
          },
          !0,
        ),
        n(
          'mode',
          null,
          function (r, i) {
            ;(r.doc.modeOption = i), Yi(r)
          },
          !0,
        ),
        n('indentUnit', 2, Yi, !0),
        n('indentWithTabs', !1),
        n('smartIndent', !0),
        n(
          'tabSize',
          4,
          function (r) {
            bn(r), cn(r), bt(r)
          },
          !0,
        ),
        n('lineSeparator', null, function (r, i) {
          if (((r.doc.lineSep = i), !!i)) {
            var o = [],
              l = r.doc.first
            r.doc.iter(function (s) {
              for (var u = 0; ; ) {
                var d = s.text.indexOf(i, u)
                if (d == -1) break
                ;(u = d + i.length), o.push(g(l, d))
              }
              l++
            })
            for (var a = o.length - 1; a >= 0; a--) jr(r.doc, i, o[a], g(o[a].line, o[a].ch + i.length))
          }
        }),
        n(
          'specialChars',
          /[\u0000-\u001f\u007f-\u009f\u00ad\u061c\u200b\u200e\u200f\u2028\u2029\u202d\u202e\u2066\u2067\u2069\ufeff\ufff9-\ufffc]/g,
          function (r, i, o) {
            ;(r.state.specialChars = new RegExp(i.source + (i.test('	') ? '' : '|	'), 'g')), o != Jr && r.refresh()
          },
        ),
        n(
          'specialCharPlaceholder',
          Pa,
          function (r) {
            return r.refresh()
          },
          !0,
        ),
        n('electricChars', !0),
        n(
          'inputStyle',
          te ? 'contenteditable' : 'textarea',
          function () {
            throw new Error('inputStyle can not (yet) be changed in a running editor')
          },
          !0,
        ),
        n(
          'spellcheck',
          !1,
          function (r, i) {
            return (r.getInputField().spellcheck = i)
          },
          !0,
        ),
        n(
          'autocorrect',
          !1,
          function (r, i) {
            return (r.getInputField().autocorrect = i)
          },
          !0,
        ),
        n(
          'autocapitalize',
          !1,
          function (r, i) {
            return (r.getInputField().autocapitalize = i)
          },
          !0,
        ),
        n('rtlMoveVisually', !ye),
        n('wholeLineUpdateBefore', !0),
        n(
          'theme',
          'default',
          function (r) {
            ta(r), mn(r)
          },
          !0,
        ),
        n('keyMap', 'default', function (r, i, o) {
          var l = ui(i),
            a = o != Jr && ui(o)
          a && a.detach && a.detach(r, l), l.attach && l.attach(r, a || null)
        }),
        n('extraKeys', null),
        n('configureMouse', null),
        n('lineWrapping', !1, lu, !0),
        n(
          'gutters',
          [],
          function (r, i) {
            ;(r.display.gutterSpecs = ji(i, r.options.lineNumbers)), mn(r)
          },
          !0,
        ),
        n(
          'fixedGutter',
          !0,
          function (r, i) {
            ;(r.display.gutters.style.left = i ? Ei(r.display) + 'px' : '0'), r.refresh()
          },
          !0,
        ),
        n(
          'coverGutterNextToScrollbar',
          !1,
          function (r) {
            return Kr(r)
          },
          !0,
        ),
        n(
          'scrollbarStyle',
          'native',
          function (r) {
            il(r),
              Kr(r),
              r.display.scrollbars.setScrollTop(r.doc.scrollTop),
              r.display.scrollbars.setScrollLeft(r.doc.scrollLeft)
          },
          !0,
        ),
        n(
          'lineNumbers',
          !1,
          function (r, i) {
            ;(r.display.gutterSpecs = ji(r.options.gutters, i)), mn(r)
          },
          !0,
        ),
        n('firstLineNumber', 1, mn, !0),
        n(
          'lineNumberFormatter',
          function (r) {
            return r
          },
          mn,
          !0,
        ),
        n('showCursorWhenSelecting', !1, dn, !0),
        n('resetSelectionOnContextMenu', !0),
        n('lineWiseCopyCut', !0),
        n('pasteLinesPerSelection', !0),
        n('selectionsMayTouch', !1),
        n('readOnly', !1, function (r, i) {
          i == 'nocursor' && (Br(r), r.display.input.blur()), r.display.input.readOnlyChanged(i)
        }),
        n('screenReaderLabel', null, function (r, i) {
          ;(i = i === '' ? null : i), r.display.input.screenReaderLabelChanged(i)
        }),
        n(
          'disableInput',
          !1,
          function (r, i) {
            i || r.display.input.reset()
          },
          !0,
        ),
        n('dragDrop', !0, ou),
        n('allowDropFileTypes', null),
        n('cursorBlinkRate', 530),
        n('cursorScrollMargin', 0),
        n('cursorHeight', 1, dn, !0),
        n('singleCursorHeightPerLine', !0, dn, !0),
        n('workTime', 100),
        n('workDelay', 100),
        n('flattenSpans', !0, bn, !0),
        n('addModeClass', !1, bn, !0),
        n('pollInterval', 100),
        n('undoDepth', 200, function (r, i) {
          return (r.doc.history.undoDepth = i)
        }),
        n('historyEventDelay', 1250),
        n(
          'viewportMargin',
          10,
          function (r) {
            return r.refresh()
          },
          !0,
        ),
        n('maxHighlightLength', 1e4, bn, !0),
        n('moveInputWithCursor', !0, function (r, i) {
          i || r.display.input.resetPosition()
        }),
        n('tabindex', null, function (r, i) {
          return (r.display.input.getField().tabIndex = i || '')
        }),
        n('autofocus', null),
        n(
          'direction',
          'ltr',
          function (r, i) {
            return r.doc.setDirection(i)
          },
          !0,
        ),
        n('phrases', null)
    }
    function ou(e, t, n) {
      var r = n && n != Jr
      if (!t != !r) {
        var i = e.display.dragFunctions,
          o = t ? E : ut
        o(e.display.scroller, 'dragstart', i.start),
          o(e.display.scroller, 'dragenter', i.enter),
          o(e.display.scroller, 'dragover', i.over),
          o(e.display.scroller, 'dragleave', i.leave),
          o(e.display.scroller, 'drop', i.drop)
      }
    }
    function lu(e) {
      e.options.lineWrapping
        ? (D(e.display.wrapper, 'CodeMirror-wrap'),
          (e.display.sizer.style.minWidth = ''),
          (e.display.sizerWidth = null))
        : (me(e.display.wrapper, 'CodeMirror-wrap'), Ci(e)),
        Ii(e),
        bt(e),
        cn(e),
        setTimeout(function () {
          return Kr(e)
        }, 100)
    }
    function Ke(e, t) {
      var n = this
      if (!(this instanceof Ke)) return new Ke(e, t)
      ;(this.options = t = t ? V(t) : {}), V(ra, t, !1)
      var r = t.value
      typeof r == 'string'
        ? (r = new xt(r, t.mode, null, t.lineSeparator, t.direction))
        : t.mode && (r.modeOption = t.mode),
        (this.doc = r)
      var i = new Ke.inputStyles[t.inputStyle](this),
        o = (this.display = new bs(e, r, i, t))
      ;(o.wrapper.CodeMirror = this),
        ta(this),
        t.lineWrapping && (this.display.wrapper.className += ' CodeMirror-wrap'),
        il(this),
        (this.state = {
          keyMaps: [],
          overlays: [],
          modeGen: 0,
          overwrite: !1,
          delayingBlurEvent: !1,
          focused: !1,
          suppressEdits: !1,
          pasteIncoming: -1,
          cutIncoming: -1,
          selectingText: !1,
          draggingText: !1,
          highlight: new fe(),
          keySeq: null,
          specialChars: null,
        }),
        t.autofocus && !te && o.input.focus(),
        M &&
          j < 11 &&
          setTimeout(function () {
            return n.display.input.reset(!0)
          }, 20),
        au(this),
        _s(),
        Lr(this),
        (this.curOp.forceUpdate = !0),
        pl(this, r),
        (t.autofocus && !te) || this.hasFocus()
          ? setTimeout(function () {
              n.hasFocus() && !n.state.focused && Hi(n)
            }, 20)
          : Br(this)
      for (var l in ci) ci.hasOwnProperty(l) && ci[l](this, t[l], Jr)
      al(this), t.finishInit && t.finishInit(this)
      for (var a = 0; a < oo.length; ++a) oo[a](this)
      Mr(this),
        W &&
          t.lineWrapping &&
          getComputedStyle(o.lineDiv).textRendering == 'optimizelegibility' &&
          (o.lineDiv.style.textRendering = 'auto')
    }
    ;(Ke.defaults = ra), (Ke.optionHandlers = ci)
    function au(e) {
      var t = e.display
      E(t.scroller, 'mousedown', nt(e, Ql)),
        M && j < 11
          ? E(
              t.scroller,
              'dblclick',
              nt(e, function (s) {
                if (!je(e, s)) {
                  var u = kr(e, s)
                  if (!(!u || io(e, s) || tr(e.display, s))) {
                    ft(s)
                    var d = e.findWordAt(u)
                    ii(e.doc, d.anchor, d.head)
                  }
                }
              }),
            )
          : E(t.scroller, 'dblclick', function (s) {
              return je(e, s) || ft(s)
            }),
        E(t.scroller, 'contextmenu', function (s) {
          return ea(e, s)
        }),
        E(t.input.getField(), 'contextmenu', function (s) {
          t.scroller.contains(s.target) || ea(e, s)
        })
      var n,
        r = { end: 0 }
      function i() {
        t.activeTouch &&
          ((n = setTimeout(function () {
            return (t.activeTouch = null)
          }, 1e3)),
          (r = t.activeTouch),
          (r.end = +new Date()))
      }
      function o(s) {
        if (s.touches.length != 1) return !1
        var u = s.touches[0]
        return u.radiusX <= 1 && u.radiusY <= 1
      }
      function l(s, u) {
        if (u.left == null) return !0
        var d = u.left - s.left,
          h = u.top - s.top
        return d * d + h * h > 20 * 20
      }
      E(t.scroller, 'touchstart', function (s) {
        if (!je(e, s) && !o(s) && !io(e, s)) {
          t.input.ensurePolled(), clearTimeout(n)
          var u = +new Date()
          ;(t.activeTouch = { start: u, moved: !1, prev: u - r.end <= 300 ? r : null }),
            s.touches.length == 1 &&
              ((t.activeTouch.left = s.touches[0].pageX), (t.activeTouch.top = s.touches[0].pageY))
        }
      }),
        E(t.scroller, 'touchmove', function () {
          t.activeTouch && (t.activeTouch.moved = !0)
        }),
        E(t.scroller, 'touchend', function (s) {
          var u = t.activeTouch
          if (u && !tr(t, s) && u.left != null && !u.moved && new Date() - u.start < 300) {
            var d = e.coordsChar(t.activeTouch, 'page'),
              h
            !u.prev || l(u, u.prev)
              ? (h = new De(d, d))
              : !u.prev.prev || l(u, u.prev.prev)
              ? (h = e.findWordAt(d))
              : (h = new De(g(d.line, 0), le(e.doc, g(d.line + 1, 0)))),
              e.setSelection(h.anchor, h.head),
              e.focus(),
              ft(s)
          }
          i()
        }),
        E(t.scroller, 'touchcancel', i),
        E(t.scroller, 'scroll', function () {
          t.scroller.clientHeight && (pn(e, t.scroller.scrollTop), Cr(e, t.scroller.scrollLeft, !0), _e(e, 'scroll', e))
        }),
        E(t.scroller, 'mousewheel', function (s) {
          return fl(e, s)
        }),
        E(t.scroller, 'DOMMouseScroll', function (s) {
          return fl(e, s)
        }),
        E(t.wrapper, 'scroll', function () {
          return (t.wrapper.scrollTop = t.wrapper.scrollLeft = 0)
        }),
        (t.dragFunctions = {
          enter: function (s) {
            je(e, s) || Zt(s)
          },
          over: function (s) {
            je(e, s) || (Ws(e, s), Zt(s))
          },
          start: function (s) {
            return Fs(e, s)
          },
          drop: nt(e, Is),
          leave: function (s) {
            je(e, s) || _l(e)
          },
        })
      var a = t.input.getField()
      E(a, 'keyup', function (s) {
        return Zl.call(e, s)
      }),
        E(a, 'keydown', nt(e, Yl)),
        E(a, 'keypress', nt(e, Jl)),
        E(a, 'focus', function (s) {
          return Hi(e, s)
        }),
        E(a, 'blur', function (s) {
          return Br(e, s)
        })
    }
    var oo = []
    Ke.defineInitHook = function (e) {
      return oo.push(e)
    }
    function zn(e, t, n, r) {
      var i = e.doc,
        o
      n == null && (n = 'add'), n == 'smart' && (i.mode.indent ? (o = ln(e, t).state) : (n = 'prev'))
      var l = e.options.tabSize,
        a = K(i, t),
        s = U(a.text, null, l)
      a.stateAfter && (a.stateAfter = null)
      var u = a.text.match(/^\s*/)[0],
        d
      if (!r && !/\S/.test(a.text)) (d = 0), (n = 'not')
      else if (n == 'smart' && ((d = i.mode.indent(o, a.text.slice(u.length), a.text)), d == ie || d > 150)) {
        if (!r) return
        n = 'prev'
      }
      n == 'prev'
        ? t > i.first
          ? (d = U(K(i, t - 1).text, null, l))
          : (d = 0)
        : n == 'add'
        ? (d = s + e.options.indentUnit)
        : n == 'subtract'
        ? (d = s - e.options.indentUnit)
        : typeof n == 'number' && (d = s + n),
        (d = Math.max(0, d))
      var h = '',
        b = 0
      if (e.options.indentWithTabs) for (var m = Math.floor(d / l); m; --m) (b += l), (h += '	')
      if ((b < d && (h += Ue(d - b)), h != u))
        return jr(i, h, g(t, 0), g(t, u.length), '+input'), (a.stateAfter = null), !0
      for (var C = 0; C < i.sel.ranges.length; C++) {
        var N = i.sel.ranges[C]
        if (N.head.line == t && N.head.ch < u.length) {
          var O = g(t, u.length)
          Vi(i, C, new De(O, O))
          break
        }
      }
    }
    var Rt = null
    function di(e) {
      Rt = e
    }
    function lo(e, t, n, r, i) {
      var o = e.doc
      ;(e.display.shift = !1), r || (r = o.sel)
      var l = +new Date() - 200,
        a = i == 'paste' || e.state.pasteIncoming > l,
        s = nn(t),
        u = null
      if (a && r.ranges.length > 1)
        if (
          Rt &&
          Rt.text.join(`
`) == t
        ) {
          if (r.ranges.length % Rt.text.length == 0) {
            u = []
            for (var d = 0; d < Rt.text.length; d++) u.push(o.splitLines(Rt.text[d]))
          }
        } else
          s.length == r.ranges.length &&
            e.options.pasteLinesPerSelection &&
            (u = st(s, function (z) {
              return [z]
            }))
      for (var h = e.curOp.updateInput, b = r.ranges.length - 1; b >= 0; b--) {
        var m = r.ranges[b],
          C = m.from(),
          N = m.to()
        m.empty() &&
          (n && n > 0
            ? (C = g(C.line, C.ch - n))
            : e.state.overwrite && !a
            ? (N = g(N.line, Math.min(K(o, N.line).text.length, N.ch + de(s).length)))
            : a &&
              Rt &&
              Rt.lineWise &&
              Rt.text.join(`
`) ==
                s.join(`
`) &&
              (C = N = g(C.line, 0)))
        var O = {
          from: C,
          to: N,
          text: u ? u[b % u.length] : s,
          origin: i || (a ? 'paste' : e.state.cutIncoming > l ? 'cut' : '+input'),
        }
        qr(e.doc, O), rt(e, 'inputRead', e, O)
      }
      t && !a && ia(e, t),
        Rr(e),
        e.curOp.updateInput < 2 && (e.curOp.updateInput = h),
        (e.curOp.typing = !0),
        (e.state.pasteIncoming = e.state.cutIncoming = -1)
    }
    function na(e, t) {
      var n = e.clipboardData && e.clipboardData.getData('Text')
      if (n)
        return (
          e.preventDefault(),
          !t.isReadOnly() &&
            !t.options.disableInput &&
            t.hasFocus() &&
            Tt(t, function () {
              return lo(t, n, 0, null, 'paste')
            }),
          !0
        )
    }
    function ia(e, t) {
      if (!(!e.options.electricChars || !e.options.smartIndent))
        for (var n = e.doc.sel, r = n.ranges.length - 1; r >= 0; r--) {
          var i = n.ranges[r]
          if (!(i.head.ch > 100 || (r && n.ranges[r - 1].head.line == i.head.line))) {
            var o = e.getModeAt(i.head),
              l = !1
            if (o.electricChars) {
              for (var a = 0; a < o.electricChars.length; a++)
                if (t.indexOf(o.electricChars.charAt(a)) > -1) {
                  l = zn(e, i.head.line, 'smart')
                  break
                }
            } else
              o.electricInput &&
                o.electricInput.test(K(e.doc, i.head.line).text.slice(0, i.head.ch)) &&
                (l = zn(e, i.head.line, 'smart'))
            l && rt(e, 'electricInput', e, i.head.line)
          }
        }
    }
    function oa(e) {
      for (var t = [], n = [], r = 0; r < e.doc.sel.ranges.length; r++) {
        var i = e.doc.sel.ranges[r].head.line,
          o = { anchor: g(i, 0), head: g(i + 1, 0) }
        n.push(o), t.push(e.getRange(o.anchor, o.head))
      }
      return { text: t, ranges: n }
    }
    function la(e, t, n, r) {
      e.setAttribute('autocorrect', n ? '' : 'off'),
        e.setAttribute('autocapitalize', r ? '' : 'off'),
        e.setAttribute('spellcheck', !!t)
    }
    function aa() {
      var e = c(
          'textarea',
          null,
          null,
          'position: absolute; bottom: -1em; padding: 0; width: 1px; height: 1em; min-height: 1em; outline: none',
        ),
        t = c('div', [e], null, 'overflow: hidden; position: relative; width: 3px; height: 0px;')
      return (
        W ? (e.style.width = '1000px') : e.setAttribute('wrap', 'off'),
        re && (e.style.border = '1px solid black'),
        la(e),
        t
      )
    }
    function su(e) {
      var t = e.optionHandlers,
        n = (e.helpers = {})
      ;(e.prototype = {
        constructor: e,
        focus: function () {
          Ze(this).focus(), this.display.input.focus()
        },
        setOption: function (r, i) {
          var o = this.options,
            l = o[r]
          ;(o[r] == i && r != 'mode') ||
            ((o[r] = i), t.hasOwnProperty(r) && nt(this, t[r])(this, i, l), _e(this, 'optionChange', this, r))
        },
        getOption: function (r) {
          return this.options[r]
        },
        getDoc: function () {
          return this.doc
        },
        addKeyMap: function (r, i) {
          this.state.keyMaps[i ? 'push' : 'unshift'](ui(r))
        },
        removeKeyMap: function (r) {
          for (var i = this.state.keyMaps, o = 0; o < i.length; ++o)
            if (i[o] == r || i[o].name == r) return i.splice(o, 1), !0
        },
        addOverlay: vt(function (r, i) {
          var o = r.token ? r : e.getMode(this.options, r)
          if (o.startState) throw new Error('Overlays may not be stateful.')
          qe(
            this.state.overlays,
            { mode: o, modeSpec: r, opaque: i && i.opaque, priority: (i && i.priority) || 0 },
            function (l) {
              return l.priority
            },
          ),
            this.state.modeGen++,
            bt(this)
        }),
        removeOverlay: vt(function (r) {
          for (var i = this.state.overlays, o = 0; o < i.length; ++o) {
            var l = i[o].modeSpec
            if (l == r || (typeof r == 'string' && l.name == r)) {
              i.splice(o, 1), this.state.modeGen++, bt(this)
              return
            }
          }
        }),
        indentLine: vt(function (r, i, o) {
          typeof i != 'string' &&
            typeof i != 'number' &&
            (i == null ? (i = this.options.smartIndent ? 'smart' : 'prev') : (i = i ? 'add' : 'subtract')),
            f(this.doc, r) && zn(this, r, i, o)
        }),
        indentSelection: vt(function (r) {
          for (var i = this.doc.sel.ranges, o = -1, l = 0; l < i.length; l++) {
            var a = i[l]
            if (a.empty())
              a.head.line > o &&
                (zn(this, a.head.line, r, !0), (o = a.head.line), l == this.doc.sel.primIndex && Rr(this))
            else {
              var s = a.from(),
                u = a.to(),
                d = Math.max(o, s.line)
              o = Math.min(this.lastLine(), u.line - (u.ch ? 0 : 1)) + 1
              for (var h = d; h < o; ++h) zn(this, h, r)
              var b = this.doc.sel.ranges
              s.ch == 0 && i.length == b.length && b[l].from().ch > 0 && Vi(this.doc, l, new De(s, b[l].to()), Ie)
            }
          }
        }),
        getTokenAt: function (r, i) {
          return go(this, r, i)
        },
        getLineTokens: function (r, i) {
          return go(this, g(r), i, !0)
        },
        getTokenTypeAt: function (r) {
          r = le(this.doc, r)
          var i = ho(this, K(this.doc, r.line)),
            o = 0,
            l = (i.length - 1) / 2,
            a = r.ch,
            s
          if (a == 0) s = i[2]
          else
            for (;;) {
              var u = (o + l) >> 1
              if ((u ? i[u * 2 - 1] : 0) >= a) l = u
              else if (i[u * 2 + 1] < a) o = u + 1
              else {
                s = i[u * 2 + 2]
                break
              }
            }
          var d = s ? s.indexOf('overlay ') : -1
          return d < 0 ? s : d == 0 ? null : s.slice(0, d - 1)
        },
        getModeAt: function (r) {
          var i = this.doc.mode
          return i.innerMode ? e.innerMode(i, this.getTokenAt(r).state).mode : i
        },
        getHelper: function (r, i) {
          return this.getHelpers(r, i)[0]
        },
        getHelpers: function (r, i) {
          var o = []
          if (!n.hasOwnProperty(i)) return o
          var l = n[i],
            a = this.getModeAt(r)
          if (typeof a[i] == 'string') l[a[i]] && o.push(l[a[i]])
          else if (a[i])
            for (var s = 0; s < a[i].length; s++) {
              var u = l[a[i][s]]
              u && o.push(u)
            }
          else a.helperType && l[a.helperType] ? o.push(l[a.helperType]) : l[a.name] && o.push(l[a.name])
          for (var d = 0; d < l._global.length; d++) {
            var h = l._global[d]
            h.pred(a, this) && se(o, h.val) == -1 && o.push(h.val)
          }
          return o
        },
        getStateAfter: function (r, i) {
          var o = this.doc
          return (r = Dt(o, r ?? o.first + o.size - 1)), ln(this, r + 1, i).state
        },
        cursorCoords: function (r, i) {
          var o,
            l = this.doc.sel.primary()
          return (
            r == null ? (o = l.head) : typeof r == 'object' ? (o = le(this.doc, r)) : (o = r ? l.from() : l.to()),
            Ht(this, o, i || 'page')
          )
        },
        charCoords: function (r, i) {
          return Yn(this, le(this.doc, r), i || 'page')
        },
        coordsChar: function (r, i) {
          return (r = qo(this, r, i || 'page')), Oi(this, r.left, r.top)
        },
        lineAtHeight: function (r, i) {
          return (r = qo(this, { top: r, left: 0 }, i || 'page').top), Gt(this.doc, r + this.display.viewOffset)
        },
        heightAtLine: function (r, i, o) {
          var l = !1,
            a
          if (typeof r == 'number') {
            var s = this.doc.first + this.doc.size - 1
            r < this.doc.first ? (r = this.doc.first) : r > s && ((r = s), (l = !0)), (a = K(this.doc, r))
          } else a = r
          return Xn(this, a, { top: 0, left: 0 }, i || 'page', o || l).top + (l ? this.doc.height - er(a) : 0)
        },
        defaultTextHeight: function () {
          return _r(this.display)
        },
        defaultCharWidth: function () {
          return Hr(this.display)
        },
        getViewport: function () {
          return { from: this.display.viewFrom, to: this.display.viewTo }
        },
        addWidget: function (r, i, o, l, a) {
          var s = this.display
          r = Ht(this, le(this.doc, r))
          var u = r.bottom,
            d = r.left
          if (
            ((i.style.position = 'absolute'),
            i.setAttribute('cm-ignore-events', 'true'),
            this.display.input.setUneditable(i),
            s.sizer.appendChild(i),
            l == 'over')
          )
            u = r.top
          else if (l == 'above' || l == 'near') {
            var h = Math.max(s.wrapper.clientHeight, this.doc.height),
              b = Math.max(s.sizer.clientWidth, s.lineSpace.clientWidth)
            ;(l == 'above' || r.bottom + i.offsetHeight > h) && r.top > i.offsetHeight
              ? (u = r.top - i.offsetHeight)
              : r.bottom + i.offsetHeight <= h && (u = r.bottom),
              d + i.offsetWidth > b && (d = b - i.offsetWidth)
          }
          ;(i.style.top = u + 'px'),
            (i.style.left = i.style.right = ''),
            a == 'right'
              ? ((d = s.sizer.clientWidth - i.offsetWidth), (i.style.right = '0px'))
              : (a == 'left' ? (d = 0) : a == 'middle' && (d = (s.sizer.clientWidth - i.offsetWidth) / 2),
                (i.style.left = d + 'px')),
            o && os(this, { left: d, top: u, right: d + i.offsetWidth, bottom: u + i.offsetHeight })
        },
        triggerOnKeyDown: vt(Yl),
        triggerOnKeyPress: vt(Jl),
        triggerOnKeyUp: Zl,
        triggerOnMouseDown: vt(Ql),
        execCommand: function (r) {
          if (Nn.hasOwnProperty(r)) return Nn[r].call(null, this)
        },
        triggerElectric: vt(function (r) {
          ia(this, r)
        }),
        findPosH: function (r, i, o, l) {
          var a = 1
          i < 0 && ((a = -1), (i = -i))
          for (var s = le(this.doc, r), u = 0; u < i && ((s = ao(this.doc, s, a, o, l)), !s.hitSide); ++u);
          return s
        },
        moveH: vt(function (r, i) {
          var o = this
          this.extendSelectionsBy(function (l) {
            return o.display.shift || o.doc.extend || l.empty()
              ? ao(o.doc, l.head, r, i, o.options.rtlMoveVisually)
              : r < 0
              ? l.from()
              : l.to()
          }, Ot)
        }),
        deleteH: vt(function (r, i) {
          var o = this.doc.sel,
            l = this.doc
          o.somethingSelected()
            ? l.replaceSelection('', null, '+delete')
            : Zr(this, function (a) {
                var s = ao(l, a.head, r, i, !1)
                return r < 0 ? { from: s, to: a.head } : { from: a.head, to: s }
              })
        }),
        findPosV: function (r, i, o, l) {
          var a = 1,
            s = l
          i < 0 && ((a = -1), (i = -i))
          for (var u = le(this.doc, r), d = 0; d < i; ++d) {
            var h = Ht(this, u, 'div')
            if ((s == null ? (s = h.left) : (h.left = s), (u = sa(this, h, a, o)), u.hitSide)) break
          }
          return u
        },
        moveV: vt(function (r, i) {
          var o = this,
            l = this.doc,
            a = [],
            s = !this.display.shift && !l.extend && l.sel.somethingSelected()
          if (
            (l.extendSelectionsBy(function (d) {
              if (s) return r < 0 ? d.from() : d.to()
              var h = Ht(o, d.head, 'div')
              d.goalColumn != null && (h.left = d.goalColumn), a.push(h.left)
              var b = sa(o, h, r, i)
              return i == 'page' && d == l.sel.primary() && Ri(o, Yn(o, b, 'div').top - h.top), b
            }, Ot),
            a.length)
          )
            for (var u = 0; u < l.sel.ranges.length; u++) l.sel.ranges[u].goalColumn = a[u]
        }),
        findWordAt: function (r) {
          var i = this.doc,
            o = K(i, r.line).text,
            l = r.ch,
            a = r.ch
          if (o) {
            var s = this.getHelper(r, 'wordChars')
            ;(r.sticky == 'before' || a == o.length) && l ? --l : ++a
            for (
              var u = o.charAt(l),
                d = pe(u, s)
                  ? function (h) {
                      return pe(h, s)
                    }
                  : /\s/.test(u)
                  ? function (h) {
                      return /\s/.test(h)
                    }
                  : function (h) {
                      return !/\s/.test(h) && !pe(h)
                    };
              l > 0 && d(o.charAt(l - 1));

            )
              --l
            for (; a < o.length && d(o.charAt(a)); ) ++a
          }
          return new De(g(r.line, l), g(r.line, a))
        },
        toggleOverwrite: function (r) {
          ;(r != null && r == this.state.overwrite) ||
            ((this.state.overwrite = !this.state.overwrite)
              ? D(this.display.cursorDiv, 'CodeMirror-overwrite')
              : me(this.display.cursorDiv, 'CodeMirror-overwrite'),
            _e(this, 'overwriteToggle', this, this.state.overwrite))
        },
        hasFocus: function () {
          return this.display.input.getField() == y(ae(this))
        },
        isReadOnly: function () {
          return !!(this.options.readOnly || this.doc.cantEdit)
        },
        scrollTo: vt(function (r, i) {
          hn(this, r, i)
        }),
        getScrollInfo: function () {
          var r = this.display.scroller
          return {
            left: r.scrollLeft,
            top: r.scrollTop,
            height: r.scrollHeight - jt(this) - this.display.barHeight,
            width: r.scrollWidth - jt(this) - this.display.barWidth,
            clientHeight: Mi(this),
            clientWidth: xr(this),
          }
        },
        scrollIntoView: vt(function (r, i) {
          r == null
            ? ((r = { from: this.doc.sel.primary().head, to: null }),
              i == null && (i = this.options.cursorScrollMargin))
            : typeof r == 'number'
            ? (r = { from: g(r, 0), to: null })
            : r.from == null && (r = { from: r, to: null }),
            r.to || (r.to = r.from),
            (r.margin = i || 0),
            r.from.line != null ? ls(this, r) : el(this, r.from, r.to, r.margin)
        }),
        setSize: vt(function (r, i) {
          var o = this,
            l = function (s) {
              return typeof s == 'number' || /^\d+$/.test(String(s)) ? s + 'px' : s
            }
          r != null && (this.display.wrapper.style.width = l(r)),
            i != null && (this.display.wrapper.style.height = l(i)),
            this.options.lineWrapping && Ko(this)
          var a = this.display.viewFrom
          this.doc.iter(a, this.display.viewTo, function (s) {
            if (s.widgets) {
              for (var u = 0; u < s.widgets.length; u++)
                if (s.widgets[u].noHScroll) {
                  fr(o, a, 'widget')
                  break
                }
            }
            ++a
          }),
            (this.curOp.forceUpdate = !0),
            _e(this, 'refresh', this)
        }),
        operation: function (r) {
          return Tt(this, r)
        },
        startOperation: function () {
          return Lr(this)
        },
        endOperation: function () {
          return Mr(this)
        },
        refresh: vt(function () {
          var r = this.display.cachedTextHeight
          bt(this),
            (this.curOp.forceUpdate = !0),
            cn(this),
            hn(this, this.doc.scrollLeft, this.doc.scrollTop),
            Gi(this.display),
            (r == null || Math.abs(r - _r(this.display)) > 0.5 || this.options.lineWrapping) && Ii(this),
            _e(this, 'refresh', this)
        }),
        swapDoc: vt(function (r) {
          var i = this.doc
          return (
            (i.cm = null),
            this.state.selectingText && this.state.selectingText(),
            pl(this, r),
            cn(this),
            this.display.input.reset(),
            hn(this, r.scrollLeft, r.scrollTop),
            (this.curOp.forceScroll = !0),
            rt(this, 'swapDoc', this, i),
            i
          )
        }),
        phrase: function (r) {
          var i = this.options.phrases
          return i && Object.prototype.hasOwnProperty.call(i, r) ? i[r] : r
        },
        getInputField: function () {
          return this.display.input.getField()
        },
        getWrapperElement: function () {
          return this.display.wrapper
        },
        getScrollerElement: function () {
          return this.display.scroller
        },
        getGutterElement: function () {
          return this.display.gutters
        },
      }),
        pt(e),
        (e.registerHelper = function (r, i, o) {
          n.hasOwnProperty(r) || (n[r] = e[r] = { _global: [] }), (n[r][i] = o)
        }),
        (e.registerGlobalHelper = function (r, i, o, l) {
          e.registerHelper(r, i, l), n[r]._global.push({ pred: o, val: l })
        })
    }
    function ao(e, t, n, r, i) {
      var o = t,
        l = n,
        a = K(e, t.line),
        s = i && e.direction == 'rtl' ? -n : n
      function u() {
        var F = t.line + s
        return F < e.first || F >= e.first + e.size ? !1 : ((t = new g(F, t.ch, t.sticky)), (a = K(e, F)))
      }
      function d(F) {
        var P
        if (r == 'codepoint') {
          var H = a.text.charCodeAt(t.ch + (n > 0 ? 0 : -1))
          if (isNaN(H)) P = null
          else {
            var Z = n > 0 ? H >= 55296 && H < 56320 : H >= 56320 && H < 57343
            P = new g(t.line, Math.max(0, Math.min(a.text.length, t.ch + n * (Z ? 2 : 1))), -n)
          }
        } else i ? (P = Us(e.cm, a, t, n)) : (P = eo(a, t, n))
        if (P == null)
          if (!F && u()) t = to(i, e.cm, a, t.line, s)
          else return !1
        else t = P
        return !0
      }
      if (r == 'char' || r == 'codepoint') d()
      else if (r == 'column') d(!0)
      else if (r == 'word' || r == 'group')
        for (
          var h = null, b = r == 'group', m = e.cm && e.cm.getHelper(t, 'wordChars'), C = !0;
          !(n < 0 && !d(!C));
          C = !1
        ) {
          var N =
              a.text.charAt(t.ch) ||
              `
`,
            O = pe(N, m)
              ? 'w'
              : b &&
                N ==
                  `
`
              ? 'n'
              : !b || /\s/.test(N)
              ? null
              : 'p'
          if ((b && !C && !O && (O = 's'), h && h != O)) {
            n < 0 && ((n = 1), d(), (t.sticky = 'after'))
            break
          }
          if ((O && (h = O), n > 0 && !d(!C))) break
        }
      var z = li(e, t, o, l, !0)
      return oe(o, z) && (z.hitSide = !0), z
    }
    function sa(e, t, n, r) {
      var i = e.doc,
        o = t.left,
        l
      if (r == 'page') {
        var a = Math.min(e.display.wrapper.clientHeight, Ze(e).innerHeight || i(e).documentElement.clientHeight),
          s = Math.max(a - 0.5 * _r(e.display), 3)
        l = (n > 0 ? t.bottom : t.top) + n * s
      } else r == 'line' && (l = n > 0 ? t.bottom + 3 : t.top - 3)
      for (var u; (u = Oi(e, o, l)), !!u.outside; ) {
        if (n < 0 ? l <= 0 : l >= i.height) {
          u.hitSide = !0
          break
        }
        l += n * 5
      }
      return u
    }
    var ze = function (e) {
      ;(this.cm = e),
        (this.lastAnchorNode = this.lastAnchorOffset = this.lastFocusNode = this.lastFocusOffset = null),
        (this.polling = new fe()),
        (this.composing = null),
        (this.gracePeriod = !1),
        (this.readDOMTimeout = null)
    }
    ;(ze.prototype.init = function (e) {
      var t = this,
        n = this,
        r = n.cm,
        i = (n.div = e.lineDiv)
      ;(i.contentEditable = !0), la(i, r.options.spellcheck, r.options.autocorrect, r.options.autocapitalize)
      function o(a) {
        for (var s = a.target; s; s = s.parentNode) {
          if (s == i) return !0
          if (/\bCodeMirror-(?:line)?widget\b/.test(s.className)) break
        }
        return !1
      }
      E(i, 'paste', function (a) {
        !o(a) ||
          je(r, a) ||
          na(a, r) ||
          (j <= 11 &&
            setTimeout(
              nt(r, function () {
                return t.updateFromDOM()
              }),
              20,
            ))
      }),
        E(i, 'compositionstart', function (a) {
          t.composing = { data: a.data, done: !1 }
        }),
        E(i, 'compositionupdate', function (a) {
          t.composing || (t.composing = { data: a.data, done: !1 })
        }),
        E(i, 'compositionend', function (a) {
          t.composing && (a.data != t.composing.data && t.readFromDOMSoon(), (t.composing.done = !0))
        }),
        E(i, 'touchstart', function () {
          return n.forceCompositionEnd()
        }),
        E(i, 'input', function () {
          t.composing || t.readFromDOMSoon()
        })
      function l(a) {
        if (!(!o(a) || je(r, a))) {
          if (r.somethingSelected())
            di({ lineWise: !1, text: r.getSelections() }), a.type == 'cut' && r.replaceSelection('', null, 'cut')
          else if (r.options.lineWiseCopyCut) {
            var s = oa(r)
            di({ lineWise: !0, text: s.text }),
              a.type == 'cut' &&
                r.operation(function () {
                  r.setSelections(s.ranges, 0, Ie), r.replaceSelection('', null, 'cut')
                })
          } else return
          if (a.clipboardData) {
            a.clipboardData.clearData()
            var u = Rt.text.join(`
`)
            if ((a.clipboardData.setData('Text', u), a.clipboardData.getData('Text') == u)) {
              a.preventDefault()
              return
            }
          }
          var d = aa(),
            h = d.firstChild
          r.display.lineSpace.insertBefore(d, r.display.lineSpace.firstChild),
            (h.value = Rt.text.join(`
`))
          var b = y(i.ownerDocument)
          Q(h),
            setTimeout(function () {
              r.display.lineSpace.removeChild(d), b.focus(), b == i && n.showPrimarySelection()
            }, 50)
        }
      }
      E(i, 'copy', l), E(i, 'cut', l)
    }),
      (ze.prototype.screenReaderLabelChanged = function (e) {
        e ? this.div.setAttribute('aria-label', e) : this.div.removeAttribute('aria-label')
      }),
      (ze.prototype.prepareSelection = function () {
        var e = Qo(this.cm, !1)
        return (e.focus = y(this.div.ownerDocument) == this.div), e
      }),
      (ze.prototype.showSelection = function (e, t) {
        !e ||
          !this.cm.display.view.length ||
          ((e.focus || t) && this.showPrimarySelection(), this.showMultipleSelections(e))
      }),
      (ze.prototype.getSelection = function () {
        return this.cm.display.wrapper.ownerDocument.getSelection()
      }),
      (ze.prototype.showPrimarySelection = function () {
        var e = this.getSelection(),
          t = this.cm,
          n = t.doc.sel.primary(),
          r = n.from(),
          i = n.to()
        if (t.display.viewTo == t.display.viewFrom || r.line >= t.display.viewTo || i.line < t.display.viewFrom) {
          e.removeAllRanges()
          return
        }
        var o = hi(t, e.anchorNode, e.anchorOffset),
          l = hi(t, e.focusNode, e.focusOffset)
        if (!(o && !o.bad && l && !l.bad && S(et(o, l), r) == 0 && S(Me(o, l), i) == 0)) {
          var a = t.display.view,
            s = (r.line >= t.display.viewFrom && ua(t, r)) || { node: a[0].measure.map[2], offset: 0 },
            u = i.line < t.display.viewTo && ua(t, i)
          if (!u) {
            var d = a[a.length - 1].measure,
              h = d.maps ? d.maps[d.maps.length - 1] : d.map
            u = { node: h[h.length - 1], offset: h[h.length - 2] - h[h.length - 3] }
          }
          if (!s || !u) {
            e.removeAllRanges()
            return
          }
          var b = e.rangeCount && e.getRangeAt(0),
            m
          try {
            m = x(s.node, s.offset, u.offset, u.node)
          } catch {}
          m &&
            (!we && t.state.focused
              ? (e.collapse(s.node, s.offset), m.collapsed || (e.removeAllRanges(), e.addRange(m)))
              : (e.removeAllRanges(), e.addRange(m)),
            b && e.anchorNode == null ? e.addRange(b) : we && this.startGracePeriod()),
            this.rememberSelection()
        }
      }),
      (ze.prototype.startGracePeriod = function () {
        var e = this
        clearTimeout(this.gracePeriod),
          (this.gracePeriod = setTimeout(function () {
            ;(e.gracePeriod = !1),
              e.selectionChanged() &&
                e.cm.operation(function () {
                  return (e.cm.curOp.selectionChanged = !0)
                })
          }, 20))
      }),
      (ze.prototype.showMultipleSelections = function (e) {
        _(this.cm.display.cursorDiv, e.cursors), _(this.cm.display.selectionDiv, e.selection)
      }),
      (ze.prototype.rememberSelection = function () {
        var e = this.getSelection()
        ;(this.lastAnchorNode = e.anchorNode),
          (this.lastAnchorOffset = e.anchorOffset),
          (this.lastFocusNode = e.focusNode),
          (this.lastFocusOffset = e.focusOffset)
      }),
      (ze.prototype.selectionInEditor = function () {
        var e = this.getSelection()
        if (!e.rangeCount) return !1
        var t = e.getRangeAt(0).commonAncestorContainer
        return v(this.div, t)
      }),
      (ze.prototype.focus = function () {
        this.cm.options.readOnly != 'nocursor' &&
          ((!this.selectionInEditor() || y(this.div.ownerDocument) != this.div) &&
            this.showSelection(this.prepareSelection(), !0),
          this.div.focus())
      }),
      (ze.prototype.blur = function () {
        this.div.blur()
      }),
      (ze.prototype.getField = function () {
        return this.div
      }),
      (ze.prototype.supportsTouch = function () {
        return !0
      }),
      (ze.prototype.receivedFocus = function () {
        var e = this,
          t = this
        this.selectionInEditor()
          ? setTimeout(function () {
              return e.pollSelection()
            }, 20)
          : Tt(this.cm, function () {
              return (t.cm.curOp.selectionChanged = !0)
            })
        function n() {
          t.cm.state.focused && (t.pollSelection(), t.polling.set(t.cm.options.pollInterval, n))
        }
        this.polling.set(this.cm.options.pollInterval, n)
      }),
      (ze.prototype.selectionChanged = function () {
        var e = this.getSelection()
        return (
          e.anchorNode != this.lastAnchorNode ||
          e.anchorOffset != this.lastAnchorOffset ||
          e.focusNode != this.lastFocusNode ||
          e.focusOffset != this.lastFocusOffset
        )
      }),
      (ze.prototype.pollSelection = function () {
        if (!(this.readDOMTimeout != null || this.gracePeriod || !this.selectionChanged())) {
          var e = this.getSelection(),
            t = this.cm
          if (J && G && this.cm.display.gutterSpecs.length && uu(e.anchorNode)) {
            this.cm.triggerOnKeyDown({ type: 'keydown', keyCode: 8, preventDefault: Math.abs }),
              this.blur(),
              this.focus()
            return
          }
          if (!this.composing) {
            this.rememberSelection()
            var n = hi(t, e.anchorNode, e.anchorOffset),
              r = hi(t, e.focusNode, e.focusOffset)
            n &&
              r &&
              Tt(t, function () {
                ct(t.doc, dr(n, r), Ie), (n.bad || r.bad) && (t.curOp.selectionChanged = !0)
              })
          }
        }
      }),
      (ze.prototype.pollContent = function () {
        this.readDOMTimeout != null && (clearTimeout(this.readDOMTimeout), (this.readDOMTimeout = null))
        var e = this.cm,
          t = e.display,
          n = e.doc.sel.primary(),
          r = n.from(),
          i = n.to()
        if (
          (r.ch == 0 && r.line > e.firstLine() && (r = g(r.line - 1, K(e.doc, r.line - 1).length)),
          i.ch == K(e.doc, i.line).text.length && i.line < e.lastLine() && (i = g(i.line + 1, 0)),
          r.line < t.viewFrom || i.line > t.viewTo - 1)
        )
          return !1
        var o, l, a
        r.line == t.viewFrom || (o = Sr(e, r.line)) == 0
          ? ((l = Ne(t.view[0].line)), (a = t.view[0].node))
          : ((l = Ne(t.view[o].line)), (a = t.view[o - 1].node.nextSibling))
        var s = Sr(e, i.line),
          u,
          d
        if (
          (s == t.view.length - 1
            ? ((u = t.viewTo - 1), (d = t.lineDiv.lastChild))
            : ((u = Ne(t.view[s + 1].line) - 1), (d = t.view[s + 1].node.previousSibling)),
          !a)
        )
          return !1
        for (
          var h = e.doc.splitLines(fu(e, a, d, l, u)), b = Vt(e.doc, g(l, 0), g(u, K(e.doc, u).text.length));
          h.length > 1 && b.length > 1;

        )
          if (de(h) == de(b)) h.pop(), b.pop(), u--
          else if (h[0] == b[0]) h.shift(), b.shift(), l++
          else break
        for (
          var m = 0, C = 0, N = h[0], O = b[0], z = Math.min(N.length, O.length);
          m < z && N.charCodeAt(m) == O.charCodeAt(m);

        )
          ++m
        for (
          var F = de(h),
            P = de(b),
            H = Math.min(F.length - (h.length == 1 ? m : 0), P.length - (b.length == 1 ? m : 0));
          C < H && F.charCodeAt(F.length - C - 1) == P.charCodeAt(P.length - C - 1);

        )
          ++C
        if (h.length == 1 && b.length == 1 && l == r.line)
          for (; m && m > r.ch && F.charCodeAt(F.length - C - 1) == P.charCodeAt(P.length - C - 1); ) m--, C++
        ;(h[h.length - 1] = F.slice(0, F.length - C).replace(/^\u200b+/, '')),
          (h[0] = h[0].slice(m).replace(/\u200b+$/, ''))
        var Z = g(l, m),
          Y = g(u, b.length ? de(b).length - C : 0)
        if (h.length > 1 || h[0] || S(Z, Y)) return jr(e.doc, h, Z, Y, '+input'), !0
      }),
      (ze.prototype.ensurePolled = function () {
        this.forceCompositionEnd()
      }),
      (ze.prototype.reset = function () {
        this.forceCompositionEnd()
      }),
      (ze.prototype.forceCompositionEnd = function () {
        this.composing &&
          (clearTimeout(this.readDOMTimeout),
          (this.composing = null),
          this.updateFromDOM(),
          this.div.blur(),
          this.div.focus())
      }),
      (ze.prototype.readFromDOMSoon = function () {
        var e = this
        this.readDOMTimeout == null &&
          (this.readDOMTimeout = setTimeout(function () {
            if (((e.readDOMTimeout = null), e.composing))
              if (e.composing.done) e.composing = null
              else return
            e.updateFromDOM()
          }, 80))
      }),
      (ze.prototype.updateFromDOM = function () {
        var e = this
        ;(this.cm.isReadOnly() || !this.pollContent()) &&
          Tt(this.cm, function () {
            return bt(e.cm)
          })
      }),
      (ze.prototype.setUneditable = function (e) {
        e.contentEditable = 'false'
      }),
      (ze.prototype.onKeyPress = function (e) {
        e.charCode == 0 ||
          this.composing ||
          (e.preventDefault(),
          this.cm.isReadOnly() ||
            nt(this.cm, lo)(this.cm, String.fromCharCode(e.charCode == null ? e.keyCode : e.charCode), 0))
      }),
      (ze.prototype.readOnlyChanged = function (e) {
        this.div.contentEditable = String(e != 'nocursor')
      }),
      (ze.prototype.onContextMenu = function () {}),
      (ze.prototype.resetPosition = function () {}),
      (ze.prototype.needsContentAttribute = !0)
    function ua(e, t) {
      var n = Ni(e, t.line)
      if (!n || n.hidden) return null
      var r = K(e.doc, t.line),
        i = Wo(n, r, t.line),
        o = Et(r, e.doc.direction),
        l = 'left'
      if (o) {
        var a = Pt(o, t.ch)
        l = a % 2 ? 'right' : 'left'
      }
      var s = Bo(i.map, t.ch, l)
      return (s.offset = s.collapse == 'right' ? s.end : s.start), s
    }
    function uu(e) {
      for (var t = e; t; t = t.parentNode) if (/CodeMirror-gutter-wrapper/.test(t.className)) return !0
      return !1
    }
    function Qr(e, t) {
      return t && (e.bad = !0), e
    }
    function fu(e, t, n, r, i) {
      var o = '',
        l = !1,
        a = e.doc.lineSeparator(),
        s = !1
      function u(m) {
        return function (C) {
          return C.id == m
        }
      }
      function d() {
        l && ((o += a), s && (o += a), (l = s = !1))
      }
      function h(m) {
        m && (d(), (o += m))
      }
      function b(m) {
        if (m.nodeType == 1) {
          var C = m.getAttribute('cm-text')
          if (C) {
            h(C)
            return
          }
          var N = m.getAttribute('cm-marker'),
            O
          if (N) {
            var z = e.findMarks(g(r, 0), g(i + 1, 0), u(+N))
            z.length && (O = z[0].find(0)) && h(Vt(e.doc, O.from, O.to).join(a))
            return
          }
          if (m.getAttribute('contenteditable') == 'false') return
          var F = /^(pre|div|p|li|table|br)$/i.test(m.nodeName)
          if (!/^br$/i.test(m.nodeName) && m.textContent.length == 0) return
          F && d()
          for (var P = 0; P < m.childNodes.length; P++) b(m.childNodes[P])
          ;/^(pre|p)$/i.test(m.nodeName) && (s = !0), F && (l = !0)
        } else m.nodeType == 3 && h(m.nodeValue.replace(/\u200b/g, '').replace(/\u00a0/g, ' '))
      }
      for (; b(t), t != n; ) (t = t.nextSibling), (s = !1)
      return o
    }
    function hi(e, t, n) {
      var r
      if (t == e.display.lineDiv) {
        if (((r = e.display.lineDiv.childNodes[n]), !r)) return Qr(e.clipPos(g(e.display.viewTo - 1)), !0)
        ;(t = null), (n = 0)
      } else
        for (r = t; ; r = r.parentNode) {
          if (!r || r == e.display.lineDiv) return null
          if (r.parentNode && r.parentNode == e.display.lineDiv) break
        }
      for (var i = 0; i < e.display.view.length; i++) {
        var o = e.display.view[i]
        if (o.node == r) return cu(o, t, n)
      }
    }
    function cu(e, t, n) {
      var r = e.text.firstChild,
        i = !1
      if (!t || !v(r, t)) return Qr(g(Ne(e.line), 0), !0)
      if (t == r && ((i = !0), (t = r.childNodes[n]), (n = 0), !t)) {
        var o = e.rest ? de(e.rest) : e.line
        return Qr(g(Ne(o), o.text.length), i)
      }
      var l = t.nodeType == 3 ? t : null,
        a = t
      for (
        !l &&
        t.childNodes.length == 1 &&
        t.firstChild.nodeType == 3 &&
        ((l = t.firstChild), n && (n = l.nodeValue.length));
        a.parentNode != r;

      )
        a = a.parentNode
      var s = e.measure,
        u = s.maps
      function d(O, z, F) {
        for (var P = -1; P < (u ? u.length : 0); P++)
          for (var H = P < 0 ? s.map : u[P], Z = 0; Z < H.length; Z += 3) {
            var Y = H[Z + 2]
            if (Y == O || Y == z) {
              var ve = Ne(P < 0 ? e.line : e.rest[P]),
                Fe = H[Z] + F
              return (F < 0 || Y != O) && (Fe = H[Z + (F ? 1 : 0)]), g(ve, Fe)
            }
          }
      }
      var h = d(l, a, n)
      if (h) return Qr(h, i)
      for (var b = a.nextSibling, m = l ? l.nodeValue.length - n : 0; b; b = b.nextSibling) {
        if (((h = d(b, b.firstChild, 0)), h)) return Qr(g(h.line, h.ch - m), i)
        m += b.textContent.length
      }
      for (var C = a.previousSibling, N = n; C; C = C.previousSibling) {
        if (((h = d(C, C.firstChild, -1)), h)) return Qr(g(h.line, h.ch + N), i)
        N += C.textContent.length
      }
    }
    var Je = function (e) {
      ;(this.cm = e),
        (this.prevInput = ''),
        (this.pollingFast = !1),
        (this.polling = new fe()),
        (this.hasSelection = !1),
        (this.composing = null),
        (this.resetting = !1)
    }
    ;(Je.prototype.init = function (e) {
      var t = this,
        n = this,
        r = this.cm
      this.createField(e)
      var i = this.textarea
      e.wrapper.insertBefore(this.wrapper, e.wrapper.firstChild),
        re && (i.style.width = '0px'),
        E(i, 'input', function () {
          M && j >= 9 && t.hasSelection && (t.hasSelection = null), n.poll()
        }),
        E(i, 'paste', function (l) {
          je(r, l) || na(l, r) || ((r.state.pasteIncoming = +new Date()), n.fastPoll())
        })
      function o(l) {
        if (!je(r, l)) {
          if (r.somethingSelected()) di({ lineWise: !1, text: r.getSelections() })
          else if (r.options.lineWiseCopyCut) {
            var a = oa(r)
            di({ lineWise: !0, text: a.text }),
              l.type == 'cut'
                ? r.setSelections(a.ranges, null, Ie)
                : ((n.prevInput = ''),
                  (i.value = a.text.join(`
`)),
                  Q(i))
          } else return
          l.type == 'cut' && (r.state.cutIncoming = +new Date())
        }
      }
      E(i, 'cut', o),
        E(i, 'copy', o),
        E(e.scroller, 'paste', function (l) {
          if (!(tr(e, l) || je(r, l))) {
            if (!i.dispatchEvent) {
              ;(r.state.pasteIncoming = +new Date()), n.focus()
              return
            }
            var a = new Event('paste')
            ;(a.clipboardData = l.clipboardData), i.dispatchEvent(a)
          }
        }),
        E(e.lineSpace, 'selectstart', function (l) {
          tr(e, l) || ft(l)
        }),
        E(i, 'compositionstart', function () {
          var l = r.getCursor('from')
          n.composing && n.composing.range.clear(),
            (n.composing = { start: l, range: r.markText(l, r.getCursor('to'), { className: 'CodeMirror-composing' }) })
        }),
        E(i, 'compositionend', function () {
          n.composing && (n.poll(), n.composing.range.clear(), (n.composing = null))
        })
    }),
      (Je.prototype.createField = function (e) {
        ;(this.wrapper = aa()), (this.textarea = this.wrapper.firstChild)
      }),
      (Je.prototype.screenReaderLabelChanged = function (e) {
        e ? this.textarea.setAttribute('aria-label', e) : this.textarea.removeAttribute('aria-label')
      }),
      (Je.prototype.prepareSelection = function () {
        var e = this.cm,
          t = e.display,
          n = e.doc,
          r = Qo(e)
        if (e.options.moveInputWithCursor) {
          var i = Ht(e, n.sel.primary().head, 'div'),
            o = t.wrapper.getBoundingClientRect(),
            l = t.lineDiv.getBoundingClientRect()
          ;(r.teTop = Math.max(0, Math.min(t.wrapper.clientHeight - 10, i.top + l.top - o.top))),
            (r.teLeft = Math.max(0, Math.min(t.wrapper.clientWidth - 10, i.left + l.left - o.left)))
        }
        return r
      }),
      (Je.prototype.showSelection = function (e) {
        var t = this.cm,
          n = t.display
        _(n.cursorDiv, e.cursors),
          _(n.selectionDiv, e.selection),
          e.teTop != null && ((this.wrapper.style.top = e.teTop + 'px'), (this.wrapper.style.left = e.teLeft + 'px'))
      }),
      (Je.prototype.reset = function (e) {
        if (!(this.contextMenuPending || (this.composing && e))) {
          var t = this.cm
          if (((this.resetting = !0), t.somethingSelected())) {
            this.prevInput = ''
            var n = t.getSelection()
            ;(this.textarea.value = n), t.state.focused && Q(this.textarea), M && j >= 9 && (this.hasSelection = n)
          } else e || ((this.prevInput = this.textarea.value = ''), M && j >= 9 && (this.hasSelection = null))
          this.resetting = !1
        }
      }),
      (Je.prototype.getField = function () {
        return this.textarea
      }),
      (Je.prototype.supportsTouch = function () {
        return !1
      }),
      (Je.prototype.focus = function () {
        if (this.cm.options.readOnly != 'nocursor' && (!te || y(this.textarea.ownerDocument) != this.textarea))
          try {
            this.textarea.focus()
          } catch {}
      }),
      (Je.prototype.blur = function () {
        this.textarea.blur()
      }),
      (Je.prototype.resetPosition = function () {
        this.wrapper.style.top = this.wrapper.style.left = 0
      }),
      (Je.prototype.receivedFocus = function () {
        this.slowPoll()
      }),
      (Je.prototype.slowPoll = function () {
        var e = this
        this.pollingFast ||
          this.polling.set(this.cm.options.pollInterval, function () {
            e.poll(), e.cm.state.focused && e.slowPoll()
          })
      }),
      (Je.prototype.fastPoll = function () {
        var e = !1,
          t = this
        t.pollingFast = !0
        function n() {
          var r = t.poll()
          !r && !e ? ((e = !0), t.polling.set(60, n)) : ((t.pollingFast = !1), t.slowPoll())
        }
        t.polling.set(20, n)
      }),
      (Je.prototype.poll = function () {
        var e = this,
          t = this.cm,
          n = this.textarea,
          r = this.prevInput
        if (
          this.contextMenuPending ||
          this.resetting ||
          !t.state.focused ||
          (or(n) && !r && !this.composing) ||
          t.isReadOnly() ||
          t.options.disableInput ||
          t.state.keySeq
        )
          return !1
        var i = n.value
        if (i == r && !t.somethingSelected()) return !1
        if ((M && j >= 9 && this.hasSelection === i) || (xe && /[\uf700-\uf7ff]/.test(i)))
          return t.display.input.reset(), !1
        if (t.doc.sel == t.display.selForContextMenu) {
          var o = i.charCodeAt(0)
          if ((o == 8203 && !r && (r = '​'), o == 8666)) return this.reset(), this.cm.execCommand('undo')
        }
        for (var l = 0, a = Math.min(r.length, i.length); l < a && r.charCodeAt(l) == i.charCodeAt(l); ) ++l
        return (
          Tt(t, function () {
            lo(t, i.slice(l), r.length - l, null, e.composing ? '*compose' : null),
              i.length > 1e3 ||
              i.indexOf(`
`) > -1
                ? (n.value = e.prevInput = '')
                : (e.prevInput = i),
              e.composing &&
                (e.composing.range.clear(),
                (e.composing.range = t.markText(e.composing.start, t.getCursor('to'), {
                  className: 'CodeMirror-composing',
                })))
          }),
          !0
        )
      }),
      (Je.prototype.ensurePolled = function () {
        this.pollingFast && this.poll() && (this.pollingFast = !1)
      }),
      (Je.prototype.onKeyPress = function () {
        M && j >= 9 && (this.hasSelection = null), this.fastPoll()
      }),
      (Je.prototype.onContextMenu = function (e) {
        var t = this,
          n = t.cm,
          r = n.display,
          i = t.textarea
        t.contextMenuPending && t.contextMenuPending()
        var o = kr(n, e),
          l = r.scroller.scrollTop
        if (!o || ce) return
        var a = n.options.resetSelectionOnContextMenu
        a && n.doc.sel.contains(o) == -1 && nt(n, ct)(n.doc, dr(o), Ie)
        var s = i.style.cssText,
          u = t.wrapper.style.cssText,
          d = t.wrapper.offsetParent.getBoundingClientRect()
        ;(t.wrapper.style.cssText = 'position: static'),
          (i.style.cssText =
            `position: absolute; width: 30px; height: 30px;
      top: ` +
            (e.clientY - d.top - 5) +
            'px; left: ' +
            (e.clientX - d.left - 5) +
            `px;
      z-index: 1000; background: ` +
            (M ? 'rgba(255, 255, 255, .05)' : 'transparent') +
            `;
      outline: none; border-width: 0; outline: none; overflow: hidden; opacity: .05; filter: alpha(opacity=5);`)
        var h
        W && (h = i.ownerDocument.defaultView.scrollY),
          r.input.focus(),
          W && i.ownerDocument.defaultView.scrollTo(null, h),
          r.input.reset(),
          n.somethingSelected() || (i.value = t.prevInput = ' '),
          (t.contextMenuPending = m),
          (r.selForContextMenu = n.doc.sel),
          clearTimeout(r.detectingSelectAll)
        function b() {
          if (i.selectionStart != null) {
            var N = n.somethingSelected(),
              O = '​' + (N ? i.value : '')
            ;(i.value = '⇚'),
              (i.value = O),
              (t.prevInput = N ? '' : '​'),
              (i.selectionStart = 1),
              (i.selectionEnd = O.length),
              (r.selForContextMenu = n.doc.sel)
          }
        }
        function m() {
          if (
            t.contextMenuPending == m &&
            ((t.contextMenuPending = !1),
            (t.wrapper.style.cssText = u),
            (i.style.cssText = s),
            M && j < 9 && r.scrollbars.setScrollTop((r.scroller.scrollTop = l)),
            i.selectionStart != null)
          ) {
            ;(!M || (M && j < 9)) && b()
            var N = 0,
              O = function () {
                r.selForContextMenu == n.doc.sel && i.selectionStart == 0 && i.selectionEnd > 0 && t.prevInput == '​'
                  ? nt(n, Ml)(n)
                  : N++ < 10
                  ? (r.detectingSelectAll = setTimeout(O, 500))
                  : ((r.selForContextMenu = null), r.input.reset())
              }
            r.detectingSelectAll = setTimeout(O, 200)
          }
        }
        if ((M && j >= 9 && b(), $)) {
          Zt(e)
          var C = function () {
            ut(window, 'mouseup', C), setTimeout(m, 20)
          }
          E(window, 'mouseup', C)
        } else setTimeout(m, 50)
      }),
      (Je.prototype.readOnlyChanged = function (e) {
        e || this.reset(), (this.textarea.disabled = e == 'nocursor'), (this.textarea.readOnly = !!e)
      }),
      (Je.prototype.setUneditable = function () {}),
      (Je.prototype.needsContentAttribute = !1)
    function du(e, t) {
      if (
        ((t = t ? V(t) : {}),
        (t.value = e.value),
        !t.tabindex && e.tabIndex && (t.tabindex = e.tabIndex),
        !t.placeholder && e.placeholder && (t.placeholder = e.placeholder),
        t.autofocus == null)
      ) {
        var n = y(e.ownerDocument)
        t.autofocus = n == e || (e.getAttribute('autofocus') != null && n == document.body)
      }
      function r() {
        e.value = a.getValue()
      }
      var i
      if (e.form && (E(e.form, 'submit', r), !t.leaveSubmitMethodAlone)) {
        var o = e.form
        i = o.submit
        try {
          var l = (o.submit = function () {
            r(), (o.submit = i), o.submit(), (o.submit = l)
          })
        } catch {}
      }
      ;(t.finishInit = function (s) {
        ;(s.save = r),
          (s.getTextArea = function () {
            return e
          }),
          (s.toTextArea = function () {
            ;(s.toTextArea = isNaN),
              r(),
              e.parentNode.removeChild(s.getWrapperElement()),
              (e.style.display = ''),
              e.form &&
                (ut(e.form, 'submit', r),
                !t.leaveSubmitMethodAlone && typeof e.form.submit == 'function' && (e.form.submit = i))
          })
      }),
        (e.style.display = 'none')
      var a = Ke(function (s) {
        return e.parentNode.insertBefore(s, e.nextSibling)
      }, t)
      return a
    }
    function hu(e) {
      ;(e.off = ut),
        (e.on = E),
        (e.wheelEventPixels = xs),
        (e.Doc = xt),
        (e.splitLines = nn),
        (e.countColumn = U),
        (e.findColumn = yt),
        (e.isWordChar = T),
        (e.Pass = ie),
        (e.signal = _e),
        (e.Line = Ir),
        (e.changeEnd = hr),
        (e.scrollbarModel = nl),
        (e.Pos = g),
        (e.cmpPos = S),
        (e.modes = Wt),
        (e.mimeModes = lr),
        (e.resolveMode = Ct),
        (e.getMode = Jt),
        (e.modeExtensions = ar),
        (e.extendMode = _n),
        (e.copyState = Qt),
        (e.startState = on),
        (e.innerMode = sr),
        (e.commands = Nn),
        (e.keyMap = nr),
        (e.keyName = Ul),
        (e.isModifierKey = Rl),
        (e.lookupKey = Yr),
        (e.normalizeKeyMap = Ks),
        (e.StringStream = Xe),
        (e.SharedTextMarker = Tn),
        (e.TextMarker = vr),
        (e.LineWidget = Cn),
        (e.e_preventDefault = ft),
        (e.e_stopPropagation = br),
        (e.e_stop = Zt),
        (e.addClass = D),
        (e.contains = v),
        (e.rmClass = me),
        (e.keyNames = gr)
    }
    iu(Ke), su(Ke)
    var pu = 'iter insert remove copy getEditor constructor'.split(' ')
    for (var pi in xt.prototype)
      xt.prototype.hasOwnProperty(pi) &&
        se(pu, pi) < 0 &&
        (Ke.prototype[pi] = (function (e) {
          return function () {
            return e.apply(this.doc, arguments)
          }
        })(xt.prototype[pi]))
    return (
      pt(xt),
      (Ke.inputStyles = { textarea: Je, contenteditable: ze }),
      (Ke.defineMode = function (e) {
        !Ke.defaults.mode && e != 'null' && (Ke.defaults.mode = e), Wn.apply(this, arguments)
      }),
      (Ke.defineMIME = Pr),
      Ke.defineMode('null', function () {
        return {
          token: function (e) {
            return e.skipToEnd()
          },
        }
      }),
      Ke.defineMIME('text/plain', 'null'),
      (Ke.defineExtension = function (e, t) {
        Ke.prototype[e] = t
      }),
      (Ke.defineDocExtension = function (e, t) {
        xt.prototype[e] = t
      }),
      (Ke.fromTextArea = du),
      hu(Ke),
      (Ke.version = '5.65.9'),
      Ke
    )
  })
})(pa)
var Ar = pa.exports
const wu = vu(Ar)
var yu = { exports: {} }
;(function (mr, Or) {
  ;(function (I) {
    I(Ar)
  })(function (I) {
    I.defineMode('css', function ($, X) {
      var me = X.inline
      X.propertyKeywords || (X = I.resolveMode('text/css'))
      var L = $.indentUnit,
        _ = X.tokenHooks,
        c = X.documentTypes || {},
        w = X.mediaTypes || {},
        x = X.mediaFeatures || {},
        v = X.mediaValueKeywords || {},
        y = X.propertyKeywords || {},
        D = X.nonStandardPropertyKeywords || {},
        B = X.fontProperties || {},
        Q = X.counterDescriptors || {},
        ae = X.colorKeywords || {},
        Ze = X.valueKeywords || {},
        We = X.allowNested,
        V = X.lineComment,
        U = X.supportsAtComponent === !0,
        fe = $.highlightNonStandardPropertyKeywords !== !1,
        se,
        ge
      function ie(k, A) {
        return (se = A), k
      }
      function Ie(k, A) {
        var T = k.next()
        if (_[T]) {
          var pe = _[T](k, A)
          if (pe !== !1) return pe
        }
        if (T == '@') return k.eatWhile(/[\w\\\-]/), ie('def', k.current())
        if (T == '=' || ((T == '~' || T == '|') && k.eat('='))) return ie(null, 'compare')
        if (T == '"' || T == "'") return (A.tokenize = Mt(T)), A.tokenize(k, A)
        if (T == '#') return k.eatWhile(/[\w\\\-]/), ie('atom', 'hash')
        if (T == '!') return k.match(/^\s*\w*/), ie('keyword', 'important')
        if (/\d/.test(T) || (T == '.' && k.eat(/\d/))) return k.eatWhile(/[\w.%]/), ie('number', 'unit')
        if (T === '-') {
          if (/[\d.]/.test(k.peek())) return k.eatWhile(/[\w.%]/), ie('number', 'unit')
          if (k.match(/^-[\w\\\-]*/))
            return (
              k.eatWhile(/[\w\\\-]/),
              k.match(/^\s*:/, !1) ? ie('variable-2', 'variable-definition') : ie('variable-2', 'variable')
            )
          if (k.match(/^\w+-/)) return ie('meta', 'meta')
        } else
          return /[,+>*\/]/.test(T)
            ? ie(null, 'select-op')
            : T == '.' && k.match(/^-?[_a-z][_a-z0-9-]*/i)
            ? ie('qualifier', 'qualifier')
            : /[:;{}\[\]\(\)]/.test(T)
            ? ie(null, T)
            : k.match(/^[\w-.]+(?=\()/)
            ? (/^(url(-prefix)?|domain|regexp)$/i.test(k.current()) && (A.tokenize = Ot),
              ie('variable callee', 'variable'))
            : /[\w\\\-]/.test(T)
            ? (k.eatWhile(/[\w\\\-]/), ie('property', 'word'))
            : ie(null, null)
      }
      function Mt(k) {
        return function (A, T) {
          for (var pe = !1, R; (R = A.next()) != null; ) {
            if (R == k && !pe) {
              k == ')' && A.backUp(1)
              break
            }
            pe = !pe && R == '\\'
          }
          return (R == k || (!pe && k != ')')) && (T.tokenize = null), ie('string', 'string')
        }
      }
      function Ot(k, A) {
        return k.next(), k.match(/^\s*[\"\')]/, !1) ? (A.tokenize = null) : (A.tokenize = Mt(')')), ie(null, '(')
      }
      function yt(k, A, T) {
        ;(this.type = k), (this.indent = A), (this.prev = T)
      }
      function Te(k, A, T, pe) {
        return (k.context = new yt(T, A.indentation() + (pe === !1 ? 0 : L), k.context)), T
      }
      function Ue(k) {
        return k.context.prev && (k.context = k.context.prev), k.context.type
      }
      function de(k, A, T) {
        return Oe[T.context.type](k, A, T)
      }
      function st(k, A, T, pe) {
        for (var R = pe || 1; R > 0; R--) T.context = T.context.prev
        return de(k, A, T)
      }
      function qe(k) {
        var A = k.current().toLowerCase()
        Ze.hasOwnProperty(A) ? (ge = 'atom') : ae.hasOwnProperty(A) ? (ge = 'keyword') : (ge = 'variable')
      }
      var Oe = {}
      return (
        (Oe.top = function (k, A, T) {
          if (k == '{') return Te(T, A, 'block')
          if (k == '}' && T.context.prev) return Ue(T)
          if (U && /@component/i.test(k)) return Te(T, A, 'atComponentBlock')
          if (/^@(-moz-)?document$/i.test(k)) return Te(T, A, 'documentTypes')
          if (/^@(media|supports|(-moz-)?document|import)$/i.test(k)) return Te(T, A, 'atBlock')
          if (/^@(font-face|counter-style)/i.test(k)) return (T.stateArg = k), 'restricted_atBlock_before'
          if (/^@(-(moz|ms|o|webkit)-)?keyframes$/i.test(k)) return 'keyframes'
          if (k && k.charAt(0) == '@') return Te(T, A, 'at')
          if (k == 'hash') ge = 'builtin'
          else if (k == 'word') ge = 'tag'
          else {
            if (k == 'variable-definition') return 'maybeprop'
            if (k == 'interpolation') return Te(T, A, 'interpolation')
            if (k == ':') return 'pseudo'
            if (We && k == '(') return Te(T, A, 'parens')
          }
          return T.context.type
        }),
        (Oe.block = function (k, A, T) {
          if (k == 'word') {
            var pe = A.current().toLowerCase()
            return y.hasOwnProperty(pe)
              ? ((ge = 'property'), 'maybeprop')
              : D.hasOwnProperty(pe)
              ? ((ge = fe ? 'string-2' : 'property'), 'maybeprop')
              : We
              ? ((ge = A.match(/^\s*:(?:\s|$)/, !1) ? 'property' : 'tag'), 'block')
              : ((ge += ' error'), 'maybeprop')
          } else
            return k == 'meta'
              ? 'block'
              : !We && (k == 'hash' || k == 'qualifier')
              ? ((ge = 'error'), 'block')
              : Oe.top(k, A, T)
        }),
        (Oe.maybeprop = function (k, A, T) {
          return k == ':' ? Te(T, A, 'prop') : de(k, A, T)
        }),
        (Oe.prop = function (k, A, T) {
          if (k == ';') return Ue(T)
          if (k == '{' && We) return Te(T, A, 'propBlock')
          if (k == '}' || k == '{') return st(k, A, T)
          if (k == '(') return Te(T, A, 'parens')
          if (k == 'hash' && !/^#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(A.current())) ge += ' error'
          else if (k == 'word') qe(A)
          else if (k == 'interpolation') return Te(T, A, 'interpolation')
          return 'prop'
        }),
        (Oe.propBlock = function (k, A, T) {
          return k == '}' ? Ue(T) : k == 'word' ? ((ge = 'property'), 'maybeprop') : T.context.type
        }),
        (Oe.parens = function (k, A, T) {
          return k == '{' || k == '}'
            ? st(k, A, T)
            : k == ')'
            ? Ue(T)
            : k == '('
            ? Te(T, A, 'parens')
            : k == 'interpolation'
            ? Te(T, A, 'interpolation')
            : (k == 'word' && qe(A), 'parens')
        }),
        (Oe.pseudo = function (k, A, T) {
          return k == 'meta' ? 'pseudo' : k == 'word' ? ((ge = 'variable-3'), T.context.type) : de(k, A, T)
        }),
        (Oe.documentTypes = function (k, A, T) {
          return k == 'word' && c.hasOwnProperty(A.current()) ? ((ge = 'tag'), T.context.type) : Oe.atBlock(k, A, T)
        }),
        (Oe.atBlock = function (k, A, T) {
          if (k == '(') return Te(T, A, 'atBlock_parens')
          if (k == '}' || k == ';') return st(k, A, T)
          if (k == '{') return Ue(T) && Te(T, A, We ? 'block' : 'top')
          if (k == 'interpolation') return Te(T, A, 'interpolation')
          if (k == 'word') {
            var pe = A.current().toLowerCase()
            pe == 'only' || pe == 'not' || pe == 'and' || pe == 'or'
              ? (ge = 'keyword')
              : w.hasOwnProperty(pe)
              ? (ge = 'attribute')
              : x.hasOwnProperty(pe)
              ? (ge = 'property')
              : v.hasOwnProperty(pe)
              ? (ge = 'keyword')
              : y.hasOwnProperty(pe)
              ? (ge = 'property')
              : D.hasOwnProperty(pe)
              ? (ge = fe ? 'string-2' : 'property')
              : Ze.hasOwnProperty(pe)
              ? (ge = 'atom')
              : ae.hasOwnProperty(pe)
              ? (ge = 'keyword')
              : (ge = 'error')
          }
          return T.context.type
        }),
        (Oe.atComponentBlock = function (k, A, T) {
          return k == '}'
            ? st(k, A, T)
            : k == '{'
            ? Ue(T) && Te(T, A, We ? 'block' : 'top', !1)
            : (k == 'word' && (ge = 'error'), T.context.type)
        }),
        (Oe.atBlock_parens = function (k, A, T) {
          return k == ')' ? Ue(T) : k == '{' || k == '}' ? st(k, A, T, 2) : Oe.atBlock(k, A, T)
        }),
        (Oe.restricted_atBlock_before = function (k, A, T) {
          return k == '{'
            ? Te(T, A, 'restricted_atBlock')
            : k == 'word' && T.stateArg == '@counter-style'
            ? ((ge = 'variable'), 'restricted_atBlock_before')
            : de(k, A, T)
        }),
        (Oe.restricted_atBlock = function (k, A, T) {
          return k == '}'
            ? ((T.stateArg = null), Ue(T))
            : k == 'word'
            ? ((T.stateArg == '@font-face' && !B.hasOwnProperty(A.current().toLowerCase())) ||
              (T.stateArg == '@counter-style' && !Q.hasOwnProperty(A.current().toLowerCase()))
                ? (ge = 'error')
                : (ge = 'property'),
              'maybeprop')
            : 'restricted_atBlock'
        }),
        (Oe.keyframes = function (k, A, T) {
          return k == 'word' ? ((ge = 'variable'), 'keyframes') : k == '{' ? Te(T, A, 'top') : de(k, A, T)
        }),
        (Oe.at = function (k, A, T) {
          return k == ';'
            ? Ue(T)
            : k == '{' || k == '}'
            ? st(k, A, T)
            : (k == 'word' ? (ge = 'tag') : k == 'hash' && (ge = 'builtin'), 'at')
        }),
        (Oe.interpolation = function (k, A, T) {
          return k == '}'
            ? Ue(T)
            : k == '{' || k == ';'
            ? st(k, A, T)
            : (k == 'word' ? (ge = 'variable') : k != 'variable' && k != '(' && k != ')' && (ge = 'error'),
              'interpolation')
        }),
        {
          startState: function (k) {
            return {
              tokenize: null,
              state: me ? 'block' : 'top',
              stateArg: null,
              context: new yt(me ? 'block' : 'top', k || 0, null),
            }
          },
          token: function (k, A) {
            if (!A.tokenize && k.eatSpace()) return null
            var T = (A.tokenize || Ie)(k, A)
            return (
              T && typeof T == 'object' && ((se = T[1]), (T = T[0])),
              (ge = T),
              se != 'comment' && (A.state = Oe[A.state](se, k, A)),
              ge
            )
          },
          indent: function (k, A) {
            var T = k.context,
              pe = A && A.charAt(0),
              R = T.indent
            return (
              T.type == 'prop' && (pe == '}' || pe == ')') && (T = T.prev),
              T.prev &&
                (pe == '}' &&
                (T.type == 'block' || T.type == 'top' || T.type == 'interpolation' || T.type == 'restricted_atBlock')
                  ? ((T = T.prev), (R = T.indent))
                  : ((pe == ')' && (T.type == 'parens' || T.type == 'atBlock_parens')) ||
                      (pe == '{' && (T.type == 'at' || T.type == 'atBlock'))) &&
                    (R = Math.max(0, T.indent - L))),
              R
            )
          },
          electricChars: '}',
          blockCommentStart: '/*',
          blockCommentEnd: '*/',
          blockCommentContinue: ' * ',
          lineComment: V,
          fold: 'brace',
        }
      )
    })
    function Pe($) {
      for (var X = {}, me = 0; me < $.length; ++me) X[$[me].toLowerCase()] = !0
      return X
    }
    var we = ['domain', 'regexp', 'url', 'url-prefix'],
      He = Pe(we),
      $e = ['all', 'aural', 'braille', 'handheld', 'print', 'projection', 'screen', 'tty', 'tv', 'embossed'],
      Ce = Pe($e),
      M = [
        'width',
        'min-width',
        'max-width',
        'height',
        'min-height',
        'max-height',
        'device-width',
        'min-device-width',
        'max-device-width',
        'device-height',
        'min-device-height',
        'max-device-height',
        'aspect-ratio',
        'min-aspect-ratio',
        'max-aspect-ratio',
        'device-aspect-ratio',
        'min-device-aspect-ratio',
        'max-device-aspect-ratio',
        'color',
        'min-color',
        'max-color',
        'color-index',
        'min-color-index',
        'max-color-index',
        'monochrome',
        'min-monochrome',
        'max-monochrome',
        'resolution',
        'min-resolution',
        'max-resolution',
        'scan',
        'grid',
        'orientation',
        'device-pixel-ratio',
        'min-device-pixel-ratio',
        'max-device-pixel-ratio',
        'pointer',
        'any-pointer',
        'hover',
        'any-hover',
        'prefers-color-scheme',
        'dynamic-range',
        'video-dynamic-range',
      ],
      j = Pe(M),
      W = [
        'landscape',
        'portrait',
        'none',
        'coarse',
        'fine',
        'on-demand',
        'hover',
        'interlace',
        'progressive',
        'dark',
        'light',
        'standard',
        'high',
      ],
      ee = Pe(W),
      G = [
        'align-content',
        'align-items',
        'align-self',
        'alignment-adjust',
        'alignment-baseline',
        'all',
        'anchor-point',
        'animation',
        'animation-delay',
        'animation-direction',
        'animation-duration',
        'animation-fill-mode',
        'animation-iteration-count',
        'animation-name',
        'animation-play-state',
        'animation-timing-function',
        'appearance',
        'azimuth',
        'backdrop-filter',
        'backface-visibility',
        'background',
        'background-attachment',
        'background-blend-mode',
        'background-clip',
        'background-color',
        'background-image',
        'background-origin',
        'background-position',
        'background-position-x',
        'background-position-y',
        'background-repeat',
        'background-size',
        'baseline-shift',
        'binding',
        'bleed',
        'block-size',
        'bookmark-label',
        'bookmark-level',
        'bookmark-state',
        'bookmark-target',
        'border',
        'border-bottom',
        'border-bottom-color',
        'border-bottom-left-radius',
        'border-bottom-right-radius',
        'border-bottom-style',
        'border-bottom-width',
        'border-collapse',
        'border-color',
        'border-image',
        'border-image-outset',
        'border-image-repeat',
        'border-image-slice',
        'border-image-source',
        'border-image-width',
        'border-left',
        'border-left-color',
        'border-left-style',
        'border-left-width',
        'border-radius',
        'border-right',
        'border-right-color',
        'border-right-style',
        'border-right-width',
        'border-spacing',
        'border-style',
        'border-top',
        'border-top-color',
        'border-top-left-radius',
        'border-top-right-radius',
        'border-top-style',
        'border-top-width',
        'border-width',
        'bottom',
        'box-decoration-break',
        'box-shadow',
        'box-sizing',
        'break-after',
        'break-before',
        'break-inside',
        'caption-side',
        'caret-color',
        'clear',
        'clip',
        'color',
        'color-profile',
        'column-count',
        'column-fill',
        'column-gap',
        'column-rule',
        'column-rule-color',
        'column-rule-style',
        'column-rule-width',
        'column-span',
        'column-width',
        'columns',
        'contain',
        'content',
        'counter-increment',
        'counter-reset',
        'crop',
        'cue',
        'cue-after',
        'cue-before',
        'cursor',
        'direction',
        'display',
        'dominant-baseline',
        'drop-initial-after-adjust',
        'drop-initial-after-align',
        'drop-initial-before-adjust',
        'drop-initial-before-align',
        'drop-initial-size',
        'drop-initial-value',
        'elevation',
        'empty-cells',
        'fit',
        'fit-content',
        'fit-position',
        'flex',
        'flex-basis',
        'flex-direction',
        'flex-flow',
        'flex-grow',
        'flex-shrink',
        'flex-wrap',
        'float',
        'float-offset',
        'flow-from',
        'flow-into',
        'font',
        'font-family',
        'font-feature-settings',
        'font-kerning',
        'font-language-override',
        'font-optical-sizing',
        'font-size',
        'font-size-adjust',
        'font-stretch',
        'font-style',
        'font-synthesis',
        'font-variant',
        'font-variant-alternates',
        'font-variant-caps',
        'font-variant-east-asian',
        'font-variant-ligatures',
        'font-variant-numeric',
        'font-variant-position',
        'font-variation-settings',
        'font-weight',
        'gap',
        'grid',
        'grid-area',
        'grid-auto-columns',
        'grid-auto-flow',
        'grid-auto-rows',
        'grid-column',
        'grid-column-end',
        'grid-column-gap',
        'grid-column-start',
        'grid-gap',
        'grid-row',
        'grid-row-end',
        'grid-row-gap',
        'grid-row-start',
        'grid-template',
        'grid-template-areas',
        'grid-template-columns',
        'grid-template-rows',
        'hanging-punctuation',
        'height',
        'hyphens',
        'icon',
        'image-orientation',
        'image-rendering',
        'image-resolution',
        'inline-box-align',
        'inset',
        'inset-block',
        'inset-block-end',
        'inset-block-start',
        'inset-inline',
        'inset-inline-end',
        'inset-inline-start',
        'isolation',
        'justify-content',
        'justify-items',
        'justify-self',
        'left',
        'letter-spacing',
        'line-break',
        'line-height',
        'line-height-step',
        'line-stacking',
        'line-stacking-ruby',
        'line-stacking-shift',
        'line-stacking-strategy',
        'list-style',
        'list-style-image',
        'list-style-position',
        'list-style-type',
        'margin',
        'margin-bottom',
        'margin-left',
        'margin-right',
        'margin-top',
        'marks',
        'marquee-direction',
        'marquee-loop',
        'marquee-play-count',
        'marquee-speed',
        'marquee-style',
        'mask-clip',
        'mask-composite',
        'mask-image',
        'mask-mode',
        'mask-origin',
        'mask-position',
        'mask-repeat',
        'mask-size',
        'mask-type',
        'max-block-size',
        'max-height',
        'max-inline-size',
        'max-width',
        'min-block-size',
        'min-height',
        'min-inline-size',
        'min-width',
        'mix-blend-mode',
        'move-to',
        'nav-down',
        'nav-index',
        'nav-left',
        'nav-right',
        'nav-up',
        'object-fit',
        'object-position',
        'offset',
        'offset-anchor',
        'offset-distance',
        'offset-path',
        'offset-position',
        'offset-rotate',
        'opacity',
        'order',
        'orphans',
        'outline',
        'outline-color',
        'outline-offset',
        'outline-style',
        'outline-width',
        'overflow',
        'overflow-style',
        'overflow-wrap',
        'overflow-x',
        'overflow-y',
        'padding',
        'padding-bottom',
        'padding-left',
        'padding-right',
        'padding-top',
        'page',
        'page-break-after',
        'page-break-before',
        'page-break-inside',
        'page-policy',
        'pause',
        'pause-after',
        'pause-before',
        'perspective',
        'perspective-origin',
        'pitch',
        'pitch-range',
        'place-content',
        'place-items',
        'place-self',
        'play-during',
        'position',
        'presentation-level',
        'punctuation-trim',
        'quotes',
        'region-break-after',
        'region-break-before',
        'region-break-inside',
        'region-fragment',
        'rendering-intent',
        'resize',
        'rest',
        'rest-after',
        'rest-before',
        'richness',
        'right',
        'rotate',
        'rotation',
        'rotation-point',
        'row-gap',
        'ruby-align',
        'ruby-overhang',
        'ruby-position',
        'ruby-span',
        'scale',
        'scroll-behavior',
        'scroll-margin',
        'scroll-margin-block',
        'scroll-margin-block-end',
        'scroll-margin-block-start',
        'scroll-margin-bottom',
        'scroll-margin-inline',
        'scroll-margin-inline-end',
        'scroll-margin-inline-start',
        'scroll-margin-left',
        'scroll-margin-right',
        'scroll-margin-top',
        'scroll-padding',
        'scroll-padding-block',
        'scroll-padding-block-end',
        'scroll-padding-block-start',
        'scroll-padding-bottom',
        'scroll-padding-inline',
        'scroll-padding-inline-end',
        'scroll-padding-inline-start',
        'scroll-padding-left',
        'scroll-padding-right',
        'scroll-padding-top',
        'scroll-snap-align',
        'scroll-snap-type',
        'shape-image-threshold',
        'shape-inside',
        'shape-margin',
        'shape-outside',
        'size',
        'speak',
        'speak-as',
        'speak-header',
        'speak-numeral',
        'speak-punctuation',
        'speech-rate',
        'stress',
        'string-set',
        'tab-size',
        'table-layout',
        'target',
        'target-name',
        'target-new',
        'target-position',
        'text-align',
        'text-align-last',
        'text-combine-upright',
        'text-decoration',
        'text-decoration-color',
        'text-decoration-line',
        'text-decoration-skip',
        'text-decoration-skip-ink',
        'text-decoration-style',
        'text-emphasis',
        'text-emphasis-color',
        'text-emphasis-position',
        'text-emphasis-style',
        'text-height',
        'text-indent',
        'text-justify',
        'text-orientation',
        'text-outline',
        'text-overflow',
        'text-rendering',
        'text-shadow',
        'text-size-adjust',
        'text-space-collapse',
        'text-transform',
        'text-underline-position',
        'text-wrap',
        'top',
        'touch-action',
        'transform',
        'transform-origin',
        'transform-style',
        'transition',
        'transition-delay',
        'transition-duration',
        'transition-property',
        'transition-timing-function',
        'translate',
        'unicode-bidi',
        'user-select',
        'vertical-align',
        'visibility',
        'voice-balance',
        'voice-duration',
        'voice-family',
        'voice-pitch',
        'voice-range',
        'voice-rate',
        'voice-stress',
        'voice-volume',
        'volume',
        'white-space',
        'widows',
        'width',
        'will-change',
        'word-break',
        'word-spacing',
        'word-wrap',
        'writing-mode',
        'z-index',
        'clip-path',
        'clip-rule',
        'mask',
        'enable-background',
        'filter',
        'flood-color',
        'flood-opacity',
        'lighting-color',
        'stop-color',
        'stop-opacity',
        'pointer-events',
        'color-interpolation',
        'color-interpolation-filters',
        'color-rendering',
        'fill',
        'fill-opacity',
        'fill-rule',
        'image-rendering',
        'marker',
        'marker-end',
        'marker-mid',
        'marker-start',
        'paint-order',
        'shape-rendering',
        'stroke',
        'stroke-dasharray',
        'stroke-dashoffset',
        'stroke-linecap',
        'stroke-linejoin',
        'stroke-miterlimit',
        'stroke-opacity',
        'stroke-width',
        'text-rendering',
        'baseline-shift',
        'dominant-baseline',
        'glyph-orientation-horizontal',
        'glyph-orientation-vertical',
        'text-anchor',
        'writing-mode',
      ],
      ue = Pe(G),
      ce = [
        'accent-color',
        'aspect-ratio',
        'border-block',
        'border-block-color',
        'border-block-end',
        'border-block-end-color',
        'border-block-end-style',
        'border-block-end-width',
        'border-block-start',
        'border-block-start-color',
        'border-block-start-style',
        'border-block-start-width',
        'border-block-style',
        'border-block-width',
        'border-inline',
        'border-inline-color',
        'border-inline-end',
        'border-inline-end-color',
        'border-inline-end-style',
        'border-inline-end-width',
        'border-inline-start',
        'border-inline-start-color',
        'border-inline-start-style',
        'border-inline-start-width',
        'border-inline-style',
        'border-inline-width',
        'content-visibility',
        'margin-block',
        'margin-block-end',
        'margin-block-start',
        'margin-inline',
        'margin-inline-end',
        'margin-inline-start',
        'overflow-anchor',
        'overscroll-behavior',
        'padding-block',
        'padding-block-end',
        'padding-block-start',
        'padding-inline',
        'padding-inline-end',
        'padding-inline-start',
        'scroll-snap-stop',
        'scrollbar-3d-light-color',
        'scrollbar-arrow-color',
        'scrollbar-base-color',
        'scrollbar-dark-shadow-color',
        'scrollbar-face-color',
        'scrollbar-highlight-color',
        'scrollbar-shadow-color',
        'scrollbar-track-color',
        'searchfield-cancel-button',
        'searchfield-decoration',
        'searchfield-results-button',
        'searchfield-results-decoration',
        'shape-inside',
        'zoom',
      ],
      Ee = Pe(ce),
      Se = [
        'font-display',
        'font-family',
        'src',
        'unicode-range',
        'font-variant',
        'font-feature-settings',
        'font-stretch',
        'font-weight',
        'font-style',
      ],
      Ae = Pe(Se),
      re = [
        'additive-symbols',
        'fallback',
        'negative',
        'pad',
        'prefix',
        'range',
        'speak-as',
        'suffix',
        'symbols',
        'system',
      ],
      J = Pe(re),
      te = [
        'aliceblue',
        'antiquewhite',
        'aqua',
        'aquamarine',
        'azure',
        'beige',
        'bisque',
        'black',
        'blanchedalmond',
        'blue',
        'blueviolet',
        'brown',
        'burlywood',
        'cadetblue',
        'chartreuse',
        'chocolate',
        'coral',
        'cornflowerblue',
        'cornsilk',
        'crimson',
        'cyan',
        'darkblue',
        'darkcyan',
        'darkgoldenrod',
        'darkgray',
        'darkgreen',
        'darkgrey',
        'darkkhaki',
        'darkmagenta',
        'darkolivegreen',
        'darkorange',
        'darkorchid',
        'darkred',
        'darksalmon',
        'darkseagreen',
        'darkslateblue',
        'darkslategray',
        'darkslategrey',
        'darkturquoise',
        'darkviolet',
        'deeppink',
        'deepskyblue',
        'dimgray',
        'dimgrey',
        'dodgerblue',
        'firebrick',
        'floralwhite',
        'forestgreen',
        'fuchsia',
        'gainsboro',
        'ghostwhite',
        'gold',
        'goldenrod',
        'gray',
        'grey',
        'green',
        'greenyellow',
        'honeydew',
        'hotpink',
        'indianred',
        'indigo',
        'ivory',
        'khaki',
        'lavender',
        'lavenderblush',
        'lawngreen',
        'lemonchiffon',
        'lightblue',
        'lightcoral',
        'lightcyan',
        'lightgoldenrodyellow',
        'lightgray',
        'lightgreen',
        'lightgrey',
        'lightpink',
        'lightsalmon',
        'lightseagreen',
        'lightskyblue',
        'lightslategray',
        'lightslategrey',
        'lightsteelblue',
        'lightyellow',
        'lime',
        'limegreen',
        'linen',
        'magenta',
        'maroon',
        'mediumaquamarine',
        'mediumblue',
        'mediumorchid',
        'mediumpurple',
        'mediumseagreen',
        'mediumslateblue',
        'mediumspringgreen',
        'mediumturquoise',
        'mediumvioletred',
        'midnightblue',
        'mintcream',
        'mistyrose',
        'moccasin',
        'navajowhite',
        'navy',
        'oldlace',
        'olive',
        'olivedrab',
        'orange',
        'orangered',
        'orchid',
        'palegoldenrod',
        'palegreen',
        'paleturquoise',
        'palevioletred',
        'papayawhip',
        'peachpuff',
        'peru',
        'pink',
        'plum',
        'powderblue',
        'purple',
        'rebeccapurple',
        'red',
        'rosybrown',
        'royalblue',
        'saddlebrown',
        'salmon',
        'sandybrown',
        'seagreen',
        'seashell',
        'sienna',
        'silver',
        'skyblue',
        'slateblue',
        'slategray',
        'slategrey',
        'snow',
        'springgreen',
        'steelblue',
        'tan',
        'teal',
        'thistle',
        'tomato',
        'turquoise',
        'violet',
        'wheat',
        'white',
        'whitesmoke',
        'yellow',
        'yellowgreen',
      ],
      xe = Pe(te),
      Be = [
        'above',
        'absolute',
        'activeborder',
        'additive',
        'activecaption',
        'afar',
        'after-white-space',
        'ahead',
        'alias',
        'all',
        'all-scroll',
        'alphabetic',
        'alternate',
        'always',
        'amharic',
        'amharic-abegede',
        'antialiased',
        'appworkspace',
        'arabic-indic',
        'armenian',
        'asterisks',
        'attr',
        'auto',
        'auto-flow',
        'avoid',
        'avoid-column',
        'avoid-page',
        'avoid-region',
        'axis-pan',
        'background',
        'backwards',
        'baseline',
        'below',
        'bidi-override',
        'binary',
        'bengali',
        'blink',
        'block',
        'block-axis',
        'blur',
        'bold',
        'bolder',
        'border',
        'border-box',
        'both',
        'bottom',
        'break',
        'break-all',
        'break-word',
        'brightness',
        'bullets',
        'button',
        'buttonface',
        'buttonhighlight',
        'buttonshadow',
        'buttontext',
        'calc',
        'cambodian',
        'capitalize',
        'caps-lock-indicator',
        'caption',
        'captiontext',
        'caret',
        'cell',
        'center',
        'checkbox',
        'circle',
        'cjk-decimal',
        'cjk-earthly-branch',
        'cjk-heavenly-stem',
        'cjk-ideographic',
        'clear',
        'clip',
        'close-quote',
        'col-resize',
        'collapse',
        'color',
        'color-burn',
        'color-dodge',
        'column',
        'column-reverse',
        'compact',
        'condensed',
        'conic-gradient',
        'contain',
        'content',
        'contents',
        'content-box',
        'context-menu',
        'continuous',
        'contrast',
        'copy',
        'counter',
        'counters',
        'cover',
        'crop',
        'cross',
        'crosshair',
        'cubic-bezier',
        'currentcolor',
        'cursive',
        'cyclic',
        'darken',
        'dashed',
        'decimal',
        'decimal-leading-zero',
        'default',
        'default-button',
        'dense',
        'destination-atop',
        'destination-in',
        'destination-out',
        'destination-over',
        'devanagari',
        'difference',
        'disc',
        'discard',
        'disclosure-closed',
        'disclosure-open',
        'document',
        'dot-dash',
        'dot-dot-dash',
        'dotted',
        'double',
        'down',
        'drop-shadow',
        'e-resize',
        'ease',
        'ease-in',
        'ease-in-out',
        'ease-out',
        'element',
        'ellipse',
        'ellipsis',
        'embed',
        'end',
        'ethiopic',
        'ethiopic-abegede',
        'ethiopic-abegede-am-et',
        'ethiopic-abegede-gez',
        'ethiopic-abegede-ti-er',
        'ethiopic-abegede-ti-et',
        'ethiopic-halehame-aa-er',
        'ethiopic-halehame-aa-et',
        'ethiopic-halehame-am-et',
        'ethiopic-halehame-gez',
        'ethiopic-halehame-om-et',
        'ethiopic-halehame-sid-et',
        'ethiopic-halehame-so-et',
        'ethiopic-halehame-ti-er',
        'ethiopic-halehame-ti-et',
        'ethiopic-halehame-tig',
        'ethiopic-numeric',
        'ew-resize',
        'exclusion',
        'expanded',
        'extends',
        'extra-condensed',
        'extra-expanded',
        'fantasy',
        'fast',
        'fill',
        'fill-box',
        'fixed',
        'flat',
        'flex',
        'flex-end',
        'flex-start',
        'footnotes',
        'forwards',
        'from',
        'geometricPrecision',
        'georgian',
        'grayscale',
        'graytext',
        'grid',
        'groove',
        'gujarati',
        'gurmukhi',
        'hand',
        'hangul',
        'hangul-consonant',
        'hard-light',
        'hebrew',
        'help',
        'hidden',
        'hide',
        'higher',
        'highlight',
        'highlighttext',
        'hiragana',
        'hiragana-iroha',
        'horizontal',
        'hsl',
        'hsla',
        'hue',
        'hue-rotate',
        'icon',
        'ignore',
        'inactiveborder',
        'inactivecaption',
        'inactivecaptiontext',
        'infinite',
        'infobackground',
        'infotext',
        'inherit',
        'initial',
        'inline',
        'inline-axis',
        'inline-block',
        'inline-flex',
        'inline-grid',
        'inline-table',
        'inset',
        'inside',
        'intrinsic',
        'invert',
        'italic',
        'japanese-formal',
        'japanese-informal',
        'justify',
        'kannada',
        'katakana',
        'katakana-iroha',
        'keep-all',
        'khmer',
        'korean-hangul-formal',
        'korean-hanja-formal',
        'korean-hanja-informal',
        'landscape',
        'lao',
        'large',
        'larger',
        'left',
        'level',
        'lighter',
        'lighten',
        'line-through',
        'linear',
        'linear-gradient',
        'lines',
        'list-item',
        'listbox',
        'listitem',
        'local',
        'logical',
        'loud',
        'lower',
        'lower-alpha',
        'lower-armenian',
        'lower-greek',
        'lower-hexadecimal',
        'lower-latin',
        'lower-norwegian',
        'lower-roman',
        'lowercase',
        'ltr',
        'luminosity',
        'malayalam',
        'manipulation',
        'match',
        'matrix',
        'matrix3d',
        'media-play-button',
        'media-slider',
        'media-sliderthumb',
        'media-volume-slider',
        'media-volume-sliderthumb',
        'medium',
        'menu',
        'menulist',
        'menulist-button',
        'menutext',
        'message-box',
        'middle',
        'min-intrinsic',
        'mix',
        'mongolian',
        'monospace',
        'move',
        'multiple',
        'multiple_mask_images',
        'multiply',
        'myanmar',
        'n-resize',
        'narrower',
        'ne-resize',
        'nesw-resize',
        'no-close-quote',
        'no-drop',
        'no-open-quote',
        'no-repeat',
        'none',
        'normal',
        'not-allowed',
        'nowrap',
        'ns-resize',
        'numbers',
        'numeric',
        'nw-resize',
        'nwse-resize',
        'oblique',
        'octal',
        'opacity',
        'open-quote',
        'optimizeLegibility',
        'optimizeSpeed',
        'oriya',
        'oromo',
        'outset',
        'outside',
        'outside-shape',
        'overlay',
        'overline',
        'padding',
        'padding-box',
        'painted',
        'page',
        'paused',
        'persian',
        'perspective',
        'pinch-zoom',
        'plus-darker',
        'plus-lighter',
        'pointer',
        'polygon',
        'portrait',
        'pre',
        'pre-line',
        'pre-wrap',
        'preserve-3d',
        'progress',
        'push-button',
        'radial-gradient',
        'radio',
        'read-only',
        'read-write',
        'read-write-plaintext-only',
        'rectangle',
        'region',
        'relative',
        'repeat',
        'repeating-linear-gradient',
        'repeating-radial-gradient',
        'repeating-conic-gradient',
        'repeat-x',
        'repeat-y',
        'reset',
        'reverse',
        'rgb',
        'rgba',
        'ridge',
        'right',
        'rotate',
        'rotate3d',
        'rotateX',
        'rotateY',
        'rotateZ',
        'round',
        'row',
        'row-resize',
        'row-reverse',
        'rtl',
        'run-in',
        'running',
        's-resize',
        'sans-serif',
        'saturate',
        'saturation',
        'scale',
        'scale3d',
        'scaleX',
        'scaleY',
        'scaleZ',
        'screen',
        'scroll',
        'scrollbar',
        'scroll-position',
        'se-resize',
        'searchfield',
        'searchfield-cancel-button',
        'searchfield-decoration',
        'searchfield-results-button',
        'searchfield-results-decoration',
        'self-start',
        'self-end',
        'semi-condensed',
        'semi-expanded',
        'separate',
        'sepia',
        'serif',
        'show',
        'sidama',
        'simp-chinese-formal',
        'simp-chinese-informal',
        'single',
        'skew',
        'skewX',
        'skewY',
        'skip-white-space',
        'slide',
        'slider-horizontal',
        'slider-vertical',
        'sliderthumb-horizontal',
        'sliderthumb-vertical',
        'slow',
        'small',
        'small-caps',
        'small-caption',
        'smaller',
        'soft-light',
        'solid',
        'somali',
        'source-atop',
        'source-in',
        'source-out',
        'source-over',
        'space',
        'space-around',
        'space-between',
        'space-evenly',
        'spell-out',
        'square',
        'square-button',
        'start',
        'static',
        'status-bar',
        'stretch',
        'stroke',
        'stroke-box',
        'sub',
        'subpixel-antialiased',
        'svg_masks',
        'super',
        'sw-resize',
        'symbolic',
        'symbols',
        'system-ui',
        'table',
        'table-caption',
        'table-cell',
        'table-column',
        'table-column-group',
        'table-footer-group',
        'table-header-group',
        'table-row',
        'table-row-group',
        'tamil',
        'telugu',
        'text',
        'text-bottom',
        'text-top',
        'textarea',
        'textfield',
        'thai',
        'thick',
        'thin',
        'threeddarkshadow',
        'threedface',
        'threedhighlight',
        'threedlightshadow',
        'threedshadow',
        'tibetan',
        'tigre',
        'tigrinya-er',
        'tigrinya-er-abegede',
        'tigrinya-et',
        'tigrinya-et-abegede',
        'to',
        'top',
        'trad-chinese-formal',
        'trad-chinese-informal',
        'transform',
        'translate',
        'translate3d',
        'translateX',
        'translateY',
        'translateZ',
        'transparent',
        'ultra-condensed',
        'ultra-expanded',
        'underline',
        'unidirectional-pan',
        'unset',
        'up',
        'upper-alpha',
        'upper-armenian',
        'upper-greek',
        'upper-hexadecimal',
        'upper-latin',
        'upper-norwegian',
        'upper-roman',
        'uppercase',
        'urdu',
        'url',
        'var',
        'vertical',
        'vertical-text',
        'view-box',
        'visible',
        'visibleFill',
        'visiblePainted',
        'visibleStroke',
        'visual',
        'w-resize',
        'wait',
        'wave',
        'wider',
        'window',
        'windowframe',
        'windowtext',
        'words',
        'wrap',
        'wrap-reverse',
        'x-large',
        'x-small',
        'xor',
        'xx-large',
        'xx-small',
      ],
      ye = Pe(Be),
      Le = we.concat($e).concat(M).concat(W).concat(G).concat(ce).concat(te).concat(Be)
    I.registerHelper('hintWords', 'css', Le)
    function Re($, X) {
      for (var me = !1, L; (L = $.next()) != null; ) {
        if (me && L == '/') {
          X.tokenize = null
          break
        }
        me = L == '*'
      }
      return ['comment', 'comment']
    }
    I.defineMIME('text/css', {
      documentTypes: He,
      mediaTypes: Ce,
      mediaFeatures: j,
      mediaValueKeywords: ee,
      propertyKeywords: ue,
      nonStandardPropertyKeywords: Ee,
      fontProperties: Ae,
      counterDescriptors: J,
      colorKeywords: xe,
      valueKeywords: ye,
      tokenHooks: {
        '/': function ($, X) {
          return $.eat('*') ? ((X.tokenize = Re), Re($, X)) : !1
        },
      },
      name: 'css',
    }),
      I.defineMIME('text/x-scss', {
        mediaTypes: Ce,
        mediaFeatures: j,
        mediaValueKeywords: ee,
        propertyKeywords: ue,
        nonStandardPropertyKeywords: Ee,
        colorKeywords: xe,
        valueKeywords: ye,
        fontProperties: Ae,
        allowNested: !0,
        lineComment: '//',
        tokenHooks: {
          '/': function ($, X) {
            return $.eat('/')
              ? ($.skipToEnd(), ['comment', 'comment'])
              : $.eat('*')
              ? ((X.tokenize = Re), Re($, X))
              : ['operator', 'operator']
          },
          ':': function ($) {
            return $.match(/^\s*\{/, !1) ? [null, null] : !1
          },
          $: function ($) {
            return (
              $.match(/^[\w-]+/),
              $.match(/^\s*:/, !1) ? ['variable-2', 'variable-definition'] : ['variable-2', 'variable']
            )
          },
          '#': function ($) {
            return $.eat('{') ? [null, 'interpolation'] : !1
          },
        },
        name: 'css',
        helperType: 'scss',
      }),
      I.defineMIME('text/x-less', {
        mediaTypes: Ce,
        mediaFeatures: j,
        mediaValueKeywords: ee,
        propertyKeywords: ue,
        nonStandardPropertyKeywords: Ee,
        colorKeywords: xe,
        valueKeywords: ye,
        fontProperties: Ae,
        allowNested: !0,
        lineComment: '//',
        tokenHooks: {
          '/': function ($, X) {
            return $.eat('/')
              ? ($.skipToEnd(), ['comment', 'comment'])
              : $.eat('*')
              ? ((X.tokenize = Re), Re($, X))
              : ['operator', 'operator']
          },
          '@': function ($) {
            return $.eat('{')
              ? [null, 'interpolation']
              : $.match(
                  /^(charset|document|font-face|import|(-(moz|ms|o|webkit)-)?keyframes|media|namespace|page|supports)\b/i,
                  !1,
                )
              ? !1
              : ($.eatWhile(/[\w\\\-]/),
                $.match(/^\s*:/, !1) ? ['variable-2', 'variable-definition'] : ['variable-2', 'variable'])
          },
          '&': function () {
            return ['atom', 'atom']
          },
        },
        name: 'css',
        helperType: 'less',
      }),
      I.defineMIME('text/x-gss', {
        documentTypes: He,
        mediaTypes: Ce,
        mediaFeatures: j,
        propertyKeywords: ue,
        nonStandardPropertyKeywords: Ee,
        fontProperties: Ae,
        counterDescriptors: J,
        colorKeywords: xe,
        valueKeywords: ye,
        supportsAtComponent: !0,
        tokenHooks: {
          '/': function ($, X) {
            return $.eat('*') ? ((X.tokenize = Re), Re($, X)) : !1
          },
        },
        name: 'css',
        helperType: 'gss',
      })
  })
})()
var mu = yu.exports,
  fa = { exports: {} },
  ca
function bu() {
  return (
    ca ||
      ((ca = 1),
      (function (mr, Or) {
        ;(function (I) {
          I(Ar)
        })(function (I) {
          var Pe = {
              autoSelfClosers: {
                area: !0,
                base: !0,
                br: !0,
                col: !0,
                command: !0,
                embed: !0,
                frame: !0,
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
                menuitem: !0,
              },
              implicitlyClosed: {
                dd: !0,
                li: !0,
                optgroup: !0,
                option: !0,
                p: !0,
                rp: !0,
                rt: !0,
                tbody: !0,
                td: !0,
                tfoot: !0,
                th: !0,
                tr: !0,
              },
              contextGrabbers: {
                dd: { dd: !0, dt: !0 },
                dt: { dd: !0, dt: !0 },
                li: { li: !0 },
                option: { option: !0, optgroup: !0 },
                optgroup: { optgroup: !0 },
                p: {
                  address: !0,
                  article: !0,
                  aside: !0,
                  blockquote: !0,
                  dir: !0,
                  div: !0,
                  dl: !0,
                  fieldset: !0,
                  footer: !0,
                  form: !0,
                  h1: !0,
                  h2: !0,
                  h3: !0,
                  h4: !0,
                  h5: !0,
                  h6: !0,
                  header: !0,
                  hgroup: !0,
                  hr: !0,
                  menu: !0,
                  nav: !0,
                  ol: !0,
                  p: !0,
                  pre: !0,
                  section: !0,
                  table: !0,
                  ul: !0,
                },
                rp: { rp: !0, rt: !0 },
                rt: { rp: !0, rt: !0 },
                tbody: { tbody: !0, tfoot: !0 },
                td: { td: !0, th: !0 },
                tfoot: { tbody: !0 },
                th: { td: !0, th: !0 },
                thead: { tbody: !0, tfoot: !0 },
                tr: { tr: !0 },
              },
              doNotIndent: { pre: !0 },
              allowUnquoted: !0,
              allowMissing: !0,
              caseFold: !0,
            },
            we = {
              autoSelfClosers: {},
              implicitlyClosed: {},
              contextGrabbers: {},
              doNotIndent: {},
              allowUnquoted: !1,
              allowMissing: !1,
              allowMissingTagName: !1,
              caseFold: !1,
            }
          I.defineMode('xml', function (He, $e) {
            var Ce = He.indentUnit,
              M = {},
              j = $e.htmlMode ? Pe : we
            for (var W in j) M[W] = j[W]
            for (var W in $e) M[W] = $e[W]
            var ee, G
            function ue(c, w) {
              function x(D) {
                return (w.tokenize = D), D(c, w)
              }
              var v = c.next()
              if (v == '<')
                return c.eat('!')
                  ? c.eat('[')
                    ? c.match('CDATA[')
                      ? x(Se('atom', ']]>'))
                      : null
                    : c.match('--')
                    ? x(Se('comment', '-->'))
                    : c.match('DOCTYPE', !0, !0)
                    ? (c.eatWhile(/[\w\._\-]/), x(Ae(1)))
                    : null
                  : c.eat('?')
                  ? (c.eatWhile(/[\w\._\-]/), (w.tokenize = Se('meta', '?>')), 'meta')
                  : ((ee = c.eat('/') ? 'closeTag' : 'openTag'), (w.tokenize = ce), 'tag bracket')
              if (v == '&') {
                var y
                return (
                  c.eat('#')
                    ? c.eat('x')
                      ? (y = c.eatWhile(/[a-fA-F\d]/) && c.eat(';'))
                      : (y = c.eatWhile(/[\d]/) && c.eat(';'))
                    : (y = c.eatWhile(/[\w\.\-:]/) && c.eat(';')),
                  y ? 'atom' : 'error'
                )
              } else return c.eatWhile(/[^&<]/), null
            }
            ue.isInText = !0
            function ce(c, w) {
              var x = c.next()
              if (x == '>' || (x == '/' && c.eat('>')))
                return (w.tokenize = ue), (ee = x == '>' ? 'endTag' : 'selfcloseTag'), 'tag bracket'
              if (x == '=') return (ee = 'equals'), null
              if (x == '<') {
                ;(w.tokenize = ue), (w.state = Be), (w.tagName = w.tagStart = null)
                var v = w.tokenize(c, w)
                return v ? v + ' tag error' : 'tag error'
              } else
                return /[\'\"]/.test(x)
                  ? ((w.tokenize = Ee(x)), (w.stringStartCol = c.column()), w.tokenize(c, w))
                  : (c.match(/^[^\s\u00a0=<>\"\']*[^\s\u00a0=<>\"\'\/]/), 'word')
            }
            function Ee(c) {
              var w = function (x, v) {
                for (; !x.eol(); )
                  if (x.next() == c) {
                    v.tokenize = ce
                    break
                  }
                return 'string'
              }
              return (w.isInAttribute = !0), w
            }
            function Se(c, w) {
              return function (x, v) {
                for (; !x.eol(); ) {
                  if (x.match(w)) {
                    v.tokenize = ue
                    break
                  }
                  x.next()
                }
                return c
              }
            }
            function Ae(c) {
              return function (w, x) {
                for (var v; (v = w.next()) != null; ) {
                  if (v == '<') return (x.tokenize = Ae(c + 1)), x.tokenize(w, x)
                  if (v == '>')
                    if (c == 1) {
                      x.tokenize = ue
                      break
                    } else return (x.tokenize = Ae(c - 1)), x.tokenize(w, x)
                }
                return 'meta'
              }
            }
            function re(c) {
              return c && c.toLowerCase()
            }
            function J(c, w, x) {
              ;(this.prev = c.context),
                (this.tagName = w || ''),
                (this.indent = c.indented),
                (this.startOfLine = x),
                (M.doNotIndent.hasOwnProperty(w) || (c.context && c.context.noIndent)) && (this.noIndent = !0)
            }
            function te(c) {
              c.context && (c.context = c.context.prev)
            }
            function xe(c, w) {
              for (var x; ; ) {
                if (
                  !c.context ||
                  ((x = c.context.tagName),
                  !M.contextGrabbers.hasOwnProperty(re(x)) || !M.contextGrabbers[re(x)].hasOwnProperty(re(w)))
                )
                  return
                te(c)
              }
            }
            function Be(c, w, x) {
              return c == 'openTag' ? ((x.tagStart = w.column()), ye) : c == 'closeTag' ? Le : Be
            }
            function ye(c, w, x) {
              return c == 'word'
                ? ((x.tagName = w.current()), (G = 'tag'), X)
                : M.allowMissingTagName && c == 'endTag'
                ? ((G = 'tag bracket'), X(c, w, x))
                : ((G = 'error'), ye)
            }
            function Le(c, w, x) {
              if (c == 'word') {
                var v = w.current()
                return (
                  x.context &&
                    x.context.tagName != v &&
                    M.implicitlyClosed.hasOwnProperty(re(x.context.tagName)) &&
                    te(x),
                  (x.context && x.context.tagName == v) || M.matchClosing === !1
                    ? ((G = 'tag'), Re)
                    : ((G = 'tag error'), $)
                )
              } else
                return M.allowMissingTagName && c == 'endTag' ? ((G = 'tag bracket'), Re(c, w, x)) : ((G = 'error'), $)
            }
            function Re(c, w, x) {
              return c != 'endTag' ? ((G = 'error'), Re) : (te(x), Be)
            }
            function $(c, w, x) {
              return (G = 'error'), Re(c, w, x)
            }
            function X(c, w, x) {
              if (c == 'word') return (G = 'attribute'), me
              if (c == 'endTag' || c == 'selfcloseTag') {
                var v = x.tagName,
                  y = x.tagStart
                return (
                  (x.tagName = x.tagStart = null),
                  c == 'selfcloseTag' || M.autoSelfClosers.hasOwnProperty(re(v))
                    ? xe(x, v)
                    : (xe(x, v), (x.context = new J(x, v, y == x.indented))),
                  Be
                )
              }
              return (G = 'error'), X
            }
            function me(c, w, x) {
              return c == 'equals' ? L : (M.allowMissing || (G = 'error'), X(c, w, x))
            }
            function L(c, w, x) {
              return c == 'string'
                ? _
                : c == 'word' && M.allowUnquoted
                ? ((G = 'string'), X)
                : ((G = 'error'), X(c, w, x))
            }
            function _(c, w, x) {
              return c == 'string' ? _ : X(c, w, x)
            }
            return {
              startState: function (c) {
                var w = { tokenize: ue, state: Be, indented: c || 0, tagName: null, tagStart: null, context: null }
                return c != null && (w.baseIndent = c), w
              },
              token: function (c, w) {
                if ((!w.tagName && c.sol() && (w.indented = c.indentation()), c.eatSpace())) return null
                ee = null
                var x = w.tokenize(c, w)
                return (
                  (x || ee) &&
                    x != 'comment' &&
                    ((G = null), (w.state = w.state(ee || x, c, w)), G && (x = G == 'error' ? x + ' error' : G)),
                  x
                )
              },
              indent: function (c, w, x) {
                var v = c.context
                if (c.tokenize.isInAttribute) return c.tagStart == c.indented ? c.stringStartCol + 1 : c.indented + Ce
                if (v && v.noIndent) return I.Pass
                if (c.tokenize != ce && c.tokenize != ue) return x ? x.match(/^(\s*)/)[0].length : 0
                if (c.tagName)
                  return M.multilineTagIndentPastTag !== !1
                    ? c.tagStart + c.tagName.length + 2
                    : c.tagStart + Ce * (M.multilineTagIndentFactor || 1)
                if (M.alignCDATA && /<!\[CDATA\[/.test(w)) return 0
                var y = w && /^<(\/)?([\w_:\.-]*)/.exec(w)
                if (y && y[1])
                  for (; v; )
                    if (v.tagName == y[2]) {
                      v = v.prev
                      break
                    } else if (M.implicitlyClosed.hasOwnProperty(re(v.tagName))) v = v.prev
                    else break
                else if (y)
                  for (; v; ) {
                    var D = M.contextGrabbers[re(v.tagName)]
                    if (D && D.hasOwnProperty(re(y[2]))) v = v.prev
                    else break
                  }
                for (; v && v.prev && !v.startOfLine; ) v = v.prev
                return v ? v.indent + Ce : c.baseIndent || 0
              },
              electricInput: /<\/[\s\w:]+>$/,
              blockCommentStart: '<!--',
              blockCommentEnd: '-->',
              configuration: M.htmlMode ? 'html' : 'xml',
              helperType: M.htmlMode ? 'html' : 'xml',
              skipAttribute: function (c) {
                c.state == L && (c.state = X)
              },
              xmlCurrentTag: function (c) {
                return c.tagName ? { name: c.tagName, close: c.type == 'closeTag' } : null
              },
              xmlCurrentContext: function (c) {
                for (var w = [], x = c.context; x; x = x.prev) w.push(x.tagName)
                return w.reverse()
              },
            }
          }),
            I.defineMIME('text/xml', 'xml'),
            I.defineMIME('application/xml', 'xml'),
            I.mimeModes.hasOwnProperty('text/html') || I.defineMIME('text/html', { name: 'xml', htmlMode: !0 })
        })
      })()),
    fa.exports
  )
}
var da = { exports: {} },
  ha
function va() {
  return (
    ha ||
      ((ha = 1),
      (function (mr, Or) {
        ;(function (I) {
          I(Ar)
        })(function (I) {
          I.defineMode('javascript', function (Pe, we) {
            var He = Pe.indentUnit,
              $e = we.statementIndent,
              Ce = we.jsonld,
              M = we.json || Ce,
              j = we.trackScope !== !1,
              W = we.typescript,
              ee = we.wordCharacters || /[\w$\xa1-\uffff]/,
              G = (function () {
                function f(et) {
                  return { type: et, style: 'keyword' }
                }
                var p = f('keyword a'),
                  g = f('keyword b'),
                  S = f('keyword c'),
                  oe = f('keyword d'),
                  ke = f('operator'),
                  Me = { type: 'atom', style: 'atom' }
                return {
                  if: f('if'),
                  while: p,
                  with: p,
                  else: g,
                  do: g,
                  try: g,
                  finally: g,
                  return: oe,
                  break: oe,
                  continue: oe,
                  new: f('new'),
                  delete: S,
                  void: S,
                  throw: S,
                  debugger: f('debugger'),
                  var: f('var'),
                  const: f('var'),
                  let: f('var'),
                  function: f('function'),
                  catch: f('catch'),
                  for: f('for'),
                  switch: f('switch'),
                  case: f('case'),
                  default: f('default'),
                  in: ke,
                  typeof: ke,
                  instanceof: ke,
                  true: Me,
                  false: Me,
                  null: Me,
                  undefined: Me,
                  NaN: Me,
                  Infinity: Me,
                  this: f('this'),
                  class: f('class'),
                  super: f('atom'),
                  yield: S,
                  export: f('export'),
                  import: f('import'),
                  extends: S,
                  await: S,
                }
              })(),
              ue = /[+\-*&%=<>!?|~^@]/,
              ce = /^@(context|id|value|language|type|container|list|set|reverse|index|base|vocab|graph)"/
            function Ee(f) {
              for (var p = !1, g, S = !1; (g = f.next()) != null; ) {
                if (!p) {
                  if (g == '/' && !S) return
                  g == '[' ? (S = !0) : S && g == ']' && (S = !1)
                }
                p = !p && g == '\\'
              }
            }
            var Se, Ae
            function re(f, p, g) {
              return (Se = f), (Ae = g), p
            }
            function J(f, p) {
              var g = f.next()
              if (g == '"' || g == "'") return (p.tokenize = te(g)), p.tokenize(f, p)
              if (g == '.' && f.match(/^\d[\d_]*(?:[eE][+\-]?[\d_]+)?/)) return re('number', 'number')
              if (g == '.' && f.match('..')) return re('spread', 'meta')
              if (/[\[\]{}\(\),;\:\.]/.test(g)) return re(g)
              if (g == '=' && f.eat('>')) return re('=>', 'operator')
              if (g == '0' && f.match(/^(?:x[\dA-Fa-f_]+|o[0-7_]+|b[01_]+)n?/)) return re('number', 'number')
              if (/\d/.test(g))
                return f.match(/^[\d_]*(?:n|(?:\.[\d_]*)?(?:[eE][+\-]?[\d_]+)?)?/), re('number', 'number')
              if (g == '/')
                return f.eat('*')
                  ? ((p.tokenize = xe), xe(f, p))
                  : f.eat('/')
                  ? (f.skipToEnd(), re('comment', 'comment'))
                  : Gt(f, p, 1)
                  ? (Ee(f), f.match(/^\b(([gimyus])(?![gimyus]*\2))+\b/), re('regexp', 'string-2'))
                  : (f.eat('='), re('operator', 'operator', f.current()))
              if (g == '`') return (p.tokenize = Be), Be(f, p)
              if (g == '#' && f.peek() == '!') return f.skipToEnd(), re('meta', 'meta')
              if (g == '#' && f.eatWhile(ee)) return re('variable', 'property')
              if ((g == '<' && f.match('!--')) || (g == '-' && f.match('->') && !/\S/.test(f.string.slice(0, f.start))))
                return f.skipToEnd(), re('comment', 'comment')
              if (ue.test(g))
                return (
                  (g != '>' || !p.lexical || p.lexical.type != '>') &&
                    (f.eat('=')
                      ? (g == '!' || g == '=') && f.eat('=')
                      : /[<>*+\-|&?]/.test(g) && (f.eat(g), g == '>' && f.eat(g))),
                  g == '?' && f.eat('.') ? re('.') : re('operator', 'operator', f.current())
                )
              if (ee.test(g)) {
                f.eatWhile(ee)
                var S = f.current()
                if (p.lastType != '.') {
                  if (G.propertyIsEnumerable(S)) {
                    var oe = G[S]
                    return re(oe.type, oe.style, S)
                  }
                  if (S == 'async' && f.match(/^(\s|\/\*([^*]|\*(?!\/))*?\*\/)*[\[\(\w]/, !1))
                    return re('async', 'keyword', S)
                }
                return re('variable', 'variable', S)
              }
            }
            function te(f) {
              return function (p, g) {
                var S = !1,
                  oe
                if (Ce && p.peek() == '@' && p.match(ce)) return (g.tokenize = J), re('jsonld-keyword', 'meta')
                for (; (oe = p.next()) != null && !(oe == f && !S); ) S = !S && oe == '\\'
                return S || (g.tokenize = J), re('string', 'string')
              }
            }
            function xe(f, p) {
              for (var g = !1, S; (S = f.next()); ) {
                if (S == '/' && g) {
                  p.tokenize = J
                  break
                }
                g = S == '*'
              }
              return re('comment', 'comment')
            }
            function Be(f, p) {
              for (var g = !1, S; (S = f.next()) != null; ) {
                if (!g && (S == '`' || (S == '$' && f.eat('{')))) {
                  p.tokenize = J
                  break
                }
                g = !g && S == '\\'
              }
              return re('quasi', 'string-2', f.current())
            }
            var ye = '([{}])'
            function Le(f, p) {
              p.fatArrowAt && (p.fatArrowAt = null)
              var g = f.string.indexOf('=>', f.start)
              if (!(g < 0)) {
                if (W) {
                  var S = /:\s*(?:\w+(?:<[^>]*>|\[\])?|\{[^}]*\})\s*$/.exec(f.string.slice(f.start, g))
                  S && (g = S.index)
                }
                for (var oe = 0, ke = !1, Me = g - 1; Me >= 0; --Me) {
                  var et = f.string.charAt(Me),
                    Dt = ye.indexOf(et)
                  if (Dt >= 0 && Dt < 3) {
                    if (!oe) {
                      ++Me
                      break
                    }
                    if (--oe == 0) {
                      et == '(' && (ke = !0)
                      break
                    }
                  } else if (Dt >= 3 && Dt < 6) ++oe
                  else if (ee.test(et)) ke = !0
                  else if (/["'\/`]/.test(et))
                    for (; ; --Me) {
                      if (Me == 0) return
                      var le = f.string.charAt(Me - 1)
                      if (le == et && f.string.charAt(Me - 2) != '\\') {
                        Me--
                        break
                      }
                    }
                  else if (ke && !oe) {
                    ++Me
                    break
                  }
                }
                ke && !oe && (p.fatArrowAt = Me)
              }
            }
            var Re = {
              atom: !0,
              number: !0,
              variable: !0,
              string: !0,
              regexp: !0,
              this: !0,
              import: !0,
              'jsonld-keyword': !0,
            }
            function $(f, p, g, S, oe, ke) {
              ;(this.indented = f),
                (this.column = p),
                (this.type = g),
                (this.prev = oe),
                (this.info = ke),
                S != null && (this.align = S)
            }
            function X(f, p) {
              if (!j) return !1
              for (var g = f.localVars; g; g = g.next) if (g.name == p) return !0
              for (var S = f.context; S; S = S.prev) for (var g = S.vars; g; g = g.next) if (g.name == p) return !0
            }
            function me(f, p, g, S, oe) {
              var ke = f.cc
              for (
                L.state = f,
                  L.stream = oe,
                  L.marked = null,
                  L.cc = ke,
                  L.style = p,
                  f.lexical.hasOwnProperty('align') || (f.lexical.align = !0);
                ;

              ) {
                var Me = ke.length ? ke.pop() : M ? ie : se
                if (Me(g, S)) {
                  for (; ke.length && ke[ke.length - 1].lex; ) ke.pop()()
                  return L.marked ? L.marked : g == 'variable' && X(f, S) ? 'variable-2' : p
                }
              }
            }
            var L = { state: null, column: null, marked: null, cc: null }
            function _() {
              for (var f = arguments.length - 1; f >= 0; f--) L.cc.push(arguments[f])
            }
            function c() {
              return _.apply(null, arguments), !0
            }
            function w(f, p) {
              for (var g = p; g; g = g.next) if (g.name == f) return !0
              return !1
            }
            function x(f) {
              var p = L.state
              if (((L.marked = 'def'), !!j)) {
                if (p.context) {
                  if (p.lexical.info == 'var' && p.context && p.context.block) {
                    var g = v(f, p.context)
                    if (g != null) {
                      p.context = g
                      return
                    }
                  } else if (!w(f, p.localVars)) {
                    p.localVars = new B(f, p.localVars)
                    return
                  }
                }
                we.globalVars && !w(f, p.globalVars) && (p.globalVars = new B(f, p.globalVars))
              }
            }
            function v(f, p) {
              if (p)
                if (p.block) {
                  var g = v(f, p.prev)
                  return g ? (g == p.prev ? p : new D(g, p.vars, !0)) : null
                } else return w(f, p.vars) ? p : new D(p.prev, new B(f, p.vars), !1)
              else return null
            }
            function y(f) {
              return f == 'public' || f == 'private' || f == 'protected' || f == 'abstract' || f == 'readonly'
            }
            function D(f, p, g) {
              ;(this.prev = f), (this.vars = p), (this.block = g)
            }
            function B(f, p) {
              ;(this.name = f), (this.next = p)
            }
            var Q = new B('this', new B('arguments', null))
            function ae() {
              ;(L.state.context = new D(L.state.context, L.state.localVars, !1)), (L.state.localVars = Q)
            }
            function Ze() {
              ;(L.state.context = new D(L.state.context, L.state.localVars, !0)), (L.state.localVars = null)
            }
            ae.lex = Ze.lex = !0
            function We() {
              ;(L.state.localVars = L.state.context.vars), (L.state.context = L.state.context.prev)
            }
            We.lex = !0
            function V(f, p) {
              var g = function () {
                var S = L.state,
                  oe = S.indented
                if (S.lexical.type == 'stat') oe = S.lexical.indented
                else for (var ke = S.lexical; ke && ke.type == ')' && ke.align; ke = ke.prev) oe = ke.indented
                S.lexical = new $(oe, L.stream.column(), f, null, S.lexical, p)
              }
              return (g.lex = !0), g
            }
            function U() {
              var f = L.state
              f.lexical.prev &&
                (f.lexical.type == ')' && (f.indented = f.lexical.indented), (f.lexical = f.lexical.prev))
            }
            U.lex = !0
            function fe(f) {
              function p(g) {
                return g == f ? c() : f == ';' || g == '}' || g == ')' || g == ']' ? _() : c(p)
              }
              return p
            }
            function se(f, p) {
              return f == 'var'
                ? c(V('vardef', p), Zt, fe(';'), U)
                : f == 'keyword a'
                ? c(V('form'), Mt, se, U)
                : f == 'keyword b'
                ? c(V('form'), se, U)
                : f == 'keyword d'
                ? L.stream.match(/^\s*$/, !1)
                  ? c()
                  : c(V('stat'), yt, fe(';'), U)
                : f == 'debugger'
                ? c(fe(';'))
                : f == '{'
                ? c(V('}'), Ze, zt, U, We)
                : f == ';'
                ? c()
                : f == 'if'
                ? (L.state.lexical.info == 'else' && L.state.cc[L.state.cc.length - 1] == U && L.state.cc.pop()(),
                  c(V('form'), Mt, se, U, zr))
                : f == 'function'
                ? c(Kt)
                : f == 'for'
                ? c(V('form'), Ze, In, se, We, U)
                : f == 'class' || (W && p == 'interface')
                ? ((L.marked = 'keyword'), c(V('form', f == 'class' ? f : p), Wn, U))
                : f == 'variable'
                ? W && p == 'declare'
                  ? ((L.marked = 'keyword'), c(se))
                  : W && (p == 'module' || p == 'enum' || p == 'type') && L.stream.match(/^\s*\w/, !1)
                  ? ((L.marked = 'keyword'),
                    p == 'enum'
                      ? c(Er)
                      : p == 'type'
                      ? c(Fn, fe('operator'), E, fe(';'))
                      : c(V('form'), mt, fe('{'), V('}'), zt, U, U))
                  : W && p == 'namespace'
                  ? ((L.marked = 'keyword'), c(V('form'), ie, se, U))
                  : W && p == 'abstract'
                  ? ((L.marked = 'keyword'), c(se))
                  : c(V('stat'), pe)
                : f == 'switch'
                ? c(V('form'), Mt, fe('{'), V('}', 'switch'), Ze, zt, U, U, We)
                : f == 'case'
                ? c(ie, fe(':'))
                : f == 'default'
                ? c(fe(':'))
                : f == 'catch'
                ? c(V('form'), ae, ge, se, U, We)
                : f == 'export'
                ? c(V('stat'), ar, U)
                : f == 'import'
                ? c(V('stat'), Qt, U)
                : f == 'async'
                ? c(se)
                : p == '@'
                ? c(ie, se)
                : _(V('stat'), ie, fe(';'), U)
            }
            function ge(f) {
              if (f == '(') return c(Wt, fe(')'))
            }
            function ie(f, p) {
              return Ot(f, p, !1)
            }
            function Ie(f, p) {
              return Ot(f, p, !0)
            }
            function Mt(f) {
              return f != '(' ? _() : c(V(')'), yt, fe(')'), U)
            }
            function Ot(f, p, g) {
              if (L.state.fatArrowAt == L.stream.start) {
                var S = g ? Oe : qe
                if (f == '(') return c(ae, V(')'), he(Wt, ')'), U, fe('=>'), S, We)
                if (f == 'variable') return _(ae, mt, fe('=>'), S, We)
              }
              var oe = g ? Ue : Te
              return Re.hasOwnProperty(f)
                ? c(oe)
                : f == 'function'
                ? c(Kt, oe)
                : f == 'class' || (W && p == 'interface')
                ? ((L.marked = 'keyword'), c(V('form'), lr, U))
                : f == 'keyword c' || f == 'async'
                ? c(g ? Ie : ie)
                : f == '('
                ? c(V(')'), yt, fe(')'), U, oe)
                : f == 'operator' || f == 'spread'
                ? c(g ? Ie : ie)
                : f == '['
                ? c(V(']'), Vt, U, oe)
                : f == '{'
                ? Nt(ne, '}', null, oe)
                : f == 'quasi'
                ? _(de, oe)
                : f == 'new'
                ? c(k(g))
                : c()
            }
            function yt(f) {
              return f.match(/[;\}\)\],]/) ? _() : _(ie)
            }
            function Te(f, p) {
              return f == ',' ? c(yt) : Ue(f, p, !1)
            }
            function Ue(f, p, g) {
              var S = g == !1 ? Te : Ue,
                oe = g == !1 ? ie : Ie
              if (f == '=>') return c(ae, g ? Oe : qe, We)
              if (f == 'operator')
                return /\+\+|--/.test(p) || (W && p == '!')
                  ? c(S)
                  : W && p == '<' && L.stream.match(/^([^<>]|<[^<>]*>)*>\s*\(/, !1)
                  ? c(V('>'), he(E, '>'), U, S)
                  : p == '?'
                  ? c(ie, fe(':'), oe)
                  : c(oe)
              if (f == 'quasi') return _(de, S)
              if (f != ';') {
                if (f == '(') return Nt(Ie, ')', 'call', S)
                if (f == '.') return c(R, S)
                if (f == '[') return c(V(']'), yt, fe(']'), U, S)
                if (W && p == 'as') return (L.marked = 'keyword'), c(E, S)
                if (f == 'regexp')
                  return (
                    (L.state.lastType = L.marked = 'operator'),
                    L.stream.backUp(L.stream.pos - L.stream.start - 1),
                    c(oe)
                  )
              }
            }
            function de(f, p) {
              return f != 'quasi' ? _() : p.slice(p.length - 2) != '${' ? c(de) : c(yt, st)
            }
            function st(f) {
              if (f == '}') return (L.marked = 'string-2'), (L.state.tokenize = Be), c(de)
            }
            function qe(f) {
              return Le(L.stream, L.state), _(f == '{' ? se : ie)
            }
            function Oe(f) {
              return Le(L.stream, L.state), _(f == '{' ? se : Ie)
            }
            function k(f) {
              return function (p) {
                return p == '.' ? c(f ? T : A) : p == 'variable' && W ? c(ft, f ? Ue : Te) : _(f ? Ie : ie)
              }
            }
            function A(f, p) {
              if (p == 'target') return (L.marked = 'keyword'), c(Te)
            }
            function T(f, p) {
              if (p == 'target') return (L.marked = 'keyword'), c(Ue)
            }
            function pe(f) {
              return f == ':' ? c(U, se) : _(Te, fe(';'), U)
            }
            function R(f) {
              if (f == 'variable') return (L.marked = 'property'), c()
            }
            function ne(f, p) {
              if (f == 'async') return (L.marked = 'property'), c(ne)
              if (f == 'variable' || L.style == 'keyword') {
                if (((L.marked = 'property'), p == 'get' || p == 'set')) return c(q)
                var g
                return (
                  W &&
                    L.state.fatArrowAt == L.stream.start &&
                    (g = L.stream.match(/^\s*:\s*/, !1)) &&
                    (L.state.fatArrowAt = L.stream.pos + g[0].length),
                  c(be)
                )
              } else {
                if (f == 'number' || f == 'string') return (L.marked = Ce ? 'property' : L.style + ' property'), c(be)
                if (f == 'jsonld-keyword') return c(be)
                if (W && y(p)) return (L.marked = 'keyword'), c(ne)
                if (f == '[') return c(ie, Pt, fe(']'), be)
                if (f == 'spread') return c(Ie, be)
                if (p == '*') return (L.marked = 'keyword'), c(ne)
                if (f == ':') return _(be)
              }
            }
            function q(f) {
              return f != 'variable' ? _(be) : ((L.marked = 'property'), c(Kt))
            }
            function be(f) {
              if (f == ':') return c(Ie)
              if (f == '(') return _(Kt)
            }
            function he(f, p, g) {
              function S(oe, ke) {
                if (g ? g.indexOf(oe) > -1 : oe == ',') {
                  var Me = L.state.lexical
                  return (
                    Me.info == 'call' && (Me.pos = (Me.pos || 0) + 1),
                    c(function (et, Dt) {
                      return et == p || Dt == p ? _() : _(f)
                    }, S)
                  )
                }
                return oe == p || ke == p ? c() : g && g.indexOf(';') > -1 ? _(f) : c(fe(p))
              }
              return function (oe, ke) {
                return oe == p || ke == p ? c() : _(f, S)
              }
            }
            function Nt(f, p, g) {
              for (var S = 3; S < arguments.length; S++) L.cc.push(arguments[S])
              return c(V(p, g), he(f, p), U)
            }
            function zt(f) {
              return f == '}' ? c() : _(se, zt)
            }
            function Pt(f, p) {
              if (W) {
                if (f == ':') return c(E)
                if (p == '?') return c(Pt)
              }
            }
            function vi(f, p) {
              if (W && (f == ':' || p == 'in')) return c(E)
            }
            function Et(f) {
              if (W && f == ':') return L.stream.match(/^\s*\w+\s+is\b/, !1) ? c(ie, Pn, E) : c(E)
            }
            function Pn(f, p) {
              if (p == 'is') return (L.marked = 'keyword'), c()
            }
            function E(f, p) {
              if (p == 'keyof' || p == 'typeof' || p == 'infer' || p == 'readonly')
                return (L.marked = 'keyword'), c(p == 'typeof' ? Ie : E)
              if (f == 'variable' || p == 'void') return (L.marked = 'type'), c(pt)
              if (p == '|' || p == '&') return c(E)
              if (f == 'string' || f == 'number' || f == 'atom') return c(pt)
              if (f == '[') return c(V(']'), he(E, ']', ','), U, pt)
              if (f == '{') return c(V('}'), ut, U, pt)
              if (f == '(') return c(he(ht, ')'), en, pt)
              if (f == '<') return c(he(E, '>'), E)
              if (f == 'quasi') return _(je, pt)
            }
            function en(f) {
              if (f == '=>') return c(E)
            }
            function ut(f) {
              return f.match(/[\}\)\]]/) ? c() : f == ',' || f == ';' ? c(ut) : _(_e, ut)
            }
            function _e(f, p) {
              if (f == 'variable' || L.style == 'keyword') return (L.marked = 'property'), c(_e)
              if (p == '?' || f == 'number' || f == 'string') return c(_e)
              if (f == ':') return c(E)
              if (f == '[') return c(fe('variable'), vi, fe(']'), _e)
              if (f == '(') return _(Ut, _e)
              if (!f.match(/[;\}\)\],]/)) return c()
            }
            function je(f, p) {
              return f != 'quasi' ? _() : p.slice(p.length - 2) != '${' ? c(je) : c(E, En)
            }
            function En(f) {
              if (f == '}') return (L.marked = 'string-2'), (L.state.tokenize = Be), c(je)
            }
            function ht(f, p) {
              return (f == 'variable' && L.stream.match(/^\s*[?:]/, !1)) || p == '?'
                ? c(ht)
                : f == ':'
                ? c(E)
                : f == 'spread'
                ? c(ht)
                : _(E)
            }
            function pt(f, p) {
              if (p == '<') return c(V('>'), he(E, '>'), U, pt)
              if (p == '|' || f == '.' || p == '&') return c(E)
              if (f == '[') return c(E, fe(']'), pt)
              if (p == 'extends' || p == 'implements') return (L.marked = 'keyword'), c(E)
              if (p == '?') return c(E, fe(':'), E)
            }
            function ft(f, p) {
              if (p == '<') return c(V('>'), he(E, '>'), U, pt)
            }
            function br() {
              return _(E, tn)
            }
            function tn(f, p) {
              if (p == '=') return c(E)
            }
            function Zt(f, p) {
              return p == 'enum' ? ((L.marked = 'keyword'), c(Er)) : _(mt, Pt, It, yi)
            }
            function mt(f, p) {
              if (W && y(p)) return (L.marked = 'keyword'), c(mt)
              if (f == 'variable') return x(p), c()
              if (f == 'spread') return c(mt)
              if (f == '[') return Nt(gi, ']')
              if (f == '{') return Nt(rn, '}')
            }
            function rn(f, p) {
              return f == 'variable' && !L.stream.match(/^\s*:/, !1)
                ? (x(p), c(It))
                : (f == 'variable' && (L.marked = 'property'),
                  f == 'spread' ? c(mt) : f == '}' ? _() : f == '[' ? c(ie, fe(']'), fe(':'), rn) : c(fe(':'), mt, It))
            }
            function gi() {
              return _(mt, It)
            }
            function It(f, p) {
              if (p == '=') return c(Ie)
            }
            function yi(f) {
              if (f == ',') return c(Zt)
            }
            function zr(f, p) {
              if (f == 'keyword b' && p == 'else') return c(V('form', 'else'), se, U)
            }
            function In(f, p) {
              if (p == 'await') return c(In)
              if (f == '(') return c(V(')'), nn, U)
            }
            function nn(f) {
              return f == 'var' ? c(Zt, or) : f == 'variable' ? c(or) : _(or)
            }
            function or(f, p) {
              return f == ')'
                ? c()
                : f == ';'
                ? c(or)
                : p == 'in' || p == 'of'
                ? ((L.marked = 'keyword'), c(ie, or))
                : _(ie, or)
            }
            function Kt(f, p) {
              if (p == '*') return (L.marked = 'keyword'), c(Kt)
              if (f == 'variable') return x(p), c(Kt)
              if (f == '(') return c(ae, V(')'), he(Wt, ')'), U, Et, se, We)
              if (W && p == '<') return c(V('>'), he(br, '>'), U, Kt)
            }
            function Ut(f, p) {
              if (p == '*') return (L.marked = 'keyword'), c(Ut)
              if (f == 'variable') return x(p), c(Ut)
              if (f == '(') return c(ae, V(')'), he(Wt, ')'), U, Et, We)
              if (W && p == '<') return c(V('>'), he(br, '>'), U, Ut)
            }
            function Fn(f, p) {
              if (f == 'keyword' || f == 'variable') return (L.marked = 'type'), c(Fn)
              if (p == '<') return c(V('>'), he(br, '>'), U)
            }
            function Wt(f, p) {
              return (
                p == '@' && c(ie, Wt),
                f == 'spread'
                  ? c(Wt)
                  : W && y(p)
                  ? ((L.marked = 'keyword'), c(Wt))
                  : W && f == 'this'
                  ? c(Pt, It)
                  : _(mt, Pt, It)
              )
            }
            function lr(f, p) {
              return f == 'variable' ? Wn(f, p) : Pr(f, p)
            }
            function Wn(f, p) {
              if (f == 'variable') return x(p), c(Pr)
            }
            function Pr(f, p) {
              if (p == '<') return c(V('>'), he(br, '>'), U, Pr)
              if (p == 'extends' || p == 'implements' || (W && f == ','))
                return p == 'implements' && (L.marked = 'keyword'), c(W ? E : ie, Pr)
              if (f == '{') return c(V('}'), Ct, U)
            }
            function Ct(f, p) {
              if (
                f == 'async' ||
                (f == 'variable' &&
                  (p == 'static' || p == 'get' || p == 'set' || (W && y(p))) &&
                  L.stream.match(/^\s+[\w$\xa1-\uffff]/, !1))
              )
                return (L.marked = 'keyword'), c(Ct)
              if (f == 'variable' || L.style == 'keyword') return (L.marked = 'property'), c(Jt, Ct)
              if (f == 'number' || f == 'string') return c(Jt, Ct)
              if (f == '[') return c(ie, Pt, fe(']'), Jt, Ct)
              if (p == '*') return (L.marked = 'keyword'), c(Ct)
              if (W && f == '(') return _(Ut, Ct)
              if (f == ';' || f == ',') return c(Ct)
              if (f == '}') return c()
              if (p == '@') return c(ie, Ct)
            }
            function Jt(f, p) {
              if (p == '!' || p == '?') return c(Jt)
              if (f == ':') return c(E, It)
              if (p == '=') return c(Ie)
              var g = L.state.lexical.prev,
                S = g && g.info == 'interface'
              return _(S ? Ut : Kt)
            }
            function ar(f, p) {
              return p == '*'
                ? ((L.marked = 'keyword'), c(K, fe(';')))
                : p == 'default'
                ? ((L.marked = 'keyword'), c(ie, fe(';')))
                : f == '{'
                ? c(he(_n, '}'), K, fe(';'))
                : _(se)
            }
            function _n(f, p) {
              if (p == 'as') return (L.marked = 'keyword'), c(fe('variable'))
              if (f == 'variable') return _(Ie, _n)
            }
            function Qt(f) {
              return f == 'string' ? c() : f == '(' ? _(ie) : f == '.' ? _(Te) : _(sr, on, K)
            }
            function sr(f, p) {
              return f == '{' ? Nt(sr, '}') : (f == 'variable' && x(p), p == '*' && (L.marked = 'keyword'), c(Xe))
            }
            function on(f) {
              if (f == ',') return c(sr, on)
            }
            function Xe(f, p) {
              if (p == 'as') return (L.marked = 'keyword'), c(sr)
            }
            function K(f, p) {
              if (p == 'from') return (L.marked = 'keyword'), c(ie)
            }
            function Vt(f) {
              return f == ']' ? c() : _(he(Ie, ']'))
            }
            function Er() {
              return _(V('form'), mt, fe('{'), V('}'), he(Ft, '}'), U, U)
            }
            function Ft() {
              return _(mt, It)
            }
            function Ne(f, p) {
              return f.lastType == 'operator' || f.lastType == ',' || ue.test(p.charAt(0)) || /[,.]/.test(p.charAt(0))
            }
            function Gt(f, p, g) {
              return (
                (p.tokenize == J &&
                  /^(?:operator|sof|keyword [bcd]|case|new|export|default|spread|[\[{}\(,;:]|=>)$/.test(p.lastType)) ||
                (p.lastType == 'quasi' && /\{\s*$/.test(f.string.slice(0, f.pos - (g || 0))))
              )
            }
            return {
              startState: function (f) {
                var p = {
                  tokenize: J,
                  lastType: 'sof',
                  cc: [],
                  lexical: new $((f || 0) - He, 0, 'block', !1),
                  localVars: we.localVars,
                  context: we.localVars && new D(null, null, !1),
                  indented: f || 0,
                }
                return we.globalVars && typeof we.globalVars == 'object' && (p.globalVars = we.globalVars), p
              },
              token: function (f, p) {
                if (
                  (f.sol() &&
                    (p.lexical.hasOwnProperty('align') || (p.lexical.align = !1),
                    (p.indented = f.indentation()),
                    Le(f, p)),
                  p.tokenize != xe && f.eatSpace())
                )
                  return null
                var g = p.tokenize(f, p)
                return Se == 'comment'
                  ? g
                  : ((p.lastType = Se == 'operator' && (Ae == '++' || Ae == '--') ? 'incdec' : Se), me(p, g, Se, Ae, f))
              },
              indent: function (f, p) {
                if (f.tokenize == xe || f.tokenize == Be) return I.Pass
                if (f.tokenize != J) return 0
                var g = p && p.charAt(0),
                  S = f.lexical,
                  oe
                if (!/^\s*else\b/.test(p))
                  for (var ke = f.cc.length - 1; ke >= 0; --ke) {
                    var Me = f.cc[ke]
                    if (Me == U) S = S.prev
                    else if (Me != zr && Me != We) break
                  }
                for (
                  ;
                  (S.type == 'stat' || S.type == 'form') &&
                  (g == '}' || ((oe = f.cc[f.cc.length - 1]) && (oe == Te || oe == Ue) && !/^[,\.=+\-*:?[\(]/.test(p)));

                )
                  S = S.prev
                $e && S.type == ')' && S.prev.type == 'stat' && (S = S.prev)
                var et = S.type,
                  Dt = g == et
                return et == 'vardef'
                  ? S.indented + (f.lastType == 'operator' || f.lastType == ',' ? S.info.length + 1 : 0)
                  : et == 'form' && g == '{'
                  ? S.indented
                  : et == 'form'
                  ? S.indented + He
                  : et == 'stat'
                  ? S.indented + (Ne(f, p) ? $e || He : 0)
                  : S.info == 'switch' && !Dt && we.doubleIndentSwitch != !1
                  ? S.indented + (/^(?:case|default)\b/.test(p) ? He : 2 * He)
                  : S.align
                  ? S.column + (Dt ? 0 : 1)
                  : S.indented + (Dt ? 0 : He)
              },
              electricInput: /^\s*(?:case .*?:|default:|\{|\})$/,
              blockCommentStart: M ? null : '/*',
              blockCommentEnd: M ? null : '*/',
              blockCommentContinue: M ? null : ' * ',
              lineComment: M ? null : '//',
              fold: 'brace',
              closeBrackets: '()[]{}\'\'""``',
              helperType: M ? 'json' : 'javascript',
              jsonldMode: Ce,
              jsonMode: M,
              expressionAllowed: Gt,
              skipExpression: function (f) {
                me(f, 'atom', 'atom', 'true', new I.StringStream('', 2, null))
              },
            }
          }),
            I.registerHelper('wordChars', 'javascript', /[\w$]/),
            I.defineMIME('text/javascript', 'javascript'),
            I.defineMIME('text/ecmascript', 'javascript'),
            I.defineMIME('application/javascript', 'javascript'),
            I.defineMIME('application/x-javascript', 'javascript'),
            I.defineMIME('application/ecmascript', 'javascript'),
            I.defineMIME('application/json', { name: 'javascript', json: !0 }),
            I.defineMIME('application/x-json', { name: 'javascript', json: !0 }),
            I.defineMIME('application/manifest+json', { name: 'javascript', json: !0 }),
            I.defineMIME('application/ld+json', { name: 'javascript', jsonld: !0 }),
            I.defineMIME('text/typescript', { name: 'javascript', typescript: !0 }),
            I.defineMIME('application/typescript', { name: 'javascript', typescript: !0 })
        })
      })()),
    da.exports
  )
}
;(function (mr, Or) {
  ;(function (I) {
    I(Ar, bu(), va(), mu)
  })(function (I) {
    var Pe = {
      script: [
        ['lang', /(javascript|babel)/i, 'javascript'],
        ['type', /^(?:text|application)\/(?:x-)?(?:java|ecma)script$|^module$|^$/i, 'javascript'],
        ['type', /./, 'text/plain'],
        [null, null, 'javascript'],
      ],
      style: [
        ['lang', /^css$/i, 'css'],
        ['type', /^(text\/)?(x-)?(stylesheet|css)$/i, 'css'],
        ['type', /./, 'text/plain'],
        [null, null, 'css'],
      ],
    }
    function we(ee, G, ue) {
      var ce = ee.current(),
        Ee = ce.search(G)
      return (
        Ee > -1
          ? ee.backUp(ce.length - Ee)
          : ce.match(/<\/?$/) && (ee.backUp(ce.length), ee.match(G, !1) || ee.match(ce)),
        ue
      )
    }
    var He = {}
    function $e(ee) {
      var G = He[ee]
      return G || (He[ee] = new RegExp('\\s+' + ee + `\\s*=\\s*('|")?([^'"]+)('|")?\\s*`))
    }
    function Ce(ee, G) {
      var ue = ee.match($e(G))
      return ue ? /^\s*(.*?)\s*$/.exec(ue[2])[1] : ''
    }
    function M(ee, G) {
      return new RegExp((G ? '^' : '') + '</\\s*' + ee + '\\s*>', 'i')
    }
    function j(ee, G) {
      for (var ue in ee)
        for (var ce = G[ue] || (G[ue] = []), Ee = ee[ue], Se = Ee.length - 1; Se >= 0; Se--) ce.unshift(Ee[Se])
    }
    function W(ee, G) {
      for (var ue = 0; ue < ee.length; ue++) {
        var ce = ee[ue]
        if (!ce[0] || ce[1].test(Ce(G, ce[0]))) return ce[2]
      }
    }
    I.defineMode(
      'htmlmixed',
      function (ee, G) {
        var ue = I.getMode(ee, {
            name: 'xml',
            htmlMode: !0,
            multilineTagIndentFactor: G.multilineTagIndentFactor,
            multilineTagIndentPastTag: G.multilineTagIndentPastTag,
            allowMissingTagName: G.allowMissingTagName,
          }),
          ce = {},
          Ee = G && G.tags,
          Se = G && G.scriptTypes
        if ((j(Pe, ce), Ee && j(Ee, ce), Se))
          for (var Ae = Se.length - 1; Ae >= 0; Ae--) ce.script.unshift(['type', Se[Ae].matches, Se[Ae].mode])
        function re(J, te) {
          var xe = ue.token(J, te.htmlState),
            Be = /\btag\b/.test(xe),
            ye
          if (
            Be &&
            !/[<>\s\/]/.test(J.current()) &&
            (ye = te.htmlState.tagName && te.htmlState.tagName.toLowerCase()) &&
            ce.hasOwnProperty(ye)
          )
            te.inTag = ye + ' '
          else if (te.inTag && Be && />$/.test(J.current())) {
            var Le = /^([\S]+) (.*)/.exec(te.inTag)
            te.inTag = null
            var Re = J.current() == '>' && W(ce[Le[1]], Le[2]),
              $ = I.getMode(ee, Re),
              X = M(Le[1], !0),
              me = M(Le[1], !1)
            ;(te.token = function (L, _) {
              return L.match(X, !1)
                ? ((_.token = re), (_.localState = _.localMode = null), null)
                : we(L, me, _.localMode.token(L, _.localState))
            }),
              (te.localMode = $),
              (te.localState = I.startState($, ue.indent(te.htmlState, '', '')))
          } else te.inTag && ((te.inTag += J.current()), J.eol() && (te.inTag += ' '))
          return xe
        }
        return {
          startState: function () {
            var J = I.startState(ue)
            return { token: re, inTag: null, localMode: null, localState: null, htmlState: J }
          },
          copyState: function (J) {
            var te
            return (
              J.localState && (te = I.copyState(J.localMode, J.localState)),
              {
                token: J.token,
                inTag: J.inTag,
                localMode: J.localMode,
                localState: te,
                htmlState: I.copyState(ue, J.htmlState),
              }
            )
          },
          token: function (J, te) {
            return te.token(J, te)
          },
          indent: function (J, te, xe) {
            return !J.localMode || /^\s*<\//.test(te)
              ? ue.indent(J.htmlState, te, xe)
              : J.localMode.indent
              ? J.localMode.indent(J.localState, te, xe)
              : I.Pass
          },
          innerMode: function (J) {
            return { state: J.localState || J.htmlState, mode: J.localMode || ue }
          },
        }
      },
      'xml',
      'javascript',
      'css',
    ),
      I.defineMIME('text/html', 'htmlmixed')
  })
})()
va()
;(function (mr, Or) {
  ;(function (I) {
    I(Ar)
  })(function (I) {
    function Pe(j) {
      return new RegExp('^((' + j.join(')|(') + '))\\b')
    }
    var we = Pe(['and', 'or', 'not', 'is']),
      He = [
        'as',
        'assert',
        'break',
        'class',
        'continue',
        'def',
        'del',
        'elif',
        'else',
        'except',
        'finally',
        'for',
        'from',
        'global',
        'if',
        'import',
        'lambda',
        'pass',
        'raise',
        'return',
        'try',
        'while',
        'with',
        'yield',
        'in',
      ],
      $e = [
        'abs',
        'all',
        'any',
        'bin',
        'bool',
        'bytearray',
        'callable',
        'chr',
        'classmethod',
        'compile',
        'complex',
        'delattr',
        'dict',
        'dir',
        'divmod',
        'enumerate',
        'eval',
        'filter',
        'float',
        'format',
        'frozenset',
        'getattr',
        'globals',
        'hasattr',
        'hash',
        'help',
        'hex',
        'id',
        'input',
        'int',
        'isinstance',
        'issubclass',
        'iter',
        'len',
        'list',
        'locals',
        'map',
        'max',
        'memoryview',
        'min',
        'next',
        'object',
        'oct',
        'open',
        'ord',
        'pow',
        'property',
        'range',
        'repr',
        'reversed',
        'round',
        'set',
        'setattr',
        'slice',
        'sorted',
        'staticmethod',
        'str',
        'sum',
        'super',
        'tuple',
        'type',
        'vars',
        'zip',
        '__import__',
        'NotImplemented',
        'Ellipsis',
        '__debug__',
      ]
    I.registerHelper('hintWords', 'python', He.concat($e).concat(['exec', 'print']))
    function Ce(j) {
      return j.scopes[j.scopes.length - 1]
    }
    I.defineMode('python', function (j, W) {
      for (
        var ee = 'error',
          G = W.delimiters || W.singleDelimiters || /^[\(\)\[\]\{\}@,:`=;\.\\]/,
          ue = [
            W.singleOperators,
            W.doubleOperators,
            W.doubleDelimiters,
            W.tripleDelimiters,
            W.operators || /^([-+*/%\/&|^]=?|[<>=]+|\/\/=?|\*\*=?|!=|[~!@]|\.\.\.)/,
          ],
          ce = 0;
        ce < ue.length;
        ce++
      )
        ue[ce] || ue.splice(ce--, 1)
      var Ee = W.hangingIndent || j.indentUnit,
        Se = He,
        Ae = $e
      W.extra_keywords != null && (Se = Se.concat(W.extra_keywords)),
        W.extra_builtins != null && (Ae = Ae.concat(W.extra_builtins))
      var re = !(W.version && Number(W.version) < 3)
      if (re) {
        var J = W.identifiers || /^[_A-Za-z\u00A1-\uFFFF][_A-Za-z0-9\u00A1-\uFFFF]*/
        ;(Se = Se.concat(['nonlocal', 'False', 'True', 'None', 'async', 'await'])),
          (Ae = Ae.concat(['ascii', 'bytes', 'exec', 'print']))
        var te = new RegExp(`^(([rbuf]|(br)|(rb)|(fr)|(rf))?('{3}|"{3}|['"]))`, 'i')
      } else {
        var J = W.identifiers || /^[_A-Za-z][_A-Za-z0-9]*/
        ;(Se = Se.concat(['exec', 'print'])),
          (Ae = Ae.concat([
            'apply',
            'basestring',
            'buffer',
            'cmp',
            'coerce',
            'execfile',
            'file',
            'intern',
            'long',
            'raw_input',
            'reduce',
            'reload',
            'unichr',
            'unicode',
            'xrange',
            'False',
            'True',
            'None',
          ]))
        var te = new RegExp(`^(([rubf]|(ur)|(br))?('{3}|"{3}|['"]))`, 'i')
      }
      var xe = Pe(Se),
        Be = Pe(Ae)
      function ye(w, x) {
        var v = w.sol() && x.lastToken != '\\'
        if ((v && (x.indent = w.indentation()), v && Ce(x).type == 'py')) {
          var y = Ce(x).offset
          if (w.eatSpace()) {
            var D = w.indentation()
            return D > y ? X(x) : D < y && L(w, x) && w.peek() != '#' && (x.errorToken = !0), null
          } else {
            var B = Le(w, x)
            return y > 0 && L(w, x) && (B += ' ' + ee), B
          }
        }
        return Le(w, x)
      }
      function Le(w, x, v) {
        if (w.eatSpace()) return null
        if (!v && w.match(/^#.*/)) return 'comment'
        if (w.match(/^[0-9\.]/, !1)) {
          var y = !1
          if (
            (w.match(/^[\d_]*\.\d+(e[\+\-]?\d+)?/i) && (y = !0),
            w.match(/^[\d_]+\.\d*/) && (y = !0),
            w.match(/^\.\d+/) && (y = !0),
            y)
          )
            return w.eat(/J/i), 'number'
          var D = !1
          if (
            (w.match(/^0x[0-9a-f_]+/i) && (D = !0),
            w.match(/^0b[01_]+/i) && (D = !0),
            w.match(/^0o[0-7_]+/i) && (D = !0),
            w.match(/^[1-9][\d_]*(e[\+\-]?[\d_]+)?/) && (w.eat(/J/i), (D = !0)),
            w.match(/^0(?![\dx])/i) && (D = !0),
            D)
          )
            return w.eat(/L/i), 'number'
        }
        if (w.match(te)) {
          var B = w.current().toLowerCase().indexOf('f') !== -1
          return B
            ? ((x.tokenize = Re(w.current(), x.tokenize)), x.tokenize(w, x))
            : ((x.tokenize = $(w.current(), x.tokenize)), x.tokenize(w, x))
        }
        for (var Q = 0; Q < ue.length; Q++) if (w.match(ue[Q])) return 'operator'
        return w.match(G)
          ? 'punctuation'
          : x.lastToken == '.' && w.match(J)
          ? 'property'
          : w.match(xe) || w.match(we)
          ? 'keyword'
          : w.match(Be)
          ? 'builtin'
          : w.match(/^(self|cls)\b/)
          ? 'variable-2'
          : w.match(J)
          ? x.lastToken == 'def' || x.lastToken == 'class'
            ? 'def'
            : 'variable'
          : (w.next(), v ? null : ee)
      }
      function Re(w, x) {
        for (; 'rubf'.indexOf(w.charAt(0).toLowerCase()) >= 0; ) w = w.substr(1)
        var v = w.length == 1,
          y = 'string'
        function D(Q) {
          return function (ae, Ze) {
            var We = Le(ae, Ze, !0)
            return (
              We == 'punctuation' &&
                (ae.current() == '{'
                  ? (Ze.tokenize = D(Q + 1))
                  : ae.current() == '}' && (Q > 1 ? (Ze.tokenize = D(Q - 1)) : (Ze.tokenize = B))),
              We
            )
          }
        }
        function B(Q, ae) {
          for (; !Q.eol(); )
            if ((Q.eatWhile(/[^'"\{\}\\]/), Q.eat('\\'))) {
              if ((Q.next(), v && Q.eol())) return y
            } else {
              if (Q.match(w)) return (ae.tokenize = x), y
              if (Q.match('{{')) return y
              if (Q.match('{', !1)) return (ae.tokenize = D(0)), Q.current() ? y : ae.tokenize(Q, ae)
              if (Q.match('}}')) return y
              if (Q.match('}')) return ee
              Q.eat(/['"]/)
            }
          if (v) {
            if (W.singleLineStringErrors) return ee
            ae.tokenize = x
          }
          return y
        }
        return (B.isString = !0), B
      }
      function $(w, x) {
        for (; 'rubf'.indexOf(w.charAt(0).toLowerCase()) >= 0; ) w = w.substr(1)
        var v = w.length == 1,
          y = 'string'
        function D(B, Q) {
          for (; !B.eol(); )
            if ((B.eatWhile(/[^'"\\]/), B.eat('\\'))) {
              if ((B.next(), v && B.eol())) return y
            } else {
              if (B.match(w)) return (Q.tokenize = x), y
              B.eat(/['"]/)
            }
          if (v) {
            if (W.singleLineStringErrors) return ee
            Q.tokenize = x
          }
          return y
        }
        return (D.isString = !0), D
      }
      function X(w) {
        for (; Ce(w).type != 'py'; ) w.scopes.pop()
        w.scopes.push({ offset: Ce(w).offset + j.indentUnit, type: 'py', align: null })
      }
      function me(w, x, v) {
        var y = w.match(/^[\s\[\{\(]*(?:#|$)/, !1) ? null : w.column() + 1
        x.scopes.push({ offset: x.indent + Ee, type: v, align: y })
      }
      function L(w, x) {
        for (var v = w.indentation(); x.scopes.length > 1 && Ce(x).offset > v; ) {
          if (Ce(x).type != 'py') return !0
          x.scopes.pop()
        }
        return Ce(x).offset != v
      }
      function _(w, x) {
        w.sol() && ((x.beginningOfLine = !0), (x.dedent = !1))
        var v = x.tokenize(w, x),
          y = w.current()
        if (x.beginningOfLine && y == '@') return w.match(J, !1) ? 'meta' : re ? 'operator' : ee
        if (
          (/\S/.test(y) && (x.beginningOfLine = !1),
          (v == 'variable' || v == 'builtin') && x.lastToken == 'meta' && (v = 'meta'),
          (y == 'pass' || y == 'return') && (x.dedent = !0),
          y == 'lambda' && (x.lambda = !0),
          y == ':' && !x.lambda && Ce(x).type == 'py' && w.match(/^\s*(?:#|$)/, !1) && X(x),
          y.length == 1 && !/string|comment/.test(v))
        ) {
          var D = '[({'.indexOf(y)
          if ((D != -1 && me(w, x, '])}'.slice(D, D + 1)), (D = '])}'.indexOf(y)), D != -1))
            if (Ce(x).type == y) x.indent = x.scopes.pop().offset - Ee
            else return ee
        }
        return x.dedent && w.eol() && Ce(x).type == 'py' && x.scopes.length > 1 && x.scopes.pop(), v
      }
      var c = {
        startState: function (w) {
          return {
            tokenize: ye,
            scopes: [{ offset: w || 0, type: 'py', align: null }],
            indent: w || 0,
            lastToken: null,
            lambda: !1,
            dedent: 0,
          }
        },
        token: function (w, x) {
          var v = x.errorToken
          v && (x.errorToken = !1)
          var y = _(w, x)
          return (
            y && y != 'comment' && (x.lastToken = y == 'keyword' || y == 'punctuation' ? w.current() : y),
            y == 'punctuation' && (y = null),
            w.eol() && x.lambda && (x.lambda = !1),
            v ? y + ' ' + ee : y
          )
        },
        indent: function (w, x) {
          if (w.tokenize != ye) return w.tokenize.isString ? I.Pass : 0
          var v = Ce(w),
            y = v.type == x.charAt(0) || (v.type == 'py' && !w.dedent && /^(else:|elif |except |finally:)/.test(x))
          return v.align != null ? v.align - (y ? 1 : 0) : v.offset - (y ? Ee : 0)
        },
        electricInput: /^\s*([\}\]\)]|else:|elif |except |finally:)$/,
        closeBrackets: { triples: `'"` },
        lineComment: '#',
        fold: 'indent',
      }
      return c
    }),
      I.defineMIME('text/x-python', 'python')
    var M = function (j) {
      return j.split(' ')
    }
    I.defineMIME('text/x-cython', {
      name: 'python',
      extra_keywords: M(
        'by cdef cimport cpdef ctypedef enum except extern gil include nogil property public readonly struct union DEF IF ELIF ELSE',
      ),
    })
  })
})()
;(function (mr, Or) {
  ;(function (I) {
    I(Ar)
  })(function (I) {
    function Pe(v, y, D, B, Q, ae) {
      ;(this.indented = v), (this.column = y), (this.type = D), (this.info = B), (this.align = Q), (this.prev = ae)
    }
    function we(v, y, D, B) {
      var Q = v.indented
      return (
        v.context && v.context.type == 'statement' && D != 'statement' && (Q = v.context.indented),
        (v.context = new Pe(Q, y, D, B, null, v.context))
      )
    }
    function He(v) {
      var y = v.context.type
      return (y == ')' || y == ']' || y == '}') && (v.indented = v.context.indented), (v.context = v.context.prev)
    }
    function $e(v, y, D) {
      if (
        y.prevToken == 'variable' ||
        y.prevToken == 'type' ||
        /\S(?:[^- ]>|[*\]])\s*$|\*$/.test(v.string.slice(0, D)) ||
        (y.typeAtEndOfLine && v.column() == v.indentation())
      )
        return !0
    }
    function Ce(v) {
      for (;;) {
        if (!v || v.type == 'top') return !0
        if (v.type == '}' && v.prev.info != 'namespace') return !1
        v = v.prev
      }
    }
    I.defineMode('clike', function (v, y) {
      var D = v.indentUnit,
        B = y.statementIndentUnit || D,
        Q = y.dontAlignCalls,
        ae = y.keywords || {},
        Ze = y.types || {},
        We = y.builtin || {},
        V = y.blockKeywords || {},
        U = y.defKeywords || {},
        fe = y.atoms || {},
        se = y.hooks || {},
        ge = y.multiLineStrings,
        ie = y.indentStatements !== !1,
        Ie = y.indentSwitch !== !1,
        Mt = y.namespaceSeparator,
        Ot = y.isPunctuationChar || /[\[\]{}\(\),;\:\.]/,
        yt = y.numberStart || /[\d\.]/,
        Te = y.number || /^(?:0x[a-f\d]+|0b[01]+|(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?)(u|ll?|l|f)?/i,
        Ue = y.isOperatorChar || /[+\-*&%=<>!?|\/]/,
        de = y.isIdentifierChar || /[\w\$_\xa1-\uffff]/,
        st = y.isReservedIdentifier || !1,
        qe,
        Oe
      function k(R, ne) {
        var q = R.next()
        if (se[q]) {
          var be = se[q](R, ne)
          if (be !== !1) return be
        }
        if (q == '"' || q == "'") return (ne.tokenize = A(q)), ne.tokenize(R, ne)
        if (yt.test(q)) {
          if ((R.backUp(1), R.match(Te))) return 'number'
          R.next()
        }
        if (Ot.test(q)) return (qe = q), null
        if (q == '/') {
          if (R.eat('*')) return (ne.tokenize = T), T(R, ne)
          if (R.eat('/')) return R.skipToEnd(), 'comment'
        }
        if (Ue.test(q)) {
          for (; !R.match(/^\/[\/*]/, !1) && R.eat(Ue); );
          return 'operator'
        }
        if ((R.eatWhile(de), Mt)) for (; R.match(Mt); ) R.eatWhile(de)
        var he = R.current()
        return j(ae, he)
          ? (j(V, he) && (qe = 'newstatement'), j(U, he) && (Oe = !0), 'keyword')
          : j(Ze, he)
          ? 'type'
          : j(We, he) || (st && st(he))
          ? (j(V, he) && (qe = 'newstatement'), 'builtin')
          : j(fe, he)
          ? 'atom'
          : 'variable'
      }
      function A(R) {
        return function (ne, q) {
          for (var be = !1, he, Nt = !1; (he = ne.next()) != null; ) {
            if (he == R && !be) {
              Nt = !0
              break
            }
            be = !be && he == '\\'
          }
          return (Nt || !(be || ge)) && (q.tokenize = null), 'string'
        }
      }
      function T(R, ne) {
        for (var q = !1, be; (be = R.next()); ) {
          if (be == '/' && q) {
            ne.tokenize = null
            break
          }
          q = be == '*'
        }
        return 'comment'
      }
      function pe(R, ne) {
        y.typeFirstDefinitions && R.eol() && Ce(ne.context) && (ne.typeAtEndOfLine = $e(R, ne, R.pos))
      }
      return {
        startState: function (R) {
          return {
            tokenize: null,
            context: new Pe((R || 0) - D, 0, 'top', null, !1),
            indented: 0,
            startOfLine: !0,
            prevToken: null,
          }
        },
        token: function (R, ne) {
          var q = ne.context
          if (
            (R.sol() && (q.align == null && (q.align = !1), (ne.indented = R.indentation()), (ne.startOfLine = !0)),
            R.eatSpace())
          )
            return pe(R, ne), null
          qe = Oe = null
          var be = (ne.tokenize || k)(R, ne)
          if (be == 'comment' || be == 'meta') return be
          if (
            (q.align == null && (q.align = !0),
            qe == ';' || qe == ':' || (qe == ',' && R.match(/^\s*(?:\/\/.*)?$/, !1)))
          )
            for (; ne.context.type == 'statement'; ) He(ne)
          else if (qe == '{') we(ne, R.column(), '}')
          else if (qe == '[') we(ne, R.column(), ']')
          else if (qe == '(') we(ne, R.column(), ')')
          else if (qe == '}') {
            for (; q.type == 'statement'; ) q = He(ne)
            for (q.type == '}' && (q = He(ne)); q.type == 'statement'; ) q = He(ne)
          } else
            qe == q.type
              ? He(ne)
              : ie &&
                (((q.type == '}' || q.type == 'top') && qe != ';') ||
                  (q.type == 'statement' && qe == 'newstatement')) &&
                we(ne, R.column(), 'statement', R.current())
          if (
            (be == 'variable' &&
              (ne.prevToken == 'def' ||
                (y.typeFirstDefinitions && $e(R, ne, R.start) && Ce(ne.context) && R.match(/^\s*\(/, !1))) &&
              (be = 'def'),
            se.token)
          ) {
            var he = se.token(R, ne, be)
            he !== void 0 && (be = he)
          }
          return (
            be == 'def' && y.styleDefs === !1 && (be = 'variable'),
            (ne.startOfLine = !1),
            (ne.prevToken = Oe ? 'def' : be || qe),
            pe(R, ne),
            be
          )
        },
        indent: function (R, ne) {
          if ((R.tokenize != k && R.tokenize != null) || R.typeAtEndOfLine) return I.Pass
          var q = R.context,
            be = ne && ne.charAt(0),
            he = be == q.type
          if ((q.type == 'statement' && be == '}' && (q = q.prev), y.dontIndentStatements))
            for (; q.type == 'statement' && y.dontIndentStatements.test(q.info); ) q = q.prev
          if (se.indent) {
            var Nt = se.indent(R, q, ne, D)
            if (typeof Nt == 'number') return Nt
          }
          var zt = q.prev && q.prev.info == 'switch'
          if (y.allmanIndentation && /[{(]/.test(be)) {
            for (; q.type != 'top' && q.type != '}'; ) q = q.prev
            return q.indented
          }
          return q.type == 'statement'
            ? q.indented + (be == '{' ? 0 : B)
            : q.align && (!Q || q.type != ')')
            ? q.column + (he ? 0 : 1)
            : q.type == ')' && !he
            ? q.indented + B
            : q.indented + (he ? 0 : D) + (!he && zt && !/^(?:case|default)\b/.test(ne) ? D : 0)
        },
        electricInput: Ie ? /^\s*(?:case .*?:|default:|\{\}?|\})$/ : /^\s*[{}]$/,
        blockCommentStart: '/*',
        blockCommentEnd: '*/',
        blockCommentContinue: ' * ',
        lineComment: '//',
        fold: 'brace',
      }
    })
    function M(v) {
      for (var y = {}, D = v.split(' '), B = 0; B < D.length; ++B) y[D[B]] = !0
      return y
    }
    function j(v, y) {
      return typeof v == 'function' ? v(y) : v.propertyIsEnumerable(y)
    }
    var W =
        'auto if break case register continue return default do sizeof static else struct switch extern typedef union for goto while enum const volatile inline restrict asm fortran',
      ee =
        'alignas alignof and and_eq audit axiom bitand bitor catch class compl concept constexpr const_cast decltype delete dynamic_cast explicit export final friend import module mutable namespace new noexcept not not_eq operator or or_eq override private protected public reinterpret_cast requires static_assert static_cast template this thread_local throw try typeid typename using virtual xor xor_eq',
      G =
        'bycopy byref in inout oneway out self super atomic nonatomic retain copy readwrite readonly strong weak assign typeof nullable nonnull null_resettable _cmd @interface @implementation @end @protocol @encode @property @synthesize @dynamic @class @public @package @private @protected @required @optional @try @catch @finally @import @selector @encode @defs @synchronized @autoreleasepool @compatibility_alias @available',
      ue =
        'FOUNDATION_EXPORT FOUNDATION_EXTERN NS_INLINE NS_FORMAT_FUNCTION  NS_RETURNS_RETAINEDNS_ERROR_ENUM NS_RETURNS_NOT_RETAINED NS_RETURNS_INNER_POINTER NS_DESIGNATED_INITIALIZER NS_ENUM NS_OPTIONS NS_REQUIRES_NIL_TERMINATION NS_ASSUME_NONNULL_BEGIN NS_ASSUME_NONNULL_END NS_SWIFT_NAME NS_REFINED_FOR_SWIFT',
      ce = M('int long char short double float unsigned signed void bool'),
      Ee = M('SEL instancetype id Class Protocol BOOL')
    function Se(v) {
      return j(ce, v) || /.+_t$/.test(v)
    }
    function Ae(v) {
      return Se(v) || j(Ee, v)
    }
    var re = 'case do else for if switch while struct enum union',
      J = 'struct enum union'
    function te(v, y) {
      if (!y.startOfLine) return !1
      for (var D, B = null; (D = v.peek()); ) {
        if (D == '\\' && v.match(/^.$/)) {
          B = te
          break
        } else if (D == '/' && v.match(/^\/[\/\*]/, !1)) break
        v.next()
      }
      return (y.tokenize = B), 'meta'
    }
    function xe(v, y) {
      return y.prevToken == 'type' ? 'type' : !1
    }
    function Be(v) {
      return !v || v.length < 2 || v[0] != '_' ? !1 : v[1] == '_' || v[1] !== v[1].toLowerCase()
    }
    function ye(v) {
      return v.eatWhile(/[\w\.']/), 'number'
    }
    function Le(v, y) {
      if ((v.backUp(1), v.match(/^(?:R|u8R|uR|UR|LR)/))) {
        var D = v.match(/^"([^\s\\()]{0,16})\(/)
        return D ? ((y.cpp11RawStringDelim = D[1]), (y.tokenize = X), X(v, y)) : !1
      }
      return v.match(/^(?:u8|u|U|L)/) ? (v.match(/^["']/, !1) ? 'string' : !1) : (v.next(), !1)
    }
    function Re(v) {
      var y = /(\w+)::~?(\w+)$/.exec(v)
      return y && y[1] == y[2]
    }
    function $(v, y) {
      for (var D; (D = v.next()) != null; )
        if (D == '"' && !v.eat('"')) {
          y.tokenize = null
          break
        }
      return 'string'
    }
    function X(v, y) {
      var D = y.cpp11RawStringDelim.replace(/[^\w\s]/g, '\\$&'),
        B = v.match(new RegExp('.*?\\)' + D + '"'))
      return B ? (y.tokenize = null) : v.skipToEnd(), 'string'
    }
    function me(v, y) {
      typeof v == 'string' && (v = [v])
      var D = []
      function B(ae) {
        if (ae) for (var Ze in ae) ae.hasOwnProperty(Ze) && D.push(Ze)
      }
      B(y.keywords),
        B(y.types),
        B(y.builtin),
        B(y.atoms),
        D.length && ((y.helperType = v[0]), I.registerHelper('hintWords', v[0], D))
      for (var Q = 0; Q < v.length; ++Q) I.defineMIME(v[Q], y)
    }
    me(['text/x-csrc', 'text/x-c', 'text/x-chdr'], {
      name: 'clike',
      keywords: M(W),
      types: Se,
      blockKeywords: M(re),
      defKeywords: M(J),
      typeFirstDefinitions: !0,
      atoms: M('NULL true false'),
      isReservedIdentifier: Be,
      hooks: { '#': te, '*': xe },
      modeProps: { fold: ['brace', 'include'] },
    }),
      me(['text/x-c++src', 'text/x-c++hdr'], {
        name: 'clike',
        keywords: M(W + ' ' + ee),
        types: Se,
        blockKeywords: M(re + ' class try catch'),
        defKeywords: M(J + ' class namespace'),
        typeFirstDefinitions: !0,
        atoms: M('true false NULL nullptr'),
        dontIndentStatements: /^template$/,
        isIdentifierChar: /[\w\$_~\xa1-\uffff]/,
        isReservedIdentifier: Be,
        hooks: {
          '#': te,
          '*': xe,
          u: Le,
          U: Le,
          L: Le,
          R: Le,
          0: ye,
          1: ye,
          2: ye,
          3: ye,
          4: ye,
          5: ye,
          6: ye,
          7: ye,
          8: ye,
          9: ye,
          token: function (v, y, D) {
            if (
              D == 'variable' &&
              v.peek() == '(' &&
              (y.prevToken == ';' || y.prevToken == null || y.prevToken == '}') &&
              Re(v.current())
            )
              return 'def'
          },
        },
        namespaceSeparator: '::',
        modeProps: { fold: ['brace', 'include'] },
      }),
      me('text/x-java', {
        name: 'clike',
        keywords: M(
          'abstract assert break case catch class const continue default do else enum extends final finally for goto if implements import instanceof interface native new package private protected public return static strictfp super switch synchronized this throw throws transient try volatile while @interface',
        ),
        types: M(
          'var byte short int long float double boolean char void Boolean Byte Character Double Float Integer Long Number Object Short String StringBuffer StringBuilder Void',
        ),
        blockKeywords: M('catch class do else finally for if switch try while'),
        defKeywords: M('class interface enum @interface'),
        typeFirstDefinitions: !0,
        atoms: M('true false null'),
        number: /^(?:0x[a-f\d_]+|0b[01_]+|(?:[\d_]+\.?\d*|\.\d+)(?:e[-+]?[\d_]+)?)(u|ll?|l|f)?/i,
        hooks: {
          '@': function (v) {
            return v.match('interface', !1) ? !1 : (v.eatWhile(/[\w\$_]/), 'meta')
          },
          '"': function (v, y) {
            return v.match(/""$/) ? ((y.tokenize = L), y.tokenize(v, y)) : !1
          },
        },
        modeProps: { fold: ['brace', 'import'] },
      }),
      me('text/x-csharp', {
        name: 'clike',
        keywords: M(
          'abstract as async await base break case catch checked class const continue default delegate do else enum event explicit extern finally fixed for foreach goto if implicit in interface internal is lock namespace new operator out override params private protected public readonly ref return sealed sizeof stackalloc static struct switch this throw try typeof unchecked unsafe using virtual void volatile while add alias ascending descending dynamic from get global group into join let orderby partial remove select set value var yield',
        ),
        types: M(
          'Action Boolean Byte Char DateTime DateTimeOffset Decimal Double Func Guid Int16 Int32 Int64 Object SByte Single String Task TimeSpan UInt16 UInt32 UInt64 bool byte char decimal double short int long object sbyte float string ushort uint ulong',
        ),
        blockKeywords: M('catch class do else finally for foreach if struct switch try while'),
        defKeywords: M('class interface namespace struct var'),
        typeFirstDefinitions: !0,
        atoms: M('true false null'),
        hooks: {
          '@': function (v, y) {
            return v.eat('"') ? ((y.tokenize = $), $(v, y)) : (v.eatWhile(/[\w\$_]/), 'meta')
          },
        },
      })
    function L(v, y) {
      for (var D = !1; !v.eol(); ) {
        if (!D && v.match('"""')) {
          y.tokenize = null
          break
        }
        D = v.next() == '\\' && !D
      }
      return 'string'
    }
    function _(v) {
      return function (y, D) {
        for (var B; (B = y.next()); )
          if (B == '*' && y.eat('/'))
            if (v == 1) {
              D.tokenize = null
              break
            } else return (D.tokenize = _(v - 1)), D.tokenize(y, D)
          else if (B == '/' && y.eat('*')) return (D.tokenize = _(v + 1)), D.tokenize(y, D)
        return 'comment'
      }
    }
    me('text/x-scala', {
      name: 'clike',
      keywords: M(
        'abstract case catch class def do else extends final finally for forSome if implicit import lazy match new null object override package private protected return sealed super this throw trait try type val var while with yield _ assert assume require print println printf readLine readBoolean readByte readShort readChar readInt readLong readFloat readDouble',
      ),
      types: M(
        'AnyVal App Application Array BufferedIterator BigDecimal BigInt Char Console Either Enumeration Equiv Error Exception Fractional Function IndexedSeq Int Integral Iterable Iterator List Map Numeric Nil NotNull Option Ordered Ordering PartialFunction PartialOrdering Product Proxy Range Responder Seq Serializable Set Specializable Stream StringBuilder StringContext Symbol Throwable Traversable TraversableOnce Tuple Unit Vector Boolean Byte Character CharSequence Class ClassLoader Cloneable Comparable Compiler Double Exception Float Integer Long Math Number Object Package Pair Process Runtime Runnable SecurityManager Short StackTraceElement StrictMath String StringBuffer System Thread ThreadGroup ThreadLocal Throwable Triple Void',
      ),
      multiLineStrings: !0,
      blockKeywords: M('catch class enum do else finally for forSome if match switch try while'),
      defKeywords: M('class enum def object package trait type val var'),
      atoms: M('true false null'),
      indentStatements: !1,
      indentSwitch: !1,
      isOperatorChar: /[+\-*&%=<>!?|\/#:@]/,
      hooks: {
        '@': function (v) {
          return v.eatWhile(/[\w\$_]/), 'meta'
        },
        '"': function (v, y) {
          return v.match('""') ? ((y.tokenize = L), y.tokenize(v, y)) : !1
        },
        "'": function (v) {
          return v.eatWhile(/[\w\$_\xa1-\uffff]/), 'atom'
        },
        '=': function (v, y) {
          var D = y.context
          return D.type == '}' && D.align && v.eat('>')
            ? ((y.context = new Pe(D.indented, D.column, D.type, D.info, null, D.prev)), 'operator')
            : !1
        },
        '/': function (v, y) {
          return v.eat('*') ? ((y.tokenize = _(1)), y.tokenize(v, y)) : !1
        },
      },
      modeProps: { closeBrackets: { pairs: '()[]{}""', triples: '"' } },
    })
    function c(v) {
      return function (y, D) {
        for (var B = !1, Q, ae = !1; !y.eol(); ) {
          if (!v && !B && y.match('"')) {
            ae = !0
            break
          }
          if (v && y.match('"""')) {
            ae = !0
            break
          }
          ;(Q = y.next()), !B && Q == '$' && y.match('{') && y.skipTo('}'), (B = !B && Q == '\\' && !v)
        }
        return (ae || !v) && (D.tokenize = null), 'string'
      }
    }
    me('text/x-kotlin', {
      name: 'clike',
      keywords: M(
        'package as typealias class interface this super val operator var fun for is in This throw return annotation break continue object if else while do try when !in !is as? file import where by get set abstract enum open inner override private public internal protected catch finally out final vararg reified dynamic companion constructor init sealed field property receiver param sparam lateinit data inline noinline tailrec external annotation crossinline const operator infix suspend actual expect setparam value',
      ),
      types: M(
        'Boolean Byte Character CharSequence Class ClassLoader Cloneable Comparable Compiler Double Exception Float Integer Long Math Number Object Package Pair Process Runtime Runnable SecurityManager Short StackTraceElement StrictMath String StringBuffer System Thread ThreadGroup ThreadLocal Throwable Triple Void Annotation Any BooleanArray ByteArray Char CharArray DeprecationLevel DoubleArray Enum FloatArray Function Int IntArray Lazy LazyThreadSafetyMode LongArray Nothing ShortArray Unit',
      ),
      intendSwitch: !1,
      indentStatements: !1,
      multiLineStrings: !0,
      number: /^(?:0x[a-f\d_]+|0b[01_]+|(?:[\d_]+(\.\d+)?|\.\d+)(?:e[-+]?[\d_]+)?)(u|ll?|l|f)?/i,
      blockKeywords: M('catch class do else finally for if where try while enum'),
      defKeywords: M('class val var object interface fun'),
      atoms: M('true false null this'),
      hooks: {
        '@': function (v) {
          return v.eatWhile(/[\w\$_]/), 'meta'
        },
        '*': function (v, y) {
          return y.prevToken == '.' ? 'variable' : 'operator'
        },
        '"': function (v, y) {
          return (y.tokenize = c(v.match('""'))), y.tokenize(v, y)
        },
        '/': function (v, y) {
          return v.eat('*') ? ((y.tokenize = _(1)), y.tokenize(v, y)) : !1
        },
        indent: function (v, y, D, B) {
          var Q = D && D.charAt(0)
          if ((v.prevToken == '}' || v.prevToken == ')') && D == '') return v.indented
          if (
            (v.prevToken == 'operator' && D != '}' && v.context.type != '}') ||
            (v.prevToken == 'variable' && Q == '.') ||
            ((v.prevToken == '}' || v.prevToken == ')') && Q == '.')
          )
            return B * 2 + y.indented
          if (y.align && y.type == '}') return y.indented + (v.context.type == (D || '').charAt(0) ? 0 : B)
        },
      },
      modeProps: { closeBrackets: { triples: '"' } },
    }),
      me(['x-shader/x-vertex', 'x-shader/x-fragment'], {
        name: 'clike',
        keywords: M(
          'sampler1D sampler2D sampler3D samplerCube sampler1DShadow sampler2DShadow const attribute uniform varying break continue discard return for while do if else struct in out inout',
        ),
        types: M('float int bool void vec2 vec3 vec4 ivec2 ivec3 ivec4 bvec2 bvec3 bvec4 mat2 mat3 mat4'),
        blockKeywords: M('for while do if else struct'),
        builtin: M(
          'radians degrees sin cos tan asin acos atan pow exp log exp2 sqrt inversesqrt abs sign floor ceil fract mod min max clamp mix step smoothstep length distance dot cross normalize ftransform faceforward reflect refract matrixCompMult lessThan lessThanEqual greaterThan greaterThanEqual equal notEqual any all not texture1D texture1DProj texture1DLod texture1DProjLod texture2D texture2DProj texture2DLod texture2DProjLod texture3D texture3DProj texture3DLod texture3DProjLod textureCube textureCubeLod shadow1D shadow2D shadow1DProj shadow2DProj shadow1DLod shadow2DLod shadow1DProjLod shadow2DProjLod dFdx dFdy fwidth noise1 noise2 noise3 noise4',
        ),
        atoms: M(
          'true false gl_FragColor gl_SecondaryColor gl_Normal gl_Vertex gl_MultiTexCoord0 gl_MultiTexCoord1 gl_MultiTexCoord2 gl_MultiTexCoord3 gl_MultiTexCoord4 gl_MultiTexCoord5 gl_MultiTexCoord6 gl_MultiTexCoord7 gl_FogCoord gl_PointCoord gl_Position gl_PointSize gl_ClipVertex gl_FrontColor gl_BackColor gl_FrontSecondaryColor gl_BackSecondaryColor gl_TexCoord gl_FogFragCoord gl_FragCoord gl_FrontFacing gl_FragData gl_FragDepth gl_ModelViewMatrix gl_ProjectionMatrix gl_ModelViewProjectionMatrix gl_TextureMatrix gl_NormalMatrix gl_ModelViewMatrixInverse gl_ProjectionMatrixInverse gl_ModelViewProjectionMatrixInverse gl_TextureMatrixTranspose gl_ModelViewMatrixInverseTranspose gl_ProjectionMatrixInverseTranspose gl_ModelViewProjectionMatrixInverseTranspose gl_TextureMatrixInverseTranspose gl_NormalScale gl_DepthRange gl_ClipPlane gl_Point gl_FrontMaterial gl_BackMaterial gl_LightSource gl_LightModel gl_FrontLightModelProduct gl_BackLightModelProduct gl_TextureColor gl_EyePlaneS gl_EyePlaneT gl_EyePlaneR gl_EyePlaneQ gl_FogParameters gl_MaxLights gl_MaxClipPlanes gl_MaxTextureUnits gl_MaxTextureCoords gl_MaxVertexAttribs gl_MaxVertexUniformComponents gl_MaxVaryingFloats gl_MaxVertexTextureImageUnits gl_MaxTextureImageUnits gl_MaxFragmentUniformComponents gl_MaxCombineTextureImageUnits gl_MaxDrawBuffers',
        ),
        indentSwitch: !1,
        hooks: { '#': te },
        modeProps: { fold: ['brace', 'include'] },
      }),
      me('text/x-nesc', {
        name: 'clike',
        keywords: M(
          W +
            ' as atomic async call command component components configuration event generic implementation includes interface module new norace nx_struct nx_union post provides signal task uses abstract extends',
        ),
        types: Se,
        blockKeywords: M(re),
        atoms: M('null true false'),
        hooks: { '#': te },
        modeProps: { fold: ['brace', 'include'] },
      }),
      me('text/x-objectivec', {
        name: 'clike',
        keywords: M(W + ' ' + G),
        types: Ae,
        builtin: M(ue),
        blockKeywords: M(re + ' @synthesize @try @catch @finally @autoreleasepool @synchronized'),
        defKeywords: M(J + ' @interface @implementation @protocol @class'),
        dontIndentStatements: /^@.*$/,
        typeFirstDefinitions: !0,
        atoms: M('YES NO NULL Nil nil true false nullptr'),
        isReservedIdentifier: Be,
        hooks: { '#': te, '*': xe },
        modeProps: { fold: ['brace', 'include'] },
      }),
      me('text/x-objectivec++', {
        name: 'clike',
        keywords: M(W + ' ' + G + ' ' + ee),
        types: Ae,
        builtin: M(ue),
        blockKeywords: M(re + ' @synthesize @try @catch @finally @autoreleasepool @synchronized class try catch'),
        defKeywords: M(J + ' @interface @implementation @protocol @class class namespace'),
        dontIndentStatements: /^@.*$|^template$/,
        typeFirstDefinitions: !0,
        atoms: M('YES NO NULL Nil nil true false nullptr'),
        isReservedIdentifier: Be,
        hooks: {
          '#': te,
          '*': xe,
          u: Le,
          U: Le,
          L: Le,
          R: Le,
          0: ye,
          1: ye,
          2: ye,
          3: ye,
          4: ye,
          5: ye,
          6: ye,
          7: ye,
          8: ye,
          9: ye,
          token: function (v, y, D) {
            if (
              D == 'variable' &&
              v.peek() == '(' &&
              (y.prevToken == ';' || y.prevToken == null || y.prevToken == '}') &&
              Re(v.current())
            )
              return 'def'
          },
        },
        namespaceSeparator: '::',
        modeProps: { fold: ['brace', 'include'] },
      }),
      me('text/x-squirrel', {
        name: 'clike',
        keywords: M(
          'base break clone continue const default delete enum extends function in class foreach local resume return this throw typeof yield constructor instanceof static',
        ),
        types: Se,
        blockKeywords: M('case catch class else for foreach if switch try while'),
        defKeywords: M('function local class'),
        typeFirstDefinitions: !0,
        atoms: M('true false null'),
        hooks: { '#': te },
        modeProps: { fold: ['brace', 'include'] },
      })
    var w = null
    function x(v) {
      return function (y, D) {
        for (var B = !1, Q, ae = !1; !y.eol(); ) {
          if (!B && y.match('"') && (v == 'single' || y.match('""'))) {
            ae = !0
            break
          }
          if (!B && y.match('``')) {
            ;(w = x(v)), (ae = !0)
            break
          }
          ;(Q = y.next()), (B = v == 'single' && !B && Q == '\\')
        }
        return ae && (D.tokenize = null), 'string'
      }
    }
    me('text/x-ceylon', {
      name: 'clike',
      keywords: M(
        'abstracts alias assembly assert assign break case catch class continue dynamic else exists extends finally for function given if import in interface is let module new nonempty object of out outer package return satisfies super switch then this throw try value void while',
      ),
      types: function (v) {
        var y = v.charAt(0)
        return y === y.toUpperCase() && y !== y.toLowerCase()
      },
      blockKeywords: M(
        'case catch class dynamic else finally for function if interface module new object switch try while',
      ),
      defKeywords: M('class dynamic function interface module object package value'),
      builtin: M(
        'abstract actual aliased annotation by default deprecated doc final formal late license native optional sealed see serializable shared suppressWarnings tagged throws variable',
      ),
      isPunctuationChar: /[\[\]{}\(\),;\:\.`]/,
      isOperatorChar: /[+\-*&%=<>!?|^~:\/]/,
      numberStart: /[\d#$]/,
      number: /^(?:#[\da-fA-F_]+|\$[01_]+|[\d_]+[kMGTPmunpf]?|[\d_]+\.[\d_]+(?:[eE][-+]?\d+|[kMGTPmunpf]|)|)/i,
      multiLineStrings: !0,
      typeFirstDefinitions: !0,
      atoms: M('true false null larger smaller equal empty finished'),
      indentSwitch: !1,
      styleDefs: !1,
      hooks: {
        '@': function (v) {
          return v.eatWhile(/[\w\$_]/), 'meta'
        },
        '"': function (v, y) {
          return (y.tokenize = x(v.match('""') ? 'triple' : 'single')), y.tokenize(v, y)
        },
        '`': function (v, y) {
          return !w || !v.match('`') ? !1 : ((y.tokenize = w), (w = null), y.tokenize(v, y))
        },
        "'": function (v) {
          return v.eatWhile(/[\w\$_\xa1-\uffff]/), 'atom'
        },
        token: function (v, y, D) {
          if ((D == 'variable' || D == 'type') && y.prevToken == '.') return 'variable-2'
        },
      },
      modeProps: { fold: ['brace', 'import'], closeBrackets: { triples: '"' } },
    })
  })
})()
export { wu as default }
