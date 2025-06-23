export type RoadmapChangelogItem = {
  title: string;
  description: string;
  product: string;
  releaseDate: string;
  status: string;
  changelog: string;
};

export type RoadmapChangelogResponse = {
  hostingCollab: RoadmapChangelogItem[];
  cloud: RoadmapChangelogItem[];
};
