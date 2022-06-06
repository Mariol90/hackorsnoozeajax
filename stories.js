"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story,showDeleteBtn = false) {
  // console.debug("generateStoryMarkup", story);
  
  const hostName = story.getHostName();
  const showStar = Boolean(currentUser);
  const loggedIn = currentUser ? true : false;
  let starIcon = '';
  let favClass = '';
  if (loggedIn) {
    starIcon = currentUser.isFavorite(story) ? '&starf;' : '&star;';
    favClass = currentUser.isFavorite(story) ? 'fav' : '';
  }
  
  return $(`
      <li id="${story.storyId}">
      ${showDeleteBtn ? getDeleteBtnHTML() : ""}
      ${showStar ? getStarHTML(story, currentUser) : ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

// getNewStory

 async function getNewStory(e){
   console.debug("getNewStory");
   e.preventDefault();
  //  get all val from the form and add a username and data
const title= $("#add-story-title").val();
const author= $("#add-story-author").val();
const url= $("#add-story-url").val();
const username= currentUser.username;
const data= {title, url, author, username };

const story = await storyList.addStory(currentUser, data);
// this will create a <li>
const $story = generateStoryMarkup(story);
// add the li to the form
$allStoriesList.prepend($story);

 }
 $submitForm.on("submit", getNewStory);

// getAndShowFavoritedStoriesOnStart

 function getAndShowFavoritedStoriesOnStart(user) {
  const userFavArr = user.favorites;
  // turn plain old story objects from API into instances of Story class
  const stories = userFavArr.map(story => new Story(story));
  // build an instance of our own class using the new array of stories
  storyList = new StoryList(stories);
  $storiesLoadingMsg.remove();
  putStoriesOnPage();
}

// getStarHTML

function getStarHTML(story, user) {
  const isFavorite = user.isFavorite(story);
  const starType = isFavorite ? "fas" : "far";
  return `
      <span class="star">
        <i class="${starType} fa-star"></i>
      </span>`;
}

// putFavoritesListOnPage

function putFavoritesListOnPage() {
  console.debug("putFavoritesListOnPage");

  $favoriteslist.empty();

  if (currentUser.favorites.length === 0) {
    $favoriteslist.append("<h5>No favorites added!</h5>");
  } else {
    // loop through all of users favorites and generate HTML for them
    for (let story of currentUser.favorites) {
      const $story = generateStoryMarkup(story);
      $favoriteslist.append($story);
    }
  }

  $favoriteslist.show();
}

// myowstorie
function putUserStoriesOnPage() {
  console.debug("putUserStoriesOnPage");

  $ownStories.empty();

  if (currentUser.ownStories.length === 0) {
    $ownStories.append("<h5>No stories added by user yet!</h5>");
  } else {
    // loop through all of users stories and generate HTML for them
    for (let story of currentUser.ownStories) {
      let $story = generateStoryMarkup(story, true);
      $ownStories.append($story);
    }
  }

  $ownStories.show();
}

// function updateFavorites

async function updateFavorites(evt) {
  const storyId = evt.target.dataset.storyid;

  const findStory = storyList.stories.find(story => story.storyId === storyId);

  if (evt.target.classList.contains('fav')) {
    await currentUser.unFavorite(findStory);
    evt.target.classList.toggle('fav');
    evt.target.innerHTML = '&star;';
  } else {
    await currentUser.favorite(findStory);
    evt.target.classList.toggle('fav');
    evt.target.innerHTML = '&starf;';
  }

}
/** Make delete button HTML for story */

function getDeleteBtnHTML() {
  return `
      <span class="trash-can">
        <i class="fas fa-trash-alt"></i>
      </span>`;
}


// function deleteStory

async function deleteStory(evt) {
  console.debug("deleteStory");

  const $closestLi = $(evt.target).closest("li");
  const storyId = $closestLi.attr("id");

  await storyList.removeStory(currentUser, storyId);

  // re-generate story list
  await putUserStoriesOnPage();
}

$ownStories.on("click", ".trash-can", deleteStory);

// function toggleStoryFavorite

async function toggleStoryFavorite(evt) {
  console.debug("toggleStoryFavorite");

  const $tgt = $(evt.target);
  const $closestLi = $tgt.closest("li");
  const storyId = $closestLi.attr("id");
  const story = storyList.stories.find(s => s.storyId === storyId);

  // see if the item is already favorited (checking by presence of star)
  if ($tgt.hasClass("fas")) {
    // currently a favorite: remove from user's fav list and change star
    await currentUser.removeFavorite(story);
    $tgt.closest("i").toggleClass("fas far");
  } else {
    // currently not a favorite: do the opposite
    await currentUser.addFavorite(story);
    $tgt.closest("i").toggleClass("fas far");
  }
}

$storiesLists.on("click", ".star", toggleStoryFavorite);