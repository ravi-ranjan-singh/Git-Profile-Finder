let metaInfo = {
    client_id:'51cc8de3899ee06c520d',
    client_secret :'c88f603d6f6232d61ceebcfead2c77ade62ba024',
    reposCount : 5,
    reposSort : 'created: asc',
}

let domStrings={
    userInput : document.querySelector('.user_input'),
    userDataDisplay:document.querySelector('.user'),
    repoDataDisplay:document.querySelector('#repos'),
    alertBox:document.querySelector('.alert'),
    loader:document.querySelector('.loader'),
}

String.prototype.trim = function () {
    return this.replace(/^\s*/, "").replace(/\s*$/, "");
}

async function fetchData(user) {   
    domStrings.loader.classList.remove('displayBox')
    let profileResponse = await fetch(`https://api.github.com/users/${user}?client_id=${metaInfo.client_id}&client_secret=${metaInfo.client_secret}`);
   
    let  repoResponse = await fetch(`https://api.github.com/users/${user}/repos?per_page=${metaInfo.reposCount}&sort=${metaInfo.reposSort}&client_id=${metaInfo.client_id}&client_secret=${metaInfo.client_secret}`);
    
    return {
        profileRes : await profileResponse.json(),
        repoResponse:await repoResponse.json(),
        status:profileResponse.status,
    }
   }


async function getData(e) {
  let user = e.target.value;
  removeDataFromUI()
  if(user.trim().length>0){
    apiData = await fetchData(user.trim());
    domStrings.loader.classList.add('displayBox');
    if(apiData.status===200)
    {
            addDataToUI(apiData);
    }
    else {
        domStrings.alertBox.classList.remove('displayBox');
    }
    

  }
    
}

function addDataToUI(data) {    
    
    let markupUser = `
        <div class="col-md-3 profile_img">
                            <img class="img-fluid mb-2" src="${data.profileRes.avatar_url}">
                            <a href="${data.profileRes.html_url}" target="_blank" class="btn btn-primary btn-block mb-4 mt-2">View Profile</a>
                    </div>

                    <div class="col-md-9 user_data">
                            <span class="badge badge-primary">Public Repos: ${data.profileRes.public_repos}</span>
                            <span class="badge badge-secondary">Public Gists: ${data.profileRes.public_gists}</span>
                            <span class="badge badge-success">Followers: ${data.profileRes.followers}</span>
                            <span class="badge badge-info">Following: ${data.profileRes.following}</span>
                            <br><br>
                            <ul class="data">
                              <li class="list-item"><strong>Company</strong> : ${data.profileRes.company}</li>
                              <li class="list-item"><strong>Website/Blog</strong> : ${data.profileRes.blog}</li>
                              <li class="list-item"><strong>Location</strong> : ${data.profileRes.location}</li>
                              <li class="list-item"><strong>Member Since</strong> : ${data.profileRes.created_at}</li>
                            </ul>
        </div> 
    `
    let markupRepos =``;
    data.repoResponse.forEach(repo => {
        markupRepos+=
        `<div class="card card-body mb-3 bg-dark">
        <div class="row">
            <div class="col-md-5">
                <a href="${repo.html_url}" target="_blank" class="text-white">${repo.name}</a>
            </div>
                      
            <div class="col-md-7">
                <span class="badge badge-primary">Stars: ${repo.stargazers_count}</span>
                <span class="badge badge-secondary">Watchers: ${repo.watchers_count}</span>
                <span class="badge badge-success">Forks: ${repo.forms_count===undefined?0:repo.forms_count}</span>
            </div>

        </div>

    </div>`
    });
    
    domStrings.userDataDisplay.insertAdjacentHTML('afterbegin',markupUser);
    domStrings.repoDataDisplay.insertAdjacentHTML('afterbegin',markupRepos);  
}

function removeDataFromUI() {
    domStrings.userDataDisplay.innerHTML=' ';
    domStrings.repoDataDisplay.innerHTML=' ';
    domStrings.alertBox.classList.add('displayBox')
}





domStrings.userInput.addEventListener('keyup',getData)

