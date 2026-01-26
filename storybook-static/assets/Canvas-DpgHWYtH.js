import{j as n}from"./jsx-runtime-BRNY0I4F.js";import{C as o}from"./index-qV4cBGzN.js";const t=({of:e,...a})=>n.jsx(o,{of:e,...a});try{t.displayName="Canvas",t.__docgenInfo={description:"",displayName:"Canvas",props:{of:{defaultValue:null,description:`Pass the export defining a story to render that story

\`\`\`jsx
import { Meta, Canvas } from '@storybook/blocks';
import * as ButtonStories from './Button.stories';

<Meta of={ButtonStories} />
<Canvas of={ButtonStories.Primary} />
\`\`\``,name:"of",required:!1,type:{name:"any"}},meta:{defaultValue:null,description:`Pass all exports of the CSF file if this MDX file is unattached

\`\`\`jsx
import { Canvas } from '@storybook/blocks';
import * as ButtonStories from './Button.stories';

<Canvas of={ButtonStories.Primary} meta={ButtonStories} />;
\`\`\``,name:"meta",required:!1,type:{name:"ModuleExports"}},sourceState:{defaultValue:{value:"'hidden'"},description:`Specify the initial state of the source panel hidden: the source panel is hidden by default
shown: the source panel is shown by default none: the source panel is not available and the
button to show it is hidden`,name:"sourceState",required:!1,type:{name:"enum",value:[{value:'"hidden"'},{value:'"shown"'},{value:'"none"'}]}},layout:{defaultValue:{value:"'padded'"},description:`How to layout the story within the canvas padded: the story has padding within the canvas
fullscreen: the story is rendered edge to edge within the canvas centered: the story is
centered within the canvas`,name:"layout",required:!1,type:{name:"enum",value:[{value:'"padded"'},{value:'"fullscreen"'},{value:'"centered"'}]}},source:{defaultValue:null,description:"@see {SourceProps}",name:"source",required:!1,type:{name:'Omit<SourceProps, "dark">'}},story:{defaultValue:null,description:"@see {StoryProps}",name:"story",required:!1,type:{name:'Pick<StoryProps, "__forceInitialArgs" | "inline" | "height" | "autoplay" | "__primary">'}}}}}catch{}export{t as C};
