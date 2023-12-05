var Rn = Object.defineProperty
var An = (U, c, l) => (c in U ? Rn(U, c, { enumerable: !0, configurable: !0, writable: !0, value: l }) : (U[c] = l))
var Y = (U, c, l) => (An(U, typeof c != 'symbol' ? c + '' : c, l), l)
function Tn(U, c) {
  const l = new Array(c.length).fill(0)
  return new Array(c.length).fill(0).map((b, g) => (C, M) => {
    ;(l[g] = (C / M) * c[g] * 1e3),
      U(
        l.reduce((O, q) => O + q, 0),
        1e3,
      )
  })
}
class Un {
  constructor(c, l, b) {
    Y(this, '_snapshots')
    Y(this, '_index')
    Y(this, 'snapshotName')
    Y(this, '_resources')
    Y(this, '_snapshot')
    Y(this, '_callId')
    ;(this._resources = c),
      (this._snapshots = l),
      (this._index = b),
      (this._snapshot = l[b]),
      (this._callId = l[b].callId),
      (this.snapshotName = l[b].snapshotName)
  }
  snapshot() {
    return this._snapshots[this._index]
  }
  viewport() {
    return this._snapshots[this._index].viewport
  }
  render() {
    const c = (C, M, O, q) => {
        if (typeof C == 'string') {
          const $ = In(C)
          return O === 'STYLE' || O === 'style' ? Mn($) : $
        }
        if (!C._string)
          if (Array.isArray(C[0])) {
            const $ = M - C[0][0]
            if ($ >= 0 && $ <= M) {
              const D = Fn(this._snapshots[$]),
                E = C[0][1]
              E >= 0 && E < D.length && (C._string = c(D[E], $, O, q))
            }
          } else if (typeof C[0] == 'string') {
            const $ = []
            $.push('<', C[0])
            const D = Object.entries(C[1] || {}),
              E = '__playwright_current_src__',
              j = C[0] === 'IFRAME' || C[0] === 'FRAME',
              V = C[0] === 'A',
              Q = C[0] === 'IMG',
              J = Q && D.some((tt) => tt[0] === E),
              rt = C[0] === 'SOURCE' && O === 'PICTURE' && (q == null ? void 0 : q.some((tt) => tt[0] === E))
            for (const [tt, ct] of D) {
              let _t = tt
              j && tt.toLowerCase() === 'src' && (_t = '__playwright_src__'),
                Q && tt === E && (_t = 'src'),
                ['src', 'srcset'].includes(tt.toLowerCase()) && (J || rt) && (_t = '_' + _t)
              let kt = ct
              V && tt.toLowerCase() === 'href'
                ? (kt = 'link://' + ct)
                : (tt.toLowerCase() === 'href' || tt.toLowerCase() === 'src' || tt === E) && (kt = Jt(ct)),
                $.push(' ', _t, '="', Cn(kt), '"')
            }
            $.push('>')
            for (let tt = 2; tt < C.length; tt++) $.push(c(C[tt], M, C[0], D))
            En.has(C[0]) || $.push('</', C[0], '>'), (C._string = $.join(''))
          } else C._string = ''
        return C._string
      },
      l = this._snapshot
    let b = c(l.html, this._index, void 0, void 0)
    return b
      ? ((b =
          (l.doctype ? `<!DOCTYPE ${l.doctype}>` : '') +
          [
            '<style>*,*::before,*::after { visibility: hidden }</style>',
            `<script>${zn(this._callId, this.snapshotName)}<\/script>`,
          ].join('') +
          b),
        { html: b, pageId: l.pageId, frameId: l.frameId, index: this._index })
      : { html: '', pageId: l.pageId, frameId: l.frameId, index: this._index }
  }
  resourceByUrl(c, l) {
    const b = this._snapshot
    let g, C
    for (const O of this._resources) {
      if (typeof O._monotonicTime == 'number' && O._monotonicTime >= b.timestamp) break
      O.response.status !== 304 &&
        O.request.url === c &&
        O.request.method === l &&
        (O._frameref === b.frameId ? (g = O) : (C = O))
    }
    let M = g ?? C
    if (M && l.toUpperCase() === 'GET') {
      for (const O of b.resourceOverrides)
        if (c === O.url && O.sha1) {
          M = { ...M, response: { ...M.response, content: { ...M.response.content, _sha1: O.sha1 } } }
          break
        }
    }
    return M
  }
}
const En = new Set([
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
  tn = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }
function Cn(U) {
  return U.replace(/[&<>"']/gu, (c) => tn[c])
}
function In(U) {
  return U.replace(/[&<]/gu, (c) => tn[c])
}
function Fn(U) {
  if (!U._nodes) {
    const c = [],
      l = (b) => {
        if (typeof b == 'string') c.push(b)
        else if (typeof b[0] == 'string') {
          for (let g = 2; g < b.length; g++) l(b[g])
          c.push(b)
        }
      }
    l(U.html), (U._nodes = c)
  }
  return U._nodes
}
function zn(...U) {
  function c(l, ...b) {
    const g = [],
      C = [],
      M = [],
      O = (D) => {
        for (const E of D.querySelectorAll('[__playwright_scroll_top_]')) g.push(E)
        for (const E of D.querySelectorAll('[__playwright_scroll_left_]')) C.push(E)
        for (const E of D.querySelectorAll('[__playwright_value_]'))
          (E.value = E.getAttribute('__playwright_value_')), E.removeAttribute('__playwright_value_')
        for (const E of D.querySelectorAll('[__playwright_checked_]'))
          (E.checked = E.getAttribute('__playwright_checked_') === 'true'), E.removeAttribute('__playwright_checked_')
        for (const E of D.querySelectorAll('[__playwright_selected_]'))
          (E.selected = E.getAttribute('__playwright_selected_') === 'true'),
            E.removeAttribute('__playwright_selected_')
        for (const E of b)
          for (const j of D.querySelectorAll(`[__playwright_target__="${E}"]`)) {
            const V = j.style
            ;(V.outline = '2px solid #006ab1'), (V.backgroundColor = '#6fa8dc7f'), M.push(j)
          }
        for (const E of D.querySelectorAll('iframe, frame')) {
          const j = E.getAttribute('__playwright_src__')
          if (!j) E.setAttribute('src', 'data:text/html,<body style="background: #ddd"></body>')
          else {
            const V = new URL(l(window.location.href)),
              Q = V.pathname.lastIndexOf('/snapshot/')
            Q !== -1 && (V.pathname = V.pathname.substring(0, Q + 1)),
              (V.pathname += j.substring(1)),
              E.setAttribute('src', V.toString())
          }
        }
        {
          const E = D.querySelector('body[__playwright_custom_elements__]')
          if (E && window.customElements) {
            const j = (E.getAttribute('__playwright_custom_elements__') || '').split(',')
            for (const V of j) window.customElements.define(V, class extends HTMLElement {})
          }
        }
        for (const E of D.querySelectorAll('template[__playwright_shadow_root_]')) {
          const j = E,
            V = j.parentElement.attachShadow({ mode: 'open' })
          V.appendChild(j.content), j.remove(), O(V)
        }
        if ('adoptedStyleSheets' in D) {
          const E = [...D.adoptedStyleSheets]
          for (const j of D.querySelectorAll('template[__playwright_style_sheet_]')) {
            const V = j,
              Q = new CSSStyleSheet()
            Q.replaceSync(V.getAttribute('__playwright_style_sheet_')), E.push(Q)
          }
          D.adoptedStyleSheets = E
        }
      },
      q = () => {
        window.removeEventListener('load', q)
        for (const E of g)
          (E.scrollTop = +E.getAttribute('__playwright_scroll_top_')), E.removeAttribute('__playwright_scroll_top_')
        for (const E of C)
          (E.scrollLeft = +E.getAttribute('__playwright_scroll_left_')), E.removeAttribute('__playwright_scroll_left_')
        if (((document.styleSheets[0].disabled = !0), new URL(window.location.href).searchParams.get('showPoint')))
          for (const E of M) {
            const j = document.createElement('x-pw-pointer')
            ;(j.style.position = 'fixed'),
              (j.style.backgroundColor = '#f44336'),
              (j.style.width = '20px'),
              (j.style.height = '20px'),
              (j.style.borderRadius = '10px'),
              (j.style.margin = '-10px 0 0 -10px'),
              (j.style.zIndex = '2147483647')
            const V = E.getBoundingClientRect()
            ;(j.style.left = V.left + V.width / 2 + 'px'),
              (j.style.top = V.top + V.height / 2 + 'px'),
              document.documentElement.appendChild(j)
          }
      },
      $ = () => O(document)
    window.addEventListener('load', q), window.addEventListener('DOMContentLoaded', $)
  }
  return `
(${c.toString()})(${Yt.toString()}${U.map((l) => `, "${l}"`).join('')})`
}
const en = ['about:', 'blob:', 'data:', 'file:', 'ftp:', 'http:', 'https:', 'mailto:', 'sftp:', 'ws:', 'wss:'],
  Xe = 'http://playwright.bloburl/#'
function Jt(U) {
  U.startsWith(Xe) && (U = U.substring(Xe.length))
  try {
    const c = new URL(U)
    if (c.protocol === 'javascript:' || c.protocol === 'vbscript:') return 'javascript:void(0)'
    if (!(c.protocol === 'blob:') && en.includes(c.protocol)) return U
    const b = 'pw-' + c.protocol.slice(0, c.protocol.length - 1)
    return (c.protocol = 'https:'), (c.hostname = c.hostname ? `${b}--${c.hostname}` : b), c.toString()
  } catch {
    return U
  }
}
const Ln = /url\(['"]?([\w-]+:)\/\//gi
function Mn(U) {
  return U.replace(Ln, (c, l) =>
    !(l === 'blob:') && en.includes(l) ? c : c.replace(l + '//', `https://pw-${l.slice(0, -1)}--`),
  )
}
function Yt(U) {
  const c = new URL(U)
  return c.pathname.endsWith('/snapshot.html') ? c.searchParams.get('r') : U
}
class Dn {
  constructor(c, l) {
    Y(this, '_snapshotStorage')
    Y(this, '_resourceLoader')
    Y(this, '_snapshotIds', new Map())
    ;(this._snapshotStorage = c), (this._resourceLoader = l)
  }
  serveSnapshot(c, l, b) {
    const g = this._snapshot(c.substring(9), l)
    if (!g) return new Response(null, { status: 404 })
    const C = g.render()
    return this._snapshotIds.set(b, g), new Response(C.html, { status: 200, headers: { 'Content-Type': 'text/html' } })
  }
  serveSnapshotInfo(c, l) {
    const b = this._snapshot(c.substring(13), l)
    return this._respondWithJson(
      b ? { viewport: b.viewport(), url: b.snapshot().frameUrl } : { error: 'No snapshot found' },
    )
  }
  _snapshot(c, l) {
    const b = l.get('name')
    return this._snapshotStorage.snapshotByName(c.slice(1), b)
  }
  _respondWithJson(c) {
    return new Response(JSON.stringify(c), {
      status: 200,
      headers: { 'Cache-Control': 'public, max-age=31536000', 'Content-Type': 'application/json' },
    })
  }
  async serveResource(c, l, b) {
    let g
    const C = this._snapshotIds.get(b)
    for (const V of c) if (((g = C == null ? void 0 : C.resourceByUrl(On(V), l)), g)) break
    if (!g) return new Response(null, { status: 404 })
    const M = g.response.content._sha1,
      O = M ? (await this._resourceLoader(M)) || new Blob([]) : new Blob([])
    let q = g.response.content.mimeType
    ;/^text\/|^application\/(javascript|json)/.test(q) && !q.includes('charset') && (q = `${q}; charset=utf-8`)
    const D = new Headers()
    D.set('Content-Type', q)
    for (const { name: V, value: Q } of g.response.headers) D.set(V, Q)
    D.delete('Content-Encoding'),
      D.delete('Access-Control-Allow-Origin'),
      D.set('Access-Control-Allow-Origin', '*'),
      D.delete('Content-Length'),
      D.set('Content-Length', String(O.size)),
      D.set('Cache-Control', 'public, max-age=31536000')
    const { status: E } = g.response,
      j = E === 101 || E === 204 || E === 205 || E === 304
    return new Response(j ? null : O, { headers: D, status: g.response.status, statusText: g.response.statusText })
  }
}
function On(U) {
  try {
    const c = new URL(U)
    return (c.hash = ''), c.toString()
  } catch {
    return U
  }
}
function Nn(U) {
  const c = new Map(),
    { files: l, stacks: b } = U
  for (const g of b) {
    const [C, M] = g
    c.set(
      `call@${C}`,
      M.map((O) => ({ file: l[O[0]], line: O[1], column: O[2], function: O[3] })),
    )
  }
  return c
}
function Wn() {
  return {
    isPrimary: !1,
    traceUrl: '',
    startTime: Number.MAX_SAFE_INTEGER,
    endTime: 0,
    browserName: '',
    options: { deviceScaleFactor: 1, isMobile: !1, viewport: { width: 1280, height: 800 } },
    pages: [],
    resources: [],
    actions: [],
    events: [],
    stdio: [],
    initializers: {},
    hasSource: !1,
  }
}
class Pn {
  constructor() {
    Y(this, '_resources', [])
    Y(this, '_frameSnapshots', new Map())
  }
  addResource(c) {
    ;(c.request.url = Jt(c.request.url)), this._resources.push(c)
  }
  addFrameSnapshot(c) {
    for (const g of c.resourceOverrides) g.url = Jt(g.url)
    let l = this._frameSnapshots.get(c.frameId)
    l ||
      ((l = { raw: [], renderers: [] }),
      this._frameSnapshots.set(c.frameId, l),
      c.isMainFrame && this._frameSnapshots.set(c.pageId, l)),
      l.raw.push(c)
    const b = new Un(this._resources, l.raw, l.raw.length - 1)
    return l.renderers.push(b), b
  }
  snapshotByName(c, l) {
    const b = this._frameSnapshots.get(c)
    return b == null ? void 0 : b.renderers.find((g) => g.snapshotName === l)
  }
  snapshotsForTest() {
    return [...this._frameSnapshots.keys()]
  }
  finalize() {
    this._resources.sort((c, l) => (c._monotonicTime || 0) - (l._monotonicTime || 0))
  }
}
class Bn {
  constructor() {
    Y(this, 'contextEntries', [])
    Y(this, 'pageEntries', new Map())
    Y(this, '_snapshotStorage')
    Y(this, '_version')
    Y(this, '_backend')
    Y(this, '_attachments', new Map())
    Y(this, '_resourceToContentType', new Map())
  }
  async load(c, l) {
    var O, q
    this._backend = c
    const b = []
    let g = !1
    for (const $ of await this._backend.entryNames()) {
      const D = $.match(/(.+)\.trace/)
      D && b.push(D[1] || ''), $.includes('src@') && (g = !0)
    }
    if (!b.length) throw new Error('Cannot find .trace file')
    this._snapshotStorage = new Pn()
    const C = b.length * 3
    let M = 0
    for (const $ of b) {
      const D = Wn(),
        E = new Map()
      ;(D.traceUrl = c.traceURL()), (D.hasSource = g)
      const j = (await this._backend.readText($ + '.trace')) || ''
      for (const J of j.split(`
`))
        this.appendEvent(D, E, J)
      l(++M, C)
      const V = (await this._backend.readText($ + '.network')) || ''
      for (const J of V.split(`
`))
        this.appendEvent(D, E, J)
      if ((l(++M, C), (D.actions = [...E.values()].sort((J, rt) => J.startTime - rt.startTime)), !c.isLive())) {
        for (const J of D.actions.slice().reverse())
          if (!J.endTime && !J.error)
            for (const rt of D.actions) rt.parentId === J.callId && J.endTime < rt.endTime && (J.endTime = rt.endTime)
      }
      const Q = await this._backend.readText($ + '.stacks')
      if (Q) {
        const J = Nn(JSON.parse(Q))
        for (const rt of D.actions) rt.stack = rt.stack || J.get(rt.callId)
      }
      l(++M, C)
      for (const J of D.resources)
        (O = J.request.postData) != null &&
          O._sha1 &&
          this._resourceToContentType.set(J.request.postData._sha1, Qe(J.request.postData.mimeType)),
          (q = J.response.content) != null &&
            q._sha1 &&
            this._resourceToContentType.set(J.response.content._sha1, Qe(J.response.content.mimeType))
      this.contextEntries.push(D)
    }
    this._snapshotStorage.finalize()
  }
  async hasEntry(c) {
    return this._backend.hasEntry(c)
  }
  async resourceForSha1(c) {
    const l = await this._backend.readBlob('resources/' + c)
    if (l) return new Blob([l], { type: this._resourceToContentType.get(c) || 'application/octet-stream' })
  }
  attachmentForSha1(c) {
    return this._attachments.get(c)
  }
  storage() {
    return this._snapshotStorage
  }
  _pageEntry(c, l) {
    let b = this.pageEntries.get(l)
    return b || ((b = { screencastFrames: [] }), this.pageEntries.set(l, b), c.pages.push(b)), b
  }
  appendEvent(c, l, b) {
    var C
    if (!b) return
    const g = this._modernize(JSON.parse(b))
    if (g) {
      switch (g.type) {
        case 'context-options': {
          ;(this._version = g.version),
            (c.isPrimary = !0),
            (c.browserName = g.browserName),
            (c.channel = g.channel),
            (c.title = g.title),
            (c.platform = g.platform),
            (c.wallTime = g.wallTime),
            (c.sdkLanguage = g.sdkLanguage),
            (c.options = g.options),
            (c.testIdAttributeName = g.testIdAttributeName)
          break
        }
        case 'screencast-frame': {
          this._pageEntry(c, g.pageId).screencastFrames.push(g)
          break
        }
        case 'before': {
          l.set(g.callId, { ...g, type: 'action', endTime: 0, log: [] })
          break
        }
        case 'input': {
          const M = l.get(g.callId)
          ;(M.inputSnapshot = g.inputSnapshot), (M.point = g.point)
          break
        }
        case 'after': {
          const M = l.get(g.callId)
          ;(M.afterSnapshot = g.afterSnapshot),
            (M.endTime = g.endTime),
            (M.log = g.log),
            (M.result = g.result),
            (M.error = g.error),
            (M.attachments = g.attachments)
          for (const O of ((C = g.attachments) == null ? void 0 : C.filter((q) => q.sha1)) || [])
            this._attachments.set(O.sha1, O)
          break
        }
        case 'action': {
          l.set(g.callId, g)
          break
        }
        case 'event': {
          c.events.push(g)
          break
        }
        case 'stdout': {
          c.stdio.push(g)
          break
        }
        case 'stderr': {
          c.stdio.push(g)
          break
        }
        case 'object': {
          c.initializers[g.guid] = g.initializer
          break
        }
        case 'resource-snapshot':
          this._snapshotStorage.addResource(g.snapshot), c.resources.push(g.snapshot)
          break
        case 'frame-snapshot':
          this._snapshotStorage.addFrameSnapshot(g.snapshot)
          break
      }
      ;(g.type === 'action' || g.type === 'before') && (c.startTime = Math.min(c.startTime, g.startTime)),
        (g.type === 'action' || g.type === 'after') && (c.endTime = Math.max(c.endTime, g.endTime)),
        g.type === 'event' &&
          ((c.startTime = Math.min(c.startTime, g.time)), (c.endTime = Math.max(c.endTime, g.time))),
        g.type === 'screencast-frame' &&
          ((c.startTime = Math.min(c.startTime, g.timestamp)), (c.endTime = Math.max(c.endTime, g.timestamp)))
    }
  }
  _modernize(c) {
    if (this._version === void 0) return c
    const l = 4
    for (let b = this._version; b < l; ++b) c = this[`_modernize_${b}_to_${b + 1}`].call(this, c)
    return c
  }
  _modernize_0_to_1(c) {
    return (
      c.type === 'action' &&
        typeof c.metadata.error == 'string' &&
        (c.metadata.error = { error: { name: 'Error', message: c.metadata.error } }),
      c
    )
  }
  _modernize_1_to_2(c) {
    var l, b
    return (
      c.type === 'frame-snapshot' &&
        c.snapshot.isMainFrame &&
        (c.snapshot.viewport = ((b = (l = this.contextEntries[0]) == null ? void 0 : l.options) == null
          ? void 0
          : b.viewport) || { width: 1280, height: 720 }),
      c
    )
  }
  _modernize_2_to_3(c) {
    if (c.type === 'resource-snapshot' && !c.snapshot.request) {
      const l = c.snapshot
      c.snapshot = {
        _frameref: l.frameId,
        request: {
          url: l.url,
          method: l.method,
          headers: l.requestHeaders,
          postData: l.requestSha1 ? { _sha1: l.requestSha1 } : void 0,
        },
        response: {
          status: l.status,
          headers: l.responseHeaders,
          content: { mimeType: l.contentType, _sha1: l.responseSha1 },
        },
        _monotonicTime: l.timestamp,
      }
    }
    return c
  }
  _modernize_3_to_4(c) {
    var b, g, C, M
    if (c.type !== 'action' && c.type !== 'event') return c
    const l = c.metadata
    return l.internal || l.method.startsWith('tracing')
      ? null
      : c.type === 'event'
      ? l.method === '__create__' && l.type === 'ConsoleMessage'
        ? { type: 'object', class: l.type, guid: l.params.guid, initializer: l.params.initializer }
        : { type: 'event', time: l.startTime, class: l.type, method: l.method, params: l.params, pageId: l.pageId }
      : {
          type: 'action',
          callId: l.id,
          startTime: l.startTime,
          endTime: l.endTime,
          apiName: l.apiName || l.type + '.' + l.method,
          class: l.type,
          method: l.method,
          params: l.params,
          wallTime: l.wallTime || Date.now(),
          log: l.log,
          beforeSnapshot: (b = l.snapshots.find((O) => O.title === 'before')) == null ? void 0 : b.snapshotName,
          inputSnapshot: (g = l.snapshots.find((O) => O.title === 'input')) == null ? void 0 : g.snapshotName,
          afterSnapshot: (C = l.snapshots.find((O) => O.title === 'after')) == null ? void 0 : C.snapshotName,
          error: (M = l.error) == null ? void 0 : M.error,
          result: l.result,
          point: l.point,
          pageId: l.pageId,
        }
  }
}
function Qe(U) {
  const c = U.match(/^(.*);\s*charset=.*$/)
  return c ? c[1] : U
}
var Hn =
  typeof globalThis < 'u'
    ? globalThis
    : typeof window < 'u'
    ? window
    : typeof global < 'u'
    ? global
    : typeof self < 'u'
    ? self
    : {}
function jn(U) {
  return U && U.__esModule && Object.prototype.hasOwnProperty.call(U, 'default') ? U.default : U
}
var Xt = { exports: {} }
;(function (U, c) {
  ;(function (l, b) {
    b(c)
  })(Hn, function (l) {
    const M = [0, 1, 3, 7, 15, 31, 63, 127, 255, 511, 1023, 2047, 4095, 8191, 16383, 32767, 65535],
      O = [
        96, 7, 256, 0, 8, 80, 0, 8, 16, 84, 8, 115, 82, 7, 31, 0, 8, 112, 0, 8, 48, 0, 9, 192, 80, 7, 10, 0, 8, 96, 0,
        8, 32, 0, 9, 160, 0, 8, 0, 0, 8, 128, 0, 8, 64, 0, 9, 224, 80, 7, 6, 0, 8, 88, 0, 8, 24, 0, 9, 144, 83, 7, 59,
        0, 8, 120, 0, 8, 56, 0, 9, 208, 81, 7, 17, 0, 8, 104, 0, 8, 40, 0, 9, 176, 0, 8, 8, 0, 8, 136, 0, 8, 72, 0, 9,
        240, 80, 7, 4, 0, 8, 84, 0, 8, 20, 85, 8, 227, 83, 7, 43, 0, 8, 116, 0, 8, 52, 0, 9, 200, 81, 7, 13, 0, 8, 100,
        0, 8, 36, 0, 9, 168, 0, 8, 4, 0, 8, 132, 0, 8, 68, 0, 9, 232, 80, 7, 8, 0, 8, 92, 0, 8, 28, 0, 9, 152, 84, 7,
        83, 0, 8, 124, 0, 8, 60, 0, 9, 216, 82, 7, 23, 0, 8, 108, 0, 8, 44, 0, 9, 184, 0, 8, 12, 0, 8, 140, 0, 8, 76, 0,
        9, 248, 80, 7, 3, 0, 8, 82, 0, 8, 18, 85, 8, 163, 83, 7, 35, 0, 8, 114, 0, 8, 50, 0, 9, 196, 81, 7, 11, 0, 8,
        98, 0, 8, 34, 0, 9, 164, 0, 8, 2, 0, 8, 130, 0, 8, 66, 0, 9, 228, 80, 7, 7, 0, 8, 90, 0, 8, 26, 0, 9, 148, 84,
        7, 67, 0, 8, 122, 0, 8, 58, 0, 9, 212, 82, 7, 19, 0, 8, 106, 0, 8, 42, 0, 9, 180, 0, 8, 10, 0, 8, 138, 0, 8, 74,
        0, 9, 244, 80, 7, 5, 0, 8, 86, 0, 8, 22, 192, 8, 0, 83, 7, 51, 0, 8, 118, 0, 8, 54, 0, 9, 204, 81, 7, 15, 0, 8,
        102, 0, 8, 38, 0, 9, 172, 0, 8, 6, 0, 8, 134, 0, 8, 70, 0, 9, 236, 80, 7, 9, 0, 8, 94, 0, 8, 30, 0, 9, 156, 84,
        7, 99, 0, 8, 126, 0, 8, 62, 0, 9, 220, 82, 7, 27, 0, 8, 110, 0, 8, 46, 0, 9, 188, 0, 8, 14, 0, 8, 142, 0, 8, 78,
        0, 9, 252, 96, 7, 256, 0, 8, 81, 0, 8, 17, 85, 8, 131, 82, 7, 31, 0, 8, 113, 0, 8, 49, 0, 9, 194, 80, 7, 10, 0,
        8, 97, 0, 8, 33, 0, 9, 162, 0, 8, 1, 0, 8, 129, 0, 8, 65, 0, 9, 226, 80, 7, 6, 0, 8, 89, 0, 8, 25, 0, 9, 146,
        83, 7, 59, 0, 8, 121, 0, 8, 57, 0, 9, 210, 81, 7, 17, 0, 8, 105, 0, 8, 41, 0, 9, 178, 0, 8, 9, 0, 8, 137, 0, 8,
        73, 0, 9, 242, 80, 7, 4, 0, 8, 85, 0, 8, 21, 80, 8, 258, 83, 7, 43, 0, 8, 117, 0, 8, 53, 0, 9, 202, 81, 7, 13,
        0, 8, 101, 0, 8, 37, 0, 9, 170, 0, 8, 5, 0, 8, 133, 0, 8, 69, 0, 9, 234, 80, 7, 8, 0, 8, 93, 0, 8, 29, 0, 9,
        154, 84, 7, 83, 0, 8, 125, 0, 8, 61, 0, 9, 218, 82, 7, 23, 0, 8, 109, 0, 8, 45, 0, 9, 186, 0, 8, 13, 0, 8, 141,
        0, 8, 77, 0, 9, 250, 80, 7, 3, 0, 8, 83, 0, 8, 19, 85, 8, 195, 83, 7, 35, 0, 8, 115, 0, 8, 51, 0, 9, 198, 81, 7,
        11, 0, 8, 99, 0, 8, 35, 0, 9, 166, 0, 8, 3, 0, 8, 131, 0, 8, 67, 0, 9, 230, 80, 7, 7, 0, 8, 91, 0, 8, 27, 0, 9,
        150, 84, 7, 67, 0, 8, 123, 0, 8, 59, 0, 9, 214, 82, 7, 19, 0, 8, 107, 0, 8, 43, 0, 9, 182, 0, 8, 11, 0, 8, 139,
        0, 8, 75, 0, 9, 246, 80, 7, 5, 0, 8, 87, 0, 8, 23, 192, 8, 0, 83, 7, 51, 0, 8, 119, 0, 8, 55, 0, 9, 206, 81, 7,
        15, 0, 8, 103, 0, 8, 39, 0, 9, 174, 0, 8, 7, 0, 8, 135, 0, 8, 71, 0, 9, 238, 80, 7, 9, 0, 8, 95, 0, 8, 31, 0, 9,
        158, 84, 7, 99, 0, 8, 127, 0, 8, 63, 0, 9, 222, 82, 7, 27, 0, 8, 111, 0, 8, 47, 0, 9, 190, 0, 8, 15, 0, 8, 143,
        0, 8, 79, 0, 9, 254, 96, 7, 256, 0, 8, 80, 0, 8, 16, 84, 8, 115, 82, 7, 31, 0, 8, 112, 0, 8, 48, 0, 9, 193, 80,
        7, 10, 0, 8, 96, 0, 8, 32, 0, 9, 161, 0, 8, 0, 0, 8, 128, 0, 8, 64, 0, 9, 225, 80, 7, 6, 0, 8, 88, 0, 8, 24, 0,
        9, 145, 83, 7, 59, 0, 8, 120, 0, 8, 56, 0, 9, 209, 81, 7, 17, 0, 8, 104, 0, 8, 40, 0, 9, 177, 0, 8, 8, 0, 8,
        136, 0, 8, 72, 0, 9, 241, 80, 7, 4, 0, 8, 84, 0, 8, 20, 85, 8, 227, 83, 7, 43, 0, 8, 116, 0, 8, 52, 0, 9, 201,
        81, 7, 13, 0, 8, 100, 0, 8, 36, 0, 9, 169, 0, 8, 4, 0, 8, 132, 0, 8, 68, 0, 9, 233, 80, 7, 8, 0, 8, 92, 0, 8,
        28, 0, 9, 153, 84, 7, 83, 0, 8, 124, 0, 8, 60, 0, 9, 217, 82, 7, 23, 0, 8, 108, 0, 8, 44, 0, 9, 185, 0, 8, 12,
        0, 8, 140, 0, 8, 76, 0, 9, 249, 80, 7, 3, 0, 8, 82, 0, 8, 18, 85, 8, 163, 83, 7, 35, 0, 8, 114, 0, 8, 50, 0, 9,
        197, 81, 7, 11, 0, 8, 98, 0, 8, 34, 0, 9, 165, 0, 8, 2, 0, 8, 130, 0, 8, 66, 0, 9, 229, 80, 7, 7, 0, 8, 90, 0,
        8, 26, 0, 9, 149, 84, 7, 67, 0, 8, 122, 0, 8, 58, 0, 9, 213, 82, 7, 19, 0, 8, 106, 0, 8, 42, 0, 9, 181, 0, 8,
        10, 0, 8, 138, 0, 8, 74, 0, 9, 245, 80, 7, 5, 0, 8, 86, 0, 8, 22, 192, 8, 0, 83, 7, 51, 0, 8, 118, 0, 8, 54, 0,
        9, 205, 81, 7, 15, 0, 8, 102, 0, 8, 38, 0, 9, 173, 0, 8, 6, 0, 8, 134, 0, 8, 70, 0, 9, 237, 80, 7, 9, 0, 8, 94,
        0, 8, 30, 0, 9, 157, 84, 7, 99, 0, 8, 126, 0, 8, 62, 0, 9, 221, 82, 7, 27, 0, 8, 110, 0, 8, 46, 0, 9, 189, 0, 8,
        14, 0, 8, 142, 0, 8, 78, 0, 9, 253, 96, 7, 256, 0, 8, 81, 0, 8, 17, 85, 8, 131, 82, 7, 31, 0, 8, 113, 0, 8, 49,
        0, 9, 195, 80, 7, 10, 0, 8, 97, 0, 8, 33, 0, 9, 163, 0, 8, 1, 0, 8, 129, 0, 8, 65, 0, 9, 227, 80, 7, 6, 0, 8,
        89, 0, 8, 25, 0, 9, 147, 83, 7, 59, 0, 8, 121, 0, 8, 57, 0, 9, 211, 81, 7, 17, 0, 8, 105, 0, 8, 41, 0, 9, 179,
        0, 8, 9, 0, 8, 137, 0, 8, 73, 0, 9, 243, 80, 7, 4, 0, 8, 85, 0, 8, 21, 80, 8, 258, 83, 7, 43, 0, 8, 117, 0, 8,
        53, 0, 9, 203, 81, 7, 13, 0, 8, 101, 0, 8, 37, 0, 9, 171, 0, 8, 5, 0, 8, 133, 0, 8, 69, 0, 9, 235, 80, 7, 8, 0,
        8, 93, 0, 8, 29, 0, 9, 155, 84, 7, 83, 0, 8, 125, 0, 8, 61, 0, 9, 219, 82, 7, 23, 0, 8, 109, 0, 8, 45, 0, 9,
        187, 0, 8, 13, 0, 8, 141, 0, 8, 77, 0, 9, 251, 80, 7, 3, 0, 8, 83, 0, 8, 19, 85, 8, 195, 83, 7, 35, 0, 8, 115,
        0, 8, 51, 0, 9, 199, 81, 7, 11, 0, 8, 99, 0, 8, 35, 0, 9, 167, 0, 8, 3, 0, 8, 131, 0, 8, 67, 0, 9, 231, 80, 7,
        7, 0, 8, 91, 0, 8, 27, 0, 9, 151, 84, 7, 67, 0, 8, 123, 0, 8, 59, 0, 9, 215, 82, 7, 19, 0, 8, 107, 0, 8, 43, 0,
        9, 183, 0, 8, 11, 0, 8, 139, 0, 8, 75, 0, 9, 247, 80, 7, 5, 0, 8, 87, 0, 8, 23, 192, 8, 0, 83, 7, 51, 0, 8, 119,
        0, 8, 55, 0, 9, 207, 81, 7, 15, 0, 8, 103, 0, 8, 39, 0, 9, 175, 0, 8, 7, 0, 8, 135, 0, 8, 71, 0, 9, 239, 80, 7,
        9, 0, 8, 95, 0, 8, 31, 0, 9, 159, 84, 7, 99, 0, 8, 127, 0, 8, 63, 0, 9, 223, 82, 7, 27, 0, 8, 111, 0, 8, 47, 0,
        9, 191, 0, 8, 15, 0, 8, 143, 0, 8, 79, 0, 9, 255,
      ],
      q = [
        80, 5, 1, 87, 5, 257, 83, 5, 17, 91, 5, 4097, 81, 5, 5, 89, 5, 1025, 85, 5, 65, 93, 5, 16385, 80, 5, 3, 88, 5,
        513, 84, 5, 33, 92, 5, 8193, 82, 5, 9, 90, 5, 2049, 86, 5, 129, 192, 5, 24577, 80, 5, 2, 87, 5, 385, 83, 5, 25,
        91, 5, 6145, 81, 5, 7, 89, 5, 1537, 85, 5, 97, 93, 5, 24577, 80, 5, 4, 88, 5, 769, 84, 5, 49, 92, 5, 12289, 82,
        5, 13, 90, 5, 3073, 86, 5, 193, 192, 5, 24577,
      ],
      $ = [
        3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227,
        258, 0, 0,
      ],
      D = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, 112, 112],
      E = [
        1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097,
        6145, 8193, 12289, 16385, 24577,
      ],
      j = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13],
      V = 15
    function Q() {
      let n, e, t, r, a, d
      function u(x, m, S, F, B, W, i, p, s, o, h) {
        let w, R, v, y, f, k, z, I, T, A, L, P, K, N, G
        ;(A = 0), (f = S)
        do t[x[m + A]]++, A++, f--
        while (f !== 0)
        if (t[0] == S) return (i[0] = -1), (p[0] = 0), 0
        for (I = p[0], k = 1; k <= V && t[k] === 0; k++);
        for (z = k, I < k && (I = k), f = V; f !== 0 && t[f] === 0; f--);
        for (v = f, I > f && (I = f), p[0] = I, N = 1 << k; k < f; k++, N <<= 1) if ((N -= t[k]) < 0) return -3
        if ((N -= t[f]) < 0) return -3
        for (t[f] += N, d[1] = k = 0, A = 1, K = 2; --f != 0; ) (d[K] = k += t[A]), K++, A++
        ;(f = 0), (A = 0)
        do (k = x[m + A]) !== 0 && (h[d[k]++] = f), A++
        while (++f < S)
        for (S = d[v], d[0] = f = 0, A = 0, y = -1, P = -I, a[0] = 0, L = 0, G = 0; z <= v; z++)
          for (w = t[z]; w-- != 0; ) {
            for (; z > P + I; ) {
              if (
                (y++,
                (P += I),
                (G = v - P),
                (G = G > I ? I : G),
                (R = 1 << (k = z - P)) > w + 1 && ((R -= w + 1), (K = z), k < G))
              )
                for (; ++k < G && !((R <<= 1) <= t[++K]); ) R -= t[K]
              if (((G = 1 << k), o[0] + G > 1440)) return -3
              ;(a[y] = L = o[0]),
                (o[0] += G),
                y !== 0
                  ? ((d[y] = f),
                    (r[0] = k),
                    (r[1] = I),
                    (k = f >>> (P - I)),
                    (r[2] = L - a[y - 1] - k),
                    s.set(r, 3 * (a[y - 1] + k)))
                  : (i[0] = L)
            }
            for (
              r[1] = z - P,
                A >= S
                  ? (r[0] = 192)
                  : h[A] < F
                  ? ((r[0] = h[A] < 256 ? 0 : 96), (r[2] = h[A++]))
                  : ((r[0] = W[h[A] - F] + 16 + 64), (r[2] = B[h[A++] - F])),
                R = 1 << (z - P),
                k = f >>> P;
              k < G;
              k += R
            )
              s.set(r, 3 * (L + k))
            for (k = 1 << (z - 1); f & k; k >>>= 1) f ^= k
            for (f ^= k, T = (1 << P) - 1; (f & T) != d[y]; ) y--, (P -= I), (T = (1 << P) - 1)
          }
        return N !== 0 && v != 1 ? -5 : 0
      }
      function _(x) {
        let m
        for (
          n ||
            ((n = []), (e = []), (t = new Int32Array(16)), (r = []), (a = new Int32Array(V)), (d = new Int32Array(16))),
            e.length < x && (e = []),
            m = 0;
          m < x;
          m++
        )
          e[m] = 0
        for (m = 0; m < 16; m++) t[m] = 0
        for (m = 0; m < 3; m++) r[m] = 0
        a.set(t.subarray(0, V), 0), d.set(t.subarray(0, 16), 0)
      }
      ;(this.inflate_trees_bits = function (x, m, S, F, B) {
        let W
        return (
          _(19),
          (n[0] = 0),
          (W = u(x, 0, 19, 19, null, null, S, m, F, n, e)),
          W == -3
            ? (B.msg = 'oversubscribed dynamic bit lengths tree')
            : (W != -5 && m[0] !== 0) || ((B.msg = 'incomplete dynamic bit lengths tree'), (W = -3)),
          W
        )
      }),
        (this.inflate_trees_dynamic = function (x, m, S, F, B, W, i, p, s) {
          let o
          return (
            _(288),
            (n[0] = 0),
            (o = u(S, 0, x, 257, $, D, W, F, p, n, e)),
            o != 0 || F[0] === 0
              ? (o == -3
                  ? (s.msg = 'oversubscribed literal/length tree')
                  : o != -4 && ((s.msg = 'incomplete literal/length tree'), (o = -3)),
                o)
              : (_(288),
                (o = u(S, x, m, 0, E, j, i, B, p, n, e)),
                o != 0 || (B[0] === 0 && x > 257)
                  ? (o == -3
                      ? (s.msg = 'oversubscribed distance tree')
                      : o == -5
                      ? ((s.msg = 'incomplete distance tree'), (o = -3))
                      : o != -4 && ((s.msg = 'empty distance tree with lengths'), (o = -3)),
                    o)
                  : 0)
          )
        })
    }
    Q.inflate_trees_fixed = function (n, e, t, r) {
      return (n[0] = 9), (e[0] = 5), (t[0] = O), (r[0] = q), 0
    }
    function J() {
      const n = this
      let e,
        t,
        r,
        a,
        d = 0,
        u = 0,
        _ = 0,
        x = 0,
        m = 0,
        S = 0,
        F = 0,
        B = 0,
        W = 0,
        i = 0
      function p(s, o, h, w, R, v, y, f) {
        let k, z, I, T, A, L, P, K, N, G, ft, pt, H, xt, Z, X
        ;(P = f.next_in_index),
          (K = f.avail_in),
          (A = y.bitb),
          (L = y.bitk),
          (N = y.write),
          (G = N < y.read ? y.read - N - 1 : y.end - N),
          (ft = M[s]),
          (pt = M[o])
        do {
          for (; L < 20; ) K--, (A |= (255 & f.read_byte(P++)) << L), (L += 8)
          if (((k = A & ft), (z = h), (I = w), (X = 3 * (I + k)), (T = z[X]) !== 0))
            for (;;) {
              if (((A >>= z[X + 1]), (L -= z[X + 1]), (16 & T) != 0)) {
                for (T &= 15, H = z[X + 2] + (A & M[T]), A >>= T, L -= T; L < 15; )
                  K--, (A |= (255 & f.read_byte(P++)) << L), (L += 8)
                for (k = A & pt, z = R, I = v, X = 3 * (I + k), T = z[X]; ; ) {
                  if (((A >>= z[X + 1]), (L -= z[X + 1]), (16 & T) != 0)) {
                    for (T &= 15; L < T; ) K--, (A |= (255 & f.read_byte(P++)) << L), (L += 8)
                    if (((xt = z[X + 2] + (A & M[T])), (A >>= T), (L -= T), (G -= H), N >= xt))
                      (Z = N - xt),
                        N - Z > 0 && 2 > N - Z
                          ? ((y.window[N++] = y.window[Z++]), (y.window[N++] = y.window[Z++]), (H -= 2))
                          : (y.window.set(y.window.subarray(Z, Z + 2), N), (N += 2), (Z += 2), (H -= 2))
                    else {
                      Z = N - xt
                      do Z += y.end
                      while (Z < 0)
                      if (((T = y.end - Z), H > T)) {
                        if (((H -= T), N - Z > 0 && T > N - Z))
                          do y.window[N++] = y.window[Z++]
                          while (--T != 0)
                        else y.window.set(y.window.subarray(Z, Z + T), N), (N += T), (Z += T), (T = 0)
                        Z = 0
                      }
                    }
                    if (N - Z > 0 && H > N - Z)
                      do y.window[N++] = y.window[Z++]
                      while (--H != 0)
                    else y.window.set(y.window.subarray(Z, Z + H), N), (N += H), (Z += H), (H = 0)
                    break
                  }
                  if (64 & T)
                    return (
                      (f.msg = 'invalid distance code'),
                      (H = f.avail_in - K),
                      (H = L >> 3 < H ? L >> 3 : H),
                      (K += H),
                      (P -= H),
                      (L -= H << 3),
                      (y.bitb = A),
                      (y.bitk = L),
                      (f.avail_in = K),
                      (f.total_in += P - f.next_in_index),
                      (f.next_in_index = P),
                      (y.write = N),
                      -3
                    )
                  ;(k += z[X + 2]), (k += A & M[T]), (X = 3 * (I + k)), (T = z[X])
                }
                break
              }
              if (64 & T)
                return 32 & T
                  ? ((H = f.avail_in - K),
                    (H = L >> 3 < H ? L >> 3 : H),
                    (K += H),
                    (P -= H),
                    (L -= H << 3),
                    (y.bitb = A),
                    (y.bitk = L),
                    (f.avail_in = K),
                    (f.total_in += P - f.next_in_index),
                    (f.next_in_index = P),
                    (y.write = N),
                    1)
                  : ((f.msg = 'invalid literal/length code'),
                    (H = f.avail_in - K),
                    (H = L >> 3 < H ? L >> 3 : H),
                    (K += H),
                    (P -= H),
                    (L -= H << 3),
                    (y.bitb = A),
                    (y.bitk = L),
                    (f.avail_in = K),
                    (f.total_in += P - f.next_in_index),
                    (f.next_in_index = P),
                    (y.write = N),
                    -3)
              if (((k += z[X + 2]), (k += A & M[T]), (X = 3 * (I + k)), (T = z[X]) === 0)) {
                ;(A >>= z[X + 1]), (L -= z[X + 1]), (y.window[N++] = z[X + 2]), G--
                break
              }
            }
          else (A >>= z[X + 1]), (L -= z[X + 1]), (y.window[N++] = z[X + 2]), G--
        } while (G >= 258 && K >= 10)
        return (
          (H = f.avail_in - K),
          (H = L >> 3 < H ? L >> 3 : H),
          (K += H),
          (P -= H),
          (L -= H << 3),
          (y.bitb = A),
          (y.bitk = L),
          (f.avail_in = K),
          (f.total_in += P - f.next_in_index),
          (f.next_in_index = P),
          (y.write = N),
          0
        )
      }
      ;(n.init = function (s, o, h, w, R, v) {
        ;(e = 0), (F = s), (B = o), (r = h), (W = w), (a = R), (i = v), (t = null)
      }),
        (n.proc = function (s, o, h) {
          let w,
            R,
            v,
            y,
            f,
            k,
            z,
            I = 0,
            T = 0,
            A = 0
          for (
            A = o.next_in_index,
              y = o.avail_in,
              I = s.bitb,
              T = s.bitk,
              f = s.write,
              k = f < s.read ? s.read - f - 1 : s.end - f;
            ;

          )
            switch (e) {
              case 0:
                if (
                  k >= 258 &&
                  y >= 10 &&
                  ((s.bitb = I),
                  (s.bitk = T),
                  (o.avail_in = y),
                  (o.total_in += A - o.next_in_index),
                  (o.next_in_index = A),
                  (s.write = f),
                  (h = p(F, B, r, W, a, i, s, o)),
                  (A = o.next_in_index),
                  (y = o.avail_in),
                  (I = s.bitb),
                  (T = s.bitk),
                  (f = s.write),
                  (k = f < s.read ? s.read - f - 1 : s.end - f),
                  h != 0)
                ) {
                  e = h == 1 ? 7 : 9
                  break
                }
                ;(_ = F), (t = r), (u = W), (e = 1)
              case 1:
                for (w = _; T < w; ) {
                  if (y === 0)
                    return (
                      (s.bitb = I),
                      (s.bitk = T),
                      (o.avail_in = y),
                      (o.total_in += A - o.next_in_index),
                      (o.next_in_index = A),
                      (s.write = f),
                      s.inflate_flush(o, h)
                    )
                  ;(h = 0), y--, (I |= (255 & o.read_byte(A++)) << T), (T += 8)
                }
                if (((R = 3 * (u + (I & M[w]))), (I >>>= t[R + 1]), (T -= t[R + 1]), (v = t[R]), v === 0)) {
                  ;(x = t[R + 2]), (e = 6)
                  break
                }
                if (16 & v) {
                  ;(m = 15 & v), (d = t[R + 2]), (e = 2)
                  break
                }
                if (!(64 & v)) {
                  ;(_ = v), (u = R / 3 + t[R + 2])
                  break
                }
                if (32 & v) {
                  e = 7
                  break
                }
                return (
                  (e = 9),
                  (o.msg = 'invalid literal/length code'),
                  (h = -3),
                  (s.bitb = I),
                  (s.bitk = T),
                  (o.avail_in = y),
                  (o.total_in += A - o.next_in_index),
                  (o.next_in_index = A),
                  (s.write = f),
                  s.inflate_flush(o, h)
                )
              case 2:
                for (w = m; T < w; ) {
                  if (y === 0)
                    return (
                      (s.bitb = I),
                      (s.bitk = T),
                      (o.avail_in = y),
                      (o.total_in += A - o.next_in_index),
                      (o.next_in_index = A),
                      (s.write = f),
                      s.inflate_flush(o, h)
                    )
                  ;(h = 0), y--, (I |= (255 & o.read_byte(A++)) << T), (T += 8)
                }
                ;(d += I & M[w]), (I >>= w), (T -= w), (_ = B), (t = a), (u = i), (e = 3)
              case 3:
                for (w = _; T < w; ) {
                  if (y === 0)
                    return (
                      (s.bitb = I),
                      (s.bitk = T),
                      (o.avail_in = y),
                      (o.total_in += A - o.next_in_index),
                      (o.next_in_index = A),
                      (s.write = f),
                      s.inflate_flush(o, h)
                    )
                  ;(h = 0), y--, (I |= (255 & o.read_byte(A++)) << T), (T += 8)
                }
                if (((R = 3 * (u + (I & M[w]))), (I >>= t[R + 1]), (T -= t[R + 1]), (v = t[R]), (16 & v) != 0)) {
                  ;(m = 15 & v), (S = t[R + 2]), (e = 4)
                  break
                }
                if (!(64 & v)) {
                  ;(_ = v), (u = R / 3 + t[R + 2])
                  break
                }
                return (
                  (e = 9),
                  (o.msg = 'invalid distance code'),
                  (h = -3),
                  (s.bitb = I),
                  (s.bitk = T),
                  (o.avail_in = y),
                  (o.total_in += A - o.next_in_index),
                  (o.next_in_index = A),
                  (s.write = f),
                  s.inflate_flush(o, h)
                )
              case 4:
                for (w = m; T < w; ) {
                  if (y === 0)
                    return (
                      (s.bitb = I),
                      (s.bitk = T),
                      (o.avail_in = y),
                      (o.total_in += A - o.next_in_index),
                      (o.next_in_index = A),
                      (s.write = f),
                      s.inflate_flush(o, h)
                    )
                  ;(h = 0), y--, (I |= (255 & o.read_byte(A++)) << T), (T += 8)
                }
                ;(S += I & M[w]), (I >>= w), (T -= w), (e = 5)
              case 5:
                for (z = f - S; z < 0; ) z += s.end
                for (; d !== 0; ) {
                  if (
                    k === 0 &&
                    (f == s.end && s.read !== 0 && ((f = 0), (k = f < s.read ? s.read - f - 1 : s.end - f)),
                    k === 0 &&
                      ((s.write = f),
                      (h = s.inflate_flush(o, h)),
                      (f = s.write),
                      (k = f < s.read ? s.read - f - 1 : s.end - f),
                      f == s.end && s.read !== 0 && ((f = 0), (k = f < s.read ? s.read - f - 1 : s.end - f)),
                      k === 0))
                  )
                    return (
                      (s.bitb = I),
                      (s.bitk = T),
                      (o.avail_in = y),
                      (o.total_in += A - o.next_in_index),
                      (o.next_in_index = A),
                      (s.write = f),
                      s.inflate_flush(o, h)
                    )
                  ;(s.window[f++] = s.window[z++]), k--, z == s.end && (z = 0), d--
                }
                e = 0
                break
              case 6:
                if (
                  k === 0 &&
                  (f == s.end && s.read !== 0 && ((f = 0), (k = f < s.read ? s.read - f - 1 : s.end - f)),
                  k === 0 &&
                    ((s.write = f),
                    (h = s.inflate_flush(o, h)),
                    (f = s.write),
                    (k = f < s.read ? s.read - f - 1 : s.end - f),
                    f == s.end && s.read !== 0 && ((f = 0), (k = f < s.read ? s.read - f - 1 : s.end - f)),
                    k === 0))
                )
                  return (
                    (s.bitb = I),
                    (s.bitk = T),
                    (o.avail_in = y),
                    (o.total_in += A - o.next_in_index),
                    (o.next_in_index = A),
                    (s.write = f),
                    s.inflate_flush(o, h)
                  )
                ;(h = 0), (s.window[f++] = x), k--, (e = 0)
                break
              case 7:
                if (
                  (T > 7 && ((T -= 8), y++, A--),
                  (s.write = f),
                  (h = s.inflate_flush(o, h)),
                  (f = s.write),
                  (k = f < s.read ? s.read - f - 1 : s.end - f),
                  s.read != s.write)
                )
                  return (
                    (s.bitb = I),
                    (s.bitk = T),
                    (o.avail_in = y),
                    (o.total_in += A - o.next_in_index),
                    (o.next_in_index = A),
                    (s.write = f),
                    s.inflate_flush(o, h)
                  )
                e = 8
              case 8:
                return (
                  (h = 1),
                  (s.bitb = I),
                  (s.bitk = T),
                  (o.avail_in = y),
                  (o.total_in += A - o.next_in_index),
                  (o.next_in_index = A),
                  (s.write = f),
                  s.inflate_flush(o, h)
                )
              case 9:
                return (
                  (h = -3),
                  (s.bitb = I),
                  (s.bitk = T),
                  (o.avail_in = y),
                  (o.total_in += A - o.next_in_index),
                  (o.next_in_index = A),
                  (s.write = f),
                  s.inflate_flush(o, h)
                )
              default:
                return (
                  (h = -2),
                  (s.bitb = I),
                  (s.bitk = T),
                  (o.avail_in = y),
                  (o.total_in += A - o.next_in_index),
                  (o.next_in_index = A),
                  (s.write = f),
                  s.inflate_flush(o, h)
                )
            }
        }),
        (n.free = function () {})
    }
    const rt = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]
    function tt(n, e) {
      const t = this
      let r,
        a = 0,
        d = 0,
        u = 0,
        _ = 0
      const x = [0],
        m = [0],
        S = new J()
      let F = 0,
        B = new Int32Array(4320)
      const W = new Q()
      ;(t.bitk = 0),
        (t.bitb = 0),
        (t.window = new Uint8Array(e)),
        (t.end = e),
        (t.read = 0),
        (t.write = 0),
        (t.reset = function (i, p) {
          p && (p[0] = 0), a == 6 && S.free(i), (a = 0), (t.bitk = 0), (t.bitb = 0), (t.read = t.write = 0)
        }),
        t.reset(n, null),
        (t.inflate_flush = function (i, p) {
          let s, o, h
          return (
            (o = i.next_out_index),
            (h = t.read),
            (s = (h <= t.write ? t.write : t.end) - h),
            s > i.avail_out && (s = i.avail_out),
            s !== 0 && p == -5 && (p = 0),
            (i.avail_out -= s),
            (i.total_out += s),
            i.next_out.set(t.window.subarray(h, h + s), o),
            (o += s),
            (h += s),
            h == t.end &&
              ((h = 0),
              t.write == t.end && (t.write = 0),
              (s = t.write - h),
              s > i.avail_out && (s = i.avail_out),
              s !== 0 && p == -5 && (p = 0),
              (i.avail_out -= s),
              (i.total_out += s),
              i.next_out.set(t.window.subarray(h, h + s), o),
              (o += s),
              (h += s)),
            (i.next_out_index = o),
            (t.read = h),
            p
          )
        }),
        (t.proc = function (i, p) {
          let s, o, h, w, R, v, y, f
          for (
            w = i.next_in_index,
              R = i.avail_in,
              o = t.bitb,
              h = t.bitk,
              v = t.write,
              y = v < t.read ? t.read - v - 1 : t.end - v;
            ;

          ) {
            let k, z, I, T, A, L, P, K
            switch (a) {
              case 0:
                for (; h < 3; ) {
                  if (R === 0)
                    return (
                      (t.bitb = o),
                      (t.bitk = h),
                      (i.avail_in = R),
                      (i.total_in += w - i.next_in_index),
                      (i.next_in_index = w),
                      (t.write = v),
                      t.inflate_flush(i, p)
                    )
                  ;(p = 0), R--, (o |= (255 & i.read_byte(w++)) << h), (h += 8)
                }
                switch (((s = 7 & o), (F = 1 & s), s >>> 1)) {
                  case 0:
                    ;(o >>>= 3), (h -= 3), (s = 7 & h), (o >>>= s), (h -= s), (a = 1)
                    break
                  case 1:
                    ;(k = []),
                      (z = []),
                      (I = [[]]),
                      (T = [[]]),
                      Q.inflate_trees_fixed(k, z, I, T),
                      S.init(k[0], z[0], I[0], 0, T[0], 0),
                      (o >>>= 3),
                      (h -= 3),
                      (a = 6)
                    break
                  case 2:
                    ;(o >>>= 3), (h -= 3), (a = 3)
                    break
                  case 3:
                    return (
                      (o >>>= 3),
                      (h -= 3),
                      (a = 9),
                      (i.msg = 'invalid block type'),
                      (p = -3),
                      (t.bitb = o),
                      (t.bitk = h),
                      (i.avail_in = R),
                      (i.total_in += w - i.next_in_index),
                      (i.next_in_index = w),
                      (t.write = v),
                      t.inflate_flush(i, p)
                    )
                }
                break
              case 1:
                for (; h < 32; ) {
                  if (R === 0)
                    return (
                      (t.bitb = o),
                      (t.bitk = h),
                      (i.avail_in = R),
                      (i.total_in += w - i.next_in_index),
                      (i.next_in_index = w),
                      (t.write = v),
                      t.inflate_flush(i, p)
                    )
                  ;(p = 0), R--, (o |= (255 & i.read_byte(w++)) << h), (h += 8)
                }
                if (((~o >>> 16) & 65535) != (65535 & o))
                  return (
                    (a = 9),
                    (i.msg = 'invalid stored block lengths'),
                    (p = -3),
                    (t.bitb = o),
                    (t.bitk = h),
                    (i.avail_in = R),
                    (i.total_in += w - i.next_in_index),
                    (i.next_in_index = w),
                    (t.write = v),
                    t.inflate_flush(i, p)
                  )
                ;(d = 65535 & o), (o = h = 0), (a = d !== 0 ? 2 : F !== 0 ? 7 : 0)
                break
              case 2:
                if (
                  R === 0 ||
                  (y === 0 &&
                    (v == t.end && t.read !== 0 && ((v = 0), (y = v < t.read ? t.read - v - 1 : t.end - v)),
                    y === 0 &&
                      ((t.write = v),
                      (p = t.inflate_flush(i, p)),
                      (v = t.write),
                      (y = v < t.read ? t.read - v - 1 : t.end - v),
                      v == t.end && t.read !== 0 && ((v = 0), (y = v < t.read ? t.read - v - 1 : t.end - v)),
                      y === 0)))
                )
                  return (
                    (t.bitb = o),
                    (t.bitk = h),
                    (i.avail_in = R),
                    (i.total_in += w - i.next_in_index),
                    (i.next_in_index = w),
                    (t.write = v),
                    t.inflate_flush(i, p)
                  )
                if (
                  ((p = 0),
                  (s = d),
                  s > R && (s = R),
                  s > y && (s = y),
                  t.window.set(i.read_buf(w, s), v),
                  (w += s),
                  (R -= s),
                  (v += s),
                  (y -= s),
                  (d -= s) != 0)
                )
                  break
                a = F !== 0 ? 7 : 0
                break
              case 3:
                for (; h < 14; ) {
                  if (R === 0)
                    return (
                      (t.bitb = o),
                      (t.bitk = h),
                      (i.avail_in = R),
                      (i.total_in += w - i.next_in_index),
                      (i.next_in_index = w),
                      (t.write = v),
                      t.inflate_flush(i, p)
                    )
                  ;(p = 0), R--, (o |= (255 & i.read_byte(w++)) << h), (h += 8)
                }
                if (((u = s = 16383 & o), (31 & s) > 29 || ((s >> 5) & 31) > 29))
                  return (
                    (a = 9),
                    (i.msg = 'too many length or distance symbols'),
                    (p = -3),
                    (t.bitb = o),
                    (t.bitk = h),
                    (i.avail_in = R),
                    (i.total_in += w - i.next_in_index),
                    (i.next_in_index = w),
                    (t.write = v),
                    t.inflate_flush(i, p)
                  )
                if (((s = 258 + (31 & s) + ((s >> 5) & 31)), !r || r.length < s)) r = []
                else for (f = 0; f < s; f++) r[f] = 0
                ;(o >>>= 14), (h -= 14), (_ = 0), (a = 4)
              case 4:
                for (; _ < 4 + (u >>> 10); ) {
                  for (; h < 3; ) {
                    if (R === 0)
                      return (
                        (t.bitb = o),
                        (t.bitk = h),
                        (i.avail_in = R),
                        (i.total_in += w - i.next_in_index),
                        (i.next_in_index = w),
                        (t.write = v),
                        t.inflate_flush(i, p)
                      )
                    ;(p = 0), R--, (o |= (255 & i.read_byte(w++)) << h), (h += 8)
                  }
                  ;(r[rt[_++]] = 7 & o), (o >>>= 3), (h -= 3)
                }
                for (; _ < 19; ) r[rt[_++]] = 0
                if (((x[0] = 7), (s = W.inflate_trees_bits(r, x, m, B, i)), s != 0))
                  return (
                    (p = s) == -3 && ((r = null), (a = 9)),
                    (t.bitb = o),
                    (t.bitk = h),
                    (i.avail_in = R),
                    (i.total_in += w - i.next_in_index),
                    (i.next_in_index = w),
                    (t.write = v),
                    t.inflate_flush(i, p)
                  )
                ;(_ = 0), (a = 5)
              case 5:
                for (; (s = u), !(_ >= 258 + (31 & s) + ((s >> 5) & 31)); ) {
                  let N, G
                  for (s = x[0]; h < s; ) {
                    if (R === 0)
                      return (
                        (t.bitb = o),
                        (t.bitk = h),
                        (i.avail_in = R),
                        (i.total_in += w - i.next_in_index),
                        (i.next_in_index = w),
                        (t.write = v),
                        t.inflate_flush(i, p)
                      )
                    ;(p = 0), R--, (o |= (255 & i.read_byte(w++)) << h), (h += 8)
                  }
                  if (((s = B[3 * (m[0] + (o & M[s])) + 1]), (G = B[3 * (m[0] + (o & M[s])) + 2]), G < 16))
                    (o >>>= s), (h -= s), (r[_++] = G)
                  else {
                    for (f = G == 18 ? 7 : G - 14, N = G == 18 ? 11 : 3; h < s + f; ) {
                      if (R === 0)
                        return (
                          (t.bitb = o),
                          (t.bitk = h),
                          (i.avail_in = R),
                          (i.total_in += w - i.next_in_index),
                          (i.next_in_index = w),
                          (t.write = v),
                          t.inflate_flush(i, p)
                        )
                      ;(p = 0), R--, (o |= (255 & i.read_byte(w++)) << h), (h += 8)
                    }
                    if (
                      ((o >>>= s),
                      (h -= s),
                      (N += o & M[f]),
                      (o >>>= f),
                      (h -= f),
                      (f = _),
                      (s = u),
                      f + N > 258 + (31 & s) + ((s >> 5) & 31) || (G == 16 && f < 1))
                    )
                      return (
                        (r = null),
                        (a = 9),
                        (i.msg = 'invalid bit length repeat'),
                        (p = -3),
                        (t.bitb = o),
                        (t.bitk = h),
                        (i.avail_in = R),
                        (i.total_in += w - i.next_in_index),
                        (i.next_in_index = w),
                        (t.write = v),
                        t.inflate_flush(i, p)
                      )
                    G = G == 16 ? r[f - 1] : 0
                    do r[f++] = G
                    while (--N != 0)
                    _ = f
                  }
                }
                if (
                  ((m[0] = -1),
                  (A = []),
                  (L = []),
                  (P = []),
                  (K = []),
                  (A[0] = 9),
                  (L[0] = 6),
                  (s = u),
                  (s = W.inflate_trees_dynamic(257 + (31 & s), 1 + ((s >> 5) & 31), r, A, L, P, K, B, i)),
                  s != 0)
                )
                  return (
                    s == -3 && ((r = null), (a = 9)),
                    (p = s),
                    (t.bitb = o),
                    (t.bitk = h),
                    (i.avail_in = R),
                    (i.total_in += w - i.next_in_index),
                    (i.next_in_index = w),
                    (t.write = v),
                    t.inflate_flush(i, p)
                  )
                S.init(A[0], L[0], B, P[0], B, K[0]), (a = 6)
              case 6:
                if (
                  ((t.bitb = o),
                  (t.bitk = h),
                  (i.avail_in = R),
                  (i.total_in += w - i.next_in_index),
                  (i.next_in_index = w),
                  (t.write = v),
                  (p = S.proc(t, i, p)) != 1)
                )
                  return t.inflate_flush(i, p)
                if (
                  ((p = 0),
                  S.free(i),
                  (w = i.next_in_index),
                  (R = i.avail_in),
                  (o = t.bitb),
                  (h = t.bitk),
                  (v = t.write),
                  (y = v < t.read ? t.read - v - 1 : t.end - v),
                  F === 0)
                ) {
                  a = 0
                  break
                }
                a = 7
              case 7:
                if (
                  ((t.write = v),
                  (p = t.inflate_flush(i, p)),
                  (v = t.write),
                  (y = v < t.read ? t.read - v - 1 : t.end - v),
                  t.read != t.write)
                )
                  return (
                    (t.bitb = o),
                    (t.bitk = h),
                    (i.avail_in = R),
                    (i.total_in += w - i.next_in_index),
                    (i.next_in_index = w),
                    (t.write = v),
                    t.inflate_flush(i, p)
                  )
                a = 8
              case 8:
                return (
                  (p = 1),
                  (t.bitb = o),
                  (t.bitk = h),
                  (i.avail_in = R),
                  (i.total_in += w - i.next_in_index),
                  (i.next_in_index = w),
                  (t.write = v),
                  t.inflate_flush(i, p)
                )
              case 9:
                return (
                  (p = -3),
                  (t.bitb = o),
                  (t.bitk = h),
                  (i.avail_in = R),
                  (i.total_in += w - i.next_in_index),
                  (i.next_in_index = w),
                  (t.write = v),
                  t.inflate_flush(i, p)
                )
              default:
                return (
                  (p = -2),
                  (t.bitb = o),
                  (t.bitk = h),
                  (i.avail_in = R),
                  (i.total_in += w - i.next_in_index),
                  (i.next_in_index = w),
                  (t.write = v),
                  t.inflate_flush(i, p)
                )
            }
          }
        }),
        (t.free = function (i) {
          t.reset(i, null), (t.window = null), (B = null)
        }),
        (t.set_dictionary = function (i, p, s) {
          t.window.set(i.subarray(p, p + s), 0), (t.read = t.write = s)
        }),
        (t.sync_point = function () {
          return a == 1 ? 1 : 0
        })
    }
    const ct = 13,
      _t = [0, 0, 255, 255]
    function kt() {
      const n = this
      function e(t) {
        return t && t.istate
          ? ((t.total_in = t.total_out = 0), (t.msg = null), (t.istate.mode = 7), t.istate.blocks.reset(t, null), 0)
          : -2
      }
      ;(n.mode = 0),
        (n.method = 0),
        (n.was = [0]),
        (n.need = 0),
        (n.marker = 0),
        (n.wbits = 0),
        (n.inflateEnd = function (t) {
          return n.blocks && n.blocks.free(t), (n.blocks = null), 0
        }),
        (n.inflateInit = function (t, r) {
          return (
            (t.msg = null),
            (n.blocks = null),
            r < 8 || r > 15 ? (n.inflateEnd(t), -2) : ((n.wbits = r), (t.istate.blocks = new tt(t, 1 << r)), e(t), 0)
          )
        }),
        (n.inflate = function (t, r) {
          let a, d
          if (!t || !t.istate || !t.next_in) return -2
          const u = t.istate
          for (r = r == 4 ? -5 : 0, a = -5; ; )
            switch (u.mode) {
              case 0:
                if (t.avail_in === 0) return a
                if (((a = r), t.avail_in--, t.total_in++, (15 & (u.method = t.read_byte(t.next_in_index++))) != 8)) {
                  ;(u.mode = ct), (t.msg = 'unknown compression method'), (u.marker = 5)
                  break
                }
                if (8 + (u.method >> 4) > u.wbits) {
                  ;(u.mode = ct), (t.msg = 'invalid window size'), (u.marker = 5)
                  break
                }
                u.mode = 1
              case 1:
                if (t.avail_in === 0) return a
                if (
                  ((a = r),
                  t.avail_in--,
                  t.total_in++,
                  (d = 255 & t.read_byte(t.next_in_index++)),
                  ((u.method << 8) + d) % 31 != 0)
                ) {
                  ;(u.mode = ct), (t.msg = 'incorrect header check'), (u.marker = 5)
                  break
                }
                if (!(32 & d)) {
                  u.mode = 7
                  break
                }
                u.mode = 2
              case 2:
                if (t.avail_in === 0) return a
                ;(a = r),
                  t.avail_in--,
                  t.total_in++,
                  (u.need = ((255 & t.read_byte(t.next_in_index++)) << 24) & 4278190080),
                  (u.mode = 3)
              case 3:
                if (t.avail_in === 0) return a
                ;(a = r),
                  t.avail_in--,
                  t.total_in++,
                  (u.need += ((255 & t.read_byte(t.next_in_index++)) << 16) & 16711680),
                  (u.mode = 4)
              case 4:
                if (t.avail_in === 0) return a
                ;(a = r),
                  t.avail_in--,
                  t.total_in++,
                  (u.need += ((255 & t.read_byte(t.next_in_index++)) << 8) & 65280),
                  (u.mode = 5)
              case 5:
                return t.avail_in === 0
                  ? a
                  : ((a = r),
                    t.avail_in--,
                    t.total_in++,
                    (u.need += 255 & t.read_byte(t.next_in_index++)),
                    (u.mode = 6),
                    2)
              case 6:
                return (u.mode = ct), (t.msg = 'need dictionary'), (u.marker = 0), -2
              case 7:
                if (((a = u.blocks.proc(t, a)), a == -3)) {
                  ;(u.mode = ct), (u.marker = 0)
                  break
                }
                if ((a == 0 && (a = r), a != 1)) return a
                ;(a = r), u.blocks.reset(t, u.was), (u.mode = 12)
              case 12:
                return 1
              case ct:
                return -3
              default:
                return -2
            }
        }),
        (n.inflateSetDictionary = function (t, r, a) {
          let d = 0,
            u = a
          if (!t || !t.istate || t.istate.mode != 6) return -2
          const _ = t.istate
          return (
            u >= 1 << _.wbits && ((u = (1 << _.wbits) - 1), (d = a - u)),
            _.blocks.set_dictionary(r, d, u),
            (_.mode = 7),
            0
          )
        }),
        (n.inflateSync = function (t) {
          let r, a, d, u, _
          if (!t || !t.istate) return -2
          const x = t.istate
          if ((x.mode != ct && ((x.mode = ct), (x.marker = 0)), (r = t.avail_in) === 0)) return -5
          for (a = t.next_in_index, d = x.marker; r !== 0 && d < 4; )
            t.read_byte(a) == _t[d] ? d++ : (d = t.read_byte(a) !== 0 ? 0 : 4 - d), a++, r--
          return (
            (t.total_in += a - t.next_in_index),
            (t.next_in_index = a),
            (t.avail_in = r),
            (x.marker = d),
            d != 4
              ? -3
              : ((u = t.total_in), (_ = t.total_out), e(t), (t.total_in = u), (t.total_out = _), (x.mode = 7), 0)
          )
        }),
        (n.inflateSyncPoint = function (t) {
          return t && t.istate && t.istate.blocks ? t.istate.blocks.sync_point() : -2
        })
    }
    function Qt() {}
    Qt.prototype = {
      inflateInit: function (n) {
        const e = this
        return (e.istate = new kt()), n || (n = 15), e.istate.inflateInit(e, n)
      },
      inflate: function (n) {
        const e = this
        return e.istate ? e.istate.inflate(e, n) : -2
      },
      inflateEnd: function () {
        const n = this
        if (!n.istate) return -2
        const e = n.istate.inflateEnd(n)
        return (n.istate = null), e
      },
      inflateSync: function () {
        const n = this
        return n.istate ? n.istate.inflateSync(n) : -2
      },
      inflateSetDictionary: function (n, e) {
        const t = this
        return t.istate ? t.istate.inflateSetDictionary(t, n, e) : -2
      },
      read_byte: function (n) {
        return this.next_in[n]
      },
      read_buf: function (n, e) {
        return this.next_in.subarray(n, n + e)
      },
    }
    const rn = {
        chunkSize: 524288,
        maxWorkers: (typeof navigator < 'u' && navigator.hardwareConcurrency) || 2,
        terminateWorkerTimeout: 5e3,
        useWebWorkers: !0,
        workerScripts: void 0,
      },
      st = Object.assign({}, rn)
    function te(n) {
      if (
        (n.baseURL !== void 0 && (st.baseURL = n.baseURL),
        n.chunkSize !== void 0 && (st.chunkSize = n.chunkSize),
        n.maxWorkers !== void 0 && (st.maxWorkers = n.maxWorkers),
        n.terminateWorkerTimeout !== void 0 && (st.terminateWorkerTimeout = n.terminateWorkerTimeout),
        n.useWebWorkers !== void 0 && (st.useWebWorkers = n.useWebWorkers),
        n.Deflate !== void 0 && (st.Deflate = n.Deflate),
        n.Inflate !== void 0 && (st.Inflate = n.Inflate),
        n.workerScripts !== void 0)
      ) {
        if (n.workerScripts.deflate) {
          if (!Array.isArray(n.workerScripts.deflate)) throw new Error('workerScripts.deflate must be an array')
          st.workerScripts || (st.workerScripts = {}), (st.workerScripts.deflate = n.workerScripts.deflate)
        }
        if (n.workerScripts.inflate) {
          if (!Array.isArray(n.workerScripts.inflate)) throw new Error('workerScripts.inflate must be an array')
          st.workerScripts || (st.workerScripts = {}), (st.workerScripts.inflate = n.workerScripts.inflate)
        }
      }
    }
    const ee = 'Abort error'
    function zt(n, e) {
      if (n && n.aborted) throw (e.flush(), new Error(ee))
    }
    async function ne(n, e) {
      return e.length && (await n.writeUint8Array(e)), e.length
    }
    const re = 'HTTP error ',
      Lt = 'HTTP Range not supported',
      Mt = 'text/plain',
      Dt = 'GET',
      sn = 'bytes'
    class se {
      constructor() {
        this.size = 0
      }
      init() {
        this.initialized = !0
      }
    }
    class dt extends se {}
    class vt extends se {
      writeUint8Array(e) {
        this.size += e.length
      }
    }
    class ie extends dt {
      constructor(e) {
        super(), (this.blob = e), (this.size = e.size)
      }
      async readUint8Array(e, t) {
        if (this.blob.arrayBuffer) return new Uint8Array(await this.blob.slice(e, e + t).arrayBuffer())
        {
          const r = new FileReader()
          return new Promise((a, d) => {
            ;(r.onload = (u) => a(new Uint8Array(u.target.result))),
              (r.onerror = () => d(r.error)),
              r.readAsArrayBuffer(this.blob.slice(e, e + t))
          })
        }
      }
    }
    class an extends dt {
      constructor(e, t) {
        super(),
          (this.url = e),
          (this.preventHeadRequest = t.preventHeadRequest),
          (this.useRangeHeader = t.useRangeHeader),
          (this.forceRangeRequests = t.forceRangeRequests),
          (this.options = Object.assign({}, t)),
          delete this.options.preventHeadRequest,
          delete this.options.useRangeHeader,
          delete this.options.forceRangeRequests,
          delete this.options.useXHR
      }
      async init() {
        super.init(), await ae(this, Nt, le)
      }
      async readUint8Array(e, t) {
        return oe(this, e, t, Nt, le)
      }
    }
    class on extends dt {
      constructor(e, t) {
        super(),
          (this.url = e),
          (this.preventHeadRequest = t.preventHeadRequest),
          (this.useRangeHeader = t.useRangeHeader),
          (this.forceRangeRequests = t.forceRangeRequests),
          (this.options = t)
      }
      async init() {
        super.init(), await ae(this, Wt, de)
      }
      async readUint8Array(e, t) {
        return oe(this, e, t, Wt, de)
      }
    }
    async function ae(n, e, t) {
      if (
        (function (r) {
          if (typeof document < 'u') {
            const a = document.createElement('a')
            return (a.href = r), a.protocol == 'http:' || a.protocol == 'https:'
          }
          return /^https?:\/\//i.test(r)
        })(n.url) &&
        (n.useRangeHeader || n.forceRangeRequests)
      ) {
        const r = await e(Dt, n, ce(n))
        if (!n.forceRangeRequests && r.headers.get('Accept-Ranges') != sn) throw new Error(Lt)
        {
          let a
          const d = r.headers.get('Content-Range')
          if (d) {
            const u = d.trim().split(/\s*\/\s*/)
            if (u.length) {
              const _ = u[1]
              _ && _ != '*' && (a = Number(_))
            }
          }
          a === void 0 ? await he(n, e, t) : (n.size = a)
        }
      } else await he(n, e, t)
    }
    async function oe(n, e, t, r, a) {
      if (n.useRangeHeader || n.forceRangeRequests) {
        const d = await r(Dt, n, ce(n, e, t))
        if (d.status != 206) throw new Error(Lt)
        return new Uint8Array(await d.arrayBuffer())
      }
      return n.data || (await a(n, n.options)), new Uint8Array(n.data.subarray(e, e + t))
    }
    function ce(n, e = 0, t = 1) {
      return Object.assign({}, Ot(n), { Range: 'bytes=' + e + '-' + (e + t - 1) })
    }
    function Ot(n) {
      let e = n.options.headers
      if (e) return Symbol.iterator in e ? Object.fromEntries(e) : e
    }
    async function le(n) {
      await ue(n, Nt)
    }
    async function de(n) {
      await ue(n, Wt)
    }
    async function ue(n, e) {
      const t = await e(Dt, n, Ot(n))
      ;(n.data = new Uint8Array(await t.arrayBuffer())), n.size || (n.size = n.data.length)
    }
    async function he(n, e, t) {
      if (n.preventHeadRequest) await t(n, n.options)
      else {
        const r = (await e('HEAD', n, Ot(n))).headers.get('Content-Length')
        r ? (n.size = Number(r)) : await t(n, n.options)
      }
    }
    async function Nt(n, { options: e, url: t }, r) {
      const a = await fetch(t, Object.assign({}, e, { method: n, headers: r }))
      if (a.status < 400) return a
      throw new Error(re + (a.statusText || a.status))
    }
    function Wt(n, { url: e }, t) {
      return new Promise((r, a) => {
        const d = new XMLHttpRequest()
        if (
          (d.addEventListener(
            'load',
            () => {
              if (d.status < 400) {
                const u = []
                d
                  .getAllResponseHeaders()
                  .trim()
                  .split(/[\r\n]+/)
                  .forEach((_) => {
                    const x = _.trim().split(/\s*:\s*/)
                    ;(x[0] = x[0].trim().replace(/^[a-z]|-[a-z]/g, (m) => m.toUpperCase())), u.push(x)
                  }),
                  r({ status: d.status, arrayBuffer: () => d.response, headers: new Map(u) })
              } else a(new Error(re + (d.statusText || d.status)))
            },
            !1,
          ),
          d.addEventListener('error', (u) => a(u.detail.error), !1),
          d.open(n, e),
          t)
        )
          for (const u of Object.entries(t)) d.setRequestHeader(u[0], u[1])
        ;(d.responseType = 'arraybuffer'), d.send()
      })
    }
    class fe extends dt {
      constructor(e, t = {}) {
        super(), (this.url = e), t.useXHR ? (this.reader = new on(e, t)) : (this.reader = new an(e, t))
      }
      set size(e) {}
      get size() {
        return this.reader.size
      }
      async init() {
        super.init(), await this.reader.init()
      }
      async readUint8Array(e, t) {
        return this.reader.readUint8Array(e, t)
      }
    }
    const Tt = 4294967295,
      pe = 33639248,
      _e = 101075792,
      we = []
    for (let n = 0; n < 256; n++) {
      let e = n
      for (let t = 0; t < 8; t++) 1 & e ? (e = (e >>> 1) ^ 3988292384) : (e >>>= 1)
      we[n] = e
    }
    class St {
      constructor(e) {
        this.crc = e || -1
      }
      append(e) {
        let t = 0 | this.crc
        for (let r = 0, a = 0 | e.length; r < a; r++) t = (t >>> 8) ^ we[255 & (t ^ e[r])]
        this.crc = t
      }
      get() {
        return ~this.crc
      }
    }
    const it = {
        concat(n, e) {
          if (n.length === 0 || e.length === 0) return n.concat(e)
          const t = n[n.length - 1],
            r = it.getPartial(t)
          return r === 32 ? n.concat(e) : it._shiftRight(e, r, 0 | t, n.slice(0, n.length - 1))
        },
        bitLength(n) {
          const e = n.length
          if (e === 0) return 0
          const t = n[e - 1]
          return 32 * (e - 1) + it.getPartial(t)
        },
        clamp(n, e) {
          if (32 * n.length < e) return n
          const t = (n = n.slice(0, Math.ceil(e / 32))).length
          return (e &= 31), t > 0 && e && (n[t - 1] = it.partial(e, n[t - 1] & (2147483648 >> (e - 1)), 1)), n
        },
        partial: (n, e, t) => (n === 32 ? e : (t ? 0 | e : e << (32 - n)) + 1099511627776 * n),
        getPartial: (n) => Math.round(n / 1099511627776) || 32,
        _shiftRight(n, e, t, r) {
          for (r === void 0 && (r = []); e >= 32; e -= 32) r.push(t), (t = 0)
          if (e === 0) return r.concat(n)
          for (let u = 0; u < n.length; u++) r.push(t | (n[u] >>> e)), (t = n[u] << (32 - e))
          const a = n.length ? n[n.length - 1] : 0,
            d = it.getPartial(a)
          return r.push(it.partial((e + d) & 31, e + d > 32 ? t : r.pop(), 1)), r
        },
      },
      me = {
        bytes: {
          fromBits(n) {
            const e = it.bitLength(n) / 8,
              t = new Uint8Array(e)
            let r
            for (let a = 0; a < e; a++) !(3 & a) && (r = n[a / 4]), (t[a] = r >>> 24), (r <<= 8)
            return t
          },
          toBits(n) {
            const e = []
            let t,
              r = 0
            for (t = 0; t < n.length; t++) (r = (r << 8) | n[t]), (3 & t) == 3 && (e.push(r), (r = 0))
            return 3 & t && e.push(it.partial(8 * (3 & t), r)), e
          },
        },
      },
      ge = {
        sha1: function (n) {
          n
            ? ((this._h = n._h.slice(0)), (this._buffer = n._buffer.slice(0)), (this._length = n._length))
            : this.reset()
        },
      }
    ge.sha1.prototype = {
      blockSize: 512,
      reset: function () {
        const n = this
        return (n._h = this._init.slice(0)), (n._buffer = []), (n._length = 0), n
      },
      update: function (n) {
        const e = this
        typeof n == 'string' && (n = me.utf8String.toBits(n))
        const t = (e._buffer = it.concat(e._buffer, n)),
          r = e._length,
          a = (e._length = r + it.bitLength(n))
        if (a > 9007199254740991) throw new Error('Cannot hash more than 2^53 - 1 bits')
        const d = new Uint32Array(t)
        let u = 0
        for (let _ = e.blockSize + r - ((e.blockSize + r) & (e.blockSize - 1)); _ <= a; _ += e.blockSize)
          e._block(d.subarray(16 * u, 16 * (u + 1))), (u += 1)
        return t.splice(0, 16 * u), e
      },
      finalize: function () {
        const n = this
        let e = n._buffer
        const t = n._h
        e = it.concat(e, [it.partial(1, 1)])
        for (let r = e.length + 2; 15 & r; r++) e.push(0)
        for (e.push(Math.floor(n._length / 4294967296)), e.push(0 | n._length); e.length; ) n._block(e.splice(0, 16))
        return n.reset(), t
      },
      _init: [1732584193, 4023233417, 2562383102, 271733878, 3285377520],
      _key: [1518500249, 1859775393, 2400959708, 3395469782],
      _f: function (n, e, t, r) {
        return n <= 19
          ? (e & t) | (~e & r)
          : n <= 39
          ? e ^ t ^ r
          : n <= 59
          ? (e & t) | (e & r) | (t & r)
          : n <= 79
          ? e ^ t ^ r
          : void 0
      },
      _S: function (n, e) {
        return (e << n) | (e >>> (32 - n))
      },
      _block: function (n) {
        const e = this,
          t = e._h,
          r = Array(80)
        for (let m = 0; m < 16; m++) r[m] = n[m]
        let a = t[0],
          d = t[1],
          u = t[2],
          _ = t[3],
          x = t[4]
        for (let m = 0; m <= 79; m++) {
          m >= 16 && (r[m] = e._S(1, r[m - 3] ^ r[m - 8] ^ r[m - 14] ^ r[m - 16]))
          const S = (e._S(5, a) + e._f(m, d, u, _) + x + r[m] + e._key[Math.floor(m / 20)]) | 0
          ;(x = _), (_ = u), (u = e._S(30, d)), (d = a), (a = S)
        }
        ;(t[0] = (t[0] + a) | 0),
          (t[1] = (t[1] + d) | 0),
          (t[2] = (t[2] + u) | 0),
          (t[3] = (t[3] + _) | 0),
          (t[4] = (t[4] + x) | 0)
      },
    }
    const cn = {
        aes: class {
          constructor(n) {
            const e = this
            ;(e._tables = [
              [[], [], [], [], []],
              [[], [], [], [], []],
            ]),
              e._tables[0][0][0] || e._precompute()
            const t = e._tables[0][4],
              r = e._tables[1],
              a = n.length
            let d,
              u,
              _,
              x = 1
            if (a !== 4 && a !== 6 && a !== 8) throw new Error('invalid aes key size')
            for (e._key = [(u = n.slice(0)), (_ = [])], d = a; d < 4 * a + 28; d++) {
              let m = u[d - 1]
              ;(d % a == 0 || (a === 8 && d % a == 4)) &&
                ((m = (t[m >>> 24] << 24) ^ (t[(m >> 16) & 255] << 16) ^ (t[(m >> 8) & 255] << 8) ^ t[255 & m]),
                d % a == 0 && ((m = (m << 8) ^ (m >>> 24) ^ (x << 24)), (x = (x << 1) ^ (283 * (x >> 7))))),
                (u[d] = u[d - a] ^ m)
            }
            for (let m = 0; d; m++, d--) {
              const S = u[3 & m ? d : d - 4]
              _[m] =
                d <= 4 || m < 4
                  ? S
                  : r[0][t[S >>> 24]] ^ r[1][t[(S >> 16) & 255]] ^ r[2][t[(S >> 8) & 255]] ^ r[3][t[255 & S]]
            }
          }
          encrypt(n) {
            return this._crypt(n, 0)
          }
          decrypt(n) {
            return this._crypt(n, 1)
          }
          _precompute() {
            const n = this._tables[0],
              e = this._tables[1],
              t = n[4],
              r = e[4],
              a = [],
              d = []
            let u, _, x, m
            for (let S = 0; S < 256; S++) d[(a[S] = (S << 1) ^ (283 * (S >> 7))) ^ S] = S
            for (let S = (u = 0); !t[S]; S ^= _ || 1, u = d[u] || 1) {
              let F = u ^ (u << 1) ^ (u << 2) ^ (u << 3) ^ (u << 4)
              ;(F = (F >> 8) ^ (255 & F) ^ 99), (t[S] = F), (r[F] = S), (m = a[(x = a[(_ = a[S])])])
              let B = (16843009 * m) ^ (65537 * x) ^ (257 * _) ^ (16843008 * S),
                W = (257 * a[F]) ^ (16843008 * F)
              for (let i = 0; i < 4; i++) (n[i][S] = W = (W << 24) ^ (W >>> 8)), (e[i][F] = B = (B << 24) ^ (B >>> 8))
            }
            for (let S = 0; S < 5; S++) (n[S] = n[S].slice(0)), (e[S] = e[S].slice(0))
          }
          _crypt(n, e) {
            if (n.length !== 4) throw new Error('invalid aes block size')
            const t = this._key[e],
              r = t.length / 4 - 2,
              a = [0, 0, 0, 0],
              d = this._tables[e],
              u = d[0],
              _ = d[1],
              x = d[2],
              m = d[3],
              S = d[4]
            let F,
              B,
              W,
              i = n[0] ^ t[0],
              p = n[e ? 3 : 1] ^ t[1],
              s = n[2] ^ t[2],
              o = n[e ? 1 : 3] ^ t[3],
              h = 4
            for (let w = 0; w < r; w++)
              (F = u[i >>> 24] ^ _[(p >> 16) & 255] ^ x[(s >> 8) & 255] ^ m[255 & o] ^ t[h]),
                (B = u[p >>> 24] ^ _[(s >> 16) & 255] ^ x[(o >> 8) & 255] ^ m[255 & i] ^ t[h + 1]),
                (W = u[s >>> 24] ^ _[(o >> 16) & 255] ^ x[(i >> 8) & 255] ^ m[255 & p] ^ t[h + 2]),
                (o = u[o >>> 24] ^ _[(i >> 16) & 255] ^ x[(p >> 8) & 255] ^ m[255 & s] ^ t[h + 3]),
                (h += 4),
                (i = F),
                (p = B),
                (s = W)
            for (let w = 0; w < 4; w++)
              (a[e ? 3 & -w : w] =
                (S[i >>> 24] << 24) ^ (S[(p >> 16) & 255] << 16) ^ (S[(s >> 8) & 255] << 8) ^ S[255 & o] ^ t[h++]),
                (F = i),
                (i = p),
                (p = s),
                (s = o),
                (o = F)
            return a
          }
        },
      },
      ln = {
        ctrGladman: class {
          constructor(n, e) {
            ;(this._prf = n), (this._initIv = e), (this._iv = e)
          }
          reset() {
            this._iv = this._initIv
          }
          update(n) {
            return this.calculate(this._prf, n, this._iv)
          }
          incWord(n) {
            if (((n >> 24) & 255) == 255) {
              let e = (n >> 16) & 255,
                t = (n >> 8) & 255,
                r = 255 & n
              e === 255 ? ((e = 0), t === 255 ? ((t = 0), r === 255 ? (r = 0) : ++r) : ++t) : ++e,
                (n = 0),
                (n += e << 16),
                (n += t << 8),
                (n += r)
            } else n += 1 << 24
            return n
          }
          incCounter(n) {
            ;(n[0] = this.incWord(n[0])) === 0 && (n[1] = this.incWord(n[1]))
          }
          calculate(n, e, t) {
            let r
            if (!(r = e.length)) return []
            const a = it.bitLength(e)
            for (let d = 0; d < r; d += 4) {
              this.incCounter(t)
              const u = n.encrypt(t)
              ;(e[d] ^= u[0]), (e[d + 1] ^= u[1]), (e[d + 2] ^= u[2]), (e[d + 3] ^= u[3])
            }
            return it.clamp(e, a)
          }
        },
      },
      dn = {
        hmacSha1: class {
          constructor(n) {
            const e = this,
              t = (e._hash = ge.sha1),
              r = [[], []],
              a = t.prototype.blockSize / 32
            ;(e._baseHash = [new t(), new t()]), n.length > a && (n = t.hash(n))
            for (let d = 0; d < a; d++) (r[0][d] = 909522486 ^ n[d]), (r[1][d] = 1549556828 ^ n[d])
            e._baseHash[0].update(r[0]), e._baseHash[1].update(r[1]), (e._resultHash = new t(e._baseHash[0]))
          }
          reset() {
            const n = this
            ;(n._resultHash = new n._hash(n._baseHash[0])), (n._updated = !1)
          }
          update(n) {
            ;(this._updated = !0), this._resultHash.update(n)
          }
          digest() {
            const n = this,
              e = n._resultHash.finalize(),
              t = new n._hash(n._baseHash[1]).update(e).finalize()
            return n.reset(), t
          }
        },
      },
      Pt = 'Invalid pasword',
      gt = 16,
      be = { name: 'PBKDF2' },
      un = Object.assign({ hash: { name: 'HMAC' } }, be),
      hn = Object.assign({ iterations: 1e3, hash: { name: 'SHA-1' } }, be),
      fn = ['deriveBits'],
      Rt = [8, 12, 16],
      At = [16, 24, 32],
      ut = 10,
      ye = [0, 0, 0, 0],
      lt = me.bytes,
      xe = cn.aes,
      ke = ln.ctrGladman,
      ve = dn.hmacSha1
    class pn {
      constructor(e, t, r) {
        Object.assign(this, { password: e, signed: t, strength: r - 1, pendingInput: new Uint8Array(0) })
      }
      async append(e) {
        const t = this
        if (t.password) {
          const r = at(e, 0, Rt[t.strength] + 2)
          await (async function (a, d, u) {
            await Re(a, u, at(d, 0, Rt[a.strength]))
            const _ = at(d, Rt[a.strength]),
              x = a.keys.passwordVerification
            if (x[0] != _[0] || x[1] != _[1]) throw new Error(Pt)
          })(t, r, t.password),
            (t.password = null),
            (t.aesCtrGladman = new ke(new xe(t.keys.key), Array.from(ye))),
            (t.hmac = new ve(t.keys.authentication)),
            (e = at(e, Rt[t.strength] + 2))
        }
        return Se(t, e, new Uint8Array(e.length - ut - ((e.length - ut) % gt)), 0, ut, !0)
      }
      flush() {
        const e = this,
          t = e.pendingInput,
          r = at(t, 0, t.length - ut),
          a = at(t, t.length - ut)
        let d = new Uint8Array(0)
        if (r.length) {
          const _ = lt.toBits(r)
          e.hmac.update(_)
          const x = e.aesCtrGladman.update(_)
          d = lt.fromBits(x)
        }
        let u = !0
        if (e.signed) {
          const _ = at(lt.fromBits(e.hmac.digest()), 0, ut)
          for (let x = 0; x < ut; x++) _[x] != a[x] && (u = !1)
        }
        return { valid: u, data: d }
      }
    }
    class _n {
      constructor(e, t) {
        Object.assign(this, { password: e, strength: t - 1, pendingInput: new Uint8Array(0) })
      }
      async append(e) {
        const t = this
        let r = new Uint8Array(0)
        t.password &&
          ((r = await (async function (d, u) {
            const _ = crypto.getRandomValues(new Uint8Array(Rt[d.strength]))
            return await Re(d, u, _), Bt(_, d.keys.passwordVerification)
          })(t, t.password)),
          (t.password = null),
          (t.aesCtrGladman = new ke(new xe(t.keys.key), Array.from(ye))),
          (t.hmac = new ve(t.keys.authentication)))
        const a = new Uint8Array(r.length + e.length - (e.length % gt))
        return a.set(r, 0), Se(t, e, a, r.length, 0)
      }
      flush() {
        const e = this
        let t = new Uint8Array(0)
        if (e.pendingInput.length) {
          const a = e.aesCtrGladman.update(lt.toBits(e.pendingInput))
          e.hmac.update(a), (t = lt.fromBits(a))
        }
        const r = at(lt.fromBits(e.hmac.digest()), 0, ut)
        return { data: Bt(t, r), signature: r }
      }
    }
    function Se(n, e, t, r, a, d) {
      const u = e.length - a
      let _
      for (
        n.pendingInput.length &&
          ((e = Bt(n.pendingInput, e)),
          (t = (function (x, m) {
            if (m && m > x.length) {
              const S = x
              ;(x = new Uint8Array(m)).set(S, 0)
            }
            return x
          })(t, u - (u % gt)))),
          _ = 0;
        _ <= u - gt;
        _ += gt
      ) {
        const x = lt.toBits(at(e, _, _ + gt))
        d && n.hmac.update(x)
        const m = n.aesCtrGladman.update(x)
        d || n.hmac.update(m), t.set(lt.fromBits(m), _ + r)
      }
      return (n.pendingInput = at(e, _)), t
    }
    async function Re(n, e, t) {
      const r = (function (_) {
          if (typeof TextEncoder > 'u') {
            _ = unescape(encodeURIComponent(_))
            const x = new Uint8Array(_.length)
            for (let m = 0; m < x.length; m++) x[m] = _.charCodeAt(m)
            return x
          }
          return new TextEncoder().encode(_)
        })(e),
        a = await crypto.subtle.importKey('raw', r, un, !1, fn),
        d = await crypto.subtle.deriveBits(Object.assign({ salt: t }, hn), a, 8 * (2 * At[n.strength] + 2)),
        u = new Uint8Array(d)
      n.keys = {
        key: lt.toBits(at(u, 0, At[n.strength])),
        authentication: lt.toBits(at(u, At[n.strength], 2 * At[n.strength])),
        passwordVerification: at(u, 2 * At[n.strength]),
      }
    }
    function Bt(n, e) {
      let t = n
      return n.length + e.length && ((t = new Uint8Array(n.length + e.length)), t.set(n, 0), t.set(e, n.length)), t
    }
    function at(n, e, t) {
      return n.subarray(e, t)
    }
    const Ut = 12
    class wn {
      constructor(e, t) {
        Object.assign(this, { password: e, passwordVerification: t }), Ue(this, e)
      }
      append(e) {
        const t = this
        if (t.password) {
          const r = Ae(t, e.subarray(0, Ut))
          if (((t.password = null), r[11] != t.passwordVerification)) throw new Error(Pt)
          e = e.subarray(Ut)
        }
        return Ae(t, e)
      }
      flush() {
        return { valid: !0, data: new Uint8Array(0) }
      }
    }
    class mn {
      constructor(e, t) {
        Object.assign(this, { password: e, passwordVerification: t }), Ue(this, e)
      }
      append(e) {
        const t = this
        let r, a
        if (t.password) {
          t.password = null
          const d = crypto.getRandomValues(new Uint8Array(Ut))
          ;(d[11] = t.passwordVerification), (r = new Uint8Array(e.length + d.length)), r.set(Te(t, d), 0), (a = Ut)
        } else (r = new Uint8Array(e.length)), (a = 0)
        return r.set(Te(t, e), a), r
      }
      flush() {
        return { data: new Uint8Array(0) }
      }
    }
    function Ae(n, e) {
      const t = new Uint8Array(e.length)
      for (let r = 0; r < e.length; r++) (t[r] = Ee(n) ^ e[r]), Ht(n, t[r])
      return t
    }
    function Te(n, e) {
      const t = new Uint8Array(e.length)
      for (let r = 0; r < e.length; r++) (t[r] = Ee(n) ^ e[r]), Ht(n, e[r])
      return t
    }
    function Ue(n, e) {
      ;(n.keys = [305419896, 591751049, 878082192]), (n.crcKey0 = new St(n.keys[0])), (n.crcKey2 = new St(n.keys[2]))
      for (let t = 0; t < e.length; t++) Ht(n, e.charCodeAt(t))
    }
    function Ht(n, e) {
      n.crcKey0.append([e]),
        (n.keys[0] = ~n.crcKey0.get()),
        (n.keys[1] = Ie(n.keys[1] + Ce(n.keys[0]))),
        (n.keys[1] = Ie(Math.imul(n.keys[1], 134775813) + 1)),
        n.crcKey2.append([n.keys[1] >>> 24]),
        (n.keys[2] = ~n.crcKey2.get())
    }
    function Ee(n) {
      const e = 2 | n.keys[2]
      return Ce(Math.imul(e, 1 ^ e) >>> 8)
    }
    function Ce(n) {
      return 255 & n
    }
    function Ie(n) {
      return 4294967295 & n
    }
    const Fe = 'inflate',
      jt = 'Invalid signature'
    class gn {
      constructor(
        e,
        {
          signature: t,
          password: r,
          signed: a,
          compressed: d,
          zipCrypto: u,
          passwordVerification: _,
          encryptionStrength: x,
        },
        { chunkSize: m },
      ) {
        const S = !!r
        Object.assign(this, {
          signature: t,
          encrypted: S,
          signed: a,
          compressed: d,
          inflate: d && new e({ chunkSize: m }),
          crc32: a && new St(),
          zipCrypto: u,
          decrypt: S && u ? new wn(r, _) : new pn(r, a, x),
        })
      }
      async append(e) {
        const t = this
        return (
          t.encrypted && e.length && (e = await t.decrypt.append(e)),
          t.compressed && e.length && (e = await t.inflate.append(e)),
          (!t.encrypted || t.zipCrypto) && t.signed && e.length && t.crc32.append(e),
          e
        )
      }
      async flush() {
        const e = this
        let t,
          r = new Uint8Array(0)
        if (e.encrypted) {
          const a = e.decrypt.flush()
          if (!a.valid) throw new Error(jt)
          r = a.data
        }
        if ((!e.encrypted || e.zipCrypto) && e.signed) {
          const a = new DataView(new Uint8Array(4).buffer)
          if (((t = e.crc32.get()), a.setUint32(0, t), e.signature != a.getUint32(0, !1))) throw new Error(jt)
        }
        return (
          e.compressed && ((r = (await e.inflate.append(r)) || new Uint8Array(0)), await e.inflate.flush()),
          { data: r, signature: t }
        )
      }
    }
    class bn {
      constructor(
        e,
        {
          encrypted: t,
          signed: r,
          compressed: a,
          level: d,
          zipCrypto: u,
          password: _,
          passwordVerification: x,
          encryptionStrength: m,
        },
        { chunkSize: S },
      ) {
        Object.assign(this, {
          encrypted: t,
          signed: r,
          compressed: a,
          deflate: a && new e({ level: d || 5, chunkSize: S }),
          crc32: r && new St(),
          zipCrypto: u,
          encrypt: t && u ? new mn(_, x) : new _n(_, m),
        })
      }
      async append(e) {
        const t = this
        let r = e
        return (
          t.compressed && e.length && (r = await t.deflate.append(e)),
          t.encrypted && r.length && (r = await t.encrypt.append(r)),
          (!t.encrypted || t.zipCrypto) && t.signed && e.length && t.crc32.append(e),
          r
        )
      }
      async flush() {
        const e = this
        let t,
          r = new Uint8Array(0)
        if ((e.compressed && (r = (await e.deflate.flush()) || new Uint8Array(0)), e.encrypted)) {
          r = await e.encrypt.append(r)
          const a = e.encrypt.flush()
          t = a.signature
          const d = new Uint8Array(r.length + a.data.length)
          d.set(r, 0), d.set(a.data, r.length), (r = d)
        }
        return (e.encrypted && !e.zipCrypto) || !e.signed || (t = e.crc32.get()), { data: r, signature: t }
      }
    }
    const ze = 'init',
      Le = 'append',
      qt = 'flush',
      yn = 'message'
    let Me = !0
    var Vt = (n, e, t, r, a, d, u) => (
      Object.assign(n, {
        busy: !0,
        codecConstructor: e,
        options: Object.assign({}, t),
        scripts: u,
        terminate() {
          n.worker && !n.busy && (n.worker.terminate(), (n.interface = null))
        },
        onTaskFinished() {
          ;(n.busy = !1), a(n)
        },
      }),
      d
        ? (function (_, x) {
            let m
            const S = { type: 'module' }
            if (!_.interface) {
              if (Me)
                try {
                  _.worker = F({}, x.baseURL)
                } catch {
                  ;(Me = !1), (_.worker = F(S, x.baseURL))
                }
              else _.worker = F(S, x.baseURL)
              _.worker.addEventListener(yn, i, !1),
                (_.interface = { append: (p) => B({ type: Le, data: p }), flush: () => B({ type: qt }) })
            }
            return _.interface
            function F(p, s) {
              let o
              try {
                o = new URL(_.scripts[0], s)
              } catch {
                o = _.scripts[0]
              }
              return new Worker(o, p)
            }
            async function B(p) {
              if (!m) {
                const s = _.options,
                  o = _.scripts.slice(1)
                await W({ scripts: o, type: ze, options: s, config: { chunkSize: x.chunkSize } })
              }
              return W(p)
            }
            function W(p) {
              const s = _.worker,
                o = new Promise((h, w) => (m = { resolve: h, reject: w }))
              try {
                if (p.data)
                  try {
                    ;(p.data = p.data.buffer), s.postMessage(p, [p.data])
                  } catch {
                    s.postMessage(p)
                  }
                else s.postMessage(p)
              } catch (h) {
                m.reject(h), (m = null), _.onTaskFinished()
              }
              return o
            }
            function i(p) {
              const s = p.data
              if (m) {
                const o = s.error,
                  h = s.type
                if (o) {
                  const w = new Error(o.message)
                  ;(w.stack = o.stack), m.reject(w), (m = null), _.onTaskFinished()
                } else if (h == ze || h == qt || h == Le) {
                  const w = s.data
                  h == qt
                    ? (m.resolve({ data: new Uint8Array(w), signature: s.signature }), (m = null), _.onTaskFinished())
                    : m.resolve(w && new Uint8Array(w))
                }
              }
            }
          })(n, r)
        : (function (_, x) {
            const m = (function (S, F, B) {
              return F.codecType.startsWith('deflate')
                ? new bn(S, F, B)
                : F.codecType.startsWith(Fe)
                ? new gn(S, F, B)
                : void 0
            })(_.codecConstructor, _.options, x)
            return {
              async append(S) {
                try {
                  return await m.append(S)
                } catch (F) {
                  throw (_.onTaskFinished(), F)
                }
              },
              async flush() {
                try {
                  return await m.flush()
                } finally {
                  _.onTaskFinished()
                }
              },
            }
          })(n, r)
    )
    let wt = [],
      $t = []
    function De(n) {
      n.terminateTimeout && (clearTimeout(n.terminateTimeout), (n.terminateTimeout = null))
    }
    const xn =
      '\0☺☻♥♦♣♠•◘○◙♂♀♪♫☼►◄↕‼¶§▬↨↑↓→←∟↔▲▼ !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~⌂ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜ¢£¥₧ƒáíóúñÑªº¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ '.split(
        '',
      )
    async function Gt(n, e) {
      if (e && e.trim().toLowerCase() == 'cp437')
        return ((t) => {
          let r = ''
          for (let a = 0; a < t.length; a++) r += xn[t[a]]
          return r
        })(n)
      if (typeof TextDecoder > 'u') {
        const t = new FileReader()
        return new Promise((r, a) => {
          ;(t.onload = (d) => r(d.target.result)), (t.onerror = () => a(t.error)), t.readAsText(new Blob([n]))
        })
      }
      return new TextDecoder(e).decode(n)
    }
    const kn = [
      'filename',
      'rawFilename',
      'directory',
      'encrypted',
      'compressedSize',
      'uncompressedSize',
      'lastModDate',
      'rawLastModDate',
      'comment',
      'rawComment',
      'signature',
      'extraField',
      'rawExtraField',
      'bitFlag',
      'extraFieldZip64',
      'extraFieldUnicodePath',
      'extraFieldUnicodeComment',
      'extraFieldAES',
      'filenameUTF8',
      'commentUTF8',
      'offset',
      'zip64',
      'compressionMethod',
      'extraFieldNTFS',
      'lastAccessDate',
      'creationDate',
      'extraFieldExtendedTimestamp',
      'version',
      'versionMadeBy',
      'msDosCompatible',
      'internalFileAttribute',
      'externalFileAttribute',
    ]
    class Oe {
      constructor(e) {
        kn.forEach((t) => (this[t] = e[t]))
      }
    }
    const Et = 'File format is not recognized',
      Ne = 'End of central directory not found',
      We = 'End of Zip64 central directory not found',
      Pe = 'End of Zip64 central directory locator not found',
      Be = 'Central directory header not found',
      He = 'Local file header not found',
      je = 'Zip64 extra field not found',
      qe = 'File contains encrypted entry',
      Ve = 'Encryption method not supported',
      Kt = 'Compression method not supported',
      $e = 'utf-8',
      Ge = 'cp437',
      Ke = ['uncompressedSize', 'compressedSize', 'offset']
    class vn {
      constructor(e, t, r) {
        Object.assign(this, { reader: e, config: t, options: r })
      }
      async getData(e, t, r = {}) {
        const a = this,
          {
            reader: d,
            offset: u,
            extraFieldAES: _,
            compressionMethod: x,
            config: m,
            bitFlag: S,
            signature: F,
            rawLastModDate: B,
            compressedSize: W,
          } = a,
          i = (a.localDirectory = {})
        d.initialized || (await d.init())
        let p = await ht(d, u, 30)
        const s = nt(p)
        let o = bt(a, r, 'password')
        if (((o = o && o.length && o), _ && _.originalCompressionMethod != 99)) throw new Error(Kt)
        if (x != 0 && x != 8) throw new Error(Kt)
        if (et(s, 0) != 67324752) throw new Error(He)
        Ze(i, s, 4),
          (p = await ht(d, u, 30 + i.filenameLength + i.extraFieldLength)),
          (i.rawExtraField = p.subarray(30 + i.filenameLength)),
          await Je(a, i, s, 4),
          (t.lastAccessDate = i.lastAccessDate),
          (t.creationDate = i.creationDate)
        const h = a.encrypted && i.encrypted,
          w = h && !_
        if (h) {
          if (!w && _.strength === void 0) throw new Error(Ve)
          if (!o) throw new Error(qe)
        }
        const R = await (function (f, k, z) {
          const I =
              !(!k.compressed && !k.signed && !k.encrypted) &&
              (k.useWebWorkers || (k.useWebWorkers === void 0 && z.useWebWorkers)),
            T = I && z.workerScripts ? z.workerScripts[k.codecType] : []
          if (wt.length < z.maxWorkers) {
            const L = {}
            return wt.push(L), Vt(L, f, k, z, A, I, T)
          }
          {
            const L = wt.find((P) => !P.busy)
            return L
              ? (De(L), Vt(L, f, k, z, A, I, T))
              : new Promise((P) => $t.push({ resolve: P, codecConstructor: f, options: k, webWorker: I, scripts: T }))
          }
          function A(L) {
            if ($t.length) {
              const [{ resolve: P, codecConstructor: K, options: N, webWorker: G, scripts: ft }] = $t.splice(0, 1)
              P(Vt(L, K, N, z, A, G, ft))
            } else
              L.worker
                ? (De(L),
                  Number.isFinite(z.terminateWorkerTimeout) &&
                    z.terminateWorkerTimeout >= 0 &&
                    (L.terminateTimeout = setTimeout(() => {
                      ;(wt = wt.filter((P) => P != L)), L.terminate()
                    }, z.terminateWorkerTimeout)))
                : (wt = wt.filter((P) => P != L))
          }
        })(
          m.Inflate,
          {
            codecType: Fe,
            password: o,
            zipCrypto: w,
            encryptionStrength: _ && _.strength,
            signed: bt(a, r, 'checkSignature'),
            passwordVerification: w && (S.dataDescriptor ? (B >>> 8) & 255 : (F >>> 24) & 255),
            signature: F,
            compressed: x != 0,
            encrypted: h,
            useWebWorkers: bt(a, r, 'useWebWorkers'),
          },
          m,
        )
        e.initialized || (await e.init())
        const v = bt(a, r, 'signal'),
          y = u + 30 + i.filenameLength + i.extraFieldLength
        return (
          await (async function (f, k, z, I, T, A, L) {
            const P = Math.max(A.chunkSize, 64)
            return (async function K(N = 0, G = 0) {
              const ft = L.signal
              if (N < T) {
                zt(ft, f)
                const pt = await k.readUint8Array(N + I, Math.min(P, T - N)),
                  H = pt.length
                zt(ft, f)
                const xt = await f.append(pt)
                if ((zt(ft, f), (G += await ne(z, xt)), L.onprogress))
                  try {
                    L.onprogress(N + H, T)
                  } catch {}
                return K(N + P, G)
              }
              {
                const pt = await f.flush()
                return (G += await ne(z, pt.data)), { signature: pt.signature, length: G }
              }
            })()
          })(R, d, e, y, W, m, { onprogress: r.onprogress, signal: v }),
          e.getData()
        )
      }
    }
    function Ze(n, e, t) {
      const r = (n.rawBitFlag = ot(e, t + 2)),
        a = (1 & r) == 1,
        d = et(e, t + 6)
      Object.assign(n, {
        encrypted: a,
        version: ot(e, t),
        bitFlag: { level: (6 & r) >> 1, dataDescriptor: (8 & r) == 8, languageEncodingFlag: (2048 & r) == 2048 },
        rawLastModDate: d,
        lastModDate: Sn(d),
        filenameLength: ot(e, t + 22),
        extraFieldLength: ot(e, t + 24),
      })
    }
    async function Je(n, e, t, r) {
      const a = e.rawExtraField,
        d = (e.extraField = new Map()),
        u = nt(new Uint8Array(a))
      let _ = 0
      try {
        for (; _ < a.length; ) {
          const p = ot(u, _),
            s = ot(u, _ + 2)
          d.set(p, { type: p, data: a.slice(_ + 4, _ + 4 + s) }), (_ += 4 + s)
        }
      } catch {}
      const x = ot(t, r + 4)
      ;(e.signature = et(t, r + 10)), (e.uncompressedSize = et(t, r + 18)), (e.compressedSize = et(t, r + 14))
      const m = d.get(1)
      m &&
        ((function (p, s) {
          s.zip64 = !0
          const o = nt(p.data)
          p.values = []
          for (let w = 0; w < Math.floor(p.data.length / 8); w++) p.values.push(Ct(o, 0 + 8 * w))
          const h = Ke.filter((w) => s[w] == Tt)
          for (let w = 0; w < h.length; w++) p[h[w]] = p.values[w]
          Ke.forEach((w) => {
            if (s[w] == Tt) {
              if (p[w] === void 0) throw new Error(je)
              s[w] = p[w]
            }
          })
        })(m, e),
        (e.extraFieldZip64 = m))
      const S = d.get(28789)
      S && (await Ye(S, 'filename', 'rawFilename', e, n), (e.extraFieldUnicodePath = S))
      const F = d.get(25461)
      F && (await Ye(F, 'comment', 'rawComment', e, n), (e.extraFieldUnicodeComment = F))
      const B = d.get(39169)
      B
        ? ((function (p, s, o) {
            const h = nt(p.data)
            ;(p.vendorVersion = yt(h, 0)), (p.vendorId = yt(h, 2))
            const w = yt(h, 4)
            ;(p.strength = w), (p.originalCompressionMethod = o), (s.compressionMethod = p.compressionMethod = ot(h, 5))
          })(B, e, x),
          (e.extraFieldAES = B))
        : (e.compressionMethod = x)
      const W = d.get(10)
      W &&
        ((function (p, s) {
          const o = nt(p.data)
          let h,
            w = 4
          try {
            for (; w < p.data.length && !h; ) {
              const R = ot(o, w),
                v = ot(o, w + 2)
              R == 1 && (h = p.data.slice(w + 4, w + 4 + v)), (w += 4 + v)
            }
          } catch {}
          try {
            if (h && h.length == 24) {
              const R = nt(h),
                v = R.getBigUint64(0, !0),
                y = R.getBigUint64(8, !0),
                f = R.getBigUint64(16, !0)
              Object.assign(p, { rawLastModDate: v, rawLastAccessDate: y, rawCreationDate: f })
              const k = Zt(v),
                z = Zt(y),
                I = { lastModDate: k, lastAccessDate: z, creationDate: Zt(f) }
              Object.assign(p, I), Object.assign(s, I)
            }
          } catch {}
        })(W, e),
        (e.extraFieldNTFS = W))
      const i = d.get(21589)
      i &&
        ((function (p, s) {
          const o = nt(p.data),
            h = yt(o, 0),
            w = [],
            R = []
          ;(1 & h) == 1 && (w.push('lastModDate'), R.push('rawLastModDate')),
            (2 & h) == 2 && (w.push('lastAccessDate'), R.push('rawLastAccessDate')),
            (4 & h) == 4 && (w.push('creationDate'), R.push('rawCreationDate'))
          let v = 1
          w.forEach((y, f) => {
            if (p.data.length >= v + 4) {
              const k = et(o, v)
              s[y] = p[y] = new Date(1e3 * k)
              const z = R[f]
              p[z] = k
            }
            v += 4
          })
        })(i, e),
        (e.extraFieldExtendedTimestamp = i))
    }
    async function Ye(n, e, t, r, a) {
      const d = nt(n.data)
      ;(n.version = yt(d, 0)), (n.signature = et(d, 1))
      const u = new St()
      u.append(a[t])
      const _ = nt(new Uint8Array(4))
      _.setUint32(0, u.get(), !0),
        (n[e] = await Gt(n.data.subarray(5))),
        (n.valid = !a.bitFlag.languageEncodingFlag && n.signature == et(_, 0)),
        n.valid && ((r[e] = n[e]), (r[e + 'UTF8'] = !0))
    }
    function bt(n, e, t) {
      return e[t] === void 0 ? n.options[t] : e[t]
    }
    function Sn(n) {
      const e = (4294901760 & n) >> 16,
        t = 65535 & n
      try {
        return new Date(
          1980 + ((65024 & e) >> 9),
          ((480 & e) >> 5) - 1,
          31 & e,
          (63488 & t) >> 11,
          (2016 & t) >> 5,
          2 * (31 & t),
          0,
        )
      } catch {}
    }
    function Zt(n) {
      return new Date(Number(n / BigInt(1e4) - BigInt(116444736e5)))
    }
    function yt(n, e) {
      return n.getUint8(e)
    }
    function ot(n, e) {
      return n.getUint16(e, !0)
    }
    function et(n, e) {
      return n.getUint32(e, !0)
    }
    function Ct(n, e) {
      return Number(n.getBigUint64(e, !0))
    }
    function nt(n) {
      return new DataView(n.buffer)
    }
    function ht(n, e, t) {
      return n.readUint8Array(e, t)
    }
    te({
      Inflate: function (n) {
        const e = new Qt(),
          t = n && n.chunkSize ? Math.floor(2 * n.chunkSize) : 131072,
          r = new Uint8Array(t)
        let a = !1
        e.inflateInit(),
          (e.next_out = r),
          (this.append = function (d, u) {
            const _ = []
            let x,
              m,
              S = 0,
              F = 0,
              B = 0
            if (d.length !== 0) {
              ;(e.next_in_index = 0), (e.next_in = d), (e.avail_in = d.length)
              do {
                if (
                  ((e.next_out_index = 0),
                  (e.avail_out = t),
                  e.avail_in !== 0 || a || ((e.next_in_index = 0), (a = !0)),
                  (x = e.inflate(0)),
                  a && x === -5)
                ) {
                  if (e.avail_in !== 0) throw new Error('inflating: bad input')
                } else if (x !== 0 && x !== 1) throw new Error('inflating: ' + e.msg)
                if ((a || x === 1) && e.avail_in === d.length) throw new Error('inflating: bad input')
                e.next_out_index &&
                  (e.next_out_index === t ? _.push(new Uint8Array(r)) : _.push(r.slice(0, e.next_out_index))),
                  (B += e.next_out_index),
                  u && e.next_in_index > 0 && e.next_in_index != S && (u(e.next_in_index), (S = e.next_in_index))
              } while (e.avail_in > 0 || e.avail_out === 0)
              return (
                _.length > 1
                  ? ((m = new Uint8Array(B)),
                    _.forEach(function (W) {
                      m.set(W, F), (F += W.length)
                    }))
                  : (m = _[0] || new Uint8Array(0)),
                m
              )
            }
          }),
          (this.flush = function () {
            e.inflateEnd()
          })
      },
    }),
      (l.BlobReader = ie),
      (l.BlobWriter = class extends vt {
        constructor(n) {
          super(), (this.contentType = n), (this.arrayBuffers = [])
        }
        async writeUint8Array(n) {
          super.writeUint8Array(n), this.arrayBuffers.push(n.buffer)
        }
        getData() {
          return this.blob || (this.blob = new Blob(this.arrayBuffers, { type: this.contentType })), this.blob
        }
      }),
      (l.Data64URIReader = class extends dt {
        constructor(n) {
          super(), (this.dataURI = n)
          let e = n.length
          for (; n.charAt(e - 1) == '='; ) e--
          ;(this.dataStart = n.indexOf(',') + 1), (this.size = Math.floor(0.75 * (e - this.dataStart)))
        }
        async readUint8Array(n, e) {
          const t = new Uint8Array(e),
            r = 4 * Math.floor(n / 3),
            a = atob(this.dataURI.substring(r + this.dataStart, 4 * Math.ceil((n + e) / 3) + this.dataStart)),
            d = n - 3 * Math.floor(r / 4)
          for (let u = d; u < d + e; u++) t[u - d] = a.charCodeAt(u)
          return t
        }
      }),
      (l.Data64URIWriter = class extends vt {
        constructor(n) {
          super(), (this.data = 'data:' + (n || '') + ';base64,'), (this.pending = [])
        }
        async writeUint8Array(n) {
          super.writeUint8Array(n)
          let e = 0,
            t = this.pending
          const r = this.pending.length
          for (this.pending = '', e = 0; e < 3 * Math.floor((r + n.length) / 3) - r; e++) t += String.fromCharCode(n[e])
          for (; e < n.length; e++) this.pending += String.fromCharCode(n[e])
          t.length > 2 ? (this.data += btoa(t)) : (this.pending = t)
        }
        getData() {
          return this.data + btoa(this.pending)
        }
      }),
      (l.ERR_ABORT = ee),
      (l.ERR_BAD_FORMAT = Et),
      (l.ERR_CENTRAL_DIRECTORY_NOT_FOUND = Be),
      (l.ERR_ENCRYPTED = qe),
      (l.ERR_EOCDR_LOCATOR_ZIP64_NOT_FOUND = Pe),
      (l.ERR_EOCDR_NOT_FOUND = Ne),
      (l.ERR_EOCDR_ZIP64_NOT_FOUND = We),
      (l.ERR_EXTRAFIELD_ZIP64_NOT_FOUND = je),
      (l.ERR_HTTP_RANGE = Lt),
      (l.ERR_INVALID_PASSWORD = Pt),
      (l.ERR_INVALID_SIGNATURE = jt),
      (l.ERR_LOCAL_FILE_HEADER_NOT_FOUND = He),
      (l.ERR_UNSUPPORTED_COMPRESSION = Kt),
      (l.ERR_UNSUPPORTED_ENCRYPTION = Ve),
      (l.HttpRangeReader = class extends fe {
        constructor(n, e = {}) {
          ;(e.useRangeHeader = !0), super(n, e)
        }
      }),
      (l.HttpReader = fe),
      (l.Reader = dt),
      (l.TextReader = class extends dt {
        constructor(n) {
          super(), (this.blobReader = new ie(new Blob([n], { type: Mt })))
        }
        async init() {
          super.init(), this.blobReader.init(), (this.size = this.blobReader.size)
        }
        async readUint8Array(n, e) {
          return this.blobReader.readUint8Array(n, e)
        }
      }),
      (l.TextWriter = class extends vt {
        constructor(n) {
          super(), (this.encoding = n), (this.blob = new Blob([], { type: Mt }))
        }
        async writeUint8Array(n) {
          super.writeUint8Array(n), (this.blob = new Blob([this.blob, n.buffer], { type: Mt }))
        }
        getData() {
          if (this.blob.text) return this.blob.text()
          {
            const n = new FileReader()
            return new Promise((e, t) => {
              ;(n.onload = (r) => e(r.target.result)),
                (n.onerror = () => t(n.error)),
                n.readAsText(this.blob, this.encoding)
            })
          }
        }
      }),
      (l.Uint8ArrayReader = class extends dt {
        constructor(n) {
          super(), (this.array = n), (this.size = n.length)
        }
        async readUint8Array(n, e) {
          return this.array.slice(n, n + e)
        }
      }),
      (l.Uint8ArrayWriter = class extends vt {
        constructor() {
          super(), (this.array = new Uint8Array(0))
        }
        async writeUint8Array(n) {
          super.writeUint8Array(n)
          const e = this.array
          ;(this.array = new Uint8Array(e.length + n.length)), this.array.set(e), this.array.set(n, e.length)
        }
        getData() {
          return this.array
        }
      }),
      (l.Writer = vt),
      (l.ZipReader = class {
        constructor(n, e = {}) {
          Object.assign(this, { reader: n, options: e, config: st })
        }
        async getEntries(n = {}) {
          const e = this,
            t = e.reader
          if ((t.initialized || (await t.init()), t.size < 22)) throw new Error(Et)
          const r = await (async function (W, i, p, s, o) {
            const h = new Uint8Array(4)
            ;(function (v, y, f) {
              v.setUint32(y, f, !0)
            })(nt(h), 0, i)
            const w = s + o
            return (await R(s)) || (await R(Math.min(w, p)))
            async function R(v) {
              const y = p - v,
                f = await ht(W, y, v)
              for (let k = f.length - s; k >= 0; k--)
                if (f[k] == h[0] && f[k + 1] == h[1] && f[k + 2] == h[2] && f[k + 3] == h[3])
                  return { offset: y + k, buffer: f.slice(k, k + s).buffer }
            }
          })(t, 101010256, t.size, 22, 1048560)
          if (!r) throw new Error(Ne)
          const a = nt(r)
          let d = et(a, 12),
            u = et(a, 16),
            _ = ot(a, 8),
            x = 0
          if (u == Tt || d == Tt || _ == 65535) {
            const W = nt(await ht(t, r.offset - 20, 20))
            if (et(W, 0) != 117853008) throw new Error(We)
            u = Ct(W, 8)
            let i = await ht(t, u, 56),
              p = nt(i)
            const s = r.offset - 20 - 56
            if (et(p, 0) != _e && u != s) {
              const o = u
              ;(u = s), (x = u - o), (i = await ht(t, u, 56)), (p = nt(i))
            }
            if (et(p, 0) != _e) throw new Error(Pe)
            ;(_ = Ct(p, 32)), (d = Ct(p, 40)), (u -= d)
          }
          if (u < 0 || u >= t.size) throw new Error(Et)
          let m = 0,
            S = await ht(t, u, d),
            F = nt(S)
          if (d) {
            const W = r.offset - d
            if (et(F, m) != pe && u != W) {
              const i = u
              ;(u = W), (x = u - i), (S = await ht(t, u, d)), (F = nt(S))
            }
          }
          if (u < 0 || u >= t.size) throw new Error(Et)
          const B = []
          for (let W = 0; W < _; W++) {
            const i = new vn(t, e.config, e.options)
            if (et(F, m) != pe) throw new Error(Be)
            Ze(i, F, m + 6)
            const p = !!i.bitFlag.languageEncodingFlag,
              s = m + 46,
              o = s + i.filenameLength,
              h = o + i.extraFieldLength,
              w = ot(F, m + 4),
              R = (0 & w) == 0
            Object.assign(i, {
              versionMadeBy: w,
              msDosCompatible: R,
              compressedSize: 0,
              uncompressedSize: 0,
              commentLength: ot(F, m + 32),
              directory: R && (16 & yt(F, m + 38)) == 16,
              offset: et(F, m + 42) + x,
              internalFileAttribute: et(F, m + 34),
              externalFileAttribute: et(F, m + 38),
              rawFilename: S.subarray(s, o),
              filenameUTF8: p,
              commentUTF8: p,
              rawExtraField: S.subarray(o, h),
            })
            const v = h + i.commentLength
            i.rawComment = S.subarray(h, v)
            const y = bt(e, n, 'filenameEncoding'),
              f = bt(e, n, 'commentEncoding'),
              [k, z] = await Promise.all([
                Gt(i.rawFilename, i.filenameUTF8 ? $e : y || Ge),
                Gt(i.rawComment, i.commentUTF8 ? $e : f || Ge),
              ])
            ;(i.filename = k),
              (i.comment = z),
              !i.directory && i.filename.endsWith('/') && (i.directory = !0),
              await Je(i, i, F, m + 6)
            const I = new Oe(i)
            if (((I.getData = (T, A) => i.getData(T, I, A)), B.push(I), (m = v), n.onprogress))
              try {
                n.onprogress(W + 1, _, new Oe(i))
              } catch {}
          }
          return B
        }
        async close() {}
      }),
      (l.configure = te),
      (l.getMimeType = function () {
        return 'application/octet-stream'
      }),
      Object.defineProperty(l, '__esModule', { value: !0 })
  })
})(Xt, Xt.exports)
var qn = Xt.exports
const Vn = jn(qn),
  It = Vn
class $n {
  constructor(c, l) {
    Y(this, '_zipReader')
    Y(this, '_entriesPromise')
    Y(this, '_traceURL')
    ;(this._traceURL = c),
      (this._zipReader = new It.ZipReader(new It.HttpReader(Kn(c), { mode: 'cors', preventHeadRequest: !0 }), {
        useWebWorkers: !1,
      })),
      (this._entriesPromise = this._zipReader.getEntries({ onprogress: l }).then((b) => {
        const g = new Map()
        for (const C of b) g.set(C.filename, C)
        return g
      }))
  }
  isLive() {
    return !1
  }
  traceURL() {
    return this._traceURL
  }
  async entryNames() {
    return [...(await this._entriesPromise).keys()]
  }
  async hasEntry(c) {
    return (await this._entriesPromise).has(c)
  }
  async readText(c) {
    var C
    const b = (await this._entriesPromise).get(c)
    if (!b) return
    const g = new It.TextWriter()
    return await ((C = b.getData) == null ? void 0 : C.call(b, g)), g.getData()
  }
  async readBlob(c) {
    const b = (await this._entriesPromise).get(c)
    if (!b) return
    const g = new It.BlobWriter()
    return await b.getData(g), g.getData()
  }
}
class Gn {
  constructor(c) {
    Y(this, '_entriesPromise')
    Y(this, '_traceURL')
    ;(this._traceURL = c),
      (this._entriesPromise = fetch('/trace/file?path=' + encodeURIComponent(c)).then(async (l) => {
        const b = JSON.parse(await l.text()),
          g = new Map()
        for (const C of b.entries) g.set(C.name, C.path)
        return g
      }))
  }
  isLive() {
    return !0
  }
  traceURL() {
    return this._traceURL
  }
  async entryNames() {
    return [...(await this._entriesPromise).keys()]
  }
  async hasEntry(c) {
    return (await this._entriesPromise).has(c)
  }
  async readText(c) {
    const l = await this._readEntry(c)
    return l == null ? void 0 : l.text()
  }
  async readBlob(c) {
    const l = await this._readEntry(c)
    return (l == null ? void 0 : l.status) === 200 ? await (l == null ? void 0 : l.blob()) : void 0
  }
  async _readEntry(c) {
    const b = (await this._entriesPromise).get(c)
    if (b) return fetch('/trace/file?path=' + encodeURIComponent(b))
  }
}
function Kn(U) {
  let c = U.startsWith('http') || U.startsWith('blob') ? U : `file?path=${encodeURIComponent(U)}`
  return c.startsWith('https://www.dropbox.com/') && (c = 'https://dl.dropboxusercontent.com/' + c.substring(24)), c
}
self.addEventListener('install', function (U) {
  self.skipWaiting()
})
self.addEventListener('activate', function (U) {
  U.waitUntil(self.clients.claim())
})
const Zn = new URL(self.registration.scope).pathname,
  mt = new Map(),
  Ft = new Map()
async function Jn(U, c, l, b) {
  var O
  await nn()
  let g = Ft.get(l)
  g || ((g = new Set()), Ft.set(l, g)), g.add(U)
  const C = new Bn()
  try {
    const [q, $] = Tn(b, [0.5, 0.4, 0.1]),
      D = U.endsWith('json') ? new Gn(U) : new $n(U, q)
    await C.load(D, $)
  } catch (q) {
    throw (
      (console.error(q),
      (O = q == null ? void 0 : q.message) != null &&
      O.includes('Cannot find .trace file') &&
      (await C.hasEntry('index.html'))
        ? new Error(
            'Could not load trace. Did you upload a Playwright HTML report instead? Make sure to extract the archive first and then double-click the index.html file or put it on a web server.',
          )
        : c
        ? new Error(`Could not load trace from ${c}. Make sure to upload a valid Playwright trace.`)
        : new Error(`Could not load trace from ${U}. Make sure a valid Playwright Trace is accessible over this url.`))
    )
  }
  const M = new Dn(C.storage(), (q) => C.resourceForSha1(q))
  return mt.set(U, { traceModel: C, snapshotServer: M }), C
}
async function Yn(U) {
  const c = U.request,
    l = await self.clients.get(U.clientId),
    b = self.registration.scope.startsWith('https://')
  if (c.url.startsWith(self.registration.scope)) {
    const q = new URL(Yt(c.url)),
      $ = q.pathname.substring(Zn.length - 1)
    if ($ === '/ping') return await nn(), new Response(null, { status: 200 })
    const D = q.searchParams.get('trace')
    if ($ === '/contexts')
      try {
        const E = await Jn(D, q.searchParams.get('traceFileName'), U.clientId, (j, V) => {
          l.postMessage({ method: 'progress', params: { done: j, total: V } })
        })
        return new Response(JSON.stringify(E.contextEntries), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      } catch (E) {
        return new Response(JSON.stringify({ error: E == null ? void 0 : E.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        })
      }
    if ($.startsWith('/snapshotInfo/')) {
      const { snapshotServer: E } = mt.get(D) || {}
      return E ? E.serveSnapshotInfo($, q.searchParams) : new Response(null, { status: 404 })
    }
    if ($.startsWith('/snapshot/')) {
      const { snapshotServer: E } = mt.get(D) || {}
      if (!E) return new Response(null, { status: 404 })
      const j = E.serveSnapshot($, q.searchParams, q.href)
      return b && j.headers.set('Content-Security-Policy', 'upgrade-insecure-requests'), j
    }
    if ($.startsWith('/sha1/')) {
      const E = q.searchParams.has('download'),
        j = $.slice(6)
      for (const V of mt.values()) {
        const Q = await V.traceModel.resourceForSha1(j)
        if (Q) return new Response(Q, { status: 200, headers: E ? Xn(V.traceModel, j) : void 0 })
      }
      return new Response(null, { status: 404 })
    }
    return fetch(U.request)
  }
  const g = Yt(l.url),
    C = new URL(g).searchParams.get('trace'),
    { snapshotServer: M } = mt.get(C) || {}
  if (!M) return new Response(null, { status: 404 })
  const O = [c.url]
  return b && c.url.startsWith('https://') && O.push(c.url.replace(/^https/, 'http')), M.serveResource(O, c.method, g)
}
function Xn(U, c) {
  const l = U.attachmentForSha1(c)
  if (!l) return
  const b = new Headers()
  return (
    b.set('Content-Disposition', `attachment; filename="${l.name}"`),
    l.contentType && b.set('Content-Type', l.contentType),
    b
  )
}
async function nn() {
  const U = await self.clients.matchAll(),
    c = new Set()
  for (const [l, b] of Ft) U.find((g) => g.id === l) ? b.forEach((g) => c.add(g)) : Ft.delete(l)
  for (const l of mt.keys()) c.has(l) || mt.delete(l)
}
self.addEventListener('fetch', function (U) {
  U.respondWith(Yn(U))
})
