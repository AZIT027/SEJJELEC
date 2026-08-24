<?php

declare(strict_types=1);

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require "vendor/autoload.php";
require "private/config.php";

session_start();

// =====================================================
// ONLY ALLOW POST
// =====================================================

if ($_SERVER["REQUEST_METHOD"] !== "POST") {

    http_response_code(405);
    exit("Méthode non autorisée.");

}

// =====================================================
// RATE LIMIT (60 seconds)
// =====================================================

if (isset($_SESSION["last_submit"])) {

    if (time() - $_SESSION["last_submit"] < 60) {

        exit("Veuillez patienter 60 secondes avant un nouvel envoi.");

    }

}

$_SESSION["last_submit"] = time();

// =====================================================
// HONEYPOT (ANTI BOT)
// =====================================================

if (!empty($_POST["website"])) {

    exit("Spam détecté.");

}

// =====================================================
// SANITIZE INPUTS
// =====================================================

$fullname = trim($_POST["fullname"] ?? "");
$company = trim($_POST["company"] ?? "");
$phone = trim($_POST["phone"] ?? "");
$email = trim($_POST["email"] ?? "");
$subject = trim($_POST["subject"] ?? "");
$subsubject = trim($_POST["subsubject"] ?? "");
$message = trim($_POST["message"] ?? "");

// Remove header injection

$email = str_replace(["\r", "\n"], "", $email);

// Escape HTML

$fullname = htmlspecialchars($fullname, ENT_QUOTES, "UTF-8");
$company = htmlspecialchars($company, ENT_QUOTES, "UTF-8");
$phone = htmlspecialchars($phone, ENT_QUOTES, "UTF-8");
$email = htmlspecialchars($email, ENT_QUOTES, "UTF-8");
$subject = htmlspecialchars($subject, ENT_QUOTES, "UTF-8");
$subsubject = htmlspecialchars($subsubject, ENT_QUOTES, "UTF-8");
$message = htmlspecialchars($message, ENT_QUOTES, "UTF-8");

// =====================================================
// REQUIRED FIELDS
// =====================================================

if (

    empty($fullname) ||
    empty($phone) ||
    empty($email) ||
    empty($subject) ||
    empty($message)

) {

    exit("Veuillez remplir tous les champs obligatoires.");

}

// =====================================================
// VALIDATIONS
// =====================================================

// Email

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {

    exit("Adresse email invalide.");

}

// Phone

if (!preg_match('/^[0-9+\s()\-]{8,20}$/', $phone)) {

    exit("Numéro de téléphone invalide.");

}

// Lengths

if (strlen($fullname) > 100) {

    exit("Nom trop long.");

}

if (strlen($company) > 100) {

    exit("Nom d'entreprise trop long.");

}

if (strlen($message) > 5000) {

    exit("Le message est trop long.");

}

// =====================================================
// FILE VALIDATION SETTINGS
// =====================================================

$maxFiles = 5;

$maxSize = 10 * 1024 * 1024; // 10 MB

$allowedMimeTypes = [

    "application/pdf",

    "application/msword",

    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

    "application/vnd.ms-excel",

    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

    "image/jpeg",

    "image/png",

    "image/webp"

];

$forbiddenExtensions = [

    "php",
    "php3",
    "php4",
    "php5",
    "phtml",

    "exe",
    "dll",
    "com",
    "bat",
    "cmd",

    "js",
    "vbs",
    "jar",
    "msi",
    "sh"

];

$finfo = finfo_open(FILEINFO_MIME_TYPE);

// =====================================================
// CREATE ADMIN EMAIL
// =====================================================

$mail = new PHPMailer(true);

