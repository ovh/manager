import {
  u as Ce,
  r as V,
  e as xe,
  _ as ye,
  f as Me,
  g as Be,
  a as h,
  j as v,
  R as f,
  h as Ne,
  c as Re,
  s as ge,
  S as Pe,
  i as Z,
  T as N,
  t as De,
  m as Le,
  k as de,
  W as Fe,
  M as Ie,
  l as We,
  b as Oe,
  d as je,
} from './assets/wsPort-2e1dc307.js'
class he {
  constructor() {
    this._stringCache = new Map()
  }
  internString(e) {
    let t = this._stringCache.get(e)
    return t || (this._stringCache.set(e, e), (t = e)), t
  }
}
class Ae {
  constructor(e, t, s, i) {
    ;(this._tests = new Map()),
      (this._listOnly = !1),
      (this._clearPreviousResultsWhenTestBegins = !1),
      (this._stringPool = new he()),
      (this._rootSuite = new O('', 'root')),
      (this._pathSeparator = e),
      (this._reporter = t),
      (this._reuseTestCases = s),
      (this._reportConfig = i)
  }
  dispatch(e) {
    const { method: t, params: s } = e
    if (t === 'onConfigure') {
      this._onConfigure(s.config)
      return
    }
    if (t === 'onProject') {
      this._onProject(s.project)
      return
    }
    if (t === 'onBegin') {
      this._onBegin()
      return
    }
    if (t === 'onTestBegin') {
      this._onTestBegin(s.testId, s.result)
      return
    }
    if (t === 'onTestEnd') {
      this._onTestEnd(s.test, s.result)
      return
    }
    if (t === 'onStepBegin') {
      this._onStepBegin(s.testId, s.resultId, s.step)
      return
    }
    if (t === 'onStepEnd') {
      this._onStepEnd(s.testId, s.resultId, s.step)
      return
    }
    if (t === 'onError') {
      this._onError(s.error)
      return
    }
    if (t === 'onStdIO') {
      this._onStdIO(s.type, s.testId, s.resultId, s.data, s.isBase64)
      return
    }
    if (t === 'onEnd') return this._onEnd(s.result)
    if (t === 'onExit') return this._onExit()
  }
  _setClearPreviousResultsWhenTestBegins() {
    this._clearPreviousResultsWhenTestBegins = !0
  }
  _onConfigure(e) {
    var t
    ;(this._rootDir = ((t = this._reportConfig) == null ? void 0 : t.rootDir) || e.rootDir),
      (this._listOnly = e.listOnly),
      (this._config = this._parseConfig(e)),
      this._reporter.onConfigure(this._config)
  }
  _onProject(e) {
    let t = this._rootSuite.suites.find((i) => i.project().__projectId === e.id)
    t || ((t = new O(e.name, 'project')), this._rootSuite.suites.push(t), (t.parent = this._rootSuite))
    const s = this._parseProject(e)
    if (((t.project = () => s), this._mergeSuitesInto(e.suites, t), this._listOnly)) {
      const i = new Set(),
        r = (a) => {
          a.tests.map((c) => c.testId).forEach((c) => i.add(c)), a.suites.forEach(r)
        }
      e.suites.forEach(r)
      const o = (a) => {
        ;(a.tests = a.tests.filter((c) => i.has(c.id))), a.suites.forEach(o)
      }
      o(t)
    }
  }
  _onBegin() {
    var e, t
    ;(t = (e = this._reporter).onBegin) == null || t.call(e, this._rootSuite)
  }
  _onTestBegin(e, t) {
    var r, o
    const s = this._tests.get(e)
    this._clearPreviousResultsWhenTestBegins && s._clearResults()
    const i = s._createTestResult(t.id)
    ;(i.retry = t.retry),
      (i.workerIndex = t.workerIndex),
      (i.parallelIndex = t.parallelIndex),
      i.setStartTimeNumber(t.startTime),
      (i.statusEx = 'running'),
      (o = (r = this._reporter).onTestBegin) == null || o.call(r, s, i)
  }
  _onTestEnd(e, t) {
    var r, o, a
    const s = this._tests.get(e.testId)
    ;(s.timeout = e.timeout), (s.expectedStatus = e.expectedStatus), (s.annotations = e.annotations)
    const i = s.resultsMap.get(t.id)
    ;(i.duration = t.duration),
      (i.status = t.status),
      (i.statusEx = t.status),
      (i.errors = t.errors),
      (i.error = (r = i.errors) == null ? void 0 : r[0]),
      (i.attachments = this._parseAttachments(t.attachments)),
      (a = (o = this._reporter).onTestEnd) == null || a.call(o, s, i),
      (i.stepMap = new Map())
  }
  _onStepBegin(e, t, s) {
    var g, u
    const i = this._tests.get(e),
      r = i.resultsMap.get(t),
      o = s.parentStepId ? r.stepMap.get(s.parentStepId) : void 0,
      a = this._absoluteLocation(s.location),
      c = new Ve(s, o, a)
    o ? o.steps.push(c) : r.steps.push(c),
      r.stepMap.set(s.id, c),
      (u = (g = this._reporter).onStepBegin) == null || u.call(g, i, r, c)
  }
  _onStepEnd(e, t, s) {
    var a, c
    const i = this._tests.get(e),
      r = i.resultsMap.get(t),
      o = r.stepMap.get(s.id)
    ;(o.duration = s.duration), (o.error = s.error), (c = (a = this._reporter).onStepEnd) == null || c.call(a, i, r, o)
  }
  _onError(e) {
    var t, s
    ;(s = (t = this._reporter).onError) == null || s.call(t, e)
  }
  _onStdIO(e, t, s, i, r) {
    var g, u, b, p
    const o = r ? (globalThis.Buffer ? Buffer.from(i, 'base64') : atob(i)) : i,
      a = t ? this._tests.get(t) : void 0,
      c = a && s ? a.resultsMap.get(s) : void 0
    e === 'stdout'
      ? (c == null || c.stdout.push(o), (u = (g = this._reporter).onStdOut) == null || u.call(g, o, a, c))
      : (c == null || c.stderr.push(o), (p = (b = this._reporter).onStdErr) == null || p.call(b, o, a, c))
  }
  _onEnd(e) {
    var t, s
    return (s = (t = this._reporter).onEnd) == null
      ? void 0
      : s.call(t, { status: e.status, startTime: new Date(e.startTime), duration: e.duration })
  }
  _onExit() {
    var e, t
    return (this._stringPool = new he()), (t = (e = this._reporter).onExit) == null ? void 0 : t.call(e)
  }
  _parseConfig(e) {
    const t = { ...me, ...e }
    return (
      this._reportConfig &&
        ((t.configFile = this._reportConfig.configFile),
        (t.rootDir = this._reportConfig.rootDir),
        (t.reportSlowTests = this._reportConfig.reportSlowTests),
        (t.quiet = this._reportConfig.quiet)),
      t
    )
  }
  _parseProject(e) {
    return {
      __projectId: e.id,
      metadata: e.metadata,
      name: e.name,
      outputDir: this._absolutePath(e.outputDir),
      repeatEach: e.repeatEach,
      retries: e.retries,
      testDir: this._absolutePath(e.testDir),
      testIgnore: Q(e.testIgnore),
      testMatch: Q(e.testMatch),
      timeout: e.timeout,
      grep: Q(e.grep),
      grepInvert: Q(e.grepInvert),
      dependencies: e.dependencies,
      teardown: e.teardown,
      snapshotDir: this._absolutePath(e.snapshotDir),
      use: {},
    }
  }
  _parseAttachments(e) {
    return e.map((t) => ({ ...t, body: t.base64 && globalThis.Buffer ? Buffer.from(t.base64, 'base64') : void 0 }))
  }
  _mergeSuitesInto(e, t) {
    for (const s of e) {
      let i = t.suites.find((r) => r.title === s.title)
      i || ((i = new O(s.title, s.type)), (i.parent = t), t.suites.push(i)),
        (i.location = this._absoluteLocation(s.location)),
        (i._fileId = s.fileId),
        (i._parallelMode = s.parallelMode),
        this._mergeSuitesInto(s.suites, i),
        this._mergeTestsInto(s.tests, i)
    }
  }
  _mergeTestsInto(e, t) {
    for (const s of e) {
      let i = this._reuseTestCases ? t.tests.find((r) => r.title === s.title) : void 0
      i ||
        ((i = new ze(s.testId, s.title, this._absoluteLocation(s.location))),
        (i.parent = t),
        t.tests.push(i),
        this._tests.set(i.id, i)),
        this._updateTest(s, i)
    }
  }
  _updateTest(e, t) {
    return (t.id = e.testId), (t.location = this._absoluteLocation(e.location)), (t.retries = e.retries), t
  }
  _absoluteLocation(e) {
    return e && { ...e, file: this._absolutePath(e.file) }
  }
  _absolutePath(e) {
    return e && this._stringPool.internString(this._rootDir + this._pathSeparator + e)
  }
}
class O {
  constructor(e, t) {
    ;(this._requireFile = ''),
      (this.suites = []),
      (this.tests = []),
      (this._parallelMode = 'none'),
      (this.title = e),
      (this._type = t)
  }
  allTests() {
    const e = [],
      t = (s) => {
        for (const i of [...s.suites, ...s.tests]) i instanceof O ? t(i) : e.push(i)
      }
    return t(this), e
  }
  titlePath() {
    const e = this.parent ? this.parent.titlePath() : []
    return (this.title || this._type !== 'describe') && e.push(this.title), e
  }
  project() {}
}
class ze {
  constructor(e, t, s) {
    ;(this.fn = () => {}),
      (this.results = []),
      (this.expectedStatus = 'passed'),
      (this.timeout = 0),
      (this.annotations = []),
      (this.retries = 0),
      (this.repeatEachIndex = 0),
      (this.resultsMap = new Map()),
      (this.id = e),
      (this.title = t),
      (this.location = s)
  }
  titlePath() {
    const e = this.parent ? this.parent.titlePath() : []
    return e.push(this.title), e
  }
  outcome() {
    var s, i
    const e = [...this.results]
    for (
      ;
      ((s = e[0]) == null ? void 0 : s.status) === 'skipped' ||
      ((i = e[0]) == null ? void 0 : i.status) === 'interrupted';

    )
      e.shift()
    if (!e.length) return 'skipped'
    const t = e.filter((r) => r.status !== 'skipped' && r.status !== 'interrupted' && r.status !== this.expectedStatus)
    return t.length ? (t.length === e.length ? 'unexpected' : 'flaky') : 'expected'
  }
  ok() {
    const e = this.outcome()
    return e === 'expected' || e === 'flaky' || e === 'skipped'
  }
  _clearResults() {
    ;(this.results = []), this.resultsMap.clear()
  }
  _createTestResult(e) {
    const t = new Ke(this.results.length)
    return this.results.push(t), this.resultsMap.set(e, t), t
  }
}
class Ve {
  constructor(e, t, s) {
    ;(this.duration = -1),
      (this.steps = []),
      (this._startTime = 0),
      (this.title = e.title),
      (this.category = e.category),
      (this.location = s),
      (this.parent = t),
      (this._startTime = e.startTime)
  }
  titlePath() {
    var t
    return [...(((t = this.parent) == null ? void 0 : t.titlePath()) || []), this.title]
  }
  get startTime() {
    return new Date(this._startTime)
  }
  set startTime(e) {
    this._startTime = +e
  }
}
class Ke {
  constructor(e) {
    ;(this.parallelIndex = -1),
      (this.workerIndex = -1),
      (this.duration = -1),
      (this.stdout = []),
      (this.stderr = []),
      (this.attachments = []),
      (this.status = 'skipped'),
      (this.steps = []),
      (this.errors = []),
      (this.stepMap = new Map()),
      (this.statusEx = 'scheduled'),
      (this._startTime = 0),
      (this.retry = e)
  }
  setStartTimeNumber(e) {
    this._startTime = e
  }
  get startTime() {
    return new Date(this._startTime)
  }
  set startTime(e) {
    this._startTime = +e
  }
}
const me = {
  forbidOnly: !1,
  fullyParallel: !1,
  globalSetup: null,
  globalTeardown: null,
  globalTimeout: 0,
  grep: /.*/,
  grepInvert: null,
  maxFailures: 0,
  metadata: {},
  preserveOutput: 'always',
  projects: [],
  reporter: [[{}.CI ? 'dot' : 'list']],
  reportSlowTests: { max: 5, threshold: 15e3 },
  configFile: '',
  rootDir: '',
  quiet: !1,
  shard: null,
  updateSnapshots: 'missing',
  version: '',
  workers: 0,
  webServer: null,
}
function Q(n) {
  return n.map((e) => (e.s ? e.s : new RegExp(e.r.source, e.r.flags)))
}
const Ue = ({ source: n }) => {
    const [e, t] = Ce(),
      [s, i] = V.useState(xe()),
      [r] = V.useState(
        ye(
          () => import('./assets/xtermModule-443332e6.js'),
          ['./assets/xtermModule-443332e6.js', './xtermModule.6428296b.css'],
          import.meta.url,
        ).then((a) => a.default),
      ),
      o = V.useRef(null)
    return (
      V.useEffect(() => (Me(i), () => Be(i)), []),
      V.useEffect(() => {
        const a = n.write,
          c = n.clear
        return (
          (async () => {
            const { Terminal: g, FitAddon: u } = await r,
              b = t.current
            if (!b) return
            const p = s === 'dark-mode' ? qe : $e
            if (o.current && o.current.terminal.options.theme === p) return
            o.current && (b.textContent = '')
            const d = new g({
                convertEol: !0,
                fontSize: 13,
                scrollback: 1e4,
                fontFamily: 'var(--vscode-editor-font-family)',
                theme: p,
              }),
              m = new u()
            d.loadAddon(m)
            for (const _ of n.pending) d.write(_)
            ;(n.write = (_) => {
              n.pending.push(_), d.write(_)
            }),
              (n.clear = () => {
                ;(n.pending = []), d.clear()
              }),
              d.open(b),
              m.fit(),
              (o.current = { terminal: d, fitAddon: m })
          })(),
          () => {
            ;(n.clear = c), (n.write = a)
          }
        )
      }, [r, o, t, n, s]),
      V.useEffect(() => {
        setTimeout(() => {
          o.current && (o.current.fitAddon.fit(), n.resize(o.current.terminal.cols, o.current.terminal.rows))
        }, 250)
      }, [e, n]),
      h('div', { 'data-testid': 'output', className: 'xterm-wrapper', style: { flex: 'auto' }, ref: t })
    )
  },
  $e = {
    foreground: '#383a42',
    background: '#fafafa',
    cursor: '#383a42',
    black: '#000000',
    red: '#e45649',
    green: '#50a14f',
    yellow: '#c18401',
    blue: '#4078f2',
    magenta: '#a626a4',
    cyan: '#0184bc',
    white: '#a0a0a0',
    brightBlack: '#000000',
    brightRed: '#e06c75',
    brightGreen: '#98c379',
    brightYellow: '#d19a66',
    brightBlue: '#4078f2',
    brightMagenta: '#a626a4',
    brightCyan: '#0184bc',
    brightWhite: '#383a42',
    selectionBackground: '#d7d7d7',
    selectionForeground: '#383a42',
  },
  qe = {
    foreground: '#f8f8f2',
    background: '#1e1e1e',
    cursor: '#f8f8f0',
    black: '#000000',
    red: '#ff5555',
    green: '#50fa7b',
    yellow: '#f1fa8c',
    blue: '#bd93f9',
    magenta: '#ff79c6',
    cyan: '#8be9fd',
    white: '#bfbfbf',
    brightBlack: '#4d4d4d',
    brightRed: '#ff6e6e',
    brightGreen: '#69ff94',
    brightYellow: '#ffffa5',
    brightBlue: '#d6acff',
    brightMagenta: '#ff92df',
    brightCyan: '#a4ffff',
    brightWhite: '#e6e6e6',
    selectionBackground: '#44475a',
    selectionForeground: '#f8f8f2',
  }
