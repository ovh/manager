import {
  OsdsButton,
  OsdsIcon,
  OsdsPopover,
  OsdsPopoverContent,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_TEXT_ALIGN,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_TEXT_COLOR_HUE,
} from '@ovhcloud/ods-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Role, Service } from '@/interface';
import RolesSelector from '@/pages/add/components/RolesSelector';

interface IProps {
  roles: Role[];
  services: Service[];
}

export default function RolesMatrix({ roles, services }: IProps) {
  const { t } = useTranslation('common');

  const [toggled, setToggled] = useState<boolean>(false);
  const [selectedRoles, setSelectedRoles] = useState<Role[]>(roles);

  useEffect(() => {
    setSelectedRoles(roles);
  }, [roles]);

  return (
    <>
      <div>
        <OsdsButton
          size={ODS_BUTTON_SIZE.sm}
          variant={ODS_BUTTON_VARIANT.stroked}
          color={ODS_THEME_COLOR_INTENT.primary}
          className="inline-block"
          onClick={() => setToggled(!toggled)}
        >
          {toggled
            ? t('pci_projects_project_users_matrix_hide')
            : t('pci_projects_project_users_matrix_show')}
        </OsdsButton>
      </div>
      {toggled && (
        <div>
          <div className="text-right">
            <OsdsPopover>
              <OsdsButton
                slot="popover-trigger"
                size={ODS_BUTTON_SIZE.sm}
                variant={ODS_BUTTON_VARIANT.stroked}
                color={ODS_THEME_COLOR_INTENT.primary}
                textAlign={ODS_BUTTON_TEXT_ALIGN.center}
              >
                <OsdsIcon
                  name={ODS_ICON_NAME.SETTINGS}
                  color={ODS_THEME_COLOR_INTENT.primary}
                  size={ODS_ICON_SIZE.xs}
                />
              </OsdsButton>
              <OsdsPopoverContent>
                <RolesSelector
                  allRoles={roles}
                  preSelectedRoles={roles}
                  onInput={(newRoles) => setSelectedRoles(newRoles)}
                />
              </OsdsPopoverContent>
            </OsdsPopover>
          </div>

          <div style={{ maxWidth: '100%', overflowX: 'scroll' }}>
            <table className="me w-full mb-2">
              <thead>
                <tr>
                  <th></th>
                  <th></th>
                  {selectedRoles?.map((role) => (
                    <th
                      key={role.id}
                      className="text-center text-h11"
                      style={{ padding: '.25rem .5rem', height: '2.625rem' }}
                    >
                      <OsdsText
                        size={ODS_THEME_TYPOGRAPHY_SIZE._500}
                        hue={ODS_TEXT_COLOR_HUE._600}
                        style={{
                          whiteSpace: 'nowrap',
                          color: 'var(--ods-color-text-500)',
                        }}
                      >
                        {role.description}
                      </OsdsText>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {services?.map((service) =>
                  service.permissions.map((permission, indexPermission) => (
                    <tr
                      key={service.name + permission.label}
                      style={{ border: '1px solid var(--ods-color-blue-200)' }}
                    >
                      {indexPermission === 0 && (
                        <td
                          rowSpan={service.permissions.length}
                          style={{ padding: '0 .5rem', height: '2.5rem' }}
                        >
                          <OsdsText
                            style={{ whiteSpace: 'nowrap' }}
                            level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                            color={ODS_THEME_COLOR_INTENT.text}
                            size={ODS_THEME_TYPOGRAPHY_SIZE._400}
                          >
                            {service.name}
                          </OsdsText>
                        </td>
                      )}
                      <td>
                        <OsdsText
                          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                          color={ODS_THEME_COLOR_INTENT.text}
                          size={ODS_THEME_TYPOGRAPHY_SIZE._400}
                        >
                          {permission.label}
                        </OsdsText>
                      </td>
                      {selectedRoles.map((role) => (
                        <td
                          key={service.name + permission.label + role.id}
                          className="text-center"
                          style={{ padding: '0 .5rem', height: '2.5rem' }}
                        >
                          {(() => {
                            const check = permission.roles.some(
                              (id) => role.id === id,
                            );
                            return (
                              <OsdsIcon
                                slot="popover-trigger"
                                name={
                                  check
                                    ? ODS_ICON_NAME.SUCCESS_CIRCLE
                                    : ODS_ICON_NAME.ERROR_CIRCLE
                                }
                                color={
                                  check
                                    ? ODS_THEME_COLOR_INTENT.success
                                    : ODS_THEME_COLOR_INTENT.error
                                }
                                size={ODS_ICON_SIZE.xxs}
                                className="rounded-full border-info border-s-2"
                              />
                            );
                          })()}
                        </td>
                      ))}
                    </tr>
                  )),
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
