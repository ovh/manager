import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { BookOpen } from 'lucide-react';
import { useGetGuides } from '@/hooks/api/guides/useGetGuides.hook';
import * as database from '@/types/cloud/project/database';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../ui/command';
import { useLocale } from '@/hooks/useLocale';
import { Button } from '../ui/button';
import { Guide } from '@/types/guide';
import { Skeleton } from '../ui/skeleton';

interface GuidesProps {
  section?: string;
  engine?: database.EngineEnum;
  noEngineFilter?: boolean;
  onGuideClick?: (guide: Guide) => void;
}
const Guides = ({
  section,
  engine,
  noEngineFilter = false,
  onGuideClick,
}: GuidesProps) => {
  const { t } = useTranslation('guides');
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const guidesQuery = useGetGuides(
    section,
    locale.toLocaleUpperCase().replace('_', '-'),
    noEngineFilter ? [] : ['all', engine],
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
  return (
    <>
      <Button
        data-testid="guide-open-button"
        // variant="ghost"
        onClick={() => setOpen((prevValue) => !prevValue)}
        // className="text-primary-500 font-semibold"
        className="inline-flex items-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 relative text-sm text-muted-foreground justify-between max-w-40 gap-2"
      >
        <div className="flex items-center gap-2">
          <BookOpen className="size-4" />
          <span className="hidden md:inline">{t('buttonLabel')}</span>
        </div>
        <kbd className="pointer-events-none h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 rig hidden md:inline-flex">
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
