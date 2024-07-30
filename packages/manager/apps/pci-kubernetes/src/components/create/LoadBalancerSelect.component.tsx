import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { Links, LinkType } from '@ovhcloud/manager-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import {
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_MESSAGE_TYPE,
  ODS_SELECT_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsFormField,
  OsdsIcon,
  OsdsMessage,
  OsdsSelect,
  OsdsSelectOption,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LOAD_BALANCER_DOC } from '@/constants';
import { TPrivateNetworkSubnet } from '@/api/data/subnets';
import { TFormState } from './NetworkClusterStep.component';

export type LoadBalancerSelectProps = {
  formState: TFormState;
  setFormState: (formState) => void;
  subnets: TPrivateNetworkSubnet[];
  isLoading: boolean;
};

export default function LoadBalancerSelect({
  formState,
  setFormState,
  subnets,
  isLoading,
}: Readonly<LoadBalancerSelectProps>) {
  const { t } = useTranslation('network-add');

  const defaultSubnet = {
    id: null,
    displayedLabel: t('kubernetes_network_form_subnet_none'),
  } as TPrivateNetworkSubnet;

  const context = useContext(ShellContext);
  const { ovhSubsidiary } = context.environment.getUser();

  const loadBalancerDocumentationLink =
    LOAD_BALANCER_DOC[ovhSubsidiary] ?? LOAD_BALANCER_DOC.DEFAULT;

  const onLoadBalancerChanged = (event) => {
    const subnetId = event.detail.value?.toString();

    setFormState((prev) => ({
      ...prev,
      loadBalancersSubnet: subnets.find((subnet) => subnet.id === subnetId),
    }));
  };

  const shouldWarnLoadBalancerSubnet =
    !isLoading &&
    Boolean(formState.subnet?.gatewayIp) &&
    Boolean(formState.loadBalancersSubnet?.id) &&
    !formState.loadBalancersSubnet?.gatewayIp;

  const [isLoadBalancersSubnetShown, setIsLoadBalancersSubnetShown] = useState(
    false,
  );

  const toggleLoadBalancersSubnet = () => {
    setIsLoadBalancersSubnetShown(!isLoadBalancersSubnetShown);
  };

  return (
    <div>
      <OsdsText
        color={ODS_THEME_COLOR_INTENT.text}
        level={ODS_TEXT_LEVEL.heading}
        size={ODS_TEXT_SIZE._400}
        className="block my-8 flex items-center"
        onClick={toggleLoadBalancersSubnet}
      >
        <>
          {t('kubernetes_network_form_load_balancers_subnet_toggler')}
          <OsdsIcon
            name={
              isLoadBalancersSubnetShown
                ? ODS_ICON_NAME.CHEVRON_UP
                : ODS_ICON_NAME.CHEVRON_DOWN
            }
            color={ODS_THEME_COLOR_INTENT.primary}
            size={ODS_ICON_SIZE.sm}
            aria-hidden="true"
            className="ml-4"
          />
        </>
      </OsdsText>

      {isLoadBalancersSubnetShown && (
        <div className="mb-2">
          <OsdsText
            color={ODS_THEME_COLOR_INTENT.text}
            level={ODS_TEXT_LEVEL.heading}
            size={ODS_TEXT_SIZE._300}
            className="block mb-5"
          >
            {t('kubernetes_network_form_load_balancers_subnet')}
          </OsdsText>
          <OsdsText
            level={ODS_TEXT_LEVEL.body}
            size={ODS_TEXT_SIZE._400}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {t('kubernetes_network_form_load_balancers_subnet_description')}
          </OsdsText>

          <OsdsFormField
            inline
            className="mb-5 w-full"
            data-ng-attr-label={t(
              'kubernetes_network_form_load_balancers_subnet',
            )}
          >
            <OsdsSelect
              name="loadBalancersSubnet"
              value={formState.loadBalancersSubnet?.id}
              size={ODS_SELECT_SIZE.md}
              onOdsValueChange={onLoadBalancerChanged}
            >
              <OsdsSelectOption value={defaultSubnet.id}>
                {defaultSubnet.displayedLabel}
              </OsdsSelectOption>
              {subnets?.map((subnet) => (
                <OsdsSelectOption value={subnet.id} key={subnet.id}>
                  {subnet.displayedLabel}
                </OsdsSelectOption>
              ))}
            </OsdsSelect>
          </OsdsFormField>

          {shouldWarnLoadBalancerSubnet && (
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
      )}
    </div>
  );
}
