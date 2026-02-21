import React, { useState } from 'react'
import {assets} from '../assets/assets'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const Add = ({token}) => {

  // admin A1dd.jsx -> admin Edit.jsx -> frontend Collection.jsx to update the categories and subcategories and price

  const [image1,setImage1] = useState(false)
  const [image2,setImage2] = useState(false)
  const [image3,setImage3] = useState(false)
  const [image4,setImage4] = useState(false)

   const [name, setName] = useState("");
   const [description, setDescription] = useState("");
   const [category, setCategory] = useState("Home Cleaning");
   const [subCategory, setSubCategory] = useState("Surface Cleaners");
   const [bestseller, setBestseller] = useState(false);
   const [sizes, setSizes] = useState([]);
   const [sizePrices, setSizePrices] = useState({});

   const [detailedDescription, setDetailedDescription] = useState("");

   const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!description || description === '<p><br></p>') {
      toast.error("Product description is required");
      return;
    }

    try {
      
      const formData = new FormData()

      formData.append("name",name)
      formData.append("description",description)
      formData.append("category",category)
      formData.append("subCategory",subCategory)
      formData.append("bestseller",bestseller)
      
      // Combine sizes and their prices
      const sizesWithPrices = sizes.map(size => ({ size, price: sizePrices[size] }));
      formData.append("sizes",JSON.stringify(sizesWithPrices))

      // Calculate and append base price (min price) for sorting
      const basePrice = sizesWithPrices.length > 0 ? Math.min(...sizesWithPrices.map(item => Number(item.price))) : 0;
      formData.append("price", basePrice);
      
      formData.append("detailedDescription", detailedDescription);

      image1 && formData.append("image1",image1)
      image2 && formData.append("image2",image2)
      image3 && formData.append("image3",image3)
      image4 && formData.append("image4",image4)

      const response = await axios.post(backendUrl + "/api/product/add",formData,{headers:{token}})

      if (response.data.success) {
        toast.success(response.data.message)
        setName('')
        setDescription('')
        setDetailedDescription('')
        setImage1(false)
        setImage2(false)
        setImage3(false)
        setImage4(false)
        setSizePrices({})
      } else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
   }

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-3'>
        <div>
          <p className='mb-2'>Upload Image</p>

          <div className='flex gap-2'>
            <label htmlFor="image1">
              <img className='w-20' src={!image1 ? assets.upload_area : URL.createObjectURL(image1)} alt="" />
              <input onChange={(e)=>setImage1(e.target.files[0])} type="file" id="image1" hidden/>
            </label>
            <label htmlFor="image2">
              <img className='w-20' src={!image2 ? assets.upload_area : URL.createObjectURL(image2)} alt="" />
              <input onChange={(e)=>setImage2(e.target.files[0])} type="file" id="image2" hidden/>
            </label>
            <label htmlFor="image3">
              <img className='w-20' src={!image3 ? assets.upload_area : URL.createObjectURL(image3)} alt="" />
              <input onChange={(e)=>setImage3(e.target.files[0])} type="file" id="image3" hidden/>
            </label>
            <label htmlFor="image4">
              <img className='w-20' src={!image4 ? assets.upload_area : URL.createObjectURL(image4)} alt="" />
              <input onChange={(e)=>setImage4(e.target.files[0])} type="file" id="image4" hidden/>
            </label>
          </div>
        </div>

        <div className='w-full'>
          <p className='mb-2'>Product name</p>
          <input onChange={(e)=>setName(e.target.value)} value={name} className='w-full max-w-[500px] px-3 py-2' type="text" placeholder='Type here' required/>
        </div>

        <div className='w-full'>
          <p className='mb-2'>Product description</p>
          <ReactQuill theme="snow" value={description} onChange={setDescription} className='w-full max-w-[500px]' />
        </div>

        <div className='w-full'>
          <p className='mb-2'>Detailed Description</p>
          <ReactQuill theme="snow" value={detailedDescription} onChange={setDetailedDescription} className='w-full max-w-[500px]' />
        </div>

        <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>

            <div>
              <p className='mb-2'>Product category</p>
              <select onChange={(e) => setCategory(e.target.value)} className='w-full px-3 py-2'>
                  <option value="Home Cleaning">Home Cleaning</option>
                  <option value="Kitchen Cleaning">Kitchen Cleaning</option>
                  <option value="Laundry & Automotive Cleaning">Laundry & Automotive Cleaning</option>
              </select>
            </div>

            <div>
              <p className='mb-2'>Sub category</p>
              <select onChange={(e) => setSubCategory(e.target.value)} className='w-full px-3 py-2'>
                  <option value="Surface Cleaners">Surface Cleaners</option>
                  <option value="Wash Liquids">Wash Liquids</option>
                  <option value="Disinfectants">Disinfectants</option>
                  <option value="Vehicle Care">Vehicle Care</option>
              </select>
            </div>

        </div>

        <div>
          <p className='mb-2'>Product Sizes</p>
          <div className='flex gap-3'>
            {["500ml", "1kg", "5kg"].map((item, index) => (
                <div key={index}>
                  <div onClick={()=>setSizes(prev => prev.includes(item) ? prev.filter( i => i !== item) : [...prev,item])}>
                    <p className={`${sizes.includes(item) ? "bg-pink-100" : "bg-slate-200" } px-3 py-1 cursor-pointer`}>{item}</p>
                  </div>
                  {sizes.includes(item) && <input onChange={(e) => setSizePrices(prev => ({...prev, [item]: e.target.value}))} type="number" className='w-full mt-1 px-1 py-1 border text-xs' placeholder='Price' required />}
                </div>
            ))}
          </div>
        </div>

        <div className='flex gap-2 mt-2'>
          <input onChange={() => setBestseller(prev => !prev)} checked={bestseller} type="checkbox" id='bestseller' />
          <label className='cursor-pointer' htmlFor="bestseller">Add to bestseller</label>
        </div>

        <button type="submit" className='w-28 py-3 mt-4 bg-black text-white'>ADD</button>

    </form>
  )
}

export default Add