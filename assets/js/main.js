const pointsOnLevel1 = 21;
const attributesCount = 7;

attachClickListeners();
updateLevel();
setUnspentPoints();
updateDisabledGridItems();

function attachClickListeners() {
  const resetButton = document.querySelector("#reset-button");
  resetButton.addEventListener("click", resetCalculator);

  const minusButtons = document.querySelectorAll(".minus-button");
  minusButtons.forEach((button) => button.addEventListener("click", decreaseRank));

  const plusButtons = document.querySelectorAll(".plus-button");
  plusButtons.forEach((button) => button.addEventListener("click", increaseRank));
}

function decreaseRank(event) {
  const gridItem = event.target.parentElement.parentElement.parentElement;
  const isAttribute = gridItem.classList.contains("attr-item");
  const stars = gridItem.querySelector(".stars");
  const currentRank = (stars.textContent.match(/⭐/g) || []).length;
  if (currentRank === 0) return;
  if (currentRank === 1 && isAttribute) return;
  stars.textContent = stars.textContent.replace(/⭐/, "");

  if (isAttribute) {
    const attributeNumber = parseInt(gridItem.attributes["attrnumber"].value);
    updateDisabledGridItemsByAttributeNumber(attributeNumber, currentRank - 1);
  } else {
    setCurrentRank(gridItem, currentRank - 1);
  }

  updateLevel();
  setUnspentPoints();
}

function increaseRank(event) {
  const gridItem = event.target.parentElement.parentElement.parentElement;
  const isAttribute = gridItem.classList.contains("attr-item");
  const maximumPerkRanks = isAttribute ? [] : event.target.parentElement.parentElement.querySelectorAll(".perk-rank").length;
  const stars = gridItem.querySelector(".stars");
  const currentRank = (stars.textContent.match(/⭐/g) || []).length;
  if (currentRank === 12 && isAttribute) return;
  if (!isAttribute && currentRank === maximumPerkRanks) return;
  stars.textContent = stars.textContent + "⭐";

  if (isAttribute) {
    const attributeNumber = parseInt(gridItem.attributes["attrnumber"].value);
    updateDisabledGridItemsByAttributeNumber(attributeNumber, currentRank + 1);
  } else {
    setCurrentRank(gridItem, currentRank + 1);
  }
  updateLevel();
  setUnspentPoints();
}

function setUnspentPoints() {
  const unspentInitialPoints = pointsOnLevel1 + calculateLevelFromAttributePoints() - 1 - getAttributePointsSpentCount();
  const unspentLevelPoints = calculateLevel() - 1 - getPerkPointsSpentCount();
  const unspentInitialNode = document.querySelector("#unspent-initial-value");
  const unspentLevelNode = document.querySelector("#unspent-level-value");
  setUnspentPointsOnNode(unspentInitialNode, unspentInitialPoints);
  setUnspentPointsOnNode(unspentLevelNode, unspentLevelPoints);
}

function setUnspentPointsOnNode(node, points) {
  node.textContent = points;
  if (points > 0) {
    node.parentElement.style.opacity = "1";
  } else {
    node.parentElement.style.opacity = "0";
  }
}

function setCurrentRank(gridItem, rank) {
  const oldPerkRankCurrent = gridItem.querySelector(".perk-rank.current");
  if (oldPerkRankCurrent) oldPerkRankCurrent.classList.remove("current");
  const newPerkRankCurrent = gridItem.querySelector(`.perk-rank:nth-child(${rank + 1})`);
  if (newPerkRankCurrent) newPerkRankCurrent.classList.add("current");
}

function resetCalculator() {
  const perkStarsToReset = document.querySelectorAll(".grid-item:not(.attr-item) .stars");
  perkStarsToReset.forEach((stars) => (stars.textContent = ""));

  const attributeStarsToReset = document.querySelectorAll(".attr-item .stars");
  attributeStarsToReset.forEach((stars) => (stars.textContent = "⭐"));

  setCurrentLevel(1);
  resetCurrentPerkRanks();
  setUnspentPoints();
  updateDisabledGridItems();
}

