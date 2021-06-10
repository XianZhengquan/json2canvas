var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { toDataURL } from 'qrcode';
/**
 * 该方法用来绘制一个有填充色的圆角矩形
 * @param cxt:canvas的上下文环境
 * @param {number} x:左上角x轴坐标
 * @param {number} y:左上角y轴坐标
 * @param {number} width:矩形的宽度
 * @param {number} height:矩形的高度
 * @param {number} radius:圆的半径
 * @param {string} fillColor:填充颜色
 **/
export var fillRoundRect = function (cxt, x, y, width, height, radius, fillColor) {
    //圆的直径必然要小于矩形的宽高
    if (2 * radius > width || 2 * radius > height) {
        return false;
    }
    cxt.save();
    cxt.translate(x, y);
    //绘制圆角矩形的各个边
    drawRoundRectPath(cxt, width, height, radius);
    cxt.fillStyle = fillColor || '#000'; //若是给定了值就用给定的值否则给予默认值
    cxt.fill();
    cxt.restore();
};
export var drawRoundRectPath = function (cxt, width, height, radius) {
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
/**
 * canvas 文字自动换行
 * @param ctx
 * @param {number} textParams.x 文本绘制于canvas x轴坐标
 * @param {number} textParams.y 文本绘制于canvas y轴坐标
 * @param {string} textParams.text 文本
 * @param {number} textParams.size 文字大小
 * @param {string} textParams.color 文字颜色
 * @param {number} textParams.lineHeight 文本行高，换行后的文本距离上一行文本的间距
 * @param {string} textParams.textAlign 文本水平对齐方式 默认left
 * @param {string} textParams.textBaseline 文本垂直对齐方式，默认middle
 * @param {number} width 文本区域宽度 超过宽度换行
 * @description 这里接受的所有数值参数都是经过scale了的
 */
export var textAutoBreak = function (ctx, textParams, width, returns) {
    var x = textParams.x, y = textParams.y, text = textParams.text, size = textParams.size, _a = textParams.color, color = _a === void 0 ? '#000000' : _a, _b = textParams.lineHeight, lineHeight = _b === void 0 ? 12 : _b, _c = textParams.font, font = _c === void 0 ? 'PingFangSC-Medium' : _c, _d = textParams.fontWeight, fontWeight = _d === void 0 ? '' : _d, _e = textParams.textAlign, textAlign = _e === void 0 ? 'left' : _e, _f = textParams.textBaseline, textBaseline = _f === void 0 ? 'middle' : _f;
    var strSet = new Map();
    ctx.fillStyle = color;
    ctx.font = fontWeight + " " + size + "px " + font;
    ctx.textAlign = textAlign;
    ctx.textBaseline = textBaseline;
    // 中文标点符号
    var punctuation = [
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
    var currentIndex = strSet.size;
    text.split('').forEach(function (txt, index) {
        var _a;
        // 之前的
        var beforeTxt = (_a = strSet.get(currentIndex)) !== null && _a !== void 0 ? _a : '';
        // 下一个字符
        var nextTxt = text[index + 1];
        // 当前字符是\n 的unicode编码\u000A为则自动换行， txt表示当前行
        if (text[index].charCodeAt(0).toString(16) === 'a') {
            strSet.set(++currentIndex, '');
            return;
        }
        // 如果下一个字符是 标点符号
        if (punctuation.includes(nextTxt)) {
            if (ctx.measureText(beforeTxt + txt + nextTxt).width < width) {
                strSet.set(currentIndex, beforeTxt + txt);
            }
            else {
                strSet.set(++currentIndex, txt);
            }
        }
        else if (ctx.measureText(beforeTxt).width < width) {
            strSet.set(currentIndex, beforeTxt + txt);
        }
        else {
            strSet.set(++currentIndex, txt);
        }
    });
    var texts = Array.from(strSet.values());
    if (returns)
        return texts.length * lineHeight;
    texts.forEach(function (item, index) {
        if (index === 0) {
            ctx.fillText(item, x, y);
        }
        else {
            ctx.fillText(item, x, y + index * lineHeight);
        }
    });
};
var json2canvas = function (canvasProps, scale, source) {
    if (canvasProps === void 0) { canvasProps = { width: 375, height: 607 }; }
    if (scale === void 0) { scale = 2; }
    return __awaiter(void 0, void 0, void 0, function () {
        var canvas, ctx, _loop_1, _i, source_1, item, state_1, _a, images, _b, texts, _c, roundRects, imageList, _loop_2, _d, images_1, item, state_2;
        var _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    canvas = document.createElement('canvas');
                    ctx = canvas.getContext('2d');
                    canvas.width = canvasProps.width * scale;
                    canvas.height = canvasProps.height * scale;
                    if (!Array.isArray(source)) return [3 /*break*/, 5];
                    _loop_1 = function (item) {
                        var imgItem, x, y, width, height, _h, borderColor, _j, lineWidth, callback, e_1, width, height, x, y, radius, color, callback, x, y, size, text, _k, font, _l, fontWeight, _m, color, _o, textAlign, _p, textBaseline, _q, autoBreak, _r, lineHeight, _s, width, callback;
                        return __generator(this, function (_t) {
                            switch (_t.label) {
                                case 0:
                                    if (!(item.type === 'image')) return [3 /*break*/, 5];
                                    _t.label = 1;
                                case 1:
                                    _t.trys.push([1, 3, , 4]);
                                    if (item.name === 'qrcode') {
                                        toDataURL(document.createElement('canvas'), item.url, function (err, res) {
                                            // if (!err) item.url = generateImgUrl(res) as string;
                                            if (!err)
                                                item.url = res;
                                        });
                                    }
                                    return [4 /*yield*/, loadImage(item.url)];
                                case 2:
                                    imgItem = _t.sent();
                                    x = item.x, y = item.y, width = item.width, height = item.height, _h = item.borderColor, borderColor = _h === void 0 ? '#ffffff' : _h, _j = item.lineWidth, lineWidth = _j === void 0 ? 4 : _j, callback = item.callback;
                                    if (callback) {
                                        callback(ctx, { width: canvas.width, height: canvas.height }, __assign(__assign({}, item), { img: imgItem }));
                                    }
                                    else if (item.name === 'avatar') {
                                        // 在 clip() 之前保存canvas状态
                                        ctx.save();
                                        ctx.strokeStyle = borderColor;
                                        ctx.lineWidth = lineWidth * scale;
                                        ctx.beginPath();
                                        ctx.arc((x + width / 2) * scale, (y + width / 2) * scale, (width * scale) / 2, 0, 2 * Math.PI, false);
                                        ctx.stroke();
                                        ctx.clip();
                                        ctx.drawImage(imgItem, x * scale, y * scale, width * scale, height * scale);
                                        // 恢复到上面save()时的状态
                                        ctx.restore();
                                    }
                                    else {
                                        ctx.drawImage(imgItem, x * scale, y * scale, width * scale, height * scale);
                                    }
                                    return [3 /*break*/, 4];
                                case 3:
                                    e_1 = _t.sent();
                                    return [2 /*return*/, { value: Promise.reject("\u56FE\u7247\u52A0\u8F7D\u9519\u8BEF\uFF1A" + ((_e = item.name) !== null && _e !== void 0 ? _e : '图片名称') + " - " + item.url) }];
                                case 4: return [3 /*break*/, 6];
                                case 5:
                                    if (item.type === 'round-rect') {
                                        width = item.width, height = item.height, x = item.x, y = item.y, radius = item.radius, color = item.color, callback = item.callback;
                                        if (callback) {
                                            callback(ctx, { width: canvas.width, height: canvas.height }, item);
                                        }
                                        else {
                                            fillRoundRect(ctx, x * scale, y * scale, width * scale, height * scale, radius * scale, color);
                                        }
                                    }
                                    else if (item.type === 'text') {
                                        x = item.x, y = item.y, size = item.size, text = item.text, _k = item.font, font = _k === void 0 ? 'PingFangSC-Medium' : _k, _l = item.fontWeight, fontWeight = _l === void 0 ? '' : _l, _m = item.color, color = _m === void 0 ? '#000' : _m, _o = item.textAlign, textAlign = _o === void 0 ? 'left' : _o, _p = item.textBaseline, textBaseline = _p === void 0 ? 'middle' : _p, _q = item.autoBreak, autoBreak = _q === void 0 ? false : _q, _r = item.lineHeight, lineHeight = _r === void 0 ? 24 : _r, _s = item.width, width = _s === void 0 ? 0 : _s, callback = item.callback;
                                        if (callback) {
                                            callback(ctx, { width: canvas.width, height: canvas.height }, item);
                                        }
                                        else if (autoBreak) {
                                            textAutoBreak(ctx, {
                                                x: x * scale,
                                                y: y * scale,
                                                text: text,
                                                font: font,
                                                fontWeight: fontWeight,
                                                color: color,
                                                textAlign: textAlign,
                                                textBaseline: textBaseline,
                                                size: size * scale,
                                                lineHeight: lineHeight * scale
                                            }, width * 2);
                                        }
                                        else {
                                            ctx.fillStyle = color;
                                            ctx.font = fontWeight + " " + size * scale + "px " + font;
                                            ctx.textAlign = textAlign;
                                            ctx.textBaseline = textBaseline;
                                            ctx.fillText(text, x * scale, y * scale);
                                        }
                                    }
                                    _t.label = 6;
                                case 6: return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, source_1 = source;
                    _g.label = 1;
                case 1:
                    if (!(_i < source_1.length)) return [3 /*break*/, 4];
                    item = source_1[_i];
                    return [5 /*yield**/, _loop_1(item)];
                case 2:
                    state_1 = _g.sent();
                    if (typeof state_1 === "object")
                        return [2 /*return*/, state_1.value];
                    _g.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [3 /*break*/, 10];
                case 5:
                    _a = source.images, images = _a === void 0 ? [] : _a, _b = source.texts, texts = _b === void 0 ? [] : _b, _c = source.roundRects, roundRects = _c === void 0 ? [] : _c;
                    imageList = [];
                    _loop_2 = function (item) {
                        var imgItem, e_2;
                        return __generator(this, function (_u) {
                            switch (_u.label) {
                                case 0:
                                    _u.trys.push([0, 2, , 3]);
                                    if (item.name === 'qrcode') {
                                        toDataURL(document.createElement('canvas'), item.url, function (err, res) {
                                            // if (!err) item.url = generateImgUrl(res) as string;
                                            if (!err)
                                                item.url = res;
                                        });
                                    }
                                    return [4 /*yield*/, loadImage(item.url)];
                                case 1:
                                    imgItem = _u.sent();
                                    imageList.push(__assign(__assign({}, item), { img: imgItem }));
                                    return [3 /*break*/, 3];
                                case 2:
                                    e_2 = _u.sent();
                                    return [2 /*return*/, { value: Promise.reject("\u56FE\u7247\u52A0\u8F7D\u9519\u8BEF\uFF1A" + ((_f = item.name) !== null && _f !== void 0 ? _f : '图片名称') + " - " + item.url) }];
                                case 3: return [2 /*return*/];
                            }
                        });
                    };
                    _d = 0, images_1 = images;
                    _g.label = 6;
                case 6:
                    if (!(_d < images_1.length)) return [3 /*break*/, 9];
                    item = images_1[_d];
                    return [5 /*yield**/, _loop_2(item)];
                case 7:
                    state_2 = _g.sent();
                    if (typeof state_2 === "object")
                        return [2 /*return*/, state_2.value];
                    _g.label = 8;
                case 8:
                    _d++;
                    return [3 /*break*/, 6];
                case 9:
                    // 绘制图片
                    if ((imageList === null || imageList === void 0 ? void 0 : imageList.length) > 0)
                        imageList.forEach(function (image) {
                            var x = image.x, y = image.y, width = image.width, height = image.height, img = image.img, _a = image.borderColor, borderColor = _a === void 0 ? '#ffffff' : _a, _b = image.lineWidth, lineWidth = _b === void 0 ? 4 : _b, callback = image.callback;
                            if (callback) {
                                callback(ctx, { width: canvas.width, height: canvas.height }, image);
                            }
                            else if (image.name === 'avatar') {
                                // 在 clip() 之前保存canvas状态
                                ctx.save();
                                ctx.strokeStyle = borderColor;
                                ctx.lineWidth = lineWidth * scale;
                                ctx.beginPath();
                                ctx.arc((x + width / 2) * scale, (y + width / 2) * scale, (width * scale) / 2, 0, 2 * Math.PI, false);
                                ctx.stroke();
                                ctx.clip();
                                ctx.drawImage(img, x * scale, y * scale, width * scale, height * scale);
                                // 恢复到上面save()时的状态
                                ctx.restore();
                            }
                            else {
                                ctx.drawImage(img, x * scale, y * scale, width * scale, height * scale);
                            }
                        });
                    // 绘制圆角矩形
                    if ((roundRects === null || roundRects === void 0 ? void 0 : roundRects.length) > 0)
                        roundRects.forEach(function (rr) {
                            var width = rr.width, height = rr.height, x = rr.x, y = rr.y, radius = rr.radius, color = rr.color, callback = rr.callback;
                            if (callback) {
                                callback(ctx, { width: canvas.width, height: canvas.height }, rr);
                            }
                            else {
                                fillRoundRect(ctx, x * scale, y * scale, width * scale, height * scale, radius * scale, color);
                            }
                        });
                    // 绘制文字
                    if ((texts === null || texts === void 0 ? void 0 : texts.length) > 0)
                        texts.forEach(function (txt) {
                            var x = txt.x, y = txt.y, size = txt.size, text = txt.text, _a = txt.font, font = _a === void 0 ? 'PingFangSC-Medium' : _a, _b = txt.fontWeight, fontWeight = _b === void 0 ? '' : _b, _c = txt.color, color = _c === void 0 ? '#000' : _c, _d = txt.textAlign, textAlign = _d === void 0 ? 'left' : _d, _e = txt.textBaseline, textBaseline = _e === void 0 ? 'middle' : _e, _f = txt.autoBreak, autoBreak = _f === void 0 ? false : _f, _g = txt.lineHeight, lineHeight = _g === void 0 ? 24 : _g, _h = txt.width, width = _h === void 0 ? 0 : _h, callback = txt.callback;
                            if (callback) {
                                callback(ctx, { width: canvas.width, height: canvas.height }, txt);
                            }
                            else if (autoBreak) {
                                textAutoBreak(ctx, {
                                    x: x * scale,
                                    y: y * scale,
                                    text: text,
                                    font: font,
                                    fontWeight: fontWeight,
                                    color: color,
                                    textAlign: textAlign,
                                    textBaseline: textBaseline,
                                    size: size * scale,
                                    lineHeight: lineHeight * scale
                                }, width * 2);
                            }
                            else {
                                ctx.fillStyle = color;
                                ctx.font = " " + fontWeight + " " + size * scale + "px " + font;
                                ctx.textAlign = textAlign;
                                ctx.textBaseline = textBaseline;
                                ctx.fillText(text, x * scale, y * scale);
                            }
                        });
                    _g.label = 10;
                case 10: return [2 /*return*/, {
                        url: canvas.toDataURL('image/png')
                    }];
            }
        });
    });
};
/**
 * 加载图片
 * @param {string} url
 * @return {Promise<HTMLImageElement>}
 */
function loadImage(url) {
    return new Promise(function (resolve, reject) {
        var imgItem = new Image();
        if (url.match(/^https?/))
            imgItem.crossOrigin = 'anonymous';
        imgItem.onload = function () {
            resolve(imgItem);
        };
        imgItem.onerror = function () {
            reject('图片加载失败');
        };
        imgItem.src = url;
    });
}
export default json2canvas;
