import { TaskInfo } from "../../Inro";

/**
 * @param {import("fastify").FastifyInstance} fastify
 */
export default async function routes(fastify, options) {
    fastify.post("/task/info", { preValidation: [fastify.auth] }, async (request, reply) => {
        const taskInfo = await TaskInfo.findOne({ taskId: request.body.taskId });

        if(!taskInfo) {
            reply.code(403).send({ error: "Task not found!" });
            return;
        }

        reply.send({
            taskId: taskInfo.taskId,
            category: taskInfo.category,
            title: taskInfo.title,
            description: taskInfo.description,
            time: taskInfo.time,
            location: taskInfo.location,
            address: taskInfo.address,
            price: taskInfo.price,
            expire: taskInfo.expire,
            ownerId: taskInfo.ownerId,
            looking: taskInfo.looking,
            isCompleted: taskInfo.isCompleted,
            accepted: taskInfo.accepted,
            applied: taskInfo.applied,
            rejected: taskInfo.rejected,
            completed: taskInfo.completed
        });
    });
}