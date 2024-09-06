import { Input } from "./ui/input";
import { Button } from "./ui/button";
import ReactPlayer  from "react-player";
import { useState } from "react";
import {  Loader2 } from "lucide-react";
import deepLogo from '../assets/Irujsl01.svg';

export const About = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [videoURL, setVideoURL] = useState(null);
  const [submitState, setSubmitState] = useState(null);
  const [mean_confidence, setMean] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const url = URL.createObjectURL(selectedFile);
        setVideoURL(url);

        setSubmitState(true);

        if (!selectedFile) {
            alert('Please select a video file.');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('file', selectedFile);

            const response = await fetch('http://localhost:8000/api/v1/mlapp/upload',  {
                method: "POST",
                body: formData
            });

            const data = await response.json();
            console.log(data);
            const {mean_confidence, cropped_images, playable_video } = data;

            setVideoURL(`http://localhost:8000/api/static/videos/${playable_video}`)
            setSubmitState(false);
            setMean(mean_confidence);
        } catch (error) {
            console.error('Error uploading video:', error);
        }
    };

  return (
    <section
      id="about"
      className="container py-24 sm:py-32 max-w-5xl"
    >
      <div className="bg-muted/50 border rounded-lg py-12 px-3">
        <div className="mx-auto max-w-2xl flex flex-col gap-4">
        <main className="text-lg md:text-3xl font-bold flex justify-center pb-5">
            <h2>
              Detect
              <span className="inline bg-gradient-to-r from-[#61DAFB] via-[#1fc0f1] to-[#03a3d7] text-transparent bg-clip-text">
              Deepfake
            </span>{" "}
           </h2> 
        </main>
        <div>
         {videoURL && 
          <ReactPlayer url={videoURL} controls></ReactPlayer>  
          
         }
        </div>
          <form onSubmit={handleSubmit}>
            
          <div className="flex gap-5 flex-col mx-auto max-w-md
          ">
            <Input type="file" onChange={handleFileChange} accept="video/*" />
            <Button type="submit" disabled={submitState}>
              {
                  !submitState  ? "Upload your video" :
                  <div className="flex gap-4 items-center">Uploading video 
                    <span><Loader2 className="animate-spin"/></span>
                  </div>
              }
            </Button>
          </div>
          </form>
            
            <div>
              {
              mean_confidence && (
                <>
                <h4>Result: { mean_confidence > 0.5 ? "Real": "Fake"} </h4>
                <h4>Confidence: {mean_confidence}</h4>
                </>
              )
              }
            </div>
        </div>
      </div>
    </section>
  );
};
