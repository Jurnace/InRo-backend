import { UserInfo, TaskInfo } from "../../Inro";
import { newNotification } from "../notification/NotificationNew";
import Terminal from "../../Terminal";

/**
 * @param {import("fastify").FastifyInstance} fastify
 */
export default async function routes(fastify, options) {
    fastify.post("/task/reject", { preValidation: [fastify.auth] }, async (request, reply) => {
        const taskInfo = await TaskInfo.findOne({ taskId: request.body.taskId });

        if(!taskInfo) {
            reply.code(403).send({ error: "Task not found!" });
            return;
        }

        taskInfo.applied = taskInfo.applied.filter(item => {
            return item !== request.body.personId;
        });

        taskInfo.rejected.push(request.body.personId);

        const userInfo = await UserInfo.findOne({ userId: request.body.personId });

        userInfo.tasksApplied = userInfo.tasksApplied.filter(item => {
            return item !== request.body.taskId;
        });

        userInfo.tasksRejected.push(request.body.taskId);

        try {
            await taskInfo.save();
            await userInfo.save();
            await newNotification(userInfo.userId, "Offer rejected", `You are rejected from the task ${taskInfo.title}.`, taskInfo.taskId, "channel_rejected");
            reply.send({ message: "success" });
        } catch(err) {
            Terminal.severe(err.stack);
            reply.code(403).send({ error: "Something went wrong..."});
        }
    });
}