const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

menuToggle?.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

const faqButtons = document.querySelectorAll(".faq-item");

faqButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const answer = button.nextElementSibling;
    const icon = button.querySelector("strong");
    const isOpen = answer.classList.toggle("open");
    icon.textContent = isOpen ? "−" : "+";
  });
});

const testimonialSlides = document.querySelectorAll(".testimonial-slide");
const testimonialDots = document.querySelectorAll(".testimonial-dots button");
const testimonialSlider = document.querySelector(".testimonial-slider");

if (testimonialSlides.length > 0) {
  let currentIndex = 0;
  let intervalId = null;
  const INTERVAL_MS = 6000;

  function showSlide(index) {
    currentIndex = index;
    testimonialSlides.forEach((slide, i) => {
      slide.classList.toggle("active", i === index);
    });
    testimonialDots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
      dot.setAttribute("aria-selected", String(i === index));
    });
  }

  function nextSlide() {
    showSlide((currentIndex + 1) % testimonialSlides.length);
  }

  function startAutoplay() {
    stopAutoplay();
    intervalId = setInterval(nextSlide, INTERVAL_MS);
  }

  function stopAutoplay() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  testimonialDots.forEach((dot) => {
    dot.addEventListener("click", () => {
      showSlide(Number(dot.dataset.index));
      startAutoplay();
    });
  });

  testimonialSlider?.addEventListener("mouseenter", stopAutoplay);
  testimonialSlider?.addEventListener("mouseleave", startAutoplay);
  testimonialSlider?.addEventListener("focusin", stopAutoplay);
  testimonialSlider?.addEventListener("focusout", startAutoplay);

  startAutoplay();
}

const priceCards = document.querySelectorAll(".pricing-grid .price-card");
const STAGGER_MS = 120;
let priceCardsRevealed = false;

function revealAllPriceCards() {
  if (priceCardsRevealed) {
    return;
  }

  priceCardsRevealed = true;

  priceCards.forEach((card, index) => {
    setTimeout(() => {
      card.classList.add("is-visible");
    }, index * STAGGER_MS);
  });
}

function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return rect.top < window.innerHeight * 0.88 && rect.bottom > 0;
}

if (priceCards.length > 0) {
  priceCards.forEach((card) => card.classList.add("reveal"));

  const cardObserver = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        revealAllPriceCards();
      }
    },
    { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
  );

  priceCards.forEach((card) => cardObserver.observe(card));

  requestAnimationFrame(() => {
    if ([...priceCards].some(isInViewport)) {
      revealAllPriceCards();
    }
  });
}
