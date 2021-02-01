import { UserInfo } from "../../Inro";
import bcrypt from "bcrypt";
import Terminal from "../../Terminal";

/**
 * @param {import("fastify").FastifyInstance} fastify
 */
export default async function routes(fastify, options) {
    fastify.post("/user/resetpassword", async (request, reply) => {
        const userInfo = await UserInfo.findOne({ email: request.body.email });

        if(!userInfo) {
            reply.code(403).send({ error: "User not found" });
            return;
        }

        const hash = await bcrypt.hash(request.body.newPassword, 10);

        userInfo.password = hash;

        try {
            await userInfo.save();
            reply.send({ success: "success" });
        } catch(err) {
            Terminal.severe(err.stack);
            reply.code(403).send({ error: "Something went wrong..."});
        }
    });
}