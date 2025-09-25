import { useNavigate } from 'react-router-dom';
import {
  Clipboard,
  DashboardTile,
  Links,
} from '@ovh-ux/manager-react-components';
import {
  ODS_BADGE_COLOR,
  ODS_BUTTON_COLOR,
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_SPINNER_SIZE,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import {
  OdsBadge,
  OdsButton,
  OdsSkeleton,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { ObservabilityResource } from '@/data/types/response';

interface ServiceInformationTileProps {
  serviceId: string;
  isLoading: boolean;
  data?: ObservabilityResource;
}
const ServiceInformationTile = ({
  serviceId,
  isLoading,
  data,
}: Readonly<ServiceInformationTileProps>): JSX.Element => {
  const navigate = useNavigate();

  const state = data?.currentState;
  const iam = data?.iam;

  let displayNameValue: JSX.Element | null;
  if (isLoading) {
    displayNameValue = <OdsSkeleton />;
  } else if (state) {
    displayNameValue = (
      <div className="flex justify-between items-center gap-2">
        <OdsText preset={ODS_TEXT_PRESET.paragraph} className="break-all">
          {state.displayName}
        </OdsText>
        <div className="min-w-fit">
          <OdsButton
            aria-label="edit"
            size={ODS_BUTTON_SIZE.sm}
            variant={ODS_BUTTON_VARIANT.ghost}
            color={ODS_BUTTON_COLOR.primary}
            onClick={() => {
              navigate('edit-name');
            }}
            icon={ODS_ICON_NAME.pen}
            label=""
          />
        </div>
      </div>
    );
  } else {
    displayNameValue = null;
  }

  const items = [
    {
      id: 'name',
      label: 'Display Name',
      value: displayNameValue,
    },
    {
      id: 'serviceId',
      label: 'Service Name',
      value: <Clipboard className="block w-full" value={serviceId} />,
    },
    {
      id: 'serviceUrnIam',
      label: 'URN (IAM)',
      value: <Clipboard className="block w-full" value={iam?.urn ?? ''} />,
    },
    {
      id: 'serviceIsShared',
      label: 'Shared',
      value: (
        <div className="flex flex-col gap-4">
          <OdsBadge color={ODS_BADGE_COLOR.success} label="Oui"></OdsBadge>
          <Links
            onClickReturn={() => {
              navigate(`/settings/${serviceId}/politiqueIAM`);
            }}
            className="part-link:py-2"
            label="Gérer vos policies"
          />
        </div>
      ),
    },
  ];

  return <DashboardTile title={'Service information'} items={items} />;
};

export default ServiceInformationTile;
