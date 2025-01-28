import{j as a}from"./jsx-runtime-CKrituN3.js";import{R as d}from"./index-CBqU2yxZ.js";import{O as j,r as S,b as m}from"./index-v66SXByX.js";import{g as A,j as N,O as C}from"./index-KJkR1nQ3.js";import{i as r}from"./i18next-6HYnolD1.js";import{c as k}from"./error-banner-oops-tNXFEWkx.js";import{u as w}from"./useTranslation-Cbsqft5V.js";import{S as y}from"./ShellContext-Bcy3tWt5.js";var l;(function(e){e.onboarding="onboarding",e.listing="listing",e.dashboard="dashboard",e.popup="pop-up",e.bannerSuccess="banner-success",e.bannerError="banner-error",e.bannerInfo="banner-info",e.bannerWarning="banner-warning",e.funnel="funnel"})(l||(l={}));var p;(function(e){e.page="page",e.funnel="funnel",e.banner="banner",e.popup="pop-up",e.datagrid="datagrid",e.tile="tile"})(p||(p={}));var u;(function(e){e.button="button",e.link="link",e.select="select",e.externalLink="external-link",e.tile="tile",e.tutorial="tile-tutorial",e.tab="go-to-tab"})(u||(u={}));const t={SERVICE_NOT_FOUND:"service_not_found",UNAUTHORIZED:"unauthorized",PAGE_LOAD:"error_during_page_loading"},T="Hoppla!",I="Abbrechen",D="Fehlercode: ",V="Erneut versuchen",U="Zurück zur Startseite",q="Beim Laden der Seite ist ein Fehler aufgetreten.",F={manager_error_page_title:T,manager_error_page_button_cancel:I,manager_error_page_detail_code:D,manager_error_page_action_reload_label:V,manager_error_page_action_home_label:U,manager_error_page_default:q},G="Oops!",z="Cancel",B="Error code: ",H="Try again",L="Back to homepage",M="An error has occurred loading the page.",Z={manager_error_page_title:G,manager_error_page_button_cancel:z,manager_error_page_detail_code:B,manager_error_page_action_reload_label:H,manager_error_page_action_home_label:L,manager_error_page_default:M},K="¡Vaya!",W="Cancelar",P="Código de error: ",X="Volver a intentarlo",J="Volver a la página de inicio",Q="Se ha producido un error al cargar la página.",Y={manager_error_page_title:K,manager_error_page_button_cancel:W,manager_error_page_detail_code:P,manager_error_page_action_reload_label:X,manager_error_page_action_home_label:J,manager_error_page_default:Q},ee="Oops …!",ae="Annuler",re="Code d'erreur : ",_e="Réessayer",ne="Retour à la page d'accueil",oe="Une erreur est survenue lors du chargement de la page.",te={manager_error_page_title:ee,manager_error_page_button_cancel:ae,manager_error_page_detail_code:re,manager_error_page_action_reload_label:_e,manager_error_page_action_home_label:ne,manager_error_page_default:oe},le="Oops …!",ge="Annuler",ce="Code d'erreur : ",ie="Réessayer",se="Retour à la page d'accueil",de="Une erreur est survenue lors du chargement de la page.",me={manager_error_page_title:le,manager_error_page_button_cancel:ge,manager_error_page_detail_code:ce,manager_error_page_action_reload_label:ie,manager_error_page_action_home_label:se,manager_error_page_default:de},pe="Ops!",ue="Annullare",be="Codice di errore: ",fe="Riprova",he="Tornare alla home page",$e="Si è verificato un errore durante il caricamento della pagina.",ve={manager_error_page_title:pe,manager_error_page_button_cancel:ue,manager_error_page_detail_code:be,manager_error_page_action_reload_label:fe,manager_error_page_action_home_label:he,manager_error_page_default:$e},xe="Ojej...",Re="Anuluj",Ee="Kod błędu: ",Oe="Spróbuj ponownie",je="Powrót do strony głównej",Se="Wystąpił błąd podczas ładowania strony.",Ae={manager_error_page_title:xe,manager_error_page_button_cancel:Re,manager_error_page_detail_code:Ee,manager_error_page_action_reload_label:Oe,manager_error_page_action_home_label:je,manager_error_page_default:Se},Ne="Oops!",Ce="Anular",ke="Código de erro: ",we="Tentar novamente",ye="Voltar para a página inicial",Te="Ocorreu um erro ao carregar a página.",Ie={manager_error_page_title:Ne,manager_error_page_button_cancel:Ce,manager_error_page_detail_code:ke,manager_error_page_action_reload_label:we,manager_error_page_action_home_label:ye,manager_error_page_default:Te};function b(){r.addResources("de_DE","error",F),r.addResources("en_GB","error",Z),r.addResources("es_ES","error",Y),r.addResources("fr_CA","error",te),r.addResources("fr_FR","error",me),r.addResources("it_IT","error",ve),r.addResources("pl_PL","error",Ae),r.addResources("pt_PT","error",Ie)}r.isInitialized?b():r.on("initialized",b);function De(e){return e!=null&&e.status&&Math.floor(e.status/100)===4?[401,403].includes(e.status)?t.UNAUTHORIZED:t.SERVICE_NOT_FOUND:t.PAGE_LOAD}const f=({error:e,onRedirectHome:h,onReloadPage:$,labelTracking:v,...x})=>{var g,c,i;const{t:n}=w("error"),{shell:_}=d.useContext(y),o=(g=_==null?void 0:_.environment)==null?void 0:g.getEnvironment();return d.useEffect(()=>{o==null||o.then(R=>{var s;const{applicationName:E}=R,O=`errors::${De(e)}::${E}`;(s=_==null?void 0:_.tracking)==null||s.trackPage({name:O,level2:"81",type:"navigation",page_category:l.bannerError})})},[]),a.jsxs("div",{className:"mx-auto  w-full h-full max-w-[600px] overflow-hidden mx-autogrid p-5",...x,children:[a.jsx("img",{src:k,alt:"OOPS",className:"w-full"}),a.jsx("div",{className:"py-2",children:a.jsx(j,{preset:A.heading1,children:n("manager_error_page_title")})}),a.jsx("div",{children:a.jsx(S,{color:N.warning,"data-tracking":v,className:"w-full",children:a.jsxs("div",{children:[a.jsx("div",{children:n("manager_error_page_default")}),a.jsx("div",{children:((c=e==null?void 0:e.data)==null?void 0:c.message)&&a.jsx("strong",{children:e.data.message})}),a.jsx("div",{children:((i=e==null?void 0:e.headers)==null?void 0:i["x-ovh-queryid"])&&a.jsxs("p",{children:[n("manager_error_page_detail_code"),e.headers["x-ovh-queryid"]]})})]})})}),a.jsxs("div",{className:"overflow-hidden mt-5 py-2",children:[a.jsx("div",{children:a.jsx(m,{"data-testid":"error-template-action-home",className:"error-template-actions  w-full",variant:C.ghost,onClick:h,label:n("manager_error_page_action_home_label")})}),a.jsx("div",{children:a.jsx(m,{"data-testid":"error-template-action-reload",className:"error-template-actions w-full ",onClick:$,label:n("manager_error_page_action_reload_label")})})]})]})};try{f.displayName="ErrorBanner",f.__docgenInfo={description:"",displayName:"ErrorBanner",props:{error:{defaultValue:null,description:"",name:"error",required:!0,type:{name:"{ status?: number; data?: any; headers?: any; }"}},onRedirectHome:{defaultValue:null,description:"",name:"onRedirectHome",required:!1,type:{name:"() => void"}},onReloadPage:{defaultValue:null,description:"",name:"onReloadPage",required:!1,type:{name:"() => void"}},labelTracking:{defaultValue:null,description:"",name:"labelTracking",required:!1,type:{name:"string"}}}}}catch{}export{f as E};
