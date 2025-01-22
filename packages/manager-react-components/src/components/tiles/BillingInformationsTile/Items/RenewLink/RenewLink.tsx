import '../../translations';
import React, { useMemo } from 'react';
import { OdsBadgeColor } from '@ovhcloud/ods-components';
import { OdsText, OdsBadge, OdsSkeleton } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { ManagerTile } from '../../../../content/ManagerTile/manager-tile.component';
import { useBillingInformationContextServiceDetails } from '../../BillingInformationsContext';
import BillingDetails from '../../BillingDetails.class';
import { DateFormat, useFormattedDate } from '../../../../../hooks';
import { Links, LinkType } from '../../../../typography';

export type ServiceRenewStateBadgeProps = Omit<
  React.ComponentProps<typeof OdsBadge>,
  'color' | 'label'
>;

export const BillingInformationsState = () => {
  const { t } = useTranslation('billing-informations-tile');
  const [contactUrl, setContactUrl] = useState('');
  const {
    shell: { navigation },
  } = useContext(ShellContext);
  useEffect(() => {
    const fetchUrl = async () => {
      try {
        const response = await navigation.getURL(
          'dedicated',
          '#/contacts/services',
          {},
        );
        setContactUrl(response as string);
      } catch (error) {
        setContactUrl('#');
      }
    };
    fetchUrl();
  }, [navigation]);

  return (
    <ManagerTile.Item>
      <ManagerTile.Item.Label>
        {t('billing_informations_tile_field_label_state')}
      </ManagerTile.Item.Label>
      <ManagerTile.Item.Description>
        <div className="flex flex-col gap-2">
          <ServiceEngagementState />
          <Links
            label={t('billing_informations_tile_change_renew_link')}
            href={contactUrl}
            type={LinkType.next}
          />
        </div>
      </ManagerTile.Item.Description>
    </ManagerTile.Item>
  );
};
