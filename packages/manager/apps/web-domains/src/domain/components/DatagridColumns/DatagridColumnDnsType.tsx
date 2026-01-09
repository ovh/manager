import { useTranslation } from 'react-i18next';
import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import { PublicNameServerTypeEnum } from '@/domain/enum/publicNameServerType.enum';
import CircleQuestionTooltip from '@/domain/components/CircleQuestionTooltip/CircleQuestionTooltip';

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
        <CircleQuestionTooltip
          translatedMessage={t('domain_dns_table_type_standard_tooltip')}
        />
      )}
    </div>
  );
}
