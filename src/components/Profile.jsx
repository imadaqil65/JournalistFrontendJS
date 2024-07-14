import React, { useState, useEffect } from 'react';
import reactLogo from '../assets/image/react.svg';

function Profile(){
    
    

    return(
        <div className="profile-con">

            <h1>Profile</h1>


            <div className="inside-profile-con">

                

                <div className="profile-info-con">

                    <div className="profile">

                        <img src={reactLogo} alt="profile-image" />
                        <p>Email: jhon@hotmail.com</p>
                        <p>Birthdate: 20-09-1980</p>

                        {/* <button id="Change" type="button">Change</button> */}
                    </div>


                </div>



                <form className="ProfileForm" action="#">

                    <div className="input-con">
                        <i className='fas fa-user'></i>
                        <input type="text" id="firstName" name="firstname" required placeholder='First Name'/>
                    </div>

                    <div className="input-con">
                        <i className='fas fa-user'></i>
                        <input type="text" id="lastName" name="lastname" required placeholder='Last Name'/>
                    </div>

                    <div className="input-con">
                        <i className='fas fa-envelope'></i>
                        <input type="email" id="email" name="email" required placeholder='Email'/>
                    </div>

                    <div className="input-con">
                        <i className='fas fa-lock'></i>
                        <input type="password" id="password" name="password" required placeholder='Password'/>
                    </div>

                    <div className="input-con">
                        <i className='fas fa-calendar'></i>
                        <input type="date" id="birthday" name="birthday" required />
                    </div>

                    <button id="Cancel" type="button">Cancel</button>

                    <button id="Save" type="submit">Save</button>

                </form>

            </div>

        </div>

    );
}

export default Profile;