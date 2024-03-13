// Define constants for DOM elements
const elements = {
    chatbotToggler: $(".chatbot-toggle-btn"),
    closeBtn: $(".close-btn"),
    chatBox: $(".messages-list"),
    sendChatBtn: $(".send-message-btn"),
    chatBotWrapper: $("#chatbot"),
    chatInput: $(".new-message textarea"),
    widthBtnToggler: $(".width-toggler-btn"),
    chatBotWindow: $(".chatbot-inner-window"),
    sendMessageIcon: $(".new-message i"),
};

// Define constants for messages and configurations
const constants = {
    STARTING_MESSAGE: "Hi there, How can I help you today?",
    AST_VALUE: "Payroll supervisor",
    NO_VALUES_MESSAGE: "Sorry, there're no values to select from",
    SUBMIT_REQUEST_MESSAGE: "Do you want to submit your request?",
    NO_SELECTION_MESSAGE: "None",
    CHAT_INPUT_INITIAL_HEIGHT: elements.chatInput.scrollHeight,
    TYPING_SPEED: 200,
};

// Define leave request modules
const requestModules = {
    leaveRequestModule: {
        moduleName: "leave request",
        moduleKey: "leaveRequestModule",
        moduleLabel: "Apply for leave",
        moduleSteps: {
            step1: {
                defaultOption: "Select one option",
                message: "Are you going abroad?",
                type: "options",
                name: "going abroad",
                key: "goingAbroad",
                stepNum: 1,
                options: [
                    { value: "Yes", text: "Yes" },
                    { value: "No", text: "No" },
                ],
            },
            step2: {
                defaultOption: "Select one option",
                message: "Do you need advanced payment?",
                type: "options",
                name: "advanced payment",
                key: "advancedPayment",
                stepNum: 2,
                options: [
                    { value: "Yes", text: "Yes" },
                    { value: "No", text: "No" },
                ],
            },
            step3: {
                type: "date",
                name: "starting date",
                message: "Pick your starting date",
                key: "startingDate",
                stepNum: 3,
            },
            step4: {
                message: "Please enter your number of days",
                placeHolder: "Enter your number of days",
                type: "value",
                name: "number of days",
                key: "numberOfDays",
                stepNum: 4,
            },
            step5: {
                defaultOption: "Select one option",
                message: "Please choose your leave type",
                type: "options",
                name: "leave type",
                key: "leaveType",
                stepNum: 5,
                options: [
                    { value: "Type 1", text: "Type 1" },
                    { value: "Type 2", text: "Type 2" },
                    { value: "Type 3", text: "Type 3" },
                ],
            },
            step6: {
                message: "Do you want to upload any attachments?",
                type: "attachments",
                name: "attachment name",
                key: "attachmentName",
                stepNum: 6,
            },
            step7: {
                message: `Since you're ${AST_VALUE} please deputize your approvals?`,
                type: "options",
                name: "deputize type",
                key: "deputizeType",
                stepNum: 7,
                link: "step8",
                options: [
                    { value: "All locations", text: "All locations" },
                    { value: "Same location", text: "Same location" },
                    { value: "My manager", text: "My manager" },
                ],
            },
            step8: {
                message: "Select your deputize",
                type: "fetchedOptions",
                name: "deputize value",
                key: "deputizeValue",
                stepNum: 8,
                link: 7,
                options: [
                    { value: "All locations", text: "All locations" },
                    { value: "Same location", text: "Same location" },
                    { value: "My manager", text: "My manager" },
                ],
            },
        },
    },
};

