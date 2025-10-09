import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';
import { useS3Data } from '../S3.context';
import S3ObjectsList from './_components/S3ObjectListTable.component';

const Objects = () => {
  const { s3 } = useS3Data();
  const { t } = useTranslation('pci-object-storage/storages/s3/objects');
  return (
    <>
      <h2>{t('objectTitle')}</h2>
      <S3ObjectsList objects={s3.objects} />
      <Outlet />
    </>
  );
};

export default Objects;
