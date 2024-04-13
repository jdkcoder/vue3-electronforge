export default () => {
    if (!process.env.SCREEN_SIZE) return
    const { SCREEN_SIZE: screen } = process.env

    if (!screen.includes('x')) throw Error('\n "SCREEN_SIZE" in .env must be written like this: 1920x1080 (WxH) \n')

    const arr = screen.split('x')
    return { width: Number(arr[ 0 ]), height: Number(arr[ 1 ]) }
}