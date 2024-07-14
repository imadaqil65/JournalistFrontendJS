import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StoryApi from '../api/StoryAPI';
import FileApi from '../api/FileAPI';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import CharacterLimitPlugin from './CharacterLimitPlugin.jsx';

const BASE_URL = "http://localhost:8080/files"; // Replace with your actual base URL

function UpdateStory() {
    const { id } = useParams();
    const navigate = useNavigate();
    const maxDescriptionLength = 500;

    const [storyData, setStoryData] = useState({
        title: '',
        documents: [],
        description: '',
    });

    const [filePreviews, setFilePreviews] = useState([]);
    const [notification, setNotification] = useState({ message: '', type: '' });

    useEffect(() => {
        const fetchStory = async () => {
            try {
                const story = await StoryApi.getStoryById(id);
                setStoryData({
                    title: story.title,
                    description: story.description,
                    documents: [],
                });

                const previews = story.files.map(file => ({
                    id: file.id,
                    name: file.name,
                    previewUrl: `${BASE_URL}/${file.id}`,
                }));

                setFilePreviews(previews);
            } catch (error) {
                console.error('Error fetching story:', error);
                setNotification({ message: 'Error fetching story.', type: 'error' });
            }
        };

        fetchStory();
    }, [id]);

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

            const updatedStory = {
                title: storyData.title,
                description: strippedDescription,
            };

            await StoryApi.updateStory(id, updatedStory);

            const newFiles = storyData.documents.filter(doc => !doc.id);
            if (newFiles.length > 0) {
                const fileUploadPromises = newFiles.map(file => 
                    FileApi.createFile(id, file)
                );
                await Promise.all(fileUploadPromises);
            }

            console.log('Story updated successfully');
            setNotification({ message: 'Story updated successfully!', type: 'success' });

            setTimeout(() => {
                navigate('/stories');
            }, 3000);
        } catch (error) {
            console.error('Error updating story:', error);
            setNotification({ message: 'Error updating story.', type: 'error' });
        }

        setTimeout(() => {
            setNotification({ message: '', type: '' });
        }, 3000); // Clear notification after 3 seconds
    };

    const handleDeleteFile = async (index, id = null) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this file?");
        if (!confirmDelete) return;

        try {
            if (id) {
                await FileApi.deleteFileById(id);
            }

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

            setNotification({ message: 'File deleted successfully!', type: 'success' });
        } catch (error) {
            console.error(`Error deleting file with ID ${id}:`, error);
            setNotification({ message: 'Error deleting file.', type: 'error' });
        }

        setTimeout(() => {
            setNotification({ message: '', type: '' });
        }, 3000);
    };

    const renderFilePreviews = () => {
        return filePreviews.map((fileData, index) => (
            <div key={index} className="file-preview">
                {fileData.file ? (
                    <img src={fileData.previewUrl} alt="file-preview" style={{ margin: '0.25rem' }} />
                ) : (
                    <img src={fileData.previewUrl} alt={fileData.name} style={{ margin: '0.25rem' }} />
                )}
                <button type="button" onClick={() => handleDeleteFile(index, fileData.id)}>Delete</button>
            </div>
        ));
    };

    return (
        <div className="article-management-con">
            <h1>Update Story</h1>

            {notification.message && (
                <div className={`notification ${notification.type}`}>
                    {notification.message}
                </div>
            )}

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
                            <input type="file" name="documents" id="documents" accept=".jpg,.jpeg,.png" multiple onChange={handleChange} />
                        </div>
                    </div>

                    <div className="story-description-con">
                        <CKEditor
                            editor={ClassicEditor}
                            data={storyData.description}
                            onChange={(event, editor) => {
                                const data = editor.getData();
                                if (stripHtml(data).length <= maxDescriptionLength) {
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
                        <div className="char-counter">
                            {stripHtml(storyData.description).length}/{maxDescriptionLength} Characters
                        </div>
                    </div>
                </div>

                <button type="submit"><i className="fas fa-arrow-up"></i> Save <i className="fas fa-arrow-up"></i></button>
            </form>
        </div>
    );
}

export default UpdateStory;
