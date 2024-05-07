const ButtonBtn = document.querySelector('.btn');

ButtonBtn.addEventListener('click', () => {
	let dimensions = 'Ширина: ' + document.documentElement.clientWidth + ' пикс. Высота: ' + document.documentElement.clientHeight + ' пикс.';
    alert(dimensions);
});

