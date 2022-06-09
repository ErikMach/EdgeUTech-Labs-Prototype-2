const configureMenuPage = () => {
  const name = c("div", {"class":"nameCont"}, [
    c("h1", {}, ["Name:"]),
    c("input", {"class": "nameField", "type":"text"})
  ]);
  const demo = c("button", {"class": "demoBtn"}, ["Enter Demo"]);
  demo.addEventListener("click", () => {
    pageHolder.visiblePage = "blankPage";
    loadExplore();
  });
  const cont = c("div", {"class":"registerCont"}, [name, demo]);

  document.getElementById("menuPage").appendChild(cont);
};
configureMenuPage();