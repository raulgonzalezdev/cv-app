import Document, { Head, Html, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html lang="pt-br">
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <meta charSet="utf-8" />
          <meta
            name="description"
            content="Aplicação para criar projetos em Python"
          />
          <meta name="author" content="CoCriar" />
          <meta
            name="keywords"
            content="projetos, python, criar projetos, aplicação, desenvolvimento, software, programação"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
