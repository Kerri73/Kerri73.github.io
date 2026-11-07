(() => {
  const box = document.getElementById('paws-visitor');
  if (!box) return;
  const sprite = box.querySelector('.paws-visitor-sprite');
  const bubble = box.querySelector('.paws-bubble');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let timer;
  const setFrame = n => {
    sprite.style.backgroundPosition = `${(n % 4) * 100 / 3}% ${Math.floor(n / 4) * 50}%`;
  };
  const finish = () => {
    clearInterval(timer);
    sprite.classList.remove('paws-walking');
    setFrame(11);
    bubble.hidden = false;
  };
  const image = new Image();
  image.onload = () => {
    if (reduced.matches) { finish(); return; }
    let frame = 0;
    setFrame(frame);
    sprite.classList.add('paws-walking');
    timer = setInterval(() => setFrame(++frame % 4), 150);
  };
  sprite.addEventListener('animationend', event => {
    if (event.animationName !== 'paws-visitor-enter') return;
    clearInterval(timer);
    sprite.classList.remove('paws-walking');
    const sequence = [4, 5, 6, 7, 8, 9, 10, 9, 8, 9, 10, 11];
    let i = 0;
    setFrame(sequence[i++]);
    timer = setInterval(() => {
      if (i === sequence.length) { finish(); return; }
      setFrame(sequence[i++]);
    }, 170);
  });
  reduced.addEventListener('change', () => {
    if (reduced.matches) finish();
  });
  image.src = 'images/paws-sprite.png';
})();
