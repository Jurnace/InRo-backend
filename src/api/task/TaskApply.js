import { UserInfo, TaskInfo } from "../../Inro";
import { newNotification } from "../notification/NotificationNew";
import Terminal from "../../Terminal";

/**
 * @param {import("fastify").FastifyInstance} fastify
 */
export default async function routes(fastify, options) {
    fastify.post("/task/apply", { preValidation: [fastify.auth] }, async (request, reply) => {
        const taskInfo = await TaskInfo.findOne({ taskId: request.body.taskId });

        if(!taskInfo) {
            reply.code(403).send({ error: "Task not found!" });
            return;
        }

        taskInfo.applied.push(request.body.userId);

        const userInfo = await UserInfo.findOne({ userId: request.body.userId });
        userInfo.tasksApplied.push(request.body.taskId);

        const userTarget = await UserInfo.findOne({ userId: taskInfo.ownerId });

        try {
            await taskInfo.save();
            await userInfo.save();
            await newNotification(userTarget.userId, "New offer", `${userInfo.username} has applied for the task ${taskInfo.title}.`, taskInfo.taskId, "channel_applied");
            reply.send({ message: "success" });
        } catch(err) {
            Terminal.severe(err.stack);
            reply.code(403).send({ error: "Something went wrong..."});
        }
    });
}