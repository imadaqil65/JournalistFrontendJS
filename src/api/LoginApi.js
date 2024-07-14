import { jwtDecode } from 'jwt-decode';
import BASELINK from './config';

const BASE_URL = `${BASELINK}tokens`;

const LoginApi = {
    checkUser: async (email, password) => {
        try {
            const response = await fetch(BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error('Incorrect credentials');
            }

            const data = await response.json();
            const token = data.accessToken;

            const decodedToken = jwtDecode(token);
            const id = decodedToken.userId;

            sessionStorage.setItem('jwtToken', token);
            sessionStorage.setItem('userId', id)

            return data;
        } catch (error) {
            console.error('Error logging in:', error);
            throw error;
        }
    },

    fetchProtectedResource: async () => {
        const token = sessionStorage.getItem('jwtToken');
        if (!token) {
            throw new Error('No token found');
        }

        try {
            const response = await fetch(`${BASE_URL}/protected-resource`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch protected resource');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching protected resource:', error);
            throw error;
        }
    },

    logout: () => {
        sessionStorage.removeItem('jwtToken');
        sessionStorage.removeItem('userRole');
    }
};

export default LoginApi;