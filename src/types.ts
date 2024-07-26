type Method = (...args: any[]) => any;
type Component = {
  methods: { [key: string]: Method };
  [key: string]: any;
};
type PageOrApp = Record<string, any>;
interface Track {
  element: string;
  method?: string;
  dataset: Dataset;
  path?: string;
  methodTracks?: Track[];
  elementTracks?: Track[];
  comMethodTracks?: Track[];
  [key: string]: any;
}

interface Dataset {
  [key: string]: any;
  index?: number;
}

interface App {
  [key: string]: any;
}

interface PageData {
  [key: string]: any;
}

interface TracksConfig {
  tracks: Track[];
  isUsingPlugin: boolean;
}

export {
  Method,
  Component,
  PageOrApp,
  Track,
  TracksConfig,
  Dataset,
  App,
  PageData,
};
