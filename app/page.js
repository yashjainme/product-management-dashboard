

"use client";
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
  const [productForm, setProductForm] = useState({});
  const [products, setProducts] = useState([]);
  const [alert, setAlert] = useState('');
  const [query, setQuery] = useState("");
  const [loadingaction, setLoadingaction] = useState(false)
  const [loading, setLoading] = useState(false)
  const [dropdown, setDropdown] = useState([])

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/product');
      const rjson = await response.json();
      setProducts(rjson.products);
    } catch (error) {
      console.error('Error fetching products:', error.message);
    }
  };

  const buttonAction = async (action, slug, initialQuantity) => {
    // console.log(action, slug);
    let index = products.findIndex((item)=> item.slug === slug);
    let newProducts = JSON.parse(JSON.stringify(products));
    if(action === "plus"){
      newProducts[index].quantity = parseInt(initialQuantity) + 1;
    } else {
      newProducts[index].quantity = parseInt(initialQuantity) - 1;
    }
    setProducts(newProducts);

    let indexdrop = dropdown.findIndex((item)=> item.slug === slug);
    let newDropdown = JSON.parse(JSON.stringify(dropdown));
    if(action === "plus"){
      newDropdown[indexdrop].quantity = parseInt(initialQuantity) + 1;
    } else {
      newDropdown[indexdrop].quantity = parseInt(initialQuantity) - 1;
    }
    setDropdown(newDropdown);
    setLoadingaction(true);
    
    const response = await fetch('/api/action', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({action, slug, initialQuantity}),
    });
    let r = await response.json();
    // console.log(r);
    setLoadingaction(false);
  }

  const addProduct = async (e) => {
    e.preventDefault();
    const { slug, quantity, price } = productForm;
  
    if (!slug || !quantity || !price) {
      toast.error('Please fill all the fields.');
      return;
    }
  
    try {
      const response = await fetch('/api/product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productForm),
      });
  
      if (response.ok) {
        console.log('Product added successfully!');
        toast.success('Your Product has been added!');
        setProductForm({ slug: '', quantity: '', price: '' });
        fetchProducts();
      } else {
        console.error('Failed to add product:', response.statusText);
        toast.error('Failed to add product.');
      }
    } catch (error) {
      console.error('Error adding product:', error.message);
      toast.error('Error adding product.');
    }
  };
  

  const handleChange = (e) => {
    setProductForm({ ...productForm, [e.target.name]: e.target.value });
  };

  const onDropdownEdit = async (e) => {
    const value = e.target.value;
    if (value.length > 2) {
      setLoading(true);
      setQuery(value);
  
      try {
        const response = await fetch('/api/search/?query=' + value);
        const rjson = await response.json();
        setDropdown(rjson.products);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching search results:', error.message);
        setLoading(false);
      }
    } else {
      setQuery('');
      setDropdown([]);
    }
  };

  return (
    <>
      <div className='p-5'>
        <Navbar />
        <ToastContainer />
        <div className="container my-6 mx-auto">
          <div className='text-green-800 text-center'>{alert}</div>
          <div className="flex flex-col mb-2">
            <h1 className="text-3xl font-semibold">Search a product</h1>
            <div className="w-full mt-4">
              <div className="flex w-full">
                <input onChange={onDropdownEdit} type="text" id="searchProduct" name="searchProduct" className="flex-1 px-3 py-2 border rounded-l" placeholder="Enter product name" />
               
              </div>
            </div>
          </div>
          {loading && <div className="flex justify-center"><svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" stroke="black"><g fill="none" fillRule="evenodd"><g transform="translate(2 2)" strokeWidth="4"><circle strokeOpacity=".2" cx="18" cy="18" r="18" /><path d="M36 18c0-9.94-8.06-18-18-18"><animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="1s" repeatCount="indefinite"/></path></g></g></svg></div>}
          <div className="dropcontainer absolute w-[82vw] border-1 bg-white text-black rounded-md">
            {dropdown.map(item => (
              <div key={item.slug} className="container flex justify-between p-2 my-1 border-b-2">
                <span className="slug">{item.slug} ({item.quantity} available for {item.price})</span>
                <div className="mx-5">
                  <button onClick={()=>{buttonAction("minus", item.slug, item.quantity)}} disabled={loadingaction} className="sub inline-block cursor-pointer disabled:bg-slate-200 px-3 py-1 bg-black text-white font-semibold rounded-lg shadow-md"> - </button>
                  <span className="quantity inline-block w-5 mx-3">{item.quantity}</span>
                  <button onClick={()=>{buttonAction("plus", item.slug, item.quantity)}} disabled={loadingaction} className="add inline-block cursor-pointer disabled:bg-slate-200 px-3 py-1 bg-black text-white font-semibold rounded-lg shadow-md"> +</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="container my-6 mx-auto">
          <h1 className="text-3xl font-semibold mb-4">Add a product</h1>
          <form className="mb-4" onSubmit={addProduct}>
            <div className="flex flex-col mb-2">
              <label htmlFor="productName" className="mb-1">Product Slug:</label>
              <input value={productForm?.slug || ""} onChange={handleChange} type="text" id="productName" name="slug" className="px-3 py-2 border" />
            </div>
            <div className="flex flex-col mb-2">
              <label htmlFor="quantity" className="mb-1">Quantity:</label>
              <input value={productForm?.quantity || ""} onChange={handleChange} type="number" id="quantity" name="quantity" className="px-3 py-2 border" />
            </div>
            <div className="flex flex-col mb-2">
              <label htmlFor="price" className="mb-1">Price:</label>
              <input value={productForm?.price || ""} onChange={handleChange} type="number" id="price" name="price" className="px-3 py-2 border" />
            </div>
            <button type="submit" className="add inline-block cursor-pointer px-3 py-1 bg-white text-black mt-2 font-semibold rounded-lg shadow-md">
              Add Product
            </button>
          </form>
        </div>
        <div className="container my-6 mx-auto">
          <h1 className="text-3xl font-semibold mb-4">Display Current Stock</h1>
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="px-4 py-2">Product Name</th>
                <th className="px-4 py-2">Quantity</th>
                <th className="px-4 py-2">Price</th>
              </tr>
            </thead>
            <tbody>
              {products.map((item, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{item.slug}</td>
                  <td className="border px-4 py-2">{item.quantity}</td>
                  <td className="border px-4 py-2">₹{item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}







































