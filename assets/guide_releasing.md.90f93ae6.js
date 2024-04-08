import{_ as s,o as n,c as a,Q as l}from"./chunks/framework.2eec50d8.js";const h=JSON.parse('{"title":"Releasing","description":"","frontmatter":{},"headers":[],"relativePath":"guide/releasing.md","filePath":"guide/releasing.md","lastUpdated":1712574958000}'),p={name:"guide/releasing.md"},e=l(`<h1 id="releasing" tabindex="-1">Releasing <a class="header-anchor" href="#releasing" aria-label="Permalink to &quot;Releasing&quot;">​</a></h1><div class="warning custom-block"><p class="custom-block-title">TODOs</p><p>⚠️ This section is in a work in progress ⚠️</p></div><p>Releasing a new version of Manager 🎉</p><h2 id="prepare" tabindex="-1">Prepare <a class="header-anchor" href="#prepare" aria-label="Permalink to &quot;Prepare&quot;">​</a></h2><ol><li><p>Decide which <a href="https://github.com/ovh/manager/pulls" target="_blank" rel="noreferrer">PRs</a> should be part of the next release.</p></li><li><p>Create a new PR for the <code>develop</code> branch. Please use the following template for the PR description, linking to the relevant issues and/or pull requests for each change, removing irrelevant headings:</p></li></ol><div class="language-md vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">md</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#79B8FF;font-weight:bold;"># 📦 New release</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">Approximate release date: 📆 DD/MM/YY</span></span>
<span class="line"></span>
<span class="line"><span style="color:#79B8FF;font-weight:bold;">## Dashboard</span></span>
<span class="line"></span>
<span class="line"><span style="color:#79B8FF;font-weight:bold;">### :sparkles: Features</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FFAB70;">-</span><span style="color:#E1E4E8;"> [ ] Description #</span></span>
<span class="line"></span>
<span class="line"><span style="color:#79B8FF;font-weight:bold;">### :bug: Bug Fixes</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FFAB70;">-</span><span style="color:#E1E4E8;"> [ ] Description #</span></span>
<span class="line"></span>
<span class="line"><span style="color:#79B8FF;font-weight:bold;">## Web Cloud</span></span>
<span class="line"></span>
<span class="line"><span style="color:#79B8FF;font-weight:bold;">### :sparkles: Features</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FFAB70;">-</span><span style="color:#E1E4E8;"> [ ] Description #</span></span>
<span class="line"></span>
<span class="line"><span style="color:#79B8FF;font-weight:bold;">### :bug: Bug Fixes</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FFAB70;">-</span><span style="color:#E1E4E8;"> [ ] Description #</span></span>
<span class="line"></span>
<span class="line"><span style="color:#79B8FF;font-weight:bold;">## Bare Metal Cloud</span></span>
<span class="line"></span>
<span class="line"><span style="color:#79B8FF;font-weight:bold;">### :sparkles: Features</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FFAB70;">-</span><span style="color:#E1E4E8;"> [ ] Description #</span></span>
<span class="line"></span>
<span class="line"><span style="color:#79B8FF;font-weight:bold;">### :bug: Bug Fixes</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FFAB70;">-</span><span style="color:#E1E4E8;"> [ ] Description #</span></span>
<span class="line"></span>
<span class="line"><span style="color:#79B8FF;font-weight:bold;">## Hosted Private Cloud</span></span>
<span class="line"></span>
<span class="line"><span style="color:#79B8FF;font-weight:bold;">### :sparkles: Features</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FFAB70;">-</span><span style="color:#E1E4E8;"> [ ] Description #</span></span>
<span class="line"></span>
<span class="line"><span style="color:#79B8FF;font-weight:bold;">### :bug: Bug Fixes</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FFAB70;">-</span><span style="color:#E1E4E8;"> [ ] Description #</span></span>
<span class="line"></span>
<span class="line"><span style="color:#79B8FF;font-weight:bold;">## Public Cloud</span></span>
<span class="line"></span>
<span class="line"><span style="color:#79B8FF;font-weight:bold;">### :sparkles: Features</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FFAB70;">-</span><span style="color:#E1E4E8;"> [ ] Description #</span></span>
<span class="line"></span>
<span class="line"><span style="color:#79B8FF;font-weight:bold;">### :bug: Bug Fixes</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FFAB70;">-</span><span style="color:#E1E4E8;"> [ ] Description #</span></span>
<span class="line"></span>
<span class="line"><span style="color:#79B8FF;font-weight:bold;">## Telecom</span></span>
<span class="line"></span>
<span class="line"><span style="color:#79B8FF;font-weight:bold;">### :sparkles: Features</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FFAB70;">-</span><span style="color:#E1E4E8;"> [ ] Description #</span></span>
<span class="line"></span>
<span class="line"><span style="color:#79B8FF;font-weight:bold;">### :bug: Bug Fixes</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FFAB70;">-</span><span style="color:#E1E4E8;"> [ ] Description #</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#005CC5;font-weight:bold;"># 📦 New release</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">Approximate release date: 📆 DD/MM/YY</span></span>
<span class="line"></span>
<span class="line"><span style="color:#005CC5;font-weight:bold;">## Dashboard</span></span>
<span class="line"></span>
<span class="line"><span style="color:#005CC5;font-weight:bold;">### :sparkles: Features</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E36209;">-</span><span style="color:#24292E;"> [ ] Description #</span></span>
<span class="line"></span>
<span class="line"><span style="color:#005CC5;font-weight:bold;">### :bug: Bug Fixes</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E36209;">-</span><span style="color:#24292E;"> [ ] Description #</span></span>
<span class="line"></span>
<span class="line"><span style="color:#005CC5;font-weight:bold;">## Web Cloud</span></span>
<span class="line"></span>
<span class="line"><span style="color:#005CC5;font-weight:bold;">### :sparkles: Features</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E36209;">-</span><span style="color:#24292E;"> [ ] Description #</span></span>
<span class="line"></span>
<span class="line"><span style="color:#005CC5;font-weight:bold;">### :bug: Bug Fixes</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E36209;">-</span><span style="color:#24292E;"> [ ] Description #</span></span>
<span class="line"></span>
<span class="line"><span style="color:#005CC5;font-weight:bold;">## Bare Metal Cloud</span></span>
<span class="line"></span>
<span class="line"><span style="color:#005CC5;font-weight:bold;">### :sparkles: Features</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E36209;">-</span><span style="color:#24292E;"> [ ] Description #</span></span>
<span class="line"></span>
<span class="line"><span style="color:#005CC5;font-weight:bold;">### :bug: Bug Fixes</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E36209;">-</span><span style="color:#24292E;"> [ ] Description #</span></span>
<span class="line"></span>
<span class="line"><span style="color:#005CC5;font-weight:bold;">## Hosted Private Cloud</span></span>
<span class="line"></span>
<span class="line"><span style="color:#005CC5;font-weight:bold;">### :sparkles: Features</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E36209;">-</span><span style="color:#24292E;"> [ ] Description #</span></span>
<span class="line"></span>
<span class="line"><span style="color:#005CC5;font-weight:bold;">### :bug: Bug Fixes</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E36209;">-</span><span style="color:#24292E;"> [ ] Description #</span></span>
<span class="line"></span>
<span class="line"><span style="color:#005CC5;font-weight:bold;">## Public Cloud</span></span>
<span class="line"></span>
<span class="line"><span style="color:#005CC5;font-weight:bold;">### :sparkles: Features</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E36209;">-</span><span style="color:#24292E;"> [ ] Description #</span></span>
<span class="line"></span>
<span class="line"><span style="color:#005CC5;font-weight:bold;">### :bug: Bug Fixes</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E36209;">-</span><span style="color:#24292E;"> [ ] Description #</span></span>
<span class="line"></span>
<span class="line"><span style="color:#005CC5;font-weight:bold;">## Telecom</span></span>
<span class="line"></span>
<span class="line"><span style="color:#005CC5;font-weight:bold;">### :sparkles: Features</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E36209;">-</span><span style="color:#24292E;"> [ ] Description #</span></span>
<span class="line"></span>
<span class="line"><span style="color:#005CC5;font-weight:bold;">### :bug: Bug Fixes</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E36209;">-</span><span style="color:#24292E;"> [ ] Description #</span></span></code></pre></div>`,6),o=[e];function i(c,t,r,d,g,y){return n(),a("div",null,o)}const u=s(p,[["render",i]]);export{h as __pageData,u as default};
