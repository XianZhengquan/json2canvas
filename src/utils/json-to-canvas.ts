import {
  ICanvasProps,
  IExtraType,
  IImageType,
  ImageName,
  IRoundRectType,
  ITextType,
  Json2canvasSource,
  SourceItemType
} from '../types';
import { toDataURL } from 'qrcode';
import loadImage from './load-image';
import textAutoBreak from './text-auto-breack';
import fillRoundRect from './fill-round-rect';

interface IGenerateCommonProps {
  canvasProps: ICanvasProps;
  ctx: CanvasRenderingContext2D;
  scale: number;
}

interface GenerateImageProps extends IGenerateCommonProps {
  sourceItem: IImageType;
}

interface GenerateTextProps extends IGenerateCommonProps {
  sourceItem: ITextType;
}

interface GenerateRoundRectProps extends IGenerateCommonProps {
  sourceItem: IRoundRectType;
}

interface GenerateExtraProps extends IGenerateCommonProps {
  sourceItem: IExtraType;
}

const generateImage = async (props: GenerateImageProps) => {
  const { canvasProps, ctx, scale, sourceItem } = props;
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
        canvasProps,
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
};
const generateText = (props: GenerateTextProps) => {
  const { canvasProps, ctx, scale, sourceItem } = props;
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
      canvasProps,
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
};
const generateRoundRect = (props: GenerateRoundRectProps) => {
  const { canvasProps, ctx, scale, sourceItem } = props;
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
      canvasProps,
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
};
const generateExtra = (props: GenerateExtraProps) => {
  const { canvasProps, ctx, sourceItem } = props;
  const { callback } = sourceItem;
  callback?.(
    ctx,
    canvasProps,
    {}
  );
};

export interface IJson2canvasProps {
  canvasProps: ICanvasProps;
  scale: number;
  source: Json2canvasSource;
}

export type Json2canvas = (props: IJson2canvasProps) => Promise<string>

const json2canvas: Json2canvas = async ({ canvasProps, scale, source }) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  canvas.width = canvasProps.width * scale;
  canvas.height = canvasProps.height * scale;

  for (const sourceItem of source) {
    switch (sourceItem.type) {
      case SourceItemType.Image:
        await generateImage({ canvasProps: { width: canvas.width, height: canvas.height }, ctx, sourceItem, scale });
        break;
      case SourceItemType.Text:
        generateText({ canvasProps: { width: canvas.width, height: canvas.height }, ctx, sourceItem, scale });
        break;
      case SourceItemType.RoundRect:
        generateRoundRect({ canvasProps: { width: canvas.width, height: canvas.height }, ctx, sourceItem, scale });
        break;
      case SourceItemType.Extra:
        generateExtra({ canvasProps: { width: canvas.width, height: canvas.height }, ctx, sourceItem, scale });
        break;
      default:
        break;
    }
  }

  return Promise.resolve(canvas.toDataURL('image/png'));
};

export default json2canvas;
