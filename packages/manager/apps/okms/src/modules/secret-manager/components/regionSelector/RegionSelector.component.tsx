import React, { Fragment, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import {
  OdsButton,
  OdsPopover,
  OdsDivider,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Link } from '@/common/components/Link/Link.component';
import { useRegionSelector } from '@/modules/secret-manager/hooks/useRegionSelector';

export const RegionSelector = () => {
  const {
    geographyGroups,
    currentRegion,
    isLoading,
    isError,
  } = useRegionSelector();
  const { t } = useTranslation(NAMESPACES.REGION);
  const popoverRef = useRef<HTMLOdsPopoverElement>(null);

  // Render nothing if there is an error
  // useRegionSelector will send an error notification
  if (isError) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <OdsText preset="heading-6">{t('region')}</OdsText>
      <div>
        <OdsButton
          icon="chevron-down"
          iconAlignment="right"
          id="trigger-region-selector-popover"
          label={currentRegion?.label || ''}
          variant="ghost"
          isLoading={isLoading}
        />
        <OdsPopover
          data-testid="region-selector-popover"
          ref={popoverRef}
          triggerId="trigger-region-selector-popover"
          position="bottom-start"
          className="p-0 m-0"
        >
          <div className="flex flex-col gap-2 p-4">
            {geographyGroups.map((geographyGroup, index) => (
              <Fragment key={geographyGroup.geographyLabel}>
                <div className="flex flex-col gap-4">
                  <OdsText
                    preset="caption"
                    className="[&::part(text)]:text-[var(--ods-color-heading)]"
                  >
                    {geographyGroup.geographyLabel}
                  </OdsText>
                  {geographyGroup.regions.map((link) => (
                    <Link
                      className={clsx(
                        'ml-1',
                        link.region === currentRegion?.region
                          ? '[&::part(link)]:text-[var(--ods-color-heading)]'
                          : '[&::part(link)]:text-[var(--ods-color-primary-500)]',
                      )}
                      key={link.region}
                      href={link.href}
                      label={link.label}
                      isRouterLink
                      onClick={() => {
                        popoverRef.current?.hide();
                      }}
                    />
                  ))}
                </div>
                {index < geographyGroups.length - 1 && (
                  <OdsDivider className="-mx-4 mt-2 mb-1" />
                )}
              </Fragment>
            ))}
          </div>
        </OdsPopover>
      </div>
    </div>
  );
};
