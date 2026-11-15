const details = document.getElementById('project-detail');
const title = document.getElementById('detail-title');

for (const button of document.querySelectorAll('button.detail-button')) {
  button.addEventListener('click', () => {
    title.textContent = button.closest('.project-card').querySelector('h3').textContent;
    details.showModal();
  });
}
