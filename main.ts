import { app, BrowserWindow, screen, ipcMain, powerMonitor, Menu } from "electron";
import * as express from "express";
import { menubar } from "menubar";
import { Server } from "http";
import { Logger } from "./src/logger";
import { Automation } from "./src/automation";

let win: BrowserWindow | null = null;
let server: Server | null = null;
const args = process.argv.slice(1),
    serve = args.some((val) => val === "--serve");
const mb = menubar({
    index: false,
    browserWindow: {
        width: 600,
        height: 800,
        webPreferences: { nodeIntegration: true, contextIsolation: false, enableRemoteModule: true },
    },
    icon: `${__dirname}/build/menu.png`,
});

function createWindow(): BrowserWindow {
    const electronScreen = screen;
    const size = electronScreen.getPrimaryDisplay().workAreaSize;

    // Create the browser window.
    win = new BrowserWindow({
        x: 0,
        y: 0,
        width: serve ? 1200 : 600,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            allowRunningInsecureContent: serve ? true : false,
            contextIsolation: false,
            enableRemoteModule: true,
        },
    });

    if (serve) {
        win.webContents.openDevTools();

        require("electron-reload")(__dirname, {
            electron: require(`${__dirname}/node_modules/electron`),
        });
        win.loadURL("http://localhost:4200");
    } else {
        win.loadURL(`file://${__dirname}/dist/slack-status-automation/index.html`);
    }

    // Emitted when the window is closed.
    win.on("closed", () => {
        win = null;
    });

    return win;
}

try {
    const logger = new Logger();
    const automation = new Automation(logger);

    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    // Added 400 ms to fix the black background issue while using transparent window.
    // More detais at https://github.com/electron/electron/issues/15947
    app.on("ready", () => {
        setTimeout(createWindow, 400);

        powerMonitor.on("suspend", () => {
            logger.log("pc is suspended");
            automation.pause();
        });
        powerMonitor.on("resume", () => {
            logger.log("pc is resumed");
            automation.resume();
        });

        Menu.setApplicationMenu(null);
    });

    mb.on("ready", () => {
        console.log("mb.ready\n");
    });
    mb.on("after-create-window", () => {
        const menuWindow = mb.window;
        if (menuWindow != undefined) {
            if (serve) {
                menuWindow.webContents.openDevTools();

                require("electron-reload")(__dirname, {
                    electron: require(`${__dirname}/node_modules/electron`),
                });
                menuWindow.loadURL("http://localhost:4200");
            } else {
                menuWindow.loadURL(`file://${__dirname}/dist/slack-status-automation/index.html`);
            }
        }
    });

    // Quit when all windows are closed.
    app.on("window-all-closed", () => {
        // On OS X it is common for applications and their menu bar
        // to stay active until the user quits explicitly with Cmd + Q
        if (process.platform !== "darwin") {
            app.quit();
        }
    });

    app.on("activate", () => {
        // On OS X it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (win === null) {
            createWindow();
        }
    });

    ipcMain.on("oauthStart", (event) => {
        const expressApp = express();
        expressApp.get("/", (req, res) => {
            const code = req.query["code"];
            if (typeof code == "string") {
                event.sender.send("oauthCallback", code);
                res.send("authenticated");
            } else {
                res.send("unknown error");
            }
        });
        server = expressApp.listen(3333, () => {});
    });
    ipcMain.on("oauthEnd", () => {
        server?.close();
    });

    logger.start();
    automation.start();
} catch (e) {}
