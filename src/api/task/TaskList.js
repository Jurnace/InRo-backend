import { UserInfo, TaskInfo } from "../../Inro";
/**
 * @param {import("fastify").FastifyInstance} fastify
 */
export default async function routes(fastify, options) {
    fastify.post("/task/list", { preValidation: [fastify.auth] }, async (request, reply) => {
        if(request.body.type === 0) {
            const tasks = await TaskInfo.find();
            const userInfo = await UserInfo.findOne({ userId: request.body.userId });

            if(!userInfo) {
                reply.code(403).send({ error: "User not found" });
                return;
            }

            const tasksList = [];
            const date = new Date();

            const recommendedList = [];

            let recommendType = mode(userInfo.tasksCompleted);

            let counter = 0;

            for(const task of tasks) {
                if(task.accepted.length + task.completed.length < task.looking && !task.isCompleted) {
                    const d = new Date(task.expire);
                    if(date <= d) {
                        tasksList.push({
                            taskId: task.taskId,
                            category: task.category,
                            title: task.title,
                            description: task.description,
                            time: task.time,
                            location: task.location,
                            address: task.address,
                            price: task.price,
                            expire: task.expire,
                            ownerId: task.ownerId,
                            looking: task.looking,
                            isCompleted: task.isCompleted,
                            accepted: task.accepted,
                            applied: task.applied,
                            rejected: task.rejected,
                            completed: task.completed
                        });

                        if(recommendType) {
                            if(counter < 3) {
                                if(task.category === recommendType) {
                                    recommendedList.push({
                                        taskId: task.taskId,
                                        category: task.category,
                                        title: task.title,
                                        description: task.description,
                                        time: task.time,
                                        location: task.location,
                                        address: task.address,
                                        price: task.price,
                                        expire: task.expire,
                                        ownerId: task.ownerId,
                                        looking: task.looking,
                                        isCompleted: task.isCompleted,
                                        accepted: task.accepted,
                                        applied: task.applied,
                                        rejected: task.rejected,
                                        completed: task.completed
                                    });
                                    counter++;
                                }
                            }
                        }
                    }
                }
            }

            reply.send({ tasksList, recommendedList });

            return;
        }

        const userInfo = await UserInfo.findOne({ userId: request.body.userId });

        const tasksCreated = [];
        const tasksApplied = [];
        const tasksActive = [];
        const tasksRejected = [];
        const tasksCompleted = [];

        const tasksCreatedList = await TaskInfo.find().where("taskId").in(userInfo.tasksCreated);
        const tasksAppliedList = await TaskInfo.find().where("taskId").in(userInfo.tasksApplied);
        const tasksActiveList = await TaskInfo.find().where("taskId").in(userInfo.tasksActive);
        const tasksRejectedList = await TaskInfo.find().where("taskId").in(userInfo.tasksRejected);
        const tasksCompletedList = await TaskInfo.find().where("taskId").in(userInfo.tasksCompleted);

        for(const task of tasksCreatedList) {
            tasksCreated.push({
                taskId: task.taskId,
                category: task.category,
                title: task.title,
                description: task.description,
                time: task.time,
                location: task.location,
                address: task.address,
                price: task.price,
                expire: task.expire,
                ownerId: task.ownerId,
                looking: task.looking,
                isCompleted: task.isCompleted,
                accepted: task.accepted,
                applied: task.applied,
                rejected: task.rejected,
                completed: task.completed
            });
        }

        for(const task of tasksAppliedList) {
            tasksApplied.push({
                taskId: task.taskId,
                category: task.category,
                title: task.title,
                description: task.description,
                time: task.time,
                location: task.location,
                address: task.address,
                price: task.price,
                expire: task.expire,
                ownerId: task.ownerId,
                looking: task.looking,
                isCompleted: task.isCompleted,
                accepted: task.accepted,
                applied: task.applied,
                rejected: task.rejected,
                completed: task.completed
            });
        }

        for(const task of tasksActiveList) {
            tasksActive.push({
                taskId: task.taskId,
                category: task.category,
                title: task.title,
                description: task.description,
                time: task.time,
                location: task.location,
                address: task.address,
                price: task.price,
                expire: task.expire,
                ownerId: task.ownerId,
                looking: task.looking,
                isCompleted: task.isCompleted,
                accepted: task.accepted,
                applied: task.applied,
                rejected: task.rejected,
                completed: task.completed
            });
        }

        for(const task of tasksRejectedList) {
            tasksRejected.push({
                taskId: task.taskId,
                category: task.category,
                title: task.title,
                description: task.description,
                time: task.time,
                location: task.location,
                address: task.address,
                price: task.price,
                expire: task.expire,
                ownerId: task.ownerId,
                looking: task.looking,
                isCompleted: task.isCompleted,
                accepted: task.accepted,
                applied: task.applied,
                rejected: task.rejected,
                completed: task.completed
            });
        }

        for(const task of tasksCompletedList) {
            tasksCompleted.push({
                taskId: task.taskId,
                category: task.category,
                title: task.title,
                description: task.description,
                time: task.time,
                location: task.location,
                address: task.address,
                price: task.price,
                expire: task.expire,
                ownerId: task.ownerId,
                looking: task.looking,
                isCompleted: task.isCompleted,
                accepted: task.accepted,
                applied: task.applied,
                rejected: task.rejected,
                completed: task.completed
            });
        }

        reply.send({
            tasksCreated,
            tasksApplied,
            tasksActive,
            tasksRejected,
            tasksCompleted
        });
    });
}

function mode(arr) {
    const _arr = [...arr];
    return _arr.sort((a,b) => _arr.filter(v => v===a).length - _arr.filter(v => v===b).length).pop();
}
