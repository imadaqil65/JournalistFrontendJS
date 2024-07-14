import React, { useEffect, useState } from 'react';
import ArticleApi from "../api/StoryAPI";
import FileApi from '../api/FileAPI';

function FileManagement() {
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('file', file);

        try {
            FileApi.createFile(formData);
            if (response.ok) {
                console.log('File uploaded successfully:', data);
                // Reset form field after successful submission
                setFile(null);
                e.target.reset();
            } else {
                console.error('Error uploading file:', data);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (

        <div className="fileManage-con">
            <form onSubmit={handleSubmit} className="FileForm">

                <label htmlFor="data">Document: </label>
                <input type="file" name="data" id="DocumentData" accept=".pdf,.doc,.docx,.mp4,.avi,.mov,.jpg,.jpeg,.png" onChange={handleFileChange} required />

                <button type="submit">Submit file</button>

            </form>
        </div>
        
    );
}

export default FileManagement;
