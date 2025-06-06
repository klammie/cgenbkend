import dotenv from "dotenv";
import { run, Task } from "graphile-worker";
import path from "path";
import { scheduleTradeJob } from "./tasks/process-jobs";

dotenv.config();

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  throw new Error("❌ DATABASE_URL is not set in environment variables");
}

// ✅ Define your custom task logic
const tasks: Record<string, Task> = {
  "process-job": async (payload) => {
    console.log("📜 Processing job with dynamic scheduling:", payload);

    // ✅ Extract the properties directly from payload
    const { accountId, cryptoId } = payload as { accountId: string; cryptoId: string };

    // ✅ Ensure extracted values exist before proceeding
    if (!accountId || !cryptoId) {
      console.error("❌ Missing required parameters in payload:", payload);
      return;
    }

    // ✅ Call trade processing function with extracted values
    await scheduleTradeJob({ accountId, cryptoId });
  },
};

async function startWorker() {
  await run({
    connectionString: dbUrl,
    taskList: tasks,
    crontabFile: path.resolve(__dirname, "crontab"),
  });

  console.log("✅ Worker started with dynamic scheduling!");
}

startWorker();