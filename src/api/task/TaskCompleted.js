import { TaskInfo } from "../../Inro";
import Terminal from "../../Terminal";

/**
 * @param {import("fastify").FastifyInstance} fastify
 */
export default async function routes(fastify, options) {
    fastify.post("/task/completed", { preValidation: [fastify.auth] }, async (request, reply) => {
        const taskInfo = await TaskInfo.findOne({ taskId: request.body.taskId });

        if(!taskInfo) {
            reply.code(403).send({ error: "Task not found!" });
            return;
        }

        taskInfo.isCompleted = true;

        try {
            await taskInfo.save();
            reply.send({ message: "success" });
        } catch(err) {
            Terminal.severe(err.stack);
            reply.code(403).send({ error: "Something went wrong..."});
        }
    });
}