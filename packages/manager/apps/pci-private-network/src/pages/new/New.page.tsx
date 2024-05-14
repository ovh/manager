import {
  isDiscoveryProject,
  Notifications,
  PciDiscoveryBanner,
  useNotifications,
  useProject,
} from '@ovhcloud/manager-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import {
  OsdsBreadcrumb,
  OsdsIcon,
  OsdsLink,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { useEffect, useState } from 'react';

import { ApiError } from '@ovh-ux/manager-core-api';
import { useNavigation } from '@ovh-ux/manager-react-shell-client';
import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components';
import { useMutation } from '@tanstack/react-query';
import { Translation, useTranslation } from 'react-i18next';
import { useHref, useNavigate, useParams } from 'react-router-dom';
import {
  associateGatewayToNetworkCall,
  createNetwork,
  enableSnatOnGatewayCall,
} from '@/api/data/network';
import { TGateway } from '@/api/data/regions';
import { TSubnet } from '@/api/data/subnets';
import { useProjectAvailableRegions } from '@/api/hooks/useRegions';
import { DEFAULT_CIDR, DEFAULT_IP, DEFAULT_VLAN_ID } from '@/constants';
import ConfigurationStep from './steps/ConfigurationStep';
import GatewaySummaryStep from './steps/GatewaySummaryStep';
import LocalizationStep, { TMappedRegion } from './steps/LocalizationStep';

export type TFormState = {
  privateNetworkName: string;
  region: TMappedRegion;
  createGateway: boolean;
  gateway?: TGateway;
  gatewayName?: string;
  gatewaySize?: string;
  configureVlanId: boolean;
  vlanId: number;
  dhcp: boolean;
  enableGatewayIp: boolean;
  address: string;
  cidr: number;
  enableSNAT: boolean;
};

export const DEFAULT_FORM_STATE: TFormState = {
  privateNetworkName: '',
  region: undefined,
  createGateway: false,
  gateway: undefined,
  gatewayName: undefined,
  gatewaySize: undefined,
  configureVlanId: false,
  vlanId: DEFAULT_VLAN_ID,
  dhcp: true,
  enableGatewayIp: true,
  address: DEFAULT_IP.replace('{vlanId}', `${DEFAULT_VLAN_ID}`),
  cidr: DEFAULT_CIDR,
  enableSNAT: false,
};

const DEFAULT_STEP_STATE = {
  isOpen: false,
  isLocked: false,
  isChecked: false,
};

