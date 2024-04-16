import {
  useContext,
  useEffect,
  useRef,
  useState
} from 'react';

import ApplicationContext from '@/context';
import useProductNavReshuffle from '@/core/product-nav-reshuffle';
import { IFrameMessageBus } from '@ovh-ux/shell';


import useMfaEnrollment from '@/container/mfa-enrollment';
import { useProgress } from '@/context/progress';
import usePreloader from '../common/Preloader/usePreloader';
import NavReshuffleComponent from './NavReshuffle.component';

function NavReshuffleContainer(): JSX.Element {
  const iframeRef = useRef(null);
  const [iframe, setIframe] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const { shell } = useContext(ApplicationContext);
  const { isStarted: isProgressAnimating } = useProgress();
  const applications = shell
    .getPlugin('environment')
    .getEnvironment()
    .getApplications();

  const preloaderVisible = usePreloader(shell, iframe);

  const {
    isMfaEnrollmentForced,
    isMfaEnrollmentVisible,
    hideMfaEnrollment,
  } = useMfaEnrollment();

  const {
    isNavigationSidebarOpened,
    openNavigationSidebar,
    closeNavigationSidebar,
    isLoading
  } = useProductNavReshuffle();

  const onHamburgerMenuClick = () => {
    if (isNavigationSidebarOpened) {
      closeNavigationSidebar();
    } else {
      openNavigationSidebar();
    }
  };

  useEffect(() => {
    setIframe(iframeRef.current);
    shell.setMessageBus(new IFrameMessageBus(iframeRef.current));
  }, [iframeRef]);

  return (
    <NavReshuffleComponent 
    applications={applications}
    preloaderVisible={preloaderVisible}
    isMfaEnrollmentForced={isMfaEnrollmentForced}
    isLoading={isLoading}
    isMfaEnrollmentVisible={isMfaEnrollmentVisible}
    isNavigationSidebarOpened={isNavigationSidebarOpened}
    isProgressAnimating={isProgressAnimating}
    onHamburgerMenuClick={onHamburgerMenuClick}
    setShowOverlay={setShowOverlay}
    showOverlay={showOverlay}
    closeNavigationSidebar={closeNavigationSidebar}
    hideMfaEnrollment={hideMfaEnrollment}
    iframeRef={iframeRef}/>
  );
}

export default NavReshuffleContainer;
