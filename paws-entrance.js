(() => {
  const header = document.getElementById("paws-visitor");
  if (!header) return;
  const stage = header.querySelector(".paws-walk-stage");
  const sprite = header.querySelector(".paws-visitor-sprite");
  const bubble = header.querySelector(".paws-bubble");
  if (!stage || !sprite || !bubble) return;

  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  const pile = document.createElement("i");
  pile.className = "paws-cleanup-pile";
  pile.textContent = "💩";
  pile.setAttribute("aria-hidden", "true");
  let steps;
  let timer;
  let arrival;
  let finished = false;

  function pose(position) {
    sprite.classList.add("paws-cleanup");
    sprite.style.backgroundPosition = position + "% 50%";
  }

  function finish() {
    finished = true;
    clearInterval(steps);
    clearTimeout(timer);
    clearTimeout(arrival);
    sprite.classList.remove("paws-walking");
    pile.remove();
    pose(100);
    bubble.hidden = false;
  }

  function scoop() {
    if (finished) return;
    clearTimeout(arrival);
    clearInterval(steps);
    sprite.classList.remove("paws-walking");
    pose(0);
    timer = setTimeout(() => {
      pose(50);
      const distance = stage.clientWidth * 0.67;
      timer = setTimeout(() => {
        pile.animate([
          { transform: "translate(0, 0)" },
          { transform: "translateX(" + (-distance / 2) + "px) translateY(-170%)" },
          { transform: "translateX(" + (-distance) + "px) translateY(-110%)", opacity: 0 }
        ], { duration: 530, fill: "forwards", easing: "ease-in-out" });
        timer = setTimeout(finish, 680);
      }, 400);
    }, 330);
  }

  const walk = new Image();
  const cleanup = new Image();
  walk.src = "images/paws-sprite.png";
  cleanup.src = "images/paws-cleanup.png";
  Promise.all([walk.decode(), cleanup.decode()]).then(() => {
    if (motion.matches) { finish(); return; }
    stage.append(pile);
    let frame = 0;
    sprite.style.backgroundPosition = "0% 0%";
    sprite.addEventListener("animationend", event => {
      if (event.animationName === "paws-visitor-enter") scoop();
    });
    sprite.classList.add("paws-walking");
    const duration = getComputedStyle(sprite).animationDuration;
    const seconds = parseFloat(duration) || 0;
    arrival = setTimeout(scoop, seconds * (duration.startsWith(seconds + "ms") ? 1 : 1000) + 100);
    steps = setInterval(() => {
      frame = (frame + 1) % 4;
      sprite.style.backgroundPosition = (frame * 100 / 3) + "% 0%";
    }, 180);
    motion.addEventListener("change", event => {
      if (event.matches) finish();
    });
  }).catch(() => {
    bubble.hidden = false;
  });
})();
