// Define constants for DOM elements
const elements = {
    chatbotToggler: $("#chatbot .chatbot-toggle-btn"),
    closeBtn: $("#chatbot .close-btn"),
    sendChatBtn: $("#chatbot .send-message-btn"),
    chatBotWrapper: $("#chatbot"),
    chatInput: $("#chatbot .new-message textarea"),
    widthBtnToggler: $("#chatbot .width-toggler-btn"),
    chatBotWindow: $("#chatbot .chatbot-inner-window"),
    sendMessageIcon: $("#chatbot .new-message i"),
    attachmentInput: $("#chatbot #attachments-label input"),
    restartBtn: $("#chatbot .restart-btn"),
    header: $("#chatbot header"),
    chatBotStatus: $("#chatbot .chatbot-status"),
    chatBox: $("#chatbot .messages-list"),
    chatBotInputArea: $("#chatbot .new-message"),
    restartConfirmationMessage: $("#chatbot .restart-confirmation-message"),
    restartConfirmationMessageYesBtn: $(".restart-confirmation-message__yes"),
    restartConfirmationMessageNoBtn: $(".restart-confirmation-message__no"),
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
    MAX_ATTACHMENTS_NUM_MESSAGE:
        "You've reached the limit number of attachments, you can delete one to add another attachment",
    ZERO_ATTACHMENTS_NUM_MESSAGE:
        "You've to upload at least one file before going to the next step",
    NO_OPTIONS_FETCHED: "N/A",
    YES: "Yes",
    NO: "No",
    CHAT_INPUT_INITIAL_HEIGHT: elements.chatInput.scrollHeight,
    TYPING_SPEED: 0,
};

const icons = {
    ADD_ICON:
        '<svg fill="none" height="16" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg"><g fill="#17a13a"><path d="m6 1c-1.10457 0-2 .89543-2 2v2.20703c.32228-.09115.65659-.15366 1-.18461v-2.02242c0-.55228.44772-1 1-1h3v2.5c0 .82843.67157 1.5 1.5 1.5h2.5v7c0 .5523-.4477 1-1 1h-2.25716c-.31336.3794-.67663.7161-1.07976 1h3.33692c1.1046 0 2-.8954 2-2v-7.58579c0-.39782-.158-.77935-.4393-1.06066l-2.9143-2.91421c-.2813-.2813-.66279-.43934-1.06061-.43934zm6.7929 4h-2.2929c-.2761 0-.5-.22386-.5-.5v-2.29289z"/><path d="m10 10.5c0 2.4853-2.01472 4.5-4.5 4.5s-4.5-2.0147-4.5-4.5c0-2.48528 2.01472-4.5 4.5-4.5s4.5 2.01472 4.5 4.5zm-4-2c0-.27614-.22386-.5-.5-.5s-.5.22386-.5.5v1.5h-1.5c-.27614 0-.5.2239-.5.5s.22386.5.5.5h1.5v1.5c0 .2761.22386.5.5.5s.5-.2239.5-.5v-1.5h1.5c.27614 0 .5-.2239.5-.5s-.22386-.5-.5-.5h-1.5z"/></g></svg>',
    DELETE_ICON:
        '<svg height="8" viewBox="0 0 8 8" width="8" xmlns="http://www.w3.org/2000/svg"><path fill="red" d="m3 0c-.55 0-1 .45-1 1h-1c-.55 0-1 .45-1 1h7c0-.55-.45-1-1-1h-1c0-.55-.45-1-1-1zm-2 3v4.81c0 .11.08.19.19.19h4.63c.11 0 .19-.08.19-.19v-4.81h-1v3.5c0 .28-.22.5-.5.5s-.5-.22-.5-.5v-3.5h-1v3.5c0 .28-.22.5-.5.5s-.5-.22-.5-.5v-3.5h-1z"/></svg>',
};

const validation = {
    validateIsNumber: (val) => {
        if (val.trim().length === 0) {
            return { error: true, reason: "Input value is required" };
        }

        if (isNaN(Number(val))) {
            return { error: true, reason: "Input must be a valid number" };
        }

        return { error: false };
    },

    validateMin: (val, min) => {
        if (val.trim().length === 0) {
            return { error: true, reason: "Input value is required" };
        }

        if (isNaN(Number(val))) {
            return { error: true, reason: "Input must be a valid number" };
        }

        // Check if the input value is within the specified range
        if (val < min) {
            return { error: true, reason: `Input must be more than ${min}` };
        }

        // If all checks pass, return no error
        return { error: false };
    },
};

