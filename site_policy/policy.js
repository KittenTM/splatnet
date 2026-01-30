fetch("../header.html")
  .then(res => res.text())
  .then(html => {
    document.getElementById("header-container").innerHTML = html;
  })
  .catch(err => console.error("Failed to load header:", err));

(function(){
  ika_swim('div#ika_swim');
})();