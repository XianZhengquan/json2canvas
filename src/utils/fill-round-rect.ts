import { IRoundRectType } from '../types';
import drawRoundRectPath from './draw-round-rect-path';

type FillRoundRectType = (ctx: CanvasRenderingContext2D, props: Omit<IRoundRectType, 'callback' | 'type'>) => void

const fillRoundRect: FillRoundRectType = (ctx, props) => {
  const { x, y, width, height, radius, backgroundColor } = props;
  //圆的直径必然要小于矩形的宽高
  if (2 * radius > width || 2 * radius > height) {
    return false;
  }

  ctx.save();
  ctx.translate(x, y);
  //绘制圆角矩形的各个边
  drawRoundRectPath(ctx, { width, height, radius });
  ctx.fillStyle = backgroundColor || '#000'; //若是给定了值就用给定的值否则给予默认值
  ctx.fill();
  ctx.restore();
  return void 0;
};

export default fillRoundRect;
