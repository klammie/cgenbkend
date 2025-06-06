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
exports.processTrade = exports.updateTradeStatsLc = exports.generateExecutionInterval = exports.generateTradeResult = exports.getCryptoById = exports.cryptoAcc = void 0;
const db_1 = require("./db");
exports.cryptoAcc = [
    {
        name: "Passive",
        id: "1000L",
        image: "",
        amount: 1000,
        specialKey: { min: 4, max: 2 },
        waitTime: { min: 7000, max: 9800 },
        cryptoId: "1000L",
        isActive: false,
    },
    {
        name: "Passive",
        id: "3000L",
        image: "",
        amount: 3000,
        specialKey: { min: 8, max: 5 },
        waitTime: { min: 5000, max: 8000 },
        cryptoId: "3000L",
        isActive: false,
    },
    {
        name: "Passive",
        id: "5000L",
        image: "",
        amount: 5000,
        specialKey: { min: 9, max: 12 },
        waitTime: { min: 4700, max: 7000 },
        cryptoId: "5000L",
        isActive: false,
    },
    {
        name: "Semi-Aggressive",
        id: "10000L",
        image: "",
        amount: 10000,
        specialKey: { min: 21, max: 20 },
        waitTime: { min: 2500, max: 5100 },
        cryptoId: "10000L",
        isActive: false,
    },
    {
        name: "Semi-Aggressive",
        id: "20000L",
        image: "",
        amount: 20000,
        specialKey: { min: 36, max: 40 },
        waitTime: { min: 2200, max: 4700 },
        cryptoId: "20000L",
        isActive: false,
    },
    {
        name: "Semi-Aggressive",
        id: "30000L",
        image: "",
        amount: 30000,
        specialKey: { min: 41, max: 60 },
        waitTime: { min: 2100, max: 4500 },
        cryptoId: "30000L",
        isActive: false,
    },
    {
        name: "Aggressive",
        id: "50000L",
        image: "",
        amount: 50000,
        specialKey: { min: 201, max: 300 },
        waitTime: { min: 1500, max: 3400 },
        cryptoId: "50000L",
        isActive: false,
    },
    {
        name: "Aggressive",
        id: "100000L",
        image: "",
        amount: 100000,
        specialKey: { min: 501, max: 500 },
        waitTime: { min: 1300, max: 3200 },
        cryptoId: "100000L",
        isActive: false,
    },
    {
        name: "Aggressive",
        id: "200000L",
        image: "",
        amount: 200000,
        specialKey: { min: 4001, max: 1000 },
        waitTime: { min: 1100, max: 2800 },
        cryptoId: "200000L",
        isActive: false,
    },
];
// ✅ Centralized Crypto Data
const cryptoData = [
    { name: "Bitcoin", image: "/crypto-images/bitcoin1.png", id: "1" },
    { name: "Litecoin", image: "/crypto-images/coin.png", id: "2" },
    { name: "Dogecoin", image: "/crypto-images/dogecoin.png", id: "3" },
    { name: "Ethereum", image: "/crypto-images/ethereum.png", id: "4" },
    { name: "Gold", image: "/crypto-images/gold-bars.png", id: "5" },
    { name: "Pepecoin", image: "/crypto-images/pepelogo.png", id: "6" },
    { name: "Solana", image: "/crypto-images/solanac.png", id: "7" },
    { name: "Xrp", image: "/crypto-images/xrp.png", id: "8" },
    { name: "Tether", image: "/crypto-images/tether.png", id: "9" },
];
// ✅ Match Crypto by ID
const getCryptoById = (cryptoId) => {
    return exports.cryptoAcc.find((crypto) => crypto.id === cryptoId);
};
exports.getCryptoById = getCryptoById;
// ✅ Generate Trade Result Using Special Key
const generateTradeResult = (account) => {
    const isProfit = Math.random() < 0.5;
    const variation = Math.random() * account.specialKey.min + account.specialKey.max;
    const formattedVariation = Number(variation.toFixed(2));
    return isProfit ? formattedVariation : -formattedVariation;
};
exports.generateTradeResult = generateTradeResult;
// ✅ Generate Execution Interval Based on Wait Time
const generateExecutionInterval = (account) => {
    const minInterval = account.waitTime.min * 1000;
    const maxInterval = account.waitTime.max * 1000;
    return Math.random() * (maxInterval - minInterval) + minInterval;
};
exports.generateExecutionInterval = generateExecutionInterval;
// ✅ Update Trade Statistics in Database
const updateTradeStatsLc = (accountId, result) => __awaiter(void 0, void 0, void 0, function* () {
    if (!accountId) {
        console.error("Account ID is missing");
        return;
    }
    yield (0, db_1.updateTradeStats)(accountId, result);
});
exports.updateTradeStatsLc = updateTradeStatsLc;
// ✅ Core Trade Processing Function
// ✅ Core Trade Processing Function
const processTrade = (account) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Trade Initiated:", account);
    if (!account.cryptoId) {
        console.error("Crypto ID is missing from the account.");
        return;
    }
    const matchedCrypto = (0, exports.getCryptoById)(account.cryptoId);
    if (!matchedCrypto) {
        console.error("Invalid Crypto ID provided.");
        return;
    }
    const result = (0, exports.generateTradeResult)(account);
    const interval = (0, exports.generateExecutionInterval)(account);
    console.log(`Executing trade with ${matchedCrypto.name} | Interval: ${interval}ms`);
    // ✅ Store trade log in database (Including `userId`)
    yield (0, db_1.addTradeLog)({ userId: account.id, matchedCrypto, result, interval });
    // ✅ Update account balance based on trade result
    yield (0, db_1.updateTradeAccounts)(account.id, result);
    // ✅ Update trade statistics
    yield (0, exports.updateTradeStatsLc)(account.id, result);
    console.log("Trade log recorded, account balance updated!");
});
exports.processTrade = processTrade;
