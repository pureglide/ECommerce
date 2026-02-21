import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

const Orders = ({ token }) => {

  const [orders, setOrders] = useState([])
  const [detailsModal, setDetailsModal] = useState(null)

  const statusOrder = ["Order Placed", "Packing", "Shipped", "Out for delivery", "Delivered"]

  const fetchAllOrders = async () => {

    if (!token) {
      return null;
    }

    try {

      const response = await axios.post(backendUrl + '/api/order/list', {}, { headers: { token } })
      if (response.data.success) {
        setOrders(response.data.orders.reverse())
      } else {
        toast.error(response.data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }


  }

  const statusHandler = async ( event, orderId ) => {
    try {
      const response = await axios.post(backendUrl + '/api/order/status' , {orderId, status:event.target.value}, { headers: {token}})
      if (response.data.success) {
        await fetchAllOrders()
      }
    } catch (error) {
      console.log(error)
      toast.error(response.data.message)
    }
  }

  const showOrderDetails = (order) => {
    const addr = order.address || {}
    const name = [addr.firstName, addr.lastName].filter(Boolean).join(' ') || '-'
    const email = addr.email || '-'
    setDetailsModal({
      user: { name, email },
      address: order.address,
      amount: order.amount,
      date: order.date,
      paymentMethod: order.paymentMethod,
      payment: order.payment,
    })
  }

  useEffect(() => {
    fetchAllOrders();
  }, [token])

  return (
    <div>
      <h3>Order Page</h3>
      <div>
        {
          orders.map((order, index) => (
            <div className='border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700' key={index}>
              <div className='grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start'>
              <img className='w-12' src={assets.parcel_icon} alt="" />
              <div>
                <div>
                  {order.items.map((item, index) => {
                    if (index === order.items.length - 1) {
                      return <p className='py-0.5' key={index}> {item.name} x {item.quantity} <span> {item.size} </span> </p>
                    }
                    else {
                      return <p className='py-0.5' key={index}> {item.name} x {item.quantity} <span> {item.size} </span> ,</p>
                    }
                  })}
                </div>
                <p className='mt-3 mb-2 font-medium'>{order.address.firstName + " " + order.address.lastName}</p>
                <div>
                  <p>{order.address.street + ","}</p>
                  <p>{order.address.city + ", " + order.address.state + ", " + order.address.country + ", " + order.address.zipcode}</p>
                </div>
                <p>{order.address.phone}</p>
              </div>
              <div>
                <p className='text-sm sm:text-[15px]'>Items : {order.items.length}</p>
                <p className='mt-3'>Method : {order.paymentMethod}</p>
                <p>Payment : { order.payment ? 'Done' : 'Pending' }</p>
                <p>Date : {new Date(order.date).toLocaleDateString()}</p>
              </div>
              <p className='text-sm sm:text-[15px]'>{currency}{order.amount}</p>
              <div className='flex flex-col sm:flex-row gap-2'>
                <select onChange={(event)=>statusHandler(event,order._id)} value={order.status} className='p-2 font-semibold'>
                  <option value="Order Placed">Order Placed</option>
                  <option value="Packing">Packing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Out for delivery">Out for delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                <button
                  onClick={() => showOrderDetails(order)}
                  className='px-4 py-2 bg-slate-800 text-white text-sm font-medium rounded hover:bg-slate-700 transition-colors whitespace-nowrap'
                >
                  More details
                </button>
              </div>
              </div>

              <div className='flex items-center justify-between mt-8 mb-2'>
                {order.status === 'Cancelled' 
                ? <p className='text-red-500 font-bold text-sm'>Order Cancelled</p>
                : statusOrder.map((status, idx) => {
                  const activeStep = statusOrder.indexOf(order.status);
                  const isCompleted = idx <= activeStep;
                  return (
                    <div key={idx} className={`flex flex-col items-center flex-1 relative ${isCompleted ? 'text-green-500' : 'text-gray-400'}`}>
                      {idx > 0 && (
                        <div className={`absolute top-1.5 left-[-50%] w-full h-[2px] -z-10 ${idx <= activeStep ? 'bg-green-500' : 'bg-gray-200'}`} />
                      )}
                      <div className={`w-3 h-3 rounded-full ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}`} />
                      <p className='text-[8px] sm:text-xs mt-1 text-center'>{status}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          ))
        }
      </div>

      {/* Details Modal */}
      {detailsModal && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4' onClick={() => setDetailsModal(null)}>
          <div className='bg-white rounded-lg shadow-xl max-w-md w-full p-6' onClick={e => e.stopPropagation()}>
            <h4 className='text-lg font-semibold text-slate-800 mb-4'>Order & Customer Details</h4>
            <div className='space-y-4 text-sm'>
              <div>
                <p className='text-slate-500 text-xs font-medium uppercase mb-1'>Customer</p>
                <p className='font-medium text-slate-800'>{detailsModal.user?.name || '-'}</p>
                {detailsModal.user?.email && detailsModal.user.email !== '-' ? (
                  <a href={`mailto:${detailsModal.user.email}`} className='text-blue-600 hover:underline'>{detailsModal.user.email}</a>
                ) : (
                  <p className='text-slate-600'>{detailsModal.user?.email || '-'}</p>
                )}
              </div>
              <div>
                <p className='text-slate-500 text-xs font-medium uppercase mb-1'>Shipping address</p>
                {detailsModal.address && (
                  <div className='text-slate-700'>
                    <p>{detailsModal.address.firstName} {detailsModal.address.lastName}</p>
                    <p>{detailsModal.address.street}</p>
                    <p>{detailsModal.address.city}, {detailsModal.address.state} {detailsModal.address.zipcode}</p>
                    <p>{detailsModal.address.country}</p>
                    <p className='mt-2'>{detailsModal.address.phone}</p>
                  </div>
                )}
              </div>
              <div>
                <p className='text-slate-500 text-xs font-medium uppercase mb-1'>Order info</p>
                <p>Amount: {currency}{detailsModal.amount}</p>
                <p>Payment: {detailsModal.payment ? 'Done' : 'Pending'}</p>
                <p>Method: {detailsModal.paymentMethod}</p>
                <p>Date: {detailsModal.date ? new Date(detailsModal.date).toLocaleString() : '-'}</p>
              </div>
            </div>
            <button
              onClick={() => setDetailsModal(null)}
              className='mt-6 w-full px-4 py-2 bg-slate-800 text-white rounded hover:bg-slate-700 transition-colors'
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Orders