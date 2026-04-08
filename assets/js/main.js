"use strict";

// Page loading
var pageLoading = document.querySelector(".page-loading");

if (pageLoading) {
  window.addEventListener("load", () => {
    pageLoading.classList.add("hide");

    setTimeout(() => {
      pageLoading.style.display = "none";
    }, 1000);
  });
}

// Navbar
const navbar = document.querySelector(".ic-navbar"),
  navbarToggler = navbar.querySelector("[data-web-toggle=navbar-collapse]");

// Toggle the menu to STATE (true: open, false: close, undefined: toggle).
function toggleNavbarMenu(state) {
  switch(state) {
  case true:
    navbar.classList.add("menu-show");
    navbarToggler.ariaExpanded = "true";
    navbarToggler.innerHTML = '<i class="lni lni-close"></i>'
    break;
  case false:
    navbar.classList.remove("menu-show");
    navbarToggler.ariaExpanded = "false";
    navbarToggler.innerHTML = '<i class="lni lni-menu"></i>'
    break;
  case undefined:               // toggle
    if (navbar.classList.contains("menu-show")) {
      toggleNavbarMenu(false);
    } else {
      toggleNavbarMenu(true);
    }
  }
}

// Click event to expand/collapse the navigation menu.
document.addEventListener("click", function (e) {
  var x = e.clientX;
  var y = e.clientY;
  var elementMouseIsOver = document.elementFromPoint(x, y);

  if(navbarToggler.contains(elementMouseIsOver)) {
    toggleNavbarMenu();
  } else {
    toggleNavbarMenu(false);
  }
});

// Sticky navbar
window.addEventListener("scroll", function () {
  var logoImg = document.querySelector(".ic-navbar-logo img");
  if (this.scrollY >= 72) {
    navbar.classList.add("sticky");
    if(logoImg) logoImg.src = "./assets/img/utsanova.svg";
  } else {
    navbar.classList.remove("sticky");
    if(logoImg) logoImg.src = "./assets/img/utsanova_mono.svg";
  }
});

// Web theme
const webTheme = document.querySelector("[data-web-trigger=web-theme]"),
  html = document.querySelector("html");

window.addEventListener("load", function () {
  var theme = localStorage.getItem("Inazuma_WebTheme");

  if (theme == "light") {
    webTheme.innerHTML = '<i class="lni lni-sun"></i>';
  } else if (theme == "dark") {
    webTheme.innerHTML = '<i class="lni lni-night"></i>';
  } else {
    theme = "light";
    localStorage.setItem("Inazuma_WebTheme", theme);
    webTheme.innerHTML = '<i class="lni lni-night"></i>';
  }

  html.dataset.webTheme = theme;
});

webTheme.addEventListener("click", function () {
  var theme = localStorage.getItem("Inazuma_WebTheme");

  webTheme.innerHTML =
    theme == "dark"
      ? '<i class="lni lni-sun"></i>'
      : '<i class="lni lni-night"></i>';
  theme = theme == "dark" ? "light" : "dark";
  localStorage.setItem("Inazuma_WebTheme", theme);
  html.dataset.webTheme = theme;
});

// Scrollspy
function scrollspy(event) {
  var links = document.querySelectorAll(".ic-page-scroll"),
    scrollpos =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop;

  for (let i = 0; i < links.length; i++) {
    var currentLink = links[i],
      dataTarget = currentLink.getAttribute("href"),
      targetElement = document.querySelector(dataTarget),
      topminus = scrollpos + 74;

    if (targetElement) {
      if (
        targetElement.offsetTop <= topminus &&
        targetElement.offsetTop + targetElement.offsetHeight > topminus
      ) {
        document.querySelector(".ic-page-scroll").classList.remove("active");
        currentLink.classList.add("active");
      } else {
        currentLink.classList.remove("active");
      }
    }
  }
}

window.document.addEventListener("scroll", scrollspy);

// Menu scroll
const pageLink = document.querySelectorAll(".ic-page-scroll");

pageLink.forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    const targetElement = document.querySelector(link.getAttribute("href"));

    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
        offsetTop: 1 - 74,
      });
    }

    navbar.classList.remove("menu-show");
    navbarToggler.innerHTML = navbar.classList.contains("menu-show")
      ? '<i class="lni lni-close"></i>'
      : '<i class="lni lni-menu"></i>';
  });
});

// Tabs
const tabs = document.querySelectorAll(".tabs");

