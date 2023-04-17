import {css} from './githubCard.style.mjs';

 // Create template and set HTML and css and append it to shadow root
 const template = document.createElement('template');
 template.innerHTML = // html
 `<style>
     ${css}
 </style>
 <div class="card">
     <div class="header">
         <img class="github-logo" src="https://res.cloudinary.com/dea1xxcph/image/upload/v1681737467/pradeepthakur-lab/github_k4zn49.png" alt="Github logo">
     </div>
     <div class="content">
     </div>
 </div>`

export class GithubCard extends HTMLElement{
    constructor(){
        super();

        // Append template to shadow root
        this._shadowRoot = this.attachShadow({ mode: 'open' });
        this._shadowRoot.appendChild(template.content.cloneNode(true));
    }

   // Methods from parent class HTMLElement.
    static get observedAttributes() { 
        return ['data-width', 'data-theme']; 
    }

    attributeChangedCallback(name, oldUsername, newUsername){
        this[name] = newUsername;        
        this.render();
    }

    connectedCallback(){
        // mounted
        this.render();
    }

  

    createCard(){
        const header = this._shadowRoot.querySelector('.header');
        const content = this._shadowRoot.querySelector('.content');
        this.setHeight();

        const data = this.mainHeader;

        // set header
        header.innerHTML +=`
            <img class="github-logo" src="https://res.cloudinary.com/dea1xxcph/image/upload/v1681737467/pradeepthakur-lab/github_k4zn49.png" alt="Github logo">
            <img class="profile-pic" src="${data.avatar_url}" alt="${data.name} Github Profile">
            <div class="name-container">
                <span>${data.name}</span>
                <div class="view-profile-container">
                    <a target="_blank" class="view-profile-button" href="${data.html_url}">View Profile</a>
                </div>
            </div>
        `

        content.innerHTML = '';
        if(this.gitHubList.length === 0){ // IF no articles
            content.style.maxHeight = '0px';
            content.style.minHeight = '0px';
            return;
        }
    }

    setWidth() {
        this.style.width = this.dataset.width || '300px';
    }

    setHeight() {
        this._shadowRoot.querySelector('.content').style.maxHeight = this.dataset.contentheight || '300px';
    }

    // fetch repos list
    async fetchGithubData(){
        try{
            const res = await fetch('https://api.github.com/users/'+this.dataset.username);
            const data = await res.json();
            this.mainHeader = data; 
            
            if(data.message != "Not Found"){
                const response = await fetch('https://api.github.com/users/'+this.dataset.username+'/repos');
                const resData = await response.json();
                this.gitHubList = resData;                
                this.gitHubAllList.push(...this.gitHubList);
                this.createCard();
                this.renderDataList(this.gitHubAllList);
            }    
        } catch(error){
            console.log('error', error)
        }
        
    }

    // repos list
    renderDataList(AllDataList){
        for(let list of AllDataList){
            this._shadowRoot.querySelector('.content').innerHTML += /* html */`
                <a href="${list.html_url}" target="_blank" class="github-card">
                    <span class="title">${list.name}</span><br>
                    <div class="github-card-icon">
                        <img src="https://res.cloudinary.com/dea1xxcph/image/upload/v1681737421/pradeepthakur-lab/language_e0etep.png">
                        <span> ${list.language}</span>
                        &nbsp;&nbsp;
                    </div>
                </a>
            `;
        }
    }

    async render(){
        this.style.display = 'inline-block';
        this.mainHeader = [];
        this.gitHubList = [];
        this.gitHubAllList = [];
        this.sortby = this.dataset.sortby || 'date';
        this.limit = this.dataset.limit || 30;
        this.pageLimit = Math.ceil(this.limit / 30);
        this.setWidth();
        await this.fetchGithubData();

        // return Promise.all([
        //     fetch('https://api.github.com/users/'+this.dataset.username).then(value => value.json()),
        //     fetch('https://api.github.com/users/'+this.dataset.username+'/repos').then(value => value.json())
        //   ]).then((value) => {
        //         this.mainHeader = value[0]; 
        //         this.gitHubList = value[1];                
        //         this.gitHubAllList.push(...this.gitHubList);
        //         this.createCard();
        //         this.renderDataList(this.gitHubAllList);
        //   }).then(res => res.json())
        //   .catch((err) => {
        //       console.log(err);
        //   });

        // this.createCard();       
        
    }
}

customElements.define('github-widget', GithubCard);