import axios from 'axios';

export const translateText = async (text, sourceLang = 'en', targetLang = 'ta') => {
  try {
    const response = await axios.get(
      'https://api.mymemory.translated.net/get',
      {
        params: {
          q: text,
          langpair: `${sourceLang}|${targetLang}`,
        },
      }
    );
    console.log(response.data);
    
    return response.data.responseData.translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    return 'Translation failed';
  }
};
