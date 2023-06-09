import { useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useShell } from '.';

const ODS_COMPONENTS = ['OSDS-BUTTON', 'OSDS-LINK'];
const ODS_COMPONENTS_GROUP = [
  'osds-select',
  'osds-radio-group',
  'osds-checkbox',
];

export default function OvhTracking({ trackingObj }) {
  const location = useLocation();

  const shell = useShell();
  const { tracking } = shell;

  const OvhTrackPage = () => {
    const path = location.pathname.split('/')[1];
    tracking.trackPage({
      name: path || 'homePage',
      level2: '1',
    });
  };

  useEffect(() => {
    if (trackingObj.nbActionLoad === 0) {
      tracking.init(false);
    }
  }, []);

  useEffect(() => {
    if (trackingObj.nbActionLoad) {
      OvhTrackPage();
    }
    trackingObj.nbActionLoad += 1; // eslint-disable-line no-param-reassign
    console.info(
      'location useEffect trackingObj.nbActionLoad : ',
      trackingObj.nbActionLoad,
    );
  }, [location]);

  const ovhTrackingParenNode = (event) => {
    tracking.trackClick({
      name: event.detail.value || event.detail.newValue,
      level2: '1',
      type: 'action',
    });
  };

  const addOdsEventListenerValue = () => {
    const elmTab = [];
    ODS_COMPONENTS_GROUP.forEach((element) => {
      const odsSelector = document.querySelectorAll(element);
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
      tracking.trackClick({
        name: element['data-tracking'],
        level2: '1',
        type: 'action',
      });
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
