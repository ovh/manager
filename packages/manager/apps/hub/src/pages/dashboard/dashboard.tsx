import { Suspense, lazy, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { useLocation } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_BUTTON_SIZE, ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { OsdsButton } from '@ovhcloud/ods-components/react';

import { useFeatureAvailability } from '@ovh-ux/manager-react-components';
import { ShellContext, useOvhTracking, useRouteSynchro } from '@ovh-ux/manager-react-shell-client';

import Banner from '@/components/banner/Banner.component';
// Components used in Suspense's fallback cannot be lazy loaded (break testing)
import TileGridSkeleton from '@/components/tile-grid-skeleton/TileGridSkeleton.component';
import Welcome from '@/components/welcome/Welcome.component';
import { useLastOrder } from '@/data/hooks/lastOrder/useLastOrder';
import { useFetchHubServices } from '@/data/hooks/services/useServices';
import HubDashboardSubtitle from '@/pages/dashboard/HubDashboardSubtitle';
import { Context } from '@/pages/dashboard/context';
import { features } from '@/pages/dashboard/dashboard.constants';

import NotificationsEmailUnreachable from './NotificationsEmailUnreachable.component';

const Products = lazy(() => import('@/components/products/Products.component'));
const Catalog = lazy(() => import('@/pages/dashboard/Catalog.component'));
const OrderTracking = lazy(
  () => import('@/components/hub-order-tracking/HubOrderTracking.component'),
);
const HubSupport = lazy(() => import('@/components/hub-support/HubSupport.component'));
const BillingSummary = lazy(() => import('@/pages/dashboard/BillingSummary.component'));
const EnterpriseBillingSummary = lazy(
  () => import('@/pages/dashboard/EnterpriseBillingSummary.component'),
);
const PaymentStatus = lazy(() => import('@/pages/dashboard/PaymentStatus.component'));
const SiretBanner = lazy(() => import('@/pages/dashboard/SiretBanner.component'));
const KycIndiaBanner = lazy(() => import('@/pages/dashboard/KycIndiaBanner.component'));
const KycFraudBanner = lazy(() => import('@/pages/dashboard/KycFraudBanner.component'));
const NotificationsCarousel = lazy(
  () => import('@/pages/dashboard/NotificationsCarousel.component'),
);

export default function Dashboard() {
  const location = useLocation();
  const {
    shell,
    environment: { user },
  } = useContext(ShellContext);
  const { trackCurrentPage } = useOvhTracking();
  const { t } = useTranslation();
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

    getIsAccountSidebarVisible();
  }, []);

  const { data: availability } = useFeatureAvailability(features);
  const { data: services, isPending: areServicesLoading } = useFetchHubServices();
  const { data: lastOrder, isPending: isLastOrderLoading } = useLastOrder();

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
      <div className="relative w-full h-full overflow-y-scroll" id="mainview">
        <div
          className={`absolute hub-main w-full h-full ${
            isAccountSidebarVisible ? 'hub-main-view_sidebar_expanded' : ''
          }`}
          data-testid="hub_main_div"
        >
          <div className="mb-12">
            {/* Skip content target */}
            <div className="skiptarget">
              <a id="maincontent" data-testid="main_content">
                -
              </a>
            </div>
            {/* /Skip content target */}
            <div className="pt-8">
              <div className="hub-main-view_container px-6 box-border">
                <div className="pb-12">
                  <Welcome />
                  <Banner />
                  <div>
                    <NotificationsCarousel />
                    <NotificationsEmailUnreachable />
                  </div>
                  <SiretBanner />
                  <KycIndiaBanner />
                  <KycFraudBanner />
                  <HubDashboardSubtitle />
                  <div className={`flex flex-wrap`}>
                    <div className="md:w-8/12 mb-6 md:mb-8 box-border">
                      <PaymentStatus />
                    </div>
                    <div className="md:w-4/12 mb-6 md:mb-8 order-3 md:order-2 px-6 box-border">
                      <Suspense>
                        {user.enterprise ? <EnterpriseBillingSummary /> : <BillingSummary />}
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
