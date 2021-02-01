import Terminal from "../Terminal";
import { TaskInfo } from "../Inro";

async function onCommand(args) {
    const taskInfo = await TaskInfo.findOne({ taskId: args[0] });

    if(!taskInfo) {
        Terminal.warning("Task not found!");
        return;
    }

    Terminal.info(`Information for task ${taskInfo.taskId}:\n${taskInfo}`);
}

const CInfoTask = {
    onCommand
};

export default CInfoTask;