import { UserInfo } from "../../Inro";
import Terminal from "../../Terminal";

/**
 * @param {import("fastify").FastifyInstance} fastify
 */
export default async function routes(fastify, options) {
    fastify.post("/rate/user", { preValidation: [fastify.auth] }, async (request, reply) => {
        const userInfo = await UserInfo.findOne({ userId: request.body.userId });

        if(!userInfo) {
            reply.code(403).send({ error: "User not found" });
            return;
        }

        const rat = {
            userId: request.body.targetId,
            taskId: request.body.taskId,
            rating: request.body.rating
        };

        userInfo.ratings.push(rat);

        const targetUserInfo = await UserInfo.findOne({ userId: request.body.targetId });
        targetUserInfo.totalRatings += request.body.rating;
        targetUserInfo.totalRatingsNo += 1;
        targetUserInfo.rating = Number((targetUserInfo.totalRatings / targetUserInfo.totalRatingsNo).toFixed(2));

        try {
            await userInfo.save();
            await targetUserInfo.save();
            reply.send({ message: "success" });
        } catch(err) {
            Terminal.severe(err.stack);
            reply.status(403).send({ error: "Something went wrong..." });
        }
    });
}