'use strict';

const samples = {
  health: {
    method: 'GET', path: '/health', status: 200, title: 'Service health',
    description: 'Check whether the sample service is available.',
    example: { status: 'ok', service: 'sample-api', timestamp: '2026-01-12T10:30:00Z', sample: true }
  },
  users: {
    method: 'GET', path: '/users', status: 200, title: 'List users',
    description: 'Return a small, fictional collection of sample users.',
    example: { data: [{ id: 'usr_101', name: 'Alex Morgan', email: 'alex@example.test' }, { id: 'usr_102', name: 'Sam Rivera', email: 'sam@example.test' }], count: 2, sample: true }
  },
  create: {
    method: 'POST', path: '/users', status: 201, title: 'Create a user (sample)',
    description: 'Preview a fictional create response; no record is written or stored.',
    example: { id: 'usr_demo_203', name: 'Jordan Lee', email: 'jordan@example.test', created: true, sample: true }
  },
  user: {
    method: 'GET', path: '/users/:id', status: 200, title: 'Get a user by ID',
    description: 'Look up the documented sample user at /users/usr_101.',
    example: { id: 'usr_101', name: 'Alex Morgan', email: 'alex@example.test', sample: true }
  }
};

const form = document.getElementById('request-form');
const methodSelect = document.getElementById('method-select');
const pathInput = document.getElementById('path-input');
const bodyEditor = document.getElementById('body-editor');
const requestBody = document.getElementById('request-body');
const responseOutput = document.getElementById('response-output');
const responseCaption = document.getElementById('response-caption');
const responseStatus = document.getElementById('response-status');
const responseDuration = document.getElementById('response-duration');
const curlButton = document.getElementById('copy-curl');
const copyLabel = document.getElementById('copy-label');
let selectedKey = 'health';
let toastTimer;

function pretty(value) {
  return JSON.stringify(value, null, 2);
}

function normalizedPath(value) {
  let path = value.trim();
  if (!path.startsWith('/')) path = `/${path}`;
  return path.replace(/\/{2,}/g, '/');
}

function updateMethodStyle() {
  const method = methodSelect.value.toLowerCase();
  methodSelect.dataset.method = method;
  bodyEditor.hidden = method !== 'POST';
}

function selectEndpoint(key) {
  const endpoint = samples[key];
  if (!endpoint) return;
  selectedKey = key;
  methodSelect.value = endpoint.method;
  pathInput.value = endpoint.path;
  updateMethodStyle();
  document.getElementById('doc-method').textContent = endpoint.method;
  document.getElementById('doc-method').className = `method-badge ${endpoint.method.toLowerCase()}`;
  document.getElementById('endpoint-title').textContent = endpoint.path;
  document.getElementById('endpoint-description').textContent = endpoint.description;
  document.getElementById('doc-url').textContent = `${endpoint.method} /api${endpoint.path}`;
  document.querySelector('.status-badge').textContent = `${endpoint.status} ${endpoint.status === 201 ? 'CREATED' : 'OK'}`;
  document.getElementById('example-response').textContent = pretty(endpoint.example);
  document.querySelectorAll('.endpoint-link').forEach((button) => {
    const active = button.dataset.endpoint === key;
    button.classList.toggle('selected', active);
    if (active) button.setAttribute('aria-current', 'true');
    else button.removeAttribute('aria-current');
  });
}

document.getElementById('endpoint-list').addEventListener('click', (event) => {
  const button = event.target.closest('[data-endpoint]');
  if (!button) return;
  selectEndpoint(button.dataset.endpoint);
  responseCaption.textContent = 'Route selected · ready to simulate';
});

methodSelect.addEventListener('change', updateMethodStyle);

function routeResponse(method, path, payload) {
  if (method === 'GET' && path === '/health') return { status: 200, body: samples.health.example };
  if (method === 'GET' && path === '/users') return { status: 200, body: samples.users.example };
  if (method === 'POST' && path === '/users') {
    return { status: 201, body: { id: 'usr_demo_203', name: payload.name || 'Sample User', email: payload.email || 'user@example.test', created: true, sample: true, note: 'Preview only; no record was saved.' } };
  }
  const userMatch = path.match(/^\/users\/([^/]+)$/);
  if (method === 'GET' && userMatch) {
    if (userMatch[1] === 'usr_101') return { status: 200, body: samples.user.example };
    return { status: 404, body: { error: 'Sample user not found', requestedId: userMatch[1], sample: true } };
  }
  if (method === 'DELETE' && userMatch) {
    return { status: 200, body: { id: userMatch[1], deleted: true, sample: true, note: 'Simulated only; no data was changed.' } };
  }
  return { status: 404, body: { error: 'No matching sample route', method, path, sample: true } };
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const method = methodSelect.value;
  const path = normalizedPath(pathInput.value);
  pathInput.value = path;
  let payload = {};
  if (method === 'POST') {
    try {
      payload = JSON.parse(requestBody.value);
      if (!payload || Array.isArray(payload) || typeof payload !== 'object') throw new Error('JSON body must be an object.');
    } catch (error) {
      responseStatus.textContent = '400';
      responseStatus.className = 'response-status invalid';
      responseDuration.textContent = '0 ms';
      responseCaption.textContent = 'Invalid sample JSON';
      responseOutput.textContent = pretty({ error: error.message || 'Invalid JSON', sample: true });
      return;
    }
  }
  const start = performance.now();
  const result = routeResponse(method, path, payload);
  const elapsed = Math.max(1, Math.round(performance.now() - start) + 8);
  responseStatus.textContent = String(result.status);
  responseStatus.className = `response-status ${result.status < 300 ? 'good' : result.status === 404 ? 'not-found' : 'invalid'}`;
  responseDuration.textContent = `${elapsed} ms`;
  responseCaption.textContent = 'Simulated locally · no network request';
  responseOutput.textContent = pretty(result.body);
});

function shellQuote(value) {
  return `'${String(value).replace(/'/g, "'\\''")}'`;
}

function curlCommand() {
  const method = methodSelect.value;
  const path = normalizedPath(pathInput.value);
  let command = `curl -X ${method} ${shellQuote(`http://localhost:8765/api${path}`)} -H 'Accept: application/json'`;
  if (method === 'POST') command += ` -H 'Content-Type: application/json' --data ${shellQuote(requestBody.value)}`;
  return command;
}

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const temporary = document.createElement('textarea');
  temporary.value = text;
  temporary.setAttribute('readonly', '');
  temporary.style.position = 'fixed';
  temporary.style.opacity = '0';
  document.body.appendChild(temporary);
  temporary.select();
  const copied = document.execCommand('copy');
  temporary.remove();
  if (!copied) throw new Error('Clipboard unavailable');
}

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
}

curlButton.addEventListener('click', async () => {
  try {
    await copyText(curlCommand());
    copyLabel.textContent = 'Copied';
    showToast('Sample cURL command copied. It is an example only.');
  } catch (error) {
    copyLabel.textContent = 'Copy unavailable';
    showToast('Clipboard access is unavailable in this browser.');
  }
  setTimeout(() => { copyLabel.textContent = 'Copy cURL'; }, 1800);
});

selectEndpoint(selectedKey);
updateMethodStyle();
