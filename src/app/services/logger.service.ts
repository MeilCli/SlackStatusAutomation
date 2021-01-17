import { ipcRenderer } from "electron";
import { Injectable } from "@angular/core";
import { Subject, Observable } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class LoggerService {
    private subject: Subject<string> = new Subject<string>();

    startApplication() {
        ipcRenderer.on("logger-logged", (_, log) => {
            if (typeof log == "string") {
                this.subject.next(log);
            }
        });
    }

    log(value: string) {
        const date = new Date().toLocaleString();
        ipcRenderer.send("logger-new", `${date}# ${value}`);
    }

    getLogObservable(): Observable<string> {
        return this.subject;
    }

    async getLogs(): Promise<string[]> {
        const result = await ipcRenderer.invoke("logger-get");
        if (Array.isArray(result)) {
            return result.filter((x) => typeof x == "string");
        } else {
            return [];
        }
    }
}
