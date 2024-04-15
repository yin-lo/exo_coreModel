const Quiz = require('./app/models/User');

const main = async () => {
  const quiz = new Quiz({
    title: 'Test title',
    description: 'Test description',
    author_id: 1,
  });

  await quiz.insert();
  console.log(quiz);
};

main();
