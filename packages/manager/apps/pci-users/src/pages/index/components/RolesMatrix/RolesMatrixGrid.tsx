import { OsdsIcon, OsdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import {
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_TEXT_COLOR_HUE,
} from '@ovhcloud/ods-components';
import { Role, Service } from '@/interface';

interface IProps {
  roles: Role[];
  services: Service[];
}
export default function RolesMatrixGrid({ roles, services }: IProps) {
  return (
    <div className="max-w-full overflow-x-scroll">
      <table className="w-full border-collapse mb-2">
        <thead>
          <tr>
            <th></th>
            <th></th>
            {roles?.map((role) => (
              <th key={role.id} className="text-center text-h11 px-1 py-2 h-10">
                <OsdsText
                  size={ODS_THEME_TYPOGRAPHY_SIZE._500}
                  hue={ODS_TEXT_COLOR_HUE._600}
                  className="whitespace-nowrap text-[--ods-color-text-500]"
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
                className="border border-solid border-[var(--ods-color-blue-200)]"
              >
                {indexPermission === 0 && (
                  <td
                    rowSpan={service.permissions.length}
                    className="py-2 h-10"
                  >
                    <OsdsText
                      className="whitespace-nowrap"
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
                {roles.map((role) => (
                  <td
                    key={service.name + permission.label + role.id}
                    className="text-center px-2 h-10"
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
  );
}
