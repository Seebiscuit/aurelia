import { IContainer, Key } from '@aurelia/kernel';
import { ICustomElementController, ICustomElementViewModel } from '@aurelia/runtime';
import { InstructionResolver, IRouteSeparators } from './instruction-resolver';
import { INavigatorInstruction, NavigationInstruction, IRoute, ComponentAppellation, ViewportHandle, ComponentParameters } from './interfaces';
import { AnchorEventInfo, LinkHandler } from './link-handler';
import { INavRoute, Nav } from './nav';
import { INavigatorOptions, Navigator } from './navigator';
import { QueueItem } from './queue';
import { INavClasses } from './resources/nav';
import { IViewportOptions, Viewport } from './viewport';
import { ViewportInstruction } from './viewport-instruction';
import { HookManager, IHookDefinition, HookIdentity, HookFunction, IHookOptions, BeforeNavigationHookFunction, TransformFromUrlHookFunction, TransformToUrlHookFunction } from './hook-manager';
import { Scope } from './scope';
import { IViewportScopeOptions, ViewportScope } from './viewport-scope';
import { BrowserViewerStore } from './browser-viewer-store';
/**
 * Public API
 */
export interface IGotoOptions {
    title?: string;
    query?: string;
    data?: Record<string, unknown>;
    replace?: boolean;
    append?: boolean;
    origin?: ICustomElementViewModel | Element;
}
/**
 * Public API
 */
export interface IRouterOptions extends INavigatorOptions {
    separators?: IRouteSeparators;
    useUrlFragmentHash?: boolean;
    useHref?: boolean;
    statefulHistoryLength?: number;
    useDirectRoutes?: boolean;
    useConfiguredRoutes?: boolean;
    hooks?: IHookDefinition[];
    reportCallback?(instruction: INavigatorInstruction): void;
}
/**
 * Public API
 */