export default function NewPage() {
  const { t } = useTranslation('common');
  const { t: tListing } = useTranslation('listing');
  const { t: tNew } = useTranslation('new');

  const [formState, setFormState] = useState<TFormState>(DEFAULT_FORM_STATE);
  const [localizationStep, setLocalizationStep] = useState({
    ...DEFAULT_STEP_STATE,
    isOpen: true,
  });
  const [configurationStep, setConfigurationStep] = useState(
    DEFAULT_STEP_STATE,
  );
  const [summaryStep, setSummaryStep] = useState(DEFAULT_STEP_STATE);
  const [projectUrl, setProjectUrl] = useState('');

  const navigation = useNavigation();
  const { projectId } = useParams();
  const { addError, addSuccess } = useNotifications();
  const backLink = useHref('..');

  const navigate = useNavigate();

  const { data: project } = useProject(projectId || '');
  const { data: regions, isLoading } = useProjectAvailableRegions(projectId);

  useEffect(() => {
    navigation
      .getURL('public-cloud', `#/pci/projects/${projectId}`, {})
      .then((data) => {
        setProjectUrl(data as string);
      });
  }, [projectId, navigation]);

  /**
   * Associate à Gateway to Network when the network creation option is checked
   * @param subnet
   * @returns
   */
  const associateNetworkToGateway = (subnet: TSubnet) => {
    if (formState.createGateway && formState.gateway) {
      return associateGatewayToNetworkCall(
        projectId,
        formState.region?.code,
        formState.gateway.id,
        subnet.id,
      );
    }
    return Promise.resolve();
  };

  /**
   * Enable SNAT on Gateway when the SNAT option is checked
   * @returns
   */
  const enableSnatPromise = async () => {
    if (
      formState.createGateway &&
      formState.gateway &&
      !formState.gateway.externalInformation &&
      formState.enableSNAT
    ) {
      return enableSnatOnGatewayCall(
        projectId,
        formState.region.code,
        formState.gateway.id,
      );
    }

    return Promise.resolve();
  };

  const createPrivateNetwork = async () => {
    let gateway;
    let vlanId;

    if (formState.createGateway && !formState.gateway) {
      gateway = {
        name: formState.gatewayName,
        model: formState.gatewaySize,
      };
    }

    if (formState.configureVlanId && !formState.region?.isLocalZone) {
      vlanId = formState.vlanId;
    }

    const createNetworkPromise = createNetwork({
      projectId,
      region: formState.region.code,
      privateNetworkName: formState.privateNetworkName,
      subnet: {
        cidr: `${formState.address}/${formState.cidr}`,
        ipVersion: 4,
        enableDhcp: formState.dhcp,
        enableGatewayIp: formState.enableGatewayIp,
      },
      vlanId,
      gateway,
    });

    const [subnetResponse] = await Promise.all([
      createNetworkPromise,
      enableSnatPromise,
    ]);

    return associateNetworkToGateway(subnetResponse[0]);
  };

  /**
   * Complete mutation creation
   */
  const { isPending, mutate: handleNetworkCreation } = useMutation({
    mutationFn: () => createPrivateNetwork(),
    onSuccess: () => {
      addSuccess(
        <Translation ns="new">
          {(translate) => (
            <span
              dangerouslySetInnerHTML={{
                __html: translate(
                  'pci_projects_project_network_private_create_success',
                ),
              }}
            />
          )}
        </Translation>,
        true,
      );
      navigate('..');
    },
    onError: (error: ApiError) =>
      addError(
        <Translation ns="new">
          {(translate) => (
            <span
              dangerouslySetInnerHTML={{
                __html: translate(
                  'pci_projects_project_network_private_create_error',
                  {
                    message: error?.message,
                  },
                ),
              }}
            />
          )}
        </Translation>,
        true,
      ),
  });

  /**
   * Handle next functions
   */
  const handleLocalizationStepNext = () => {
    setLocalizationStep((prevState) => ({
      ...prevState,
      isChecked: true,
    }));

    setConfigurationStep((prevState) => ({
      ...prevState,
      isOpen: true,
    }));
  };

  const handleConfigurationStepNext = () => {
    if (formState.createGateway) {
      setConfigurationStep((prevState) => ({
        ...prevState,
        isChecked: true,
        isLocked: true,
      }));

      setSummaryStep((prevState) => ({
        ...prevState,
        isOpen: true,
      }));
    } else {
      handleNetworkCreation();
    }
  };

  const handleSummaryStepNext = () => {
    handleNetworkCreation();
  };

  /**
   * Handle edit functions
   */
  const handleLocalizationStepEdit = () => {
    setLocalizationStep((prevState) => ({
      ...prevState,
      isOpen: true,
      isChecked: false,
    }));

    setConfigurationStep((prevState) => ({
      ...prevState,
      isOpen: false,
      isChecked: false,
      isLocked: false,
    }));

    setSummaryStep((prevState) => ({
      ...prevState,
      isOpen: false,
    }));

    setFormState((prevState) => ({
      ...prevState,
      createGateway: false,
    }));
  };

  const handleConfigurationStepEdit = () => {
    setConfigurationStep((prevState) => ({
      ...prevState,
      isOpen: true,
      isChecked: false,
      isLocked: false,
    }));

    setSummaryStep((prevState) => ({
      ...prevState,
      isOpen: false,
    }));
  };

  return (
    <>
      {project && (
        <OsdsBreadcrumb
          items={[
            {
              href: projectUrl,
              label: project.description,
            },
            {
              href: `${projectUrl}/private-networks`,
              label: tListing('pci_projects_project_network_private'),
            },
            {
              label: tNew('pci_projects_project_network_private_create'),
            },
          ]}
        />
      )}
      <div className="header mb-10 mt-8">
        <OsdsLink
          color={ODS_THEME_COLOR_INTENT.primary}
          className="mt-10"
          href={backLink}
        >
          <OsdsIcon
            slot="start"
            name={ODS_ICON_NAME.ARROW_LEFT}
            size={ODS_ICON_SIZE.xs}
            color={ODS_THEME_COLOR_INTENT.primary}
          ></OsdsIcon>
          <span className="ml-4">
            {t('common_back_button_back_to_previous_page')}
          </span>
        </OsdsLink>
        <div className="mt-[20px]">
          <OsdsText
            level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
            size={ODS_THEME_TYPOGRAPHY_SIZE._600}
            color={ODS_THEME_COLOR_INTENT.primary}
          >
            {tNew('Créer un réseau privé')}
          </OsdsText>

          <Notifications />
        </div>
      </div>

      <div className="mb-5">
        {isDiscoveryProject(project) && (
          <PciDiscoveryBanner projectId={projectId} />
        )}
      </div>

      <div className="flex flex-col gap-4 mb-10">
        <LocalizationStep
          regions={regions}
          isOpen={localizationStep.isOpen}
          isChecked={localizationStep.isChecked}
          onNext={handleLocalizationStepNext}
          onEdit={handleLocalizationStepEdit}
          formState={formState}
          setFormState={setFormState}
          isLoading={isLoading}
        />

        <ConfigurationStep
          regions={regions}
          isOpen={configurationStep.isOpen}
          isChecked={configurationStep.isChecked}
          isLocked={configurationStep.isLocked}
          onNext={handleConfigurationStepNext}
          onEdit={handleConfigurationStepEdit}
          formState={formState}
          setFormState={setFormState}
          isLoading={isPending}
        />

        {formState.createGateway && (
          <GatewaySummaryStep
            isOpen={summaryStep.isOpen}
            onNext={handleSummaryStepNext}
            formState={formState}
            setFormState={setFormState}
            isLoading={isPending}
          />
        )}
      </div>
    </>
  );
}
