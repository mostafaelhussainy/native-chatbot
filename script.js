$(document).ready(function () {
    // Selecting elements from the DOM
    const chatbotToggler = $(".chatbot-toggler");
    const closeBtn = $(".close-btn");
    const chatBox = $(".chat-box");
    const sendChatBtn = $("#send-btn");
    const chatBotWrapper = $("#chatbot-wrapper");
    const startingMsg = "Hi there, How can I help you today?";
    let userMessage = null;
    const chatInput = $(".chat-input textarea");
    const inputInitialHeight = chatInput.scrollHeight;
    const API_KEY = "bla bla bla";

    // Function to create a typeWriter animation
    const typeWriter = (targetElement, textContent, speed) => {
        let charIndex = 0;

        // Return a promise that resolves when typing completes
        return new Promise((resolve, reject) => {
            function type() {
                if (charIndex < textContent.length) {
                    // Append the next character or HTML tag to the target element
                    targetElement.text(targetElement.text() + textContent.charAt(charIndex));
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
    };
    // Function to create a new chat message element
    const generateChatLi = (message, className) => {
        const chatLi = $("<li>").addClass("chat").addClass(className);
        let chatContent;
        if (className === "outgoing") {
            chatContent = `${message}`; // Outgoing messages don't need an icon
        } else if (className === "incoming") {
            // For incoming messages, add the animated thinking indicator
            chatContent = `${message}`;
        }
        chatLi.html(chatContent);
        return chatLi;
    };

    // Function to generate a response from the chatbot
    const generateResponse = (chatElement) => {
        const API_URL = "https://api.openai.com/v1/chat/completions";
        const messageElement = chatElement.find("p");

        // Add loading indicator
        messageElement.html('<span class="typing-indicator"><span class="dot"></span></span>');

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
                messageElement.text(data.choices[0].message.content.trim()); // here customize the response depending on the response
            })
            .catch(() => {
                messageElement.addClass("error");
                messageElement.text("Oops! Something went wrong. Please try again."); // here you might went to redirect back to the opening message
            })
            .finally(() => chatBox.scrollTop(chatBox.prop("scrollHeight")));
    };

    // Function to handle user input and initiate chatbot response
    const handleChat = () => {
        userMessage = chatInput.val().trim(); // Get user-entered message and remove extra whitespace
        if (!userMessage) return;

        chatInput.val(""); // Clear the input textarea
        chatInput.css("height", `${inputInitialHeight}px`); // Reset textarea height

        // Append the user's message to the chatBox
        chatBox.append(generateChatLi(userMessage, "outgoing"));
        chatBox.scrollTop(chatBox.prop("scrollHeight"));

        // Simulate a delay for bot response
        setTimeout(() => {
            const incomingChatLi = generateChatLi("Thinking...", "incoming");
            chatBox.append(incomingChatLi);
            chatBox.scrollTop(chatBox.prop("scrollHeight"));
            generateResponse(incomingChatLi);
        }, 600);
    };

    const handleMsgInsertion = (msg) => {
        return new Promise((resolve, reject) => {
            // Append the user's message to the chatBox
            chatBox.append(msg);
            chatBox.scrollTop(chatBox.prop("scrollHeight"));
            resolve();
        });
    };

    const handleBotMsgInsertion = async (generatingFunction, argsArr) => {
        return new Promise((resolve, reject) => {
            setTimeout(async () => {
                const systemMsg = generateChatLi("", "incoming");
                await handleMsgInsertion(systemMsg);
                await generatingFunction.apply(null, argsArray);
                resolve();
            }, 600);
        });
    };

    const generateAndInsertButton = async (positionElement, btnText, btnClickHandler) => {
        // Create a new button element
        const button = $("<button>").addClass("list-btn");
        // Insert the button before the position element
        positionElement.append(button);
        // Set button click handler if provided
        if (typeof btnClickHandler === "function") {
            button.on("click", btnClickHandler);
        }
        return typeWriter(button, btnText, 50);
    };

    const generateAndInsertDatePicker = async (
        positionElement,
        inputLabel,
        inputId,
        dateInsertionHandler
    ) => {
        // Create a new input element with the "datepicker" class
        const input = $("<input>").addClass("datepicker").attr("id", inputId);

        const label = $("<label>").attr("for", inputId).addClass("list-btn");

        positionElement.append(label);
        positionElement.append(input);

        $(".datepicker")
            .datepicker({
                todayHighlight: "TRUE",
                autoclose: true,
            })
            .on("changeDate", function (e) {
                const selectedDate = e.date;
                const dateObject = new Date(selectedDate);
                const month = (dateObject.getMonth() + 1).toString().padStart(2, "0");
                const day = dateObject.getDate().toString().padStart(2, "0");
                const year = dateObject.getFullYear();
                const formattedDate = `${month}/${day}/${year}`;
                // Call the dateInsertionHandler if it's a function
                if (typeof dateInsertionHandler === "function") {
                    dateInsertionHandler(formattedDate);
                } else {
                    console.error("dateInsertionHandler is not a function or is not defined.");
                }
            });
        return typeWriter(label, inputLabel, 50);
    };

    const handleCreationLeaveTypeSelect = async () => {
        // Create a select element
        var selectElement = $("<select>").attr("id", "mySelect");

        // Add options to the select element
        var options = [
            { value: "1", text: "Type 1" },
            { value: "2", text: "Type 2" },
            { value: "3", text: "Type 3" },
        ];
        options.forEach(function (option) {
            var optionElement = $("<option>").attr("value", option.value).text(option.text);
            selectElement.append(optionElement);
        });

        // Append the select element to the body or any other desired container
        $(chatBox).append(selectElement);
        $(selectElement).chosen();
    };
    const handleUserDateSelection = async (date) => {
        const userMsg = generateChatLi(date, "outgoing");
        await handleMsgInsertion(userMsg);
        setTimeout(async () => {
            const systemMsg = generateChatLi("", "incoming");
            await handleMsgInsertion(systemMsg);
            // create an empty chat list and insert plain text inside then open the textarea for input and listen for the input
            await typeWriter(systemMsg, "Please enter your number of days", 50);
            $(chatInput).prop("disabled", false);
            const handleChatInsertion = async () => {
                userMessage = chatInput.val().trim();
                if (!userMessage) return;
                chatInput.val(""); // Clear the input textarea
                chatInput.css("height", `${inputInitialHeight}px`); // Reset textarea height

                const userMsg = generateChatLi(userMessage, "outgoing");
                await handleMsgInsertion(userMsg);

                await handleCreationLeaveTypeSelect();
                $(chatInput).prop("disabled", false);
                chatInput.off("keydown");
                sendChatBtn.off("click");
                chatInput.prop("disabled", true);
            };
            // Event listener for handling Enter key press to send message
            chatInput.on("keydown", (e) => {
                if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
                    e.preventDefault();
                    handleChatInsertion();
                }
            });
            // Event listener for sending message button click
            sendChatBtn.on("click", handleChatInsertion);
        }, 600);
    };

    const handleApplyForLeave = async () => {
        const applyForLeaveBody = {};
        sessionStorage.setItem("user", JSON.stringify(applyForLeaveBody));
        const userMsg = generateChatLi("Apply for leave", "outgoing");
        await handleMsgInsertion(userMsg);

        setTimeout(async () => {
            const systemMsg = generateChatLi("", "incoming");
            await handleMsgInsertion(systemMsg);
            await generateAndInsertDatePicker(
                systemMsg,
                "Enter your date",
                "testId",
                handleUserDateSelection
            );
        }, 600);
    };

    // Function to handle the toggling the chat-bot on/off
    const handleChatBotToggler = async () => {
        chatBotWrapper.toggleClass("show-chatbot");
        if (!chatBotWrapper.hasClass("loaded")) {
            // If the chat-bot isn't loaded/opened for the first time
            chatBotWrapper.addClass("loaded");
            const firstChatMessageContainer = $(".chat-box > .chat.incoming");
            // Wait for the typing animation to complete
            await typeWriter(firstChatMessageContainer, startingMsg, 50);
            // After typing animation completes, insert the first button
            await generateAndInsertButton(
                firstChatMessageContainer,
                "Apply for leave",
                handleApplyForLeave
            );
        }
    };

    // Event listener for input field height adjustment
    chatInput.on("input", () => {
        chatInput.css("height", "auto");
        chatInput.css("height", `${chatInput.scrollHeight}px`);
    });

    // // Event listener for handling Enter key press to send message
    // chatInput.on("keydown", (e) => {
    //     if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
    //         e.preventDefault();
    //         handleChat();
    //     }
    // });
    // // Event listener for sending message button click
    // sendChatBtn.on("click", handleChat);

    // Event listener for toggling the chatbot interface visibility
    chatbotToggler.on("click", () => $("body").toggleClass("show-chatbot"));

    // Event listener for closing the chatbot interface
    closeBtn.on("click", () => chatBotWrapper.removeClass("show-chatbot"));

    chatbotToggler.on("click", handleChatBotToggler);

    // Move the datepicker initialization outside of the $(document).ready() function
    // Wait for the DOM to be ready before initializing the datepicker
    $(".datepicker").datepicker();
});
