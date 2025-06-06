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
Object.defineProperty(exports, "__esModule", { value: true });
exports.processTradeTransaction = exports.updateTradeStats = exports.updateTradeAccounts = exports.addTradeLog = exports.getAccountById = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// ✅ Fetch Account Details Without Redis
const getAccountById = (provider, providerAccountId) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma.account.findFirst({
        where: { provider, providerAccountId }
    });
});
exports.getAccountById = getAccountById;
// ✅ Log Trade Execution in TradeLogs
const addTradeLog = (trade) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma.tradeLogs.create({
        data: {
            userId: trade.userId, // ✅ Ensure we store user ID in TradeLogs
            crypto: trade.matchedCrypto.name,
            result: trade.result,
        },
    });
});
exports.addTradeLog = addTradeLog;
// ✅ Update Account Balance Correctly
const updateTradeAccounts = (userId, result) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma.user.update({
        where: { id: userId },
        data: { accBal: { increment: result } }, // ✅ Correct field from schema
    });
});
exports.updateTradeAccounts = updateTradeAccounts;
// ✅ Update Trade Statistics in InvestmentSummary
const updateTradeStats = (userId, result) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma.investmentSummary.update({
        where: { id: userId },
        data: {
            wins: result > 0 ? { increment: 1 } : undefined,
            loss: result <= 0 ? { increment: 1 } : undefined,
        },
    });
});
exports.updateTradeStats = updateTradeStats;
// ✅ Process Trade Transaction Safely
const processTradeTransaction = (accountId, tradeData) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        yield tx.tradeLogs.create({
            data: {
                userId: tradeData.userId,
                crypto: tradeData.matchedCrypto.name,
                result: tradeData.result,
            },
        });
        yield tx.user.update({
            where: { id: tradeData.userId },
            data: { accBal: { increment: tradeData.result } },
        });
        yield tx.investmentSummary.update({
            where: { id: tradeData.userId },
            data: tradeData.result > 0 ? { wins: { increment: 1 } } : { loss: { increment: 1 } },
        });
    }));
    console.log("✅ Trade processed successfully!");
});
exports.processTradeTransaction = processTradeTransaction;
