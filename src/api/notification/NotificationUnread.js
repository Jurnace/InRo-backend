import { UserInfo } from "../../Inro";

/**
 * @param {import("fastify").FastifyInstance} fastify
 */
export default async function routes(fastify, options) {
    fastify.post("/notification/unread", { preValidation: [fastify.auth] }, async (request, reply) => {
        const userInfo = await UserInfo.findOne({ userId: request.body.userId });

        if(!userInfo) {
            reply.code(403).send({ error: "User not found" });
            return;
        }

        let count = 0;

        userInfo.notifications.forEach(item => {
            if(!item.read) {
                count++;
            }
        });

        reply.send({ unread: count });
    });
}