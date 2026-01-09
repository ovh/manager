import { Fragment, useRef } from 'react';

import { useRegionName } from '@key-management-service/hooks/useRegionName';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { OdsButton, OdsDivider, OdsPopover, OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { RouterLink } from '@/common/components/link/Link.component';
import { useRegionSelector } from '@/modules/secret-manager/hooks/useRegionSelector';

export const RegionSelector = () => {
  const { geographyGroups, currentRegion, isLoading, isError } = useRegionSelector();
  const { t } = useTranslation(NAMESPACES.REGION);
  const { translateRegionName, translateGeographyName } = useRegionName();
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
          label={currentRegion ? translateRegionName(currentRegion.region) : ''}
          variant="ghost"
          isLoading={isLoading}
        />
        <OdsPopover
          data-testid="region-selector-popover"
          ref={popoverRef}
          triggerId="trigger-region-selector-popover"
          position="bottom-start"
          className="m-0 p-0"
        >
          <div className="flex flex-col gap-2 p-4">
            {geographyGroups.map((geographyGroup, index) => (
              <Fragment key={geographyGroup.continentCode}>
                <div className="flex flex-col gap-4">
                  <OdsText
                    preset="caption"
                    className="[&::part(text)]:text-[var(--ods-color-heading)]"
                  >
                    {translateGeographyName(geographyGroup.continentCode)}
                  </OdsText>
                  {geographyGroup.regions.map((link) => (
                    <RouterLink
                      className={clsx(
                        'ml-1',
                        link.region === currentRegion?.region
                          ? '[&::part(link)]:text-[var(--ods-color-heading)]'
                          : '[&::part(link)]:text-[var(--ods-color-primary-500)]',
                      )}
                      key={link.region}
                      href={link.href}
                      onClick={async () => {
                        await popoverRef.current?.hide();
                      }}
                    >
                      {translateRegionName(link.region)}
                    </RouterLink>
                  ))}
                </div>
                {index < geographyGroups.length - 1 && <OdsDivider className="-mx-4 mb-1 mt-2" />}
              </Fragment>
            ))}
          </div>
        </OdsPopover>
      </div>
    </div>
  );
};
