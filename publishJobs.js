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
dotenv_1.default.config();
const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
    throw new Error("❌ DATABASE_URL is not set in environment variables");
}
// ✅ Explicit type check to ensure dbUrl is a valid string
if (typeof dbUrl !== "string" || dbUrl.trim() === "") {
    throw new Error("❌ DATABASE_URL is invalid or empty");
}
function publishJob() {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, graphile_worker_1.quickAddJob)(dbUrl, "process-job", {
            userId: "test-user-123",
            cryptoId: "btc-456",
        });
        console.log("🚀 Job published!");
    });
}
publishJob();
