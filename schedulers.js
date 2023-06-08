import cron from 'node-cron'

import { Product, Order, OrderItem, OrderHistory} from './models/index.js'


/* cek pembayaran pesanan. jika dlm batas waktu tertentu belum dibayar, maka:  */
const checkPaymentOrderJob = () => {
	const minutesInterval = 10

	cron.schedule(`*/${minutesInterval} * * * *`, async () => {
		try {
			const currentTime = new Date().getTime()
			
			const pendingOrders = await Order.findAll({
				where: {
					status: Order.PENDING
				},
				include: [OrderItem]
			})

			for(let pendingOrder of pendingOrders) {
				let pendingDeadlineTime = pendingOrder.createdAt.setHours(pendingOrder.createdAt.getHours() + 24)

				if (currentTime > pendingDeadlineTime) {
				 	for(let item of pendingOrder.OrderItems) {
				 		let product = await Product.findByPk(item.productId)
				 		product.frozenStock -= item.quantity
				 		product.stock += item.quantity
				 		await product.save()
				 	}

				 	pendingOrder.status = Order.FAIL
				 	pendingOrder.save()

				 	await OrderHistory.record(pendingOrder.id, Order.FAIL)
				}
			}

		} catch(e) {
			console.log(e);
		}
	})
}


export {
	checkPaymentOrderJob
}