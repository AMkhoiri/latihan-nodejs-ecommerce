
/* FILE INI HANYA UNTUK TESTING */


// import { Sequelize } from "sequelize"

// const sequelize = new Sequelize('nodejs_ecommerce', 'postgres', 'postgres', {
//   host: 'localhost',
//   dialect: 'postgres',
// });


// const testConn = async () => {
// 	try {
// 	  await sequelize.authenticate();
// 	  console.log('Connection has been established successfully.');
// 	} catch (error) {
// 	  console.error('Unable to connect to the database:', error);
// 	}
// }

// testConn()




// import { Role, User} from '../models/index.js'; 

// const testModel = async () => {
// 	try{
// 		// const roles = await Role.findAll();
// 		const roles = await Role.findAll({
// 		  include: [User]
// 		});

// 		console.log(roles[0].Users[0].name)
// 	}
// 	catch(err) {
// 		console.log(err)
// 	}
// }

// testModel()




import dotenv from 'dotenv'
dotenv.config()

const testEnv = async () => {
	try{
		console.log(process.env.NODE_ENV)
	}
	catch(err) {
		console.log(err)
	}
}

testEnv()