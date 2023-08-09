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

import fs from 'fs'
import Sequelize from 'sequelize'
import { join } from 'path'

/* Import definisi model (manual) */
import RoleModel from './Role.js'
import UserModel from './User.js'
import CategoryModel from './Category.js'
import BrandModel from './Brand.js'
import ProductModel from './Product.js'
import ProductImageModel from './ProductImage.js'
import ProductHistoryModel from './ProductHistory.js'
import DiscountModel from './Discount.js'
import DiscountItemModel from './DiscountItem.js'
import CartItemModel from './CartItem.js'
import OrderModel from './Order.js'
import OrderItemModel from './OrderItem.js'
import OrderShippingModel from './OrderShipping.js'
import OrderHistoryModel from './OrderHistory.js'
import OrderPaymentEvidenceModel from './OrderPaymentEvidence.js'


const env = process.env.NODE_ENV || 'development'

/* Get DB config */
const rootPath = process.cwd()
const configPath = join(rootPath, 'config', 'config.json')
const configData = JSON.parse(fs.readFileSync(configPath, 'utf8'))
const config = configData[env]

let sequelize = new Sequelize(config.database, config.username, config.password, config)

/* Inisialisasi model */
const Role = RoleModel(sequelize, Sequelize.DataTypes)
const User = UserModel(sequelize, Sequelize.DataTypes)
const Category = CategoryModel(sequelize, Sequelize.DataTypes)
const Brand = BrandModel(sequelize, Sequelize.DataTypes)
const Product = ProductModel(sequelize, Sequelize.DataTypes)
const ProductImage = ProductImageModel(sequelize, Sequelize.DataTypes)
const ProductHistory = ProductHistoryModel(sequelize, Sequelize.DataTypes)
const Discount = DiscountModel(sequelize, Sequelize.DataTypes)
const DiscountItem = DiscountItemModel(sequelize, Sequelize.DataTypes)
const CartItem = CartItemModel(sequelize, Sequelize.DataTypes)
const Order = OrderModel(sequelize, Sequelize.DataTypes)
const OrderItem = OrderItemModel(sequelize, Sequelize.DataTypes)
const OrderShipping = OrderShippingModel(sequelize, Sequelize.DataTypes)
const OrderHistory = OrderHistoryModel(sequelize, Sequelize.DataTypes)
const OrderPaymentEvidence = OrderPaymentEvidenceModel(sequelize, Sequelize.DataTypes)

/* Definisi relasi antar model */
Role.associate({ User })
User.associate({ Role })
Category.associate({ Product })
Brand.associate({ Product })
Product.associate({ Category, Brand, ProductImage, ProductHistory, DiscountItem })
ProductImage.associate({ Product })
ProductHistory.associate({ Product, User })
Discount.associate({ DiscountItem })
DiscountItem.associate({ Product, Discount, OrderItem })
CartItem.associate({ User, Product })
Order.associate({ User, OrderItem, OrderShipping, OrderPaymentEvidence, OrderHistory })
OrderItem.associate({ Order, Product, DiscountItem })
OrderShipping.associate({ Order })
OrderHistory.associate({ Order })
OrderPaymentEvidence.associate({ Order })

export {
	sequelize,  /* digunakan untuk database transaction*/
  	Role,
 	User,
 	Category,
	Brand,
	Product,
	ProductImage,
	ProductHistory,
	Discount,
	DiscountItem,
	CartItem,
	Order,
	OrderItem,
	OrderShipping,
	OrderHistory,
	OrderPaymentEvidence
}