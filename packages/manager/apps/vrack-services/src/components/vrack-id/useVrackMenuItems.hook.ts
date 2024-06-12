import { useTranslation } from 'react-i18next';
import { ActionMenuItem } from '@ovhcloud/manager-components';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { useNavigate } from 'react-router-dom';
import { VrackServicesWithIAM, isEditable } from '@/data';
import { urls } from '@/routes/routes.constants';

export type UseVrackMenuItemsParams = {
  vs: VrackServicesWithIAM;
  isListing?: boolean;
};

export const useVrackMenuItems = ({
  vs,
  isListing,
}: UseVrackMenuItemsParams): ActionMenuItem[] => {
  const { t } = useTranslation('vrack-services');
  const { trackClick } = useOvhTracking();
  const editable = isEditable(vs);
  const navigate = useNavigate();
  const disabled = !editable;
  const vrackId = vs?.currentState?.vrackId;

  return [
    !vrackId && {
      id: 4,
      label: t('associateVrackButtonLabel'),
      disabled,
      onClick: () => {
        trackClick({
          location: isListing ? PageLocation.datagrid : PageLocation.tile,
          buttonType: ButtonType.button,
          actionType: 'navigation',
          actions: ['associate_vrack-services'],
        });
        navigate(
          (isListing ? urls.listingAssociate : urls.overviewAssociate).replace(
            ':id',
            vs.id,
          ),
        );
      },
    },
    vrackId && {
      id: 5,
      label: t('vrackActionAssociateToAnother'),
      disabled,
      onClick: () => {
        trackClick({
          location: isListing ? PageLocation.datagrid : PageLocation.tile,
          buttonType: ButtonType.button,
          actionType: 'navigation',
          actions: ['associate-another_vrack-services'],
        });
        navigate(
          (isListing
            ? urls.listingAssociateAnother
            : urls.overviewAssociateAnother
          )
            .replace(':id', vs.id)
            .replace(':vrackId', vs.currentState.vrackId),
        );
      },
    },
    vrackId && {
      id: 6,
      label: t('vrackActionDissociate'),
      disabled,
      onClick: () => {
        trackClick({
          location: isListing ? PageLocation.datagrid : PageLocation.tile,
          buttonType: ButtonType.button,
          actionType: 'navigation',
          actions: ['dissociate_vrack-services'],
        });
        navigate(
          (isListing ? urls.listingDissociate : urls.overviewDissociate)
            .replace(':id', vs.id)
            .replace(':vrackId', vs.currentState.vrackId),
        );
      },
    },
  ].filter(Boolean);
};