const requestModules = {
    leaveRequestModule: {
        moduleName: "leave request",
        moduleKey: "leaveRequestModule",
        moduleLabel: "Apply for leave",
        totalStepsNum: 7,
        moduleSteps: {
            // step1: {
            //     defaultOption: "Select one option",
            //     message: "Are you going abroad?",
            //     type: "options",
            //     name: "going abroad",
            //     key: "goingAbroad",
            //     stepNum: 1,
            //     options: [
            //         { value: "Yes", text: "Yes" },
            //         { value: "No", text: "No" },
            //     ],
            // },
            // step2: {
            //     defaultOption: "Select one option",
            //     message: "Do you need advanced payment?",
            //     type: "options",
            //     name: "advanced payment",
            //     key: "advancedPayment",
            //     stepNum: 2,
            //     options: [
            //         { value: "Yes", text: "Yes" },
            //         { value: "No", text: "No" },
            //     ],
            // },
            // step3: {
            //     type: "date",
            //     name: "starting date",
            //     message: "Pick your starting date",
            //     key: "startingDate",
            //     stepNum: 3,
            // },
            // step4: {
            //     message: "Please enter your number of days",
            //     placeHolder: "Enter your number of days",
            //     type: "value",
            //     name: "number of days",
            //     key: "numberOfDays",
            //     stepNum: 4,
            // },
            // step5: {
            //     defaultOption: "Select one option",
            //     message: "Please choose your leave type",
            //     type: "dropDown",
            //     name: "leave type",
            //     key: "leaveType",
            //     stepNum: 5,
            //     options: [
            //         { value: "Type 1", text: "Type 1" },
            //         { value: "Type 2", text: "Type 2" },
            //         { value: "Type 3", text: "Type 3" },
            //     ],
            // },
            step1: {
                message: "Do you want to upload any attachments?",
                type: "attachments",
                name: "attachment name",
                key: "attachmentName",
                maxNumberOfAttachments: 3,
                stepNum: 1,
            },
            // step7: {
            //     message: `Since you're ${constants.AST_VALUE} please deputize your approvals?`,
            //     type: "doubleDropDown",
            //     name: "deputize type",
            //     key: "deputizeType",
            //     stepNum: 7,
            //     options: [
            //         {
            //             value: "All locations",
            //             text: "All locations",
            //             subOptions: [
            //                 { value: "Option 1", text: "Option 1" },
            //                 { value: "Option 2", text: "Option 2" },
            //                 { value: "Option 3", text: "Option 3" },
            //             ],
            //         },
            //         {
            //             value: "Same location",
            //             text: "Same location",
            //             subOptions: [
            //                 { value: "Option 4", text: "Option 4" },
            //                 { value: "Option 5", text: "Option 5" },
            //                 { value: "Option 6", text: "Option 6" },
            //             ],
            //         },
            //         {
            //             value: "My manager",
            //             text: "My manager",
            //             subOptions: [],
            //         },
            //     ],
            // },
        },
    },
};
// Define utility functions
const utils = {
    scrollToBottom: () => elements.chatBox.scrollTop(elements.chatBox.prop("scrollHeight")),

    disableElement: (element) => {
        console.log(element);
        element.prop("disabled", true).css({
            color: "#ccc",
            "border-color": "#ccc",
        });
    },

    UnDisableElement: (element) =>
        element.prop("disabled", false).css({
            color: "#000",
            "border-color": "#000",
        }),

    disableDatePicker: (datePicker, callback) => {
        datePicker.datepicker("destroy");
        datePicker.off("changeDate", callback);
    },

    blurElements: (...elements) => {
        elements.forEach((element) => $(element).css("filter", "blur(5px)"));
    },

    removeBlur: (...elements) => {
        elements.forEach((element) => $(element).css("filter", "blur(0)"));
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

    saveDoublePropToSessionStorage: (
        reqName,
        propObjName,
        propName,
        propType,
        propVal,
        propState,
        step,
        notIncludedInSummary = false
    ) => {
        let req = JSON.parse(sessionStorage.getItem(reqName));
        if (!req[propObjName]) {
            req[propObjName] = {};
        }
        req[propObjName].name = propName;
        req[propObjName].type = propType;
        if (!req[propObjName].value) {
            req[propObjName].value = {}; // Initialize value property if not found
        }
        req[propObjName].value[propState] = propVal;
        req[propObjName].step = step;
        req[propObjName].notIncludedInSummary = notIncludedInSummary;
        sessionStorage.setItem(reqName, JSON.stringify(req));
    },

    getReqFromSessionStorage: (reqName) => {
        return JSON.parse(sessionStorage.getItem(reqName));
    },

    getAttachmentsAreaFromSessionStorage: (reqName) => {
        const req = utils.getReqFromSessionStorage(reqName);
        return req["attachment"]?.value || [];
    },

    // handleChangingAttachmentValue: (module, step, targetElement, isEdit) => {
    //     const FILE = $(targetElement)[0].files[0];
    //     const reader = new FileReader();
    //     reader.onload = async (event) => {
    //         const BINARY_STRING = event.target.result;
    //         const moduleKey = module.moduleKey;
    //         utils.savePropToSessionStorage(
    //             moduleKey,
    //             "attachment",
    //             "attachment",
    //             "attachments",
    //             { fileName: FILE.name, binary: BINARY_STRING },
    //             step
    //         );

    //         if (!isEdit) {
    //             await messageHandler.insertMessage(`You've uploaded: ${FILE.name}`, "incoming");
    //             await moduleRequest.moduleStepper(module, step + 1);
    //         }
    //     };
    //     reader.readAsBinaryString(FILE);
    // },

    // pre promises
    // handleChangingAttachmentValue: (module, step, targetElement, isEdit) => {
    //     const { getAttachmentsAreaFromSessionStorage, savePropToSessionStorage } = utils;
    //     const FILE = $(targetElement)[0].files[0];
    //     const reader = new FileReader();
    //     reader.onload = async (event) => {
    //         const BINARY_STRING = event.target.result;
    //         const moduleKey = module.moduleKey;
    //         const ATTACHMENTS_ARR = getAttachmentsAreaFromSessionStorage(module.moduleKey);
    //         ATTACHMENTS_ARR.push({ fileName: FILE.name, binary: BINARY_STRING });
    //         savePropToSessionStorage(
    //             moduleKey,
    //             "attachment",
    //             "attachment",
    //             "attachments",
    //             ATTACHMENTS_ARR,
    //             step
    //         );
    //     };
    //     reader.readAsBinaryString(FILE);
    // },

    // handleChangingAttachmentValue: (module, step, targetElement, isEdit) => {
    //     const { getAttachmentsAreaFromSessionStorage, savePropToSessionStorage } = utils;
    //     const FILE = $(targetElement)[0].files[0];

    //     return new Promise((resolve, reject) => {
    //         const reader = new FileReader();
    //         reader.onload = async (event) => {
    //             try {
    //                 const BINARY_STRING = event.target.result;
    //                 const moduleKey = module.moduleKey;
    //                 const ATTACHMENTS_ARR = getAttachmentsAreaFromSessionStorage(moduleKey);
    //                 ATTACHMENTS_ARR.push({ fileName: FILE.name, binary: BINARY_STRING });
    //                 savePropToSessionStorage(
    //                     moduleKey,
    //                     "attachment",
    //                     "attachment",
    //                     "attachments",
    //                     ATTACHMENTS_ARR,
    //                     step
    //                 );
    //                 resolve(); // Resolve the promise when processing is complete
    //             } catch (error) {
    //                 reject(error); // Reject the promise if there's an error
    //             }
    //         };

    //         reader.onerror = (event) => {
    //             reject(event.target.error); // Handle reader errors
    //         };

    //         reader.readAsBinaryString(FILE);
    //     });
    // },

    handleChangingAttachmentValue: (module, step, targetElement, isEdit) => {
        const { getAttachmentsAreaFromSessionStorage, savePropToSessionStorage } = utils;
        const FILE = $(targetElement)[0].files[0];

        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = async (event) => {
                try {
                    const BINARY_STRING = event.target.result;
                    const moduleKey = module.moduleKey;
                    const ATTACHMENTS_ARR = getAttachmentsAreaFromSessionStorage(moduleKey);

                    const randomId = Math.random().toString(36).substring(2, 10);

                    ATTACHMENTS_ARR.push({ fileId: randomId, fileName: FILE.name });

                    savePropToSessionStorage(
                        moduleKey,
                        "attachment",
                        "attachment",
                        "attachments",
                        ATTACHMENTS_ARR,
                        step
                    );

                    resolve();
                } catch (error) {
                    reject(error);
                }
            };

            reader.onerror = (event) => {
                reject(event.target.error);
            };

            reader.readAsBinaryString(FILE);
        });
    },
};

