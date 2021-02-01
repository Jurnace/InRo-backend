import { UserInfo } from "../../Inro";
import crypto from "crypto";
import path from "path";
import { promises as fs} from "fs";
import Terminal from "../../Terminal";

/**
 * @param {import("fastify").FastifyInstance} fastify
 */
export default async function routes(fastify, options) {
    fastify.post("/user/updateavatar", { preValidation: [fastify.auth] }, async (request, reply) => {
        const userInfo = await UserInfo.findOne({ userId: request.body.userId });

        if(!userInfo) {
            reply.code(403).send({ error: "User not found" });
            return;
        }

        const fileName = userInfo.userId + crypto.randomBytes(3).toString("hex");

        let extension = "";
        switch(request.body.image.charAt(0)) {
            case "/":
                extension = ".jpg";
                break;
            case "i":
                extension = ".png";
                break;
            case "R":
                extension = ".gif";
                break;
            case "U":
                extension = ".webp";
                break;
        }

        try {
            if(userInfo.avatar) {
                await fs.unlink(path.join(process.env.ASSETS_DIR, userInfo.avatar));
            }

            await fs.writeFile(path.join(process.env.ASSETS_DIR, fileName + extension), request.body.image, { encoding: "base64" });

            userInfo.avatar = fileName + extension;
            await userInfo.save();

            reply.send({ message: "success" });
        } catch(err) {
            Terminal.severe(err.stack);
            reply.code(403).send({ error: "Something went wrong..."});
        }
    });
}