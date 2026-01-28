import { urls as domainUrls } from "@/domain/routes/routes.constant";
import { useOverridePage } from "@/zone/hooks/overridePage/useOverridePage";
import { NAMESPACES } from "@ovh-ux/manager-common-translations";
import { ActionMenu, Datagrid } from "@ovh-ux/muk";
import { Button, BUTTON_COLOR, BUTTON_SIZE, BUTTON_VARIANT, POPOVER_POSITION } from "@ovhcloud/ods-react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

export default function ZonePage() {
  const { t } = useTranslation(['zone', NAMESPACES.ACTIONS]);
  const navigate = useNavigate();
  const { serviceName } = useParams<{ serviceName: string }>();
  const isOverridedPage = useOverridePage();
  const buildUrl = (baseUrl: string) => {
    return baseUrl.replace(':serviceName', serviceName || '');
  };

  const tabsZone = domainUrls.domainTabZone
  const actionItems = [
    {
      id: 1,
      label: t('zone_page_add_entry'),
      onClick: () => navigate(buildUrl(`${tabsZone}/add-entry`)),
    },
    {
      id: 2,
      label: t('zone_page_modify_textual'),
      onClick: () => navigate(buildUrl(`${tabsZone}/modify-textual-record`)),
    },
    {
      id: 3,
      label: t('zone_page_modify_default_ttl'),
      onClick: () => navigate(buildUrl(`${tabsZone}/modify-ttl`)),
    },
    {
      id: 4,
      label: t('zone_page_view_history'),
      onClick: () => navigate(buildUrl(`${tabsZone}/history`)),
    },
    {
      id: 5,
      label: t('zone_page_reset'),
      onClick: () => navigate(buildUrl(`${tabsZone}/reset`)),
    },
  ];
  return (
    <>
    {!isOverridedPage && (
      <Datagrid columns={[]} topbar={
      <>
      <div className="flex gap-2"> 
      <ActionMenu label={t('zone_page_actions')} items={actionItems} id="zone-action-menu"popoverPosition={POPOVER_POSITION.bottomEnd}/> 
        <Button variant={BUTTON_VARIANT.outline} color={BUTTON_COLOR.critical} size={BUTTON_SIZE.sm} onClick={() => navigate(buildUrl(`${domainUrls.domainTabZone}/delete`))}>{t(`${NAMESPACES.ACTIONS}:delete`)}</Button>
        </div>
      </>
      } 
      data={[]} 
      search={{
        onSearch: () => {},
        searchInput: "",
        setSearchInput: () => {}
      }} 
      filters={{
        add: () => {},
        filters: [],
        remove: () => {}
      }} 
      />)}
    </>
  );
}