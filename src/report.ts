import { Track, Dataset, App, PageData } from "./types";

/**
 * 解析数组类型dataKey
 * 例如list[$INDEX],返回{key:list, index: $INDEX}
 * 例如list[4],返回{key:list, index: 4}
 * @param {string} key
 * @param {number} index
 * @returns {{ key: string, index: number } | {}}
 */
const resloveArrayDataKey = (
  key: string,
  index: number
): { key: string; index: number } | {} => {
  const leftBracketIndex = key.indexOf("[");
  const rightBracketIndex = key.indexOf("]");
  if (leftBracketIndex > -1) {
    let arrIndex = key.substring(leftBracketIndex + 1, rightBracketIndex);
    const arrKey = key.substring(0, leftBracketIndex);
    if (arrIndex === "$INDEX") {
      arrIndex = index.toString();
    }
    return {
      key: arrKey,
      index: parseInt(arrIndex, 10),
    };
  }
  return {};
};

/**
 * 获取全局数据
 * @param {string} key 目前支持$APP.* $DATASET.* $INDEX
 * @param {Dataset} dataset 点击元素dataset
 * @returns {any}
 */
const getGloabData = (key: string, dataset: Dataset): any => {
  let result: any = "";
  if (key.indexOf("$APP.") > -1) {
    const App = getApp() as App;
    const appKey = key.split("$APP.")[1];
    result = App[appKey];
  } else if (key.indexOf("$DATASET.") > -1) {
    const setKey = key.split("$DATASET.")[1];
    result = dataset[setKey];
  } else if (key.indexOf("$INDEX") > -1) {
    result = dataset.index;
  }
  return result;
};

/**
 * 获取页面数据
 * @param {string} key
 * @param {Dataset} dataset
 * @param {PageData} pageData
 * @returns {any}
 */
const getPageData = (
  key: string,
  dataset: Dataset = {},
  pageData: PageData
): any => {
  const { index } = dataset;
  const keys = key.split(".");
  let result: any = pageData;
  if (keys.length > -1) {
    keys.forEach((name) => {
      const res = resloveArrayDataKey(name, index!);
      if ("key" in res) {
        result = result[res.key][res.index];
      } else {
        result = result[name];
      }
    });
  } else {
    result = pageData[key];
  }
  return result;
};

/**
 * 读取数据
 * @param {string} key
 * @param {Dataset} dataset
 * @param {PageData} pageData
 * @returns {any}
 */
const dataReader = (key: string, dataset: Dataset, pageData: PageData): any => {
  try {
    let result: any = "";
    if (key.indexOf("$") === 0) {
      result = getGloabData(key, dataset);
    } else {
      result = getPageData(key, dataset, pageData);
    }
    return result;
  } catch (e) {
    console.log(e);
    return "";
  }
};

/**
 * 上报数据
 * @param {Track} track
 * @param {PageData} pageData
 */
const report = (track: Track, pageData: PageData): void => {
  const { element, method } = track;
  const logger: Array<{
    element: string;
    method?: string;
    name: string;
    data: any;
  }> = [];
  track.dataKeys.forEach((name: string) => {
    const data = dataReader(name, track.dataset, pageData);
    logger.push({ element, method, name, data });
  });
  console.table(logger);
};

export default report;
