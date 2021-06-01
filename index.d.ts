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
    order?: number;
    callback?: ICallback<IImageList>;
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
    order?: number;
    callback?: ICallback<IText>;
}
export interface IRoundRects {
    x: number;
    y: number;
    width: number;
    height: number;
    radius: number;
    color?: string;
    order?: number;
    callback?: ICallback<IRoundRects>;
}
export declare type ISourceArray = (IImage & {
    type: 'image';
}) | (IText & {
    type: 'text';
}) | (IRoundRects & {
    type: 'round-rect';
});
export interface ISourceObject {
    images?: IImage[];
    texts?: IText[];
    roundRects?: IRoundRects[];
}
export declare type SourceType = ISourceArray[] | ISourceObject;
export interface IJson2canvas {
    (canvasProps: ICanvasProps, scale: number, source: SourceType): Promise<{
        url: string;
    }>;
}
export interface IImageList extends IImage {
    img: HTMLImageElement;
}
export interface IFillRoundRect {
    (cxt: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number, fillColor?: string): void;
}
interface IDrawRoundRectPath {
    (cxt: CanvasRenderingContext2D, width: number, height: number, radius: number): void;
}
interface ITextAutoBreak {
    (cxt: CanvasRenderingContext2D, textParams: IText, width: number, returns?: boolean): number | void;
}
/**
 * 该方法用来绘制一个有填充色的圆角矩形
 * @param cxt:canvas的上下文环境
 * @param {number} x:左上角x轴坐标
 * @param {number} y:左上角y轴坐标
 * @param {number} width:矩形的宽度
 * @param {number} height:矩形的高度
 * @param {number} radius:圆的半径
 * @param {string} fillColor:填充颜色
 **/
export declare const fillRoundRect: IFillRoundRect;
export declare const drawRoundRectPath: IDrawRoundRectPath;
/**
 * canvas 文字自动换行
 * @param ctx
 * @param {number} textParams.x 文本绘制于canvas x轴坐标
 * @param {number} textParams.y 文本绘制于canvas y轴坐标
 * @param {string} textParams.text 文本
 * @param {number} textParams.size 文字大小
 * @param {string} textParams.color 文字颜色
 * @param {number} textParams.lineHeight 文本行高，换行后的文本距离上一行文本的间距
 * @param {string} textParams.textAlign 文本水平对齐方式 默认left
 * @param {string} textParams.textBaseline 文本垂直对齐方式，默认middle
 * @param {number} width 文本区域宽度 超过宽度换行
 * @description 这里接受的所有数值参数都是经过scale了的
 */
export declare const textAutoBreak: ITextAutoBreak;
declare const json2canvas: IJson2canvas;
export default json2canvas;
