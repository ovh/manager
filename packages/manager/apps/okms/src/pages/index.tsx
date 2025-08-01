import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export default function Okms() {
  const { t } = useTranslation('okms');
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the key management service page
    navigate('/key-management-service');
  }, [navigate]);

  return (
    <div>
      <h1>{t('title')}</h1>
      <div>Start your application</div>
    </div>
  );
}
