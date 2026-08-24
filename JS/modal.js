// ======================================================
// UNIVERSAL MODAL
// SEJJELEC
// ======================================================

const modal = document.getElementById("app-modal");
const modalTitle = modal.querySelector("h2");
const modalMessage = modal.querySelector("p");
const modalButton = document.getElementById("close-app");

/**
 * Display the modal
 *
 * @param {string} title
 * @param {string} message
 * @param {string} buttonText
 */

function showModal(title, message, buttonText = "Fermer") {

    modalTitle.textContent = title;

    modalMessage.innerHTML = message;

    modalButton.textContent = buttonText;

    modal.classList.add("show");

}

/**
 * Close modal
 */

function closeModal() {

    modal.classList.remove("show");

}

/**
 * Close with button
 */

modalButton.addEventListener("click", closeModal);

/**
 * Close by clicking outside
 */

modal.addEventListener("click", (e) => {

    if (e.target === modal) {

        closeModal();

    }

});

/**
 * Close with Escape
 */

document.addEventListener("keydown", (e) => {

    if (e.key === "Escape" && modal.classList.contains("show")) {

        closeModal();

    }

});


// ======================================================
// READY-TO-USE MESSAGES
// ======================================================

const ModalMessages = {

    success() {

        showModal(

            "Demande envoyée !",

            `Merci de nous avoir contactés.
            Votre demande a bien été envoyée.

            <br><br>

            Notre équipe reviendra vers vous
            dans les plus brefs délais.

            <br><br>

            Pensez également à vérifier votre dossier
            <strong>Spam / Courrier indésirable</strong>
            si vous ne recevez pas notre email de confirmation.`

        );

    },

    requiredFields() {

        showModal(

            "Champs obligatoires",

            `Veuillez remplir tous les champs obligatoires avant d'envoyer votre demande.`

        );

    },

    invalidEmail() {

        showModal(

            "Adresse e-mail invalide",

            `Veuillez saisir une adresse e-mail valide.`

        );

    },

    invalidPhone() {

        showModal(

            "Téléphone invalide",

            `Veuillez saisir un numéro de téléphone valide.`

        );

    },

    tooManyFiles() {

        showModal(

            "Nombre de fichiers dépassé",

            `Vous pouvez joindre au maximum
            <strong>5 fichiers</strong>.`

        );

    },

    fileTooLarge(filename) {

        showModal(

            "Fichier trop volumineux",

            `Le fichier

            <strong>${filename}</strong>

            dépasse la taille maximale autorisée de
            <strong>10 MB</strong>.`

        );

    },

    invalidFile(filename) {

        showModal(

            "Format non autorisé",

            `Le fichier

            <strong>${filename}</strong>

            n'est pas autorisé.

            <br><br>

            Formats acceptés :

            PDF, DOC, DOCX, XLS, XLSX,

            JPG, JPEG, PNG et WEBP.`

        );

    },

    serverError(message = "") {

        showModal(

            "Erreur serveur",

            message ||

            `Une erreur est survenue lors du traitement
            de votre demande.

            <br><br>

            Veuillez réessayer plus tard.`

        );

    },

    loading() {

        showModal(

            "Envoi en cours...",

            `Votre demande est en cours d'envoi.

            <br><br>

            Merci de patienter quelques instants.`

        );

    }

};