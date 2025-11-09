import { useParams, Link } from 'react-router-dom'
import products from '../data/products.js'
import ProductCard from '../components/ProductCard.jsx'

export default function Product(){
  const { id } = useParams()
  const product = products.find(p => p.id === id)

  if(!product) return (
    <div className="section">
      <div className="container">
        <h2>Product not found</h2>
        <p>The product you're looking for doesn't exist.</p>
        <Link to="/">Back to home</Link>
      </div>
    </div>
  )

  // Since product data only includes one image, create a small gallery by reusing the image and placeholders
  const gallery = [product.image, product.image, product.image]

  const others = products.filter(p => p.id !== product.id && p.category === product.category).slice(0,4)

  return (
    <div className="section">
      <div className="container">
        <div style={{display:'grid', gridTemplateColumns:'1fr 360px', gap:24}}>
          <div>
            <div style={{borderRadius:12, overflow:'hidden'}}>
              <img src={gallery[0]} alt={product.name} style={{width:'100%', height:420, objectFit:'cover'}} />
            </div>

            <div style={{display:'flex', gap:8, marginTop:12}}>
              {gallery.map((g, i) => (
                <img key={i} src={g} alt={`${product.name} ${i}`} style={{width:100, height:70, objectFit:'cover', borderRadius:8}} />
              ))}
            </div>

            <h1 style={{marginTop:18}}>{product.name}</h1>
            <p style={{color:'var(--muted)'}}>Brand: {product.brand} • Category: {product.category}</p>
            <p style={{marginTop:12}}>{product.description}</p>
          </div>

          <aside>
            <div className="card">
              <div style={{fontSize:20, fontWeight:800}}>${product.price.toFixed(2)}</div>
              <div style={{marginTop:12}}>
                <button className="btn btn-primary">Add to Cart</button>
              </div>
            </div>

            <div style={{marginTop:18}}>
              <h3>Other {product.category} products</h3>
              <div style={{display:'grid', gap:12, marginTop:8}}>
                {others.map(p=> (
                  <Link key={p.id} to={`/product/${p.id}`} style={{textDecoration:'none'}}>
                    <div style={{display:'flex', gap:12, alignItems:'center'}}>
                      <img src={p.image} alt={p.name} style={{width:64, height:48, objectFit:'cover', borderRadius:8}} />
                      <div style={{fontSize:14}}>{p.name}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
