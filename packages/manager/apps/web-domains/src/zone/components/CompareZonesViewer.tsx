import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  BUTTON_VARIANT,
  Icon,
  ICON_NAME,
  MESSAGE_COLOR,
  Message,
  SPINNER_SIZE,
  Spinner,
} from '@ovhcloud/ods-react';
import { TZoneHistoryWithDate } from '@/zone/types/history.types';
import { useCompareZoneFiles } from '@/zone/hooks/data/history.hooks';

interface CharDiff {
  readonly isChanged: boolean;
  readonly char: string;
  readonly position: number;
}

interface DiffLine {
  readonly type: 'added' | 'removed' | 'unchanged';
  readonly content: string;
  readonly id: string;
  readonly charDiffs?: CharDiff[];
}

interface SplitDiff {
  readonly baseLines: DiffLine[];
  readonly modifiedLines: DiffLine[];
}

interface CompareZonesViewerProps {
  readonly baseItem: TZoneHistoryWithDate;
  readonly modifiedItem: TZoneHistoryWithDate;
}

const getCharDiffs = (str1: string, str2: string): [CharDiff[], CharDiff[]] => {
  const maxLength = Math.max(str1.length, str2.length);
  const diffs1: CharDiff[] = [];
  const diffs2: CharDiff[] = [];

  for (let index = 0; index < maxLength; index += 1) {
    const char1 = str1[index];
    const char2 = str2[index];
    const isChanged = char1 !== char2;

    diffs1.push({ char: char1 ?? '', isChanged, position: index });
    diffs2.push({ char: char2 ?? '', isChanged, position: index });
  }

  return [diffs1, diffs2];
};

const buildSplitDiff = (baseContent: string, modifiedContent: string): SplitDiff => {
  const baseLines = baseContent.split('\n');
  const modifiedLines = modifiedContent.split('\n');
  const maxLength = Math.max(baseLines.length, modifiedLines.length);

  const baseDiff: DiffLine[] = [];
  const modifiedDiff: DiffLine[] = [];

  for (let index = 0; index < maxLength; index += 1) {
    const baseLine = baseLines[index];
    const modifiedLine = modifiedLines[index];
    const baseLineId = `base-${index}`;
    const modifiedLineId = `modified-${index}`;

    if (baseLine === modifiedLine) {
      if (baseLine !== undefined) {
        baseDiff.push({ type: 'unchanged', content: baseLine, id: baseLineId });
        modifiedDiff.push({
          type: 'unchanged',
          content: modifiedLine,
          id: modifiedLineId,
        });
      }
      continue;
    }

    const baseIsUndefined = baseLine === undefined;
    const modifiedIsUndefined = modifiedLine === undefined;

    if (!baseIsUndefined && !modifiedIsUndefined) {
      // Both lines exist but are different - compute character-level diff
      const [charDiffs1, charDiffs2] = getCharDiffs(baseLine, modifiedLine);
      baseDiff.push({
        type: 'removed',
        content: baseLine,
        id: baseLineId,
        charDiffs: charDiffs1,
      });
      modifiedDiff.push({
        type: 'added',
        content: modifiedLine,
        id: modifiedLineId,
        charDiffs: charDiffs2,
      });
    } else if (!baseIsUndefined && modifiedIsUndefined) {
      baseDiff.push({ type: 'removed', content: baseLine, id: baseLineId });
      modifiedDiff.push({ type: 'unchanged', content: '', id: modifiedLineId });
    } else if (baseIsUndefined && !modifiedIsUndefined) {
      baseDiff.push({ type: 'unchanged', content: '', id: baseLineId });
      modifiedDiff.push({ type: 'added', content: modifiedLine, id: modifiedLineId });
    }
  }

  return { baseLines: baseDiff, modifiedLines: modifiedDiff };
};

interface DiffLineRendererProps {
  readonly line: DiffLine;
}

const DiffLineRenderer = ({ line }: DiffLineRendererProps) => {
  if (line.charDiffs && (line.type === 'added' || line.type === 'removed')) {
    return (
      <div className={`font-mono text-sm ${line.type === 'added' ? 'bg-green-50' : 'bg-red-50'}`}>
        <div
          className={`min-h-5 break-words px-4 ${line.type === 'added' ? 'text-green-800' : 'text-red-800'
            }`}
        >
          {line.charDiffs.map((charDiff) =>
            charDiff.isChanged ? (
              <span
                key={`${line.id}-${charDiff.position}`}
                className={
                  line.type === 'added'
                    ? 'bg-green-600 font-bold text-white'
                    : 'bg-red-600 font-bold text-white'
                }
              >
                {charDiff.char || '\u00A0'}
              </span>
            ) : (
              <span key={`${line.id}-${charDiff.position}`}>{charDiff.char}</span>
            ),
          )}
        </div>
      </div>
    );
  }

  const getLineColor = (type: DiffLine['type']) => {
    if (type === 'added') return 'bg-green-50';
    if (type === 'removed') return 'bg-red-50';
    return '';
  };

  const getLineTextColor = (type: DiffLine['type']) => {
    if (type === 'added') return 'text-green-800';
    if (type === 'removed') return 'text-red-800';
    return 'text-gray-700';
  };

  return (
    <div className={`font-mono text-sm ${getLineColor(line.type)}`}>
      <div className={`min-h-7 break-words px-4 ${getLineTextColor(line.type)}`}>
        {line.content || '\u00A0'}
      </div>
    </div>
  );
};

