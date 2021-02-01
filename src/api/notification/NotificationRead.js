import { UserInfo } from "../../Inro";
import Terminal from "../../Terminal";

/**
 * @param {import("fastify").FastifyInstance} fastify
 */
export default async function routes(fastify, options) {
    fastify.post("/notification/read", { preValidation: [fastify.auth] }, async (request, reply) => {
        const userInfo = await UserInfo.findOne({ userId: request.body.userId });

        if(!userInfo) {
            reply.code(403).send({ error: "User not found" });
            return;
        }

        userInfo.notifications.forEach((item, index) => {
            if(item.notId === request.body.notId) {
                userInfo.notifications[index].read = true;
            }
        });

        try {
            await userInfo.save();
            reply.send({ message: "success" });
        } catch(err) {
            Terminal.severe(err.stack);
            reply.status(403).send({ error: "Something went wrong..." });
        }
    });
}