import React, { useContext, useState } from 'react';
import './Profile.css';
import { StoreContext } from '../../context/StoreContext';
import ProfileSetup from '../../components/ProfileSetup/ProfileUpdate';

const formatDate = (value) => {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleString();
  } catch (error) {
    return value;
  }
};

const Profile = () => {
  const { userProfile, setShowProfileSetup, showProfileSetup } = useContext(StoreContext);
  const [isEditing, setIsEditing] = useState(false);
  const orders = userProfile?.pastOrders || [];

  const handleEditClick = () => {
    setIsEditing(true);
    setShowProfileSetup(true);
  };

  const handleProfileComplete = () => {
    setIsEditing(false);
  };

  if (!userProfile) {
    return (
      <div className='profile-page'>
        <div className='profile-card'>
          <h2>Please log in to view your profile</h2>
        </div>
      </div>
    );
  }

  return (
    <div className='profile-page'>
      {showProfileSetup && (
        <ProfileSetup onComplete={handleProfileComplete} />
      )}
      
      <div className='profile-card'>
        <div className='profile-card-header'>
          <h2>Account Overview</h2>
          <button onClick={handleEditClick} className='profile-edit-button'>
            Edit Profile
          </button>
        </div>
        <div className='profile-field'>
          <span>Name</span>
          <p>{userProfile.name || "Not set"}</p>
        </div>
        <div className='profile-field'>
          <span>Email</span>
          <p>{userProfile.email || "Not set"}</p>
        </div>
        <div className='profile-field'>
          <span>Preferred diet</span>
          <p>{userProfile.diet || "Not set"}</p>
        </div>
        {userProfile.allergies && userProfile.allergies.length > 0 && (
          <div className='profile-field'>
            <span>Allergies</span>
            <div className='profile-tags'>
              {userProfile.allergies.map((allergy, index) => (
                <span key={index} className='profile-tag'>{allergy}</span>
              ))}
            </div>
          </div>
        )}
        {userProfile.dislikes && userProfile.dislikes.length > 0 && (
          <div className='profile-field'>
            <span>Dislikes</span>
            <div className='profile-tags'>
              {userProfile.dislikes.map((dislike, index) => (
                <span key={index} className='profile-tag'>{dislike}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className='profile-history'>
        <h3>Order history</h3>
        {orders.length === 0 ? (
          <p className='profile-empty'>You have not placed any orders yet.</p>
        ) : (
          orders
            .slice()
            .reverse()
            .map((order) => (
              <div className='profile-history-row' key={order.orderId}>
                <div>
                  <p className='profile-history-label'>Order</p>
                  <p className='profile-history-value'>#{order.orderId?.slice(-6)}</p>
                </div>
                <div>
                  <p className='profile-history-label'>Items</p>
                  <p className='profile-history-value'>{order.itemCount || order.products?.length || 0}</p>
                </div>
                <div>
                  <p className='profile-history-label'>Amount</p>
                  <p className='profile-history-value'>${order.amount?.toFixed(2) ?? '0.00'}</p>
                </div>
                <div>
                  <p className='profile-history-label'>Placed</p>
                  <p className='profile-history-value'>{formatDate(order.date)}</p>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default Profile;

