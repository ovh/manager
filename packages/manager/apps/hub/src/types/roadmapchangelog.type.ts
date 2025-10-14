export type RoadmapChangelogItem = {
  title: string;
  url: string;
  product: string;
  releaseDate: string;
  status: string;
  changelog: string;
};

export type RoadmapChangelogResponse = {
  hostingCollab: RoadmapChangelogItem[];
  cloud: RoadmapChangelogItem[];
};
