import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';
import { useTranslation } from 'react-i18next';
import { Icon, Link } from '@ovhcloud/ods-react';
import {
  ongoingOperationLink,
  TOngoingOperationTarget,
} from '@/domain/constants/serviceDetail';

interface LinkToOngoingOperationsProps {
  readonly target: TOngoingOperationTarget;
}

export default function LinkToOngoingOperations({
  target,
}: LinkToOngoingOperationsProps) {
  const { t } = useTranslation(['domain']);
  const { data: ongoingOperationsURL } = useNavigationGetUrl(
    ongoingOperationLink(target),
  );

  return (
    <Link href={ongoingOperationsURL}>
      {t('domain_tab_general_information_banner_link_ongoing_operations')}
      <Icon name="arrow-right" />
    </Link>
  );
}
