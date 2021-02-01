import Terminal from "../Terminal";
import { UserInfo } from "../Inro";

async function onCommand(args) {
    const userInfo = await UserInfo.findOne({ userId: args[0] });

    if(!userInfo) {
        Terminal.warning("User not found!");
        return;
    }

    Terminal.info(`Information for user ${userInfo.userId}:\n${userInfo}`);
}

const CInfoUser = {
    onCommand
};

export default CInfoUser;