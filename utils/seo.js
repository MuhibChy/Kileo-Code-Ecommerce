const generateSEOMetaTags = (data) => {
  const defaultMeta = {
    title: 'Kileo Ecommerce - Your Online Shopping Destination',
    description: 'Discover amazing products at great prices. Shop electronics, fashion, home goods and more with fast shipping and secure checkout.',
    keywords: 'ecommerce, online shopping, buy online, shopping cart, online store',
    url: process.env.FRONTEND_URL || 'https://kileo.com',
    image: `${process.env.FRONTEND_URL}/images/logo.png`,
    type: 'website'
  };

  const meta = { ...defaultMeta, ...data };

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    og: {
      title: meta.title,
      description: meta.description,
      url: meta.url,
      image: meta.image,
      type: meta.type
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
      image: meta.image
    }
  };
};

const generateProductSEO = (product) => {
  return generateSEOMetaTags({
    title: `${product.name} - Buy Online at Kileo Ecommerce`,
    description: product.description,
    keywords: [...product.tags, product.category?.name, product.brand?.name].join(', '),
    url: `${process.env.FRONTEND_URL}/products/${product.slug}`,
    image: product.images[0],
    type: 'product'
  });
};

const generateCategorySEO = (category) => {
  return generateSEOMetaTags({
    title: `${category.name} - Shop ${category.name} Online`,
    description: `Browse our collection of ${category.name} products. Find the best deals on ${category.name} items.`,
    keywords: category.name,
    url: `${process.env.FRONTEND_URL}/categories/${category.slug}`,
    type: 'category'
  });
};

const generateBlogSEO = (blog) => {
  return generateSEOMetaTags({
    title: `${blog.title} - Kileo Ecommerce Blog`,
    description: blog.excerpt || blog.content.substring(0, 160),
    keywords: blog.tags.join(', '),
    url: `${process.env.FRONTEND_URL}/blog/${blog.slug}`,
    image: blog.featuredImage,
    type: 'article'
  });
};

module.exports = {
  generateSEOMetaTags,
  generateProductSEO,
  generateCategorySEO,
  generateBlogSEO
};