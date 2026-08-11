"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { posts as seedPosts } from "../data/posts";

export type Post = {
  slug: string;
  title: string;
  date: string;
  image: string;
  summary: string;
  content: string;
  category: string;
  isUserPost?: boolean;
};

type PostsContextType = {
  posts: Post[];
  addPost: (post: Omit<Post, "slug" | "date">) => void;
  deletePost: (slug: string) => void;
};

const PostsContext = createContext<PostsContextType | undefined>(undefined);

export function PostsProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = useState<Post[]>(seedPosts);

  // Load any user-created posts from localStorage and merge with seed posts
  useEffect(() => {
    const saved = localStorage.getItem("userPosts");
    if (saved) {
      try {
        const userPosts: Post[] = JSON.parse(saved);
        setPosts([...seedPosts, ...userPosts]);
      } catch (error) {
        console.error("Failed to parse saved posts:", error);
      }
    }
  }, []);

  const addPost = (newPost: Omit<Post, "slug" | "date">) => {
    const slug = newPost.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const date = new Date().toISOString().split("T")[0];

    const fullPost: Post = { ...newPost, slug, date, isUserPost: true };

    const updated = [...posts, fullPost];
    setPosts(updated);

    const userPosts = updated.slice(seedPosts.length);
    localStorage.setItem("userPosts", JSON.stringify(userPosts));
  };

  const deletePost = (slug: string) => {
    const updated = posts.filter((p) => p.slug !== slug);
    setPosts(updated);

    const userPosts = updated.slice(seedPosts.length);
    localStorage.setItem("userPosts", JSON.stringify(userPosts));
  };

  return (
    <PostsContext.Provider value={{ posts, addPost, deletePost }}>
      {children}
    </PostsContext.Provider>
  );
}

export function usePosts() {
  const context = useContext(PostsContext);
  if (!context) {
    throw new Error("usePosts must be used inside PostsProvider");
  }
  return context;
}