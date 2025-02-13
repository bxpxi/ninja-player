import { doc, collection, deleteDoc, getDocs, getFirestore, query, where } from 'firebase/firestore'
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import app from '../../shared/FirebaseConfig'
import PostItem from '@/components/Home/PostItem'
import Toast from '@/components/Toast'

function Profile() {
  const [userPost,setUserPost]=useState([])
  const {data:session} = useSession()
  const [showToast, setShowToast] = useState(false)
  const db = getFirestore(app)

  useEffect(() => {
    getUserPost()
  },[session])

  const getUserPost=async () => {
    if(session?.user.email) {
        const q=query(collection(db,"posts"),where("email","==",session?.user.email))
        const querySnapshot = await getDocs(q)
        querySnapshot.forEach((doc) => {
            let data=doc.data()
            data.id=doc.id
            setUserPost(userPost=>[...userPost,data])
        })
    }
    
  }

  const onDeletePost = async (id) => {
    await deleteDoc(doc(db,"posts",id))
    showToast(true)
  }

  return (
    <div className='p-6 mt-8'>
        {showToast ? (
          <div className="absolute top-10 right-10">
            <Toast
              msg={"Post Deleted Successfully"}
              closeToast={() => setShowToast(false)}
            />
          </div>
        ) : null}
        <h2 className='text-[30px] font-extrabold text-blue-500'>Profile</h2>
        <p>Manage Your Post</p>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-5 px-10'>
            {userPost && userPost?.map((item) => (
                <div>
                    <PostItem post={item} modal={true}/>
                    <button onClick={() => onDeletePost(item.id)} className='bg-red-400 w-full rounded-md text-white'>Delete</button>
                </div>
            ))}
        </div>
    </div>
  )
}

export default Profile