import { UserInfo, TaskInfo } from "../../Inro";
import { newNotification } from "../notification/NotificationNew";
import Terminal from "../../Terminal";

/**
 * @param {import("fastify").FastifyInstance} fastify
 */
export default async function routes(fastify, options) {
    fastify.post("/task/cancel", { preValidation: [fastify.auth] }, async (request, reply) => {
        const taskInfo = await TaskInfo.findOne({ taskId: request.body.taskId });

        if(!taskInfo) {
            reply.code(403).send({ error: "Task not found!" });
            return;
        }

        taskInfo.accepted = taskInfo.accepted.filter(item => {
            return item !== request.body.personId;
        });

        const userInfo = await UserInfo.findOne({ userId: request.body.personId });

        userInfo.tasksActive = userInfo.tasksActive.filter(item => {
            return item !== request.body.taskId;
        });

        try {
            await taskInfo.save();
            await userInfo.save();
            await newNotification(userInfo.userId, "Offer cancelled", `Your offer for the task ${taskInfo.title} is cancelled.`, taskInfo.taskId, "channel_cancelled");
            reply.send({ message: "success" });
        } catch(err) {
            Terminal.severe(err.stack);
            reply.code(403).send({ error: "Something went wrong..."});
        }
    });
}