import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import parse from "html-react-parser";

import appwriteService from "../appwrite/config";
import Button from "../components/Button/Button";
import Container from "../components/Container/Container";
import Loader from "../components/Loader/Loader";
import './Post.css'
import { FaEdit, FaTrash, FaUserCircle } from 'react-icons/fa'

function Post() {
    const [post, setPost] = useState(null);
    const [bodyHtml, setBodyHtml] = useState(null);
    const { slug } = useParams();
    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);

    const isAuthor = post && userData ? post.userId === userData.$id : false;
    const imageId = appwriteService.getPostImageId(post);
    const previewUrl = appwriteService.getFilePreview(imageId);

    useEffect(() => {
        if (!slug) return;

        appwriteService.getPost(slug).then(async (loadedPost) => {
            if (loadedPost) {
                setPost(loadedPost);

                // try fetching stored full HTML body from storage
                try {
                    const body = await appwriteService.getBody(loadedPost.$id || slug);
                    if (body) setBodyHtml(body);
                } catch (err) {
                    console.debug("[Post] getBody failed", err);
                }

                return;
            }

            navigate("/");
        });
    }, [slug, navigate]);

    const [isDeleting, setIsDeleting] = useState(false);

    const deletePost = async () => {
        if (!post) return;
        try {
            setIsDeleting(true);
            const status = await appwriteService.deletePost(post.$id);
            if (!status) return;

            if (imageId) {
                await appwriteService.deleteFile(imageId);
            }

            navigate("/");
        } catch (err) {
            console.error("[Post] delete failed", err);
        } finally {
            setIsDeleting(false);
        }
    };

    if (!post) return null;

    return (
        <div className="post-page">
            {isDeleting ? <Loader overlay /> : null}
            <div className="post-card cp-card cp-fade-up">
                <div className="post-hero-wrap">
                    {previewUrl ? (
                        <img src={previewUrl} alt={post.title} className="post-hero"/>
                    ) : (
                        <div style={{height:420,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(255,255,255,0.02)',borderRadius:10}}>
                            <FaUserCircle style={{fontSize:80,opacity:0.25}} />
                        </div>
                    )}
                    <div className="post-hero-overlay" />
                </div>

                <div style={{padding:'18px'}}>
                    <h1 className="post-title">{post.title}</h1>

                    <div className="post-meta">
                        <div className="left">
                            <div className="author-badge">
                                <FaUserCircle />
                                <span>{isAuthor ? 'You' : post.userId}</span>
                            </div>
                            <div style={{opacity:0.8}}>{post.$createdAt ? new Date(post.$createdAt).toLocaleString() : ''}</div>
                        </div>

                        <div className="post-actions">
                            {isAuthor ? (
                                <>
                                    <Link to={`/edit-post/${post.$id}`}>
                                        <Button className="cp-btn" style={{padding:'8px 10px'}}>
                                            <FaEdit />
                                        </Button>
                                    </Link>
                                    <Button className="cp-btn" onClick={deletePost} disabled={isDeleting} style={{backgroundColor:'#ef4444'}}>
                                        <FaTrash />
                                    </Button>
                                </>
                            ) : null}
                        </div>
                    </div>

                    <div className="post-content cp-fade-up" style={{marginTop:12}}>
                        {parse(bodyHtml || post.content || "")}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Post;
