import React, { useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { useShell } from '.';
import OvhContext from './ovh-context';

const ODS_COMPONENTS = [
  'OSDS-BUTTON',
  'OSDS-LINK',
  'OSDS-RADIO',
  'OSDS-CHECKBOX-BUTTON',
  'OSDS-CHECKBOX',
];

const TRACKING_PREFIX = 'ManagerCloud';

export default function OvhTracking() {
  const location = useLocation();
  const value = useContext(OvhContext);
  console.info('value context tracking : ', value);

  useEffect(() => {
    console.info('init Tracking');
  }, []);

  useEffect(() => {
    const trackingLoad = `Tracking page display : ${TRACKING_PREFIX}::${value.environment.region}::${value.environment.universe}::${value.environment.applicationName}`;
    const path = location.pathname.split('/')[1];
    if (path) console.info(`${trackingLoad}::${path}`);
    else console.info(trackingLoad);
  }, [location]);

  const ohvTrackingAction = (event) => {
    const element = event.target as HTMLElement;
    if (
      ODS_COMPONENTS.indexOf(element.tagName) > -1 &&
      element['data-tracking']
    )
      console.info(
        `Tracking click action : ${TRACKING_PREFIX}::${value.environment.region}::${value.environment.universe}::${value.environment.applicationName}::${element['data-tracking']}`,
      );
    if (
      ODS_COMPONENTS.indexOf(element.parentElement.tagName) > -1 &&
      element.parentElement['data-tracking']
    )
      console.info(
        `Tracking click PARENT action : ${TRACKING_PREFIX}::${value.environment.region}::${value.environment.universe}::${value.environment.applicationName}::${element.parentElement['data-tracking']}`,
      );
  };

  useEffect(() => {
    window.addEventListener('click', ohvTrackingAction, false);
    return () => {
      window.removeEventListener('click', ohvTrackingAction, false);
    };
  }, []);

  return undefined;
}
