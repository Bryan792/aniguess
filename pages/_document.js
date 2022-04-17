// _document.js
import Document, { Html, Head, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head />
        <body>
          <Main />
          <NextScript />
          <script
            async
            defer
            data-website-id="934eb586-73f2-448b-873d-50d01acef07c"
            src="https://tracking.bryanching.net/unagi.js"
          ></script>
        </body>
      </Html>
    )
  }
}
