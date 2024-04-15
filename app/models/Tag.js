const CoreModel = require('./CoreModel');

class Tag extends CoreModel {
  static tableName = 'tag';

  name;

  /**
   * La méthode qui sera exécuté lors de l'instanciation de la class Tag
   * @param {{id: number, name: string, created_at: Date, updated_at: Date}} obj
   */
  constructor(obj) {
    // J'appelle le constructeur de la class parente
    super(obj);
    this.name = obj.name;
  }
}

// J'exporte ma class pour la rendre utilisable ailleurs
module.exports = Tag;
