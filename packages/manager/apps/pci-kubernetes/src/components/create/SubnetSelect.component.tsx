import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { Links, LinkType } from '@ovhcloud/manager-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import {
  ODS_MESSAGE_TYPE,
  ODS_SELECT_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsFormField,
  OsdsMessage,
  OsdsSelect,
  OsdsSelectOption,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { LOAD_BALANCER_DOC, SUBNET_DOC } from '@/constants';
import { TPrivateNetworkSubnet } from '@/api/data/subnets';
import { TFormState } from './NetworkClusterStep.component';

export type SubnetSelectProps = {
  formState: TFormState;
  setFormState: (formState) => void;
  subnets: TPrivateNetworkSubnet[];
  isLoading: boolean;
  error: Error;
};

export default function SubnetSelect({
  formState,
  setFormState,
  subnets,
  isLoading,
  error,
}: Readonly<SubnetSelectProps>) {
  const { t } = useTranslation('network-add');

  const context = useContext(ShellContext);
  const { ovhSubsidiary } = context.environment.getUser();

  const subnetDocumentationLink =
    SUBNET_DOC[ovhSubsidiary] ?? SUBNET_DOC.DEFAULT;
  const loadBalancerDocumentationLink =
    LOAD_BALANCER_DOC[ovhSubsidiary] ?? LOAD_BALANCER_DOC.DEFAULT;

  const onPrivateNetworkSubnetChanged = (event) => {
    const subnetId = `${event.detail.value}`;

    setFormState((prev) => ({
      ...prev,
      subnet: subnets.find((subnet) => subnet.id === subnetId),
    }));
  };

  const hasSubnetError = !isLoading && error;
  const shouldWarnSubnet =
    !isLoading && Boolean(formState.subnet) && !formState.subnet.gatewayIp;

  return (
    <div>
      <OsdsText
        color={ODS_THEME_COLOR_INTENT.text}
        level={ODS_TEXT_LEVEL.heading}
        size={ODS_TEXT_SIZE._400}
        className="block mb-5"
      >
        {t('kubernetes_network_form_subnet')}
      </OsdsText>
      <div className="mb-2">
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.text}
          level={ODS_TEXT_LEVEL.body}
          size={ODS_TEXT_SIZE._400}
        >
          {t('kubernetes_network_form_subnet_description')}
        </OsdsText>
        <Links
          href={subnetDocumentationLink}
          type={LinkType.external}
          label={t('kubernetes_network_form_subnet_link')}
        />
      </div>
      <OsdsFormField
        inline
        className="mb-5 w-full"
        data-ng-attr-label={t('kubernetes_network_form_subnet')}
      >
        <OsdsSelect
          name="subnet"
          size={ODS_SELECT_SIZE.md}
          value={formState.subnet?.id}
          onOdsValueChange={onPrivateNetworkSubnetChanged}
        >
          {subnets?.map((subnet) => (
            <OsdsSelectOption value={subnet.id} key={subnet.id}>
              {subnet.displayedLabel}
            </OsdsSelectOption>
          ))}
        </OsdsSelect>
      </OsdsFormField>

      {hasSubnetError && (
        <OsdsMessage
          type={ODS_MESSAGE_TYPE.error}
          color={ODS_THEME_COLOR_INTENT.error}
          className="my-6"
        >
          {t('kubernetes_network_form_subnet_error_default', {
            error: error.message,
          })}
        </OsdsMessage>
      )}

      {shouldWarnSubnet && (
        <OsdsMessage
          type={ODS_MESSAGE_TYPE.warning}
          color={ODS_THEME_COLOR_INTENT.warning}
          className="my-6"
        >
          <div>
            <OsdsText
              level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
              size={ODS_THEME_TYPOGRAPHY_SIZE._400}
              color={ODS_THEME_COLOR_INTENT.text}
              className="block"
            >
              {t('kubernetes_network_form_subnet_error_no_gateway_ip_p1')}
            </OsdsText>
            <OsdsText
              level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
              size={ODS_THEME_TYPOGRAPHY_SIZE._400}
              color={ODS_THEME_COLOR_INTENT.text}
              className="block"
            >
              {t('kubernetes_network_form_subnet_error_no_gateway_ip_p2')}

              <Links
                href={loadBalancerDocumentationLink}
                type={LinkType.external}
                label={t(
                  'kubernetes_network_form_subnet_error_no_gateway_ip_link',
                )}
              />
            </OsdsText>
          </div>
        </OsdsMessage>
      )}
    </div>
  );
}
