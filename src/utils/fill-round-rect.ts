import { IRoundRectType } from '../types';
import drawRoundRectPath from './draw-round-rect-path';

type FillRoundRectType = (cxt: CanvasRenderingContext2D, props: Omit<IRoundRectType, 'callback' | 'type'>) => void

const fillRoundRect: FillRoundRectType = (cxt, props) => {
  const { x, y, width, height, radius, backgroundColor } = props;
  //圆的直径必然要小于矩形的宽高
  if (2 * radius > width || 2 * radius > height) {
    return false;
  }

  cxt.save();
  cxt.translate(x, y);
  //绘制圆角矩形的各个边
  drawRoundRectPath(cxt, { width, height, radius });
  cxt.fillStyle = backgroundColor || '#000'; //若是给定了值就用给定的值否则给予默认值
  cxt.fill();
  cxt.restore();
  return void 0;
};

export default fillRoundRect;
