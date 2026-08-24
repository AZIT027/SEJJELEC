document.addEventListener("DOMContentLoaded", () => {

    // =====================================================
    // DYNAMIC SUBJECT
    // =====================================================

    const subjectOptions = {

        devis: [
            "Réseaux MT-BT & Éclairage Public",
            "Postes Transformateurs & HTA",
            "Électricité Industrielle & Bâtiment",
            "Transition Solaire",
            "Courant Faible"
        ],

        maintenance: [
            "Entretien de poste",
            "Entretien des installations solaires",
            "Entretien des installations électriques",
            "Dépannage urgent",
            "Inspection"
        ],

        partenariat: [
            "Partenariat commercial",
            "Sous-traitance",
            "Fournisseur",
            "Autre partenariat"
        ],

        recrutement: [
            "Stage",
            "Emploi",
            "Candidature spontanée"
        ]

    };

    const subject = document.getElementById("subject");
    const subGroup = document.getElementById("subsubject-group");
    const subSubject = document.getElementById("subsubject");

    if (subject && subGroup && subSubject) {

        subject.addEventListener("change", updateSubSubject);

        function updateSubSubject() {

            const value = subject.value;

            subGroup.classList.add("hidden");
            subSubject.innerHTML = "";
            subSubject.required = false;

            if (value === "autre" || !subjectOptions[value]) {
                return;
            }

            subGroup.classList.remove("hidden");
            subSubject.required = true;

            subSubject.innerHTML = `
                <option value="" disabled selected>
                    Sélectionnez une option
                </option>
            `;

            subjectOptions[value].forEach(option => {

                const optionElement = document.createElement("option");

                optionElement.value = option;
                optionElement.textContent = option;

                subSubject.appendChild(optionElement);

            });

        }

    }

    // =====================================================
    // FILE UPLOAD
    // =====================================================

    const attachmentInput = document.getElementById("attachment");
    const selectedFilesContainer = document.getElementById("selected-files");

    if (attachmentInput && selectedFilesContainer) {

        const MAX_FILES = 5;
        const MAX_FILE_SIZE = 10 * 1024 * 1024; //10 MB

        const allowedExtensions = [
            "pdf",
            "doc",
            "docx",
            "xls",
            "xlsx",
            "jpg",
            "jpeg",
            "png",
            "webp"
        ];

        let fileStore = new DataTransfer();

        attachmentInput.addEventListener("change", () => {

            Array.from(attachmentInput.files).forEach(file => {

                if (fileStore.files.length >= MAX_FILES) {

                    ModalMessages.tooManyFiles();

                    return;

                }

                if (file.size > MAX_FILE_SIZE) {

                    ModalMessages.fileTooLarge(file.name);

                    return;

                }

                const extension = file.name.split(".").pop().toLowerCase();

                if (!allowedExtensions.includes(extension)) {

                    ModalMessages.invalidFile(file.name);

                    return;

                }

                const alreadyExists = Array.from(fileStore.files).some(existing =>
                    existing.name === file.name &&
                    existing.size === file.size
                );

                if (!alreadyExists) {

                    fileStore.items.add(file);

                }

            });

            attachmentInput.files = fileStore.files;

            renderFiles();

        });

        function renderFiles() {

            selectedFilesContainer.innerHTML = "";

            if (fileStore.files.length === 0) {

                selectedFilesContainer.style.display = "none";

                return;

            }

            selectedFilesContainer.style.display = "flex";
            selectedFilesContainer.style.flexWrap = "wrap";

            Array.from(fileStore.files).forEach((file, index) => {

                const extension = file.name.split(".").pop().toLowerCase();

                let icon = "images/icons/document.png";

                if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension)) {
                    icon = "images/icons/image.png";
                }

                if (["xls", "xlsx"].includes(extension)) {
                    icon = "images/icons/excel.png";
                }

                if (["doc", "docx"].includes(extension)) {
                    icon = "images/icons/word.png";
                }

                if (extension === "pdf") {
                    icon = "images/icons/pdf.png";
                }

                const chip = document.createElement("div");

                chip.className = "file-chip";

                chip.innerHTML = `
                    <img src="${icon}" class="file-icon" alt="">
                    <p>${file.name}</p>
                    <button type="button">&times;</button>
                `;

                chip.querySelector("button").addEventListener("click", () => {

                    const newStore = new DataTransfer();

                    Array.from(fileStore.files).forEach((f, i) => {

                        if (i !== index) {

                            newStore.items.add(f);

                        }

                    });

                    fileStore = newStore;

                    attachmentInput.files = fileStore.files;

                    renderFiles();

                });

                selectedFilesContainer.appendChild(chip);

            });

        }

    }

    // =====================================================
    // PHONE VALIDATION
    // =====================================================

    const phone = document.getElementById("phone");

    if (phone) {

        phone.addEventListener("input", () => {

            phone.value = phone.value.replace(/[^\d+\s]/g, "");

        });

    }

    // =====================================================
    // FORM SUBMISSION
    // =====================================================

    const form = document.getElementById("contact-form");

    if (form) {

        form.addEventListener("submit", (e) => {

            const fullname = document.getElementById("fullname").value.trim();
            const email = document.getElementById("email").value.trim();
            const message = document.getElementById("message").value.trim();

            if (!fullname || !email || !message) {

                e.preventDefault();

                ModalMessages.requiredFields();

                return;

            }

            const button = form.querySelector(".submit-btn");

            button.disabled = true;

            button.innerHTML = `
                Envoi...
                <img src="images/icons/arrow.png" alt="">
            `;

        });

    }

});