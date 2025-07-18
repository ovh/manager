import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { OdsCard } from '@ovhcloud/ods-components/react';
import { Subtitle } from '@ovh-ux/manager-react-components';

export type QuickAccessItem = {
  icon: string;
  title: string;
  description: string;
  link: string;
};

export function QuickAccess({ items }: { items: QuickAccessItem[] }) {
  const { t } = useTranslation('home');

  return (
    <>
      <Subtitle>{t('quick_access')}</Subtitle>
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-5 my-6">
        {items.map((item, idx) => (
          <Link to={item.link} style={{ textDecoration: 'none' }} key={idx}>
            <OdsCard className="flex flex-row items-center p-4 h-full border border-[var(--ods-color-neutral-200)] rounded-xl bg-white shadow-none min-h-[100px]">
              <div className="bg-[var(--ods-color-information-700)] rounded flex items-center justify-center w-23 h-23">
                <img src={item.icon} alt="" className="w-20 h-20" />
              </div>
              <div className="flex flex-col justify-center ml-6">
                <div className="font-bold text-xl text-[var(--ods-color-heading)] mb-1 leading-tight">
                  {item.title}
                </div>
                <div className="flex justify-start items-center text-base text-[var(--ods-color-primary-500)] leading-tight">
                  {item.description}
                </div>
              </div>
            </OdsCard>
          </Link>
        ))}
      </div>
    </>
  );
}
