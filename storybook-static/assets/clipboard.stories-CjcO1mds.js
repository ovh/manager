import{j as r}from"./jsx-runtime-CKrituN3.js";import{O as d}from"./ods-theme-typography-size-DKhhZ49-.js";import{t as f,O as l}from"./index-Csze6KrO.js";import{i as o}from"./i18next-BjY3x9oy.js";import{u as E}from"./useTranslation-BaRBqxpK.js";import"./index-CBqU2yxZ.js";import"./_commonjsHelpers-BosuxZz1.js";import"./index-BtM5VmRH.js";const R="Kopiert",x="Fehler beim Kopieren",T={clipboard_copy_success:R,clipboard_copy_error:x},h="Copied",O="Copy error.",S={clipboard_copy_success:h,clipboard_copy_error:O},j="Copiado",I="Se ha producido un error al copiar.",v={clipboard_copy_success:j,clipboard_copy_error:I},D="Copié",N="Erreur de copie.",P={clipboard_copy_success:D,clipboard_copy_error:N},B="Copié",F="Erreur de copie.",L={clipboard_copy_success:B,clipboard_copy_error:F},k="Copiato",w="Errore di copia",z={clipboard_copy_success:k,clipboard_copy_error:w},A="Skopiowano",G="Błąd kopiowania.",K={clipboard_copy_success:A,clipboard_copy_error:G},V="Copiado",H="Erro de cópia.",M={clipboard_copy_success:V,clipboard_copy_error:H};function t(){o.addResources("de_DE","clipboard",T),o.addResources("en_GB","clipboard",S),o.addResources("es_ES","clipboard",v),o.addResources("fr_CA","clipboard",P),o.addResources("fr_FR","clipboard",L),o.addResources("it_IT","clipboard",z),o.addResources("pl_PL","clipboard",K),o.addResources("pt_PT","clipboard",M)}o.isInitialized?t():o.on("initialized",t);const a=p=>{const{t:i}=E("clipboard");return r.jsxs(f,{...p,"data-testid":"clipboard",children:[r.jsx("span",{slot:"success-message",children:r.jsx(l,{color:d.success,"data-testid":"clipboard-success",children:i("clipboard_copy_success")})}),r.jsx("span",{slot:"error-message",children:r.jsx(l,{color:d.error,"data-testid":"clipboard-error",children:i("clipboard_copy_error")})})]})};try{a.displayName="Clipboard",a.__docgenInfo={description:"",displayName:"Clipboard",props:{}}}catch{}const oo={title:"Components/Clipboard",component:a},c={args:{value:"Value to copy to clipboard"}},s={args:{value:"Disabled clipboard",disabled:!0}},e={args:{value:"Inline clipboard",inline:!0}};var _,n,b;c.parameters={...c.parameters,docs:{...(_=c.parameters)==null?void 0:_.docs,source:{originalSource:`{
  args: {
    value: 'Value to copy to clipboard'
  }
}`,...(b=(n=c.parameters)==null?void 0:n.docs)==null?void 0:b.source}}};var u,y,m;s.parameters={...s.parameters,docs:{...(u=s.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    value: 'Disabled clipboard',
    disabled: true
  }
}`,...(m=(y=s.parameters)==null?void 0:y.docs)==null?void 0:m.source}}};var C,g,$;e.parameters={...e.parameters,docs:{...(C=e.parameters)==null?void 0:C.docs,source:{originalSource:`{
  args: {
    value: 'Inline clipboard',
    inline: true
  }
}`,...($=(g=e.parameters)==null?void 0:g.docs)==null?void 0:$.source}}};const ro=["regular","disabled","inline"];export{ro as __namedExportsOrder,oo as default,s as disabled,e as inline,c as regular};
//# sourceMappingURL=clipboard.stories-CjcO1mds.js.map
