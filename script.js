$(document).ready(function () {
    const chatbotToggler = $(".chatbot-toggler");
    const closeBtn = $(".close-btn");
    const chatBox = $(".chat-box");
    const sendChatBtn = $("#send-btn");
    const chatBotWrapper = $("#chatbot-wrapper");
    const startingMsg = "Hi there, How can I help you today?";
    let userMessage = null;
    const chatInput = $(".chat-input textarea");
    const inputInitialHeight = chatInput.scrollHeight;
    const leaveRequestModule = {
        moduleKey: "leaveRequestModule",
        moduleLabel: "Apply for leave",
        moduleSteps: {
            step1: {
                message: "Pick your starting date",
                key: "startingDate",
            },
            step2: {
                message: "Please enter your number of days",
                type: "value",
                name: "number of days",
                key: "numberOfDays",
            },
            step3: {
                message: "Please choose your leave type",
                type: "options",
                name: "leave type",
                key: "leaveType",
                options: [
                    { value: "Type 1", text: "Type 1" },
                    { value: "Type 2", text: "Type 2" },
                    { value: "Type 3", text: "Type 3" },
                ],
            },
            step4: {
                message: "Do you want to upload any attachments?",
                type: "attachments",
                name: "attachment name",
                key: "attachmentName",
            },
        },
    };
    const disabledButtonsWithinParent = (parentElement) => {
        parentElement.find("button").prop("disabled", true);
    };

    const saveRequestInSessionStorage = (
        requestNameInSessionStorage,
        propertyObjectName,
        propertyName,
        propertyValue,
        notIncludedInSummary = false
    ) => {
        const leaveTypeRequest = JSON.parse(sessionStorage.getItem(requestNameInSessionStorage));
        leaveTypeRequest[propertyObjectName] = {};
        leaveTypeRequest[propertyObjectName].name = propertyName;
        leaveTypeRequest[propertyObjectName].value = propertyValue;
        leaveTypeRequest[propertyObjectName].notIncludedInSummary = notIncludedInSummary;
        sessionStorage.setItem(requestNameInSessionStorage, JSON.stringify(leaveTypeRequest));
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
            if (className !== "incoming") {
                chatBox.append(chatLi);
                chatBox.scrollTop(chatBox.prop("scrollHeight"));

                chatLi.html(chatContent);
                resolve(chatLi);
            } else {
                setTimeout(async () => {
                    chatBox.append(chatLi);
                    chatBox.scrollTop(chatBox.prop("scrollHeight"));
                    await typeWriterAnimationHandler(chatLi, chatContent, 50);
                    resolve(chatLi);
                }, 600);
            }
        });
    };

    const handleButtonInsertion = async (positionElement, btnText, btnClickHandler) => {
        const button = $("<button>").addClass("list-btn");
        positionElement.append(button);
        if (typeof btnClickHandler === "function") {
            button.on("click", async function () {
                await btnClickHandler();
                button.prop("disabled", true);
            });
        }
        await typeWriterAnimationHandler(button, btnText, 50);
        return button;
    };

    const handleDatePickerInsertion = async (
        positionElement,
        inputLabel,
        inputId,
        dateInsertionHandler,
        module,
        step
    ) => {
        const moduleKey = module.moduleKey;
        const key = module.moduleSteps.step1.key;
        const message = module.moduleSteps.step1.message;

        const input = $("<input>").addClass("datepicker").attr("id", inputId);
        const label = $("<label>").attr("for", inputId);
        const button = $("<button>");

        button.append(label);
        positionElement.append(button);
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

                saveRequestInSessionStorage(moduleKey, key, message, formattedDate);

                button.prop("disabled", true);

                $(this).datepicker("destroy");
                dateInsertionHandler(formattedDate, module, step + 1);
            });
        return typeWriterAnimationHandler(label, inputLabel, 50);
    };

    const showRequestSummary = async (requestItemName) => {
        const summary = JSON.parse(sessionStorage.getItem(requestItemName));
        let leaveSummaryMessage = "Your leave request summary:\n";
        for (const key in summary) {
            if (summary.hasOwnProperty(key)) {
                if (!summary[key].notIncludedInSummary) {
                    leaveSummaryMessage += `${summary[key].name}: ${summary[key].value}\n`;
                }
            }
        }

        await handleMessageInsertion(leaveSummaryMessage, "incoming");
    };

    const handleYesInsert = async (parentMsg) => {
        await handleMessageInsertion("Yes", "outgoing");

        $("#send-attachments input").click();
        $("#send-attachments input").change(function () {
            var file = $(this)[0].files[0];
            var reader = new FileReader();
            reader.onload = async (event) => {
                var binaryString = event.target.result;
                await handleMessageInsertion(`You've uploaded: ${file.name}`, "incoming");
                saveRequestInSessionStorage(
                    "userLeaveTypeRequest",
                    "attachmentName",
                    "attachment name",
                    file.name
                );
                saveRequestInSessionStorage(
                    "userLeaveTypeRequest",
                    "attachmentBinaryString",
                    "attachment binary string",
                    binaryString,
                    true
                );
                await showRequestSummary("userLeaveTypeRequest"); // next step
            };
            reader.readAsBinaryString(file);
            disabledButtonsWithinParent(parentMsg);
        });
    };

    const handleDoNotInsert = async (parentMsg) => {
        await handleMessageInsertion("No", "outgoing");
        disabledButtonsWithinParent(parentMsg);
        showRequestSummary("userLeaveTypeRequest"); // next step
    };

    const handleInsertingSelect = async (module, step, chatWrapper) => {
        // step3: {
        //     message: "Please choose your leave type",
        //     type: "options",
        //     name: "leave type",
        //     key: "leaveType",
        //     options: [
        //         { value: "Type 1", text: "Type 1" },
        //         { value: "Type 2", text: "Type 2" },
        //         { value: "Type 3", text: "Type 3" },
        //     ],
        // },

        const stepKey = `step${step}`;
        const defaultOptionText = "Select one option";
        const optionsList = module.moduleSteps[stepKey].options || "Select one option";

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
        chatWrapper.append(selectElement);
        $(selectElement).chosen();
        $(selectElement).on("change", async (evt, params) => {
            $(selectElement).prop("disabled", true).trigger("chosen:updated");
            handleMessageInsertion(params.selected, "outgoing");
            saveRequestInSessionStorage(
                "userLeaveTypeRequest",
                "leaveType",
                "leave type",
                params.selected
            );

            const nextStepKey = `step${step + 1}`;
            if (!module.moduleSteps[stepKey]) return;
            // mostafa -> here we need to make the function generic based on the next step type, also don't forget to change the keys that the stored in session storage
            await nextStepFunction(); // next step
        });

        return selectElement;
    };

    const handleInsertingAttachmentStep = async (module, step) => {
        const systemUploadAnyAttach = await handleMessageInsertion(
            "Do you want to insert any attachments?",
            "incoming"
        );
        await handleButtonInsertion(systemUploadAnyAttach, "Yes", () =>
            handleYesInsert(systemUploadAnyAttach)
        );
        await handleButtonInsertion(systemUploadAnyAttach, "No", () =>
            handleDoNotInsert(systemUploadAnyAttach)
        );
    };

    // const handleCreatingSelectStep = async (Li, module, step) => {
    //     const stepKey = `step${step}`;
    //     const selectHandler = async () => {
    //         const systemUploadAnyAttach = await handleMessageInsertion(
    //             module.moduleSteps[stepKey].message,
    //             "incoming"
    //         );
    //         await handleButtonInsertion(systemUploadAnyAttach, "Yes", () =>
    //             handleYesInsert(systemUploadAnyAttach, module)
    //         );
    //         await handleButtonInsertion(systemUploadAnyAttach, "No", () =>
    //             handleDoNotInsert(systemUploadAnyAttach)
    //         );
    //     };
    //     // next step
    //     await handleInsertingSelect(module, step, Li);
    // };

    const handleUserNumberOfDaysInsertion = async (date, module, step) => {
        await handleMessageInsertion(date, "outgoing");
        let stepKey = `step${step}`;
        await handleMessageInsertion(module.moduleSteps[stepKey].message, "incoming"); // next step

        $(chatInput).prop("disabled", false);
        $(".chat-input i").css("display", "block");
        $(chatInput).prop("placeholder", "Enter number of days");
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
            $(".chat-input i").css("display", "none");

            saveRequestInSessionStorage(
                module.moduleKey,
                module.moduleSteps[stepKey].key,
                module.moduleSteps[stepKey].name,
                userMessage
            );

            handleMessageInsertion(userMessage, "outgoing");

            stepKey = `step${step + 1}`;
            if (!module.moduleSteps[stepKey]) return;
            const botMsg = await handleMessageInsertion(
                module.moduleSteps[stepKey].message,
                "incoming"
            );

            await handleInsertingSelect(module, step + 1, botMsg);
        };
        chatInput.on("keydown", (e) => {
            if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
                e.preventDefault();
                handleChatInsertion();
            }
        });
        $(".chat-input i").on("click", handleChatInsertion);

        sendChatBtn.on("click", handleChatInsertion);
    };

    const handleApplyForLeave = async () => {
        const applyForLeaveBody = {};
        sessionStorage.setItem(leaveRequestModule.moduleKey, JSON.stringify(applyForLeaveBody));
        handleMessageInsertion(leaveRequestModule.moduleLabel, "outgoing");

        const systemMsg = await handleMessageInsertion("", "incoming");
        // step 1
        await handleDatePickerInsertion(
            systemMsg,
            leaveRequestModule.moduleSteps.step1.message,
            "testId",
            handleUserNumberOfDaysInsertion, // pass in the date from handleDatePickerInsertion itself by calling it and pass in (date and module)
            leaveRequestModule,
            1
        );
    };

    const handleChatBotToggler = async () => {
        chatBotWrapper.toggleClass("show-chatbot");
        if (!chatBotWrapper.hasClass("loaded")) {
            chatBotWrapper.addClass("loaded");
            const firstChatMessageContainer = $(".chat-box > .chat.incoming");
            await typeWriterAnimationHandler(firstChatMessageContainer, startingMsg, 50);

            // apply for leave module
            await handleButtonInsertion(
                firstChatMessageContainer,
                leaveRequestModule.moduleLabel,
                handleApplyForLeave
            );
        }
    };

    chatInput.on("input", () => {
        chatInput.css("height", "auto");
        chatInput.css("height", `${chatInput.scrollHeight}px`);
    });

    chatbotToggler.on("click", () => $("body").toggleClass("show-chatbot"));

    closeBtn.on("click", () => chatBotWrapper.removeClass("show-chatbot"));

    chatbotToggler.on("click", handleChatBotToggler);
});
