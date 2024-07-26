const globalVarApp = App; // 小程序原App对象
const globalVarPage = Page; // 小程序原Page对象
const globalVarComponent = Component; // 小程序原Component对象
import { Method, PageOrApp, Component } from "./types";
class Wrapper {
  private injectPageMethods: Method[];
  private injectAppMethods: Method[];
  private extraPageMethods: Method[];
  private extraAppMethods: Method[];
  private injectComponentMethods: Method[];
  private extraComponentMethods: Method[];

  constructor(isUsingPlugin: boolean) {
    this.injectPageMethods = [];
    this.injectAppMethods = [];
    this.extraPageMethods = [];
    this.extraAppMethods = [];
    this.injectComponentMethods = [];
    this.extraComponentMethods = [];
    if (!isUsingPlugin) {
      App = (app: PageOrApp) =>
        globalVarApp(
          this._create(app, this.injectAppMethods, this.extraAppMethods)
        );
      Page = (page: PageOrApp) =>
        globalVarPage(
          this._create(page, this.injectPageMethods, this.extraPageMethods)
        );
      Component = (component: any) =>
        globalVarComponent(
          this._createComponent(
            component,
            this.injectComponentMethods,
            this.extraComponentMethods
          )
        );
    }
  }

  /**
   * 对用户定义函数进行包装.
   * @param {Object} target page对象或者app对象
   * @param {String} methodName 需要包装的函数名
   * @param {Array} methods 函数执行前执行任务
   */
  private _wrapTargetMethod(
    target: PageOrApp,
    component: Component | null,
    methodName: string,
    methods: Method[] = []
  ): void {
    const methodFunction = target[methodName] as Method;
    target[methodName] = function _aa(...args: any[]) {
      const result = methodFunction && methodFunction.apply(this, args);
      const methodExcuter = () => {
        methods.forEach((fn) => {
          fn.apply(this, [target, component, methodName, ...args]);
        });
      };
      try {
        if (Object.prototype.toString.call(result) === "[object Promise]") {
          result
            .then(() => {
              methodExcuter();
            })
            .catch(() => {
              methodExcuter();
            });
        } else {
          methodExcuter();
        }
      } catch (e) {
        console.error(methodName, "钩子函数执行出现错误", e);
      }
      return result;
    };
  }

  /**
   * 追加函数到Page/App对象
   * @param {Object} target page对象或者app对象
   * @param {Array} methods 需要追加的函数数组
   */
  private _addExtraMethod(target: PageOrApp, methods: Method[]): void {
    methods.forEach((fn) => {
      const methodName = fn.name;
      target[methodName] = fn;
    });
  }

  /**
   * @param {*} target page对象或者app对象
   * @param {*} methods 需要插入执行的函数
   */
  private _create(
    target: PageOrApp,
    injectMethods: Method[],
    extraMethods: Method[]
  ): PageOrApp {
    Object.keys(target)
      .filter((prop) => typeof target[prop] === "function")
      .forEach((methodName) => {
        this._wrapTargetMethod(target, null, methodName, injectMethods);
      });
    this._addExtraMethod(target, extraMethods);
    return target;
  }

  private _createComponent(
    component: Component,
    injectMethods: Method[],
    extraMethods: Method[]
  ): Component {
    const target = component.methods;
    Object.keys(target)
      .filter((prop) => typeof target[prop] === "function")
      .forEach((methodName) => {
        this._wrapTargetMethod(target, component, methodName, injectMethods);
      });
    this._addExtraMethod(target, extraMethods);
    return component;
  }

  public addPageMethodWrapper(fn: Method): void {
    this.injectPageMethods.push(fn);
  }

  public addComponentMethodWrapper(fn: Method): void {
    this.injectComponentMethods.push(fn);
  }

  public addAppMethodWrapper(fn: Method): void {
    this.injectAppMethods.push(fn);
  }

  public addPageMethodExtra(fn: Method): void {
    this.extraPageMethods.push(fn);
  }

  public addAppMethodExtra(fn: Method): void {
    this.extraAppMethods.push(fn);
  }

  public createApp(app: PageOrApp): void {
    globalVarApp(
      this._create(app, this.injectAppMethods, this.extraAppMethods)
    );
  }

  public createPage(page: PageOrApp): void {
    globalVarPage(
      this._create(page, this.injectPageMethods, this.extraPageMethods)
    );
  }

  public createComponent(component: Component): void {
    globalVarComponent(
      this._createComponent(
        component,
        this.injectComponentMethods,
        this.extraComponentMethods
      )
    );
  }
}

export default Wrapper;
