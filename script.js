$(document).ready(function () {
    // Selecting elements from the DOM
    const chatbotToggler = document.querySelector(".chatbot-toggler");
    const closeBtn = document.querySelector(".close-btn");
    const chatBox = document.querySelector(".chat-box");
    const sendChatBtn = document.querySelector("#send-btn");
    const chatBotWrapper = document.querySelector("#chatbot-wrapper");
    const startingMsg = "Hi there, How can I help you today?";
    let userMessage = null; // Variable to store user's message
    const API_KEY = "PASTE-YOUR-API-KEY"; // Placeholder for your API key
    const chatInput = document.querySelector(".chat-input textarea");
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

    // // Function to generate a response from the chatbot
    // const generateResponse = (chatElement) => {
    //     const API_URL = "https://api.openai.com/v1/chat/completions";
    //     const messageElement = chatElement.querySelector("p");

    //     // Add loading indicator
    //     messageElement.innerHTML = '<span class="typing-indicator"><span class="dot"></span></span>';

    //     // Define the properties and message for the API request
    //     const requestOptions = {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json",
    //             Authorization: `Bearer ${API_KEY}`,
    //         },
    //         body: JSON.stringify({
    //             model: "gpt-3.5-turbo",
    //             messages: [{ role: "user", content: userMessage }],
    //         }),
    //     };

    //     // Send POST request to API, get response, and set the response as paragraph text
    //     fetch(API_URL, requestOptions)
    //         .then((res) => res.json())
    //         .then((data) => {
    //             messageElement.textContent = data.choices[0].message.content.trim(); // here customize the response depending on the response
    //         })
    //         .catch(() => {
    //             messageElement.classList.add("error");
    //             messageElement.textContent = "Oops! Something went wrong. Please try again."; // here you might went to redirect back to the opening message
    //         })
    //         .finally(() => chatBox.scrollTo(0, chatBox.scrollHeight));
    // };

    // // Function to handle user input and initiate chatbot response
    // const handleChat = () => {
    //     userMessage = chatInput.value.trim(); // Get user-entered message and remove extra whitespace
    //     if (!userMessage) return;

    //     chatInput.value = ""; // Clear the input textarea
    //     chatInput.style.height = `${inputInitialHeight}px`; // Reset textarea height

    //     // Append the user's message to the chatBox
    //     chatBox.appendChild(createChatLi(userMessage, "outgoing"));
    //     chatBox.scrollTo(0, chatBox.scrollHeight);

    //     // Simulate a delay for bot response
    //     setTimeout(() => {
    //         const incomingChatLi = createChatLi("Thinking...", "incoming");
    //         chatBox.appendChild(incomingChatLi);
    //         chatBox.scrollTo(0, chatBox.scrollHeight);
    //         generateResponse(incomingChatLi);
    //     }, 600);
    // };

    const generateAndInsertButton = async (positionElement, btnText, btnClickHandler) => {
        // Create a new button element
        const button = document.createElement("button");
        button.classList.add("list-btn");
        // Insert the button before the position element
        positionElement.appendChild(button);
        // Set button click handler if provided
        if (typeof btnClickHandler === "function") {
            button.addEventListener("click", btnClickHandler);
        }
        return typeWriter(button, btnText, 50);
    };

    const generateAndInsertDatePicker = async (positionElement, inputLabel, btnClickHandler) => {
        // Create a new button element
        const label = document.createElement("label");
        const input = document.createElement("input");
        input.classList.add("datepicker"); // Ensure the input has the correct class
        // Insert the input before the position element
        label.appendChild(input);
        positionElement.appendChild(label);

        // Set input click handler if provided
        if (typeof btnClickHandler === "function") {
            input.addEventListener("click", btnClickHandler);
        }

        // Wait for the DOM to be ready before initializing the datepicker
        $(document).ready(function () {
            $(".datepicker").datepicker();
        });

        return typeWriter(label, inputLabel, 50);
    };

    const handleChatBotToggler = async () => {
        chatBotWrapper.classList.toggle("show-chatbot");
        if (!chatBotWrapper.classList.contains("loaded")) {
            chatBotWrapper.classList.add("loaded");
            const firstChatMessageContainer = document.querySelector(
                ".chat-box > .chat.incoming p"
            );
            // Wait for the typing animation to complete
            await typeWriter(firstChatMessageContainer, startingMsg, 50);
            // After typing animation completes, insert the first button
            await generateAndInsertButton(firstChatMessageContainer, "job description");
            // After the first button is inserted, insert the second button
            await generateAndInsertButton(firstChatMessageContainer, "letter module");
            await generateAndInsertDatePicker(firstChatMessageContainer, "Enter your date");
        }
    };

    // Event listener for input field height adjustment
    chatInput.addEventListener("input", () => {
        chatInput.style.height = "auto";
        chatInput.style.height = `${chatInput.scrollHeight}px`;
    });

    // // Event listener for handling Enter key press to send message
    // chatInput.addEventListener("keydown", (e) => {
    //     if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
    //         e.preventDefault();
    //         handleChat();
    //     }
    // });
    // Event listener for toggling the chatbot interface visibility
    // chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
    // // Event listener for sending message button click
    // sendChatBtn.addEventListener("click", handleChat);

    // Event listener for closing the chatbot interface
    closeBtn.addEventListener("click", () => chatBotWrapper.classList.remove("show-chatbot"));

    chatbotToggler.addEventListener("click", handleChatBotToggler);

    function typeWriter(targetElement, textContent, speed) {
        let charIndex = 0;

        // Return a promise that resolves when typing completes
        return new Promise((resolve, reject) => {
            function type() {
                if (charIndex < textContent.length) {
                    // Append the next character or HTML tag to the target element
                    targetElement.innerHTML += textContent.charAt(charIndex);
                    charIndex++;
                    // Call the function recursively after a delay
                    setTimeout(type, speed);
                } else {
                    // Resolve the promise when typing completes
                    resolve();
                }
            }

            // Start typing when the function is called
            type();
        });
    }
});
// Move the datepicker initialization outside of the $(document).ready() function
$(document).ready(function () {
    // Wait for the DOM to be ready before initializing the datepicker
    $(".datepicker").datepicker();
});
