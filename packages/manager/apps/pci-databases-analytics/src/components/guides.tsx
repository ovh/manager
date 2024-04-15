import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { BookOpen } from 'lucide-react';
import { useGetGuides } from '@/hooks/api/guides.api.hooks';
import { database } from '@/models/database';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './ui/command';
import { useLocale } from '@/hooks/useLocale';
import { Button } from './ui/button';
import { Guide } from '@/models/guide';

interface GuidesProps {
  section?: string;
  engine?: database.EngineEnum;
  noEngineFilter?: boolean;
}
const Guides = ({ section, engine, noEngineFilter = false }: GuidesProps) => {
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
      if (e.key === 'j' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prevValue) => !prevValue);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);
  // open a guide in a new tab
  const openGuide = (guide: Guide) => {
    const { url } = guide;
    if (url && /^(http|https):\/\//i.test(url)) {
      const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
      if (newWindow) newWindow.opener = null;
    }
  };
  return (
    <>
      <Button
        variant="ghost"
        onClick={() => setOpen((prevValue) => !prevValue)}
        className="text-primary-500 font-semibold"
      >
        <BookOpen className="size-4 mr-2" />
        <span>{t('buttonLabel')}</span>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder={t('searchBarPlaceholder')} />
        <CommandList>
          <CommandEmpty>{t('noResult')}</CommandEmpty>
          <CommandGroup heading={t('listHeading')}>
            {guidesQuery.data
              ?.sort((a, b) => a.title.localeCompare(b.title))
              .map((guide) => (
                <CommandItem
                  key={guide.url}
                  onSelect={() => openGuide(guide)}
                  className="cursor-pointer"
                >
                  <span>{guide.title}</span>
                </CommandItem>
              ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default Guides;
