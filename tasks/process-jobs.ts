import { makeWorkerUtils } from "graphile-worker";
import dotenv from "dotenv";
import { getCryptoById, generateExecutionInterval } from "../core";

dotenv.config();

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  throw new Error("❌ DATABASE_URL is not set or invalid");
}

// ✅ Utility to publish a new job
export async function scheduleTradeJob(payload: { accountId: string; cryptoId: string }) {
    const { accountId, cryptoId } = payload;

    const workerUtils = await makeWorkerUtils({ connectionString: dbUrl });

    const account = getCryptoById(cryptoId);
    if (!account) {
        console.error("❌ Invalid cryptoId:", cryptoId);
        return;
    }

    const intervalMs = generateExecutionInterval(account);
    await workerUtils.addJob("process-job", { accountId, cryptoId }, { runAt: new Date(Date.now() + intervalMs) });

    console.log(`🚀 Scheduled trade job for account ${accountId} | Execution in ${intervalMs} ms`);
}

// ✅ Initial Job Publication
async function publishJob() {
  await scheduleTradeJob({ accountId: "test-user-123", cryptoId: "btc-456" });
}

publishJob();