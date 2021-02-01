import Terminal from "../Terminal";
import { TaskInfo } from "../Inro";

async function onCommand() {
    const taskInfo = await TaskInfo.findOne().sort("-taskId");

    const currentId = taskInfo ? taskInfo.taskId : "0";

    Terminal.info(`Number of tasks: ${currentId}`);
}

const CTasks = {
    onCommand
};

export default CTasks;