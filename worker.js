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
const dotenv_1 = __importDefault(require("dotenv"));
const graphile_worker_1 = require("graphile-worker");
const path_1 = __importDefault(require("path"));
const process_jobs_1 = require("./tasks/process-jobs");
dotenv_1.default.config();
const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
    throw new Error("❌ DATABASE_URL is not set in environment variables");
}
// ✅ Define your custom task logic
const tasks = {
    "process-job": (payload) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("📜 Processing job with dynamic scheduling:", payload);
        // ✅ Extract the properties directly from payload
        const { accountId, cryptoId } = payload;
        // ✅ Ensure extracted values exist before proceeding
        if (!accountId || !cryptoId) {
            console.error("❌ Missing required parameters in payload:", payload);
            return;
        }
        // ✅ Call trade processing function with extracted values
        yield (0, process_jobs_1.scheduleTradeJob)({ accountId, cryptoId });
    }),
};
function startWorker() {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, graphile_worker_1.run)({
            connectionString: dbUrl,
            taskList: tasks,
            crontabFile: path_1.default.resolve(__dirname, "crontab"),
        });
        console.log("✅ Worker started with dynamic scheduling!");
    });
}
startWorker();
