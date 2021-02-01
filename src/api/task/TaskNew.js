import { UserInfo, TaskInfo } from "../../Inro";
import Terminal from "../../Terminal";

/**
 * @param {import("fastify").FastifyInstance} fastify
 */
export default async function routes(fastify, options) {
    fastify.post("/task/new", { preValidation: [fastify.auth] }, async (request, reply) => {
        let id = 1;
        const currentId = await TaskInfo.findOne().sort("-taskId");
        if(currentId) {
            id = currentId.taskId + 1
        }

        const userInfo = await UserInfo.findOne({ userId: request.body.ownerId });

        if(!userInfo) {
            reply.code(403).send({ error: "User not found" });
            return;
        }

        userInfo.tasksCreated.push(id);

        const taskInfo = new TaskInfo({
            taskId: id,
            category: request.body.category,
            title: request.body.title,
            description: request.body.description,
            time: request.body.time,
            location: request.body.location,
            address: request.body.address,
            price: request.body.price,
            expire: request.body.expire,
            ownerId: request.body.ownerId,
            looking: request.body.looking,
            isCompleted: false
        });

        try {
            await taskInfo.save();
            await userInfo.save();
            reply.send({ message: "success" });
        } catch(err) {
            Terminal.severe(err.stack);
            reply.code(403).send({ error: "Something went wrong..."});
        }
    });
}