export default function CompareZonesViewer({
  baseItem,
  modifiedItem,
}: CompareZonesViewerProps) {
  const { t } = useTranslation('zone');
  const { mutate: compareZones, data: compareData, isPending: isLoading, error: compareError } = useCompareZoneFiles();
  const [copiedBase, setCopiedBase] = useState(false);
  const [copiedModified, setCopiedModified] = useState(false);

  const baseScrollRef = useRef<HTMLPreElement>(null);
  const modifiedScrollRef = useRef<HTMLPreElement>(null);
  const isSyncingRef = useRef(false);

  const error = compareError?.message ?? null;

  const diff = useMemo<SplitDiff | null>(() => {
    if (!compareData) return null;
    return buildSplitDiff(compareData.baseContent, compareData.modifiedContent);
  }, [compareData]);

  const handleCopy = (lines: DiffLine[], setCopied: (v: boolean) => void) => {
    const text = lines.map((line) => line.content).join('\n');
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  useEffect(() => {
    const baseEl = baseScrollRef.current;
    const modifiedEl = modifiedScrollRef.current;
    if (!baseEl || !modifiedEl) return;

    const syncFromBase = () => {
      if (isSyncingRef.current) return;
      isSyncingRef.current = true;
      modifiedEl.scrollTop = baseEl.scrollTop;
      modifiedEl.scrollLeft = baseEl.scrollLeft;
      isSyncingRef.current = false;
    };

    const syncFromModified = () => {
      if (isSyncingRef.current) return;
      isSyncingRef.current = true;
      baseEl.scrollTop = modifiedEl.scrollTop;
      baseEl.scrollLeft = modifiedEl.scrollLeft;
      isSyncingRef.current = false;
    };

    baseEl.addEventListener('scroll', syncFromBase);
    modifiedEl.addEventListener('scroll', syncFromModified);

    return () => {
      baseEl.removeEventListener('scroll', syncFromBase);
      modifiedEl.removeEventListener('scroll', syncFromModified);
    };
  }, [diff]);

  useEffect(() => {
    if (!baseItem || !modifiedItem || baseItem.id === modifiedItem.id) {
      return;
    }
    compareZones({
      baseUrl: baseItem.zoneFileUrl,
      modifiedUrl: modifiedItem.zoneFileUrl,
    });
  }, [baseItem, modifiedItem]);

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Spinner size={SPINNER_SIZE.lg} />
      </div>
    );
  }

  if (error) {
    return (
      <Message color={MESSAGE_COLOR.critical}>
        {t('zone_history_error', { message: error })}
      </Message>
    );
  }

  if (!diff || (diff.baseLines.length === 0 && diff.modifiedLines.length === 0)) {
    return (
      <Message>
        {t('zone_history_compare_empty')}
      </Message>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded border border-gray-200 overflow-hidden">
          <div className="sticky top-0 bg-gray-100 px-4 font-semibold text-gray-700 border-b border-gray-200 flex items-center justify-end">
            <Button
              variant={BUTTON_VARIANT.ghost}
              onClick={() => handleCopy(diff.baseLines, setCopiedBase)}
            >
              <Icon name={copiedBase ? ICON_NAME.check : ICON_NAME.fileCopy} />
            </Button>
          </div>
          <pre
            ref={baseScrollRef}
            className="font-mono text-sm bg-gray-50 max-h-[calc(100vh-400px)] overflow-auto m-0"
          >
            {diff.baseLines.map((line) => (
              <DiffLineRenderer key={line.id} line={line} />
            ))}
          </pre>
        </div>

        <div className="rounded border border-gray-200 overflow-hidden">
          <div className="sticky top-0 bg-gray-100 px-4 font-semibold text-gray-700 border-b border-gray-200 flex items-center justify-end">
            <Button
              variant={BUTTON_VARIANT.ghost}
              onClick={() => handleCopy(diff.modifiedLines, setCopiedModified)}
            >
              <Icon name={copiedModified ? ICON_NAME.check : ICON_NAME.fileCopy} />
            </Button>
          </div>
          <pre
            ref={modifiedScrollRef}
            className="font-mono text-sm bg-gray-50 max-h-[calc(100vh-400px)] overflow-auto m-0"
          >
            {diff.modifiedLines.map((line) => (
              <DiffLineRenderer key={line.id} line={line} />
            ))}
          </pre>
        </div>
      </div>
    </div>
  );
}
