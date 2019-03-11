// @flow

import fs from "fs";
import path from "path";
import { transform, optimize } from "@korzhyk/react-svg-core";
import { createFilter } from "rollup-pluginutils";
import type { BabelFileResult } from "@babel/core";

type PluginOpts = {
  include?: any,
  exclude?: any,
  svgo?: any,
  jsx?: boolean,
  preact?: boolean,
  pragma?: string
};

export default function reactSvgLoadPlugin(options: PluginOpts = {}): any {
  const filter = createFilter(options.include, options.exclude);

  return {
    name: "react-svg",
    load(id: string) {
      if (!filter(id) || path.extname(id) !== ".svg") return;

      const contents = fs.readFileSync(id);

      return Promise.resolve(String(contents))
        .then(optimize(options.svgo))
        .then(
          transform({
            jsx: options.jsx,
            preact: options.preact,
            pragma: options.pragma
          })
        )
        .then((result: BabelFileResult) => result.code);
    }
  };
}