// Define utility functions
const utils = {
    scrollToBottom: () => elements.chatBox.scrollTop(elements.chatBox.prop("scrollHeight")),
    disableElement: (element) => element.prop("disabled", true).css("color", "#ccc"),
    disableDatePicker: (datePicker, callback) => {
        datePicker.datepicker("destroy");
        datePicker.off("changeDate", callback);
    },
    activeChatInput: (placeHolder) => {
        const { chatInput, sendMessageIcon } = elements;
        chatInput.prop("disabled", false);
        sendMessageIcon.css("display", "block");
        chatInput.prop("placeholder", placeHolder);
        chatInput.focus();
    },
    resetChatInput: () => {
        const { chatInput, chatBox, sendChatBtn, sendMessageIcon } = elements;
        chatInput.val("");
        chatInput.css("height", `${constants.CHAT_INPUT_INITIAL_HEIGHT}px`);
        chatInput.prop("placeholder", "");
        chatInput.prop("disabled", false);
        chatBox.scrollTop(chatBox.prop("scrollHeight"));
        chatInput.off("keydown");
        chatInput.prop("disabled", true);
        sendChatBtn.off("click");
        sendMessageIcon.css("display", "none");
    },
    animateTyping: async (targetElement, textContent) => {
        let charIndex = 0;
        return new Promise((resolve, reject) => {
            function type() {
                if (charIndex < textContent.length) {
                    targetElement.text(targetElement.text() + textContent.charAt(charIndex));
                    charIndex++;
                    setTimeout(type, constants.TYPING_SPEED);
                } else {
                    chatBox.scrollTop(chatBox.prop("scrollHeight"));
                    resolve();
                }
            }
            type();
        });
    },
    savePropToSessionStorage: (
        reqName,
        propObjName,
        propName,
        propVal,
        step,
        notIncludedInSummary = false
    ) => {
        const req = JSON.parse(sessionStorage.getItem(reqName));
        req[propObjName] = {};
        req[propObjName].name = propName;
        req[propObjName].value = propVal;
        req[propObjName].step = step;
        req[propObjName].notIncludedInSummary = notIncludedInSummary;
        sessionStorage.setItem(reqName, JSON.stringify(req));
    },
    getReqFromSessionStorage: (reqName) => {
        return JSON.parse(sessionStorage.getItem(reqName));
    },
};

