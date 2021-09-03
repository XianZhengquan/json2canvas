import { ImageName, Json2canvas, SourceItemType } from './type';
import { toDataURL } from 'qrcode';
import { fillRoundRect, loadImage, textAutoBreak } from './util';

export * from './type';
export * from './util';

export const json2canvas: Json2canvas = async (props) => {
    const { canvasProps, scale, source } = props;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    canvas.width = canvasProps.width * scale;
    canvas.height = canvasProps.height * scale;

    for (const sourceItem of source) {
        if (sourceItem.type === SourceItemType.Image) {
            const {
                name,
                borderColor = '#ffffff',
                callback
            } = sourceItem;
            const x = sourceItem.x * scale;
            const y = sourceItem.y * scale;
            const width = sourceItem.width * scale;
            const height = sourceItem.height * scale;
            const lineWidth = (sourceItem?.lineWidth ?? 4) * scale;

            if (name === ImageName.Qrcode) {
                toDataURL(document.createElement('canvas'), sourceItem.url, (err, res) => {
                    if (!err) sourceItem.url = res;
                });
            }
            try {
                const Image = await loadImage(sourceItem.url);
                if (callback) {
                    callback(
                        ctx,
                        {
                            width: canvas.width,
                            height: canvas.height
                        },
                        {
                            x,
                            y,
                            width,
                            height,
                            borderColor,
                            lineWidth,
                            url: sourceItem.url,
                            image: Image
                        }
                    );
                } else if (name === ImageName.Avatar) {
                    // 在 clip() 之前保存canvas状态
                    ctx.save();
                    ctx.strokeStyle = borderColor;
                    ctx.lineWidth = lineWidth * scale;
                    ctx.beginPath();
                    ctx.arc(
                        x + width / 2,
                        y + width / 2,
                        width / 2,
                        0,
                        2 * Math.PI,
                        false
                    );
                    ctx.stroke();
                    ctx.clip();
                    ctx.drawImage(Image, x, y, width, height);
                    // 恢复到上面save()时的状态
                    ctx.restore();
                } else {
                    ctx.drawImage(Image, x, y, width, height);
                }
            } catch (e) {
                console.error(e, `图片地址：${ sourceItem.url }`);
            }
        } else if (sourceItem.type === SourceItemType.Text) {
            const {
                text,
                color = '#000',
                fontWeight = '',
                fontFamily = 'PingFangSC-Medium',
                textAlign = 'left',
                textBaseline = 'top',
                callback
            } = sourceItem;
            const x = sourceItem.x * scale;
            const y = sourceItem.y * scale;
            const fontSize = sourceItem.fontSize * scale;
            const autoBreak = sourceItem.autoBreak ? {
                width: sourceItem.autoBreak.width * scale,
                lineHeight: sourceItem.autoBreak.lineHeight * scale
            } : undefined;

            if (callback) {
                callback(
                    ctx,
                    { width: canvas.width, height: canvas.height },
                    {
                        x,
                        y,
                        fontSize,
                        autoBreak,
                        text,
                        color,
                        fontWeight,
                        fontFamily,
                        textAlign,
                        textBaseline
                    }
                );
            } else if (autoBreak) {
                textAutoBreak(ctx, {
                    x,
                    y,
                    fontSize,
                    ...autoBreak,
                    text,
                    color,
                    fontWeight,
                    fontFamily,
                    textAlign,
                    textBaseline
                });
            } else {
                ctx.fillStyle = color;
                ctx.font = `${ fontWeight } ${ fontSize }px ${ fontFamily }`;
                ctx.textAlign = textAlign;
                ctx.textBaseline = textBaseline;
                ctx.fillText(text, x, y);
            }
        } else if (sourceItem.type === SourceItemType.RoundRect) {
            const {
                callback,
                backgroundColor
            } = sourceItem;
            const x = sourceItem.x * scale;
            const y = sourceItem.y * scale;
            const width = sourceItem.width * scale;
            const height = sourceItem.height * scale;
            const radius = sourceItem.radius * scale;

            if (callback) {
                callback(
                    ctx,
                    { width: canvas.width, height: canvas.height },
                    {
                        x,
                        y,
                        width,
                        height,
                        radius,
                        backgroundColor
                    }
                );
            } else {
                fillRoundRect(
                    ctx,
                    {
                        x,
                        y,
                        width,
                        height,
                        radius,
                        backgroundColor
                    }
                );
            }
        }
    }

    return Promise.resolve(canvas.toDataURL('image/png'));
};

export default json2canvas;
