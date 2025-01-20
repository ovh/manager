import { useEffect, useState } from 'react';
import Stories, { ComparisonStory } from '../Stories';

const ComponentStories = () => {
  const [stories, setStories] = useState<ComparisonStory[]>([]);
  useEffect(() => {
    const modules = import.meta.glob('./*.story.tsx');
    const loadStories = async () => {
      const loadedStories = await Promise.all(
        Object.values(modules).map((importStory) => importStory()),
      );
      setStories(
        loadedStories.map(
          (module) => (module as { default: ComparisonStory }).default,
        ),
      );
    };
    loadStories();
  }, []);
  return <Stories componentName="Breadcrumb" stories={stories} />;
};

export default ComponentStories;
