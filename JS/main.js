

// Select the checkbox that controls your menu
const menuToggle = document.querySelector('input[type="checkbox"]');

// Select all the links inside your menu
const menuLinks = document.querySelectorAll('.navbar-menu a'); 

// Uncheck the box when any link is clicked
menuLinks.forEach(link => {
  link.addEventListener('click', () => {
    menuToggle.checked = false;
  });
});



/*------------------------ swiper ------------------------------------ */

document.addEventListener("DOMContentLoaded", () => {

    function createLogoSwiper(selector){

        return new Swiper(selector, {

            loop:true,

            slidesPerView:"auto",

            spaceBetween:40,

            speed:4000,

            autoplay:{
                delay:1,
                disableOnInteraction:false,
                pauseOnMouseEnter:true,
            },

            grabCursor:true,
            
            allowTouchMove: true,
            simulateTouch: true,
            touchRatio: 1,
            freeMode: true,
            freeModeMomentum: false,

        });

    }

    createLogoSwiper(".agreementsSwiper");
    createLogoSwiper(".clientsSwiper");

});


if(document.querySelector(".servicesSwiper")){
    new Swiper(".servicesSwiper",{
        loop:true,

        speed:700,

        spaceBetween:40,

        grabCursor:true,

        autoplay:{
            delay:3500,
            disableOnInteraction:false,
        },

        pagination:{
            el:".servicesSwiper .swiper-pagination",
            clickable:true,
        },

        navigation:{
            nextEl:".servicesSwiper .swiper-button-next",
            prevEl:".servicesSwiper .swiper-button-prev",
        },

        breakpoints:{

            0:{
                slidesPerView:1,
            },

            768:{
                slidesPerView:2,
            },

            1200:{
                slidesPerView:3,
            }

        }

    });
}


/*---------------------------------------------------------------------------------- */
// ======================================
// Accordion & FAQ
// ======================================

document.querySelectorAll(".accordion, .faq-grid, .badge-accordion ").forEach(container => {

    const items = container.querySelectorAll(".accordion-item, .faq-item, .badge-accordion-item");

    items.forEach(item => {

        const header = item.querySelector(".accordion-header, .faq-question, .badge-accordion-header");

        const icon = item.querySelector(".accordion-icon, .faq-icon, .badge-accordion-icon");

        header.addEventListener("click", () => {

            items.forEach(other => {

                if (other !== item) {

                    other.classList.remove("active");

                    const otherIcon = other.querySelector(".accordion-icon, .faq-icon , .badge-accordion-icon");

                    if (otherIcon) {
                        otherIcon.textContent = "+";
                    }

                }

            });

            item.classList.toggle("active");

            if (icon) {

                icon.textContent =
                    item.classList.contains("active")
                        ? "-"
                        : "+";

            }

        });

    });

});



