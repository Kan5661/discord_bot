const rand_choice = (choices) => {
    var index = Math.floor(Math.random() * choices.length);
    return choices[index];
  }


module.exports = { rand_choice };
