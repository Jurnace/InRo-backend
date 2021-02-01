import { UserInfo } from "../../Inro";
import Terminal from "../../Terminal";

/**
 * @param {import("fastify").FastifyInstance} fastify
 */
export default async function routes(fastify, options) {
    fastify.post("/notification/delete", { preValidation: [fastify.auth] }, async (request, reply) => {
        const userInfo = await UserInfo.findOne({ userId: request.body.userId });

        if(!userInfo) {
            reply.code(403).send({ error: "User not found" });
            return;
        }

        userInfo.notifications = userInfo.notifications.filter(item => {
            return item.notId !== request.body.notId
        });

        try {
            await userInfo.save();
            reply.send({ message: "success " });
        } catch(err) {
            Terminal.severe(err.stack);
            reply.status(403).send({ error: "Something went wrong... " });
        }
    });
}