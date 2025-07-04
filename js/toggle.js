




function toggleCollapse(id) {
  const desc = document.getElementById(`${id}-desc`);
  const btn = document.getElementById(`${id}-btn`);
  const icon = document.getElementById(`${id}-icon`);

  if (!desc || !btn || !icon) return;

  const isHidden = desc.hasAttribute('hidden');

  if (isHidden) {
    desc.removeAttribute('hidden');
    // Use scrollHeight + 20px for padding breathing room
    desc.style.maxHeight = desc.scrollHeight + 20 + "px";
    btn.setAttribute('aria-expanded', 'true');
    icon.classList.add('rotate-90');
  } else {
    // Collapse
    desc.style.maxHeight = desc.scrollHeight + "px"; // reset height for transition
    // Allow transition frame before collapsing to 0
    setTimeout(() => {
      desc.style.maxHeight = "0px";
    }, 10);
    desc.setAttribute('hidden', '');
    btn.setAttribute('aria-expanded', 'false');
    icon.classList.remove('rotate-90');
  }
}


