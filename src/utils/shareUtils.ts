// Utility functions for social media sharing

export const generateShareUrl = (postId: string): string => {
  return `${window.location.origin}${window.location.pathname}#post-${postId}`;
};

export const shareToFacebook = (post: { id: string; title: string; excerpt: string; featuredImage?: string }) => {
  const url = encodeURIComponent(generateShareUrl(post.id));
  const title = encodeURIComponent(post.title);
  const description = encodeURIComponent(post.excerpt);
  
  // Facebook Sharer URL with better parameters
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${title}%20-%20${description}`;
  
  window.open(facebookUrl, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes');
};

export const shareToTelegram = (post: { id: string; title: string; excerpt: string }) => {
  const url = encodeURIComponent(generateShareUrl(post.id));
  const text = encodeURIComponent(`${post.title}\n\n${post.excerpt}`);
  
  const telegramUrl = `https://t.me/share/url?url=${url}&text=${text}`;
  
  window.open(telegramUrl, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes');
};

export const shareToTwitter = (post: { id: string; title: string; excerpt: string }) => {
  const url = encodeURIComponent(generateShareUrl(post.id));
  const text = encodeURIComponent(`${post.title}\n\n${post.excerpt}`);
  
  const twitterUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}&via=zaplanjske_price`;
  
  window.open(twitterUrl, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes');
};

export const shareGeneral = async (post: { id: string; title: string; excerpt: string }) => {
  const url = generateShareUrl(post.id);
  
  if (navigator.share) {
    try {
      await navigator.share({
        title: post.title,
        text: post.excerpt,
        url: url
      });
    } catch (error) {
      console.log('Error sharing:', error);
      // Fallback to clipboard
      fallbackToClipboard(url);
    }
  } else {
    fallbackToClipboard(url);
  }
};

const fallbackToClipboard = (url: string) => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(url).then(() => {
      alert('Линк је копиран у клипборд!');
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Линк је копиран у клипборд!');
    });
  }
};

// Function to update meta tags for better social sharing
export const updateMetaTagsForPost = (post: { 
  id: string; 
  title: string; 
  excerpt: string; 
  featuredImage?: string;
  authorId: string;
  category: string;
  tags: string[];
  publishedAt?: string;
  updatedAt: string;
}) => {
  // Remove existing dynamic meta tags
  const existingMetaTags = document.querySelectorAll('meta[data-dynamic="true"]');
  existingMetaTags.forEach(tag => tag.remove());
  
  const url = generateShareUrl(post.id);
  const imageUrl = post.featuredImage || 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&dpr=1';
  
  const metaTags = [
    // Open Graph tags
    { property: 'og:title', content: post.title },
    { property: 'og:description', content: post.excerpt },
    { property: 'og:type', content: 'article' },
    { property: 'og:url', content: url },
    { property: 'og:site_name', content: 'Заплањске приче' },
    { property: 'og:locale', content: 'sr_RS' },
    { property: 'og:image', content: imageUrl },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:image:alt', content: post.title },
    
    // Article specific tags
    { property: 'article:published_time', content: post.publishedAt || post.updatedAt },
    { property: 'article:modified_time', content: post.updatedAt },
    { property: 'article:section', content: post.category },
    
    // Twitter Card tags
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:site', content: '@zaplanjske_price' },
    { name: 'twitter:title', content: post.title },
    { name: 'twitter:description', content: post.excerpt },
    { name: 'twitter:image', content: imageUrl },
    { name: 'twitter:image:alt', content: post.title },
    
    // General meta tags
    { name: 'description', content: post.excerpt }
  ];
  
  // Add tags for each post tag
  post.tags.forEach(tag => {
    metaTags.push({ property: 'article:tag', content: tag });
  });
  
  // Create and append meta tags
  metaTags.forEach(({ property, name, content }) => {
    const meta = document.createElement('meta');
    meta.setAttribute('data-dynamic', 'true');
    if (property) meta.setAttribute('property', property);
    if (name) meta.setAttribute('name', name);
    meta.setAttribute('content', content);
    document.head.appendChild(meta);
  });
  
  // Update page title
  document.title = `${post.title} - Заплањске приче`;
};