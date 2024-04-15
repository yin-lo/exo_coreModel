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

  static async findById(id) {
    // desctructurer rows avec que le 1er élément du tableau nommé arbitrairement DATA
    // si on veut le 2e élément on écrit : [,deuxième]
    // si on veut le 3e élément on écrit : [,,troisième]
    const { rows: [data] } = await client.query(`
    SELECT * FROM ${this.tableName} WHERE id = $1
    `, [
      id,
    ]);

    // si la donnée existe on crée une instance
    if (!data) {
      return null;
    }

    // je retourne une instance
    return new this(data);
  }

  getObjectPropsToManage() {
    Object.keys(this)
      .filter((prop) => prop !== 'id' && prop !== 'created_at' && prop !== 'updated_at');
  }

  async insert() {
    // les propriétés de this sont dans un objet qu'on transforme en objet
    const objectProps = this.getObjectPropsToManage();

    // construire la partie propriété de la requête en mode tableau avec des doublequotes
    // (sinon conflit) avec SQL
    // puis jointure de chaque élément avec une virgule
    const propertiesStr = objectProps
      .map((prop) => `"${prop}"`)
      .join(', ');

    // construire la partie valeur de la requête pour avoir $1 puis $2 ...
    const valuesStr = objectProps
      .map((prop, index) => `$${index + 1}`)
      .join(', ');

    // les valeurs
    const values = objectProps.map((prop) => this[prop]);

    // récupérer la class de mon instance => this.constructor

    const queryStr = `
    INSERT INTO ${this.constructor.tableName} 
    (${propertiesStr})
    VALUES
    (${valuesStr})
    RETURNING *;
    `;

    const { rows: [dataInserted] } = await client.query(queryStr, values);

    this.id = dataInserted.id;
    this.created_at = dataInserted.created_at;
    this.updated_at = dataInserted.updated_at;
  }

  async update() {
    const objectProps = this.getObjectPropsToManage();
    const setStr = objectProps
      .map((prop, index) => `$${index + 1}`)
      .join(', ');

    // les valeurs
    const values = objectProps.map((prop) => this[prop]);

    const queryStr = `
      UPDATE ${this.constructor.tableName}
      SET
        updated_at = NOW(),
        ${setStr}
      WHERE id = $${objectProps.length + 1}
      RETURNING *;
    `;

    const { rows: [dataUpdated] } = await client.query(
      queryStr,
      // les "..." récupère toutes les valeurs du tableau dans un nouveau tableau
      // afin de pouvoir rajouter le id
      [...values, this.id],
    );

    this.updated_at = dataUpdated.updated_at;
  }

  async delete() {
    await client.query(`
    DELETE FROM ${this.constructor.tableName}
    WHERE id = $1
    `, [
      this.id,
    ]);

    //Je reset les données gérées par ma BDD
    this.id = undefined;
    this.created_at = undefined;
    this.updated_at = undefined;
  }

  save() {
    // créer une méthode save : si l'instance a un id, on fait un update, sinon, un insert
    if (this.id) {
      returnthis.update();
    }
    return this.insert();
  }
}

module.exports = CoreModel;
