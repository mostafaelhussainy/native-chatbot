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
    const widthBtnToggler = $(".width-toggler-btn");
    const chatBotWindow = $(".chatbot-inner-window");
    const leaveRequestModule = {
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
    };

    // done
    const HandleOptionsDivInsertion = async (parentMessage) => {
        const optionsDiv = $("<div>").addClass("message-options");
        parentMessage.css("padding-bottom", "0");
        parentMessage.css("border-radius", "0 10px 10px 0");
        parentMessage.append(optionsDiv);
        return optionsDiv;
    };

    // done
    const disabledButtonsWithinParent = (parentElement) => {
        parentElement.find("button").prop("disabled", true);
    };

    // done
    const disableBtnsFieldsChosen = (parentElement) => {
        parentElement.find("button").prop("disabled", true).css("color", "#ccc");
        parentElement.find("label").css("color", "#ccc");
        parentElement.find("input").prop("disabled", true).css("color", "#ccc");
        parentElement
            .find("select")
            .prop("disabled", true)
            .trigger("chosen:updated")
            .css("color", "#ccc");
        parentElement
            .find(".datepicker")
            .datepicker("option", "disabled", true)
            .css("color", "#ccc");
    };

    // done
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

    // done
    const typeWriterAnimationHandler = (targetElement, textContent, speed) => {
        let charIndex = 0;
        return new Promise((resolve, reject) => {
            function type() {
                if (charIndex < textContent.length) {
                    targetElement.text(targetElement.text() + textContent.charAt(charIndex));
                    charIndex++;
                    setTimeout(type, 30);
                } else {
                    chatBox.scrollTop(chatBox.prop("scrollHeight"));
                    resolve();
                }
            }
            type();
        });
    };

    // done
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

    // done
    const handleButtonInsertion = async (positionElement, btnText, btnClickHandler, active) => {
        const button = $("<button>").addClass("list-btn");
        positionElement.append(button);
        if (typeof btnClickHandler === "function") {
            const clickHandler = async function () {
                await btnClickHandler();
                // Remove the click event handler after it's been executed
                if (active) return;
                button.off("click", clickHandler);
                button.prop("disabled", true);
            };
            button.on("click", clickHandler);
        }
        await typeWriterAnimationHandler(button, btnText, 13);
        return button;
    };

    // done
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

    // done
    const handleSubmitTheRequest = () => {};

    // done
    const getRequestDataFromSessionStorage = (requestNameInSessionStorage) => {
        return JSON.parse(sessionStorage.getItem(requestNameInSessionStorage));
    };

    // done
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
        $(selectElement).on("change", async (evt, params) => {
            saveRequestInSessionStorage(
                module.moduleKey,
                module.moduleSteps[stepKey].key,
                module.moduleSteps[stepKey].name,
                params.selected,
                step
            );
        });
    };

    const handleEditDateStepValue = async (form, value, module, step) => {
        const stepKey = `step${step}`;
        const moduleKey = module.moduleKey;
        const key = module.moduleSteps[stepKey].key;
        const message = module.moduleSteps[stepKey].message;

        const input = $("<input>").addClass("datepicker");
        const label = $("<label>").text(`${module.moduleSteps[stepKey].name}:`);

        label.append(input);
        form.append(label);

        input.datepicker({
            autoclose: true,
        });

        input.val(value);

        const changeDateHandler = async function (e) {
            const selectedDate = e.date;
            const dateObject = new Date(selectedDate);
            const month = (dateObject.getMonth() + 1).toString().padStart(2, "0");
            const day = dateObject.getDate().toString().padStart(2, "0");
            const year = dateObject.getFullYear();
            const formattedDate = `${month}/${day}/${year}`;
            saveRequestInSessionStorage(moduleKey, key, message, formattedDate, step);
        };

        // Add event listener for changeDate event
        input.on("changeDate", changeDateHandler);
    };

    const handleEditValueStepValue = async (form, value, module, step) => {
        const stepKey = `step${step}`;
        const input = $("<input>").addClass("datepicker").val(value);
        const label = $("<label>").text(`${module.moduleSteps[stepKey].name}:`);

        label.append(input);
        form.append(label);

        input.on("change", function (e) {
            saveRequestInSessionStorage(
                module.moduleKey,
                module.moduleSteps[stepKey].key,
                module.moduleSteps[stepKey].name,
                e.target.value,
                step
            );
        });
    };

    const handleEditAttachmentStepValue = async (form, value, module, step) => {
        const stepKey = `step${step}`;

        const blob = new Blob([value.binary], { type: "application/octet-stream" });
        const file = new File([blob], value.fileName);
        const input = $("<input>").attr("type", "file");
        const label = $("<label>").text(`${module.moduleSteps[stepKey].name}:`);
        label.append(input);
        form.append(label);

        const fileList = new DataTransfer();
        fileList.items.add(file);

        input[0].files = fileList.files;

        $(input).change(function () {
            var file = $(this)[0].files[0];
            var reader = new FileReader();
            reader.onload = async (event) => {
                var binaryString = event.target.result;
                saveRequestInSessionStorage(
                    module.moduleKey,
                    "attachment",
                    "attachment",
                    { fileName: file.name, binary: binaryString },
                    step
                );
            };
            reader.readAsBinaryString(file);
        });
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
        $(selectElement).on("change", async (evt, params) => {
            saveRequestInSessionStorage(
                module.moduleKey,
                module.moduleSteps[stepKey].key,
                module.moduleSteps[stepKey].name,
                params.selected,
                step
            );
        });
    };

    const handleFormInsertion = async (message, module) => {
        const form = $("<form>").addClass("module-edit-form").attr("novalidate", "");
        const moduleKey = module.moduleKey;
        const requestData = getRequestDataFromSessionStorage(moduleKey);
        message.append(form);

        for (const key in requestData) {
            if (requestData.hasOwnProperty(key)) {
                const step = requestData[key].step;
                const value = requestData[key].value;
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
            .attr("type", "submit")
            .text("Save");
        const div = $("<div>");
        div.append(submitBtn).css("width", "100%");
        form.append(div);

        form.on("submit", (event) => {
            event.preventDefault();
            showRequestSummary(module.moduleKey, module);
            disableBtnsFieldsChosen(form);
        });
    };

    const handleEditTheRequest = async (module) => {
        const botMsg = await handleMessageInsertion(
            "Feel free to edit any fields from below and save to proceed",
            "incoming"
        );
        await handleFormInsertion(botMsg, module);
    };

    // done
    const showRequestSummary = async (requestItemName, module) => {
        const summary = JSON.parse(sessionStorage.getItem(requestItemName));
        let leaveSummaryMessage = `Your ${module.moduleName} summary:\n`;
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

    // done
    const handleYesInsert = async (parentMsg, module, step) => {
        $("#attachments-label input").click();
        $("#attachments-label input").change(function () {
            var file = $(this)[0].files[0];
            var reader = new FileReader();
            reader.onload = async (event) => {
                debugger;
                parentMsg.find("button").prop("disabled", true);
                await handleMessageInsertion("Yes", "outgoing");
                var binaryString = event.target.result;
                await handleMessageInsertion(`You've uploaded: ${file.name}`, "incoming");
                const moduleKey = module.moduleKey;
                const stepKey = `step${step}`;
                const key = module.moduleSteps[stepKey].key;
                saveRequestInSessionStorage(
                    moduleKey,
                    "attachment",
                    "attachment",
                    { fileName: file.name, binary: binaryString },
                    step
                );

                await handleModuleStepsCalls(module, step + 1);
                disabledButtonsWithinParent(parentMsg);
            };
            reader.readAsBinaryString(file);
        });
    };

    // done
    const handleDoNotInsert = async (parentMsg, module, step) => {
        await handleMessageInsertion("No", "outgoing");
        disabledButtonsWithinParent(parentMsg);
        await handleModuleStepsCalls(module, step + 1);
    };

    // done
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

    // done
    const handleInsertingAttachmentStep = async (module, step) => {
        const systemUploadAnyAttach = await handleMessageInsertion(
            module.moduleSteps[`step${step}`].message,
            "incoming"
        );

        const optionsDiv = await HandleOptionsDivInsertion(systemUploadAnyAttach);

        await handleButtonInsertion(
            optionsDiv,
            "Yes",
            () => {
                handleYesInsert(optionsDiv, module, step);
            },
            true
        );
        await handleButtonInsertion(optionsDiv, "No", () =>
            handleDoNotInsert(optionsDiv, module, step)
        );
    };

    // done
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

    // done
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

    // done
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

    // done
    const handleApplyForLeave = async () => {
        const applyForLeaveBody = {};
        sessionStorage.setItem(leaveRequestModule.moduleKey, JSON.stringify(applyForLeaveBody));
        handleMessageInsertion(leaveRequestModule.moduleLabel, "outgoing");
        handleModuleStepsCalls(leaveRequestModule, 1);
    };

    // done
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

    // done
    const handleChatBotToggler = async () => {
        debugger;
        chatBotWrapper.toggleClass("opened");
        if (!chatBotWrapper.hasClass("loaded")) {
            chatBotWrapper.addClass("loaded");
            handleStartingMainMenu();
        }
    };

    // done
    chatInput.on("input", () => {
        chatInput.css("height", "auto");
        chatInput.css("height", `${chatInput.scrollHeight}px`);
    });

    // done
    chatbotToggler.on("click", () => $("body").toggleClass("opened"));

    // done
    closeBtn.on("click", () => chatBotWrapper.removeClass("opened"));

    // done
    chatbotToggler.on("click", handleChatBotToggler);

    // done function not event listener
    $(widthBtnToggler).on("click", () => {
        $(widthBtnToggler).toggleClass("minimized").toggleClass("maximized");
        if ($(widthBtnToggler).hasClass("minimized")) {
            $(chatBotWindow).css("width", "420px");
        } else {
            const minWidth = Math.min(800, $(window).width() - 70);
            $(chatBotWindow).css("width", minWidth + "px");
        }
        $(widthBtnToggler).toggleClass("rotated");
    });
});
