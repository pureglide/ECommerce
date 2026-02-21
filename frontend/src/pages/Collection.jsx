import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';

// admin A1dd.jsx -> admin Edit.jsx -> frontend Collection.jsx to update the categories and subcategories and price

const Collection = () => {

  const { products , search , showSearch } = useContext(ShopContext);
  const [showFilter,setShowFilter] = useState(false);
  const [filterProducts,setFilterProducts] = useState([]);
  const [category,setCategory] = useState([]);
  const [subCategory,setSubCategory] = useState([]);
  const [sortType,setSortType] = useState('relavent')

  const toggleCategory = (e) => {

    if (category.includes(e.target.value)) {
        setCategory(prev=> prev.filter(item => item !== e.target.value))
    }
    else{
      setCategory(prev => [...prev,e.target.value])
    }

  }

  const toggleSubCategory = (e) => {

    if (subCategory.includes(e.target.value)) {
      setSubCategory(prev=> prev.filter(item => item !== e.target.value))
    }
    else{
      setSubCategory(prev => [...prev,e.target.value])
    }
  }

  const applyFilter = () => {

    let productsCopy = products.slice();

    if (showSearch && search) {
      productsCopy = productsCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter(item => category.includes(item.category));
    }

    if (subCategory.length > 0 ) {
      productsCopy = productsCopy.filter(item => subCategory.includes(item.subCategory))
    }

    setFilterProducts(productsCopy)

  }

  const sortProduct = () => {

    let fpCopy = filterProducts.slice();

    switch (sortType) {
      case 'low-high':
        setFilterProducts(fpCopy.sort((a,b)=>(a.price - b.price)));
        break;

      case 'high-low':
        setFilterProducts(fpCopy.sort((a,b)=>(b.price - a.price)));
        break;

      default:
        applyFilter();
        break;
    }

  }

  useEffect(()=>{
      applyFilter();
  },[category,subCategory,search,showSearch,products])

  useEffect(()=>{
    sortProduct();
  },[sortType])

  return (
    <section className='flex flex-col sm:flex-row gap-4 sm:gap-8 pt-10 border-t border-slate-100'>
      
      {/* Filter Options */}
      <div className='min-w-60'>
        <p onClick={()=>setShowFilter(!showFilter)} className='my-2 text-xl flex items-center cursor-pointer gap-2 text-slate-900'>
          Filters
          <img className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`} src={assets.dropdown_icon} alt="" />
        </p>
        {/* Category Filter */}
        <div className={`border border-slate-200 rounded-2xl pl-5 pr-4 py-4 mt-4 bg-white shadow-sm ${showFilter ? '' :'hidden'} sm:block`}>
          <p className='mb-3 text-xs font-semibold tracking-wide text-slate-500'>CATEGORIES</p>
          <div className='flex flex-col gap-2 text-sm font-light text-slate-700'>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Home Cleaning'} onChange={toggleCategory}/> Home Cleaning
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Kitchen Cleaning'} onChange={toggleCategory}/> Kitchen Cleaning
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Laundry & Automotive Cleaning'} onChange={toggleCategory}/> Laundry & Automotive Cleaning
            </p>
          </div>
        </div>
        {/* SubCategory Filter */}
        <div className={`border border-slate-200 rounded-2xl pl-5 pr-4 py-4 my-5 bg-white shadow-sm ${showFilter ? '' :'hidden'} sm:block`}>
          <p className='mb-3 text-xs font-semibold tracking-wide text-slate-500'>TYPE</p>
          <div className='flex flex-col gap-2 text-sm font-light text-slate-700'>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Surface Cleaners'} onChange={toggleSubCategory}/> Surface Cleaners
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Wash Liquids'} onChange={toggleSubCategory}/> Wash Liquids
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Disinfectants'} onChange={toggleSubCategory}/> Disinfectants
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Vehicle Care'} onChange={toggleSubCategory}/> Vehicle Care
            </p>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className='flex-1'>

        <div className='flex justify-between items-center gap-3 text-base sm:text-2xl mb-4'>
            <Title text1={'ALL'} text2={'COLLECTIONS'} />
            {/* Porduct Sort */}
            <select
              onChange={(e)=>setSortType(e.target.value)}
              className='border border-slate-200 bg-white text-xs sm:text-sm px-3 py-2 rounded-full shadow-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-200'
            >
              <option value="relavent">Sort: Relevant</option>
              <option value="low-high">Sort: Low to High</option>
              <option value="high-low">Sort: High to Low</option>
            </select>
        </div>

        {/* Map Products */}
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
          {
            filterProducts.map((item,index)=>{
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

export default Collection
