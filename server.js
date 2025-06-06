"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const graphile_worker_1 = require("graphile-worker");
const core_1 = require("./core");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const PORT = Number(process.env.PORT) || 8080;
const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
    throw new Error("❌ DATABASE_URL is not set in environment variables");
}
// ✅ Initialize Worker Utils
function initWorkerUtils() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield (0, graphile_worker_1.makeWorkerUtils)({ connectionString: dbUrl });
    });
}
// ✅ API to schedule trade execution
app.post("/trade", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { accountId, cryptoId } = req.body;
        if (!accountId || !cryptoId) {
            res.status(400).json({ error: "❌ Missing required parameters: accountId or cryptoId" });
            return;
        }
        // ✅ Match `cryptoId` with predefined trade data
        const account = (0, core_1.getCryptoById)(cryptoId);
        if (!account) {
            res.status(400).json({ error: "❌ Invalid cryptoId provided" });
            return;
        }
        // ✅ Process trade & generate dynamic execution interval
        yield (0, core_1.processTrade)(account);
        const intervalMs = (0, core_1.generateExecutionInterval)(account);
        // ✅ Schedule trade job using Graphile Worker
        const workerUtils = yield initWorkerUtils();
        yield workerUtils.addJob("process-job", { accountId, cryptoId }, { runAt: new Date(Date.now() + intervalMs) });
        console.log(`🚀 Trade scheduled for account ${accountId} | Execution in ${intervalMs} ms`);
        res.status(200).json({ success: true, message: "✅ Trade scheduled dynamically!" });
    }
    catch (error) {
        console.error("❌ Error scheduling trade:", error);
        res.status(500).json({ success: false, message: "❌ Failed to schedule trade" });
    }
}));
// ✅ Health Check Endpoint
app.get("/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date() });
});
// ✅ Start Server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
