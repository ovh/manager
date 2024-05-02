import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { OsdsText } from '@ovhcloud/ods-components/react';
import {
  StepComponent,
  TileInputComponent,
} from '@ovhcloud/manager-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { useCatalog } from '@/api/hooks/useCatalog';
import { StepsEnum, useNewGatewayStore } from '@/pages/add/useStore';

type TSizeItem = {
  payload: string;
  label: string;
  bandwidth: string;
  price: string;
};

export const SizeStep = (): JSX.Element => {
  const [state, setState] = useState<{ item: TSizeItem; items: TSizeItem[] }>({
    item: null,
    items: [],
  });

  const store = useNewGatewayStore();

  const { data: catalog } = useCatalog();

  const { t: tSelector } = useTranslation('catalog-selector');
  const { t: tAdd } = useTranslation('add');

  useEffect(() => {
    if (catalog) {
      const gatewayAddons = catalog.addons.filter((addon) =>
        addon.product.startsWith('publiccloud-gateway'),
      );

      const items: TSizeItem[] = Array.from(
        new Set(gatewayAddons.map((addon) => addon.product)),
      )
        .map((product) => {
          const addons = catalog.addons.filter(
            (addon) => addon.product === product,
          );

          return {
            payload: product,
            label: tSelector(
              `pci_projects_project_gateways_model_selector_catalog_${product}_size`,
            ),
            bandwidth: ((bandwidthLevel: number) => {
              return bandwidthLevel > 1000
                ? bandwidthLevel / 1000 +
                    tSelector(
                      'pci_projects_project_gateways_model_selector_bandwidth_unit_size_gbps',
                    )
                : bandwidthLevel +
                    tSelector(
                      'pci_projects_project_gateways_model_selector_bandwidth_unit_size_mbps',
                    );
            })(addons[1].blobs.technical.bandwidth.level),
            price: '',
          };
        })
        .reverse();

      setState({ ...state, items });
    }
  }, [catalog]);

  return (
    <StepComponent
      id={StepsEnum.SIZE}
      order={1}
      isOpen={store.steps.get(StepsEnum.SIZE).isOpen}
      isChecked={store.steps.get(StepsEnum.SIZE).isChecked}
      isLocked={store.steps.get(StepsEnum.SIZE).isLocked}
      title={tAdd('pci_projects_project_public_gateways_add_size_sub_title')}
      subtitle={
        <OsdsText
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          size={ODS_THEME_TYPOGRAPHY_SIZE._400}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {tAdd('pci_projects_project_public_gateways_add_size_info')}
        </OsdsText>
      }
      next={{
        action: store.form.size
          ? (id) => {
              store.updateStep.check(id as StepsEnum);
              store.updateStep.lock(id as StepsEnum);
              store.updateStep.open(StepsEnum.LOCATION);
            }
          : undefined,
        label: 'Next',
      }}
      edit={{
        action: (id) => {
          store.updateStep.open(id as StepsEnum);
        },
        label: 'Edit this step',
      }}
    >
      <TileInputComponent<TSizeItem, string, string>
        value={state.item}
        items={state.items}
        label={(item: TSizeItem) => (
          <div className="grid grid-cols-1 gap-2 text-left text w-full">
            <div className="">
              <OsdsText
                level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                size={ODS_THEME_TYPOGRAPHY_SIZE._400}
                color={ODS_THEME_COLOR_INTENT.text}
              >
                {item.label}
              </OsdsText>
            </div>
            <hr className="w-full border-solid border-0 border-b border-b-[#85d9fd]" />
            <div className="text-sm">
              <OsdsText
                level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                size={ODS_THEME_TYPOGRAPHY_SIZE._200}
                color={ODS_THEME_COLOR_INTENT.text}
              >
                {tSelector(
                  `pci_projects_project_gateways_model_selector_bandwidth`,
                  { bandwidth: item.bandwidth },
                )}
              </OsdsText>
            </div>
          </div>
        )}
        onInput={(item) => {
          setState({ ...state, item });
          store.updateForm.size(item.payload.split('-').pop());
        }}
      />
    </StepComponent>
  );
};
