import React, { useEffect, useContext, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import OvhContext from './ovh-context';

const TRACKING_PREFIX = 'Manager';
const ODS_COMPONENTS = ['OSDS-BUTTON', 'OSDS-LINK'];
const ODS_COMPONENTS_GROUP = [
  'osds-select',
  'osds-radio-group',
  'osds-checkbox',
];

export default function OvhTracking() {
  const location = useLocation();
  const value = useContext(OvhContext);
  const prefix = `${TRACKING_PREFIX}::Manager-${value.environment.universe}::${value.environment.universe}::${value.environment.applicationName}::`;

  useEffect(() => {
    console.info('init Tracking');
    console.info('context value : ', value);
  }, []);

  useEffect(() => {
    const trackingLoad = `Tracking page display : ${TRACKING_PREFIX}::${value.environment.region}::${value.environment.universe}::${value.environment.applicationName}`;
    const path = location.pathname.split('/')[1];
    if (path) console.info(`${trackingLoad}::${path}`);
    else console.info(trackingLoad);
  }, [location]);

  const ovhTrackingAddPath = (path) => {
    const lctn = location.pathname.split('/')[1];
    console.info('ovhTrackingAddPath lctn : ', lctn);
    if (lctn) return `${path}::${lctn}::`;
    return path;
  };

  const ovhTrackingParenNode = (event) => {
    const element = event.target as HTMLElement;
    console.info(
      `Tracking click action : ${ovhTrackingAddPath(prefix)}${
        element.tagName
      }-${event.detail.value || event.detail.newValue}`,
    );
  };

  const addOdsEventListenerValue = () => {
    const elmTab = [];
    ODS_COMPONENTS_GROUP.forEach((element) => {
      const odsSelector = document.querySelectorAll(element);
      console.info('****************************');
      console.info('odsSelector : ', odsSelector);
      odsSelector.forEach((elementSlctr) => {
        elementSlctr?.addEventListener(
          'odsValueChange',
          ovhTrackingParenNode,
          false,
        );
        elmTab.push(elementSlctr);
      });
    });
    return elmTab;
  };

  useLayoutEffect(() => {
    let tabsEvents = [];
    const timer = setTimeout(() => {
      tabsEvents = addOdsEventListenerValue();
    }, 500);

    return () => {
      clearTimeout(timer);
      if (tabsEvents.length > 0)
        tabsEvents.forEach((element) => {
          element.removeEventListener(
            'odsValueChange',
            ovhTrackingParenNode,
            false,
          );
        });
    };
  }, [location]);

  const ohvTrackingAction = (event) => {
    const element = event.target as HTMLElement;
    if (
      ODS_COMPONENTS.indexOf(element.tagName) > -1 &&
      element['data-tracking']
    ) {
      console.info(
        `Tracking click action 1 : ${ovhTrackingAddPath(prefix)}${
          element['data-tracking']
        }`,
      );
      return true;
    }
    return true;
  };

  useEffect(() => {
    window.addEventListener('click', ohvTrackingAction, false);
    return () => {
      window.removeEventListener('click', ohvTrackingAction, false);
    };
  }, []);

  return null;
}
