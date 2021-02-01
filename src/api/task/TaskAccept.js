import { UserInfo, TaskInfo } from "../../Inro";
import { newNotification } from "../notification/NotificationNew";
import Terminal from "../../Terminal";

/**
 * @param {import("fastify").FastifyInstance} fastify
 */
export default async function routes(fastify, options) {
    fastify.post("/task/accept", { preValidation: [fastify.auth] }, async (request, reply) => {
        const taskInfo = await TaskInfo.findOne({ taskId: request.body.taskId });

        if(!taskInfo) {
            reply.code(403).send({ error: "Task not found!" });
            return;
        }

        taskInfo.applied = taskInfo.applied.filter(item => {
            return item !== request.body.personId;
        });

        taskInfo.accepted.push(request.body.personId);

        const userInfo = await UserInfo.findOne({ userId: request.body.personId });

        userInfo.tasksApplied = userInfo.tasksApplied.filter(item => {
            return item !== request.body.taskId;
        });

        userInfo.tasksActive.push(request.body.taskId);

        try {
            await taskInfo.save();
            await userInfo.save();
            await newNotification(userInfo.userId, "Offer approved", `You are approved for the task ${taskInfo.title}.`, taskInfo.taskId, "channel_approved");
            reply.send({ message: "success" });
        } catch(err) {
            Terminal.severe(err.stack);
            reply.code(403).send({ error: "Something went wrong..."});
        }
    });
}