import Terminal from "../Terminal";
import { stop } from "../Inro";

async function onCommand() {
    Terminal.info("Shutting down InRo...");
    await stop(0);
}

const CExit = {
    onCommand
};

export default CExit;