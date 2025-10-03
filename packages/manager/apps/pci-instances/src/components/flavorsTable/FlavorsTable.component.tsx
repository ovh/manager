import { BADGE_SIZE, Table, TableProp, TABLE_SIZE, TABLE_VARIANT, Text } from '@ovhcloud/ods-react';
import { DeploymentModeBadge } from '../deploymentModeBadge/DeploymentModeBadge.component';
import clsx from "clsx";

export type TFlavorsTableProps = TableProp & React.HTMLAttributes<HTMLTableElement> & {
    caption: string;
    selectable?: boolean;
  };

export const FlavorsTable = ({ caption, className, selectable= false, size=TABLE_SIZE.md , variant= TABLE_VARIANT.default }: TFlavorsTableProps) => {
  const trClasses = clsx(
    '',
    {
      'group hover:cursor-pointer last:border-b-1': selectable,
    }
  );

  const tdClasses = clsx(
    '',
    {
      'group-hover:border-b group-hover:border-[--ods-color-primary-600]': selectable,
    }
  );

  return (
    <Table size={size} variant={variant} className={className}>
      <caption className={"sr-only"}>{caption}</caption>
      <thead>
        <tr>
          <th scope="col" className={"border-r-0"}></th>
          <th scope="col" className={"border-l-0"}><Text className={"font-semibold text-[--ods-color-heading]"}>Name</Text></th>
          <th scope="col"><Text className={"font-semibold text-[--ods-color-heading]"}>Memory <Text className={"font-regular text-[--ods-color-heading]"}>(Go)</Text></Text></th>
          <th scope="col"><Text className={"font-semibold text-[--ods-color-heading]"}>vCore</Text></th>
          <th scope="col"><Text className={"font-semibold text-[--ods-color-heading]"}>Stockage <Text className={"font-regular text-[--ods-color-heading]"}>(Go)</Text></Text></th>
          <th scope="col"><Text className={"font-semibold text-[--ods-color-heading]"}>Deploiement</Text></th>
          <th scope="col"><Text className={"font-semibold text-[--ods-color-heading]"}>Prix <Text className={"font-regular text-[--ods-color-heading]"}>HT/heure</Text></Text></th>
          <th scope="col"><Text className={"font-semibold text-[--ods-color-heading]"}>Prix <Text className={"font-regular text-[--ods-color-heading]"}>HT/mois</Text></Text></th>
        </tr>
      </thead>
      <tbody>
        <tr className={trClasses}>
          <td className={tdClasses}></td>
          <th className={tdClasses} scope="row"><Text className={"font-regular"}>b3-8</Text></th>
          <td className={tdClasses}><Text>8</Text></td>
          <td className={tdClasses}><Text>2</Text></td>
          <td className={tdClasses}><Text>50NVMe</Text></td>
          <td className={tdClasses}><DeploymentModeBadge mode={'region-3-az'} size={BADGE_SIZE.sm}></DeploymentModeBadge></td>
          <td className={tdClasses}><Text className={"font-semibold"}>0,0465 €</Text></td>
          <td className={tdClasses}><Text className={"font-semibold"}>25,50 €</Text></td>
        </tr>
        <tr className={trClasses}>
          <td className={tdClasses}></td>
          <th className={tdClasses} scope="row"><Text className={"font-regular"}>b3-16</Text></th>
          <td className={tdClasses}><Text>16</Text></td>
          <td className={tdClasses}><Text>4</Text></td>
          <td className={tdClasses}><Text>100NVMe</Text></td>
          <td className={tdClasses}><DeploymentModeBadge mode={'region-3-az'} size={BADGE_SIZE.sm}></DeploymentModeBadge></td>
          <td className={tdClasses}><Text className={"font-semibold"}>0,186 €</Text></td>
          <td className={tdClasses}><Text className={"font-semibold"}>51,00 €</Text></td>
        </tr>
        <tr className={trClasses}>
          <td className={tdClasses}></td>
          <th className={tdClasses} scope="row"><Text className={"font-regular"}>b3-32</Text></th>
          <td className={tdClasses}><Text>32</Text></td>
          <td className={tdClasses}><Text>8</Text></td>
          <td className={tdClasses}><Text>200NVMe</Text></td>
          <td className={tdClasses}><DeploymentModeBadge mode={'region-3-az'} size={BADGE_SIZE.sm}></DeploymentModeBadge></td>
          <td className={tdClasses}><Text className={"font-semibold"}>0,372 €</Text></td>
          <td className={tdClasses}><Text className={"font-semibold"}>102,00 €</Text></td>
        </tr>
      </tbody>
    </Table>
  );
};