/*function enablePlusButtons(attributeNumber, pointsSpent) {
  getPerkItemsByAttributeNumberPastN(attributeNumber, pointsSpent).forEach((item) => {
    item.querySelector(".plus-button").setAttribute("disabled", "");
  });

  getPerkItemsByAttributeNumberBeforeN(attributeNumber, pointsSpent).forEach((item) => {
    item.querySelector(".plus-button").removeAttribute("disabled");
  });
}
 */

function updateDisabledGridItems() {
  const attributePoints = getAttributePoints();
  attributePoints.forEach((points, attributeIndex) => {
    updateDisabledGridItemsByAttributeNumber(attributeIndex, points);
  });
}

function updateDisabledGridItemsByAttributeNumber(attributeNumber, pointsSpent) {
  const perkItemsToEnable = getPerkItemsByAttributeNumberBeforeN(attributeNumber, pointsSpent);
  perkItemsToEnable.forEach((item) => {
    item.removeAttribute("disabled");
  });

  const perkItemsToDisable = getPerkItemsByAttributeNumberAfterN(attributeNumber, pointsSpent);
  perkItemsToDisable.forEach((item) => {
    item.setAttribute("disabled", "");
  });
  perkItemsToDisable.forEach((item) => {
    item.querySelector(".stars").textContent = "";
  });
}

function getPerkItemsByAttributeNumberBeforeN(attributeNumber, n) {
  const selector = `.grid-item:nth-child(-${attributesCount}n+ ${n * attributesCount + attributeNumber + 1}):not(.attr-item)`;
  return document.querySelectorAll(selector);
}

function getPerkItemsByAttributeNumberAfterN(attributeNumber, n) {
  const selector = `.grid-item:nth-child(${attributesCount}n+ ${(n + 1) * attributesCount + attributeNumber + 1})`;
  return document.querySelectorAll(selector);
}

function resetCurrentPerkRanks() {
  const perkRanksToReset = document.querySelectorAll(".perk-rank.current");
  perkRanksToReset.forEach((x) => x.classList.remove("current"));
}

function updateLevel() {
  setCurrentLevel(calculateLevel());
}

function setCurrentLevel(level) {
  const levelInput = document.querySelector("#level-counter-value");
  levelInput.textContent = level;
}

function calculateLevel() {
  const levelFromPointSpentCount = calculateLevelFromAttributePoints() + getPerkPointsSpentCount();
  const highestPerkLevelRequirement = [...document.querySelectorAll(".perk-rank.current")]
    .map((x) => parseInt(x.attributes["lvlreq"].value) || 0)
    .reduce((a, b) => Math.max(a, b), 0);
  return Math.max(levelFromPointSpentCount, highestPerkLevelRequirement);
}

function calculateLevelFromAttributePoints() {
  const initialPointsSpentCount = getAttributePointsSpentCount();
  return initialPointsSpentCount > 21 ? initialPointsSpentCount - 21 + 1 : 1;
}

function getAttributePoints(number) {
  return (document.querySelector(`#attr-item${number} .stars`).textContent.match(/⭐/g) || []).length;
}

function getAttributePoints() {
  const attributeStarsArray = Array.from(document.querySelectorAll(".attr-item .stars").values());
  return attributeStarsArray.map((stars) => (stars.textContent.match(/⭐/g) || []).length);
}

function getAttributePointsSpentCount() {
  return getAttributePoints().reduce((a, b) => a + b, 0);
}

function getPerkPointsSpentCount() {
  const perkStarsArray = Array.from(document.querySelectorAll(".grid-item:not(.attr-item) .stars").values());
  return perkStarsArray.map((stars) => (stars.textContent.match(/⭐/g) || []).length).reduce((a, b) => a + b, 0);
}
