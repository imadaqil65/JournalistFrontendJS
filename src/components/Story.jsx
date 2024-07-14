import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import StoryApi from '../api/StoryAPI';
import { BASE_URL } from '../api/FileAPI';
import JournalistApi from '../api/JournalistAPI';

function Story() {
    const [story, setStory] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();
    const [notification, setNotification] = useState({ message: '', type: '' });

    useEffect(() => {
        const fetchStoryDetails = async () => {
            try {
                // Fetch story details
                const response = await StoryApi.getStoryById(id);
                const fetchedStory = await response;

                // Fetch author details if authorId exists
                if (fetchedStory.authorId) {
                    try {
                        const authorResponse = await JournalistApi.getUser(fetchedStory.authorId);
                        fetchedStory.author = authorResponse.name; // Assuming 'name' field in author object
                    } catch (authorError) {
                        console.error(`Failed to fetch author for story ${id}:`, authorError);
                        fetchedStory.author = 'Unknown';
                    }
                } else {
                    console.warn(`Story ${id} is missing authorId.`);
                    fetchedStory.author = 'Unknown';
                }

                setStory(fetchedStory);
            } catch (fetchError) {
                console.error('Error fetching story:', fetchError);
            }
        };

        fetchStoryDetails();
    }, [id]);

    if (!story) {
        return <p>Loading story...</p>;
    }

    const handleDelete = async () => {
        try{
            const success = await StoryApi.deleteStoryById(id);
            if(success){
                console.log('success');
                setNotification({ message: 'Story deleted successfully!', type: 'success' });
                setTimeout(() => {
                    navigate('/stories');
                }, 3000);
            }
            else{
                console.log('failed')
                setNotification({ message: 'Error deleting story.', type: 'error' });
            }
        } catch (err){
            console.error('Error creating story:', error);
            setNotification({ message: 'Error deleting story.', type: 'error' });
        }
    }

    return (
        <div className="story-details">
            {story.files.map(image => (
                <img key={image.id} src={`${BASE_URL}/${image.id}`} alt={image.name} style={{margin:'0.25rem'}}/>
            ))}
            <h1>{story.title}</h1>
            <h3>Made by: {story.author}</h3>
            <p>{story.description}</p>
            <NavLink className='link-button' to={`/updatestory/${story.id}`}>Update Story</NavLink>
            <button onClick={handleDelete}>Delete Story</button>
            {notification.message && (
                <div className={`notification ${notification.type}`}>
                    {notification.message}
                </div>
            )}
        </div>
    );
}

export default Story;
