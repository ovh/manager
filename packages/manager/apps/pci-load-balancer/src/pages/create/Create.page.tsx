import {
  OsdsBreadcrumb,
  OsdsLink,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  Headers,
  Notifications,
  StepComponent,
  useMe,
  useProjectUrl,
} from '@ovh-ux/manager-react-components';
import { useHref, useParams } from 'react-router-dom';
import { useProject } from '@ovh-ux/manager-pci-common';
import { useTranslation } from 'react-i18next';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import SizeInputComponent from '@/pages/create/SizeInput.component';
import { PRODUCT_LINK } from '@/constants';
import { StepsEnum, useNewLoadBalancerStore } from '@/pages/create/store';

export default function CreatePage(): JSX.Element {
  const projectHref = useProjectUrl('public-cloud');
  const backHref = useHref('..');
  const { projectId } = useParams();
  const { t } = useTranslation('octavia-load-balancer');
  const { t: tCreate } = useTranslation('create');
  const { t: tCommon } = useTranslation('pci-common');
  const { data: project } = useProject();
  const { me } = useMe();
  const store = useNewLoadBalancerStore();

  const productPageLink =
    PRODUCT_LINK[me?.ovhSubsidiary] || PRODUCT_LINK.DEFAULT;

  return (
    <>
      <OsdsBreadcrumb
        items={[
          {
            href: projectHref,
            label: project.description,
          },
          {
            href: backHref,
            label: t('octavia_load_balancers'),
          },
          {
            label: tCreate('octavia_load_balancer_create_title'),
          },
        ]}
      />

      <div className="header mt-8">
        <Headers title={tCreate('octavia_load_balancer_create_title')} />
      </div>

      <Notifications />

      <OsdsText
        size={ODS_TEXT_SIZE._400}
        level={ODS_TEXT_LEVEL.body}
        color={ODS_THEME_COLOR_INTENT.text}
      >
        {tCreate('octavia_load_balancer_create_description')}
      </OsdsText>

      <div className="mt-6">
        <StepComponent
          title={tCreate('octavia_load_balancer_create_size_title')}
          isOpen={store.steps.get(StepsEnum.SIZE).isOpen}
          isChecked={store.steps.get(StepsEnum.SIZE).isChecked}
          isLocked={store.steps.get(StepsEnum.SIZE).isLocked}
          order={1}
          next={{
            action: () => {
              store.check(StepsEnum.SIZE);
              store.lock(StepsEnum.SIZE);

              store.open(StepsEnum.REGION);
            },
            label: tCommon('common_stepper_next_button_label'),
            isDisabled: store.size === null,
          }}
        >
          <OsdsText
            size={ODS_TEXT_SIZE._400}
            level={ODS_TEXT_LEVEL.body}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {tCreate('octavia_load_balancer_create_size_intro')}{' '}
            <OsdsLink
              href={productPageLink}
              color={ODS_THEME_COLOR_INTENT.primary}
            >
              {tCreate('octavia_load_balancer_create_size_intro_link')}
            </OsdsLink>
          </OsdsText>
          <SizeInputComponent value={store.size} onInput={store.set.size} />
        </StepComponent>
        <StepComponent
          title={tCreate('octavia_load_balancer_create_region_title')}
          isOpen={store.steps.get(StepsEnum.REGION).isOpen}
          isChecked={store.steps.get(StepsEnum.REGION).isChecked}
          isLocked={store.steps.get(StepsEnum.REGION).isLocked}
          order={2}
        ></StepComponent>
      </div>
    </>
  );
}
