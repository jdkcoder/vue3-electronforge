import { defineConfig } from 'vite';
import { pluginExposeRenderer, plugins, resolve } from './vite.base.config.mjs';

// https://vitejs.dev/config
export default defineConfig((env) => {
  /** @type {import('vite').ConfigEnv<'renderer'>} */
  const forgeEnv = env;
  const { root, mode, forgeConfigSelf } = forgeEnv;
  const name = forgeConfigSelf.name ?? '';

  /** @type {import('vite').UserConfig} */
  plugins: []
  return {
    root,
    mode,
    base: './',
    build: {
      outDir: `.vite/renderer/${name}`,
    },
    plugins: [ pluginExposeRenderer(name), ...plugins ],
    resolve: {
      preserveSymlinks: true,
      ...resolve
    },
    clearScreen: false,
  };
});
