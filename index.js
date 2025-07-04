let { PrismaClient } = require('./src/generated/prisma/client.js');
let PrismaStore = require('./src/PrismaStore.js');
let Queue = require('better-queue');

let prisma = new PrismaClient();
let prismaStore = PrismaStore;
//prismaStore.connect(prisma);

module.exports = (processTask) => {
  const queue = new Queue(processTask, { 
    store: prismaStore 
  });
  return queue;
}