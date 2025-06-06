import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ✅ Define Trade Type for Stronger Type Safety
type TradeData = {
  userId: string;
  matchedCrypto: { name: string };
  result: number;
  interval: number;
};

// ✅ Fetch Account Details Without Redis
export const getAccountById = async (provider: string, providerAccountId: string) => {
return prisma.account.findFirst({
  where: { provider, providerAccountId }
});
};

// ✅ Log Trade Execution in TradeLogs
export const addTradeLog = async (trade: TradeData) => {
  return prisma.tradeLogs.create({
    data: {
      userId: trade.userId, // ✅ Ensure we store user ID in TradeLogs
      crypto: trade.matchedCrypto.name,
      result: trade.result,
    },
  });
};

// ✅ Update Account Balance Correctly
export const updateTradeAccounts = async (userId: string, result: number) => {
  return prisma.user.update({
    where: { id: userId },
    data: { accBal: { increment: result } }, // ✅ Correct field from schema
  });
};

// ✅ Update Trade Statistics in InvestmentSummary
export const updateTradeStats = async (userId: string, result: number) => {
return prisma.investmentSummary.update({
  where: { id: userId },
  data: {
    wins: result > 0 ? { increment: 1 } : undefined,
    loss: result <= 0 ? { increment: 1 } : undefined,
  },
});
};

// ✅ Process Trade Transaction Safely

export const processTradeTransaction = async (accountId: string, tradeData: TradeData) => {
  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    await tx.tradeLogs.create({
      data: {
        userId: tradeData.userId,
        crypto: tradeData.matchedCrypto.name,
        result: tradeData.result,
      },
    });

    await tx.user.update({
      where: { id: tradeData.userId },
      data: { accBal: { increment: tradeData.result } },
    });

    await tx.investmentSummary.update({
      where: { id: tradeData.userId },
      data: tradeData.result > 0 ? { wins: { increment: 1 } } : { loss: { increment: 1 } },
    });
  });

  console.log("✅ Trade processed successfully!");
};