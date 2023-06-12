import { useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useShell } from '.';

// Send hit with data-tracking attributes
const ODS_COMPONENTS = ['OSDS-BUTTON', 'OSDS-LINK'];
// Send hit when value attributes change
const ODS_COMPONENTS_GROUP = [
  'osds-select',
  'osds-radio-group',
  'osds-checkbox',
];

export default function OvhTracking({ trackingObj }) {
  const location = useLocation();
  const shell = useShell();
  const { tracking } = shell;

  // Use trackingPage to send action load
  const OvhTrackPage = () => {
    const path = location.pathname.split('/')[1];
    tracking.trackPage({
      name: path || 'homePage',
      level2: '1',
    });
  };

  useEffect(() => {
    // Init the tracking when the app is loading
    if (trackingObj.nbActionLoad === 0) {
      tracking.init(false);
    }
  }, []);

  useEffect(() => {
    // When location change, send tracking load page
    if (trackingObj.nbActionLoad) {
      OvhTrackPage();
    }
    trackingObj.nbActionLoad += 1; // eslint-disable-line no-param-reassign
  }, [location]);

  // Send tracking click for the ODS_COMPONENTS_GROUP
  const ovhTrackingParenNode = (event) => {
    tracking.trackClick({
      name: event.detail.value || event.detail.newValue,
      level2: '1',
      type: 'action',
    });
  };

  // Init event listener for each ODS_COMPONENTS_GROUP on value change
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
      // After the layout and all ods components loaded
      // Add events listener
      tabsEvents = addOdsEventListenerValue();
    }, 500);

    // Clean every listener events
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

  // Get the data-tracking value from ODS_COMPONENTS
  // To send a track click
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
    // Add event listener click on the window
    window.addEventListener('click', ohvTrackingAction, false);
    return () => {
      // clean all events listener
      window.removeEventListener('click', ohvTrackingAction, false);
    };
  }, []);

  return null;
}
