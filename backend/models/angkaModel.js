import { Sequelize } from "sequelize";
import db from "../config/Database.js";


const {DataTypes} = Sequelize;

const Angka = db.define('angkas',{
    kepala: DataTypes.INTEGER,
    ekor: DataTypes.INTEGER,
    hasil: DataTypes.STRING,
}, {
    freezeTableName:true
})

export default Angka;

(async()=> {
    await db.sync()
})();