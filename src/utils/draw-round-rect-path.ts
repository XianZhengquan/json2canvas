import { IRoundRectType } from '../types';

type DrawRoundRectType = (ctx: CanvasRenderingContext2D, props: Omit<IRoundRectType, 'x' | 'y' | 'backgroundColor' | 'callback' | 'type'>) => void

const drawRoundRectPath: DrawRoundRectType = (ctx, props) => {
  const { width, height, radius } = props;

  ctx.beginPath();
  //从右下角顺时针绘制，弧度从0到1/2PI
  ctx.arc(width - radius, height - radius, radius, 0, Math.PI / 2);

  //矩形下边线
  ctx.lineTo(radius, height);

  //左下角圆弧，弧度从1/2PI到PI
  ctx.arc(radius, height - radius, radius, Math.PI / 2, Math.PI);

  //矩形左边线
  ctx.lineTo(0, radius);

  //左上角圆弧，弧度从PI到3/2PI
  ctx.arc(radius, radius, radius, Math.PI, (Math.PI * 3) / 2);

  //上边线
  ctx.lineTo(width - radius, 0);

  //右上角圆弧
  ctx.arc(width - radius, radius, radius, (Math.PI * 3) / 2, Math.PI * 2);

  //右边线
  ctx.lineTo(width, height - radius);
  ctx.closePath();
};

export default drawRoundRectPath;
