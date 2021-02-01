import { UserInfo, fcm } from "../../Inro";
import Terminal from "../../Terminal";

/**
 * @param {Number} userId
 * @param {String} title
 * @param {String} message
 * @param {Number} taskId
 * @param {String} channelId
 */
export async function newNotification(userId, title, message, taskId, channelId) {
    const userInfo = await UserInfo.findOne({ userId: userId });

    const currentId = userInfo.notificationId + 1;

    const notification = {
        notId: currentId,
        title: title,
        message: message,
        taskId: taskId,
        time: new Date().toUTCString(),
        read: false
    };

    userInfo.notifications.push(notification);
    userInfo.notificationId = currentId;

    const fcmMessage = {
        android: {
            priority: "high"
        },
        data: {
            title: title,
            body: message,
            channelId: channelId,
            when: String(Date.now()),
            taskId: taskId.toString()
        },
        token: userInfo.fcmToken
    };

    try {
        await userInfo.save();
        if(userInfo.loggedIn && !userInfo.locked) {
            await fcm.send(fcmMessage);
        }
    } catch(err) {
        Terminal.severe(err.stack);
    }
}