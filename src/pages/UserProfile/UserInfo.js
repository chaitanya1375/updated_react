import React from 'react';
import profileImage from '../../assets/images/faces/chai.JPG';
const UserInfo = () => (
  <div className="card card-user">
    <div className="image">
      <img src="https://ununsplash.imgix.net/photo-1431578500526-4d9613015464?fit=crop&amp;fm=jpg&amp;h=300&amp;q=75&amp;w=400" alt="..." />
    </div>
    <div className="content">
      <div className="author">
        
          <img className="avatar border-gray" src={profileImage} width="150" alt="chaitanya" />

          <h4 className="title">
            Chaitanya<br />
            <small></small>
          </h4>
        
      </div>
      <p className="description text-center">
         <br />
       
      </p>
    </div>
    <hr />
    <div className="text-center">
      <button href="#" className="btn btn-simple"><i className="fa fa-facebook-square"></i></button>
      <button href="#" className="btn btn-simple"><i className="fa fa-twitter"></i></button>
      <button href="#" className="btn btn-simple"><i className="fa fa-google-plus-square"></i></button>
    </div>
  </div>
);

export default UserInfo;