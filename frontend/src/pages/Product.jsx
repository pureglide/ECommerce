import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import DOMPurify from 'dompurify'
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';

// Sanitize HTML for safe rendering while preserving formatting (bold, italic, links, lists, etc.)
const sanitizeHtml = (html) => {
  if (!html) return ''
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'b', 'em', 'i', 'u', 'a', 'ul', 'ol', 'li', 'span', 'div', 'h1', 'h2', 'h3'],
    ALLOWED_ATTR: ['href', 'target', 'rel']
  })
}

const Product = () => {

  const { productId } = useParams();
  const { products, currency ,addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState('')
  const [size,setSize] = useState('')
  const [activePrice, setActivePrice] = useState(null);

  const fetchProductData = async () => {

    products.map((item) => {
      if (item._id === productId) {
        setProductData(item)
        setImage(item.image[0])
        
        // Set default size to the one with lowest price
        if (item.sizes && item.sizes.length > 0) {
          if (typeof item.sizes[0] === 'object') {
            const lowestSize = item.sizes.reduce((min, current) => Number(current.price) < Number(min.price) ? current : min, item.sizes[0]);
            setSize(lowestSize.size);
            setActivePrice(lowestSize.price);
          } else {
            setSize(item.sizes[0]);
            setActivePrice(item.price);
          }
        } else {
          setActivePrice(item.price);
        }
        return null;
      }
    })

  }

  useEffect(() => {
    fetchProductData();
  }, [productId,products])

  useEffect(() => {
    if (size && productData.sizes) {
      const sizeData = productData.sizes.find(s => (typeof s === 'object' ? s.size === size : s === size));
      if (sizeData && typeof sizeData === 'object' && sizeData.price) {
        setActivePrice(sizeData.price);
      }
    }
  }, [size, productData]);

  return productData ? (
    <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>
      {/*----------- Product Data-------------- */}
      <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>

        {/*---------- Product Images------------- */}
        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
          <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full'>
              {
                productData.image.map((item,index)=>(
                  <img onClick={()=>setImage(item)} src={item} key={index} className='w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer' alt="" />
                ))
              }
          </div>
          <div className='w-full sm:w-[80%]'>
              <img className='w-full h-auto' src={image} alt="" />
          </div>
        </div>

        {/* -------- Product Info ---------- */}
        <div className='flex-1'>
          <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>
          {/* <div className=' flex items-center gap-1 mt-2'>
              <img src={assets.star_icon} alt="" className="w-3 5" />
              <img src={assets.star_icon} alt="" className="w-3 5" />
              <img src={assets.star_icon} alt="" className="w-3 5" />
              <img src={assets.star_icon} alt="" className="w-3 5" />
              <img src={assets.star_dull_icon} alt="" className="w-3 5" />
              <p className='pl-2'>(122)</p>
          </div> */}
          <p className='mt-5 text-3xl font-medium'>{currency}{activePrice}</p>
          <div className='mt-5 text-gray-500 md:w-4/5 [&_a]:text-blue-600 [&_a]:underline [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6' dangerouslySetInnerHTML={{ __html: sanitizeHtml(productData.description) }} />
          <div className='flex flex-col gap-4 my-8'>
              <p>Select Size</p>
              <div className='flex gap-2'>
                {productData.sizes.map((item,index)=>(
                  <button onClick={()=>setSize(typeof item === 'object' ? item.size : item)} className={`border py-2 px-4 bg-gray-100 ${(typeof item === 'object' ? item.size : item) === size ? 'border-orange-500' : ''}`} key={index}>{typeof item === 'object' ? item.size : item}</button>
                ))}
              </div>
          </div>
          <button onClick={()=>productData.inStock && addToCart(productData._id,size)} className={`bg-black text-white px-8 py-3 text-sm active:bg-gray-700 ${productData.inStock ? '' : 'opacity-50 cursor-not-allowed'}`}>{productData.inStock ? 'ADD TO CART' : 'OUT OF STOCK'}</button>
          <hr className='mt-8 sm:w-4/5' />
          <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1'>
              <p>100% Original product.</p>
              <p>Cash on delivery is available on this product.</p>
              <p>Easy return and exchange policy within 7 days.</p>
          </div>
        </div>
      </div>

      {/* ---------- Description & Review Section ------------- */}
      <div className='mt-20'>
        <div className='flex'>
          <b className='border px-5 py-3 text-sm'>Description</b>
          {/* <p className='border px-5 py-3 text-sm'>Reviews (122)</p> */}
        </div>
        <div className='flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500'>
          <div className='flex flex-col gap-4 [&_ol]:list-decimal [&_ul]:list-disc [&_ol]:pl-6 [&_ul]:pl-6 [&_a]:text-blue-600 [&_a]:underline' dangerouslySetInnerHTML={{ __html: sanitizeHtml(productData.detailedDescription || productData.description) }} />
        </div>
      </div>

      {/* --------- display related products ---------- */}

      <RelatedProducts category={productData.category} subCategory={productData.subCategory} />

    </div>
  ) : <div className=' opacity-0'></div>
}

export default Product
