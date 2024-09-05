import React, { useContext } from 'react';
import {
  ShellContext,
  useOvhTracking,
  ButtonType,
  PageLocation,
} from '@ovh-ux/manager-react-shell-client';
import { OsdsLink, OsdsSkeleton } from '@ovhcloud/ods-components/react';
import {
  OdsHTMLAnchorElementTarget,
  OdsHTMLAnchorElementRel,
} from '@ovhcloud/ods-common-core';
import { useFetchHubBanner } from '@/data/hooks/banner/useBanner';

export default function Banner() {
  const { environment } = useContext(ShellContext);
  const locale = environment.getUserLocale();
  const { trackClick } = useOvhTracking();

  const { data: banner, isPending: isLoading } = useFetchHubBanner(locale);

  return (
    <>
      {isLoading && <OsdsSkeleton data-testid="banner_skeleton" inline />}
      {!isLoading && banner && (
        <OsdsLink
          onClick={() => {
            trackClick({
              actionType: 'action',
              actions: [banner.tracker],
            });
          }}
          href={banner.link}
          target={OdsHTMLAnchorElementTarget._blank}
          rel={OdsHTMLAnchorElementRel.noopener}
          data-testid="banner_link"
        >
          <img
            className="md:hidden w-100 h-100"
            src={banner.images.responsive.src}
            alt={banner.alt}
            width={banner.images.responsive.width}
            height={banner.images.responsive.height}
            data-testid="banner_image_responsive"
          />
          <img
            className="hidden md:block w-100 h-100"
            src={banner.images.default.src}
            alt={banner.alt}
            width={banner.images.default.width}
            height={banner.images.default.height}
            data-testid="banner_image"
          />
        </OsdsLink>
      )}
    </>
  );
}
