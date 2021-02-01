import Terminal from "./Terminal";
import { start } from "./Inro";

process.on("exit", () => {
    Terminal.clearLine();
});

process.on("uncaughtException", error => {
    Terminal.severe(error.stack);
    process.exit(1);
});

process.on("unhandledRejection", error => {
    if(error.stack) {
        Terminal.severe(error.stack);
    } else {
        Terminal.severe("Unhandled promise rejection: ", error);
    }

    process.exit(1);
});


Terminal.info(`Inro running on Nodejs ${process.version}`);

start();