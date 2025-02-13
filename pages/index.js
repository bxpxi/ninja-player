import GameList from "@/components/Home/GameList";
import Hero from "@/components/Home/Hero";
import Search from "@/components/Home/Search";
import app from "../shared/FirebaseConfig"
import { getFirestore, doc, setDoc, getDoc, collection, getDocs, query, where } from "firebase/firestore"
import { useEffect, useState } from "react";
import Posts from "@/components/Home/Posts";

export default function Home() {
  const db = getFirestore(app)
  const [posts,setPosts] = useState([])
  const [filteredPosts, setFilteredPosts] = useState([])

  useEffect(() => {
    getPost();
  },[])

  const getPost = async()=>{
    const querySnapshot = await getDocs(collection(db, "posts"));
    querySnapshot.forEach((doc) => {
      setPosts(posts=>[...posts,doc.data()])
    });
    querySnapshot.forEach((doc) => {
      setFilteredPosts(posts=>[...posts,doc.data()])
    });
  }

  return (
    <div className="px-5 sm:px-7 md:px-10 mt-9">
      <Hero />
      <Search posts={posts} setFilteredPosts={setFilteredPosts}/>
      <GameList />
      {filteredPosts ? <Posts posts={filteredPosts} /> : null}
    </div>
  );
}
