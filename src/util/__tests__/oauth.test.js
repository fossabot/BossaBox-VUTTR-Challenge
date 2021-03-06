//* Importing dependencies
const oauth = require('../oauth')

//* Testing function authURL of each OAuth service
describe('each OAuth authURL()', () => {
  //* Setting a common host to emulate a real environment
  const host = 'random.url'
  test('GitHub', () => {
    //* Expected URL output
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_PUBLIC}&redirect_uri=${encodeURIComponent(`http://${host}/OAuth/GitHub`)}`

    //* Testing result
    expect(oauth.GitHub.authURL(host)).toBe(authUrl)
  })
})

//* Testing function getIdentifier of each OAuth service forcing error
// It's impossible to test if getIdentifier is completly functional because it isn't possible to create a real OAuth token
describe('force error getIdentifier()', () => {
  test('GitHub', async () => {
    //* 20 is the common syntax, however it doesn't matter, the result is the same with any length
    // So, to test as much as possible, trying with different lengths randomly generated too
    const numOfChar = [20, global.getRandomArbitrary(1, 19), global.getRandomArbitrary(21, 40)]

    //* Try with each length
    await numOfChar.forEach(async (num) => {
      //* Executing the function
      const res = await oauth.GitHub.getIdentifier({ code: `${global.randomSecret(num)}` })

      //* Testing result with expected responses
      expect(res.err).toEqual({
        code: 400,
        message: 'The code passed is incorrect or expired.'
      })

      expect(res.identifier).toBeUndefined()
    })

    //* Executing the function
    const res = await oauth.GitHub.getIdentifier({})

    //* Testing result with expected responses
    expect(res.err).toEqual({
      code: 400,
      message: 'Code parameter missing.'
    })

    expect(res.identifier).toBeUndefined()
  })
})
