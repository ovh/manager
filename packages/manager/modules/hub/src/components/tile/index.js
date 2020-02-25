import 'ovh-ui-kit/dist/oui.css';
import './tile.less';

import tile from './tile.component';

const moduleName = 'ovhManagerHubTile';

angular.module(moduleName, ['oui']).component('ovhManagerHubTile', tile);

export default moduleName;
