export async function uploadImageToImgBB(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64Data = reader.result as string;

        // Try backend proxy API route first
        try {
          const res = await fetch('/api/upload-image', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image: base64Data }),
          });

          if (res.ok) {
            const data = await res.json();
            if (data && data.success && data.url) {
              return resolve(data.url);
            }
          }
        } catch (backendError) {
          console.warn('Backend proxy upload failed, attempting direct upload to ImgBB:', backendError);
        }

        // Direct client fallback to ImgBB API
        const cleanBase64 = base64Data.includes(',') ? base64Data.split(',')[1] : base64Data;
        const formData = new FormData();
        formData.append('image', cleanBase64);

        const directRes = await fetch('https://api.imgbb.com/1/upload?key=3601399f318b007db7c3a8fdf499d8d0', {
          method: 'POST',
          body: formData,
        });

        const directData = await directRes.json();
        if (directData && directData.success && directData.data && (directData.data.url || directData.data.display_url)) {
          return resolve(directData.data.url || directData.data.display_url);
        } else {
          throw new Error(directData?.error?.message || 'ছবি আপলোড সফল হয়নি।');
        }
      } catch (err: any) {
        reject(err?.message || 'ছবি আপলোডকালে ত্রুটি ঘটেছে।');
      }
    };
    reader.onerror = () => reject('ফাইল পড়ার সময় ত্রুটি ঘটেছে।');
    reader.readAsDataURL(file);
  });
}
