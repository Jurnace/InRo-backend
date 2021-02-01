import Terminal from "../Terminal";
import { UserInfo } from "../Inro";

async function onCommand(args) {
    const userInfo = await UserInfo.findOne({ userId: args[0] });

    if(!userInfo) {
        Terminal.warning("User not found!");
        return;
    }

    userInfo.locked = !userInfo.locked;

    try {
        await userInfo.save();
        if(userInfo.locked) {
            Terminal.info("User account has been locked!");
        } else {
            Terminal.info("User account has been unlocked!");
        }
    } catch (err) {
        Terminal.severe(err.stack);
    }
}

const CLock = {
    onCommand
};

export default CLock;