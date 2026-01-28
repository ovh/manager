import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { BookOpen } from 'lucide-react';
import { useParams } from 'react-router-dom';
import {
  Button,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Skeleton,
} from '@datatr-ux/uxlib';
import { TRACKING } from '@/configuration/tracking.constants';
import { useTrackAction } from '@/hooks/useTracking';
import { useLocale } from '@/hooks/useLocale';
import { useQuantum } from '@/hooks/useQuantum.hook';
import { Guide } from '@/types/Guides';
import { useGetGuides } from '@/data/hooks/ai/guide/useGetGuides.hook';

interface GuidesProps {
  section?: string[];
  category?: string;
  onGuideClick?: (guide: Guide) => void;
}
const Guides = ({ category = 'ai', section, onGuideClick }: GuidesProps) => {
  const { projectId } = useParams();
  const { t } = useTranslation('ai-tools/components/guides');
  const locale = useLocale();
  const { isQuantum, isQpu } = useQuantum('ai-tools/components/guides');
  const track = useTrackAction();
  const trackingProductPrefix = isQpu ? 'qpus' : 'emulators';
  const [open, setOpen] = useState(false);
  const guidesQuery = useGetGuides(
    projectId,
    category,
    section,
    locale.toLocaleLowerCase().replace('_', '-'),
  );

  // open the menu on cmd + j
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prevValue) => !prevValue);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  // open a guide in a new tab
  const openGuide = (guide: Guide) => {
    if (isQpu || isQuantum) {
      track(TRACKING[trackingProductPrefix].guide.guideLinkClick(guide.title));
    }
    if (onGuideClick) {
      onGuideClick(guide);
    }
    const { url } = guide;
    if (url && /^(http|https):\/\//i.test(url)) {
      const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
      if (newWindow) newWindow.opener = null;
    }
  };
  if (guidesQuery.isFetching)
    return <Skeleton data-testid="guide-skeleton" className="w-40 h-4" />;
  if (guidesQuery.data?.length === 0) return <></>;

  const handleOpenClick = () => {
    if (isQpu || isQuantum) {
      track(TRACKING[trackingProductPrefix].guide.guideClick());
    }
    setOpen((prevValue) => !prevValue);
  };

  return (
    <>
      <Button
        data-testid="guide-open-button"
        mode="ghost"
        onClick={handleOpenClick}
        className="inline-flex items-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 relative text-sm justify-between max-w-40 gap-2"
      >
        <div className="flex items-center gap-2">
          <BookOpen className="size-4" />
          <span className="inline">{t('buttonLabel')}</span>
        </div>
        <kbd className="pointer-events-none h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 rig inline-flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder={t('searchBarPlaceholder')} />
        <CommandList>
          <CommandEmpty>{t('noResult')}</CommandEmpty>
          <CommandGroup data-testid="guide-header" heading={t('listHeading')}>
            {guidesQuery.data
              ?.sort((a, b) => a.title.localeCompare(b.title))
              .map((guide) => (
                <CommandItem
                  data-testid={guide.url}
                  key={guide.url}
                  onSelect={() => openGuide(guide)}
                  className="cursor-pointer flex-col items-start"
                >
                  <p className="text-sm font-semibold">{guide.title}</p>
                  <p className="text-xs">{guide.excerpt}</p>
                </CommandItem>
              ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default Guides;
