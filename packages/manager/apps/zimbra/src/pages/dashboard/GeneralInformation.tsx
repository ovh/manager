import React, { useContext } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { OsdsTile, OsdsDivider } from '@ovhcloud/ods-components/react';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { LinkType, Links, Subtitle } from '@ovhcloud/manager-components';
import { useTranslation } from 'react-i18next';
import { GUIDES_LIST } from '@/guides.constants';

interface GuideLinks {
  [key: string]: string | undefined;
}

function GeneralInformation() {
  const { t } = useTranslation('dashboard');
  const context = useContext(ShellContext);
  const { ovhSubsidiary } = context.environment.getUser();
  const webmail = GUIDES_LIST.webmail.url;

  const guideLinks = (links: GuideLinks) => {
    return Object.entries(links).map(([key, value]) => {
      return (
        <div key={key} className="block">
          <OsdsDivider separator />
          <Links
            type={LinkType.external}
            target={OdsHTMLAnchorElementTarget._blank}
            href={value}
            label={t(key)}
          />
        </div>
      );
    });
  };

  return (
    <div className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 py-6">
      <div className="p-3">
        <OsdsTile>Tile 1</OsdsTile>
      </div>
      <div className="p-3 relative">
        <OsdsTile>Tile 2</OsdsTile>
      </div>
      <div className="p-3">
        <OsdsTile className="w-full h-full flex-col">
          <div className="flex flex-col w-full">
            <span slot="start">
              <Subtitle>Useful Links</Subtitle>
              {guideLinks({
                zimbra_dashboard_webmail: webmail,
                zimbra_dashboard_administrator_guide:
                  GUIDES_LIST.administrator_guide.url[ovhSubsidiary],
                zimbra_dashboard_user_guides:
                  GUIDES_LIST.user_guide.url[ovhSubsidiary],
              })}
            </span>
          </div>
        </OsdsTile>
      </div>
    </div>
  );
}

export default GeneralInformation;
