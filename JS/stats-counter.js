/*---------  counter section  ---------------------------------------------------- */
/*select every element with the class counter */
const counters = document.querySelectorAll(".counter");

function animateCounter(counter) {

    const target = Number(counter.dataset.target);

    let current = 0;

    const increment = target / 100;

    const timer = setInterval(() => {

        current += increment;

        if (current >= target) {
            current = target;
            clearInterval(timer);
        }

        counter.textContent = Math.floor(current);

    }, 15);
}

const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            const counters = entry.target.querySelectorAll(".counter");

            counters.forEach(counter => {
                animateCounter(counter);
            });

            observer.unobserve(entry.target);

        }

    });

}, {
    threshold: 0.7
});

const stats = document.querySelector(".stats");

if(stats){

    observer.observe(stats);

}