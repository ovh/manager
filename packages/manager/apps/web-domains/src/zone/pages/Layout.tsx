import  { useContext, useEffect } from 'react';

import {  Outlet, useLocation, useMatches, useNavigate, useParams } from 'react-router-dom';

import { ShellContext, useOvhTracking, useRouteSynchro } from '@ovh-ux/manager-react-shell-client';
import { defineCurrentPage } from '@ovh-ux/request-tagger';
import BannerStatus from '@/domain/components/BannerStatus/BannerStatus';
import {  GuideMenu } from '@ovh-ux/muk';
import { Text, TEXT_PRESET } from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import ZonePage from './zone/Zone.page';
import { useOverridePage } from '../hooks/overridePage/useOverridePage';


export default function Layout() {
  const location = useLocation();
  const { shell } = useContext(ShellContext);
  const matches = useMatches();
  const serviceName = useParams();
  const { t } = useTranslation('zone');
  const isOverridedPage = useOverridePage();
  const { trackCurrentPage } = useOvhTracking();
  useRouteSynchro();

  useEffect(() => {
    const match = matches.slice(-1);
    defineCurrentPage(`app.web-domains/zone-${match[0]?.id}`);
    trackCurrentPage();
  }, [location, matches, trackCurrentPage]);

  useEffect(() => {
    shell.ux.hidePreloader();
  }, [shell.ux]);

  return (
    <> {!isOverridedPage && <>
        <BannerStatus serviceName={serviceName.serviceName ?? ''} />
        <div className="mb-4">
        <div className="flex items-center justify-between mb-4">
            <Text preset={TEXT_PRESET.label} >{t('zone_page_description')}</Text>
            <GuideMenu items={[]} />
        </div>
        <Text preset={TEXT_PRESET.paragraph}>{t('zone_page_description_2')}</Text>
      </div>
      <ZonePage/></>}
      <Outlet />
      
  </>
);
}
