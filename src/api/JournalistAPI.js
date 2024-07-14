import BASELINK from "./config";

const BASE_URL = `${BASELINK}journalists`;

const JournalistApi = {

    getUser: async (id) => {
        try {
            const response = await fetch(`${BASE_URL}/${id}`,{
                method: 'GET',
                headers: {'Authorization': `Bearer ${sessionStorage.getItem('jwtToken')}`}
            });
            if (!response.ok) {
                throw new Error('Failed to get user');
            }
            return response.json();
        } catch (error) {
            console.error(`Error getting user with id ${id}:`, error);
            throw error;
        }
    },

    createUser: async (newUser) => {
        try {
            const response = await fetch(BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newUser)
            });
            if (!response.ok) {
                throw new Error('Failed to register user');
            }
            return response.json();
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    },

    updateUser: async (id, updatedUser) => {
        try {
            const response = await fetch(`${BASE_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('jwtToken')}`
                },
                body: JSON.stringify(updatedUser)
            });
            if (!response.ok) {
                throw new Error('Failed to update user');
            }
        } catch (error) {
            console.error(`Error updating user with id ${id}:`, error);
            throw error;
        }
    },

    deleteUser: async (id) => {
        try {
            const response = await fetch(`${BASE_URL}/${id}`, {
                method: 'DELETE',
                headers:{
                    'Authorization': `Bearer ${sessionStorage.getItem('jwtToken')}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to delete user');
            }
        } catch (error) {
            console.error(`Error deleting user with id ${id}:`, error);
            throw error;
        }
    }
};

export default JournalistApi;
