import { UserInfo } from "../../Inro";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Terminal from "../../Terminal";

/**
 * @param {import("fastify").FastifyInstance} fastify
 */
export default async function routes(fastify, options) {
    fastify.post("/user/login", async (request, reply) => {
        const userInfo = await UserInfo.findOne({ email: request.body.email });

        if(!userInfo) {
            reply.code(403).send({ error: "User not found" });
            return;
        }

        const check = await bcrypt.compare(request.body.password, userInfo.password);

        if(!check) {
            reply.code(403).send({ error: "Incorrect password" });
            return;
        }

        if(userInfo.locked) {
            reply.code(401).send({ error: "Your account is locked. Please contact support for more information." });
            return;
        }

        const token = jwt.sign({ email: userInfo.email }, "empycXBzZXRzcg==", { expiresIn: "60d" });

        userInfo.fcmToken = request.body.fcmToken;
        userInfo.loggedIn = true;
        userInfo.ip = request.ip;

        try {
            await userInfo.save();
            reply.send({ message: "Success", token: token, userId: userInfo.userId });
        } catch(err) {
            Terminal.severe(err.stack);
            reply.code(403).send({ error: "Something went wrong..."});
        }
    });
}