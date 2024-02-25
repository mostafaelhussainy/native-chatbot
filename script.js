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

    const leaveRequestSteps = {
        moduleName: "leaveTypeRequest",
        moduleLabel: "Apply for leave",
        moduleSteps: [
            {
                message: "Pick your date",
                type: "date",
                name: "starting date",
                key: "startingDate",
            },
            {
                message: "Please enter your number of days",
                type: "value",
                name: "number of days",
                key: "numberOfDays",
            },
            {
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
            {
                message: "Do you want to upload any attachments?",
                type: "attachments",
                name: "attachment name",
                key: "attachmentName",
            },
        ],
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
        dateInsertionHandler
    ) => {
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

                saveRequestInSessionStorage(
                    "userLeaveTypeRequest",
                    "startingDate",
                    "starting date",
                    formattedDate
                );

                button.prop("disabled", true);

                $(this).datepicker("destroy");
                dateInsertionHandler(formattedDate);
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

    const handleInsertAttachment = async (parentMsg) => {
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
                await showRequestSummary("userLeaveTypeRequest"); // to be removed
            };
            reader.readAsBinaryString(file);
            disabledButtonsWithinParent(parentMsg);
        });
    };

    const handleNotInsertingAttachment = async (parentMsg) => {
        await handleMessageInsertion("No", "outgoing");
        disabledButtonsWithinParent(parentMsg);
        showRequestSummary("userLeaveTypeRequest"); // to be removed
    };

    const handleInsertingSelect = async (
        defaultOptionText = "Select one option",
        optionsList,
        nextStepFunction,
        chatWrapper
    ) => {
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
            await nextStepFunction(); // to be removed
        });

        return selectElement;
    };

    const handleCreationLeaveTypeSelect = async (Li) => {
        var options = [
            { value: "Type 1", text: "Type 1" },
            { value: "Type 2", text: "Type 2" },
            { value: "Type 3", text: "Type 3" },
        ];
        const selectHandler = async () => {
            const systemUploadAnyAttach = await handleMessageInsertion(
                "Do you want to upload any attachments?",
                "incoming"
            );
            await handleButtonInsertion(systemUploadAnyAttach, "Yes", () =>
                handleInsertAttachment(systemUploadAnyAttach)
            );
            await handleButtonInsertion(systemUploadAnyAttach, "No", () =>
                handleNotInsertingAttachment(systemUploadAnyAttach)
            );
        };
        await handleInsertingSelect("Select Type", options, selectHandler, Li);
    };

    const handleUserDateSelection = async (date) => {
        await handleMessageInsertion(date, "outgoing");
        await handleMessageInsertion("Please enter your number of days", "incoming");

        $(chatInput).prop("disabled", false);
        $(".chat-input i").css("display", "block");
        $(chatInput).prop("placeholder", "Enter number of leave days");
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
                "userLeaveTypeRequest",
                "numberOfDays",
                "number of days",
                userMessage
            );

            handleMessageInsertion(userMessage, "outgoing");
            // next step call start
            const botMsg = await handleMessageInsertion(
                "Please choose your leave type",
                "incoming"
            );
            await handleCreationLeaveTypeSelect(botMsg);
            // next step call end
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
        sessionStorage.setItem("userLeaveTypeRequest", JSON.stringify(applyForLeaveBody));
        handleMessageInsertion("Apply for leave", "outgoing");

        const systemMsg = await handleMessageInsertion("", "incoming");
        await handleDatePickerInsertion(
            systemMsg,
            "Pick your date",
            "testId",
            handleUserDateSelection
        );
    };

    const handleStartingModule = (module) => {
        const { moduleName, moduleLabel, moduleSteps } = module;
        sessionStorage.setItem(moduleName, JSON.stringify({}));
        handleMessageInsertion(moduleLabel, "outgoing");
        debugger;
        // mostafa
        // moduleSteps: [
        //     {
        //         message: "Pick your date",
        //         type: "date",
        //         name: "starting date",
        //         key: "startingDate",
        //     },
        //     {
        //         message: "Please enter your number of days",
        //         type: "value",
        //         name: "number of days",
        //         key: "numberOfDays",
        //     },
        //     {
        //         message: "Please choose your leave type",
        //         type: "options",
        //         name: "leave type",
        //         key: "leaveType",
        //         options: [
        //             { value: "Type 1", text: "Type 1" },
        //             { value: "Type 2", text: "Type 2" },
        //             { value: "Type 3", text: "Type 3" },
        //         ],
        //     },
        //     {
        //         message: "Do you want to upload any attachments?",
        //         type: "attachments",
        //         name: "attachment name",
        //         key: "attachmentName",
        //     },
        // ],

        moduleSteps.forEach(async (step) => {
            let userResponse; // to store the user choice after each step and show it in a message
            switch (step.type) {
                case "date":
                    const systemMsg = await handleMessageInsertion("", "incoming");
                    handleDatePickerInsertion(
                        systemMsg,
                        step.message,
                        "testId",
                        handleUserDateSelection
                    );
                    break;
                case "value":
                    break;
                case "options":
                    break;
                case "attachments":
                    break;
                // default:
            }
        });
    };
    const handleChatBotToggler = async () => {
        chatBotWrapper.toggleClass("show-chatbot");
        if (!chatBotWrapper.hasClass("loaded")) {
            chatBotWrapper.addClass("loaded");
            const firstChatMessageContainer = $(".chat-box > .chat.incoming");
            await typeWriterAnimationHandler(firstChatMessageContainer, startingMsg, 50);
            // await handleButtonInsertion(
            //     firstChatMessageContainer,
            //     "Apply for leave",
            //     handleApplyForLeave
            // );
            await handleButtonInsertion(firstChatMessageContainer, "Apply for leave", () =>
                handleStartingModule(leaveRequestSteps)
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
