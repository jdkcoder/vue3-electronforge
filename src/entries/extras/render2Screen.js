import dotenvx from '@dotenvx/dotenvx';
dotenvx.config()

export default (mainWindow) => {
    // Dynamically construct the environment variable names based on APP_NAME
    const devServerUrlVarName = `${process.env.APP_NAME}_VITE_DEV_SERVER_URL`;
    const viteNameVarName = `${process.env.APP_NAME}_VITE_NAME`;

    // Access the dynamically named environment variables
    const devServerUrl = process.env[ devServerUrlVarName ];
    const viteName = process.env[ viteNameVarName ];

    // Use the dynamically obtained environment variables
    // and load the index.html of the app.
    devServerUrl ? mainWindow.loadURL(devServerUrl) : mainWindow.loadFile(path.join(__dirname, `../renderer/${viteName}/index.html`));

}