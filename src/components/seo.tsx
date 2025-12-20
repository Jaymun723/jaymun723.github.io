/**
 * SEO component that queries for data with
 * Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.com/docs/how-to/querying-data/use-static-query/
 */

import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"

interface SeoProps {
  description?: string
  title: string
  children?: React.ReactNode
  image?: string
  keywords?: string[]
}

interface SeoQueryData {
  site: {
    siteMetadata: {
      title: string
      description: string
      siteUrl: string
    }
  }
}

const Seo: React.FC<SeoProps> = ({ description, title, children, image, keywords }) => {
  const { site } = useStaticQuery<SeoQueryData>(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            siteUrl
          }
        }
      }
    `
  )

  const metaDescription = description || site.siteMetadata.description
  const defaultTitle = site.siteMetadata?.title
  const defaultImage = site.siteMetadata?.siteUrl + "/icons/icon-512x512.png" // Fallback (from manifest)
  const metaImage = image ? `${site.siteMetadata.siteUrl}${image}` : defaultImage

  return (
    <>
      <title>{defaultTitle ? `${title} | ${defaultTitle}` : title}</title>
      <meta name="description" content={metaDescription} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={metaImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />
      {keywords && keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(`, `)} />
      )}
      <meta name="google-site-verification" content="npsUDOkYbYTRzJJ51azKuXWgFiOC_5jLSibjtdo5COk" />
      {children}
    </>
  )
}

export default Seo
