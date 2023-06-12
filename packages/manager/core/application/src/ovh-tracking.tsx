import { useEffect, useLayoutEffect, useState, useRef } from 'react';
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

export default function OvhTracking() {
  const location = useLocation();
  const shell = useShell();
  const { tracking, environment } = shell;
  const env = environment.getEnvironment();
  const [locationPath, setLocationPath] = useState(location);
  const myStateRef = useRef(locationPath);

  // Use trackingPage to send action load
  const OvhTrackPage = (loc: any) => {
    const path = loc?.pathname.split('/')[1];
    const partsReplace = loc.pathname.substring(1).replaceAll('/', '::');
    env.then((response) => {
      const { applicationName, universe } = response;
      const name = `${universe}::${applicationName}::${partsReplace ||
        'homepage'}`;
      tracking.trackPage({
        name,
        level2: '81',
        page_category: path || 'homepage',
      });
    });
  };

  useEffect(() => {
    tracking.init(false);
  }, []);

  useEffect(() => {
    // When location change, send tracking load page
    OvhTrackPage(location);
    myStateRef.current = location;
    setLocationPath(location);
  }, [location]);

  const ovhTrackingSendCLick = (value: string) => {
    const path = myStateRef.current.pathname.split('/')[1];
    env.then((response) => {
      const { applicationName, universe } = response;
      const name = `${applicationName}::${path || 'homepage'}::${value}`;
      const page = `${universe}::${applicationName}::${path || 'homepage'}`;
      tracking.trackClick({
        name,
        page: { name: page },
        complete_page_name: page,
        level2: '81',
        type: 'action',
      });
    });
  };

  // Send tracking click for the ODS_COMPONENTS_GROUP
  const ovhTrackingParentNode = (event) => {
    const value = event.detail.value || event.detail.newValue;
    ovhTrackingSendCLick(value);
  };

  // Init event listener for each ODS_COMPONENTS_GROUP on value change
  const addOdsEventListenerValue = () => {
    const elmTab = [];
    ODS_COMPONENTS_GROUP.forEach((element) => {
      const odsSelector = document.querySelectorAll(element);
      odsSelector.forEach((elementSlctr) => {
        elementSlctr?.addEventListener(
          'odsValueChange',
          ovhTrackingParentNode,
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
            ovhTrackingParentNode,
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
    )
      ovhTrackingSendCLick(element['data-tracking']);
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
