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
    attachmentInput: $("#attachments-label input"),
};

// Define constants for messages and configurations
const constants = {
    STARTING_MESSAGE: "Hi there, How can I help you today?",
    AST_VALUE: "Payroll supervisor",
    NO_VALUES_MESSAGE: "Sorry, there're no values to select from",
    SUBMIT_REQUEST_MESSAGE: "Do you want to submit your request?",
    NO_SELECTION_MESSAGE: "None",
    SUBMIT: "Yes, submit!",
    EDIT: "Wait, I want to edit!",
    BACK_TO_MENU: "No, go back to main menu!",
    EDIT_MESSAGE: "Feel free to edit any fields from below and save to proceed",
    NO_OPTIONS_FETCHED: "N/A",
    YES: "Yes",
    NO: "No",
    CHAT_INPUT_INITIAL_HEIGHT: elements.chatInput.scrollHeight,
    TYPING_SPEED: 0,
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
                message: `Since you're ${constants.AST_VALUE} please deputize your approvals?`,
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
                options: [],
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
                    elements.chatBox.scrollTop(elements.chatBox.prop("scrollHeight"));
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
        propType,
        propVal,
        step,
        notIncludedInSummary = false
    ) => {
        const req = JSON.parse(sessionStorage.getItem(reqName));
        req[propObjName] = {};
        req[propObjName].name = propName;
        req[propObjName].type = propType;
        req[propObjName].value = propVal;
        req[propObjName].step = step;
        req[propObjName].notIncludedInSummary = notIncludedInSummary;
        sessionStorage.setItem(reqName, JSON.stringify(req));
    },
    getReqFromSessionStorage: (reqName) => {
        return JSON.parse(sessionStorage.getItem(reqName));
    },
    handleChangingAttachmentValue: (module, step, targetElement, isEdit) => {
        const FILE = $(targetElement)[0].files[0];
        const reader = new FileReader();
        reader.onload = async (event) => {
            const BINARY_STRING = event.target.result;
            const moduleKey = module.moduleKey;
            utils.savePropToSessionStorage(
                moduleKey,
                "attachment",
                "attachment",
                "attachments",
                { fileName: FILE.name, binary: BINARY_STRING },
                step
            );

            if (!isEdit) {
                await messageHandler.insertMessage(`You've uploaded: ${FILE.name}`, "incoming");
                await moduleRequest.moduleStepper(module, step + 1);
            }
        };
        reader.readAsBinaryString(FILE);
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

    insertButton: async (positionElement, btnText, btnClickHandler, active = false) => {
        const btn = $("<button>").addClass("list-btn");
        positionElement.append(btn);

        if (typeof btnClickHandler === "function") {
            btn.on("click", async () => {
                if (!active) {
                    btn.prop("disabled", true); // Disable button after click
                }
                await btnClickHandler();
            });
        }

        await utils.animateTyping(btn, btnText);
        return btn;
    },

    insertDatePicker: async (module, step, positionElement, isEdit, value) => {
        const STEP_KEY = `step${step}`;
        const { moduleKey, moduleSteps } = module;
        const { key, message, type } = moduleSteps[STEP_KEY];
        const { savePropToSessionStorage, disableDatePicker, disableElement, animateTyping } =
            utils;

        const INPUT = $("<input>").addClass("datepicker");
        const LABEL = $("<label>");
        const BUTTON = $("<button>");

        let botMessage, optionsDiv;

        if (!isEdit) {
            botMessage = await messageHandler.insertMessage(
                module.moduleSteps[STEP_KEY].message,
                "incoming"
            );
            $(botMessage).css("row-gap", "10px");
            optionsDiv = await messageHandler.insertOptionsDiv(botMessage);

            INPUT.attr("id", key);
            LABEL.attr("for", key);
            optionsDiv.append(BUTTON);
            BUTTON.append(LABEL);
            BUTTON.append(INPUT);
        } else {
            LABEL.text(`${module.moduleSteps[STEP_KEY].name}:`);
            const FORM = positionElement.find("form");
            FORM.append(LABEL);
            LABEL.append(INPUT);
            INPUT.val(value);
        }

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

            savePropToSessionStorage(moduleKey, key, message, type, FORMATTED_DATE, step);

            if (isEdit) return;
            disableElement(BUTTON);
            disableDatePicker(datePicker, changeDateHandler);
            await messageHandler.insertMessage(FORMATTED_DATE, "outgoing");
            await moduleRequest.moduleStepper(module, step + 1);
        };

        datePicker.on("changeDate", changeDateHandler);

        if (isEdit) return;
        await animateTyping(LABEL, "From here!");
    },

    insertOptionsDiv: async (positionElement) => {
        const div = $("<div>").addClass("message-options");
        positionElement.css("padding-bottom", "0");
        positionElement.css("border-radius", "0 10px 10px 0");
        positionElement.append(div);
        return div;
    },

    insertValue: async (module, step, positionElement, isEdit, value) => {
        debugger;
        const STEP_KEY = `step${step}`;
        const { message, placeHolder, key, name, type } = module.moduleSteps[STEP_KEY];
        const { activeChatInput, resetChatInput, savePropToSessionStorage } = utils;
        const { sendMessageIcon, sendChatBtn, chatInput } = elements;
        if (!isEdit) {
            await messageHandler.insertMessage(message, "incoming");
            activeChatInput(placeHolder);
            const handleChatInput = async () => {
                const userMessage = chatInput.val().trim();
                if (!userMessage) return;
                resetChatInput();
                savePropToSessionStorage(module.moduleKey, key, name, type, userMessage, step);
                await messageHandler.insertMessage(userMessage, "outgoing");
                await moduleRequest.moduleStepper(module, step + 1);
            };

            chatInput.on("keydown", (e) => {
                if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
                    e.preventDefault();
                    handleChatInput();
                }
            });

            sendMessageIcon.on("click", handleChatInput);
            sendChatBtn.on("click", handleChatInput);
        } else {
            const VALUE_INPUT = $("<input>").attr("type", "text"); // Create a new input element
            const INPUT_LABEL = $("<label>").text(name).append(VALUE_INPUT); // Append the input to the label
            const FORM = positionElement.find("form");
            FORM.append(INPUT_LABEL);
            VALUE_INPUT.val(value);

            VALUE_INPUT.on("change", function (e) {
                savePropToSessionStorage(module.moduleKey, key, name, type, e.target.value, step);
            });
        }
    },

    insertAttachmentOption: async (module, step) => {
        const { YES, NO } = constants;
        const { insertMessage, insertOptionsDiv, insertAttachment } = messageHandler;
        const STEP_KEY = `step${step}`;
        const { message } = module.moduleSteps[STEP_KEY];

        const BOT_MESSAGE = await insertMessage(message, "incoming");
        const OPTIONS_DIV = await insertOptionsDiv(BOT_MESSAGE);

        BOT_MESSAGE.append(OPTIONS_DIV);

        const yesOptionHandler = async () => {
            insertAttachment(module, step);

            const OPTIONS_BUTTONS = $(OPTIONS_DIV).find("button");
            OPTIONS_BUTTONS.each(function () {
                utils.disableElement($(this));
            });
        };

        const noOptionHandler = async () => {
            await insertMessage(constants.NO, "outgoing");

            const OPTIONS_BUTTONS = $(OPTIONS_DIV).find("button");
            OPTIONS_BUTTONS.each(function () {
                utils.disableElement($(this));
            });

            utils.savePropToSessionStorage(
                module.moduleKey,
                "attachment",
                "attachment",
                "attachments",
                {},
                step
            );
            await moduleRequest.moduleStepper(module, step + 1);
        };

        await messageHandler.insertButton(OPTIONS_DIV, YES, yesOptionHandler);
        await messageHandler.insertButton(OPTIONS_DIV, NO, noOptionHandler);
    },

    insertAttachment: async (module, step, positionElement, isEdit, value) => {
        if (isEdit) {
            const STEP_KEY = `step${step}`;

            const BLOB = new Blob([value.binary], { type: "application/octet-stream" });
            const FILE = new File([BLOB], value.fileName);
            const INPUT = $("<input>").attr("type", "file");
            const LABEL = $("<label>")
                .text(`${module.moduleSteps[STEP_KEY].name}:`)
                .css("width", "100%");
            LABEL.append(INPUT);

            const FORM = positionElement.find("form");
            FORM.append(LABEL);

            const FILES_LIST = new DataTransfer();
            FILES_LIST.items.add(FILE);
            if (value.fileName && value.binary) {
                INPUT[0].files = FILES_LIST.files;
            }

            INPUT.change((event) =>
                utils.handleChangingAttachmentValue(module, step, event.target, isEdit)
            );
        } else {
            elements.attachmentInput.click();
            elements.attachmentInput.change((event) =>
                utils.handleChangingAttachmentValue(module, step, event.target, isEdit)
            );
        }
    },

    insertFetchedOptions: async (module, step, positionElement, isEdit) => {
        if (true) {
            const { NO_OPTIONS_FETCHED, NO_VALUES_MESSAGE } = constants;
            await messageHandler.insertMessage(NO_VALUES_MESSAGE, "incoming");
            const STEP_KEY = `step${step}`;
            const { key, name } = module.moduleSteps[STEP_KEY];
            utils.savePropToSessionStorage(
                module.moduleKey,
                key,
                name,
                "fetchedOptions",
                NO_OPTIONS_FETCHED,
                step
            );
            await moduleRequest.moduleStepper(module, step + 1);
        } else {
        }
    },

    insertChosenSelect: async (module, step, positionElement, isEdit, value) => {
        const { insertMessage } = messageHandler;
        const STEP_KEY = `step${step}`;
        let botMessage;
        if (!isEdit) {
            botMessage = await insertMessage(module.moduleSteps[STEP_KEY].message, "incoming");
            $(botMessage).css("row-gap", "10px");
        }
        const OPTIONS_LIST = module.moduleSteps[STEP_KEY].options;

        const SELECT_ELEMENT = $("<select>");

        if (!isEdit) {
            const DEFAULT_OPTION_TEXT = module.moduleSteps[STEP_KEY].defaultOption;
            const DEFAULT_OPTION = $("<option>")
                .attr("value", "")
                .text(DEFAULT_OPTION_TEXT)
                .prop("disabled", true)
                .prop("selected", true);
            SELECT_ELEMENT.append(DEFAULT_OPTION);
        }

        OPTIONS_LIST.forEach((option) => {
            const OPTION_ELEMENT = $("<option>").attr("value", option.value).text(option.text);
            if (isEdit && option.text === value) {
                OPTION_ELEMENT.prop("selected", true);
            }
            SELECT_ELEMENT.append(OPTION_ELEMENT);
        });
        if (OPTIONS_LIST.length == 0) {
            const OPTION_ELEMENT = $("<option>").attr("value", "N/A").text("N/A");
            SELECT_ELEMENT.append(OPTION_ELEMENT);
        }
        if (isEdit) {
            const SELECT_LABEL = $("<label>").text(`${module.moduleSteps[STEP_KEY].name}:`);
            const FORM = positionElement.find("form");
            SELECT_LABEL.append(SELECT_ELEMENT);
            FORM.append(SELECT_LABEL);
        } else {
            botMessage.append(SELECT_ELEMENT);
        }
        $(SELECT_ELEMENT).chosen();
        $(SELECT_ELEMENT).on("change", async (evt, params) => {
            const { moduleKey, moduleSteps } = module;
            const { key, name } = moduleSteps[STEP_KEY];

            utils.savePropToSessionStorage(moduleKey, key, name, "options", params.selected, step);
            if (isEdit) return;
            $(SELECT_ELEMENT).prop("disabled", true).trigger("chosen:updated");
            insertMessage(params.selected, "outgoing");
            await moduleRequest.moduleStepper(module, step + 1);
        });

        return SELECT_ELEMENT;
    },

    insertSummary: async (requestItemName, module) => {
        const { start, submit, edit } = moduleRequest;
        const { insertMessage, insertOptionsDiv, insertButton } = messageHandler;
        const { getReqFromSessionStorage, disableElement } = utils;
        const { SUBMIT, EDIT, BACK_TO_MENU, SUBMIT_REQUEST_MESSAGE } = constants;
        const SUMMARY = getReqFromSessionStorage(requestItemName);
        let summaryMessage = `Your ${module.moduleName} summary:\n`;
        for (const key in SUMMARY) {
            if (SUMMARY.hasOwnProperty(key)) {
                if (typeof SUMMARY[key].value !== "object") {
                    summaryMessage += `${SUMMARY[key].name}: ${SUMMARY[key].value}\n`;
                } else {
                    // in case of attachment
                    summaryMessage += `${SUMMARY[key].name}: ${SUMMARY[key].value.fileName}\n`;
                }
            }
        }

        await insertMessage(summaryMessage, "incoming");

        const SUBMIT_REQUEST = await insertMessage(SUBMIT_REQUEST_MESSAGE, "incoming");
        const USER_OPTIONS = await insertOptionsDiv(SUBMIT_REQUEST);

        await insertButton(USER_OPTIONS, SUBMIT, () => {
            disableElement($(USER_OPTIONS).find("button"));
            submit(module);
        });

        await insertButton(USER_OPTIONS, EDIT, () => {
            disableElement($(USER_OPTIONS).find("button"));
            edit(module);
        });
        await insertButton(USER_OPTIONS, BACK_TO_MENU, async () => {
            disableElement($(USER_OPTIONS).find("button"));
            await insertMessage(BACK_TO_MENU, "outgoing");
            start();
        });
    },
};

