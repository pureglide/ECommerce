import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const Edit = ({ token }) => {

  // admin A1dd.jsx -> admin Edit.jsx -> frontend Collection.jsx to update the categories and subcategories and price

  const { id } = useParams();
  const navigate = useNavigate();

  const [image1, setImage1] = useState(false)
  const [image2, setImage2] = useState(false)
  const [image3, setImage3] = useState(false)
  const [image4, setImage4] = useState(false)

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [detailedDescription, setDetailedDescription] = useState("");
  const [category, setCategory] = useState("Home Cleaning");
  const [subCategory, setSubCategory] = useState("Surface Cleaners");
  const [bestseller, setBestseller] = useState(false);
  const [inStock, setInStock] = useState(true);
  const [sizes, setSizes] = useState([]);
  const [sizePrices, setSizePrices] = useState({});

  const [prevImages, setPrevImages] = useState([]);

  const decodeHtml = (html) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html || "";
    let value = txt.value;
    // Handle double escaping if necessary
    if (value.includes("&lt;") || value.includes("&gt;") || value.includes("&amp;")) {
      txt.innerHTML = value;
      value = txt.value;
    }
    return value;
  }

  const fetchProductData = async () => {
    try {
      const response = await axios.post(backendUrl + '/api/product/single', { productId: id })
      if (response.data.success) {
        const product = response.data.product;
        setName(product.name);
        setDescription(decodeHtml(product.description));
        setDetailedDescription(decodeHtml(product.detailedDescription || ""));
        setCategory(product.category);
        setSubCategory(product.subCategory);
        setBestseller(product.bestseller);
        setInStock(product.inStock);
        
        // Handle legacy sizes (array of strings) vs new sizes (array of objects)
        if (product.sizes && product.sizes.length > 0 && typeof product.sizes[0] === 'object') {
          setSizes(product.sizes.map(s => s.size));
          const prices = {};
          product.sizes.forEach(s => {
            prices[s.size] = s.price;
          });
          setSizePrices(prices);
        } else {
          setSizes(product.sizes);
          // Legacy format: use product.price for all sizes so inputs are pre-filled
          const prices = {};
          product.sizes.forEach(s => {
            prices[s] = product.price;
          });
          setSizePrices(prices);
        }

        setPrevImages(product.image);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  useEffect(() => {
    fetchProductData();
  }, [id])

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!description || description === '<p><br></p>') {
      toast.error("Product description is required");
      return;
    }

    try {
      const formData = new FormData()
      formData.append("id", id)
      formData.append("name", name)
      formData.append("description", description)
      formData.append("detailedDescription", detailedDescription)
      formData.append("category", category)
      formData.append("subCategory", subCategory)
      formData.append("bestseller", bestseller)
      formData.append("inStock", inStock)
      
      // Combine sizes and their prices
      const sizesWithPrices = sizes.map(size => ({ size, price: sizePrices[size] }));
      formData.append("sizes", JSON.stringify(sizesWithPrices))

      // Calculate and append base price (min price) for sorting
      const basePrice = sizesWithPrices.length > 0 ? Math.min(...sizesWithPrices.map(item => Number(item.price))) : 0;
      formData.append("price", basePrice);

      image1 && formData.append("image1", image1)
      image2 && formData.append("image2", image2)
      image3 && formData.append("image3", image3)
      image4 && formData.append("image4", image4)

      const response = await axios.post(backendUrl + "/api/product/update", formData, { headers: { token } })

      if (response.data.success) {
        toast.success(response.data.message)
        navigate('/list')
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
      <div className='flex gap-2'>
        <label htmlFor="image1">
          <img className='w-20' src={!image1 ? (prevImages[0] || assets.upload_area) : URL.createObjectURL(image1)} alt="" />
          <input onChange={(e) => setImage1(e.target.files[0])} type="file" id="image1" hidden />
        </label>
        <label htmlFor="image2">
          <img className='w-20' src={!image2 ? (prevImages[1] || assets.upload_area) : URL.createObjectURL(image2)} alt="" />
          <input onChange={(e) => setImage2(e.target.files[0])} type="file" id="image2" hidden />
        </label>
        <label htmlFor="image3">
          <img className='w-20' src={!image3 ? (prevImages[2] || assets.upload_area) : URL.createObjectURL(image3)} alt="" />
          <input onChange={(e) => setImage3(e.target.files[0])} type="file" id="image3" hidden />
        </label>
        <label htmlFor="image4">
          <img className='w-20' src={!image4 ? (prevImages[3] || assets.upload_area) : URL.createObjectURL(image4)} alt="" />
          <input onChange={(e) => setImage4(e.target.files[0])} type="file" id="image4" hidden />
        </label>
      </div>
      <div className='w-full'><p className='mb-2'>Product name</p><input onChange={(e) => setName(e.target.value)} value={name} className='w-full max-w-[500px] px-3 py-2' type="text" placeholder='Type here' required /></div>
      <div className='w-full'><p className='mb-2'>Product description</p><ReactQuill theme="snow" value={description} onChange={setDescription} className='w-full max-w-[500px]' /></div>
      <div className='w-full'><p className='mb-2'>Detailed description</p><ReactQuill theme="snow" value={detailedDescription} onChange={setDetailedDescription} className='w-full max-w-[500px]' /></div>
      <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
        <div><p className='mb-2'>Product category</p><select onChange={(e) => setCategory(e.target.value)} value={category} className='w-full px-3 py-2'><option value="Home Cleaning">Home Cleaning</option><option value="Kitchen Cleaning">Kitchen Cleaning</option><option value="Laundry & Automotive Cleaning">Laundry & Automotive Cleaning</option></select></div>
        <div><p className='mb-2'>Sub category</p><select onChange={(e) => setSubCategory(e.target.value)} value={subCategory} className='w-full px-3 py-2'><option value="Surface Cleaners">Surface Cleaners</option><option value="Wash Liquids">Wash Liquids</option><option value="Disinfectants">Disinfectants</option><option value="Vehicle Care">Vehicle Care</option></select></div>
      </div>
      <div><p className='mb-2'>Product Sizes</p><div className='flex gap-3'>{["500ml", "1kg", "5kg"].map((item) => (
        <div key={item}>
          <div onClick={() => setSizes(prev => prev.includes(item) ? prev.filter(a => a !== item) : [...prev, item])}>
            <p className={`${sizes.includes(item) ? "bg-pink-100" : "bg-slate-200"} px-3 py-1 cursor-pointer`}>{item}</p>
          </div>
          {sizes.includes(item) && <input onChange={(e) => setSizePrices(prev => ({...prev, [item]: e.target.value}))} value={sizePrices[item] || ''} type="number" className='w-full mt-1 px-1 py-1 border text-xs' placeholder='Price' required />}
        </div>
      ))}</div></div>
      <div className='flex gap-2 mt-2'><input onChange={() => setBestseller(prev => !prev)} checked={bestseller} type="checkbox" id='bestseller' /><label className='cursor-pointer' htmlFor="bestseller">Add to bestseller</label></div>
      <div className='flex gap-2 mt-2'><input onChange={() => setInStock(prev => !prev)} checked={inStock} type="checkbox" id='inStock' /><label className='cursor-pointer' htmlFor="inStock">In Stock</label></div>
      <button type='submit' className='w-28 py-3 mt-4 bg-black text-white'>UPDATE</button>
    </form>
  )
}
export default Edit