const He = ({ title: n, children: e, setExpanded: t, expanded: s, expandOnTitleClick: i }) =>
  v('div', {
    className: 'expandable' + (s ? ' expanded' : ''),
    children: [
      v('div', {
        className: 'expandable-title',
        onClick: () => i && t(!s),
        children: [
          h('div', {
            className: 'codicon codicon-' + (s ? 'chevron-down' : 'chevron-right'),
            style: { cursor: 'pointer', color: 'var(--vscode-foreground)', marginLeft: '5px' },
            onClick: () => !i && t(!s),
          }),
          n,
        ],
      }),
      s && h('div', { style: { marginLeft: 25 }, children: e }),
    ],
  })
function Ye(n) {
  return `.playwright-artifacts-${n}`
}
let le = () => {},
  we = (n) => {},
  be = { cols: 80, rows: 24 },
  F = async () => {}
const j = {
    pending: [],
    clear: () => {},
    write: (n) => j.pending.push(n),
    resize: (n, e) => {
      ;(be = { cols: n, rows: e }), H('resizeTerminal', { cols: n, rows: e })
    },
  },
  Xe = ({}) => {
    var ue
    const [n, e] = f.useState(''),
      [t, s] = f.useState(!1),
      [i, r] = f.useState(
        new Map([
          ['passed', !1],
          ['failed', !1],
          ['skipped', !1],
        ]),
      ),
      [o, a] = f.useState(new Map()),
      [c, g] = f.useState({ config: void 0, rootSuite: void 0, loadErrors: [] }),
      [u, b] = f.useState(),
      [p, d] = f.useState({}),
      [m, _] = f.useState(new Set()),
      [T, y] = f.useState(!1),
      [M, P] = f.useState(),
      [R, Y] = Ne('watch-all', !1),
      [te, K] = f.useState({ value: new Set() }),
      l = f.useRef(Promise.resolve()),
      k = f.useRef(new Set()),
      [w, S] = f.useState(0),
      [E, x] = f.useState(!1),
      [X, ce] = f.useState(!0),
      Se = f.useRef(null),
      se = f.useCallback(() => {
        y(!0),
          K({ value: new Set() }),
          le(me, new O('', 'root'), [], void 0),
          _e(!0).then(async () => {
            y(!1)
            const { hasBrowsers: C } = await F('checkBrowsers')
            ce(C)
          })
      }, [])
    f.useEffect(() => {
      var C
      ;(C = Se.current) == null || C.focus(),
        y(!0),
        Re({ onEvent: et, onClose: () => x(!0) }).then((B) => {
          ;(F = B), se()
        })
    }, [se]),
      (le = f.useCallback(
        (C, B, I, z) => {
          const W = C.configFile ? ge.getObject(C.configFile + ':projects', void 0) : void 0
          for (const D of o.keys()) B.suites.find((J) => J.title === D) || o.delete(D)
          for (const D of B.suites) o.has(D.title) || o.set(D.title, !!(W != null && W.includes(D.title)))
          !W && o.size && ![...o.values()].includes(!0) && o.set(o.entries().next().value[0], !0),
            g({ config: C, rootSuite: B, loadErrors: I }),
            a(new Map(o)),
            M && z ? b({ ...z, total: M.testIds.size }) : z || b(void 0)
        },
        [o, M],
      ))
    const ie = f.useCallback(
        (C, B) => {
          ;(C === 'bounce-if-busy' && M) ||
            ((k.current = new Set([...k.current, ...B])),
            (l.current = l.current.then(async () => {
              var W, D, J
              const I = k.current
              if (((k.current = new Set()), !I.size)) return
              {
                for (const L of ((W = c.rootSuite) == null ? void 0 : W.allTests()) || [])
                  I.has(L.id) && (L._clearResults(), L._createTestResult('pending'))
                g({ ...c })
              }
              const z = '  [' + new Date().toLocaleTimeString() + ']'
              j.write('\x1B[2m—'.repeat(Math.max(0, be.cols - z.length)) + z + '\x1B[22m'),
                b({ total: I.size, passed: 0, failed: 0, skipped: 0 }),
                P({ testIds: I }),
                await F('run', { testIds: [...I], projects: [...o].filter(([L, Ee]) => Ee).map(([L]) => L) })
              for (const L of ((D = c.rootSuite) == null ? void 0 : D.allTests()) || [])
                ((J = L.results[0]) == null ? void 0 : J.duration) === -1 && L._clearResults()
              g({ ...c }), P(void 0)
            })))
        },
        [o, M, c],
      ),
      A = !!M,
      ne = f.useRef(null),
      ke = f.useCallback((C) => {
        var B
        C.preventDefault(), C.stopPropagation(), (B = ne.current) == null || B.showModal()
      }, []),
      oe = f.useCallback((C) => {
        var B
        C.preventDefault(), C.stopPropagation(), (B = ne.current) == null || B.close()
      }, []),
      Te = f.useCallback(
        (C) => {
          oe(C),
            s(!0),
            F('installBrowsers').then(async () => {
              s(!1)
              const { hasBrowsers: B } = await F('checkBrowsers')
              ce(B)
            })
        },
        [oe],
      )
    return v('div', {
      className: 'vbox ui-mode',
      children: [
        !X &&
          v('dialog', {
            ref: ne,
            children: [
              v('div', {
                className: 'title',
                children: [h('span', { className: 'codicon codicon-lightbulb' }), 'Install browsers'],
              }),
              v('div', {
                className: 'body',
                children: [
                  'Playwright did not find installed browsers.',
                  h('br', {}),
                  'Would you like to run `playwright install`?',
                  h('br', {}),
                  h('button', { className: 'button', onClick: Te, children: 'Install' }),
                  h('button', { className: 'button secondary', onClick: oe, children: 'Dismiss' }),
                ],
              }),
            ],
          }),
        E &&
          v('div', {
            className: 'drop-target',
            children: [
              h('div', { className: 'title', children: 'UI Mode disconnected' }),
              v('div', {
                children: [
                  h('a', { href: '#', onClick: () => window.location.reload(), children: 'Reload the page' }),
                  ' to reconnect',
                ],
              }),
            ],
          }),
        v(Pe, {
          sidebarSize: 250,
          minSidebarSize: 150,
          orientation: 'horizontal',
          sidebarIsFirst: !0,
          settingName: 'testListSidebar',
          children: [
            v('div', {
              className: 'vbox',
              children: [
                v('div', {
                  className: 'vbox' + (t ? '' : ' hidden'),
                  children: [
                    v(Z, {
                      children: [
                        h('div', { className: 'section-title', style: { flex: 'none' }, children: 'Output' }),
                        h(N, { icon: 'circle-slash', title: 'Clear output', onClick: () => j.clear() }),
                        h('div', { className: 'spacer' }),
                        h(N, { icon: 'close', title: 'Close', onClick: () => s(!1) }),
                      ],
                    }),
                    h(Ue, { source: j }),
                  ],
                }),
                h('div', {
                  className: 'vbox' + (t ? ' hidden' : ''),
                  children: h(Ge, { item: p, rootDir: (ue = c.config) == null ? void 0 : ue.rootDir }),
                }),
              ],
            }),
            v('div', {
              className: 'vbox ui-mode-sidebar',
              children: [
                v(Z, {
                  noShadow: !0,
                  noMinHeight: !0,
                  children: [
                    h('img', { src: 'playwright-logo.svg' }),
                    h('div', { className: 'section-title', children: 'Playwright' }),
                    h(N, { icon: 'color-mode', title: 'Toggle color mode', onClick: () => De() }),
                    h(N, { icon: 'refresh', title: 'Reload', onClick: () => se(), disabled: A || T }),
                    h(N, {
                      icon: 'terminal',
                      title: 'Toggle output',
                      toggled: t,
                      onClick: () => {
                        s(!t)
                      },
                    }),
                    !X &&
                      h(N, {
                        icon: 'lightbulb-autofix',
                        style: { color: 'var(--vscode-list-warningForeground)' },
                        title: 'Playwright browsers are missing',
                        onClick: ke,
                      }),
                  ],
                }),
                h(Je, {
                  filterText: n,
                  setFilterText: e,
                  statusFilters: i,
                  setStatusFilters: r,
                  projectFilters: o,
                  setProjectFilters: a,
                  testModel: c,
                  runTests: () => ie('bounce-if-busy', m),
                }),
                v(Z, {
                  noMinHeight: !0,
                  children: [
                    !A && !u && h('div', { className: 'section-title', children: 'Tests' }),
                    !A &&
                      u &&
                      h('div', {
                        'data-testid': 'status-line',
                        className: 'status-line',
                        children: v('div', {
                          children: [u.passed, '/', u.total, ' passed (', ((u.passed / u.total) * 100) | 0, '%)'],
                        }),
                      }),
                    A &&
                      u &&
                      h('div', {
                        'data-testid': 'status-line',
                        className: 'status-line',
                        children: v('div', {
                          children: [
                            'Running ',
                            u.passed,
                            '/',
                            M.testIds.size,
                            ' passed (',
                            ((u.passed / M.testIds.size) * 100) | 0,
                            '%)',
                          ],
                        }),
                      }),
                    h(N, { icon: 'play', title: 'Run all', onClick: () => ie('bounce-if-busy', m), disabled: A || T }),
                    h(N, { icon: 'debug-stop', title: 'Stop', onClick: () => H('stop'), disabled: !A || T }),
                    h(N, { icon: 'eye', title: 'Watch all', toggled: R, onClick: () => Y(!R) }),
                    h(N, {
                      icon: 'collapse-all',
                      title: 'Collapse all',
                      onClick: () => {
                        S(w + 1)
                      },
                    }),
                  ],
                }),
                h(Ze, {
                  statusFilters: i,
                  projectFilters: o,
                  filterText: n,
                  testModel: c,
                  runningState: M,
                  runTests: ie,
                  onItemSelected: d,
                  setVisibleTestIds: _,
                  watchAll: R,
                  watchedTreeIds: te,
                  setWatchedTreeIds: K,
                  isLoading: T,
                  requestedCollapseAllCount: w,
                }),
              ],
            }),
          ],
        }),
      ],
    })
  },
  Je = ({
    filterText: n,
    setFilterText: e,
    statusFilters: t,
    setStatusFilters: s,
    projectFilters: i,
    setProjectFilters: r,
    testModel: o,
    runTests: a,
  }) => {
    const [c, g] = f.useState(!1),
      u = f.useRef(null)
    f.useEffect(() => {
      var d
      ;(d = u.current) == null || d.focus()
    }, [])
    const b =
        [...t.entries()]
          .filter(([d, m]) => m)
          .map(([d]) => d)
          .join(' ') || 'all',
      p =
        [...i.entries()]
          .filter(([d, m]) => m)
          .map(([d]) => d)
          .join(' ') || 'all'
    return v('div', {
      className: 'filters',
      children: [
        h(He, {
          expanded: c,
          setExpanded: g,
          title: h('input', {
            ref: u,
            type: 'search',
            placeholder: 'Filter (e.g. text, @tag)',
            spellCheck: !1,
            value: n,
            onChange: (d) => {
              e(d.target.value)
            },
            onKeyDown: (d) => {
              d.key === 'Enter' && a()
            },
          }),
        }),
        v('div', {
          className: 'filter-summary',
          title:
            'Status: ' +
            b +
            `
Projects: ` +
            p,
          onClick: () => g(!c),
          children: [
            h('span', { className: 'filter-label', children: 'Status:' }),
            ' ',
            b,
            h('span', { className: 'filter-label', children: 'Projects:' }),
            ' ',
            p,
          ],
        }),
        c &&
          v('div', {
            className: 'hbox',
            style: { marginLeft: 14 },
            children: [
              h('div', {
                className: 'filter-list',
                children: [...t.entries()].map(([d, m]) =>
                  h('div', {
                    className: 'filter-entry',
                    children: v('label', {
                      children: [
                        h('input', {
                          type: 'checkbox',
                          checked: m,
                          onClick: () => {
                            const _ = new Map(t)
                            _.set(d, !_.get(d)), s(_)
                          },
                        }),
                        h('div', { children: d }),
                      ],
                    }),
                  }),
                ),
              }),
              h('div', {
                className: 'filter-list',
                children: [...i.entries()].map(([d, m]) =>
                  h('div', {
                    className: 'filter-entry',
                    children: v('label', {
                      children: [
                        h('input', {
                          type: 'checkbox',
                          checked: m,
                          onClick: () => {
                            var y
                            const _ = new Map(i)
                            _.set(d, !_.get(d)), r(_)
                            const T = (y = o == null ? void 0 : o.config) == null ? void 0 : y.configFile
                            T &&
                              ge.setObject(
                                T + ':projects',
                                [..._.entries()].filter(([M, P]) => P).map(([M]) => M),
                              )
                          },
                        }),
                        h('div', { children: d || 'untitled' }),
                      ],
                    }),
                  }),
                ),
              }),
            ],
          }),
      ],
    })
  },
  Qe = We,
  Ze = ({
    statusFilters: n,
    projectFilters: e,
    filterText: t,
    testModel: s,
    runTests: i,
    runningState: r,
    watchAll: o,
    watchedTreeIds: a,
    setWatchedTreeIds: c,
    isLoading: g,
    onItemSelected: u,
    setVisibleTestIds: b,
    requestedCollapseAllCount: p,
  }) => {
    const [d, m] = f.useState({ expandedItems: new Map() }),
      [_, T] = f.useState(),
      [y, M] = f.useState(p),
      {
        rootItem: P,
        treeItemMap: R,
        fileNames: Y,
      } = f.useMemo(() => {
        let l = it(s.rootSuite, s.loadErrors, e)
        nt(l, t, n, r == null ? void 0 : r.testIds), ve(l), (l = ot(l)), rt(l)
        const k = new Map(),
          w = new Set(),
          S = new Set(),
          E = (x) => {
            x.kind === 'group' && x.location.file && S.add(x.location.file),
              x.kind === 'case' && x.tests.forEach((X) => w.add(X.id)),
              x.children.forEach(E),
              k.set(x.id, x)
          }
        return E(l), b(w), { rootItem: l, treeItemMap: k, fileNames: S }
      }, [t, s, n, e, b, r])
    f.useEffect(() => {
      if (y !== p) {
        d.expandedItems.clear()
        for (const w of R.keys()) d.expandedItems.set(w, !1)
        M(p), T(void 0), m({ ...d })
        return
      }
      if (!r || r.itemSelectedByUser) return
      let l
      const k = (w) => {
        var S
        w.children.forEach(k),
          !l &&
            w.status === 'failed' &&
            ((w.kind === 'test' && r.testIds.has(w.test.id)) ||
              (w.kind === 'case' && r.testIds.has((S = w.tests[0]) == null ? void 0 : S.id))) &&
            (l = w)
      }
      k(P), l && T(l.id)
    }, [r, T, P, y, M, p, d, m, R])
    const { selectedTreeItem: te } = f.useMemo(() => {
      const l = _ ? R.get(_) : void 0
      let k
      l &&
        (k = {
          file: l.location.file,
          line: l.location.line,
          source: {
            errors: s.loadErrors
              .filter((S) => {
                var E
                return ((E = S.location) == null ? void 0 : E.file) === l.location.file
              })
              .map((S) => ({ line: S.location.line, message: S.message })),
            content: void 0,
          },
        })
      let w
      return (
        (l == null ? void 0 : l.kind) === 'test'
          ? (w = l.test)
          : (l == null ? void 0 : l.kind) === 'case' && l.tests.length === 1 && (w = l.tests[0]),
        u({ testCase: w, testFile: k }),
        { selectedTreeItem: l }
      )
    }, [u, _, s, R])
    f.useEffect(() => {
      if (!g)
        if (o) H('watch', { fileNames: [...Y] })
        else {
          const l = new Set()
          for (const k of a.value) {
            const w = R.get(k),
              S = w == null ? void 0 : w.location.file
            S && l.add(S)
          }
          H('watch', { fileNames: [...l] })
        }
    }, [g, P, Y, o, a, R])
    const K = (l) => {
      T(l.id), i('bounce-if-busy', re(l))
    }
    return (
      (we = (l) => {
        const k = [],
          w = new Set(l)
        if (o) {
          const S = (E) => {
            const x = E.location.file
            x && w.has(x) && k.push(...re(E)), E.kind === 'group' && E.subKind === 'folder' && E.children.forEach(S)
          }
          S(P)
        } else
          for (const S of a.value) {
            const E = R.get(S),
              x = E == null ? void 0 : E.location.file
            x && w.has(x) && k.push(...re(E))
          }
        i('queue-if-busy', new Set(k))
      }),
      h(Qe, {
        name: 'tests',
        treeState: d,
        setTreeState: m,
        rootItem: P,
        dataTestId: 'test-tree',
        render: (l) =>
          v('div', {
            className: 'hbox ui-mode-list-item',
            children: [
              h('div', { className: 'ui-mode-list-item-title', children: l.title }),
              !!l.duration &&
                l.status !== 'skipped' &&
                h('div', { className: 'ui-mode-list-item-time', children: Le(l.duration) }),
              v(Z, {
                noMinHeight: !0,
                noShadow: !0,
                children: [
                  h(N, { icon: 'play', title: 'Run', onClick: () => K(l), disabled: !!r }),
                  h(N, {
                    icon: 'go-to-file',
                    title: 'Open in VS Code',
                    onClick: () => H('open', { location: st(l) }),
                    style: l.kind === 'group' && l.subKind === 'folder' ? { visibility: 'hidden' } : {},
                  }),
                  !o &&
                    h(N, {
                      icon: 'eye',
                      title: 'Watch',
                      onClick: () => {
                        a.value.has(l.id) ? a.value.delete(l.id) : a.value.add(l.id), c({ ...a })
                      },
                      toggled: a.value.has(l.id),
                    }),
                ],
              }),
            ],
          }),
        icon: (l) =>
          l.status === 'scheduled'
            ? 'codicon-clock'
            : l.status === 'running'
            ? 'codicon-loading'
            : l.status === 'failed'
            ? 'codicon-error'
            : l.status === 'passed'
            ? 'codicon-check'
            : l.status === 'skipped'
            ? 'codicon-circle-slash'
            : 'codicon-circle-outline',
        selectedItem: te,
        onAccepted: K,
        onSelected: (l) => {
          r && (r.itemSelectedByUser = !0), T(l.id)
        },
        isError: (l) => (l.kind === 'group' ? l.hasLoadErrors : !1),
        autoExpandDepth: t ? 5 : 1,
        noItemsMessage: g ? 'Loading…' : 'No tests',
      })
    )
  },
  Ge = ({ item: n, rootDir: e }) => {
    const [t, s] = f.useState(),
      [i, r] = f.useState(0),
      o = f.useRef(null),
      { outputDir: a } = f.useMemo(() => ({ outputDir: n.testCase ? tt(n.testCase) : void 0 }), [n]),
      [c, g] = f.useState(),
      u = f.useCallback((p) => g(de(p)), [g]),
      b = c ? (t == null ? void 0 : t.model.actions.find((p) => de(p) === c)) : void 0
    return (
      f.useEffect(() => {
        var _, T
        o.current && clearTimeout(o.current)
        const p = (_ = n.testCase) == null ? void 0 : _.results[0]
        if (!p) {
          s(void 0)
          return
        }
        const d = p && p.duration >= 0 && p.attachments.find((y) => y.name === 'trace')
        if (d && d.path) {
          pe(d.path).then((y) => s({ model: y, isLive: !1 }))
          return
        }
        if (!a) {
          s(void 0)
          return
        }
        const m = `${a}/${Ye(p.workerIndex)}/traces/${(T = n.testCase) == null ? void 0 : T.id}.json`
        return (
          (o.current = setTimeout(async () => {
            try {
              const y = await pe(m)
              s({ model: y, isLive: !0 })
            } catch {
              s(void 0)
            } finally {
              r(i + 1)
            }
          }, 500)),
          () => {
            o.current && clearTimeout(o.current)
          }
        )
      }, [a, n, s, i, r]),
      h(
        Fe,
        {
          model: t == null ? void 0 : t.model,
          hideStackFrames: !0,
          showSourcesFirst: !0,
          rootDir: e,
          initialSelection: b,
          onSelectionChanged: u,
          fallbackLocation: n.testFile,
          isLive: t == null ? void 0 : t.isLive,
        },
        'workbench',
      )
    )
  }
