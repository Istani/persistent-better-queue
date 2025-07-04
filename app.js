let Queue = require("./index.js");//require("@istani/queue");

const queue = Queue((input, cb) => {
  // Hier definierst du, wie die Aufgaben verarbeitet werden sollen
  console.log('Verarbeite Aufgabe:', input);
  cb(null, input + ' done');
});

// Aufgabe hinzufügen
for (var i = 0 ; i <10; i++) {
  console.log(i);
  queue.push({ input: i}, (err, result) => {
    if (err) console.error(err);
    else console.log('Ergebnis:', result);
  });
}