const fs = require('fs');
const html = fs.readFileSync('tn_products.html', 'utf8');
const regex = /<img[^>]*src=["']([^"']+)["'][^>]*alt=["']([^"']+)["']/gi;
let m;
const products = {};
while((m = regex.exec(html)) !== null) {
  if(m[2].trim() && (m[1].includes('tiendanube') || m[1].includes('tcdn')) && !m[2].includes('Logo')) {
    let src = m[1];
    if (src.startsWith('//')) src = 'https:' + src;
    products[m[2]] = src;
  }
}
const pricesRegex = /<div class="item-price[^>]*>.*?<span class="js-price-display[^>]*>(.*?)<\/span>/gs;
// Actually just doing image + title is enough for a demo catalog, wait prices would be great. Let's just output the images for now.
console.log(JSON.stringify(products, null, 2));
