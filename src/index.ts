import Wrapper from "./wrapper";
import {
  getBoundingClientRect,
  isClickTrackArea,
  getActivePage,
} from "./helper";
import report from "./report";
import { Track, TracksConfig } from "./types";

class Tracker extends Wrapper {
  private tracks: Track[];

  constructor({ tracks, isUsingPlugin }: TracksConfig) {
    super(isUsingPlugin);

    // 埋点配置信息
    this.tracks = tracks;
    // 自动给每个page增加weAppElementTracker方法，用作元素埋点
    this.addPageMethodExtra(this.weAppElementTracker());
    this.addPageMethodWrapper(this.weAppMethodTracker());
    this.addComponentMethodWrapper(this.weAppComMethodTracker());
  }

  private weAppElementTracker(): (e: any) => void {
    const elementTracker = (e: any) => {
      const tracks = this.findActivePageTracks("element");
      const { data } = getActivePage();
      tracks.forEach((track) => {
        getBoundingClientRect(track.element).then((res) => {
          res.boundingClientRect.forEach((item: any) => {
            const isHit = isClickTrackArea(e, item, res.scrollOffset);
            track.dataset = item.dataset;
            isHit && report(track, data);
          });
        });
      });
    };
    return elementTracker;
  }

  private weAppMethodTracker(): (
    page: any,
    component: any,
    methodName: string,
    args?: any
  ) => void {
    return (page: any, component: any, methodName: string, args: any = {}) => {
      const tracks = this.findActivePageTracks("method");
      const { data } = getActivePage();
      const { dataset } = args.currentTarget || {};
      tracks.forEach((track) => {
        if (track.method === methodName) {
          track.dataset = dataset;
          report(track, data);
        }
      });
    };
  }

  private weAppComMethodTracker(): (
    this: any,
    page: any,
    component: any,
    methodName: string,
    args?: any
  ) => void {
    var self = this;
    return function (
      page: any,
      component: any,
      methodName: string,
      args: any = {}
    ) {
      const tracks = self.findActivePageTracks("comMethod");
      const data = this.data;
      const { dataset } = args.currentTarget || {};
      tracks.forEach((track) => {
        if (track.method === methodName) {
          track.dataset = dataset;
          report(track, data);
        }
      });
    };
  }

  /**
   * 获取当前页面的埋点配置
   * @param {String} type 返回的埋点配置，options: method/element/comMethod
   * @returns {Object}
   */
  private findActivePageTracks(
    type: "method" | "element" | "comMethod"
  ): Track[] {
    try {
      const { route } = getActivePage();
      const pageTrackConfig: any =
        this.tracks.find((item) => item.path === route) || {};
      let tracks: Track[] = [];
      if (type === "method") {
        tracks = pageTrackConfig.methodTracks || [];
      } else if (type === "element") {
        tracks = pageTrackConfig.elementTracks || [];
      } else if (type === "comMethod") {
        tracks = pageTrackConfig.comMethodTracks || [];
      }
      return tracks;
    } catch (e) {
      return [];
    }
  }
}

export default Tracker;
