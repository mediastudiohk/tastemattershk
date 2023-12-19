const requestFormElement = document.getElementById("request-form");

window.onload = function () {
  var x = document.getElementsByClassName("g-container")[0];
  x.id = "request-form-content";

  // Create SVG
  const svgElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  );
  svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svgElement.setAttribute("aria-hidden", "true");
  svgElement.setAttribute("focusable", "false");
  svgElement.setAttribute("class", "icon icon-close");
  svgElement.setAttribute("fill", "none");
  svgElement.setAttribute("viewBox", "0 0 32 32");

  // Create path and set d propertyxs
  const pathElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );
  pathElement.setAttribute(
    "d",
    "M24.056 23.5004L23.5004 24.056C23.1935 24.3628 22.696 24.3628 22.3892 24.056L16 17.6668L9.61078 24.056C9.30394 24.3628 8.80645 24.3628 8.49961 24.056L7.94403 23.5004C7.63719 23.1936 7.63719 22.6961 7.94403 22.3892L14.3332 16L7.94403 9.61081C7.63719 9.30397 7.63719 8.80648 7.94403 8.49964L8.49961 7.94406C8.80645 7.63721 9.30394 7.63721 9.61078 7.94406L16 14.3333L22.3892 7.94404C22.6961 7.6372 23.1935 7.6372 23.5004 7.94404L24.056 8.49963C24.3628 8.80647 24.3628 9.30395 24.056 9.61079L17.6667 16L24.056 22.3892C24.3628 22.6961 24.3628 23.1936 24.056 23.5004Z "
  );
  pathElement.setAttribute("fill", "white");

  // Add "path" in to SVG
  svgElement.appendChild(pathElement);

  const headerElement = document.querySelector(".globo-heading");

  // Create SVG button
  const buttonElement = document.createElement("button");
  buttonElement.setAttribute("id", "close-button");
  buttonElement.setAttribute("type", "button");
  buttonElement.setAttribute("class", "close-button");
  buttonElement.setAttribute("aria-label", "Close");

  // SVG into Button
  buttonElement.appendChild(svgElement);

  // Button into header
  headerElement.appendChild(buttonElement);

  // Create span
  const requiredFields = document.createElement("span");
  requiredFields.setAttribute("class", "required-fields");
  requiredFields.innerText = "* Required Fields";

  // Create cancel button
  const cancelButton = document.createElement("button");
  cancelButton.setAttribute("type", "button");
  cancelButton.setAttribute("class", "action cancel-button");
  cancelButton.innerText = "Cancel";

  //Add event into cancel btn
  cancelButton.addEventListener("click", function () {
    requestFormElement.classList.remove("visible");
  });

  buttonElement.addEventListener("click", function () {
    requestFormElement.classList.remove("visible");
  });

  //Get ".wizard__footer"
  const footerElement = document.querySelector(".wizard__footer");

  // add button and span "require" into footer
  footerElement.appendChild(cancelButton, requiredFields);
  footerElement.appendChild(requiredFields);
};

document.addEventListener("click", function (evt) {
  let flyoutEl = document.getElementById("request-form-content");
  let text = document.getElementById("request-form-text");
  targetEl = evt.target; // clicked element
  do {
    if (targetEl == flyoutEl || targetEl == text) {
      return;
    }
    targetEl = targetEl.parentNode;
  } while (targetEl);
  // This is a click outside.
  requestFormElement.classList.remove("visible");
});

function requestHandler() {
  const requestFormContentElement = document.getElementById(
    "request-form-content"
  );
  const successText = document.getElementsByClassName("message success")[1];
  requestFormElement.classList.add("visible");
  document.getElementById("request-form-content").reset();

  if (successText.style.display) {
    successText.style.setProperty("display", "none");
  }

  if (requestFormContentElement.style.display) {
    requestFormContentElement.style.setProperty("display", "block");
  }
}
