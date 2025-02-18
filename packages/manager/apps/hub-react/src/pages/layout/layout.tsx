import React, {
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
import {
  OsdsButton,
  OsdsSkeleton,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_TEXT_COLOR_HUE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { defineCurrentPage } from '@ovh-ux/request-tagger';
import { useFeatureAvailability } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { features } from '@/pages/layout/layout.constants';
import { useFetchHubServices } from '@/data/hooks/services/useServices';
import { useLastOrder } from '@/data/hooks/lastOrder/useLastOrder';
// Components used in Suspense's fallback cannot be lazy loaded (break testing)
import TileGridSkeleton from '@/components/tile-grid-skeleton/TileGridSkeleton.component';
import { Context } from '@/pages/layout/context';

const Welcome = lazy(() => import('@/components/welcome/Welcome.component'));
const Banner = lazy(() => import('@/components/banner/Banner.component'));
const Products = lazy(() => import('@/components/products/Products.component'));
const Catalog = lazy(() => import('@/pages/layout/Catalog.component'));
const OrderTracking = lazy(() =>
  import('@/components/hub-order-tracking/HubOrderTracking.component'),
);
const HubSupport = lazy(() =>
  import('@/components/hub-support/HubSupport.component'),
);
const BillingSummary = lazy(() =>
  import('@/pages/layout/BillingSummary.component'),
);
const EnterpriseBillingSummary = lazy(() =>
  import('@/pages/layout/EnterpriseBillingSummary.component'),
);
const PaymentStatus = lazy(() =>
  import('@/pages/layout/PaymentStatus.component'),
);
const SiretBanner = lazy(() => import('@/pages/layout/SiretBanner.component'));
const SiretModal = lazy(() => import('@/pages/layout/SiretModal.component'));
const KycIndiaBanner = lazy(() =>
  import('@/pages/layout/KycIndiaBanner.component'),
);
const KycFraudBanner = lazy(() =>
  import('@/pages/layout/KycFraudBanner.component'),
);
const NotificationsCarousel = lazy(() =>
  import('@/pages/layout/NotificationsCarousel.component'),
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
      <div className="relative w-full h-full overflow-auto">
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
                  <Suspense
                    fallback={
                      <OsdsSkeleton data-testid="welcome_skeleton" inline />
                    }
                  >
                    <Welcome />
                  </Suspense>
                  <Suspense>
                    <Banner />
                  </Suspense>
                  <Suspense>
                    <NotificationsCarousel />
                  </Suspense>
                  <Suspense>
                    <SiretBanner />
                  </Suspense>
                  <Suspense>
                    <SiretModal />
                  </Suspense>
                  <Suspense>
                    <KycIndiaBanner />
                  </Suspense>
                  <Suspense>
                    <KycFraudBanner />
                  </Suspense>
                  {!isFreshCustomer && (
                    <OsdsText
                      className="inline-block my-6"
                      level={ODS_TEXT_LEVEL.heading}
                      size={ODS_TEXT_SIZE._500}
                      hue={ODS_TEXT_COLOR_HUE._800}
                      color={ODS_THEME_COLOR_INTENT.primary}
                    >
                      {t('manager_hub_dashboard_overview')}
                    </OsdsText>
                  )}
                  <div className={`flex flex-wrap ${isLoading ? '' : '-mx-6'}`}>
                    <div className="md:w-8/12 mb-6 md:mb-8 px-6 box-border">
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
                    <div className="md:w-8/12 mb-6 md:mb-8 order-2 md:order-3 px-6 box-border">
                      <Suspense>
                        <HubSupport />
                      </Suspense>
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
