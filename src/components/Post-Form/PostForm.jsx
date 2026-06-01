import { useCallback, useEffect, useState, useRef, useLayoutEffect } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, Select, RTE } from "../index";
import appwriteService from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import './PostFrom.css'
import Loader from "../Loader/Loader";
import {
  FaFeatherAlt,
  FaFileAlt,
  FaImage,
  FaCog,
  FaUpload,
} from "react-icons/fa";

import { IoRocketSharp } from "react-icons/io5";

import { HiOutlineDocumentText } from "react-icons/hi";





function PostForm({ post }) {
    const { register, handleSubmit, control, watch, setValue, getValues } = useForm({
        defaultValues: {
            title: post?.title || "",
            slug: post?.slug || post?.$id || "",
            content: post?.content || "",
            status: post?.status || "active",
        },
    });
    const wrapperRef = useRef(null);
    const rightColRef = useRef(null);
    const editorHeaderRef = useRef(null);
    const editorFooterRef = useRef(null);
    const [editorHeight, setEditorHeight] = useState(360);
    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth?.userData);
    const [submitError, setSubmitError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const existingImageId = post ? appwriteService.getPostImageId(post) : null;
    const existingPreviewUrl = existingImageId
        ? appwriteService.getFilePreview(existingImageId)
        : "";

    const slugTransform = useCallback((value) => {
        if (value && typeof value === "string") {
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-z\d\s]/g, "")
                .replace(/\s+/g, "-");
        }

        return "";
    }, []);

    useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "title") {
                setValue("slug", slugTransform(value.title), { shouldValidate: true });
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [watch, slugTransform, setValue]);

    useLayoutEffect(() => {
        function recompute() {
            try {
                const right = rightColRef.current;
                const head = editorHeaderRef.current;
                const foot = editorFooterRef.current;
                if (!right) return;
                const rightH = right.clientHeight;
                const headH = head ? head.clientHeight : 0;
                const footH = foot ? foot.clientHeight : 0;
                const padding = 32; // safety padding
                const h = Math.max(200, rightH - headH - footH - padding);
                setEditorHeight(h);
            } catch (err) {
                console.debug(err);
            }
        }

        recompute();
        window.addEventListener("resize", recompute);
        return () => window.removeEventListener("resize", recompute);
    }, []);

    useEffect(() => {
        // when editing an existing post, try to load full HTML body from storage
        if (!post) return;

        (async () => {
            try {
                const body = await appwriteService.getBody(post.$id || post.slug || post.$id);
                if (body) {
                    setValue("content", body, { shouldValidate: false, shouldDirty: false });
                }
            } catch (err) {
                console.debug("[PostForm] getBody failed", err);
            }
        })();
    }, [post, setValue]);

    const submit = async (data) => {
        console.log("[PostForm] FORM SUBMITTED");
        setSubmitError("");
        setIsLoading(true);

        try {
            if (!userData?.$id) {
                navigate("/login");
                return;
            }

            const selectedFile = data.image?.[0] || null;
            console.log("[PostForm] Input state", {
                mode: post ? "edit" : "create",
                hasSelectedFile: Boolean(selectedFile),
                existingImageId,
            });

            if (post) {
                let newUploadedFile = null;

                try {
                    if (selectedFile) {
                        newUploadedFile = await appwriteService.uploadFile(
                            selectedFile,
                            userData.$id
                        );
                    }

                    const nextImageId =
                        newUploadedFile?.$id || existingImageId || null;

                    console.log("[PostForm] Edit flow IDs", {
                        existingImageId,
                        newUploadedFileId: newUploadedFile?.$id || null,
                        nextImageId,
                    });

                    const dbPost = await appwriteService.updatePost(post.$id, {
                        title: data.title,
                        content: data.content,
                        status: data.status,
                        featuredImage: nextImageId,
                        userId: userData.$id,
                    });

                    if (!dbPost?.$id) {
                        throw new Error("Update failed: document response missing post id");
                    }

                    if (
                        newUploadedFile?.$id &&
                        existingImageId &&
                        existingImageId !== newUploadedFile.$id
                    ) {
                        await appwriteService.deleteFile(existingImageId);
                    }

                    navigate(`/post/${dbPost.$id}`);
                } catch (error) {
                    if (newUploadedFile?.$id) {
                        await appwriteService.deleteFile(newUploadedFile.$id);
                    }
                    throw error;
                }

                return;
            }

            if (!selectedFile) {
                throw new Error("Please choose an image before submitting");
            }

            let uploadedFile = null;

            try {
                uploadedFile = await appwriteService.uploadFile(selectedFile, userData.$id);
                console.log("[PostForm] Upload result", {
                    fileId: uploadedFile?.$id || null,
                });

                if (!uploadedFile?.$id) {
                    throw new Error("Upload did not return a valid file id");
                }

                const dbPost = await appwriteService.createPost({
                    title: data.title,
                    slug: data.slug,
                    content: data.content,
                    status: data.status,
                    featuredImage: uploadedFile.$id,
                    userId: userData.$id,
                });

                if (!dbPost?.$id) {
                    throw new Error("Create failed: document response missing post id");
                }

                navigate(`/post/${dbPost.$id}`);
            } catch (error) {
                if (uploadedFile?.$id) {
                    await appwriteService.deleteFile(uploadedFile.$id);
                }
                throw error;
            }
        } catch (error) {
            console.error("[PostForm] Submit failed", error);
            if (error?.code === 401) {
                navigate("/login");
            }
            setSubmitError(error?.message || "Failed to save post");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative w-full text-white bg-linear-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] shadow-[0_0_80px_rgba(168,85,247,0.2)]">
            {isLoading ? <Loader overlay /> : null}
                  <div className="flex items-center gap-3" style={{marginBottom:'1px',padding:'10px',marginLeft:'10px'}}> 
                <div style={{backgroundColor:'#8B5CF6',height:'50 px', width:'45px',borderRadius:'4px'}} >
                    <FaFeatherAlt style={{fontSize:'25px',marginLeft:'8px',marginTop:"3px"}} />
                </div>
                <h1 style={{fontSize:"20px",fontWeight:'bolder'}}>{post ? 'Edit Post' : 'Add New Post'}</h1></div>
            <div style={{padding:'10px',margin:'10px'}}>
       
        <form onSubmit={handleSubmit(submit)}>
            <div ref={wrapperRef} style={{height:'calc(100vh - 80px)', overflow:'hidden', display:'flex', gap:20}}>
                <div style={{width:380, flex:'0 0 380px'}}>
                    <div style={{width:'100%',padding:'20px',borderRadius:'10px', height:'100%', boxSizing:'border-box'}} className="bg-white/5 backdrop-blur-xl border border-white/10 cp-card cp-field-group">
                        <div  style={{marginBottom:'10px'}} className="flex ">
                            <div style={{backgroundColor:'#8B5CF6',height:'25 px', width:'30px',borderRadius:'4px'}}>
                                <FaFileAlt style={{fontSize:'15px',marginLeft:'8px',marginTop:"5px"}} />
                            </div>
                            <h1 style={{marginLeft:'9px',fontWeight:'bolder'}}>Post Details</h1>
                        </div>
                        <Input className="bg-white/5 border border-purple-500/20 focus:border-purple-400"
                            style={{width:'300px',marginBottom:'10px',marginTop:'10px'}}
                            label="Title:"
                            placeholder="Title"
                            {...register("title", { required: true })}
                        />
                        <Input className="bg-white/5 border border-purple-500/20 focus:border-purple-400"
                            style={{width:'300px',marginBottom:'10px',marginTop:'10px'}}
                            label="Slug:"
                            placeholder="Slug"
                            {...register("slug", { required: true })}
                            onInput={(e) => {
                                setValue("slug", slugTransform(e.currentTarget.value), {
                                    shouldValidate: true,
                                });
                            }}
                        />

                        <div style={{width:'100%',paddingTop:12}}>
                            <div style={{width:'100%',padding:'20px',borderRadius:'10px'}} className="bg-white/5 backdrop-blur-xl border border-white/10 cp-card cp-field-group">
                                <div className="flex" style={{marginBottom:'10px'}}>
                                    <div style={{backgroundColor:'#8B5CF6',height:'25 px', width:'30px',borderRadius:'4px'}}>
                                        <FaImage style={{fontSize:'15px',marginLeft:'8px',marginTop:"5px"}} />
                                    </div>
                                    <h1 style={{marginLeft:'9px',fontWeight:'bolder'}}>Featured Image</h1>
                                </div>
                                <div  style={{height:'100px'}} className="border-2 border-dashed border-purple-500/20 hover:border-purple-400" >
                                    <Input  
                                        style={{width:'300px',height:'200px' ,marginLeft:'10px',outline:'none',border:'none'}}
                                        type="file"
                                        accept="image/png, image/jpg, image/jpeg, image/gif, image/webp"
                                        {...register("image", { required: !post })}
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            {post && existingPreviewUrl ? (
                                <div style={{marginTop:12}}>
                                    <div style={{width: '100%', height: 220, overflow: 'hidden', borderRadius: 12, boxShadow: '0 6px 18px rgba(0,0,0,0.45)'}}>
                                        <img
                                            style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}}
                                            src={existingPreviewUrl}
                                            alt={post.title}
                                            onLoad={() => {
                                                console.log("[PostForm] Preview loaded", {
                                                    imageId: existingImageId,
                                                });
                                            }}
                                            onError={(event) => {
                                                console.error("[PostForm] Preview failed", {
                                                    imageId: existingImageId,
                                                    previewUrl: existingPreviewUrl,
                                                    currentSrc: event.currentTarget.currentSrc,
                                                });
                                            }}
                                        />
                                    </div>
                                </div>
                            ) : null}

                            { !post ? (
                                <div style={{width:'100%',paddingTop:20, marginTop:20}} className="bg-white/5 backdrop-blur-xl border flex gap-10 border-white/10 cp-card cp-field-group">
                                    <Select
                                        options={["active", "inactive"]}
                                        label="Status"
                                        {...register("status", { required: true })}
                                    />

                                    <Button
                                        className={"cp-btn bg-linear-to-r from-[#7c3aed] to-[#a855f7] hover:scale-105 hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-all duration-300"}
                                        type="submit"
                                        backgroundColor={post ? "green" : undefined}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? <Loader small /> : (post ? 'Update' : 'Submit')}
                                    </Button>

                                    {submitError ? <p>{submitError}</p> : null}
                                </div>
                            ) : null }
                        </div>
                    </div>
                </div>

                <div ref={rightColRef} style={{flex:1, padding:'20px', boxSizing:'border-box', display:'flex', flexDirection:'column', borderRadius:'10px'}}  className="bg-white/5 backdrop-blur-xl border border-white/10 cp-card cp-field-group">
                    <div ref={editorHeaderRef} className="flex items-center gap-5" style={{marginBottom:'12px', backgroundColor:'#8B5CF6', height:'36px', width:'35px', borderRadius:'4px'}}>
                        <div >
                            <HiOutlineDocumentText style={{fontSize:'25px',marginLeft:'6px',marginTop:"5px",marginBottom:'7px'}}  />
                        </div>
                        <h1 style={{marginBottom:'10px'}}>Content:</h1>
                    </div>

                    <div style={{flex:1, minHeight:200, display:'flex', flexDirection:'column'}}>
                        <div style={{flex:1, overflow:'hidden'}}>
                            <RTE 
                                style={{width:"100%",height:'100%'}}
                                name="content"
                                control={control}
                                defaultValue={getValues("content")}
                                height={editorHeight}
                                width={'100%'}
                            />
                        </div>

                        { post ? (
                            <div ref={editorFooterRef} style={{marginTop:12}}>
                                <div style={{display:'flex', justifyContent:'flex-end', gap:12}}>
                                    <Button
                                        className={"cp-btn bg-linear-to-r from-[#7c3aed] to-[#a855f7] hover:scale-105 hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-all duration-300"}
                                        type="submit"
                                        backgroundColor={post ? "green" : undefined}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? <Loader small /> : 'Update'}
                                    </Button>

                                    {submitError ? <p>{submitError}</p> : null}
                                </div>
                            </div>
                        ) : null }
                    </div>
                </div>
            </div>
        </form>
    </div>
    
    </div>
    
);
}

export default PostForm;
