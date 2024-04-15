const CoreModel = require('./CoreModel');

class Answer extends CoreModel {
  static tableName = 'answer';

  description;

  question_id;

  /**
   * La méthode qui sera exécuté lors de l'instanciation de la class Answer
   * @param {{
   * id: number,
   * description: string,
   * question_id: number,
   * created_at: Date,
   * updated_at: Date,
   * }} obj
   */
  constructor(obj) {
    // J'appelle le constructeur de la class parente
    super(obj);
    this.description = obj.description;
    this.question_id = obj.question_id;
  }
}

// J'exporte ma class pour la rendre utilisable ailleurs
module.exports = Answer;
