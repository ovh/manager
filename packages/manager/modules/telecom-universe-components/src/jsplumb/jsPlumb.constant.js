import { jsPlumb, jsPlumbUtil } from 'jsplumb/dist/js/jsplumb';

import registerTwoSegmentsConnector from './connector/twoSegments/jsplumb-connector-twoSegment';

registerTwoSegmentsConnector(jsPlumb, jsPlumbUtil);

export const TUC_JS_PLUMB = jsPlumb;
export const TUC_JS_PLUMB_UTIL = jsPlumbUtil;

export default { TUC_JS_PLUMB, TUC_JS_PLUMB_UTIL };
