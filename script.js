// Selecting elements from the DOM
const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatBox = document.querySelector(".chat-box");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector("#send-btn");
let userMessage = null; // Variable to store user's message
const API_KEY = "PASTE-YOUR-API-KEY"; // Placeholder for your API key
const inputInitialHeight = chatInput.scrollHeight; // use to resize the userInput back to what it was after sending a value

// Function to create a new chat message element
const createChatLi = (message, className) => {
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", className);
  let chatContent;
  if (className === "outgoing") {
    chatContent = `<p>${message}</p>`; // Outgoing messages don't need an icon
  } else if (className === "incoming") {
    // For incoming messages, add the animated thinking indicator
    chatContent = `<i class="fa-solid fa-robot"></i><p>${message}</p>`;
  }
  chatLi.innerHTML = chatContent;
  return chatLi;
};

// Function to generate a response from the chatbot
const generateResponse = (chatElement) => {
  const API_URL = "https://api.openai.com/v1/chat/completions";
  const messageElement = chatElement.querySelector("p");

  // Add loading indicator
  messageElement.innerHTML =
    '<span class="typing-indicator"><span class="dot"></span></span>';

  // Define the properties and message for the API request
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: userMessage }],
    }),
  };

  // Send POST request to API, get response, and set the response as paragraph text
  fetch(API_URL, requestOptions)
    .then((res) => res.json())
    .then((data) => {
      messageElement.textContent = data.choices[0].message.content.trim(); // here customize the response depending on the response
    })
    .catch(() => {
      messageElement.classList.add("error");
      messageElement.textContent =
        "Oops! Something went wrong. Please try again."; // here you might went to redirect back to the opening message
    })
    .finally(() => chatBox.scrollTo(0, chatBox.scrollHeight));
};

// Function to handle user input and initiate chatbot response
const handleChat = () => {
  userMessage = chatInput.value.trim(); // Get user-entered message and remove extra whitespace
  if (!userMessage) return;

  chatInput.value = ""; // Clear the input textarea
  chatInput.style.height = `${inputInitialHeight}px`; // Reset textarea height

  // Append the user's message to the chatBox
  chatBox.appendChild(createChatLi(userMessage, "outgoing"));
  chatBox.scrollTo(0, chatBox.scrollHeight);

  // Simulate a delay for bot response
  setTimeout(() => {
    const incomingChatLi = createChatLi("Thinking...", "incoming");
    chatBox.appendChild(incomingChatLi);
    chatBox.scrollTo(0, chatBox.scrollHeight);
    generateResponse(incomingChatLi);
  }, 600);
};

// Event listener for input field height adjustment
chatInput.addEventListener("input", () => {
  chatInput.style.height = "auto";
  chatInput.style.height = `${chatInput.scrollHeight}px`;
});

// Event listener for handling Enter key press to send message
chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
    e.preventDefault();
    handleChat();
  }
});

// Event listener for sending message button click
sendChatBtn.addEventListener("click", handleChat);

// Event listener for closing the chatbot interface
closeBtn.addEventListener("click", () =>
  document.body.classList.remove("show-chatbot")
);

// Event listener for toggling the chatbot interface visibility
chatbotToggler.addEventListener("click", () =>
  document.body.classList.toggle("show-chatbot")
);

/************/
// Updated typeWriter function with parameters to handle HTML content
function typeWriter(targetElement, textContent, speed) {
  let charIndex = 0;

  function type() {
    if (charIndex < textContent.length) {
      // Append the next character or HTML tag to the target element
      targetElement.innerHTML += textContent.charAt(charIndex);
      charIndex++;
      // Call the function recursively after a delay
      setTimeout(type, speed);
    }
  }

  // Start typing when the function is called
  type();
}

// Get the target element where the text will be typed
const textElement = document.getElementById("typewriter-text");

// Text to be typed, including HTML elements
const textToType = "Hello, This is a typewriter effect.";

// Time delay between typing each character (in milliseconds)
const typingSpeed = 100;

// Start typing when the page loads
document.addEventListener(
  "DOMContentLoaded",
  typeWriter(textElement, textToType, typingSpeed)
);
