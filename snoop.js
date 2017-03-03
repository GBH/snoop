// setting up event listener on all redditor username links
document.body.addEventListener("mouseover", function(e){
  if(e.target && e.target.matches("a.author")){
    snoop(e.target);
  }
})

function snoop(author) {

  // already snooped, no reason to do it again
  if(author.parentNode.querySelector("span.snoop")){
    return false;
  }

  // Creating span for output
  var snoop_span = document.createElement("span")
  snoop_span.className = "snoop";
  snoop_span.appendChild(document.createTextNode(" [snooping...] "));
  author.parentNode.insertBefore(snoop_span, null);

  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function(){populate_snooped_history(xhr, snoop_span)};
  xhr.open('GET', author.getAttribute("href"), true);
  xhr.send();
}

function populate_snooped_history(xhr, snoop_span){
  if(xhr.readyState !== XMLHttpRequest.DONE || xhr.status !== 200){
    return false;
  }

  let html = document.implementation.createHTMLDocument().documentElement;
  html.innerHTML = xhr.responseText;
  let subreddits_elements = html.querySelectorAll("a.subreddit");

  let sub_names = {};
  let sub_urls = {};
  for (var i = 0; i < subreddits_elements.length; i++){
    let name = subreddits_elements[i].innerHTML.replace("r/", "");
    let url  = subreddits_elements[i].getAttribute("href");

    sub_names[name] = sub_names[name] ? sub_names[name] + 1 : 1;
    sub_urls[name] = url;
  }

  // Sorting by most frequent subreddits
  let sorted_names = []
  for (let r in sub_names){
    sorted_names.push([r, sub_names[r]]);
  }
  sorted_names = sorted_names.sort(function(a,b){
    return b[1] - a[1];
  });
  sorted_names = sorted_names.map(function(x){
    return x[0];
  });
  sorted_names = sorted_names.slice(0, 5);

  // blanking and populating snoop span
  while (snoop_span.firstChild) {
    snoop_span.removeChild(snoop_span.firstChild);
  }

  snoop_span.appendChild(document.createTextNode(" [posts in: "));
  for (var i = 0; i < sorted_names.length; i ++){
    let name = sorted_names[i];

    let link = document.createElement("a");
    link.href = sub_urls[name];
    link.target = "_blank";
    link.appendChild(document.createTextNode(name));

    snoop_span.appendChild(link);

    if (i != sorted_names.length - 1){
      snoop_span.appendChild(document.createTextNode(", "));
    }
  }
  snoop_span.appendChild(document.createTextNode("] "));
}
