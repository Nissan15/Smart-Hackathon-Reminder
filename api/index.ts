import { app, initApp } from "../server/index";

let isInitialized = false;

export default async function handler(req: any, res: any) {
    if (!isInitialized) {
        await initApp();
        isInitialized = true;
    }
    return app(req, res);
}
