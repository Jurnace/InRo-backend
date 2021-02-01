import { UserInfo } from "../../Inro";
import bcrypt from "bcrypt";
import Terminal from "../../Terminal";

/**
 * @param {import("fastify").FastifyInstance} fastify
 */
export default async function routes(fastify, options) {
    fastify.post("/user/updatepassword", { preValidation: [fastify.auth] }, async (request, reply) => {
        const userInfo = await UserInfo.findOne({ userId: request.body.userId });

        if(!userInfo) {
            reply.code(403).send({ error: "User not found" });
            return;
        }

        const check = await bcrypt.compare(request.body.currentPassword, userInfo.password);
        if(!check) {
            reply.code(403).send({ error: "Incorrect current password" });
            return;
        }

        const hash = await bcrypt.hash(request.body.newPassword, 10);
        userInfo.password = hash;

        try {
            await userInfo.save();
            reply.send({ message: "success" });
        } catch(err) {
            Terminal.severe(err.stack);
            reply.code(403).send({ error: "Something went wrong..."});
        }
    });
}