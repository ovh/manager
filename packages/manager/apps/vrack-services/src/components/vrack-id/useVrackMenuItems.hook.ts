import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import type { VrackServicesWithIAM } from '@ovh-ux/manager-network-common';
import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import type { TrackingClickParams } from '@ovh-ux/manager-react-shell-client';

import { urls } from '@/routes/RoutesAndUrl.constants';
import { TRANSLATION_NAMESPACES } from '@/utils/constants';
import { isEditable } from '@/utils/vrack-services';

export type UseVrackMenuItemsParams = {
  vs: VrackServicesWithIAM;
  isListing?: boolean;
};

type MenuItem = {
  id: number;
  label: string;
  href?: string;
  target?: string;
  isDisabled?: boolean;
  onClick?: () => void;
};

type NavigationTargetType = 'associateVrack' | 'associateAnotherVrack' | 'dissociateVrack';

const createDefaultTrackClickParams = (
  isListing: boolean | undefined,
  trackingAction:
    | 'associate_vrack-services'
    | 'associate-another_vrack-services'
    | 'dissociate_vrack-services',
): TrackingClickParams => ({
  location: isListing ? PageLocation.datagrid : PageLocation.tile,
  buttonType: ButtonType.button,
  actionType: 'navigation',
  actions: [trackingAction],
});

const createNavigationTarget = (
  targetType: NavigationTargetType,
  isListing: boolean | undefined,
  serviceId: string,
  vrackId?: string,
) => {
  const targetUrl: { [keys in NavigationTargetType]: string } = {
    associateVrack: (isListing ? urls.listingAssociate : urls.overviewAssociate).replace(
      ':id',
      serviceId,
    ),
    associateAnotherVrack: (isListing
      ? urls.listingAssociateAnother
      : urls.overviewAssociateAnother
    )
      .replace(':id', serviceId)
      .replace(':vrackId', vrackId ?? ''),
    dissociateVrack: (isListing ? urls.listingDissociate : urls.overviewDissociate)
      .replace(':id', serviceId)
      .replace(':vrackId', vrackId ?? ''),
  };
  return targetUrl[targetType];
};

export const useVrackMenuItems = ({ vs, isListing }: UseVrackMenuItemsParams): MenuItem[] => {
  const { t } = useTranslation(TRANSLATION_NAMESPACES.common);
  const { trackClick } = useOvhTracking();
  const editable = isEditable(vs);
  const navigate = useNavigate();
  const isDisabled = !editable;
  const vrackId = vs?.currentState?.vrackId;

  const items: (MenuItem | false)[] = [
    !vrackId
      ? {
          id: 4,
          label: t('associateVrackButtonLabel'),
          isDisabled,
          onClick: () => {
            trackClick(createDefaultTrackClickParams(isListing, 'associate_vrack-services'));
            navigate(createNavigationTarget('associateVrack', isListing, vs.id));
          },
        }
      : false,
    vrackId
      ? {
          id: 5,
          label: t('vrackActionAssociateToAnother'),
          isDisabled,
          onClick: () => {
            trackClick(
              createDefaultTrackClickParams(isListing, 'associate-another_vrack-services'),
            );
            navigate(createNavigationTarget('associateAnotherVrack', isListing, vs.id, vrackId));
          },
        }
      : false,
    vrackId
      ? {
          id: 6,
          label: t('vrackActionDissociate'),
          isDisabled,
          onClick: () => {
            trackClick(createDefaultTrackClickParams(isListing, 'dissociate_vrack-services'));
            navigate(createNavigationTarget('dissociateVrack', isListing, vs.id, vrackId));
          },
        }
      : false,
  ];
  return items.filter((item): item is MenuItem => Boolean(item));
};
