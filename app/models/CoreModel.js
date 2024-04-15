const client = require('../db/client');

class CoreModel {
  id;

  created_at = new Date();

  updated_at;

  /**
   * @type {string} Nom de la table en base de données
   */
  static tableName;

  /**
   *
   * @param {{id: number, created_at: Date, updated_at: Date}}} obj
   */
  constructor(obj) {
    this.id = obj.id;
    if (obj.created_at) {
      this.created_at = obj.created_at;
    }
    this.created_at = obj.created_at;
    this.updated_at = obj.updated_at;
  }

  static async findAll() {
    // Le nom de la table
    console.log(this.tableName);
    // Et le nom de la classe
    // J'instancie un objet de la classe faisant l'action du findAll
    // new this()
    // Quiz.findAll() => new Quiz()
    // Question.findAll() => new Question()
    const { rows } = await client.query(`SELECT * FROM ${this.tableName}`);

    // this === class qui exécute la méthode
    // this === Quiz | Question | User | Tag | Level | Answer
    const instances = rows.map((rawData) => new this(rawData));

    return instances;
  }
}

module.exports = CoreModel;
