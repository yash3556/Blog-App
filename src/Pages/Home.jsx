import React, { useEffect, useState } from 'react';
import appwriteService from '../appwrite/config';
import { Container, PostCard,Button } from '../components';
import { Link } from 'react-router-dom';
import laptopImg from "../assets/laptop.png";
import './Home.css';
import {
  FaLaptopCode,
  FaPlane,
  FaHeart,
  FaPenNib,
} from "react-icons/fa";
import { IoCodeSlash } from "react-icons/io5";


function Home() {
    const [posts, setPosts] = useState([]);
    useEffect(() => {
          appwriteService.getPosts([]).then((result) => {
        if (result) {
            setPosts(result.documents)
        }
    })

    },[])
      if (posts.length === 0) {
    return (
   <div className="relative min-h-screen bg-linear-to-br from-[#12001f] via-[#280a3b] to-[#3b0b3b] overflow-hidden flex
        items-center justify-center">
     {/* Purple Glow */}
      <div className="absolute top-10 left-10  w-72  h-72 bg-purple-500/20 rounded-full blur-3xl"></div>

  {/* Content */}
  <div style={{marginBottom:'90px'}} className=" relative z-10 flex items-center justify-between w-full max-w-7xl px-10  ">
   {/* Left Text */}
    <div className="max-w-xl">
      <h1 className=" text-5xl font-bold text-white leading-tight">
        Welcome to Blogify 🚀
      </h1>

      <p className="  mt-6 text-gray-300 text-lg  ">
        It looks like you haven't posted anyting yet.
        Start Shareing your ideas,stories and knowledge with the world.
      </p>
       <Button className='bg-linear-to-r from-[#9333ea] to-[#c084fc] hover:scale-105 hover:bg-white/10 transition-all duration-300' 
       style={{height:'30px',width:'200px',marginTop:'20px',color:'white' }} >
        <Link to='/add-post'>Create Your First Post</Link>
        </Button>       
    </div>

    {/* Right Image */}
    <img
      src={laptopImg} alt="Laptop" className="  w-137.5 object-contain drop-shadow-[0_0_60px_rgba(168,85,247,0.5)] "/>
       
  </div>
      
</div>


    )
  }
return (
        <div className=" max-w-screen overflow-hidden flex h-screen text-white bg-linear-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] shadow-[0_0_80px_rgba(168,85,247,0.2)]">
            <div style={{margin:'20px'}}>
                <div style={{width:'100%',height:'70px',marginLeft:'20px'}} 
                className='bg-linear-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] border border-white/10 focus:border-purple-400 hover:scale-105 hover:shadow-purple-500/30 transition-all duration-300'>
                    <h1 style={{textAlign:'center', padding:'20px',fontSize:'25px',fontWeight:'bolder'}}>Home</h1>
                    </div>
                <div style={{margin:'20px',padding:'20px'}} className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                    {posts.map((post) => (
                        <div key={post.$id}>
                            <PostCard {...post} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Home
