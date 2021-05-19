export interface ICanvasProps {
    width: number;
    height: number;
}
export interface ICallback<T> {
    (ctx: CanvasRenderingContext2D, canvasProps: ICanvasProps, items: T): void;
}
declare type ImageType = 'avatar' | 'qrcode';
export interface IImage {
    x: number;
    y: number;
    width: number;
    height: number;
    url: string;
    name?: ImageType;
    borderColor?: string;
    lineWidth?: number;
    callback?: ICallback<IImage>;
}
export interface IText {
    x: number;
    y: number;
    width?: number;
    lineHeight?: number;
    text: string;
    autoBreak?: boolean;
    color?: string;
    size: number;
    font?: string;
    textAlign?: CanvasTextAlign;
    textBaseline?: CanvasTextBaseline;
    callback?: ICallback<IText>;
}
export interface IRoundRects {
    x: number;
    y: number;
    width: number;
    height: number;
    radius: number;
    color?: string;
    callback?: ICallback<IRoundRects>;
}
export interface ISource {
    images?: IImage[];
    texts?: IText[];
    roundRects?: IRoundRects[];
}
export interface IJson2canvas {
    (canvasProps: ICanvasProps, scale: number, source: ISource): Promise<{
        url: string;
    }>;
}
export interface IImageList extends IImage {
    img: HTMLImageElement;
}
export interface IFillRoundRect {
    (cxt: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number, fillColor?: string): void;
}
declare const json2canvas: IJson2canvas;
export default json2canvas;
