const brain = require('brain.js');

const trainingData = [
    {
        input: "apa kabar",
        output: "positif"
    },
    {
        input: ""
    }
];

const lstm = new brain.recurrent.LSTM();
const result = lstm.train(trainingData, {
  iterations: 1500,
  log: (details) => console.log(details),
  errorThresh: 0.011,
});
console.log('Training result: ', result);

const run1 = lstm.run('Jane');
const run2 = lstm.run('Doug');
const run3 = lstm.run('Spot');
const run4 = lstm.run('It');

console.log('run 1: Jane' + run1);
console.log('run 2: Doug' + run2);
console.log('run 3: Spot' + run3);
console.log('run 4: It' + run4);