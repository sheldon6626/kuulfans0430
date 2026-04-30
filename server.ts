import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Sitemap generate API
  let cachedSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.kuulfans.com/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://www.kuulfans.com/products</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.kuulfans.com/blog</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;

  app.post('/api/sitemap/generate', (req, res) => {
    // In a real app, this would query Firebase for products, posts, and images
    // For now we'll update the modified date of our cached map
    cachedSitemap = cachedSitemap.replace(/<lastmod>.*<\/lastmod>/g, `<lastmod>${new Date().toISOString()}</lastmod>`);
    res.json({ success: true, message: 'Sitemap updated' });
  });

  app.get('/sitemap.xml', (req, res) => {
    res.header('Content-Type', 'application/xml');
    res.send(cachedSitemap);
  });

  // Proxy to language models (Custom AI Layer)
  app.post('/api/ai/generate', async (req, res) => {
    try {
      const { prompt, config } = req.body;
      // config from Firebase: { apiKey: string, baseUrl: string, model: string }
      if (!config || !config.apiKey) {
         return res.status(400).json({ error: "Missing AI configuration" });
      }

      // We'll assume OpenAI-compatible API format for a custom proxy layer
      const openaiEndpoint = config.baseUrl ? `${config.baseUrl}/v1/chat/completions` : 'https://api.openai.com/v1/chat/completions';
      
      const aiRes = await fetch(openaiEndpoint, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.apiKey}`
         },
         body: JSON.stringify({
            model: config.model || 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }]
         })
      });

      if (!aiRes.ok) {
         const errorText = await aiRes.text();
         throw new Error(`AI API failed: ${errorText}`);
      }
      
      const data = await aiRes.json();
      res.json({ result: data.choices[0].message.content });
    } catch (e) {
      res.status(500).json({ error: String(e) });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
