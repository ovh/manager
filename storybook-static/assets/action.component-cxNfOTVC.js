import{j as l}from"./jsx-runtime-CKrituN3.js";import{R as k}from"./index-CBqU2yxZ.js";import{b as c,a as t,O as d}from"./index-Cs_lFblA.js";import{d as v,e as w}from"./index-D2Jq8zTl.js";import"./translation-CBNwEvwd.js";import{M as x}from"./ManagerButton-BMV99zZ4.js";import{u as y}from"./useTranslation-CvcVFFFk.js";const b=({item:e,isTrigger:u,id:i})=>{var o;const a={size:c.sm,variant:d.ghost,displayTooltip:!1,className:"menu-item-button w-full",...e};return e.href?l.jsx("a",{href:e.href,download:e.download,children:l.jsx(v,{...a})}):!(e!=null&&e.iamActions)||((o=e==null?void 0:e.iamActions)==null?void 0:o.length)===0?l.jsx(v,{...a}):l.jsx(x,{id:`${i}`,isIamTrigger:u,...a})},s=({items:e,isCompact:u,icon:i,variant:a=d.outline,isDisabled:o=!1,isLoading:m=!1,id:r})=>{const{t:p}=y("buttons"),[f,h]=k.useState(!1);return l.jsxs(l.Fragment,{children:[l.jsx("div",{id:`navigation-action-trigger-${r}`,className:"w-min",children:l.jsx(v,{"data-testid":"navigation-action-trigger-action",slot:"menu-title",id:r,variant:a,isDisabled:o,isLoading:m,size:c.sm,onClick:()=>h(!0),...!u&&{label:p("common_actions")},icon:i||(u?t.ellipsisVertical:t.chevronDown)})},r),l.jsx(w,{className:"py-[8px] px-0",triggerId:`navigation-action-trigger-${r}`,"with-arrow":!0,children:l.jsx("div",{className:"flex flex-col",children:e.map(({id:n,...g})=>l.jsx(b,{id:n,item:g,isTrigger:f},n))})})]})};try{s.displayName="ActionMenu",s.__docgenInfo={description:"",displayName:"ActionMenu",props:{items:{defaultValue:null,description:"",name:"items",required:!0,type:{name:"ActionMenuItem[]"}},isCompact:{defaultValue:null,description:"",name:"isCompact",required:!1,type:{name:"boolean"}},icon:{defaultValue:null,description:"",name:"icon",required:!1,type:{name:"enum",value:[{value:'"arrow-crossed"'},{value:'"arrow-down"'},{value:'"arrow-down-left"'},{value:'"arrow-down-right"'},{value:'"arrow-left"'},{value:'"arrow-left-right"'},{value:'"arrow-right"'},{value:'"arrow-up"'},{value:'"arrow-up-down"'},{value:'"arrow-up-left"'},{value:'"arrow-up-right"'},{value:'"bell"'},{value:'"bill"'},{value:'"book"'},{value:'"box"'},{value:'"calendar"'},{value:'"check"'},{value:'"chevron-double-left"'},{value:'"chevron-double-right"'},{value:'"chevron-down"'},{value:'"chevron-left"'},{value:'"chevron-right"'},{value:'"chevron-up"'},{value:'"circle-check"'},{value:'"circle-info"'},{value:'"circle-question"'},{value:'"circle-three-nodes"'},{value:'"circle-user"'},{value:'"circle-xmark"'},{value:'"clock-time-four"'},{value:'"clock-time-nine"'},{value:'"clock-time-six"'},{value:'"clock-time-three"'},{value:'"clock-time-twelve"'},{value:'"cloud"'},{value:'"cloud-check"'},{value:'"cloud-download"'},{value:'"cloud-lock"'},{value:'"cloud-upload"'},{value:'"cloud-xmark"'},{value:'"cog"'},{value:'"columns"'},{value:'"comment"'},{value:'"credit-card"'},{value:'"d-pad"'},{value:'"diamond-exclamation"'},{value:'"diamond-exclamation-full"'},{value:'"diamonds-full"'},{value:'"download"'},{value:'"ellipsis-horizontal"'},{value:'"ellipsis-vertical"'},{value:'"email"'},{value:'"emoticon"'},{value:'"emoticon-dizzy"'},{value:'"emoticon-neutral"'},{value:'"emoticon-sad"'},{value:'"emoticon-smile"'},{value:'"emoticon-wink"'},{value:'"equal"'},{value:'"external-link"'},{value:'"eye"'},{value:'"eye-off"'},{value:'"file"'},{value:'"file-copy"'},{value:'"file-minus"'},{value:'"file-plus"'},{value:'"filter"'},{value:'"flask-empty"'},{value:'"flask-full"'},{value:'"flask-half"'},{value:'"focus"'},{value:'"folder"'},{value:'"folder-minus"'},{value:'"folder-plus"'},{value:'"game-console"'},{value:'"game-controller"'},{value:'"game-controller-alt"'},{value:'"gathering"'},{value:'"globe"'},{value:'"grid"'},{value:'"grid-alt"'},{value:'"hamburger-menu"'},{value:'"hexagon-exclamation"'},{value:'"hexagon-exclamation-full"'},{value:'"hierarchy"'},{value:'"home"'},{value:'"key"'},{value:'"leaf"'},{value:'"lifebuoy"'},{value:'"lightbulb"'},{value:'"list"'},{value:'"location"'},{value:'"lock-close"'},{value:'"lock-open"'},{value:'"magnifying-glass"'},{value:'"minus"'},{value:'"money"'},{value:'"monitor"'},{value:'"network"'},{value:'"pen"'},{value:'"phone"'},{value:'"plus"'},{value:'"printer"'},{value:'"question"'},{value:'"refresh"'},{value:'"resize"'},{value:'"server"'},{value:'"server-rack"'},{value:'"share-nodes"'},{value:'"shield"'},{value:'"shield-check"'},{value:'"shield-exclamation"'},{value:'"shield-firewall"'},{value:'"shield-lock"'},{value:'"shield-minus"'},{value:'"shield-off"'},{value:'"shield-plus"'},{value:'"shield-xmark"'},{value:'"shopping-cart"'},{value:'"shopping-cart-error"'},{value:'"shopping-cart-minus"'},{value:'"shopping-cart-plus"'},{value:'"shopping-cart-xmark"'},{value:'"shrink"'},{value:'"shutdown"'},{value:'"sort-alpha-down"'},{value:'"sort-alpha-up"'},{value:'"sort-numeric-down"'},{value:'"sort-numeric-up"'},{value:'"star"'},{value:'"star-full"'},{value:'"store"'},{value:'"tag"'},{value:'"timer"'},{value:'"traffic-cone"'},{value:'"trash"'},{value:'"triangle-exclamation"'},{value:'"triangle-exclamation-full"'},{value:'"triangle-three-nodes"'},{value:'"truck"'},{value:'"undo"'},{value:'"upload"'},{value:'"user"'},{value:'"xmark"'}]}},variant:{defaultValue:{value:"ODS_BUTTON_VARIANT.outline"},description:"",name:"variant",required:!1,type:{name:"enum",value:[{value:'"default"'},{value:'"ghost"'},{value:'"outline"'}]}},id:{defaultValue:null,description:"",name:"id",required:!0,type:{name:"string"}},isDisabled:{defaultValue:{value:"false"},description:"",name:"isDisabled",required:!1,type:{name:"boolean"}},isLoading:{defaultValue:{value:"false"},description:"",name:"isLoading",required:!1,type:{name:"boolean"}}}}}catch{}try{actioncomponent.displayName="actioncomponent",actioncomponent.__docgenInfo={description:"",displayName:"actioncomponent",props:{items:{defaultValue:null,description:"",name:"items",required:!0,type:{name:"ActionMenuItem[]"}},isCompact:{defaultValue:null,description:"",name:"isCompact",required:!1,type:{name:"boolean"}},icon:{defaultValue:null,description:"",name:"icon",required:!1,type:{name:"enum",value:[{value:'"arrow-crossed"'},{value:'"arrow-down"'},{value:'"arrow-down-left"'},{value:'"arrow-down-right"'},{value:'"arrow-left"'},{value:'"arrow-left-right"'},{value:'"arrow-right"'},{value:'"arrow-up"'},{value:'"arrow-up-down"'},{value:'"arrow-up-left"'},{value:'"arrow-up-right"'},{value:'"bell"'},{value:'"bill"'},{value:'"book"'},{value:'"box"'},{value:'"calendar"'},{value:'"check"'},{value:'"chevron-double-left"'},{value:'"chevron-double-right"'},{value:'"chevron-down"'},{value:'"chevron-left"'},{value:'"chevron-right"'},{value:'"chevron-up"'},{value:'"circle-check"'},{value:'"circle-info"'},{value:'"circle-question"'},{value:'"circle-three-nodes"'},{value:'"circle-user"'},{value:'"circle-xmark"'},{value:'"clock-time-four"'},{value:'"clock-time-nine"'},{value:'"clock-time-six"'},{value:'"clock-time-three"'},{value:'"clock-time-twelve"'},{value:'"cloud"'},{value:'"cloud-check"'},{value:'"cloud-download"'},{value:'"cloud-lock"'},{value:'"cloud-upload"'},{value:'"cloud-xmark"'},{value:'"cog"'},{value:'"columns"'},{value:'"comment"'},{value:'"credit-card"'},{value:'"d-pad"'},{value:'"diamond-exclamation"'},{value:'"diamond-exclamation-full"'},{value:'"diamonds-full"'},{value:'"download"'},{value:'"ellipsis-horizontal"'},{value:'"ellipsis-vertical"'},{value:'"email"'},{value:'"emoticon"'},{value:'"emoticon-dizzy"'},{value:'"emoticon-neutral"'},{value:'"emoticon-sad"'},{value:'"emoticon-smile"'},{value:'"emoticon-wink"'},{value:'"equal"'},{value:'"external-link"'},{value:'"eye"'},{value:'"eye-off"'},{value:'"file"'},{value:'"file-copy"'},{value:'"file-minus"'},{value:'"file-plus"'},{value:'"filter"'},{value:'"flask-empty"'},{value:'"flask-full"'},{value:'"flask-half"'},{value:'"focus"'},{value:'"folder"'},{value:'"folder-minus"'},{value:'"folder-plus"'},{value:'"game-console"'},{value:'"game-controller"'},{value:'"game-controller-alt"'},{value:'"gathering"'},{value:'"globe"'},{value:'"grid"'},{value:'"grid-alt"'},{value:'"hamburger-menu"'},{value:'"hexagon-exclamation"'},{value:'"hexagon-exclamation-full"'},{value:'"hierarchy"'},{value:'"home"'},{value:'"key"'},{value:'"leaf"'},{value:'"lifebuoy"'},{value:'"lightbulb"'},{value:'"list"'},{value:'"location"'},{value:'"lock-close"'},{value:'"lock-open"'},{value:'"magnifying-glass"'},{value:'"minus"'},{value:'"money"'},{value:'"monitor"'},{value:'"network"'},{value:'"pen"'},{value:'"phone"'},{value:'"plus"'},{value:'"printer"'},{value:'"question"'},{value:'"refresh"'},{value:'"resize"'},{value:'"server"'},{value:'"server-rack"'},{value:'"share-nodes"'},{value:'"shield"'},{value:'"shield-check"'},{value:'"shield-exclamation"'},{value:'"shield-firewall"'},{value:'"shield-lock"'},{value:'"shield-minus"'},{value:'"shield-off"'},{value:'"shield-plus"'},{value:'"shield-xmark"'},{value:'"shopping-cart"'},{value:'"shopping-cart-error"'},{value:'"shopping-cart-minus"'},{value:'"shopping-cart-plus"'},{value:'"shopping-cart-xmark"'},{value:'"shrink"'},{value:'"shutdown"'},{value:'"sort-alpha-down"'},{value:'"sort-alpha-up"'},{value:'"sort-numeric-down"'},{value:'"sort-numeric-up"'},{value:'"star"'},{value:'"star-full"'},{value:'"store"'},{value:'"tag"'},{value:'"timer"'},{value:'"traffic-cone"'},{value:'"trash"'},{value:'"triangle-exclamation"'},{value:'"triangle-exclamation-full"'},{value:'"triangle-three-nodes"'},{value:'"truck"'},{value:'"undo"'},{value:'"upload"'},{value:'"user"'},{value:'"xmark"'}]}},variant:{defaultValue:{value:"ODS_BUTTON_VARIANT.outline"},description:"",name:"variant",required:!1,type:{name:"enum",value:[{value:'"default"'},{value:'"ghost"'},{value:'"outline"'}]}},id:{defaultValue:null,description:"",name:"id",required:!0,type:{name:"string"}},isDisabled:{defaultValue:{value:"false"},description:"",name:"isDisabled",required:!1,type:{name:"boolean"}},isLoading:{defaultValue:{value:"false"},description:"",name:"isLoading",required:!1,type:{name:"boolean"}}}}}catch{}export{s as A};
