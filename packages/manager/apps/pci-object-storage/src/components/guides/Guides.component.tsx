import { useTranslation } from 'react-i18next';
import { useEffect, useState, useMemo } from 'react';
import { BookOpen } from 'lucide-react';
import {
  Button,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@datatr-ux/uxlib';
import { useUser } from '@/hooks/useUser';
import { resolveGuides, GuideId, SectionId } from './guides.config';

type Guide = {
  id: string;
  title: string;
  description?: string;
  url: string;
};

interface GuidesProps {
  selectors?: (SectionId | GuideId)[];
  onGuideClick?: (guide: Guide) => void;
}

const Guides = ({ selectors = ['all'], onGuideClick }: GuidesProps) => {
  const { t } = useTranslation('pci-object-storage/guides');
  const user = useUser();
  const [open, setOpen] = useState(false);

  // Resolve guide configurations based on selectors and localize URLs
  const guides: Guide[] = useMemo(() => {
    const guideConfigs = resolveGuides(selectors);
    const userLocale = user?.ovhSubsidiary || 'DEFAULT';

    return guideConfigs.map((guide) => ({
      id: guide.id,
      title: t(guide.titleKey),
      description: guide.descriptionKey ? t(guide.descriptionKey) : undefined,
      url: guide.linksByLocale[userLocale] ?? guide.linksByLocale.DEFAULT,
    }));
  }, [selectors, user?.ovhSubsidiary, t]);

  // open the menu on cmd + k
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

  const HTTP_REGEX = /^(http|https):\/\//i;

  // open a guide in a new tab
  const openGuide = (guide: Guide) => {
    if (onGuideClick) {
      onGuideClick(guide);
    }
    const { url } = guide;
    if (url && HTTP_REGEX.test(url)) {
      const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
      if (newWindow) newWindow.opener = null;
    }
  };

  const sortedGuides = [...guides]?.sort((a, b) =>
    a.title.localeCompare(b.title),
  );

  return (
    <>
      <Button
        data-testid="guide-open-button"
        mode="ghost"
        onClick={() => setOpen((prevValue) => !prevValue)}
        className="inline-flex items-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 relative text-sm justify-between max-w-40 gap-2"
      >
        <div className="flex items-center gap-2">
          <BookOpen className="size-4" />
          <span className="inline">{t('guidesTitle')}</span>
        </div>
        <kbd className="pointer-events-none h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 rig inline-flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder={t('guidesSearchPlaceholder')} />
        <CommandList>
          <CommandEmpty>{t('guidesNoResults')}</CommandEmpty>
          <CommandGroup data-testid="guide-header" heading={t('guidesTitle')}>
            {sortedGuides.map((guide) => (
              <CommandItem
                data-testid={guide.url}
                key={guide.id}
                onSelect={() => openGuide(guide)}
                className="cursor-pointer flex-col items-start"
              >
                <p className="text-sm font-semibold">{guide.title}</p>
                {guide.description && (
                  <p className="text-xs text-muted-foreground">
                    {guide.description}
                  </p>
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default Guides;
