const emailForm = document.getElementById('email-form');

emailForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const fields = new FormData(emailForm);
  const name = fields.get('name').trim();
  const email = fields.get('email').trim();
  const message = fields.get('message').trim();

  for (const [field, value, prompt] of [
    ['name', name, 'Isi nama kamu.'],
    ['message', message, 'Tulis pesan kamu.'],
  ]) {
    if (value) continue;
    const input = emailForm.elements.namedItem(field);
    input.setCustomValidity(prompt);
    input.reportValidity();
    input.setCustomValidity('');
    return;
  }

  const subject = encodeURIComponent('Pesan portofolio dari ' + name);
  const body = encodeURIComponent(['Nama ' + name, 'Email balasan ' + email, '', message].join('\r\n'));
  window.location.href = emailForm.getAttribute('action') + '?subject=' + subject + '&body=' + body;
});

emailForm.querySelector('button').disabled = false;

const commentForm = document.getElementById('comment-form');
const commentButton = commentForm.querySelector('button');
const commentStatus = document.getElementById('comment-status');
const commentEmpty = document.getElementById('comment-empty');
const commentList = document.getElementById('comment-list');
const commentRetry = document.getElementById('comment-retry');
const dateFormat = new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeZone: 'Asia/Jakarta' });
let recentComments = [];

function commentItem(comment) {
  const item = document.createElement('li');
  const avatar = document.createElement('span');
  avatar.className = 'guestbook-avatar';
  avatar.setAttribute('aria-hidden', 'true');
  avatar.textContent = comment.name.split(/\s+/u).slice(0, 2).map((word) => Array.from(word)[0]).join('').toUpperCase();

  const content = document.createElement('div');
  const name = document.createElement('strong');
  name.className = 'guestbook-author';
  name.textContent = comment.name;
  const date = document.createElement('time');
  date.className = 'guestbook-meta';
  date.dateTime = comment.createdAt;
  date.textContent = dateFormat.format(new Date(comment.createdAt));
  const message = document.createElement('p');
  message.className = 'guestbook-message';
  message.textContent = comment.message;
  content.append(name, date, message);

  item.append(avatar, content);
  return item;
}

function showComments(entries) {
  const byId = new Map([...recentComments, ...entries].map((comment) => [comment.id, comment]));
  recentComments = Array.from(byId.values()).sort((first, second) => second.id - first.id).slice(0, 30);
  commentList.replaceChildren(...recentComments.map(commentItem));
  commentList.hidden = recentComments.length === 0;
  commentEmpty.hidden = !commentList.hidden;
  commentEmpty.textContent = 'Belum ada komentar.';
}

async function loadComments() {
  commentRetry.hidden = true;
  if (commentList.hidden) commentEmpty.textContent = 'Memuat komentar…';

  try {
    const response = await fetch(commentForm.action, { signal: AbortSignal.timeout(12000) });
    if (!response.ok) throw new Error('Gagal memuat komentar');
    const data = await response.json();
    showComments(data.comments);
  } catch {
    if (commentList.hidden) commentEmpty.textContent = 'Komentar belum bisa dimuat.';
    commentRetry.hidden = false;
  }
}

commentRetry.addEventListener('click', loadComments);

commentForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (commentButton.disabled) return;
  const fields = new FormData(commentForm);

  commentButton.disabled = true;
  commentStatus.removeAttribute('data-state');
  commentStatus.textContent = 'Menyimpan komentar…';

  try {
    const response = await fetch(commentForm.action, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: fields.get('name'), message: fields.get('message') }),
      signal: AbortSignal.timeout(15000),
    });
    const data = await response.json();
    if (!response.ok) {
      commentStatus.dataset.state = 'error';
      commentStatus.textContent = data.error;
      return;
    }

    showComments([data.comment]);
    commentForm.reset();
    commentStatus.textContent = 'Komentar sudah ditambahkan.';
  } catch {
    commentStatus.dataset.state = 'error';
    commentStatus.textContent = 'Komentar belum bisa disimpan. Coba lagi.';
  } finally {
    commentButton.disabled = false;
  }
});

commentButton.disabled = false;
loadComments();
