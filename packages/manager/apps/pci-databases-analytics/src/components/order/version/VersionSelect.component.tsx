import {
  Badge,
  RadioGroup,
  RadioTile,
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from '@datatr-ux/uxlib';
import { useTranslation } from 'react-i18next';
import { Version } from '@/types/orderFunnel';
import { getTagVariant } from '@/lib/tagsHelper';

interface VersionSelectProps {
  versions: Version[];
  value: string;
  onChange: (newValue: string) => void;
}
const VersionSelect = ({ versions, value, onChange }: VersionSelectProps) => {
  const { t } = useTranslation('pci-databases-analytics/components/engine');
  return (
    <RadioGroup value={value} onValueChange={onChange} className="flex">
      {versions.map((version) => (
        <RadioTile
          key={version.name}
          value={version.name}
          className="flex flex-col h-auto py-2 px-4 relative"
        >
          <div className="flex gap-1 items-center">
            <h5>{version.name}</h5>
            <div className="flex gap-1 items-center absolute right-0 -top-3">
              {version.tags.map((tag) => (
                <HoverCard key={tag}>
                  <HoverCardTrigger>
                    <Badge
                      variant={getTagVariant(tag)}
                      data-testid={`Badge${tag}`}
                      className="size-3 p-0 text-center"
                    >
                      <span className="size-3 flex justify-center items-center">
                        !
                      </span>
                    </Badge>
                  </HoverCardTrigger>
                  <HoverCardContent side="top">
                    {t(`versionTag-${tag}`, tag)}
                  </HoverCardContent>
                </HoverCard>
              ))}
            </div>
          </div>
        </RadioTile>
      ))}
    </RadioGroup>
  );
};

export default VersionSelect;
