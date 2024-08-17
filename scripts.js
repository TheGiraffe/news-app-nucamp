const apiKey = process.env.NEWS_API_KEY;
const url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`;
let sources = [[],[]];
const newsDiv = document.getElementById("news");
const srcDiv = document.getElementById("srcFilter");
const clrBtn = document.createElement("button");

async function fetchNews(){
    try{
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
        displayNews(data.articles);
        clrBtn.innerText = "Clear Filters";
        clrBtn.addEventListener("click", () => filterNews("all_sources", data.articles, event));
        srcDiv.appendChild(clrBtn);
    }catch(error){
        console.error("There was an error!", error);
    }
}

function displayNews(articles){

    for (article of articles){
        
        if (sources[0].includes(article.author)){
            const index = sources[0].indexOf(article.author);
            sources[1][index].push(article);

        }else{
            sources[0].push(article.author);
            sources[1].push([article]);
            const srcBtn = document.createElement("button");
            const source = article.author
            srcBtn.innerText = source;
            srcBtn.addEventListener("click", () => filterNews(source, articles, event));
            srcBtn.style.backgroundColor = generateRandomColor();
            srcDiv.appendChild(srcBtn);
            adjustFontColor(srcBtn);
        }

        const articleDiv = document.createElement("div");
        articleDiv.classList.add("articleDiv");

        const articleLink = document.createElement("a");
        articleLink.href = article.url;

        const articleNumber = document.createElement("h1");
        articleNumber.textContent = articles.indexOf(article) + 1;
        articleLink.appendChild(articleNumber);

        const articleTitle = document.createElement("h3");
        articleTitle.textContent = article.title;
        articleLink.appendChild(articleTitle);

        const articleDesc = document.createElement("p");
        articleDesc.textContent = article.description;
        articleLink.appendChild(articleDesc);

        articleDiv.appendChild(articleLink);

        articleDiv.addEventListener("mouseover", changeArticleDivStyle);
        articleDiv.addEventListener("mouseout", revertArticleDivStyle);

        newsDiv.appendChild(articleDiv);
    }

}

function changeArticleDivStyle(event){
    const articleDiv = event.currentTarget;
    articleDiv.style.backgroundColor = "#a04bb5";
    articleDiv.style.transition = "0.5s";
    const linkText = articleDiv.getElementsByTagName("a")[0];
    linkText.style.color = "#dee119";
    const articleNumber = articleDiv.getElementsByTagName("h1")[0];
    articleNumber.style.color = "#9bd2cd";
    articleNumber.style.fontSize = "5rem";
}

function revertArticleDivStyle(event){
    const articleDiv = event.currentTarget;
    articleDiv.style.backgroundColor = "#9bd2cd";
    articleDiv.style.transition = "0.5s";
    const linkText = articleDiv.getElementsByTagName("a")[0];
    linkText.style.color = "#6184b2";
    const articleNumber = articleDiv.getElementsByTagName("h1")[0];
    articleNumber.style.color = "#a04bb5";
    articleNumber.style.fontSize = "3rem";
}

function clearDisplay(){
    while(newsDiv.firstChild){
        newsDiv.removeChild(newsDiv.firstChild);
    }
}

function filterNews(source, articles){
    clearDisplay();
    const dataArray = [];
    if (source === "all_sources"){
        displayNews(articles);
    }else{
        for (article of articles){
            if (article.author === source){
                dataArray.push(article);
            }
        }
        displayNews(dataArray);
    }

}

function generateRandomColor(){
    const hexArray = [0,1,2,3,4,5,6,7,8,9,"A","B","C","D","E","F"];
    let color = "#";
    for (let h=0; h<6; h++){
        const val = Math.floor(Math.random()*hexArray.length);
        color += hexArray[val];
    }
    return color;
}

function adjustFontColor(myDiv){
    const bgCol = window.getComputedStyle(myDiv).backgroundColor;
    bgColEdit = bgCol.replace("rgb(","");
    bgColEdit = bgColEdit.replace(")","");
    bgArr = bgColEdit.split(",");
    // console.log(bgArr);
    const brightness = 0.2126*bgArr[0]+0.7152*bgArr[1]+0.0722*bgArr[2];
    if (brightness < 128){
        myDiv.style.color = "white";
    }else{
        myDiv.style.color = "black";
    }
}

fetchNews();