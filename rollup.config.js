import nodeResolve from '@rollup/plugin-node-resolve'; // 编译第三方包
// import nodePolyfills from 'rollup-plugin-polyfill-node';
import typescript from 'rollup-plugin-typescript2'; // 编译ts
import commonjs from '@rollup/plugin-commonjs'; // 可以打包 commonjs
// import babel from '@rollup/plugin-babel';
// import builtins from 'rollup-plugin-node-builtins';
import { terser } from 'rollup-plugin-terser';
import path from 'path';
import pkg from './package.json';

const resolve = (p) => path.resolve(__dirname, p); // 适应不同环境，封装path.resolve，少写一点代码
const extensions = ['.tsx', '.ts', '.jsx', '.mjs', '.js', '.json', '.node'];  // 默认查找的文件扩展名

export default {
  input: resolve(pkg.entry),
  external: Object.keys(pkg.devDependencies),
  output: [
    {
      file: resolve(pkg.main),
      format: 'cjs', // commonjs 形式的包， require 导入
      plugins: [terser({ toplevel: true })]
    },
    {
      file: resolve(pkg.module),
      format: 'es',  // es module 形式的包， 用来import 导入， 可以tree shaking
      plugins: [terser({ module: true })]
    },
    {
      file: resolve(pkg.unpkg),
      name: 'Json2Canvas',
      format: 'umd' // umd 兼容形式的包， 可以直接应用于网页 script
    }
  ],
  plugins: [
    nodeResolve({
      browser: true,
      extensions: extensions
    }),
    // babel({ babelHelpers: 'bundled', exclude: 'node_modules/**' }),
    commonjs(),
    // builtins(),
    // nodePolyfills(),
    typescript()
  ]
};
