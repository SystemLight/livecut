declare class LiveCut {
    handleBox: HTMLDivElement;
    handle: HTMLDivElement;
    mask: HTMLDivElement;
    diffInstance: HTMLImageElement | HTMLCanvasElement | HTMLIFrameElement | null;
    isPersist: boolean;
    startX: number;
    handleWidth: number;
    currentFoldSize: number;
    width: number;
    height: number;
    type: 'img' | 'iframe' | 'reprint' | null;
    private _isBindWindowScroll;
    static geometryConfig: string;
    constructor(diffContent: any, geometry: any, reprint?: boolean);
    _handleWindowScroll: () => void;
    _handleDown: (e: any) => void;
    _handleMove: (e: any) => void;
    _handleUp: () => void;
    static img(imgPath: any, geometry: any): LiveCut;
    static iframe(urlPath: any, geometry: any): LiveCut;
    static reprint(urlPath: any, height: number): LiveCut;
    _renderImage(diffContent: any, geometry: any): void;
    _renderIframe(diffContent: any, geometry: any): void;
    _renderReprint(diffContent: any, geometry: any): void;
    setOpacity(opacity: any): void;
    setDesignGeometry(geometry: any): void;
    offsetDesignView(x: any, y: any): void;
    fold(size: any): void;
    _fold(size: any): void;
    refineHandle(): void;
    resetHandle(): void;
    bindHandle(): void;
    unbindHandle(): void;
    bindWindowScroll(): void;
    unbindWindowScroll(): void;
    appendBody(): void;
    destroy(): void;
}
export default LiveCut;
