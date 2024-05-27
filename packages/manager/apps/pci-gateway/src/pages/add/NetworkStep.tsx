import { StepComponent, useNotifications } from '@ovhcloud/manager-components';
import { useTranslation } from 'react-i18next';
import {
  OsdsButton,
  OsdsFormField,
  OsdsInput,
  OsdsMessage,
  OsdsSelect,
  OsdsSelectOption,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { useEffect, useState } from 'react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_INPUT_TYPE,
  ODS_MESSAGE_TYPE,
  ODS_SPINNER_SIZE,
} from '@ovhcloud/ods-components';
import { useNavigate } from 'react-router-dom';
import { StepsEnum, useNewGatewayStore } from '@/pages/add/useStore';
import { useSubnets } from '@/api/hooks/useSubnets';
import {
  useCreateNetworkWithGateway,
  usePrivateNetworks,
} from '@/api/hooks/useNetworks';
import { useCreateGateway } from '@/api/hooks/useGateways';
import { SubnetModal } from '@/pages/add/SubnetModal';
import { getAutoGeneratedName } from '@/pages/add/util';
import { checkOperation, TOperation } from '@/api/data/operation';
import queryClient from '@/queryClient';

export const AVAILABLE_SUBNET = [
  '192.168.0.1/24',
  '10.0.0.1/24',
  '172.16.0.1/24',
];

type IState = {
  projectUrl: string;
  isModalVisible: boolean;
  isOperationPending: boolean;
};

