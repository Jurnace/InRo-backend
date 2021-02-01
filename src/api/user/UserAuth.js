import { UserInfo } from "../../Inro";
import jwt from "jsonwebtoken";

/**
 * @param {import("fastify").FastifyInstance} fastify
 */
export default async function routes(fastify, options) {
    fastify.get("/user/auth", async (request, reply) => {
        if(!request.headers.authorization) {
            reply.code(401).send({ error: "Authorization header not found" });
            return;
        }

        try {
            const data = request.headers.authorization.split(" ");

            jwt.verify(data[0], "empycXBzZXRzcg==");

            const userInfo = await UserInfo.exists({ userId: Number(data[1]) });
            if(!userInfo) {
                reply.code(401).send({ error: "Invalid token" });
                return;
            }

            if(jwt.email !== userInfo.email) {
                reply.code(401).send({ error: "Invalid token" });
                return;
            }

            if(userInfo.locked) {
                reply.code(401).send({ error: "Your account is locked. Please contact support for more information." });
                return;
            }

            reply.send({ message: "Authorization successful" });
        } catch (err) {
            reply.code(401).send({error: "Invalid token"});
        }
    });
}