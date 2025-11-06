# Migration Notes - Dashboard Nasha

## Translation Keys Mapping

### Dashboard Translations

| Legacy Key (AngularJS) | New Key (React) | Value Preserved |
|------------------------|-----------------|-----------------|
| `nasha_dashboard_actions` | `dashboard.actions.edit` | ✅ |
| `nasha_dashboard_configuration_link` | `dashboard.configuration.link` | ✅ |
| `nasha_dashboard_configuration_quota` | `dashboard.configuration.quota` | ✅ |
| `nasha_dashboard_configuration_title` | `dashboard.configuration.title` | ✅ |
| `nasha_dashboard_edit` | `dashboard.actions.edit` | ✅ |
| `nasha_dashboard_information_datacenter` | `dashboard.information.datacenter` | ✅ |
| `nasha_dashboard_information_disk_size` | `dashboard.information.disk_size` | ✅ |
| `nasha_dashboard_information_disk_type` | `dashboard.information.disk_type` | ✅ |
| `nasha_dashboard_information_id` | `dashboard.information.id` | ✅ |
| `nasha_dashboard_information_name` | `dashboard.information.name` | ✅ |
| `nasha_dashboard_information_title` | `dashboard.information.title` | ✅ |
| `nasha_dashboard_tab_general_information` | `dashboard.tabs.general_information` | ✅ |
| `nasha_dashboard_tab_partitions` | `dashboard.tabs.partitions` | ✅ |
| `nasha_dashboard_guides_header` | `dashboard.guides.header` | ✅ |
| `nasha_dashboard_guides_title` | `dashboard.guides.title` | ✅ |

### Edit Name Component Translations

| Legacy Key (AngularJS) | New Key (React) | Value Preserved |
|------------------------|-----------------|-----------------|
| `nasha_components_edit_name_forbid` | `dashboard.edit_name.forbid` | ✅ |
| `nasha_components_edit_name_label` | `dashboard.edit_name.label` | ✅ |
| `nasha_components_edit_name_primary` | `dashboard.edit_name.confirm` | ✅ |
| `nasha_components_edit_name_secondary` | `dashboard.edit_name.cancel` | ✅ |
| `nasha_components_edit_name_success` | `dashboard.edit_name.success` | ✅ |
| `nasha_components_edit_name_title` | `dashboard.edit_name.title` | ✅ |
| `nasha_components_edit_name_rules` | `dashboard.edit_name.rules` | ✅ |

### EOL Banner Translations

| Legacy Key (AngularJS) | New Key (React) | Value Preserved |
|------------------------|-----------------|-----------------|
| `nasha_components_eol_lv1_lv2_services_banner_description_part_1` | `dashboard.eol_banner.description_part_1` | ✅ |
| `nasha_components_eol_lv1_lv2_services_banner_description_part_2` | `dashboard.eol_banner.description_part_2` | ✅ |
| `nasha_components_eol_lv1_lv2_services_banner_info_link` | `dashboard.eol_banner.info_link` | ✅ |

### Common Translations (Used in prepareNasha)

These translations are still referenced with legacy keys in `prepareNasha.utils.ts`:
- `nasha_use_type_*` - Used for use type names (e.g., `nasha_use_type_used`, `nasha_use_type_usedbysnapshots`)
- `nasha_use_unit_*` - Used for unit names (e.g., `nasha_use_unit_GB`, `nasha_use_unit_TB`)
- `nasha_datacenter_*` - Used for datacenter names (e.g., `nasha_datacenter_rbx`, `nasha_datacenter_sbg`)

**Note**: These common translations should be added to a `common` namespace or kept in the legacy format until a full migration of all modules is completed.

## Assets Migration

No assets were migrated in this phase. The dashboard uses standard UI components from MUK/ODS.

## API Endpoints

All API endpoints remain unchanged:
- `/dedicated/nasha/:serviceName` (AAPI)
- `/dedicated/nasha/:serviceName/serviceInfos` (v6)
- `/dedicated/nasha/:serviceName/partition` (Iceberg v6)

## Component Mapping

| AngularJS Component | React Component | Status |
|---------------------|-----------------|--------|
| `nashaDashboard` | `Dashboard.page.tsx` | ✅ Migrated |
| `nasha-components-space-meter` | `SpaceMeter.component.tsx` | ✅ Migrated |
| `nasha-components-edit-name` | `EditNameModal.component.tsx` | ✅ Migrated |
| `eol-lv1-lv2-services-banner` | `EolBanner.component.tsx` | ✅ Migrated |
| `billing-subscription-tile` | `BillingTile.component.tsx` | ⚠️ Placeholder (needs integration) |

## Known Issues / TODOs

1. **BillingTile**: The `billing-subscription-tile` component needs to be integrated. Currently using a placeholder.
2. **ChangelogButton**: Changelog button in header needs proper integration with ChangelogButton component from manager-react-components.
3. **Alerts/Notifications**: Success and error messages need to be implemented (currently using console.log).
4. **Common Translations**: `nasha_use_type_*`, `nasha_use_unit_*`, and `nasha_datacenter_*` translations should be migrated to a common namespace.

