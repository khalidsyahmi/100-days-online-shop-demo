const mobileMenuBtnElement = document.getElementById('mobile-menu-btn');
const mobileMenuElement = document.getElementById('mobile-menu');

function toggleMobileMenu() {
    mobileMenuElement.classList.toggle('open');
   /*  mobileMenuBtnElement.classList.toggle('hide'); */
}

mobileMenuBtnElement.addEventListener('click', toggleMobileMenu);