import {Sequelize} from 'sequelize';

const db = new Sequelize('angka', 'root', '', {
    host: 'localhost',
    dialect:'mysql'
});

export default db;