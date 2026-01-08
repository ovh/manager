import { Fragment, useState } from 'react';

import { useRegionName } from '@key-management-service/hooks/useRegionName';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { Divider, Icon, Popover, PopoverContent, PopoverTrigger, Text } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Button } from '@ovh-ux/muk';

import { InternalLink } from '@/common/components/link/Link.component';
import { useRegionSelector } from '@/modules/secret-manager/hooks/useRegionSelector';

import { REGION_SELECTOR_TEST_IDS } from './regionSelector.constants';

export const RegionSelector = () => {
  const { geographyGroups, currentRegion, isLoading, isError } = useRegionSelector();
  const { t } = useTranslation(NAMESPACES.REGION);
  const { translateRegionName, translateGeographyName } = useRegionName();
  const [isOpen, setIsOpen] = useState(false);

  // Render nothing if there is an error
  // useRegionSelector will send an error notification
  if (isError) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <Text preset="heading-6">{t('region')}</Text>
      <Popover open={isOpen} onOpenChange={({ open }) => setIsOpen(open)}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            loading={isLoading}
            data-testid={REGION_SELECTOR_TEST_IDS.TRIGGER_REGION_SELECTOR_BUTTON}
            onClick={() => setIsOpen(!isOpen)}
          >
            <>
              {currentRegion ? translateRegionName(currentRegion.region) : ''}
              <Icon name="chevron-down" />
            </>
          </Button>
        </PopoverTrigger>
        <PopoverContent data-testid="region-selector-popover" className="m-0 p-0">
          <div className="flex flex-col gap-2 p-4">
            {geographyGroups.map((geographyGroup, index) => (
              <Fragment key={geographyGroup.continentCode}>
                <div className="flex flex-col gap-4">
                  <Text
                    preset="caption"
                    className="[&::part(text)]:text-[var(--ods-color-heading)]"
                  >
                    {translateGeographyName(geographyGroup.continentCode)}
                  </Text>
                  {geographyGroup.regions.map((link) => (
                    <InternalLink
                      className={clsx(
                        'ml-1',
                        link.region === currentRegion?.region
                          ? 'text-[var(--ods-color-heading)]'
                          : 'text-[var(--ods-color-primary-500)]',
                      )}
                      key={link.region}
                      to={link.href}
                      onClick={() => setIsOpen(false)}
                    >
                      {translateRegionName(link.region)}
                    </InternalLink>
                  ))}
                </div>
                {index < geographyGroups.length - 1 && (
                  <Divider
                    data-testid={REGION_SELECTOR_TEST_IDS.DIVIDER}
                    className="-mx-4 mb-1 mt-2"
                  />
                )}
              </Fragment>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
