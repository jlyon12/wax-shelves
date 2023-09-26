const toggleBtn = document.getElementById('toggleBtn');
const closeBtn = document.getElementById('closeBtn');
const navMenu = document.querySelector('nav');
const mainContent = document.querySelector('main');
toggleBtn.addEventListener('click', () => {
	navMenu.classList.toggle('invisible');
	navMenu.classList.toggle('opacity-0');
	mainContent.classList.toggle('blur');
});
closeBtn.addEventListener('click', () => {
	navMenu.classList.toggle('invisible');
	navMenu.classList.toggle('opacity-0');
	mainContent.classList.toggle('blur');
});
