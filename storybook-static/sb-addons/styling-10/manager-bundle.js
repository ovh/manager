try{
(()=>{var Y=__STORYBOOK_API__,{ActiveTabs:U,Consumer:w,ManagerContext:V,Provider:$,RequestResponseError:q,addons:m,combineParameters:z,controlOrMetaKey:j,controlOrMetaSymbol:Z,eventMatchesShortcut:J,eventToShortcut:Q,experimental_MockUniversalStore:X,experimental_UniversalStore:ee,experimental_requestResponse:te,experimental_useUniversalStore:oe,isMacLike:re,isShortcutTaken:ae,keyToSymbol:ne,merge:se,mockChannel:le,optionOrAltSymbol:ie,shortcutMatchesShortcut:me,shortcutToHumanString:ce,types:S,useAddonState:_,useArgTypes:ue,useArgs:pe,useChannel:d,useGlobalTypes:Se,useGlobals:T,useParameter:h,useSharedState:_e,useStoryPrepared:de,useStorybookApi:Te,useStorybookState:he}=__STORYBOOK_API__;var t=__REACT__,{Children:be,Component:Ce,Fragment:E,Profiler:ge,PureComponent:Re,StrictMode:ke,Suspense:ve,__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED:Ie,cloneElement:Le,createContext:Pe,createElement:xe,createFactory:Me,createRef:Be,forwardRef:Ae,isValidElement:He,lazy:Ne,memo:De,startTransition:Ge,unstable_act:Fe,useCallback:Ke,useContext:We,useDebugValue:Ye,useDeferredValue:Ue,useEffect:we,useId:Ve,useImperativeHandle:$e,useInsertionEffect:qe,useLayoutEffect:ze,useMemo:y,useReducer:je,useRef:Ze,useState:Je,useSyncExternalStore:Qe,useTransition:Xe,version:et}=__REACT__;var ct=__STORYBOOK_THEMING__,{CacheProvider:ut,ClassNames:pt,Global:St,ThemeProvider:_t,background:dt,color:Tt,convert:ht,create:Et,createCache:yt,createGlobal:Ot,createReset:ft,css:bt,darken:Ct,ensure:gt,ignoreSsrWarning:Rt,isPropValid:kt,jsx:vt,keyframes:It,lighten:Lt,styled:O,themes:Pt,typography:xt,useTheme:Mt,withTheme:Bt}=__STORYBOOK_THEMING__;var Gt=__STORYBOOK_COMPONENTS__,{A:Ft,ActionBar:Kt,AddonPanel:Wt,Badge:Yt,Bar:Ut,Blockquote:wt,Button:Vt,ClipboardCode:$t,Code:qt,DL:zt,Div:jt,DocumentWrapper:Zt,EmptyTabContent:Jt,ErrorFormatter:Qt,FlexBar:Xt,Form:eo,H1:to,H2:oo,H3:ro,H4:ao,H5:no,H6:so,HR:lo,IconButton:f,IconButtonSkeleton:io,Icons:b,Img:mo,LI:co,Link:uo,ListItem:po,Loader:So,Modal:_o,OL:To,P:ho,Placeholder:Eo,Pre:yo,ProgressSpinner:Oo,ResetWrapper:fo,ScrollArea:bo,Separator:Co,Spaced:go,Span:Ro,StorybookIcon:ko,StorybookLogo:vo,Symbols:Io,SyntaxHighlighter:Lo,TT:Po,TabBar:xo,TabButton:Mo,TabWrapper:Bo,Table:Ao,Tabs:Ho,TabsState:No,TooltipLinkList:C,TooltipMessage:Do,TooltipNote:Go,UL:Fo,WithTooltip:g,WithTooltipPure:Ko,Zoom:Wo,codeCommon:Yo,components:Uo,createCopyToClipboardFunction:wo,getStoryHref:Vo,icons:$o,interleaveSeparators:qo,nameSpaceClassNames:zo,resetComponents:jo,withReset:Zo}=__STORYBOOK_COMPONENTS__;var R="@storybook/addon-styling",i=`${R}/theme-switcher`,k="theming",P={themesList:[],themeDefault:void 0},x={},M={REGISTER_THEMES:`${i}/REGISTER_THEMES`},B=O.div(({theme:e})=>({fontSize:e.typography.size.s2-1,marginLeft:10})),A=e=>e.length>1,H=()=>{let{themeOverride:e}=h(k,x),[{theme:o},v]=T(),[{themesList:c,themeDefault:u},I]=_(i,P);d({[M.REGISTER_THEMES]:({themes:r,defaultTheme:a})=>{I(L=>({...L,themesList:r,themeDefault:a}))}});let p=y(()=>{if(e)return"Story override";let r=o||u;return r&&`${r} theme`},[e,u,o]);return A(c)&&t.createElement(E,null,t.createElement(g,{placement:"top",trigger:"click",closeOnClick:!0,tooltip:({onHide:r})=>t.createElement(C,{links:c.map(a=>({id:a,title:a,active:o===a,onClick:()=>{v({theme:a}),r()}}))})},t.createElement(f,{key:i,active:!e,title:"Theme"},t.createElement(b,{icon:"paintbrush"}),p&&t.createElement(B,null,p))))};m.register(R,e=>{m.add(i,{type:S.TOOL,title:"Theme",match:({viewMode:o})=>!!(o&&o.match(/^(story|docs)$/)),render:H,paramKey:k})});})();
}catch(e){ console.error("[Storybook] One of your manager-entries failed: " + import.meta.url, e); }