export const NetworkStep = (): JSX.Element => {
  const [state, setState] = useState<IState>({
    projectUrl: '',
    isModalVisible: false,
    isOperationPending: false,
  });

  const [isInputTouched, setIsInputTouched] = useState(false);

  const { addError, addSuccess, clearNotifications } = useNotifications();
  const { t: tAdd } = useTranslation('add');
  const { t: tGlobal } = useTranslation('global');
  const navigate = useNavigate();
  const store = useNewGatewayStore();

  const invalidateGatewaysList = () => {
    queryClient.invalidateQueries({
      queryKey: ['project', store?.project?.id, 'gateway'],
    });
  };

  const { data: privateNetworks } = usePrivateNetworks(
    store.project?.id,
    store.form.regionName,
  );

  const isNextButtonDisabled =
    !store.form.name ||
    !store.form.size ||
    !store.form.regionName ||
    !store.form.network.id ||
    store.project?.isDiscovery;

  // <editor-fold desc="create">
  const {
    createNetworkWithGateway,
    isPending: isCreatingNetworkWithGateway,
  } = useCreateNetworkWithGateway({
    projectId: store.project?.id,
    regionName: store.form.regionName,
    onSuccess: (op: TOperation) => {
      clearNotifications();
      setState((prev) => ({ ...prev, isOperationPending: true }));
      checkOperation({
        projectId: store.project?.id,
        operationId: op.id,
        callback: (operation, iteration) => {
          if (['completed', 'created'].includes(operation.status)) {
            invalidateGatewaysList();
            navigate('..');
            addSuccess(
              tAdd('pci_projects_project_public_gateways_add_success'),
            );
            setState((prev) => ({ ...prev, isOperationPending: false }));
            return true;
          }
          if (
            ['in-error', 'unknown'].includes(operation.status) ||
            iteration === 10
          ) {
            addError(
              tAdd(
                'pci_projects_project_public_gateways_add_modal_add_private_network_error',
                { message: '' },
              ),
            );
            setState((prev) => ({ ...prev, isOperationPending: false }));
            return true;
          }

          return false;
        },
      });
    },
    onError: (error) => {
      addError(
        tAdd(
          'pci_projects_project_public_gateways_add_modal_add_private_network_error',
          { message: error },
        ),
      );
    },
  });

  const { createGateway, isPending: isCreatingGateway } = useCreateGateway({
    projectId: store.project?.id,
    regionName: store.form.regionName,
    networkId: store.form.network.id,
    subnetId: store.form.network.subnetId,
    onSuccess: (op: TOperation) => {
      clearNotifications();
      setState((prev) => ({ ...prev, isOperationPending: true }));
      checkOperation({
        projectId: store.project?.id,
        operationId: op.id,
        callback: (operation, iteration) => {
          if (['completed', 'created'].includes(operation.status)) {
            invalidateGatewaysList();
            navigate('..');
            addSuccess(
              tAdd('pci_projects_project_public_gateways_add_success'),
            );
            setState((prev) => ({ ...prev, isOperationPending: false }));
            return true;
          }
          if (
            ['in-error', 'unknown'].includes(operation.status) ||
            iteration === 10
          ) {
            addError(
              tAdd('pci_projects_project_public_gateways_add_error', {
                message: '',
              }),
            );
            setState((prev) => ({ ...prev, isOperationPending: false }));
            return true;
          }

          return false;
        },
      });
    },
    onError: (error) => {
      addError(
        tAdd('pci_projects_project_public_gateways_add_error', {
          message: error,
        }),
      );
    },
  });

  const create = async () => {
    store.updateStep.lock(StepsEnum.NETWORK);
    if (store.form.network.id === 'new') {
      // create network with the gateway
      const newNetwork = {
        gateway: {
          name: store.form.name,
          model: store.form.size,
        },
        name: store.form.newNetwork.name,
        subnet: {
          cidr: store.form.newNetwork.subnet,
          ipVersion: 4,
          enableDhcp: true,
          enableGatewayIp: true,
        },
      };

      createNetworkWithGateway(newNetwork);
    } else {
      // create gateway
      const newGateway = {
        name: store.form.name,
        model: store.form.size,
      };

      createGateway(newGateway);
    }
  };

  const isCreating =
    isCreatingGateway ||
    isCreatingNetworkWithGateway ||
    isCreatingGateway ||
    state.isOperationPending;
  // </editor-fold>

  const { data: subnets, isPending: isSubnetsLoading } = useSubnets(
    store.project?.id,
    store.form.regionName,
    store.form.network.id,
  );

  useEffect(() => {
    const subnetId =
      !isSubnetsLoading && subnets.length > 0 ? subnets[0].id : undefined;

    store.updateForm.network(store.form.network.id, subnetId);
  }, [isSubnetsLoading]);

  // Init gateway name randomly on region change
  useEffect(() => {
    store.updateForm.name(
      getAutoGeneratedName(`gateway-${store.form.regionName?.toLowerCase()}`),
    );
  }, [store.form.regionName]);

  return (
    <StepComponent
      id={StepsEnum.NETWORK}
      order={3}
      isOpen={store.steps.get(StepsEnum.NETWORK).isOpen}
      isChecked={store.steps.get(StepsEnum.NETWORK).isChecked}
      isLocked={store.steps.get(StepsEnum.NETWORK).isLocked}
      title={tAdd(
        'pci_projects_project_public_gateways_add_attach_private_network_to_public_gateway_sub_title',
      )}
    >
      <p>
        <OsdsText
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          size={ODS_THEME_TYPOGRAPHY_SIZE._400}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {tAdd(
            'pci_projects_project_public_gateways_add_attach_private_network_to_public_gateway_intro1',
          )}
        </OsdsText>
      </p>
      <p>
        <OsdsText
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          size={ODS_THEME_TYPOGRAPHY_SIZE._400}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {tAdd(
            'pci_projects_project_public_gateways_add_attach_private_network_to_public_gateway_intro2',
          )}
        </OsdsText>
      </p>
      <OsdsMessage
        type={ODS_MESSAGE_TYPE.warning}
        color={ODS_THEME_COLOR_INTENT.warning}
        className={'my-6 flex-row'}
      >
        {tAdd(
          'pci_projects_project_public_gateways_add_no_private_network_warning',
        )}
      </OsdsMessage>
      <OsdsFormField
        inline={true}
        error={
          isInputTouched && !store.form.name
            ? tGlobal('common_field_error_required')
            : ''
        }
      >
        <OsdsText
          slot="label"
          color={ODS_THEME_COLOR_INTENT.text}
          className="mt-4"
        >
          {tAdd(
            'pci_projects_project_public_gateways_add_modal_add_public_gateway_field_label',
          )}
        </OsdsText>
        <OsdsInput
          value={store.form.name}
          inline
          color={ODS_THEME_COLOR_INTENT.primary}
          onOdsValueChange={(e) => {
            setIsInputTouched(true);
            store.updateForm.name(`${e.detail.value}`);
          }}
          type={ODS_INPUT_TYPE.text}
          error={isInputTouched && !store.form.name}
          className="border"
        />
      </OsdsFormField>
      <br />
      <div className="flex">
        <div className="pr-4 min-w-64">
          <OsdsFormField inline={true} className="w-full">
            <OsdsText
              slot="label"
              color={ODS_THEME_COLOR_INTENT.text}
              className="mt-4"
            >
              {tAdd(
                'pci_projects_project_public_gateways_add_select_private_network',
              )}
            </OsdsText>
            <OsdsSelect
              value={store.form.network.id}
              inline={true}
              onOdsValueChange={(event) => {
                store.updateForm.network(
                  event.detail.value as string,
                  store.form.network.subnetId,
                );
              }}
            >
              <OsdsText
                level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                size={ODS_THEME_TYPOGRAPHY_SIZE._400}
                color={ODS_THEME_COLOR_INTENT.text}
                slot="placeholder"
              >
                {tAdd(
                  'pci_projects_project_public_gateways_add_select_private_network',
                )}
              </OsdsText>
              {store.form.newNetwork.name && store.form.newNetwork.subnet && (
                <OsdsSelectOption key={'new'} value={'new'}>
                  {store.form.newNetwork.name}
                </OsdsSelectOption>
              )}
              {privateNetworks ? (
                privateNetworks
                  .filter((network) => network.name !== '')
                  .map((network) => (
                    <OsdsSelectOption key={network.id} value={network.id}>
                      {network.name}
                    </OsdsSelectOption>
                  ))
              ) : (
                <></>
              )}
            </OsdsSelect>
          </OsdsFormField>
        </div>
        <div className="pl-4 flex flex-col justify-end">
          <OsdsButton
            size={ODS_BUTTON_SIZE.sm}
            inline={true}
            variant={ODS_BUTTON_VARIANT.stroked}
            color={ODS_THEME_COLOR_INTENT.primary}
            onClick={() => {
              setState({
                ...state,
                isModalVisible: true,
              });
            }}
          >
            {tAdd(
              'pci_projects_project_public_gateways_add_private_network_add_action',
            )}
          </OsdsButton>
        </div>
      </div>

      <br />
      {!isCreating ? (
        <OsdsButton
          size={ODS_BUTTON_SIZE.md}
          inline={true}
          variant={ODS_BUTTON_VARIANT.flat}
          color={ODS_THEME_COLOR_INTENT.primary}
          {...(isNextButtonDisabled ? { disabled: true } : {})}
          onClick={() => create()}
        >
          {tAdd('pci_projects_project_public_gateways_add_submit_label')}
        </OsdsButton>
      ) : (
        <p>
          <OsdsSpinner inline={true} size={ODS_SPINNER_SIZE.md} />
          <OsdsText
            level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
            size={ODS_THEME_TYPOGRAPHY_SIZE._400}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {tAdd(
              'pci_projects_project_public_gateways_add_creating_wait_message',
            )}
          </OsdsText>
        </p>
      )}

      {state.isModalVisible && (
        <SubnetModal
          onClose={() =>
            setState({
              ...state,
              isModalVisible: false,
            })
          }
        />
      )}
    </StepComponent>
  );
};
