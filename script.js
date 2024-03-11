$(document).ready(function () {
    const chatbotToggler = $(".chatbot-toggle-btn");
    const closeBtn = $(".close-btn");
    const chatBox = $(".messages-list");
    const sendChatBtn = $(".send-message-btn");
    const chatBotWrapper = $("#chatbot");
    const STARTING_MESSAGE = "Hi there, How can I help you today?";
    let userMessage = null;
    const chatInput = $(".new-message textarea");
    const inputInitialHeight = chatInput.scrollHeight;
    const AST_VALUE = "Payroll supervisor";
    const NO_VALUES_MESSAGE = "Sorry, there're no values to select from";
    const SUBMIT_REQUEST_MESSAGE = "Do you want to submit your request?";
    const leaveRequestModule = {
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
    };

    const HandleOptionsDivInsertion = async (parentMessage) => {
        const optionsDiv = $("<div>").addClass("message-options");
        parentMessage.css("padding-bottom", "0");
        parentMessage.css("border-radius", "0 10px 10px 0");
        parentMessage.append(optionsDiv);
        return optionsDiv;
    };

    const disabledButtonsWithinParent = (parentElement) => {
        parentElement.find("button").prop("disabled", true);
    };

    const saveRequestInSessionStorage = (
        requestNameInSessionStorage,
        propertyObjectName,
        propertyName,
        propertyValue,
        step,
        notIncludedInSummary = false
    ) => {
        const request = JSON.parse(sessionStorage.getItem(requestNameInSessionStorage));
        request[propertyObjectName] = {};
        request[propertyObjectName].name = propertyName;
        request[propertyObjectName].value = propertyValue;
        request[propertyObjectName].step = step;
        request[propertyObjectName].notIncludedInSummary = notIncludedInSummary;
        sessionStorage.setItem(requestNameInSessionStorage, JSON.stringify(request));
    };

    const typeWriterAnimationHandler = (targetElement, textContent, speed) => {
        let charIndex = 0;
        return new Promise((resolve, reject) => {
            function type() {
                if (charIndex < textContent.length) {
                    targetElement.text(targetElement.text() + textContent.charAt(charIndex));
                    charIndex++;
                    setTimeout(type, speed);
                } else {
                    chatBox.scrollTop(chatBox.prop("scrollHeight"));
                    resolve();
                }
            }
            type();
        });
    };

    const handleMessageInsertion = async (message, className) => {
        const chatLi = $("<li>").addClass("chat").addClass(className);
        let chatContent = `${message}`;

        return new Promise(async (resolve, reject) => {
            if (className !== "incoming" && className !== "incoming with-options") {
                chatBox.append(chatLi);
                chatBox.scrollTop(chatBox.prop("scrollHeight"));

                chatLi.html(chatContent);
                resolve(chatLi);
            } else {
                setTimeout(async () => {
                    chatBox.append(chatLi);
                    chatBox.scrollTop(chatBox.prop("scrollHeight"));
                    await typeWriterAnimationHandler(chatLi, chatContent, 13);
                    resolve(chatLi);
                }, 600);
            }
        });
    };

    const handleButtonInsertion = async (positionElement, btnText, btnClickHandler) => {
        const button = $("<button>").addClass("list-btn");
        positionElement.append(button);
        if (typeof btnClickHandler === "function") {
            const clickHandler = async function () {
                await btnClickHandler();
                button.prop("disabled", true);
                // Remove the click event handler after it's been executed
                button.off("click", clickHandler);
            };
            button.on("click", clickHandler);
        }
        await typeWriterAnimationHandler(button, btnText, 13);
        return button;
    };

    const handleDatePickerInsertion = async (module, step) => {
        const stepKey = `step${step}`;
        const moduleKey = module.moduleKey;
        const key = module.moduleSteps[stepKey].key;
        const message = module.moduleSteps[stepKey].message;

        const botMsg = await handleMessageInsertion(message, "incoming");

        const optionsDiv = await HandleOptionsDivInsertion(botMsg);
        const input = $("<input>").addClass("datepicker").attr("id", key);
        const label = $("<label>").attr("for", key);
        const button = $("<button>");

        button.append(label);
        optionsDiv.append(button);
        optionsDiv.append(input);

        const datePicker = $(".datepicker");

        // Initialize the datepicker
        datePicker.datepicker({
            todayHighlight: "TRUE",
            autoclose: true,
        });

        // Add event listener for changeDate event
        const changeDateHandler = async function (e) {
            const selectedDate = e.date;
            const dateObject = new Date(selectedDate);
            const month = (dateObject.getMonth() + 1).toString().padStart(2, "0");
            const day = dateObject.getDate().toString().padStart(2, "0");
            const year = dateObject.getFullYear();
            const formattedDate = `${month}/${day}/${year}`;
            saveRequestInSessionStorage(moduleKey, key, message, formattedDate, step);
            button.prop("disabled", true);
            // Destroy the datepicker
            datePicker.datepicker("destroy");
            // Remove the changeDate event handler
            datePicker.off("changeDate", changeDateHandler);

            await handleMessageInsertion(formattedDate, "outgoing");
            // call next step
            await handleModuleStepsCalls(module, step + 1);
        };

        // Add event listener for changeDate event
        datePicker.on("changeDate", changeDateHandler);

        await typeWriterAnimationHandler(label, "From here!", 13);
    };

    const handleSubmitTheRequest = () => {};

    const getRequestFromSessionStorage = (requestNameInSessionStorage) => {
        return JSON.parse(sessionStorage.getItem(requestNameInSessionStorage));
    };

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

    const handleEditOptionStepValue = async (form, value, module, step) => {
        const stepKey = `step${step}`;
        const optionsList = module.moduleSteps[stepKey].options;
        const label = $("<label>").text(`${module.moduleSteps[stepKey].name}:`);
        const selectElement = $("<select>");

        optionsList.forEach((option) => {
            const optionElement = $("<option>").attr("value", option.value).text(option.text);
            if (option.text === value) {
                optionElement.prop("selected", true); // Set the selected attribute
            }
            selectElement.append(optionElement);
        });
        label.append(selectElement);
        form.append(label);

        $(selectElement).chosen();
        // $(selectElement).on("change", async (evt, params) => {
        //     saveRequestInSessionStorage(
        //         module.moduleKey,
        //         module.moduleSteps[stepKey].key,
        //         module.moduleSteps[stepKey].name,
        //         params.selected,
        //         step
        //     );
        // });

        return selectElement;
    };
    const handleEditDateStepValue = async (form, value, module, step) => {
        debugger;
        const stepKey = `step${step}`;
        const input = $("<input>").addClass("datepicker");
        const label = $("<label>").text(`${module.moduleSteps[stepKey].name}:`);

        label.append(input);
        form.append(label);

        const datePicker = $(".datepicker");

        // Initialize the datepicker
        input.datepicker({
            autoclose: true,
        });

        const [day, month, year] = value.split("/").map(Number); // Parse the selected value into day, month, and year components
        const selectedDate = new Date(year, month - 1, day); // Create a new Date object using these components
        // datePicker.datepicker("setDate", selectedDate); // Set the selected date in the date picker
        input.val(value);
        // const changeDateHandler = async function (e) {
        //     const selectedDate = e.date;
        //     const dateObject = new Date(selectedDate);
        //     const month = (dateObject.getMonth() + 1).toString().padStart(2, "0");
        //     const day = dateObject.getDate().toString().padStart(2, "0");
        //     const year = dateObject.getFullYear();
        //     const formattedDate = `${month}/${day}/${year}`;
        //     // saveRequestInSessionStorage(moduleKey, key, message, formattedDate, step);
        // };

        // // Add event listener for changeDate event
        // datePicker.on("changeDate", changeDateHandler);
    };
    const handleEditValueStepValue = async (form, value, module, step) => {
        const input = $("<input>").addClass("datepicker").val(value);
        const label = $("<label>").text("file name");

        label.append(input);
        form.append(label);

        // input.on("change", function(e) {
        //     saveRequestInSessionStorage(
        //         module.moduleKey,
        //         module.moduleSteps[stepKey].key,
        //         module.moduleSteps[stepKey].name,
        //         e.target.value,
        //         step
        //     );
        // });
    };
    const handleEditAttachmentStepValue = async (form, value, module, step) => {
        debugger;
        const stepKey = `step${step}`;
        const input = $("<input>").attr("type", "hidden").val(value.binaryString);
        const label = $("<label>").text(`${module.moduleSteps[stepKey].name}:`);

        label.append(input);
        form.append(label);

        // input.on("change", function() {
        //     saveRequestInSessionStorage(
        //         module.moduleKey,
        //         module.moduleSteps[stepKey].key,
        //         module.moduleSteps[stepKey].name,
        //         userMessage,
        //         step
        //     );
        // });
    };
    const handleEditFetchedOptionStepValue = async (form, value, module, step) => {
        const stepKey = `step${step}`;
        const label = $("<label>").text(`${module.moduleSteps[stepKey].name}:`);
        const selectElement = $("<select>");
        const optionElement = $("<option>").attr("value", value).text(value).prop("selected", true);
        selectElement.append(optionElement);
        label.append(selectElement);
        form.append(label);
        $(selectElement).chosen();
    };
    const handleFormInsertion = async (message, module) => {
        const form = $("<form>").addClass("module-edit-form");
        const moduleKey = module.moduleKey;
        const req = getRequestFromSessionStorage(moduleKey);

        for (const key in req) {
            if (req.hasOwnProperty(key)) {
                const step = req[key].step;
                const value = req[key].value;
                const stepKey = `step${step}`;
                const type = module.moduleSteps[stepKey]?.type || null;

                switch (type) {
                    case "date":
                        await handleEditDateStepValue(form, value, module, step);
                        break;
                    case "value":
                        await handleEditValueStepValue(form, value, module, step);
                        break;
                    case "options":
                        await handleEditOptionStepValue(form, value, module, step);
                        break;
                    case "attachments":
                        await handleEditAttachmentStepValue(form, value, module, step);
                        break;
                    case "fetchedOptions":
                        await handleEditFetchedOptionStepValue(form, value, module, step);
                        break;
                    default:
                        break;
                }
            }
        }

        const submitBtn = $("<button>")
            .addClass("module-edit-form__submit-btn")
            .attr("type", "submit");
        form.append(submitBtn);
        message.append(form);
    };

    const handleEditTheRequest = async (module) => {
        const botMsg = await handleMessageInsertion(
            "Feel free to edit any fields from below and save to proceed",
            "incoming"
        );
        await handleFormInsertion(botMsg, module);
    };

    const showRequestSummary = async (requestItemName, module) => {
        const summary = JSON.parse(sessionStorage.getItem(requestItemName));
        let leaveSummaryMessage = "Your leave request summary:\n";
        for (const key in summary) {
            if (summary.hasOwnProperty(key)) {
                if (typeof summary[key].value !== "object") {
                    leaveSummaryMessage += `${summary[key].name}: ${summary[key].value}\n`;
                } else {
                    leaveSummaryMessage += `${summary[key].name}: ${summary[key].value.fileName}\n`;
                }
            }
        }

        await handleMessageInsertion(leaveSummaryMessage, "incoming");

        const systemUploadAnyAttach = await handleMessageInsertion(
            SUBMIT_REQUEST_MESSAGE,
            "incoming"
        );
        const optionsDiv = await HandleOptionsDivInsertion(systemUploadAnyAttach);
        await handleButtonInsertion(optionsDiv, "Yes, submit!", () => {
            $(optionsDiv).find("button").prop("disabled", true);
            handleSubmitTheRequest(module);
        });
        await handleButtonInsertion(optionsDiv, "Wait, I want to edit!", () => {
            $(optionsDiv).find("button").prop("disabled", true);
            handleEditTheRequest(module);
        });
        await handleButtonInsertion(optionsDiv, "No, go back to main menu!", async () => {
            $(optionsDiv).find("button").prop("disabled", true);
            await handleMessageInsertion("No, go back to main menu!", "outgoing");
            handleStartingMainMenu();
        });
    };

    const handleYesInsert = async (parentMsg, module, step) => {
        await handleMessageInsertion("Yes", "outgoing");

        $("#attachments-label input").click();
        $("#attachments-label input").change(function () {
            var file = $(this)[0].files[0];
            var reader = new FileReader();
            reader.onload = async (event) => {
                var binaryString = event.target.result;
                await handleMessageInsertion(`You've uploaded: ${file.name}`, "incoming");
                const moduleKey = module.moduleKey;
                const stepKey = `step${step}`;
                const key = module.moduleSteps[stepKey].key;
                saveRequestInSessionStorage(
                    moduleKey,
                    "attachmentFileName",
                    "attachment name",
                    { fileName: file.name, binary: binaryString },
                    step
                );

                await handleModuleStepsCalls(module, step + 1);
            };
            reader.readAsBinaryString(file);
            disabledButtonsWithinParent(parentMsg);
        });
    };

    const handleDoNotInsert = async (parentMsg, module, step) => {
        await handleMessageInsertion("No", "outgoing");
        disabledButtonsWithinParent(parentMsg);
        await handleModuleStepsCalls(module, step + 1);
    };

    const handleInsertingSelect = async (module, step) => {
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
    };

    const handleInsertingAttachmentStep = async (module, step) => {
        const systemUploadAnyAttach = await handleMessageInsertion(
            module.moduleSteps[`step${step}`].message,
            "incoming"
        );

        const optionsDiv = await HandleOptionsDivInsertion(systemUploadAnyAttach);

        await handleButtonInsertion(optionsDiv, "Yes", () =>
            handleYesInsert(optionsDiv, module, step)
        );
        await handleButtonInsertion(optionsDiv, "No", () =>
            handleDoNotInsert(optionsDiv, module, step)
        );
    };

    const handleModuleStepsCalls = async (module, step) => {
        const stepKey = `step${step}`;
        const type = module.moduleSteps[stepKey]?.type || null;

        switch (type) {
            case "date":
                await handleDatePickerInsertion(module, step);
                break;
            case "value":
                await handleValueInsertion(module, step);
                break;
            case "options":
                await handleInsertingSelect(module, step);
                break;
            case "attachments":
                await handleInsertingAttachmentStep(module, step);
                break;
            case "fetchedOptions":
                await handleFetchOptions(module, step);
                break;
            default:
                await showRequestSummary(module.moduleKey, module);
                break;
        }
    };

    const handleFetchOptions = async (module, step) => {
        const stepKey = `step${step}`;
        if (true) {
            await handleMessageInsertion(NO_VALUES_MESSAGE, "incoming");
            saveRequestInSessionStorage(
                module.moduleKey,
                module.moduleSteps[stepKey].key,
                module.moduleSteps[stepKey].name,
                "No deputize",
                step
            );

            handleModuleStepsCalls(module, step + 1);
        } else {
            // const botMsg = await handleMessageInsertion(
            //     module.moduleSteps[stepKey].message,
            //     "incoming"
            // );
            // $(botMsg).css("row-gap", "10px");
            // const defaultOptionText = module.moduleSteps[stepKey].defaultOption;
            // var selectElement = $("<select>");
            // var defaultOption = $("<option>")
            //     .attr("value", "")
            //     .text(defaultOptionText)
            //     .prop("disabled", true)
            //     .prop("selected", true);
            // selectElement.append(defaultOption);
            // const optionsList = module.moduleSteps[stepKey].options;
            // optionsList.forEach((option) => {
            //     var optionElement = $("<option>").attr("value", option.value).text(option.text);
            //     selectElement.append(optionElement);
            // });
            // botMsg.append(selectElement);
            // $(selectElement).chosen();
            // $(selectElement).on("change", async (evt, params) => {
            //     $(selectElement).prop("disabled", true).trigger("chosen:updated");
            //     handleMessageInsertion(params.selected, "outgoing");
            //     saveRequestInSessionStorage(
            //         module.moduleKey,
            //         module.moduleSteps[stepKey].key,
            //         module.moduleSteps[stepKey].name,
            //         params.selected,step,
            //     );
            //     handleModuleStepsCalls(module, step + 1);
            // });
        }
    };

    const handleValueInsertion = async (module, step) => {
        let stepKey = `step${step}`;
        await handleMessageInsertion(module.moduleSteps[stepKey].message, "incoming"); // next step

        $(chatInput).prop("disabled", false);
        $(".new-message i").css("display", "block");
        $(chatInput).prop("placeholder", module.moduleSteps[stepKey].placeHolder);
        $(chatInput).focus();
        const handleChatInsertion = async () => {
            userMessage = chatInput.val().trim();
            if (!userMessage) return;
            chatInput.val("");
            chatInput.css("height", `${inputInitialHeight}px`);
            $(chatInput).prop("placeholder", "");
            $(chatInput).prop("disabled", false);
            chatBox.scrollTop(chatBox.prop("scrollHeight"));
            chatInput.off("keydown");
            chatInput.prop("disabled", true);
            sendChatBtn.off("click");
            $(".new-message i").css("display", "none");

            saveRequestInSessionStorage(
                module.moduleKey,
                module.moduleSteps[stepKey].key,
                module.moduleSteps[stepKey].name,
                userMessage,
                step
            );

            handleMessageInsertion(userMessage, "outgoing");

            await handleModuleStepsCalls(module, step + 1);
        };
        chatInput.on("keydown", (e) => {
            if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
                e.preventDefault();
                handleChatInsertion();
            }
        });
        $(".new-message i").on("click", handleChatInsertion);

        sendChatBtn.on("click", handleChatInsertion);
    };

    const handleApplyForLeave = async () => {
        const applyForLeaveBody = {};
        sessionStorage.setItem(leaveRequestModule.moduleKey, JSON.stringify(applyForLeaveBody));
        handleMessageInsertion(leaveRequestModule.moduleLabel, "outgoing");
        handleModuleStepsCalls(leaveRequestModule, 1);
    };

    const handleStartingMainMenu = async () => {
        const message = await handleMessageInsertion(STARTING_MESSAGE, "incoming with-options");
        const optionsDiv = await HandleOptionsDivInsertion(message);
        // apply for leave module
        await handleButtonInsertion(
            optionsDiv,
            leaveRequestModule.moduleLabel,
            handleApplyForLeave
        );
    };

    const handleChatBotToggler = async () => {
        chatBotWrapper.toggleClass("opened");
        if (!chatBotWrapper.hasClass("loaded")) {
            chatBotWrapper.addClass("loaded");
            handleStartingMainMenu();
        }
    };

    chatInput.on("input", () => {
        chatInput.css("height", "auto");
        chatInput.css("height", `${chatInput.scrollHeight}px`);
    });

    chatbotToggler.on("click", () => $("body").toggleClass("opened"));

    closeBtn.on("click", () => chatBotWrapper.removeClass("opened"));

    chatbotToggler.on("click", handleChatBotToggler);
});
