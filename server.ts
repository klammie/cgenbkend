import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { makeWorkerUtils } from "graphile-worker";
import { getCryptoById, generateExecutionInterval, processTrade } from "./core";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;
const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  throw new Error("❌ DATABASE_URL is not set in environment variables");
}

// ✅ Initialize Worker Utils
async function initWorkerUtils() {
  return await makeWorkerUtils({ connectionString: dbUrl });
}

// ✅ API to schedule trade execution
app.post("/trade", async (req: Request, res: Response): Promise<void> => {
  try {
    const { accountId, cryptoId } = req.body;

    if (!accountId || !cryptoId) {
      res.status(400).json({ error: "❌ Missing required parameters: accountId or cryptoId" });
      return;
    }

    // ✅ Match `cryptoId` with predefined trade data
    const account = getCryptoById(cryptoId);
    if (!account) {
      res.status(400).json({ error: "❌ Invalid cryptoId provided" });
      return;
    }

    // ✅ Process trade & generate dynamic execution interval
    await processTrade(account);
    const intervalMs = generateExecutionInterval(account);

    // ✅ Schedule trade job using Graphile Worker
    const workerUtils = await initWorkerUtils();
    await workerUtils.addJob("process-job", { accountId, cryptoId }, { runAt: new Date(Date.now() + intervalMs) });

    console.log(`🚀 Trade scheduled for account ${accountId} | Execution in ${intervalMs} ms`);
    res.status(200).json({ success: true, message: "✅ Trade scheduled dynamically!" });
    
  } catch (error) {
    console.error("❌ Error scheduling trade:", error);
    res.status(500).json({ success: false, message: "❌ Failed to schedule trade" });
  }
});

// ✅ Health Check Endpoint
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date() });
});

// ✅ Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));