let q, G, $
const fe = () => {
    clearTimeout(G), (G = void 0), le($.config, $.rootSuite, $.loadErrors, $.progress)
  },
  U = (n, e, t, s, i = !1) => {
    ;($ = { config: n, rootSuite: e, loadErrors: t, progress: s }), i ? fe() : G || (G = setTimeout(fe, 250))
  },
  _e = (n) => {
    if (!n) return F('list', {})
    let e
    const t = [],
      s = { passed: 0, failed: 0, skipped: 0 }
    let i
    return (
      (q = new Ae(
        ee,
        {
          version: () => 'v2',
          onConfigure: (r) => {
            i = r
          },
          onBegin: (r) => {
            e || (e = r), (s.passed = 0), (s.failed = 0), (s.skipped = 0), U(i, e, t, s, !0)
          },
          onEnd: () => {
            U(i, e, t, s, !0)
          },
          onTestBegin: () => {
            U(i, e, t, s)
          },
          onTestEnd: (r) => {
            r.outcome() === 'skipped' ? ++s.skipped : r.outcome() === 'unexpected' ? ++s.failed : ++s.passed,
              U(i, e, t, s)
          },
          onError: (r) => {
            j.write(
              (r.stack || r.value || '') +
                `
`,
            ),
              t.push(r),
              U(i, e ?? new O('', 'root'), t, s)
          },
          printsToStdio: () => !1,
          onStdOut: () => {},
          onStdErr: () => {},
          onExit: () => {},
          onStepBegin: () => {},
          onStepEnd: () => {},
        },
        !0,
      )),
      q._setClearPreviousResultsWhenTestBegins(),
      F('list', {})
    )
  },
  H = (n, e) => {
    if (window._overrideProtocolForTest) {
      window._overrideProtocolForTest({ method: n, params: e }).catch(() => {})
      return
    }
    F(n, e).catch((t) => {
      console.error(t)
    })
  },
  et = (n, e) => {
    var t
    if (n === 'listChanged') {
      _e(!1).catch(() => {})
      return
    }
    if (n === 'testFilesChanged') {
      we(e.testFileNames)
      return
    }
    if (n === 'stdio') {
      if (e.buffer) {
        const s = atob(e.buffer)
        j.write(s)
      } else j.write(e.text)
      return
    }
    ;(t = q == null ? void 0 : q.dispatch({ method: n, params: e })) == null || t.catch(() => {})
  },
  tt = (n) => {
    var e
    for (let t = n.parent; t; t = t.parent) if (t.project()) return (e = t.project()) == null ? void 0 : e.outputDir
  },
  st = (n) => {
    if (n) return n.location.file + ':' + n.location.line
  },
  re = (n) => {
    const e = new Set()
    if (!n) return e
    const t = (s) => {
      var i
      s.kind === 'case'
        ? s.tests.map((r) => r.id).forEach((r) => e.add(r))
        : s.kind === 'test'
        ? e.add(s.id)
        : (i = s.children) == null || i.forEach(t)
    }
    return t(n), e
  }
