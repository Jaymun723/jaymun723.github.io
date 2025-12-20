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
  pathname?: string
}

interface SeoQueryData {
  site: {
    siteMetadata: {
      title: string
      description: string
      siteUrl: string
      social: {
        github: string
      }
    }
  }
}

const Seo: React.FC<SeoProps> = ({ description, title, children, image, keywords, pathname }) => {
  const { site } = useStaticQuery<SeoQueryData>(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            siteUrl
            social {
              github
            }
          }
        }
      }
    `
  )

  const metaDescription = description || site.siteMetadata.description
  const siteUrl = site.siteMetadata.siteUrl.replace(/\/$/, "")
  const canonical = pathname ? `${siteUrl}${pathname}` : siteUrl
  const defaultTitle = site.siteMetadata?.title
  const defaultImage = `${siteUrl}/icons/icon-512x512.png`
  const metaImage = image ? `${siteUrl}${image}` : defaultImage

  return (
    <>
      <title>{defaultTitle ? `${title} | ${defaultTitle}` : title}</title>
      <meta name="description" content={metaDescription} />
      <link rel="canonical" href={canonical} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:image:alt" content={description || title} />
      <meta property="og:site_name" content={defaultTitle} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonical} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />
      {site.siteMetadata.social?.github && (
        <meta name="twitter:creator" content={site.siteMetadata.social.github} />
      )}

      {keywords && keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(`, `)} />
      )}
      <meta name="google-site-verification" content="npsUDOkYbYTRzJJ51azKuXWgFiOC_5jLSibjtdo5COk" />
      {children}
    </>
  )
}

export default Seo
