const configureQuestPage = () => {
  const titleBar = c("div", {"class":"titleBar"},["Quests"]);
  const codingSpace = c("div", {class:"codingSpace"}, [
    c("div", {class:"blockSpace"}, [
      c("div", {class:"blockMenuCont"}, []),
      c("div", {class:"blockCont"}, []),
      c("div", {class:"blockStage"}, []),
    ]),
    c("div", {class:""}, []),
    c("div", {class:""}, [])
  ]);
  document.getElementById("questPage").appendChild(titleBar);
  document.getElementById("questPage").appendChild(codingSpace);
};
configureQuestPage();