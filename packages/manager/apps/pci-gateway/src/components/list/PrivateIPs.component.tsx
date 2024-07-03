import { OsdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { Interface } from '@/interface';

export default function PrivateIPs({
  interfaces,
}: Readonly<{
  interfaces: Interface[];
}>) {
  return (
    <OsdsText
      level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
      size={ODS_THEME_TYPOGRAPHY_SIZE._400}
      color={ODS_THEME_COLOR_INTENT.text}
    >
      <ul>
        {interfaces.map((item) => (
          <li className="w-fit" key={item.ip}>
            {item.ip}
          </li>
        ))}
      </ul>
    </OsdsText>
  );
}
