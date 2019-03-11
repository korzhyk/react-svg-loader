// @flow

import Svgo from "svgo";
import { transformSync as babelTransform } from "@babel/core";
import plugin from "@korzhyk/babel-plugin-react-svg";

import { validateAndFix } from "./svgo";

// SVGO Optimize
export function optimize(opts: any = {}): string => Promise<string> {
  validateAndFix(opts);
  const svgo = new Svgo(opts);

  return (content: string) => svgo.optimize(content).then(data => data.data);
}

// Babel Transform
export function transform({
  jsx = false,
  preact = false,
  pragma = "h"
}: { jsx: boolean, preact: boolean, pragma: string } = {}): string => string {
  return content =>
    babelTransform(content, {
      babelrc: false,
      presets: [jsx ? void 0 : "@babel/preset-react"].filter(Boolean),
      plugins: [
        require.resolve("@babel/plugin-syntax-jsx"),
        preact
          ? [require.resolve("@babel/plugin-transform-react-jsx"), { pragma }]
          : void 0,
        [plugin, { preact }]
      ].filter(Boolean)
    });
}
