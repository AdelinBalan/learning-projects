"use strict";

const usersContainer = document.querySelector(".users");
const btnSort = document.querySelector(".btn-sort-AZ");
const btnSortReverse = document.querySelector(".btn-sort-ZA");
const btnReset = document.querySelector(".btn-reset");

// html which renders users with respective information
const renderUsers = function (userData) {
  const html = `
                <div class="card card--bg">
                  <header class="card__header">
                    <img src="${userData.thumbnailUrl}" class="card__img" alt="">
                    <div>
                      <h3>${userData.name}</h3>
                      <p>${userData.username}</p>
                    </div>
                  </header>
                  <p class="card__details">
                    Contact:
                    <p><strong>Email:</strong> ${userData.email} </p> 
                    <p><strong>Phone:</strong> ${userData.phone}</p>
                  </p>
                  <p class="card__details">
                    Address:
                    <p><strong>Street:</strong> ${userData.address.street}
                    <p><strong>Apartment:</strong> ${userData.address.suite}</p>
                    <p><strong>City:</strong> ${userData.address.city}</p>
                    <p><strong>Zipcode:</strong> ${userData.address.zipcode}</p>
                  </p>
                  <p class="card__details">
                    Company:
                    <p><strong>Name:</strong> ${userData.company.name}</p>
                    <p><strong>Slogan:</strong> ${userData.company.catchPhrase}</p>
                    <p><strong>Business:</strong> ${userData.company.bs}</p>
                  </p>
                  <div>
                    <a class="btn-website" href="${userData.website}"><span>Go To Website</span></a>
                  </div>
                </div>
          `;
  usersContainer.insertAdjacentHTML("beforeend", html);
};

// render errors
const renderError = function (msg) {
  usersContainer.insertAdjacentText("beforeend", msg);
};

// need to use with fetch() in the init() function
const getJSON = function (url, errorMsg = "Something went wrong") {
  return fetch(url).then((response) => {
    if (!response.ok) throw new Error(`${errorMsg} (${response.status})`);

    return response.json();
  });
};

// render users after sorting the list
const reRenderUsers = function(list) {
  usersContainer.innerHTML = "";
  list.map((user) => renderUsers(user));
}
 
// function that retrieves and manages data, then renders it
// also adds eventlisteners on buttons (I have a feeling it's not ideal to do that inside this function)
const init = function () {
  getJSON(`https://jsonplaceholder.typicode.com/users`, "User list not found")
    .then((resp) => {
      getJSON(
        `https://jsonplaceholder.typicode.com/photos`,
        `Image list not found`
      ).then((res) => {
        // loops through user list and adds thumbnailUrl property from the photos list,
        // based on the ID (would've needed to specify albumId if pictures were real)
        resp.map((user) => {
          for (let i = 0; i < resp.length; i++) {
            if (res[i].id === resp[i].id)
              resp[i].thumbnailUrl = res[i].thumbnailUrl;
          }
          renderUsers(user);
        });
        // sorting and rendering 
        btnSort.addEventListener("click", function () {
          resp.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));
          reRenderUsers(resp);
        });
        btnSortReverse.addEventListener("click", function () {
          resp.sort((a, b) => (a.name > b.name ? -1 : b.name > a.name ? 1 : 0));
          reRenderUsers(resp);
        });
        btnReset.addEventListener("click", function () {
          resp.sort((a, b) => (a.id < b.id ? -1 : b.id < a.id ? 1 : 0));
          reRenderUsers(resp);
        });
      });
    })
    .catch((err) => {
      console.error(`${err}`);
      renderError(`Something went wrong :( ${err.message}. Try again!`);
    });
};

init();

// VScode generated async function based on previously written fn
// const getJSON = async function (url, errorMsg = 'Something went wrong') {
//   const response = await fetch(url);
//   if (!response.ok)
//     throw new Error(`${errorMsg} (${response.status})`);
//   return await response.json();
// };

// Version with XMLHttprequest 
// const getUserData = function() {
//   const request = new XMLHttpRequest();
//   request.open('GET', `https://jsonplaceholder.typicode.com/users`);
//   request.send();

//   request.addEventListener('load', function(e) {
//     e.preventDefault();
//     const [...userData] = JSON.parse(this.responseText);

//     const request2 = new XMLHttpRequest();
//     request2.open('GET', `https://jsonplaceholder.typicode.com/photos`);
//     request2.send();

//     request2.addEventListener('load', function() {

//       const [...imgData] = JSON.parse(this.responseText).slice(0, 10);
//       console.log(imgData);
//       console.log(userData);

//       userData.map( user =>
//         {
//           for (let i = 0; i < imgData.length; i++)
//           {
//             if (user.id === imgData[i].id)
//             user.thumbnailUrl = imgData[i].thumbnailUrl
//           }
//           renderUsers(user)
//         })
//     });

//     // return userData;
//   });
// };
// const users = getUserData();
// console.log(users)

