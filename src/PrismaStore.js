const { PrismaClient } = require('./generated/prisma/client.js');
const prisma = new PrismaClient();

let PrismaStore = {
  connect: function(cb) {
    console.log("c");
    PrismaStore.getLength(cb)
  },

  getLength: async function(cb) {
    console.log("l");
    try {
      const count = await prisma.task.count();
      cb(null, count);
      console.log("l - ", count);
    } catch (err) {
      console.log(err);
      cb(err);
    }
  },


  getTask: async function(taskId, cb) {
    console.log("g");
    try {
      const task = await prisma.task.findUnique({ where: { id: taskId } });
      cb(null, task ? task.input : null);
    } catch (err) {
      console.log(err);
      cb(err);
    }
  },

  putTask: async function(taskId, task, priority, cb) {
    console.log("p", task);
    try {
      await prisma.task.upsert({
        where: { id: taskId },
        create: { id: taskId, input: task, status: 'pending'},
        update: { input: task, status: 'pending' },
      });
      cb(null);
    } catch (err) {
      console.log(err);
      cb(err);
    }
  },

  takeFirstN: async function(n, cb) {
    console.log("t1");
    try {
      const tasks = await prisma.task.findMany({
        orderBy: { createdAt: 'asc' },
        take: n,
      });
      await Promise.all(
        tasks.map(task => prisma.task.update({
          where: { id: task.id },
          data: { status: 'running' }
        }))
      );
      cb(null, tasks.map(t => t.input));
    } catch (err) {
      console.log(err);
      cb(err);
    }
  },

  takeLastN: async function(n, cb) {
    console.log("t2");
    try {
      const tasks = await prisma.task.findMany({
        orderBy: { createdAt: 'desc' },
        take: n,
      });
      await Promise.all(
        tasks.map(task => prisma.task.update({
          where: { id: task.id },
          data: { status: 'running' }
        }))
      );
      cb(null, tasks.map(t => t.input));
    } catch (err) {
      console.log(err);
      cb(err);
    }
  },

  getRunningTasks: async function(cb) {
    console.log("r");
    try {
      // Beispiel: Alle Tasks mit Status "running" aus der Datenbank holen
      // (Du brauchst dafür ein Feld wie "status" in deiner Tabelle)
      const runningTasks = await prisma.task.findMany({
        where: { status: 'running' }
      });
      cb(null, runningTasks.map(t => t.input));
    } catch (err) {
      cb(err);
    }
  },

  getLock: function(cb) {
    // Einfache Implementierung ohne echtes Locking
    if (typeof cb == "function") cb(null, true);
  },
  releaseLock: function(lockId, cb) {
    // Einfache Implementierung ohne echtes Locking
    if (typeof cb == "function") cb(null);
  }
};

module.exports = PrismaStore;