import { ITextAutoBreakProps } from '../types';
import getTexts from './get-texts';

export type GetTextHeightType = (ctx: CanvasRenderingContext2D, props: ITextAutoBreakProps) => number;

const getTextHeight: GetTextHeightType = (ctx, props) => {
  const { lineHeight } = props;
  const texts: string[] = getTexts(ctx, props);

  return texts.length * lineHeight;
};

export default getTextHeight;
