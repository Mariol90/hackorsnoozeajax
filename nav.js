"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
  
}

$body.on("click", "#nav-all", navAllStories);

/** Show submit */
function navsubmitClk(evt){
  console.debug("navSubmitClick",evt);
  hidePageComponents();
  $submitForm.show();
}
$navsubmit.on('click',navsubmitClk);





// show fav stories

function navfavoritesclik(evt){
  console.debug("navfavoritesclik",evt);
  hidePageComponents();
  putFavoritesListOnPage();
  $favoriteslist.show();
}

$navfavorites.on("click",navfavoritesclik);

// show my stories

function mystoriesclick(evt){
  console.debug("mystoriesclick",evt);
  hidePageComponents();
  putUserStoriesOnPage();
  $ownStories.show();
  
 
}
$navmystories.on('click',mystoriesclick);


/** Show login/signup on click on "login" */


function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);


/** When a user first logins in, update the navbar to reflect that. */



function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
  $loginForm.hide();
  $signupForm.hide();
  $submitForm.hide();
  $navsubmit.show();
  $navfavorites.show();
  $navmystories.show();
  

}

