const form = document.getElementById("contact-form");

if (form) {
    form.addEventListener("submit", async function(e){

        e.preventDefault();

        const formData = new FormData(form);

        try{

            const response = await fetch("contact.php",{
                method:"POST",
                body:formData
            });

            if (!response.ok) {
                throw new Error("Server error");
            }

            const result = (await response.text()).trim();

            if(result === "success"){

                ModalMessages.success();

                form.reset();

                fileStore = new DataTransfer();

                attachmentInput.files = fileStore.files;

                renderFiles();

            }else{

                ModalMessages.serverError(result);

            }

        }catch(error){
            
            console.error(error);

        }

    });

}