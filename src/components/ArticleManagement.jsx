import React, { useState } from 'react';
import StoryApi from '../api/StoryAPI';
import FileApi from '../api/FileAPI';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import CharacterLimitPlugin from './CharacterLimitPlugin.jsx';

function ArticleManagement() {
    const maxDescriptionLength = 500;
    const userId = sessionStorage.getItem("userId");

    const [storyData, setStoryData] = useState({
        title: '',
        documents: [],
        description: '',
        authorId: userId,
    });

    const [filePreviews, setFilePreviews] = useState([]);
    const [notification, setNotification] = useState({ message: '', type: '' });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'documents' && files.length > 0) {
            const fileArray = Array.from(files);
            setStoryData(prevState => ({
                ...prevState,
                documents: [...prevState.documents, ...fileArray]
            }));

            const previews = fileArray.map(file => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                return new Promise(resolve => {
                    reader.onloadend = () => {
                        resolve({ file, previewUrl: reader.result });
                    };
                });
            });

            Promise.all(previews).then(previewData => {
                setFilePreviews(prevPreviews => [...prevPreviews, ...previewData]);
            });
        } else {
            setStoryData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const stripHtml = (html) => {
        let doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const strippedDescription = stripHtml(storyData.description);

            const articleResponse = await StoryApi.createStory({
                title: storyData.title,
                description: strippedDescription,
                authorId: storyData.authorId,
            });

            const fileUploadPromises = storyData.documents.map(file => 
                FileApi.createFile(articleResponse.id, file)
            );

            await Promise.all(fileUploadPromises);

            console.log('Story created successfully:', articleResponse);
            setNotification({ message: 'Story created successfully!', type: 'success' });

            setStoryData({
                title: '',
                documents: [],
                description: '',
                authorId: userId,
            });
            setFilePreviews([]);

            const charCounter = document.querySelector('.char-counter');
            if (charCounter) {
                charCounter.textContent = `0/${maxDescriptionLength} Characters`;
            }
        } catch (error) {
            console.error('Error creating story:', error);
            setNotification({ message: 'Error creating story.', type: 'error' });
        }

        setTimeout(() => {
            setNotification({ message: '', type: '' });
        }, 3000);
    };

    const handleDeleteFile = (index) => {
        setStoryData(prevState => {
            const newDocuments = [...prevState.documents];
            newDocuments.splice(index, 1);
            return {
                ...prevState,
                documents: newDocuments
            };
        });

        setFilePreviews(prevPreviews => {
            const newPreviews = [...prevPreviews];
            newPreviews.splice(index, 1);
            return newPreviews;
        });
    };

    const renderFilePreviews = () => {
        return filePreviews.map((fileData, index) => (
            <div key={index} className="file-preview">
                {fileData.file.type.startsWith('image/') ? (
                    <img src={fileData.previewUrl} alt="file-preview" />
                ) : (
                    <a href={fileData.previewUrl}>{fileData.file.name}</a>
                )}
                <button type="button" onClick={() => handleDeleteFile(index)}>Delete</button>
            </div>
        ));
    };

    return (
        <div className="article-management-con">
            <h1>Story Creator</h1>

            <form onSubmit={handleSubmit} className="ArticleManagementForm">
                <div className="story-inputs-con">
                    <div className="input-con">
                        <i className="fas fa-envelope"></i>
                        <input type="text" name="title" id="Title" onChange={handleChange} required placeholder="Title" value={storyData.title} />
                    </div>
                </div>

                <div className="inside-article-form">
                    <div className="story-image-con">
                        <div className="image-con">
                            {renderFilePreviews()}
                        </div>
                        <div className="input-con">
                            <i className="fas fa-file"></i>
                            <input type="file" name="documents" id="documents" accept="image/jpeg , image/png, image/gif, image/webp" multiple onChange={handleChange} />
                        </div>
                    </div>

                    <div className="story-description-con">
                        <CKEditor
                            editor={ClassicEditor}
                            data={storyData.description}
                            onChange={(event, editor) => {
                                const data = editor.getData();
                                if (data.length <= maxDescriptionLength) {
                                    setStoryData(prevState => ({
                                        ...prevState,
                                        description: data
                                    }));
                                }
                            }}
                            plugins={[CharacterLimitPlugin]}
                            config={{
                                charLimit: maxDescriptionLength
                            }}
                        />
                    </div>
                </div>

                <button type="submit"><i className="fas fa-arrow-up"></i> Save <i className="fas fa-arrow-up"></i></button>
            </form>

            {notification.message && (
                <div className={`notification ${notification.type}`}>
                    {notification.message}
                </div>
            )}
        </div>
    );
}

export default ArticleManagement;
