import React from "react";
import { Link } from "react-router-dom";

function Home() {
    return (
        <div className="main-home-con">
            <div className="home-con">
                <div className="welcome-con">
                    <h1>Welcome to Journalism.nl</h1>
                </div>
            </div>

            {/* <div className="news-con">
                <div>
                    <h1>Explore Stories</h1>
                </div>

                <div className="all-news-con">
                    <Link to="/stories">View All Stories</Link>
                </div>
            </div> */}
        </div>
    );
}

export default Home;
