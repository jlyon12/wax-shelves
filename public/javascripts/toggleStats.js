const statsContainer = document.getElementById('statsContainer');
const sectionContainer = document.querySelector('section');
const toggleStatsBtn = document.getElementById('toggleStats');
const toggleStatsText = document.getElementById('toggleStatsText');
const toggleStatsIcon = document.getElementById('toggleStatsIcon');
toggleStatsBtn.addEventListener('click', () => {
	toggleStatsText.innerText = statsContainer.classList.contains('invisible')
		? 'Hide Stats'
		: 'View Stats';
	toggleStatsIcon.classList.toggle('-rotate-90');
	toggleStatsIcon.classList.toggle('rotate-90');
	statsContainer.classList.toggle('invisible');
	statsContainer.classList.toggle('opacity-0');

	sectionContainer.classList.toggle('lg:grid-cols-3');
	statsContainer.classList.toggle('lg:col-start-2');
	statsContainer.classList.toggle('lg:col-span-2');
	statsContainer.classList.toggle('lg:row-start-1');
	statsContainer.classList.toggle('lg:row-end-4');
	statsContainer.classList.toggle('max-h-0');
});
