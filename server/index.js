const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors({ origin: 'http://localhost:5173', credentials: false }))
app.use(express.json())

let users = []
const products = [
  { id:'soc-1', name:'Velocity Pro Cleats', brand:'HTKSA', price:129.99, category:'soccer', image:'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?q=80&w=1200&auto=format&fit=crop' },
  { id:'soc-2', name:'AeroMatch Ball', brand:'HTKSA', price:39.99, category:'soccer', image:'https://images.unsplash.com/photo-1600965962357-c8aa1eb1f71c?q=80&w=1200&auto=format&fit=crop' },
  { id:'soc-3', name:'GripGuard Gloves', brand:'HTKSA', price:49.99, category:'soccer', image:'https://images.unsplash.com/photo-1509098681021-1cbeff2075a0?q=80&w=1200&auto=format&fit=crop' },
  { id:'soc-4', name:'Elite Training Jersey', brand:'HTKSA', price:34.99, category:'soccer', image:'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=1200&auto=format&fit=crop' },
  { id:'bkb-1', name:'Skyline Highs (Shoes)', brand:'HTKSA', price:149.99, category:'basketball', image:'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop' },
  { id:'bkb-2', name:'Precision Indoor Ball', brand:'HTKSA', price:59.99, category:'basketball', image:'https://images.unsplash.com/photo-1539874754764-5a96559165b7?q=80&w=1200&auto=format&fit=crop' },
  { id:'bkb-3', name:'QuickDry Tank', brand:'HTKSA', price:29.99, category:'basketball', image:'https://images.unsplash.com/photo-1520412099551-62b6bafeb5bb?q=80&w=1200&auto=format&fit=crop' },
  { id:'bkb-4', name:'Court Traction Socks', brand:'HTKSA', price:14.99, category:'basketball', image:'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1200&auto=format&fit=crop' },
  { id:'bbl-1', name:'Slugger Bat Elite', brand:'HTKSA', price:99.99, category:'baseball', image:'https://images.unsplash.com/photo-1613376023733-0c39e3641f02?q=80&w=1200&auto=format&fit=crop' },
  { id:'bbl-2', name:'Diamond Field Glove', brand:'HTKSA', price:79.99, category:'baseball', image:'https://images.unsplash.com/photo-1603767864324-8a1b51b5eab1?q=80&w=1200&auto=format&fit=crop' },
  { id:'bbl-3', name:'Pro Stitch Cap', brand:'HTKSA', price:24.99, category:'baseball', image:'https://images.unsplash.com/photo-1484139677140-048a848d0c8b?q=80&w=1200&auto=format&fit=crop' },
  { id:'bbl-4', name:'Base Running Cleats', brand:'HTKSA', price:109.99, category:'baseball', image:'https://images.unsplash.com/photo-1521335729156-6b95a04f994f?q=80&w=1200&auto=format&fit=crop' },
  { id:'hky-1', name:'Glacier Stick Pro', brand:'HTKSA', price:129.99, category:'hockey', image:'https://images.unsplash.com/photo-1547955922-26be0c160a63?q=80&w=1200&auto=format&fit=crop' },
  { id:'hky-2', name:'Impact Helmet', brand:'HTKSA', price:89.99, category:'hockey', image:'https://images.unsplash.com/photo-1551024739-78e9d60c45ca?q=80&w=1200&auto=format&fit=crop' },
  { id:'hky-3', name:'IceGuard Pads', brand:'HTKSA', price:74.99, category:'hockey', image:'https://images.unsplash.com/photo-1577041247081-3d0adf7c9e50?q=80&w=1200&auto=format&fit=crop' },
  { id:'hky-4', name:'Thermal Base Layer', brand:'HTKSA', price:39.99, category:'hockey', image:'https://images.unsplash.com/photo-1519838256642-c02cc4c73185?q=80&w=1200&auto=format&fit=crop' },
]

app.get('/api/health', (_req, res) => res.json({ ok: true }))
app.get('/api/products', (_req, res) => res.json(products))
app.get('/', (_req, res) => res.send('HTKSA API running. Try /api/health or /api/products'));


app.post('/api/auth/signup', (req, res) => {
  const { name, email, password } = req.body || {}
  if (!name || !email || !password) return res.status(400).json({ error: 'missing fields' })
  if (users.some(u => u.email === email)) return res.status(409).json({ error: 'Email already used' })
  users.push({ name, email, password })
  res.json({ name, email, token: `fake.${Buffer.from(email).toString('base64')}.token` })
})

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {}
  const u = users.find(x => x.email === email && x.password === password)
  if (!u) return res.status(401).json({ error: 'Invalid credentials' })
  res.json({ name: u.name, email: u.email, token: `fake.${Buffer.from(email).toString('base64')}.token` })
})

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`))
