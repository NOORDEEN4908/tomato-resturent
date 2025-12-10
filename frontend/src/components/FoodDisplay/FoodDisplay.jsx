import React, { useContext } from 'react'
import"./FoodDisplay.css"
import { StoreContext } from '../../context/StoreContext'
import FoodItem from '../FoodItem/FoodItem'

const FoodDisplay = ({category}) => {

  const {food_list,getPersonalizedFoodList}= useContext(StoreContext)
  const displayList = getPersonalizedFoodList ? getPersonalizedFoodList(category) : food_list;
  return (
    <div className='food-display' id='food-display'>

        <h2>Top dishes near you</h2>

        <div className="food-display-list">
            {displayList.map((item,index)=>(
                <FoodItem
                  key={item._id || index}
                  id={item._id}
                  name={item.name}
                  description={item.description}
                  price={item.price}
                  image={item.image}
                />
            ))}
        </div>



    </div>
  )
}

export default FoodDisplay