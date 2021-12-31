import angular from 'angular';
import { set } from 'lodash-es';

import {
  atInternetClickDirective,
  trackOnDirective,
  trackImpressionDirective,
  trackImpressionClickDirective,
} from './directive';
import provider from './provider';

const moduleName = 'ngAtInternet';

angular
  .module(moduleName, [])
  .config(($provide, atInternetProvider) => {
    $provide.decorator('atInternet', ($delegate) => {
      const delegateTrackPage = $delegate.trackPage;
      let trackPageRequestQueue = [];
      const settings = {
        queueLimit: 30,
      };

      // Decorate trackPage to queue requests until At-internet default configuration is set
      set($delegate, 'trackPage', function trackPage() {
        const defaultsPromise = atInternetProvider.getDefaultsPromise();
        const trackInfos = arguments; // eslint-disable-line

        if (defaultsPromise && angular.isFunction(defaultsPromise.then)) {
          defaultsPromise.then(() => {
            delegateTrackPage.apply($delegate, trackInfos);
          });
        } else if (atInternetProvider.isDefaultSet()) {
          trackPageRequestQueue.forEach((trackPageArguments) => {
            delegateTrackPage.apply($delegate, trackPageArguments);
          });
          trackPageRequestQueue = [];
          delegateTrackPage.apply($delegate, trackInfos);
        } else {
          // Limit number of delegate track in queue.
          if (trackPageRequestQueue.length > settings.queueLimit) {
            throw new Error(
              'atinternet too much requests are waiting in track page request queue',
            );
          }
          trackPageRequestQueue.push(trackInfos);
        }
      });
      return $delegate;
    });
  })
  .directive('atInternetClick', atInternetClickDirective)
  .directive('trackOn', trackOnDirective)
  .directive('trackImpression', trackImpressionDirective)
  .directive('trackImpressionClick', trackImpressionClickDirective)
  .provider('atInternet', provider);

export default moduleName;
