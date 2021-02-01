import Terminal from "./Terminal";

import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import * as admin from "firebase-admin";

import fastify from "fastify";

import AUserAuth from "./api/user/UserAuth";
import AUserSignUp from "./api/user/UserSignUp";
import AUserLogin from "./api/user/UserLogin";
import AUserInfo from "./api/user/UserInfo";
import AUserUpdateBio from "./api/user/UserUpdateBio";
import AUserUpdatePassword from "./api/user/UserUpdatePassword";
import AUserUpdateAvatar from "./api/user/UserUpdateAvatar";
import AUserLogout from "./api/user/UserLogout";
import AUserPasswordReset from "./api/user/UserPasswordReset";

import ATaskInfo from "./api/task/TaskInfo";
import ATaskList from "./api/task/TaskList";
import ATaskNew from "./api/task/TaskNew";
import ATaskRemove from "./api/task/TaskRemove"
import ATaskApply from "./api/task/TaskApply";
import ATaskAccept from "./api/task/TaskAccept";
import ATaskReject from "./api/task/TaskReject";
import ATaskComplete from "./api/task/TaskComplete";
import ATaskCancel from "./api/task/TaskCancel";
import ATaskCompleted from "./api/task/TaskCompleted";

import ANotificationList from "./api/notification/NotificationList";
import ANotificationRead from "./api/notification/NotificationRead";
import ANotificationDelete from "./api/notification/NotificationDelete";
import ANotificationUnread from "./api/notification/NotificationUnread";

import ARateGet from "./api/rate/RateGet";
import ARateUser from "./api/rate/RateUser";

const notificationInfoSchema = new mongoose.Schema({
    notId: Number,
    title: String,
    message: String,
    taskId: Number,
    time: String,
    read: Boolean
});

const ratingInfoSchema = new mongoose.Schema({
    userId: {
        type: Number,
        default: 0
    },
    taskId: {
        type: Number,
        default: 0
    },
    rating: Number
});

const userInfoSchema = new mongoose.Schema({
    userId: {
        type: Number,
        unique: true
    },
    name: String,
    username: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        unique: true
    },
    password: String,
    phone: String,
    dateOfBirth: String,
    ic: String,
    loggedIn: Boolean,
    shortDescription: {
        type: String,
        default: "No short description"
    },
    description: {
        type: String,
        default: "No description"
    },
    avatar: {
        type: String,
        default: ""
    },
    rating: {
        type: Number,
        default: 0
    },
    totalRatings: {
        type: Number,
        default: 0
    },
    totalRatingsNo: {
        type: Number,
        default: 0
    },
    tasksCreated: {
        type: [Number],
        default: []
    },
    tasksApplied: {
        type: [Number],
        default: []
    },
    tasksActive: {
        type: [Number],
        default: []
    },
    tasksRejected: {
        type: [Number],
        default: []
    },
    tasksCompleted: {
        type: [Number],
        default: []
    },
    tasksCompletedCategory: {
        type: [Number],
        default: []
    },
    fcmToken: String,
    notificationId: {
        type: Number,
        default: 0
    },
    notifications: {
        type: [notificationInfoSchema],
        default: []
    },
    ratings: {
        type: [ratingInfoSchema],
        default: []
    },
    locked: {
        type: Boolean,
        default: false
    },
    ip: {
        type: String
    }
});

const taskInfoSchema = new mongoose.Schema({
    taskId: Number,
    category: Number,
    title: String,
    description: String,
    time: String,
    location: String,
    address: String,
    price: String,
    expire: String,
    ownerId: Number,
    isCompleted: Boolean,
    looking: {
        type: Number,
        default: 0
    },
    accepted: {
        type: [Number],
        default: []
    },
    applied: {
        type: [Number],
        default: []
    },
    rejected: {
        type: [Number],
        default: []
    },
    completed: {
        type: [Number],
        default: []
    }
});

export const UserInfo = mongoose.model("UserInfo", userInfoSchema);
export const TaskInfo = mongoose.model("TaskInfo", taskInfoSchema);

const app = fastify({
    bodyLimit: 6291456,
    trustProxy: true
});

app.setErrorHandler((error, request, reply) => {
    Terminal.severe(error.stack);
    reply.code(400).send({ error: "An error has occured!"});
});

const auth = async (request, reply) => {
    if(!request.headers.authorization) {
        reply.code(401).send({ error: "Authorization header not found" });
        return;
    }

    try {
        jwt.verify(request.headers.authorization, "empycXBzZXRzcg==");
    } catch (err) {
        reply.code(401).send({error: "Invalid token"});
    }
};

app.decorate("auth", auth);

app.get("/", async (request, reply) => {
    reply.send({ status: "200 OK" });
});

app.register(AUserAuth);
app.register(AUserSignUp);
app.register(AUserLogin);
app.register(AUserInfo);
app.register(AUserUpdateBio);
app.register(AUserUpdateAvatar);
app.register(AUserUpdatePassword);
app.register(AUserLogout);
app.register(AUserPasswordReset);

app.register(ATaskInfo);
app.register(ATaskList);
app.register(ATaskNew);
app.register(ATaskRemove);
app.register(ATaskApply);
app.register(ATaskAccept);
app.register(ATaskReject);
app.register(ATaskComplete);
app.register(ATaskCancel);
app.register(ATaskCompleted);

app.register(ANotificationList);
app.register(ANotificationRead);
app.register(ANotificationDelete);
app.register(ANotificationUnread);

app.register(ARateGet);
app.register(ARateUser);

let firebase = null;
export let fcm = null;

export async function start() {
    try {
        await mongoose.connect("mongodb://localhost/test", {
            useNewUrlParser: true ,
            useUnifiedTopology: true,
            useCreateIndex: true
        });

        Terminal.info("Connected to database");

        firebase = admin.initializeApp({
            credential: admin.credential.applicationDefault(),
            projectId: ""
        });

        fcm = firebase.messaging();

        Terminal.info("Connected to firebase");

        await app.listen(10113, "0.0.0.0");
        Terminal.info("HTTP Server started on port 10113");
    } catch(err) {
        Terminal.severe("Error when starting InRo");
        Terminal.severe(err.stack);
        await stop(1);
    }
}

export async function stop(stopCode) {
    await mongoose.disconnect();
    await app.close();
    process.exit(stopCode);
}
