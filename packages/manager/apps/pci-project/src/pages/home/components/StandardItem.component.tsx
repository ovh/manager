import { BottomSectionItem } from './useDashboardSections.hook';

interface StandardItemProps {
  item: BottomSectionItem;
}

export default function StandardItem({ item }: StandardItemProps) {
  return (
    <div className="flex justify-between items-start">
      <div className="flex-1">
        <div className="font-bold text-black">{item.label}</div>
        <a
          href={item.link}
          className="font-bold hover:underline no-underline text-[var(--ods-color-primary-500)]"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${item.description} - Opens in new tab`}
        >
          {item.description}
        </a>
      </div>
    </div>
  );
}