// Define module functions
const moduleRequest = {
    start: async () => {
        const { insertMessage, insertOptionsDiv, insertButton } = messageHandler;
        const MESSAGE = await insertMessage(constants.STARTING_MESSAGE, "incoming with-options");
        const OPTIONS_DIV = await insertOptionsDiv(MESSAGE);

        for (const key in requestModules) {
            if (requestModules.hasOwnProperty(key)) {
                const MODULE = requestModules[key]; // Access the module directly
                await insertButton(OPTIONS_DIV, MODULE.moduleLabel, () => {
                    moduleRequest.applyForModule(MODULE);
                });
            }
        }
    },

    applyForModule: async (module) => {
        const MODULE_OBJECT = {};
        sessionStorage.setItem(module.moduleKey, JSON.stringify(MODULE_OBJECT));
        // problem here
        await messageHandler.insertMessage(module.moduleLabel, "outgoing");
        await moduleRequest.moduleStepper(module, 1);
    },

    moduleStepper: async (module, step) => {
        const stepKey = `step${step}`;
        const { type } = module.moduleSteps[stepKey] || {};
        const {
            insertDatePicker,
            insertChosenSelect,
            insertAttachmentOption,
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
                await insertAttachmentOption(module, step);
                break;
            case "fetchedOptions":
                await insertFetchedOptions(module, step);
                break;
            default:
                await insertSummary(module.moduleKey, module);
                break; // Return early for the "summary" case
        }
    },

    moduleStepperEditMode: async (module, step, value, type, editMessage) => {
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
                debugger;
                await insertDatePicker(module, step, editMessage, true, value);
                break;
            case "value":
                debugger;
                await insertValue(module, step, editMessage, true, value);
                break;
            case "options":
                await insertChosenSelect(module, step, editMessage, true, value);
                break;
            case "attachments":
                await insertAttachment(module, step, editMessage, true, value);
                break;
            case "fetchedOptions":
                // await insertFetchedOptions(module, step, editMessage, true, value);
                await insertChosenSelect(module, step, editMessage, true, value);
                break;
            default:
                await insertSummary(module, step);
                break; // Return early for the "summary" case
        }
    },

    edit: async (module) => {
        const FORM = $("<form>").addClass("module-edit-form");
        const MODULE_KEY = module.moduleKey;
        const REQUEST_DATA = utils.getReqFromSessionStorage(MODULE_KEY);
        const EDIT_MESSAGE = await messageHandler.insertMessage(constants.EDIT_MESSAGE, "incoming");
        EDIT_MESSAGE.append(FORM);

        for (const KEY in REQUEST_DATA) {
            console.log("REQUEST_DATA", REQUEST_DATA);
            if (REQUEST_DATA.hasOwnProperty(KEY)) {
                const { value, type, step } = REQUEST_DATA[KEY];
                await moduleRequest.moduleStepperEditMode(module, step, value, type, EDIT_MESSAGE);
            }
        }

        const SUBMIT_BTN = $("<button>")
            .addClass("module-edit-form__submit-btn")
            .attr("type", "submit")
            .text("Save");

        const DIV = $("<div>");
        DIV.append(SUBMIT_BTN).css("width", "100%");
        DIV.append(SUBMIT_BTN);
        FORM.append(DIV);

        FORM.on("submit", (event) => {
            event.preventDefault();
            messageHandler.insertSummary(MODULE_KEY, module);
            const $elements = $("select, input, button");
            $elements.each(function () {
                utils.disableElement($(this));
            });
        });
    },

    submit: () => {
        console.log("submit");
    },
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
        const { chatBotWrapper } = elements;
        chatBotWrapper.toggleClass("opened");
        if (!chatBotWrapper.hasClass("loaded")) {
            chatBotWrapper.addClass("loaded");
            moduleRequest.start();
        }
    },

    handleWidthBtnToggler: () => {
        const { widthBtnToggler, chatBotWindow } = elements;
        $(widthBtnToggler).toggleClass("minimized").toggleClass("maximized");
        if ($(widthBtnToggler).hasClass("minimized")) {
            $(chatBotWindow).css("width", "420px");
        } else {
            const minWidth = Math.min(800, $(window).width() - 70);
            $(chatBotWindow).css("width", minWidth + "px");
        }
        $(widthBtnToggler).toggleClass("rotated");
    },
};

// Define initialization function
const init = () => {
    // Set up event listeners
    // Show starting main menu
    const { chatbotToggler, closeBtn, chatInput, widthBtnToggler } = elements;
    const { handleChatBotToggler, handleWidthBtnToggler, chatBotWrapper } = interactionHandler;

    widthBtnToggler.on("click", handleWidthBtnToggler);

    chatbotToggler.on("click", handleChatBotToggler);

    closeBtn.on("click", () => chatBotWrapper.removeClass("opened"));

    chatInput.on("input", () => {
        chatInput.css("height", "auto");
        chatInput.css("height", `${constants.CHAT_INPUT_INITIAL_HEIGHT}px`);
    });
};

// Initialize the chatbot
$(document).ready(init);
