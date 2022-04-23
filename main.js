const food_api = "https://cdn.adpushup.com/reactTask.json";
const imgs = [
	"./images/istockphoto-1309437466-612x612.jpg",
	"./images/photo-1429554513019-6c61c19ffb7e.jfif",
	"./images/photo-1432139509613-5c4255815697.jfif",
	"./images/photo-1478145046317-39f10e56b5e9.jfif",
	"./images/istockphoto-1299079243-170667a.jpg",
	"./images/photo-1482049016688-2d3e1b311543.jfif",
	"./images/photo-1484723091739-30a097e8f929.jfif",
	"./images/photo-1496412705862-e0088f16f791.jfif",
	"./images/photo-1506084868230-bb9d95c24759.jfif",
	"./images/istockphoto-1284690585-170667a.jpg",
  ];
   
var listMenu = document.getElementById('listMenu');
var popularContainer = document.querySelector('.popular-restaurant');
var allContainer = document.querySelector('.all-restaurant');
var arr = [];
var categories = [];
var restaurents = [];
var exclusiveResturants = [];

fetch(food_api).then(res => res.json()).then(data => {
  arr.push(...data);
  arr.forEach(items => restaurents.push(...items.restaurantList))
  restaurents.forEach(res => res.isExlusive === true ? exclusiveResturants.push(res) : "");
  arr.push({category : "Only on swiggy" , restaurantList : exclusiveResturants});
  arr.forEach(item => categories.push(item.category));
  categories.push('See All')
  sideBarRendering(categories);
  arr.forEach(items => renderRestaurants(items))
});

function sideBarRendering(itemList){
 var item = itemList.map(list => {
   var url = list.split(" ").join("");
   return `<li><a href=#${url}>${list}</a></li>`
 }).join("");
  listMenu.innerHTML = item;
}


function renderRestaurants(items){
 const {category, restaurantList} = items;
 
 var url = category.split(" ").join("");
 let renderingNumber = restaurantList.length > 6 ? 5 : restaurantList.length;
 
 var container = document.createElement('div');
 container.setAttribute('id' , url);
 
 var heading = document.createElement('h2');
 heading.setAttribute('class' ,'title')
 
 heading.textContent = category;
 container.appendChild(heading);
	 for(var i=0; i<renderingNumber;i++){
		 var html = renderHTML(restaurantList[i], i);
		 container.appendChild(html);
	 }
	
   if(restaurantList.length > renderingNumber){
	   var addMoreRes = document.createElement('div');
	   addMoreRes.setAttribute('class' , 'more')
	   addMoreRes.textContent = restaurantList.length - renderingNumber + " +More";
	   addMoreRes.onclick = function(e){
		   var leftToRender = restaurantList.length - renderingNumber;
		   let nextToRender;
		   if(leftToRender > 7){
             nextToRender = 6;
			 this.textContent = leftToRender - nextToRender + "+More"
			}else{
				nextToRender = leftToRender;
				this.style.display = "none";
		   }
		   for(j=renderingNumber; j<renderingNumber + nextToRender;j++){
			   var moreRestaurants = renderHTML(restaurantList[j], j);
			   container.insertBefore(moreRestaurants , this);
		   }

		  renderingNumber = renderingNumber + nextToRender
	   }
	   container.appendChild(addMoreRes);
   }
 
   popularContainer.appendChild(container);
}


 // using event delegation to hightlight li 
let selectedLi;
listMenu.addEventListener('click', function(e){
	if(e.target.innerText == 'See All'){
		renderAllRestaurants();
		allContainer.style.display = "block"
		popularContainer.style.display = "none";
	}else{
		allContainer.style.display = "none"
		popularContainer.style.display = "block";

	}

	let aTagMenu = e.target.closest('a');
	if(!aTagMenu) return;
	if (!listMenu.contains(aTagMenu)) return; //
	highLightLi(aTagMenu);

})

function renderAllRestaurants(){
	allContainer.innerHTML = "";
	for(var i=0; i<restaurents.length;i++){
		var allRes = renderHTML(restaurents[i], i);
		allContainer.appendChild(allRes);
	}
}

function highLightLi(menu){
	if (selectedLi) { 
		selectedLi.classList.remove('highlight');
	  }
	  selectedLi = menu.parentElement;
	  selectedLi.classList.add('highlight');
}


function renderHTML(itemList, index) {
	const {name,isExlusive,food_types,ratings,delivery_time,price_for_two} = itemList;
	var div = document.createElement("div");
	div.setAttribute("class", "inline-element");
	div.innerHTML = `  <div class="parent">
					  <div class="recipe" data-target=${isExlusive}>
					  <div class="box">
					  <img src=${
						imgs[index]
					  } width="100%" height="120px" display="block"/>
					  <br>
					  <small class="recipe-name"><b>${name}</b></small>
					  <br>
					  <small>
					   ${
						food_types.length > 3
						? food_types.slice(1, 3).join(" ")
						:food_types
					  }</small>
					  <div class="food-info"> 
					  <small class="rating"> &#8902 ${
						ratings || 4.3
					  }</small>
					  <small class="deliver-time"> - ${
						delivery_time
					  }</small>
					  <small class="food-price">  - ₹${
						price_for_two
					  } For two </small>
					  </div>
					  <hr>
					  </div>
					  <div class="viwe"><b>Quick view</b></div>
					 </div>
					 </div>
					 </div>
					 </div>
					 `;
  
	return div;
  }

