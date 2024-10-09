import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNotifications } from '@ovh-ux/manager-react-components';
import AddVoucherModal from '@/components/vouchers/AddVoucherModal';

export default function AddVoucherPage() {
  const { projectId } = useParams();
  const { t } = useTranslation('common');
  const { addError, addSuccess } = useNotifications();
  const navigate = useNavigate();
  const onClose = () => {
    navigate('..');
  };
  return (
    <AddVoucherModal
      data-testid="AddVoucherPage-modal"
      projectId={projectId}
      onClose={onClose}
      onSuccess={() => {
        addSuccess(t('cpb_vouchers_add_success'));
      }}
      onError={(error: Error) => {
        addError(
          <>
            {t('cpb_vouchers_add_error')}
            {error && ` (${error.message})`}
          </>,
        );
      }}
    />
  );
}
