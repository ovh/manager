import { useEffect, useState } from 'react';
import { ai } from '@/models/types';

export function useNbCapabilities (
  regions: ai.capabilities.Region[],
  editors: ai.notebook.Editor[],
  frameworks: ai.notebook.Framework[],
) {
  const [region, setRegion] = useState<ai.capabilities.Region>();
  const [editor, setEditor] = useState<ai.notebook.Editor>();
  const [framework, setFramework] = useState<ai.notebook.Framework>();
  const [version, setVersion] = useState('');

  useEffect(() => {
    if (regions) {
      setRegion(regions[0] || undefined);
    }
  }, [regions]);

  useEffect(() => {
    if (editors) {
      setEditor(editors[0] || undefined);
    }
  }, [editors]);

  useEffect(() => {
    if (frameworks) {
      setFramework(frameworks[0] || undefined);
    }
  }, [frameworks]);

  useEffect(() => {
    if (frameworks[0].versions) {
      setVersion(frameworks[0].versions[0] || '');
    }
  }, [frameworks]);

  return {
    region,
    setRegion,
    editor,
    setEditor,
    framework,
    setFramework,
    version,
    setVersion,
  }
}