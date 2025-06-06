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
exports.scheduleTradeJob = scheduleTradeJob;
const graphile_worker_1 = require("graphile-worker");
const dotenv_1 = __importDefault(require("dotenv"));
const core_1 = require("../core");
dotenv_1.default.config();
const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
    throw new Error("❌ DATABASE_URL is not set or invalid");
}
// ✅ Utility to publish a new job
function scheduleTradeJob(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        const { accountId, cryptoId } = payload;
        const workerUtils = yield (0, graphile_worker_1.makeWorkerUtils)({ connectionString: dbUrl });
        const account = (0, core_1.getCryptoById)(cryptoId);
        if (!account) {
            console.error("❌ Invalid cryptoId:", cryptoId);
            return;
        }
        const intervalMs = (0, core_1.generateExecutionInterval)(account);
        yield workerUtils.addJob("process-job", { accountId, cryptoId }, { runAt: new Date(Date.now() + intervalMs) });
        console.log(`🚀 Scheduled trade job for account ${accountId} | Execution in ${intervalMs} ms`);
    });
}
// ✅ Initial Job Publication
function publishJob() {
    return __awaiter(this, void 0, void 0, function* () {
        yield scheduleTradeJob({ accountId: "test-user-123", cryptoId: "btc-456" });
    });
}
publishJob();
