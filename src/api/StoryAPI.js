import BASELINK from "./config";

const BASE_URL = `${BASELINK}stories`;

const StoryApi = {
    createStory: async (newStory) => {
        const response = await fetch(BASE_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('jwtToken')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newStory)
        });

        if (!response.ok) {
            throw new Error('Failed to create story');
        }

        return response.json();
    },

    getAllStories: async () => {
        const response = await fetch(BASE_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch stories');
        }

        const stories = await response.json();
        const paginatedStories = paginateStories(stories, 8);

        return paginatedStories;
    },

    getAllStoriesByAuthor: async (id) => {
        const response = await fetch(`${BASE_URL}/author/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('jwtToken')}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch stories');
        }

        const stories = await response.json();
        const paginatedStories = paginateStories(stories, 8);

        return paginatedStories;
    },

    getStoryById: async (id) => {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('jwtToken')}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch story');
        }

        return response.json();
    },

    updateStory: async (id, updatedStory) => {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('jwtToken')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedStory)
        });

        if (!response.ok) {
            throw new Error('Failed to update story');
        }
    },

    deleteStoryById: async (id) => {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('jwtToken')}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to delete story');
        }

        return true;
    }
};

const paginateStories = (stories, pageSize) => {
    const paginatedArray = [];
    let currentPage = [];
    console.log(stories);
    
    stories.storyList.forEach((story, index) => {
        if (index > 0 && index % pageSize === 0) {
            paginatedArray.push(currentPage);
            currentPage = [];
        }
        currentPage.push(story);
    });

    // Push the last page
    if (currentPage.length > 0) {
        paginatedArray.push(currentPage);
    }

    return paginatedArray;
};

export default StoryApi;
