const CoreModel = require('./CoreModel');

class Quiz extends CoreModel {
  static tableName = 'quiz';

  title;

  description;

  author_id;

  /**
   *
   * @param {{
   * id: number,
   * title: string,
   * description: string,
   * author_id: number,
   * created_at: Date,
   * updated_at: Date
   * }} obj
   */
  constructor(obj) {
    super(obj);
    this.title = obj.title;
    this.description = obj.description;
    this.author_id = obj.author_id;
  }
}

module.exports = Quiz;
