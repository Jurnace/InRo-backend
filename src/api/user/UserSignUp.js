import { UserInfo } from "../../Inro";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import path from "path";
import { promises as fs} from "fs";
import Terminal from "../../Terminal";

/**
 * @param {import("fastify").FastifyInstance} fastify
 */
export default async function routes(fastify, options) {
    fastify.post("/user/signup", async (request, reply) => {
        const findEmail = await UserInfo.exists({ email: request.body.email });
        if(findEmail) {
            reply.code(403).send({ error: "Email address is in use!"});
            return;
        }

        const findName = await UserInfo.exists({ username: request.body.username });
        if(findName) {
            reply.code(403).send({ error: "Username is in use!"});
            return;
        }

        const currentId = await UserInfo.findOne().sort("-userId");
        let id = 1;
        if(currentId) {
            id = currentId.userId + 1;
        }

        const hash = await bcrypt.hash(request.body.password, 10);

        const fileName = id + crypto.randomBytes(3).toString("hex");

        let extension = "";
        switch(request.body.ic.charAt(0)) {
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

        const userInfo = new UserInfo({
            userId: id,
            name: request.body.name,
            username: request.body.username,
            email: request.body.email,
            password: hash,
            phone: request.body.phone,
            dateOfBirth: request.body.dateOfBirth,
            ic: fileName + extension,
            fcmToken: request.body.fcmToken,
            loggedIn: true,
            ip: request.ip
        });

        try {
            await fs.writeFile(path.join(process.env.ASSETS_DIR, fileName + extension), request.body.ic, { encoding: "base64" });
            await userInfo.save();
            const token = jwt.sign({ email: request.body.email }, "empycXBzZXRzcg==", {expiresIn: "60d"});
            reply.send({ message: "Success", token: token, userId: id });
        } catch (err) {
            Terminal.severe(err.stack);
            reply.code(403).send({ error: "Something went wrong..."});
        }
    });
}