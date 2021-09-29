import { DrawRoundRectType, FillRoundRectType, GetTextHeightType, GetTextsType, TextAutoBreakType } from './type';

export const loadImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const imgItem = new Image();
    imgItem.crossOrigin = 'anonymous';
    imgItem.onload = () => {
      resolve(imgItem);
    };
    imgItem.onerror = () => {
      reject('图片加载失败');
    };
    imgItem.src = url;
  });
};

export const getTexts: GetTextsType = (ctx, props) => {
  const {
    width,
    text,
    fontSize,
    color = '#000',
    fontWeight = '',
    fontFamily = 'PingFangSC-Medium',
    textAlign = 'left',
    textBaseline = 'top'
  } = props;

  const strSet = new Map<number, string>();

  ctx.fillStyle = color;
  ctx.font = `${ fontWeight } ${ fontSize }px ${ fontFamily }`;
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

  return Array.from(strSet.values());
};

export const textAutoBreak: TextAutoBreakType = (ctx, props) => {
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

export const getTextHeight: GetTextHeightType = (ctx, props) => {
  const { lineHeight } = props;
  const texts: string[] = getTexts(ctx, props);

  return texts.length * lineHeight;
};

export const fillRoundRect: FillRoundRectType = (cxt, props) => {
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

export const drawRoundRectPath: DrawRoundRectType = (cxt, props) => {
  const { width, height, radius } = props;

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
