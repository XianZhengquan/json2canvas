import { ITextAutoBreakProps } from '../types';

type GetTextsType = (ctx: CanvasRenderingContext2D, props: ITextAutoBreakProps) => string[]

const getTexts: GetTextsType = (ctx, props) => {
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

export default getTexts;
