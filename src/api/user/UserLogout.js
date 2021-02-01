import { UserInfo } from "../../Inro";
import Terminal from "../../Terminal";

/**
 * @param {import("fastify").FastifyInstance} fastify
 */
export default async function routes(fastify, options) {
    fastify.post("/user/logout", async (request, reply) => {
        const userInfo = await UserInfo.findOne({ userId: request.body.userId });

        userInfo.loggedIn = false;

        try {
            await userInfo.save();
            reply.send({ message: "success" });
        } catch(err) {
            Terminal.severe(err.stack);
            reply.code(403).send({ error: "Something went wrong..."});
        }
    });
}