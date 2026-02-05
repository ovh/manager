import { useMemo, useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { useOkmsList } from '@key-management-service/data/hooks/useOkms';
import { useNotificationAddErrorOnce } from '@key-management-service/hooks/useNotificationAddErrorOnce';
import { useRegionName } from '@key-management-service/hooks/useRegionName';

import { OdsFormField, OdsSelect } from '@ovhcloud/ods-components/react';
import { Icon, Message, Popover, PopoverContent, PopoverTrigger, Text } from '@ovhcloud/ods-react';

import { ButtonType, PageLocation } from '@ovh-ux/manager-react-shell-client';
import { Button } from '@ovh-ux/muk';

import { OkmsDomainStateBadge } from '@/common/components/okms-domain-state-badge/OkmsDomainStateBadge.component';
import { RegionCertificationBadges } from '@/common/components/region-certification-badge/RegionCertificationBadges.component';
import { RegionTypeBadge } from '@/common/components/region-type-badge/RegionTypeBadge.component';
import { useReferenceRegions } from '@/common/data/hooks/useReferenceRegions';
import { useOkmsTracking } from '@/common/hooks/useOkmsTracking';

import { SERVICE_KEYS_ROUTES_URLS } from '../../routes/routes.constants';

export const OkmsDomainTopZone = () => {
  const { okmsId } = useParams<{ okmsId?: string }>();
  const navigate = useNavigate();
  const { translateRegionName } = useRegionName();
  const { trackClick } = useOkmsTracking();

  const { data: okmsList, isPending: isOkmsPending, error: okmsError } = useOkmsList();
  const {
    data: referenceRegions,
    isPending: isRegionsPending,
    error: regionsError,
  } = useReferenceRegions();

  const [selectedRegionId, setSelectedRegionId] = useState<string>('');
  const [isDomainPopoverOpen, setIsDomainPopoverOpen] = useState(false);

  useNotificationAddErrorOnce(okmsError);
  useNotificationAddErrorOnce(regionsError);

  // Filter domains by selected region
  const filteredDomains = useMemo(() => {
    if (!okmsList) return [];
    if (!selectedRegionId) return okmsList;
    return okmsList.filter((okms) => okms.region === selectedRegionId);
  }, [okmsList, selectedRegionId]);

  // Find selected domain
  const selectedDomain = useMemo(() => {
    if (!okmsId || !okmsList) return undefined;
    return okmsList.find((okms) => okms.id === okmsId);
  }, [okmsId, okmsList]);

  // Find selected region information
  const selectedRegionInfo = useMemo(() => {
    if (!selectedDomain || !selectedDomain.region || !referenceRegions) return undefined;
    return referenceRegions.find((region) => region.id === selectedDomain.region);
  }, [selectedDomain, referenceRegions]);

  // Create a mapping from region id to certifications
  const regionCertificationsMap = useMemo(
    () => new Map(referenceRegions?.map((region) => [region.id, region.certifications])),
    [referenceRegions],
  );

  const handlePopoverOpenChange = ({ open }: { open: boolean }) => {
    setIsDomainPopoverOpen(open);
    // Reset region filter to "all regions" when opening the popover
    if (open) {
      setSelectedRegionId('');
    }
  };

  // Region options from reference regions
  const regionOptions = useMemo(() => {
    if (!referenceRegions) return [];
    return referenceRegions.map((region) => ({
      value: region.id,
      label: translateRegionName(region.id),
    }));
  }, [referenceRegions, translateRegionName]);

  const handleDomainSelect = (domainId: string) => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: ['select', 'okms'],
    });
    navigate(SERVICE_KEYS_ROUTES_URLS.serviceKeyList(domainId));
    setIsDomainPopoverOpen(false);
  };

  const isLoading = isOkmsPending || isRegionsPending;
  const hasError = !!okmsError || !!regionsError;
  const isInvalidOkmsId = okmsId && !selectedDomain && !isOkmsPending && okmsList;

  return (
    <div className="flex flex-col gap-4">
      <Popover open={isDomainPopoverOpen} onOpenChange={handlePopoverOpenChange}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="flex w-full cursor-pointer flex-col gap-3 rounded-md border border-solid border-[--ods-color-form-element-border-default] bg-[--ods-color-background-default] p-4 text-left transition-colors hover:border-[--ods-color-form-element-border-hover-default]"
            disabled={isLoading || hasError}
          >
            {isLoading ? (
              <Text preset="paragraph">Loading...</Text>
            ) : selectedDomain ? (
              <>
                <div className="flex items-center justify-between">
                  <Text preset="heading-6">{selectedDomain.iam.displayName}</Text>
                  {selectedDomain.iam.state && (
                    <OkmsDomainStateBadge state={selectedDomain.iam.state} />
                  )}
                </div>
                {selectedRegionInfo && (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Text preset="caption" className="text-[var(--ods-color-text-weak)]">
                        Region:
                      </Text>
                      <Text preset="caption">{translateRegionName(selectedRegionInfo.id)}</Text>
                      <Text preset="caption" className="text-[var(--ods-color-text-weak)]">
                        ({selectedRegionInfo.id})
                      </Text>
                    </div>
                    <div className="flex items-center gap-2">
                      <RegionTypeBadge type={selectedRegionInfo.type} />
                      <RegionCertificationBadges
                        certifications={regionCertificationsMap.get(selectedRegionInfo.id) ?? []}
                      />
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-end">
                  <Icon name="chevron-down" />
                </div>
              </>
            ) : (
              <Text preset="paragraph">Select domain</Text>
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent className="m-0 p-0">
          <div className="flex min-w-[300px] flex-col gap-4 p-4">
            {regionOptions.length > 0 && (
              <div className="flex flex-col gap-2">
                <Text preset="caption">Filter by region</Text>
                <OdsFormField>
                  <OdsSelect
                    name="region-filter"
                    value={selectedRegionId}
                    onOdsChange={(e) => setSelectedRegionId(e.detail.value || '')}
                  >
                    <option value="">All regions</option>
                    {regionOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </OdsSelect>
                </OdsFormField>
              </div>
            )}
            <div className="flex flex-col gap-2">
              <Text preset="caption">Domains</Text>
              {filteredDomains.length === 0 ? (
                <Text preset="paragraph" className="text-[var(--ods-color-text-weak)]">
                  {isOkmsPending ? 'Loading domains...' : 'No domains found'}
                </Text>
              ) : (
                <div className="flex flex-col gap-1">
                  {filteredDomains.map((domain) => (
                    <Button
                      key={domain.id}
                      variant="ghost"
                      className="justify-between"
                      onClick={() => handleDomainSelect(domain.id)}
                    >
                      <>
                        <span>{domain.iam.displayName}</span>
                        {domain.iam.state && (
                          <OkmsDomainStateBadge state={domain.iam.state} size="sm" />
                        )}
                      </>
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
      {isInvalidOkmsId && <Message color="warning">Domain {okmsId} not found</Message>}
    </div>
  );
};
