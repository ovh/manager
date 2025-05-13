import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNotifications } from '@ovh-ux/manager-react-components';
import BuyCreditModal from '@/components/vouchers/BuyCreditModal';
import style from '@/components/common.module.css';

export default function BuyCreditPage() {
  const { projectId } = useParams();
  const { t } = useTranslation('common');
  const { addError, addSuccess } = useNotifications();
  const navigate = useNavigate();
  const onClose = () => {
    navigate('..');
  };
  return (
    <>
      <BuyCreditModal
        data-testid="BuyCreditPage-modal"
        projectId={projectId}
        onClose={onClose}
        onSuccess={(amount, url) => {
          addSuccess(
            <span
              className={style.linkContainer}
              dangerouslySetInnerHTML={{
                __html: t('cpb_vouchers_add_credit_success', {
                  amount,
                  url,
                  interpolation: { escapeValue: false },
                }),
              }}
            ></span>,
          );
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
    </>
  );
}
