import { UserInfo } from "../../Inro";

/**
 * @param {import("fastify").FastifyInstance} fastify
 */
export default async function routes(fastify, options) {
    fastify.post("/user/info", { preValidation: [fastify.auth] }, async (request, reply) => {
        const userInfo = await UserInfo.findOne({ userId: request.body.userId });

        if(!userInfo) {
            reply.code(403).send({ error: "User not found" });
            return;
        }

        reply.send({
            userId: userInfo.userId,
            name: userInfo.name,
            username: userInfo.username,
            email: userInfo.email,
            password: userInfo.password,
            phone: userInfo.phone,
            dateOfBirth: userInfo.dateOfBirth,
            ic: userInfo.ic,
            shortDescription: userInfo.shortDescription,
            description: userInfo.description,
            avatar: userInfo.avatar,
            rating: userInfo.rating,
            totalRatings: userInfo.totalRatings,
            totalRatingsNo: userInfo.totalRatingsNo,
            tasksCreated: userInfo.tasksCreated,
            tasksApplied: userInfo.tasksApplied,
            tasksActive: userInfo.tasksActive,
            tasksRejected: userInfo.tasksRejected,
            tasksCompleted: userInfo.tasksCompleted
        });
    });
}