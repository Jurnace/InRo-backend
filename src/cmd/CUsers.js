import Terminal from "../Terminal";
import { UserInfo } from "../Inro";

async function onCommand() {
    const userInfo = await UserInfo.findOne().sort("-userId");

    const currentId = userInfo ? userInfo.userId : "0";

    Terminal.info(`Number of users: ${currentId}`);
}

const CUsers = {
    onCommand
};

export default CUsers;