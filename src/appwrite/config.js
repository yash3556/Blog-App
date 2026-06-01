import conf from "../conf/conf";
import {
    Client,
    ID,
    Databases,
    Storage,
    Query,
    Permission,
    Role,
} from "appwrite";

const POST_IMAGE_FIELDS = ["featuredImage", "featuredimages", "featuredimage"];
const POST_USER_FIELDS = ["userId", "userid"];
const DATABASE_FEATURED_IMAGE_FIELD = "featuredimages";
const DATABASE_USER_FIELD = "userid";

export class Service {
    client = new Client();
    databases;
    bucket;
    debugEnabled = Boolean(import.meta.env.DEV);

    constructor() {
        this.client
            .setEndpoint(conf.appwrite)
            .setProject(conf.appwriteprojectID);

        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }

    debugLog(message, payload) {
        if (!this.debugEnabled) return;

        if (typeof payload === "undefined") {
            console.log(message);
            return;
        }

        console.log(message, payload);
    }

    extractFileId(fileRef) {
        if (!fileRef) return null;

        if (typeof fileRef === "object") {
            if (fileRef.$id) return fileRef.$id;
            if (fileRef.href) return this.extractFileId(fileRef.href);
            if (typeof fileRef.toString === "function") {
                return this.extractFileId(fileRef.toString());
            }
            return null;
        }

        if (typeof fileRef !== "string") return null;

        const value = fileRef.trim();
        if (!value) return null;
        if (!value.includes("/")) return value;

        const match = value.match(/\/files\/([^/?#]+)(?:\/|$)/);
        return match?.[1] ? decodeURIComponent(match[1]) : value;
    }

    getPostImageId(post) {
        if (!post || typeof post !== "object") return null;

        const rawImageRef = POST_IMAGE_FIELDS.map((field) => post[field]).find(Boolean);
        return this.extractFileId(rawImageRef);
    }

    normalizePost(post) {
        if (!post) return post;

        const featuredImage = this.getPostImageId(post);
        const userId = POST_USER_FIELDS.map((field) => post[field]).find(Boolean) || null;

        return {
            ...post,
            featuredImage,
            featuredimages: featuredImage,
            featuredimage: featuredImage,
            userId,
            userid: userId,
        };
    }

    async uploadBody(documentId, bodyContent, userId) {
        if (!documentId) return null;
        try {
            const fileId = `post-body-${documentId}`;
            const filename = `${fileId}.html`;

            const blob = new Blob([bodyContent || ""], { type: "text/html" });
            const file = new File([blob], filename, { type: "text/html" });

            const perms = [Permission.read(Role.any())];
            if (userId) perms.push(Permission.write(Role.user(userId)));

            const uploaded = await this.bucket.createFile({
                bucketId: conf.appwritebucketID,
                fileId,
                file,
                permissions: perms,
            });

            return uploaded?.$id || fileId;
        } catch (error) {
            console.error("[Appwrite:uploadBody] Failed", error);
            return null;
        }
    }

    async getBody(documentId) {
        if (!documentId) return null;
        try {
            const fileId = `post-body-${documentId}`;
            const view = this.bucket.getFileView({
                bucketId: conf.appwritebucketID,
                fileId,
            });

            const fileUrl = typeof view === "string" ? view : String(view || "");
            if (!fileUrl) return null;

            const res = await fetch(fileUrl);
            if (!res.ok) return null;
            return await res.text();
        } catch (error) {
            console.error("[Appwrite:getBody] Failed", error);
            return null;
        }
    }

    async createPost({
        title,
        slug,
        featuredImage,
        content,
        status,
        userId,
    }) {
        try {
            const documentId = slug && slug.trim() ? slug.trim() : ID.unique();
            const normalizedFeaturedImage = this.extractFileId(featuredImage);
            const normalizedContent =
                typeof content === "string"
                    ? content
                    : content == null
                    ? ""
                    : String(content);

            const truncatedContent =
                normalizedContent.length > 255
                    ? normalizedContent.slice(0, 255)
                    : normalizedContent;

            const payload = {
                title,
                [DATABASE_FEATURED_IMAGE_FIELD]: normalizedFeaturedImage,
                content: truncatedContent,
                status,
                [DATABASE_USER_FIELD]: userId,
            };

            this.debugLog("[Appwrite:createPost] Request payload", {
                documentId,
                imageField: DATABASE_FEATURED_IMAGE_FIELD,
                imageId: normalizedFeaturedImage,
                userId,
                status,
            });

            const createdPost = await this.databases.createDocument({
                databaseId: conf.appwritedatabaseID,
                collectionId: conf.appwritecollectionID,
                documentId,
                data: payload,
            });

            // attempt to store full HTML body in storage under deterministic id
            try {
                await this.uploadBody(documentId, normalizedContent, userId);
            } catch (err) {
                this.debugLog("[Appwrite:createPost] uploadBody failed", { err });
            }

            const normalizedPost = this.normalizePost(createdPost);
            this.debugLog("[Appwrite:createPost] Success", {
                postId: normalizedPost?.$id,
                featuredImage: normalizedPost?.featuredImage,
            });

            return normalizedPost;
        } catch (error) {
            console.error("[Appwrite:createPost] Failed", error);
            throw error;
        }
    }

    async updatePost(slug, { title, featuredImage, content, status, userId }) {
        try {
            const normalizedFeaturedImage = this.extractFileId(featuredImage);
            const normalizedContent =
                typeof content === "string"
                    ? content
                    : content == null
                    ? ""
                    : String(content);

            const truncatedContent =
                normalizedContent.length > 255
                    ? normalizedContent.slice(0, 255)
                    : normalizedContent;

            const payload = {
                title,
                [DATABASE_FEATURED_IMAGE_FIELD]: normalizedFeaturedImage,
                content: truncatedContent,
                status,
            };

            this.debugLog("[Appwrite:updatePost] Request payload", {
                postId: slug,
                imageField: DATABASE_FEATURED_IMAGE_FIELD,
                imageId: normalizedFeaturedImage,
                status,
            });

            

            const updatedPost = await this.databases.updateDocument({
                databaseId: conf.appwritedatabaseID,
                collectionId: conf.appwritecollectionID,
                documentId: slug,
                data: payload,
            });

            // attempt to store full HTML body in storage under deterministic id
            try {
                await this.uploadBody(slug, normalizedContent, userId);
            } catch (err) {
                this.debugLog("[Appwrite:updatePost] uploadBody failed", { err });
            }

            const normalizedPost = this.normalizePost(updatedPost);
            this.debugLog("[Appwrite:updatePost] Success", {
                postId: normalizedPost?.$id,
                featuredImage: normalizedPost?.featuredImage,
            });

            return normalizedPost;
        } catch (error) {
            console.error("[Appwrite:updatePost] Failed", error);
            throw error;
        }
    }

    async deletePost(slug) {
        try {
            await this.databases.deleteDocument({
                databaseId: conf.appwritedatabaseID,
                collectionId: conf.appwritecollectionID,
                documentId: slug,
            });

            return true;
        } catch (error) {
            console.error("[Appwrite:deletePost] Failed", error);
            return false;
        }
    }

    async getPost(slug) {
        try {
            const post = await this.databases.getDocument({
                databaseId: conf.appwritedatabaseID,
                collectionId: conf.appwritecollectionID,
                documentId: slug,
            });

            const normalizedPost = this.normalizePost(post);
            this.debugLog("[Appwrite:getPost] Loaded", {
                postId: normalizedPost?.$id,
                featuredImage: normalizedPost?.featuredImage,
            });

            return normalizedPost;
        } catch (error) {
            console.error("[Appwrite:getPost] Failed", error);
            throw error;
        }
    }

    async getPosts(queries = [Query.equal("status", "active")]) {
        try {
            const result = await this.databases.listDocuments({
                databaseId: conf.appwritedatabaseID,
                collectionId: conf.appwritecollectionID,
                queries,
            });

            return {
                ...result,
                documents: result.documents.map((post) => this.normalizePost(post)),
            };
        } catch (error) {
            console.error("[Appwrite:getPosts] Failed", error);
            throw error;
        }
    }

    async uploadFile(file, userId) {
        if (!userId) {
            throw new Error("You must be logged in to upload files");
        }

        if (!file) {
            throw new Error("No file selected for upload");
        }

        try {
            this.debugLog("[Appwrite:uploadFile] Start", {
                name: file.name,
                size: file.size,
                type: file.type,
                userId,
            });

            const uploaded = await this.bucket.createFile({
                bucketId: conf.appwritebucketID,
                fileId: ID.unique(),
                file,
                permissions: [
                    Permission.read(Role.any()),
                    Permission.write(Role.user(userId)),
                ],
            });

            this.debugLog("[Appwrite:uploadFile] Success", {
                fileId: uploaded?.$id,
                bucketId: conf.appwritebucketID,
            });
            return uploaded;
        } catch (error) {
            console.error("[Appwrite:uploadFile] Failed", {
                message: error?.message,
                code: error?.code,
                fullError: error,
            });

            if (
                error?.code === 401 &&
                String(error?.message || "").includes(
                    "No permissions provided for action 'create'"
                )
            ) {
                throw new Error(
                    "Storage upload blocked. Enable CREATE permission for users in Appwrite bucket settings.",
                    { cause: error }
                );
            }

            throw error;
        }
    }

    async deleteFile(fileId) {
        if (!fileId) return true;

        const normalizedFileId = this.extractFileId(fileId);

        try {
            await this.bucket.deleteFile({
                bucketId: conf.appwritebucketID,
                fileId: normalizedFileId,
            });

            return true;
        } catch (error) {
            if (
                error?.code === 404 ||
                String(error?.message || "").includes("could not be found")
            ) {
                return true;
            }

            console.error("[Appwrite:deleteFile] Failed", error);
            return false;
        }
    }

    async deletefile(fileId) {
        return this.deleteFile(fileId);
    }

    getFilePreview(fileRef) {
        const fileId = this.extractFileId(fileRef);
        if (!fileId) {
            this.debugLog("[Appwrite:getFilePreview] Missing file id", { fileRef });
            return "";
        }

        try {
            const view = this.bucket.getFileView({
                bucketId: conf.appwritebucketID,
                fileId,
            });

            const fileUrl = typeof view === "string" ? view : String(view || "");

            this.debugLog("[Appwrite:getFilePreview] View URL generated", {
                fileId,
                fileUrl,
            });

            return fileUrl;
        } catch (error) {
            console.error("[Appwrite:getFilePreview] Failed to build view URL", {
                fileRef,
                fileId,
                error,
            });
            return "";
        }
    }
}

const services = new Service();

export default services;
