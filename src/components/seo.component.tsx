import Head from "next/head";

interface ISEOProps {
  title: string;
  description?: string;
}

const SEO = ({ title, description }: ISEOProps) => {
  const titleTemplate = title + " | Mandar Cocoa";
  return (
    <div>
      <Head>
        {/* Icon Logo */}
        <link rel="icon logo" href="/src/pages/favicon.ico"></link>

        {/* Stardard metadata tags */}
        <title>{titleTemplate}</title>
        <meta name="decsription" content={description}></meta>
      </Head>
    </div>
  );
};

export default SEO;