// Define message handling functions
const messageHandler = {
    insertMessage: async (message, className) => {
        const chatLi = $("<li>").addClass("chat").addClass(className);
        const { chatBox } = elements;
        chatBox.append(chatLi);

        if (className === "incoming" || className === "incoming with-options") {
            await new Promise((resolve) => setTimeout(resolve, 600)); // Wait for animation
            await utils.animateTyping(chatLi, message);
        } else {
            chatLi.html(message);
        }

        utils.scrollToBottom();
        return chatLi;
    },

    insertButton: async (positionElement, btnText, btnClickHandler, active) => {
        const btn = $("<button>").addClass("list-btn").text(btnText);
        positionElement.append(btn);

        if (typeof btnClickHandler === "function") {
            btn.on("click", async () => {
                await btnClickHandler();

                if (active) return;
                btn.prop("disabled", true); // Disable button after click
            });
        }

        await utils.animateTyping(btn, btnText);
        return btn;
    },

    insertDatePicker: async (module, step, positionElement, isEdit) => {
        const STEP_KEY = `step${step}`;
        const { moduleKey, moduleSteps } = module;
        const { key, message } = moduleSteps[STEP_KEY];
        const { savePropToSessionStorage, disableDatePicker, disableElement, animateTyping } =
            utils;

        const input = $("<input>").addClass("datepicker").attr("id", key);
        const label = $("<label>").attr("for", key);
        const button = $("<button>").append(label);

        positionElement.append(button).append(input);
        const datePicker = $(".datepicker").datepicker({
            todayHighlight: "TRUE",
            autoclose: true,
        });

        const changeDateHandler = async function (e) {
            const SELECTED_DATE = e.date;
            const DATE_OBJECT = new Date(SELECTED_DATE);
            const MONTH = (DATE_OBJECT.getMonth() + 1).toString().padStart(2, "0");
            const DAY = DATE_OBJECT.getDate().toString().padStart(2, "0");
            const YEAR = DATE_OBJECT.getFullYear();
            const FORMATTED_DATE = `${MONTH}/${DAY}/${YEAR}`;

            savePropToSessionStorage(moduleKey, key, message, FORMATTED_DATE, step);

            if (isEdit) return;
            disableElement(button);
            disableDatePicker(datePicker, changeDateHandler);
            messageHandler.insertMessage(FORMATTED_DATE, "outgoing");
        };

        datePicker.on("changeDate", changeDateHandler);

        if (isEdit) return;
        await animateTyping(label, "From here!");
    },

    insertOptionsDiv: async (positionElement) => {
        const div = $("<div>").addClass("message-options");
        positionElement.css("padding-bottom", "0");
        positionElement.css("border-radius", "0 10px 10px 0");
        positionElement.append(div);
        return div;
    },

    insertValue: async (module, step, isEdit) => {
        const STEP_KEY = `step${step}`;
        const { message, placeHolder, key, name } = module.moduleSteps[STEP_KEY];
        const { activeChatInput, resetChatInput, savePropToSessionStorage } = utils;
        const { sendMessageIcon, sendChatBtn } = elements;
        await handleMessageInsertion(message, "incoming");
        activeChatInput(placeHolder);

        const handleChatInput = async () => {
            const userMessage = chatInput.val().trim();
            if (!userMessage) return;
            resetChatInput();
            savePropToSessionStorage(module.moduleKey, key, name, userMessage, step);
            messageHandler.insertMessage(userMessage, "outgoing");
        };

        chatInput.on("keydown", (e) => {
            if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
                e.preventDefault();
                handleChatInput();
            }
        });

        sendMessageIcon.on("click", handleChatInput);
        sendChatBtn.on("click", handleChatInput);
    },

    insertAttachment: async (isEdit) => {},

    insertFetchedOptions: async (module, step, positionElement, isEdit) => {
        const stepKey = `step${step}`;
        if (true) {
            const { NO_SELECTION_MESSAGE, NO_VALUES_MESSAGE } = constants;
            await handleMessageInsertion(NO_VALUES_MESSAGE, "incoming");
            saveRequestInSessionStorage(
                module.moduleKey,
                module.moduleSteps[stepKey].key,
                module.moduleSteps[stepKey].name,
                NO_SELECTION_MESSAGE,
                step
            );
        } else {
        }
    },

    insertChosenSelect: async (module, step, isEdit) => {
        const stepKey = `step${step}`;
        const botMsg = await handleMessageInsertion(
            module.moduleSteps[stepKey].message,
            "incoming"
        );

        $(botMsg).css("row-gap", "10px");
        const defaultOptionText = module.moduleSteps[stepKey].defaultOption;
        const optionsList = module.moduleSteps[stepKey].options;

        var selectElement = $("<select>");
        var defaultOption = $("<option>")
            .attr("value", "")
            .text(defaultOptionText)
            .prop("disabled", true)
            .prop("selected", true);
        selectElement.append(defaultOption);

        optionsList.forEach((option) => {
            var optionElement = $("<option>").attr("value", option.value).text(option.text);
            selectElement.append(optionElement);
        });
        botMsg.append(selectElement);
        $(selectElement).chosen();
        $(selectElement).on("change", async (evt, params) => {
            $(selectElement).prop("disabled", true).trigger("chosen:updated");
            handleMessageInsertion(params.selected, "outgoing");
            saveRequestInSessionStorage(
                module.moduleKey,
                module.moduleSteps[stepKey].key,
                module.moduleSteps[stepKey].name,
                params.selected,
                step
            );
            handleModuleStepsCalls(module, step + 1);
        });

        return selectElement;
    },

    insertSummary: async () => {},
};

// Define module functions
const request = {
    nextStep: async (module, step) => {
        const stepKey = `step${step}`;
        const { type } = module.moduleSteps[stepKey] || {};
        const {
            insertDatePicker,
            insertChosenSelect,
            insertAttachment,
            insertValue,
            insertSummary,
            insertFetchedOptions,
        } = messageHandler;

        switch (type) {
            case "date":
                await insertDatePicker(module, step);
                break;
            case "value":
                await insertValue(module, step);
                break;
            case "options":
                await insertChosenSelect(module, step);
                break;
            case "attachments":
                await insertAttachment(module, step);
                break;
            case "fetchedOptions":
                await insertFetchedOptions(module, step);
                break;
            default:
                await insertSummary(module.moduleKey, module);
                return; // Return early for the "summary" case
        }

        await request.nextStep(module, step + 1);
    },
    edit: () => {},
    submit: () => {},
};

// Define form handling functions
const formHandler = {
    insertForm: async (message, module) => {
        // Insert a form into the chat box
    },
    handleFormSubmit: (event) => {
        // Handle form submission
    },
};

// Define interaction handling functions
const interactionHandler = {
    handleChatBotToggler: async () => {
        // Toggle the chatbot wrapper
    },
    handleWidthBtnToggler: () => {
        // Toggle the width of the chatbot window
    },
};

// Define initialization function
const init = () => {
    // Set up event listeners
    // Show starting main menu
};

// Initialize the chatbot
$(document).ready(init);
