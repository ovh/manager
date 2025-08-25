import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import { useLocation } from 'react-router-dom';

import { AT_INTERNET_LEVEL2 } from '@ovh-ux/ovh-at-internet';

const OSDS_COMPONENT = [
  'OSDS-ACCORDION',
  'OSDS-ACCORDION-GROUP',
  'OSDS-BREADCRUMB',
  'OSDS-BUTTON',
  'OSDS-CHECKBOX',
  'OSDS-CHECKBOX-BUTTON',
  'OSDS-CHIP',
  'OSDS-CLIPBOARD',
  'OSDS-DATEPICKER',
  'OSDS-INPUT',
  'OSDS-LINK',
  'OSDS-MODAL',
  'OSDS-PAGINATION',
  'OSDS-PASSWORD',
  'OSDS-PHONE-NUMBER',
  'OSDS-RADIO-GROUP',
  'OSDS-RADIO',
  'OSDS-RADIO-BUTTON',
  'OSDS-RANGE',
  'OSDS-SEARCH-BAR',
  'OSDS-SWITCH',
  'OSDS-SWITCH-ITEM',
  'OSDS-TABS',
  'OSDS-TAB-BAR',
  'OSDS-TAB-BAR-ITEM',
  'OSDS-TEXTAREA',
  'OSDS-TILE',
  'OSDS-TOGGLE',
];

export function OvhTracking({ shell }) {
  const location = useLocation();
  const { tracking, environment } = shell;
  const env = environment.getEnvironment();
  const [locationPath, setLocationPath] = useState(location);
  const myStateRef = useRef(locationPath);

  const trackLevel2 = (universe: string) => {
    const result = Object.keys(AT_INTERNET_LEVEL2).filter((element) =>
      AT_INTERNET_LEVEL2[element].toLowerCase().indexOf(universe.toLowerCase()) > -1
        ? element
        : false,
    );
    return result ? result[0] : '0';
  };

  const OvhTrackPage = (loc: any) => {
    const path = loc?.pathname.split('/')[1];
    env.then((response) => {
      const { applicationName, universe } = response;
      const page = `${applicationName}::${path || 'homepage'}`;
      const name = `${universe}::app::${applicationName}`;
      tracking.trackPage({
        name,
        level2: trackLevel2(universe),
        complete_page_name: page,
        page_category: path || 'homepage',
        page_theme: applicationName,
      });
    });
  };

  const ovhTrackingSendClick = (value: string) => {
    env.then((response) => {
      const { applicationName, universe } = response;
      const path = myStateRef.current.pathname.split('/')[1];
      const name = `${applicationName}::${path || 'homepage'}::${value}`;
      const page = `${universe}::app::${applicationName}`;
      tracking.trackClick({
        name,
        page: { name: page },
        page_category: path || 'homepage',
        complete_page_name: `${applicationName}::${path || 'homepage'}`,
        level2: trackLevel2(universe),
        type: 'action',
        page_theme: applicationName,
      });
    });
  };

  const ovhTrackShadowElement = (element) => {
    const elementInShadowRoot = element.shadowRoot.querySelector(`[${'data-tracking'}]`);
    if (
      elementInShadowRoot &&
      OSDS_COMPONENT.includes(elementInShadowRoot?.tagName?.toUpperCase())
    ) {
      const trackingValueInShadowRoot = elementInShadowRoot.getAttribute('data-tracking');
      ovhTrackingSendClick(trackingValueInShadowRoot);
    }
  };

  const ovhTrackingAction = (event) => {
    const element = event.target as HTMLElement;
    const closestWithTracking = element.closest(`[${'data-tracking'}]`);
    if (closestWithTracking) {
      const trackingValue = closestWithTracking.getAttribute('data-tracking');
      if (OSDS_COMPONENT.includes(closestWithTracking.tagName.toUpperCase())) {
        ovhTrackingSendClick(trackingValue);
        return;
      }
      if (element?.shadowRoot) {
        ovhTrackShadowElement(element);
      }
    }
  };

  const ovhTrackSelectOption = (event) => {
    const element = event.target as HTMLElement;
    const closestWithTracking = element.closest(`[${'data-tracking'}]`);

    if (closestWithTracking) {
      const trackingValue = closestWithTracking.getAttribute('data-tracking');
      if (trackingValue) {
        ovhTrackingSendClick(trackingValue);
      }
    }
  };

  useEffect(() => {
    OvhTrackPage(location);
    myStateRef.current = location;
    setLocationPath(location);
  }, [location]);

  useLayoutEffect(() => {
    document.body.addEventListener('click', ovhTrackingAction);
    document.body.addEventListener('odsSelectOptionClick', ovhTrackSelectOption);
    return () => {
      document.body.removeEventListener('click', ovhTrackingAction);
      document.body.removeEventListener('odsSelectOptionClick', ovhTrackSelectOption);
    };
  }, []);

  return null;
}

export default OvhTracking;
