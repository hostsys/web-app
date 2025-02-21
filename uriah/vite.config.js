// code below from @ayatkyo on github, thx
import fsp from "fs/promises";
import { defineConfig } from "vite";

const htmlFileRegex = /\.html$/;
const postfixRE = /[?#].*$/s;
const postfix = "?html-import";

function cleanUrl(url) {
  return url.replace(postfixRE, "");
}

const htmlImportBuild = () => ({
  name: "html-import:build",
  enforce: "pre",
  apply: "build",
  async resolveId(id, importer, options) {
    if (htmlFileRegex.test(id) && !options.isEntry) {
      let res = await this.resolve(id, importer, {
        skipSelf: true,
        ...options,
      });

      if (!res || res.external) return res;

      return res.id + postfix;
    }
  },

  async load(id) {
    if (!id.endsWith(postfix)) return;

    let htmlContent = await fsp.readFile(cleanUrl(id));

    //  Do something with htmlContent buffer

    return `export default ${JSON.stringify(htmlContent.toString("utf-8"))}`;
  },
});

function htmlImportServe() {
  return {
    name: "html-import:serve",
    apply: "serve",
    transform(src, id) {
      if (htmlFileRegex.test(id)) {
        return {
          code: `export default ${JSON.stringify(src)}`,
        };
      }
    },
  };
}

export default defineConfig({
  plugins: [htmlImportBuild(), htmlImportServe()],
});
