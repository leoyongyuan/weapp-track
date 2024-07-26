/**
 * 获取页面元素信息
 * @param {string} element 元素class或者id
 * @returns {Promise<{ boundingClientRect: any; scrollOffset: any }>}
 */
export const getBoundingClientRect = function (
  element: string
): Promise<{ boundingClientRect: any; scrollOffset: any }> {
  return new Promise((resolve) => {
    const query = wx.createSelectorQuery();
    query.selectAll(element).boundingClientRect();
    query.selectViewport().scrollOffset();
    query.exec((res: any) =>
      resolve({ boundingClientRect: res[0], scrollOffset: res[1] })
    );
  });
};

/**
 * 判断点击是否落在目标元素
 * @param {Object} clickInfo 用户点击坐标
 * @param {Object} boundingClientRect 目标元素信息
 * @param {Object} scrollOffset 页面位置信息
 * @returns {boolean}
 */
export const isClickTrackArea = function (
  clickInfo: { detail: { x: number; y: number } },
  boundingClientRect: any,
  scrollOffset: { scrollTop: number }
): boolean {
  if (!boundingClientRect) return false;
  const { x, y } = clickInfo.detail; // 点击的x y坐标
  const { left, right, top, height } = boundingClientRect;
  const { scrollTop } = scrollOffset;
  return (
    left < x && x < right && scrollTop + top < y && y < scrollTop + top + height
  );
};

/**
 * 获取当前页面
 * @returns {any} 当前页面Page对象
 */
export const getActivePage = function (): any {
  const curPages = getCurrentPages();
  if (curPages.length) {
    return curPages[curPages.length - 1];
  }
  return {};
};

/**
 * 获取前一页面
 * @returns {any} 前一页面Page对象
 */
export const getPrevPage = function (): any {
  const curPages = getCurrentPages();
  if (curPages.length > 1) {
    return curPages[curPages.length - 2];
  }
  return {};
};

/**
 * 判断是否是Promise
 * @param {any} value 值
 * @returns {boolean}
 */
export const _isPromise = function (value: any): boolean {
  return value && Object.prototype.toString.call(value) === "[object Promise]";
};
