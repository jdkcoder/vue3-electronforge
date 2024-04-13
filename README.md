**Electron Forge**: *[https://www.electronforge.io/](https://www.electronforge.io/ "https://www.electronforge.io/")*

## Installation
```
bun i
```

```
npm i
```

```
yarn install
```

## Development
```
bun dev
```

```
npm run dev
```

```
yarn dev
```

## Environment Variables
```
APP_NAME=
ENTRIES_PATH=src/entries
VITE_CONFIGS_PATH=src/vite

SCREEN_SIZE=  #1920x1080
F12_ON_FIRST_LOAD=0  #0 = false || 1 = true
AUTO_IMPORT=1  #0 = false || 1 = true
```
## Routing
Using [unplugin-vue-router](https://github.com/posva/unplugin-vue-router "unplugin-vue-router")

## Layout
Using [vite-plugin-vue-layouts](https://github.com/JohnCampionJr/vite-plugin-vue-layouts "vite-plugin-vue-layouts")

You can change layout in meta of route
```
definePage({
  name: 'index',
  meta: {
    layout: 'z', //your layout name must existing in path: 'src/layouts'
    requiresAuth: true,
  },
})
```
