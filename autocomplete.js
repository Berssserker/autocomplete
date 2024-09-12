const replies = document.querySelector('.replies');
const added = document.querySelector('.added');
const search = document.getElementsByClassName('search')[0];
let lastRequest;
let timeout = null;

function createReply(name) {   
        let reply = document.createElement('a')
        reply.classList.add('reply')
        reply.textContent = name.substring(name.indexOf('/') + 1)
        replies.appendChild(reply)
        reply.addEventListener('click', function() {
                for (let i of lastRequest) {
                    if (i.full_name === name) {
                        createAddedElement(i.name, i.owner.login, i.stargazers_count)
                        removeReply()
                        search.value = '';
                    }
                }
            });
  };

function removeReply() {
    if (replies.hasChildNodes()) {
        replies.replaceChildren()
    }
};

function createAddedElement(name, owner, stars) {
    let element = document.createElement('div')
    element.classList.add('added-element')
    let firstString = document.createElement('p')
    firstString.textContent = `Name: ${name}`
    let secondtString = document.createElement('p')
    secondtString.textContent = `Owner: ${owner}`
    let thirdtString = document.createElement('p')
    thirdtString.textContent = `Stars: ${stars}`
    let removeButton = document.createElement('div')
    removeButton.classList.add('remove')
    removeButton.addEventListener('click', function() {
        element.remove()
    });
    element.appendChild(firstString)
    element.appendChild(secondtString)
    element.appendChild(thirdtString)
    element.appendChild(removeButton)
    added.appendChild(element)
  };

function sendRequest(repoName) {
    removeReply()

    fetch(`https://api.github.com/search/repositories?q=${repoName}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })
    .then(response => response.json())
    .then(data => {
      lastRequest = []
        for (let i = 0; i < 5; i++) {
            createReply(data.items[i].full_name),
            lastRequest.push(data.items[i])
        }
        
    })  
    .catch(error => console.error('Error:', error));
  };

  search.addEventListener('input', function() {
    clearTimeout(timeout);
  
    timeout = setTimeout(function() {
      let repoName = search.value.trim();  
      if (repoName) {
        sendRequest(repoName); 
      } else {
        removeReply()  
      }
    }, 500);  
  });

