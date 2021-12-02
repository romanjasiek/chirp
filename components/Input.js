import { CalendarIcon, ChartBarIcon, EmojiHappyIcon, PhotographIcon, XIcon } from '@heroicons/react/outline';
import 'emoji-mart/css/emoji-mart.css';
import { Picker } from 'emoji-mart';
import { db, storage } from '../firebase';
import {
    addDoc,
    collection,
    doc,
    serverTimestamp,
    updateDoc,
} from "@firebase/firestore";
import { getDownloadURL, ref, uploadString } from "@firebase/storage";
import { useSession } from "next-auth/react";
import { useRef, useState } from 'react';

const Input = () => {

    const { data: session } = useSession();

    const [input, setInput] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [showEmojis, setShowEmojis] = useState(false);
    const [loading, setLoading] = useState(false);
    const filePickerRef = useRef(null);

    const addImageToPost = (e) => {
        const reader = new FileReader();
        if (e.target.files[0]) {
            reader.readAsDataURL(e.target.files[0]);
        }

        reader.onload = (readerEvent) => {
            setSelectedFile(readerEvent.target.result);
        }
    }

    const addEmoji = (e) => {
        let sym = e.unified.split("-");
        let codesArray = [];
        sym.forEach((element) => codesArray.push("0x" + element));
        let emoji = String.fromCodePoint(...codesArray);
        setInput(input + emoji);
    };

    const sendPost = async () => {
        if (loading) return;
        setLoading(true);

        const docRef = await addDoc(collection(db, "posts"), {
          id: session.user.uid,
          username: session.user.name,
          userImg: session.user.image,
          tag: session.user.tag,
          text: input,
          timestamp: serverTimestamp(),
        });

        const imageRef = ref(storage, `posts/${docRef.id}/image`);

        if (selectedFile) {
            await uploadString(imageRef, selectedFile, "data_url").then(async () => {
                const downloadURL = await getDownloadURL(imageRef)
                await updateDoc(doc(db, "posts", docRef.id), {
                    image: downloadURL,
                });
            });
        }
    
    setLoading(false);
    setInput('');
    setSelectedFile(null);
    setShowEmojis(false);
    };

    return (
      <div
        className={`border-b border-[#666666] p-3 flex space-x-3 overflow-y-scroll ${loading && "opacity-60"}`}
      >
        <img
          src={session.user.image}
          alt={session.user.name}
          className="h-11 w-11 rounded-full cursor-pointer"
        />
        <div className="w-full divide-y divide-[#666666]">
          <div
            className={`${selectedFile && "pb-7"} ${input && "space-y-2.5"}`}
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows="2"
              className="bg-transparent outline-none text-[#FEFEFE] text-lg placeholder-[#888888] tracking-wide w-full min-h-[50px] resize-none"
              placeholder="What's going on?"
            />
            {selectedFile && (
              <div className="relative">
                <div
                  onClick={() => setSelectedFile(null)}
                  className="absolute w-8 h-8 bg-[#555666] hover:bg-[#666666] bg-opacity-75 rounded-full flex items-center justify-center top-1 left-1 cursor-pointer"
                >
                  <XIcon className="text-[#FEFEFE] h-5" />
                </div>
                <img
                  src={selectedFile}
                  alt=""
                  className="rounded-2xl max-h-80 object-contain"
                />
              </div>
            )}
          </div>

          {!loading && (
            <div className="flex items-center justify-between pt-2.5">
              <div className="flex items-center">
                <div
                  className="icon"
                  onClick={() => filePickerRef.current.click()}
                >
                  <PhotographIcon className="h-[22px] text-[#FEFEFE]" />
                  <input
                    type="file"
                    hidden
                    onChange={addImageToPost}
                    ref={filePickerRef}
                  />
                </div>

                <div className="icon rotate-90">
                  <ChartBarIcon className="h-[22px] text-[#FEFEFE]" />
                </div>

                <div
                  className="icon"
                  onClick={() => setShowEmojis(!showEmojis)}
                >
                  <EmojiHappyIcon className="h-[22px] text-[#FEFEFE]" />
                </div>

                <div className="icon">
                  <CalendarIcon className="h-[22px] text-[#FEFEFE]" />
                </div>

                {showEmojis && (
                  <Picker
                    onSelect={addEmoji}
                    set="apple"
                    style={{
                      position: "absolute",
                      marginTop: "465px",
                      marginLeft: -40,
                      maxWidth: "320px",
                      borderRadius: "20px",
                    }}
                    theme="dark"
                  />
                )}
              </div>
              <button
                className="hidden xl:inline ml-auto bg-[#E9C46A] text-[#FEFEFE] rounded-full w-56 h-[52px] text-lg font-bold shadow-md hover:bg-[#ccac5b] disabled:hover:bg-[#ccac5b] disabled:opacity-50 disabled:cursor-default"
                disabled={!input.trim() && !selectedFile}
                onClick={sendPost}
              >
                Chirp
              </button>
            </div>
          )}
        </div>
      </div>
    );
}

export default Input
