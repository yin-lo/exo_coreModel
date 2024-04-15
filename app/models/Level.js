const client = require('../db/client');
const CoreModel = require('./CoreModel');

class Level extends CoreModel {
  static tableName = 'level';

  name;

  /**
   * La méthode qui sera exécuté lors de l'instanciation de la class Level
   * @param {{id: number, name: string, created_at: Date, updated_at: Date}} obj
   */
  constructor(obj) {
    // J'appelle le constructeur de la class parente
    super(obj);
    this.name = obj.name;
  }

  static async findById(id) {
    const result = await client.query(`
      SELECT * FROM "level"
      WHERE id = $1
    `, [
      id,
    ]);

    // Si je n'ai pas de résultat, je retourne null
    if (!result.rows.length) {
      return null;
    }

    return new Level(result.rows[0]);
  }

  static async findAll() {
    const result = await client.query(`
      SELECT * FROM "level"
    `);

    // Le map fait comme le forEach, mais il retourne un nouveau tableau
    // à partir des données retournées dans la fonction de callback
    const levelsToReturn = result.rows.map((dataLevelDeLaBDD) => new Level(dataLevelDeLaBDD));

    return levelsToReturn;
  }

  /**
   * Cette méthode permet de sauvegarder en bdd l'objet courant
   * INSERT INTO level
   */
  async insert() {
    // Je fais une requête SQL pour insérer mon objet en bdd
    // Le RETURNING * me permet de récupérer les données insérées en bdd
    const result = await client.query(`
      INSERT INTO "level" (name)
      VALUES ($1)
      RETURNING *
    `, [
      // Les valeurs à insérer sont celle de mon objet courant
      // J'utilise donc le this pour les récupérer
      this.name,
    ]);

    const dataInserted = result.rows[0];

    this.id = dataInserted.id;
    this.created_at = dataInserted.created_at;
  }

  /**
   * Cette méthode permet de mettre à jour en bdd l'objet courant
   * UPDATE level
   */
  async update() {
    const result = await client.query(`
      UPDATE "level"
      SET
        name = $1,
        updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `, [
      this.name,
      this.id,
    ]);

    const dataUpdated = result.rows[0];

    this.updated_at = dataUpdated.updated_at;
  }

  /**
   * Cette méthode permet de supprimer en bdd l'objet courant
   * DELETE FROM level
   */
  async delete() {
    await client.query(`
      DELETE FROM "level"
      WHERE id = $1
    `, [
      this.id,
    ]);

    // Si la suppression en bdd est un succès, je supprime les propriétés de mon objet
    // qui sont liées à la bdd
    this.created_at = undefined;
    this.updated_at = undefined;
    this.id = undefined;
  }
}

// J'exporte ma class pour la rendre utilisable ailleurs
module.exports = Level;
