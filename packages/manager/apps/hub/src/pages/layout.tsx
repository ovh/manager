import React, { useEffect, useContext } from 'react';
import { defineCurrentPage } from '@ovh-ux/request-tagger';
import { useLocation } from 'react-router-dom';
import {
  useOvhTracking,
  useRouteSynchro,
  ShellContext,
} from '@ovh-ux/manager-react-shell-client';
import {
  OsdsBreadcrumb,
  OsdsButton,
  OsdsLink,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { useFeatureAvailability } from '@ovhcloud/manager-components';
import { useTranslation } from 'react-i18next';
import Welcome from '@/components/welcome/Welcome.component';

// FIXME: should be in a constants file
const features = [
  'billing:management',
  'hub:banner-hub-invite-customer-siret',
  'hub:popup-hub-invite-customer-siret',
  'identity-documents',
  'procedures:fraud',
];

export default function Layout() {
  const location = useLocation();
  const { shell, environment } = useContext(ShellContext);
  const { trackCurrentPage } = useOvhTracking();
  const { t } = useTranslation();
  useRouteSynchro();
  const { data: availability, isLoading } = useFeatureAvailability(features);

  useEffect(() => {
    defineCurrentPage(`app.dashboard`);
  }, []);

  useEffect(() => {
    trackCurrentPage();
  }, [location]);

  useEffect(() => {
    shell.ux.hidePreloader();
  }, []);

  return (
    <>
      <div className="skipnav">
        <OsdsButton
          inline
          color={ODS_THEME_COLOR_INTENT.primary}
          variant={ODS_BUTTON_VARIANT.ghost}
          size={ODS_BUTTON_SIZE.sm}
          onClick={() => null}
        >
          {t('manager_hub_skip_to_main_content')}
        </OsdsButton>
      </div>
      <div className="position-relative w-full h-full overflow-auto">
        <div
          className={`position-absolute hub-main w-full h-full ${
            shell.ux.isAccountSidebarVisible()
              ? 'hub-main-view_sidebar_expanded'
              : ''
          }`}
        >
          <div className="mb-12">
            {/* Skip content target */}
            <div className="skiptarget">
              <a id="maincontent">-</a>
            </div>
            {/* /Skip content target */}
            <div className="pt-8">
              <div className="container hub-main-view_container px-4">
                <div className="pb-12">
                  <Welcome />
                  <div className="flex flex-wrap w-full minw-0 items-center justify-between">
                    <div className="mb-8">ovh-manager-banner</div>
                    <div className="w-full">ovh-manager-hub-carousel</div>
                  </div>
                  <div>oui-message.siret</div>
                  <div>oui-message.kycIndia</div>
                  <div>oui-message.kycFraud</div>
                  <div>oui-modal.siret</div>
                  <OsdsText
                    className="inline-block my-6"
                    level={ODS_TEXT_LEVEL.heading}
                    size={ODS_TEXT_SIZE._700}
                    color={ODS_THEME_COLOR_INTENT.text}
                  >
                    {t('manager_hub_dashboard_overview')}
                  </OsdsText>
                  <div className="row">
                    <div className="col-md-8 mb-3 mb-md-4">
                      hub-payment-status
                    </div>
                    <div className="col-md-4 mb-3 mb-md-4 order-3 order-md-2">
                      hub-enterprise-billing-summary
                    </div>
                    <div className="col-md-4 mb-3 mb-md-4 order-3 order-md-2">
                      hub-billing-summary
                    </div>
                    <div className="col-md-8 mb-3 mb-md-4 order-2 order-md-3">
                      ovh-manager-hub-support
                    </div>
                    <div className="col-md-4 order-4">hub-order-tracking</div>
                  </div>
                  <div className="hub-dashboard-product">
                    <OsdsText
                      className="inline-block my-6"
                      level={ODS_TEXT_LEVEL.heading}
                      size={ODS_TEXT_SIZE._700}
                      color={ODS_THEME_COLOR_INTENT.text}
                    >
                      {t('manager_hub_dashboard_services')}
                    </OsdsText>
                    <div>hub-products</div>
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
