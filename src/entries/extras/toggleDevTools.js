import dotenvx from '@dotenvx/dotenvx';
dotenvx.config()

export default ({ webContents }) => {
    if (!Number(process.env.F12_ON_FIRST_LOAD) || !webContents) return
    webContents.openDevTools()
}