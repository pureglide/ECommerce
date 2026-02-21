import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const List = ({ token }) => {

  const navigate = useNavigate();

  const [list, setList] = useState([])

  const fetchList = async () => {
    try {

      const response = await axios.get(backendUrl + '/api/product/list')
      if (response.data.success) {
        setList(response.data.products.reverse());
      }
      else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const removeProduct = async (id) => {
    try {

      const response = await axios.post(backendUrl + '/api/product/remove', { id }, { headers: { token } })

      if (response.data.success) {
        toast.success(response.data.message)
        await fetchList();
      } else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const toggleStock = async (id, inStock) => {
    try {
        const response = await axios.post(backendUrl + '/api/product/stock', { id, inStock }, { headers: { token } });
        if (response.data.success) {
            toast.success(response.data.message);
            fetchList(); // Refresh the list to show new status
        } else {
            toast.error(response.data.message);
        }
    } catch (error) {
        console.log(error);
        toast.error(error.message);
    }
  }

  useEffect(() => {
    fetchList()
  }, [])

  return (
    <>
      <p className='mb-2'>All Products List</p>
      <div className='flex flex-col gap-2'>

        {/* ------- List Table Title ---------- */}

        <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm'>
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Stock</b>
          <b className='text-center'>Action</b>
        </div>

        {/* ------ Product List ------ */}

        {
          list.map((item, index) => {
            let displayPrice = item.price;
            if (item.sizes && item.sizes.length > 0 && typeof item.sizes[0] === 'object') {
              const lowestSize = item.sizes.reduce((min, current) => Number(current.price) < Number(min.price) ? current : min, item.sizes[0]);
              displayPrice = `${item.price} / ${lowestSize.size}`;
            }
            return (
            <div className='grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm' key={index}>
              <img className='w-12' src={item.image[0]} alt="" />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>{currency}{displayPrice}</p>
              <select onChange={(e)=>toggleStock(item._id, e.target.value === 'true')} value={item.inStock ? "true" : "false"} className='p-1 text-sm border rounded'>
                <option value="true">In Stock</option>
                <option value="false">Out of Stock</option>
              </select>
              <div className='text-right md:text-center cursor-pointer text-lg'>
                <p onClick={()=>navigate(`/edit/${item._id}`)} className='text-blue-500 hover:text-blue-700 mr-2 inline-block'>Edit</p>
                <p onClick={()=>removeProduct(item._id)} className='text-red-500 hover:text-red-700 inline-block'>X</p>
              </div>
            </div>
          )})
        }

      </div>
    </>
  )
}

export default List