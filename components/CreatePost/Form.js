import React, { useEffect, useState } from "react";
import Data from "../../shared/Data";
import { useSession } from "next-auth/react";
import app from "./../../shared/FirebaseConfig";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import Toast from "../Toast";

function Form() {
    const [inputs, setInputs] = useState({});
    const [showToast, setShowToast] = useState(false);
    const [submit, setSubmit] = useState(false);
    const [imageURL, setImageURL] = useState("");

  
    const { data: session } = useSession();
    const db = getFirestore(app);
    
    useEffect(() => {
      if (session) {
        setInputs((values) => ({ ...values, userName: session.user?.name }));
        setInputs((values) => ({ ...values, email: session.user?.email }));
      }
    }, [session]);
  
    useEffect(()=>{
      if(submit==true)
      {
          savePost();
      }
  
    },[submit])

    const handleChange = (e) => {
      const name = e.target.name;
      const value = e.target.value;

      if (name === "date") {
        const dateStr = new Date(value).toLocaleDateString("en-GB");
        setInputs((values) => ({ ...values, [name]: dateStr }));
      } else {
        setInputs((values) => ({ ...values, [name]: value }));
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setInputs((values) => ({ ...values, image: imageURL }));
      setShowToast(true);
      setSubmit(true)
    };
  
    const savePost=async()=>{
      await setDoc(doc(db, "posts", Date.now().toString()), inputs);
    }

    return (
      <div className="mt-4">
        {showToast ? (
          <div className="absolute top-10 right-10">
            <Toast
              msg={"Post Created Successfully"}
              closeToast={() => setShowToast(false)}
            />
          </div>
        ) : null}
  
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Title"
            required
            onChange={handleChange}
            className="w-full mb-4 border-[1px] p-2 rounded-md text-black"
          />
          <textarea
            name="desc"
            className="w-full mb-4 
          outline-blue-400 border-[1px] 
          p-2 rounded-md text-black"
            required
            onChange={handleChange}
            placeholder="Write Description here"
          />
  
          <input
            type="date"
            name="date"
            required
            onChange={handleChange}
            className="w-full mb-4 border-[1px] p-2 rounded-md text-black"
          />
          <input
            type="text"
            placeholder="Location"
            name="location"
            required
            onChange={handleChange}
            className="w-full mb-4 border-[1px] p-2 rounded-md text-black"
          />
          <input
            type="text"
            placeholder="Zip"
            name="zip"
            required
            onChange={handleChange}
            className="w-full mb-4 border-[1px] p-2 rounded-md text-black"
          />
          <select
            name="game"
            onChange={handleChange}
            required
            className="w-full mb-4 border-[1px] p-2 rounded-md text-black"
          >
            <option disabled defaultValue>
              Select Game
            </option>
            {Data.GameList.map((item) => (
              <option key={item.id}>{item.name}</option>
            ))}
          </select>
          <input
            type="text"
            name="imageURL"
            placeholder="Paste Image URL from Imgur"
            onChange={(e) => setImageURL(e.target.value)}
            className="mb-5 border-[1px] w-full text-black"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 w-full p-1 
            rounded-md text-white"
          >
            Submit
          </button>
        </form>
      </div>
    );
}

export default Form