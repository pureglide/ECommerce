import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'

const MyOrders = () => {

  const { backendUrl, token, currency } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);

  const loadOrderData = async () => {
    try {
      if (!token) {
        return null;
      }

      const response = await axios.post(backendUrl + '/api/order/userorders', {}, { headers: { token } })
      if (response.data.success) {
        let allOrdersItem = []
        response.data.orders.map((order) => {
          order.items.map((item) => {
            item['status'] = order.status
            item['payment'] = order.payment
            item['paymentMethod'] = order.paymentMethod
            item['date'] = order.date
            allOrdersItem.push(item)
          })
        })
        setOrderData(allOrdersItem.reverse())
      }

    } catch (error) {

    }
  }

  useEffect(() => {
    loadOrderData()
  }, [token])

  const statusOrder = ["Order Placed", "Packing", "Shipped", "Out for delivery", "Delivered"]

  return (
    <div className='border-t pt-16'>

      <div className='text-2xl'>
        <p>MY ORDERS</p>
      </div>

      <div>
        {
          orderData.map((item, index) => (
            <div key={index} className='py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
              <div className='flex items-start gap-6 text-sm'>
                <img className='w-16 sm:w-20' src={item.image[0]} alt="" />
                <div>
                  <p className='sm:text-base font-medium'>{item.name}</p>
                  <div className='flex items-center gap-3 mt-1 text-base text-gray-700'>
                    <p>{currency}{item.price}</p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Size: {item.size}</p>
                  </div>
                  <p className='mt-1'>Date: <span className='text-gray-400'>{new Date(item.date).toDateString()}</span></p>
                  <p className='mt-1'>Payment: <span className='text-gray-400'>{item.paymentMethod}</span></p>
                </div>
              </div>
              <div className='md:w-1/2 flex flex-col gap-4'>
                <div className='flex items-center justify-between mb-2'>
                  {item.status === 'Cancelled' 
                  ? <p className='text-red-500 font-bold'>Order Cancelled</p>
                  : statusOrder.map((status, idx) => {
                    const activeStep = statusOrder.indexOf(item.status);
                    const isCompleted = idx <= activeStep;
                    return (
                      <div key={idx} className={`flex flex-col items-center flex-1 relative ${isCompleted ? 'text-green-500' : 'text-gray-400'}`}>
                        {idx > 0 && (
                          <div className={`absolute top-1/2 left-[-50%] w-full h-[2px] -translate-y-1/2 -z-10 ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}`} />
                        )}
                        <div className={`w-3 h-3 rounded-full ${isCompleted ? 'bg-green-500' : 'bg-gray-200'} ${idx === activeStep ? 'animate-pulse' : ''}`}></div>
                        <p className='text-[8px] md:text-xs mt-1 text-center'>{status}</p>
                      </div>
                    )
                  })}
                </div>
                <div className='flex justify-end'><button onClick={loadOrderData} className='border px-4 py-2 text-sm font-medium rounded-sm'>Track Order</button></div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default MyOrders