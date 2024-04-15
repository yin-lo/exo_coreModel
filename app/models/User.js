const client = require('../db/client');
const CoreModel = require('./CoreModel');

class User extends CoreModel {
  static tableName = 'user';

  firstname;

  lastname;

  email;

  password;

  /**
   * La méthode qui sera exécuter lors de l'instantion de la class
   * @param {{
   * id: number,
   * firstname: string,
   * lastname: string,
   * email: string,
   * password: string
   * created_at: Date,
   * updated_at: Date
   * }} obj
   */
  constructor(obj) {
    super(obj);
    this.firstname = obj.firstname;
    this.lastname = obj.lastname;
    this.email = obj.email;
    this.password = obj.password;
  }

  // trouve tous les Users dans la base de données.
  static async findAll() {
    // const result = await client.query('SELECT * FROM "user";');
    // const rows = result.rows;
    const { rows } = await client.query(`
      SELECT * FROM "user";
    `);

    // Je transforme chaque élément de mon tableau en instance de User
    const users = rows.map((rawUser) => new User(rawUser));

    // Si on voulais ne pas utiliser le map
    // On ferais comme ça
    // const users = [];
    // rows.forEach((rawUser) => {
    //   const user = new User(rawUser);
    //   users.push(user);
    // });

    return users;
  }

  // trouve un User en fonction de son ID.
  static async findById(id) {
    const { rows } = await client.query(`
      SELECT * FROM "user" 
      WHERE id = $1;
    `, [
      id,
    ]);

    const rawUser = rows[0];

    // Si je n'ai pas de résultat
    if (!rawUser) {
      return null;
    }

    // Sinon, je retourne une instance de User
    return new User(rawUser);
  }

  // trouve un User par son email.
  static async findByEmail(email) {
    const { rows } = await client.query('SELECT * FROM "user" WHERE email = $1;', [email]);

    const rawUser = rows[0];

    // Si je n'ai pas de résultat
    if (!rawUser) {
      return null;
    }

    // Sinon, je retourne une instance de User
    return new User(rawUser);
  }

  // insert l'instance courante dans la base de données.
  async insert() {
    const { rows } = client.query(`
      INSERT INTO "user" (firstname, lastname, email, password)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `, [
      this.firstname, // $1
      this.lastname, // $2
      this.email, // $3
      this.password, // $4
    ]);

    // Je sais que je n'ajoute qu'une seule donnée
    const dataInserted = rows[0];

    // Je vais mettre à jours les données de mon instances
    this.id = dataInserted.id;
    this.created_at = dataInserted.created_at;
  }

  // met à jour l'instance courante dans la base de données.
  async update() {
    const { rows } = await client.query(`
      UPDATE "user"
      SET 
        firstname = $1, 
        lastname = $2, 
        email = $3, 
        password = $4,
        updated_at = NOW()
      WHERE id = $5
      RETURNING *;
    `, [
      this.firstname,
      this.lastname,
      this.email,
      this.password,
      this.id,
    ]);

    // Je sais que je ne modifie qu'une seule donnée
    const dataUpdated = rows[0];

    // Je vais mettre à jours les données de mon instances
    this.updated_at = dataUpdated.updated_at;
  }

  // supprime l'instance courante de la base de données.
  async delete() {
    await client.query('DELETE FROM "user" WHERE id = $1;', [this.id]);

    // Je supprime les données de mon instance
    this.id = undefined;
    this.created_at = undefined;
    this.updated_at = undefined;
  }
}

module.exports = User;
