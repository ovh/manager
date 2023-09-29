import { useEffect, useLayoutEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { AT_INTERNET_LEVEL2 } from '@ovh-ux/ovh-at-internet';
import { useShell } from '.';

const OSDS_COMPONENT = [
  'OSDS-ACCORDION',
  'OSDS-ACCORDION-GROUP',
  'OSDS-BREADCRUMB',
  'OSDS-BUTTON',
  'OSDS-CHECKBOX',
  'OSDS-CHECKBOX-BUTTON',
  'OSDS-CHIP',
  'OSDS-CLIPBOARD',
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

export default function OvhTracking() {
  const location = useLocation();
  const shell = useShell();
  const { tracking, environment } = shell;
  const env = environment.getEnvironment();
  const [locationPath, setLocationPath] = useState(location);
  const myStateRef = useRef(locationPath);

  const trackLevel2 = (universe: string) => {
    const result = Object.keys(AT_INTERNET_LEVEL2).filter((element) =>
      AT_INTERNET_LEVEL2[element]
        .toLowerCase()
        .indexOf(universe.toLowerCase()) > -1
        ? element
        : false,
    );
    return result ? result[0] : '0';
  };

  const OvhTrackPage = (loc: any) => {
    const path = loc?.pathname.split('/')[1];
    const partsReplace = loc.pathname.substring(1).replaceAll('/', '::');
    env.then((response) => {
      const { applicationName, universe } = response;
      const name = `${universe}::${applicationName}::${partsReplace ||
        'homepage'}`;
      tracking.trackPage({
        name,
        level2: trackLevel2(universe),
        page_category: path || 'homepage',
      });
    });
  };

  const ovhTrackingSenClick = (value: string) => {
    env.then((response) => {
      const { applicationName, universe } = response;
      const path = myStateRef.current.pathname.split('/')[1];
      const name = `${applicationName}::${path || 'homepage'}::${value}`;
      const page = `${universe}::${applicationName}::${path || 'homepage'}`;
      tracking.trackClick({
        name,
        page: { name: page },
        complete_page_name: page,
        level2: trackLevel2(universe),
        type: 'action',
      });
    });
  };

  const ovhTrackingAction = (event) => {
    const element = event.target as HTMLElement;
    const closestWithTracking = element.closest(`[${'data-tracking'}]`);
    if (closestWithTracking) {
      const trackingValue = closestWithTracking.getAttribute('data-tracking');
      if (
        trackingValue &&
        OSDS_COMPONENT.includes(closestWithTracking.tagName.toUpperCase())
      ) {
        ovhTrackingSenClick(trackingValue);
      }
    }
  };

  const ovhTrackSelectOption = (event) => {
    const element = event.target as HTMLElement;
    const closestWithTracking = element.closest(`[${'data-tracking'}]`);
    const trackingValue = closestWithTracking.getAttribute('data-tracking');
    if (trackingValue) {
      ovhTrackingSenClick(trackingValue);
    }
  };

  useEffect(() => {
    tracking.init(false);
  }, []);

  useEffect(() => {
    OvhTrackPage(location);
    myStateRef.current = location;
    setLocationPath(location);
  }, [location]);

  useLayoutEffect(() => {
    document.body.addEventListener('click', ovhTrackingAction);
    document.body.addEventListener(
      'odsSelectOptionClick',
      ovhTrackSelectOption,
    );
    return () => {
      document.body.removeEventListener('click', ovhTrackingAction);
      document.body.removeEventListener(
        'odsSelectOptionClick',
        ovhTrackSelectOption,
      );
    };
  }, []);

  return null;
}
