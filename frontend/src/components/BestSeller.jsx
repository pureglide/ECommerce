import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';
import ProductItem from './ProductItem';

const BestSeller = () => { 

    const {products} = useContext(ShopContext);
    const [bestSeller,setBestSeller] = useState([]);

    useEffect(()=>{
        const bestProduct = products.filter((item)=>(item.bestseller));
        setBestSeller(bestProduct.slice(0,5))
    },[products])

  return (
    <section id='bestsellers' className='my-12'>
      <div className='rounded-3xl bg-white shadow-sm border border-slate-100 px-4 sm:px-6 md:px-8 py-8 sm:py-10'>
        <div className='text-center text-3xl'>
          <Title text1={'BEST'} text2={'SELLERS'}/>
          <p className='w-full sm:w-3/4 md:w-2/3 mx-auto mt-2 text-xs sm:text-sm md:text-base text-slate-600'>
          Our bestseller products are customer favorites, loved for their exceptional quality, unbeatable value, and top-rated performance.
          </p>
        </div>

        <div className='mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
          {
              // bestSeller.map((item,index)=>(
              //     <ProductItem key={index} id={item._id} name={item.name} image={item.image} price={item.price} inStock={item.inStock} />
              // ))
            bestSeller.map((item,index)=>{
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

export default BestSeller
