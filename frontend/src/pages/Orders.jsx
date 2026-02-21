import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import OrderTrackTimeline from '../components/OrderTrackTimeline'
import axios from 'axios'

const Orders = () => {

  const { backendUrl, token , currency} = useContext(ShopContext);

  const [orderData,setorderData] = useState([])

  const loadOrderData = async () => {
    try {
      if (!token) {
        return null
      }

      const response = await axios.post(backendUrl + '/api/order/userorders',{},{headers:{token}})
      if (response.data.success) {
        let allOrdersItem = []
        response.data.orders.map((order)=>{
          order.items.map((item)=>{
            item['status'] = order.status
            item['payment'] = order.payment
            item['paymentMethod'] = order.paymentMethod
            item['date'] = order.date
            allOrdersItem.push(item)
          })
        })
        setorderData(allOrdersItem.reverse())
      }
      
    } catch (error) {
      
    }
  }

  useEffect(()=>{
    loadOrderData()
  },[token])

  return (
    <div className='border-t pt-16'>

        <div className='text-2xl'>
            <Title text1={'MY'} text2={'ORDERS'}/>
        </div>

        <div>
            {
              orderData.map((item,index) => (
                <div key={index} className='py-4 sm:py-6 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-start md:justify-between gap-4 sm:gap-6'>
                    <div className='flex items-start gap-4 sm:gap-6 text-sm min-w-0 flex-1'>
                        <img className='w-14 h-14 sm:w-20 sm:h-20 object-cover rounded flex-shrink-0' src={item.image[0]} alt="" />
                        <div className='min-w-0'>
                          <p className='text-sm sm:text-base font-medium break-words'>{item.name}</p>
                          <div className='flex flex-wrap gap-x-3 gap-y-1 mt-1 text-sm sm:text-base text-gray-700'>
                            <p>{currency}{item.price}</p>
                            <p>Qty: {item.quantity}</p>
                            <p>Size: {item.size}</p>
                          </div>
                          <p className='mt-1 text-xs sm:text-sm'>Date: <span className='text-gray-400'>{new Date(item.date).toDateString()}</span></p>
                          <p className='mt-1 text-xs sm:text-sm'>Payment: <span className='text-gray-400'>{item.paymentMethod}</span></p>
                        </div>
                    </div>
                    <div className='w-full md:w-[min(100%,320px)] lg:min-w-[280px] flex flex-col gap-3 sm:gap-4 flex-shrink-0'>
                        <div className='flex items-center justify-between gap-2'>
                            <p className='text-sm font-semibold text-slate-700'>Order tracking</p>
                            <button onClick={loadOrderData} className='border border-slate-300 px-3 py-2 text-xs sm:text-sm font-medium rounded-sm hover:bg-slate-100 transition-colors flex-shrink-0'>Refresh</button>
                        </div>
                        <div className='bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-sm min-w-0'>
                            {item.status === 'Cancelled' 
                            ? <p className='text-red-500 font-bold'>Order Cancelled</p>
                            : <OrderTrackTimeline currentStatus={item.status} />
                            }
                        </div>
                    </div>
                </div>
              ))
            }
        </div>
    </div>
  )
}

export default Orders
