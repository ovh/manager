var w=t=>{throw TypeError(t)};var E=(t,e,s)=>e.has(t)||w("Cannot "+s);var i=(t,e,s)=>(E(t,e,"read from private field"),s?s.call(t):e.get(t)),c=(t,e,s)=>e.has(t)?w("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,s),o=(t,e,s,r)=>(E(t,e,"write to private field"),r?r.call(t,s):e.set(t,s),s);var D=(t,e,s,r)=>({set _(a){o(t,e,a,s)},get _(){return i(t,e,r)}});import{j as u}from"./jsx-runtime-BRNY0I4F.js";import{r as C}from"./index-Bnop-kX6.js";import{S as K,h as B,Q as N,n as l,m as _,d as j,f as y,g as W,o as I,r as S,i as X,j as q,p as T,s as U,k as V}from"./QueryClientProvider-Y_fKerI5.js";import{M as z,i as G}from"./infiniteQueryBehavior-zhId4Z-N.js";/* empty css            */import{s as Y,b as Z,I as J,i as A}from"./i18next-DdipboBq.js";import{u as L}from"./index-CyBtB0VZ.js";import"./preview-Cqky6Wbp.js";import"./DocsRenderer-CFRXHY34-DcUi9AWn.js";import{T as $,i as ee,D as te,C as se,j as re,A as ie,k as ae}from"./index-IIISP0qU.js";import"./iframe-Bg1V8O6K.js";import"./client-mUdLbVpc.js";import"./index-4pTrEEYx.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";const ne={type:"3rdParty",init(t){Y(t.options.react),Z(t)}};function ue(t){let{i18n:e,defaultNS:s,children:r}=t;const a=C.useMemo(()=>({i18n:e,defaultNS:s}),[e,s]);return C.createElement(J.Provider,{value:a},r)}var d,R,oe=(R=class extends K{constructor(e={}){super();c(this,d);this.config=e,o(this,d,new Map)}build(e,s,r){const a=s.queryKey,f=s.queryHash??B(a,s);let v=this.get(f);return v||(v=new N({cache:this,queryKey:a,queryHash:f,options:e.defaultQueryOptions(s),state:r,defaultOptions:e.getQueryDefaults(a)}),this.add(v)),v}add(e){i(this,d).has(e.queryHash)||(i(this,d).set(e.queryHash,e),this.notify({type:"added",query:e}))}remove(e){const s=i(this,d).get(e.queryHash);s&&(e.destroy(),s===e&&i(this,d).delete(e.queryHash),this.notify({type:"removed",query:e}))}clear(){l.batch(()=>{this.getAll().forEach(e=>{this.remove(e)})})}get(e){return i(this,d).get(e)}getAll(){return[...i(this,d).values()]}find(e){const s={exact:!0,...e};return this.getAll().find(r=>_(s,r))}findAll(e={}){const s=this.getAll();return Object.keys(e).length>0?s.filter(r=>_(e,r)):s}notify(e){l.batch(()=>{this.listeners.forEach(s=>{s(e)})})}onFocus(){l.batch(()=>{this.getAll().forEach(e=>{e.onFocus()})})}onOnline(){l.batch(()=>{this.getAll().forEach(e=>{e.onOnline()})})}},d=new WeakMap,R),h,x,k,he=(k=class extends K{constructor(e={}){super();c(this,h);c(this,x);this.config=e,o(this,h,new Map),o(this,x,Date.now())}build(e,s,r){const a=new z({mutationCache:this,mutationId:++D(this,x)._,options:e.defaultMutationOptions(s),state:r});return this.add(a),a}add(e){const s=P(e),r=i(this,h).get(s)??[];r.push(e),i(this,h).set(s,r),this.notify({type:"added",mutation:e})}remove(e){var r;const s=P(e);if(i(this,h).has(s)){const a=(r=i(this,h).get(s))==null?void 0:r.filter(f=>f!==e);a&&(a.length===0?i(this,h).delete(s):i(this,h).set(s,a))}this.notify({type:"removed",mutation:e})}canRun(e){var r;const s=(r=i(this,h).get(P(e)))==null?void 0:r.find(a=>a.state.status==="pending");return!s||s===e}runNext(e){var r;const s=(r=i(this,h).get(P(e)))==null?void 0:r.find(a=>a!==e&&a.state.isPaused);return(s==null?void 0:s.continue())??Promise.resolve()}clear(){l.batch(()=>{this.getAll().forEach(e=>{this.remove(e)})})}getAll(){return[...i(this,h).values()].flat()}find(e){const s={exact:!0,...e};return this.getAll().find(r=>j(s,r))}findAll(e={}){return this.getAll().filter(s=>j(e,s))}notify(e){l.batch(()=>{this.listeners.forEach(s=>{s(e)})})}resumePausedMutations(){const e=this.getAll().filter(s=>s.state.isPaused);return l.batch(()=>Promise.all(e.map(s=>s.continue().catch(y))))}},h=new WeakMap,x=new WeakMap,k);function P(t){var e;return((e=t.options.scope)==null?void 0:e.id)??String(t.mutationId)}var n,p,m,b,Q,g,O,M,H,le=(H=class{constructor(t={}){c(this,n);c(this,p);c(this,m);c(this,b);c(this,Q);c(this,g);c(this,O);c(this,M);o(this,n,t.queryCache||new oe),o(this,p,t.mutationCache||new he),o(this,m,t.defaultOptions||{}),o(this,b,new Map),o(this,Q,new Map),o(this,g,0)}mount(){D(this,g)._++,i(this,g)===1&&(o(this,O,W.subscribe(async t=>{t&&(await this.resumePausedMutations(),i(this,n).onFocus())})),o(this,M,I.subscribe(async t=>{t&&(await this.resumePausedMutations(),i(this,n).onOnline())})))}unmount(){var t,e;D(this,g)._--,i(this,g)===0&&((t=i(this,O))==null||t.call(this),o(this,O,void 0),(e=i(this,M))==null||e.call(this),o(this,M,void 0))}isFetching(t){return i(this,n).findAll({...t,fetchStatus:"fetching"}).length}isMutating(t){return i(this,p).findAll({...t,status:"pending"}).length}getQueryData(t){var s;const e=this.defaultQueryOptions({queryKey:t});return(s=i(this,n).get(e.queryHash))==null?void 0:s.state.data}ensureQueryData(t){const e=this.getQueryData(t.queryKey);if(e===void 0)return this.fetchQuery(t);{const s=this.defaultQueryOptions(t),r=i(this,n).build(this,s);return t.revalidateIfStale&&r.isStaleByTime(S(s.staleTime,r))&&this.prefetchQuery(s),Promise.resolve(e)}}getQueriesData(t){return i(this,n).findAll(t).map(({queryKey:e,state:s})=>{const r=s.data;return[e,r]})}setQueryData(t,e,s){const r=this.defaultQueryOptions({queryKey:t}),a=i(this,n).get(r.queryHash),f=a==null?void 0:a.state.data,v=X(e,f);if(v!==void 0)return i(this,n).build(this,r).setData(v,{...s,manual:!0})}setQueriesData(t,e,s){return l.batch(()=>i(this,n).findAll(t).map(({queryKey:r})=>[r,this.setQueryData(r,e,s)]))}getQueryState(t){var s;const e=this.defaultQueryOptions({queryKey:t});return(s=i(this,n).get(e.queryHash))==null?void 0:s.state}removeQueries(t){const e=i(this,n);l.batch(()=>{e.findAll(t).forEach(s=>{e.remove(s)})})}resetQueries(t,e){const s=i(this,n),r={type:"active",...t};return l.batch(()=>(s.findAll(t).forEach(a=>{a.reset()}),this.refetchQueries(r,e)))}cancelQueries(t={},e={}){const s={revert:!0,...e},r=l.batch(()=>i(this,n).findAll(t).map(a=>a.cancel(s)));return Promise.all(r).then(y).catch(y)}invalidateQueries(t={},e={}){return l.batch(()=>{if(i(this,n).findAll(t).forEach(r=>{r.invalidate()}),t.refetchType==="none")return Promise.resolve();const s={...t,type:t.refetchType??t.type??"active"};return this.refetchQueries(s,e)})}refetchQueries(t={},e){const s={...e,cancelRefetch:(e==null?void 0:e.cancelRefetch)??!0},r=l.batch(()=>i(this,n).findAll(t).filter(a=>!a.isDisabled()).map(a=>{let f=a.fetch(void 0,s);return s.throwOnError||(f=f.catch(y)),a.state.fetchStatus==="paused"?Promise.resolve():f}));return Promise.all(r).then(y)}fetchQuery(t){const e=this.defaultQueryOptions(t);e.retry===void 0&&(e.retry=!1);const s=i(this,n).build(this,e);return s.isStaleByTime(S(e.staleTime,s))?s.fetch(e):Promise.resolve(s.state.data)}prefetchQuery(t){return this.fetchQuery(t).then(y).catch(y)}fetchInfiniteQuery(t){return t.behavior=G(t.pages),this.fetchQuery(t)}prefetchInfiniteQuery(t){return this.fetchInfiniteQuery(t).then(y).catch(y)}resumePausedMutations(){return I.isOnline()?i(this,p).resumePausedMutations():Promise.resolve()}getQueryCache(){return i(this,n)}getMutationCache(){return i(this,p)}getDefaultOptions(){return i(this,m)}setDefaultOptions(t){o(this,m,t)}setQueryDefaults(t,e){i(this,b).set(q(t),{queryKey:t,defaultOptions:e})}getQueryDefaults(t){const e=[...i(this,b).values()];let s={};return e.forEach(r=>{T(t,r.queryKey)&&(s={...s,...r.defaultOptions})}),s}setMutationDefaults(t,e){i(this,Q).set(q(t),{mutationKey:t,defaultOptions:e})}getMutationDefaults(t){const e=[...i(this,Q).values()];let s={};return e.forEach(r=>{T(t,r.mutationKey)&&(s={...s,...r.defaultOptions})}),s}defaultQueryOptions(t){if(t._defaulted)return t;const e={...i(this,m).queries,...this.getQueryDefaults(t.queryKey),...t,_defaulted:!0};return e.queryHash||(e.queryHash=B(e.queryKey,e)),e.refetchOnReconnect===void 0&&(e.refetchOnReconnect=e.networkMode!=="always"),e.throwOnError===void 0&&(e.throwOnError=!!e.suspense),!e.networkMode&&e.persister&&(e.networkMode="offlineFirst"),e.enabled!==!0&&e.queryFn===U&&(e.enabled=!1),e}defaultMutationOptions(t){return t!=null&&t._defaulted?t:{...i(this,m).mutations,...(t==null?void 0:t.mutationKey)&&this.getMutationDefaults(t.mutationKey),...t,_defaulted:!0}}clear(){i(this,n).clear(),i(this,p).clear()}},n=new WeakMap,p=new WeakMap,m=new WeakMap,b=new WeakMap,Q=new WeakMap,g=new WeakMap,O=new WeakMap,M=new WeakMap,H);A.use(ne).init({fallbackLng:"fr_FR",interpolation:{escapeValue:!1},resources:{en:{}}});__STORYBOOK_MODULE_PREVIEW_API__;function F(t){const e={h2:"h2",...L(),...t.components};return u.jsxs(u.Fragment,{children:[u.jsx($,{}),`
`,u.jsx(ee,{}),`
`,u.jsx(te,{}),`
`,u.jsx(se,{sourceState:"shown",children:u.jsx(re,{})}),`
`,u.jsx(e.h2,{id:"properties",children:"Properties"}),`
`,u.jsx(ie,{}),`
`,u.jsx(ae,{})]})}function ce(t={}){const{wrapper:e}={...L(),...t.components};return e?u.jsx(e,{...t,children:u.jsx(F,{...t})}):F(t)}const fe=new le({defaultOptions:{queries:{retry:!1,staleTime:1/0}}}),_e={parameters:{docs:{toc:{contentsSelector:".sbdocs-content",headingSelector:"h1, h2, h3",disable:!1},source:{excludeDecorators:!0,state:"open"},page:ce},actions:{argTypesRegex:"^on[A-Z].*"},controls:{expanded:!0,hideNoControlsWarning:!0},options:{storySort:{order:["Manager React Components",["Introduction","What's new?",["Changelog"]],"*"]},showPanel:!0},status:{type:"stable"}}},de=(t,e)=>{const{locale:s}=e.globals;return C.useEffect(()=>{A.changeLanguage(s)},[s]),u.jsx(C.Suspense,{fallback:u.jsx("div",{children:"loading translations..."}),children:u.jsx(ue,{i18n:A,children:u.jsx(V,{client:fe,children:u.jsx(t,{})})})})},je=[de],Ie={locale:{name:"Locale",description:"Internationalization locale",toolbar:{icon:"globe",items:[{value:"fr_FR",title:"Francais"},{value:"en_GB",title:"English"},{value:"de_DE",title:"Deutsch"},{value:"es_ES",title:"Espagne"},{value:"it_IT",title:"Italy"},{value:"pt_PT",title:"Portugal"},{value:"pl_PL",title:"Poland"},{value:"fr_CA",title:"Canada"}],showName:!0}}};export{je as decorators,_e as default,Ie as globalTypes};
