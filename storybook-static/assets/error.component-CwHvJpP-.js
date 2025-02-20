import{j as e}from"./jsx-runtime-CKrituN3.js";import{R as s}from"./index-CBqU2yxZ.js";import{O as x,s as E,c as d}from"./index-CzREU6hr.js";import{g as O,k as y,O as T}from"./index-Bds5wOzB.js";import{i as r}from"./i18next-ihUiNgJT.js";import{c as j}from"./error-banner-oops-tNXFEWkx.js";import{u as A}from"./useTranslation-pmbu4BU3.js";import{S,P as N}from"./useOvhTracking-CUqAIfBm.js";const t={SERVICE_NOT_FOUND:"service_not_found",UNAUTHORIZED:"unauthorized",PAGE_LOAD:"error_during_page_loading"},C="Hoppla!",P="Abbrechen",w="Fehlercode: ",k="Erneut versuchen",D="Zurück zur Startseite",I="Beim Laden der Seite ist ein Fehler aufgetreten.",V={manager_error_page_title:C,manager_error_page_button_cancel:P,manager_error_page_detail_code:w,manager_error_page_action_reload_label:k,manager_error_page_action_home_label:D,manager_error_page_default:I},B="Oops!",U="Cancel",L="Error code: ",q="Try again",F="Back to homepage",G="An error has occurred loading the page.",z={manager_error_page_title:B,manager_error_page_button_cancel:U,manager_error_page_detail_code:L,manager_error_page_action_reload_label:q,manager_error_page_action_home_label:F,manager_error_page_default:G},H="¡Vaya!",M="Cancelar",Z="Código de error: ",K="Volver a intentarlo",W="Volver a la página de inicio",X="Se ha producido un error al cargar la página.",J={manager_error_page_title:H,manager_error_page_button_cancel:M,manager_error_page_detail_code:Z,manager_error_page_action_reload_label:K,manager_error_page_action_home_label:W,manager_error_page_default:X},Q="Oops …!",Y="Annuler",ee="Code d'erreur : ",ae="Réessayer",re="Retour à la page d'accueil",_e="Une erreur est survenue lors du chargement de la page.",oe={manager_error_page_title:Q,manager_error_page_button_cancel:Y,manager_error_page_detail_code:ee,manager_error_page_action_reload_label:ae,manager_error_page_action_home_label:re,manager_error_page_default:_e},ne="Oops …!",te="Annuler",le="Code d'erreur : ",ge="Réessayer",ce="Retour à la page d'accueil",ie="Une erreur est survenue lors du chargement de la page.",se={manager_error_page_title:ne,manager_error_page_button_cancel:te,manager_error_page_detail_code:le,manager_error_page_action_reload_label:ge,manager_error_page_action_home_label:ce,manager_error_page_default:ie},de="Ops!",me="Annullare",pe="Codice di errore: ",ue="Riprova",be="Tornare alla home page",fe="Si è verificato un errore durante il caricamento della pagina.",he={manager_error_page_title:de,manager_error_page_button_cancel:me,manager_error_page_detail_code:pe,manager_error_page_action_reload_label:ue,manager_error_page_action_home_label:be,manager_error_page_default:fe},$e="Ojej...",Re="Anuluj",ve="Kod błędu: ",xe="Spróbuj ponownie",Ee="Powrót do strony głównej",Oe="Wystąpił błąd podczas ładowania strony.",ye={manager_error_page_title:$e,manager_error_page_button_cancel:Re,manager_error_page_detail_code:ve,manager_error_page_action_reload_label:xe,manager_error_page_action_home_label:Ee,manager_error_page_default:Oe},Te="Oops!",je="Anular",Ae="Código de erro: ",Se="Tentar novamente",Ne="Voltar para a página inicial",Ce="Ocorreu um erro ao carregar a página.",Pe={manager_error_page_title:Te,manager_error_page_button_cancel:je,manager_error_page_detail_code:Ae,manager_error_page_action_reload_label:Se,manager_error_page_action_home_label:Ne,manager_error_page_default:Ce};function m(){r.addResources("de_DE","error",V),r.addResources("en_GB","error",z),r.addResources("es_ES","error",J),r.addResources("fr_CA","error",oe),r.addResources("fr_FR","error",se),r.addResources("it_IT","error",he),r.addResources("pl_PL","error",ye),r.addResources("pt_PT","error",Pe)}r.isInitialized?m():r.on("initialized",m);function we(a){return a!=null&&a.status&&Math.floor(a.status/100)===4?[401,403].includes(a.status)?t.UNAUTHORIZED:t.SERVICE_NOT_FOUND:t.PAGE_LOAD}const p=({error:a,onRedirectHome:u,onReloadPage:b,labelTracking:f,...h})=>{var l,g,c;const{t:o}=A("error"),{shell:_}=s.useContext(S),n=(l=_==null?void 0:_.environment)==null?void 0:l.getEnvironment();return s.useEffect(()=>{n==null||n.then($=>{var i;const{applicationName:R}=$,v=`errors::${we(a)}::${R}`;(i=_==null?void 0:_.tracking)==null||i.trackPage({name:v,level2:"81",type:"navigation",page_category:N.bannerError})})},[]),e.jsxs("div",{className:"mx-auto  w-full h-full max-w-[600px] overflow-hidden mx-autogrid p-5",...h,children:[e.jsx("img",{src:j,alt:"OOPS",className:"w-full"}),e.jsx("div",{className:"py-2",children:e.jsx(x,{preset:O.heading1,children:o("manager_error_page_title")})}),e.jsx("div",{children:e.jsx(E,{color:y.warning,"data-tracking":f,className:"w-full",children:e.jsxs("div",{children:[e.jsx("div",{children:o("manager_error_page_default")}),e.jsx("div",{children:((g=a==null?void 0:a.data)==null?void 0:g.message)&&e.jsx("strong",{children:a.data.message})}),e.jsx("div",{children:((c=a==null?void 0:a.headers)==null?void 0:c["x-ovh-queryid"])&&e.jsxs("p",{children:[o("manager_error_page_detail_code"),a.headers["x-ovh-queryid"]]})})]})})}),e.jsxs("div",{className:"overflow-hidden mt-5 py-2",children:[e.jsx("div",{children:e.jsx(d,{"data-testid":"error-template-action-home",className:"error-template-actions  w-full",variant:T.ghost,onClick:u,label:o("manager_error_page_action_home_label")})}),e.jsx("div",{children:e.jsx(d,{"data-testid":"error-template-action-reload",className:"error-template-actions w-full ",onClick:b,label:o("manager_error_page_action_reload_label")})})]})]})};try{p.displayName="ErrorBanner",p.__docgenInfo={description:"",displayName:"ErrorBanner",props:{error:{defaultValue:null,description:"",name:"error",required:!0,type:{name:"{ status?: number; data?: any; headers?: any; }"}},onRedirectHome:{defaultValue:null,description:"",name:"onRedirectHome",required:!1,type:{name:"() => void"}},onReloadPage:{defaultValue:null,description:"",name:"onReloadPage",required:!1,type:{name:"() => void"}},labelTracking:{defaultValue:null,description:"",name:"labelTracking",required:!1,type:{name:"string"}}}}}catch{}export{p as E};
