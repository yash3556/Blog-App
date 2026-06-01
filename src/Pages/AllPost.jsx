import React, { useEffect, useState } from 'react';
import { Container, PostCard } from '../components';
import appwriteService from '../appwrite/config';

function AllPost() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        appwriteService.getPosts([]).then((result) => {
            if (result) {
                setPosts(result.documents);
            }
        });
    }, []);

    return (
        <div className=" max-w-screen overflow-hidden flex h-screen text-white bg-linear-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] shadow-[0_0_80px_rgba(168,85,247,0.2)]">
            <div style={{margin:'20px'}}>
                <div style={{width:'100%',height:'70px',marginLeft:'20px'}} 
                className='bg-linear-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] border border-white/10 focus:border-purple-400 hover:scale-105 hover:shadow-purple-500/30 transition-all duration-300'>
                    <h1 style={{textAlign:'center', padding:'20px',fontSize:'25px',fontWeight:'bolder'}}>All Post</h1>
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

export default AllPost
