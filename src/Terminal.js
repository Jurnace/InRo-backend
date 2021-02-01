import readline from "readline";
import chalk from "chalk";

import { stop } from "./Inro";

import CExit from "./cmd/CExit";
import CStatus from "./cmd/CStatus";
import CUsers from "./cmd/CUsers";
import CTasks from "./cmd/CTasks";
import CInfoUser from "./cmd/CInfoUser";
import CInfoTask from "./cmd/CInfoTask";
import CLock from "./cmd/CLock";

import fs from "fs";
import path from "path";

const commands = new Map();
commands.set("exit", CExit);
commands.set("stop", CExit);
commands.set("status", CStatus);
commands.set("users", CUsers);
commands.set("tasks", CTasks);
commands.set("infouser", CInfoUser);
commands.set("infotask", CInfoTask);
commands.set("lock", CLock);

const commandsArray = ["help", ...Array.from(commands.keys())];

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    completer: (line) => {
        const hits = commandsArray.filter((command) => command.startsWith(line));

        return [hits.length ? hits : commandsArray, line];
    }
});

const fileStream = fs.createWriteStream(path.join(process.env.LOGS_DIR, Date.now() + ".log"), { flags: "a" });
const oldLog = console.log;

console.log = function(msg) {
    fileStream.write(msg + "\n");
    oldLog.apply(null, arguments);
};

rl.on("line", async (line) => {
    const cmd = line.trim().toLowerCase().split(/ +/);

    if(cmd[0].length === 0) {
        clearLine();
        rl.prompt();
        return;
    }

    if(cmd[0].startsWith("help")) {
        Terminal.info(`Available commands: ${commandsArray.join(", ")}`);
        return;
    }

    const command = commands.get(cmd[0]);
    if(command) {
        await command.onCommand(cmd.splice(1));
    } else {
        info(chalk.redBright("Unknown command!"));
    }

    rl.prompt();
}).on("close", () => {
    stop();
});

function clearLine() {
    readline.clearLine(process.stdout, 0);
    readline.cursorTo(process.stdout, 0);
}

function getTime() {
    return new Date().toLocaleString("en-US", {timeZone: "Asia/Singapore"});
}

function info(...args) {
    args[0] = `[${getTime()} INFO]: ` + args[0];

    clearLine();
    console.log.apply(console, args);
    rl.prompt();
}

function warning(...args) {
    args[0] = `[${getTime()} ${chalk.yellow("WARNING")}]: ` + args[0];

    clearLine();
    console.log.apply(console, args);
    rl.prompt();
}

function severe(...args) {
    args[0] = `[${getTime()} ${chalk.red("SEVERE")}]: ` + args[0];

    clearLine();
    console.log.apply(console, args);
    rl.prompt();
}

const Terminal = {
    clearLine,
    info,
    warning,
    severe
};

export default Terminal;