tabs.forEach((tab) => {
  const links = tab.querySelectorAll(".tabs-nav .tabs-link"),
    contents = tab.querySelectorAll(".tabs-content");

  if (!contents) {
    return;
  }

  window.addEventListener("load", function () {
    for (let i = 0; i < contents.length; i++) {
      contents[i].classList.add("hide");
    }

    for (let i = 0; i < links.length; i++) {
      links[i].classList.remove("active");
      links[i].ariaSelected = false;
    }

    links[0].classList.add("active");
    links[0].ariaSelected = true;

    const dataTarget = links[0].dataset.webTarget,
      targetElement = this.document.getElementById(dataTarget);

    targetElement.classList.remove("hide");
  });

  links.forEach((link) => {
    const dataTarget = link.dataset.webTarget,
      targetElement = document.getElementById(dataTarget);

    if (targetElement) {
      link.addEventListener("click", function () {
        for (let i = 0; i < contents.length; i++) {
          contents[i].classList.add("hide");
        }

        for (let i = 0; i < links.length; i++) {
          links[i].classList.remove("active");
          links[i].ariaSelected = false;
        }

        link.classList.add("active");
        link.ariaSelected = true;
        targetElement.classList.remove("hide");
      });
    } else {
      link.disabled = true;
    }
  });
});

// Portfolio filter
const portfolioFilters = document.querySelectorAll(".portfolio-menu button");

portfolioFilters.forEach((filter) => {
  filter.addEventListener("click", function () {
    let btn = portfolioFilters[0];

    while (btn) {
      if (btn.tagName === "BUTTON") {
        btn.classList.remove("active");
      }

      btn = btn.nextSibling;
    }

    this.classList.add("active");

    let selected = filter.getAttribute("data-filter"),
      itemsToHide = document.querySelectorAll(
        '.portfolio-grid .portfolio :not([data-filter="' + selected + '"])'
      ),
      itemsToShow = document.querySelectorAll(
        '.portfolio-grid .portfolio [data-filter="' + selected + '"]'
      );

    if (selected == "all") {
      itemsToHide = [];
      itemsToShow = document.querySelectorAll(
        ".portfolio-grid .portfolio [data-filter]"
      );
    }

    itemsToHide.forEach((el) => {
      el.parentElement.classList.add("hide");
      el.parentElement.classList.remove("show");
    });

    itemsToShow.forEach((el) => {
      el.parentElement.classList.remove("hide");
      el.parentElement.classList.add("show");
    });
  });
});

// Scroll to top
var st = document.querySelector("[data-web-trigger=scroll-top]");

if (st) {
  window.onscroll = function () {
    if (
      document.body.scrollTop > 50 ||
      document.documentElement.scrollTop > 50
    ) {
      st.classList.remove("is-hided");
    } else {
      st.classList.add("is-hided");
    }
  };

  st.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

// // Auto-hover middle logo in marquee
// var customMarqueeContainer = document.querySelector(".logo-marquee-container");
// if (customMarqueeContainer) {
//   var marqueeLogos = customMarqueeContainer.querySelectorAll("img");
  
//   function updateMiddleLogo() {
//     var containerRect = customMarqueeContainer.getBoundingClientRect();
//     var containerCenter = containerRect.left + containerRect.width / 2;
    
//     var closestLogo = null;
//     var minDistance = Infinity;
    
//     marqueeLogos.forEach(function(logo) {
//       logo.classList.remove('active-middle');
      
//       var rect = logo.getBoundingClientRect();
//       var logoCenter = rect.left + rect.width / 2;
//       var distance = Math.abs(containerCenter - logoCenter);
      
//       if (distance < minDistance) {
//         minDistance = distance;
//         closestLogo = logo;
//       }
//     });
    
//     if (closestLogo && minDistance < 200) { 
//         closestLogo.classList.add('active-middle');
//     }
    
//     requestAnimationFrame(updateMiddleLogo);
//   }
  
//   requestAnimationFrame(updateMiddleLogo);
// }
const logos = document.querySelectorAll(".logo-track img");

function highlightCenterLogo() {
  const center = window.innerWidth / 2;

  let closestLogo = null;
  let closestDistance = Infinity;

  logos.forEach((logo) => {
    const rect = logo.getBoundingClientRect();
    const logoCenter = rect.left + rect.width / 2;

    const distance = Math.abs(center - logoCenter);

    if (distance < closestDistance) {
      closestDistance = distance;
      closestLogo = logo;
    }
  });

  // Remove previous active
  logos.forEach((logo) => logo.classList.remove("active-middle"));

  // Add to closest
  if (closestLogo) {
    closestLogo.classList.add("active-middle");
  }
}

// Run continuously
setInterval(highlightCenterLogo, 100);