function ae(n, e, t, s) {
  if (e.length === 0) return n
  const i = e.join(ee),
    r = s.get(i)
  if (r) return r
  const o = ae(n, e.slice(0, e.length - 1), !1, s),
    a = {
      kind: 'group',
      subKind: t ? 'file' : 'folder',
      id: i,
      title: e[e.length - 1],
      location: { file: i, line: 0, column: 0 },
      duration: 0,
      parent: o,
      children: [],
      status: 'none',
      hasLoadErrors: !1,
    }
  return o.children.push(a), s.set(i, a), a
}
function it(n, e, t) {
  const s = [...t.values()].some(Boolean),
    i = {
      kind: 'group',
      subKind: 'folder',
      id: 'root',
      title: '',
      location: { file: '', line: 0, column: 0 },
      duration: 0,
      parent: void 0,
      children: [],
      status: 'none',
      hasLoadErrors: !1,
    },
    r = (a, c, g) => {
      for (const u of c.suites) {
        const b = u.title || '<anonymous>'
        let p = g.children.find((d) => d.title === b)
        p ||
          ((p = {
            kind: 'group',
            subKind: 'describe',
            id: g.id + '' + b,
            title: b,
            location: u.location,
            duration: 0,
            parent: g,
            children: [],
            status: 'none',
            hasLoadErrors: !1,
          }),
          g.children.push(p)),
          r(a, u, p)
      }
      for (const u of c.tests) {
        const b = u.title
        let p = g.children.find((_) => _.title === b)
        p ||
          ((p = {
            kind: 'case',
            id: g.id + '' + b,
            title: b,
            parent: g,
            children: [],
            tests: [],
            location: u.location,
            duration: 0,
            status: 'none',
          }),
          g.children.push(p))
        const d = u.results[0]
        let m = 'none'
        ;(d == null ? void 0 : d.statusEx) === 'scheduled'
          ? (m = 'scheduled')
          : (d == null ? void 0 : d.statusEx) === 'running'
          ? (m = 'running')
          : (d == null ? void 0 : d.status) === 'skipped'
          ? (m = 'skipped')
          : (d == null ? void 0 : d.status) === 'interrupted'
          ? (m = 'none')
          : d && u.outcome() !== 'expected'
          ? (m = 'failed')
          : d && u.outcome() === 'expected' && (m = 'passed'),
          p.tests.push(u),
          p.children.push({
            kind: 'test',
            id: u.id,
            title: a,
            location: u.location,
            test: u,
            parent: p,
            children: [],
            status: m,
            duration: u.results.length ? Math.max(0, u.results[0].duration) : 0,
            project: a,
          }),
          (p.duration = p.children.reduce((_, T) => _ + T.duration, 0))
      }
    },
    o = new Map()
  for (const a of (n == null ? void 0 : n.suites) || [])
    if (!(s && !t.get(a.title)))
      for (const c of a.suites) {
        const g = ae(i, c.location.file.split(ee), !0, o)
        r(a.title, c, g)
      }
  for (const a of e) {
    if (!a.location) continue
    const c = ae(i, a.location.file.split(ee), !0, o)
    c.hasLoadErrors = !0
  }
  return i
}
function nt(n, e, t, s) {
  const i = e.trim().toLowerCase().split(' '),
    r = [...t.values()].some(Boolean),
    o = (c) => {
      const g = c.tests[0].titlePath().join(' ').toLowerCase()
      return !i.every((u) => g.includes(u)) && !c.tests.some((u) => (s == null ? void 0 : s.has(u.id)))
        ? !1
        : ((c.children = c.children.filter((u) => !r || (s == null ? void 0 : s.has(u.id)) || t.get(u.status))),
          (c.tests = c.children.map((u) => u.test)),
          !!c.children.length)
    },
    a = (c) => {
      const g = []
      for (const u of c.children)
        u.kind === 'case' ? o(u) && g.push(u) : (a(u), (u.children.length || u.hasLoadErrors) && g.push(u))
      c.children = g
    }
  a(n)
}
function ve(n) {
  for (const o of n.children) ve(o)
  n.kind === 'group' &&
    n.children.sort((o, a) => o.location.file.localeCompare(a.location.file) || o.location.line - a.location.line)
  let e = n.children.length > 0,
    t = n.children.length > 0,
    s = !1,
    i = !1,
    r = !1
  for (const o of n.children)
    (t = t && o.status === 'skipped'),
      (e = e && (o.status === 'passed' || o.status === 'skipped')),
      (s = s || o.status === 'failed'),
      (i = i || o.status === 'running'),
      (r = r || o.status === 'scheduled')
  i
    ? (n.status = 'running')
    : r
    ? (n.status = 'scheduled')
    : s
    ? (n.status = 'failed')
    : t
    ? (n.status = 'skipped')
    : e && (n.status = 'passed')
}
function ot(n) {
  let e = n
  for (; e.children.length === 1 && e.children[0].kind === 'group' && e.children[0].subKind === 'folder'; )
    e = e.children[0]
  return (e.location = n.location), e
}
function rt(n) {
  const e = (t) => {
    t.kind === 'case' && t.children.length === 1 ? (t.children = []) : t.children.forEach(e)
  }
  e(n)
}
async function pe(n) {
  const e = new URLSearchParams()
  e.set('trace', n)
  const s = await (await fetch(`contexts?${e.toString()}`)).json()
  return new Ie(s)
}
const ee = navigator.userAgent.toLowerCase().includes('windows') ? '\\' : '/'
;(async () => (
  Oe(),
  window.location.protocol !== 'file:' &&
    (window.location.href.includes('isUnderTest=true') && (await new Promise((n) => setTimeout(n, 1e3))),
    navigator.serviceWorker.register('sw.bundle.js'),
    navigator.serviceWorker.controller ||
      (await new Promise((n) => {
        navigator.serviceWorker.oncontrollerchange = () => n()
      })),
    setInterval(function () {
      fetch('ping')
    }, 1e4)),
  je.render(h(Xe, {}), document.querySelector('#root'))
))()