try {

    // =====================================================
    // SMTP CONFIGURATION
    // =====================================================

    $mail->isSMTP();

    $mail->CharSet = "UTF-8";

    $mail->Host = SMTP_HOST;

    $mail->SMTPAuth = true;

    $mail->Username = SMTP_USER;

    $mail->Password = SMTP_PASS;

    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;

    $mail->Port = SMTP_PORT;

    $mail->Timeout = 20;

    // =====================================================
    // SENDER
    // =====================================================

    $mail->setFrom(SMTP_USER, "SEJJELEC Website");

    $mail->addAddress(SMTP_USER);

    $mail->addReplyTo($email, $fullname);

    // =====================================================
    // ATTACHMENTS
    // =====================================================

    if (!empty($_FILES["attachment"]["name"][0])) {

        // Maximum number of files

        if (count($_FILES["attachment"]["name"]) > $maxFiles) {

            exit("Vous pouvez envoyer au maximum 5 fichiers.");

        }

        foreach ($_FILES["attachment"]["tmp_name"] as $key => $tmpName) {

            if ($_FILES["attachment"]["error"][$key] !== UPLOAD_ERR_OK) {

                exit("Erreur lors du téléchargement d'un fichier.");

            }

            // Size

            if ($_FILES["attachment"]["size"][$key] > $maxSize) {

                exit("Un fichier dépasse la taille maximale de 10 MB.");

            }

            // Extension

            $extension = strtolower(

                pathinfo(
                    $_FILES["attachment"]["name"][$key],
                    PATHINFO_EXTENSION
                )

            );

            if (in_array($extension, $forbiddenExtensions)) {

                exit("Type de fichier interdit.");

            }

            // MIME verification

            $mime = finfo_file($finfo, $tmpName);

            if (!in_array($mime, $allowedMimeTypes)) {

                exit("Le type de fichier n'est pas autorisé.");

            }

            // Attach

            $mail->addAttachment(

                $tmpName,

                basename($_FILES["attachment"]["name"][$key])

            );

        }

    }

    // =====================================================
    // SUBJECT
    // =====================================================

    $mail->Subject = "Nouvelle demande - " . $subject;

    // =====================================================
    // HTML BODY
    // =====================================================

    $mail->isHTML(true);

    $mail->Body = "

    <h2>Nouvelle demande depuis le site SEJJELEC</h2>

    <table border='1' cellpadding='10' cellspacing='0'>

        <tr>

            <td><strong>Nom</strong></td>

            <td>{$fullname}</td>

        </tr>

        <tr>

            <td><strong>Entreprise</strong></td>

            <td>{$company}</td>

        </tr>

        <tr>

            <td><strong>Téléphone</strong></td>

            <td>{$phone}</td>

        </tr>

        <tr>

            <td><strong>Email</strong></td>

            <td>{$email}</td>

        </tr>

        <tr>

            <td><strong>Sujet</strong></td>

            <td>{$subject}</td>

        </tr>

        <tr>

            <td><strong>Précision</strong></td>

            <td>{$subsubject}</td>

        </tr>

    </table>

    <br>

    <h3>Message</h3>

    <p>{$message}</p>

    ";

    // =====================================================
    // SEND TO SEJJELEC
    // =====================================================

    $mail->send();

        // =====================================================
    // AUTO REPLY TO CLIENT
    // =====================================================

    $reply = new PHPMailer(true);

    $reply->isSMTP();

    $reply->CharSet = "UTF-8";

    $reply->Host = SMTP_HOST;

    $reply->SMTPAuth = true;

    $reply->Username = SMTP_USER;

    $reply->Password = SMTP_PASS;

    $reply->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;

    $reply->Port = SMTP_PORT;

    $reply->Timeout = 20;

    $reply->setFrom(
        SMTP_USER,
        "SEJJELEC"
    );

    $reply->addAddress(
        $email,
        $fullname
    );

    $reply->isHTML(true);

    $reply->Subject = "Nous avons bien reçu votre demande";

    $reply->Body = "

    <div style='font-family:Arial,sans-serif;max-width:650px;margin:auto;color:#333;'>

    <h2 style='color:#ff6b00;'>
    Merci de nous avoir contactés.
    </h2>

    <p>Bonjour <strong>$fullname</strong>,</p>

    <p>
    Nous avons bien reçu votre demande concernant :
    <strong>$subject</strong>
    </p>

    <p>
    Notre équipe technique va étudier votre demande avec attention.
    Vous recevrez une réponse dans les plus brefs délais
    (généralement sous 24 heures ouvrées).
    </p>

    <hr>

    <h3>Récapitulatif de votre demande</h3>

    <ul>
    <li><strong>Nom :</strong> $fullname</li>
    <li><strong>Entreprise :</strong> $company</li>
    <li><strong>Téléphone :</strong> $phone</li>
    <li><strong>Email :</strong> $email</li>
    <li><strong>Sujet :</strong> $subject</li>
    <li><strong>Précision :</strong> $subsubject</li>
    </ul>

    <p>
    <strong>Votre message :</strong>
    </p>

    <div style='background:#f6f6f6;padding:15px;border-radius:6px;'>
    $message
    </div>

    <br>

    <p>
    Merci pour votre confiance.
    </p>

    <p>
    Cordialement,<br>
    <b>L'équipe SEJJELEC</b>
    </p>

    </div>
    ";

        $reply->AltBody =
    "Merci d'avoir contacté SEJJELEC.

    Nous avons bien reçu votre demande.

    Notre équipe reviendra vers vous sous 24 heures ouvrées.

    Merci de votre confiance.";

        $reply->send();

        // =====================================================
        // SUCCESS
        // =====================================================

        echo "success";

    }

    catch (Exception $e) {

        error_log(
            "[" .
            date("Y-m-d H:i:s") .
            "] " .
            $e->getMessage() .
            PHP_EOL,
            3,
            __DIR__ . "/mail_errors.log"
        );

        http_response_code(500);

        exit("Une erreur est survenue. Veuillez réessayer ultérieurement.");

    }