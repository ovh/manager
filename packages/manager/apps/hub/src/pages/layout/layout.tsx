import React, { useEffect, useContext, useRef, Suspense, lazy } from 'react';
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
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { defineCurrentPage } from '@ovh-ux/request-tagger';
import { useFeatureAvailability } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { features, BILLING_FEATURE } from '@/pages/layout/layout.constants';
import { useFetchHubServices } from '@/data/hooks/services/useServices';
import { useFetchHubLastOrder } from '@/data/hooks/lastOrder/useLastOrder';
// Components used in Suspense's fallback cannot be lazy loaded (break testing)
import TileGridSkeleton from '@/components/tile-grid-skeleton/TileGridSkeleton.component';
import TileSkeleton from '@/components/tile-grid-skeleton/tile-skeleton/TileSkeleton.component';

const Welcome = lazy(() => import('@/components/welcome/Welcome.component'));
const Banner = lazy(() => import('@/components/banner/Banner.component'));
const Products = lazy(() => import('@/components/products/Products.component'));
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

export default function Layout() {
  const location = useLocation();
  const {
    shell,
    environment: { user },
  } = useContext(ShellContext);
  const { trackCurrentPage } = useOvhTracking();
  const { t } = useTranslation();
  const mainContentRef = useRef<HTMLAnchorElement>(null);
  useRouteSynchro();

  useEffect(() => {
    trackCurrentPage();
  }, [location]);

  useEffect(() => {
    defineCurrentPage(`app.dashboard`);
    shell.ux.hidePreloader();
    shell.ux.stopProgress();
  }, []);

  const {
    data: availability,
    isPending: isAvailabilityLoading,
  } = useFeatureAvailability(features);
  const {
    data: services,
    isPending: areServicesLoading,
  } = useFetchHubServices();
  const {
    data: lastOrder,
    isPending: isLastOrderLoading,
  } = useFetchHubLastOrder();

  function scrollToComponent() {
    mainContentRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  const isLoading = areServicesLoading || isLastOrderLoading;
  const isFreshCustomer = !(
    services?.data?.count ||
    (lastOrder?.status === 'OK' && lastOrder?.data)
  );

  return (
    <>
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
            shell.ux.isAccountSidebarVisible()
              ? 'hub-main-view_sidebar_expanded'
              : ''
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
              <div className="hub-main-view_container px-6">
                <div className="pb-12">
                  <Suspense
                    fallback={
                      <OsdsSkeleton data-testid="welcome_skeleton" inline />
                    }
                  >
                    <Welcome />
                  </Suspense>
                  <div className="flex flex-wrap w-full minw-0 items-center justify-between">
                    {isLoading && (
                      <OsdsSkeleton data-testid="banners_skeleton" />
                    )}
                    {!isLoading && !isFreshCustomer && (
                      <>
                        <Suspense
                          fallback={
                            <OsdsSkeleton
                              data-testid="banner_skeleton"
                              inline
                            />
                          }
                        >
                          <Banner />
                        </Suspense>
                        <div className="w-full">ovh-manager-hub-carousel</div>
                      </>
                    )}
                  </div>
                  {isLoading && (
                    <>
                      <OsdsSkeleton />
                      <OsdsSkeleton />
                      <OsdsSkeleton />
                      <OsdsSkeleton />
                    </>
                  )}
                  {!isLoading && !isFreshCustomer && (
                    <>
                      <div>oui-message.siret</div>
                      <div>oui-modal.siret</div>
                    </>
                  )}
                  {!isLoading && (
                    <>
                      <div>oui-message.kycIndia</div>
                      <div>oui-message.kycFraud</div>
                    </>
                  )}
                  <OsdsText
                    className="inline-block my-6"
                    level={ODS_TEXT_LEVEL.heading}
                    size={ODS_TEXT_SIZE._700}
                    color={ODS_THEME_COLOR_INTENT.text}
                  >
                    {t('manager_hub_dashboard_overview')}
                  </OsdsText>
                  <div className="flex flex-wrap -mx-6">
                    {isLoading && <TileSkeleton />}
                    {!isLoading && !isFreshCustomer && (
                      <>
                        <div className="md:w-8/12 mb-6 md:mb-8 px-6 box-border">
                          <Suspense fallback={<TileSkeleton />}>
                            <PaymentStatus
                              canManageBilling={availability[BILLING_FEATURE]}
                            />
                          </Suspense>
                        </div>
                        <div className="md:w-4/12 mb-6 md:mb-8 order-3 md:order-2 px-6 box-border">
                          <Suspense
                            fallback={
                              <TileSkeleton data-testid="billing_summary_skeleton" />
                            }
                          >
                            {user.enterprise ? (
                              <EnterpriseBillingSummary />
                            ) : (
                              <BillingSummary />
                            )}
                          </Suspense>
                        </div>
                        <div className="md:w-8/12 mb-6 md:mb-8 order-2 md:order-3 px-6 box-border">
                          <Suspense
                            fallback={
                              <TileSkeleton data-testid="support_skeleton" />
                            }
                          >
                            <HubSupport />
                          </Suspense>
                        </div>
                        <div className="md:w-4/12 order-4 px-6 box-border">
                          <Suspense
                            fallback={
                              <TileSkeleton data-testid="order_tracking_skeleton" />
                            }
                          >
                            <OrderTracking />
                          </Suspense>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="hub-dashboard-product">
                    {isLoading && <TileGridSkeleton />}
                    {!isLoading && !isFreshCustomer && (
                      <Suspense fallback={<TileGridSkeleton />}>
                        <Products services={services}></Products>
                      </Suspense>
                    )}
                    {!isLoading && isFreshCustomer && (
                      <>
                        {/* TODO: move these titles in the dedicated "Catalog" component */}
                        <OsdsText
                          className="inline-block my-6"
                          level={ODS_TEXT_LEVEL.heading}
                          size={ODS_TEXT_SIZE._700}
                          color={ODS_THEME_COLOR_INTENT.text}
                        >
                          {t('manager_hub_catalog_title')}
                        </OsdsText>
                        <OsdsText
                          className="inline-block my-6"
                          level={ODS_TEXT_LEVEL.subheading}
                          size={ODS_TEXT_SIZE._400}
                          color={ODS_THEME_COLOR_INTENT.text}
                        >
                          {t('manager_hub_catalog_description')}
                        </OsdsText>
                        <div>hub-catalog-items</div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
