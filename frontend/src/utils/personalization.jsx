export const allergenMap = {
  nut: ["nut", "peanut", "walnut", "cashew", "almond", "hazelnut"],
  dairy: ["milk", "cheese", "butter", "cream", "yogurt"],
  seafood: ["fish", "prawn", "crab", "lobster", "shrimp", "cuttlefish"],
  egg: ["egg"],
  gluten: ["wheat", "bread", "pasta", "cake", "flour", "cookie"],
};

export const dislikeMap = {
  seafood: ["fish", "prawn", "crab", "lobster", "shrimp", "cuttlefish"],
  spicy: ["spicy", "hot", "chili"],
  chicken: ["chicken"],
  beef: ["beef"],
  pork: ["pork"],
};


export const getAllergyKeywords=(allergies = [])=>{
const keywords=[];
allergies.forEach((a) => {
  const key=a.toLowerCase();
  if(allergenMap[key]) keywords.push(...allergenMap[key]);
  else keywords.push(key)
  
});
return keywords;

};


export const getDislikeKeywords=(dislikes =[])=>{

const keywords=[];
dislikes.forEach((d)=>{
const key=d.toLowerCase();
if (dislikeMap[key]) keywords.push(...dislikeMap[key]);
else keywords.push(key)

});
return keywords;
}


export const matchesKeyword = (text, keywords) => {
  if (!text || !Array.isArray(keywords)) return false;
  const t = text.toLowerCase();

  return keywords.some((W) => {
    const safe = W.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`\\b${safe}\\b`).test(t);
  });
};




export const filterFoodForUser=(foods,profile) =>{
if(!profile) return foods;

const allergyKeywords=getAllergyKeywords(profile.allergies || []);
const dislikeKeywords=getDislikeKeywords(profile.dislikes || [])


return foods.filter((item)=>{
const text = `${item.name} ${item.description || ""}`.toLowerCase();


//-- Block the alergies--//

if(matchesKeyword(text,allergyKeywords)) return false;
if(matchesKeyword (text,dislikeKeywords)) return false;


return true;

});
};

export const getNutritionMatchScore=(product,profile)=>{
if(!product || !profile) return 0;

const text=`${product.name} ${product.category || ""}`.toLowerCase();

//--Block Alergy --//

const allergyKeywords=getAllergyKeywords(profile.allergies ||[]);
if(matchesKeyword(text,allergyKeywords)) return -9999;


let score=0;


// check the diet match

if(profile.diet && text.includes(profile.diet.toLowerCase())){

score+=20;

}

const dislikeKeywords=getDislikeKeywords (profile.dislikes ||[]);

if(matchesKeyword(text,dislikeKeywords)){
  score-=15
}

return score


}

export const normalizeProductId = (p = {}) => p._id || p.id;



export const getSeasonFromDate = (date = new Date()) => {
  const m = date.getMonth();

  if (m === 2 || m === 3 || m === 4) return "summer";      // Mar–May
  if (m >= 5 && m <= 10) return "rainy";                   // Jun–Nov
  return "cool";                                           // Dec–Feb
};