const rand_choice = (choices) => {
    var index = Math.floor(Math.random() * choices.length);
    return choices[index];
  }

const LogWeek = (ping) => {
    if (ping) {
      console.log("It is CL week")
    }
    else console.log("it is quest week")
  }

module.exports = { rand_choice, LogWeek };