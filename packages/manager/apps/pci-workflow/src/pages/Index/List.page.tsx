import { OsdsButton, OsdsIcon } from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';
import { Outlet, useHref, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { PageComponent } from '@/page.component';

export const ListPage = () => {
  const { t } = useTranslation('common');
  const hrefAdd = useHref(`./new`);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('effect list');
  }, []);

  return (
    <PageComponent breadCrumbItems={[]} title="List page">
      <div className="sm:flex items-center justify-between mt-4">
        <OsdsButton
          size={ODS_BUTTON_SIZE.sm}
          variant={ODS_BUTTON_VARIANT.stroked}
          color={ODS_THEME_COLOR_INTENT.primary}
          className="xs:mb-0.5 sm:mb-0"
          href={hrefAdd}
        >
          <OsdsIcon
            size={ODS_ICON_SIZE.xs}
            name={ODS_ICON_NAME.PLUS}
            className="mr-2"
            color={ODS_THEME_COLOR_INTENT.primary}
          />
          {t('pci_projects_project_public_gateway_create')}
        </OsdsButton>
      </div>
      <ul>
        <li>
          <OsdsButton
            size={ODS_BUTTON_SIZE.sm}
            variant={ODS_BUTTON_VARIANT.stroked}
            color={ODS_THEME_COLOR_INTENT.primary}
            className="xs:mb-0.5 sm:mb-0"
            onClick={() => {
              navigate('1/executions');
            }}
          >
            <OsdsIcon
              size={ODS_ICON_SIZE.xs}
              name={ODS_ICON_NAME.PLUS}
              className="mr-2"
              color={ODS_THEME_COLOR_INTENT.primary}
            />
            Workflow 1
          </OsdsButton>
        </li>
        <li>
          <OsdsButton
            size={ODS_BUTTON_SIZE.sm}
            variant={ODS_BUTTON_VARIANT.stroked}
            color={ODS_THEME_COLOR_INTENT.primary}
            className="xs:mb-0.5 sm:mb-0"
            onClick={() => {
              navigate('delete');
            }}
          >
            <OsdsIcon
              size={ODS_ICON_SIZE.xs}
              name={ODS_ICON_NAME.PLUS}
              className="mr-2"
              color={ODS_THEME_COLOR_INTENT.primary}
            />
            Delete workflow 1
          </OsdsButton>
        </li>
      </ul>
      <Outlet />
    </PageComponent>
  );
};
