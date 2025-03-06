import {
  useEffect,
  useContext,
  useRef,
  Suspense,
  lazy,
  useState,
  useMemo,
} from 'react';
import { useLocation } from 'react-router-dom';
import {
  useOvhTracking,
  useRouteSynchro,
  ShellContext,
} from '@ovh-ux/manager-react-shell-client';
import { OsdsButton } from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_BUTTON_SIZE, ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { defineCurrentPage } from '@ovh-ux/request-tagger';
import { useFeatureAvailability } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { features } from '@/pages/layout/layout.constants';
import { useFetchHubServices } from '@/data/hooks/services/useServices';
import { useLastOrder } from '@/data/hooks/lastOrder/useLastOrder';
// Components used in Suspense's fallback cannot be lazy loaded (break testing)
import TileGridSkeleton from '@/components/tile-grid-skeleton/TileGridSkeleton.component';
import { Context } from '@/pages/layout/context';

import Welcome from '@/components/welcome/Welcome.component';
import Banner from '@/components/banner/Banner.component';
import NotificationsCarousel from '@/pages/layout/NotificationsCarousel.component';
import SiretBanner from '@/pages/layout/SiretBanner.component';
import SiretModal from '@/pages/layout/SiretModal.component';
import KycIndiaBanner from '@/pages/layout/KycIndiaBanner.component';
import KycFraudBanner from '@/pages/layout/KycFraudBanner.component';
import PaymentStatus from '@/pages/layout/PaymentStatus.component';
import HubSupport from '@/components/hub-support/HubSupport.component';
import OrderTracking from '@/components/hub-order-tracking/HubOrderTracking.component';
import HubDashboardSubtitle from '@/pages/layout/HubDashboardSubtitle';

const Products = lazy(() => import('@/components/products/Products.component'));
const Catalog = lazy(() => import('@/pages/layout/Catalog.component'));
const BillingSummary = lazy(() =>
  import('@/pages/layout/BillingSummary.component'),
);
const EnterpriseBillingSummary = lazy(() =>
  import('@/pages/layout/EnterpriseBillingSummary.component'),
);

export default function Layout() {
  const location = useLocation();
  const {
    shell,
    environment: { user },
  } = useContext(ShellContext);
  const { trackCurrentPage } = useOvhTracking();
  const { t } = useTranslation();
  const mainContentRef = useRef<HTMLAnchorElement>(null);
  const [isAccountSidebarVisible, setIsAccountSidebarVisible] = useState(false);
  useRouteSynchro();

  useEffect(() => {
    trackCurrentPage();
  }, [location]);

  useEffect(() => {
    const getIsAccountSidebarVisible = async () => {
      const newValueIsAccountSidebarVisible = (await shell.ux.isAccountSidebarVisible()) as boolean;
      setIsAccountSidebarVisible(() => newValueIsAccountSidebarVisible);
    };
    defineCurrentPage(`app.dashboard`);
    shell.ux.hidePreloader();
    shell.ux.stopProgress();
    getIsAccountSidebarVisible();
  }, []);

  const { data: availability } = useFeatureAvailability(features);
  const {
    data: services,
    isPending: areServicesLoading,
  } = useFetchHubServices();
  const { data: lastOrder, isPending: isLastOrderLoading } = useLastOrder();

  function scrollToComponent() {
    mainContentRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  const isLoading = areServicesLoading || isLastOrderLoading;
  const isFreshCustomer = !(
    services?.data?.count ||
    (lastOrder?.status === 'OK' && lastOrder?.data)
  );
  const context = useMemo(
    () => ({
      isLoading,
      isFreshCustomer,
      availability,
    }),
    [isLoading, isFreshCustomer, availability],
  );

  return (
    <Context.Provider value={context}>
      <div className="skipnav">
        <OsdsButton
          inline
          color={ODS_THEME_COLOR_INTENT.primary}
          variant={ODS_BUTTON_VARIANT.ghost}
          size={ODS_BUTTON_SIZE.sm}
          onClick={scrollToComponent}
          data-testid="skipnav_button"
        >
          {t('manager_hub_skip_to_main_content')}
        </OsdsButton>
      </div>
      <div className="relative w-full h-full overflow-y-scroll">
        <div
          className={`absolute hub-main w-full h-full ${
            isAccountSidebarVisible ? 'hub-main-view_sidebar_expanded' : ''
          }`}
          data-testid="hub_main_div"
        >
          <div className="mb-12">
            {/* Skip content target */}
            <div className="skiptarget">
              <a
                id="maincontent"
                data-testid="main_content"
                ref={mainContentRef}
              >
                -
              </a>
            </div>
            {/* /Skip content target */}
            <div className="pt-8">
              <div className="hub-main-view_container px-6 box-border">
                <div className="pb-12">
                  <Welcome />
                  <Banner />
                  {/* I doubt this height as we will have dots when we have more than 1 notification */}
                  <div className="h-[56px]">
                    <NotificationsCarousel />
                  </div>
                  <SiretBanner />
                  <SiretModal />
                  <KycIndiaBanner />
                  <KycFraudBanner />
                  <HubDashboardSubtitle />
                  <div className={`flex flex-wrap`}>
                    <div className="md:w-8/12 mb-6 md:mb-8 box-border">
                      <PaymentStatus />
                    </div>
                    <div className="md:w-4/12 mb-6 md:mb-8 order-3 md:order-2 px-6 box-border">
                      <Suspense>
                        {user.enterprise ? (
                          <EnterpriseBillingSummary />
                        ) : (
                          <BillingSummary />
                        )}
                      </Suspense>
                    </div>
                    <div className="md:w-8/12 mb-6 md:mb-8 order-2 md:order-3 box-border">
                      <HubSupport />
                    </div>
                    <div className="md:w-4/12 order-4 px-6 box-border">
                      <Suspense>
                        <OrderTracking />
                      </Suspense>
                    </div>
                  </div>
                  <div className="hub-dashboard-product">
                    {isLoading && <TileGridSkeleton />}
                    {!isLoading && !isFreshCustomer && (
                      <Suspense fallback={<TileGridSkeleton />}>
                        <Products services={services}></Products>
                      </Suspense>
                    )}
                    {!isLoading && isFreshCustomer && (
                      <Suspense fallback={<TileGridSkeleton />}>
                        <Catalog />
                      </Suspense>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Context.Provider>
  );
}
