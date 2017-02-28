function snoop(author) {

  // already snopped, no reason to do it again
  if(author.parentNode.querySelector("span.snoop")){
    return false;
  }

  // Creating span for output
  var snoop_span = document.createElement("span")
  snoop_span.className = "snoop";
  snoop_span.innerHTML = " [snooping...] "
  author.parentNode.insertBefore(snoop_span, null);

  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function(){
    if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200){
      let html = document.implementation.createHTMLDocument().documentElement;
      html.innerHTML = xhr.responseText;
      let subreddits_elements = html.querySelectorAll("a.subreddit");

      let subreddits = {};
      for (i = 0; i < subreddits_elements.length; i++){
        let name = subreddits_elements[i].innerHTML.replace("r/", "");
        subreddits[name] = subreddits[name] ? subreddits[name] + 1 : 1;
      }

      let sortable = []
      for (let r in subreddits){
        sortable.push([r, subreddits[r]])
      }
      sortable = sortable.sort(function(a,b){
        return b[1] - a[1]
      })
      sortable = sortable.map(function(x){
        return x[0]
      });
      sortable = sortable.slice(0, 5)

      snoop_span.innerHTML = " [posts in: " + sortable.join(", ") + "] ";
    }
  }
  xhr.open('GET', author.getAttribute("href"), true);
  xhr.send();
}

document.body.addEventListener("mouseover", function(e){
  if(e.target && e.target.matches("a.author")){
    snoop(e.target);
  }
})
