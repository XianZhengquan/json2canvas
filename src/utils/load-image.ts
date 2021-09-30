const loadImage = (url: string): Promise<HTMLImageElement> => {
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

export default loadImage;
