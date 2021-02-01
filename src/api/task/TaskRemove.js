import { UserInfo, TaskInfo } from "../../Inro";
import Terminal from "../../Terminal";

/**
 * @param {import("fastify").FastifyInstance} fastify
 */
export default async function routes(fastify, options) {
    fastify.post("/task/remove", { preValidation: [fastify.auth] }, async (request, reply) => {
        const userInfo = await UserInfo.findOne({ userId: request.body.userId });

        if(!userInfo.tasksCreated.includes(request.body.taskId)) {
            reply.code(403).send({ error: "You don't have permission to do this"});
            return;
        }

        userInfo.tasksCreated = userInfo.tasksCreated.filter(item => {
            return item !== request.body.taskId;
        });

        const taskInfo = await TaskInfo.findOne({ taskId: request.body.taskId });

        const usersAppliedList = await UserInfo.where("userId").in(taskInfo.applied);
        const usersRejectedList = await UserInfo.where("userId").in(taskInfo.rejected);

        try {
            for(const user of usersAppliedList) {
                user.tasksApplied = user.tasksApplied.filter(item => {
                    return item !== request.body.taskId;
                });
                await user.save();
            }

            for(const user of usersRejectedList) {
                user.tasksRejected = user.tasksRejected.filter(item => {
                    return item !== request.body.taskId;
                });
                await user.save();
            }

            await TaskInfo.deleteOne({ taskId: request.body.taskId });
            await userInfo.save();
            reply.send({ message: "success" });
        } catch(err) {
            Terminal.severe(err.stack);
            reply.code(403).send({ error: "Something went wrong..."});
        }
    });
}