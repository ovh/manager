import angular from 'angular';

import badgeDirective from './badge-directive';
import directive from './directive';
import eventDirective from './event-directive';
import footerDirective from './footer-directive';
import headingDirective from './heading-directive';
import panelDirective from './panel-directive';

import './index.less';

const moduleName = 'ngOvhTimeline';

angular
  .module(moduleName, [])
  .directive('timeline', directive)
  .directive('timelineBadge', badgeDirective)
  .directive('timelineEvent', eventDirective)
  .directive('timelineFooter', footerDirective)
  .directive('timelineHeading', headingDirective)
  .directive('timelinePanel', panelDirective);

export default moduleName;
