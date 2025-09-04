import React, { useContext, useState, useRef, useEffect } from 'react';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
} from '@ovhcloud/ods-components';
import { OdsButton, OdsText } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { ListingContext } from '@/pages/listing/listingContext';

export const QuickFilter = ({ className }: { className?: string }) => {
  const { t } = useTranslation('listing');
  const { apiFilter, setApiFilter } = useContext(ListingContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    showIPv4: true,
    showIPv6: true,
    showParkedIps: false,
  });
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsMenuOpen((menuState) => !menuState);
  };

  const handleFilterChange = (filterName: string) => (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newValue = event.target.checked;

    // Prevent unchecking both IPv4 & IPv6
    if ((filterName === 'showIPv4' || filterName === 'showIPv6') && !newValue) {
      const otherFilter = filterName === 'showIPv4' ? 'showIPv6' : 'showIPv4';

      // If the other filter is already unchecked, prevent this uncheck
      if (!selectedFilters[otherFilter]) {
        return;
      }
    }

    setSelectedFilters((filters) => ({ ...filters, [filterName]: newValue }));
  };
  useEffect(() => {
    let version: number | undefined;
    if (selectedFilters.showIPv4 && !selectedFilters.showIPv6) {
      version = 4;
    } else if (!selectedFilters.showIPv4 && selectedFilters.showIPv6) {
      version = 6;
    }

    // Set routedToserviceName to null if showing parked IPs
    const routedToserviceName: string = selectedFilters.showParkedIps
      ? null
      : undefined;

    setApiFilter({
      ...apiFilter,
      version,
      routedToserviceName,
    });
  }, [selectedFilters]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={`relative ${className}`} ref={menuRef}>
      <OdsButton
        id="quick-filters"
        icon={ODS_ICON_NAME.filter}
        size={ODS_BUTTON_SIZE.sm}
        variant={ODS_BUTTON_VARIANT.outline}
        onClick={toggleMenu}
        aria-haspopup
        aria-expanded={isMenuOpen}
        label={t('listingQuickFilterLabel')}
        data-testid="quick-filter"
      />

      {isMenuOpen && (
        <div className="absolute z-10 mt-2 w-56 bg-white rounded-md shadow-lg">
          {/* IPv4 */}
          <label className="p-2 flex items-center hover:bg-gray-100 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedFilters.showIPv4}
              onChange={handleFilterChange('showIPv4')}
              disabled={!selectedFilters.showIPv4 && !selectedFilters.showIPv6}
            />
            <OdsText className="pl-1">
              {t('listingQuickFilterShowIPv4')}
            </OdsText>
          </label>

          {/* IPv6 */}
          <label className="p-2 flex items-center hover:bg-gray-100 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedFilters.showIPv6}
              onChange={handleFilterChange('showIPv6')}
              disabled={!selectedFilters.showIPv6 && !selectedFilters.showIPv4}
            />
            <OdsText className="pl-1">
              {t('listingQuickFilterShowIPv6')}
            </OdsText>
          </label>

          {/* Parked IPs */}
          <label className="p-2 flex items-center hover:bg-gray-100 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedFilters.showParkedIps}
              onChange={handleFilterChange('showParkedIps')}
            />
            <OdsText className="pl-1">
              {t('listingQuickFilterShowParkedIps')}
            </OdsText>
          </label>
        </div>
      )}
    </div>
  );
};