// Define message handling functions
const messageHandler = {
    insertMessage: async (message, className, step) => {
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

    insertStepValue: (chatLi, module, step) => {
        const STEP_INDICATOR = $("<i>").addClass("step-indicator");
        chatLi.append(STEP_INDICATOR);
        STEP_INDICATOR.text(`Step ${step} out of ${module.totalStepsNum}`);
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
            messageHandler.insertStepValue(botMessage, module, step);
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

    insertOptions: async (module, step, positionElement, isEdit, value) => {
        if (isEdit) {
            await messageHandler.insertChosenSelect(module, step, positionElement, isEdit, value);
        } else {
            const STEP_KEY = `step${step}`;
            const { insertMessage, insertOptionsDiv, insertButton } = messageHandler;
            const { options, message, key } = module.moduleSteps[STEP_KEY];

            const BOT_MESSAGE = await insertMessage(message, "incoming with-options");
            const OPTIONS_DIV = await insertOptionsDiv(BOT_MESSAGE);

            messageHandler.insertStepValue(BOT_MESSAGE, module, step);
            options.forEach(async (option) => {
                await insertButton(OPTIONS_DIV, option.text, () => {
                    const val = option.value;
                    utils.savePropToSessionStorage(
                        module.moduleKey,
                        key,
                        val,
                        "dropDown",
                        val,
                        step
                    );
                    const OPTIONS_BUTTONS = $(OPTIONS_DIV).find("button");
                    OPTIONS_BUTTONS.each(function () {
                        utils.disableElement($(this));
                    });
                    moduleRequest.moduleStepper(module, step + 1);
                });
            });
        }
    },

    insertValue: async (module, step, positionElement, isEdit, value) => {
        const STEP_KEY = `step${step}`;
        const { message, placeHolder, key, name, type } = module.moduleSteps[STEP_KEY];
        const { activeChatInput, resetChatInput, savePropToSessionStorage } = utils;
        const { sendMessageIcon, sendChatBtn, chatInput } = elements;

        // Remove existing event handlers
        chatInput.off("keydown");
        sendMessageIcon.off("click");
        sendChatBtn.off("click");

        if (!isEdit) {
            const BOT_MESSAGE = await messageHandler.insertMessage(message, "incoming");
            messageHandler.insertStepValue(BOT_MESSAGE, module, step);
            activeChatInput(placeHolder);
            const handleChatInput = async () => {
                const USER_VALUE = chatInput.val();
                const VALIDATE = validation.validateMin(USER_VALUE, 1);
                if (VALIDATE.error) {
                    const { reason } = VALIDATE;
                    alertify.notify(reason, "error", 5, function () {});
                } else {
                    resetChatInput();
                    savePropToSessionStorage(module.moduleKey, key, name, type, USER_VALUE, step);
                    await messageHandler.insertMessage(USER_VALUE, "outgoing");
                    await moduleRequest.moduleStepper(module, step + 1);
                }
            };

            chatInput.on("keydown", (e) => {
                if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
                    e.preventDefault();
                    handleChatInput();
                }
            });

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

        messageHandler.insertStepValue(BOT_MESSAGE, module, step);

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

    insertInputFile: (positionElement, module, step) => {
        const LABEL = $("<label>").addClass("attachment-label");
        const INPUT = $("<input>").attr({ type: "file" });
        let fileId;
        positionElement.append(LABEL);

        const DELETE_BUTTON = $("<button>").addClass("attachment-delete-button overlay-btn");
        const deleteSVG = $(icons.DELETE_ICON);
        DELETE_BUTTON.append(deleteSVG);
        LABEL.append(INPUT, DELETE_BUTTON);
        DELETE_BUTTON.click(() => {
            LABEL.remove();
            const ATTACHMENTS_ARR = utils.getAttachmentsAreaFromSessionStorage(module.moduleKey);
            const FILTERED_ARR = ATTACHMENTS_ARR.filter(
                (attachment) => attachment.fileId != fileId
            );
            utils.savePropToSessionStorage(
                module.moduleKey,
                "attachment",
                "attachment",
                "attachments",
                FILTERED_ARR,
                step
            );
        });

        INPUT.click(() => {
            window.onfocus = function () {
                setTimeout(async () => {
                    if (INPUT[0].files.length === 0) {
                        LABEL.remove();
                    } else {
                        await utils.handleChangingAttachmentValue(module, step, INPUT);
                        const ATTACHMENTS = utils.getAttachmentsAreaFromSessionStorage(
                            module.moduleKey
                        );
                        fileId = ATTACHMENTS[ATTACHMENTS.length - 1].fileId;
                        const FILE_NAME = ATTACHMENTS[ATTACHMENTS.length - 1].fileName;
                        INPUT.hide();
                        const FILE_ANCHOR = $("<a>")
                            .attr({
                                href: "/",
                                download: FILE_NAME,
                            })
                            .text(FILE_NAME);

                        LABEL.prepend(FILE_ANCHOR);
                    }
                }, 500);
                window.onfocus = null;
            };
        });

        INPUT.click();
    },

    insertAttachment: async (module, step, positionElement, isEdit, value) => {
        if (isEdit) {
            const STEP_KEY = `step${step}`;
            console.log("value", value);
            const INPUTS_AREA = $("<div>").addClass("attachments-list");
            positionElement.append(INPUTS_AREA);
            const ATTACHMENTS_NUM = value.length;
            const MAX_ATTACHMENTS_NUM = module.moduleSteps[STEP_KEY].maxNumberOfAttachments;

            const ADD_ATTACHMENT_BUTTON = $("<button>").addClass(
                "attachment-add-button overlay-btn"
            );
            const addSVG = $(icons.ADD_ICON);

            ADD_ATTACHMENT_BUTTON.append(addSVG);
            INPUTS_AREA.append(ADD_ATTACHMENT_BUTTON);
            ADD_ATTACHMENT_BUTTON.on("click", () => {
                if (ATTACHMENTS_NUM < MAX_ATTACHMENTS_NUM) {
                    insertInputFile(INPUTS_AREA, module, step);
                } else {
                    alertify.notify(constants.MAX_ATTACHMENTS_NUM_MESSAGE, "error", 5);
                }
            });

            value.forEach((file) => {
                const LABEL = $("<label>").addClass("attachment-label");
                const FILE_ID = file.fileId;
                INPUTS_AREA.append(LABEL);
                const DELETE_BUTTON = $("<button>").addClass(
                    "attachment-delete-button overlay-btn"
                );
                const deleteSVG = $(icons.DELETE_ICON);
                DELETE_BUTTON.append(deleteSVG);
                LABEL.append(DELETE_BUTTON);

                DELETE_BUTTON.click(() => {
                    LABEL.remove();
                    const ATTACHMENTS_ARR = utils.getAttachmentsAreaFromSessionStorage(
                        module.moduleKey
                    );
                    const FILTERED_ARR = ATTACHMENTS_ARR.filter(
                        (attachment) => attachment.fileId != FILE_ID
                    );
                    utils.savePropToSessionStorage(
                        module.moduleKey,
                        "attachment",
                        "attachment",
                        "attachments",
                        FILTERED_ARR,
                        step
                    );
                });

                const FILE_ANCHOR = $("<a>")
                    .attr({
                        href: "/",
                        download: file.fileName,
                    })
                    .text(file.fileName);

                LABEL.prepend(FILE_ANCHOR);
            });
        } else {
            const STEP_KEY = `step${step}`;
            const MAX_ATTACHMENTS_NUM = module.moduleSteps[STEP_KEY].maxNumberOfAttachments;

            const { insertMessage, insertInputFile, insertButton } = messageHandler;
            const ATTACHMENT_MESSAGE = await insertMessage(
                "Insert one or more attachment as you need:",
                "incoming"
            );
            const INPUTS_AREA = $("<div>").addClass("attachments-list");
            ATTACHMENT_MESSAGE.append(INPUTS_AREA);
            insertInputFile(INPUTS_AREA, module, step);
            const ADD_ATTACHMENT_BUTTON = $("<button>").addClass(
                "attachment-add-button overlay-btn"
            );
            const addSVG = $(icons.ADD_ICON);

            ADD_ATTACHMENT_BUTTON.append(addSVG);
            ATTACHMENT_MESSAGE.append(ADD_ATTACHMENT_BUTTON);
            ADD_ATTACHMENT_BUTTON.on("click", () => {
                const ATTACHMENTS_NUM = INPUTS_AREA.find("label").length;
                if (ATTACHMENTS_NUM < MAX_ATTACHMENTS_NUM) {
                    insertInputFile(INPUTS_AREA, module, step);
                } else {
                    alertify.notify(constants.MAX_ATTACHMENTS_NUM_MESSAGE, "error", 5);
                }
            });

            const nextStepBtnHandler = async () => {
                // await messageHandler.insertMessage(`You've uploaded: ${FILE.name}`, "incoming");
                const ATTACHMENTS = utils.getAttachmentsAreaFromSessionStorage(module.moduleKey);
                if (ATTACHMENTS.length === 0) {
                    alertify.notify(constants.ZERO_ATTACHMENTS_NUM_MESSAGE, "error", 5);
                } else {
                    let uploadedFilesMessage = `You've uploaded:\n`;
                    ATTACHMENTS.forEach((file, index) => {
                        if (index !== ATTACHMENTS.length - 1) {
                            uploadedFilesMessage += `${file.fileName},\n`;
                        } else {
                            uploadedFilesMessage += `${file.fileName}`;
                        }
                    });
                    await messageHandler.insertMessage(uploadedFilesMessage, "incoming");
                    debugger;
                    const ELEMENTS = ATTACHMENT_MESSAGE.find("button, input");
                    ELEMENTS.each((index, el) => {
                        utils.disableElement($(el));
                    });
                    await moduleRequest.moduleStepper(module, step + 1);
                }
            };

            const NEXT_STEP_BTN = await insertButton(
                ATTACHMENT_MESSAGE,
                "Next step",
                nextStepBtnHandler,
                true
            );
            NEXT_STEP_BTN.addClass("to-right-btn");
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
            messageHandler.insertStepValue(botMessage, module, step);
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

            utils.savePropToSessionStorage(moduleKey, key, name, "dropDown", params.selected, step);
            if (isEdit) return;
            $(SELECT_ELEMENT).prop("disabled", true).trigger("chosen:updated");
            insertMessage(params.selected, "outgoing");
            await moduleRequest.moduleStepper(module, step + 1);
        });

        return SELECT_ELEMENT;
    },

    insertDoubleChosenSelect: async (module, step, positionElement, isEdit, value) => {
        const { insertMessage, insertButton } = messageHandler;
        const STEP_KEY = `step${step}`;
        let botMessage, firstSelectChoice, secondSelectChoice, nextStepBtn;

        // Insert incoming message if not in edit mode
        if (!isEdit) {
            botMessage = await insertMessage(module.moduleSteps[STEP_KEY].message, "incoming");
            $(botMessage).css("row-gap", "10px");
            messageHandler.insertStepValue(botMessage, module, step);
        }

        // Get options list
        const OPTIONS_LIST = module.moduleSteps[STEP_KEY].options;

        // Create and append the first select element
        const FIRST_SELECT_ELEMENT = $("<select>");
        if (!isEdit) {
            const DEFAULT_OPTION_TEXT = module.moduleSteps[STEP_KEY].defaultOption;
            const DEFAULT_OPTION = $("<option>")
                .attr("value", "")
                .text(DEFAULT_OPTION_TEXT)
                .prop("disabled", true)
                .prop("selected", true);
            FIRST_SELECT_ELEMENT.append(DEFAULT_OPTION);
        }
        OPTIONS_LIST.forEach((option) => {
            const OPTION_ELEMENT = $("<option>").attr("value", option.value).text(option.text);
            if (isEdit && option.text == value.location) {
                OPTION_ELEMENT.prop("selected", true);
            }
            FIRST_SELECT_ELEMENT.append(OPTION_ELEMENT);
        });

        // Append the first select element to the bot message or form
        if (!isEdit) {
            botMessage.append(FIRST_SELECT_ELEMENT);
        } else {
            const FIRST_SELECT_LABEL = $("<label>").text(`${module.moduleSteps[STEP_KEY].name}:`);
            const FORM = positionElement.find("form");
            FIRST_SELECT_LABEL.append(FIRST_SELECT_ELEMENT);
            FORM.append(FIRST_SELECT_LABEL);
        }

        // Initialize the first select as chosen
        $(FIRST_SELECT_ELEMENT).chosen();

        // Handle change event for the first select
        $(FIRST_SELECT_ELEMENT).on("change", async (evt, params) => {
            const { moduleKey, moduleSteps } = module;
            const { key, name } = moduleSteps[STEP_KEY];

            // Clear options of the second select
            $(SECOND_SELECT_ELEMENT).empty();

            // Populate options of the second select based on the selection in the first select
            const SUB_OPTIONS =
                OPTIONS_LIST.find((option) => option.value === params.selected)?.subOptions || [];

            if (SUB_OPTIONS.length > 0) {
                const DEFAULT_OPTION_ELEMENT = $("<option>")
                    .attr("value", "N/A")
                    .text("Please select one option")
                    .prop("disabled", true)
                    .prop("selected", true);
                SECOND_SELECT_ELEMENT.append(DEFAULT_OPTION_ELEMENT);
                SUB_OPTIONS.forEach((subOption) => {
                    const SUB_OPTION_ELEMENT = $("<option>")
                        .attr("value", subOption.value)
                        .text(subOption.text);
                    SECOND_SELECT_ELEMENT.append(SUB_OPTION_ELEMENT);
                });
            } else {
                const DEFAULT_OPTION_ELEMENT = $("<option>")
                    .attr("value", "N/A")
                    .text("N/A")
                    .prop("disabled", true)
                    .prop("selected", true);
                SECOND_SELECT_ELEMENT.append(DEFAULT_OPTION_ELEMENT);
            }

            SECOND_SELECT_ELEMENT.trigger("chosen:updated");

            utils.saveDoublePropToSessionStorage(
                moduleKey,
                key,
                name,
                "doubleDropDown",
                params.selected,
                "location",
                step
            );

            secondSelectChoice = "N/A";
            utils.saveDoublePropToSessionStorage(
                moduleKey,
                key,
                name,
                "doubleDropDown",
                "N/A",
                "deputize",
                step
            );

            firstSelectChoice = params.selected;
            utils.UnDisableElement(nextStepBtn);
        });

        // Create the second select element and append it to the bot message or form
        const SECOND_SELECT_ELEMENT = $("<select>");
        if (isEdit && value) {
            const SUB_OPTIONS =
                OPTIONS_LIST.find((option) => option.value === value.location)?.subOptions || [];
            SUB_OPTIONS.forEach((subOption) => {
                const SUB_OPTION_ELEMENT = $("<option>")
                    .attr("value", subOption.value)
                    .text(subOption.text);
                if (isEdit && subOption.text == value.deputize) {
                    SUB_OPTION_ELEMENT.prop("selected", true);
                }
                SECOND_SELECT_ELEMENT.append(SUB_OPTION_ELEMENT);
            });
        }

        // Append the second select element to the bot message or form
        if (!isEdit) {
            botMessage.append(SECOND_SELECT_ELEMENT);
        } else {
            const SECOND_SELECT_LABEL = $("<label>").text(`${module.moduleSteps[STEP_KEY].name}:`);
            const FORM = positionElement.find("form");
            SECOND_SELECT_LABEL.append(SECOND_SELECT_ELEMENT);
            FORM.append(SECOND_SELECT_LABEL);
        }

        // Initialize the second select as chosen
        $(SECOND_SELECT_ELEMENT).chosen();

        $(SECOND_SELECT_ELEMENT).on("change", async (evt, params) => {
            const { moduleKey, moduleSteps } = module;
            const { key, name } = moduleSteps[STEP_KEY];

            utils.saveDoublePropToSessionStorage(
                moduleKey,
                key,
                name,
                "doubleDropDown",
                params.selected,
                "deputize",
                step
            );
            secondSelectChoice = params.selected;
        });

        if (!isEdit) {
            const handleNextStepBtn = async () => {
                const SELECTION_MESSAGE = `You've chose ${firstSelectChoice} and ${secondSelectChoice}`;
                insertMessage(SELECTION_MESSAGE, "outgoing");
                await moduleRequest.moduleStepper(module, step + 1);
                $(FIRST_SELECT_ELEMENT).prop("disabled", true).trigger("chosen:updated");
                $(SECOND_SELECT_ELEMENT).prop("disabled", true).trigger("chosen:updated");
            };
            nextStepBtn = await insertButton(botMessage, "Next step", handleNextStepBtn);
            utils.disableElement(nextStepBtn);
            nextStepBtn.addClass("to-right-btn");
        }

        return [FIRST_SELECT_ELEMENT, SECOND_SELECT_ELEMENT];
    },

    insertSummary: async (requestItemName, module) => {
        const { start, submit, edit } = moduleRequest;
        const { insertMessage, insertOptionsDiv, insertButton } = messageHandler;
        const { getReqFromSessionStorage, disableElement } = utils;
        const { SUBMIT, EDIT, BACK_TO_MENU, SUBMIT_REQUEST_MESSAGE } = constants;
        const SUMMARY = getReqFromSessionStorage(requestItemName);
        let summaryMessage = `Your ${module.moduleName} summary:\n`;
        console.log(SUMMARY);
        for (const key in SUMMARY) {
            if (SUMMARY.hasOwnProperty(key)) {
                if (key === "attachment") {
                    if (SUMMARY[key].value.length > 0) {
                        summaryMessage += `Attachments:\n`;
                        SUMMARY[key].value.forEach((file, index) => {
                            SUMMARY[key].value.forEach((file, index) => {
                                if (index !== SUMMARY[key].value.length - 1) {
                                    summaryMessage += `${file.fileName},\n`;
                                } else {
                                    summaryMessage += `${file.fileName}`;
                                }
                            });
                        });
                    }
                } else if (typeof SUMMARY[key].value !== "object") {
                    summaryMessage += `${SUMMARY[key].name}: ${SUMMARY[key].value}\n`;
                } else if (SUMMARY[key].value.location) {
                    summaryMessage += `Deputize from: ${SUMMARY[key].value.location}\n`;
                    summaryMessage += `Deputize: ${SUMMARY[key].value.deputize}\n`;
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
            insertDoubleChosenSelect,
            insertOptions,
        } = messageHandler;

        switch (type) {
            case "date":
                await insertDatePicker(module, step);
                break;
            case "value":
                await insertValue(module, step);
                break;
            case "dropDown":
                await insertChosenSelect(module, step);
                break;
            case "doubleDropDown":
                await insertDoubleChosenSelect(module, step);
                break;
            case "attachments":
                await insertAttachmentOption(module, step);
                break;
            case "fetchedOptions":
                await insertFetchedOptions(module, step);
                break;
            case "options":
                insertOptions(module, step);
                break;
            default:
                await insertSummary(module.moduleKey, module);
                break;
        }
    },

    moduleStepperEditMode: async (module, step, value, type, editMessage) => {
        const {
            insertDatePicker,
            insertChosenSelect,
            insertAttachment,
            insertValue,
            insertSummary,
            insertOptions,
            insertDoubleChosenSelect,
        } = messageHandler;
        switch (type) {
            case "date":
                await insertDatePicker(module, step, editMessage, true, value);
                break;
            case "value":
                await insertValue(module, step, editMessage, true, value);
                break;
            case "dropDown":
                await insertChosenSelect(module, step, editMessage, true, value);
                break;
            case "doubleDropDown":
                await insertDoubleChosenSelect(module, step, editMessage, true, value);
                break;
            case "options":
                await insertOptions(module, step, editMessage, true, value);
                break;
            case "attachments":
                await insertAttachment(module, step, editMessage, true, value);
                break;
            default:
                await insertSummary(module, step);
                break;
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
            .addClass("to-right-btn")
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
        const { chatBotWrapper, restartBtn } = elements;
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

    restartChat: () => {
        const { header, chatBotStatus, chatBox, chatBotInputArea, restartConfirmationMessage } =
            elements;
        restartConfirmationMessage.css("display", "flex");
        utils.blurElements(header, chatBotStatus, chatBox, chatBotInputArea);
    },

    cancelRestartMessage: () => {
        const { header, chatBotStatus, chatBox, chatBotInputArea, restartConfirmationMessage } =
            elements;
        restartConfirmationMessage.css("display", "none");
        utils.removeBlur(header, chatBotStatus, chatBox, chatBotInputArea);
    },
};

// Define initialization function
const init = () => {
    // Set up event listeners
    // Show starting main menu
    const {
        chatbotToggler,
        closeBtn,
        chatInput,
        widthBtnToggler,
        restartBtn,
        restartConfirmationMessageYesBtn,
        restartConfirmationMessageNoBtn,
        chatBox,
    } = elements;
    const { handleChatBotToggler, handleWidthBtnToggler, restartChat, cancelRestartMessage } =
        interactionHandler;

    widthBtnToggler.on("click", handleWidthBtnToggler);

    chatbotToggler.on("click", handleChatBotToggler);

    closeBtn.on("click", () => chatBotWrapper.removeClass("opened"));

    chatInput.on("input", () => {
        chatInput.css("height", "auto");
        chatInput.css("height", `${constants.CHAT_INPUT_INITIAL_HEIGHT}px`);
    });

    restartBtn.on("click", restartChat);

    restartConfirmationMessageYesBtn.on("click", () => {
        chatBox.empty();
        moduleRequest.start();
        cancelRestartMessage();
    });

    restartConfirmationMessageNoBtn.on("click", cancelRestartMessage);
};

// Initialize the chatbot
$(document).ready(init);
