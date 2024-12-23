const bookmarkImgURL = chrome.runtime.getURL('assets/bookmark.png');
const AZ_PROBLEM_KEY="AZ_PROBLEM_KEY";
window.addEventListener("load",addBookmarkButton);

function addBookmarkButton()
{
const bookmarkButton = document.createElement('img');
bookmarkButton.id = "add-bookmark-button";
bookmarkButton.src= bookmarkImgURL;
bookmarkButton.style.height = "30px"; 
bookmarkButton.style.width = "30px"; 

const askDoubtButton=document.getElementsByClassName("coding_ask_doubt_button__FjwXJ")[0];
askDoubtButton.parentNode.insertAdjacentElement("afterend",bookmarkButton);

bookmarkButton.addEventListener("click", addNewBookmarkHandler);
};

async function addNewBookmarkHandler()
{
    const currentBookmarks= await getCurrentBookmarks();
    const azProblemUrl= window.location.href;
    const uniqueId= extractProblemId(azProblemUrl);
    const problemName= document.getElementsByClassName("Header_resource_heading__cpRp1")[0].innerText;

    if(currentBookmarks.some((bookmark) => bookmark.id === uniqueId)) return ;

    const bookmarkObj={
        id:uniqueId,
        name:problemName,
        url:azProblemUrl
  }

  const updatedBookmarks = [...currentBookmarks,bookmarkObj];

  chrome.storage.sync.set({AZ_PROBLEM_KEY:updatedBookmarks},()=>{
    console.log("Updated the bookmarks correctly to",updatedBookmarks);
  })
}

 function extractProblemId(url) {
    
    const startIndex = url.indexOf("problems/") + "problems/".length; 
    const endIndex = url.indexOf("?", startIndex);
    return endIndex === -1 ? url.substring(startIndex) : url.substring(startIndex, endIndex);
}

function getCurrentBookmarks()
{   return new Promise((resolve,reject) =>{
    chrome.storage.sync.get([AZ_PROBLEM_KEY],(results) =>{
         resolve(results[AZ_PROBLEM_KEY] || []);
    });
});
}
