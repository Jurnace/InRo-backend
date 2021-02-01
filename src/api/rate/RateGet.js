import { UserInfo } from "../../Inro";

/**
 * @param {import("fastify").FastifyInstance} fastify
 */
export default async function routes(fastify, options) {
    fastify.post("/rate/get", { preValidation: [fastify.auth] }, async (request, reply) => {
        const userInfo = await UserInfo.findOne({ userId: request.body.userId });

        if(!userInfo) {
            reply.code(403).send({ error: "User not found" });
            return;
        }

        let found = false;
        let index = 0;

        if(userInfo.ratings.some((item, i) => {
            index = i;
            return item.taskId === request.body.taskId;
        })) {
            found = true;
        }

        const rating = found ? userInfo.ratings[index] : null;

        reply.send({ rating: rating });
    });
}