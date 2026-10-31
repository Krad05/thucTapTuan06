const crypto = require('node:crypto');
const path = require('node:path');
const jsonServer = require('json-server');

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const sessions = new Map();
const port = Number(process.env.API_PORT || 3001);
const demoUsername = process.env.DEMO_USERNAME || 'adrian';
const demoPassword = process.env.DEMO_PASSWORD || 'adrian05';
const demoAccounts = new Map([
  [demoUsername, { password: demoPassword, firstName: 'Adrian', role: 'admin', id: 1 }],
  ['moderator', { password: 'moderator05', firstName: 'Morgan', role: 'moderator', id: 2 }],
  ['viewer', { password: 'viewer05', firstName: 'Alex', role: 'user', id: 3 }],
]);
const sessionLifetime = 60 * 60 * 1000;

server.use(jsonServer.defaults());
server.use(jsonServer.bodyParser);

function userFromRequest(req) {
  const token = (req.get('authorization') || '').replace(/^Bearer\s+/i, '');
  const session = sessions.get(token);
  if (!session) return null;
  if (session.expiresAt <= Date.now()) {
    sessions.delete(token);
    return null;
  }
  return session.user;
}

server.post('/auth/login', (req, res) => {
  const { username, password } = req.body || {};
  const account = demoAccounts.get(username);
  if (!account || password !== account.password) {
    return res.status(401).json({ message: 'Tên đăng nhập hoặc mật khẩu không đúng.' });
  }

  const accessToken = crypto.randomUUID();
  const user = { id: account.id, username, firstName: account.firstName, role: account.role };
  sessions.set(accessToken, { user, expiresAt: Date.now() + sessionLifetime });
  return res.json({ accessToken });
});

server.get('/auth/me', (req, res) => {
  const user = userFromRequest(req);
  if (!user) return res.status(401).json({ message: 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn.' });
  return res.json(user);
});

server.use('/products', (req, res, next) => {
  const user = userFromRequest(req);
  if (!user) return res.status(401).json({ message: 'Vui lòng đăng nhập.' });

  const allowed =
    req.method === 'GET' ||
    (req.method === 'POST' && user.role === 'admin') ||
    (['PUT', 'PATCH'].includes(req.method) && ['admin', 'moderator'].includes(user.role)) ||
    (req.method === 'DELETE' && user.role === 'admin');

  if (!allowed) return res.status(403).json({ message: 'Bạn không có quyền thực hiện thao tác này.' });
  return next();
});

server.use(router);
server.listen(port, () => {
  console.log('API đang chạy tại http://localhost:' + port);
  console.log('Tài khoản demo: adrian, moderator, viewer');
});
