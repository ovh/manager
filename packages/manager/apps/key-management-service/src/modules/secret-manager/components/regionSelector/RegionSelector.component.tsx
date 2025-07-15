import React, { Fragment, useRef } from 'react';
import {
  OdsButton,
  OdsPopover,
  OdsDivider,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { Link } from '@/common/components/Link/Link.component';
import { useRegionSelector } from '@/modules/secret-manager/hooks/useRegionSelector';

export const RegionSelector = () => {
  const {
    geographyGroups,
    currentRegion,
    isLoading,
    isError,
  } = useRegionSelector();
  const popoverRef = useRef<HTMLOdsPopoverElement>(null);

  // Render nothing if there is an error
  // useRegionSelector will send and error notification
  if (isError) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <OdsText preset="heading-6">Region</OdsText>
      <div>
        <OdsButton
          icon="chevron-down"
          iconAlignment="right"
          id="trigger-css"
          label={currentRegion?.label}
          variant="ghost"
          isLoading={isLoading}
        />
        <OdsPopover
          ref={popoverRef}
          triggerId="trigger-css"
          position="bottom-start"
          className="p-0 m-0"
        >
          <div className="flex flex-col gap-2 p-4">
            {geographyGroups.map((geographyGroup, index) => (
              <Fragment key={geographyGroup.geographyLabel}>
                <div className="flex flex-col gap-4">
                  <OdsText preset="caption">
                    {geographyGroup.geographyLabel}
                  </OdsText>
                  {geographyGroup.regions.map((link) => (
                    <Link
                      className="ml-1"
                      key={link.region}
                      href={link.href}
                      label={link.label}
                      isDisabled={link.region === currentRegion?.region}
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
