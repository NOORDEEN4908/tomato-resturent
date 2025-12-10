import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { StoreContext } from '../../context/StoreContext'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ProfileSetup.css'



const ProfileUpdate = ({ onComplete }) => {
const {url,token,setUserProfile,userProfile,setShowProfileSetup}=useContext(StoreContext);

const [formData,setFormData]=useState({
name:"",
email:"",
diet:"",
dislikes:[],
allergies:[]
})
useEffect(()=>{

if(userProfile){
    setFormData({

name:userProfile.name ||"",
email:userProfile.email||"",
diet:userProfile.diet||"",
allergies:userProfile.allergies ||[],
dislikes: userProfile.dislikes || []


    })
}
},[userProfile])

const [allergyInput,setAllergyInput]=useState("")
const[dislikeInput,setDislikeInput]=useState("")
const [loading,setLoading]=useState(false)


const dietOptions = [
    "normal",        // Regular Sri Lankan diet
    "vegetarian",    // Super common
    "vegan",         // Increasing but still simple
    "low-carb"       // Popular for fitness/weight control
  ];
  
  const onChangeHandler=(e)=>{
const name=e.target.name;
const value=e.target.value
setFormData(data=>({...data,[name]:value}))
}

const addAllergy=()=>{
const newAllergy=allergyInput.trim().toLowerCase(); //-- this is convet input to lover case --//
const existingAllergy=formData.allergies.map(a=>a.toLowerCase())


if(newAllergy&&!existingAllergy.includes(newAllergy)){
    setFormData(data=>({
...data,allergies:[...data.allergies,allergyInput.trim()]

}));
setAllergyInput("");//-- this is clear the input Box --//
}
}

 const removeAllergy=(allergy)=>{
const allergyToRemove=allergy.toLowerCase();

setFormData(data=>({
...data,allergies:data.allergies.filter(a=>a.toLowerCase()!==allergyToRemove)

}))
};


const addDislike=()=>{
const newDislike=dislikeInput.trim().toLowerCase();
const existingDislike=formData.dislikes.map(d=>d.toLowerCase())

if(newDislike &&!existingDislike.includes(newDislike)){
    setFormData(data=>({
...data,dislikes:[...data.dislikes,dislikeInput.trim()]



    }))
    setDislikeInput("")
}


}


const removeDislike=(dislike)=>{
const dislikesToRemove=dislike.toLowerCase();
setFormData(data=>({
...data,
dislikes:data.dislikes.filter(d=>d.toLowerCase()!==dislikesToRemove)

}))


}

const handleSubmit=async(e)=>{
e.preventDefault();

if(!formData.name||!formData.email||!formData.diet){

    toast.error("please Fill the All required Field")
    return
}

setLoading(true)
try {
const response=await axios.put(
url+"/api/user/profile",
formData,{headers:{token}}
);

if(response.data.success){
    setUserProfile(response.data.data);
    toast.success("Profile Save Successfully")
    if(onComplete)onComplete();
}else{
toast.error(response.data.message ||"Fail to save profile")
}

} catch (error) {
    console.log(error)
    toast.error("error saving profile .Try again")
    
}finally{
    setLoading(false)
}

}

const handleClose=()=>{

if(userProfile && userProfile.name&&userProfile.email&&userProfile.diet){
setShowProfileSetup(false)
if(onComplete){
    onComplete()
}

}


}

const isEditing=userProfile&&userProfile.name&&userProfile.email&&userProfile.diet







  return (
<div className='profile-setup-overlay'>
      <div className='profile-setup-container'>
        <div className="profile-setup-title">
          <div>
            <h2>{isEditing ? "Edit Your Profile" : "Complete Your Profile"}</h2>
            <p>{isEditing ? "Update your preferences" : "Help us personalize your food experience"}</p>
          </div>
          {isEditing && (
            <button onClick={handleClose} className="profile-setup-close">×</button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="profile-setup-form">
          <div className="profile-setup-input-group">
            <label>Name </label>
            <input
              name='name'
              onChange={onChangeHandler}
              value={formData.name}
              type="text"
              placeholder='Your name'
              required
            />
          </div>

          <div className="profile-setup-input-group">
            <label>Email </label>
            <input
              name='email'
              onChange={onChangeHandler}
              value={formData.email}
              type="email"
              placeholder='Your email'
              required
            />
          </div>

          <div className="profile-setup-input-group">
            <label>Preferred Diet </label>
            <select
              name='diet'
              onChange={onChangeHandler}
              value={formData.diet}
              required
            >
              <option value="">Select a diet</option>
              {dietOptions.map(option => (
                <option key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="profile-setup-input-group">
            <label>Allergies</label>
            <div className="profile-setup-tag-input">
            <input
  type="text"
  value={allergyInput}
  onChange={(e) => setAllergyInput(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addAllergy();
    }
  }}
  placeholder='Add an allergy (e.g., peanuts, dairy)'
/>

              <button type="button" onClick={addAllergy}>Add</button>
            </div>
            {formData.allergies.length > 0 && (
              <div className="profile-setup-tags">
                {formData.allergies.map((allergy, index) => (
                  <span key={index} className="profile-setup-tag">
                    {allergy}
                    <button
                      type="button"
                      onClick={() => removeAllergy(allergy)}
                      className="profile-setup-tag-remove"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="profile-setup-input-group">
            <label>Dislikes</label>
            <div className="profile-setup-tag-input">
              <input
                type="text"
                value={dislikeInput}
                onChange={(e) => setDislikeInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addDislike()
                  }
                }}
                placeholder='Add a dislike (e.g., spicy, seafood)'
              />
              <button type="button" onClick={addDislike}>Add</button>
            </div>
            {formData.dislikes.length > 0 && (
              <div className="profile-setup-tags">
                {formData.dislikes.map((dislike, index) => (
                  <span key={index} className="profile-setup-tag">
                    {dislike}
                    <button
                      type="button"
                      onClick={() => removeDislike(dislike)}
                      className="profile-setup-tag-remove"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <button type='submit' disabled={loading} className="profile-setup-submit">
            {loading ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ProfileUpdate