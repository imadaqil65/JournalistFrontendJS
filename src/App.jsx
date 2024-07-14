import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Navbar from './layout/Nav';
import Footer from './layout/Footer';
import Home from './components/Home';
import Profile from './components/Profile';
import Login from './components/Login';
import Register from './components/Register';
import ArticleManagement from './components/ArticleManagement';
import Layout from './layout/Layout'; // Import your Layout component here
import Stories from "./components/Stories";
import Story from "./components/Story";
import UpdateStory from "./components/UpdateStory"; // Import UpdateStory component here
import './assets/css/style.css';
import './assets/css/responsives.css';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem('jwtToken');
        setIsAuthenticated(!!token);

        if (!isAuthenticated && !['/', '/login', '/register'].includes(window.location.pathname)) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        const timer = setTimeout(() => {
            document.body.classList.add('loaded');
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    const handleLogout = () => {
        sessionStorage.removeItem('jwtToken');
        setIsAuthenticated(false);
        window.location.href = '/';
    };

    return (
        <div className="App">
          <Layout>
                <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
                    <div className="contents loaded">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/articleManagement" element={<ArticleManagement />} />
                            <Route path="/updateStory/:id" element={<UpdateStory />} /> {/* Use UpdateStory component here */}
                            <Route path="/stories" element={<Stories />} />
                            <Route path="/story/:id" element={<Story />} />
                        </Routes>
                    </div>
          </Layout>
        </div>  
    );
}

export default App;

