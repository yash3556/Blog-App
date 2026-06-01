import { Link } from "react-router-dom";
import appwriteService from "../../appwrite/config";

function PostCard({ $id, title, featuredImage, featuredimages, featuredimage }) {
    const imageId = appwriteService.getPostImageId({
        featuredImage,
        featuredimages,
        featuredimage,
    });
    const previewUrl = appwriteService.getFilePreview(imageId);

    return (
        <Link to={`/post/${$id}`}>
            <div>
                <div>
                    {previewUrl ? (
                        <div style={{width:'320px',height:'220px',padding:'10px',borderRadius:'10px'}} 
                        className="bg-white/5 border border-purple-500/20 focus:border-purple-400  hover:scale-105 hover:shadow-[0_0_30px_rgba(168,85,247,0.4)]
                          transition-all duration-300">
                        <img style={{width:'300px',height:'200px'}}
                            src={previewUrl}
                            alt={title}
                            onError={(event) => {
                                console.error("[PostCard] Preview failed", {
                                    postId: $id,
                                    imageId,
                                    previewUrl,
                                    currentSrc: event.currentTarget.currentSrc,
                                });
                            }}
                        /></div>
                    ) : null}
                </div>
                <h2 style={{textAlign:'center',margin:'10px',fontWeight:'bolder'}}>
                    {title.toUpperCase()}</h2>
            </div>
        </Link>
    );
}

export default PostCard;
