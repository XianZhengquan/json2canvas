import { toDataURL } from 'qrcode';

export interface ICanvasProps {
    width: number;
    height: number;
}

export interface ICallback<T> {
    (ctx: CanvasRenderingContext2D, canvasProps: ICanvasProps, items: T): void
}

type ImageType = 'avatar' | 'qrcode';

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
    fontWeight?: string;
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

export type ISourceArray =
    (IImage & { type: 'image' })
    | (IText & { type: 'text' })
    | (IRoundRects & { type: 'round-rect' });

export interface ISourceObject {
    images?: IImage[];
    texts?: IText[];
    roundRects?: IRoundRects[];
}

export type SourceType = ISourceArray[] | ISourceObject;

export interface IJson2canvas {
    (canvasProps: ICanvasProps, scale: number, source: SourceType): Promise<{ url: string }>
}

export interface IImageList extends IImage {
    img: HTMLImageElement;
}

export interface IFillRoundRect {
    (cxt: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number, fillColor?: string): void
}

interface IDrawRoundRectPath {
    (cxt: CanvasRenderingContext2D, width: number, height: number, radius: number): void
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
export const fillRoundRect: IFillRoundRect = (cxt, x, y, width, height, radius, fillColor) => {
    //圆的直径必然要小于矩形的宽高
    if (2 * radius > width || 2 * radius > height) {
        return false;
    }

    cxt.save();
    cxt.translate(x, y);
    //绘制圆角矩形的各个边
    drawRoundRectPath(cxt, width, height, radius);
    cxt.fillStyle = fillColor || '#000'; //若是给定了值就用给定的值否则给予默认值
    cxt.fill();
    cxt.restore();
};

export const drawRoundRectPath: IDrawRoundRectPath = (cxt, width, height, radius) => {
    // @ts-ignore
    cxt.beginPath(0);
    //从右下角顺时针绘制，弧度从0到1/2PI
    cxt.arc(width - radius, height - radius, radius, 0, Math.PI / 2);

    //矩形下边线
    cxt.lineTo(radius, height);

    //左下角圆弧，弧度从1/2PI到PI
    cxt.arc(radius, height - radius, radius, Math.PI / 2, Math.PI);

    //矩形左边线
    cxt.lineTo(0, radius);

    //左上角圆弧，弧度从PI到3/2PI
    cxt.arc(radius, radius, radius, Math.PI, (Math.PI * 3) / 2);

    //上边线
    cxt.lineTo(width - radius, 0);

    //右上角圆弧
    cxt.arc(width - radius, radius, radius, (Math.PI * 3) / 2, Math.PI * 2);

    //右边线
    cxt.lineTo(width, height - radius);
    cxt.closePath();
};

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
export const textAutoBreak: ITextAutoBreak = (ctx, textParams, width, returns) => {
    const {
        x,
        y,
        text,
        size,
        color = '#000000',
        lineHeight = 12,
        font = 'PingFangSC-Medium',
        fontWeight = '',
        textAlign = 'left',
        textBaseline = 'top'
    } = textParams;
    const strSet = new Map<number, string>();

    ctx.fillStyle = color;
    ctx.font = `${ fontWeight } ${ size }px ${ font }`;
    ctx.textAlign = textAlign;
    ctx.textBaseline = textBaseline;

    // 中文标点符号
    const punctuation = [
        '，',
        '。',
        '、',
        '《',
        '》',
        '？',
        '·',
        '~',
        '！',
        '@',
        '#',
        '￥',
        '%',
        '…',
        '&',
        '*',
        '（',
        '）',
        '—',
        '+',
        '=',
        '-',
        '【',
        '】',
        '{',
        '}',
        '、',
        '|',
        '；',
        '：',
        '‘',
        '“',
        '”',
        ',',
        '.',
        '/',
        '<',
        '>',
        '?',
        '`',
        '~',
        '!',
        '@',
        '#',
        '$',
        '%',
        '^',
        '&',
        '*',
        '(',
        ')',
        '_',
        '+',
        '-',
        '=',
        '[',
        ']',
        '{',
        '}',
        '\\',
        '|',
        ';',
        ':',
        '\'',
        '"'
    ];

    // 当前index
    let currentIndex = strSet.size;

    text.split('').forEach((txt, index) => {
        // 之前的
        const beforeTxt = strSet.get(currentIndex) ?? '';
        // 下一个字符
        const nextTxt = text[index + 1];

        // 当前字符是\n 的unicode编码\u000A为则自动换行， txt表示当前行
        if (text[index].charCodeAt(0).toString(16) === 'a') {
            strSet.set(++currentIndex, '');
            return;
        }

        // 如果下一个字符是 标点符号
        if (punctuation.includes(nextTxt)) {
            if (ctx.measureText(beforeTxt + txt + nextTxt).width < width) {
                strSet.set(currentIndex, beforeTxt + txt);
            } else {
                strSet.set(++currentIndex, txt);
            }
        } else if (ctx.measureText(beforeTxt).width < width) {
            strSet.set(currentIndex, beforeTxt + txt);
        } else {
            strSet.set(++currentIndex, txt);
        }
    });

    const texts: string[] = Array.from(strSet.values());

    if (returns) return texts.length * lineHeight;

    texts.forEach((item, index) => {
        if (index === 0) {
            ctx.fillText(item, x, y);
        } else {
            ctx.fillText(item, x, y + index * lineHeight);
        }
    });
};

const json2canvas: IJson2canvas = async (canvasProps = { width: 375, height: 607 }, scale = 2, source) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    canvas.width = canvasProps.width * scale;
    canvas.height = canvasProps.height * scale;
    if (Array.isArray(source)) {
        for (const item of source) {
            if (item.type === 'image') {
                // 加载图片
                try {
                    if (item.name === 'qrcode') {
                        toDataURL(document.createElement('canvas'), item.url, (err, res) => {
                            // if (!err) item.url = generateImgUrl(res) as string;
                            if (!err) item.url = res;
                        });
                    }
                    const imgItem = await loadImage(item.url);
                    const {
                        x,
                        y,
                        width,
                        height,
                        borderColor = '#ffffff',
                        lineWidth = 4,
                        callback
                    } = item;
                    if (callback) {
                        callback(ctx, { width: canvas.width, height: canvas.height }, { ...item, img: imgItem });
                    } else if (item.name === 'avatar') {
                        // 在 clip() 之前保存canvas状态
                        ctx.save();
                        ctx.strokeStyle = borderColor;
                        ctx.lineWidth = lineWidth * scale;
                        ctx.beginPath();
                        ctx.arc(
                            (x + width / 2) * scale,
                            (y + width / 2) * scale,
                            (width * scale) / 2,
                            0,
                            2 * Math.PI,
                            false
                        );
                        ctx.stroke();
                        ctx.clip();
                        ctx.drawImage(imgItem, x * scale, y * scale, width * scale, height * scale);
                        // 恢复到上面save()时的状态
                        ctx.restore();
                    } else {
                        ctx.drawImage(imgItem, x * scale, y * scale, width * scale, height * scale);
                    }
                } catch (e) {
                    return Promise.reject(`图片加载错误：${ item.name ?? '图片名称' } - ${ item.url }`);
                }
            } else if (item.type === 'round-rect') {
                const { width, height, x, y, radius, color, callback } = item;
                if (callback) {
                    callback(ctx, { width: canvas.width, height: canvas.height }, item);
                } else {
                    fillRoundRect(
                        ctx,
                        x * scale,
                        y * scale,
                        width * scale,
                        height * scale,
                        radius * scale,
                        color
                    );
                }
            } else if (item.type === 'text') {
                const {
                    x,
                    y,
                    size,
                    text,
                    font = 'PingFangSC-Medium',
                    fontWeight = '',
                    color = '#000',
                    textAlign = 'left',
                    textBaseline = 'top',
                    autoBreak = false,
                    lineHeight = 24,
                    width = 0,
                    callback
                } = item;
                if (callback) {
                    callback(ctx, { width: canvas.width, height: canvas.height }, item);
                } else if (autoBreak) {
                    textAutoBreak(
                        ctx,
                        {
                            x: x * scale,
                            y: y * scale,
                            text,
                            font,
                            fontWeight,
                            color,
                            textAlign,
                            textBaseline,
                            size: size * scale,
                            lineHeight: lineHeight * scale
                        },
                        width * 2
                    );
                } else {
                    ctx.fillStyle = color;
                    ctx.font = `${ fontWeight } ${ size * scale }px ${ font }`;
                    ctx.textAlign = textAlign;
                    ctx.textBaseline = textBaseline;
                    ctx.fillText(text, x * scale, y * scale);
                }
            }
        }
    } else {
        const { images = [], texts = [], roundRects = [] } = source;

        // 加载图片
        const imageList: IImageList[] = [];
        for (const item of images) {
            try {
                if (item.name === 'qrcode') {
                    toDataURL(document.createElement('canvas'), item.url, (err, res) => {
                        // if (!err) item.url = generateImgUrl(res) as string;
                        if (!err) item.url = res;
                    });
                }
                const imgItem = await loadImage(item.url);
                imageList.push({ ...item, img: imgItem });
            } catch (e) {
                return Promise.reject(`图片加载错误：${ item.name ?? '图片名称' } - ${ item.url }`);
            }
        }

        // 绘制图片
        if (imageList?.length > 0)
            imageList.forEach(image => {
                const {
                    x,
                    y,
                    width,
                    height,
                    img,
                    borderColor = '#ffffff',
                    lineWidth = 4,
                    callback
                } = image;
                if (callback) {
                    callback(ctx, { width: canvas.width, height: canvas.height }, image);
                } else if (image.name === 'avatar') {
                    // 在 clip() 之前保存canvas状态
                    ctx.save();
                    ctx.strokeStyle = borderColor;
                    ctx.lineWidth = lineWidth * scale;
                    ctx.beginPath();
                    ctx.arc(
                        (x + width / 2) * scale,
                        (y + width / 2) * scale,
                        (width * scale) / 2,
                        0,
                        2 * Math.PI,
                        false
                    );
                    ctx.stroke();
                    ctx.clip();
                    ctx.drawImage(img, x * scale, y * scale, width * scale, height * scale);
                    // 恢复到上面save()时的状态
                    ctx.restore();
                } else {
                    ctx.drawImage(img, x * scale, y * scale, width * scale, height * scale);
                }
            });

        // 绘制圆角矩形
        if (roundRects?.length > 0)
            roundRects.forEach(rr => {
                const { width, height, x, y, radius, color, callback } = rr;
                if (callback) {
                    callback(ctx, { width: canvas.width, height: canvas.height }, rr);
                } else {
                    fillRoundRect(
                        ctx,
                        x * scale,
                        y * scale,
                        width * scale,
                        height * scale,
                        radius * scale,
                        color
                    );
                }
            });

        // 绘制文字
        if (texts?.length > 0)
            texts.forEach(txt => {
                const {
                    x,
                    y,
                    size,
                    text,
                    font = 'PingFangSC-Medium',
                    fontWeight = '',
                    color = '#000',
                    textAlign = 'left',
                    textBaseline = 'top',
                    autoBreak = false,
                    lineHeight = 24,
                    width = 0,
                    callback
                } = txt;
                if (callback) {
                    callback(ctx, { width: canvas.width, height: canvas.height }, txt);
                } else if (autoBreak) {
                    textAutoBreak(
                        ctx,
                        {
                            x: x * scale,
                            y: y * scale,
                            text,
                            font,
                            fontWeight,
                            color,
                            textAlign,
                            textBaseline,
                            size: size * scale,
                            lineHeight: lineHeight * scale
                        },
                        width * 2
                    );
                } else {
                    ctx.fillStyle = color;
                    ctx.font = ` ${ fontWeight } ${ size * scale }px ${ font }`;
                    ctx.textAlign = textAlign;
                    ctx.textBaseline = textBaseline;
                    ctx.fillText(text, x * scale, y * scale);
                }
            });
    }
    return {
        url: canvas.toDataURL('image/png')
    };
};

/**
 * 加载图片
 * @param {string} url
 * @return {Promise<HTMLImageElement>}
 */
function loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const imgItem = new Image();
        if (url.match(/^https?/)) imgItem.crossOrigin = 'anonymous';
        imgItem.onload = () => {
            resolve(imgItem);
        };
        imgItem.onerror = () => {
            reject('图片加载失败');
        };
        imgItem.src = url;
    });
}

export default json2canvas;
