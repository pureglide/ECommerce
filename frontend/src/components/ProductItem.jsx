import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import {Link} from 'react-router-dom'

const ProductItem = ({id,image,name,price,inStock=true}) => {
    
    const {currency} = useContext(ShopContext);

  return (
    <Link
      onClick={()=>scrollTo(0,0)}
      className='group text-slate-800 cursor-pointer'
      to={`/product/${id}`}
    >
      <div className='overflow-hidden relative rounded-2xl border border-slate-200 bg-white shadow-sm group-hover:shadow-lg group-hover:-translate-y-1 transition-all duration-200'>
        <div className='aspect-[4/5] overflow-hidden bg-slate-100'>
          <img
            className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out'
            src={image[0]}
            alt=""
          />
        </div>
        {!inStock && <p className='absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full'>OUT OF STOCK</p>}
      </div>
      <p className='pt-3 pb-1 text-sm font-medium line-clamp-2'>{name}</p>
      <p className='text-sm font-semibold text-slate-900'>{currency}{price}</p>
    </Link>
  )
}

export default ProductItem
