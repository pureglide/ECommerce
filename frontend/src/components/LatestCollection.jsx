import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';
import ProductItem from './ProductItem';

const LatestCollection = () => {
 
    const { products } = useContext(ShopContext);
    const [latestProducts,setLatestProducts] = useState([]);

    useEffect(()=>{
        setLatestProducts(products.slice(0,10));
    },[products])

  return (
    <section className='my-12'>
      <div className='rounded-3xl bg-white shadow-sm border border-slate-100 px-4 sm:px-6 md:px-8 py-8 sm:py-10'>
        <div className='text-center text-3xl'>
            <Title text1={'LATEST'} text2={'COLLECTIONS'} />
            <p className='w-full sm:w-3/4 md:w-2/3 mx-auto mt-2 text-xs sm:text-sm md:text-base text-slate-600'>
            Explore our newest arrivals, crafted to deliver best results, reliability, and value.
            </p>
        </div>

        {/* Rendering Products */}
        <div className='mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
          {

            // latestProducts.map((item,index)=>(
            //   <ProductItem key={index} id={item._id} image={item.image} name={item.name} price={item.price} inStock={item.inStock} />
            // ))
            latestProducts.map((item,index)=>{
              let displayPrice = item.price;
              if (item.sizes && item.sizes.length > 0 && typeof item.sizes[0] === 'object') {
                const lowestSize = item.sizes.reduce((min, current) => Number(current.price) < Number(min.price) ? current : min, item.sizes[0]);
                displayPrice = `${item.price} / ${lowestSize.size}`;
              }
              return <ProductItem key={index} name={item.name} id={item._id} price={displayPrice} image={item.image} bestseller={item.bestseller} inStock={item.inStock} />
            })

          }
        </div>
      </div>
    </section>
  )
}

export default LatestCollection
