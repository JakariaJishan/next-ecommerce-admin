import { getCookie } from "@/app/lib/cookies";
import { createConsumer } from "@rails/actioncable";
const token = getCookie("token");

const cable = createConsumer(`ws://127.0.0.1:3000/cable?token=${token}`);

export default cable;
