import { useNavigate, useParams } from 'react-router-dom';
import { Translation, useTranslation } from 'react-i18next';
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
        addSuccess(
          <Translation ns="add">
            {(_t) => _t('cpb_vouchers_add_success')}
          </Translation>,
          true,
        );
      }}
      onError={(error: Error) => {
        addError(
          <Translation ns="add">
            {(_t) =>
              _t('cpb_vouchers_add_error', {
                message: error?.message || null,
              })
            }
          </Translation>,
          true,
        );
      }}
    />
  );
}
