import React from 'react';
import {
  Icon,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import { PublicNameServerTypeEnum } from '@/domain/enum/publicNameServerType.enum';

interface DatagridColumnTooltipProps {
  readonly type: PublicNameServerTypeEnum;
}

export default function DatagridColumnDnsType({
  type,
}: DatagridColumnTooltipProps) {
  const { t } = useTranslation('domain');

  return (
    <div className="flex gap-x-4">
      <DataGridTextCell>
        {t(`domain_dns_table_type_${type.toLowerCase()}`)}
      </DataGridTextCell>
      {type === PublicNameServerTypeEnum.STANDARD && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Icon
              className="text-[--ods-color-primary-500]"
              name="circle-question"
            />
          </TooltipTrigger>
          <TooltipContent withArrow>
            {t('domain_dns_table_type_standard_tooltip')}
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}
