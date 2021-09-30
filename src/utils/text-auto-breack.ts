import type { ITextAutoBreakProps } from '../types';
import getTexts from './get-texts';

type TextAutoBreakType = (ctx: CanvasRenderingContext2D, props: ITextAutoBreakProps) => void

const textAutoBreak: TextAutoBreakType = (ctx, props) => {
  const { x, y, lineHeight } = props;
  const texts: string[] = getTexts(ctx, props);

  texts.forEach((item, index) => {
    if (index === 0) {
      ctx.fillText(item, x, y);
    } else {
      ctx.fillText(item, x, y + index * lineHeight);
    }
  });
};

export default textAutoBreak;
