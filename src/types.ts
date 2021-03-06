export enum SourceItemType {
  Text = 'text',
  Image = 'image',
  RoundRect = 'round-rect',
  Extra = 'extra'
}

export enum ImageName {
  Avatar = 'avatar',
  Qrcode = 'qrcode',
  RoundImage = 'round-image'
}

export interface ITextAutoBreak {
  width: number;
  lineHeight: number;
}

export interface ISourceItemCallback<T> {
  (ctx: CanvasRenderingContext2D, canvasProps: ICanvasProps, items: T): void;
}

export interface IImageCallbackType extends IImageType {
  image: HTMLImageElement;
}

export interface IImageType {
  type: SourceItemType.Image,
  x: number;
  y: number;
  width: number;
  height: number;
  url: string;
  name?: ImageName;
  borderColor?: string;
  lineWidth?: number;
  radius?: number;
  callback?: ISourceItemCallback<Omit<IImageCallbackType, 'callback' | 'type' | 'name'>>;
}

export interface ITextType {
  type: SourceItemType.Text,
  x: number;
  y: number;
  text: string;
  color?: string;
  fontSize: number;
  fontFamily?: string;
  fontWeight?: string;
  textAlign?: CanvasTextAlign;
  textBaseline?: CanvasTextBaseline;
  autoBreak?: ITextAutoBreak;
  callback?: ISourceItemCallback<Omit<ITextType, 'callback' | 'type'>>;
}

export interface IRoundRectType {
  type: SourceItemType.RoundRect,
  x: number;
  y: number;
  width: number;
  height: number;
  radius: number;
  backgroundColor?: string;
  callback?: ISourceItemCallback<Omit<IRoundRectType, 'callback' | 'type'>>;
}

export interface IExtraType {
  type: SourceItemType.Extra,
  callback?: ISourceItemCallback<Omit<IExtraType, 'callback' | 'type'>>;
}

export type Json2canvasSource = (IImageType | ITextType | IRoundRectType | IExtraType)[]

export interface ICanvasProps {
  width: number;
  height: number;
}

export interface ITextAutoBreakProps extends Omit<ITextType, 'type' | 'autoBreak' | 'callback'> {
  width: number;
  lineHeight: number;
}

