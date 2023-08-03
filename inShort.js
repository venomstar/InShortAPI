const axios = require('axios');
const cheerio = require('cheerio');

function cleanText(text) {
  return text.replace(/\n/g, '').trim();
}

function getNews(category) {
  const newsDictionary = {
    success: true,
    category: category,
    data: [],
  };

  return axios
    .get(`https://www.inshorts.com/en/read/${category}`)
    .then((response) => {
      const htmlBody = response.data;
      const $ = cheerio.load(htmlBody);
      const newsCards = $('.news-card');

      if (newsCards.length === 0) {
        newsDictionary.success = false;
        newsDictionary.errorMessage = 'Invalid Category';
        return newsDictionary;
      }

      newsCards.each((index, card) => {
        const title = cleanText($(card).find('.news-card-title a').text()) || null;
        const imageUrl =
          $(card).find('.news-card-image').attr('style').split("'")[1] || null;
        const url =
          'https://www.inshorts.com' +
          $(card).find('.news-card-title a').attr('href');
        const content = cleanText($(card).find('.news-card-content div').text()) || null;
        const author = $(card).find('.author').text() || null;
        const date = $(card).find('.date').text() || null;
        const time = $(card).find('.time').text() || null;
        const readMoreUrl =
          $(card).find('.read-more a').attr('href') || null;

        const newsObject = {
          title: title,
          imageUrl: imageUrl,
          url: url,
          content: content,
          author: author,
          date: date,
          time: time,
          readMoreUrl: readMoreUrl,
        };

        newsDictionary.data.push(newsObject);
      });

      return newsDictionary;
    })
    .catch((error) => {
      newsDictionary.success = false;
      newsDictionary.errorMessage = error.message;
      return newsDictionary;
    });
}


  module.exports = getNews;