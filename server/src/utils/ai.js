// src/utils/ai.js
import Product from '../models/Product.js';

const storeSystemPrompt =
  "You are HTKSA Sports Shop assistant. Be concise, helpful, and grounded in the store catalog (football, basketball). If you don't know, say so briefly.";

async function replyWithFAQ(message) {
  const m = message.toLowerCase();

  // tiny product-aware suggestion
  const pickProducts = async (q) => {
    if (!q) return [];
    const docs = await Product.find({ $text: { $search: q } }).limit(3);
    return docs.map(d => `• ${d.name} — $${d.price.toFixed(2)} (${d.category})`).join('\n');
  };

  if (m.includes('shipping')) {
    return "Shipping: local delivery 3–5 business days; free over $75. Pickup available at checkout.";
  }
  if (m.includes('return') || m.includes('refund')) {
    return "Returns: 30-day return window on unused items with receipt. Refund to original payment method.";
  }
  if (m.includes('hours') || m.includes('open')) {
    return "Store hours: Mon–Fri 10–7, Sat 11–6, Sun closed. Online shop is 24/7.";
  }
  if (m.includes('order status') || m.includes('track order')) {
    return "To track an order, go to Orders while logged in. Pending/Paid orders can be cancelled.";
  }

  // naive keyword → product suggestions
  const terms = (m.match(/[a-z]{4,}/g) || []).slice(0,3).join(' ');
  const suggestions = await pickProducts(terms);
  if (suggestions) {
    return `Here are a few items you might like:\n${suggestions}\n\nAsk me about size, stock, or price filters.`;
  }
  return "I can help with catalog, cart/checkout, returns, and orders. Try asking: 'show football under $50'.";
}

async function callOllama(message, history=[]) {
  const base = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
  const model = process.env.OLLAMA_MODEL || 'llama3.1';
  const messages = [
    { role: 'system', content: storeSystemPrompt },
    ...history,
    { role: 'user', content: message }
  ];
  const res = await fetch(`${base}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, messages, stream: false })
  });
  if (!res.ok) throw new Error(`Ollama HTTP ${res.status}`);
  const data = await res.json();
  return data.message?.content?.trim() || "I'm having trouble reaching the model.";
}

async function callHF(message, history=[]) {
  const key = process.env.HF_API_KEY;
  const model = process.env.HF_MODEL || 'meta-llama/Meta-Llama-3-8B-Instruct';
  if (!key) return "HF_API_KEY is not set on the server.";
  const prompt =
`System: ${storeSystemPrompt}
User: ${message}
Assistant:`;
  const res = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ inputs: prompt, parameters: { max_new_tokens: 300, temperature: 0.7 } })
  });
  if (!res.ok) throw new Error(`HF HTTP ${res.status}`);
  const out = await res.json();
  const text = Array.isArray(out) ? out[0]?.generated_text || '' : (out?.generated_text || '');
  return text.split('Assistant:').pop()?.trim() || "No response from model.";
}

export async function chatRespond(message, history=[]) {
  const provider = (process.env.LLM_PROVIDER || 'faq').toLowerCase();
  try {
    if (provider === 'ollama') return await callOllama(message, history);
    if (provider === 'hf')     return await callHF(message, history);
    // default: FAQ + product lookup (free)
    return await replyWithFAQ(message);
  } catch (e) {
    console.error('AI error:', e.message);
    // graceful fallback
    return await replyWithFAQ(message);
  }
}
