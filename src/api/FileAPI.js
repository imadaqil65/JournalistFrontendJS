import BASELINK from "./config";

const BASE_URL = `${BASELINK}files`;

const FileApi = {
    createFile: async (articleId, newFile) => {
        const formData = new FormData();
        formData.append('file', newFile);

        try {
            const response = await fetch(`${BASE_URL}/upload/${articleId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('jwtToken')}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to upload file');
            }

            return response.json();
        } catch (error) {
            console.error('Error creating file:', error);
            throw error;
        }
    },

    getFile: () => {
        return BASE_URL
    },

    getFileDetails: () => {

    },

    deleteFileById: async (fileId) => {
        try {
            const response = await fetch(`${BASE_URL}/${fileId}`, {
                method: 'DELETE',
                headers: {'Authorization': `Bearer ${sessionStorage.getItem('jwtToken')}`}
            });

            if (!response.ok) {
                throw new Error('Failed to delete file');
            }
        } catch (error) {
            console.error(`Error deleting file with ID ${fileId}:`, error);
            throw error;
        }
    }

};

export default FileApi;
export { BASE_URL };