export interface IRouter {
    readonly isNavigating: boolean;
    activeComponents: ViewportInstruction[];
    readonly rootScope: ViewportScope | null;
    readonly activeRoute?: IRoute;
    readonly container: IContainer;
    readonly instructionResolver: InstructionResolver;
    navigator: Navigator;
    readonly navigation: BrowserViewerStore;
    readonly hookManager: HookManager;
    readonly linkHandler: LinkHandler;
    readonly navs: Readonly<Record<string, Nav>>;
    readonly options: IRouterOptions;
    readonly statefulHistory: boolean;
    activate(options?: IRouterOptions): void;
    loadUrl(): Promise<void>;
    deactivate(): void;
    linkCallback(info: AnchorEventInfo): void;
    processNavigations(qInstruction: QueueItem<INavigatorInstruction>): Promise<void>;
    getViewport(name: string): Viewport | null;
    setClosestScope(viewModelOrContainer: ICustomElementViewModel | IContainer, scope: Scope): void;
    getClosestScope(viewModelOrElement: ICustomElementViewModel | Element | ICustomElementController | IContainer): Scope | null;
    unsetClosestScope(viewModelOrContainer: ICustomElementViewModel | IContainer): void;
    connectViewport(viewport: Viewport | null, container: IContainer, name: string, element: Element, options?: IViewportOptions): Viewport;
    disconnectViewport(viewport: Viewport, container: IContainer, element: Element | null): void;
    connectViewportScope(viewportScope: ViewportScope | null, name: string, container: IContainer, element: Element, options?: IViewportScopeOptions): ViewportScope;
    disconnectViewportScope(viewportScope: ViewportScope, container: IContainer): void;
    allViewports(includeDisabled?: boolean): Viewport[];
    findScope(elementOrViewmodelOrviewport: Element | ICustomElementViewModel | Viewport | ICustomElementController | null): Scope;
    goto(instructions: NavigationInstruction | NavigationInstruction[], options?: IGotoOptions): Promise<void>;
    refresh(): Promise<void>;
    back(): Promise<void>;
    forward(): Promise<void>;
    checkActive(instructions: ViewportInstruction[]): boolean;
    setNav(name: string, routes: INavRoute[], classes?: INavClasses): void;
    addNav(name: string, routes: INavRoute[], classes?: INavClasses): void;
    updateNav(name?: string): void;
    findNav(name: string): Nav;
    addRoutes(routes: IRoute[], context?: ICustomElementViewModel | Element): IRoute[];
    removeRoutes(routes: IRoute[] | string[], context?: ICustomElementViewModel | Element): void;
    addHooks(hooks: IHookDefinition[]): HookIdentity[];
    addHook(beforeNavigationHookFunction: BeforeNavigationHookFunction, options?: IHookOptions): HookIdentity;
    addHook(transformFromUrlHookFunction: TransformFromUrlHookFunction, options?: IHookOptions): HookIdentity;
    addHook(transformToUrlHookFunction: TransformToUrlHookFunction, options?: IHookOptions): HookIdentity;
    addHook(hook: HookFunction, options: IHookOptions): HookIdentity;
    removeHooks(hooks: HookIdentity[]): void;
    createViewportInstruction(component: ComponentAppellation, viewport?: ViewportHandle, parameters?: ComponentParameters, ownsScope?: boolean, nextScopeInstructions?: ViewportInstruction[] | null): ViewportInstruction;
}
export declare const IRouter: import("@aurelia/kernel").InterfaceSymbol<IRouter>;
export declare class Router implements IRouter {
    static readonly inject: readonly Key[];
    rootScope: ViewportScope | null;
    /**
     * Public API
     */
    activeComponents: ViewportInstruction[];
    /**
     * Public API
     */
    activeRoute?: IRoute;
    private isActive;
    private loadedFirst;
    private processingNavigation;
    private lastNavigation;
    private staleChecks;
    constructor(
    /**
     * @internal - Shouldn't be used directly.
     */
    container: IContainer, 
    /**
     * @internal - Shouldn't be used directly.
     */
    navigator: Navigator, 
    /**
     * @internal - Shouldn't be used directly.
     */
    navigation: BrowserViewerStore, 
    /**
     * @internal - Shouldn't be used directly.
     */
    linkHandler: LinkHandler, 
    /**
     * @internal - Shouldn't be used directly. Probably.
     */
    instructionResolver: InstructionResolver);
    /**
     * Public API
     */
    get isNavigating(): boolean;
    /**
     * Public API
     */
    activate(options?: IRouterOptions): void;
    /**
     * Public API
     */
    loadUrl(): Promise<void>;
    /**
     * Public API
     */
    deactivate(): void;
    /**
     * Public API - Get viewport by name
     */
    getViewport(name: string): Viewport | null;
    /**
     * Public API (not yet implemented)
     */
    addViewport(...args: unknown[]): unknown;
    /**
     * Public API (not yet implemented)
     */
    findViewportScope(...args: unknown[]): unknown;
    /**
     * Public API (not yet implemented)
     */
    addViewportScope(...args: unknown[]): unknown;
    /**
     * Public API - THE navigation API
     */
    goto(instructions: NavigationInstruction | NavigationInstruction[], options?: IGotoOptions): Promise<void>;
    /**
     * Public API
     */
    refresh(): Promise<void>;
    /**
     * Public API
     */
    back(): Promise<void>;
    /**
     * Public API
     */
    forward(): Promise<void>;
    /**
     * Public API
     */
    checkActive(instructions: ViewportInstruction[]): boolean;
    /**
     * Public API
     */
    setNav(name: string, routes: INavRoute[], classes?: INavClasses): void;
    /**
     * Public API
     */
    addNav(name: string, routes: INavRoute[], classes?: INavClasses): void;
    /**
     * Public API
     */
    updateNav(name?: string): void;
    /**
     * Public API
     */
    findNav(name: string): Nav;
    /**
     * Public API
     */
    addRoutes(routes: IRoute[], context?: ICustomElementViewModel | Element): IRoute[];
    /**
     * Public API
     */
    removeRoutes(routes: IRoute[] | string[], context?: ICustomElementViewModel | Element): void;
    /**
     * Public API
     */
    addHooks(hooks: IHookDefinition[]): HookIdentity[];
    /**
     * Public API
     */
    addHook(beforeNavigationHookFunction: BeforeNavigationHookFunction, options?: IHookOptions): HookIdentity;
    addHook(transformFromUrlHookFunction: TransformFromUrlHookFunction, options?: IHookOptions): HookIdentity;
    addHook(transformToUrlHookFunction: TransformToUrlHookFunction, options?: IHookOptions): HookIdentity;
    addHook(hookFunction: HookFunction, options?: IHookOptions): HookIdentity;
    /**
     * Public API
     */
    removeHooks(hooks: HookIdentity[]): void;
    /**
     * Public API - The right way to create ViewportInstructions
     */
    createViewportInstruction(component: ComponentAppellation, viewport?: ViewportHandle, parameters?: ComponentParameters, ownsScope?: boolean, nextScopeInstructions?: ViewportInstruction[] | null): ViewportInstruction;
    private findInstructions;
    private hasSiblingInstructions;
    private appendInstructions;
    private checkStale;
    private unknownRoute;
    private findViewports;
    private cancelNavigation;
    private ensureRootScope;
    private replacePaths;
    private freeComponents;
    private getClosestContainer;
    private getContainer;
    private CustomElementFor;
}
//# sourceMappingURL=router.d.ts.map