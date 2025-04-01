import icons from '@/../public/assets/icons.data.json';
import Icon from '@/components/icon/Icon.component';

interface ProductAdvantagesProps {
  iconeName: keyof typeof icons;
  title: string;
  description: string;
}

export default function ProductAdvantages({
  iconeName,
  title,
  description,
}: ProductAdvantagesProps) {
  return (
    <div className="flex flex-row gap-6">
      <div className="rounded-full h-16 w-16 flex items-center justify-center overflow-hidden">
        <Icon name={iconeName} />
      </div>
      <div className="flex flex-col gap-2">
        <h4>{title}</h4>
        <p className="max-w-xs md:max-w-md text-justify">{description}</p>
      </div>
    </div>
  );
}
