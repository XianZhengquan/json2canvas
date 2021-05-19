import {toDataURL} from 'qrcode';

interface ICanvasProps {
    width: number;
    height: number;
}

interface ICallback<T> {
    (ctx: CanvasRenderingContext2D, canvasProps: ICanvasProps, items: T): void
}

type ImageType = 'avatar' | 'qrcode';

interface IImage {
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

interface IText {
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

interface IRoundRects {
    x: number;
    y: number;
    width: number;
    height: number;
    radius: number;
    color?: string;
    callback?: ICallback<IRoundRects>;
}

interface ISource {
    images?: IImage[];
    texts?: IText[];
    roundRects?: IRoundRects[];
}

interface IJson2canvas {
    (canvasProps: ICanvasProps, scale: number, source: ISource): Promise<{ url: string }>
}

interface IImageList extends IImage {
    img: HTMLImageElement;
}

interface IFillRoundRect {
    (cxt: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number, fillColor?: string): void
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
const fillRoundRect: IFillRoundRect = (cxt, x, y, width, height, radius, fillColor) => {
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

interface IDrawRoundRectPath {
    (cxt: CanvasRenderingContext2D, width: number, height: number, radius: number): void
}

const drawRoundRectPath: IDrawRoundRectPath = (cxt, width, height, radius) => {
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

// 处理二维码
const generateImgUrl = (imgUrl: string) => {
    let objectUrl = null;
    if (imgUrl.match(/^data:(.*);base64,/) && window.URL && URL.createObjectURL) {
        objectUrl = URL.createObjectURL(dataURL2blob(imgUrl));
        //
        imgUrl = objectUrl;
        return imgUrl;
    }
};
const dataURL2blob = (dataURL: string) => {
    const binaryString = atob(dataURL.split(',')[1]);
    const arrayBuffer = new ArrayBuffer(binaryString.length);
    const intArray = new Uint8Array(arrayBuffer);
    // @ts-ignore
    const mime = dataURL.split(',')[0].match(/:(.*?);/)[1];
    for (let i = 0, j = binaryString.length; i < j; i += 1) {
        intArray[i] = binaryString.charCodeAt(i);
    }
    const data = [intArray];
    let result;
    try {
        result = new Blob(data, {type: mime});
    } catch (error) {
        // @ts-ignore
        window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder;
        // @ts-ignore
        if (error.name === 'TypeError' && window.BlobBuilder) {
            // @ts-ignore
            const builder = new window.BlobBuilder();
            builder.append(arrayBuffer);
            result = builder.getBlob();
        } else {
            throw new Error('没救了');
        }
    }
    return result;
};

interface ITextAutoBreak {
    (cxt: CanvasRenderingContext2D, textParams: IText, width: number): void
}

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
const textAutoBreak: ITextAutoBreak = (
    ctx,
    textParams = {
        x: 0,
        y: 0,
        text: '',
        size: 12,
        color: '#000000',
        font: 'PingFangSC-Medium',
        lineHeight: 12,
        textAlign: 'left',
        textBaseline: 'middle'
    },
    width
) => {
    const {
        x,
        y,
        text,
        size,
        color = '#000000',
        lineHeight = 12,
        font = 'PingFangSC-Medium',
        textAlign = 'left',
        textBaseline = 'middle'
    } = textParams;
    const strSet = new Map<number, string>();

    ctx.fillStyle = color;
    ctx.font = `${size}px ${font}`;
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

        // 如果下一个字符是 标点符号
        if (punctuation.includes(nextTxt)) {
            if (ctx.measureText(beforeTxt + txt + nextTxt).width < width) {
                strSet.set(currentIndex, beforeTxt + txt);
            } else {
                // eslint-disable-next-line no-plusplus
                strSet.set(++currentIndex, txt);
            }
        } else if (ctx.measureText(beforeTxt).width < width) {
            strSet.set(currentIndex, beforeTxt + txt);
        } else {
            // eslint-disable-next-line no-plusplus
            strSet.set(++currentIndex, txt);
        }
    });

    // @ts-ignore
    const texts: string[] = [...strSet.values()];

    texts.forEach((item, index) => {
        if (index === 0) {
            ctx.fillText(item, x, y);
        } else {
            ctx.fillText(item, x, y + index * lineHeight);
        }
    });
};

const json2canvas: IJson2canvas = async (canvasProps = {width: 375, height: 607}, scale = 2, source) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    canvas.width = canvasProps.width * scale;
    canvas.height = canvasProps.height * scale;

    const {images = [], texts = [], roundRects = []} = source;

    // 加载图片
    const imageList: IImageList[] = [];
    for (const item of images) {
        try {
            if (item.name === 'qrcode') {
                toDataURL(document.createElement('canvas'), item.url, (err, res) => {
                    if (!err) item.url = generateImgUrl(res) as string;
                });
            }
            const imgItem = await loadImage(item.url);
            imageList.push({...item, img: imgItem});
        } catch (e) {
            return Promise.reject(`图片加载错误：${item.name ?? '图片名称'} - ${item.url}`);
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
                callback(ctx, {width: canvas.width, height: canvas.height}, image);
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
            const {width, height, x, y, radius, color, callback} = rr;
            if (callback) {
                callback(ctx, {width: canvas.width, height: canvas.height}, rr);
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
                color = '#000',
                textAlign = 'left',
                textBaseline = 'middle',
                autoBreak = false,
                lineHeight = 24,
                width = 0,
                callback
            } = txt;
            if (callback) {
                callback(ctx, {width: canvas.width, height: canvas.height}, txt);
            } else if (autoBreak) {
                textAutoBreak(
                    ctx,
                    {
                        x: x * scale,
                        y: y * scale,
                        text,
                        font,
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
                ctx.font = `${size * scale}px ${font}`;
                ctx.textAlign = textAlign;
                ctx.textBaseline = textBaseline;
                ctx.fillText(text, x * scale, y * scale);
            }
        });

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
