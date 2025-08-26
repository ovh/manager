import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import { Location, useLocation } from 'react-router-dom';

import { AT_INTERNET_LEVEL2 } from '@ovh-ux/ovh-at-internet';

type Tracking = {
  trackPage: (data: {
    name: string;
    level2: string;
    complete_page_name: string;
    page_category: string;
    page_theme: string;
  }) => void;
  trackClick: (data: {
    name: string;
    page: { name: string };
    page_category: string;
    complete_page_name: string;
    level2: string;
    type: string;
    page_theme: string;
  }) => void;
};

type Environment = {
  getEnvironment: () => Promise<{ applicationName: string; universe: string }>;
};

type Shell = {
  tracking: Tracking;
  environment: Environment;
};

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

export function OvhTracking({ shell }: { shell: Shell }) {
  const location = useLocation();
  const { tracking, environment } = shell;
  const env = environment.getEnvironment();
  const [locationPath, setLocationPath] = useState(location);
  const myStateRef = useRef(locationPath);

  const trackLevel2 = (universe: string) => {
    const result = Object.keys(AT_INTERNET_LEVEL2).filter((element) =>
      AT_INTERNET_LEVEL2?.[element]?.toLowerCase().includes(universe.toLowerCase()),
    );
    return result.length > 0 ? result[0] : '0';
  };

  const OvhTrackPage = (loc: Location) => {
    const path = loc.pathname.split('/')[1];
    env
      .then(({ applicationName, universe }) => {
        const page = `${applicationName}::${path || 'homepage'}`;
        const name = `${universe}::app::${applicationName}`;
        tracking.trackPage({
          name,
          level2: trackLevel2(universe) || '',
          complete_page_name: page,
          page_category: path || 'homepage',
          page_theme: applicationName,
        });
      })
      .catch(() => {});
  };

  const ovhTrackingSendClick = (value: string) => {
    env
      .then(({ applicationName, universe }) => {
        const path = myStateRef.current.pathname.split('/')[1];
        const name = `${applicationName}::${path || 'homepage'}::${value}`;
        const page = `${universe}::app::${applicationName}`;
        tracking.trackClick({
          name,
          page: { name: page },
          page_category: path || 'homepage',
          complete_page_name: `${applicationName}::${path || 'homepage'}`,
          level2: trackLevel2(universe) || '',
          type: 'action',
          page_theme: applicationName,
        });
      })
      .catch(() => {});
  };

  const ovhTrackShadowElement = (element: HTMLElement) => {
    const elementInShadowRoot = element.shadowRoot?.querySelector<HTMLElement>('[data-tracking]');
    if (elementInShadowRoot && OSDS_COMPONENT.includes(elementInShadowRoot.tagName.toUpperCase())) {
      const trackingValueInShadowRoot = elementInShadowRoot.getAttribute('data-tracking');
      if (trackingValueInShadowRoot) {
        ovhTrackingSendClick(trackingValueInShadowRoot);
      }
    }
  };

  const ovhTrackingAction = (event: MouseEvent) => {
    const element = event.target as HTMLElement;
    const closestWithTracking = element.closest<HTMLElement>('[data-tracking]');
    if (closestWithTracking) {
      const trackingValue = closestWithTracking.getAttribute('data-tracking');
      if (trackingValue && OSDS_COMPONENT.includes(closestWithTracking.tagName.toUpperCase())) {
        ovhTrackingSendClick(trackingValue);
        return;
      }
      if (element.shadowRoot) {
        ovhTrackShadowElement(element);
      }
    }
  };

  const ovhTrackSelectOption = (event: Event) => {
    const element = event.target as HTMLElement;
    const closestWithTracking = element.closest<HTMLElement>('[data-tracking]');
    const trackingValue = closestWithTracking?.getAttribute('data-tracking');
    if (trackingValue) {
      ovhTrackingSendClick(trackingValue);
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
