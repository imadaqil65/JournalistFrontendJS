import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StoryApi from '../api/StoryAPI';
import { BASE_URL as URL } from '../api/FileAPI';

function Stories() {
    const id = sessionStorage.getItem('userId');
    const [paginatedStories, setPaginatedStories] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStories = async () => {
            try {
                const paginatedStories = await StoryApi.getAllStoriesByAuthor(id);
                setPaginatedStories(paginatedStories);
                setLoading(false);
            } catch (error) {
                setError('Failed to fetch stories');
                console.error(error);
                setLoading(false);
            }
        };
        fetchStories();
    }, []);

    const handleNextPage = () => {
        if (currentPage < paginatedStories.length) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div className='story-error'>{error} Ensure that you are connected.</div>;
    }

    if (!paginatedStories || paginatedStories.length === 0) {
        return <div className='story-error'>No stories found.</div>;
    }

    return (
        <div className="main-stories-con">
            <div className="stories-con">
                {paginatedStories.length > 0 && paginatedStories[currentPage - 1].map(story => (
                    <div className="story" key={story.id}>
                        <Link to={`/story/${story.id}`} className="story-link">
                            {story.files.map(image => (
                                <img key={image.id} src={`${URL}/${image.id}`} alt={image.name} style={{display:'flex',flexWrap:'wrap' ,margin:'0.25rem', height:'10rem', width:'10rem', objectFit:'contain'}}/>
                            ))}
                                <div className="story-info">
                                <h1>{story.title}</h1>
                                <p>Made by: {story.author}</p>
                                <p>Description: {story.description}</p>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
            <div className="pagination">
                <button onClick={handlePrevPage} disabled={currentPage === 1}>Previous</button>
                <span>Page {currentPage} of {paginatedStories.length}</span>
                <button onClick={handleNextPage} disabled={currentPage === paginatedStories.length}>Next</button>
            </div>
        </div>
    );
}

export default Stories;
