const chai = require('chai'); // Import chai using require syntax
const { shortenUrl } = require('./urlShortener');
const expect = chai.expect; // Use chai.expect instead of just expect

describe('URL Shortener', () => {
    it('should return a shortened URL', () => {
        const originalUrl = 'https://example.com';
        const shortUrl = shortenUrl(originalUrl);
        expect(shortUrl).to.be.a('string');
    });

    it('should return unique shortened URLs', () => {
        const url1 = 'https://example.com';
        const url2 = 'https://example.org';
        const shortUrl1 = shortenUrl(url1);
        const shortUrl2 = shortenUrl(url2);
        expect(shortUrl1).to.not.equal(shortUrl2);
    });

    it('should handle invalid URLs gracefully', () => {
        const invalidUrl = 'not_a_valid_url';
        const shortUrl = shortenUrl(invalidUrl);
        expect(shortUrl).to.be.null;
    });
});


