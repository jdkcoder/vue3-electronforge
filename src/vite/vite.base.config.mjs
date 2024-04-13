import { fileURLToPath, URL } from 'node:url'
import { builtinModules } from 'node:module';
import pkg from '../../package.json';
import vue from '@vitejs/plugin-vue';
import VueRouter from 'unplugin-vue-router/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { unheadVueComposablesImports } from '@unhead/vue'
import Components from 'unplugin-vue-components/vite'
import UnoCSS from 'unocss/vite'
import Layouts from 'vite-plugin-vue-layouts';
import dotenvx from '@dotenvx/dotenvx';
dotenvx.config();

export const builtins = [
  'electron',
  ...builtinModules.map((m) => [ m, `node:${m}` ]).flat(),
];

export const external = [ ...builtins, ...Object.keys(pkg.dependencies || {}) ];

/** @type {(env: import('vite').ConfigEnv<'build'>) => import('vite').UserConfig} */
export const getBuildConfig = (env) => {
  const { root, mode, command } = env;

  return {
    root,
    mode,
    build: {
      // Prevent multiple builds from interfering with each other.
      emptyOutDir: false,
      // 🚧 Multiple builds may conflict.
      outDir: '.vite/build',
      watch: command === 'serve' ? {} : null,
      minify: command === 'build',
    },
    clearScreen: false,
    server: {
      open: 'src/index.html',
    },
    publicDir: 'src/public'
  };
};

/** @type {(names: string[]) => { [name: string]: VitePluginRuntimeKeys } }} */
export const getDefineKeys = (names) => {
  /** @type {{ [name: string]: VitePluginRuntimeKeys }} */
  const define = {};

  return names.reduce((acc, name) => {
    const NAME = name.toUpperCase();
    /** @type {VitePluginRuntimeKeys} */
    const keys = {
      VITE_DEV_SERVER_URL: `${NAME}_VITE_DEV_SERVER_URL`,
      VITE_NAME: `${NAME}_VITE_NAME`,
    };

    return { ...acc, [ name ]: keys };
  }, define);
};

/** @type {(env: import('vite').ConfigEnv<'build'>) => Record<string, any>} */
export const getBuildDefine = (env) => {
  const { command, forgeConfig } = env;
  const names = forgeConfig.renderer
    .filter(({ name }) => name != null)
    .map(({ name }) => name);
  const defineKeys = getDefineKeys(names);
  const define = Object.entries(defineKeys).reduce((acc, [ name, keys ]) => {
    const { VITE_DEV_SERVER_URL, VITE_NAME } = keys;
    const def = {
      [ VITE_DEV_SERVER_URL ]:
        command === 'serve'
          ? JSON.stringify(process.env[ VITE_DEV_SERVER_URL ])
          : undefined,
      [ VITE_NAME ]: JSON.stringify(name),
    };
    return { ...acc, ...def };
  }, {});

  return define;
};

/** @type {(name: string) => import('vite').Plugin} */
export const pluginExposeRenderer = (name) => {
  const { VITE_DEV_SERVER_URL } = getDefineKeys([ name ])[ name ];

  return {
    name: '@electron-forge/plugin-vite:expose-renderer',
    configureServer(server) {
      process.viteDevServers ??= {};
      // Expose server for preload scripts hot reload.
      process.viteDevServers[ name ] = server;

      server.httpServer?.once('listening', () => {
        /** @type {import('node:net').AddressInfo} */
        const addressInfo = server.httpServer?.address();
        // Expose env constant for main process use.
        process.env[
          VITE_DEV_SERVER_URL
        ] = `http://localhost:${addressInfo?.port}`;
      });
    },
  };
};

/** @type {(command: 'reload' | 'restart') => import('vite').Plugin} */
export const pluginHotRestart = (command) => {
  return {
    name: '@electron-forge/plugin-vite:hot-restart',
    closeBundle() {
      if (command === 'reload') {
        for (const server of Object.values(process.viteDevServers)) {
          // Preload scripts hot reload.
          server.ws.send({ type: 'full-reload' });
        }
      } else {
        // Main process hot restart.
        // https://github.com/electron/forge/blob/v7.2.0/packages/api/core/src/api/start.ts#L216-L223
        process.stdin.emit('data', 'rs');
      }
    },
  };
};

const autoImportEnabled = Number(process.env.AUTO_IMPORT)

export const plugins = [
  UnoCSS({
  }),
  autoImportEnabled && AutoImport({
    imports: [
      'vue',
      'vue-router',

      unheadVueComposablesImports,

      {
        'axios': [
          [ 'default', 'axios' ],
        ],
      }
    ],
    dirs: [
      "src/utils",
      "src/composables",
      "src/stores",
    ],
    dts: 'src/declares/auto-imports.d.ts'
  }),
  VueRouter({}),
  vue(),
  autoImportEnabled && Components({
    dts: 'src/declares/components.d.ts',
    deep: true,
    dirs: [ "src/components" ]
  }),
  Layouts({
    layoutsDirs: 'src/layouts',
    pagesDirs: 'src/pages',
    defaultLayout: 'default'
  })
]

export const resolve = {
  alias: {
    '@': fileURLToPath(new URL('/src', import.meta.url)),
    '@public': fileURLToPath(new URL('/src/public', import.meta.url)),
  }
}