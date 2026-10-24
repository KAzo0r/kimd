/**
 * AI Product Image Generation and Upload Service
 */

// Category style curated fallbacks in case generation is offline
export const categoryFallbacks = {
  smartphones: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=800&auto=format&fit=crop',
  laptops: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop',
  audio: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop',
  wearables: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop',
  accessories: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?q=80&w=800&auto=format&fit=crop',
};

/**
 * Generate product image via backend AI service
 */
export const requestAiProductImage = async ({ name, category, brand, description }) => {
  try {
    const res = await fetch('/api/generate-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, category, brand, description }),
    });

    const data = await res.json();
    if (data.ok && data.url) {
      return { success: true, url: data.url, prompt: data.prompt };
    }

    // Direct fallback to Pollinations if backend response was empty
    const seed = Math.floor(Math.random() * 1000000);
    const prompt = `Professional product photo of ${brand ? brand + ' ' : ''}${name || 'gadget'}, clean studio lighting, 8k resolution`;
    const fallbackUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=800&height=800&seed=${seed}&nologo=true&enhance=true`;
    return { success: true, url: fallbackUrl, prompt };
  } catch (err) {
    console.warn('AI Image Generation network error, using category default:', err);
    return {
      success: true,
      url: categoryFallbacks[category] || categoryFallbacks.smartphones,
      isFallback: true
    };
  }
};

/**
 * Convert user uploaded file to Base64 Data URL for instant preview & storage
 */
export const readUploadedFileAsDataUrl = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) return reject(new Error('No file selected'));
    if (!file.type.startsWith('image/')) {
      return reject(new Error('Selected file must be an image'));
    }

    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};
