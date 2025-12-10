import { normalizeProductId } from "./personalization";

export const BUNDLE_THRESHOLD = 1500;

const buildProductLookup=(products=[])=>

products.reduce((acc,p)=>{
const id=normalizeProductId(p);
if(id) acc[id]=p;
return acc;

},{});

const deriveFrequentCombos=(pastOrders=[])=>{

const comboCounts={};

pastOrders.forEach((entry)=>{

    let normalizeItems = [];

    if (Array.isArray(entry)) {
      normalizeItems = entry;
    } else if (Array.isArray(entry?.products)) {
      normalizeItems = entry.products;
    } else if (typeof entry === "string" || typeof entry === "number") {
      normalizeItems = [entry];
    }
    
const items=normalizeItems.filter(Boolean);
if(items.length<2)return;

const key=[...new Set(items)].sort().join("|");
comboCounts[key]=(comboCounts[key]||0)+1



})

return Object.entries(comboCounts).filter(([,count])=>count>1)
.map(([key,count])=>({items:key.split("|"),count}))

};



const getActiveCartIds=(cartItems={})=>
    Object.keys(cartItems).filter((id)=>cartItems[id]>0);


const addTimeBasedRecommendations=({products,suggestions})=>{

const hour=new Date().getHours()
let mealType="";

if(hour>=6 && hour<11) mealType="breakfast";
else if(hour>=11 && hour<16) mealType="lunch";
else if(hour>=16 && hour<20) mealType="evening";
else mealType="dinner";

const picks = Array.isArray(products)
  ? products.filter((p) => p.tags?.includes(mealType))
  : [];

suggestions.push({
    id:"time-"+Date.now(),
    type:"time-based",
    title:`recommended for ${mealType}`,
    items:picks.slice(0,3).map((p)=>p.name),
});


};


export const getBundleSuggestions=({
cartItems,
pastOrders,
products,
cartTotal,
threshold=BUNDLE_THRESHOLD,
})=>{
    const productLookup=buildProductLookup(products);
    const combos= deriveFrequentCombos(pastOrders)
    const activeCartIds=getActiveCartIds(cartItems);

    const suggestions=[];

    combos.forEach((combo)=>{
const comboNames=combo.items.map((id)=>productLookup[id]?.name).filter(Boolean)


if(!comboNames.length) return;
const missing=combo.items.filter(id=>!activeCartIds.includes(id));
const presentCount=combo.items.length-missing.length;

if(presentCount <=1) return;



if(missing.length===0){
suggestions.push({

id:`combos ${combo.items.join("_")}`,
title:"combo already in your Cart",
items:comboNames,

note: `You ordered this combo ${combo.count} times.`,
});
}else if(missing.length < combo.items.length){
    suggestions.push({
        id:`complete ${combo.items.join("-")}`,
        title:"complete your Favorite combo",
        items: combo.items.map((id) => productLookup[id]?.name).filter(Boolean),

        missing:missing.map((id)=>productLookup[id]?.name),
        note:missing.length===1?"Add the missing food to recreate your favorite bundle":undefined,
})
}

});



if(cartTotal >=threshold &&combos.length){

const top=[...combos].sort((a,b)=>b.count -a.count)[0];
const comboNames=top.items.map((id)=>productLookup[id]?.name).filter(Boolean);


if(comboNames.length){

suggestions.unshift({
    id: `threshold-${top.items.join("-")}`,
    title: "High value bundle suggestion",
    items: comboNames,
    note: `Frequently ordered together (${top.count}x)`,
});
}
}

addTimeBasedRecommendations({ products, suggestions });

// return only top 3
return suggestions.slice(0, 3);

};
// Backwards-compat so Cart.jsx continues to work
export const buildBundleRecommendations = getBundleSuggestions;




   













