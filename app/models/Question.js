const CoreModel = require('./CoreModel');

class Question extends CoreModel {
  static tableName = 'question';

  description;

  wiki;

  anecdote;

  quiz_id;

  level_id;

  answer_id;

  /**
   * @param {{
   * id: number,
   * created_at: Date,
   * updated_at: Date,
   * description: string,
   * wiki: string,
   * anecdote: string,
   * quiz_id: number,
   * level_id: number,
   * answer_id: number,
   * }} obj
   */
  constructor(obj) {
    super(obj);
    this.description = obj.description;
    this.wiki = obj.wiki;
    this.anecdote = obj.anecdote;
    this.quiz_id = obj.quiz_id;
    this.level_id = obj.level_id;
    this.answer_id = obj.answer_id;
  }
}

module.exports = Question;
