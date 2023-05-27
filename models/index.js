// 'use strict';

// const fs = require('fs');
// const path = require('path');
// const Sequelize = require('sequelize');
// const process = require('process');
// const basename = path.basename(__filename);
// const env = process.env.NODE_ENV || 'development';
// const config = require(__dirname + '/../config/config.json')[env];
// const db = {};

// let sequelize;
// if (config.use_env_variable) {
//   sequelize = new Sequelize(process.env[config.use_env_variable], config);
// } else {
//   sequelize = new Sequelize(config.database, config.username, config.password, config);
// }

// fs
//   .readdirSync(__dirname)
//   .filter(file => {
//     return (
//       file.indexOf('.') !== 0 &&
//       file !== basename &&
//       file.slice(-3) === '.js' &&
//       file.indexOf('.test.js') === -1
//     );
//   })
//   .forEach(file => {
//     const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
//     db[model.name] = model;
//   });

// Object.keys(db).forEach(modelName => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });

// db.sequelize = sequelize;
// db.Sequelize = Sequelize;

// module.exports = db;



'use strict';

import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';

const configPath = path.resolve(__dirname, '..', 'config', 'config.json');
const configData = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const config = configData[env];

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

/* Import definisi model (manual) */
import RoleModel from './Role.js';
import UserModel from './User.js';
import CategoryModel from './Category.js';
import BrandModel from './Brand.js';
import ProductModel from './Product.js';
import ProductImageModel from './ProductImage.js';

/* Inisialisasi model */
const Role = RoleModel(sequelize, Sequelize.DataTypes);
const User = UserModel(sequelize, Sequelize.DataTypes);
const Category = CategoryModel(sequelize, Sequelize.DataTypes);
const Brand = BrandModel(sequelize, Sequelize.DataTypes);
const Product = ProductModel(sequelize, Sequelize.DataTypes);
const ProductImage = ProductImageModel(sequelize, Sequelize.DataTypes);

/* Definisi relasi antar model */
Role.associate({ User });
User.associate({ Role });
Category.associate({ Product });
Brand.associate({ Product });
Product.associate({ 
	Category,
	Brand,
	ProductImage
});
ProductImage.associate({ Product });

export {
  	Role,
 	User,
 	Category,
	Brand,
	Product,
	ProductImage
};