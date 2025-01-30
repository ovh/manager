var N=(e,t,s)=>{if(!t.has(e))throw TypeError("Cannot "+s)};var a=(e,t,s)=>(N(e,t,"read from private field"),s?s.call(e):t.get(e)),x=(e,t,s)=>{if(t.has(e))throw TypeError("Cannot add the same private member more than once");t instanceof WeakSet?t.add(e):t.set(e,s)},E=(e,t,s,i)=>(N(e,t,"write to private field"),i?i.call(e,s):t.set(e,s),s);var g=(e,t,s)=>(N(e,t,"access private method"),s);import{R as I,c as Q,n as B,e as L,a as U,b as z}from"./QueryClientProvider-CDvRjfR1.js";var l,r,w,c,m,j,W=(j=class extends I{constructor(t){super();x(this,c);x(this,l,void 0);x(this,r,void 0);x(this,w,void 0);this.mutationId=t.mutationId,E(this,r,t.mutationCache),E(this,l,[]),this.state=t.state||H(),this.setOptions(t.options),this.scheduleGc()}setOptions(t){this.options=t,this.updateGcTime(this.options.gcTime)}get meta(){return this.options.meta}addObserver(t){a(this,l).includes(t)||(a(this,l).push(t),this.clearGcTimeout(),a(this,r).notify({type:"observerAdded",mutation:this,observer:t}))}removeObserver(t){E(this,l,a(this,l).filter(s=>s!==t)),this.scheduleGc(),a(this,r).notify({type:"observerRemoved",mutation:this,observer:t})}optionalRemove(){a(this,l).length||(this.state.status==="pending"?this.scheduleGc():a(this,r).remove(this))}continue(){var t;return((t=a(this,w))==null?void 0:t.continue())??this.execute(this.state.variables)}async execute(t){var d,p,v,C,T,F,k,D,R,f,b,S,M,O,q,o,u,h,y,G;E(this,w,Q({fn:()=>this.options.mutationFn?this.options.mutationFn(t):Promise.reject(new Error("No mutationFn found")),onFail:(n,P)=>{g(this,c,m).call(this,{type:"failed",failureCount:n,error:P})},onPause:()=>{g(this,c,m).call(this,{type:"pause"})},onContinue:()=>{g(this,c,m).call(this,{type:"continue"})},retry:this.options.retry??0,retryDelay:this.options.retryDelay,networkMode:this.options.networkMode,canRun:()=>a(this,r).canRun(this)}));const s=this.state.status==="pending",i=!a(this,w).canStart();try{if(!s){g(this,c,m).call(this,{type:"pending",variables:t,isPaused:i}),await((p=(d=a(this,r).config).onMutate)==null?void 0:p.call(d,t,this));const P=await((C=(v=this.options).onMutate)==null?void 0:C.call(v,t));P!==this.state.context&&g(this,c,m).call(this,{type:"pending",context:P,variables:t,isPaused:i})}const n=await a(this,w).start();return await((F=(T=a(this,r).config).onSuccess)==null?void 0:F.call(T,n,t,this.state.context,this)),await((D=(k=this.options).onSuccess)==null?void 0:D.call(k,n,t,this.state.context)),await((f=(R=a(this,r).config).onSettled)==null?void 0:f.call(R,n,null,this.state.variables,this.state.context,this)),await((S=(b=this.options).onSettled)==null?void 0:S.call(b,n,null,t,this.state.context)),g(this,c,m).call(this,{type:"success",data:n}),n}catch(n){try{throw await((O=(M=a(this,r).config).onError)==null?void 0:O.call(M,n,t,this.state.context,this)),await((o=(q=this.options).onError)==null?void 0:o.call(q,n,t,this.state.context)),await((h=(u=a(this,r).config).onSettled)==null?void 0:h.call(u,void 0,n,this.state.variables,this.state.context,this)),await((G=(y=this.options).onSettled)==null?void 0:G.call(y,void 0,n,t,this.state.context)),n}finally{g(this,c,m).call(this,{type:"error",error:n})}}finally{a(this,r).runNext(this)}}},l=new WeakMap,r=new WeakMap,w=new WeakMap,c=new WeakSet,m=function(t){const s=i=>{switch(t.type){case"failed":return{...i,failureCount:t.failureCount,failureReason:t.error};case"pause":return{...i,isPaused:!0};case"continue":return{...i,isPaused:!1};case"pending":return{...i,context:t.context,data:void 0,failureCount:0,failureReason:null,error:null,isPaused:t.isPaused,status:"pending",variables:t.variables,submittedAt:Date.now()};case"success":return{...i,data:t.data,failureCount:0,failureReason:null,error:null,status:"success",isPaused:!1};case"error":return{...i,data:void 0,error:t.error,failureCount:i.failureCount+1,failureReason:t.error,isPaused:!1,status:"error"}}};this.state=s(this.state),B.batch(()=>{a(this,l).forEach(i=>{i.onMutationUpdate(t)}),a(this,r).notify({mutation:this,type:"updated",action:t})})},j);function H(){return{context:void 0,data:void 0,error:null,failureCount:0,failureReason:null,isPaused:!1,status:"idle",variables:void 0,submittedAt:0}}function X(e){return{onFetch:(t,s)=>{const i=async()=>{var b,S,M,O,q;const d=t.options,p=(M=(S=(b=t.fetchOptions)==null?void 0:b.meta)==null?void 0:S.fetchMore)==null?void 0:M.direction,v=((O=t.state.data)==null?void 0:O.pages)||[],C=((q=t.state.data)==null?void 0:q.pageParams)||[],T={pages:[],pageParams:[]};let F=!1;const k=o=>{Object.defineProperty(o,"signal",{enumerable:!0,get:()=>(t.signal.aborted?F=!0:t.signal.addEventListener("abort",()=>{F=!0}),t.signal)})},D=L(t.options,t.fetchOptions),R=async(o,u,h)=>{if(F)return Promise.reject();if(u==null&&o.pages.length)return Promise.resolve(o);const y={queryKey:t.queryKey,pageParam:u,direction:h?"backward":"forward",meta:t.options.meta};k(y);const G=await D(y),{maxPages:n}=t.options,P=h?U:z;return{pages:P(o.pages,G,n),pageParams:P(o.pageParams,u,n)}};let f;if(p&&v.length){const o=p==="backward",u=o?A:K,h={pages:v,pageParams:C},y=u(d,h);f=await R(h,y,o)}else{f=await R(T,C[0]??d.initialPageParam);const o=e??v.length;for(let u=1;u<o;u++){const h=K(d,f);if(h==null)break;f=await R(f,h)}}return f};t.options.persister?t.fetchFn=()=>{var d,p;return(p=(d=t.options).persister)==null?void 0:p.call(d,i,{queryKey:t.queryKey,meta:t.options.meta,signal:t.signal},s)}:t.fetchFn=i}}}function K(e,{pages:t,pageParams:s}){const i=t.length-1;return t.length>0?e.getNextPageParam(t[i],t,s[i],s):void 0}function A(e,{pages:t,pageParams:s}){var i;return t.length>0?(i=e.getPreviousPageParam)==null?void 0:i.call(e,t[0],t,s[0],s):void 0}function Y(e,t){return t?K(e,t)!=null:!1}function Z(e,t){return!t||!e.getPreviousPageParam?!1:A(e,t)!=null}export{W as M,Z as a,H as g,Y as h,X as i};
